const A={
go(){V=D.v;OC=null;ANIM=true;try{if(location.hash.slice(1)!=V)location.hash=V}catch(e){}render();scrollTo(0,0)},
pday(){CD=D.d;render()},wk(){CD=addD(CD,7*+D.k);render()},tod(){CD=today();render()},
ptick(){if(D.date>today())return toast('برای روزهای آینده نمی‌شود تیک زد.');const p=findPart(D.pid),l=doneLog(D.date,D.pid),b=minOn(today());if(l){S.logs=S.logs.filter(x=>x!==l);save();render();goalHit(b);return}const a=asg(D.date,p);if(!a)return;const sec=partTimeSeconds(D.date,D.pid);if(sec<=0){M={date:D.date,pid:D.pid,t:'ثبت مدت مطالعه',b:'<p class="muted sm">برای تکمیل پارت، ابتدا مدت واقعی مطالعه را ثبت کن. اگر مطالعه‌ای انجام نشده، پنجره را ببند و پارت را تکمیل نکن.</p><button class="btn p" data-a=chooseManual>ثبت دستی مدت مطالعه</button>'};return render()}if(sec>0){M={date:D.date,pid:D.pid,t:'نحوه محاسبه زمان پارت',b:`<p class="muted sm">برای این پارت ${fsec(sec)} زمان ثبت شده. زمان این پارت در آمار چطور محاسبه شود؟</p><div class="time-choice"><button data-a=ptickApply data-mode=full><span class=tc-icon>◷</span><b>زمان کامل پارت</b><small>${fmin(p.e-p.s)} در آمار ثبت شود؛ حتی اگر زمان ثبت‌شده کمتر باشد.</small></button><button data-a=ptickApply data-mode=actual><span class=tc-icon>✓</span><b>فقط زمان واقعی ثبت‌شده</b><small>${fsec(sec)} در آمار محاسبه شود.</small></button></div>`};render();return}A.ptickApply({dataset:{mode:'full'}})},ptickApply(el){const mode=el?.dataset?.mode||'full',date=M?.date||D.date,pid=M?.pid||D.pid,p=findPart(pid),a=asg(date,p),b=minOn(today());if(!p||!a)return;const l={id:uid(),date,c:a.c,tp:a.tp,min:mode==='actual'?0:p.e-p.s,src:'part',part:p.id,h:~~(p.s/60),mode};S.logs.push(l);syncPartLog(date,pid);M=null;LT=date+'|'+pid;save();render();LT='';goalHit(b)},
editp(){partForm(D.date,D.pid)},
timeMenu(){timeMenu(D.date,D.pid)},
chooseManual(){const d=M.date,pid=M.pid;M=null;manualTimeForm(d,pid)},
chooseTimer(){const d=M.date,pid=M.pid;if(d!=today())return err('تایمر زنده فقط برای پارت‌های امروز فعال است.');const t=S.activeTimer;if(t&&(t.date!=d||t.part!=pid))return err('یک تایمر دیگر فعال است؛ از نوار تایمر پایین صفحه آن را باز یا لغو کن.');M=null;openTimer(d,pid)},
startPart(){
 const p=findPart(D.pid),a=p&&asg(D.date,p);if(!p)return;
 if(!a){M={date:D.date,pid:D.pid,t:'پارت بدون درس',b:'<p class="muted sm">این پارت هنوز درسی ندارد. مشخص کن مطالعهٔ آن وارد شاخص بازدهی شود یا فقط زمانش ثبت شود.</p><label class=chk><input id=emptyInclude type=checkbox> در شاخص بازدهی محاسبه شود</label><label>درس (در صورت ورود به شاخص)</label><select id=emptyCourse>'+S.courses.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select>',s(){
  const include=$('#emptyInclude')?.checked,course=$('#emptyCourse')?.value||'';
  if(include&&!course)return err('برای ورود به شاخص، ابتدا یک درس انتخاب کن.');
  if(include)S.ov[D.date+'|'+D.pid]={c:course,tp:'',n:''};
  TIMER_DRAFT={date:D.date,part:D.pid,elapsedSec:0,startedAt:null,running:false};TSCREEN=true;return true
 }};return render()}
 openTimer(D.date,D.pid)
},
deskOpen(){DESK=true;TSCREEN=false;M=null;render();try{const fs=document.documentElement.requestFullscreen?.();if(fs&&typeof fs.then==='function')fs.then(()=>{try{screen.orientation?.lock?.('landscape')?.catch(()=>{})}catch(e){}}).catch(()=>{});else{try{screen.orientation?.lock?.('landscape')?.catch(()=>{})}catch(e){}}}catch(e){}},
deskExit(){DESK=false;try{screen.orientation?.unlock?.()}catch(e){}render();try{if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{})}catch(e){}},
deskNight(){DESKN=deskNight()?2:1;render()},deskRotate(){try{const p=screen.orientation?.lock?.('landscape');if(p&&p.catch)p.catch(()=>toast('چرخش خودکار گوشی را فعال کن و دوباره امتحان کن.'))}catch(e){toast('این مرورگر قفل چرخش را پشتیبانی نمی‌کند؛ چرخش خودکار گوشی را فعال کن.')}},
deskFace(){S.deskFace=+D.i;save();render()},
deskToggle(){const t=S.activeTimer;if(!t){const p=deskPart().p;if(!p)return toast('پارتی با درس چیده‌شده برای امروز نیست.');S.activeTimer={date:today(),part:p.id,elapsedSec:0,startedAt:Date.now(),running:true,h:new Date().getHours()}}else if(t.running){t.elapsedSec=timerSeconds();t.running=false;t.startedAt=null}else{t.running=true;t.startedAt=Date.now()}save();render()},
deskFinish(){A.timerFinish();toast('زمان ثبت شد ✓')},
imgToday(){pTry(makeToday)},imgWeek(){pTry(makeWeek)},planImgToday(){pTry(makeTodayPlan)},planImgWeek(){pTry(makeWeekPlan)},imgMonth(){const j=J(today());pTry(()=>makeMonth(+D.y||j[0],+D.m||j[1]))},imgYear(){const j=J(today());pTry(()=>makeYear(+D.y||PYr||j[0]))},
imgdl(){if(!IMG)return;const a=document.createElement('a');a.href=IMG.url;a.download=IMG.name;document.body.appendChild(a);a.click();a.remove()},
imgshare(){if(!IMG)return;const f=new File([IMG.blob],IMG.name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'پلنر مطالعه'}).catch(()=>{});else A.imgdl()},
cpLink(){const l=location.href.split('#')[0]+'#'+D.k;try{navigator.clipboard.writeText(l).then(()=>toast('لینک کپی شد ✓')).catch(()=>toast('کپی نشد؛ لینک: '+l))}catch(e){toast('کپی نشد')}},
emergencyOpen(){
 const t=today();
 const from=t,to=t,mode=S.activeTimer?'current':'range';
 M={t:'ثبت شرایط اضطراری',b:'<p class="muted sm">تایمر فعلی متوقف می‌شود. فقط پارت‌هایی که انتخاب می‌کنی از محاسبهٔ بازدهی خارج می‌شوند؛ زمان‌های ثبت‌شده حفظ خواهند شد.</p><div class=row><div class=grow><label>از تاریخ</label><input id=emFrom type=date value="'+from+'"></div><div class=grow><label>تا تاریخ</label><input id=emTo type=date value="'+to+'"></div></div><label>دامنهٔ تأثیر</label><select id=emMode><option value="range" '+(mode==='range'?'selected':'')+'>تمام پارت‌های برنامه‌ریزی‌شده در بازه</option><option value="remaining">پارت‌های باقی‌ماندهٔ امروز و روزهای بعد</option>'+(S.activeTimer?'<option value="current" selected>فقط پارت فعلی</option>':'')+'</select><label>توضیح (اختیاری)</label><input id=emReason maxlength=200 placeholder="اختیاری">',s(){
 const from=$('#emFrom')?.value,to=$('#emTo')?.value,mode=$('#emMode')?.value,reason=($('#emReason')?.value||'').trim();
 if(!StudyAnalytics.isISODate(from)||!StudyAnalytics.isISODate(to)||from>to)return err('بازهٔ تاریخ معتبر نیست.');
 if(diff(to,from)>365)return err('بازهٔ اضطراری حداکثر می‌تواند یک سال باشد.');
  
 if(mode==='current'&&!S.activeTimer)return err('تایمر فعالی برای این انتخاب وجود ندارد.');
 const id=uid(),parts=[];
 for(let d=from;d<=to;d=addD(d,1)){
  const plans=d<today()?(Array.isArray(S.analytics?.plans?.[d])?S.analytics.plans[d]:[]):analyticsEnsureDay(d);
  plans.forEach(p=>{
   if(!p.subjectId||p.deleted)return;
   let take=mode==='range';
   if(mode==='current')take=d===S.activeTimer.date&&p.id===S.activeTimer.part;
   if(mode==='remaining')take=d>today()||(d===today()&&(p.id===S.activeTimer?.part||p.plannedStart>=nowMin()));
   if(take){const priorEvent=(S.analytics.emergencies||[]).find(e=>!e.canceledAt&&e.parts.some(z=>z.date===d&&z.partId===p.id));const priorPart=priorEvent?.parts.find(z=>z.date===d&&z.partId===p.id);const wasIncluded=priorPart?priorPart.wasIncluded!==false:p.included!==false;p.included=false;p.emergencyId=id;parts.push({date:d,partId:p.id,wasIncluded})}
  });
 }
 if(!parts.length)return err('در این بازه پارت واجد شرایطی برای مستثناکردن پیدا نشد.');
  if(S.activeTimer?.running){S.activeTimer.elapsedSec=timerSeconds();S.activeTimer.running=false;S.activeTimer.startedAt=null}
 S.analytics.emergencies=S.analytics.emergencies||[];
 S.analytics.emergencies.push({id,from,to,reason,createdAt:Date.now(),canceledAt:0,parts});
 S.analytics.audit.push({type:'emergency-applied',id,from,to,at:Date.now(),parts:parts.length});
 return true
 }};render()
},
emergencyUndo(el){
 const e=(S.analytics?.emergencies||[]).find(x=>x.id===D.id&&!x.canceledAt);if(!e)return;
 if(!el.dataset.sure){el.dataset.sure='1';el.textContent='برای تأیید دوباره بزن';return}
 e.canceledAt=Date.now();
 e.parts.forEach(x=>{const p=(S.analytics.plans[x.date]||[]).find(q=>q.id===x.partId);if(p&&p.emergencyId===e.id){const other=(S.analytics.emergencies||[]).find(q=>q.id!==e.id&&!q.canceledAt&&q.parts.some(z=>z.date===x.date&&z.partId===x.partId));p.emergencyId=other?.id||'';p.included=other?false:(typeof x.wasIncluded==='boolean'?x.wasIncluded:!!p.subjectId&&!p.deleted)}});
 S.analytics.audit.push({type:'emergency-canceled',id:e.id,at:Date.now()});
 save();render()
},
quickStart(){const t=today(),nm=nowMin(),ps=dayParts(t).filter(p=>asg(t,p)&&!doneLog(t,p.id)),p=ps.find(x=>nm>=x.s&&nm<x.e)||ps.find(x=>x.s>nm)||ps[0];if(S.activeTimer){TSCREEN=true;return render()}if(p)return openTimer(t,p.id);return freeStudyPrompt()},freeStudyOpen(){return freeStudyPrompt()},pickic(){const i=$('#ci');if(i)i.value=D.e},
qadd(){const h=$('#timeHours'),m=$('#timeMinutes');if(!h||!m)return;const tot=Math.min(99*60+59,(+nd(h.value)||0)*60+(+nd(m.value)||0)+ +D.m);h.value=~~(tot/60);m.value=tot%60},
moveOver(){const t=today(),y=addD(t,-1),free=dayParts(t).filter(p=>!asg(t,p)),over=dayParts(y).filter(p=>asg(y,p)&&!doneLog(y,p.id));over.forEach(p=>{const f=free.shift();if(!f)return;S.ov[t+'|'+f.id]={...asg(y,p)};S.ov[y+'|'+p.id]=0});save();render()},
createcloudbk(){let code=localStorage.getItem('planner-backup-code-v1');if(!code){const bytes=crypto.getRandomValues(new Uint8Array(16));code=[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase().match(/.{1,8}/g).join('-');localStorage.setItem('planner-backup-code-v1',normCode(code))}const i=$('#cloudcode');if(i)i.value=code;const m=$('#cloudmsg');if(m)m.textContent='کد ساخته شد؛ حتماً آن را کپی و خارج از گوشی نگهداری کن. بکاپ اولیه در حال ارسال است.';push()},copycloudcode(){const i=$('#cloudcode');if(!i||!i.value)return toast('اول کد بازیابی را بساز.');navigator.clipboard?.writeText(i.value).then(()=>toast('کد کپی شد')).catch(()=>toast('کپی خودکار انجام نشد؛ کد را دستی یادداشت کن.'))},async restorecloudbk(){const i=$('#cloudcode'),m=$('#cloudmsg'),code=normCode(i?.value);if(code.length!==32){if(m)m.textContent='کد بازیابی باید ۳۲ رقم هگزادسیمال باشد.';return}try{await restoreCloudBackup(code);if(m)m.textContent='بازیابی انجام شد؛ آمار و سوابق برگشتند ✓'}catch(e){if(m)m.textContent=e.message||'بازیابی ناموفق بود.'}},autobk(){try{const b=localStorage.getItem('planner-v1-autobk');const i=$('#imp');if(b&&i){i.value=JSON.parse(b).json;$('#imsg').textContent='پشتیبان خودکار بارگذاری شد؛ «بازگردانی اطلاعات» را بزن.'}else $('#imsg').textContent='هنوز پشتیبان خودکاری ساخته نشده.'}catch(e){$('#imsg').textContent='پشتیبان در دسترس نیست.'}},
timerOpen(){TSCREEN=true;render()},
timerCancel(el){if(!el.dataset.sure){el.dataset.sure=1;const o=el.textContent;el.textContent=el.classList.contains('mx')?'مطمئنی؟':'زمان ثبت نمی‌شود؛ مطمئنی؟';setTimeout(()=>{if(el.isConnected){delete el.dataset.sure;el.textContent=o}},3500);return}S.activeTimer=null;TIMER_DRAFT=null;TSCREEN=false;save();render();leaveFS()},
editTime(){const x=S.timeEntries.find(x=>x.id==D.id);if(x)manualTimeForm(x.date,x.part,x.id)},
deleteTime(el){const x=S.timeEntries.find(x=>x.id==D.id);if(!x)return;if(!el.dataset.sure){el.dataset.sure=1;el.textContent='حذف؟';return}S.timeEntries=S.timeEntries.filter(y=>y.id!=x.id);S.logs=S.logs.filter(y=>y.id!=x.logId);syncPartLog(x.date,x.part);save();timeMenu(M.date,M.pid)},
timerBack(){TIMER_DRAFT=null;TSCREEN=false;render();leaveFS()},
timerToggle(){let t=S.activeTimer;if(!t){if(!TIMER_DRAFT)return;S.activeTimer={...TIMER_DRAFT};TIMER_DRAFT=null;t=S.activeTimer}if(t.running){t.elapsedSec=timerSeconds();t.running=false;t.startedAt=null;relWake()}else{if(t.h==null)t.h=new Date().getHours();analyticsEnsureDay(t.date);const pl=S.analytics?.plans?.[t.date]?.find(x=>x.id===t.part);if(pl&&pl.actualStart==null){const now=new Date();pl.actualStart=now.getHours()*60+now.getMinutes()}t.running=true;t.startedAt=Date.now()}save();render()},
timerFinish(){const t=S.activeTimer;if(!t){TIMER_DRAFT=null;TSCREEN=false;render();leaveFS();return}const sec=timerSeconds(),bf=minOn(today());if(sec<1){S.activeTimer=null;TIMER_DRAFT=null;TSCREEN=false;save();render();leaveFS();return}const p=findPart(t.part),a=p&&asg(t.date,p),id=uid(),logId=uid();S.timeEntries.push({id,date:t.date,part:t.part,seconds:sec,method:'timer',createdAt:Date.now(),logId});S.logs.push({id:logId,date:t.date,c:a?.c||'',tp:a?.tp||'',min:sec/60,src:'timer',part:t.part,h:t.h!=null?t.h:new Date().getHours()});syncPartLog(t.date,t.part);S.activeTimer=null;TIMER_DRAFT=null;TSCREEN=false;save();render();leaveFS();goalHit(bf)},
timerBgSettingsPick(){const f=$('#timerBgSettingsInput');if(f)f.click()},
timerBgClear(){removeTimerBg().then(()=>{S.timerBg='';save();render()})},
downloadbk(){const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='study-planner-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},
importfile(){const f=$('#backupFile');if(f)f.click()},
mvgo(){const d2=$('#mvd').value,q=$('#mvp').value;if(!q)return err('پارت مقصد را انتخاب کن.');swapAcross(D.date,D.pid,d2,q);M=null;save();render()},
statsTab(){STTAB=D.k==='index'?'index':'normal';render()},analyticsPreset(){const k=D.k;ST_TO=today();if(k==='all'){const dates=Object.keys(S.analytics?.plans||{}).sort();ST_FROM=dates[0]||today()}else if(k==='week'){ST_FROM=addD(ST_TO,-wd(ST_TO))}else if(k==='month'){const [y,m]=J(ST_TO);ST_FROM=isoJ(y,m,1)}else if(k==='year'){const [y]=J(ST_TO);ST_FROM=isoJ(y,1,1)}else ST_FROM=addD(ST_TO,-Math.max(0,(+k||7)-1));render()},analyticsTest(){AN_DIAG=StudyAnalytics.diagnostics();render();if(AN_DIAG.failed.length)toast('تست موتور بازدهی خطا دارد.');else toast('تمام تست‌های موتور بازدهی موفق بودند.')},pv(){PS=D.k;render()},mnav(){let[y,m]=PMo;m+=+D.k;if(m>12){m=1;y++}if(m<1){m=12;y--}PMo=[y,m];SD=null;render()},ynav(){PYr+=+D.k;render()},sday(){SD=D.d;render()},
mlog(){const m=+nd($('#lm').value),c=$('#lc').value,e=$('#lerr');if(D.d>today()){if(e)e.textContent='برای روزهای آینده نمی‌شود ثبت کرد.';return}if(!c){if(e)e.textContent='اول در بخش «درس‌ها» یک درس اضافه کن.';return}if(!(m>0)){if(e)e.textContent='مدت را به دقیقه وارد کن.';return}S.logs.push({id:uid(),date:D.d,c,tp:'',min:m,src:'manual'});save();render()},dlg(){S.logs=S.logs.filter(l=>l.id!=D.id);save();render()},
opc(){OC=D.id;render();scrollTo(0,0)},bc(){OC=null;render()},newc(){courseForm()},editc(){courseForm(C(D.id))},
ts(){const p=T_(D.c,D.p);p.st=(p.st+1)%3;save();render()},tw(){const p=T_(D.c,D.p);p.w=p.w%3+1;save();render()},
delt(){const c=C(D.c);c.topics=c.topics.filter(x=>x.id!=D.p);save();render()},
addt(){const v=$('#nt').value.split('\n').map(x=>x.trim()).filter(Boolean);v.forEach(n=>C(D.id).topics.push({id:uid(),name:n,w:2,st:0}));if(v.length){save();render()}},
spd(){SPD=+D.i;render()},
addpart(){const ps=S.parts[SPD],dur=Math.max(15,Math.min(240,+D.min||120)),last=ps.length?Math.max(...ps.map(p=>p.e)):0,s=ps.length?(last+30<=1439-dur?last+30:last):480,e=Math.min(s+dur,1439);if(e-s<15||ps.some(p=>s<p.e&&p.s<e)){PERR='برای این مدت، زمان خالی و بدون هم‌پوشانی پیدا نشد.';return render()}const np={id:uid(),name:'پارت '+fa(ps.length+1),s,e};ps.push(np);FOCUS_PID=np.id;save();render()},dupPart(){const p=findPart(D.pid),ps=S.parts[SPD];if(!p)return;const dur=p.e-p.s;let s=-1;for(let q=360;q+dur<=1439;q+=15){if(!ps.some(z=>q<z.e&&z.s<q+dur)){s=q;break}}if(s<0)return toast('برای کپی این پارت، زمان خالی کافی وجود ندارد.');const np={id:uid(),name:p.name+' (کپی)',s,e:s+dur};ps.push(np);FOCUS_PID=np.id;save();render()},
delpart(el){if(!el.dataset.sure){el.dataset.sure=1;el.textContent='حذف؟';return}const id=D.pid;S.parts=S.parts.map(a=>a.filter(p=>p.id!=id));delete S.tpl[id];Object.keys(S.ov).forEach(k=>{if(k.endsWith('|'+id))delete S.ov[k]});save();render()},
copyparts(){copyForm()},presetAll(){fillParts();save();render()},
preset(){(PRESETS[D.k]||[]).forEach(c=>{if(S.courses.some(x=>x.name==c.n))return;S.courses.push({id:uid(),name:c.n,color:PAL[S.courses.length%PAL.length],w:3,topics:c.t.map(n=>({id:uid(),name:n,w:2,st:0}))})});save();render()},
theme(){S.theme=D.k;save();render()},demo(){demo();save();render()},
copybk(){const t=$('#bk');t.select();try{navigator.clipboard.writeText(t.value).catch(()=>{})}catch(e){}},
imp(el){if(!el.dataset.sure){el.dataset.sure=1;el.textContent='برای جایگزینی دوباره بزن';return}try{const o=JSON.parse($('#imp').value);if(!o||!Array.isArray(o.courses))throw 0;S=norm(o);if(S.timerBg&&S.timerBg.startsWith('data:image/')){const legacy=S.timerBg;S.timerBg='';fetch(legacy).then(r=>r.blob()).then(putTimerBg).then(loadTimerBg).catch(()=>{});}save();render()}catch(e){$('#imsg').textContent='متن پشتیبان درست نیست.';el.textContent='بازگردانی';delete el.dataset.sure}},
wipe(el){if(!el.dataset.sure){el.dataset.sure=1;el.textContent='مطمئنی؟ دوباره بزن';return}S=norm({theme:S.theme});TIMER_DRAFT=null;save();render()},
mclose(){M=null;render()},mback(el,e){if(e.target===el){M=null;render()}},
msave(){if(M.s()===true){M=null;save();render()}},
mdel(el){if(!el.dataset.sure){el.dataset.sure=1;el.textContent='برای تأیید دوباره بزن';return}M.d();M=null;save();render()}};
