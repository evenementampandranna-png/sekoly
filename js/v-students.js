/* Sekoly — v-students.js : M1 inscriptions & dossiers élèves */
'use strict';
V.mpianatra=()=>{
 const mine=myClassIds();
 let list=S.students.filter(s=>mine.has(s.classId)&&(!ui.fcls||s.classId===ui.fcls));
 const f=ui.fst||'Mianatra';
 if(f==='late')list=list.filter(s=>dueAmount(s)>0);
 else if(f==='reinscr')list=list.filter(s=>s.status==='Mianatra'&&s.year&&s.year!==S.school.year);
 else if(f!=='all')list=list.filter(s=>s.status===f);
 const q=ui.q.trim().toLowerCase();
 if(q)list=list.filter(s=>`${s.last} ${s.first} ${s.first} ${s.last} ${s.matricule} ${s.parent} ${s.phone} ${cls(s.classId)?.name||''}`.toLowerCase().includes(q));
 const ci=Object.fromEntries(S.classes.map((c,i)=>[c.id,i]));
 list.sort((a,b)=>(ci[a.classId]-ci[b.classId])||fullName(a).localeCompare(fullName(b)));
 const showPay=canSee('sarany');
 return`
 <div class="toolbar">
  <div class="search">${ic('search',17)}<input id="q" data-in="q" placeholder="${L('Hikaroka anarana, laharana, kilasy…','Rechercher nom, matricule, classe…')}" value="${esc(ui.q)}"></div>
  <select class="inp" data-ch="fcls">${clsOpts(ui.fcls,L('Kilasy rehetra','Toutes les classes'),myClasses())}</select>
  <select class="inp" data-ch="fst">${[['Mianatra',L('Mianatra','Inscrits')],['all',L('Rehetra','Tous')],...(showPay?[['late',L('Misy trosa','Avec impayés')]]:[]),['reinscr',L('Tsy mbola nisoratra indray','Non réinscrits')],...STATUSES().slice(1)].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select>
  ${CAN.students()?`<button class="btn pri" data-act="newStudent">${ic('plus',16)} ${L('Mpianatra vaovao','Nouvel élève')}</button>`:''}
 </div>
 <div class="card np"><div class="card-h pad"><div><h3>${L('Lisitry ny mpianatra','Liste des élèves')}</h3><small>${list.length} / ${S.students.length}</small></div>
  <div class="toolbar"><button class="btn ghost sm" data-act="printList">${ic('print',15)} ${L('Lisitry ny kilasy','Liste de classe')}</button><button class="btn ghost sm" data-act="printCards">${ic('card',15)} ${L('Karatra','Cartes d\'élève')}</button><button class="btn ghost sm" data-act="xlsStudents">${ic('download',15)} Excel</button></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Mpianatra','Élève')}</th><th>${L('Laharana','Matricule')}</th><th>${L('Kilasy','Classe')}</th><th>${L('Ray aman-dreny','Parents')}</th>${showPay?`<th>${L('Vola','Paiement')}</th>`:''}<th>${L('Sata','Statut')}</th><th></th></tr></thead><tbody>
 ${list.length?list.map(s=>{const c=cls(s.classId),d=showPay?dueAmount(s):0,n=showPay?lateMonths(s):0;
  return`<tr class="click" data-act="viewStudent" data-sid="${s.id}"><td>${stuWho(s,`${s.sex==='L'?L('Lahy','M'):L('Vavy','F')} · ${fmtDate(s.birth)}${ageOf(s.birth)!=null?' · '+ageOf(s.birth)+' '+L('taona','ans'):''}`)}</td>
  <td><span class="mono">${esc(s.matricule)}</span></td><td>${clsBadge(c)}</td>
  <td><b class="fw5">${esc(s.parent||'—')}</b><div class="muted small">${esc(s.phone||'')}</div></td>
  ${showPay?`<td>${s.status!=='Mianatra'?'—':d===0?`<span class="badge b-green">${L('Voaloa','À jour')}</span>`:`<span class="badge ${n>1?'b-red':'b-amber'}">${fmt(d)}</span>`}</td>`:''}
  <td>${s.status==='Mianatra'?(s.year&&s.year!==S.school.year?`<span class="badge b-amber nd">${L('Tsy nisoratra indray','Non réinscrit')}</span>`:`<span class="badge b-teal nd">${statusL(s.status)}</span>`):`<span class="badge b-gray nd">${statusL(s.status)}</span>`}${(s.parentUids||[]).length?` <span title="${L('Manana kaonty ray aman-dreny','Compte parent actif')}">👪</span>`:''}</td>
  <td><div class="acts">${CAN.pay()&&s.status==='Mianatra'?`<button class="icon-btn" data-act="payFor" data-sid="${s.id}" title="${L('Andoavy','Encaisser')}">${ic('card',16)}</button>`:''}${CAN.students()?`<button class="icon-btn" data-act="editStudent" data-sid="${s.id}">${ic('edit',16)}</button>`:''}</div></td></tr>`}).join(''):`<tr><td colspan="7">${emptyBox('users',L('Tsy misy mpianatra hita','Aucun élève trouvé'))}</td></tr>`}
 </tbody></table></div></div>`;
};
Object.assign(I,{q:el=>{ui.q=el.value;render()}});
Object.assign(C,{fcls:el=>{ui.fcls=el.value;render()},fst:el=>{ui.fst=el.value;render()},
 photo:async el=>{const f=el.files[0];if(!f)return;try{const d=await readImage(f,280,.8);$('#fm input[name=photo]').value=d;$('#phprev').innerHTML=`<img src="${d}">`}catch(e){toast(L('Sary tsy mety','Image invalide'),1)}},
 docUp:async el=>{const f=el.files[0];if(!f)return;const sid=el.dataset.sid,type=$('#doctype')?.value||'Hafa';
  try{let data;if(f.type.startsWith('image/'))data=await readImage(f,1400,.75);else{if(f.size>700000){toast(L('Lehibe loatra (700 Ko max)','Fichier trop lourd (700 Ko max)'),1);return}data=await readFileData(f)}
   await addFile({studentId:sid,name:f.name,type,mime:f.type||'image/jpeg',size:Math.round(data.length*.75),data});log('file.add',`${fullName(stu(sid))}: ${type} ${f.name}`);toast(L('Voatahiry ny taratasy','Document enregistré'));loadDocs(sid)}catch(e){toast(fbMsg(e),1)}}});

function studentForm(s){
 s=s||{classId:ui.fcls||myClasses()[0]?.id,sex:'L',status:'Mianatra',start:curMonthIdx(),entry:'Vaovao',year:S.school.year};
 openModal(s.id?L('Hanova ny mombamomba','Modifier la fiche'):L('Fisoratana anarana vaovao','Nouvelle inscription'),`<form data-form="student" id="fm"><input type="hidden" name="id" value="${s.id||''}"><input type="hidden" name="photo" value="${esc(s.photo||'')}">
 <div class="photo-row"><div class="photo-prev" id="phprev">${s.photo?`<img src="${s.photo}">`:ic('image',28)}</div><label class="btn ghost sm">${ic('upload',15)} ${L('Sary','Photo')}<input type="file" accept="image/*" data-ch="photo" hidden></label>${s.photo?`<button type="button" class="btn ghost sm" onclick="document.querySelector('#fm input[name=photo]').value='';document.getElementById('phprev').innerHTML=''">${ic('trash',14)}</button>`:''}</div>
 <div class="sec-t">${ic('user',15)} ${L('Mombamomba','Identité')}</div>
 <div class="grid2">
  ${fld(L('Anarana','Nom')+' *','last',s.last,'text','required')}
  ${fld(L("Fanampin'anarana",'Prénoms')+' *','first',s.first,'text','required')}
  ${sel(L('Lahy / Vavy','Sexe'),'sex',[['L',L('Lahy','Masculin')],['V',L('Vavy','Féminin')]],s.sex)}
  ${fld(L('Daty nahaterahana','Date de naissance'),'birth',s.birth,'date')}
  ${fld(L('Toerana nahaterahana','Lieu de naissance'),'birthPlace',s.birthPlace)}
  ${fld(L('Adiresy','Adresse'),'address',s.address)}
 </div>
 <div class="sec-t">${ic('users',15)} ${L('Ray aman-dreny / mpiahy','Parents / tuteurs')}</div>
 <div class="grid2">
  ${fld(L('Ray aman-dreny 1','Parent / tuteur 1'),'parent',s.parent)}${fld(L('Finday 1','Téléphone 1'),'phone',s.phone,'tel')}
  ${fld(L('Ray aman-dreny 2','Parent / tuteur 2'),'parent2',s.parent2)}${fld(L('Finday 2','Téléphone 2'),'phone2',s.phone2,'tel')}
 </div>
 <div class="sec-t">${ic('layers',15)} ${L('Fisoratana','Scolarité')}</div>
 <div class="grid2">
  ${sel(L('Kilasy','Classe')+' *','classId',S.classes.map(c=>[c.id,`${c.name} — ${fmt(c.fee)}/${L('volana','mois')}`]),s.classId)}
  ${sel(L('Karazana fidirana',"Type d'entrée"),'entry',ENTRIES(),s.entry||'Vaovao')}
  ${fld(L('Sekoly niaviana','École de provenance'),'origin',s.origin)}
  ${sel(L('Mandoa saram-pianarana manomboka','Écolage dû à partir de'),'start',MONTHS_MG.map((m,i)=>[i,MONTH(i)]),s.start||0)}
  ${sel(L('Fihenam-bidy','Réduction'),'reducType',REDUC(),s.reduc?.type||'')}
  ${fld(L('Fihenam-bidy (%)','Réduction (%)'),'reducPct',s.reduc?.pct||'','number','min="0" max="100"')}
 </div>
 ${s.id?'':`<label class="check" style="margin-top:12px"><input type="checkbox" name="payIns" ${CAN.pay()?'checked':'disabled'}> <span>${L('Handray ny saram-pidirana avy hatrany','Encaisser le droit d\'inscription maintenant')}</span></label>`}
 </form>`,cancelBtn()+saveBtn(),'lg');
}
function viewStudent(id){
 const s=stu(id);if(!s)return;const c=cls(s.classId)||{},at=studentAtt(s),showPay=canSee('sarany');
 const termsHtml=TERMS().map(([t,l])=>{const rk=ranking(s.classId,t),me=rk.find(x=>x.s.id===s.id);return`<div class="stat"><b>${f2(me?.avg)}</b><span>${l}${me?.rank?` · ${me.rank}/${rk.length}`:''}</span></div>`}).join('');
 const sanc=S.sanctions.filter(x=>x.studentId===s.id).sort((a,b)=>b.date.localeCompare(a.date));
 const parents=Object.entries(S.members||{}).filter(([u,m])=>(s.parentUids||[]).includes(u));
 openModal(L('Antontan-taratasin\'ny mpianatra','Dossier élève'),`
 <div class="prof-h">${s.photo?`<img class="avs xl" src="${s.photo}">`:avs(fullName(s),s.id).replace('class="avs"','class="avs xl"')}<div><h2>${esc(fullName(s))}</h2><div class="tags">${clsBadge(c)}<span class="badge b-gray nd mono">${esc(s.matricule)}</span><span class="badge ${s.status==='Mianatra'?'b-teal':'b-gray'} nd">${statusL(s.status)}</span>${showPay&&s.status==='Mianatra'?(dueAmount(s)?`<span class="badge b-red">${L('Trosa','Solde dû')}: ${fmt(dueAmount(s))}</span>`:`<span class="badge b-green">${L('Voaloa daholo','À jour')}</span>`):''}</div></div></div>
 <div class="info">
  <div><span>${L('Teraka','Naissance')}</span><b>${s.birth?fmtDate(s.birth):''}${s.birth&&s.birthPlace?' — ':''}${esc(s.birthPlace||'')}${!s.birth&&!s.birthPlace?'—':''}</b></div><div><span>${L('Lahy/Vavy','Sexe')}</span><b>${s.sex==='L'?L('Lahy','Masculin'):L('Vavy','Féminin')}</b></div><div><span>${L('Adiresy','Adresse')}</span><b>${esc(s.address||'—')}</b></div>
  <div><span>${L('Ray aman-dreny','Parent / tuteur')}</span><b>${esc(s.parent||'—')}</b><small>${esc(s.phone||'')}</small></div><div><span>${L('Ray aman-dreny 2','Parent 2')}</span><b>${esc(s.parent2||'—')}</b><small>${esc(s.phone2||'')}</small></div><div><span>${L('Fidirana','Entrée')}</span><b>${esc((ENTRIES().find(e=>e[0]===s.entry)||[0,'—'])[1])}</b><small>${esc(s.origin||'')}</small></div>
  ${s.reduc?.pct?`<div><span>${L('Fihenam-bidy','Réduction')}</span><b>${esc((REDUC().find(r=>r[0]===s.reduc.type)||[0,''])[1])} −${s.reduc.pct}%</b></div>`:''}
  ${s.status!=='Mianatra'?`<div><span>${statusL(s.status)}</span><b>${fmtDate(s.statusDate)}</b><small>${esc(s.statusNote||'')}</small></div>`:''}
 </div>
 ${showPay?`<div class="sec-t">${ic('card',16)} ${L('Saram-pianarana','Écolage')} ${esc(S.school.year)} · ${fmt(fee(s))}/${L('volana','mois')}</div>
 <div class="months">${MONTHS_MG.map((m,i)=>{const st=mstat(s,i),p=paid(s.id,i);return`<div class="mchip ${st}" ${isDue(st)&&CAN.pay()?`data-act="payFor" data-sid="${s.id}" data-m="${i}"`:''}>${MSH(i)}<small>${st==='paid'?'✓':st==='partial'?short(p)+'/'+short(fee(s)):st==='future'||st==='skip'?'—':L('Tsy voaloa','Impayé')}</small></div>`}).join('')}</div>
 <div class="fees-row">${FEE_ITEMS().map(([k,l])=>{const f=itemFee(s,k);if(!f)return'';const p=paidItem(s.id,k);return`<span class="badge ${p>=f?'b-green':'b-red'} nd">${l}: ${p>=f?'✓':fmt(f-p)}</span>`}).join('')}</div>`:''}
 <div class="row c2e" style="margin-top:6px">
  <div><div class="sec-t">${ic('checks',16)} ${L('Fahatongavana','Assiduité')}</div><div class="stats s4"><div class="stat g"><b>${at.P}</b><span>${ATT.P()}</span></div><div class="stat a"><b>${at.R}</b><span>${ATT.R()}</span></div><div class="stat r"><b>${at.A}</b><span>${L('Tsy nanana antony','Non justifiées')}</span></div><div class="stat"><b>${at.J}</b><span>${L('Nanana antony','Justifiées')}</span></div></div></div>
  <div><div class="sec-t">${ic('award',16)} ${L('Salan\'isa','Moyennes')}</div><div class="stats" style="grid-template-columns:repeat(${TERMS().length},1fr)">${termsHtml}</div></div>
 </div>
 ${sanc.length?`<div class="sec-t">${ic('flag',16)} ${L('Sazy','Sanctions')}</div><div class="list">${sanc.map(x=>`<div class="li"><span class="badge b-red nd">${esc((SANCTIONS().find(y=>y[0]===x.type)||[0,x.type])[1])}</span><div class="who"><div><b class="fw5">${esc(x.motif||'')}</b><small>${fmtDate(x.date)}${x.days?' · '+x.days+' '+L('andro','j'):''} · ${esc(x.by||'')}</small></div></div></div>`).join('')}</div>`:''}
 <div class="sec-t">${ic('clip',16)} ${L('Taratasy voaskana','Pièces jointes')}</div>
 <div id="docs"><div class="muted small">${L('Maka…','Chargement…')}</div></div>
 ${CAN.students()?`<div class="doc-up"><select id="doctype" class="inp">${[L('Kopia nahaterahana','Acte de naissance'),L('Fanamarinana fianarana','Certificat de scolarité'),L('Kara-naoty taloha','Bulletin antérieur'),L('Hafa','Autre')].map(x=>`<option>${x}</option>`).join('')}</select><label class="btn ghost sm">${ic('upload',15)} ${L('Ampidiro rakitra','Ajouter un fichier')}<input type="file" accept="image/*,application/pdf" data-ch="docUp" data-sid="${s.id}" hidden></label></div>`:''}
 ${CAN.parentAccounts()?`<div class="sec-t">${ic('shield',16)} ${L('Kaonty ray aman-dreny / mpianatra','Comptes parents / élève')}</div>
 <div class="list">${parents.map(([u,m])=>`<div class="li"><div class="who"><div><b>${esc(m.name)}</b><small>${esc(m.login)} · ${roleL(m.role)}</small></div></div><div class="r"><button class="icon-btn del" data-act="unlinkParent" data-sid="${s.id}" data-uid="${u}">${ic('x',15)}</button></div></div>`).join('')||`<div class="muted small">${L('Tsy mbola misy','Aucun compte')}</div>`}</div>
 <div class="toolbar" style="margin-top:8px"><button class="btn ghost sm" data-act="parentAccount" data-sid="${s.id}" data-role="Parent">${ic('userplus',15)} ${L('Kaonty ray aman-dreny','Compte parent')}</button><button class="btn ghost sm" data-act="parentAccount" data-sid="${s.id}" data-role="Eleve">${ic('userplus',15)} ${L('Kaonty mpianatra','Compte élève')}</button></div>`:''}
 `,`<div class="toolbar" style="margin-right:auto">${CAN.students()?`<button class="btn ghost sm" data-act="certificat" data-sid="${s.id}">${ic('print',15)} ${L('Fanamarinana','Certificat')}</button><button class="btn ghost sm" data-act="printCards" data-sid="${s.id}">${ic('card',15)} ${L('Karatra','Carte')}</button><button class="btn ghost sm" data-act="statusChange" data-sid="${s.id}">${ic('arrow',15)} ${L('Fifindrana / fialana','Transfert / sortie')}</button>`:''}${CAN.students()&&s.status==='Mianatra'&&s.year!==S.school.year?`<button class="btn ghost sm" data-act="reinscrire" data-sid="${s.id}">${ic('refresh',15)} ${L('Soraty indray','Réinscrire')}</button>`:''}</div>
 <button class="btn ghost" data-act="bulletin" data-sid="${s.id}" data-t="${currentTerm()}">${ic('file',16)} ${L('Kara-naoty','Bulletin')}</button>${CAN.students()?`<button class="btn ghost" data-act="editStudent" data-sid="${s.id}">${ic('edit',16)} ${L('Hanova','Modifier')}</button>`:''}${CAN.pay()&&s.status==='Mianatra'?`<button class="btn pri" data-act="payFor" data-sid="${s.id}">${ic('card',16)} ${L('Andoavy','Encaisser')}</button>`:''}`,'lg');
 loadDocs(s.id);
}
let docCache={};
async function loadDocs(sid){const box=$('#docs');if(!box)return;try{const fs=await listFiles(sid);docCache=Object.fromEntries(fs.map(f=>[f.id,f]));if(!$('#docs'))return;$('#docs').innerHTML=fs.length?`<div class="docs">${fs.map(f=>`<div class="doc">${f.mime?.startsWith('image/')?`<img src="${f.data}">`:`<div class="doc-ic">${ic('file',26)}</div>`}<div class="doc-m"><b>${esc(f.type)}</b><small>${esc(f.name)} · ${Math.round((f.size||0)/1024)} Ko</small></div><div class="acts"><button class="icon-btn" data-act="docOpen" data-id="${f.id}">${ic('eye',15)}</button>${CAN.students()?`<button class="icon-btn del" data-act="docDel" data-id="${f.id}" data-sid="${sid}">${ic('trash',15)}</button>`:''}</div></div>`).join('')}</div>`:`<div class="muted small">${L('Tsy misy taratasy','Aucun document')}</div>`}catch(e){if($('#docs'))$('#docs').innerHTML=`<div class="muted small">${esc(fbMsg(e))}</div>`}}

/* ---------- prints ---------- */
function printClassList(cid){const c=cls(cid);const ss=S.students.filter(s=>s.classId===cid&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 return`<div class="pg">${printHead(`Liste de classe — ${esc(c.name)}`,`Année scolaire ${esc(S.school.year)} · Effectif : ${ss.length} (${ss.filter(s=>s.sex==='L').length} G / ${ss.filter(s=>s.sex==='V').length} F) · Titulaire : ${esc(tea(c.teacherId)?.name||'—')}`)}
 <table class="pt"><thead><tr><th>N°</th><th>Matricule</th><th>Nom et prénoms</th><th>Sexe</th><th>Date de naissance</th><th>Lieu</th><th>Parent / tuteur</th><th>Téléphone</th></tr></thead><tbody>${ss.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.matricule)}</td><td><b>${esc(s.last.toUpperCase())}</b> ${esc(s.first)}</td><td>${s.sex==='L'?'M':'F'}</td><td>${fmtDate(s.birth)}</td><td>${esc(s.birthPlace||'')}</td><td>${esc(s.parent||'')}</td><td>${esc(s.phone||'')}</td></tr>`).join('')}</tbody></table>
 <div class="psign"><div></div><div>Fait à ${esc(S.school.city||'')}, le ${dateFR(today())}<br>Le Directeur</div></div></div>`}
function cardHTML(s){const c=cls(s.classId)||{};return`<div class="idcard"><div class="idc-h"><div class="ph-logo sm">${ic('cap',14)}</div><div><b>${esc(S.school.name)}</b><small>CARTE D'ÉLÈVE · ${esc(S.school.year)}</small></div></div><div class="idc-b">${s.photo?`<img src="${s.photo}">`:`<div class="idc-ph">${esc(initials(fullName(s)))}</div>`}<div><b>${esc(s.last.toUpperCase())}</b><span>${esc(s.first)}</span><small>Né(e) le ${fmtDate(s.birth)}${s.birthPlace?' à '+esc(s.birthPlace):''}</small><small>Classe : <b>${esc(c.name||'')}</b></small><small>Matricule : <b>${esc(s.matricule)}</b></small></div></div><div class="idc-f">${esc(S.school.phone||'')} · Parent : ${esc(s.phone||'')}</div></div>`}
function certificatHTML(s){const c=cls(s.classId)||{};return`<div class="pg cert">${printHead('CERTIFICAT DE SCOLARITÉ',`N° ${esc(s.matricule)}/${esc(S.school.year)}`)}
 <p style="margin-top:40px">Je soussigné(e), <b>${esc(S.school.director||'…………………')}</b>, Directeur de l'établissement <b>${esc(S.school.name)}</b>, certifie que l'élève :</p>
 <table class="cert-t"><tr><td>Nom et prénoms</td><td><b>${esc(s.last.toUpperCase())} ${esc(s.first)}</b></td></tr><tr><td>Né(e) le</td><td>${dateFR(s.birth)||'…'} ${s.birthPlace?'à '+esc(s.birthPlace):''}</td></tr><tr><td>Matricule</td><td>${esc(s.matricule)}</td></tr><tr><td>Fils / fille de</td><td>${esc(s.parent||'…')}</td></tr></table>
 <p>est régulièrement inscrit(e) dans notre établissement en classe de <b>${esc(c.name||'')}</b> pour l'année scolaire <b>${esc(S.school.year)}</b>${s.status!=='Mianatra'?` (situation actuelle : ${esc(STATUSES().find(x=>x[0]===s.status)?.[1]||s.status)} le ${fmtDate(s.statusDate)})`:''}.</p>
 <p>En foi de quoi, le présent certificat lui est délivré pour servir et valoir ce que de droit.</p>
 <div class="psign"><div></div><div>Fait à ${esc(S.school.city||'')}, le ${dateFR(today())}<br><br>Le Directeur<br><br><br>${esc(S.school.director||'')}</div></div></div>`}

Object.assign(A,{
 newStudent:()=>studentForm(),
 editStudent:d=>studentForm(stu(d.sid)),
 viewStudent:(d,el,e)=>{if(e.target.closest('.acts'))return;viewStudent(d.sid)},
 printList:()=>{const ids=ui.fcls?[ui.fcls]:myClasses().map(c=>c.id);printHTML(ids.map(printClassList).join(''),'Liste de classe')},
 printCards:d=>{const ss=d.sid?[stu(d.sid)]:S.students.filter(s=>s.status==='Mianatra'&&(ui.fcls?s.classId===ui.fcls:myClassIds().has(s.classId)));printHTML(`<div class="cards">${ss.map(cardHTML).join('')}</div>`,'Cartes')},
 certificat:d=>{const s=stu(d.sid);log('print.certificat',fullName(s));printHTML(certificatHTML(s),'Certificat')},
 xlsStudents:()=>{const rows=[['Matricule','Nom','Prénoms','Sexe','Naissance','Lieu','Classe','Statut','Parent','Téléphone','Parent 2','Téléphone 2','Adresse','Réduction %','Solde dû (Ar)']];S.students.filter(s=>myClassIds().has(s.classId)).forEach(s=>rows.push([s.matricule,s.last,s.first,s.sex==='L'?'M':'F',s.birth||'',s.birthPlace||'',cls(s.classId)?.name||'',s.status,s.parent||'',s.phone||'',s.parent2||'',s.phone2||'',s.address||'',s.reduc?.pct||0,canSee('sarany')?dueAmount(s):'']));exportXLSX('eleves_'+SCHOOL,[{name:'Élèves',rows}])},
 docOpen:d=>{const f=docCache[d.id];if(!f)return;openModal(esc(f.type)+' — '+esc(f.name),f.mime?.startsWith('image/')?`<img src="${f.data}" style="max-width:100%;border-radius:12px">`:`<p>${L('Rakitra PDF','Document PDF')}</p>`,`<button class="btn ghost" data-act="docDl" data-id="${f.id}">${ic('download',16)} ${L('Ampidino','Télécharger')}</button>${doneBtn()}`,'lg')},
 docDl:d=>{const f=docCache[d.id];if(!f)return;fetch(f.data).then(r=>r.blob()).then(b=>download(f.name,b))},
 docDel:d=>confirmBox(L('Hamafa ity taratasy ity?','Supprimer ce document ?'),async()=>{try{await delFile(d.id);log('file.delete',d.id);viewStudent(d.sid)}catch(e){toast(fbMsg(e),1)}},L('Fafana','Supprimer')),
 statusChange:d=>{const s=stu(d.sid);openModal(L('Fifindrana / fialana','Transfert / sortie / exclusion'),`<form data-form="status" id="fm"><input type="hidden" name="id" value="${s.id}"><div class="grid2">${sel(L('Sata vaovao','Nouveau statut'),'status',STATUSES(),s.status)}${fld(L('Daty','Date'),'statusDate',s.statusDate||today(),'date')}<div class="full">${fld(L('Sekoly halehany / antony','École de destination / motif'),'statusNote',s.statusNote||'')}</div></div></form>`,cancelBtn()+saveBtn(),'sm')},
 reinscrire:d=>{const s=stu(d.sid);openModal(L('Fisoratana indray','Réinscription')+' '+esc(S.school.year),`<form data-form="reinscr" id="fm"><input type="hidden" name="id" value="${s.id}">${sel(L('Kilasy','Classe'),'classId',S.classes.map(c=>[c.id,c.name]),s.classId)}<label class="check" style="margin-top:12px"><input type="checkbox" name="payIns" ${CAN.pay()?'checked':'disabled'}> <span>${L('Handray ny saram-pidirana','Encaisser le droit d\'inscription')}</span></label></form>`,cancelBtn()+saveBtn(),'sm')},
 parentAccount:d=>{const s=stu(d.sid);const isP=d.role==='Parent';const login=isP?phoneNorm(s.phone)||('p'+s.matricule.replace(/\W/g,'')):('e'+s.matricule.replace(/\W/g,'').toLowerCase());const pass=String(Math.floor(100000+Math.random()*900000));
  openModal(isP?L('Kaonty ray aman-dreny','Compte parent'):L('Kaonty mpianatra','Compte élève'),`<form data-form="parentAcc" id="fm"><input type="hidden" name="sid" value="${s.id}"><input type="hidden" name="role" value="${d.role}"><div class="grid2"><div class="full">${fld(L('Anarana','Nom'),'name',isP?(s.parent||'Parent '+s.last):fullName(s),'text','required')}</div>${fld(L('Anarana fidirana','Identifiant'),'login',login,'text','required pattern="[A-Za-z0-9._\\-]{2,30}"')}${fld(L('Teny miafina','Mot de passe'),'pass',pass,'text','required minlength="6"')}</div><p class="hint" style="margin-top:12px">${L('Raha efa misy io anarana fidirana io (ray aman-dreny manan-janaka maromaro), dia ampiana an\'io kaonty io fotsiny ity zaza ity.','Si cet identifiant existe déjà (parent de plusieurs enfants), l\'enfant est simplement ajouté à ce compte.')}<br>${L('Kaody sekoly','Code école')}: <b>${esc(SCHOOL)}</b></p></form>`,cancelBtn()+saveBtn(),'sm')},
 unlinkParent:d=>confirmBox(L('Hanesorana ity kaonty ity amin\'ity mpianatra ity?','Retirer ce compte de cet élève ?'),async()=>{const s=stu(d.sid);s.parentUids=(s.parentUids||[]).filter(u=>u!==d.uid);save();const m=S.members[d.uid];try{const rest=(m?.students||[]).filter(x=>x!==s.id);if(rest.length)await updateMember(d.uid,{students:rest});else await removeMember(d.uid);log('parent.unlink',fullName(s))}catch(e){toast(fbMsg(e),1)}viewStudent(s.id)},L('Esory','Retirer')),
});
Object.assign(F,{
 student:d=>{
  const reduc=d.reducType&&+d.reducPct?{type:d.reducType,pct:Math.min(100,+d.reducPct)}:null;
  const o={first:d.first.trim(),last:d.last.trim(),sex:d.sex,birth:d.birth,birthPlace:d.birthPlace,classId:d.classId,parent:d.parent,phone:d.phone,parent2:d.parent2,phone2:d.phone2,address:d.address,entry:d.entry,origin:d.origin,start:+d.start||0,reduc,photo:d.photo||''};
  if(d.id){Object.assign(stu(d.id),o);log('student.update',fullName(o));toast(L('Voatahiry','Enregistré'));save();closeModal();render();return}
  const yy=String(S.school.year).slice(2,4);const max=S.students.reduce((a,s)=>Math.max(a,parseInt(String(s.matricule||'').split('-').pop())||0),0);
  const s={id:'p'+uid(),matricule:`${yy}-${String(max+1).padStart(4,'0')}`,status:'Mianatra',year:S.school.year,created:today(),parentUids:[],...o};
  S.students.push(s);log('student.create',`${fullName(s)} (${s.matricule})`);save();closeModal();render();toast(L('Voasoratra','Élève inscrit')+': '+s.matricule);
  if(d.payIns&&CAN.pay()&&itemFee(s,'inscription')>0){ui.payTab='vaovao';ui.paySid=s.id;ui.payMonths=[];ui.payItems=['inscription'];location.hash='sarany'}
 },
 status:d=>{const s=stu(d.id);const old=s.status;Object.assign(s,{status:d.status,statusDate:d.statusDate,statusNote:d.statusNote});log('student.status',`${fullName(s)}: ${old} → ${d.status} (${d.statusNote||''})`);save();closeModal();render();toast(L('Voaova ny sata','Statut modifié'))},
 reinscr:d=>{const s=stu(d.id);s.classId=d.classId;s.year=S.school.year;s.start=0;log('student.reinscription',`${fullName(s)} → ${cls(d.classId)?.name}`);save();closeModal();render();toast(L('Voasoratra indray','Réinscrit'));if(d.payIns&&CAN.pay()){ui.payTab='vaovao';ui.paySid=s.id;ui.payMonths=[];ui.payItems=['inscription'];location.hash='sarany'}},
 parentAcc:async d=>{
  const s=stu(d.sid),login=d.login.trim().toLowerCase();
  const ex=Object.entries(S.members||{}).find(([u,m])=>m.login===login);
  try{
   let u;
   if(ex){if(!['Parent','Eleve'].includes(ex[1].role)){toast(L('Efa ampiasain\'ny mpiasa io anarana io','Identifiant déjà utilisé par un membre du personnel'),1);return}u=ex[0];await updateMember(u,{students:[...new Set([...(ex[1].students||[]),s.id])]});}
   else u=await createAccount(login,d.pass,{name:d.name.trim(),role:d.role,students:[s.id]});
   s.parentUids=[...new Set([...(s.parentUids||[]),u])];save();closeModal();
   openModal(L('Kaonty vonona','Compte prêt'),`<div class="hint" style="font-size:14px;line-height:1.8">${L('Kaody sekoly','Code école')}: <b>${esc(SCHOOL)}</b><br>${L('Anarana fidirana','Identifiant')}: <b>${esc(login)}</b><br>${ex?L('Teny miafina: ilay efa nananany','Mot de passe : inchangé'):L('Teny miafina','Mot de passe')+': <b>'+esc(d.pass)+'</b>'}<br>${L('Rohy','Lien')}: <b>${esc(location.origin+location.pathname)}</b></div>`,`<button class="btn ghost" data-act="smsAccount" data-sid="${s.id}" data-login="${esc(login)}" data-pass="${ex?'':esc(d.pass)}">${ic('send',15)} SMS</button>${doneBtn()}`,'sm');
  }catch(e){toast(fbMsg(e),1)}},
});
A.smsAccount=d=>{const s=stu(d.sid);queueSMS([{to:s.phone,name:s.parent,studentId:s.id,kind:'compte',text:`${S.school.name}: Espace parents ${location.origin+location.pathname} Code: ${SCHOOL} Identifiant: ${d.login}${d.pass?' Mot de passe: '+d.pass:''}`}]);closeModal()};
