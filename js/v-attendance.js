/* Sekoly — v-attendance.js : M4 absences, retards, justification, discipline */
'use strict';
ui.absFrom='';ui.absC='';ui.absJ='';
V.fiantsoana=()=>{
 const tabs=[['antso',L('Antso','Appel'),'checks'],['tsytonga',L('Tsy fahatongavana','Absences & retards'),'clock'],(CAN.discipline()||user.role==='Mpampianatra')&&['sazy',L('Fifehezana','Discipline'),'flag']];
 const head=`<div class="toolbar">${tabsBar(ui.attTab,tabs,'attTab')}</div>`;
 if(ui.attTab==='tsytonga')return head+absTab();
 if(ui.attTab==='sazy')return head+sanctionsTab();
 return head+callTab();
};
function callTab(){
 const mine=myClasses();if(!ui.attC||!mine.some(c=>c.id===ui.attC))ui.attC=mine[0]?.id||'';if(!ui.attD)ui.attD=today();
 const c=cls(ui.attC);if(!c)return emptyBox('layers',L('Tsy misy kilasy','Aucune classe'));
 const key=c.id+'|'+ui.attD,rec=S.attendance[key]||{},ed=CAN.attendance();
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 const cnt={P:0,R:0,A:0,J:0};ss.forEach(s=>{const x=attCode(rec[s.id]);if(x)cnt[x]++});const un=ss.length-cnt.P-cnt.R-cnt.A-cnt.J;
 const dd=new Date(ui.attD+'T12:00:00'),we=dd.getDay()===0||dd.getDay()===6,hol=isHoliday(ui.attD);
 const hist=attDates().filter(d=>S.attendance[c.id+'|'+d]).slice(-10);
 return`<div class="toolbar"><select class="inp" data-ch="attC">${clsOpts(ui.attC,null,mine)}</select><input class="inp auto" type="date" data-ch="attD" value="${ui.attD}" max="${today()}"><span class="chip">${ic('cal',14)} ${dateLong(dd)}</span><div style="flex:1"></div>${ed?`<button class="btn ghost" data-act="attClear">${L('Fafana','Effacer')}</button><button class="btn pri" data-act="attAll">${ic('check',16)} ${L('Tonga daholo ny sisa','Tous les autres présents')}</button>`:''}</div>
 ${we||hol?`<div class="hint">⚠ ${hol?L('Andro fialan-tsasatra','Jour de vacances'):L("Faran'ny herinandro",'Week-end')}</div>`:''}
 ${S.school.smsAbsence?`<div class="hint">${ic('send',14)} ${L('Raha "Tsy tonga" ny mpianatra iray, dia alefa ho azy ny SMS any amin\'ny ray aman-dreny.','Une absence non justifiée envoie automatiquement un SMS au parent.')}</div>`:''}
 <div class="stats s5"><div class="stat g"><b>${cnt.P}</b><span>${ATT.P()}</span></div><div class="stat a"><b>${cnt.R}</b><span>${ATT.R()}</span></div><div class="stat r"><b>${cnt.A}</b><span>${L('Tsy tonga','Absents')}</span></div><div class="stat"><b>${cnt.J}</b><span>${L('Misy antony','Justifiés')}</span></div><div class="stat"><b>${un}</b><span>${L('Tsy voamarika','Non marqués')}</span></div></div>
 <div class="row c2">
 <div class="card np"><div class="card-h pad"><div><h3>${esc(c.name)}</h3><small>${ss.length} ${L('mpianatra','élèves')} · ${L('Voatahiry ho azy — mandeha na tsy misy internet','Enregistré automatiquement — fonctionne hors ligne')}</small></div></div>
 <div class="tw"><table class="t"><tbody>${ss.map((s,i)=>{const v=rec[s.id],x=attCode(v);return`<tr><td class="muted" style="width:32px">${i+1}</td><td>${stuWho(s,x==='J'||x==='A'?esc(attMotif(v)||''):esc(s.matricule))}</td><td class="r-cell"><div class="seg">${['P','R','A'].map(k=>`<button class="${k} ${x===k||(k==='A'&&x==='J')?'on':''} ${k==='A'&&x==='J'?'J':''}" data-act="att" data-sid="${s.id}" data-v="${k}" ${ed?'':'disabled'}>${k==='P'?'✓ '+ATT.P():k==='R'?'⏱ '+ATT.R():'✕ '+(x==='J'?L('Misy antony','Justifié'):ATT.A())}</button>`).join('')}${(x==='A'||x==='J')&&CAN.justify()?`<button class="icon-btn" data-act="justify" data-k="${key}" data-sid="${s.id}" title="${L('Antony','Motif')}">${ic('edit',14)}</button>`:''}</div></td></tr>`}).join('')}</tbody></table></div></div>
 <div class="col"><div class="card"><div class="card-h"><div><h3>${L('Tantara','Historique')}</h3><small>${L('Taham-pahatongavana','Taux de présence')}</small></div></div>
  ${hist.length?hist.map(d=>{const r=S.attendance[c.id+'|'+d],v=Object.values(r).map(attCode),ok=v.filter(x=>x==='P'||x==='R').length,p=v.length?Math.round(ok/v.length*100):0;return`<div class="crow click" style="grid-template-columns:92px 1fr 44px" data-act="attGo" data-d="${d}"><b class="fw5">${fmtDate(d).slice(0,5)} <span class="muted xs">${DAY(new Date(d+'T12:00').getDay()).slice(0,3)}</span></b><div class="bar"><i style="width:${p}%;background:${p>=90?'#14a85b':p>=75?'#f2a531':'#e23d4c'}"></i></div><span>${p}%</span></div>`}).join(''):`<div class="muted small">—</div>`}</div>
 <div class="card"><div class="card-h"><h3>${L('Matetika tsy tonga','Absentéistes')}</h3></div><div class="list">${ss.map(s=>({s,a:studentAtt(s)})).filter(x=>x.a.A+x.a.J>0).sort((a,b)=>b.a.A-a.a.A).slice(0,6).map(x=>`<div class="li">${avs(fullName(x.s),x.s.id,x.s.photo)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${esc(x.s.phone||'')}</small></div></div><div class="r"><span class="badge b-red nd">${x.a.A}</span> <span class="badge b-amber nd">${x.a.J}</span></div></div>`).join('')||`<div class="muted small">👍</div>`}</div></div></div></div>`;
}
function absTab(){
 const mine=myClassIds();if(!ui.absFrom){const d=new Date();d.setDate(d.getDate()-30);ui.absFrom=iso(d)}
 const rows=[];for(const k in S.attendance){const[cid,d]=k.split('|');if(!mine.has(cid)||(ui.absC&&cid!==ui.absC)||d<ui.absFrom)continue;for(const sid in S.attendance[k]){const v=S.attendance[k][sid],x=attCode(v);if(x==='P')continue;if(ui.absJ&&x!==ui.absJ)continue;const s=stu(sid);if(s)rows.push({k,d,s,x,m:attMotif(v)})}}
 rows.sort((a,b)=>b.d.localeCompare(a.d));
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Tsy fahatongavana sy fahatarana','Absences et retards')}</h3><small>${rows.length} · A: ${rows.filter(r=>r.x==='A').length} · J: ${rows.filter(r=>r.x==='J').length} · R: ${rows.filter(r=>r.x==='R').length}</small></div>
 <div class="toolbar"><input class="inp auto" type="date" data-ch="absFrom" value="${ui.absFrom}"><select class="inp" data-ch="absC">${clsOpts(ui.absC,L('Kilasy rehetra','Toutes les classes'),myClasses())}</select><select class="inp" data-ch="absJ"><option value="">${L('Rehetra','Tout')}</option><option value="A" ${ui.absJ==='A'?'selected':''}>${L('Tsy misy antony','Non justifiées')}</option><option value="J" ${ui.absJ==='J'?'selected':''}>${L('Misy antony','Justifiées')}</option><option value="R" ${ui.absJ==='R'?'selected':''}>${ATT.R()}</option></select><button class="btn ghost sm" data-act="xlsAbs">${ic('download',15)} Excel</button></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Daty','Date')}</th><th>${L('Mpianatra','Élève')}</th><th>${L('Kilasy','Classe')}</th><th>${L('Karazany','Type')}</th><th>${L('Antony','Motif')}</th><th></th></tr></thead><tbody>
 ${rows.length?rows.slice(0,400).map(r=>`<tr><td>${fmtDate(r.d)}</td><td>${stuWho(r.s,esc(r.s.phone||''))}</td><td>${clsBadge(cls(r.s.classId))}</td><td><span class="badge ${r.x==='A'?'b-red':r.x==='J'?'b-amber':'b-blue'}">${r.x==='A'?L('Tsy misy antony','Non justifiée'):r.x==='J'?L('Misy antony','Justifiée'):ATT.R()}</span></td><td>${esc(r.m||'')}</td><td>${CAN.justify()&&r.x!=='R'?`<button class="btn ghost sm" data-act="justify" data-k="${r.k}" data-sid="${r.s.id}">${r.x==='A'?L('Hamarino','Justifier'):L('Hanova','Modifier')}</button>`:''}</td></tr>`).join(''):`<tr><td colspan="6">${emptyBox('check',L('Tsy misy','Aucune absence'))}</td></tr>`}
 </tbody></table></div></div>`;
}
function sanctionsTab(){
 const mine=myClassIds();const list=S.sanctions.filter(x=>mine.has(stu(x.studentId)?.classId)).sort((a,b)=>b.date.localeCompare(a.date));
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Sazy','Sanctions')}</h3><small>${list.length}</small></div>${CAN.discipline()?`<button class="btn pri" data-act="newSanction">${ic('plus',16)} ${L('Sazy vaovao','Nouvelle sanction')}</button>`:''}</div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Daty','Date')}</th><th>${L('Mpianatra','Élève')}</th><th>${L('Karazany','Type')}</th><th>${L('Antony','Motif')}</th><th>${L('Andro','Jours')}</th><th>${L('Nanome','Par')}</th><th></th></tr></thead><tbody>
 ${list.length?list.map(x=>{const s=stu(x.studentId);return`<tr><td>${fmtDate(x.date)}</td><td>${stuWho(s,esc(cls(s?.classId)?.name||''))}</td><td><span class="badge ${x.type==='Exclusion temporaire'||x.type==='Blâme'?'b-red':'b-amber'}">${esc((SANCTIONS().find(y=>y[0]===x.type)||[0,x.type])[1])}</span></td><td>${esc(x.motif||'')}</td><td>${x.days||'—'}</td><td class="muted small">${esc(x.by||'')}</td><td>${CAN.discipline()?`<div class="acts"><button class="icon-btn del" data-act="delSanction" data-id="${x.id}">${ic('trash',15)}</button></div>`:''}</td></tr>`}).join(''):`<tr><td colspan="7">${emptyBox('flag',L('Tsy misy sazy','Aucune sanction'))}</td></tr>`}
 </tbody></table></div></div>`;
}
function absenceSMS(s,d,on){
 if(!S.school.smsAbsence||!s.phone)return;const id=`abs_${s.id}_${d}`;
 if(on){if(!S.sms.some(x=>x.id===id))S.sms.push({id,to:phoneNorm(s.phone),name:s.parent||'',studentId:s.id,kind:'absence',status:'pending',created:Date.now(),by:user.name,text:`${S.school.name}: Votre enfant ${s.first} ${s.last} (${cls(s.classId)?.name||''}) est absent(e) le ${fmtDate(d)}. Merci de justifier l'absence. Tél: ${S.school.phone||''}`})}
 else S.sms=S.sms.filter(x=>!(x.id===id&&x.status==='pending'));
}
Object.assign(A,{
 attTab:d=>{ui.attTab=d.k;render()},
 att:d=>{const k=ui.attC+'|'+ui.attD;const r={...(S.attendance[k]||{})};const cur=attCode(r[d.sid]);const s=stu(d.sid);
  if(cur===d.v||(d.v==='A'&&cur==='J'))delete r[d.sid];else r[d.sid]=d.v;
  absenceSMS(s,ui.attD,attCode(r[d.sid])==='A');
  if(Object.keys(r).length)S.attendance[k]=r;else delete S.attendance[k];save();render()},
 attAll:()=>{const k=ui.attC+'|'+ui.attD;const r={...(S.attendance[k]||{})};S.students.filter(s=>s.classId===ui.attC&&s.status==='Mianatra').forEach(s=>{if(!r[s.id])r[s.id]='P'});S.attendance[k]=r;log('attendance.call',`${cls(ui.attC)?.name} ${ui.attD}`);save();render();toast(L('Voatahiry ny antso','Appel enregistré'))},
 attClear:()=>confirmBox(L('Hamafa ny antso amin\'ity andro ity?','Effacer l\'appel de ce jour ?'),()=>{const k=ui.attC+'|'+ui.attD;Object.keys(S.attendance[k]||{}).forEach(sid=>absenceSMS(stu(sid)||{},ui.attD,false));delete S.attendance[k];save();render()},L('Fafana','Effacer')),
 attGo:d=>{ui.attD=d.d;render()},
 justify:d=>{const v=(S.attendance[d.k]||{})[d.sid],s=stu(d.sid);openModal(L('Antony tsy fahatongavana','Justifier l\'absence')+' — '+esc(fullName(s)),`<form data-form="justify" id="fm"><input type="hidden" name="k" value="${d.k}"><input type="hidden" name="sid" value="${d.sid}"><p class="muted">${fmtDate(d.k.split('|')[1])}</p>${sel(L('Sata','Statut'),'c',[['J',L('Misy antony (voamarina)','Justifiée')],['A',L('Tsy misy antony','Non justifiée')]],attCode(v)==='A'?'J':attCode(v))}<div style="height:12px"></div>${fld(L('Antony','Motif'),'m',attMotif(v),'text',`list="motifs" placeholder="${L('Marary, fianakaviana…','Maladie, famille…')}"`)}<datalist id="motifs">${['Marary','Maladie','Fianakaviana','Raison familiale','Fitaterana','Transport','Taratasy dokotera','Certificat médical'].map(x=>`<option value="${x}">`).join('')}</datalist></form>`,cancelBtn()+saveBtn(),'sm')},
 newSanction:()=>openModal(L('Sazy vaovao','Nouvelle sanction'),`<form data-form="sanction" id="fm"><div class="grid2"><div class="full"><label class="fld"><span>${L('Mpianatra','Élève')}</span><select name="studentId" required>${stuOptions('',s=>myClassIds().has(s.classId))}</select></label></div>${sel(L('Karazany','Type'),'type',SANCTIONS(),'Avertissement')}${fld(L('Daty','Date'),'date',today(),'date','required')}<div class="full">${fld(L('Antony','Motif'),'motif','','text','required')}</div>${fld(L('Andro (fandroahana)','Jours (exclusion)'),'days',0,'number','min="0"')}<label class="check" style="align-self:end"><input type="checkbox" name="sms" checked> <span>${L('Ampahafantaro amin\'ny SMS ny ray aman-dreny','Prévenir le parent par SMS')}</span></label></div></form>`,cancelBtn()+saveBtn()),
 delSanction:d=>confirmBox(L('Hamafa ity sazy ity?','Supprimer cette sanction ?'),()=>{const x=S.sanctions.find(y=>y.id===d.id);S.sanctions=S.sanctions.filter(y=>y.id!==d.id);log('sanction.delete',`${fullName(stu(x?.studentId))} ${x?.type}`);save();render()},L('Fafana','Supprimer')),
 xlsAbs:()=>{const rows=[['Date','Élève','Matricule','Classe','Type','Motif','Téléphone parent']];for(const k in S.attendance){const[cid,d]=k.split('|');if(!myClassIds().has(cid))continue;for(const sid in S.attendance[k]){const v=S.attendance[k][sid],x=attCode(v);if(x==='P')continue;const s=stu(sid);if(s)rows.push([d,fullName(s),s.matricule,cls(cid)?.name||'',{A:'Absence non justifiée',J:'Absence justifiée',R:'Retard'}[x],attMotif(v),s.phone||''])}}rows.splice(1,0,...rows.splice(1).sort((a,b)=>String(b[0]).localeCompare(String(a[0]))));exportXLSX('absences_'+SCHOOL,[{name:'Absences',rows}])},
});
Object.assign(C,{attC:el=>{ui.attC=el.value;render()},attD:el=>{if(el.value){ui.attD=el.value;render()}},absFrom:el=>{ui.absFrom=el.value;render()},absC:el=>{ui.absC=el.value;render()},absJ:el=>{ui.absJ=el.value;render()}});
Object.assign(F,{
 justify:d=>{const r={...(S.attendance[d.k]||{})};const s=stu(d.sid);r[d.sid]=d.m||d.c==='J'?{c:d.c,m:d.m||''}:d.c;S.attendance[d.k]=r;absenceSMS(s,d.k.split('|')[1],d.c==='A');log('attendance.justify',`${fullName(s)} ${d.k.split('|')[1]}: ${d.c} ${d.m||''}`);save();closeModal();render()},
 sanction:d=>{const s=stu(d.studentId);const x={id:uid(),studentId:d.studentId,type:d.type,date:d.date,motif:d.motif,days:+d.days||0,by:user.name};S.sanctions.push(x);
  if(d.sms&&s.phone)S.sms.push({id:uid(),to:phoneNorm(s.phone),name:s.parent||'',studentId:s.id,kind:'sanction',status:'pending',created:Date.now(),by:user.name,text:`${S.school.name}: ${s.first} ${s.last} a reçu une sanction (${d.type}${x.days?', '+x.days+' j':''}) le ${fmtDate(d.date)}. Motif : ${d.motif}.`});
  log('sanction.create',`${fullName(s)}: ${d.type} — ${d.motif}`);save();closeModal();render();toast(L('Voatahiry','Enregistré'))},
});
