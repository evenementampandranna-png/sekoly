/* Sekoly — v-comm.js : M6 communication (annonces, calendrier, SMS, messagerie, convocations) */
'use strict';
ui.smsF='pending';
function queueSMS(list,silent){
 const ok=list.filter(x=>phoneNorm(x.to).length>=9);
 ok.forEach(x=>S.sms.push({id:x.id||uid(),to:phoneNorm(x.to),name:x.name||'',studentId:x.studentId||'',kind:x.kind||'manual',text:String(x.text).slice(0,612),status:'pending',created:Date.now(),by:user.name}));
 if(!silent){save();render();toast(`${ok.length} SMS ${L('ao anaty lisitra handefasana','en file d\'envoi')}`)}
 return ok.length;
}
V.serasera=()=>{
 const un=unreadCount(),pend=S.sms.filter(x=>x.status==='pending').length;
 const tabs=[['filazana',L('Filazana','Annonces'),'bell'],['tetiandro',L('Tetiandro','Calendrier'),'cal'],['hafatra',L('Hafatra','Messagerie'),'inbox',un],CAN.sms()&&['sms','SMS','send',pend]];
 const head=`<div class="toolbar">${tabsBar(ui.comTab,tabs,'comTab')}</div>`;
 return head+({tetiandro:calendarTab,hafatra:messagesTab,sms:smsTab}[ui.comTab]||annTab)();
};
function annTab(){
 const list=[...S.announcements].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 return`<div class="toolbar"><div style="flex:1"></div>${CAN.announce()?`<button class="btn pri" data-act="newAnn">${ic('plus',16)} ${L('Filazana vaovao','Nouvelle annonce')}</button>`:''}</div>
 <div class="ann-grid">${list.length?list.map(a=>{const ty=ANN_TYPES().find(x=>x[0]===a.type)||ANN_TYPES()[0];return`<div class="card ann" style="--c:${ty[2]}"><div class="spread"><span class="badge nd" style="background:${ty[2]}1f;color:${ty[2]}">${ty[1]}</span><span class="muted xs">${fmtDate(a.date)}</span></div><h4>${esc(a.title)}</h4><p>${esc(a.body||'').replace(/\n/g,'<br>')}</p><div class="spread muted xs"><span>${a.eventDate?ic('cal',13)+' '+fmtDate(a.eventDate):''} · ${a.audience==='all'?L('Rehetra','Tous'):a.audience==='staff'?L('Mpiasa','Personnel'):a.audience==='parents'?L('Ray aman-dreny','Parents'):esc(cls(a.audience)?.name||'')}</span><span>${esc(a.by||'')}</span></div>${CAN.announce()?`<div class="acts" style="margin-top:8px"><button class="btn ghost sm" data-act="annSms" data-id="${a.id}">${ic('send',14)} SMS</button><button class="icon-btn" data-act="editAnn" data-id="${a.id}">${ic('edit',15)}</button><button class="icon-btn del" data-act="delAnn" data-id="${a.id}">${ic('trash',15)}</button></div>`:''}</div>`}).join(''):emptyBox('bell',L('Tsy misy filazana','Aucune annonce'))}</div>`;
}
function calendarTab(){
 const now=new Date();if(!ui.calM)ui.calM=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
 const[y,m]=ui.calM.split('-').map(Number);const first=new Date(y,m-1,1),days=new Date(y,m,0).getDate(),off=(first.getDay()+6)%7;
 const evs=S.announcements.filter(a=>(a.eventDate||'').startsWith(ui.calM));
 const cells=[];for(let i=0;i<off;i++)cells.push('<div class="cal-c out"></div>');
 for(let d=1;d<=days;d++){const ds=`${ui.calM}-${String(d).padStart(2,'0')}`,e=evs.filter(a=>a.eventDate===ds),hol=(S.school.holidays||[]).find(h=>ds>=h.start&&ds<=h.end),per=TERMS().find(([t])=>periodOf(t).start===ds||periodOf(t).end===ds);
  cells.push(`<div class="cal-c ${ds===today()?'today':''} ${hol?'hol':''}"><b>${d}</b>${hol?`<span class="ev" style="--c:#22c55e">${esc(hol.label)}</span>`:''}${per?`<span class="ev" style="--c:#64748b">${periodOf(per[0]).start===ds?'▶':'■'} ${per[1]}</span>`:''}${e.map(a=>{const ty=ANN_TYPES().find(x=>x[0]===a.type)||ANN_TYPES()[0];return`<span class="ev" style="--c:${ty[2]}" title="${esc(a.body||'')}">${esc(a.title)}</span>`}).join('')}</div>`)}
 const lbl=(LANG==='fr'?CALM_FR:CALM_MG)[m-1]+' '+y;
 return`<div class="card"><div class="card-h"><div class="toolbar"><button class="icon-btn" data-act="calNav" data-k="-1">‹</button><h3 style="min-width:170px;text-align:center;text-transform:capitalize">${lbl}</h3><button class="icon-btn" data-act="calNav" data-k="1">›</button></div><div class="legend">${ANN_TYPES().map(t=>`<span><i style="background:${t[2]}"></i>${t[1]}</span>`).join('')}</div></div>
 <div class="cal"><div class="cal-h">${[1,2,3,4,5,6,0].map(d=>`<div>${DAY(d).slice(0,3)}</div>`).join('')}</div><div class="cal-g">${cells.join('')}</div></div></div>`;
}
function smsTab(){
 const list=S.sms.filter(x=>ui.smsF==='all'||x.status===ui.smsF).sort((a,b)=>(b.created||0)-(a.created||0));
 const levels=LEVELS.filter(l=>S.classes.some(c=>c.level===l));
 const targets=[['all',L('Ray aman-dreny rehetra','Tous les parents')],['level',L('Niveau iray','Un niveau')],['class',L('Kilasy iray','Une classe')],['late',L('Ray aman-drenin\'ireo tsy mbola nandoa','Parents d\'impayés')],['staff',L('Mpiasa rehetra','Tout le personnel')]];
 const n=smsRecipients().length;
 return`<div class="row c2r"><div class="card"><div class="card-h"><div><h3>${L('SMS ho an\'ny maro','SMS groupé')}</h3><small>${L('Mandeha amin\'ny passerelle SMS (Cloud Function) na alefa tanana','Via la passerelle SMS (Cloud Function) ou envoi manuel')}</small></div></div>
 <form data-form="smsGroup" class="stack">
  <label class="fld"><span>${L('Handefasana','Destinataires')}</span><select name="target" data-ch="smsTarget">${targets.map(([k,l])=>`<option value="${k}" ${ui.smsTarget===k?'selected':''}>${l}</option>`).join('')}</select></label>
  ${ui.smsTarget==='level'?`<label class="fld"><span>Niveau</span><select data-ch="smsLevel">${levels.map(l=>`<option value="${l}" ${ui.smsLevel===l?'selected':''}>${levelL(l)}</option>`).join('')}</select></label>`:''}
  ${ui.smsTarget==='class'?`<label class="fld"><span>${L('Kilasy','Classe')}</span><select data-ch="smsClass">${clsOpts(ui.smsClass)}</select></label>`:''}
  <label class="fld"><span>${L('Hafatra','Message')} <small class="muted" id="smscount"></small></span><textarea name="text" rows="5" maxlength="612" required data-in="smsCount" placeholder="${esc(S.school.name)}: ..."></textarea></label>
  <div class="sumbox"><span class="muted">${L('Mpandray','Destinataires')}</span><b>${n}</b></div>
  <button class="btn pri block">${ic('send',16)} ${L('Alefaso','Envoyer')}</button>
 </form></div>
 <div class="card np"><div class="card-h pad"><div><h3>${L('Boaty fandefasana','Boîte d\'envoi')}</h3><small>${S.sms.filter(x=>x.status==='pending').length} ${L('miandry','en attente')} · ${S.sms.filter(x=>x.status==='sent').length} ${L('lasa','envoyés')}</small></div>
 <div class="toolbar"><select class="inp" data-ch="smsF">${[['pending',L('Miandry','En attente')],['sent',L('Lasa','Envoyés')],['manual',L('Nalefa tanana','Envoi manuel')],['failed',L('Tsy lasa','Échecs')],['all',L('Rehetra','Tous')]].map(([k,l])=>`<option value="${k}" ${ui.smsF===k?'selected':''}>${l}</option>`).join('')}</select>${list.some(x=>x.status==='pending')?`<button class="btn ghost sm" data-act="smsCopyAll">${ic('copy',14)} ${L('Adikao','Copier')}</button>`:''}</div></div>
 <div class="hint mx">${L('Raha mbola tsy voapetraka ny passerelle SMS (jereo README), tsindrio ny ✉ mba handefasana azy amin\'ny findainao.','Tant que la passerelle SMS n\'est pas configurée (voir README), utilisez ✉ pour envoyer depuis votre téléphone.')}</div>
 <div class="tw"><table class="t"><tbody>${list.length?list.slice(0,200).map(x=>`<tr><td><b>${esc(x.name||x.to)}</b><div class="muted xs">${esc(x.to)} · ${esc(x.kind)} · ${fmtTime(x.created)}</div><div class="small sms-txt">${esc(x.text)}</div>${x.error?`<div class="red xs">${esc(x.error)}</div>`:''}</td><td><span class="badge ${x.status==='sent'?'b-green':x.status==='failed'?'b-red':x.status==='manual'?'b-blue':'b-amber'}">${{pending:L('Miandry','En attente'),sent:L('Lasa','Envoyé'),failed:L('Tsy lasa','Échec'),manual:L('Tanana','Manuel')}[x.status]||x.status}</span></td><td><div class="acts">${x.status!=='sent'?`<a class="icon-btn" href="sms:${esc(phoneIntl(x.to))}?body=${encodeURIComponent(x.text)}" data-act="smsManual" data-id="${x.id}" data-prevent title="SMS">✉</a>`:''}<button class="icon-btn del" data-act="smsDel" data-id="${x.id}">${ic('trash',14)}</button></div></td></tr>`).join(''):`<tr><td>${emptyBox('send',L('Tsy misy','Vide'))}</td></tr>`}</tbody></table></div></div></div>`;
}
function smsRecipients(){
 if(ui.smsTarget==='staff')return S.teachers.filter(t=>t.phone).map(t=>({to:t.phone,name:t.name}));
 let ss=active();
 if(ui.smsTarget==='level')ss=ss.filter(s=>cls(s.classId)?.level===(ui.smsLevel||LEVELS[0]));
 if(ui.smsTarget==='class')ss=ss.filter(s=>s.classId===(ui.smsClass||S.classes[0]?.id));
 if(ui.smsTarget==='late')ss=ss.filter(s=>dueAmount(s)>0);
 const seen=new Set(),out=[];ss.forEach(s=>{const p=phoneNorm(s.phone);if(p&&!seen.has(p)){seen.add(p);out.push({to:p,name:s.parent,studentId:s.id})}});return out;
}
/* ---------- messagerie ---------- */
function messagesTab(){
 const me=user.uid,all=S.messages||[];
 const box=ui.msgBox,list=all.filter(m=>box==='sent'?m.from===me:m.from!==me).sort((a,b)=>(b.at||0)-(a.at||0));
 return`<div class="toolbar">${tabsBar(box,[['inbox',L('Voaray','Reçus'),'inbox',unreadCount()],['sent',L('Nalefa','Envoyés'),'send']],'msgBox')}<div style="flex:1"></div><button class="btn ghost" data-act="newMsg" data-type="convocation">${ic('flag',16)} ${L('Fiantsoana ray aman-dreny','Convocation')}</button><button class="btn pri" data-act="newMsg">${ic('plus',16)} ${L('Hafatra vaovao','Nouveau message')}</button></div>${msgList(list,box)}`;
}
function msgList(list,box){
 return`<div class="card np"><div class="list msgs">${list.length?list.map(m=>{const unread=box!=='sent'&&!m.readBy?.[user.uid];const rcpt=(m.uids||[]).filter(u=>u!==m.from);const read=rcpt.filter(u=>m.readBy?.[u]).length;
  return`<div class="li click msg ${unread?'unread':''}" data-act="openMsg" data-id="${m.id}">${avs(box==='sent'?m.toLabel||'':m.fromName,box==='sent'?m.toLabel:m.from)}<div class="who"><div><b>${m.type==='convocation'?'📌 ':''}${esc(m.subject||'—')}</b><small>${box==='sent'?L('Ho an\'i','À')+' '+esc(m.toLabel||''):esc(m.fromName||'')} · ${esc(String(m.body||'').slice(0,80))}</small></div></div><div class="r"><small>${fmtTime(m.at)}</small>${box==='sent'?`<small>${read}/${rcpt.length} ${L('namaky','lu')}</small>`:''}</div></div>`}).join(''):emptyBox('inbox',L('Tsy misy hafatra','Aucun message'))}</div></div>`;
}
function recipientsOptions(){
 const mem=Object.entries(S.members||{}).filter(([u])=>u!==user.uid);
 if(isPortal()){
  const kids=(user.students||[]),pts=(S.portal||[]).filter(p=>kids.includes(p.id));
  return mem.filter(([u,m])=>['Admin','Directeur','Secretariat','Surveillant','Kasie','Mpampianatra'].includes(m.role)).map(([u,m])=>[u,`${m.name} — ${roleL(m.role)}`]);
 }
 const staff=mem.filter(([u,m])=>STAFF_ROLES.includes(m.role)).map(([u,m])=>[u,`${m.name} — ${roleL(m.role)}`]);
 const parents=mem.filter(([u,m])=>['Parent','Eleve'].includes(m.role)).map(([u,m])=>[u,`${m.name} — ${roleL(m.role)} (${(m.students||[]).map(id=>stu(id)?.first).filter(Boolean).join(', ')})`]);
 return[...staff,...parents];
}
function msgForm(type,replyTo){
 const isConv=type==='convocation';const opts=recipientsOptions();const rp=replyTo?(S.messages||[]).find(m=>m.id===replyTo):null;
 const groups=isPortal()?'':`<label class="fld"><span>${L('Na vondrona','Ou un groupe')}</span><select name="group"><option value="">—</option><option value="staff">${L('Mpiasa rehetra','Tout le personnel')}</option><option value="teachers">${L('Mpampianatra rehetra','Tous les enseignants')}</option>${S.classes.map(c=>`<option value="c:${c.id}">${L('Ray aman-dreny','Parents')} ${esc(c.name)}</option>`).join('')}</select></label>`;
 openModal(isConv?L('Fiantsoana ray aman-dreny','Convocation des parents'):L('Hafatra vaovao','Nouveau message'),`<form data-form="msg" id="fm"><input type="hidden" name="type" value="${type||'msg'}">
 ${isConv?`<label class="fld"><span>${L('Mpianatra','Élève')}</span><select name="studentId" required data-ch="convStu">${stuOptions('',s=>(s.parentUids||[]).length>0)}</select></label><p class="muted xs">${L('Ireo mpianatra manana kaonty ray aman-dreny ihany no miseho.','Seuls les élèves dont le parent a un compte apparaissent (sinon utilisez le SMS).')}</p>`:`<label class="fld"><span>${L('Ho an\'i','Destinataire(s)')}</span><select name="to[]" multiple size="6" ${groups?'':'required'}>${opts.map(([u,l])=>`<option value="${u}" ${rp&&rp.from===u?'selected':''}>${esc(l)}</option>`).join('')}</select></label>${groups}`}
 <div style="height:10px"></div>${fld(L('Lohateny','Objet'),'subject',rp?'Re: '+(rp.subject||''):isConv?'Convocation':'','text','required')}
 ${isConv?`<div class="grid2" style="margin-top:10px">${fld(L('Daty','Date'),'cdate',today(),'date','required')}${fld(L('Ora','Heure'),'ctime','08:00','time','required')}</div>`:''}
 <div style="height:10px"></div>${area(L('Hafatra','Message'),'body','','required rows="6"')}
 ${isConv?`<label class="check" style="margin-top:10px"><input type="checkbox" name="sms" checked> <span>${L('Alefaso SMS koa','Envoyer aussi par SMS')}</span></label>`:''}
 </form>`,cancelBtn()+`<button class="btn pri" type="submit" form="fm">${ic('send',16)} ${L('Alefaso','Envoyer')}</button>`);
}
function openMsg(id){const m=(S.messages||[]).find(x=>x.id===id);if(!m)return;markRead(m);
 const rcpt=(m.uids||[]).filter(u=>u!==m.from);
 openModal(esc(m.subject||'—'),`<div class="msg-meta">${avs(m.fromName,m.from)}<div><b>${esc(m.fromName)}</b><small>${fmtTime(m.at)} · ${L('Ho an\'i','À')} ${esc(m.toLabel||'')}</small></div></div>${m.type==='convocation'?`<div class="alert-box warn">${ic('flag',18)}<div><b>${L('Fiantsoana','Convocation')}</b> — ${fmtDate(m.cdate)} ${esc(m.ctime||'')}${m.studentName?' · '+esc(m.studentName):''}</div></div>`:''}<div class="msg-body">${esc(m.body||'').replace(/\n/g,'<br>')}</div>
 ${m.from===user.uid?`<div class="sec-t">${ic('eye',15)} ${L('Fanamarinana famakiana','Accusés de lecture')}</div><div class="list">${rcpt.map(u=>`<div class="spread li"><span>${esc(S.members?.[u]?.name||u)}</span>${m.readBy?.[u]?`<span class="badge b-green">${L('Namaky','Lu')} ${fmtTime(m.readBy[u])}</span>`:`<span class="badge b-gray nd">${L('Mbola tsy namaky','Non lu')}</span>`}</div>`).join('')}</div>`:''}`,`${m.from!==user.uid?`<button class="btn ghost" data-act="replyMsg" data-id="${m.id}">${ic('send',15)} ${L('Hamaly','Répondre')}</button>`:''}${doneBtn()}`)}

Object.assign(A,{
 comTab:d=>{ui.comTab=d.k;render()},msgBox:d=>{ui.msgBox=d.k;render()},
 newAnn:()=>annForm(),editAnn:d=>annForm(S.announcements.find(a=>a.id===d.id)),
 delAnn:d=>confirmBox(L('Hamafa ity filazana ity?','Supprimer cette annonce ?'),()=>{S.announcements=S.announcements.filter(a=>a.id!==d.id);save();render()},L('Fafana','Supprimer')),
 annSms:d=>{const a=S.announcements.find(x=>x.id===d.id);ui.comTab='sms';ui.smsTarget=a.audience==='staff'?'staff':a.audience&&a.audience.startsWith('c')&&cls(a.audience)?'class':'all';if(ui.smsTarget==='class')ui.smsClass=a.audience;render();setTimeout(()=>{const t=$('textarea[name=text]');if(t){t.value=`${S.school.name}: ${a.title}${a.eventDate?' ('+fmtDate(a.eventDate)+')':''}. ${a.body||''}`.slice(0,612);I.smsCount(t)}},50)},
 calNav:d=>{const[y,m]=ui.calM.split('-').map(Number);const n=new Date(y,m-1+(+d.k),1);ui.calM=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`;render()},
 smsManual:(d,el)=>{const x=S.sms.find(y=>y.id===d.id);location.href=el.getAttribute('href');if(x){x.status='manual';x.sentAt=Date.now();save();setTimeout(render,300)}},
 smsDel:d=>{S.sms=S.sms.filter(x=>x.id!==d.id);save();render()},
 smsCopyAll:()=>copyText(S.sms.filter(x=>x.status==='pending').map(x=>`${x.to}\t${x.text}`).join('\n')),
 newMsg:d=>msgForm(d.type),replyMsg:d=>msgForm('msg',d.id),openMsg:d=>openMsg(d.id),
});
function annForm(a){a=a||{type:'info',audience:'all',eventDate:''};openModal(a.id?L('Hanova filazana','Modifier l\'annonce'):L('Filazana vaovao','Nouvelle annonce'),`<form data-form="ann" id="fm"><input type="hidden" name="id" value="${a.id||''}"><div class="grid2"><div class="full">${fld(L('Lohateny','Titre'),'title',a.title,'text','required')}</div>${sel(L('Karazany','Type'),'type',ANN_TYPES().map(x=>[x[0],x[1]]),a.type)}${fld(L('Daty hetsika','Date de l\'événement'),'eventDate',a.eventDate,'date')}<div class="full">${sel(L('Ho an\'i','Public'),'audience',[['all',L('Rehetra','Tous')],['staff',L('Mpiasa','Personnel')],['parents',L('Ray aman-dreny','Parents')],...S.classes.map(c=>[c.id,c.name])],a.audience)}</div><div class="full">${area(L('Votoatiny','Contenu'),'body',a.body)}</div></div></form>`,cancelBtn()+saveBtn())}
Object.assign(C,{smsTarget:el=>{ui.smsTarget=el.value;render()},smsLevel:el=>{ui.smsLevel=el.value;render()},smsClass:el=>{ui.smsClass=el.value;render()},smsF:el=>{ui.smsF=el.value;render()}});
I.smsCount=el=>{const n=el.value.length,c=$('#smscount');if(c)c.textContent=`${n} ${L('litera','car.')} · ${Math.max(1,Math.ceil(n/160))} SMS`};
Object.assign(F,{
 ann:d=>{const o={title:d.title.trim(),type:d.type,eventDate:d.eventDate,audience:d.audience,body:d.body};if(d.id)Object.assign(S.announcements.find(a=>a.id===d.id),o);else S.announcements.push({id:uid(),date:today(),at:Date.now(),by:user.name,...o});log('announce',o.title);save();closeModal();render()},
 smsGroup:d=>{const r=smsRecipients();if(!r.length){toast(L('Tsy misy mpandray','Aucun destinataire'),1);return}confirmBox(`${L('Handefa SMS','Envoyer')} <b>${r.length*Math.max(1,Math.ceil(d.text.length/160))}</b> SMS ?`,()=>{queueSMS(r.map(x=>({...x,kind:'groupe',text:d.text})));log('sms.group',`${ui.smsTarget} ${r.length}`)},L('Alefaso','Envoyer'),false)},
 msg:async d=>{
  let uids=[...(d.to||[])],label='';
  if(d.type==='convocation'){const s=stu(d.studentId);uids=[...(s.parentUids||[])];label=L('Ray aman-dreninan\'i ','Parents de ')+fullName(s);
   if(d.sms&&s.phone)queueSMS([{to:s.phone,name:s.parent,studentId:s.id,kind:'convocation',text:`${S.school.name}: Convocation - les parents de ${s.first} ${s.last} sont priés de se présenter le ${fmtDate(d.cdate)} à ${d.ctime}. Objet: ${d.subject}.`}],true)}
  if(d.group==='staff')uids.push(...Object.entries(S.members).filter(([u,m])=>STAFF_ROLES.includes(m.role)).map(([u])=>u));
  if(d.group==='teachers')uids.push(...Object.entries(S.members).filter(([u,m])=>m.role==='Mpampianatra').map(([u])=>u));
  if(d.group&&d.group.startsWith('c:')){const cid=d.group.slice(2);S.students.filter(s=>s.classId===cid).forEach(s=>uids.push(...(s.parentUids||[])))}
  uids=[...new Set(uids)].filter(u=>u!==user.uid);if(!uids.length){toast(L('Tsy misy mpandray','Aucun destinataire'),1);return}
  if(!label)label=d.group?({staff:L('Mpiasa','Personnel'),teachers:L('Mpampianatra','Enseignants')}[d.group]||L('Ray aman-dreny','Parents')+' '+(cls(d.group.slice(2))?.name||'')):uids.map(u=>S.members?.[u]?.name).filter(Boolean).slice(0,3).join(', ')+(uids.length>3?'…':'');
  try{await sendMessage({uids:[user.uid,...uids],toLabel:label,subject:d.subject,body:d.body,type:d.type||'msg',cdate:d.cdate||'',ctime:d.ctime||'',studentId:d.studentId||'',studentName:d.studentId?fullName(stu(d.studentId)):''});if(isStaff()&&d.type==='convocation')save();closeModal();toast(L('Lasa ny hafatra','Message envoyé'));log('message.send',`${d.type||'msg'}: ${d.subject} → ${label}`)}catch(e){toast(fbMsg(e),1)}},
});
