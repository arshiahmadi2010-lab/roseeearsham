document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||/^(SELECT|INPUT)$/.test(el.tagName))return;D=el.dataset;const f=A[D.a];if(f)f(el,e)});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.num){const v=nd(t.value);if(v!==t.value)t.value=v}if(t.dataset.a==='timerDim'){const v=Math.max(15,Math.min(85,+t.value||48)),pv=$('#timerBgPreview'),lb=$('#timerDimLabel');if(pv)pv.style.backgroundImage=`linear-gradient(rgba(8,13,25,${v/100}),rgba(8,13,25,${v/100})),${TIMER_BG_URL?`url('${TIMER_BG_URL}')`:'linear-gradient(135deg,#26344f,#56658c 55%,#25344d)'}`;if(lb)lb.textContent=fa(v)+'٪'}});
document.addEventListener('change',e=>{const t=e.target,s=t.dataset.set;if(t.dataset.analyticsDate){if(t.dataset.analyticsDate==='start')ST_FROM=t.value;else ST_TO=t.value;render();return}
if(t.id=='timerBgSettingsInput'&&t.files&&t.files[0]){const file=t.files[0],st=$('#bgUploadStatus');if(st)st.textContent='در حال بهینه‌سازی و ذخیره تصویر…';uploadTimerBg(file).then(()=>{const e=$('#bgUploadStatus');if(e)e.textContent='تصویر با موفقیت ذخیره شد و برای تمام تایمرها فعال است.'}).catch(e=>{const q=$('#bgUploadStatus');if(q)q.textContent=e.message||'ذخیره تصویر ناموفق بود.'});t.value='';return}
if(t.dataset.a=='timerDim'){S.timerDim=Math.max(15,Math.min(85,+t.value||48));save();const pv=$('#timerBgPreview');if(pv)pv.style.backgroundImage=`linear-gradient(rgba(8,13,25,${S.timerDim/100}),rgba(8,13,25,${S.timerDim/100})),${TIMER_BG_URL?`url('${TIMER_BG_URL}')`:'linear-gradient(135deg,#26344f,#56658c 55%,#25344d)'}`;const lb=$('#timerDimLabel');if(lb)lb.textContent=fa(S.timerDim)+'٪';return}
if(s==='fx'){S.fx=t.checked;save();render();return}
if(s){if(s==='goal'){S.goal=Math.max(.5,Math.min(24,+nd(t.value)||.5));save();if(V==='options')render()}return}
if(t.id=='backupFile'&&t.files&&t.files[0]){const r=new FileReader();r.onload=()=>{$('#imp').value=String(r.result||'')};r.readAsText(t.files[0]);t.value='';return}
if(t.dataset.a=='cchg'){const x=$('#'+t.dataset.t);if(x)x.innerHTML=topicOpts(t.value,'')}
if(t.dataset.a=='mvchg'){$('#mvp').innerHTML=partOpts(t.value,t.value==M.date?M.pid:'')}
if(t.dataset.pf){const p=findPart(t.dataset.pid);if(!p)return;const f=t.dataset.pf;if(f=='name'){p.name=t.value.trim()||p.name;save();return}
const row=t.closest('.prow'),toMin=v=>{const m=/^(\d{1,2}):(\d{2})/.exec(v||'');return m?+m[1]*60+ +m[2]:null},sEl=row.querySelector('[data-pf=s]'),eEl=row.querySelector('[data-pf=e]'),ns=toMin(sEl.value);let ne=toMin(eEl.value);
if(ns==null||ne==null)return;
const day=S.parts.findIndex(a=>a.includes(p));
/* اگر شروع را از پایان فعلی دیرتر کردی، پایان با همان مدت قبلی جابه‌جا می‌شود */
if(f=='s'&&!(ne>ns)){ne=Math.min(ns+(p.e-p.s),1439);eEl.value=tm(ne)}
if(!(ne>ns)){PERR='ساعت پایان باید بعد از ساعت شروع باشد.';return render()}
if(S.parts[day].some(q=>q!==p&&ns<q.e&&q.s<ne)){PERR='این پارت با پارت دیگری هم‌پوشانی دارد.';return render()}
p.s=ns;p.e=ne;save();render()}});
addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(v=='timer'){A.quickStart();return}if(v=='desk'){if(!DESK)A.deskOpen();return}if(VIEWS[v]&&v!=V){V=v;OC=null;render()}});
let DG=null;
document.addEventListener('pointerdown',e=>{const g=e.target.closest('.gr');if(!g||DG)return;const row=g.closest('.tr[data-date][data-pid]');if(!row)return;e.preventDefault();DG={row,grip:g,y:e.clientY,t:null,pointerId:e.pointerId,moved:false};row.classList.add('drag');try{g.setPointerCapture(e.pointerId)}catch(x){}});
document.addEventListener('pointermove',e=>{if(!DG||e.pointerId!==DG.pointerId)return;e.preventDefault();const d=DG,dy=e.clientY-d.y;if(Math.abs(dy)>5)d.moved=true;d.row.style.transform='translateY('+dy+'px)';let target=null,best=Infinity;document.querySelectorAll('.tr[data-date][data-pid]').forEach(r=>{if(r===d.row)return;const b=r.getBoundingClientRect(),dist=Math.abs(e.clientY-(b.top+b.height/2));if(dist<best){best=dist;target=r}});if(best>Math.max(72,(target?.getBoundingClientRect().height||0)*1.2))target=null;document.querySelectorAll('.tr.over').forEach(r=>r.classList.remove('over'));if(target)target.classList.add('over');d.t=target},{passive:false});
window.addEventListener('orientationchange',()=>{if(DESK)render()});
const dend=(cancel=false,e)=>{if(!DG||e&&e.pointerId!==DG.pointerId)return;const d=DG;DG=null;d.row.classList.remove('drag');d.row.style.transform='';document.querySelectorAll('.tr.over').forEach(r=>r.classList.remove('over'));try{if(d.grip.hasPointerCapture(d.pointerId))d.grip.releasePointerCapture(d.pointerId)}catch(x){}if(!cancel&&d.moved&&d.t&&d.t.isConnected&&d.row.isConnected){const from=d.row.dataset,to=d.t.dataset;if(from.date&&from.pid&&to.date&&to.pid&&(from.date!==to.date||from.pid!==to.pid)){swapAcross(from.date,from.pid,to.date,to.pid);save()}}render()};
document.addEventListener('pointerup',e=>dend(false,e));document.addEventListener('pointercancel',e=>dend(true,e));
let TS=null;
document.addEventListener('touchstart',e=>{const t=e.touches[0];TS=e.target.closest('input,select,textarea,.sheet,.gr,.tr[data-has]')?null:{x:t.clientX,y:t.clientY}},{passive:true});
document.addEventListener('touchend',e=>{if(!TS||M||V!='plan'||PS!='w')return;const t=e.changedTouches[0],dx=t.clientX-TS.x,dy=t.clientY-TS.y;TS=null;if(Math.abs(dx)>70&&Math.abs(dy)<45){CD=addD(CD,dx>0?1:-1);render()}},{passive:true});
let SW=null;
document.addEventListener('touchstart',e=>{const r=e.target.closest('.tr[data-has]');SW=r&&!e.target.closest('.gr,button,select,input')?{r,x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});
document.addEventListener('touchend',e=>{if(!SW||M)return;const s=SW;SW=null;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)>90&&Math.abs(dy)<40){D={date:s.r.dataset.date,pid:s.r.dataset.pid};dx>0?A.ptick():A.editp()}},{passive:true});
setInterval(()=>{if(V=='home'&&!M&&!TSCREEN&&!document.hidden)render()},60000);
setInterval(()=>{if(!document.hidden){timerUpdate();deskTick()}},250);
let DT=null;
document.addEventListener('touchstart',e=>{DT=DESK&&!e.target.closest('button')?e.touches[0].clientX:null},{passive:true});
document.addEventListener('touchend',e=>{if(DT==null)return;const dx=e.changedTouches[0].clientX-DT;DT=null;if(Math.abs(dx)>60){S.deskFace=((S.deskFace||0)+(dx<0?1:2))%3;save();render()}},{passive:true});
analyticsEnsureDay(today());save(true);ANIM=true;render();if(STORAGE_ERR){const se=$('#sync');if(se)se.textContent='ذخیره روی دستگاه ناموفق است'}loadTimerBg();initRemote();
{const h0=location.hash.slice(1);if(h0=='timer')setTimeout(()=>A.quickStart(),400);else if(h0=='desk')setTimeout(()=>A.deskOpen(),200)}
