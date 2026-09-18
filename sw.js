/* VIDSTREAM — Service Worker */
const VER='v1';
const CACHE='vidstream-'+VER;
const PRECACHE=['./','./index.html','./welcome.html','./home/index.html',
 './signup/index.html','./settings/index.html','./downloads/index.html'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys()
  .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 if(url.hostname.includes('supabase.co'))return; // auth: kada a cache!

 // YouTube API → network-first (offline: tsohon feed)
 if(url.hostname.endsWith('googleapis.com')){
  e.respondWith(fetch(e.request).then(r=>{
   const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;
  }).catch(()=>caches.match(e.request)));
  return;
 }
 // Thumbnails → cache-first (sauri + offline)
 if(url.hostname.includes('ytimg.com')||url.hostname.includes('storage.googleapis.com')){
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{
   const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;
  })));
  return;
 }
 // Shafukan app → stale-while-revalidate
 if(e.request.mode==='navigate'||url.origin===location.origin){
  e.respondWith(caches.open(CACHE).then(async c=>{
   const m=await c.match(e.request);
   const net=fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}).catch(()=>m);
   return m||net;
  }));
 }
});
