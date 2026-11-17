/* Sekoly — v-license.js : licences (essai, activation, blocage, console fournisseur) */
'use strict';
const PLANS=()=>[['starter',L('Kely (200 mpianatra)','Starter (200 élèves)'),200],['standard',L('Antonony (600 mpianatra)','Standard (600 élèves)'),600],['premium',L('Tsy voafetra','Premium (illimité)'),0]];
const planL=p=>(PLANS().find(x=>x[0]===p)||[0,p||'—'])[1];
const DURATIONS=()=>[['1m',L('1 volana','1 mois')],['3m',L('3 volana','3 mois')],['6m',L('6 volana','6 mois')],['1y',L('1 taona','1 an')],['sy',L('Hatramin\'ny 31 aogositra (taom-pianarana)','Jusqu\'au 31 août (année scolaire)')]];
function durToExpiry(d,from){const t=new Date(from||Date.now());if(d==='sy'){let y=t.getFullYear();if(t.getMonth()>=8)y++;return new Date(y,7,31,23,59).getTime()}const n={'1m':1,'3m':3,'6m':6,'1y':12}[d]||12;t.setMonth(t.getMonth()+n);return t.getTime()}
function genCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=new Uint32Array(12);crypto.getRandomValues(r);const s=[...r].map(x=>A[x%A.length]).join('');return`SKL-${s.slice(0,4)}-${s.slice(4,8)}-${s.slice(8,12)}`}
const fmtD=t=>t?fmtDate(iso(new Date(t))):'—';

/* ---------- banner + lock ---------- */
function licBanner(){
 const st=licState();if(!st.ok)return'';
 if(st.kind==='trial')return`<div class="lic-band trial">${ic('clock',16)}<span>${L('Dikan-panandramana','Version d\'essai')} — <b>${st.days} ${L('andro sisa','jour(s) restant(s)')}</b> (${fmtD(st.expires)})</span>${isBoss()?`<button class="btn sm white" data-act="licGo">${ic('lock',14)} ${L('Ampidiro ny kaody licence','Activer une licence')}</button>`:''}</div>`;
 if(st.days<=30)return`<div class="lic-band warn">${ic('alert',16)}<span>${L('Ho lany ny licence afaka','La licence expire dans')} <b>${st.days} ${L('andro','jour(s)')}</b> (${fmtD(st.expires)})</span>${isBoss()?`<button class="btn sm white" data-act="licGo">${L('Havaozina','Renouveler')}</button>`:''}</div>`;
 return'';
}
function lockView(){
 const st=licState();
 const why={none:L('Tapitra ny 30 andro fanandramana.','La période d\'essai de 30 jours est terminée.'),expired:L('Efa lany daty ny licence-nao.','Votre licence a expiré.'),revoked:L('Nofoanana ny licence-nao.','Votre licence a été révoquée.'),other:L('Tsy mifanaraka amin\'ity sekoly ity ny licence.','La licence ne correspond pas à cette école.')}[st.kind]||'';
 return`<div class="lock"><div class="lock-card">
  <div class="logo big">${ic('lock',28)}</div>
  <h2>${L('Mila licence ny sekoly','Licence requise')}</h2>
  <p class="muted">${why} ${st.expires?`(${fmtD(st.expires)})`:''}</p>
  <p>${L('Voatahiry tsara ny angona rehetra. Ampidiro kaody licence vaovao mba hanohizana ny fampiasana.','Toutes vos données sont conservées. Saisissez un code de licence pour continuer à utiliser Sekoly.')}</p>
  ${isBoss()?licForm():`<div class="hint">${L('Angataho amin\'ny Tale na ny mpitantana ny sekoly ny fampidirana ny kaody licence.','Demandez au directeur ou à l\'administrateur de l\'école d\'activer la licence.')}</div>`}
  <div class="lock-foot">${isBoss()?`<button class="btn ghost sm" data-act="backup">${ic('download',15)} ${L('Ampidino ny angona (backup)','Télécharger mes données')}</button>`:''}${IS_VENDOR?`<a class="btn ghost sm" href="#licences" data-act="vendorGo">${ic('shield',15)} ${L('Console licence','Console licences')}</a>`:''}${langBtn()}<button class="btn ghost sm" data-act="logout">${ic('logout',15)} ${L('Hivoaka','Déconnexion')}</button></div>
  <small class="muted">${esc(S.school.name||'')} · ${esc(SCHOOL)}</small>
 </div></div>`;
}
const licForm=()=>`<form data-form="licActivate" class="lic-form"><input class="inp" name="code" id="liccode" placeholder="SKL-XXXX-XXXX-XXXX" required autocomplete="off" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700"><button class="btn pri">${ic('check',16)} ${L('Ampandehanina','Activer')}</button></form>`;

/* ---------- settings tab ---------- */
function setLicence(){
 const st=licState(),l=S.lic;
 const badge=st.ok?(st.kind==='trial'?`<span class="badge b-amber">${L('Fanandramana','Essai')}</span>`:`<span class="badge b-green">${L('Mandeha','Active')}</span>`):`<span class="badge b-red">${L('Tsy mandeha','Inactive')}</span>`;
 const n=active().length;
 return`<div class="row c2e"><div class="card"><div class="card-h"><div><h3>${L('Licence Sekoly','Licence Sekoly')}</h3><small>${esc(S.school.name)} · ${esc(SCHOOL)}</small></div>${badge}</div>
 <div class="info" style="grid-template-columns:1fr 1fr">
  <div><span>${L('Karazany','Type')}</span><b>${st.kind==='trial'?L('Fanandramana 30 andro','Essai 30 jours'):l?planL(l.plan):'—'}</b></div>
  <div><span>${L('Daty farany','Expire le')}</span><b>${fmtD(st.expires)}</b><small>${st.ok?st.days+' '+L('andro sisa','jour(s) restant(s)'):''}</small></div>
  <div><span>${L('Kaody','Code')}</span><b class="mono">${esc(l?.code||'—')}</b></div>
  <div><span>${L('Mpianatra','Élèves')}</span><b>${n}${st.max?' / '+st.max:''}</b></div>
 </div>
 <div class="sec-t">${L('Hampiditra kaody licence vaovao','Activer un nouveau code')}</div>${licForm()}
 <p class="muted small" style="margin-top:12px">${L('Ny kaody licence dia omen\'ny mpivarotra Sekoly. Raha misy kaody vaovao ampidirina, dia io no manolo ny teo aloha.','Le code est fourni par l\'éditeur de Sekoly. Un nouveau code remplace le précédent.')}</p></div>
 <div class="card"><div class="card-h"><h3>${L('Fepetra','Conditions')}</h3></div><ul class="lic-ul">
  <li>${L('30 andro fanandramana maimaim-poana isaky ny sekoly vaovao.','30 jours d\'essai gratuit pour chaque nouvelle école.')}</li>
  <li>${L('Aorian\'izay, mila licence mandeha ny fanovana rehetra (fisoratana, vola, naoty…).','Ensuite, une licence valide est nécessaire pour toute modification (inscriptions, paiements, notes…).')}</li>
  <li>${L('Na lany daty aza ny licence, dia tsy very ny angona ary azo ampidinina foana.','Même expirée, les données restent conservées et téléchargeables.')}</li>
  <li>${L('Ny isan\'ny mpianatra dia voafetra araka ny karazana licence.','Le nombre d\'élèves dépend du type de licence.')}</li>
 </ul></div></div>`;
}

/* ---------- vendor console ---------- */
V.licences=()=>{
 if(!IS_VENDOR)return emptyBox('lock',L('Tsy azonao jerena','Accès réservé'));
 const all=S.licenses||[],now=Date.now();
 const stat=l=>l.status!=='active'?['b-gray',L('Nofoanana','Révoquée')]:(l.expires||0)<now?['b-red',L('Lany daty','Expirée')]:l.school?['b-green',L('Ampiasaina','Activée')]:['b-blue',L('Mbola tsy nampiasaina','Disponible')];
 return`<div class="stats s4"><div class="stat"><b>${all.length}</b><span>${L('Licence rehetra','Licences')}</span></div><div class="stat g"><b>${all.filter(l=>l.status==='active'&&l.school&&(l.expires||0)>now).length}</b><span>${L('Ampiasaina','Activées')}</span></div><div class="stat"><b>${all.filter(l=>l.status==='active'&&!l.school&&(l.expires||0)>now).length}</b><span>${L('Mbola malalaka','Disponibles')}</span></div><div class="stat r"><b>${all.filter(l=>(l.expires||0)<now&&l.status==='active').length}</b><span>${L('Lany daty','Expirées')}</span></div></div>
 <div class="row c2r"><div class="card"><div class="card-h"><div><h3>${L('Hamorona licence','Créer des licences')}</h3><small>${L('Ho an\'ny sekoly mpanjifa','Pour vos écoles clientes')}</small></div></div>
 <form data-form="licCreate" class="stack">
  ${sel(L('Karazany','Formule'),'plan',PLANS().map(([k,l])=>[k,l]),'standard')}
  ${sel(L('Faharetany','Durée'),'dur',DURATIONS(),'sy')}
  ${fld(L('Sekoly mpanjifa / fanamarihana','École cliente / note'),'note','','text','placeholder="EPP Ambohidratrimo — tél 034…"')}
  ${fld(L('Isany','Nombre de codes'),'qty',1,'number','min="1" max="20"')}
  <button class="btn pri block">${ic('plus',16)} ${L('Hamorona','Générer')}</button>
 </form></div>
 <div class="card np"><div class="card-h pad"><div><h3>${L('Lisitry ny licence','Liste des licences')}</h3></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Kaody','Code')}</th><th>${L('Karazany','Formule')}</th><th>${L('Daty farany','Expire')}</th><th>${L('Sekoly','École')}</th><th>${L('Sata','Statut')}</th><th></th></tr></thead><tbody>
 ${all.length?all.map(l=>{const[c,t]=stat(l);return`<tr><td><b class="mono">${esc(l.code)}</b><div class="muted xs">${esc(l.note||'')}</div></td><td class="small">${planL(l.plan)}</td><td>${fmtD(l.expires)}</td><td>${l.school?`<span class="badge b-teal nd mono">${esc(l.school)}</span><div class="muted xs">${fmtD(l.activatedAt)}</div>`:'—'}</td><td><span class="badge ${c}">${t}</span></td><td><div class="acts"><button class="icon-btn" data-act="licCopy" data-c="${esc(l.code)}" title="${L('Adikao','Copier')}">${ic('copy',15)}</button><button class="icon-btn" data-act="licExtend" data-c="${esc(l.code)}" title="${L('Hanitatra 1 taona','Prolonger d\'1 an')}">${ic('plus',15)}</button>${l.status==='active'?`<button class="icon-btn del" data-act="licRevoke" data-c="${esc(l.code)}" title="${L('Foanana','Révoquer')}">${ic('x',15)}</button>`:`<button class="icon-btn" data-act="licRestore" data-c="${esc(l.code)}" title="${L('Averina','Réactiver')}">${ic('refresh',15)}</button>`}</div></td></tr>`}).join(''):`<tr><td colspan="6">${emptyBox('shield',L('Mbola tsy misy licence','Aucune licence'))}</td></tr>`}
 </tbody></table></div></div></div>`;
};

Object.assign(A,{
 licGo:()=>{ui.setTab='licence';location.hash='fikirakirana';render()},
 vendorGo:()=>{location.hash='licences';render()},
 licCopy:d=>{const l=(S.licenses||[]).find(x=>x.code===d.c)||{};copyText(`Sekoly — ${L('Kaody licence','Code de licence')}: ${d.c}\n${L('Karazany','Formule')}: ${planL(l.plan)} · ${L('Mandeha hatramin\'ny','Valable jusqu\'au')} ${fmtD(l.expires)}\n${L('Fampidirana','Activation')}: ${location.origin+location.pathname} → ${L('Fikirakirana → Licence','Paramètres → Licence')}`)},
 licExtend:d=>confirmBox(`${L('Hanitatra 1 taona ny licence','Prolonger d\'un an la licence')} <b class="mono">${esc(d.c)}</b> ?`,async()=>{const l=(S.licenses||[]).find(x=>x.code===d.c);const base=Math.max(Date.now(),l?.expires||0);const t=new Date(base);t.setFullYear(t.getFullYear()+1);try{await FB.updateDoc(FB.doc(FB.db,'licenses',d.c),{expires:t.getTime()});toast(L('Voaitatra','Prolongée'))}catch(e){toast(fbMsg(e),1)}},L('Hanitatra','Prolonger'),false),
 licRevoke:d=>confirmBox(`${L('Hanafoana ny licence','Révoquer la licence')} <b class="mono">${esc(d.c)}</b> ? ${L('Tsy afaka manova angona intsony ny sekoly mampiasa azy.','L\'école qui l\'utilise ne pourra plus modifier ses données.')}`,async()=>{try{await FB.updateDoc(FB.doc(FB.db,'licenses',d.c),{status:'revoked'});toast(L('Nofoanana','Révoquée'))}catch(e){toast(fbMsg(e),1)}},L('Foanana','Révoquer')),
 licRestore:async d=>{try{await FB.updateDoc(FB.doc(FB.db,'licenses',d.c),{status:'active'});toast(L('Naverina','Réactivée'))}catch(e){toast(fbMsg(e),1)}},
});
Object.assign(F,{
 licActivate:async d=>{const b=$('form[data-form=licActivate] button');if(b){b.disabled=true}try{const c=await activateLicense(d.code);toast(L('Mandeha ny licence','Licence activée')+' — '+c)}catch(e){toast(e.message||fbMsg(e),1)}if(b)b.disabled=false},
 licCreate:async d=>{const n=Math.min(20,Math.max(1,+d.qty||1)),plan=PLANS().find(p=>p[0]===d.plan),exp=durToExpiry(d.dur),codes=[];
  try{for(let i=0;i<n;i++){const c=genCode();await FB.setDoc(FB.doc(FB.db,'licenses',c),{plan:d.plan,maxStudents:plan?plan[2]:0,expires:exp,status:'active',school:null,note:d.note||'',createdAt:Date.now(),createdBy:user.uid});codes.push(c)}
   openModal(L('Licence vaovao','Nouvelles licences'),`<div class="hint" style="font-size:14px;line-height:1.9">${codes.map(c=>`<b class="mono">${c}</b>`).join('<br>')}<br>${planL(d.plan)} · ${L('hatramin\'ny','jusqu\'au')} ${fmtD(exp)}</div>`,`<button class="btn ghost" data-act="licCopyMany" data-c="${codes.join(',')}">${ic('copy',15)} ${L('Adikao','Copier')}</button>${doneBtn()}`,'sm')}catch(e){toast(fbMsg(e),1)}},
});
A.licCopyMany=d=>copyText(d.c.split(',').join('\n'));
