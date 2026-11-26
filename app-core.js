

document.documentElement.lang='fa';document.documentElement.dir='rtl';
//<dates
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const fn=n=>fa(n).replace('.','٫');
const DAYS=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'],DS=['ش','ی','د','س','چ','پ','ج'];
const MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function g2j(gy,gm,gd){const m=[0,31,59,90,120,151,181,212,243,273,304,334],y2=gm>2?gy+1:gy;let days=355666+365*gy+~~((y2+3)/4)-~~((y2+99)/100)+~~((y2+399)/400)+gd+m[gm-1];let jy=-1595+33*~~(days/12053);days%=12053;jy+=4*~~(days/1461);days%=1461;if(days>365){jy+=~~((days-1)/365);days=(days-1)%365}const jm=days<186?1+~~(days/31):7+~~((days-186)/30),jd=1+(days<186?days%31:(days-186)%30);return[jy,jm,jd]}
function j2g(jy,jm,jd){jy+=1595;let days=-355668+365*jy+~~(jy/33)*8+~~(((jy%33)+3)/4)+jd+(jm<7?(jm-1)*31:(jm-7)*30+186);let gy=400*~~(days/146097);days%=146097;if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++}gy+=4*~~(days/1461);days%=1461;if(days>365){gy+=~~((days-1)/365);days=(days-1)%365}let gd=days+1;const a=[0,31,(gy%4==0&&gy%100!=0)||gy%400==0?29:28,31,30,31,30,31,31,30,31,30,31];let gm;for(gm=0;gm<13;gm++){if(gd<=a[gm])break;gd-=a[gm]}return[gy,gm,gd]}
const p2=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const today=()=>iso(new Date());
const addD=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const diff=(a,b)=>Math.round((parse(a)-parse(b))/864e5);
const wd=s=>(parse(s).getDay()+1)%7;
const J=s=>{const d=parse(s);return g2j(d.getFullYear(),d.getMonth()+1,d.getDate())};
const fj=(s,y)=>{const[a,b,c]=J(s);return fa(c)+' '+MONTHS[b-1]+(y?' '+fa(a):'')};
//>
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const fmin=m=>{m=Math.round(m);const h=~~(m/60),r=m%60;return h?fa(h)+' ساعت'+(r?' و '+fa(r)+' دقیقه':''):fa(r)+' دقیقه'};
const fsec=s=>s>0&&s<60?fa(Math.round(s))+' ثانیه':fmin(Math.round(s/60));
const fh=m=>fa((m/60).toFixed(1).replace(/\.0$/,'')).replace('.','٫');
const ftime=m=>fa(p2(~~(m/60))+':'+p2(m%60)),tm=m=>p2(~~(m/60))+':'+p2(m%60);
const PAL=['#2f9e8f','#e07a5f','#5b7fd1','#c2569b','#d4a017','#6c9a3c','#8e6bd1','#d9534f','#3aa0c8','#7a8591'];
const KEY='planner-v1';
function blank(){return{ts:0,theme:'batman',goal:4,mg:0,yg:0,courses:[],parts:[[],[],[],[],[],[],[]],tpl:{},ov:{},logs:[],timeEntries:[],activeTimer:null,analytics:{schemaVersion:1,formulaVersion:1,plans:{},audit:[],emergencies:[]},timerBg:'',timerDim:48,deskFace:0,fx:true}}
/* اعتبارسنجی داده‌ها (برای جلوگیری از تزریق HTML از بکاپ دستکاری‌شده و خراب‌شدن ساختار) */
const OKID=x=>typeof x==='string'&&/^[\w-]{1,40}$/.test(x)&&!['__proto__','prototype','constructor'].includes(x);
const OKDATE=x=>typeof x==='string'&&StudyAnalytics.isISODate(x);
const OKCOL=x=>typeof x==='string'&&/^#[0-9a-f]{3,8}$/i.test(x);
const cut=(x,n)=>String(x==null?'':x).slice(0,n);
function clean(s){
const arr=a=>Array.isArray(a)?a:[],fin=x=>x!=null&&x!==''&&Number.isFinite(+x);
s.goal=Math.max(.5,Math.min(24,+s.goal||4));s.deskFace=[0,1,2].includes(+s.deskFace)?+s.deskFace:0;s.fx=s.fx!==false;s.timerDim=Math.max(15,Math.min(85,fin(s.timerDim)?+s.timerDim:48));
s.courses=arr(s.courses).filter(c=>c&&OKID(c.id)).map(c=>({id:c.id,name:cut(c.name,100),color:OKCOL(c.color)?c.color:'#7a8591',w:+c.w||3,ic:cut(c.ic,8).replace(/[<>&"'`]/g,''),topics:arr(c.topics).filter(t=>t&&OKID(t.id)).map(t=>({id:t.id,name:cut(t.name,200),w:[1,2,3].includes(+t.w)?+t.w:2,st:[0,1,2].includes(+t.st)?+t.st:0}))}));
s.parts=s.parts.map(a=>arr(a).filter(p=>p&&OKID(p.id)&&fin(p.s)&&fin(p.e)&&+p.s>=0&&+p.e<=1440&&+p.e>+p.s).map(p=>({id:p.id,name:cut(p.name,60),s:+p.s,e:+p.e})));
const pids=new Set(s.parts.flat().map(p=>p.id)),cids=new Set(s.courses.map(c=>c.id)),as=v=>({c:v.c,tp:OKID(v.tp)?v.tp:'',n:cut(v.n,300)});
const tpl={};Object.keys(s.tpl||{}).forEach(k=>{const v=s.tpl[k];if(pids.has(k)&&v&&cids.has(v.c))tpl[k]=as(v)});s.tpl=tpl;
const ov={};Object.keys(s.ov||{}).forEach(k=>{const[d,p]=k.split('|');if(!OKDATE(d)||!pids.has(p))return;const v=s.ov[k];ov[k]=v&&cids.has(v.c)?as(v):0});s.ov=ov;
s.logs=arr(s.logs).filter(l=>l&&OKID(l.id)&&OKDATE(l.date)&&fin(l.min)).map(l=>{const o={id:l.id,date:l.date,c:OKID(l.c)?l.c:'',tp:OKID(l.tp)?l.tp:'',min:+l.min,src:cut(l.src,20)};if(OKID(l.part))o.part=l.part;if(fin(l.h))o.h=+l.h;if(l.mode==='actual'||l.mode==='full')o.mode=l.mode;return o});
s.timeEntries=arr(s.timeEntries).filter(x=>x&&OKID(x.id)&&OKDATE(x.date)&&OKID(x.part)&&fin(x.seconds)&&+x.seconds>0).map(x=>({id:x.id,date:x.date,part:x.part,seconds:+x.seconds,method:x.method=='timer'?'timer':'manual',createdAt:+x.createdAt||0,logId:OKID(x.logId)?x.logId:''}));
const t=s.activeTimer;
if(t&&OKID(t.part)&&OKDATE(t.date)){const sa=fin(t.startedAt)&&+t.startedAt>0?+t.startedAt:null;s.activeTimer={date:t.date,part:t.part,elapsedSec:Math.max(0,+t.elapsedSec||0),startedAt:t.running&&sa?sa:null,running:!!t.running&&!!sa,h:fin(t.h)?+t.h:null}}else s.activeTimer=null;
s.analytics=s.analytics&&typeof s.analytics==='object'?s.analytics:{schemaVersion:1,formulaVersion:1,plans:{},audit:[]};s.analytics.schemaVersion=1;s.analytics.formulaVersion=1;s.analytics.plans=s.analytics.plans&&typeof s.analytics.plans==='object'?s.analytics.plans:{};s.analytics.audit=Array.isArray(s.analytics.audit)?s.analytics.audit.slice(-500):[];s.analytics.emergencies=Array.isArray(s.analytics.emergencies)?s.analytics.emergencies.slice(-100).map(e=>({id:OKID(e.id)?e.id:'',from:OKDATE(e.from)?e.from:'',to:OKDATE(e.to)?e.to:'',reason:cut(e.reason,200),createdAt:+e.createdAt||0,canceledAt:+e.canceledAt||0,parts:Array.isArray(e.parts)?e.parts.filter(p=>p&&OKDATE(p.date)&&OKID(p.partId)).map(p=>({date:p.date,partId:p.partId,...(typeof p.wasIncluded==='boolean'?{wasIncluded:p.wasIncluded}:{})})):[]})).filter(e=>e.id&&e.from&&e.to):[];Object.keys(s.analytics.plans).forEach(d=>{if(!StudyAnalytics.isISODate(d)||!Array.isArray(s.analytics.plans[d])){delete s.analytics.plans[d];return}s.analytics.plans[d]=s.analytics.plans[d].filter(p=>p&&OKID(p.id)).map(p=>({id:p.id,name:cut(p.name,60),subjectId:OKID(p.subjectId)?p.subjectId:'',plannedMinutes:Math.max(0,Math.min(1440,+p.plannedMinutes||0)),plannedStart:fin(p.plannedStart)?+p.plannedStart:null,actualStart:fin(p.actualStart)?+p.actualStart:null,included:p.included!==false,emergencyId:OKID(p.emergencyId)?p.emergencyId:'',kind:p.kind==='unscheduled'?'unscheduled':'scheduled',deleted:!!p.deleted,reconstructed:!!p.reconstructed||s.analytics.audit.some(e=>e&&e.type==='historical-snapshot-backfilled'&&e.date===d),lastProposed:p.lastProposed&&typeof p.lastProposed==='object'?{name:cut(p.lastProposed.name,60),plannedMinutes:+p.lastProposed.plannedMinutes||0,plannedStart:fin(p.lastProposed.plannedStart)?+p.lastProposed.plannedStart:null}:null,status:['completed','partial'].includes(p.status)?p.status:''}))});s.timerBg=typeof s.timerBg==='string'&&/^data:image\/(?:png|jpeg|webp);base64,/i.test(s.timerBg)?s.timerBg:'';
return s}
function norm(o){const s=blank();if(o&&typeof o==='object'&&!Array.isArray(o))Object.keys(o).forEach(k=>{if(!['__proto__','prototype','constructor'].includes(k))s[k]=o[k]});const themeIds=['spider','batman','super','cyber','aurora','galaxy','synth','ocean','emerald','crimson','violet','gold','arctic','matrix','graphite'];if(!themeIds.includes(s.theme))s.theme=s.theme==='night'?'ocean':s.theme==='dark'?'graphite':'batman';if(!Array.isArray(s.parts)||s.parts.length!=7)s.parts=[[],[],[],[],[],[],[]];if(!Array.isArray(s.timeEntries))s.timeEntries=[];if(s.activeTimer&&!s.activeTimer.running&&!(+s.activeTimer.elapsedSec>0))s.activeTimer=null;if(s.blocks){s.blocks.forEach(b=>{const p={id:uid(),name:'پارت '+fa(s.parts[b.day].length+1),s:b.s,e:b.e};s.parts[b.day].push(p);s.tpl[p.id]={c:b.c,tp:b.tp||'',n:b.n||''}});delete s.blocks}return clean(s)}
let S=(()=>{try{const j=localStorage.getItem(KEY);if(j)return norm(JSON.parse(j))}catch(e){}return norm()})();
let pt,SY='local',ref=null,pushing=false,pend=false;
const SYT={local:'ذخیره روی همین دستگاه',ok:'ذخیره‌شده روی حساب',err:'همگام‌سازی با حساب ممکن نشد'};
function syncState(s){SY=s;const e=$('#sync');if(e)e.textContent=SYT[s]}
function analyticsEnsureActivityDays(){
 if(!S.analytics)return;
 const dates=[...new Set([...(S.logs||[]).map(x=>x.date),...(S.timeEntries||[]).map(x=>x.date)])]
  .filter(d=>StudyAnalytics.isISODate(d)&&d<=today()).sort();
 for(const date of dates){
  if(Array.isArray(S.analytics.plans?.[date]))continue;
  if(!(S.analytics.audit||[]).some(e=>e&&e.type==='historical-snapshot-unavailable'&&e.date===date)){
   S.analytics.audit.push({type:'historical-snapshot-unavailable',date,at:Date.now(),source:'no-immutable-plan-snapshot'});
  }
 }
 S.analytics.audit=(S.analytics.audit||[]).slice(-500);
}
let STORAGE_ERR=false;
function save(initial=false){if(typeof analyticsEnsureDay==='function'){analyticsEnsureDay(today());analyticsEnsureActivityDays()}if(!initial)S.ts=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));STORAGE_ERR=false}catch(e){STORAGE_ERR=true;console.warn('Local planner save failed:',e)}try{const o=JSON.parse(localStorage.getItem('planner-v1-autobk')||'null');if(S.courses.length&&(!o||Date.now()-o.ts>3*864e5))localStorage.setItem('planner-v1-autobk',JSON.stringify({ts:Date.now(),json:JSON.stringify(S)}))}catch(e){console.warn('Local auto-backup failed:',e)}if(!initial){clearTimeout(pt);pt=setTimeout(push,1500)}}
let TIMER_BG_URL='',TIMER_BG_DB=null,TIMER_DRAFT=null;
function bgDB(){return new Promise((resolve,reject)=>{if(TIMER_BG_DB)return resolve(TIMER_BG_DB);if(!('indexedDB'in window))return reject(Error('IndexedDB در این مرورگر در دسترس نیست.'));const q=indexedDB.open('study-planner-assets',1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('images'))q.result.createObjectStore('images')};q.onsuccess=()=>{TIMER_BG_DB=q.result;resolve(TIMER_BG_DB)};q.onerror=()=>reject(q.error||Error('خطا در باز کردن فضای تصویر'))})}
async function blobDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(blob)})}
async function putTimerBg(blob){try{const db=await bgDB();await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(blob,'timer-background');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('ذخیره تصویر انجام نشد'))})}catch(e){const data=await blobDataURL(blob);localStorage.setItem('planner-timer-background',data)}}
async function getTimerBg(){try{const db=await bgDB();const b=await new Promise((resolve,reject)=>{const q=db.transaction('images','readonly').objectStore('images').get('timer-background');q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)});if(b)return b}catch(e){}const data=localStorage.getItem('planner-timer-background');if(data&&/^data:image\/(?:png|jpeg|webp);base64,/i.test(data)){const r=await fetch(data);return await r.blob()}return null}
async function removeTimerBg(){try{const db=await bgDB();await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').delete('timer-background');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch(e){}try{localStorage.removeItem('planner-timer-background')}catch(e){}TIMER_BG_URL=''}
async function loadTimerBg(){try{const blob=await getTimerBg();if(blob){TIMER_BG_URL=await blobDataURL(blob)}else if(S.timerBg&&/^data:image\/(?:png|jpeg|webp);base64,/i.test(S.timerBg)){const old=S.timerBg;const r=await fetch(old);const blob=await r.blob();await putTimerBg(blob);TIMER_BG_URL=await blobDataURL(blob);S.timerBg='';save()} }catch(e){console.warn('Timer background unavailable',e)}if(S.timerBg){S.timerBg='';save()}if(V==='options'&&!TSCREEN)render()}
function compressTimerImage(file){return new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{try{const max=1600,scale=Math.min(1,max/Math.max(img.width,img.height)),w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale)),c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(img,0,0,w,h);c.toBlob(b=>{URL.revokeObjectURL(url);b?resolve(b):reject(Error('فشرده‌سازی تصویر ناموفق بود.'))},'image/webp',.78)}catch(e){URL.revokeObjectURL(url);reject(e)}};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('تصویر قابل خواندن نیست.'))};img.src=url})}
async function uploadTimerBg(file){if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('فقط تصویر PNG، JPG یا WebP پشتیبانی می‌شود.');if(file.size>20*1024*1024)throw Error('حجم تصویر باید کمتر از ۲۰ مگابایت باشد.');const blob=await compressTimerImage(file);await putTimerBg(blob);TIMER_BG_URL=await blobDataURL(blob);S.timerBg='';save();render()}

async function push(){const code=localStorage.getItem('planner-backup-code-v1');if(!code)return;if(pushing){pend=true;return}pushing=true;try{const payload=await encryptBackup(code,JSON.stringify(S));const r=await fetch('/api/backup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw Error('backup '+r.status);const st=$('#cloudstatus');if(st)st.textContent='بکاپ ابری به‌روز است ✓';}catch(e){const st=$('#cloudstatus');if(st)st.textContent='اتصال برقرار نشد؛ بکاپ محلی فعال است';console.warn('Cloud backup:',e)}finally{pushing=false;if(pend){pend=false;push()}}}
const BACKUP_SALT=new TextEncoder().encode('planner-arshia-cloud-backup-v1');
function normCode(v){return String(v||'').toUpperCase().replace(/[^A-F0-9]/g,'')}
async function backupKey(code){const raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(normCode(code)),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:BACKUP_SALT,iterations:180000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function codeId(code){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normCode(code)));return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function bytesToBase64(bytes){let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary)}
async function encryptBackup(code,json){const key=await backupKey(code),iv=crypto.getRandomValues(new Uint8Array(12)),data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(json));return{id:await codeId(code),iv:bytesToBase64(iv),data:bytesToBase64(new Uint8Array(data)),ts:S.ts||Date.now()}}
async function decryptBackup(code,p){const key=await backupKey(code),iv=Uint8Array.from(atob(p.iv),x=>x.charCodeAt(0)),data=Uint8Array.from(atob(p.data),x=>x.charCodeAt(0)),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,data);return new TextDecoder().decode(plain)}
async function restoreCloudBackup(code){const id=await codeId(code),r=await fetch('/api/backup?id='+id);if(r.status===404)throw Error('برای این کد هنوز بکاپی پیدا نشد.');if(!r.ok)throw Error('دریافت بکاپ ناموفق بود.');const p=await r.json(),json=await decryptBackup(code,p),o=JSON.parse(json);if(!o||!Array.isArray(o.courses))throw Error('اطلاعات بکاپ معتبر نیست.');S=norm(o);localStorage.setItem(KEY,JSON.stringify(S));localStorage.setItem('planner-backup-code-v1',normCode(code));save();render();return true}
async function initRemote(){const code=localStorage.getItem('planner-backup-code-v1'),st=$('#cloudstatus');if(!code){if(st)st.textContent='برای فعال‌سازی، کد بازیابی بساز';return}const localTs=+S.ts||0;try{const id=await codeId(code),r=await fetch('/api/backup?id='+id);if(r.status===404){if(S.ts||S.courses.length||S.logs.length||S.timeEntries.length)push();if(st)st.textContent='کد فعال است؛ اولین بکاپ در حال ایجاد است';return}if(!r.ok)throw Error('fetch '+r.status);const p=await r.json(),o=JSON.parse(await decryptBackup(code,p)),remoteTs=+p.ts||0;if(!o||!Array.isArray(o.courses))throw Error('invalid');if(remoteTs>(+S.ts||0)){if((+S.ts||0)!==localTs){await push()}else{S=norm(o);localStorage.setItem(KEY,JSON.stringify(S));render()}}else if((+S.ts||0)>remoteTs){await push()}if(st)st.textContent='بکاپ ابری متصل است ✓';}catch(e){if(st)st.textContent='بکاپ ابری در دسترس نیست؛ کد را بررسی کن';console.warn('Cloud restore:',e)}}
async function initLegacyRemote(){try{const c=window.claude;if(!c||!c.use)return;const[d,u]=await Promise.all([c.use('db'),c.use('user')]);if(!d||!u)return;const id=await u.id();if(!id)return;ref=d.doc('data/users/'+id+'/state');const snap=await ref.get();if(snap.exists){const r=snap.data();if(r.ts>S.ts){const at=S.activeTimer;S=norm(JSON.parse(r.json));if(at&&!S.activeTimer)S.activeTimer=at;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}const ae=document.activeElement,typing=ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);if(!M&&!typing&&!TSCREEN)render()}else if(r.ts<S.ts)push()}else if(S.ts)push();syncState('ok')}catch(e){syncState('err')}}
const C=id=>S.courses.find(c=>c.id==id),cname=id=>id?(C(id)?.name||'درس حذف‌شده'):'بدون درس',ccol=id=>C(id)?.color||'#7a8591',T_=(c,t)=>C(c)?.topics.find(x=>x.id==t);
const ICG=[['ریاضی','📐'],['هندسه','📐'],['فیزیک','⚡'],['شیمی','🧪'],['زیست','🧬'],['ادب','📖'],['عربی','🕌'],['دین','🌙'],['زبان','🌍'],['انگلیسی','🌍'],['زمین','🌋'],['تاریخ','🏛️'],['جغرافیا','🗺️'],['آمار','📊'],['فلسفه','💭'],['منطق','🧩']];
const cic=id=>{const c=C(id);if(!c)return'📚';if(c.ic)return c.ic;const g=ICG.find(x=>c.name.includes(x[0]));return g?g[1]:'📚'};
const courseOpts=sel=>S.courses.map(c=>`<option value="${c.id}"${c.id==sel?' selected':''}>${esc(c.name)}</option>`).join('');
const topicOpts=(c,sel)=>'<option value="">بدون مبحث</option>'+(C(c)?.topics||[]).map(t=>`<option value="${t.id}"${t.id==sel?' selected':''}>${esc(t.name)}</option>`).join('');
const minOn=d=>S.logs.filter(l=>l.date==d).reduce((a,l)=>a+l.min,0);
function streak(){let d=today(),n=0;if(minOn(d)<=0)d=addD(d,-1);while(n<400&&minOn(d)>0){n++;d=addD(d,-1)}return n}
const prog=c=>{let a=0,b=0;c.topics.forEach(p=>{b+=p.w;a+=p.w*(p.st==2?1:p.st==1?.5:0)});return b?Math.round(a/b*100):0};
const dayParts=d=>[...S.parts[wd(d)]].sort((a,b)=>a.s-b.s);
const asg=(d,p)=>{const k=d+'|'+p.id;return k in S.ov?(S.ov[k]||null):(S.tpl[p.id]||null)};
const planOn=d=>dayParts(d).reduce((a,p)=>a+(asg(d,p)?p.e-p.s:0),0);
function analyticsEnsureDay(date){
 const A0=S.analytics||(S.analytics={schemaVersion:1,formulaVersion:1,plans:{},audit:[]}),old=Array.isArray(A0.plans[date])?A0.plans[date]:[];
 const next=dayParts(date).map(p=>{
  const a=asg(date,p),prior=old.find(x=>x.id===p.id),has=S.timeEntries.some(x=>x.date===date&&x.part===p.id)||S.logs.some(x=>x.date===date&&x.part===p.id);
  const proposed={id:p.id,name:p.name,subjectId:a?.c||'',plannedMinutes:p.e-p.s,plannedStart:p.s,actualStart:prior?.actualStart??null,included:prior?.emergencyId?false:!!a,emergencyId:prior?.emergencyId||'',kind:'scheduled',status:doneLog(date,p.id)?'completed':'',createdAt:prior?.createdAt||Date.now()};
  if(prior&&!prior.subjectId&&a?.c&&!has){
   const baseline=date===today()?Math.max(p.s,nowMin()):p.s;
   proposed.plannedStart=baseline;proposed.plannedMinutes=Math.max(0,p.e-baseline);proposed.included=proposed.plannedMinutes>0;
   A0.audit.push({type:'subject-assigned-midday',date,partId:p.id,at:Date.now(),plannedMinutes:proposed.plannedMinutes,baseline});
  }
  if(prior&&has&&!( !prior.subjectId&&a?.c)){
   const changed=prior.plannedMinutes!==proposed.plannedMinutes||prior.plannedStart!==proposed.plannedStart||prior.name!==proposed.name;
   const sameLast=prior.lastProposed&&prior.lastProposed.plannedMinutes===proposed.plannedMinutes&&prior.lastProposed.plannedStart===proposed.plannedStart&&prior.lastProposed.name===proposed.name;
   if(changed&&!sameLast)A0.audit.push({type:'plan-change-after-study',date,partId:p.id,at:Date.now(),before:{name:prior.name,plannedMinutes:prior.plannedMinutes,plannedStart:prior.plannedStart},proposed:{name:proposed.name,plannedMinutes:proposed.plannedMinutes,plannedStart:proposed.plannedStart}});
   if(changed)proposed.lastProposed={name:proposed.name,plannedMinutes:proposed.plannedMinutes,plannedStart:proposed.plannedStart};
   proposed.name=prior.name;proposed.plannedMinutes=prior.plannedMinutes;proposed.plannedStart=prior.plannedStart;
   proposed.actualStart=prior.actualStart;proposed.createdAt=prior.createdAt;
  }
  return proposed;
 });
 old.forEach(p=>{
  if(next.some(x=>x.id===p.id))return;
  const has=S.timeEntries.some(x=>x.date===date&&x.part===p.id)||S.logs.some(x=>x.date===date&&x.part===p.id);
  if(p.kind==='unscheduled'||p.deleted){next.push(p);return}
  if(has){A0.audit.push({type:'part-deleted-after-study',date,partId:p.id,at:Date.now(),previous:{name:p.name,plannedMinutes:p.plannedMinutes}});next.push({...p,included:false,deleted:true})}
 });
 A0.audit=A0.audit.slice(-500);
 A0.plans[date]=next;
 return next;
}
function analyticsAverage(from,to){let sum=0,n=0;for(let d=from;d<=to;d=addD(d,1)){const r=analyticsDay(d);if(r.status==='scored'){sum+=r.score;n++}}return n?sum/n:null}
function analyticsDay(date){
 if(date>today())return {status:'pending',score:null,components:{time:null,adherence:null,discipline:null},formulaVersion:1};
 const plans=Array.isArray(S.analytics?.plans?.[date])?S.analytics.plans[date]:null;
 if(!plans)return {status:'no-data',score:null,components:{time:null,adherence:null,discipline:null},formulaVersion:1};
 if(plans.some(p=>p.reconstructed))return {status:'unverified',score:null,components:{time:null,adherence:null,discipline:null},formulaVersion:1};
 const sessions=S.timeEntries.filter(x=>x.date===date).map(x=>({id:x.id,partId:x.part,seconds:x.seconds}));
 const completions={};plans.forEach(p=>{if(p.status)completions[p.id]=p.status});
 return StudyAnalytics.calculateDay({plans,sessions,completions});
}

const findPart=id=>{for(const a of S.parts){const p=a.find(x=>x.id==id);if(p)return p}return null};
/* فقط لاگِ «انجام شد» (ptick)؛ لاگ‌های تایمر/دستی نشانهٔ انجام‌شدن نیستند */
const doneLog=(d,pid)=>S.logs.find(l=>l.src=='part'&&l.part==pid&&l.date==d);
const partTimeEntries=(d,pid)=>S.timeEntries.filter(x=>x.date==d&&x.part==pid);
const partTimeSeconds=(d,pid)=>partTimeEntries(d,pid).reduce((n,x)=>n+(+x.seconds||0),0);
/* جلوگیری از شمارش دوباره: دقایق لاگ «انجام شد» = طول پارت منهای زمان‌های ثبت‌شده */
function syncPartLog(d,pid){const l=S.logs.find(x=>x.src=='part'&&x.part==pid&&x.date==d),p=findPart(pid);if(!l||!p)return;l.min=l.mode==='actual'?0:Math.max(0,(p.e-p.s)-partTimeSeconds(d,pid)/60)}
const timerSeconds=()=>{const t=S.activeTimer;if(!t)return 0;return Math.max(0,Math.floor((+t.elapsedSec||0)+(t.running&&t.startedAt?(Date.now()-t.startedAt)/1000:0)))};
const clockText=n=>{n=Math.max(0,Math.floor(n));return [~~(n/3600),~~(n%3600/60),n%60].map(x=>String(x).padStart(2,'0')).join(':')};
const timerCourse=()=>{const t=S.activeTimer,p=t&&findPart(t.part),a=t&&p&&asg(t.date,p);return a?cname(a.c):'مطالعه آزاد'};
const noParts=()=>S.parts.every(a=>!a.length);
const purgeCourse=id=>{Object.keys(S.tpl).forEach(k=>{if(S.tpl[k].c==id)delete S.tpl[k]});Object.keys(S.ov).forEach(k=>{if(S.ov[k]&&S.ov[k].c==id)S.ov[k]=0})};
const purgeParts=i=>{S.parts[i].forEach(p=>{delete S.tpl[p.id];Object.keys(S.ov).forEach(k=>{if(k.endsWith('|'+p.id))delete S.ov[k]})})};
function fillParts(){S.parts=S.parts.map(a=>a.length?a:[['پارت ۱',480,600],['پارت ۲',630,750],['پارت ۳',960,1080]].map(([name,s,e])=>({id:uid(),name,s,e})))}
function swapAcross(dA,a,dB,b){const A=asg(dA,findPart(a)),B=asg(dB,findPart(b));S.ov[dA+'|'+a]=B||0;S.ov[dB+'|'+b]=A||0;
const sw=o=>{if(o.date==dA&&o.part==a){o.date=dB;o.part=b}else if(o.date==dB&&o.part==b){o.date=dA;o.part=a}};
S.logs.forEach(sw);S.timeEntries.forEach(sw);
[[dA,a],[dB,b]].forEach(([d,pid])=>{const p=findPart(pid),n=p&&asg(d,p);S.logs.forEach(l=>{if(l.date==d&&l.part==pid){l.c=n?n.c:'';l.tp=n?n.tp:'';if(l.src=='part'||l.src=='manual-time')l.h=~~(p.s/60)}});syncPartLog(d,pid)})}
let M=null,D={},V='home',OC=null,CD=today(),STTAB='normal',ST_FROM=addD(today(),-6),ST_TO=today(),AN_DIAG=null,PS='w',PMo=null,PYr=null,SD=null,SPD=wd(today()),PERR='',PVm='l',TSCREEN=false,WL=null,LT='',ANIM=true,FIRST=true,CEL='',DESK=false,DESKN=0,FOCUS_PID=null;
const err=m=>{const e=$('#merr');if(e)e.textContent=m;return false};
async function wake(){try{if(!WL&&(DESK||(TSCREEN&&S.activeTimer&&S.activeTimer.running))&&navigator.wakeLock){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}}catch(e){WL=null}}
function relWake(){try{if(WL){WL.release();WL=null}}catch(e){WL=null}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){wake();timerUpdate()}});
const modalH=()=>M?`<div class=back data-a=mback><div class="sheet${M.kind=='time'?' time-sheet':''}" role=dialog aria-modal=true><div class=row><h2 class=grow>${M.t}</h2><button class=btn data-a=mclose>بستن</button></div>${M.b}<div id=merr class=err></div><div class=row style="margin-top:12px">${M.s?'<button class="btn p grow" data-a=msave>ذخیره</button>':''}${M.d?`<button class="btn d" data-a=mdel>${M.dl||'حذف'}</button>`:''}</div></div></div>`:'';
const PRESETS={'پایه یازدهم تجربی':[
{n:'ریاضی ۲',t:['فصل ۱: هندسه تحلیلی و جبر','فصل ۲: هندسه','فصل ۳: تابع','فصل ۴: مثلثات','فصل ۵: تابع نمایی و لگاریتم','فصل ۶: حد و پیوستگی','فصل ۷: آمار و احتمال']},
{n:'زیست‌شناسی ۲',t:['فصل ۱: تنظیم عصبی','فصل ۲: حواس','فصل ۳: دستگاه حرکتی','فصل ۴: تنظیم شیمیایی','فصل ۵: ایمنی','فصل ۶: تقسیم یاخته','فصل ۷: تولیدمثل','فصل ۸: تولیدمثل نهاندانگان','فصل ۹: پاسخ گیاهان به محرک‌ها']},
{n:'فیزیک ۲',t:['فصل ۱: الکتریسیته ساکن','فصل ۲: جریان الکتریکی و مدارهای جریان مستقیم','فصل ۳: مغناطیس و القای الکترومغناطیسی']},
{n:'شیمی ۲',t:['فصل ۱: قدر هدایای زمینی را بدانیم','فصل ۲: در پی غذای سالم','فصل ۳: پوشاک، نیازی پایان‌ناپذیر']},
{n:'زبان انگلیسی ۲',t:['درس ۱: Sense of Appreciation','درس ۲: Look it Up!','درس ۳: Renewable Energy']},
{n:'عربی ۲',t:[]},{n:'ادبیات فارسی ۲',t:[]},{n:'دین و زندگی ۲',t:[]},{n:'زمین‌شناسی',t:[]}]};
function presetCard(){return Object.keys(PRESETS).map(k=>{const miss=PRESETS[k].filter(c=>!S.courses.some(x=>x.name==c.n));return miss.length?`<div class=card><h2>درس‌های آماده</h2><p class="muted sm">${k}: ${fa(miss.length)} درس با فصل‌ها یک‌جا اضافه می‌شود.</p><button class="btn p" data-a=preset data-k="${k}">افزودن درس‌های ${k}</button></div>`:''}).join('')}
function coursesV(){if(OC&&C(OC))return courseDetail(C(OC));OC=null;let h='<h1>درس‌ها</h1>'+presetCard()+'<div class=row style="margin-bottom:12px"><button class="btn p" data-a=newc>درس تازه</button></div>';
S.courses.forEach(c=>{const p=prog(c);h+=`<div class=card data-a=opc data-id=${c.id} style="border-inline-start:5px solid ${c.color}"><div class=row><b class=grow>${cic(c.id)} ${esc(c.name)}</b><span class="muted sm">${fa(p)}٪</span></div><div class=bar><i style="width:${p}%;background:${c.color}"></i></div><div class="muted sm">${fa(c.topics.length)} مبحث · ${fa(c.topics.filter(x=>x.st==2).length)} تمام‌شده</div></div>`});
if(!S.courses.length)h+='<div class="card muted">هنوز درسی اضافه نکرده‌ای.</div>';return h}
const STN=['شروع نشده','در حال مطالعه','تمام‌شده'],WN=['کم','متوسط','زیاد'];
function courseDetail(c){const p=prog(c);return`<div class=row style="margin-top:12px"><button class=btn data-a=bc>بازگشت</button><button class=btn data-a=editc data-id=${c.id}>ویرایش درس</button></div><h1 style="color:${c.color}">${cic(c.id)} ${esc(c.name)}</h1><div class=card><div class=row><span class=grow>پیشرفت</span><b>${fa(p)}٪</b></div><div class=bar><i style="width:${p}%;background:${c.color}"></i></div></div><div class=card><h2>مبحث‌ها</h2>${c.topics.map(t=>`<div class=trow><button class="st st${t.st}" data-a=ts data-c=${c.id} data-p=${t.id}>${STN[t.st]}</button><span class=grow>${esc(t.name)}</span><button class=tag data-a=tw data-c=${c.id} data-p=${t.id} style="border:0;cursor:pointer;font:inherit;font-size:12px">اهمیت: ${WN[t.w-1]}</button><button class="btn d" data-a=delt data-c=${c.id} data-p=${t.id} aria-label="حذف مبحث" style="min-height:32px;padding:2px 10px">×</button></div>`).join('')||'<p class=muted>مبحثی نیست.</p>'}<label>افزودن مبحث (هر مبحث در یک خط)</label><textarea id=nt rows=3></textarea><button class="btn p" style="margin-top:8px" data-a=addt data-id=${c.id}>افزودن</button></div>`}
function courseForm(c){const x=c||{name:'',color:PAL[S.courses.length%PAL.length]};M={t:c?'ویرایش درس':'درس تازه',b:`<label>نام درس</label><input id=cn value="${esc(x.name)}"><label>آیکن (ایموجی؛ خالی = خودکار)</label><input id=ci maxlength=8 value="${esc(x.ic||'')}"><div class=row style="margin-top:6px">${['📐','⚡','🧪','🧬','📖','🕌','🌙','🌍','🌋','📊','💡','🎯'].map(e=>`<button type=button class=chip data-a=pickic data-e=${e}>${e}</button>`).join('')}</div><label>رنگ</label><div>${PAL.map(p=>`<label class=sw style="background:${p}"><input type=radio name=cc value=${p}${p==x.color?' checked':''}></label>`).join('')}</div>`,
s(){const n=$('#cn').value.trim();if(!n)return err('نام درس را بنویس.');const o={name:n,ic:$('#ci').value.trim().slice(0,8),color:$('input[name=cc]:checked').value};if(c)Object.assign(c,o);else{const z={id:uid(),topics:[],w:3,...o};S.courses.push(z);OC=z.id}return true},
d:c?()=>{S.courses=S.courses.filter(z=>z!==c);purgeCourse(c.id);OC=null}:null};render()}
function barChart(ds){const mx=Math.max(60,...ds.map(d=>Math.max(d.a,d.p))),h=v=>v/mx*100;return`<svg viewBox="0 0 320 150" class=ch role=img aria-label="ساعت مطالعه در هفت روز گذشته"><line class=gx x1=0 x2=320 y1=120 y2=120 />${ds.map((d,i)=>{const x=8+i*45;return`<rect class=bp x=${x} y=${120-h(d.p)} width=16 height=${h(d.p)} rx=3 /><rect class=ba x=${x+18} y=${120-h(d.a)} width=16 height=${h(d.a)} rx=3 /><text class=tx x=${x+17} y=${116-h(Math.max(d.a,d.p))} text-anchor=middle>${d.a?fh(d.a):''}</text><text class=tx x=${x+17} y=136 text-anchor=middle>${DS[d.w]}</text>`}).join('')}</svg>`}
const lstreak=()=>{const a=[...new Set(S.logs.filter(l=>l.min>0).map(l=>l.date))].sort();let b=0,r=0;a.forEach((d,i)=>{r=i&&diff(d,a[i-1])==1?r+1:1;b=Math.max(b,r)});return b};
const jml=(y,m)=>m<7?31:m<12?30:(g2j(...j2g(y,12,30))[1]==12?30:29);
const isoJ=(y,m,d)=>{const g=j2g(y,m,d);return g[0]+'-'+p2(g[1])+'-'+p2(g[2])};
const rangeMin=(a,b)=>S.logs.filter(l=>l.date>=a&&l.date<=b).reduce((s,l)=>s+l.min,0);
const monthMin=(y,m)=>rangeMin(isoJ(y,m,1),isoJ(y,m,jml(y,m))),yearMin=y=>rangeMin(isoJ(y,1,1),isoJ(y,12,jml(y,12)));
const yearDays=y=>Array.from({length:12},(_,i)=>jml(y,i+1)).reduce((a,b)=>a+b,0);
const goalTargets=()=>({daily:0,monthly:0,yearly:0,monthDays:0,yearDays:0});
const gbar=()=>'';
const weakest=()=>{if(S.courses.length<2)return null;const t=today(),r=S.courses.map(c=>({c,m:S.logs.filter(l=>l.c==c.id&&diff(t,l.date)>=0&&diff(t,l.date)<7).reduce((a,l)=>a+l.min,0)})).sort((a,b)=>a.m-b.m);return r[0].m<r[r.length-1].m?r[0]:null};
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const ICONS={home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',plan:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',courses:'<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4zM5 17a3 3 0 013-3h11"/>',stats:'<path d="M5 20V10M12 20V4M19 20v-7"/>',options:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'};
const navH0=v=>`<div>${[['home','خانه'],['plan','برنامه'],['courses','درس‌ها'],['stats','آمار'],['options','تنظیمات']].map(([k,n])=>`<button class="${v==k?'on':''}" data-a=go data-v=${k}><svg viewBox="0 0 24 24" width=22 height=22 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>${ICONS[k]}</svg><span>${n}</span></button>`).join('')}</div>`;
const navH=v=>{const h=navH0(v),k='</button>',i=h.indexOf(k,h.indexOf(k)+1)+k.length;return h.slice(0,i)+'<button class=navgo data-a=quickStart aria-label="شروع مطالعه">'+ico('play',26)+'</button>'+h.slice(i)};
function ring(p,txt){const c=2*Math.PI*44,o=c*(1-Math.min(1,p));return`<svg viewBox="0 0 100 100" width=92 height=92 style="direction:ltr" aria-hidden=true><circle cx=50 cy=50 r=44 fill=none stroke="currentColor" stroke-opacity=.25 stroke-width=8 /><circle cx=50 cy=50 r=44 fill=none stroke="currentColor" stroke-width=8 stroke-linecap=round class=rg style="--c:${c}" stroke-dasharray="${c}" stroke-dashoffset="${o}" transform="rotate(-90 50 50)"/><text x=50 y=57 text-anchor=middle font-size=22 font-weight=700 fill="currentColor">${txt}</text></svg>`}

Object.assign(ICONS,{pen:'<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/>',plus:'<path d="M12 5v14M5 12h14"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',check:'<path d="M5 12l5 5 9-10"/>',grip:'<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',cr:'<path d="M9 6l6 6-6 6"/>',cl:'<path d="M15 6l-6 6 6 6"/>',play:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/><path d="M10 11v6M14 11v6"/>'});
const ico=(k,sz)=>`<svg viewBox="0 0 24 24" width=${sz||18} height=${sz||18} fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>${ICONS[k]}</svg>`;
const partOpts=(d,ex)=>dayParts(d).filter(p=>p.id!=ex).map(p=>`<option value=${p.id}>${esc(p.name)} (${ftime(p.s)} تا ${ftime(p.e)})</option>`).join('')||'<option value="">پارتی نیست</option>';
const startCard=()=>noParts()?`<div class=card><h2>اول پارت‌بندی را بساز</h2><p class=muted>پارت یعنی زمانی که می‌خواهی در آن درس بخوانی (مثلاً ۸ تا ۱۰). درس‌هایت فقط داخل پارت‌ها چیده می‌شوند.</p><div class=row><button class="btn p" data-a=presetAll>ساخت پارت‌های پیشنهادی</button><button class=btn data-a=go data-v=options>تنظیم دستی</button></div></div>`:'';
function timeButton(date,p){const sec=partTimeSeconds(date,p.id),active=S.activeTimer&&S.activeTimer.date==date&&S.activeTimer.part==p.id;return`<button class="time-add${sec?' has-time':''}" data-a=timeMenu data-date=${date} data-pid=${p.id}>${ico('clock',14)}${active?'تایمر فعال':sec?fsec(sec)+' ثبت‌شده':'ثبت زمان'}</button>`}
function activeBar(){const t=S.activeTimer;if(!t||TSCREEN)return'';return`<div class="card tbar"><div class=grow><b>${t.running?'تایمر در حال اجراست':'تایمر متوقف است'}</b> · ${esc(timerCourse())}<div class="muted sm" id=barClock style="direction:ltr;text-align:right">${clockText(timerSeconds())}</div></div><button class="btn p" data-a=timerOpen>باز کردن</button><button class="btn d" data-a=timerCancel>لغو</button></div>`}
function dayList(date){const ps=dayParts(date);if(!ps.length)return`<div class=empty><b>برای این روز پارتی تعریف نشده</b><p class="muted sm">زمان‌های مطالعه‌ات را در تنظیمات، بخش پارت‌بندی، تعیین کن.</p><button class="btn p" data-a=go data-v=options>رفتن به پارت‌بندی</button></div>`;
const isT=date==today(),nm=nowMin();
return`<div class=tlv>${ps.map(p=>{const a=asg(date,p),dn=doneLog(date,p.id),live=isT&&nm>=p.s&&nm<p.e,len=p.e-p.s;
if(!a)return`<div class=tr data-date=${date} data-pid=${p.id}><div class="tn e">${ico('plus',20)}</div><div class="pc empty" data-a=editp data-date=${date} data-pid=${p.id}><div class=row style="flex-wrap:nowrap"><b class=grow>${esc(p.name)}</b><span class=cp>${ico('clock',14)}${ftime(p.s)} تا ${ftime(p.e)}</span></div><div class="muted sm" style="margin-top:6px">خالی است؛ برای افزودن درس بزن.</div><div class=chips>${timeButton(date,p)}</div></div></div>`;
const tp=T_(a.c,a.tp);
return`<div class=tr data-date=${date} data-pid=${p.id} data-has=1 style="--c:${ccol(a.c)}"><div class=tn>${ico(dn?'check':'courses',20)}</div><div class="pc${dn?' done':''}${live?' live':''}"><div class=row style="flex-wrap:nowrap;align-items:flex-start"><div class=grow data-a=editp data-date=${date} data-pid=${p.id} style="min-width:0;cursor:pointer"><div class=pt>${cic(a.c)} ${esc(cname(a.c))}${live?'<span class="tg now">اکنون</span>':''}</div><div class="muted sm">${tp?esc(tp.name):''}${a.n?(tp?' · ':'')+esc(a.n):''}</div></div><div class=pb><button class="ck${dn?' on':''}${LT==date+'|'+p.id?' pop':''}" data-a=ptick data-date=${date} data-pid=${p.id} aria-label="انجام شد">${dn?'✓':''}</button><span class=gr data-dr=1 aria-label="جابه‌جایی">${ico('grip',20)}</span></div></div><div class=chips><span class=cp>${ico('clock',14)}${ftime(p.s)} تا ${ftime(p.e)}</span><span class=cp>${fmin(len)}</span><span class=cp>${esc(p.name)}</span><button class="cp ed" data-a=editp data-date=${date} data-pid=${p.id}>${ico('pen',14)}ویرایش</button>${timeButton(date,p)}</div></div></div>`}).join('')}</div>`}

function partForm(date,pid){const p=findPart(pid),a=asg(date,p),k=date+'|'+pid,hasOv=k in S.ov,x=a||{c:S.courses[0]?.id||'',tp:'',n:''},dopts=[];
for(let i=-7;i<=28;i++){const d=addD(date,i);dopts.push(`<option value=${d}${d==date?' selected':''}>${DAYS[wd(d)]} ${fj(d)}</option>`)}
M={date,pid,t:esc(p.name)+' · '+ftime(p.s)+' تا '+ftime(p.e),dl:'پاک کردن',b:`<div class="muted sm">${DAYS[wd(date)]} ${fj(date,1)}</div><label>درس</label><select id=pc data-a=cchg data-t=pt>${courseOpts(x.c)}</select><label>مبحث</label><select id=pt>${topicOpts(x.c,x.tp)}</select><label>یادداشت</label><input id=pn value="${esc(x.n||'')}"><label class=chk><input type=checkbox id=rp${hasOv?'':' checked'}> این برنامه هر هفته تکرار شود</label>${a?`<div class=mvbox><label>جابه‌جایی به</label><div class=row><select id=mvd data-a=mvchg style="flex:1 1 140px;width:auto">${dopts.join('')}</select><select id=mvp style="flex:1 1 120px;width:auto">${partOpts(date,pid)}</select></div><button class=btn style="margin-top:8px" data-a=mvgo data-date=${date} data-pid=${pid}>جابه‌جا کن</button></div>`:''}`,
s(){const c=$('#pc').value;if(!c)return err('اول در بخش «درس‌ها» یک درس اضافه کن.');const v={c,tp:$('#pt').value,n:$('#pn').value.trim()};if($('#rp').checked){S.tpl[pid]=v;delete S.ov[k]}else S.ov[k]=v;return true},
d:a?()=>{if($('#rp').checked){delete S.tpl[pid];delete S.ov[k]}else S.ov[k]=0}:null};render()}
const wkLabel=()=>{const ws=addD(CD,-wd(CD)),we=addD(ws,6),k=Math.round(diff(ws,addD(today(),-wd(today())))/7);return{t:fj(ws)+' تا '+fj(we),r:k==0?'هفته‌ی جاری':k>0?fa(k)+' هفته بعد':fa(-k)+' هفته قبل'}};
function strip(){const ws=addD(CD,-wd(CD)),t=today();return`<div class=strip>${DAYS.map((n,i)=>{const d=addD(ws,i),ps=dayParts(d),f=ps.filter(p=>asg(d,p)).length,dots=[...new Set(ps.map(p=>asg(d,p)?.c).filter(Boolean))].slice(0,3);return`<button class="sd${d==CD?' on':''}${d==t?' td':''}" data-a=pday data-d=${d} aria-label="${n}"><small>${DS[i]}</small><b>${fa(J(d)[2])}</b><span class=dots>${dots.map(c=>`<i style="--c:${ccol(c)}"></i>`).join('')||'<i class=e></i>'}</span><small>${ps.length?fa(f)+'/'+fa(ps.length):'—'}</small></button>`}).join('')}</div>`}
function board(){const ws=addD(CD,-wd(CD)),all=S.parts.flat();if(!all.length)return'';const lo=Math.floor(Math.min(...all.map(p=>p.s))/60),hi=Math.ceil(Math.max(...all.map(p=>p.e))/60),H=hi-lo,u=Math.max(12,Math.min(26,Math.floor(200/H)));let hrs='';for(let h=lo;h<=hi;h++)hrs+=`<span style="top:${(h-lo)*u}px">${fa(h)}</span>`;
return`<div class=card><h2>نمای کلی هفته</h2><div class=bh><span></span>${DS.map((x,i)=>`<small class="${addD(ws,i)==CD?'on':''}">${x}</small>`).join('')}</div><div class=bb style="height:${H*u}px"><div class=bx>${hrs}</div>${DAYS.map((n,i)=>{const d=addD(ws,i);return`<div class="bc${d==CD?' on':''}" data-a=pday data-d=${d}>${dayParts(d).map(p=>{const a=asg(d,p);return`<i style="--c:${a?ccol(a.c):'var(--muted)'};top:${(p.s-lo*60)/60*u}px;height:${Math.max(4,(p.e-p.s)/60*u-2)}px;${a?'':'opacity:.35'}"></i>`}).join('')}</div>`}).join('')}</div><p class="muted sm">هر ستون یک روز و هر رنگ یک درس است؛ کم‌رنگ یعنی پارت خالی.</p></div>`}
function weekV(){const w=wkLabel(),ps=dayParts(CD),tot=planOn(CD),fl=ps.filter(p=>asg(CD,p)).length;
return`${startCard()}<div class=wkb><button class=btn data-a=wk data-k="-1" aria-label="هفته‌ی قبل">${ico('cr')}</button><div class=grow style="text-align:center"><b>${w.t}</b><div class="muted sm">${w.r}</div></div><button class=btn data-a=wk data-k="1" aria-label="هفته‌ی بعد">${ico('cl')}</button></div>${strip()}${CD!=today()?'<div class=row style="margin-bottom:8px"><button class=chip data-a=tod>برگرد به امروز</button></div>':''}${dayRing(CD)}<div class=card><div class=row><div class=grow><h2 style=margin:0>${DAYS[wd(CD)]} ${fj(CD,1)}</h2><div class="muted sm">${ps.length?fa(fl)+' از '+fa(ps.length)+' پارت پر است · '+fmin(tot):'بدون پارت'}</div></div><button class=btn data-a=go data-v=options>پارت‌بندی</button></div><div style="margin-top:14px">${dayList(CD)}</div></div>${board()}<div class=card><h2>پوسترهای برنامه‌ریزی</h2><p class="muted sm">فقط درس‌ها و ساعت پارت‌ها؛ بدون آمار و زمان‌های ثبت‌شده.</p><div class=row><button class="btn p grow" data-a=imgToday>پوستر برنامهٔ امروز</button><button class="btn p grow" data-a=imgWeek>پوستر برنامهٔ هفته</button></div></div><p class="muted sm">برای جابه‌جایی، دستگیره‌ی نقطه‌ها را بگیر و روی پارت دیگر رها کن. برای ویرایش روی کارت بزن. به چپ و راست بکش تا روز عوض شود.</p>`}
function planV(){return`<div class=row style="margin:12px 0 0">${[['w','هفتگی'],['m','ماهانه'],['y','سالانه']].map(([k,n])=>`<button class="chip${PS==k?' on':''}" data-a=pv data-k=${k}>${n}</button>`).join('')}</div>`+(PS=='w'?weekV():PS=='m'?monthV():yearV())}
function monthV(){if(!PMo){const j=J(today());PMo=[j[0],j[1]]}const[y,m]=PMo,n=jml(y,m),f=isoJ(y,m,1),t=today(),off=wd(f),cj=J(t),maxDay=Math.max(1,...Array.from({length:n},(_,i)=>minOn(isoJ(y,m,i+1))));
if(!SD||J(SD)[0]!=y||J(SD)[1]!=m)SD=cj[0]==y&&cj[1]==m?t:f;
let cells='<span></span>'.repeat(off),tot=0,pl=0;
for(let d=1;d<=n;d++){const dt=isoJ(y,m,d),dn=minOn(dt),pp=planOn(dt);tot+=dn;pl+=pp;cells+=`<button class="mc${dt==t?' td':''}${dt==SD?' sel':''}" data-a=sday data-d=${dt} style="--r:${Math.round(Math.min(1,dn/maxDay)*45)}%"><b>${fa(d)}</b><small>${dn?fh(dn):pp?'·':''}</small></button>`}
const lg=S.logs.filter(l=>l.date==SD&&l.src=='manual');
return`<div class=row style="margin:12px 0"><button class=btn data-a=mnav data-k="-1">ماه قبل</button><b class=grow style="text-align:center">${MONTHS[m-1]} ${fa(y)}</b><button class=btn data-a=mnav data-k="1">ماه بعد</button></div><div class=card><b>مجموع مطالعهٔ این ماه: ${fh(tot)} ساعت</b><div class="muted sm">برنامهٔ زمانی: ${fh(pl)} ساعت · شدت خانه‌ها نسبت به پرمطالعه‌ترین روز ماه است.</div><button class=btn style="margin-top:10px" data-a=imgMonth data-y=${y} data-m=${m}>🖼️ ساخت کارنامهٔ این ماه</button></div><div class=card><div class=mg>${DS.map(x=>`<span class=mh>${x}</span>`).join('')}${cells}</div><p class="muted sm">هرچه خانه پررنگ‌تر باشد زمان مطالعهٔ آن روز بیشتر است. نقطه یعنی برنامه داشته‌ای ولی چیزی ثبت نشده.</p></div><div class=card><h2>${DAYS[wd(SD)]} ${fj(SD,1)}</h2><div class="muted sm">مطالعه: ${fmin(minOn(SD))} · برنامه: ${fmin(planOn(SD))}</div><div style="margin-top:12px">${dayList(SD)}</div>${lg.map(l=>`<div class=trow><span class=dot style="--c:${ccol(l.c)}"></span><span class=grow>${esc(cname(l.c))} · ${fmin(l.min)}</span><button class="btn d" data-a=dlg data-id=${l.id} aria-label="حذف" style="min-height:32px;padding:2px 10px">×</button></div>`).join('')}<label>ثبت دستی مطالعه</label><div class=row><select id=lc style="flex:1 1 120px;width:auto">${courseOpts()}</select><input id=lm type=text data-num=1 inputmode=numeric placeholder="دقیقه" style="flex:0 0 90px;width:90px"><button class="btn p" data-a=mlog data-d=${SD}>ثبت</button></div><div id=lerr class=err></div></div>`}
