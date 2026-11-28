// Update release: 2026-11-27-visual-cleanup-v1
const CACHE='planner-pwa-v46';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg','/analytics-engine.js','/analytics.css','/app.css','/app-core.js','/app-views.js','/app-actions.js','/app-events.js','/pwa-update.js','/ui-polish.css','/tehran-animated.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin!==self.location.origin)return;
 // API responses must stay JSON; never serve the app shell as an offline API fallback.
 if(u.pathname.startsWith('/api/'))return;
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
 }).catch(()=>new Response('Offline',{status:503,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}}))));
});