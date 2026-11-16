/* Sekoly — v-finance.js : M5 finances & écolages */
'use strict';
V.sarany=()=>{
 const lateN=active().filter(s=>dueAmount(s)>0).length;
 const tabs=[['vaovao',L('Handray vola','Encaisser'),'plus'],['tara',L('Tsy mbola nandoa','Impayés'),'alert',lateN],['tabilao',L('Tabilao isam-bolana','Grille mensuelle'),'cal'],['rosia',L('Rosia','Reçus'),'file'],['journal',L('Journal de caisse','Journal de caisse'),'cash'],['tatitra',L('Tatitra isam-bolana','Rapport mensuel'),'chart']];
 const head=`<div class="toolbar">${tabsBar(ui.payTab,tabs,'payTab')}</div>`;
 return head+({tara:payLate,tabilao:payGrid,rosia:()=>payList(1000),journal:cashJournal,tatitra:monthReport}[ui.payTab]||payNew)();
};
function monthsPick(sid){
 const s=stu(sid);if(!s)return`<div class="hint">${L('Safidio aloha ny mpianatra.','Choisissez d\'abord un élève.')}</div>`;
 const f=fee(s);const tri=S.school.termMode==='S'?[[0,1,2,3,4],[5,6,7,8,9]]:[[0,1,2],[3,4,5],[6,7,8,9]];
 return`<div class="months">${MONTHS_MG.map((m,i)=>{const st=mstat(s,i),p=paid(s.id,i),ck=ui.payMonths.includes(i);
  return`<label class="mchip ${st}">${st!=='paid'?`<input type="checkbox" data-ch="pmon" value="${i}" ${ck?'checked':''}>`:''}${MSH(i)}<small>${st==='paid'?'✓':st==='partial'?L('Sisa','Reste')+' '+short(f-p):st==='skip'?'—':short(f)}</small></label>`}).join('')}</div>
 <div class="quick">${tri.map((ms,i)=>`<button type="button" class="btn ghost sm" data-act="pickMonths" data-m="${ms.join(',')}">${S.school.termMode==='S'?'S'+(i+1):'T'+(i+1)} (${MSH(ms[0])}–${MSH(ms[ms.length-1])})</button>`).join('')}<button type="button" class="btn ghost sm" data-act="pickMonths" data-m="late">${L('Ireo tara rehetra','Tous les impayés')}</button></div>`;
}
function itemsPick(sid){const s=stu(sid);if(!s)return'';const its=FEE_ITEMS().filter(([k])=>itemFee(s,k)>0);if(!its.length)return'';
 return`<div class="fld"><span>${L('Saran-javatra hafa','Autres frais')}</span><div class="items">${its.map(([k,l])=>{const f=itemFee(s,k),p=paidItem(s.id,k),done=p>=f;return`<label class="ichip ${done?'paid':''}">${done?'':`<input type="checkbox" data-ch="pitem" value="${k}" ${ui.payItems.includes(k)?'checked':''}>`}<b>${l}</b><small>${done?'✓ '+L('Voaloa','Réglé'):fmt(f-p)}</small></label>`}).join('')}</div></div>`}
const selRemain=()=>{const s=stu(ui.paySid);if(!s)return 0;return ui.payMonths.reduce((a,m)=>a+Math.max(0,fee(s)-paid(s.id,m)),0)+ui.payItems.reduce((a,k)=>a+Math.max(0,itemFee(s,k)-paidItem(s.id,k)),0)};
function payInfo(){const s=stu(ui.paySid);if(!s)return'';const c=cls(s.classId);return`<div class="li boxed">${avs(fullName(s),s.id,s.photo)}<div class="who"><div><b>${esc(fullName(s))}</b><small>${esc(c?.name||'')} · ${fmt(fee(s))}/${L('volana','mois')}${s.reduc?.pct?` (−${s.reduc.pct}%)`:''} · ${esc(s.parent||'')} ${esc(s.phone||'')}</small></div></div><div class="r">${dueAmount(s)?`<b class="red">${fmt(dueAmount(s))}</b><small>${L('trosa','solde dû')}</small>`:`<span class="badge b-green">${L('Voaloa','À jour')}</span>`}</div></div>`}
function payNew(){
 if(!CAN.pay())return`<div class="hint">${L('Tsy manana alalana handray vola ianao.','Vous n\'avez pas le droit d\'encaisser.')}</div>`+payList(10);
 const closed=S.closures.some(x=>x.id===today());
 return`<div class="row c2r">
 <div class="card"><div class="card-h"><div><h3>${L('Handray vola','Nouvel encaissement')}</h3><small>${L('Saram-pianarana, saram-pidirana, fiantohana, fanamiana, fanadinana','Écolage, inscription, assurance, tenue, examen')}</small></div></div>
 ${closed&&!isBoss()?`<div class="alert-box warn">${ic('lock',18)}<div>${L('Efa nakatona ny vola androany. Safidio daty hafa na angataho amin\'ny Tale.','La caisse du jour est clôturée. Seule la direction peut encore saisir à cette date.')}</div></div>`:''}
 <form data-form="pay" id="payf" class="stack">
  <label class="fld"><span>${L('Mpianatra','Élève')}</span><select name="sid" data-ch="pstu" required>${stuOptions(ui.paySid)}</select></label>
  <div id="pinfo">${payInfo()}</div>
  <div class="fld"><span>${L('Saram-pianarana isam-bolana','Écolage mensuel')}</span><div id="pmonths">${monthsPick(ui.paySid)}</div></div>
  <div id="pitems">${itemsPick(ui.paySid)}</div>
  <div class="grid2">
   <label class="fld"><span>${L('Vola voaray (Ar)','Montant reçu (Ar)')}</span><input name="amount" id="pamt" type="number" min="0" step="100" value="${selRemain()||''}" required></label>
   <label class="fld"><span>${L('Daty','Date')}</span><input name="date" type="date" value="${today()}" max="${today()}" required></label>
   <label class="fld"><span>${L('Fomba fandoavana','Mode de paiement')}</span><select name="mode">${MODES.map(m=>`<option value="${m}">${esc(modeL(m))}</option>`).join('')}</select></label>
   <label class="fld"><span>${L('Référence (MVola, virement…)','Référence (transaction, chèque…)')}</span><input name="ref" placeholder="ex: 0123456789"></label>
  </div>
  <label class="check"><input type="checkbox" name="sms" checked> <span>${L('Alefaso SMS ny rosia any amin\'ny ray aman-dreny','Envoyer le reçu par SMS au parent')}</span></label>
  <div class="sumbox"><span class="muted">${L('Totaly voafidy','Total sélectionné')}</span><b id="ptot">${fmt(selRemain())}</b></div>
  <button class="btn pri block lg">${ic('check',16)} ${L('Ekena sy hamoaka rosia','Valider et émettre le reçu')}</button>
 </form></div>
 ${payList(10)}</div>`;
}
function payList(limit){
 const rs=receipts(),live=rs.filter(r=>!r.void),total=sum(live.map(r=>r.amount));
 return`<div class="card np"><div class="card-h pad"><div><h3>${limit>50?L('Rosia rehetra','Tous les reçus'):L('Rosia farany','Derniers reçus')}</h3><small>${live.length} ${L('rosia','reçus')} · ${fmt(total)}${rs.length-live.length?` · ${rs.length-live.length} ${L('nofoanana','annulé(s)')}`:''}</small></div>${limit>50?`<button class="btn ghost sm" data-act="xlsPays">${ic('download',15)} Excel</button>`:''}</div>
 <div class="tw"><table class="t"><thead><tr><th>N°</th><th>${L('Mpianatra','Élève')}</th><th>${L('Antony','Objet')}</th><th class="num">${L('Vola','Montant')}</th><th>${L('Fomba','Mode')}</th><th>${L('Daty','Date')}</th><th></th></tr></thead><tbody>
 ${rs.length?rs.slice(0,limit).map(r=>{const s=stu(r.studentId);return`<tr class="${r.void?'void':''}"><td><b class="mono pri-t">${r.rec}</b></td><td>${stuWho(s,esc(cls(s?.classId)?.name||''))}</td><td class="small">${recItemsLabel(r)}${r.void?`<div class="red xs">${L('Nofoanana','Annulé')}: ${esc(r.voidReason||'')}</div>`:''}</td><td class="num"><b>${fmt(r.amount)}</b></td><td class="muted small">${esc(modeL(r.mode))}${r.ref?'<div class="xs">'+esc(r.ref)+'</div>':''}</td><td>${fmtDate(r.date)}</td><td><div class="acts"><button class="icon-btn" data-act="receipt" data-rec="${r.rec}">${ic('eye',16)}</button>${CAN.cancelPay()&&!r.void?`<button class="icon-btn del" data-act="voidReceipt" data-rec="${r.rec}" title="${L('Foanana','Annuler')}">${ic('x',16)}</button>`:''}</div></td></tr>`}).join(''):`<tr><td colspan="7">${emptyBox('card',L('Tsy mbola misy rosia','Aucun reçu'))}</td></tr>`}
 </tbody></table></div></div>`;
}
function payLate(){
 const cm=curMonthIdx();if(ui.lateM===null)ui.lateM='all';
 const m=ui.lateM;
 const list=active().filter(s=>(!ui.lateC||s.classId===ui.lateC)&&(m==='all'?dueAmount(s)>0:isDue(mstat(s,+m)))).map(s=>({s,due:m==='all'?dueAmount(s):Math.max(0,fee(s)-paid(s.id,+m)),tot:dueAmount(s),n:lateMonths(s),it:dueItems(s)})).sort((a,b)=>b.tot-a.tot);
 const total=sum(list.map(x=>x.due));
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Tsy mbola nandoa','Impayés')} — ${m==='all'?L('rehetra','tous'):MONTH(+m)}</h3><small>${list.length} ${L('mpianatra','élèves')} · ${fmt(total)}</small></div>
 <div class="toolbar"><select class="inp" data-ch="lateM"><option value="all">${L('Trosa rehetra','Solde total')}</option>${MONTHS_MG.map((mm,i)=>`<option value="${i}" ${String(i)===String(m)?'selected':''}>${MONTH(i)}${i>cm?' *':''}</option>`).join('')}</select><select class="inp" data-ch="lateC">${clsOpts(ui.lateC,L('Kilasy rehetra','Toutes les classes'))}</select>${CAN.sms()?`<button class="btn pri" data-act="remindLate">${ic('send',16)} ${L('Fampahatsiahivana SMS','Relance SMS')}</button>`:''}<button class="btn ghost" data-act="printLate">${ic('print',16)}</button><button class="btn ghost" data-act="xlsLate">${ic('download',16)}</button></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Mpianatra','Élève')}</th><th>${L('Kilasy','Classe')}</th><th>${L('Ray aman-dreny','Parent')}</th><th class="num">${L('Saram-pianarana','Écolage')}</th><th class="num">${L('Hafa','Autres frais')}</th><th class="num">${m==='all'?L('Totaly','Total'):MSH(+m)}</th><th></th></tr></thead><tbody>
 ${list.length?list.map(x=>`<tr><td>${stuWho(x.s,esc(x.s.matricule))}</td><td>${esc(cls(x.s.classId)?.name||'')}</td><td>${esc(x.s.parent||'—')}<div class="muted xs">${esc(x.s.phone||'—')}</div></td><td class="num">${fmt(dueEcolage(x.s))}<div class="muted xs">${x.n} ${L('volana','mois')}</div></td><td class="num">${fmt(x.it)}</td><td class="num"><b class="red">${fmt(x.due)}</b></td><td>${CAN.pay()?`<button class="btn pri sm" data-act="payFor" data-sid="${x.s.id}" ${m!=='all'?`data-m="${m}"`:''}>${L('Andoavy','Encaisser')}</button>`:''}</td></tr>`).join(''):`<tr><td colspan="7">${emptyBox('check',L('Voaloa daholo! 🎉','Tout est réglé ! 🎉'))}</td></tr>`}
 </tbody></table></div></div>`;
}
function payGrid(){
 if(!ui.gridC)ui.gridC=S.classes[0]?.id||'';const c=cls(ui.gridC);if(!c)return emptyBox('layers',L('Tsy misy kilasy','Aucune classe'));
 const ss=S.students.filter(s=>s.classId===c.id&&s.status==='Mianatra').sort((a,b)=>fullName(a).localeCompare(fullName(b)));
 const tots=MONTHS_MG.map((m,i)=>sum(ss.map(s=>paid(s.id,i))));
 return`<div class="card np"><div class="card-h pad"><div><h3>${L('Tabilao fandoavana','Grille des paiements')} — ${esc(c.name)}</h3><small>${ss.length} ${L('mpianatra','élèves')} · ${fmt(c.fee)}/${L('volana','mois')}</small></div>
 <div class="toolbar"><div class="legend"><span><i style="background:#e1f7e9"></i>${L('Voaloa','Payé')}</span><span><i style="background:#fff1d9"></i>${L('Ampahany','Partiel')}</span><span><i style="background:#fee6e8"></i>${L('Tsy voaloa','Impayé')}</span></div><select class="inp" data-ch="gridC">${clsOpts(ui.gridC)}</select></div></div>
 <div class="tw"><table class="t"><thead><tr><th>${L('Mpianatra','Élève')}</th>${MONTHS_MG.map((m,i)=>`<th class="ctr">${MSH(i)}</th>`).join('')}${FEE_ITEMS().filter(([k])=>(c.fees||{})[k]&&(k!=='examen'||c.exam)).map(([k,l])=>`<th class="ctr">${l.split(' ')[0]}</th>`).join('')}<th class="num">${L('Trosa','Solde')}</th></tr></thead><tbody>
 ${ss.map(s=>`<tr><td>${stuWho(s)}</td>${MONTHS_MG.map((m,i)=>{const st=mstat(s,i);return`<td class="ctr"><span class="pc ${st}" ${isDue(st)&&CAN.pay()?`data-act="payFor" data-sid="${s.id}" data-m="${i}"`:''} title="${MONTH(i)}: ${fmt(paid(s.id,i))}">${st==='paid'?'✓':st==='partial'?short(paid(s.id,i)):st==='future'||st==='skip'?'·':'✕'}</span></td>`}).join('')}${FEE_ITEMS().filter(([k])=>(c.fees||{})[k]&&(k!=='examen'||c.exam)).map(([k])=>{const f=itemFee(s,k),p=paidItem(s.id,k);return`<td class="ctr"><span class="pc ${p>=f?'paid':p>0?'partial':'none'}">${p>=f?'✓':'✕'}</span></td>`}).join('')}<td class="num">${dueAmount(s)?`<b class="red">${fmt(dueAmount(s))}</b>`:'<span class="badge b-green nd">0</span>'}</td></tr>`).join('')}
 <tr class="foot-row"><td><b>${L('Voaray','Encaissé')}</b></td>${tots.map(t=>`<td class="ctr pri-t xs fw7">${t?short(t):'—'}</td>`).join('')}<td colspan="6"></td></tr>
 </tbody></table></div></div>`;
}
function receiptHTML(rec,forPrint){
 const ps=S.payments.filter(p=>p.rec===rec);if(!ps.length)return'';const s=stu(ps[0].studentId),c=cls(s?.classId),total=sum(ps.map(p=>p.amount)),v=ps[0].void;
 return`<div class="receipt ${v?'void':''} ${forPrint?'pg-r':''}">
  <div class="rc-h"><div class="logo">${ic('cap',20)}</div><div><b>${esc(S.school.name)}</b><small>${esc([S.school.address,S.school.city].filter(Boolean).join(', '))} · ${esc(S.school.phone)}</small></div><div class="rc-no">REÇU N° ${rec}<small class="muted">${fmtDate(ps[0].date)}</small></div></div>
  <div class="rc-row"><span>Élève</span><b>${esc(fullName(s))}</b></div><div class="rc-row"><span>Matricule / Classe</span><b>${esc(s?.matricule||'')} · ${esc(c?.name||'')}</b></div><div class="rc-row"><span>Année scolaire</span><b>${esc(S.school.year)}</b></div>
  <div class="rc-sep"></div>
  ${ps.sort((a,b)=>(a.month??99)-(b.month??99)).map(p=>`<div class="rc-row"><span>${!p.kind||p.kind==='ecolage'?'Écolage '+MONTHS_FR[p.month]+(p.amount<fee(s)?' (partiel)':''):esc(FEE_ITEMS().length&&{inscription:"Droit d'inscription",assurance:'Assurance',tenue:'Tenue',examen:"Frais d'examen"}[p.kind]||p.kind)}</span><b>${fmt(p.amount)}</b></div>`).join('')}
  <div class="rc-total"><span>Total reçu</span><b>${fmt(total)}</b></div>
  <div class="rc-row"><span>Mode de paiement</span><b>${esc(modeL(ps[0].mode))}${ps[0].ref?' · '+esc(ps[0].ref):''}</b></div><div class="rc-row"><span>Reçu par</span><b>${esc(ps[0].by||'')}</b></div><div class="rc-row"><span>Reste dû</span><b>${fmt(dueAmount(s))}</b></div>
  ${v?`<div class="rc-void">ANNULÉ — ${esc(ps[0].voidReason||'')} (${esc(ps[0].voidBy||'')})</div>`:''}
  <div class="rc-foot">Merci ! · ${esc(S.school.motto||'')}</div></div>`;
}
function receiptSMS(rec){const ps=S.payments.filter(p=>p.rec===rec),s=stu(ps[0]?.studentId);return`${S.school.name} Recu ${rec} ${fmtDate(ps[0]?.date)}: ${s?.first} ${s?.last} - ${ps.map(p=>!p.kind||p.kind==='ecolage'?MS_FR[p.month]:p.kind).join(',')} = ${num(sum(ps.map(p=>p.amount)))} Ar (${modeL(ps[0]?.mode)}). Reste du: ${num(dueAmount(s))} Ar. Merci.`}
function showReceipt(rec){openModal(L('Rosia','Reçu')+' '+rec,receiptHTML(rec),`<button class="btn ghost" data-act="smsReceipt" data-rec="${rec}">${ic('send',16)} SMS</button><button class="btn ghost" data-act="printReceipt" data-rec="${rec}">${ic('print',16)} ${L('Atonta','Imprimer')}</button>${doneBtn()}`)}

/* ---------- journal de caisse ---------- */
function cashJournal(){
 if(!ui.jDate)ui.jDate=today();const d=ui.jDate;
 const rs=receipts().filter(r=>r.date===d),live=rs.filter(r=>!r.void),clo=S.closures.find(x=>x.id===d);
 const byMode={},byKind={};live.forEach(r=>{byMode[r.mode]=(byMode[r.mode]||0)+r.amount;r.items.forEach(p=>{const k=p.kind||'ecolage';byKind[k]=(byKind[k]||0)+p.amount})});
 const tot=sum(live.map(r=>r.amount));
 return`<div class="toolbar"><input class="inp auto" type="date" data-ch="jDate" value="${d}" max="${today()}"><span class="chip">${ic('cal',14)} ${dateLong(new Date(d+'T12:00'))}</span><div style="flex:1"></div><button class="btn ghost" data-act="printJournal">${ic('print',16)} ${L('Atonta','Imprimer')}</button>${CAN.closeCash()&&!clo?`<button class="btn pri" data-act="closeCash">${ic('lock',16)} ${L('Hikatona ny vola','Clôturer la caisse')}</button>`:''}</div>
 ${clo?`<div class="ok-box">${ic('lock',16)} ${L('Voakatona','Caisse clôturée')} ${fmtTime(clo.at)} · ${esc(clo.by)} · ${L('Vola an-tanana nisaina','Espèces comptées')}: <b>${fmt(clo.counted)}</b> · ${L('Elanelana','Écart')}: <b class="${clo.gap?'red':''}">${fmt(clo.gap)}</b>${clo.note?' · '+esc(clo.note):''}</div>`:''}
 <div class="stats s4"><div class="stat g"><b>${fmt(tot)}</b><span>${L('Totaly androany','Total du jour')}</span></div><div class="stat"><b>${live.length}</b><span>${L('Rosia','Reçus')}</span></div>${Object.entries(byMode).slice(0,2).map(([m,v])=>`<div class="stat"><b>${fmt(v)}</b><span>${esc(modeL(m))}</span></div>`).join('')}</div>
 <div class="row c2"><div class="card np"><div class="card-h pad"><h3>${L('Fandoavana','Opérations')}</h3></div><div class="tw"><table class="t"><thead><tr><th>N°</th><th>${L('Mpianatra','Élève')}</th><th>${L('Antony','Objet')}</th><th>${L('Fomba','Mode')}</th><th class="num">${L('Vola','Montant')}</th><th>${L('Nandray','Caissier')}</th></tr></thead><tbody>${rs.length?rs.map(r=>`<tr class="${r.void?'void':''}"><td class="mono">${r.rec}</td><td>${esc(fullName(stu(r.studentId)))}</td><td class="small">${recItemsLabel(r)}</td><td class="small">${esc(modeL(r.mode))}</td><td class="num"><b>${fmt(r.amount)}</b></td><td class="small muted">${esc(r.by||'')}</td></tr>`).join(''):`<tr><td colspan="6">${emptyBox('cash',L('Tsy nisy fandoavana','Aucune opération'))}</td></tr>`}</tbody></table></div></div>
 <div class="col"><div class="card"><div class="card-h"><h3>${L('Araka ny fomba','Par mode')}</h3></div>${Object.entries(byMode).map(([m,v])=>`<div class="spread li"><span>${esc(modeL(m))}</span><b>${fmt(v)}</b></div>`).join('')||'—'}</div><div class="card"><div class="card-h"><h3>${L('Araka ny karazany','Par nature')}</h3></div>${Object.entries(byKind).map(([k,v])=>`<div class="spread li"><span>${kindL(k)}</span><b>${fmt(v)}</b></div>`).join('')||'—'}</div></div></div>`;
}
function journalPrint(d){const rs=receipts().filter(r=>r.date===d),live=rs.filter(r=>!r.void),clo=S.closures.find(x=>x.id===d);const byMode={};live.forEach(r=>byMode[r.mode]=(byMode[r.mode]||0)+r.amount);
 return`<div class="pg">${printHead('JOURNAL DE CAISSE',dateFR(d))}<table class="pt"><thead><tr><th>Reçu</th><th>Élève</th><th>Classe</th><th>Objet</th><th>Mode</th><th>Montant</th><th>Caissier</th></tr></thead><tbody>${rs.map(r=>{const s=stu(r.studentId);return`<tr style="${r.void?'text-decoration:line-through;color:#999':''}"><td>${r.rec}</td><td>${esc(fullName(s))}</td><td>${esc(cls(s?.classId)?.name||'')}</td><td>${r.items.map(p=>!p.kind||p.kind==='ecolage'?MS_FR[p.month]:p.kind).join(', ')}</td><td>${esc(modeL(r.mode))}</td><td style="text-align:right">${num(r.amount)}</td><td>${esc(r.by||'')}</td></tr>`}).join('')}</tbody><tfoot><tr><td colspan="5"><b>TOTAL</b></td><td style="text-align:right"><b>${num(sum(live.map(r=>r.amount)))}</b></td><td></td></tr></tfoot></table>
 <table class="pt" style="width:50%;margin-top:14px"><tbody>${Object.entries(byMode).map(([m,v])=>`<tr><td>${esc(modeL(m))}</td><td style="text-align:right">${num(v)} Ar</td></tr>`).join('')}${clo?`<tr><td>Espèces comptées</td><td style="text-align:right">${num(clo.counted)} Ar</td></tr><tr><td>Écart</td><td style="text-align:right">${num(clo.gap)} Ar</td></tr>`:''}</tbody></table>
 <div class="psign"><div>Le Caissier<br><br>${esc(clo?.by||'')}</div><div>Le Directeur</div></div></div>`}
function monthReport(){
 if(ui.repM===null)ui.repM=curMonthIdx();const m=ui.repM;
 const ps=livePays().filter(p=>monthOfDate(p.date)===m);const tot=sum(ps.map(p=>p.amount));
 const byKind={},byMode={},byClass={},byDay={};ps.forEach(p=>{const k=p.kind||'ecolage';byKind[k]=(byKind[k]||0)+p.amount;byMode[p.mode]=(byMode[p.mode]||0)+p.amount;const c=stu(p.studentId)?.classId;byClass[c]=(byClass[c]||0)+p.amount;byDay[p.date]=(byDay[p.date]||0)+p.amount});
 const exp=expectedMonth(),gotE=sumMonth(m);
 return`<div class="toolbar"><select class="inp" data-ch="repM">${MONTHS_MG.map((x,i)=>`<option value="${i}" ${i===m?'selected':''}>${MONTH(i)}</option>`).join('')}</select><div style="flex:1"></div><button class="btn ghost" data-act="printMonth">${ic('print',16)} ${L('Atonta','Imprimer')}</button><button class="btn ghost" data-act="xlsMonth">${ic('download',16)} Excel</button></div>
 <div class="stats s4"><div class="stat g"><b>${fmt(tot)}</b><span>${L('Vola niditra tamin\'ny volana','Recettes du mois')}</span></div><div class="stat"><b>${fmt(gotE)}</b><span>${L('Saram-pianarana',"Écolage")} ${MSH(m)} ${L('voaray','encaissé')}</span></div><div class="stat"><b>${fmt(exp)}</b><span>${L('Andrasana','Attendu')}</span></div><div class="stat ${gotE<exp?'r':'g'}"><b>${exp?Math.round(gotE/exp*100):0}%</b><span>${L('Taha','Taux de recouvrement')}</span></div></div>
 <div class="row c3"><div class="card"><div class="card-h"><h3>${L('Araka ny karazany','Par nature')}</h3></div>${Object.entries(byKind).map(([k,v])=>`<div class="spread li"><span>${kindL(k)}</span><b>${fmt(v)}</b></div>`).join('')||'—'}</div>
 <div class="card"><div class="card-h"><h3>${L('Araka ny fomba','Par mode')}</h3></div>${Object.entries(byMode).map(([k,v])=>`<div class="spread li"><span>${esc(modeL(k))}</span><b>${fmt(v)}</b></div>`).join('')||'—'}</div>
 <div class="card"><div class="card-h"><h3>${L('Araka ny kilasy','Par classe')}</h3></div>${S.classes.map(c=>`<div class="spread li"><span>${esc(c.name)}</span><b>${fmt(byClass[c.id]||0)}</b></div>`).join('')}</div></div>
 <div class="card"><div class="card-h"><h3>${L('Isan\'andro','Par jour')}</h3></div>${Object.keys(byDay).sort().map(d=>`<div class="crow click" style="grid-template-columns:110px 1fr 120px" data-act="jGo" data-d="${d}"><b class="fw5">${fmtDate(d)}</b><div class="bar"><i style="width:${byDay[d]/Math.max(...Object.values(byDay))*100}%"></i></div><span>${fmt(byDay[d])}</span></div>`).join('')||'—'}</div>`;
}

Object.assign(A,{
 payTab:d=>{ui.payTab=d.k;render()},
 payTabGo:d=>{ui.payTab=d.k;if(route()!=='sarany')location.hash='sarany';else render()},
 payFor:d=>{if(!CAN.pay())return;ui.payTab='vaovao';ui.paySid=d.sid;const s=stu(d.sid);ui.payItems=[];ui.payMonths=d.m!==undefined?[+d.m]:(()=>{for(let m=0;m<10;m++)if(isDue(mstat(s,m)))return[m];return[]})();closeModal();if(route()!=='sarany')location.hash='sarany';else render();window.scrollTo({top:0,behavior:'smooth'})},
 pickMonths:d=>{const s=stu(ui.paySid);if(!s)return;ui.payMonths=d.m==='late'?MONTHS_MG.map((_,i)=>i).filter(i=>i<=curMonthIdx()&&isDue(mstat(s,i))):d.m.split(',').map(Number).filter(i=>mstat(s,i)!=='paid');refreshPay()},
 receipt:d=>showReceipt(d.rec),
 printReceipt:d=>printHTML(`<div class="rc-print">${receiptHTML(d.rec,1)}${receiptHTML(d.rec,1)}</div>`,'Reçu '+d.rec),
 smsReceipt:d=>{const ps=S.payments.filter(p=>p.rec===d.rec),s=stu(ps[0]?.studentId);if(!s?.phone){toast(L('Tsy misy laharana finday','Pas de numéro'),1);return}queueSMS([{to:s.phone,name:s.parent,studentId:s.id,kind:'recu',text:receiptSMS(d.rec)}])},
 voidReceipt:d=>promptBox(L('Hanafoana ny rosia','Annuler le reçu')+' '+d.rec,L('Antony (voatahiry ao amin\'ny diary)','Motif (consigné au journal)'),r=>{S.payments.forEach(p=>{if(p.rec===d.rec){p.void=true;p.voidReason=r;p.voidBy=user.name;p.voidAt=Date.now()}});log('payment.void',`${d.rec} — ${r}`);save();render();toast(L('Nofoanana','Reçu annulé'))}),
 remindLate:()=>{const m=ui.lateM;const l=active().filter(s=>s.phone&&(!ui.lateC||s.classId===ui.lateC)&&(m==='all'?dueAmount(s)>0:isDue(mstat(s,+m))));confirmBox(`${L('Handefa SMS fampahatsiahivana amin\'ny ray aman-dreny','Envoyer une relance SMS à')} <b>${l.length}</b> ${L('','parents')} ?`,()=>{queueSMS(l.map(s=>({to:s.phone,name:s.parent,studentId:s.id,kind:'relance',text:`${S.school.name}: Rappel - solde ${m==='all'?'':'('+MONTHS_FR[+m]+') '}de ${num(m==='all'?dueAmount(s):fee(s)-paid(s.id,+m))} Ar pour ${s.first} ${s.last} (${cls(s.classId)?.name}). Merci de régulariser. Tél: ${S.school.phone||''}`})));log('sms.relance',`${l.length}`)},L('Alefa','Envoyer'),false)},
 printLate:()=>{const l=active().filter(s=>(!ui.lateC||s.classId===ui.lateC)&&dueAmount(s)>0).sort((a,b)=>(cls(a.classId)?.ord??0)-(cls(b.classId)?.ord??0)||fullName(a).localeCompare(fullName(b)));printHTML(`<div class="pg">${printHead('LISTE DES IMPAYÉS',dateFR(today())+(ui.lateC?' · '+esc(cls(ui.lateC)?.name):''))}<table class="pt"><thead><tr><th>Élève</th><th>Classe</th><th>Parent</th><th>Téléphone</th><th>Mois impayés</th><th>Écolage</th><th>Autres</th><th>Total</th></tr></thead><tbody>${l.map(s=>`<tr><td>${esc(fullName(s))}</td><td>${esc(cls(s.classId)?.name||'')}</td><td>${esc(s.parent||'')}</td><td>${esc(s.phone||'')}</td><td>${lateMonths(s)}</td><td style="text-align:right">${num(dueEcolage(s))}</td><td style="text-align:right">${num(dueItems(s))}</td><td style="text-align:right"><b>${num(dueAmount(s))}</b></td></tr>`).join('')}</tbody><tfoot><tr><td colspan="7"><b>TOTAL</b></td><td style="text-align:right"><b>${num(sum(l.map(dueAmount)))} Ar</b></td></tr></tfoot></table></div>`,'Impayés')},
 xlsLate:()=>{const rows=[['Élève','Matricule','Classe','Parent','Téléphone','Mois impayés','Écolage dû','Autres frais dus','Total dû']];active().filter(s=>dueAmount(s)>0).forEach(s=>rows.push([fullName(s),s.matricule,cls(s.classId)?.name||'',s.parent||'',s.phone||'',lateMonths(s),dueEcolage(s),dueItems(s),dueAmount(s)]));exportXLSX('impayes_'+today(),[{name:'Impayés',rows}])},
 xlsPays:()=>{const rows=[['Reçu','Date','Élève','Matricule','Classe','Nature','Mois','Montant','Mode','Référence','Caissier','Annulé','Motif annulation']];S.payments.forEach(p=>{const s=stu(p.studentId);rows.push([p.rec,p.date,fullName(s),s?.matricule||'',cls(s?.classId)?.name||'',kindL(p.kind),p.month!=null?MONTHS_FR[p.month]:'',p.amount,modeL(p.mode),p.ref||'',p.by||'',p.void?'oui':'',p.voidReason||''])});exportXLSX('paiements_'+SCHOOL,[{name:'Paiements',rows}])},
 closeCash:()=>{const d=ui.jDate;const cash=sum(receipts().filter(r=>r.date===d&&!r.void&&r.mode==='Vola an-tanana').map(r=>r.amount));openModal(L('Hikatona ny vola','Clôture de caisse')+' — '+fmtDate(d),`<form data-form="closure" id="fm"><p>${L('Vola an-tanana tokony ho ao','Espèces attendues')}: <b>${fmt(cash)}</b></p>${fld(L('Vola an-tanana nisaina (Ar)','Espèces comptées (Ar)'),'counted',cash,'number','min="0" required')}<div style="height:12px"></div>${fld(L('Fanamarihana','Observation'),'note','')}</form>`,cancelBtn()+saveBtn(),'sm')},
 printJournal:()=>printHTML(journalPrint(ui.jDate),'Journal '+ui.jDate),
 jGo:d=>{ui.jDate=d.d;ui.payTab='journal';render()},
 printMonth:()=>{const m=ui.repM;const ps=livePays().filter(p=>monthOfDate(p.date)===m);const byKind={},byMode={};ps.forEach(p=>{byKind[p.kind||'ecolage']=(byKind[p.kind||'ecolage']||0)+p.amount;byMode[p.mode]=(byMode[p.mode]||0)+p.amount});printHTML(`<div class="pg">${printHead('RAPPORT MENSUEL DES RECETTES',MONTHS_FR[m]+' — '+esc(S.school.year))}<table class="pt"><thead><tr><th>Nature</th><th>Montant (Ar)</th></tr></thead><tbody>${Object.entries(byKind).map(([k,v])=>`<tr><td>${esc({ecolage:'Écolage',inscription:"Droit d'inscription",assurance:'Assurance',tenue:'Tenue',examen:"Frais d'examen"}[k]||k)}</td><td style="text-align:right">${num(v)}</td></tr>`).join('')}</tbody><tfoot><tr><td><b>TOTAL</b></td><td style="text-align:right"><b>${num(sum(ps.map(p=>p.amount)))}</b></td></tr></tfoot></table><h4>Par mode de paiement</h4><table class="pt"><tbody>${Object.entries(byMode).map(([k,v])=>`<tr><td>${esc(modeL(k))}</td><td style="text-align:right">${num(v)}</td></tr>`).join('')}</tbody></table><h4>Écolage du mois</h4><table class="pt"><tbody><tr><td>Attendu</td><td style="text-align:right">${num(expectedMonth())}</td></tr><tr><td>Encaissé</td><td style="text-align:right">${num(sumMonth(m))}</td></tr><tr><td>Taux de recouvrement</td><td style="text-align:right">${expectedMonth()?Math.round(sumMonth(m)/expectedMonth()*100):0} %</td></tr></tbody></table><div class="psign"><div>L'Économe</div><div>Le Directeur</div></div></div>`,'Rapport mensuel')},
 xlsMonth:()=>{const m=ui.repM;const rows=[['Date','Reçu','Élève','Classe','Nature','Mois','Montant','Mode']];livePays().filter(p=>monthOfDate(p.date)===m).forEach(p=>{const s=stu(p.studentId);rows.push([p.date,p.rec,fullName(s),cls(s?.classId)?.name||'',kindL(p.kind),p.month!=null?MONTHS_FR[p.month]:'',p.amount,modeL(p.mode)])});exportXLSX('recettes_'+MONTHS_FR[m],[{name:MONTHS_FR[m],rows}])},
});
Object.assign(C,{
 pstu:el=>{ui.paySid=el.value;const s=stu(el.value);ui.payMonths=[];ui.payItems=[];if(s){for(let m=0;m<10;m++)if(isDue(mstat(s,m))){ui.payMonths=[m];break}}refreshPay()},
 pmon:()=>{ui.payMonths=$$('[data-ch="pmon"]:checked').map(x=>+x.value);updTotal()},
 pitem:()=>{ui.payItems=$$('[data-ch="pitem"]:checked').map(x=>x.value);updTotal()},
 lateM:el=>{ui.lateM=el.value;render()},lateC:el=>{ui.lateC=el.value;render()},gridC:el=>{ui.gridC=el.value;render()},
 jDate:el=>{if(el.value){ui.jDate=el.value;render()}},repM:el=>{ui.repM=+el.value;render()},
});
function updTotal(){const a=$('#pamt');if(a)a.value=selRemain()||'';const t=$('#ptot');if(t)t.textContent=fmt(selRemain())}
function refreshPay(){const p=$('#pmonths');if(p)p.innerHTML=monthsPick(ui.paySid);const it=$('#pitems');if(it)it.innerHTML=itemsPick(ui.paySid);const i=$('#pinfo');if(i)i.innerHTML=payInfo();updTotal()}
Object.assign(F,{
 pay:d=>{
  const s=stu(d.sid);if(!s){toast(L('Safidio ny mpianatra','Choisissez un élève'),1);return}
  if(S.closures.some(x=>x.id===d.date)&&!isBoss()){toast(L('Efa nakatona ny vola tamin\'io daty io','Caisse déjà clôturée à cette date'),1);return}
  const months=[...ui.payMonths].sort((a,b)=>a-b),items=[...ui.payItems];
  if(!months.length&&!items.length){toast(L('Safidio volana na saran-javatra','Choisissez un mois ou un frais'),1);return}
  let left=Math.min(+d.amount||0,selRemain());if(left<=0){toast(L('Ampidiro ny vola','Saisissez le montant'),1);return}
  const rec='R'+String((S.seq=(S.seq||0)+1)).padStart(5,'0'),base={rec,studentId:s.id,date:d.date||today(),mode:d.mode,ref:d.ref||'',by:user.name,at:Date.now()};
  for(const k of items){if(left<=0)break;const x=Math.min(Math.max(0,itemFee(s,k)-paidItem(s.id,k)),left);if(x>0){S.payments.push({id:uid(),...base,kind:k,amount:x});left-=x}}
  for(const m of months){if(left<=0)break;const x=Math.min(Math.max(0,fee(s)-paid(s.id,m)),left);if(x>0){S.payments.push({id:uid(),...base,kind:'ecolage',month:m,amount:x});left-=x}}
  log('payment.create',`${rec} ${fullName(s)} ${fmt(sum(S.payments.filter(p=>p.rec===rec).map(p=>p.amount)))} ${d.mode}`);
  if(d.sms&&s.phone)queueSMS([{to:s.phone,name:s.parent,studentId:s.id,kind:'recu',text:receiptSMS(rec)}],true);
  save();ui.payMonths=[];ui.payItems=[];const nx=(()=>{for(let m=0;m<10;m++)if(isDue(mstat(s,m)))return m;return-1})();if(nx>=0&&nx<=curMonthIdx())ui.payMonths=[nx];
  render();showReceipt(rec);toast(L('Voaray ny vola','Paiement enregistré'))},
 closure:d=>{const dd=ui.jDate;const cash=sum(receipts().filter(r=>r.date===dd&&!r.void&&r.mode==='Vola an-tanana').map(r=>r.amount));const live=receipts().filter(r=>r.date===dd&&!r.void);const byMode={};live.forEach(r=>byMode[r.mode]=(byMode[r.mode]||0)+r.amount);
  S.closures.push({id:dd,date:dd,total:sum(live.map(r=>r.amount)),byMode,cash,counted:+d.counted||0,gap:(+d.counted||0)-cash,note:d.note||'',by:user.name,at:Date.now()});log('cash.close',`${dd} ${fmt(cash)} / ${fmt(+d.counted)}`);save();closeModal();render();toast(L('Voakatona ny vola','Caisse clôturée'))},
});
