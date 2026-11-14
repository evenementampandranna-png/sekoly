/* Sekoly — events.js : global actions, auth forms, event wiring, boot */
'use strict';
Object.assign(A,{
 close:closeModal,
 side:()=>{ui.side=!ui.side;render()},
 lang:()=>{setLang(LANG==='fr'?'mg':'fr');if(user&&FB?.db)updateMember(user.uid,{lang:LANG}).catch(()=>{});render();if($('#modal').innerHTML)closeModal()},
 logout:()=>confirmBox(L('Hivoaka amin\'ny kaonty ve ianao?','Se déconnecter ?'),()=>{loginErr='';loginMode='login';FB.signOut(FB.auth)},L('Hivoaka','Déconnexion'),false),
 pw:(d,el)=>{const i=$('#lpass');i.type=i.type==='password'?'text':'password';el.innerHTML=ic(i.type==='password'?'eye':'eyeoff',17)},
 lmode:d=>{loginMode=d.k;loginErr='';lf={};render()},
 confirmOk:()=>{const cb=confirmCb;confirmCb=null;closeModal();cb&&cb()},
});
Object.assign(F,{
 prompt:d=>{const cb=promptCb;promptCb=null;closeModal();cb&&cb(String(d.v||'').trim())},
 login:async d=>{
  const code=d.code.trim().toUpperCase();lf={...d,pass:''};loginErr='';busy=true;render();
  try{lsSet('sekoly_code',code);await FB.signInWithEmailAndPassword(FB.auth,emailOf(code,d.login),d.pass);if(!location.hash)location.hash='tabilao'}
  catch(e){loginErr=fbMsg(e)}
  busy=false;render()},
 register:async d=>{
  const code=d.code.trim().toUpperCase(),login=d.login.trim().toLowerCase();lf={...d,pass:''};
  if(!/^[A-Z0-9]{3,12}$/.test(code)){loginErr=L('Kaody: litera sy isa ihany, 3–12.','Code : lettres et chiffres, 3 à 12.');render();return}
  loginErr='';busy=true;registering=true;render();
  let cred=null;
  try{
   cred=await FB.createUserWithEmailAndPassword(FB.auth,emailOf(code,login),d.pass);
   const base=d.demo?seed():emptyState();
   base.school={...base.school,name:d.name.trim(),code};
   if(!d.demo)base.school.director=d.uname.trim();
   try{await FB.setDoc(FB.doc(FB.db,'schools',code),{school:clean(base.school),seq:base.seq||0,owner:cred.user.uid,created:Date.now(),members:{[cred.user.uid]:{login,name:d.uname.trim(),role:'Admin',lang:LANG}}})}
   catch(e){try{await FB.deleteUser(cred.user)}catch(x){}try{await FB.signOut(FB.auth)}catch(x){}cred=null;throw{code:'x',message:L('Efa misy sekoly mampiasa ny kaody','Ce code est déjà utilisé par une autre école :')+' "'+code+'".'}}
   SCHOOL=code;S=base;S.messages=[];user={uid:cred.user.uid,login,name:d.uname.trim(),role:'Admin'};last={};save();
   lsSet('sekoly_code',code);registering=false;busy=false;loginMode='login';lf={};location.hash='tabilao';user=null;attach(code);toast(L('Voaforona ny sekoly','École créée')+' '+code);return;
  }catch(e){loginErr=fbMsg(e);if(cred)try{await FB.signOut(FB.auth)}catch(x){}}
  await new Promise(r=>setTimeout(r,50));registering=false;busy=false;render()},
});

document.addEventListener('click',e=>{
 if(e.target.dataset&&e.target.dataset.ov){closeModal();return}
 const el=e.target.closest('[data-act]');if(!el)return;
 const fn=A[el.dataset.act];if(!fn)return;
 if(el.tagName==='A'||el.tagName==='BUTTON'||el.dataset.prevent!==undefined)e.preventDefault();
 try{fn(el.dataset,el,e)}catch(err){console.error(err);toast(String(err.message||err),1)}
});
document.addEventListener('submit',e=>{const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();const fd=new FormData(f);const d={};for(const[k,v]of fd.entries()){if(k.endsWith('[]')){(d[k.slice(0,-2)]=d[k.slice(0,-2)]||[]).push(v)}else d[k]=v}
 try{const r=F[f.dataset.form](d,f);if(r&&r.catch)r.catch(err=>{console.error(err);toast(fbMsg(err),1)})}catch(err){console.error(err);toast(String(err.message||err),1)}});
document.addEventListener('input',e=>{const el=e.target.closest('[data-in]');if(el&&I[el.dataset.in])I[el.dataset.in](el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-ch]');if(el&&C[el.dataset.ch])try{C[el.dataset.ch](el,e)}catch(err){console.error(err);toast(String(err.message||err),1)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal').innerHTML)closeModal()});
window.addEventListener('hashchange',()=>{ui.side=false;closeModal();render();window.scrollTo(0,0)});

window.__bootSekoly=F0=>{
 FB=F0;
 if(!FB.ok){render();return}
 FB.onAuthStateChanged(FB.auth,()=>{const u=FB.auth.currentUser;authReady=true;if(registering)return;if(u){const c=codeOfEmail(u.email);if(c&&c!==SCHOOL)attach(c);else render()}else{detach();user=null;render()}});
 render();
};
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
