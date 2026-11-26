/* Analytics engine v1 — pure calculations; no DOM, storage or mutation. */
(function(root){
'use strict';
const VERSION='1.0.0';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const finite=n=>Number.isFinite(Number(n));
function calculateDay(input){
 const plans=Array.isArray(input&&input.plans)?input.plans:[];
 const sessions=Array.isArray(input&&input.sessions)?input.sessions:[];
 const completions=input&&input.completions&&typeof input.completions==='object'?input.completions:{};
 const excluded=new Set(Array.isArray(input&&input.excludedPartIds)?input.excludedPartIds:[]);
 const seen=new Set(),actualByPart=new Map();
 for(const x of sessions){
  if(!x||typeof x.id!=='string'||seen.has(x.id)||excluded.has(x.partId))continue;
  seen.add(x.id);
  const sec=Number(x.seconds);
  if(!finite(sec)||sec<=0)continue;
  actualByPart.set(x.partId,(actualByPart.get(x.partId)||0)+sec/60);
 }
 const eligible=plans.filter(p=>p&&p.subjectId&&!excluded.has(p.id)&&p.included!==false&&finite(p.plannedMinutes)&&Number(p.plannedMinutes)>0);
 if(!eligible.length)return {status:'no-data',score:null,components:{time:null,adherence:null,discipline:null},eligibleParts:0,actualMinutes:0,plannedMinutes:0,formulaVersion:1};
 let capped=0,planned=0,adherence=0,discipline=0,disciplineCount=0,actualTotal=0;
 const details=[];
 for(const p of eligible){
  const target=Number(p.plannedMinutes),actual=actualByPart.get(p.id)||0;
  const used=Math.min(actual,target);
  planned+=target;capped+=used;actualTotal+=actual;
  const status=completions[p.id]||p.status||'';
  const completion=status==='completed'?100:status==='partial'?clamp(actual/target*100,0,100):0;
  adherence+=completion;
  let late=null;
  if(finite(p.plannedStart)&&finite(p.actualStart)){
   const delta=Math.max(0,Number(p.actualStart)-Number(p.plannedStart));
   late=delta<=15?100:delta>=60?0:(60-delta)/(60-15)*100;
   discipline+=late;disciplineCount++;
  }
  details.push({partId:p.id,plannedMinutes:target,actualMinutes:actual,cappedMinutes:used,adherence:completion,lateScore:late});
 }
 const T=planned?100*capped/planned:0;
 const A=eligible.length?adherence/eligible.length:0;
 const N=disciplineCount?discipline/disciplineCount:null;
 let score,weights;
 if(N===null){weights={time:2/3,adherence:1/3,discipline:0};score=weights.time*T+weights.adherence*A}
 else{weights={time:.4,adherence:.4,discipline:.2};score=.4*T+.4*A+.2*N}
 return {status:'scored',score:clamp(score,0,100),components:{time:T,adherence:A,discipline:N},weights,eligibleParts:eligible.length,plannedMinutes:planned,actualMinutes:actualTotal,cappedMinutes:capped,disciplineParts:disciplineCount,details,formulaVersion:1};
}
function aggregateDays(days){
 const valid=(Array.isArray(days)?days:[]).filter(d=>d&&d.status==='scored'&&finite(d.score));
 return {days:valid.length,average:valid.length?valid.reduce((s,d)=>s+d.score,0)/valid.length:null,plannedDays:(Array.isArray(days)?days:[]).filter(d=>d&&d.status==='scored').length};
}
function diagnostics(){
 const tests=[];
 const check=(name,fn)=>{try{const r=fn();tests.push({name,ok:r===true,detail:r===true?'':String(r)})}catch(e){tests.push({name,ok:false,detail:String(e&&e.message||e)})}};
 const calc=(plans,sessions,completions,excludedPartIds=[])=>calculateDay({plans,sessions,completions,excludedPartIds});
 check('no plan returns no-data',()=>calc([],[]).status==='no-data');
 check('blank subject is excluded',()=>calc([{id:'x',subjectId:'',plannedMinutes:60}],[]).status==='no-data');
 check('time is capped at planned minutes',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60}], [{id:'s',partId:'x',seconds:7200}],{x:'completed'}).components.time===100);
 check('partial adherence follows actual fraction',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:120}], [{id:'s',partId:'x',seconds:3600}],{x:'partial'}).components.adherence===50);
 check('completion can be full when ended early',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:120}], [{id:'s',partId:'x',seconds:3600}],{x:'completed'}).components.adherence===100);
 check('late start gets full credit through 15m',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:495}],[]).components.discipline===100);
 check('late score reaches zero at 60m',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60,plannedStart:480,actualStart:540}],[]).components.discipline===0);
 check('missing start redistributes weights',()=>{const r=calc([{id:'x',subjectId:'bio',plannedMinutes:60}], [{id:'s',partId:'x',seconds:1800}],{x:'partial'});return Math.abs(r.score-50)<1e-9&&r.components.discipline===null});
 check('duplicate session ids are ignored',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60}], [{id:'s',partId:'x',seconds:1800},{id:'s',partId:'x',seconds:1800}],{x:'partial'}).actualMinutes===30);
 check('excluded parts do not enter denominator',()=>calc([{id:'x',subjectId:'bio',plannedMinutes:60},{id:'y',subjectId:'chem',plannedMinutes:60}], [{id:'s',partId:'x',seconds:3600}],{x:'completed'},{y:true}).eligibleParts===1);
 return {engineVersion:VERSION,formulaVersion:1,total:tests.length,passed:tests.filter(t=>t.ok).length,failed:tests.filter(t=>!t.ok),tests};
}
root.StudyAnalytics={VERSION,calculateDay,aggregateDays,diagnostics};
})(typeof globalThis!=='undefined'?globalThis:this);
