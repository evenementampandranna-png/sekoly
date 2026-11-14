/* Sekoly — shell.js : ui state, router, layout, login */
'use strict';
const A={},F={},C={},I={},V={};
const ui={side:false,q:'',fcls:'',fst:'',tq:'',tpost:'',payTab:'vaovao',paySid:'',payMonths:[],payItems:[],lateM:null,lateC:'',gridC:'',jDate:'',repM:null,
 attC:'',attD:'',attTab:'antso',gC:'',gT:'',gS:'',gTab:'ampidiro',edtView:'class',edtC:'',edtT:'',edtR:'',staffTab:'lisitra',lesC:'',stD:'',
 comTab:'filazana',calM:null,msgBox:'inbox',msgOpen:'',smsTarget:'all',smsLevel:'',smsClass:'',repTab:'effectifs',repT:'',setTab:'sekoly',pChild:'',pTab:'home',exC:''};
const NAV=()=>[['tabilao',L('Tabilao','Tableau de bord'),'home'],['mpianatra',L('Mpianatra','Élèves'),'users'],['kilasy',L('Kilasy & taranja','Classes & matières'),'layers'],['fandaharana',L('Fandaharam-potoana','Emploi du temps'),'grid'],['mpiasa',L('Mpiasa & lesona','Personnel & cahier'),'brief'],['sarany',L('Vola & saram-pianarana','Finances & écolages'),'card'],['fiantsoana',L('Fiantsoana & fifehezana','Absences & discipline'),'checks'],['naoty',L('Naoty & kara-naoty','Notes & bulletins'),'award'],['serasera',L('Serasera','Communication'),'msg'],['tatitra',L('Tatitra','Rapports & statistiques'),'chart'],['fikirakirana',L('Fikirakirana','Paramètres'),'sliders']];
const TITLE=r=>(NAV().find(x=>x[0]===r)||[0,''])[1];
const SUB=r=>({tabilao:L('Topimaso ankapobeny ny sekoly',"Vue d'ensemble de l'établissement"),mpianatra:L('Fisoratana anarana, antontan-taratasy, fifindrana','Inscriptions, dossiers, transferts'),kilasy:L('Kilasy, niveau, saran-javatra, taranja sy koefisianta','Classes, niveaux, frais, matières et coefficients'),fandaharana:L('Isaky ny kilasy, mpampianatra sy efitrano — misy fizahana fifanindrina','Par classe, enseignant et salle — avec détection des conflits'),mpiasa:L('Antontan-taratasin\'ny mpiasa, fanatrehana, cahier de textes','Dossiers du personnel, présences, cahier de textes'),sarany:L('Fandoavana, rosia, tara, journal de caisse','Encaissements, reçus, impayés, journal de caisse'),fiantsoana:L('Antso, tsy fahatongavana, sazy','Appel, absences, sanctions'),naoty:L('Naoty, salan\'isa, filankevi-pampianarana, kara-naoty','Notes, moyennes, conseils de classe, bulletins'),serasera:L('Filazana, tetiandro, SMS, hafatra','Annonces, calendrier, SMS, messagerie'),tatitra:L('Antontan\'isa sy tatitra ho an\'ny CISCO/DREN','Statistiques et rapports CISCO/DREN'),fikirakirana:L('Sekoly, taom-pianarana, mpampiasa, angona','École, année scolaire, utilisateurs, données')}[r]||'');
function route(){const r=location.hash.slice(1);return NAV().some(x=>x[0]===r)?r:'tabilao'}
const unreadCount=()=>(S?.messages||[]).filter(m=>!m.readBy?.[user?.uid]).length;

function render(){
 const ae=document.activeElement,fid=ae&&ae.id,pos=ae&&ae.selectionStart;
 document.documentElement.lang=LANG==='fr'?'fr':'mg';
 if(!FB)return;
 if(!FB.ok){$('#app').innerHTML=setupView();return}
 if(!authReady||(FB.auth.currentUser&&!user&&!loginErr&&!registering)||(user&&!(loaded.__main&&need.every(c=>loaded[c])))){$('#app').innerHTML=loadingView();return}
 if(!user){$('#app').innerHTML=loginView();if(fid){const n=document.getElementById(fid);if(n)n.focus()}return}
 if(isPortal()){$('#app').innerHTML=portalLayout();return}
 let r=route();if(!canSee(r))r='tabilao';
 let content;try{content=V[r]()}catch(e){console.error(e);content=`<div class="card"><b>${L('Nisy olana','Erreur')}</b><pre style="white-space:pre-wrap;font-size:12px">${esc(e.stack||e)}</pre></div>`}
 $('#app').innerHTML=layout(r,content);
 if(fid){const n=document.getElementById(fid);if(n&&(n.tagName==='INPUT'||n.tagName==='TEXTAREA')){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
}
const loadingView=()=>`<div class="loading"><div class="logo big">${ic('cap',30)}</div><div class="spin"></div><p>${L("Maka ny angon'ny sekoly…","Chargement des données de l'école…")}</p></div>`;
function setupView(){return`<div class="loading" style="padding:24px"><div class="logo big">${ic('cap',30)}</div><div class="card" style="max-width:560px;text-align:left"><h2 style="margin-top:0">${L('Mbola tsy voakirakira ny Firebase','Firebase n\'est pas encore configuré')}</h2><p>${L('Sokafy ny rakitra <code>firebase-config.js</code> ary apetaho ao ny <code>firebaseConfig</code> avy amin\'ny Firebase Console.','Ouvrez <code>firebase-config.js</code> et collez-y le <code>firebaseConfig</code> de la console Firebase.')}</p><p class="muted">README.md</p></div></div>`}
const langBtn=()=>`<button class="chip langsw" data-act="lang" title="Langue / Fiteny">${ic('globe',14)} ${LANG==='fr'?'FR':'MG'}</button>`;
function layout(r,content){
 const lateN=canSee('sarany')?active().filter(s=>dueAmount(s)>0).length:0,un=unreadCount();
 return`<div class="shell ${ui.side?'side-open':''}">
 <aside class="side">
  <div class="brand"><div class="logo">${ic('cap',22)}</div><div><b>Sekoly</b><small>${L('Fitantanana sekoly','Gestion scolaire')}</small></div></div>
  <div class="school-pill"><div class="sp-av">${esc(initials(S.school.name))}</div><div style="min-width:0"><b>${esc(S.school.name)}</b><small>${esc(SCHOOL)} · ${esc(S.school.year)}</small></div></div>
  <nav>${NAV().filter(([k])=>canSee(k)).map(([k,l,i])=>`<a href="#${k}" class="${r===k?'on':''}">${ic(i)}<span>${l}</span>${k==='sarany'&&lateN?`<em>${lateN}</em>`:''}${k==='serasera'&&un?`<em class="blue">${un}</em>`:''}</a>`).join('')}</nav>
  <div class="side-foot"><button data-act="logout">${ic('logout')} ${L('Hivoaka','Déconnexion')}</button><small>Sekoly v4 · Firebase</small></div>
 </aside>
 <div class="scrim" data-act="side"></div>
 <main>
  <header class="top"><button class="icon-btn mob" data-act="side">${ic('menu')}</button>
   <div style="min-width:0"><h1>${TITLE(r)}</h1><p>${SUB(r)}</p></div>
   <div class="top-r"><span id="sync" class="chip sync ${syncCls()}">${syncLabel()}</span>${langBtn()}<span class="chip hide-md">${ic('cal',14)} ${dateLong(new Date())}</span>
   <div class="me"><div class="av">${esc(initials(user.name))}</div><div><b>${esc(user.name)}</b><small>${esc(roleL(user.role))}</small></div></div></div>
  </header>
  <section class="page">${content}</section>
 </main></div>`;
}

function loginView(){
 const reg=loginMode==='register';
 return`<div class="login">
 <div class="login-art"><div class="grid-bg"></div>
  <div class="brand"><div class="logo">${ic('cap',22)}</div><div><b>Sekoly</b><small style="color:#99f6e4">${L('Fitantanana sekoly','Gestion scolaire')}</small></div></div>
  <div class="float-card"><div style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#ccfbf1;color:#0f766e">${ic('trend')}</div><div><small>${L('Saram-pianarana voaray','Écolages encaissés')}</small><b>+ 92%</b></div></div>
  <div>
   <h1>${L('Mpianatra, vola, naoty ary ray aman-dreny','Élèves, finances, notes et parents')} — <span>${L("amin'ny toerana iray.",'au même endroit.')}</span></h1>
   <p class="lead">${L("Rindrambaiko fitantanana sekoly feno: fisoratana anarana, saram-pianarana, kara-naoty, fiantsoana, SMS, toerana ho an'ny ray aman-dreny. Mandeha na tsy misy internet aza.","Logiciel de gestion scolaire complet : inscriptions, écolages, bulletins, absences, SMS, espace parents. Fonctionne même hors connexion.")}</p>
   <div class="feats">
    <div class="feat"><i>${ic('users')}</i>${L('Fisoratana & antontan-taratasy','Inscriptions & dossiers')}</div>
    <div class="feat"><i>${ic('card')}</i>${L('Saram-pianarana & rosia','Écolages & reçus')}</div>
    <div class="feat"><i>${ic('award')}</i>${L('Naoty & kara-naoty','Notes & bulletins')}</div>
    <div class="feat"><i>${ic('send')}</i>${L('SMS & toerana ray aman-dreny','SMS & espace parents')}</div>
   </div>
  </div>
  <small style="opacity:.6">© ${new Date().getFullYear()} Sekoly · ${L("Natao ho an'ny sekoly malagasy",'Conçu pour les écoles malgaches')}</small>
 </div>
 <div class="login-form">
  <div class="lf">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div class="tabs"><button class="${!reg?'on':''}" data-act="lmode" data-k="login">${L('Hiditra','Connexion')}</button><button class="${reg?'on':''}" data-act="lmode" data-k="register">${L('Hamorona sekoly','Créer une école')}</button></div>${langBtn()}</div>
  ${reg?`<form class="lf" data-form="register" autocomplete="off">
   <div><h2>${L('Sekoly vaovao ✨','Nouvelle école ✨')}</h2></div>
   <p>${L("Mamorona ny kaontin'ny sekolinao. Ianao no ho Mpitantana rafitra.",'Créez le compte de votre école. Vous serez administrateur.')}</p>
   <label class="fld"><span>${L("Anaran'ny sekoly","Nom de l'établissement")} *</span><input name="name" id="rname" required value="${esc(lf.name||'')}"></label>
   <div class="grid2">
    <label class="fld"><span>${L('Kaody sekoly','Code école')} *</span><input name="code" id="rcode" placeholder="SEK001" value="${esc(lf.code||'')}" required pattern="[A-Za-z0-9]{3,12}" style="text-transform:uppercase"></label>
    <label class="fld"><span>${L('Anaranao','Votre nom')} *</span><input name="uname" id="runame" required value="${esc(lf.uname||'')}"></label>
    <label class="fld"><span>${L('Anarana fidirana','Identifiant')} *</span><input name="login" id="rlogin" placeholder="admin" value="${esc(lf.login||'')}" required pattern="[A-Za-z0-9._\\-]{2,30}"></label>
    <label class="fld"><span>${L('Teny miafina','Mot de passe')} * (6+)</span><input name="pass" id="rpass" type="password" minlength="6" required></label>
   </div>
   <label class="check"><input type="checkbox" name="demo" ${lf.demo?'checked':''}> <span>${L('Ampidiro <b>angona santionany</b> hanandramana (azo fafana any aoriana).','Charger des <b>données de démonstration</b> (supprimables ensuite).')}</span></label>
   <div class="err ${loginErr?'show':''}" id="lerr">${esc(loginErr)}</div>
   <button class="btn pri block lg" ${busy?'disabled':''}>${busy?'<span class="spin sm"></span> '+L('Andraso…','Patientez…'):ic('check',16)+' '+L('Hamorona ny sekoly',"Créer l'école")}</button>
  </form>`:`<form class="lf" data-form="login" autocomplete="on">
   <div><h2>${L('Tongasoa indray 👋','Bon retour 👋')}</h2></div>
   <p>${L("Midira amin'ny kaontinao",'Connectez-vous à votre compte')}</p>
   <label class="fld"><span>${L('Kaody sekoly','Code école')}</span><input name="code" id="lcode" placeholder="SEK001" required value="${esc(lf.code||lsGet('sekoly_code'))}" style="text-transform:uppercase"></label>
   <label class="fld"><span>${L('Anarana fidirana','Identifiant')}</span><input name="login" id="llogin" required autocomplete="username" value="${esc(lf.login||'')}"></label>
   <label class="fld"><span>${L('Teny miafina','Mot de passe')}</span><div class="pw"><input name="pass" id="lpass" type="password" required autocomplete="current-password"><button type="button" data-act="pw">${ic('eye',17)}</button></div></label>
   <div class="err ${loginErr?'show':''}" id="lerr">${esc(loginErr)}</div>
   <button class="btn pri block lg" ${busy?'disabled':''}>${busy?'<span class="spin sm"></span> '+L('Andraso…','Patientez…'):ic('lock',16)+' '+L('Hiditra','Se connecter')}</button>
   <p class="muted small">${L('Ray aman-dreny sy mpianatra: ampiasao ny kaonty nomen\'ny sekoly anao.','Parents et élèves : utilisez le compte fourni par l\'école.')}</p>
   <p class="muted small">${L('Adino ny teny miafina? Angataho amin\'ny mpitantana ny sekoly.','Mot de passe oublié ? Demandez à l\'administration.')}</p>
  </form>`}
  <div class="lfoot">Sekoly v4 · Firebase</div>
  </div>
 </div></div>`;
}

/* ---------- shared widgets ---------- */
const clsOpts=(selId,all,list)=>`${all?`<option value="">${all}</option>`:''}${(list||S.classes).map(c=>`<option value="${c.id}" ${selId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}`;
const termOpts=t=>TERMS().map(([k,l])=>`<option value="${k}" ${t===k?'selected':''}>${l}</option>`).join('');
const clsBadge=c=>c?`<span class="badge nd" style="background:${(c.color||'#14b8a6')}1f;color:${c.color||'#0f766e'}">${esc(c.name)}</span>`:'—';
const stuWho=(s,sub)=>`<div class="who">${avs(fullName(s),s?.id,s?.photo)}<div><b>${esc(fullName(s))}</b>${sub!==undefined?`<small>${sub}</small>`:''}</div></div>`;
function stuOptions(selId,filter){return`<option value="">${L('— Safidio ny mpianatra —','— Choisir un élève —')}</option>`+S.classes.map(c=>{const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra'&&(!filter||filter(s))).sort((a,b)=>fullName(a).localeCompare(fullName(b)));return ss.length?`<optgroup label="${esc(c.name)}">${ss.map(s=>`<option value="${s.id}" ${s.id===selId?'selected':''}>${esc(fullName(s))} · ${esc(s.matricule)}${lateMonths(s)?' ⚠':''}</option>`).join('')}</optgroup>`:''}).join('')}
const printHead=(title,sub='')=>`<div class="ph"><div class="ph-l"><div class="ph-logo">${ic('cap',22)}</div><div><b>${esc(S.school.name)}</b><small>${esc([S.school.address,S.school.city].filter(Boolean).join(', '))}${S.school.phone?' · Tél. '+esc(S.school.phone):''}</small></div></div><div class="ph-r"><b>${title}</b><small>${sub||('Année scolaire '+esc(S.school.year))}</small></div></div>`;
