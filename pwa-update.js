
if ('serviceWorker' in navigator) {
  (() => {
    let updateReg=null,updateAccepted=false,reloadingForUpdate=false,updatePromptShown=false,updateDeferred=false;
    function showUpdatePrompt(reg){
      updateReg=reg;
      if(updateDeferred||updatePromptShown||!reg||!reg.waiting)return;
      if(document.getElementById('planner-update-layer'))return;
      updatePromptShown=true;
      const layer=document.createElement('div');
      layer.id='planner-update-layer';layer.dir='rtl';
      layer.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(12,20,32,.48);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px)';
      layer.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="planner-update-title" style="width:min(100%,390px);background:var(--card,#fff);color:var(--text,#172033);border:1px solid var(--line,#e5e7eb);border-radius:22px;padding:22px;box-shadow:0 18px 60px #0003;font-family:inherit"><div style="font-size:27px;margin-bottom:8px">✨</div><h2 id="planner-update-title" style="font-size:18px;margin:0 0 9px">نسخهٔ جدید آماده است</h2><p style="font-size:14px;line-height:1.9;margin:0 0 18px;color:var(--muted,#687386)">برای دریافت قابلیت‌ها و بهبودهای جدید، برنامه همین‌جا به‌روزرسانی و دوباره باز می‌شود. آمار و برنامه‌های ذخیره‌شده‌ات باقی می‌مانند.</p><div style="display:flex;gap:10px"><button id="planner-update-later" type="button" style="flex:1;border:1px solid var(--line,#ddd);border-radius:12px;padding:12px;background:transparent;color:inherit;font:inherit">بعداً</button><button id="planner-update-now" type="button" style="flex:1;border:0;border-radius:12px;padding:12px;background:var(--accent,#3978d5);color:white;font:inherit;font-weight:700">به‌روزرسانی</button></div></section>';
      document.body.appendChild(layer);
      layer.querySelector('#planner-update-later').addEventListener('click',()=>{updateDeferred=true;layer.remove();updatePromptShown=false;});
      layer.querySelector('#planner-update-now').addEventListener('click',async()=>{
        const btn=layer.querySelector('#planner-update-now');btn.disabled=true;btn.textContent='در حال به‌روزرسانی…';btn.style.opacity='.7';
        try{if(typeof save==='function')save()}catch(e){console.warn('Save before update:',e)}
        updateAccepted=true;
        let waiting=updateReg&&updateReg.waiting;
        if(!waiting&&updateReg){try{await updateReg.update();waiting=updateReg.waiting}catch(e){console.warn('Update retry:',e)}}
        if(waiting){waiting.postMessage({type:'SKIP_WAITING'});return}
        updateAccepted=false;btn.disabled=false;btn.textContent='نسخهٔ جدیدی پیدا نشد';setTimeout(()=>{layer.remove();updatePromptShown=false},1600);
      });
    }
    async function checkForUpdate(){
      if(!updateReg)return;
      try{await updateReg.update();if(updateReg.waiting)showUpdatePrompt(updateReg)}
      catch(err){console.warn('PWA update check:',err)}
    }
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(!updateAccepted||reloadingForUpdate)return;
      reloadingForUpdate=true;location.reload();
    });
    window.addEventListener('load',async()=>{
      try{
        updateReg=await navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'});
        const reg=updateReg;
        const watch=()=>{
          const worker=reg.installing;
          if(!worker||worker.__plannerUpdateWatched)return;
          worker.__plannerUpdateWatched=true;
          worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&reg.waiting)showUpdatePrompt(reg)});
        };
        reg.addEventListener('updatefound',watch);watch();
        if(reg.waiting)showUpdatePrompt(reg);
        await checkForUpdate();
        setTimeout(checkForUpdate,2500);
      }catch(err){console.warn('PWA registration/update:',err)}
    });
    window.addEventListener('focus',checkForUpdate);
    window.addEventListener('online',checkForUpdate);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate()});
  })();
}
