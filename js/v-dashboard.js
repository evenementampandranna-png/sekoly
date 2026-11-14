/* Sekoly — v-dashboard.js : tableau de bord */
'use strict';
V.tabilao=()=>{
 const t=today(),cm=curMonthIdx(),dow=new Date().getDay();
 const mine=myClasses(),mineIds=new Set(mine.map(c=>c.id));
 const st=active().filter(s=>mineIds.has(s.classId)),boys=st.filter(s=>s.sex==='L').length;
 const ld=lastAttDate(),ar=ld?attRateDate(ld,user.role==='Mpampianatra'?mineIds:null):null;
 const ann=S.announcements.filter(a=>(a.eventDate||'')>=t).sort((a,b)=>a.eventDate.localeCompare(b.eventDate)).slice(0,4);
 const hero=`<div class="hero"><div style="position:relative;z-index:1"><span class="eyebrow">${L('Arahaba','Bonjour')}, ${esc(user.name)} 👋 · ${esc(roleL(user.role))}</span><h2>${esc(S.school.name)}</h2><p>${L('Taom-pianarana','Année scolaire')} ${esc(S.school.year)} · ${termL(currentTerm())} · ${MONTH(cm)}</p></div>
  <div class="hero-actions">${CAN.students()?`<button class="btn white" data-act="newStudent">${ic('plus',16)} ${L('Mpianatra vaovao','Nouvel élève')}</button>`:''}${CAN.pay()?`<a class="btn light" href="#sarany">${ic('card',16)} ${L('Handray vola','Encaisser')}</a>`:''}${CAN.attendance()?`<a class="btn light" href="#fiantsoana">${ic('checks',16)} ${L('Fiantsoana','Faire l\'appel')}</a>`:''}${CAN.grades()?`<a class="btn light" href="#naoty">${ic('award',16)} ${L('Naoty','Notes')}</a>`:''}</div></div>`;
 const kpis=[];
 kpis.push(`<div class="card kpi"><div class="ki teal">${ic('users',20)}</div><div class="kv">${st.length}</div><div class="kl">${user.role==='Mpampianatra'?L('Mpianatrako','Mes élèves'):L('Mpianatra voasoratra','Élèves inscrits')}</div><div class="ks">${boys} ${L('lahy','garçons')} · ${st.length-boys} ${L('vavy','filles')} · ${mine.length} ${L('kilasy','classes')}</div></div>`);
 if(canSee('sarany')){
  const exp=expectedMonth(),got=sumMonth(cm),pct=exp?Math.round(got/exp*100):0;
  const late=active().filter(s=>dueAmount(s)>0),due=sum(late.map(dueAmount));
  const todayIn=livePays().filter(p=>p.date===t).reduce((a,p)=>a+p.amount,0);
  kpis.push(`<div class="card kpi"><div class="ki blue">${ic('trend',20)}</div><span class="kt badge b-blue nd">${pct}%</span><div class="kv">${fmt(got)}</div><div class="kl">${L('Saram-pianarana','Écolages')} ${MONTH(cm)}</div><div class="bar"><i style="width:${Math.min(100,pct)}%"></i></div><div class="ks">${L('Andrasana','Attendu')}: ${fmt(exp)} · ${L('Androany','Aujourd\'hui')}: ${fmt(todayIn)}</div></div>`);
  kpis.push(`<div class="card kpi"><div class="ki red">${ic('alert',20)}</div><div class="kv">${late.length}</div><div class="kl">${L('Mpianatra tsy mbola nandoa','Élèves avec impayés')}</div><div class="ks">${fmt(due)} ${L('tsy mbola voaloa','restant dû')}</div></div>`);
 }else{
  const sanc=S.sanctions.filter(x=>mineIds.has(stu(x.studentId)?.classId)).length;
  kpis.push(`<div class="card kpi"><div class="ki violet">${ic('book',20)}</div><div class="kv">${S.lessons.filter(l=>mineIds.has(l.classId)).length}</div><div class="kl">${L('Lesona voasoratra','Séances au cahier de textes')}</div><div class="ks">${L('Sazy','Sanctions')}: ${sanc}</div></div>`);
  const todo=mine.filter(c=>!S.attendance[c.id+'|'+t]).length;
  kpis.push(`<div class="card kpi"><div class="ki red">${ic('checks',20)}</div><div class="kv">${todo}</div><div class="kl">${L('Kilasy tsy mbola niantsoana androany','Classes sans appel aujourd\'hui')}</div><div class="ks">${dow===0||dow===6?L('Faran\'ny herinandro','Week-end'):dateLong(new Date())}</div></div>`);
 }
 kpis.push(`<div class="card kpi"><div class="ki amber">${ic('checks',20)}</div><div class="kv">${ar==null?'—':ar+'%'}</div><div class="kl">${L('Taham-pahatongavana','Taux de présence')}</div><div class="ks">${ld?L('Fiantsoana farany','Dernier appel')+': '+fmtDate(ld):L('Tsy mbola nisy fiantsoana','Aucun appel')}</div></div>`);
 // today's timetable
 const slotsToday=allSlots().filter(x=>x.day===dow&&(user.role!=='Mpampianatra'?mineIds.has(x.classId):x.teacherId===myTid())).sort((a,b)=>timeMin(a.start)-timeMin(b.start));
 const ttCard=`<div class="card"><div class="card-h"><div><h3>${L('Fandaharana androany','Emploi du temps du jour')}</h3><small>${DAY(dow)}</small></div><a class="btn ghost sm" href="#fandaharana">${L('Jereo','Voir')}</a></div>${slotsToday.length?`<div class="list">${slotsToday.slice(0,8).map(x=>`<div class="li"><div class="time">${x.start}<small>${x.end}</small></div><div class="who"><div><b>${esc(sbj(x.subjectId)?.name||'—')}</b><small>${esc(cls(x.classId)?.name||'')} · ${esc(tea(x.teacherId)?.name||'')} · ${esc(x.room)}</small></div></div></div>`).join('')}</div>`:`<div class="muted small">${L('Tsy misy fampianarana','Pas de cours')}</div>`}</div>`;
 const annCard=`<div class="card"><div class="card-h"><div><h3>${L('Hetsika ho avy','Événements à venir')}</h3></div><a class="btn ghost sm" href="#serasera">${L('Tetiandro','Calendrier')}</a></div>${ann.length?`<div class="list">${ann.map(a=>{const ty=ANN_TYPES().find(x=>x[0]===a.type)||ANN_TYPES()[0];return`<div class="li"><div class="dbox" style="--c:${ty[2]}"><b>${new Date(a.eventDate+'T12:00').getDate()}</b><small>${MSH(monthOfDate(a.eventDate))}</small></div><div class="who"><div><b>${esc(a.title)}</b><small>${ty[1]}</small></div></div></div>`}).join('')}</div>`:`<div class="muted small">${L('Tsy misy','Aucun')}</div>`}</div>`;
 let rows='';
 if(canSee('sarany')){
  const recs=receipts().filter(r=>!r.void).slice(0,6);
  const late=active().map(s=>({s,due:dueAmount(s),n:lateMonths(s)})).filter(x=>x.due>0).sort((a,b)=>b.due-a.due);
  const maxCap=Math.max(1,...S.classes.map(c=>c.capacity||30));
  rows=`<div class="row c2">
  <div class="card"><div class="card-h"><div><h3>${L('Saram-pianarana voaray isam-bolana','Écolages encaissés par mois')}</h3><small>${L('Voaray / andrasana','Encaissé / attendu')}</small></div><div class="legend"><span><i style="background:#0d9488"></i>${L('Voaray','Encaissé')}</span><span><i style="background:#e6efed"></i>${L('Andrasana','Attendu')}</span></div></div>${barChart()}</div>
  <div class="card"><div class="card-h"><div><h3>${L('Mpianatra isaky ny kilasy','Effectifs par classe')}</h3><small>${active().length} ${L('mpianatra','élèves')}</small></div></div>
   ${S.classes.map(c=>{const n=active().filter(s=>s.classId===c.id).length;return`<div class="crow"><b><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</b><div class="bar"><i style="width:${n/maxCap*100}%;background:${c.color}"></i></div><span>${n}/${c.capacity||30}</span></div>`}).join('')}</div></div>
  <div class="row c2e">
  <div class="card"><div class="card-h"><div><h3>${L('Fandoavana farany','Derniers encaissements')}</h3></div><a class="btn ghost sm" href="#sarany" data-act="payTabGo" data-k="rosia">${L('Rehetra','Tout')}</a></div>
   <div class="list">${recs.length?recs.map(r=>{const s=stu(r.studentId);return`<div class="li">${avs(fullName(s),r.studentId,s?.photo)}<div class="who"><div><b>${esc(fullName(s))}</b><small>${esc(cls(s?.classId)?.name||'')} · ${recItemsLabel(r)} · ${esc(modeL(r.mode))}</small></div></div><div class="r"><b>${fmt(r.amount)}</b><small>${fmtDate(r.date)}</small></div><button class="icon-btn" data-act="receipt" data-rec="${r.rec}">${ic('file',16)}</button></div>`}).join(''):emptyBox('card',L('Tsy mbola misy','Aucun'))}</div></div>
  <div class="card"><div class="card-h"><div><h3>${L('Tsy mbola nandoa','Impayés')}</h3><small>${L('Ireo be trosa indrindra','Les plus gros soldes')}</small></div><a class="btn ghost sm" href="#sarany" data-act="payTabGo" data-k="tara">${L('Rehetra','Tout')}</a></div>
   <div class="list">${late.length?late.slice(0,6).map(x=>`<div class="li">${avs(fullName(x.s),x.s.id,x.s.photo)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${esc(cls(x.s.classId)?.name||'')} · ${esc(x.s.phone||'')}</small></div></div><div class="r"><b class="red">${fmt(x.due)}</b><small>${x.n} ${L('volana','mois')}</small></div>${CAN.pay()?`<button class="btn pri sm" data-act="payFor" data-sid="${x.s.id}">${L('Andoavy','Encaisser')}</button>`:''}</div>`).join(''):emptyBox('check',L('Voaloa daholo! 🎉','Tout est réglé ! 🎉'))}</div></div></div>`;
 }
 const absToday=[];for(const c of mine){const r=S.attendance[c.id+'|'+(ld||t)]||{};for(const sid in r){const x=attCode(r[sid]);if(x==='A'||x==='J'){const s=stu(sid);if(s)absToday.push({s,c,x})}}}
 const absCard=`<div class="card"><div class="card-h"><div><h3>${L('Tsy tonga','Absents')} — ${fmtDate(ld||t)}</h3><small>${absToday.length} ${L('mpianatra','élèves')}</small></div><a class="btn ghost sm" href="#fiantsoana">${L('Jereo','Voir')}</a></div><div class="list">${absToday.length?absToday.slice(0,6).map(x=>`<div class="li">${avs(fullName(x.s),x.s.id,x.s.photo)}<div class="who"><div><b>${esc(fullName(x.s))}</b><small>${esc(x.c.name)}</small></div></div><div class="r"><span class="badge ${x.x==='J'?'b-amber':'b-red'}">${x.x==='J'?L('Misy antony','Justifiée'):L('Tsy misy antony','Non justifiée')}</span></div></div>`).join(''):`<div class="muted small">${L('Tsy misy','Aucun')} 👍</div>`}</div></div>`;
 const lb=+lsGet('sekoly_backup_'+SCHOOL)||0;const bk=isBoss()&&Date.now()-lb>864e5?`<div class="alert-box warn">${ic('db',18)}<div style="flex:1"><b>${L('Backup','Sauvegarde')}</b><div class="small">${lb?L('Backup farany','Dernière sauvegarde')+': '+fmtTime(lb):L('Mbola tsy nisy backup tamin\'ity fitaovana ity','Aucune sauvegarde téléchargée sur cet appareil')}</div></div><button class="btn ghost sm" data-act="backup">${ic('download',15)} ${L('Hanao backup','Sauvegarder')}</button></div>`:'';
 return hero+bk+`<div class="kpis">${kpis.join('')}</div>`+rows+`<div class="row c3">${ttCard}${absCard}${annCard}</div>`;
};
function barChart(){
 const cm=curMonthIdx(),exp=expectedMonth();
 const data=MONTHS_MG.map((m,i)=>({l:MSH(i),got:sumMonth(i)}));
 const max=Math.max(exp,...data.map(d=>d.got))||1;
 const W=640,H=240,pb=28,top=22,gw=W/10,bw=Math.min(36,gw*.56),ch=H-pb-top;
 let g=`<line x1="0" y1="${H-pb}" x2="${W}" y2="${H-pb}" stroke="#e6ebe9"/>`;
 [.25,.5,.75,1].forEach(f=>{const y=H-pb-ch*f;g+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#f1f4f3" stroke-dasharray="4 4"/>`});
 data.forEach((d,i)=>{const x=i*gw+(gw-bw)/2,he=exp/max*ch,hg=d.got/max*ch,cur=i===cm;
  g+=`<rect x="${x}" y="${H-pb-he}" width="${bw}" height="${he}" rx="8" fill="#e6efed"/>`;
  if(hg>0)g+=`<rect x="${x}" y="${H-pb-hg}" width="${bw}" height="${hg}" rx="8" fill="${cur?'url(#gc)':'url(#gg)'}"><title>${MONTH(i)}: ${fmt(d.got)} / ${fmt(exp)}</title></rect>`;
  if(d.got>0)g+=`<text x="${x+bw/2}" y="${H-pb-Math.max(hg,he)-7}" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">${short(d.got)}</text>`;
  g+=`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" font-size="11.5" font-weight="${cur?700:500}" fill="${cur?'#0f1f1c':'#94a3b8'}">${d.l}</text>`});
 return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;font-family:inherit"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14b8a6"/><stop offset="1" stop-color="#0d9488"/></linearGradient><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>${g}</svg>`;
}
