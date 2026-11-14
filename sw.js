/* Sekoly service worker: app shell cache (data offline is handled by Firestore) */
const V='sekoly-v4';
const SHELL=['./','index.html','style.css','manifest.json','icon.svg','icon-192.png','firebase-config.js','js/core.js','js/state.js','js/sync.js','js/shell.js','js/v-dashboard.js','js/v-students.js','js/v-org.js','js/v-grades.js','js/v-attendance.js','js/v-finance.js','js/v-comm.js','js/v-staff.js','js/v-reports.js','js/v-settings.js','js/v-portal.js','js/events.js','js/firebase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET')return;
 const cacheable=u.origin===location.origin||u.host==='www.gstatic.com'||u.host.endsWith('fonts.googleapis.com')||u.host.endsWith('fonts.gstatic.com');
 if(!cacheable)return;
 // network first, fallback to cache (so updates arrive quickly, offline still works)
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
