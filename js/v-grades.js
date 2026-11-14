/* Sekoly — v-grades.js : M3 notes, conseils de classe, bulletins, examens */
'use strict';
V.naoty=()=>{
 const mine=myClasses();
 if(!ui.gC||!mine.some(c=>c.id===ui.gC))ui.gC=mine[0]?.id||'';
 if(!ui.gT)ui.gT=currentTerm();
 const c=cls(ui.gC);if(!c)return emptyBox('layers',L('Tsy misy kilasy anananao','Aucune classe attribuée'));
 const tabs=[['ampidiro',L('Fampidirana naoty','Saisie des notes'),'edit'],['filankevitra',L('Filankevi-pampianarana','Conseil de classe'),'users'],['kara',L('Kara-naoty','Bulletins'),'file'],(isBoss()||hasRole('Secretariat'))&&['fanadinana',L('Fanadinana ofisialy','Examens officiels'),'flag']];
 const head=`<div class="toolbar">${tabsBar(ui.gTab,tabs,'gTab')}<div style="flex:1"></div>${ui.gTab!=='fanadinana'?`<select class="inp" data-ch="gC">${clsOpts(ui.gC,null,mine)}</select><select class="inp" data-ch="gT">${termOpts(ui.gT)}</select>`:''}</div>`;
 if(ui.gTab==='filankevitra')return head+councilTab(c);
 if(ui.gTab==='kara')return head+bulletinsTab(c);
 if(ui.gTab==='fanadinana')return head+examsTab();
 return head+entryTab(c);
};
function entryTab(c){
 const subs=mySubjects(c);if(!subs.length)return emptyBox('book',L('Tsy misy taranja anjaranao amin\'ity kilasy ity','Aucune matière attribuée dans cette classe'));
 if(!subs.some(x=>x.id===ui.gS))ui.gS=subs[0].id;
 const sb=sbj(ui.gS),g=G(c.id,ui.gT,sb.id),locked=isLocked(c.id,ui.gT),canEdit=CAN.grades()&&(!locked||isBoss());
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 const st=subjStats(c.id,ui.gT,sb.id);
 return`${locked?`<div class="alert-box warn">${ic('lock',18)}<div><b>${L('Voahidy ny naoty','Notes verrouillées')}</b><div class="small">${L('Nankatoavin\'ny filankevi-pampianarana. Ny Tale ihany no afaka manova, miaraka amin\'ny antony.','Validées en conseil de classe. Seule la direction peut modifier, avec motif.')}</div></div></div>`:''}
 <div class="row c2"><div class="card np"><div class="card-h pad"><div><h3>${esc(sb.name)} — ${esc(c.name)} · ${termL(ui.gT)}</h3><small>Coef. ${coefOf(sb,c)} · ${esc(teacherOf(c,sb.id)?.name||'')} · ${L('Voatahiry ho azy','Enregistrement automatique')}</small></div>
 <div class="toolbar"><select class="inp" data-ch="gS">${subs.map(x=>`<option value="${x.id}" ${x.id===sb.id?'selected':''}>${esc(x.name)} (×${coefOf(x,c)})</option>`).join('')}</select>${canEdit?`<button class="btn pri sm" data-act="newEval">${ic('plus',15)} ${L('Fanombanana','Évaluation')}</button>`:''}</div></div>
 <div class="tw"><table class="t"><thead><tr><th>#</th><th>${L('Mpianatra','Élève')}</th>${g.evals.map(e=>`<th class="ctr ev-h" ${canEdit?`data-act="editEval" data-e="${e.id}"`:''} title="${esc(e.label)}"><div>${esc(e.label)}</div><small>${esc((EVAL_TYPES().find(x=>x[0]===e.type)||[0,e.type])[1])} · /${e.max||20} · ×${e.coef||1}</small></th>`).join('')}<th class="ctr">${L('Salan\'isa','Moy.')}</th><th>${L('Fanamarihana','Appréciation')}</th></tr></thead><tbody>
 ${g.evals.length?ss.map((s,i)=>{const a=subjAvg(s.id,c.id,ui.gT,sb.id);return`<tr><td class="muted">${i+1}</td><td>${stuWho(s)}</td>${g.evals.map(e=>{const v=(e.notes||{})[s.id];return`<td class="ctr"><input class="ginp ${nz(v)?(v/(e.max||20)*20<10?'low':v/(e.max||20)*20>=14?'hi':''):''}" type="number" min="0" max="${e.max||20}" step="0.25" value="${nz(v)?v:''}" data-ch="note" data-e="${e.id}" data-sid="${s.id}" ${canEdit?'':'disabled'} placeholder="—"></td>`}).join('')}<td class="ctr"><b class="${a!=null&&a<10?'red':''}">${f2(a)}</b></td><td><input class="inp sm-inp" value="${esc((g.appr||{})[s.id]||'')}" placeholder="${esc(LANG==='fr'?apprFR(a):apprMG(a))}" data-ch="appr" data-sid="${s.id}" ${canEdit?'':'disabled'}></td></tr>`}).join(''):`<tr><td colspan="4">${emptyBox('edit',L('Tsy mbola misy fanombanana','Aucune évaluation'),L('Tsindrio "Fanombanana" hanampiana asa an-trano, fanontaniana na fanadinana.','Cliquez sur « Évaluation » pour ajouter un devoir, une interrogation ou une composition.'))}</td></tr>`}
 </tbody></table></div></div>
 <div class="col"><div class="card"><div class="card-h"><h3>${L("Antontan'isa",'Statistiques')}</h3></div><div class="stats s2"><div class="stat"><b>${f2(st.avg)}</b><span>${L('Salan\'isa','Moyenne')}</span></div><div class="stat"><b>${st.n?Math.round(st.pass/st.n*100)+'%':'—'}</b><span>≥ 10/20</span></div></div></div>
 <div class="card"><div class="card-h"><h3>${L('Taranja','Matières')}</h3></div><div class="list">${subs.map(x=>{const gg=G(c.id,ui.gT,x.id),n=gg.evals.length;return`<div class="li click" data-act="gSub" data-k="${x.id}"><div class="ki ${x.id===sb.id?'teal':'blue'} sm">${ic('book',15)}</div><div><b class="small">${esc(x.name)}</b><div class="muted xs">×${coefOf(x,c)} · ${n} ${L('fanombanana','éval.')}</div></div><div class="r">${n?`<span class="badge b-green nd">✓</span>`:`<span class="badge b-gray nd">0</span>`}</div></div>`}).join('')}</div></div></div></div>`;
}
function evalForm(e){
 e=e||{type:'Devoir',label:'',date:today(),max:S.school.barem||20,coef:1};
 openModal(e.id?L('Hanova fanombanana','Modifier l\'évaluation'):L('Fanombanana vaovao','Nouvelle évaluation'),`<form data-form="eval" id="fm"><input type="hidden" name="id" value="${e.id||''}"><div class="grid2">
 ${sel(L('Karazany','Type'),'type',EVAL_TYPES(),e.type)}${fld(L('Anarana','Intitulé'),'label',e.label,'text','required placeholder="Devoir 2"')}
 ${fld(L('Daty','Date'),'date',e.date,'date')}${fld(L('Naoty ambony indrindra (barème)','Barème (sur)'),'max',e.max||20,'number','min="1" max="100" required')}
 ${fld(L('Lanjany (coef.)','Poids (coef.)'),'coef',e.coef||1,'number','min="0.5" max="10" step="0.5" required')}
 </div><p class="muted small">${L('Ny salan\'isan\'ny taranja = salan\'isa milanja ny fanombanana rehetra (averina amin\'ny 20).','Moyenne de la matière = moyenne pondérée des évaluations, ramenée sur 20.')}</p></form>`,`${e.id?`<button class="btn soft-red" data-act="delEval" data-e="${e.id}" style="margin-right:auto">${ic('trash',15)} ${L('Fafana','Supprimer')}</button>`:''}${cancelBtn()}${saveBtn()}`,'sm');
}
function setGrades(c,t,sbId,fn,reason){const k=gk(c,t,sbId);const g=JSON.parse(JSON.stringify(G(c,t,sbId)));fn(g);S.grades[k]=g;save()}

/* ---------- conseil de classe ---------- */
function councilTab(c){
 const t=ui.gT,rk=ranking(c.id,t),co=council(c.id,t),st=classStats(c.id,t),locked=!!co.locked,isLast=t===lastTerm(),ed=CAN.council()&&!locked;
 const p=periodOf(t);
 return`<div class="stats s4"><div class="stat"><b>${f2(st.avg)}</b><span>${L('Salan\'isan\'ny kilasy','Moyenne de classe')}</span></div><div class="stat g"><b>${f2(st.max)}</b><span>${L('Ambony indrindra','Plus forte')}</span></div><div class="stat r"><b>${f2(st.min)}</b><span>${L('Ambany indrindra','Plus faible')}</span></div><div class="stat a"><b>${st.n?Math.round(st.pass/st.n*100)+'%':'—'}</b><span>${L('Nahazo ≥ 10','Taux ≥ 10')}</span></div></div>
 <div class="card np"><div class="card-h pad"><div><h3>${L('Filankevi-pampianarana','Conseil de classe')} — ${esc(c.name)} · ${termL(t)}</h3><small>${locked?`🔒 ${L('Nankatoavina','Validé')} ${fmtTime(co.validated?.at)} · ${esc(co.validated?.by||'')}`:L('Mbola tsy nankatoavina','Non validé')}</small></div>
 <div class="toolbar">${CAN.council()?(locked?`<button class="btn ghost" data-act="unlockCouncil">${ic('unlock',16)} ${L('Sokafana','Déverrouiller')}</button>`:`<button class="btn pri" data-act="lockCouncil">${ic('lock',16)} ${L('Ankatoavina & hidiana','Valider & verrouiller')}</button>`):''}</div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Laharana','Rang')}</th><th>${L('Mpianatra','Élève')}</th><th class="ctr">${L('Salan\'isa','Moy.')}</th>${isLast?`<th class="ctr">${L('Isan-taona','Annuelle')}</th>`:''}<th class="ctr">${L('Tsy tonga','Abs.')}</th><th>${L('Mention','Mention')}</th><th>${L('Fanamarihana ankapobeny','Appréciation générale')}</th>${isLast?`<th>${L('Fanapahan-kevitra','Décision')}</th>`:''}</tr></thead><tbody>
 ${rk.map(x=>{const cs=co.students?.[x.s.id]||{},m=cs.mention??mentionAuto(x.avg),at=studentAtt(x.s,p.start,p.end),an=isLast?annualAvg(x.s.id,c.id):null,dec=cs.decision||(isLast&&an!=null?(an>=10?'Passage':'Redoublement'):'');
  return`<tr><td><span class="rank ${x.rank&&x.rank<=3?'g'+x.rank:''}">${x.rank||'—'}</span></td><td>${stuWho(x.s)}</td><td class="ctr"><b>${f2(x.avg)}</b></td>${isLast?`<td class="ctr"><b>${f2(an)}</b></td>`:''}<td class="ctr">${at.A+at.J}${at.A?` <span class="red xs">(${at.A})</span>`:''}</td>
  <td><select class="inp sm-inp" data-ch="coMention" data-sid="${x.s.id}" ${ed?'':'disabled'}><option value="">—</option>${Object.keys(MENTIONS).map(k=>`<option value="${k}" ${m===k?'selected':''}>${mentionL(k)}</option>`).join('')}</select></td>
  <td><input class="inp sm-inp" value="${esc(cs.appr||'')}" placeholder="${esc(LANG==='fr'?apprFR(x.avg):apprMG(x.avg))}" data-ch="coAppr" data-sid="${x.s.id}" ${ed?'':'disabled'}></td>
  ${isLast?`<td><select class="inp sm-inp" data-ch="coDec" data-sid="${x.s.id}" ${ed?'':'disabled'}>${DECISIONS().map(([k,l])=>`<option value="${k}" ${dec===k?'selected':''}>${l}</option>`).join('')}</select></td>`:''}</tr>`}).join('')}
 </tbody></table></div></div>`;
}
function setCouncil(c,t,fn){const k=`${c}|${t}`;const co=JSON.parse(JSON.stringify(S.councils[k]||{}));co.students=co.students||{};fn(co);S.councils[k]=co;save()}

/* ---------- bulletins ---------- */
function bulletinsTab(c){
 const t=ui.gT,rk=ranking(c.id,t),co=council(c.id,t),blocked=rk.filter(x=>unpaidBlocked(x.s));
 return`<div class="card"><div class="card-h"><div><h3>${L('Kara-naoty','Bulletins')} — ${esc(c.name)} · ${termL(t)}</h3><small>${co.locked?'🔒 '+L('Nankatoavina','Validés'):L('Vonjimaika (mbola tsy nankatoavina)','Provisoires (conseil non validé)')} · ${L('Amin\'ny teny frantsay','En français')}</small></div>
 <div class="toolbar"><button class="btn pri" data-act="printBulletins">${ic('print',16)} ${L('Atonta daholo (PDF)','Imprimer toute la classe (PDF)')}</button></div></div>
 ${blocked.length?`<div class="alert-box warn">${ic('lock',18)}<div><b>${blocked.length} ${L('kara-naoty voasakana noho ny trosa','bulletin(s) bloqué(s) pour impayés')}</b><div class="small">${blocked.map(x=>esc(fullName(x.s))).join(', ')}</div></div></div>`:''}
 <div class="list">${rk.map(x=>`<div class="li click" data-act="bulletin" data-sid="${x.s.id}" data-t="${t}">${avs(fullName(x.s),x.s.id,x.s.photo)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${L('Laharana','Rang')} ${x.rank||'—'} · ${f2(x.avg)}/20</small></div></div><div class="r">${unpaidBlocked(x.s)?`<span class="badge b-red nd">${ic('lock',12)} ${L('Voasakana','Bloqué')}</span>`:`<span class="badge ${mentionCls(co.students?.[x.s.id]?.mention??mentionAuto(x.avg))} nd">${mentionL(co.students?.[x.s.id]?.mention??mentionAuto(x.avg))}</span>`}</div></div>`).join('')}</div></div>`;
}
function bulletinHTML(sid,t){
 const s=stu(sid),c=cls(s.classId),rk=ranking(c.id,t),me=rk.find(x=>x.s.id===sid)||{},st=classStats(c.id,t),co=council(c.id,t),cs=co.students?.[sid]||{};
 const p=periodOf(t),at=studentAtt(s,p.start,p.end),sanc=S.sanctions.filter(x=>x.studentId===sid&&(!p.start||x.date>=p.start)&&(!p.end||x.date<=p.end));
 const isLast=t===lastTerm(),an=isLast?annualAvg(sid,c.id):null,anr=isLast?annualRanking(c.id).find(x=>x.s.id===sid):null;
 let tc=0,tp=0;
 const rows=classSubjects(c).map(sb=>{const a=subjAvg(sid,c.id,t,sb.id),k=coefOf(sb,c),g=G(c.id,t,sb.id),ca=subjStats(c.id,t,sb.id).avg;if(a!=null){tc+=k;tp+=a*k}
  const ev=g.evals.filter(e=>nz((e.notes||{})[sid]));const dv=ev.filter(e=>e.type!=='Compo'),cp=ev.filter(e=>e.type==='Compo');const m=arr=>{let s2=0,c2=0;arr.forEach(e=>{s2+=e.notes[sid]/(e.max||20)*20*(e.coef||1);c2+=(e.coef||1)});return c2?s2/c2:null};
  return`<tr><td class="l"><b>${esc(sb.name)}</b><small>${esc(teacherOf(c,sb.id)?.name||'')}</small></td><td>${k}</td><td>${f2(m(dv))}</td><td>${f2(m(cp))}</td><td><b class="${a!=null&&a<10?'red':''}">${f2(a)}</b></td><td>${a!=null?(a*k).toFixed(2).replace('.',','):'—'}</td><td>${f2(ca)}</td><td class="l">${esc((g.appr||{})[sid]||apprFR(a))}</td></tr>`}).join('');
 const mention=cs.mention??mentionAuto(me.avg);const dec=cs.decision||(isLast&&an!=null?(an>=10?'Passage':'Redoublement'):'');
 return`<div class="pg bul ${co.locked?'':'prov'}">${printHead(`BULLETIN DE NOTES — ${termFR(t).toUpperCase()}`,`Année scolaire ${esc(S.school.year)}`)}
 <div class="bul-id"><div>${s.photo?`<img src="${s.photo}">`:''}</div><table><tr><td>Nom et prénoms</td><td><b>${esc(s.last.toUpperCase())} ${esc(s.first)}</b></td><td>Matricule</td><td><b>${esc(s.matricule)}</b></td></tr><tr><td>Né(e) le</td><td>${fmtDate(s.birth)} ${s.birthPlace?'à '+esc(s.birthPlace):''}</td><td>Sexe</td><td>${s.sex==='L'?'M':'F'}</td></tr><tr><td>Classe</td><td><b>${esc(c.name)}</b></td><td>Effectif</td><td>${rk.length}</td></tr><tr><td>Professeur principal</td><td>${esc(tea(c.teacherId)?.name||'')}</td><td>Statut</td><td>${s.entry==='Taloha'&&s.redoublant?'Redoublant':'—'}</td></tr></table></div>
 <table class="pt bt"><thead><tr><th class="l">Matières</th><th>Coef.</th><th>Moy. devoirs</th><th>Compo.</th><th>Moy. /20</th><th>Moy. × coef.</th><th>Moy. classe</th><th class="l">Appréciations</th></tr></thead><tbody>${rows}
 <tr class="tot"><td class="l">TOTAUX</td><td>${tc}</td><td></td><td></td><td></td><td>${tp.toFixed(2).replace('.',',')}</td><td></td><td></td></tr></tbody></table>
 <div class="bul-sum"><div class="bs-box"><span>Moyenne générale</span><b>${f2(me.avg)} / 20</b></div><div class="bs-box"><span>Rang</span><b>${me.rank?me.rank+(me.rank===1?'er':'e'):'—'} / ${rk.length}</b></div><div class="bs-box"><span>Moyenne de la classe</span><b>${f2(st.avg)}</b></div><div class="bs-box"><span>Plus forte / plus faible</span><b>${f2(st.max)} / ${f2(st.min)}</b></div></div>
 ${isLast?`<div class="bul-sum"><div class="bs-box"><span>Moyenne annuelle</span><b>${f2(an)} / 20</b></div><div class="bs-box"><span>Rang annuel</span><b>${anr?.rank||'—'} / ${rk.length}</b></div><div class="bs-box wide"><span>Décision du conseil</span><b>${esc({Passage:'Admis(e) en classe supérieure'+(cls(c.next)?' ('+esc(cls(c.next).name)+')':''),Redoublement:'Redouble',Exclusion:'Exclu(e)'}[dec]||'—')}</b></div></div>`:''}
 <div class="bul-foot"><div class="bf-box"><b>Assiduité & conduite</b><div>Absences justifiées : <b>${at.J}</b> · non justifiées : <b>${at.A}</b> · retards : <b>${at.R}</b></div><div>Sanctions : ${sanc.length?sanc.map(x=>esc(x.type)).join(', '):'néant'}</div></div>
 <div class="bf-box"><b>Mention : ${esc(mentionFR(mention)||'—')}</b><div>Appréciation du conseil : ${esc(cs.appr||apprFR(me.avg))}</div></div></div>
 <div class="psign three"><div>Le Parent</div><div>Le Professeur principal</div><div>Fait à ${esc(S.school.city||'')}, le ${dateFR(today())}<br>Le Directeur</div></div>
 ${co.locked?'':'<div class="wm">PROVISOIRE</div>'}</div>`;
}
function bulletin(sid,t){
 const s=stu(sid);if(!s)return;
 if(unpaidBlocked(s)&&!isBoss()){openModal(L('Kara-naoty voasakana','Bulletin bloqué'),`<div class="alert-box warn">${ic('lock',18)}<div>${L('Mbola misy trosa','Solde impayé')}: <b>${fmt(dueAmount(s))}</b>. ${L('Ny Tale no nanapa-kevitra hanakana ny kara-naoty raha tsy voaloa ny saram-pianarana.','La direction bloque le bulletin tant que l\'écolage n\'est pas réglé.')}</div></div>`,doneBtn(),'sm');return}
 openModal(L('Kara-naoty','Bulletin')+' — '+esc(fullName(s)),`<div class="bul-preview">${bulletinHTML(sid,t)}</div>`,`<select class="inp" data-ch="bulT" data-sid="${sid}">${termOpts(t)}</select><button class="btn ghost" data-act="printOneBul" data-sid="${sid}" data-t="${t}">${ic('print',16)} ${L('Atonta / PDF','Imprimer / PDF')}</button>${doneBtn()}`,'xl');
}

/* ---------- examens officiels ---------- */
function examsTab(){
 const cs=S.classes.filter(c=>c.exam);if(!cs.length)return emptyBox('flag',L('Tsy misy kilasy manao fanadinana ofisialy','Aucune classe d\'examen'),L('Apetraho ao amin\'ny kilasy ny "Fanadinana ofisialy" (CEPE, BEPC, BAC).','Renseignez « Examen officiel » dans la fiche classe.'));
 if(!ui.exC||!cs.some(c=>c.id===ui.exC))ui.exC=cs[0].id;const c=cls(ui.exC);
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Lisitry ny kandida','Liste des candidats')} — ${c.exam} · ${esc(c.name)}</h3><small>${ss.length} ${L('kandida','candidats')} · ${ss.filter(s=>s.sex==='L').length} G / ${ss.filter(s=>s.sex==='V').length} F</small></div>
 <div class="toolbar"><select class="inp" data-ch="exC">${clsOpts(ui.exC,null,cs)}</select><button class="btn ghost" data-act="printExam">${ic('print',16)} ${L('Atonta','Imprimer')}</button><button class="btn ghost" data-act="xlsExam">${ic('download',16)} Excel</button></div></div>
 <div class="tw"><table class="t"><thead><tr><th>N°</th><th>${L('Anarana','Nom et prénoms')}</th><th>${L('Lahy/Vavy','Sexe')}</th><th>${L('Teraka','Naissance')}</th><th>${L('Toerana','Lieu')}</th><th>${L('Laharana','Matricule')}</th><th>${L('Saran-panadinana','Frais d\'examen')}</th></tr></thead><tbody>
 ${ss.map((s,i)=>{const f=itemFee(s,'examen'),p=paidItem(s.id,'examen');return`<tr><td>${i+1}</td><td><b>${esc(s.last.toUpperCase())}</b> ${esc(s.first)}</td><td>${s.sex==='L'?'M':'F'}</td><td>${fmtDate(s.birth)}</td><td>${esc(s.birthPlace||'')}</td><td class="mono">${esc(s.matricule)}</td><td>${!f?'—':p>=f?`<span class="badge b-green">✓</span>`:`<span class="badge b-red">${fmt(f-p)}</span>`}</td></tr>`}).join('')}
 </tbody></table></div></div>`;
}

Object.assign(A,{
 gTab:d=>{ui.gTab=d.k;render()},gSub:d=>{ui.gS=d.k;ui.gTab='ampidiro';render()},
 newEval:()=>evalForm(),
 editEval:d=>{const e=G(ui.gC,ui.gT,ui.gS).evals.find(x=>x.id===d.e);if(e)evalForm(e)},
 delEval:d=>confirmBox(L('Hamafa ity fanombanana ity sy ny naotiny rehetra?','Supprimer cette évaluation et toutes ses notes ?'),()=>{const go=r=>{setGrades(ui.gC,ui.gT,ui.gS,g=>{g.evals=g.evals.filter(x=>x.id!==d.e)});log('grade.eval.delete',`${cls(ui.gC)?.name} ${ui.gT} ${sbj(ui.gS)?.name} ${d.e}${r?' — '+r:''}`);render()};if(isLocked(ui.gC,ui.gT))promptBox(L('Antony','Motif'),L('Antony hanovana naoty voahidy','Motif de la modification'),go);else go()},L('Fafana','Supprimer')),
 lockCouncil:()=>confirmBox(L('Hankatoavina sy hohidiana ny naoty? Tsy afaka manova intsony ny mpampianatra.','Valider le conseil et verrouiller les notes ? Les enseignants ne pourront plus les modifier.'),()=>{setCouncil(ui.gC,ui.gT,co=>{const rk=ranking(ui.gC,ui.gT);rk.forEach(x=>{const cs=co.students[x.s.id]=co.students[x.s.id]||{};if(cs.mention===undefined)cs.mention=mentionAuto(x.avg)});co.locked=true;co.validated={by:user.name,at:Date.now()}});log('council.lock',`${cls(ui.gC)?.name} ${ui.gT}`);render();toast(L('Nankatoavina','Conseil validé'))},L('Ankatoavina','Valider'),false),
 unlockCouncil:()=>promptBox(L('Hanokatra ny naoty','Déverrouiller les notes'),L('Antony (voatahiry ao amin\'ny diary)','Motif (consigné au journal)'),r=>{setCouncil(ui.gC,ui.gT,co=>{co.locked=false;co.unlocked={by:user.name,at:Date.now(),reason:r}});log('council.unlock',`${cls(ui.gC)?.name} ${ui.gT} — ${r}`);render()}),
 bulletin:d=>bulletin(d.sid,d.t||currentTerm()),
 printOneBul:d=>{log('print.bulletin',`${fullName(stu(d.sid))} ${d.t}`);printHTML(bulletinHTML(d.sid,d.t),'Bulletin')},
 printBulletins:()=>{const rk=ranking(ui.gC,ui.gT);const ok=rk.filter(x=>isBoss()||!unpaidBlocked(x.s));log('print.bulletins',`${cls(ui.gC)?.name} ${ui.gT} (${ok.length})`);printHTML(ok.map(x=>bulletinHTML(x.s.id,ui.gT)).join(''),'Bulletins '+cls(ui.gC)?.name)},
 printExam:()=>{const c=cls(ui.exC);const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));printHTML(`<div class="pg">${printHead(`Liste des candidats au ${c.exam}`,`Session ${esc(String(S.school.year).slice(5))} · Classe ${esc(c.name)} · ${ss.length} candidats`)}<table class="pt"><thead><tr><th>N°</th><th>Nom et prénoms</th><th>Sexe</th><th>Date de naissance</th><th>Lieu de naissance</th><th>Matricule</th><th>Nom du parent</th></tr></thead><tbody>${ss.map((s,i)=>`<tr><td>${i+1}</td><td><b>${esc(s.last.toUpperCase())}</b> ${esc(s.first)}</td><td>${s.sex==='L'?'M':'F'}</td><td>${fmtDate(s.birth)}</td><td>${esc(s.birthPlace||'')}</td><td>${esc(s.matricule)}</td><td>${esc(s.parent||'')}</td></tr>`).join('')}</tbody></table><div class="psign"><div></div><div>Le Directeur</div></div></div>`,'Candidats '+c.exam)},
 xlsExam:()=>{const c=cls(ui.exC);const rows=[['N°','Nom','Prénoms','Sexe','Date de naissance','Lieu de naissance','Matricule','Parent','Téléphone']];S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b))).forEach((s,i)=>rows.push([i+1,s.last,s.first,s.sex==='L'?'M':'F',s.birth||'',s.birthPlace||'',s.matricule,s.parent||'',s.phone||'']));exportXLSX(`candidats_${c.exam}_${c.name}`,[{name:c.exam,rows}])},
});
Object.assign(C,{
 gC:el=>{ui.gC=el.value;render()},gT:el=>{ui.gT=el.value;render()},gS:el=>{ui.gS=el.value;render()},exC:el=>{ui.exC=el.value;render()},
 bulT:el=>bulletin(el.dataset.sid,el.value),
 note:el=>{
  const e0=G(ui.gC,ui.gT,ui.gS).evals.find(x=>x.id===el.dataset.e);if(!e0)return;
  const old=(e0.notes||{})[el.dataset.sid];let v=el.value===''?null:Math.max(0,Math.min(+e0.max||20,parseFloat(String(el.value).replace(',','.'))));if(v!=null&&isNaN(v))v=null;
  const apply=r=>{setGrades(ui.gC,ui.gT,ui.gS,g=>{const e=g.evals.find(x=>x.id===el.dataset.e);e.notes=e.notes||{};if(v==null)delete e.notes[el.dataset.sid];else e.notes[el.dataset.sid]=v});
   log('grade.set',`${cls(ui.gC)?.name} ${ui.gT} ${sbj(ui.gS)?.name} [${e0.label}] ${fullName(stu(el.dataset.sid))}: ${old??'—'} → ${v??'—'}${r?' — '+r:''}`);const y=window.scrollY;render();window.scrollTo(0,y)};
  if(isLocked(ui.gC,ui.gT)){if(!isBoss()){el.value=old??'';return}promptBox(L('Naoty voahidy','Note verrouillée'),L('Antony hanovana','Motif de la modification'),apply)}else apply();
 },
 appr:el=>setGrades(ui.gC,ui.gT,ui.gS,g=>{g.appr=g.appr||{};if(el.value.trim())g.appr[el.dataset.sid]=el.value.trim();else delete g.appr[el.dataset.sid]}),
 coMention:el=>setCouncil(ui.gC,ui.gT,co=>{(co.students[el.dataset.sid]=co.students[el.dataset.sid]||{}).mention=el.value}),
 coAppr:el=>setCouncil(ui.gC,ui.gT,co=>{(co.students[el.dataset.sid]=co.students[el.dataset.sid]||{}).appr=el.value.trim()}),
 coDec:el=>setCouncil(ui.gC,ui.gT,co=>{(co.students[el.dataset.sid]=co.students[el.dataset.sid]||{}).decision=el.value}),
});
Object.assign(F,{
 eval:d=>{const e={id:d.id||'e'+uid(),type:d.type,label:d.label.trim(),date:d.date,max:+d.max||20,coef:+d.coef||1};
  setGrades(ui.gC,ui.gT,ui.gS,g=>{const ex=g.evals.find(x=>x.id===e.id);if(ex)Object.assign(ex,e);else g.evals.push({...e,notes:{}})});log('grade.eval',`${cls(ui.gC)?.name} ${ui.gT} ${sbj(ui.gS)?.name}: ${e.label}`);closeModal();render()},
});
