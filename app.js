import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, setDoc, updateDoc, collection, onSnapshot, writeBatch, deleteField } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
/* =========================================================
   SEKOLY — Rindrambaiko fitantanana sekoly
   ========================================================= */
const ICONS={
home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
brief:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
card:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
checks:'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
eyeoff:'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
menu:'<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
check:'<polyline points="20 6 9 17 4 12"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
cap:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
door:'<path d="M3 21h18"/><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><circle cx="15" cy="12" r="1"/>',
user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const ic=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`;

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const nf=new Intl.NumberFormat('fr-FR');
const fmt=n=>nf.format(Math.round(n||0))+' Ar';
const short=n=>n>=1e6?(n/1e6).toFixed(1).replace('.0','').replace('.',',')+'M':n>=1e3?Math.round(n/1e3)+'k':String(Math.round(n));
const MONTHS=['Septambra','Oktobra','Novambra','Desambra','Janoary','Febroary','Martsa','Aprily','Mey','Jona'];
const MSHORT=['Sep','Okt','Nov','Des','Jan','Feb','Mar','Apr','Mey','Jon'];
const CALM=['Janoary','Febroary','Martsa','Aprily','Mey','Jona','Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra'];
const DAYS=['Alahady','Alatsinainy','Talata','Alarobia','Alakamisy','Zoma','Sabotsy'];
const MODES=['Vola an-tanana','MVola','Orange Money','Airtel Money','Banky / Seky'];
const TERMS=[['T1','Trimestra 1'],['T2','Trimestra 2'],['T3','Trimestra 3']];
const iso=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const today=()=>iso(new Date());
const fmtDate=s=>{if(!s)return'—';const[y,m,d]=s.split('-');return`${d}/${m}/${y}`};
const dateLong=d=>`${DAYS[d.getDay()]} ${d.getDate()} ${CALM[d.getMonth()]} ${d.getFullYear()}`;
const curMonthIdx=()=>{const m=new Date().getMonth();const map={8:0,9:1,10:2,11:3,0:4,1:5,2:6,3:7,4:8,5:9};return map[m]??9};
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const PAL=[['#ccfbf1','#0f766e'],['#dbeafe','#1d4ed8'],['#fef3c7','#b45309'],['#fce7f3','#be185d'],['#ede9fe','#6d28d9'],['#dcfce7','#15803d'],['#ffedd5','#c2410c'],['#e0f2fe','#0369a1']];
const palOf=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return PAL[h%PAL.length]};
const avs=(name,key)=>{const[b,f]=palOf(key||name);return`<div class="avs" style="background:${b};color:${f}">${esc(initials(name))}</div>`};
const CCOL=['#14b8a6','#3b82f6','#f59e0b','#ec4899','#8b5cf6','#22c55e','#f97316','#0ea5e9','#ef4444','#64748b'];

/* ---------- data ---------- */
let S=null, user=null;
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function monthDate(mi,day){const y=mi<4?2026:2027,m=mi<4?8+mi:mi-4;return iso(new Date(y,m,day))}
const DEF_SUBJECTS=[['Malagasy',2],['Frantsay',2],['Anglisy',1],['Matematika',3],['Fizika sy Simia',2],['Siansa (SVT)',2],['Tantara sy Jeografia',2],['Fanatanjahantena',1]];
function emptyState(){return{school:{name:'',code:'',director:'',address:'',phone:'',email:'',year:schoolYear(),motto:''},teachers:[],classes:[],subjects:DEF_SUBJECTS.map(([name,coef],i)=>({id:'s'+i,name,coef,ord:i})),students:[],payments:[],attendance:{},grades:{},seq:0}}
function schoolYear(){const d=new Date(),y=d.getFullYear();return d.getMonth()>=8?`${y}-${y+1}`:`${y-1}-${y}`}
function seed(){
 const R=rng(20261113),pick=a=>a[Math.floor(R()*a.length)];
 const BOYS=['Rado','Hery','Andry','Tojo','Haja','Mamy','Hasina','Tsiry','Njaka','Toky','Fenitra','Sitraka','Ravo','Mahery','Tahina','Fanilo','Tiavina','Mendrika'];
 const GIRLS=['Fanja','Tiana','Mialy','Lova','Nirina','Voahangy','Faniry','Ony','Noro','Fitia','Kanto','Aina','Malala','Santatra','Miora','Hanta','Sarobidy','Onja'];
 const LAST=['Rakoto','Rabe','Randrianasolo','Rasoanaivo','Andrianina','Razafindrakoto','Rakotomalala','Ranaivoson','Rasolofo','Ramanantsoa','Rajaonarison','Andriamanana','Razanakoto','Ravelojaona','Rakotondrabe','Randriamampionona','Rabemananjara','Rasamimanana'];
 const ph=()=>'03'+pick(['2','3','4','8'])+' '+String(Math.floor(R()*90+10))+' '+String(Math.floor(R()*900+100))+' '+String(Math.floor(R()*90+10));
 const T=[['Rakotomalala Haingo','Matematika'],['Rasoanirina Voahirana','Frantsay'],['Andrianarivo Tsilavina','Fizika sy Simia'],['Razafy Lalaina','Malagasy'],['Rabearison Mamisoa','Anglisy'],['Ramaroson Fidy','Tantara sy Jeografia'],['Rakotobe Nomena','Siansa (SVT)'],['Randria Hasimbola','Fanatanjahantena'],['Raveloson Miangaly','Matematika']];
 const teachers=T.map(([name,subject],i)=>({id:'t'+i,name,subject,phone:ph(),email:'',since:String(2012+Math.floor(R()*12))}));
 const C=[['CP',30000],['CE',30000],['CM1',35000],['CM2',35000],['6ème',45000],['5ème',45000],['4ème',50000],['3ème',55000]];
 const classes=C.map(([name,fee],i)=>({id:'c'+i,name,fee,teacherId:'t'+i,room:'Efitra '+(i+1),capacity:30,color:CCOL[i],ord:i}));
 const subjects=DEF_SUBJECTS.map(([name,coef],i)=>({id:'s'+i,name,coef,ord:i}));
 const students=[],payments=[],attendance={},grades={};let n=0,seq=0;
 const cm=curMonthIdx(), td=new Date().getDate(), ability={};
 classes.forEach((c,ci)=>{
  const cnt=6+Math.floor(R()*4);
  for(let k=0;k<cnt;k++){
   const sex=R()<.5?'L':'V',first=pick(sex==='L'?BOYS:GIRLS),last=pick(LAST);
   const by=2020-ci,bd=iso(new Date(by,Math.floor(R()*12),1+Math.floor(R()*27)));
   const s={id:'p'+(++n),matricule:'MP-'+String(n).padStart(4,'0'),first,last,sex,birth:bd,classId:c.id,parent:pick(['Ramatoa ','Andriamatoa '])+last+' '+pick(R()<.5?BOYS:GIRLS),phone:ph(),address:pick(['Analakely','Ankorondrano','Ambohijatovo','Isotry','Ampefiloha','Andravoahangy','Ambanidia','67 Ha','Itaosy','Ivato']),status:'Mianatra',created:'2026-09-0'+(1+Math.floor(R()*8))};
   students.push(s);ability[s.id]=7+R()*10;
   const pr=[.95,.85,.7,.6];
   for(let m=0;m<=cm&&m<10;m++){
    const r=R(); if(r<(pr[m]??.6)){
     const part=R()<.1; const day=m===cm?1+Math.floor(R()*Math.max(1,td-1)):1+Math.floor(R()*14);
     payments.push({id:uid(),rec:'R'+String(++seq).padStart(5,'0'),studentId:s.id,month:m,amount:part?c.fee/2:c.fee,date:monthDate(m,day),mode:pick(['Vola an-tanana','Vola an-tanana','MVola','MVola','Orange Money','Airtel Money'])});
    }
   }
  }
 });
 // attendance: last 9 school days
 const days=[];let d=new Date();d.setDate(d.getDate()-1);
 while(days.length<9){if(d.getDay()!==0&&d.getDay()!==6)days.push(iso(d));d.setDate(d.getDate()-1)}
 days.forEach(day=>classes.forEach(c=>{const rec={};students.filter(s=>s.classId===c.id).forEach(s=>{const r=R();rec[s.id]=r<.88?'P':r<.94?'R':'A'});attendance[c.id+'|'+day]=rec}));
 // grades T1
 classes.forEach(c=>subjects.forEach(sb=>{const g={};students.filter(s=>s.classId===c.id).forEach(s=>{let v=ability[s.id]+(R()-.5)*7;v=Math.max(2,Math.min(19.5,v));g[s.id]=Math.round(v*2)/2});grades[c.id+'|T1|'+sb.id]=g}));
 return{v:2,school:{name:'Sekoly Fanilo',code:'SEK001',director:'Rtoa Rasoanirina Lalao',address:'Lot II M 45 Analakely, Antananarivo',phone:'034 12 345 67',email:'contact@fanilo.mg',year:'2026-2027',motto:'Fahaizana · Fahamarinana · Fahafahana'},
  teachers,classes,subjects,students,payments,attendance,grades,seq};
}

/* =========================================================
   FIREBASE — Firestore sync
   schools/{CODE}                  : {school, seq, members:{uid:{login,name,role}}, owner}
   schools/{CODE}/{collection}/{id}: students, payments, classes, teachers, subjects,
                                     attendance ({v:record}), grades ({v:record})
   ========================================================= */
const CONFIG_OK=!!(firebaseConfig&&firebaseConfig.apiKey&&!/^(VOTRE|YOUR|AZO)/i.test(firebaseConfig.apiKey));
let fbApp=null,auth=null,db=null;
if(CONFIG_OK){
 fbApp=initializeApp(firebaseConfig);
 auth=getAuth(fbApp);
 try{db=initializeFirestore(fbApp,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})})}
 catch(e){db=initializeFirestore(fbApp,{})}
}
const COLS=['students','payments','classes','teachers','subjects','attendance','grades'];
const MAPC={attendance:1,grades:1};
let SCHOOL=null,unsubs=[],last={},loaded={},registering=false,authReady=false,syncErr=null,pending=0;
const emailOf=(code,login)=>`${String(login).trim().toLowerCase().replace(/[^a-z0-9._-]/g,'')}@${String(code).trim().toLowerCase()}.sekoly.app`;
const codeOfEmail=e=>String(e||'').split('@')[1]?.split('.')[0]?.toUpperCase()||'';
function stable(v){if(Array.isArray(v))return'['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return'{'+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v===undefined?null:v)}
const clean=o=>JSON.parse(JSON.stringify(o));
const byOrd=(a,b)=>(a.ord??0)-(b.ord??0)||String(a.name||'').localeCompare(String(b.name||''));
function curDocs(col){const o={};if(MAPC[col]){for(const k in S[col])o[k]={v:S[col][k]}}else for(const x of S[col])o[x.id]=x;return o}
const mainOf=()=>({school:S.school,seq:S.seq||0});
function save(){
 if(!SCHOOL||!S||!db)return;
 const ops=[];
 const m=stable(mainOf());if(m!==last.__main){ops.push(['u',doc(db,'schools',SCHOOL),clean(mainOf())]);last.__main=m}
 for(const col of COLS){
  const cur=curDocs(col),lc=last[col]||(last[col]={});
  for(const id in cur){const st=stable(cur[id]);if(lc[id]!==st){ops.push(['s',doc(db,'schools',SCHOOL,col,id),clean(cur[id])]);lc[id]=st}}
  for(const id in lc)if(!(id in cur)){ops.push(['d',doc(db,'schools',SCHOOL,col,id)]);delete lc[id]}
 }
 for(let i=0;i<ops.length;i+=400){
  const b=writeBatch(db);
  ops.slice(i,i+400).forEach(([t,r,d])=>t==='s'?b.set(r,d):t==='u'?b.update(r,d):b.delete(r));
  pending++;setSync();
  b.commit().then(()=>{pending--;syncErr=null;setSync()}).catch(e=>{pending--;syncErr=e;setSync();toast('Tsy voatahiry: '+fbMsg(e),1)});
 }
}
let rT=null;
function schedule(){clearTimeout(rT);rT=setTimeout(()=>{if(user&&S&&COLS.every(c=>loaded[c])&&loaded.__main)render()},40)}
function detach(){unsubs.forEach(u=>{try{u()}catch(e){}});unsubs=[];last={};loaded={};SCHOOL=null;S=null}
function attach(code){
 detach();SCHOOL=code;S=emptyState();render();
 unsubs.push(onSnapshot(doc(db,'schools',code),snap=>{
  if(SCHOOL!==code||!S)return;
  if(!snap.exists()){fatal('Tsy hita ny sekoly "'+code+'".');return}
  const d=snap.data(),me=(d.members||{})[auth.currentUser?.uid];
  if(!me){fatal('Tsy mpikambana amin\'ny sekoly "'+code+'" ianao.');return}
  S.school=d.school||{};S.seq=d.seq||0;S.members=d.members||{};S.owner=d.owner;
  last.__main=stable(mainOf());
  user={uid:auth.currentUser.uid,...me};loginErr='';loaded.__main=1;schedule();
 },e=>fatal(fbMsg(e))));
 for(const col of COLS){
  unsubs.push(onSnapshot(collection(db,'schools',code,col),qs=>{
   if(SCHOOL!==code||!S)return;
   const lc={};let out=MAPC[col]?{}:[];
   qs.forEach(ds=>{const v=ds.data();if(MAPC[col]){out[ds.id]=v.v||{};lc[ds.id]=stable({v:v.v||{}})}else{const o={...v,id:ds.id};out.push(o);lc[ds.id]=stable(o)}});
   if(col==='classes'||col==='subjects')out.sort(byOrd);
   S[col]=out;last[col]=lc;loaded[col]=1;schedule();
  },e=>fatal(fbMsg(e))));
 }
}
function fatal(msg){const a=auth;detach();user=null;loginErr=msg;if(a)signOut(a).catch(()=>{});render()}
function fbMsg(e){const c=(e&&e.code)||'';return({
 'auth/invalid-credential':'Diso ny kaody sekoly, ny anarana na ny teny miafina.','auth/wrong-password':'Diso ny teny miafina.','auth/user-not-found':'Tsy hita io mpampiasa io.','auth/invalid-email':'Anarana fidirana tsy mety (litera sy isa ihany).',
 'auth/email-already-in-use':'Efa misy io anarana fidirana io amin\'io sekoly io.','auth/weak-password':'Teny miafina farafahakeliny 6 litera.','auth/network-request-failed':'Tsy misy internet. Andramo indray.',
 'auth/too-many-requests':'Be loatra ny fanandramana. Miandrasa kely.','auth/operation-not-allowed':'Tsy mbola nalefa ny "Email/Password" ao amin\'ny Firebase Authentication.','auth/requires-recent-login':'Midira indray vao manova teny miafina.',
 'permission-denied':'Tsy mahazo alalana (jereo ny Firestore rules).','unavailable':'Tsy misy internet — hotehirizina rehefa tafaverina.'}[c])||(e&&e.message)||String(e)}
let onlineNow=navigator.onLine;
function setSync(){const el=document.getElementById('sync');if(!el)return;el.className='chip sync '+(!onlineNow?'off':syncErr?'err':pending?'busy':'ok');el.innerHTML=syncLabel()}
const syncLabel=()=>!onlineNow?'<i></i> Tsy misy internet':syncErr?'<i></i> Hadisoana':pending?'<i></i> Mitahiry…':'<i></i> Voatahiry';
addEventListener('online',()=>{onlineNow=true;setSync()});addEventListener('offline',()=>{onlineNow=false;setSync()});

/* ---------- domain helpers ---------- */
const cls=id=>S.classes.find(c=>c.id===id);
const stu=id=>S.students.find(s=>s.id===id);
const tea=id=>S.teachers.find(t=>t.id===id);
const active=()=>S.students.filter(s=>s.status==='Mianatra');
const fullName=s=>s?`${s.last} ${s.first}`:'—';
const fee=s=>(cls(s.classId)||{}).fee||0;
const paid=(sid,m)=>{let a=0;for(const p of S.payments)if(p.studentId===sid&&p.month===m)a+=p.amount;return a};
function mstat(s,m){const f=fee(s),p=paid(s.id,m);if(f>0&&p>=f)return'paid';if(p>0)return'partial';if(m<(s.start||0))return'skip';if(m>curMonthIdx())return'future';return'none'}
const lateMonths=s=>{if(s.status!=='Mianatra')return 0;let n=0;for(let m=s.start||0;m<=Math.min(curMonthIdx(),9);m++)if(!['paid','skip'].includes(mstat(s,m)))n++;return n};
const dueAmount=s=>{if(s.status!=='Mianatra')return 0;let a=0;for(let m=s.start||0;m<=Math.min(curMonthIdx(),9);m++)a+=Math.max(0,fee(s)-paid(s.id,m));return a};
const sumMonth=m=>S.payments.reduce((a,p)=>p.month===m?a+p.amount:a,0);
function receipts(){const map={};for(const p of S.payments){const r=map[p.rec]||(map[p.rec]={rec:p.rec,studentId:p.studentId,months:[],amount:0,date:p.date,mode:p.mode});r.months.push(p.month);r.amount+=p.amount;if(p.date>r.date)r.date=p.date}return Object.values(map).sort((a,b)=>b.date.localeCompare(a.date)||b.rec.localeCompare(a.rec))}
function attDates(){const s=new Set();for(const k in S.attendance)s.add(k.split('|')[1]);return[...s].sort()}
function lastAttDate(){const t=today();const ds=attDates().filter(d=>d<=t);return ds[ds.length-1]}
function attRateDate(d){let tot=0,ok=0;for(const k in S.attendance){if(!k.endsWith('|'+d))continue;for(const v of Object.values(S.attendance[k])){tot++;if(v!=='A')ok++}}return tot?Math.round(ok/tot*100):0}
function studentAtt(s){const r={P:0,R:0,A:0};for(const k in S.attendance){if(!k.startsWith(s.classId+'|'))continue;const v=S.attendance[k][s.id];if(v)r[v]++}const t=r.P+r.R+r.A;r.rate=t?Math.round((r.P+r.R)/t*100):null;return r}
const gk=(c,t,sb)=>`${c}|${t}|${sb}`;
function avgOf(sid,c,t){let sum=0,co=0;for(const sb of S.subjects){const v=(S.grades[gk(c,t,sb.id)]||{})[sid];if(v!==undefined&&v!==''&&v!==null){sum+=v*sb.coef;co+=sb.coef}}return co?sum/co:null}
function ranking(c,t){return S.students.filter(s=>s.classId===c&&s.status==='Mianatra').map(s=>({s,avg:avgOf(s.id,c,t)})).sort((a,b)=>(b.avg??-1)-(a.avg??-1))}
const mention=a=>a==null?['—','b-gray']:a>=16?['Tsara indrindra','b-teal']:a>=14?['Tsara','b-green']:a>=12?['Tsara ihany','b-blue']:a>=10?['Ampy','b-amber']:['Tsy ampy','b-red'];
const f2=v=>v==null?'—':v.toFixed(2).replace('.',',');

/* ---------- ui state ---------- */
const ui={q:'',fcls:'',fst:'',side:false,payTab:'vaovao',paySid:'',payMonths:[],lateM:null,lateC:'',gridC:'',attC:'',attD:'',gC:'',gT:'T1',gS:'',gTab:'ampidiro',tq:''};
const TITLE={tabilao:'Tabilao',mpianatra:'Mpianatra',kilasy:'Kilasy',mpampianatra:'Mpampianatra',sarany:'Saram-pianarana',fiantsoana:'Fiantsoana',naoty:'Naoty sy kara-naoty',fikirakirana:'Fikirakirana'};
const SUB={tabilao:'Topimaso ankapobeny ny sekoly',mpianatra:'Soraty sy tantano ny mpianatra rehetra',kilasy:'Ireo kilasy sy ny saram-pianarana isam-bolana',mpampianatra:'Ny ekipan\'ny mpampianatra',sarany:'Raiso ny vola, araho ireo tara',fiantsoana:'Fiantsoana isan\'andro isaky ny kilasy',naoty:'Ampidiro ny naoty ary avoahy ny kara-naoty',fikirakirana:'Momba ny sekoly, kaonty ary angona'};
const NAV=[['tabilao','Tabilao','home'],['mpianatra','Mpianatra','users'],['kilasy','Kilasy','layers'],['mpampianatra','Mpampianatra','brief'],['sarany','Saram-pianarana','card'],['fiantsoana','Fiantsoana','checks'],['naoty','Naoty','award'],['fikirakirana','Fikirakirana','sliders']];

/* ---------- auth ---------- */
let loginErr='',loginMode='login',busy=false,lf={};
const ROLES={Admin:'Tale / Mpitantana',Kasie:'Mpitahiry vola',Mpampianatra:'Mpampianatra'};
const ROLE_NAV={Admin:null,Kasie:['tabilao','mpianatra','kilasy','sarany','fikirakirana'],Mpampianatra:['tabilao','mpianatra','fiantsoana','naoty','fikirakirana']};
const canSee=r=>{const l=ROLE_NAV[user?.role];return!l||l.includes(r)};
const isAdmin=()=>user?.role==='Admin';
if(CONFIG_OK)onAuthStateChanged(auth,()=>{const u=auth.currentUser;authReady=true;if(registering)return;if(u){const c=codeOfEmail(u.email);if(c&&c!==SCHOOL)attach(c)}else{detach();user=null;render()}});

/* ---------- render ---------- */
const app=$('#app');
function route(){const r=location.hash.slice(1);return TITLE[r]?r:'tabilao'}
function render(){
 const ae=document.activeElement,fid=ae&&ae.id,pos=ae&&ae.selectionStart;
 if(!CONFIG_OK){app.innerHTML=setupView();return}
 if(!authReady||(auth.currentUser&&!user&&!loginErr&&!registering)){app.innerHTML=loadingView();return}
 if(!user){app.innerHTML=loginView();if(fid){const n=document.getElementById(fid);if(n)n.focus()}return}
 let r=route();if(!canSee(r))r='tabilao';
 app.innerHTML=layout(r,V[r]());
 if(fid){const n=document.getElementById(fid);if(n&&n.tagName==='INPUT'){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
}
const loadingView=()=>`<div class="loading"><div class="logo big">${ic('cap',30)}</div><div class="spin"></div><p>Maka ny angon'ny sekoly…</p></div>`;
function setupView(){return`<div class="loading" style="padding:24px"><div class="logo big">${ic('cap',30)}</div><div class="card" style="max-width:560px;text-align:left"><h2 style="margin-top:0">Mbola tsy voakirakira ny Firebase</h2><p>Sokafy ny rakitra <code>firebase-config.js</code> ao amin'ny repository GitHub, ary soloy ny <code>firebaseConfig</code> avy amin'ny Firebase Console (<i>Project settings → Your apps → Web</i>).</p><p class="muted">Jereo ny README.md raha mila ny dingana rehetra.</p></div></div>`}
function layout(r,content){
 const lateN=active().filter(s=>lateMonths(s)>0).length;
 return`<div class="shell ${ui.side?'side-open':''}">
 <aside class="side">
  <div class="brand"><div class="logo">${ic('cap',22)}</div><div><b>Sekoly</b><small>Fitantanana sekoly</small></div></div>
  <div class="school-pill"><div class="sp-av">${esc(initials(S.school.name))}</div><div style="min-width:0"><b>${esc(S.school.name)}</b><small>${esc(SCHOOL)} · ${esc(S.school.year)}</small></div></div>
  <div class="nav-l">Menio</div>
  <nav>${NAV.filter(([k])=>canSee(k)).map(([k,l,i])=>`<a href="#${k}" class="${r===k?'on':''}">${ic(i)}<span>${l}</span>${k==='sarany'&&lateN?`<em>${lateN}</em>`:''}</a>`).join('')}</nav>
  <div class="side-foot"><button data-act="logout">${ic('logout')} Hivoaka</button><small>Sekoly v3.0 · Firebase</small></div>
 </aside>
 <div class="scrim" data-act="side"></div>
 <main>
  <header class="top"><button class="icon-btn mob" data-act="side">${ic('menu')}</button>
   <div><h1>${TITLE[r]}</h1><p>${SUB[r]}</p></div>
   <div class="top-r"><span id="sync" class="chip sync ${!onlineNow?'off':syncErr?'err':pending?'busy':'ok'}">${syncLabel()}</span><span class="chip hide-md">${ic('cal',14)} ${dateLong(new Date())}</span>
   <div class="me"><div class="av">${esc(initials(user.name))}</div><div><b>${esc(user.name)}</b><small>${esc(ROLES[user.role]||user.role||'')}</small></div></div></div>
  </header>
  <section class="page">${content}</section>
 </main></div>`;
}

/* ---------- login ---------- */
function loginView(){
 const reg=loginMode==='register';
 return`<div class="login">
 <div class="login-art"><div class="grid-bg"></div>
  <div class="brand"><div class="logo">${ic('cap',22)}</div><div><b>Sekoly</b><small style="color:#99f6e4">Fitantanana sekoly</small></div></div>
  <div class="float-card"><div class="ki teal" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#ccfbf1;color:#0f766e">${ic('trend')}</div><div><small>Saram-pianarana voaray</small><b>+ 92%</b></div></div>
  <div>
   <h1>Mpianatra, saram-pianarana ary fiantsoana — <span>amin'ny toerana iray.</span></h1>
   <p class="lead">Soraty ny mpianatra, raiso ny saram-pianarana, araho ireo tara amin'ny fandoavana ary ataovy ny fiantsoana, na amin'ny finday na amin'ny ordinatera. Voatahiry ao amin'ny cloud ny angona ary mifandray ho azy amin'ny fitaovana rehetra.</p>
   <div class="feats">
    <div class="feat"><i>${ic('users')}</i>Fisoratana anarana</div>
    <div class="feat"><i>${ic('card')}</i>Saram-pianarana & rosia</div>
    <div class="feat"><i>${ic('checks')}</i>Fiantsoana isan'andro</div>
    <div class="feat"><i>${ic('award')}</i>Naoty & kara-naoty</div>
   </div>
  </div>
  <small style="opacity:.6">© ${new Date().getFullYear()} Sekoly · Natao ho an'ny sekoly malagasy</small>
 </div>
 <div class="login-form">
  <div class="lf">
  <div class="tabs" style="align-self:flex-start"><button class="${!reg?'on':''}" data-act="lmode" data-k="login">Hiditra</button><button class="${reg?'on':''}" data-act="lmode" data-k="register">Hamorona sekoly</button></div>
  ${reg?`<form class="lf" data-form="register" autocomplete="off">
   <div><h2>Sekoly vaovao ✨</h2></div>
   <p>Mamorona ny kaontin'ny sekolinao. Ianao no ho Tale/Mpitantana.</p>
   <label class="fld"><span>Anaran'ny sekoly *</span><input name="name" id="rname" placeholder="ohatra: Sekoly Fanilo" required value="${esc(lf.name||'')}"></label>
   <div class="grid2">
    <label class="fld"><span>Kaody sekoly *</span><input name="code" id="rcode" placeholder="SEK001" value="${esc(lf.code||'')}" required pattern="[A-Za-z0-9]{3,12}" title="Litera sy isa, 3 ka hatramin'ny 12" style="text-transform:uppercase"></label>
    <label class="fld"><span>Anaranao *</span><input name="uname" id="runame" placeholder="Rtoa Lalao" required value="${esc(lf.uname||'')}"></label>
    <label class="fld"><span>Anarana fidirana *</span><input name="login" id="rlogin" placeholder="admin" value="${esc(lf.login||'')}" required pattern="[A-Za-z0-9._\\-]{2,30}"></label>
    <label class="fld"><span>Teny miafina * (6+)</span><input name="pass" id="rpass" type="password" minlength="6" required></label>
   </div>
   <label style="display:flex;gap:10px;align-items:flex-start;font-size:13px;cursor:pointer"><input type="checkbox" name="demo" style="margin-top:3px" ${lf.demo?'checked':''}> <span>Ampidiro <b>angona santionany</b> (kilasy, mpianatra, vola…) hanandramana. Azo fafana any aoriana.</span></label>
   <div class="err ${loginErr?'show':''}" id="lerr">${esc(loginErr)}</div>
   <button class="btn pri block" style="padding:13px" ${busy?'disabled':''}>${busy?'<span class="spin sm"></span> Andraso…':ic('check',16)+' Hamorona ny sekoly'}</button>
  </form>`:`<form class="lf" data-form="login" autocomplete="on">
   <div><h2>Tongasoa indray 👋</h2></div>
   <p>Midira amin'ny kaontin'ny sekolinao</p>
   <label class="fld"><span>Kaody sekoly</span><input name="code" id="lcode" placeholder="ohatra: SEK001" required value="${esc(lf.code||lsGet('sekoly_code'))}" style="text-transform:uppercase"></label>
   <label class="fld"><span>Anarana fidirana</span><input name="login" id="llogin" placeholder="admin" required autocomplete="username" value="${esc(lf.login||'')}"></label>
   <label class="fld"><span>Teny miafina</span><div class="pw"><input name="pass" id="lpass" type="password" placeholder="••••••" required autocomplete="current-password"><button type="button" data-act="pw">${ic('eye',17)}</button></div></label>
   <div class="err ${loginErr?'show':''}" id="lerr">${esc(loginErr)}</div>
   <button class="btn pri block" style="padding:13px" ${busy?'disabled':''}>${busy?'<span class="spin sm"></span> Andraso…':ic('lock',16)+' Hiditra'}</button>
   <p class="muted" style="font-size:12.5px;margin:0">Adino ny teny miafina? Angataho amin'ny Tale/mpitantana ny sekoly hamorona kaonty vaovao ho anao.</p>
   <p class="muted" style="font-size:12.5px;margin:0">Sekoly vaovao? <a href="#" data-act="lmode" data-k="register" style="color:var(--pri2);font-weight:600">Mamoròna eto</a></p>
  </form>`}
  <div class="lfoot">Sekoly v3.0 · Firebase</div>
  </div>
 </div></div>`;
}
const lsGet=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

/* =========================================================
   VIEWS
   ========================================================= */
const V={};
const emptyBox=(icon,t,s='')=>`<div class="empty"><div class="ei">${ic(icon,24)}</div><b>${t}</b><div style="margin-top:4px">${s}</div></div>`;
const clsOpts=(sel,all)=>`${all?`<option value="">${all}</option>`:''}${S.classes.map(c=>`<option value="${c.id}" ${sel===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}`;

/* ---------- dashboard ---------- */
V.tabilao=()=>{
 const st=active(),cm=curMonthIdx(),boys=st.filter(s=>s.sex==='L').length;
 const exp=st.reduce((a,s)=>a+fee(s),0),got=sumMonth(cm),pct=exp?Math.round(got/exp*100):0;
 const late=st.map(s=>({s,n:lateMonths(s),due:dueAmount(s)})).filter(x=>x.n>0).sort((a,b)=>b.due-a.due);
 const totalDue=late.reduce((a,x)=>a+x.due,0);
 const ld=lastAttDate(),ar=ld?attRateDate(ld):0;
 const recs=receipts().slice(0,6);
 const maxCap=Math.max(...S.classes.map(c=>c.capacity||30));
 return`
 <div class="hero"><div style="position:relative;z-index:1"><span class="eyebrow">Arahaba, ${esc(user.name)} 👋</span><h2>${esc(S.school.name)}</h2><p>Taom-pianarana ${esc(S.school.year)} · Volana ${MONTHS[cm]} · ${esc(S.school.motto||'')}</p></div>
  <div class="hero-actions"><button class="btn white" data-act="newStudent">${ic('plus',16)} Mpianatra vaovao</button><a class="btn light" href="#sarany" data-act="goPay">${ic('card',16)} Handray vola</a><a class="btn light" href="#fiantsoana">${ic('checks',16)} Fiantsoana</a></div></div>
 <div class="kpis">
  <div class="card kpi"><div class="ki teal">${ic('users',20)}</div><div class="kv">${st.length}</div><div class="kl">Mpianatra mianatra</div><div class="ks">${boys} lahy · ${st.length-boys} vavy · ${S.classes.length} kilasy</div></div>
  <div class="card kpi"><div class="ki blue">${ic('trend',20)}</div><span class="kt badge b-blue nd">${pct}%</span><div class="kv">${fmt(got)}</div><div class="kl">Voaray tamin'ny ${MONTHS[cm]}</div><div class="bar"><i style="width:${Math.min(100,pct)}%"></i></div><div class="ks">Andrasana: ${fmt(exp)}</div></div>
  <div class="card kpi"><div class="ki red">${ic('alert',20)}</div><div class="kv">${late.length}</div><div class="kl">Mpianatra tara nandoa</div><div class="ks">${fmt(totalDue)} tsy mbola voaloa</div></div>
  <div class="card kpi"><div class="ki amber">${ic('checks',20)}</div><div class="kv">${ld?ar+'%':'—'}</div><div class="kl">Taham-pahatongavana</div><div class="ks">${ld?'Fiantsoana farany: '+fmtDate(ld):'Tsy mbola nisy fiantsoana'}</div></div>
 </div>
 <div class="row c2">
  <div class="card"><div class="card-h"><div><h3>Saram-pianarana voaray isam-bolana</h3><small>Ny voaray raha ampitahaina amin'ny andrasana</small></div><div class="legend"><span><i style="background:#0d9488"></i>Voaray</span><span><i style="background:#e6efed"></i>Andrasana</span></div></div>${barChart()}</div>
  <div class="card"><div class="card-h"><div><h3>Mpianatra isaky ny kilasy</h3><small>${st.length} mpianatra amin'ny ${S.classes.length} kilasy</small></div><a class="btn ghost sm" href="#kilasy">Jereo</a></div>
   ${S.classes.map(c=>{const n=st.filter(s=>s.classId===c.id).length;return`<div class="crow"><b><span style="display:inline-block;width:8px;height:8px;border-radius:3px;background:${c.color||'#14b8a6'};margin-right:6px"></span>${esc(c.name)}</b><div class="bar"><i style="width:${n/maxCap*100}%;background:${c.color||'#14b8a6'}"></i></div><span>${n}/${c.capacity||30}</span></div>`}).join('')}
  </div>
 </div>
 <div class="row c2e">
  <div class="card"><div class="card-h"><div><h3>Fandoavana farany</h3><small>Ireo rosia vao natao</small></div><a class="btn ghost sm" href="#sarany">Rehetra</a></div>
   <div class="list">${recs.length?recs.map(r=>{const s=stu(r.studentId);return`<div class="li">${avs(fullName(s),r.studentId)}<div class="who"><div><b>${esc(fullName(s))}</b><small>${esc((cls(s?.classId)||{}).name||'')} · ${r.months.sort((a,b)=>a-b).map(m=>MSHORT[m]).join(', ')} · ${esc(r.mode)}</small></div></div><div class="r"><b>${fmt(r.amount)}</b><small>${fmtDate(r.date)}</small></div><button class="icon-btn" data-act="receipt" data-rec="${r.rec}" title="Rosia">${ic('file',16)}</button></div>`}).join(''):emptyBox('card','Tsy mbola misy fandoavana')}</div></div>
  <div class="card"><div class="card-h"><div><h3>Tara amin'ny fandoavana</h3><small>Ireo be trosa indrindra</small></div><a class="btn ghost sm" href="#sarany" data-act="goLate">Rehetra</a></div>
   <div class="list">${late.length?late.slice(0,6).map(x=>`<div class="li">${avs(fullName(x.s),x.s.id)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${esc(cls(x.s.classId)?.name||'')} · ${esc(x.s.phone||'')}</small></div></div><div class="r"><b style="color:#b91c1c">${fmt(x.due)}</b><small>${x.n} volana</small></div><button class="btn pri sm" data-act="payFor" data-sid="${x.s.id}">Andoavy</button></div>`).join(''):emptyBox('check','Voaloa daholo! 🎉','Tsy misy mpianatra tara')}</div></div>
 </div>`;
};
function barChart(){
 const st=active(),cm=curMonthIdx(),exp=st.reduce((a,s)=>a+fee(s),0);
 const data=MONTHS.map((m,i)=>({l:MSHORT[i],got:sumMonth(i)}));
 const max=Math.max(exp,...data.map(d=>d.got))||1;
 const W=640,H=240,pb=28,top=22,gw=W/10,bw=Math.min(36,gw*.56),ch=H-pb-top;
 let g=`<line x1="0" y1="${H-pb}" x2="${W}" y2="${H-pb}" stroke="#e6ebe9"/>`;
 [.25,.5,.75,1].forEach(f=>{const y=H-pb-ch*f;g+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#f1f4f3" stroke-dasharray="4 4"/>`});
 data.forEach((d,i)=>{
  const x=i*gw+(gw-bw)/2,he=exp/max*ch,hg=d.got/max*ch,cur=i===cm;
  g+=`<rect x="${x}" y="${H-pb-he}" width="${bw}" height="${he}" rx="8" fill="#e6efed"/>`;
  if(hg>0)g+=`<rect x="${x}" y="${H-pb-hg}" width="${bw}" height="${hg}" rx="8" fill="${cur?'url(#gc)':'url(#gg)'}"><title>${MONTHS[i]}: ${fmt(d.got)} / ${fmt(exp)}</title></rect>`;
  if(d.got>0)g+=`<text x="${x+bw/2}" y="${H-pb-Math.max(hg,he)-7}" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">${short(d.got)}</text>`;
  g+=`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" font-size="11.5" font-weight="${cur?700:500}" fill="${cur?'#0f1f1c':'#94a3b8'}">${d.l}</text>`;
 });
 return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;font-family:inherit"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14b8a6"/><stop offset="1" stop-color="#0d9488"/></linearGradient><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>${g}</svg>`;
}

/* ---------- students ---------- */
V.mpianatra=()=>{
 let list=S.students.filter(s=>(!ui.fcls||s.classId===ui.fcls));
 if(ui.fst==='late')list=list.filter(s=>lateMonths(s)>0);
 else if(ui.fst==='ok')list=list.filter(s=>s.status==='Mianatra'&&lateMonths(s)===0);
 else if(ui.fst)list=list.filter(s=>s.status===ui.fst);
 const q=ui.q.trim().toLowerCase();
 if(q)list=list.filter(s=>`${s.last} ${s.first} ${s.first} ${s.last} ${s.matricule} ${s.parent} ${s.phone}`.toLowerCase().includes(q));
 const ci=Object.fromEntries(S.classes.map((c,i)=>[c.id,i]));
 list.sort((a,b)=>(ci[a.classId]-ci[b.classId])||fullName(a).localeCompare(fullName(b)));
 return`
 <div class="toolbar">
  <div class="search">${ic('search',17)}<input id="q" data-in="q" placeholder="Hikaroka anarana, laharana, ray aman-dreny…" value="${esc(ui.q)}"></div>
  <select class="inp" data-ch="fcls">${clsOpts(ui.fcls,'Kilasy rehetra')}</select>
  <select class="inp" data-ch="fst"><option value="">Sata rehetra</option><option value="ok" ${ui.fst==='ok'?'selected':''}>Voaloa daholo</option><option value="late" ${ui.fst==='late'?'selected':''}>Tara nandoa</option><option value="Mianatra" ${ui.fst==='Mianatra'?'selected':''}>Mianatra</option><option value="Niala" ${ui.fst==='Niala'?'selected':''}>Niala</option></select>
  <button class="btn pri" data-act="newStudent">${ic('plus',16)} Mpianatra vaovao</button>
 </div>
 <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Lisitry ny mpianatra</h3><small>${list.length} hita amin'ny ${S.students.length}</small></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Mpianatra</th><th>Laharana</th><th>Kilasy</th><th>Ray aman-dreny</th><th>Saram-pianarana</th><th></th></tr></thead><tbody>
 ${list.length?list.map(s=>{const c=cls(s.classId),n=lateMonths(s);
  const b=s.status!=='Mianatra'?`<span class="badge b-gray">Niala</span>`:n===0?`<span class="badge b-green">Voaloa</span>`:`<span class="badge ${n>1?'b-red':'b-amber'}">Tara ${n} volana</span>`;
  return`<tr class="click" data-act="viewStudent" data-sid="${s.id}"><td><div class="who">${avs(fullName(s),s.id)}<div><b>${esc(fullName(s))}</b><small>${s.sex==='L'?'Lahy':'Vavy'} · ${fmtDate(s.birth)}</small></div></div></td>
  <td><span class="badge b-gray nd" style="font-family:ui-monospace,monospace">${esc(s.matricule)}</span></td>
  <td><span class="badge nd" style="background:${(c?.color||'#14b8a6')}1f;color:${c?.color||'#0f766e'}">${esc(c?.name||'—')}</span></td>
  <td><b style="font-weight:500">${esc(s.parent||'—')}</b><div class="muted" style="font-size:12px">${esc(s.phone||'')}</div></td>
  <td>${b}</td>
  <td><div class="acts"><button class="icon-btn" data-act="payFor" data-sid="${s.id}" title="Andoavy">${ic('card',16)}</button><button class="icon-btn" data-act="editStudent" data-sid="${s.id}" title="Hanova">${ic('edit',16)}</button><button class="icon-btn del" data-act="delStudent" data-sid="${s.id}" title="Hamafa">${ic('trash',16)}</button></div></td></tr>`}).join(''):`<tr><td colspan="6">${emptyBox('users','Tsy misy mpianatra hita','Ovay ny sivana na ampidiro mpianatra vaovao')}</td></tr>`}
 </tbody></table></div></div>`;
};
const fld=(label,name,val='',type='text',extra='')=>`<label class="fld"><span>${label}</span><input name="${name}" type="${type}" value="${esc(val)}" ${extra}></label>`;
const sel=(label,name,opts,val,extra='')=>`<label class="fld"><span>${label}</span><select name="${name}" ${extra}>${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(val)===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
function studentForm(s){
 s=s||{classId:ui.fcls||S.classes[0]?.id,sex:'L',status:'Mianatra',start:curMonthIdx()};
 openModal(s.id?'Hanova ny mombamomba':'Mpianatra vaovao',`<form data-form="student" id="fm"><input type="hidden" name="id" value="${s.id||''}">
 <div class="grid2">
  ${fld('Anarana *','last',s.last,'text','required placeholder="Rakoto"')}
  ${fld('Fanampin\'anarana *','first',s.first,'text','required placeholder="Andry"')}
  ${sel('Lahy / Vavy','sex',[['L','Lahy'],['V','Vavy']],s.sex)}
  ${fld('Daty nahaterahana','birth',s.birth,'date')}
  ${sel('Kilasy *','classId',S.classes.map(c=>[c.id,`${c.name} — ${fmt(c.fee)}/volana`]),s.classId)}
  ${sel('Sata','status',[['Mianatra','Mianatra'],['Niala','Niala']],s.status)}
  ${sel('Mandoa saram-pianarana manomboka','start',MONTHS.map((m,i)=>[i,m]),s.start||0)}
  ${fld('Ray aman-dreny / Mpiahy','parent',s.parent,'text','placeholder="Andriamatoa Rakoto"')}
  ${fld('Finday','phone',s.phone,'tel','placeholder="034 00 000 00"')}
  <div class="full">${fld('Adiresy','address',s.address,'text','placeholder="Lot, fokontany…"')}</div>
 </div></form>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn pri" type="submit" form="fm">${ic('check',16)} Tehirizina</button>`);
}
function viewStudent(id){
 const s=stu(id);if(!s)return;const c=cls(s.classId),at=studentAtt(s);
 const rk=ranking(s.classId,'T1'),pos=rk.findIndex(x=>x.s.id===s.id),avg=avgOf(s.id,s.classId,'T1');
 const n=lateMonths(s),[ml,mc]=mention(avg);
 openModal('Mombamomba ny mpianatra',`
 <div class="prof-h">${avs(fullName(s),s.id)}<div><h2>${esc(fullName(s))}</h2><div class="tags"><span class="badge b-teal nd">${esc(c?.name||'—')}</span><span class="badge b-gray nd">${esc(s.matricule)}</span>${s.status==='Mianatra'?(n?`<span class="badge b-red">Tara ${n} volana · ${fmt(dueAmount(s))}</span>`:`<span class="badge b-green">Voaloa daholo</span>`):`<span class="badge b-gray">Niala</span>`}</div></div></div>
 <div class="info">
  <div><span>Teraka</span><b>${fmtDate(s.birth)}</b></div><div><span>Lahy/Vavy</span><b>${s.sex==='L'?'Lahy':'Vavy'}</b></div><div><span>Saram-pianarana</span><b>${fmt(fee(s))} / volana</b></div>
  <div><span>Ray aman-dreny</span><b>${esc(s.parent||'—')}</b></div><div><span>Finday</span><b>${esc(s.phone||'—')}</b></div><div><span>Adiresy</span><b>${esc(s.address||'—')}</b></div>
 </div>
 <div class="sec-t">${ic('card',16)} Saram-pianarana ${esc(S.school.year)}</div>
 <div class="months">${MONTHS.map((m,i)=>{const st=mstat(s,i),p=paid(s.id,i);return`<div class="mchip ${st}" ${st!=='paid'?`data-act="payFor" data-sid="${s.id}" data-m="${i}"`:''}>${MSHORT[i]}<small>${st==='paid'?'✓ Voaloa':st==='partial'?short(p)+' / '+short(fee(s)):st==='future'||st==='skip'?'—':'Tsy voaloa'}</small></div>`}).join('')}</div>
 <div class="row c2e" style="margin-top:6px">
  <div><div class="sec-t">${ic('checks',16)} Fahatongavana</div><div class="stats" style="grid-template-columns:repeat(3,1fr)"><div class="stat g"><b>${at.P}</b><span>Tonga</span></div><div class="stat a"><b>${at.R}</b><span>Tara</span></div><div class="stat r"><b>${at.A}</b><span>Tsy tonga</span></div></div><div class="muted" style="margin-top:8px;font-size:12.5px">Taha: <b style="color:var(--ink)">${at.rate==null?'—':at.rate+'%'}</b></div></div>
  <div><div class="sec-t">${ic('award',16)} Naoty — Trimestra 1</div><div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><b>${f2(avg)}</b><span>Salan'isa /20</span></div><div class="stat"><b>${pos>=0&&avg!=null?(pos+1)+'<small style="font-size:13px;color:var(--muted)">/'+rk.length+'</small>':'—'}</b><span>Laharana</span></div></div><div style="margin-top:8px"><span class="badge ${mc}">${ml}</span></div></div>
 </div>`,`<button class="btn ghost" data-act="bulletin" data-sid="${s.id}" data-t="T1">${ic('file',16)} Kara-naoty</button><button class="btn ghost" data-act="editStudent" data-sid="${s.id}">${ic('edit',16)} Hanova</button><button class="btn pri" data-act="payFor" data-sid="${s.id}">${ic('card',16)} Andoavy</button>`,'lg');
}

/* ---------- classes ---------- */
V.kilasy=()=>{
 const st=active();
 return`<div class="toolbar"><div class="muted" style="flex:1">${S.classes.length} kilasy · ${st.length} mpianatra · Saram-pianarana andrasana isam-bolana: <b style="color:var(--ink)">${fmt(st.reduce((a,s)=>a+fee(s),0))}</b></div><button class="btn pri" data-act="newClass">${ic('plus',16)} Kilasy vaovao</button></div>
 <div class="cgrid">${S.classes.map(c=>{const ss=st.filter(s=>s.classId===c.id),b=ss.filter(s=>s.sex==='L').length,t=tea(c.teacherId),late=ss.filter(s=>lateMonths(s)>0).length;const pct=Math.min(100,ss.length/(c.capacity||30)*100);
 return`<div class="card ccard"><div class="band" style="background:${c.color||'#14b8a6'}"></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h4>${esc(c.name)}</h4><span class="muted" style="font-size:12.5px">${esc(c.room||'')}</span></div><div style="text-align:right"><b style="font-size:16px;color:${c.color||'#0f766e'}">${fmt(c.fee)}</b><div class="muted" style="font-size:11.5px">isam-bolana</div></div></div>
  <div class="meta"><div>${ic('user',15)} ${esc(t?.name||'Tsy voatendry')}</div><div>${ic('users',15)} ${ss.length} mpianatra · ${b} lahy, ${ss.length-b} vavy</div><div>${ic('alert',15)} ${late?`<span style="color:#b91c1c;font-weight:600">${late} tara nandoa</span>`:'<span style="color:#15803d;font-weight:600">Voaloa daholo</span>'}</div></div>
  <div style="display:flex;justify-content:space-between;font-size:12px" class="muted"><span>Fahafeno</span><span>${ss.length}/${c.capacity||30}</span></div><div class="bar" style="margin-bottom:14px"><i style="width:${pct}%;background:${c.color||'#14b8a6'}"></i></div>
  <div class="foot"><button class="btn ghost sm" data-act="classStudents" data-cid="${c.id}" style="flex:1">${ic('users',15)} Mpianatra</button><button class="icon-btn" data-act="editClass" data-cid="${c.id}">${ic('edit',16)}</button><button class="icon-btn del" data-act="delClass" data-cid="${c.id}">${ic('trash',16)}</button></div>
 </div>`}).join('')}</div>`;
};
function classForm(c){
 c=c||{capacity:30,fee:30000,color:CCOL[S.classes.length%CCOL.length]};
 openModal(c.id?'Hanova kilasy':'Kilasy vaovao',`<form data-form="class" id="fm"><input type="hidden" name="id" value="${c.id||''}"><div class="grid2">
  ${fld('Anaran\'ny kilasy *','name',c.name,'text','required placeholder="ohatra: 6ème A"')}
  ${fld('Efitrano','room',c.room,'text','placeholder="Efitra 1"')}
  ${fld('Saram-pianarana / volana (Ar) *','fee',c.fee,'number','required min="0" step="500"')}
  ${fld('Isan\'ny toerana','capacity',c.capacity,'number','min="1"')}
  ${sel('Mpampianatra tompon\'andraikitra','teacherId',[['','— Tsy misy —'],...S.teachers.map(t=>[t.id,t.name])],c.teacherId||'')}
  ${fld('Loko','color',c.color,'color','style="height:42px;padding:4px"')}
 </div></form>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn pri" type="submit" form="fm">${ic('check',16)} Tehirizina</button>`);
}

/* ---------- teachers ---------- */
V.mpampianatra=()=>{
 const q=ui.tq.trim().toLowerCase();
 const list=S.teachers.filter(t=>!q||`${t.name} ${t.subject} ${t.phone}`.toLowerCase().includes(q));
 return`<div class="toolbar"><div class="search">${ic('search',17)}<input id="tq" data-in="tq" placeholder="Hikaroka mpampianatra na taranja…" value="${esc(ui.tq)}"></div><button class="btn pri" data-act="newTeacher">${ic('plus',16)} Mpampianatra vaovao</button></div>
 <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Ekipan'ny mpampianatra</h3><small>${S.teachers.length} mpampianatra</small></div></div><div class="tw"><table class="t"><thead><tr><th>Mpampianatra</th><th>Taranja</th><th>Finday</th><th>Tompon'andraikitra</th><th>Nanomboka</th><th></th></tr></thead><tbody>
 ${list.length?list.map(t=>{const cs=S.classes.filter(c=>c.teacherId===t.id);return`<tr><td><div class="who">${avs(t.name,t.id)}<div><b>${esc(t.name)}</b><small>${esc(t.email||'')}</small></div></div></td><td><span class="badge b-blue nd">${esc(t.subject||'—')}</span></td><td>${esc(t.phone||'—')}</td><td>${cs.length?cs.map(c=>`<span class="badge b-teal nd" style="margin-right:4px">${esc(c.name)}</span>`).join(''):'<span class="muted">—</span>'}</td><td>${esc(t.since||'—')}</td><td><div class="acts"><button class="icon-btn" data-act="editTeacher" data-tid="${t.id}">${ic('edit',16)}</button><button class="icon-btn del" data-act="delTeacher" data-tid="${t.id}">${ic('trash',16)}</button></div></td></tr>`}).join(''):`<tr><td colspan="6">${emptyBox('brief','Tsy misy mpampianatra')}</td></tr>`}
 </tbody></table></div></div>`;
};
function teacherForm(t){
 t=t||{};
 openModal(t.id?'Hanova mpampianatra':'Mpampianatra vaovao',`<form data-form="teacher" id="fm"><input type="hidden" name="id" value="${t.id||''}"><div class="grid2">
  <div class="full">${fld('Anarana feno *','name',t.name,'text','required')}</div>
  ${fld('Taranja ampianarina','subject',t.subject,'text','list="subjl"')}<datalist id="subjl">${S.subjects.map(s=>`<option value="${esc(s.name)}">`).join('')}</datalist>
  ${fld('Finday','phone',t.phone,'tel')}
  ${fld('Mailaka','email',t.email,'email')}
  ${fld('Taona nanombohana','since',t.since,'text','placeholder="2020"')}
 </div></form>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn pri" type="submit" form="fm">${ic('check',16)} Tehirizina</button>`);
}

/* ---------- payments ---------- */
V.sarany=()=>{
 const lateN=active().filter(s=>lateMonths(s)>0).length;
 const tabs=[['vaovao','Fandoavana vaovao','plus'],['tara','Tsy mbola nandoa','alert'],['tabilao','Tabilao isam-bolana','cal'],['rosia','Rosia rehetra','file']];
 const head=`<div class="toolbar"><div class="tabs">${tabs.map(([k,l,i])=>`<button class="${ui.payTab===k?'on':''}" data-act="payTab" data-k="${k}">${ic(i,15)} ${l}${k==='tara'&&lateN?` <em>${lateN}</em>`:''}</button>`).join('')}</div></div>`;
 return head+(ui.payTab==='tara'?payLate():ui.payTab==='tabilao'?payGrid():ui.payTab==='rosia'?payList(999):payNew());
};
function stuOptions(selId){return`<option value="">— Safidio ny mpianatra —</option>`+S.classes.map(c=>`<optgroup label="${esc(c.name)}">${S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b))).map(s=>`<option value="${s.id}" ${s.id===selId?'selected':''}>${esc(fullName(s))} · ${esc(s.matricule)}${lateMonths(s)?' ⚠':''}</option>`).join('')}</optgroup>`).join('')}
function monthsPick(sid){
 const s=stu(sid);if(!s)return`<div class="hint">Safidio aloha ny mpianatra mba hahitana ny volana tsy mbola voaloa.</div>`;
 const f=fee(s);
 return`<div class="months">${MONTHS.map((m,i)=>{const st=mstat(s,i),p=paid(s.id,i),ck=ui.payMonths.includes(i);
  return`<label class="mchip ${st}">${st!=='paid'?`<input type="checkbox" data-ch="pmon" value="${i}" ${ck?'checked':''}>`:''}${MSHORT[i]}<small>${st==='paid'?'✓ Voaloa':st==='partial'?'Sisa '+short(f-p):st==='skip'?'Tsy voakasika':short(f)}</small></label>`}).join('')}</div>`;
}
const selRemain=()=>{const s=stu(ui.paySid);if(!s)return 0;return ui.payMonths.reduce((a,m)=>a+Math.max(0,fee(s)-paid(s.id,m)),0)};
function payInfo(){const s=stu(ui.paySid);if(!s)return'';const c=cls(s.classId);return`<div class="li" style="border:1px solid var(--line);border-radius:12px;padding:10px 12px">${avs(fullName(s),s.id)}<div class="who"><div><b>${esc(fullName(s))}</b><small>${esc(c?.name||'')} · ${fmt(fee(s))}/volana · ${esc(s.parent||'')}</small></div></div><div class="r">${lateMonths(s)?`<b style="color:#b91c1c">${fmt(dueAmount(s))}</b><small>trosa</small>`:`<span class="badge b-green">Voaloa</span>`}</div></div>`}
function payNew(){
 return`<div class="row c2r">
 <div class="card"><div class="card-h"><div><h3>Handray saram-pianarana</h3><small>Mamorona rosia ho an'ny ray aman-dreny</small></div></div>
 <form data-form="pay" id="payf" style="display:flex;flex-direction:column;gap:14px">
  <label class="fld"><span>Mpianatra</span><select name="sid" data-ch="pstu" required>${stuOptions(ui.paySid)}</select></label>
  <div id="pinfo">${payInfo()}</div>
  <div class="fld"><span>Volana aloa</span><div id="pmonths">${monthsPick(ui.paySid)}</div></div>
  <div class="grid2">
   <label class="fld"><span>Vola (Ar)</span><input name="amount" id="pamt" type="number" min="0" step="100" value="${selRemain()||''}" required></label>
   <label class="fld"><span>Daty</span><input name="date" type="date" value="${today()}" required></label>
  </div>
  <label class="fld"><span>Fomba fandoavana</span><select name="mode">${MODES.map(m=>`<option>${m}</option>`).join('')}</select></label>
  <div class="sumbox"><span class="muted">Totaly aloa</span><b id="ptot">${fmt(selRemain())}</b></div>
  <button class="btn pri block" style="padding:13px">${ic('check',16)} Ekena sy hamoaka rosia</button>
 </form></div>
 ${payList(10)}
 </div>`;
}
function payList(limit){
 const rs=receipts(),total=rs.reduce((a,r)=>a+r.amount,0);
 return`<div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>${limit>50?'Rosia rehetra':'Rosia farany'}</h3><small>${rs.length} rosia · ${fmt(total)} voaray tamin'ity taona ity</small></div></div>
 <div class="tw"><table class="t"><thead><tr><th>N°</th><th>Mpianatra</th><th>Volana</th><th class="num">Vola</th><th>Fomba</th><th>Daty</th><th></th></tr></thead><tbody>
 ${rs.length?rs.slice(0,limit).map(r=>{const s=stu(r.studentId);return`<tr><td><b style="font-family:ui-monospace,monospace;font-size:12.5px;color:var(--pri2)">${r.rec}</b></td><td><div class="who">${avs(fullName(s),r.studentId)}<div><b>${esc(fullName(s))}</b><small>${esc(cls(s?.classId)?.name||'')}</small></div></div></td><td>${r.months.sort((a,b)=>a-b).map(m=>`<span class="badge b-teal nd" style="margin:1px">${MSHORT[m]}</span>`).join('')}</td><td class="num"><b>${fmt(r.amount)}</b></td><td><span class="muted" style="white-space:nowrap">${esc(r.mode)}</span></td><td>${fmtDate(r.date)}</td><td><div class="acts"><button class="icon-btn" data-act="receipt" data-rec="${r.rec}" title="Jereo">${ic('eye',16)}</button><button class="icon-btn del" data-act="delReceipt" data-rec="${r.rec}" title="Foanana">${ic('trash',16)}</button></div></td></tr>`}).join(''):`<tr><td colspan="7">${emptyBox('card','Tsy mbola misy rosia')}</td></tr>`}
 </tbody></table></div></div>`;
}
function payLate(){
 const cm=curMonthIdx();if(ui.lateM===null)ui.lateM=Math.min(cm,9);
 const m=ui.lateM;
 const list=active().filter(s=>(!ui.lateC||s.classId===ui.lateC)&&!['paid','skip'].includes(mstat(s,m))).map(s=>({s,due:Math.max(0,fee(s)-paid(s.id,m)),p:paid(s.id,m),tot:dueAmount(s),n:lateMonths(s)})).sort((a,b)=>b.tot-a.tot);
 const total=list.reduce((a,x)=>a+x.due,0);
 return`<div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Tsy mbola nandoa — ${MONTHS[m]}</h3><small>${list.length} mpianatra · ${fmt(total)} tokony ho voaray</small></div>
 <div class="toolbar"><select class="inp" data-ch="lateM">${MONTHS.map((mm,i)=>`<option value="${i}" ${i===m?'selected':''}>${mm}${i>cm?' (ho avy)':''}</option>`).join('')}</select><select class="inp" data-ch="lateC">${clsOpts(ui.lateC,'Kilasy rehetra')}</select><button class="btn ghost" data-act="copyLate">${ic('copy',16)} Adikao (SMS)</button></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Mpianatra</th><th>Kilasy</th><th>Ray aman-dreny</th><th class="num">Efa naloa</th><th class="num">Sisa (${MSHORT[m]})</th><th class="num">Trosa rehetra</th><th></th></tr></thead><tbody>
 ${list.length?list.map(x=>`<tr><td><div class="who">${avs(fullName(x.s),x.s.id)}<div><b>${esc(fullName(x.s))}</b><small>${esc(x.s.matricule)}</small></div></div></td><td>${esc(cls(x.s.classId)?.name||'')}</td><td>${esc(x.s.parent||'—')}<div class="muted" style="font-size:12px">${ic('phone',12)} ${esc(x.s.phone||'—')}</div></td><td class="num">${x.p?fmt(x.p):'<span class="muted">—</span>'}</td><td class="num"><b style="color:#b91c1c">${fmt(x.due)}</b></td><td class="num">${fmt(x.tot)}<div class="muted" style="font-size:11.5px">${x.n} volana</div></td><td><button class="btn pri sm" data-act="payFor" data-sid="${x.s.id}" data-m="${m}">Andoavy</button></td></tr>`).join(''):`<tr><td colspan="7">${emptyBox('check','Voaloa daholo! 🎉',`Tsy misy tara amin'ny ${MONTHS[m]}`)}</td></tr>`}
 </tbody></table></div></div>`;
}
function payGrid(){
 if(!ui.gridC)ui.gridC=S.classes[0]?.id||'';
 const c=cls(ui.gridC);if(!c)return emptyBox('layers','Tsy misy kilasy');
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 const tots=MONTHS.map((m,i)=>ss.reduce((a,s)=>a+paid(s.id,i),0));
 return`<div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Tabilao fandoavana — ${esc(c.name)}</h3><small>${ss.length} mpianatra · ${fmt(c.fee)}/volana · Tsindrio ny efajoro mena raha handoa</small></div>
 <div class="toolbar"><div class="legend"><span><i style="background:#dcfce7"></i>Voaloa</span><span><i style="background:#fef3c7"></i>Ampahany</span><span><i style="background:#fee2e2"></i>Tsy voaloa</span><span><i style="background:#f1f5f9"></i>Ho avy</span></div><select class="inp" data-ch="gridC">${clsOpts(ui.gridC)}</select></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Mpianatra</th>${MSHORT.map(m=>`<th class="ctr">${m}</th>`).join('')}<th class="num">Trosa</th></tr></thead><tbody>
 ${ss.map(s=>`<tr><td><div class="who">${avs(fullName(s),s.id)}<b>${esc(fullName(s))}</b></div></td>${MONTHS.map((m,i)=>{const st=mstat(s,i);return`<td class="ctr"><span class="pc ${st}" ${st!=='paid'?`data-act="payFor" data-sid="${s.id}" data-m="${i}"`:''} title="${MONTHS[i]}: ${fmt(paid(s.id,i))}">${st==='paid'?'✓':st==='partial'?short(paid(s.id,i)):st==='future'||st==='skip'?'·':'✕'}</span></td>`}).join('')}<td class="num">${dueAmount(s)?`<b style="color:#b91c1c">${fmt(dueAmount(s))}</b>`:'<span class="badge b-green nd">0</span>'}</td></tr>`).join('')}
 <tr style="background:#f8faf9"><td><b>Totaly voaray</b></td>${tots.map(t=>`<td class="ctr" style="font-size:11.5px;font-weight:700;color:var(--pri2)">${t?short(t):'—'}</td>`).join('')}<td></td></tr>
 </tbody></table></div></div>`;
}
function showReceipt(rec){
 const ps=S.payments.filter(p=>p.rec===rec);if(!ps.length)return;
 const s=stu(ps[0].studentId),c=cls(s?.classId),total=ps.reduce((a,p)=>a+p.amount,0);
 openModal('Rosia '+rec,`<div class="receipt">
  <div class="rc-h"><div class="logo">${ic('cap',20)}</div><div><b>${esc(S.school.name)}</b><small>${esc(S.school.address)} · ${esc(S.school.phone)}</small></div><div class="rc-no">N° ${rec}<small class="muted">${fmtDate(ps[0].date)}</small></div></div>
  <div class="rc-row"><span>Mpianatra</span><b>${esc(fullName(s))}</b></div>
  <div class="rc-row"><span>Laharana</span><b>${esc(s?.matricule||'')}</b></div>
  <div class="rc-row"><span>Kilasy</span><b>${esc(c?.name||'')}</b></div>
  <div class="rc-row"><span>Taom-pianarana</span><b>${esc(S.school.year)}</b></div>
  <div style="border-top:1px solid var(--line);margin:10px 0"></div>
  ${ps.sort((a,b)=>a.month-b.month).map(p=>`<div class="rc-row"><span>Saram-pianarana ${MONTHS[p.month]}${p.amount<fee(s)?' (ampahany)':''}</span><b>${fmt(p.amount)}</b></div>`).join('')}
  <div class="rc-total"><span>Totaly voaray</span><b>${fmt(total)}</b></div>
  <div class="rc-row"><span>Fomba fandoavana</span><b>${esc(ps[0].mode)}</b></div>
  <div class="rc-row"><span>Nandray</span><b>${esc(user.name)}</b></div>
  <div class="rc-foot">Misaotra tompoko! · ${esc(S.school.motto||'')}</div>
 </div>`,`<button class="btn ghost" data-act="copyRec" data-rec="${rec}">${ic('copy',16)} Adikao (SMS)</button><button class="btn pri" data-act="close">Vita</button>`);
}

/* ---------- attendance ---------- */
V.fiantsoana=()=>{
 if(!ui.attC)ui.attC=S.classes[0]?.id||'';if(!ui.attD)ui.attD=today();
 const c=cls(ui.attC);if(!c)return emptyBox('layers','Tsy misy kilasy');
 const key=c.id+'|'+ui.attD,rec=S.attendance[key]||{};
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 const cnt={P:0,R:0,A:0};ss.forEach(s=>{if(rec[s.id])cnt[rec[s.id]]++});const un=ss.length-cnt.P-cnt.R-cnt.A;
 const dd=new Date(ui.attD+'T12:00:00'),we=dd.getDay()===0||dd.getDay()===6;
 const hist=attDates().filter(d=>S.attendance[c.id+'|'+d]).slice(-10);
 const abs=ss.map(s=>({s,a:studentAtt(s)})).filter(x=>x.a.A>0).sort((a,b)=>b.a.A-a.a.A).slice(0,5);
 return`<div class="toolbar"><select class="inp" data-ch="attC">${clsOpts(ui.attC)}</select><input class="inp" style="width:auto" type="date" data-ch="attD" value="${ui.attD}" max="${today()}"><span class="chip">${ic('cal',14)} ${dateLong(dd)}</span><div style="flex:1"></div><button class="btn ghost" data-act="attClear">Fafana</button><button class="btn pri" data-act="attAll">${ic('check',16)} Tonga daholo</button></div>
 ${we?`<div class="hint">⚠ Faran'ny herinandro ity daty ity. Azonao atao ihany ny manao fiantsoana raha nisy fianarana.</div>`:''}
 <div class="stats"><div class="stat g"><b>${cnt.P}</b><span>Tonga</span></div><div class="stat a"><b>${cnt.R}</b><span>Tara</span></div><div class="stat r"><b>${cnt.A}</b><span>Tsy tonga</span></div><div class="stat"><b>${un}</b><span>Tsy voamarika</span></div></div>
 <div class="row c2">
 <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>${esc(c.name)} — Lisitra</h3><small>${ss.length} mpianatra · Voatahiry ho azy ny fanovana</small></div></div>
 <div class="tw"><table class="t"><tbody>${ss.length?ss.map((s,i)=>{const v=rec[s.id];return`<tr><td style="width:36px" class="muted">${i+1}</td><td><div class="who">${avs(fullName(s),s.id)}<div><b>${esc(fullName(s))}</b><small>${esc(s.matricule)}</small></div></div></td><td style="text-align:right"><div class="seg"><button class="P ${v==='P'?'on':''}" data-act="att" data-sid="${s.id}" data-v="P">✓ Tonga</button><button class="R ${v==='R'?'on':''}" data-act="att" data-sid="${s.id}" data-v="R">⏱ Tara</button><button class="A ${v==='A'?'on':''}" data-act="att" data-sid="${s.id}" data-v="A">✕ Tsy tonga</button></div></td></tr>`}).join(''):`<tr><td>${emptyBox('users','Tsy misy mpianatra amin\'ity kilasy ity')}</td></tr>`}</tbody></table></div></div>
 <div style="display:flex;flex-direction:column;gap:20px">
  <div class="card"><div class="card-h"><div><h3>Tantara</h3><small>Fiantsoana ${hist.length} farany</small></div></div>
  ${hist.length?hist.map(d=>{const r=S.attendance[c.id+'|'+d],v=Object.values(r),ok=v.filter(x=>x!=='A').length,p=v.length?Math.round(ok/v.length*100):0;return`<div class="crow" style="grid-template-columns:92px 1fr 44px;cursor:pointer" data-act="attGo" data-d="${d}"><b style="font-weight:500">${fmtDate(d).slice(0,5)} <span class="muted" style="font-size:11px">${DAYS[new Date(d+'T12:00').getDay()].slice(0,3)}</span></b><div class="bar"><i style="width:${p}%;background:${p>=90?'#16a34a':p>=75?'#f59e0b':'#ef4444'}"></i></div><span>${p}%</span></div>`}).join(''):emptyBox('clock','Tsy mbola misy','').replace('class="empty"','class="empty sm"')}
  </div>
  <div class="card"><div class="card-h"><div><h3>Matetika tsy tonga</h3><small>Ilaina ny miresaka amin'ny ray aman-dreny</small></div></div>
  <div class="list">${abs.length?abs.map(x=>`<div class="li">${avs(fullName(x.s),x.s.id)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${esc(x.s.phone||'')}</small></div></div><div class="r"><span class="badge b-red nd">${x.a.A} andro</span></div></div>`).join(''):'<div class="muted" style="font-size:13px">Tsy misy 👍</div>'}</div></div>
 </div></div>`;
};

/* ---------- grades ---------- */
V.naoty=()=>{
 if(!ui.gC)ui.gC=S.classes[0]?.id||'';if(!ui.gS)ui.gS=S.subjects[0]?.id||'';
 const c=cls(ui.gC);if(!c)return emptyBox('layers','Tsy misy kilasy');
 const head=`<div class="toolbar"><div class="tabs"><button class="${ui.gTab==='ampidiro'?'on':''}" data-act="gTab" data-k="ampidiro">${ic('edit',15)} Hampiditra naoty</button><button class="${ui.gTab==='kara'?'on':''}" data-act="gTab" data-k="kara">${ic('award',15)} Kara-naoty & laharana</button></div><div style="flex:1"></div><select class="inp" data-ch="gC">${clsOpts(ui.gC)}</select><select class="inp" data-ch="gT">${TERMS.map(([k,l])=>`<option value="${k}" ${ui.gT===k?'selected':''}>${l}</option>`).join('')}</select></div>`;
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 if(ui.gTab==='kara'){
  const rk=ranking(c.id,ui.gT);const avgs=rk.filter(x=>x.avg!=null).map(x=>x.avg);const cAvg=avgs.length?avgs.reduce((a,b)=>a+b,0)/avgs.length:null;const pass=avgs.filter(a=>a>=10).length;
  return head+`<div class="stats"><div class="stat"><b>${f2(cAvg)}</b><span>Salan'isan'ny kilasy</span></div><div class="stat g"><b>${avgs.length?f2(Math.max(...avgs)):'—'}</b><span>Ambony indrindra</span></div><div class="stat r"><b>${avgs.length?f2(Math.min(...avgs)):'—'}</b><span>Ambany indrindra</span></div><div class="stat a"><b>${avgs.length?Math.round(pass/avgs.length*100)+'%':'—'}</b><span>Nahazo ≥ 10</span></div></div>
  <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Laharana — ${esc(c.name)} · ${TERMS.find(t=>t[0]===ui.gT)[1]}</h3><small>Tsindrio ny anarana raha hijery ny kara-naoty</small></div></div>
  <div class="tw"><table class="t"><thead><tr><th>#</th><th>Mpianatra</th>${S.subjects.map(sb=>`<th class="ctr" title="${esc(sb.name)}">${esc(sb.name.slice(0,4))}.<div style="font-size:10px;text-transform:none">×${sb.coef}</div></th>`).join('')}<th class="num">Salan'isa</th><th>Fanamarihana</th></tr></thead><tbody>
  ${rk.map((x,i)=>{const[ml,mc]=mention(x.avg);return`<tr class="click" data-act="bulletin" data-sid="${x.s.id}" data-t="${ui.gT}"><td><span class="rank ${x.avg!=null&&i<3?'g'+(i+1):''}">${x.avg!=null?i+1:'—'}</span></td><td><div class="who">${avs(fullName(x.s),x.s.id)}<b>${esc(fullName(x.s))}</b></div></td>${S.subjects.map(sb=>{const v=(S.grades[gk(c.id,ui.gT,sb.id)]||{})[x.s.id];return`<td class="ctr" style="${v!=null&&v<10?'color:#b91c1c;font-weight:600':''}">${v!=null?String(v).replace('.',','):'<span class="muted">—</span>'}</td>`}).join('')}<td class="num"><b style="font-size:15px">${f2(x.avg)}</b></td><td><span class="badge ${mc}">${ml}</span></td></tr>`}).join('')}
  </tbody></table></div></div>`;
 }
 const sb=S.subjects.find(x=>x.id===ui.gS)||S.subjects[0];
 const g=S.grades[gk(c.id,ui.gT,sb?.id)]||{};
 const vals=ss.map(s=>g[s.id]).filter(v=>v!=null&&v!=='');const av=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
 return head+`<div class="row c2"><div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>${esc(sb?.name||'')} — ${esc(c.name)}</h3><small>Naoty /20 · Koefisianta ${sb?.coef||1} · Voatahiry ho azy</small></div>
 <select class="inp" data-ch="gS">${S.subjects.map(x=>`<option value="${x.id}" ${x.id===sb?.id?'selected':''}>${esc(x.name)} (×${x.coef})</option>`).join('')}</select></div>
 <div class="tw"><table class="t"><thead><tr><th>#</th><th>Mpianatra</th><th class="ctr">Naoty /20</th><th>Fanamarihana</th></tr></thead><tbody>
 ${ss.map((s,i)=>{const v=g[s.id];const[ml,mc]=mention(v==null||v===''?null:v);return`<tr><td class="muted">${i+1}</td><td><div class="who">${avs(fullName(s),s.id)}<b>${esc(fullName(s))}</b></div></td><td class="ctr"><input class="ginp ${v!=null&&v!==''?(v<10?'low':v>=14?'hi':''):''}" type="number" min="0" max="20" step="0.25" value="${v??''}" data-ch="grade" data-sid="${s.id}" placeholder="—"></td><td><span class="badge ${mc}" id="gm-${s.id}">${ml}</span></td></tr>`}).join('')}
 </tbody></table></div></div>
 <div style="display:flex;flex-direction:column;gap:20px"><div class="card"><div class="card-h"><h3>Antontan'isa</h3></div>
 <div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><b>${f2(av)}</b><span>Salan'isa</span></div><div class="stat"><b>${vals.length}/${ss.length}</b><span>Voafeno</span></div><div class="stat g"><b>${vals.length?String(Math.max(...vals)).replace('.',','):'—'}</b><span>Ambony</span></div><div class="stat r"><b>${vals.length?String(Math.min(...vals)).replace('.',','):'—'}</b><span>Ambany</span></div></div></div>
 <div class="card"><div class="card-h"><h3>Taranja rehetra</h3></div><div class="list">${S.subjects.map(x=>{const gg=S.grades[gk(c.id,ui.gT,x.id)]||{};const n=ss.filter(s=>gg[s.id]!=null&&gg[s.id]!=='').length;return`<div class="li" style="cursor:pointer;padding:8px 0" data-act="gSub" data-k="${x.id}"><div class="ki ${x.id===sb?.id?'teal':'blue'}" style="width:32px;height:32px;border-radius:9px;display:grid;place-items:center">${ic('book',15)}</div><div><b style="font-size:13px">${esc(x.name)}</b><div class="muted" style="font-size:11.5px">×${x.coef}</div></div><div class="r">${n===ss.length&&ss.length?'<span class="badge b-green nd">✓ Feno</span>':`<span class="badge b-gray nd">${n}/${ss.length}</span>`}</div></div>`}).join('')}</div></div></div></div>`;
};
function bulletin(sid,t){
 const s=stu(sid);if(!s)return;const c=cls(s.classId);const rk=ranking(c.id,t),pos=rk.findIndex(x=>x.s.id===sid),avg=avgOf(sid,c.id,t),[ml,mc]=mention(avg);
 let tc=0,tp=0;
 const rows=S.subjects.map(sb=>{const v=(S.grades[gk(c.id,t,sb.id)]||{})[sid];const has=v!=null&&v!=='';if(has){tc+=sb.coef;tp+=v*sb.coef}return`<tr><td>${esc(sb.name)}</td><td class="ctr">${sb.coef}</td><td class="ctr" style="${has&&v<10?'color:#b91c1c;font-weight:700':'font-weight:600'}">${has?String(v).replace('.',','):'—'}</td><td class="num">${has?(v*sb.coef).toFixed(2).replace('.',','):'—'}</td></tr>`}).join('');
 openModal('Kara-naoty',`<div class="receipt" style="--x:0"><style>.receipt::after{display:none}</style>
 <div class="bul-h"><h2>${esc(S.school.name)}</h2><p>${esc(S.school.address)} · ${esc(S.school.phone)}</p><h3>KARA-NAOTY · ${TERMS.find(x=>x[0]===t)[1].toUpperCase()}</h3><p>Taom-pianarana ${esc(S.school.year)}</p></div>
 <div class="info"><div><span>Mpianatra</span><b>${esc(fullName(s))}</b></div><div><span>Kilasy</span><b>${esc(c.name)}</b></div><div><span>Laharana</span><b>${esc(s.matricule)}</b></div></div>
 <table class="t" style="border:1px solid var(--line);border-radius:12px;overflow:hidden"><thead><tr><th>Taranja</th><th class="ctr">Koef.</th><th class="ctr">Naoty /20</th><th class="num">Naoty × Koef.</th></tr></thead><tbody>${rows}
 <tr style="background:#f8faf9"><td><b>Totaly</b></td><td class="ctr"><b>${tc}</b></td><td></td><td class="num"><b>${tp.toFixed(2).replace('.',',')}</b></td></tr></tbody></table>
 <div class="stats" style="grid-template-columns:repeat(3,1fr);margin-top:14px"><div class="stat"><b>${f2(avg)}</b><span>Salan'isa /20</span></div><div class="stat"><b>${pos>=0&&avg!=null?(pos+1)+' / '+rk.length:'—'}</b><span>Laharana</span></div><div class="stat"><b style="font-size:15px;margin-top:6px"><span class="badge ${mc}">${ml}</span></b><span>Fanamarihana</span></div></div>
 <div style="display:flex;justify-content:space-between;margin-top:22px;font-size:12.5px" class="muted"><div>Ray aman-dreny<br><br>…………………</div><div style="text-align:right">Ny Tale, ${esc(S.school.director||'')}<br><br>…………………</div></div>
 </div>`,`<button class="btn ghost" data-act="copyBul" data-sid="${sid}" data-t="${t}">${ic('copy',16)} Adikao</button><button class="btn pri" data-act="close">Vita</button>`,'lg');
}

/* ---------- settings ---------- */
V.fikirakirana=()=>{
 const sc=S.school;
 const acct=`<div class="card"><div class="card-h"><div><h3>Kaontiko</h3><small>${esc(user.login)} · ${esc(ROLES[user.role]||user.role)}</small></div></div>
 <form data-form="account" style="display:flex;flex-direction:column;gap:12px">${fld('Anarana miseho','name',user.name,'text','required')}${fld('Teny miafina ankehitriny','old','','password','autocomplete="current-password"')}${fld('Teny miafina vaovao (6+, raha hovaina)','pass','','password','minlength="6" autocomplete="new-password"')}<div><button class="btn pri">${ic('lock',16)} Tehirizina</button></div></form></div>`;
 if(!isAdmin())return`<div class="set-grid"><div class="set-col">${acct}</div><div class="set-col"><div class="card"><div class="card-h"><h3>${esc(sc.name)}</h3></div><p class="muted" style="margin:0">Kaody: <b>${esc(SCHOOL)}</b> · ${esc(sc.year)}<br>Ny Tale/Mpitantana ihany no afaka manova ny fikirakirana ankapobeny.</p></div></div></div>`;
 const mem=Object.entries(S.members||{}).sort((a,b)=>(a[1].role==='Admin'?0:1)-(b[1].role==='Admin'?0:1));
 return`<div class="set-grid"><div class="set-col">
 <div class="card"><div class="card-h"><div><h3>Momba ny sekoly</h3><small>Miseho amin'ny rosia sy kara-naoty</small></div></div>
 <form data-form="school" style="display:flex;flex-direction:column;gap:14px"><div class="grid2">
  ${fld('Anaran\'ny sekoly *','name',sc.name,'text','required')}
  ${fld('Kaody sekoly (fidirana)','code',SCHOOL,'text','readonly style="background:#f1f5f4;cursor:not-allowed"')}
  ${fld('Tale','director',sc.director)}
  ${fld('Taom-pianarana','year',sc.year,'text','placeholder="2026-2027"')}
  ${fld('Finday','phone',sc.phone,'tel')}
  ${fld('Mailaka','email',sc.email,'email')}
  <div class="full">${fld('Adiresy','address',sc.address)}</div>
  <div class="full">${fld('Teny filamatra','motto',sc.motto)}</div>
 </div><div><button class="btn pri">${ic('check',16)} Tehirizina</button></div></form></div>
 <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Taranja sy koefisianta</h3><small>Ampiasaina amin'ny kajy salan'isa</small></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Taranja</th><th class="ctr">Koefisianta</th><th></th></tr></thead><tbody>
 ${S.subjects.map(sb=>`<tr><td><b>${esc(sb.name)}</b></td><td class="ctr"><input class="ginp" type="number" min="1" max="10" value="${sb.coef}" data-ch="coef" data-id="${sb.id}" style="width:70px"></td><td><div class="acts"><button class="icon-btn del" data-act="delSubject" data-id="${sb.id}">${ic('trash',16)}</button></div></td></tr>`).join('')}
 </tbody></table></div>
 <form data-form="subject" style="display:flex;gap:10px;padding:14px 20px;border-top:1px solid var(--line);flex-wrap:wrap"><input class="inp" style="flex:1;min-width:160px" name="name" placeholder="Taranja vaovao…" required><input class="inp" style="width:90px" type="number" name="coef" min="1" max="10" value="1"><button class="btn ghost">${ic('plus',16)} Ampio</button></form></div>
 </div>
 <div class="set-col">
 ${acct}
 <div class="card np"><div class="card-h" style="padding-bottom:14px"><div><h3>Mpampiasa</h3><small>Ireo afaka miditra amin'ny kaody ${esc(SCHOOL)}</small></div><button class="btn pri sm" data-act="newUser">${ic('plus',15)} Vaovao</button></div>
 <div class="list" style="padding:0 20px 8px">${mem.map(([uid,m])=>`<div class="li">${avs(m.name,uid)}<div class="who"><div><b>${esc(m.name)}</b><small>${esc(m.login)} · ${esc(ROLES[m.role]||m.role)}</small></div></div><div class="r">${uid===user.uid?'<span class="badge b-teal nd">Ianao</span>':uid===S.owner?'<span class="badge b-gray nd">Tompony</span>':`<button class="icon-btn del" data-act="delUser" data-uid="${uid}">${ic('trash',15)}</button>`}</div></div>`).join('')}</div></div>
 <div class="card"><div class="card-h"><div><h3>Angona</h3><small>Voatahiry ao amin'ny Firebase (cloud) ary mifandray amin'ny fitaovana rehetra</small></div></div>
 <div class="danger-zone">
  <div class="dz"><div><b>Hanao backup</b><small>Adikao ny angona rehetra (JSON)</small></div><button class="btn ghost sm" data-act="export">${ic('copy',15)} Adikao</button></div>
  <div class="dz"><div><b>Hampiditra backup</b><small>Apetaho ny JSON efa voatahiry</small></div><button class="btn ghost sm" data-act="import">${ic('upload',15)} Ampidiro</button></div>
  <div class="dz"><div><b>Angona santionany</b><small>Averina amin'ny ohatra voalohany</small></div><button class="btn ghost sm" data-act="resetDemo">${ic('refresh',15)} Averina</button></div>
  <div class="dz" style="border-color:#fecaca;background:#fffafa"><div><b style="color:#b91c1c">Fafana daholo</b><small>Mpianatra, vola, naoty… (tsy voaverina)</small></div><button class="btn soft-red sm" data-act="wipe">${ic('trash',15)} Fafana</button></div>
 </div></div>
 </div></div>`;
};

/* =========================================================
   MODAL / TOAST / CONFIRM
   ========================================================= */
function openModal(title,body,foot,size=''){
 $('#modal').innerHTML=`<div class="ov" data-ov="1"><div class="mdl ${size}"><div class="mdl-h"><h3>${title}</h3><button class="icon-btn" data-act="close">${ic('x',16)}</button></div><div class="mdl-b">${body}</div>${foot?`<div class="mdl-f">${foot}</div>`:''}</div></div>`;
 const f=$('#modal input:not([type=hidden])');if(f&&!f.value)setTimeout(()=>f.focus(),50);
}
const closeModal=()=>{$('#modal').innerHTML=''};
let confirmCb=null;
function confirmBox(msg,cb,ok='Ekena',danger=true){confirmCb=cb;openModal('Fanamafisana',`<div style="display:flex;gap:14px;align-items:flex-start"><div class="ki ${danger?'red':'teal'}" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;flex:none">${ic('alert',20)}</div><p style="margin:4px 0 0;line-height:1.6">${msg}</p></div>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn ${danger?'danger':'pri'}" data-act="confirmOk">${ok}</button>`,'sm')}
function toast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.innerHTML=`<div class="ti">${ic(err?'x':'check',14)}</div>${esc(msg)}`;$('#toasts').appendChild(t);setTimeout(()=>{t.style.transition='.3s';t.style.opacity='0';t.style.transform='translateY(8px)'},2600);setTimeout(()=>t.remove(),3000)}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Voadika ao amin\'ny presse-papier')}catch(e){openModal('Adikao ity lahatsoratra ity',`<textarea class="ta" readonly onclick="this.select()">${esc(t)}</textarea>`,`<button class="btn pri" data-act="close">Vita</button>`)}}

/* =========================================================
   ACTIONS
   ========================================================= */
const A={
 close:closeModal,
 side:()=>{ui.side=!ui.side;render()},
 logout:()=>confirmBox('Hivoaka amin\'ny kaonty ve ianao?',()=>{loginErr='';loginMode='login';signOut(auth)},'Hivoaka',false),
 lmode:d=>{loginMode=d.k;loginErr='';lf={};render()},
 newUser:()=>openModal('Mpampiasa vaovao',`<form data-form="addUser" id="fm"><div class="grid2"><div class="full">${fld('Anarana feno *','name','','text','required')}</div>${fld('Anarana fidirana *','login','','text','required pattern="[A-Za-z0-9._\\-]{2,30}"')}${fld('Teny miafina * (6+)','pass','','text','required minlength="6"')}<div class="full">${sel('Andraikitra','role',Object.entries(ROLES),'Kasie')}</div></div><p class="muted" style="font-size:12.5px;margin:14px 0 0">Hiditra amin'ny kaody <b>${esc(SCHOOL)}</b> + ny anarana fidirana sy teny miafina ireo izy.</p></form>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn pri" type="submit" form="fm">${ic('check',16)} Hamorona</button>`),
 delUser:d=>{const m=S.members[d.uid];confirmBox(`Hesorina ny fidiran'i <b>${esc(m.name)}</b> (${esc(m.login)}) ve?`,async()=>{try{await updateDoc(doc(db,'schools',SCHOOL),{['members.'+d.uid]:deleteField()});toast('Voaesotra')}catch(e){toast(fbMsg(e),1)}},'Esory')},
 pw:(d,el)=>{const i=$('#lpass');i.type=i.type==='password'?'text':'password';el.innerHTML=ic(i.type==='password'?'eye':'eyeoff',17)},
  confirmOk:()=>{const cb=confirmCb;confirmCb=null;closeModal();cb&&cb()},
 goPay:()=>{ui.payTab='vaovao';location.hash='sarany';render()},
 goLate:()=>{ui.payTab='tara';location.hash='sarany';render()},
 newStudent:()=>studentForm(),
 editStudent:d=>studentForm(stu(d.sid)),
 viewStudent:(d,el,e)=>{if(e.target.closest('.acts'))return;viewStudent(d.sid)},
 delStudent:d=>{const s=stu(d.sid);confirmBox(`Hamafa an'i <b>${esc(fullName(s))}</b> ve? Ho voafafa koa ny fandoavany sy ny naotiny.`,()=>{S.students=S.students.filter(x=>x.id!==s.id);S.payments=S.payments.filter(p=>p.studentId!==s.id);save();render();toast('Voafafa ny mpianatra')},'Fafana')},
 payFor:d=>{ui.payTab='vaovao';ui.paySid=d.sid;const s=stu(d.sid);ui.payMonths=d.m!==undefined?[+d.m]:(()=>{for(let m=0;m<10;m++)if(!['paid','skip'].includes(mstat(s,m)))return[m];return[]})();closeModal();if(route()!=='sarany')location.hash='sarany';else render();window.scrollTo({top:0,behavior:'smooth'})},
 payTab:d=>{ui.payTab=d.k;render()},
 receipt:d=>showReceipt(d.rec),
 delReceipt:d=>confirmBox(`Hofoanana ny rosia <b>${d.rec}</b> ve? Hiverina ho tsy voaloa ireo volana voakasika.`,()=>{S.payments=S.payments.filter(p=>p.rec!==d.rec);save();render();toast('Voafoana ny rosia')},'Foanana'),
 copyRec:d=>{const ps=S.payments.filter(p=>p.rec===d.rec),s=stu(ps[0]?.studentId);copyText(`${S.school.name}\nRosia N° ${d.rec} — ${fmtDate(ps[0]?.date)}\nMpianatra: ${fullName(s)} (${cls(s?.classId)?.name||''})\n${ps.map(p=>`${MONTHS[p.month]}: ${fmt(p.amount)}`).join('\n')}\nTotaly: ${fmt(ps.reduce((a,p)=>a+p.amount,0))}\nFomba: ${ps[0]?.mode}\nMisaotra tompoko!`)},
 copyLate:()=>{const m=ui.lateM;const l=active().filter(s=>(!ui.lateC||s.classId===ui.lateC)&&!['paid','skip'].includes(mstat(s,m)));copyText(`${S.school.name} — Tsy mbola nandoa ${MONTHS[m]}\n\n`+l.map(s=>`• ${fullName(s)} (${cls(s.classId)?.name}) — ${s.phone||''} — sisa ${fmt(fee(s)-paid(s.id,m))}`).join('\n'))},
 newClass:()=>classForm(),
 editClass:d=>classForm(cls(d.cid)),
 delClass:d=>{const c=cls(d.cid),n=S.students.filter(s=>s.classId===c.id).length;if(n){toast(`Misy mpianatra ${n} ao amin'ny ${c.name}. Afindrao aloha izy ireo.`,1);return}confirmBox(`Hamafa ny kilasy <b>${esc(c.name)}</b> ve?`,()=>{S.classes=S.classes.filter(x=>x.id!==c.id);save();render();toast('Voafafa ny kilasy')},'Fafana')},
 classStudents:d=>{ui.fcls=d.cid;ui.fst='';ui.q='';location.hash='mpianatra'},
 newTeacher:()=>teacherForm(),
 editTeacher:d=>teacherForm(tea(d.tid)),
 delTeacher:d=>{const t=tea(d.tid);confirmBox(`Hamafa an'i <b>${esc(t.name)}</b> ve?`,()=>{S.teachers=S.teachers.filter(x=>x.id!==t.id);S.classes.forEach(c=>{if(c.teacherId===t.id)c.teacherId=''});save();render();toast('Voafafa')},'Fafana')},
 att:d=>{const k=ui.attC+'|'+ui.attD;const r=S.attendance[k]||(S.attendance[k]={});r[d.sid]=r[d.sid]===d.v?undefined:d.v;if(!r[d.sid])delete r[d.sid];if(!Object.keys(r).length)delete S.attendance[k];save();render()},
 attAll:()=>{const k=ui.attC+'|'+ui.attD;const r=S.attendance[k]||(S.attendance[k]={});S.students.filter(s=>s.classId===ui.attC&&s.status==='Mianatra').forEach(s=>{if(!r[s.id])r[s.id]='P'});save();render();toast('Voamarika ho tonga ireo sisa')},
 attClear:()=>{delete S.attendance[ui.attC+'|'+ui.attD];save();render()},
 attGo:d=>{ui.attD=d.d;render()},
 gTab:d=>{ui.gTab=d.k;render()},
 gSub:d=>{ui.gS=d.k;ui.gTab='ampidiro';render()},
 bulletin:d=>bulletin(d.sid,d.t||'T1'),
 copyBul:d=>{const s=stu(d.sid),c=cls(s.classId),a=avgOf(s.id,c.id,d.t),rk=ranking(c.id,d.t);copyText(`${S.school.name} — Kara-naoty ${d.t}\n${fullName(s)} (${c.name})\n`+S.subjects.map(sb=>`${sb.name}: ${(S.grades[gk(c.id,d.t,sb.id)]||{})[s.id]??'—'}/20`).join('\n')+`\nSalan'isa: ${f2(a)}/20 — Laharana ${rk.findIndex(x=>x.s.id===s.id)+1}/${rk.length}`)},
 delSubject:d=>{const sb=S.subjects.find(x=>x.id===d.id);confirmBox(`Hamafa ny taranja <b>${esc(sb.name)}</b> sy ny naoty rehetra mifandraika aminy ve?`,()=>{S.subjects=S.subjects.filter(x=>x.id!==d.id);for(const k in S.grades)if(k.endsWith('|'+d.id))delete S.grades[k];if(ui.gS===d.id)ui.gS='';save();render()},'Fafana')},
 export:()=>copyText(JSON.stringify(S)),
 import:()=>openModal('Hampiditra backup',`<p class="muted" style="margin-top:0">Apetaho eto ny JSON nadikao tamin'ny "Hanao backup". Hosoloina ny angona rehetra ankehitriny.</p><textarea class="ta" id="impt" placeholder='{"school":…}'></textarea>`,`<button class="btn ghost" data-act="close">Hiala</button><button class="btn pri" data-act="doImport">${ic('upload',16)} Ampidiro</button>`),
 doImport:()=>{try{const d=JSON.parse($('#impt').value);if(!d.school||!Array.isArray(d.students))throw 0;const keep={members:S.members,owner:S.owner};for(const c of COLS)S[c]=d[c]||(MAPC[c]?{}:[]);S.seq=d.seq||0;S.school={...d.school,code:SCHOOL};Object.assign(S,keep);save();closeModal();render();toast('Tafiditra ny angona')}catch(e){toast('JSON tsy mety',1)}},
 resetDemo:()=>confirmBox('Hosoloina amin\'ny angona santionany ny angona rehetra ankehitriny. Tohizana ve?',()=>{const d=seed();for(const c of COLS)S[c]=d[c];S.seq=d.seq;save();render();toast('Tafiditra ny angona santionany')},'Averina'),
 wipe:()=>confirmBox('<b>Hofafana daholo</b> ny mpianatra, kilasy, mpampianatra, fandoavana, fiantsoana ary naoty. Tsy azo averina intsony izany!',()=>{Object.assign(S,{students:[],payments:[],attendance:{},grades:{},classes:[],teachers:[],seq:0});save();render();toast('Voafafa daholo')},'Fafana daholo'),
};
const F={
 login:async d=>{
  const code=d.code.trim().toUpperCase();lf={...d,pass:''};loginErr='';busy=true;render();
  try{lsSet('sekoly_code',code);await signInWithEmailAndPassword(auth,emailOf(code,d.login),d.pass);if(!location.hash)location.hash='tabilao'}
  catch(e){loginErr=fbMsg(e)}
  busy=false;render()},
 register:async d=>{
  const code=d.code.trim().toUpperCase(),login=d.login.trim().toLowerCase();lf={...d,pass:''};
  if(!/^[A-Z0-9]{3,12}$/.test(code)){loginErr='Kaody: litera sy isa ihany, 3–12.';render();return}
  loginErr='';busy=true;registering=true;render();
  let cred=null;
  try{
   cred=await createUserWithEmailAndPassword(auth,emailOf(code,login),d.pass);
   const base=d.demo?seed():emptyState();
   base.school={...base.school,name:d.name.trim(),code,year:base.school.year||schoolYear()};
   if(!d.demo)Object.assign(base.school,{director:d.uname.trim(),address:'',phone:'',email:'',motto:''});
   try{await setDoc(doc(db,'schools',code),{school:clean(base.school),seq:base.seq||0,owner:cred.user.uid,created:Date.now(),members:{[cred.user.uid]:{login,name:d.uname.trim(),role:'Admin'}}})}
   catch(e){try{await deleteUser(cred.user)}catch(x){}try{await signOut(auth)}catch(x){}cred=null;throw{code:'x',message:'Efa misy sekoly mampiasa ny kaody "'+code+'". Mifidiana kaody hafa.'}}
   SCHOOL=code;S=base;last={};save();
   lsSet('sekoly_code',code);registering=false;busy=false;loginMode='login';location.hash='tabilao';attach(code);toast('Voaforona ny sekoly '+code+'!');return;
  }catch(e){loginErr=fbMsg(e);if(cred)try{await signOut(auth)}catch(x){}}
  await new Promise(r=>setTimeout(r,50));registering=false;busy=false;render()},
 addUser:async d=>{
  const login=d.login.trim().toLowerCase();if(Object.values(S.members||{}).some(m=>m.login===login)){toast('Efa misy io anarana fidirana io',1);return}
  let sec=null;
  try{sec=initializeApp(firebaseConfig,'sec'+Date.now());const sa=getAuth(sec);const c=await createUserWithEmailAndPassword(sa,emailOf(SCHOOL,login),d.pass);
   await updateDoc(doc(db,'schools',SCHOOL),{['members.'+c.user.uid]:{login,name:d.name.trim(),role:d.role}});await signOut(sa);closeModal();toast('Voaforona ny kaontin\'i '+d.name.trim())}
  catch(e){toast(fbMsg(e),1)}finally{if(sec)deleteApp(sec).catch(()=>{})}},
 student:d=>{if(d.id){Object.assign(stu(d.id),{first:d.first.trim(),last:d.last.trim(),sex:d.sex,birth:d.birth,classId:d.classId,status:d.status,start:+d.start||0,parent:d.parent,phone:d.phone,address:d.address});toast('Voatahiry ny fanovana')}else{const max=S.students.reduce((a,s)=>Math.max(a,parseInt((s.matricule||'0').replace(/\D/g,''))||0),0);S.students.push({id:'p'+uid(),matricule:'MP-'+String(max+1).padStart(4,'0'),first:d.first.trim(),last:d.last.trim(),sex:d.sex,birth:d.birth,classId:d.classId,status:d.status,start:+d.start||0,parent:d.parent,phone:d.phone,address:d.address,created:today()});toast('Voasoratra ny mpianatra vaovao')}save();closeModal();render()},
 class:d=>{const o={name:d.name.trim(),room:d.room,fee:+d.fee||0,capacity:+d.capacity||30,teacherId:d.teacherId,color:d.color};if(d.id)Object.assign(cls(d.id),o);else S.classes.push({id:'c'+uid(),ord:Date.now(),...o});save();closeModal();render();toast('Voatahiry ny kilasy')},
 teacher:d=>{const o={name:d.name.trim(),subject:d.subject,phone:d.phone,email:d.email,since:d.since};if(d.id)Object.assign(tea(d.id),o);else S.teachers.push({id:'t'+uid(),...o});save();closeModal();render();toast('Voatahiry ny mpampianatra')},
 pay:d=>{
  const s=stu(d.sid);if(!s){toast('Safidio ny mpianatra',1);return}
  const months=[...ui.payMonths].sort((a,b)=>a-b);if(!months.length){toast('Safidio farafahakeliny volana iray',1);return}
  let left=Math.min(+d.amount||0,selRemain());if(left<=0){toast('Ampidiro ny vola',1);return}
  const rec='R'+String((S.seq=(S.seq||0)+1)).padStart(5,'0');
  for(const m of months){if(left<=0)break;const need=Math.max(0,fee(s)-paid(s.id,m));const x=Math.min(need,left);if(x>0){S.payments.push({id:uid(),rec,studentId:s.id,month:m,amount:x,date:d.date||today(),mode:d.mode});left-=x}}
  save();ui.payMonths=[];const nx=(()=>{for(let m=0;m<10;m++)if(!['paid','skip'].includes(mstat(s,m)))return m;return-1})();if(nx>=0&&nx<=curMonthIdx())ui.payMonths=[nx];
  render();showReceipt(rec);toast('Voaray ny vola')},
 school:d=>{Object.assign(S.school,{name:d.name.trim(),code:SCHOOL,director:d.director,year:d.year,phone:d.phone,email:d.email,address:d.address,motto:d.motto});save();render();toast('Voatahiry ny mombamomba ny sekoly')},
 subject:(d,f)=>{S.subjects.push({id:'s'+uid(),name:d.name.trim(),coef:+d.coef||1,ord:Date.now()});save();render();toast('Nampiana ny taranja')},
 account:async d=>{try{if(d.pass){await reauthenticateWithCredential(auth.currentUser,EmailAuthProvider.credential(auth.currentUser.email,d.old));await updatePassword(auth.currentUser,d.pass)}
  if(d.name.trim()!==user.name)await updateDoc(doc(db,'schools',SCHOOL),{['members.'+user.uid+'.name']:d.name.trim()});toast('Voaova ny kaonty');render()}catch(e){toast(fbMsg(e),1)}},
};
const I={
 q:el=>{ui.q=el.value;render()},
 tq:el=>{ui.tq=el.value;render()},
};
const C={
 fcls:el=>{ui.fcls=el.value;render()},
 fst:el=>{ui.fst=el.value;render()},
 pstu:el=>{ui.paySid=el.value;const s=stu(el.value);ui.payMonths=[];if(s)for(let m=0;m<10;m++)if(!['paid','skip'].includes(mstat(s,m))){ui.payMonths=[m];break}refreshPay()},
 pmon:()=>{ui.payMonths=[...document.querySelectorAll('[data-ch="pmon"]:checked')].map(x=>+x.value);const a=$('#pamt');if(a)a.value=selRemain()||'';const t=$('#ptot');if(t)t.textContent=fmt(selRemain())},
 lateM:el=>{ui.lateM=+el.value;render()},
 lateC:el=>{ui.lateC=el.value;render()},
 gridC:el=>{ui.gridC=el.value;render()},
 attC:el=>{ui.attC=el.value;render()},
 attD:el=>{if(el.value){ui.attD=el.value;render()}},
 gC:el=>{ui.gC=el.value;render()},
 gT:el=>{ui.gT=el.value;render()},
 gS:el=>{ui.gS=el.value;render()},
 grade:el=>{const k=gk(ui.gC,ui.gT,ui.gS||S.subjects[0]?.id);const g=S.grades[k]||(S.grades[k]={});let v=el.value===''?null:Math.max(0,Math.min(20,parseFloat(el.value.replace(',','.'))));if(v==null||isNaN(v))delete g[el.dataset.sid];else{g[el.dataset.sid]=v;el.value=v}save();const y=window.scrollY;render();window.scrollTo(0,y)},
 coef:el=>{const sb=S.subjects.find(x=>x.id===el.dataset.id);if(sb){sb.coef=Math.max(1,+el.value||1);save();toast('Voaova ny koefisianta')}},
};
function refreshPay(){const p=$('#pmonths');if(p)p.innerHTML=monthsPick(ui.paySid);const i=$('#pinfo');if(i)i.innerHTML=payInfo();const a=$('#pamt');if(a)a.value=selRemain()||'';const t=$('#ptot');if(t)t.textContent=fmt(selRemain())}

document.addEventListener('click',e=>{
 if(e.target.dataset&&e.target.dataset.ov){closeModal();return}
 const el=e.target.closest('[data-act]');if(!el)return;
 const fn=A[el.dataset.act];if(fn){if(el.tagName!=='A'||el.dataset.act!=='goPay'&&el.dataset.act!=='goLate')e.preventDefault();else e.preventDefault();fn(el.dataset,el,e)}
});
document.addEventListener('submit',e=>{const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();F[f.dataset.form](Object.fromEntries(new FormData(f)),f)});
document.addEventListener('input',e=>{const el=e.target.closest('[data-in]');if(el)I[el.dataset.in](el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-ch]');if(el&&C[el.dataset.ch])C[el.dataset.ch](el,e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
window.addEventListener('hashchange',()=>{ui.side=false;closeModal();render();window.scrollTo(0,0)});
render();
