// Update release: 2026-11-24-cloud-backup
const CACHE='planner-pwa-v5';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin!==self.location.origin)return;
 const isPage=r.mode==='navigate'||u.pathname==='/'||u.pathname==='/index.html';
 if(isPage){
  e.respondWith(fetch(r).then(res=>{
   if(res.ok)caches.open(CACHE).then(cache=>cache.put('/index.html',res.clone()));
   return res;
  }).catch(()=>caches.match(r).then(c=>c||caches.match('/index.html'))));
  return;
 }
 e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{
  if(res.ok)caches.open(CACHE).then(cache=>cache.put(r,res.clone()));
  return res;
 }).catch(()=>caches.match('/index.html'))));
});