/* Sekoly — v-staff.js : M8 personnel, présences du personnel, cahier de textes */
'use strict';
const POSTE_ROLE={Mpampianatra:'Mpampianatra',Tale:'Directeur',Sekretera:'Secretariat','Mpitahiry vola':'Kasie','Mpanara-maso':'Surveillant'};
V.mpiasa=()=>{
 const tabs=[user.role!=='Mpampianatra'&&['lisitra',L('Mpiasa','Personnel'),'brief'],CAN.staffAtt()&&['fanatrehana',L('Fanatrehan\'ny mpiasa','Présences du personnel'),'checks'],['lesona',L('Cahier de textes','Cahier de textes'),'book']];
 if(user.role==='Mpampianatra'&&ui.staffTab!=='lesona')ui.staffTab='lesona';
 const head=`<div class="toolbar">${tabsBar(ui.staffTab,tabs,'staffTab')}</div>`;
 if(ui.staffTab==='fanatrehana')return head+staffAttTab();
 if(ui.staffTab==='lesona')return head+lessonsTab();
 return head+staffList();
};
function staffList(){
 const q=ui.tq.trim().toLowerCase();const list=S.teachers.filter(t=>(!ui.tpost||(t.poste||'Mpampianatra')===ui.tpost)&&(!q||`${t.name} ${t.subject} ${t.phone}`.toLowerCase().includes(q)));
 const linked=Object.fromEntries(Object.entries(S.members||{}).filter(([u,m])=>m.teacherId).map(([u,m])=>[m.teacherId,m]));
 return`<div class="toolbar"><div class="search">${ic('search',17)}<input id="tq" data-in="tq" placeholder="${L('Hikaroka…','Rechercher…')}" value="${esc(ui.tq)}"></div><select class="inp" data-ch="tpost"><option value="">${L('Asa rehetra','Tous les postes')}</option>${POSTES().map(([k,l])=>`<option value="${k}" ${ui.tpost===k?'selected':''}>${l}</option>`).join('')}</select>${CAN.staff()?`<button class="btn pri" data-act="newTeacher">${ic('plus',16)} ${L('Mpiasa vaovao','Nouvel employé')}</button>`:''}<button class="btn ghost" data-act="xlsStaff">${ic('download',16)}</button></div>
 <div class="card np"><div class="tw"><table class="t"><thead><tr><th>${L('Anarana','Nom')}</th><th>${L('Asa','Poste')}</th><th>${L('Taranja / kilasy','Matière / classes')}</th><th>${L('Fifanarahana','Contrat')}</th><th>${L('Finday','Téléphone')}</th><th>${L('Kaonty','Compte')}</th><th></th></tr></thead><tbody>
 ${list.length?list.map(t=>{const cs=S.classes.filter(c=>c.teacherId===t.id||Object.values(c.assign||{}).includes(t.id));const acc=linked[t.id];return`<tr><td><div class="who">${avs(t.name,t.id)}<div><b>${esc(t.name)}</b><small>${esc(t.diplomas||'')}${t.since?' · '+L('nanomboka','depuis')+' '+esc(t.since):''}</small></div></div></td><td><span class="badge b-blue nd">${esc((POSTES().find(p=>p[0]===(t.poste||'Mpampianatra'))||[0,t.poste])[1])}</span></td><td class="small">${esc(t.subject||'')}${cs.length?'<div>'+cs.map(c=>clsBadge(c)).join(' ')+'</div>':''}</td><td class="small">${esc(t.contract||'—')}</td><td class="small">${esc(t.phone||'—')}</td><td>${acc?`<span class="badge b-green nd">${esc(acc.login)}</span>`:CAN.users()&&POSTE_ROLE[t.poste||'Mpampianatra']?`<button class="btn ghost sm" data-act="staffAccount" data-tid="${t.id}">${ic('userplus',14)} ${L('Hamorona','Créer')}</button>`:'—'}</td><td>${CAN.staff()?`<div class="acts"><button class="icon-btn" data-act="editTeacher" data-tid="${t.id}">${ic('edit',16)}</button><button class="icon-btn del" data-act="delTeacher" data-tid="${t.id}">${ic('trash',16)}</button></div>`:''}</td></tr>`}).join(''):`<tr><td colspan="7">${emptyBox('brief',L('Tsy misy','Aucun'))}</td></tr>`}
 </tbody></table></div></div>`;
}
function teacherForm(t){t=t||{poste:'Mpampianatra',contract:'CDI'};
 openModal(t.id?L('Antontan-taratasin\'ny mpiasa','Dossier employé'):L('Mpiasa vaovao','Nouvel employé'),`<form data-form="teacher" id="fm"><input type="hidden" name="id" value="${t.id||''}"><div class="grid2">
 <div class="full">${fld(L('Anarana feno','Nom complet')+' *','name',t.name,'text','required')}</div>
 ${sel(L('Asa','Poste'),'poste',POSTES(),t.poste||'Mpampianatra')}${fld(L('Taranja ampianarina','Matière enseignée'),'subject',t.subject,'text','list="subjl"')}<datalist id="subjl">${S.subjects.map(s=>`<option value="${esc(s.name)}">`).join('')}</datalist>
 ${fld(L('Daty nahaterahana','Date de naissance'),'birth',t.birth,'date')}${fld('CIN','cin',t.cin)}
 ${fld(L('Finday','Téléphone'),'phone',t.phone,'tel')}${fld(L('Mailaka','Email'),'email',t.email,'email')}
 <div class="full">${fld(L('Adiresy','Adresse'),'address',t.address)}</div>
 ${fld(L('Diplaoma','Diplômes'),'diplomas',t.diplomas)}${sel(L('Fifanarahana','Contrat'),'contract',CONTRACTS.map(c=>[c,c]),t.contract||'CDI')}
 ${fld(L('Nanomboka niasa','Date d\'embauche'),'since',t.since)}${fld(L('Fanamarihana','Observations'),'note',t.note)}
 </div></form>`,cancelBtn()+saveBtn(),'lg')}
function staffAttTab(){
 if(!ui.stD)ui.stD=today();const r=S.staffatt[ui.stD]||{};const cnt={P:0,R:0,A:0};Object.values(r).forEach(v=>cnt[v]=(cnt[v]||0)+1);
 return`<div class="toolbar"><input class="inp auto" type="date" data-ch="stD" value="${ui.stD}" max="${today()}"><span class="chip">${dateLong(new Date(ui.stD+'T12:00'))}</span><div style="flex:1"></div><button class="btn pri" data-act="stAll">${ic('check',16)} ${L('Tonga daholo','Tous présents')}</button></div>
 <div class="stats s3"><div class="stat g"><b>${cnt.P}</b><span>${ATT.P()}</span></div><div class="stat a"><b>${cnt.R}</b><span>${ATT.R()}</span></div><div class="stat r"><b>${cnt.A}</b><span>${ATT.A()}</span></div></div>
 <div class="card np"><div class="tw"><table class="t"><tbody>${S.teachers.map(t=>{const x=r[t.id];return`<tr><td><div class="who">${avs(t.name,t.id)}<div><b>${esc(t.name)}</b><small>${esc((POSTES().find(p=>p[0]===(t.poste||'Mpampianatra'))||[0,''])[1])}</small></div></div></td><td class="small muted">${(()=>{let a=0,n=0;for(const d in S.staffatt){const v=S.staffatt[d][t.id];if(v){n++;if(v==='A')a++}}return n?`${a} ${L('tsy tonga','abs.')} / ${n} ${L('andro','j')}`:''})()}</td><td class="r-cell"><div class="seg">${['P','R','A'].map(k=>`<button class="${k} ${x===k?'on':''}" data-act="stMark" data-tid="${t.id}" data-v="${k}">${ATT[k]()}</button>`).join('')}</div></td></tr>`}).join('')}</tbody></table></div></div>`;
}
function lessonsTab(){
 const mine=myClasses();if(ui.lesC&&!mine.some(c=>c.id===ui.lesC))ui.lesC='';
 const list=S.lessons.filter(l=>myClassIds().has(l.classId)&&(!ui.lesC||l.classId===ui.lesC)).sort((a,b)=>b.date.localeCompare(a.date));
 const canAdd=hasRole('Admin','Directeur','Mpampianatra');
 return`<div class="toolbar"><select class="inp" data-ch="lesC">${clsOpts(ui.lesC,L('Kilasy rehetra','Toutes les classes'),mine)}</select><div style="flex:1"></div>${canAdd?`<button class="btn pri" data-act="newLesson">${ic('plus',16)} ${L('Lesona vaovao','Nouvelle séance')}</button>`:''}</div>
 <div class="card np"><div class="list lessons">${list.length?list.slice(0,200).map(l=>`<div class="li"><div class="dbox" style="--c:${cls(l.classId)?.color||'#14b8a6'}"><b>${new Date(l.date+'T12:00').getDate()}</b><small>${MSH(monthOfDate(l.date))}</small></div><div class="who" style="flex:1"><div><b>${esc(sbj(l.subjectId)?.name||'')} · ${esc(cls(l.classId)?.name||'')}</b><small>${esc(tea(l.teacherId)?.name||'')}</small><div class="small">${esc(l.content||'')}</div>${l.homework?`<div class="hw">${ic('edit',13)} ${esc(l.homework)}${l.due?` — <b>${L('ho an\'ny','pour le')} ${fmtDate(l.due)}</b>`:''}</div>`:''}</div></div>${canAdd&&(isBoss()||l.teacherId===myTid())?`<div class="acts"><button class="icon-btn" data-act="editLesson" data-id="${l.id}">${ic('edit',15)}</button><button class="icon-btn del" data-act="delLesson" data-id="${l.id}">${ic('trash',15)}</button></div>`:''}</div>`).join(''):emptyBox('book',L('Tsy mbola misy lesona voasoratra','Aucune séance'))}</div></div>`;
}
function lessonForm(l){const mine=myClasses();l=l||{classId:ui.lesC||mine[0]?.id,date:today()};const c=cls(l.classId)||mine[0];
 openModal(l.id?L('Hanova lesona','Modifier la séance'):L('Lesona vaovao','Nouvelle séance'),`<form data-form="lesson" id="fm"><input type="hidden" name="id" value="${l.id||''}"><div class="grid2">
 ${sel(L('Kilasy','Classe'),'classId',mine.map(x=>[x.id,x.name]),l.classId,'data-ch="lesFormC"')}<label class="fld"><span>${L('Taranja','Matière')}</span><select name="subjectId" id="lesSb">${mySubjects(c).map(x=>`<option value="${x.id}" ${x.id===l.subjectId?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
 ${fld(L('Daty','Date'),'date',l.date,'date','required')}<div></div>
 <div class="full">${area(L('Votoatin\'ny lesona','Contenu de la séance'),'content',l.content,'required')}</div>
 <div class="full">${area(L('Asa an-trano','Devoirs donnés'),'homework',l.homework)}</div>
 ${fld(L('Hatolotra ny','À rendre le'),'due',l.due,'date')}
 </div></form>`,cancelBtn()+saveBtn())}
Object.assign(A,{
 staffTab:d=>{ui.staffTab=d.k;render()},
 newTeacher:()=>teacherForm(),editTeacher:d=>teacherForm(tea(d.tid)),
 delTeacher:d=>{const t=tea(d.tid);confirmBox(L('Hamafa','Supprimer')+` <b>${esc(t.name)}</b> ?`,()=>{S.teachers=S.teachers.filter(x=>x.id!==t.id);S.classes.forEach(c=>{if(c.teacherId===t.id)c.teacherId='';for(const k in c.assign||{})if(c.assign[k]===t.id)delete c.assign[k]});log('staff.delete',t.name);save();render()},L('Fafana','Supprimer'))},
 staffAccount:d=>{const t=tea(d.tid);const role=POSTE_ROLE[t.poste||'Mpampianatra'];const login=(t.name.split(/\s+/).pop()||'user').toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');const pass=String(Math.floor(100000+Math.random()*900000));
  openModal(L('Kaonty ho an\'i','Compte pour')+' '+esc(t.name),`<form data-form="addUser" id="fm"><input type="hidden" name="teacherId" value="${t.id}"><input type="hidden" name="name" value="${esc(t.name)}"><div class="grid2">${fld(L('Anarana fidirana','Identifiant'),'login',login,'text','required pattern="[A-Za-z0-9._\\-]{2,30}"')}${fld(L('Teny miafina','Mot de passe'),'pass',pass,'text','required minlength="6"')}<div class="full">${sel(L('Andraikitra','Rôle'),'role',STAFF_ROLES.map(r=>[r,roleL(r)]),role)}</div></div></form>`,cancelBtn()+saveBtn(),'sm')},
 xlsStaff:()=>{const rows=[['Nom','Poste','Matière','Contrat','Diplômes','Téléphone','Email','CIN','Naissance','Embauche']];S.teachers.forEach(t=>rows.push([t.name,t.poste||'Mpampianatra',t.subject||'',t.contract||'',t.diplomas||'',t.phone||'',t.email||'',t.cin||'',t.birth||'',t.since||'']));exportXLSX('personnel_'+SCHOOL,[{name:'Personnel',rows}])},
 stMark:d=>{const r={...(S.staffatt[ui.stD]||{})};r[d.tid]=r[d.tid]===d.v?undefined:d.v;if(!r[d.tid])delete r[d.tid];S.staffatt[ui.stD]=r;save();render()},
 stAll:()=>{const r={...(S.staffatt[ui.stD]||{})};S.teachers.forEach(t=>{if(!r[t.id])r[t.id]='P'});S.staffatt[ui.stD]=r;save();render()},
 newLesson:()=>lessonForm(),editLesson:d=>lessonForm(S.lessons.find(l=>l.id===d.id)),
 delLesson:d=>confirmBox(L('Hamafa?','Supprimer ?'),()=>{S.lessons=S.lessons.filter(l=>l.id!==d.id);save();render()},L('Fafana','Supprimer')),
});
Object.assign(C,{tpost:el=>{ui.tpost=el.value;render()},stD:el=>{if(el.value){ui.stD=el.value;render()}},lesC:el=>{ui.lesC=el.value;render()},
 lesFormC:el=>{const c=cls(el.value);$('#lesSb').innerHTML=mySubjects(c).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}});
I.tq=el=>{ui.tq=el.value;render()};
Object.assign(F,{
 teacher:d=>{const o={name:d.name.trim(),poste:d.poste,subject:d.subject,birth:d.birth,cin:d.cin,phone:d.phone,email:d.email,address:d.address,diplomas:d.diplomas,contract:d.contract,since:d.since,note:d.note};if(d.id)Object.assign(tea(d.id),o);else S.teachers.push({id:'t'+uid(),...o});log('staff.save',o.name);save();closeModal();render();toast(L('Voatahiry','Enregistré'))},
 lesson:d=>{const o={classId:d.classId,subjectId:d.subjectId,date:d.date,content:d.content,homework:d.homework,due:d.due};if(d.id)Object.assign(S.lessons.find(l=>l.id===d.id),o);else S.lessons.push({id:uid(),teacherId:user.role==='Mpampianatra'?myTid():(teacherOf(cls(d.classId),d.subjectId)?.id||''),...o});save();closeModal();render();toast(L('Voatahiry','Enregistré'))},
});
