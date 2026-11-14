/* Sekoly — sync.js : Firebase Auth + Firestore synchronisation
   schools/{CODE}                  {school, seq, members:{uid:{login,name,role,teacherId?,students?}}, owner}
   schools/{CODE}/{col}/{id}       staff collections (diff-synced from S)
   schools/{CODE}/portal/{sid}     parent/student summaries (derived)
   schools/{CODE}/messages/{id}    private messages (uids[])
   schools/{CODE}/logs/{id}        audit log (append-only)
   schools/{CODE}/files/{id}       student documents (on demand)
   schools/{CODE}/archives/{id}    closed school years (on demand)                  */
'use strict';
let FB=null;
const COLS=['students','payments','classes','teachers','subjects','attendance','grades','councils','timetable','sanctions','closures','announcements','sms','lessons','staffatt','portal'];
const MAPC={attendance:1,grades:1,councils:1,timetable:1,staffatt:1};
let unsubs=[],last={},loaded={},need=[],registering=false,authReady=false,syncErr=null,pending=0,onlineNow=navigator.onLine;
let loginErr='',loginMode='login',busy=false,lf={};
const emailOf=(code,login)=>`${String(login).trim().toLowerCase().replace(/[^a-z0-9._-]/g,'')}@${String(code).trim().toLowerCase()}.sekoly.app`;
const codeOfEmail=e=>String(e||'').split('@')[1]?.split('.')[0]?.toUpperCase()||'';
function stable(v){if(Array.isArray(v))return'['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return'{'+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v===undefined?null:v)}
const clean=o=>JSON.parse(JSON.stringify(o));
const byOrd=(a,b)=>(a.ord??0)-(b.ord??0)||String(a.name||'').localeCompare(String(b.name||''));
function curDocs(col){const o={};if(MAPC[col]){for(const k in S[col])o[k]={v:S[col][k]}}else for(const x of S[col])o[x.id]=x;return o}
const mainOf=()=>({school:S.school,seq:S.seq||0});
const lsGet=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

/* ---------- write ---------- */
function save(cols){
 if(!SCHOOL||!S||!FB?.db||!isStaff())return;
 const groups={};
 if(!cols){const m=stable(mainOf());if(m!==last.__main){groups.__main=[['u',FB.doc(FB.db,'schools',SCHOOL),clean(mainOf())]];last.__main=m}}
 for(const col of(cols||COLS.filter(c=>c!=='portal'))){
  if(!S[col])continue;
  const cur=curDocs(col),lc=last[col]||(last[col]={}),ops=[];
  for(const id in cur){const st=stable(cur[id]);if(lc[id]!==st){ops.push(['s',FB.doc(FB.db,'schools',SCHOOL,col,id),clean(cur[id])]);lc[id]=st}}
  for(const id in lc)if(!(id in cur)){ops.push(['d',FB.doc(FB.db,'schools',SCHOOL,col,id)]);delete lc[id]}
  if(ops.length)groups[col]=ops;
 }
 for(const g in groups){const ops=groups[g];
  for(let i=0;i<ops.length;i+=400){
   const b=FB.writeBatch(FB.db);
   ops.slice(i,i+400).forEach(([t,r,d])=>t==='s'?b.set(r,d):t==='u'?b.update(r,d):b.delete(r));
   pending++;setSync();
   b.commit().then(()=>{pending--;syncErr=null;setSync()}).catch(e=>{pending--;syncErr=e;setSync();toast(L('Tsy voatahiry','Non enregistré')+': '+fbMsg(e),1)});
  }
 }
 if(!cols)portalSoon();
}
const portalSoon=debounce(()=>{if(!S||!isStaff())return;try{S.portal=S.students.filter(s=>(s.parentUids||[]).length).map(buildPortal);save(['portal'])}catch(e){console.error(e)}},2500);
function log(action,detail){if(!FB?.db||!SCHOOL||!user)return;try{FB.addDoc(FB.collection(FB.db,'schools',SCHOOL,'logs'),{uid:user.uid,name:user.name,role:user.role,action,detail:String(detail||'').slice(0,500),at:Date.now()}).catch(()=>{})}catch(e){}}

/* ---------- read ---------- */
let rT=null;
function schedule(){clearTimeout(rT);rT=setTimeout(()=>{if(user&&S&&loaded.__main&&need.every(c=>loaded[c]))render()},40)}
function detach(){unsubs.forEach(u=>{try{u()}catch(e){}});unsubs=[];last={};loaded={};need=[];SCHOOL=null;S=null}
function sub(col,q,isMap){
 unsubs.push(FB.onSnapshot(q,qs=>{
  if(!S)return;
  const lc={};let out=isMap?{}:[];
  qs.forEach(ds=>{const v=ds.data();if(isMap){out[ds.id]=v.v??{};lc[ds.id]=stable({v:v.v??{}})}else{const o={...v,id:ds.id};out.push(o);lc[ds.id]=stable(o)}});
  if(col==='classes'||col==='subjects')out.sort(byOrd);
  if(col==='messages'||col==='logs'||col==='announcements')out.sort((a,b)=>(b.at||0)-(a.at||0)||String(b.date||'').localeCompare(String(a.date||'')));
  S[col]=out;if(COLS.includes(col))last[col]=lc;loaded[col]=1;schedule();
 },e=>{console.warn(col,e);if(col==='logs'||col==='messages'){S[col]=[];loaded[col]=1;schedule();return}fatal(fbMsg(e))}));
}
function attach(code){
 detach();Object.assign(ui,{q:'',fcls:'',fst:'',tq:'',gC:'',gT:'',gS:'',attC:'',attD:'',paySid:'',payMonths:[],payItems:[],edtC:'',edtT:'',lesC:'',pChild:'',pTab:'home',msgBox:'inbox'});SCHOOL=code;S=emptyState();S.messages=[];S.logs=[];render();
 let subscribed=false;
 unsubs.push(FB.onSnapshot(FB.doc(FB.db,'schools',code),snap=>{
  if(SCHOOL!==code||!S)return;
  if(!snap.exists()){fatal(L('Tsy hita ny sekoly','École introuvable')+' "'+code+'".');return}
  const d=snap.data(),me=(d.members||{})[FB.auth.currentUser?.uid];
  if(!me){fatal(L('Tsy mpikambana amin\'ny sekoly','Vous n\'êtes pas membre de l\'école')+' "'+code+'".');return}
  S.school=Object.assign(emptyState().school,d.school||{});S.seq=d.seq||0;S.members=d.members||{};S.owner=d.owner;
  last.__main=stable(mainOf());
  const prevRole=user?.role;
  user={uid:FB.auth.currentUser.uid,...me};loginErr='';loaded.__main=1;
  if(me.lang&&me.lang!==LANG&&!lsGet('sekoly_lang'))setLang(me.lang);
  if(subscribed&&prevRole&&prevRole!==me.role){attach(code);return}
  if(!subscribed){subscribed=true;subscribeFor(code)}
  schedule();
 },e=>fatal(fbMsg(e))));
}
function subscribeFor(code){
 const db=FB.db,col=n=>FB.collection(db,'schools',code,n),uidv=FB.auth.currentUser.uid;
 if(isStaff()){
  need=[...COLS,'messages'];
  for(const c of COLS)sub(c,col(c),!!MAPC[c]);
  if(isBoss()){need.push('logs');sub('logs',FB.query(col('logs'),FB.orderBy('at','desc'),FB.limit(400)))}
 }else{
  need=['portal','announcements','messages'];
  sub('portal',FB.query(col('portal'),FB.where('uids','array-contains',uidv)));
  sub('announcements',col('announcements'));
 }
 sub('messages',FB.query(col('messages'),FB.where('uids','array-contains',uidv)));
}
function fatal(msg){detach();user=null;loginErr=msg;if(FB?.auth)FB.signOut(FB.auth).catch(()=>{});render()}
function fbMsg(e){const c=(e&&e.code)||'';const M={
 'auth/invalid-credential':L('Diso ny kaody sekoly, ny anarana na ny teny miafina.','Code école, identifiant ou mot de passe incorrect.'),'auth/wrong-password':L('Diso ny teny miafina.','Mot de passe incorrect.'),'auth/user-not-found':L('Tsy hita io mpampiasa io.','Utilisateur introuvable.'),'auth/invalid-email':L('Anarana fidirana tsy mety (litera sy isa ihany).','Identifiant invalide (lettres et chiffres uniquement).'),
 'auth/email-already-in-use':L('Efa misy io anarana fidirana io amin\'io sekoly io.','Cet identifiant existe déjà dans cette école.'),'auth/weak-password':L('Teny miafina farafahakeliny 6 litera.','Mot de passe : 6 caractères minimum.'),'auth/network-request-failed':L('Tsy misy internet. Andramo indray.','Pas de connexion internet. Réessayez.'),
 'auth/too-many-requests':L('Be loatra ny fanandramana. Miandrasa kely.','Trop de tentatives. Patientez un instant.'),'auth/operation-not-allowed':L('Tsy mbola nalefa ny "Email/Password" ao amin\'ny Firebase Authentication.','La méthode « Email/Password » n\'est pas activée dans Firebase Authentication.'),'auth/requires-recent-login':L('Midira indray vao manova teny miafina.','Reconnectez-vous avant de changer le mot de passe.'),
 'permission-denied':L('Tsy mahazo alalana hanao izany.','Action non autorisée.'),'unavailable':L('Tsy misy internet — hotehirizina rehefa tafaverina.','Hors ligne — sera enregistré au retour de la connexion.')};return M[c]||(e&&e.message)||String(e)}
function setSync(){const el=document.getElementById('sync');if(!el)return;el.className='chip sync '+syncCls();el.innerHTML=syncLabel()}
const syncCls=()=>!onlineNow?'off':syncErr?'err':pending?'busy':'ok';
const syncLabel=()=>'<i></i> '+(!onlineNow?L('Tsy misy internet','Hors ligne'):syncErr?L('Hadisoana','Erreur'):pending?L('Mitahiry…','Enregistrement…'):L('Voatahiry','Synchronisé'));
addEventListener('online',()=>{onlineNow=true;setSync()});addEventListener('offline',()=>{onlineNow=false;setSync()});

/* ---------- accounts ---------- */
async function createAccount(login,pass,member){
 let sec=null;
 try{sec=FB.initializeApp(FB.config,'sec'+Date.now());const sa=FB.getAuth(sec);const c=await FB.createUserWithEmailAndPassword(sa,emailOf(SCHOOL,login),pass);
  await FB.updateDoc(FB.doc(FB.db,'schools',SCHOOL),{['members.'+c.user.uid]:clean({login:login.toLowerCase(),...member})});await FB.signOut(sa);log('user.create',`${login} (${member.role})`);return c.user.uid}
 finally{if(sec)FB.deleteApp(sec).catch(()=>{})}
}
const updateMember=(uidv,data)=>FB.updateDoc(FB.doc(FB.db,'schools',SCHOOL),Object.fromEntries(Object.entries(data).map(([k,v])=>['members.'+uidv+'.'+k,v===undefined?FB.deleteField():v])));
const removeMember=uidv=>FB.updateDoc(FB.doc(FB.db,'schools',SCHOOL),{['members.'+uidv]:FB.deleteField()});

/* ---------- messages / files / archives ---------- */
function sendMessage(m){return FB.addDoc(FB.collection(FB.db,'schools',SCHOOL,'messages'),clean({from:user.uid,fromName:user.name,at:Date.now(),date:today(),readBy:{[user.uid]:Date.now()},...m}))}
function markRead(m){if(m.readBy?.[user.uid])return;FB.updateDoc(FB.doc(FB.db,'schools',SCHOOL,'messages',m.id),{['readBy.'+user.uid]:Date.now()}).catch(()=>{})}
async function listFiles(sid){const qs=await FB.getDocs(FB.query(FB.collection(FB.db,'schools',SCHOOL,'files'),FB.where('studentId','==',sid)));const r=[];qs.forEach(d=>r.push({id:d.id,...d.data()}));return r.sort((a,b)=>(b.at||0)-(a.at||0))}
const addFile=f=>FB.addDoc(FB.collection(FB.db,'schools',SCHOOL,'files'),clean({...f,at:Date.now(),by:user.name}));
const delFile=id=>FB.deleteDoc(FB.doc(FB.db,'schools',SCHOOL,'files',id));
async function listArchives(){const qs=await FB.getDocs(FB.collection(FB.db,'schools',SCHOOL,'archives'));const r=[];qs.forEach(d=>r.push({id:d.id,...d.data()}));return r}
async function writeArchive(year,payload){const txt=JSON.stringify(payload);const parts=[];for(let i=0;i<txt.length;i+=700000)parts.push(txt.slice(i,i+700000));for(let i=0;i<parts.length;i++)await FB.setDoc(FB.doc(FB.db,'schools',SCHOOL,'archives',`${year}_${String(i).padStart(3,'0')}`),{year,part:i,parts:parts.length,data:parts[i],at:Date.now()})}
