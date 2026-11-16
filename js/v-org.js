/* Sekoly — v-org.js : M2 organisation pédagogique (classes, matières, frais, affectations, emploi du temps) */
'use strict';
ui.orgTab='kilasy';ui.asC='';
V.kilasy=()=>{
 const ed=CAN.classes();
 const head=`<div class="toolbar">${tabsBar(ui.orgTab,[['kilasy',L('Kilasy','Classes'),'layers'],['taranja',L('Taranja & koefisianta','Matières & coefficients'),'book'],['sarany',L('Saran-javatra isaky ny kilasy','Grille des frais'),'cash'],['fanendrena',L('Fanendrena mpampianatra','Affectations'),'brief']],'orgTab')}<div style="flex:1"></div>${ed&&ui.orgTab==='kilasy'?`<button class="btn pri" data-act="newClass">${ic('plus',16)} ${L('Kilasy vaovao','Nouvelle classe')}</button>`:''}</div>`;
 if(ui.orgTab==='taranja')return head+subjectsTab(ed);
 if(ui.orgTab==='sarany')return head+feesTab(ed);
 if(ui.orgTab==='fanendrena')return head+assignTab(ed);
 const st=active();
 return head+LEVELS.map(lv=>{const cs=S.classes.filter(c=>(c.level||'Primaire')===lv);if(!cs.length)return'';return`<div class="lvl-h">${levelL(lv)} <small>${cs.length} ${L('kilasy','classes')} · ${st.filter(s=>cs.some(c=>c.id===s.classId)).length} ${L('mpianatra','élèves')}</small></div><div class="cgrid">${cs.map(c=>{const ss=st.filter(s=>s.classId===c.id),b=ss.filter(s=>s.sex==='L').length,t=tea(c.teacherId),late=ss.filter(s=>dueAmount(s)>0).length,pct=Math.min(100,ss.length/(c.capacity||30)*100);
 return`<div class="card ccard"><div class="band" style="background:${c.color}"></div>
  <div class="cc-top"><div><h4>${esc(c.name)}</h4><span class="muted small">${esc(c.room||'')}${c.exam?` · <b>${c.exam}</b>`:''}</span></div><div style="text-align:right"><b style="font-size:16px;color:${c.color}">${fmt(c.fee)}</b><div class="muted xs">/${L('volana','mois')}</div></div></div>
  <div class="meta"><div>${ic('user',15)} ${esc(t?.name||L('Tsy voatendry','Non désigné'))}</div><div>${ic('users',15)} ${ss.length} · ${b} ${L('lahy','G')}, ${ss.length-b} ${L('vavy','F')}</div>${canSee('sarany')?`<div>${ic('alert',15)} ${late?`<span class="red fw6">${late} ${L('misy trosa','avec impayés')}</span>`:`<span class="green fw6">${L('Voaloa daholo','Tout réglé')}</span>`}</div>`:''}<div>${ic('arrow',15)} ${L('Manaraka','Classe suivante')}: ${esc(cls(c.next)?.name||'—')}</div></div>
  <div class="spread muted xs"><span>${L('Fahafeno','Remplissage')}</span><span>${ss.length}/${c.capacity||30}</span></div><div class="bar" style="margin-bottom:14px"><i style="width:${pct}%;background:${c.color}"></i></div>
  <div class="foot"><button class="btn ghost sm" data-act="classStudents" data-cid="${c.id}" style="flex:1">${ic('users',15)} ${L('Mpianatra','Élèves')}</button>${ed?`<button class="icon-btn" data-act="editClass" data-cid="${c.id}">${ic('edit',16)}</button><button class="icon-btn del" data-act="delClass" data-cid="${c.id}">${ic('trash',16)}</button>`:''}</div>
 </div>`}).join('')}</div>`}).join('');
};
function subjectsTab(ed){
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Taranja sy koefisianta isaky ny niveau','Matières et coefficients par niveau')}</h3><small>${L('Koefisianta 0 = tsy ampianarina amin\'io niveau io','Coefficient 0 = matière non enseignée à ce niveau')}</small></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Taranja','Matière')}</th>${LEVELS.map(l=>`<th class="ctr">${levelL(l)}</th>`).join('')}<th></th></tr></thead><tbody>
 ${S.subjects.map(sb=>`<tr><td>${ed?`<input class="inp sm-inp" value="${esc(sb.name)}" data-ch="sbName" data-id="${sb.id}">`:`<b>${esc(sb.name)}</b>`}</td>${LEVELS.map(l=>`<td class="ctr"><input class="ginp" type="number" min="0" max="10" step="0.5" value="${sb.coefs&&nz(sb.coefs[l])?sb.coefs[l]:sb.coef}" data-ch="coefL" data-id="${sb.id}" data-l="${l}" ${ed?'':'disabled'} style="width:70px"></td>`).join('')}<td>${ed?`<div class="acts"><button class="icon-btn del" data-act="delSubject" data-id="${sb.id}">${ic('trash',16)}</button></div>`:''}</td></tr>`).join('')}
 </tbody></table></div>
 ${ed?`<form data-form="subject" class="inline-form"><input class="inp grow" name="name" placeholder="${L('Taranja vaovao…','Nouvelle matière…')}" required><input class="inp" style="width:90px" type="number" name="coef" min="0" max="10" value="1"><button class="btn ghost">${ic('plus',16)} ${L('Ampio','Ajouter')}</button></form>`:''}</div>`;
}
function feesTab(ed){
 const items=FEE_ITEMS();
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Saran-javatra isaky ny kilasy','Grille des frais par classe')}</h3><small>${L('Ariary. Ny fihenam-bidy (mpiray tampo, zanaky ny mpiasa, vatsim-pianarana) dia apetraka ao amin\'ny antontan-taratasin\'ny mpianatra.','En Ariary. Les réductions (fratrie, personnel, bourse) se règlent dans la fiche élève.')}</small></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Kilasy','Classe')}</th><th class="num">${L('Saram-pianarana / volana','Écolage / mois')}</th>${items.map(([k,l])=>`<th class="num">${l}</th>`).join('')}<th class="num">${L('Totaly isan-taona','Total annuel')}</th></tr></thead><tbody>
 ${S.classes.map(c=>`<tr><td>${clsBadge(c)} <span class="muted xs">${levelL(c.level||'')}</span></td><td class="num"><input class="ginp w110" type="number" min="0" step="500" value="${c.fee||0}" data-ch="feeCell" data-cid="${c.id}" data-k="fee" ${ed?'':'disabled'}></td>${items.map(([k])=>`<td class="num"><input class="ginp w110" type="number" min="0" step="500" value="${(c.fees||{})[k]||0}" data-ch="feeCell" data-cid="${c.id}" data-k="${k}" ${ed?'':'disabled'} ${k==='examen'&&!c.exam?'title="'+L('Tsy misy fanadinana ofisialy','Pas d\'examen officiel')+'"':''}></td>`).join('')}<td class="num"><b>${fmt((c.fee||0)*10+items.reduce((a,[k])=>a+(k==='examen'&&!c.exam?0:+((c.fees||{})[k]||0)),0))}</b></td></tr>`).join('')}
 </tbody></table></div></div>`;
}
function assignTab(ed){
 if(!ui.asC)ui.asC=S.classes[0]?.id||'';const c=cls(ui.asC);if(!c)return emptyBox('layers',L('Tsy misy kilasy','Aucune classe'));
 const teachers=S.teachers.filter(t=>(t.poste||'Mpampianatra')==='Mpampianatra');
 const topt=sel=>`<option value="">${L('— Ny tompon\'andraikitra —','— Professeur principal —')}</option>`+teachers.map(t=>`<option value="${t.id}" ${sel===t.id?'selected':''}>${esc(t.name)}${t.subject?' ('+esc(t.subject)+')':''}</option>`).join('');
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Fanendrena','Affectations')} — ${esc(c.name)}</h3><small>${L('Ny mpampianatra tsy voatendry dia ny tompon\'andraikitry ny kilasy no mampianatra','Sans affectation, la matière est assurée par le professeur principal')}</small></div><select class="inp" data-ch="asC">${clsOpts(ui.asC)}</select></div>
 <div class="pad-x"><label class="fld" style="max-width:420px"><span>${L("Mpampianatra tompon'andraikitra (prof. principal)",'Professeur principal')}</span><select data-ch="mainT" data-cid="${c.id}" ${ed?'':'disabled'}><option value="">—</option>${teachers.map(t=>`<option value="${t.id}" ${c.teacherId===t.id?'selected':''}>${esc(t.name)}</option>`).join('')}</select></label></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Taranja','Matière')}</th><th class="ctr">Coef.</th><th>${L('Mpampianatra','Enseignant')}</th></tr></thead><tbody>
 ${classSubjects(c).map(sb=>`<tr><td><b>${esc(sb.name)}</b></td><td class="ctr">${coefOf(sb,c)}</td><td><select class="inp" data-ch="assign" data-cid="${c.id}" data-sb="${sb.id}" ${ed?'':'disabled'}>${topt(c.assign?.[sb.id]||'')}</select></td></tr>`).join('')}
 </tbody></table></div></div>`;
}
function classForm(c){
 c=c||{capacity:35,fee:30000,fees:{},level:'Primaire',color:CCOL[S.classes.length%CCOL.length]};
 openModal(c.id?L('Hanova kilasy','Modifier la classe'):L('Kilasy vaovao','Nouvelle classe'),`<form data-form="class" id="fm"><input type="hidden" name="id" value="${c.id||''}"><div class="grid2">
  ${fld(L("Anaran'ny kilasy",'Nom de la classe')+' *','name',c.name,'text','required placeholder="6ème A"')}
  ${sel('Niveau','level',LEVELS.map(l=>[l,levelL(l)]),c.level)}
  ${fld(L('Efitrano','Salle'),'room',c.room)}
  ${fld(L("Isan'ny toerana",'Effectif maximum'),'capacity',c.capacity,'number','min="1"')}
  ${fld(L('Saram-pianarana / volana (Ar)','Écolage mensuel (Ar)')+' *','fee',c.fee,'number','required min="0" step="500"')}
  ${sel(L('Mpampianatra tompon\'andraikitra','Professeur principal'),'teacherId',[['','—'],...S.teachers.filter(t=>(t.poste||'Mpampianatra')==='Mpampianatra').map(t=>[t.id,t.name])],c.teacherId||'')}
  ${sel(L('Fanadinana ofisialy','Examen officiel'),'exam',EXAMS.map(e=>[e,e||'—']),c.exam||'')}
  ${sel(L('Kilasy manaraka','Classe suivante'),'next',[['',L('— Farany (mivoaka) —','— Fin de cycle —')],...S.classes.filter(x=>x.id!==c.id).map(x=>[x.id,x.name])],c.next||'')}
  ${FEE_ITEMS().map(([k,l])=>fld(l+' (Ar)','fee_'+k,(c.fees||{})[k]||0,'number','min="0" step="500"')).join('')}
  ${fld(L('Loko','Couleur'),'color',c.color,'color','style="height:42px;padding:4px"')}
 </div></form>`,cancelBtn()+saveBtn(),'lg');
}

/* ---------- emploi du temps ---------- */
V.fandaharana=()=>{
 const ed=CAN.timetable();const cf=conflicts(),cfIds=slotConflictIds();
 if(user.role==='Mpampianatra'&&!ui.edtT){ui.edtView='teacher';ui.edtT=myTid()}
 if(!ui.edtC)ui.edtC=myClasses()[0]?.id||'';
 if(!ui.edtT)ui.edtT=S.teachers[0]?.id||'';
 const rooms=[...new Set(allSlots().map(x=>x.room).filter(Boolean))].sort();if(!ui.edtR)ui.edtR=rooms[0]||'';
 let slots=[],title='';
 if(ui.edtView==='class'){slots=slotsOf(ui.edtC).map(x=>({...x,classId:ui.edtC,room:x.room||cls(ui.edtC)?.room||''}));title=cls(ui.edtC)?.name||''}
 else if(ui.edtView==='teacher'){slots=allSlots().filter(x=>x.teacherId===ui.edtT);title=tea(ui.edtT)?.name||''}
 else{slots=allSlots().filter(x=>x.room===ui.edtR);title=ui.edtR}
 const picker=ui.edtView==='class'?`<select class="inp" data-ch="edtC">${clsOpts(ui.edtC,null,myClasses())}</select>`:ui.edtView==='teacher'?`<select class="inp" data-ch="edtT">${S.teachers.filter(t=>(t.poste||'Mpampianatra')==='Mpampianatra').map(t=>`<option value="${t.id}" ${ui.edtT===t.id?'selected':''}>${esc(t.name)}</option>`).join('')}</select>`:`<select class="inp" data-ch="edtR">${rooms.map(r=>`<option ${ui.edtR===r?'selected':''}>${esc(r)}</option>`).join('')}</select>`;
 return`<div class="toolbar">${tabsBar(ui.edtView,[['class',L('Kilasy','Classe'),'layers'],['teacher',L('Mpampianatra','Enseignant'),'user'],['room',L('Efitrano','Salle'),'door']],'edtView')}${picker}<div style="flex:1"></div><button class="btn ghost" data-act="printEdt">${ic('print',16)} ${L('Atonta','Imprimer')}</button>${ed&&ui.edtView==='class'?`<button class="btn pri" data-act="newSlot">${ic('plus',16)} ${L('Fotoana vaovao','Ajouter un cours')}</button>`:''}</div>
 ${cf.length?`<div class="alert-box">${ic('alert',18)}<div><b>${cf.length} ${L('fifanindrina hita','conflit(s) détecté(s)')}</b>${cf.slice(0,6).map(x=>`<div class="small">${x.type==='t'?L('Mpampianatra','Enseignant')+' <b>'+esc(tea(x.x.teacherId)?.name||'')+'</b>':L('Efitrano','Salle')+' <b>'+esc(x.x.room)+'</b>'} — ${DAY(x.x.day)} ${x.x.start}–${x.x.end}: ${esc(cls(x.x.classId)?.name)} / ${esc(cls(x.y.classId)?.name)}</div>`).join('')}</div></div>`:`<div class="ok-box">${ic('check',16)} ${L('Tsy misy fifanindrina','Aucun conflit')}</div>`}
 <div class="card np"><div class="card-h pad"><div><h3>${esc(title)}</h3><small>${slots.length} ${L('fotoana isan-kerinandro','cours par semaine')} · ${Math.round(sum(slots.map(x=>timeMin(x.end)-timeMin(x.start)))/60)} h</small></div></div>${edtGrid(slots,cfIds,ed&&ui.edtView==='class')}</div>`;
};
function edtGrid(slots,cfIds,editable,printMode){
 const days=[1,2,3,4,5,6].filter(d=>d<6||slots.some(x=>x.day===6));
 const times=[...new Set(slots.map(x=>x.start+'-'+x.end))].sort((a,b)=>timeMin(a)-timeMin(b));
 if(!times.length)return printMode?'<p>—</p>':emptyBox('grid',L('Tsy mbola misy fandaharana','Aucun cours planifié'));
 return`<div class="tw"><table class="edt"><thead><tr><th></th>${days.map(d=>`<th>${printMode?DAYS_FR[d]:DAY(d)}</th>`).join('')}</tr></thead><tbody>${times.map(tm=>{const[a,b]=tm.split('-');return`<tr><td class="edt-t">${a}<small>${b}</small></td>${days.map(d=>{const xs=slots.filter(x=>x.day===d&&x.start===a&&x.end===b);return`<td>${xs.map(x=>{const sb=sbj(x.subjectId),c=cls(x.classId);return`<div class="slot ${cfIds&&cfIds.has(x.id)?'conf':''}" style="--c:${c?.color||'#2f7cf6'}" ${editable?`data-act="editSlot" data-id="${x.id}"`:''}><b>${esc(sb?.name||'—')}</b><small>${ui.edtView!=='class'||printMode===2?esc(c?.name||'')+' · ':''}${esc(tea(x.teacherId)?.name||'')}</small><small>${esc(x.room||'')}</small></div>`}).join('')}</td>`}).join('')}</tr>`}).join('')}</tbody></table></div>`;
}
function slotForm(s){
 const c=cls(ui.edtC);s=s||{day:1,start:'07:30',end:'09:30',subjectId:classSubjects(c)[0]?.id,room:''};
 openModal(s.id?L('Hanova fotoana','Modifier le cours'):L('Fotoana vaovao','Nouveau cours')+' — '+esc(c.name),`<form data-form="slot" id="fm"><input type="hidden" name="id" value="${s.id||''}"><div class="grid2">
 ${sel(L('Andro','Jour'),'day',[1,2,3,4,5,6].map(d=>[d,DAY(d)]),s.day)}
 ${sel(L('Taranja','Matière'),'subjectId',classSubjects(c).map(x=>[x.id,x.name]),s.subjectId,'data-ch="slotSb"')}
 ${fld(L('Manomboka','Début'),'start',s.start,'time','required')}${fld(L('Mifarana','Fin'),'end',s.end,'time','required')}
 ${sel(L('Mpampianatra','Enseignant'),'teacherId',[['',L('— Araka ny fanendrena —','— Selon affectation —')],...S.teachers.filter(t=>(t.poste||'Mpampianatra')==='Mpampianatra').map(t=>[t.id,t.name])],s.teacherId||'')}
 ${fld(L('Efitrano','Salle'),'room',s.room||'','text',`placeholder="${esc(c.room||'')}"`)}
 </div></form>`,`${s.id?`<button class="btn soft-red" data-act="delSlot" data-id="${s.id}" style="margin-right:auto">${ic('trash',15)} ${L('Fafana','Supprimer')}</button>`:''}${cancelBtn()}${saveBtn()}`);
}

Object.assign(A,{
 orgTab:d=>{ui.orgTab=d.k;render()},
 newClass:()=>classForm(),editClass:d=>classForm(cls(d.cid)),
 delClass:d=>{const c=cls(d.cid),n=S.students.filter(s=>s.classId===c.id).length;if(n){toast(L(`Misy mpianatra ${n} ao. Afindrao aloha.`,`${n} élève(s) dans cette classe. Transférez-les d'abord.`),1);return}confirmBox(L('Hamafa ny kilasy','Supprimer la classe')+` <b>${esc(c.name)}</b> ?`,()=>{S.classes=S.classes.filter(x=>x.id!==c.id);delete S.timetable[c.id];log('class.delete',c.name);save();render()},L('Fafana','Supprimer'))},
 classStudents:d=>{ui.fcls=d.cid;ui.fst='Mianatra';ui.q='';location.hash='mpianatra'},
 delSubject:d=>{const sb=sbj(d.id);confirmBox(L('Hamafa ny taranja','Supprimer la matière')+` <b>${esc(sb.name)}</b> ${L('sy ny naoty rehetra mifandraika aminy?','et toutes ses notes ?')}`,()=>{S.subjects=S.subjects.filter(x=>x.id!==d.id);for(const k in S.grades)if(k.endsWith('|'+d.id))delete S.grades[k];log('subject.delete',sb.name);save();render()},L('Fafana','Supprimer'))},
 edtView:d=>{ui.edtView=d.k;render()},
 newSlot:()=>slotForm(),editSlot:d=>slotForm(slotsOf(ui.edtC).find(x=>x.id===d.id)),
 delSlot:d=>{S.timetable[ui.edtC]=slotsOf(ui.edtC).filter(x=>x.id!==d.id);save();closeModal();render()},
 printEdt:()=>{const ids=ui.edtView==='class'?[ui.edtC]:[];let html='';
  if(ui.edtView==='class')html=ids.map(id=>{const c=cls(id);return`<div class="pg">${printHead('Emploi du temps — '+esc(c.name),'Année scolaire '+esc(S.school.year)+' · Professeur principal : '+esc(tea(c.teacherId)?.name||'—'))}${edtGrid(slotsOf(id).map(x=>({...x,classId:id,room:x.room||c.room})),null,false,1)}</div>`}).join('');
  else{const sl=ui.edtView==='teacher'?allSlots().filter(x=>x.teacherId===ui.edtT):allSlots().filter(x=>x.room===ui.edtR);html=`<div class="pg">${printHead('Emploi du temps — '+esc(ui.edtView==='teacher'?tea(ui.edtT)?.name:ui.edtR))}${edtGrid(sl,null,false,2)}</div>`}
  printHTML(html,'Emploi du temps')},
});
Object.assign(C,{
 coefL:el=>{const sb=sbj(el.dataset.id);sb.coefs={...(sb.coefs||{}),[el.dataset.l]:Math.max(0,+el.value||0)};save();toast(L('Voaova ny koefisianta','Coefficient modifié'))},
 sbName:el=>{const sb=sbj(el.dataset.id);if(el.value.trim()){sb.name=el.value.trim();save()}},
 feeCell:el=>{const c=cls(el.dataset.cid),v=Math.max(0,+el.value||0);if(el.dataset.k==='fee')c.fee=v;else c.fees={...(c.fees||{}),[el.dataset.k]:v};log('fees.update',`${c.name} ${el.dataset.k}=${v}`);save();toast(L('Voatahiry','Enregistré'))},
 asC:el=>{ui.asC=el.value;render()},
 assign:el=>{const c=cls(el.dataset.cid);c.assign={...(c.assign||{})};if(el.value)c.assign[el.dataset.sb]=el.value;else delete c.assign[el.dataset.sb];save();toast(L('Voatahiry','Enregistré'))},
 mainT:el=>{cls(el.dataset.cid).teacherId=el.value;save();toast(L('Voatahiry','Enregistré'))},
 edtC:el=>{ui.edtC=el.value;render()},edtT:el=>{ui.edtT=el.value;render()},edtR:el=>{ui.edtR=el.value;render()},
});
Object.assign(F,{
 class:d=>{const fees={};FEE_ITEMS().forEach(([k])=>fees[k]=+d['fee_'+k]||0);const o={name:d.name.trim(),level:d.level,room:d.room,fee:+d.fee||0,fees,capacity:+d.capacity||30,teacherId:d.teacherId,color:d.color,exam:d.exam,next:d.next};
  if(d.id)Object.assign(cls(d.id),o);else S.classes.push({id:'c'+uid(),ord:Date.now(),assign:{},...o});log('class.save',o.name);save();closeModal();render();toast(L('Voatahiry ny kilasy','Classe enregistrée'))},
 subject:d=>{S.subjects.push({id:'s'+uid(),name:d.name.trim(),coef:+d.coef||1,coefs:{},ord:Date.now()});save();render()},
 slot:d=>{const c=cls(ui.edtC);if(timeMin(d.end)<=timeMin(d.start)){toast(L('Diso ny ora','Horaires invalides'),1);return}
  const s={id:d.id||uid(),day:+d.day,start:d.start,end:d.end,subjectId:d.subjectId,teacherId:d.teacherId||(c.assign?.[d.subjectId])||c.teacherId||'',room:d.room||''};
  const others=allSlots().filter(x=>x.id!==s.id&&x.day===s.day&&timeMin(x.start)<timeMin(s.end)&&timeMin(s.start)<timeMin(x.end));
  const room=s.room||c.room||'';const clash=others.filter(x=>(s.teacherId&&x.teacherId===s.teacherId)||(room&&x.room===room&&x.classId!==c.id)||x.classId===c.id);
  const doSave=()=>{const arr=slotsOf(c.id).filter(x=>x.id!==s.id);arr.push(s);S.timetable[c.id]=arr;save();closeModal();render()};
  if(clash.length)confirmBox(`<b>${L('Fifanindrina','Conflit')}:</b><br>${clash.map(x=>`${esc(cls(x.classId)?.name)} · ${esc(sbj(x.subjectId)?.name||'')} · ${esc(tea(x.teacherId)?.name||'')} · ${esc(x.room)} (${x.start}–${x.end})`).join('<br>')}<br><br>${L('Tehirizina ihany?','Enregistrer quand même ?')}`,doSave,L('Tehirizina ihany','Enregistrer quand même'));
  else doSave()},
});
