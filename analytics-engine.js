/* Study analytics engine. Pure, deterministic, versioned calculation module. */
(function(root){
'use strict';
const VERSION='1.1.0',FORMULA_VERSION=1;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const finite=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
function isISODate(value){
 if(typeof value!=='string'||! /^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const [y,m,d]=value.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));
 return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;
}
function calculateDay(input){
 const plans=Array.isArray(input?.plans)?input.plans:[];
 const sessions=Array.isArray(input?.sessions)?input.sessions:[];
 const completions=input?.completions&&typeof input.completions==='object'?input.completions:{};
 const excluded=new Set(Array.isArray(input?.excludedPartIds)?input.excludedPartIds:[]);
 const eligible=plans.filter(p=>p&&typeof p.id==='string'&&p.subjectId&& !excluded.has(p.id)&&p.included!==false&&finite(p.plannedMinutes)&&Number(p.plannedMinutes)>0);
 if(!eligible.length)return{status:'no-data',score:null,components:{time:null,adherence:null,discipline:null},eligibleParts:0,actualMinutes:0,plannedMinutes:0,formulaVersion:FORMULA_VERSION};
 const ids=new Set(eligible.map(p=>p.id)),seen=new Set(),actualByPart=new Map();
 for(const x of sessions){
  if(!x||typeof x.id!=='string'||!x.id||seen.has(x.id)||!ids.has(x.partId))continue;
  seen.add(x.id);
  const sec=Number(x.seconds);
  if(!finite(x.seconds)||sec<=0)continue;
  actualByPart.set(x.partId,(actualByPart.get(x.partId)||0)+sec/60);
 }
 let capped=0,planned=0,adherence=0,discipline=0,disciplineCount=0,actualTotal=0;
 const details=[];
 for(const p of eligible){
  const target=Number(p.plannedMinutes),actual=actualByPart.get(p.id)||0,used=Math.min(actual,target);
  planned+=target;capped+=used;actualTotal+=actual;
  const status=completions[p.id]||p.status||'';
  const completion=status==='completed'?100:clamp(actual/target*100,0,100);
  adherence+=completion;
  let late=null;
  if((actual>0||status==='completed'||status==='partial')&&finite(p.plannedStart)&&finite(p.actualStart)){
   const delta=Math.max(0,Number(p.actualStart)-Number(p.plannedStart));
   late=delta<=15?100:delta>=60?0:(60-delta)/45*100;
   discipline+=late;disciplineCount++;
  }
  details.push({partId:p.id,plannedMinutes:target,actualMinutes:actual,cappedMinutes:used,adherence:completion,lateScore:late});
 }
 const T=100*capped/planned,A=adherence/eligible.length,N=disciplineCount?discipline/disciplineCount:null;
 const weights=N===null?{time:2/3,adherence:1/3,discipline:0}:{time:.4,adherence:.4,discipline:.2};
 const score=N===null?weights.time*T+weights.adherence*A:.4*T+.4*A+.2*N;
 return{status:'scored',score:clamp(score,0,100),components:{time:T,adherence:A,discipline:N},weights,eligibleParts:eligible.length,plannedMinutes:planned,actualMinutes:actualTotal,cappedMinutes:capped,disciplineParts:disciplineCount,details,formulaVersion:FORMULA_VERSION};
}
function aggregateDays(days){
 const valid=(Array.isArray(days)?days:[]).filter(d=>d&&d.status==='scored'&&finite(d.score));
 return{days:valid.length,average:valid.length?valid.reduce((s,d)=>s+d.score,0)/valid.length:null};
}
function diagnostics(){
 const tests=[],check=(name,fn)=>{try{const v=fn();tests.push({name,ok:v===true,detail:v===true?'':'نتیجه با مقدار مرجع مطابقت ندارد'})}catch(e){tests.push({name,ok:false,detail:String(e?.message||e)})}};
 const calc=(plans,sessions=[],completions={},excludedPartIds=[])=>calculateDay({plans,sessions,completions,excludedPartIds});
 check('بدون برنامه امتیاز ندارد',()=>calc([]).status==='no-data');
 check('پارت بدون درس حذف می‌شود',()=>calc([{id:'x',subjectId:'',plannedMinutes:60}]).status==='no-data');
 check('زمان بیشتر از برنامه سقف دارد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60}],[{id:'s',partId:'x',seconds:7200}]).components.time===100);
 check('پایبندی پارت ناقص متناسب است',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:120}],[{id:'s',partId:'x',seconds:3600}]).components.adherence===50);
 check('تکمیل زودتر پایبندی کامل دارد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:120}],[{id:'s',partId:'x',seconds:3600}],{x:'completed'}).components.adherence===100);
 check('پارت بدون مطالعه پایبندی صفر دارد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60}]).components.adherence===0);
 check('شروع به‌موقع بدون مطالعه امتیاز مثبت نمی‌سازد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:480}]).score===0);
 check('تأخیر تا ۱۵ دقیقه جریمه ندارد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:495}]).components.discipline===100);
 check('تأخیر ۶۰ دقیقه امتیاز نظم صفر دارد',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:540}]).components.discipline===0);
 check('شروع ثبت‌نشده وزن را بازتوزیع می‌کند',()=>{const x=calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:null}],[{id:'s',partId:'x',seconds:1800}]);return x.components.discipline===null&&Math.abs(x.score-50)<1e-9});
 check('جلسه تکراری دوباره شمرده نمی‌شود',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60}],[{id:'s',partId:'x',seconds:1800},{id:'s',partId:'x',seconds:1800}]).actualMinutes===30);
 check('پارت مستثنا از مخرج حذف می‌شود',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60},{id:'y',subjectId:'chem',plannedMinutes:60}],[{id:'s',partId:'x',seconds:3600}],{},['y']).eligibleParts===1);
 check('زمان پارت‌های مختلف دوباره ترکیب نمی‌شود',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60},{id:'y',subjectId:'chem',plannedMinutes:60}],[{id:'s',partId:'x',seconds:3600}]).details[1].actualMinutes===0);
 check('وزن زمان بر اساس دقیقه برنامه است',()=>Math.abs(calc([{id:'x',subjectId:'bio',plannedMinutes:120},{id:'y',subjectId:'chem',plannedMinutes:60}],[{id:'s',partId:'x',seconds:7200}]).components.time-200/3)<1e-9);
 check('میانگین روزها ساده است',()=>aggregateDays([{status:'scored',score:100},{status:'scored',score:0},{status:'no-data',score:null}]).average===50);
 return{engineVersion:VERSION,formulaVersion:FORMULA_VERSION,total:tests.length,passed:tests.filter(t=>t.ok).length,failed:tests.filter(t=>!t.ok),tests};
}
root.StudyAnalytics={VERSION,FORMULA_VERSION,isISODate,calculateDay,aggregateDays,diagnostics};
})(typeof globalThis!=='undefined'?globalThis:this);
