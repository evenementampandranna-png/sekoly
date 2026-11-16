/* Sekoly — state.js : data model, seed, domain rules, roles */
'use strict';
let S=null,user=null,SCHOOL=null;

/* ---------- constants ---------- */
const LEVELS=['Primaire','Collège','Lycée'];
const levelL=l=>LANG==='fr'?l:({Primaire:'Ambaratonga voalohany',Collège:'Kolejy',Lycée:'Lisea'}[l]||l);
const FEE_ITEMS=()=>[['inscription',L('Saram-pidirana',"Droit d'inscription")],['assurance',L('Fiantohana','Assurance')],['tenue',L('Fanamiana','Tenue')],['examen',L('Saran-panadinana',"Frais d'examen")]];
const kindL=k=>!k||k==='ecolage'?L('Saram-pianarana','Écolage'):(FEE_ITEMS().find(x=>x[0]===k)||[0,L('Hafa','Autre')])[1];
const REDUC=()=>[['',L('Tsy misy','Aucune')],['fratrie',L('Mpiray tampo','Fratrie')],['personnel',L('Zanaky ny mpiasa','Enfant du personnel')],['bourse',L('Vatsim-pianarana','Bourse')]];
const STATUSES=()=>[['Mianatra',L('Mianatra','Inscrit')],['Nifindra',L('Nifindra sekoly','Transféré (sortant)')],['Nijanona',L('Nijanona','Abandon')],['Voaroaka',L('Voaroaka','Exclu')],['Vita',L('Vita fianarana','Sorti (fin de cycle)')]];
const statusL=s=>(STATUSES().find(x=>x[0]===s)||[0,s])[1];
const ENTRIES=()=>[['Vaovao',L('Mpianatra vaovao','Nouvel élève')],['Nifindra',L('Nifindra avy any amin\'ny sekoly hafa','Transfert entrant')],['Taloha',L('Efa mpianatra teto','Ancien élève')]];
const POSTES=()=>[['Mpampianatra',L('Mpampianatra','Enseignant')],['Tale',L('Tale','Directeur')],['Sekretera',L('Sekretera','Secrétaire')],['Mpanara-maso',L('Mpanara-maso','Surveillant')],['Mpitahiry vola',L('Mpitahiry vola','Économe / Caissier')],['Mpiasa hafa',L('Mpiasa hafa','Autre personnel')]];
const CONTRACTS=['CDI','CDD','Vacataire','Stagiaire'];
const EVAL_TYPES=()=>[['Devoir',L('Asa an-trano','Devoir')],['Interro',L('Fanontaniana fohy','Interrogation')],['Compo',L('Fanadinana','Composition / Examen')]];
const SANCTIONS=()=>[['Avertissement',L('Fampitandremana','Avertissement')],['Blâme',L('Fanakianana','Blâme')],['Retenue',L('Fitazonana','Retenue')],['Exclusion temporaire',L('Fandroahana vonjimaika','Exclusion temporaire')]];
const ANN_TYPES=()=>[['info',L('Filazana','Information'),'#0878db'],['reunion',L('Fivoriana','Réunion'),'#8b5cf6'],['examen',L('Fanadinana','Examen'),'#e23d4c'],['fety',L('Fety','Fête'),'#f2a531'],['vakansy',L('Fialan-tsasatra','Vacances'),'#14a85b']];
const EXAMS=['','CEPE','BEPC','BAC'];
const DECISIONS=()=>[['',L('— Tsy mbola —','— À décider —')],['Passage',L('Miakatra kilasy','Passage')],['Redoublement',L('Mamerina kilasy','Redoublement')],['Exclusion',L('Voaroaka','Exclusion')]];
const decisionL=d=>(DECISIONS().find(x=>x[0]===d)||[0,d||'—'])[1];
const ATT={P:()=>L('Tonga','Présent'),R:()=>L('Tara','Retard'),A:()=>L('Tsy tonga','Absent'),J:()=>L('Tsy tonga (misy antony)','Absent justifié')};

/* ---------- roles ---------- */
const ROLES={Admin:['Mpitantana rafitra','Administrateur système'],Directeur:['Tale','Directeur / Proviseur'],Secretariat:['Sekretera','Secrétariat'],Surveillant:['Mpanara-maso','Surveillant général'],Kasie:['Mpitahiry vola','Économe / Caissier'],Mpampianatra:['Mpampianatra','Enseignant'],Parent:['Ray aman-dreny','Parent'],Eleve:['Mpianatra','Élève']};
const roleL=r=>ROLES[r]?L(ROLES[r][0],ROLES[r][1]):r;
const STAFF_ROLES=['Admin','Directeur','Secretariat','Surveillant','Kasie','Mpampianatra'];
const ROLE_NAV={
 Admin:null,Directeur:null,
 Secretariat:['tabilao','mpianatra','kilasy','fandaharana','mpiasa','serasera','tatitra','fikirakirana'],
 Surveillant:['tabilao','mpianatra','fiantsoana','fandaharana','serasera','fikirakirana'],
 Kasie:['tabilao','mpianatra','sarany','serasera','tatitra','fikirakirana'],
 Mpampianatra:['tabilao','mpianatra','fiantsoana','naoty','fandaharana','mpiasa','serasera','fikirakirana'],
};
const isStaff=()=>STAFF_ROLES.includes(user?.role);
const isPortal=()=>user&&!isStaff();
const isBoss=()=>['Admin','Directeur'].includes(user?.role);
const hasRole=(...r)=>r.includes(user?.role);
const canSee=r=>{const l=ROLE_NAV[user?.role];return!l||l.includes(r)};
const CAN={
 students:()=>hasRole('Admin','Directeur','Secretariat'),
 classes:()=>hasRole('Admin','Directeur','Secretariat'),
 staff:()=>hasRole('Admin','Directeur','Secretariat'),
 timetable:()=>hasRole('Admin','Directeur','Secretariat'),
 pay:()=>hasRole('Admin','Directeur','Kasie'),
 cancelPay:()=>isBoss(),
 closeCash:()=>hasRole('Admin','Directeur','Kasie'),
 grades:()=>hasRole('Admin','Directeur','Mpampianatra'),
 council:()=>isBoss(),
 attendance:()=>hasRole('Admin','Directeur','Surveillant','Mpampianatra'),
 discipline:()=>hasRole('Admin','Directeur','Surveillant'),
 justify:()=>hasRole('Admin','Directeur','Surveillant'),
 announce:()=>hasRole('Admin','Directeur','Secretariat'),
 sms:()=>hasRole('Admin','Directeur','Secretariat','Kasie','Surveillant'),
 users:()=>hasRole('Admin','Directeur'),
 parentAccounts:()=>hasRole('Admin','Directeur','Secretariat'),
 settings:()=>isBoss(),
 reports:()=>hasRole('Admin','Directeur','Secretariat','Kasie'),
 logs:()=>isBoss(),
 staffAtt:()=>hasRole('Admin','Directeur','Secretariat','Surveillant'),
};

/* ---------- lookup ---------- */
const cls=id=>S.classes.find(c=>c.id===id);
const stu=id=>S.students.find(s=>s.id===id);
const tea=id=>S.teachers.find(t=>t.id===id);
const sbj=id=>S.subjects.find(s=>s.id===id);
const active=()=>S.students.filter(s=>s.status==='Mianatra');
const fullName=s=>s?`${s.last} ${s.first}`:'—';
const myTid=()=>user?.teacherId||'';
function myClasses(){if(user?.role!=='Mpampianatra')return S.classes;const t=myTid();return S.classes.filter(c=>c.teacherId===t||Object.values(c.assign||{}).includes(t))}
const myClassIds=()=>new Set(myClasses().map(c=>c.id));
function classSubjects(c){return S.subjects.filter(sb=>coefOf(sb,c)>0)}
function mySubjects(c){const all=classSubjects(c);if(user?.role!=='Mpampianatra')return all;const t=myTid();if(c.teacherId===t)return all.filter(sb=>!c.assign?.[sb.id]||c.assign[sb.id]===t);return all.filter(sb=>c.assign?.[sb.id]===t)}
const teacherOf=(c,sbId)=>tea((c.assign||{})[sbId]||c.teacherId);

/* ---------- terms / year ---------- */
function TERMS(){return(S?.school?.termMode==='S')?[['S1',L('Semestra 1','1er semestre')],['S2',L('Semestra 2','2e semestre')]]:[['T1',L('Trimestra 1','1er trimestre')],['T2',L('Trimestra 2','2e trimestre')],['T3',L('Trimestra 3','3e trimestre')]]}
const termL=t=>(TERMS().find(x=>x[0]===t)||[0,t])[1];
const termFR=t=>({T1:'1er trimestre',T2:'2e trimestre',T3:'3e trimestre',S1:'1er semestre',S2:'2e semestre'}[t]||t);
const lastTerm=()=>TERMS().slice(-1)[0][0];
function periodOf(t){return(S.school.periods||{})[t]||{}}
function currentTerm(){const d=today();for(const[t]of TERMS()){const p=periodOf(t);if(p.start&&p.end&&d>=p.start&&d<=p.end)return t}const m=curMonthIdx();return S?.school?.termMode==='S'?(m<5?'S1':'S2'):(m<3?'T1':m<6?'T2':'T3')}
function schoolYear(){const d=new Date(),y=d.getFullYear();return d.getMonth()>=8?`${y}-${y+1}`:`${y-1}-${y}`}
function defaultPeriods(year,mode){const y=+String(year||schoolYear()).slice(0,4)||new Date().getFullYear();return mode==='S'?{S1:{start:`${y}-09-15`,end:`${y+1}-01-31`},S2:{start:`${y+1}-02-01`,end:`${y+1}-06-30`}}:{T1:{start:`${y}-09-15`,end:`${y}-12-19`},T2:{start:`${y+1}-01-05`,end:`${y+1}-03-27`},T3:{start:`${y+1}-04-13`,end:`${y+1}-06-30`}}}
function isHoliday(d){return(S.school.holidays||[]).some(h=>d>=h.start&&d<=h.end)}

/* ---------- finance ---------- */
const coefOf=(sb,c)=>c&&sb.coefs&&nz(sb.coefs[c.level])?+sb.coefs[c.level]:+sb.coef||0;
const baseFee=s=>(cls(s.classId)||{}).fee||0;
const fee=s=>Math.round(baseFee(s)*(1-((s.reduc&&+s.reduc.pct)||0)/100));
const itemFee=(s,k)=>{const c=cls(s.classId);if(!c)return 0;if(k==='examen'&&!c.exam)return 0;return+((c.fees||{})[k]||0)};
const livePays=()=>S.payments.filter(p=>!p.void);
let _payIdx=null,_payIdxKey='';
function payIndex(){const k=S.payments.length+':'+(S.payments[S.payments.length-1]?.id||'')+':'+S.payments.filter(p=>p.void).length;if(_payIdx&&_payIdxKey===k&&_payIdx.src===S.payments)return _payIdx;const ix={e:{},i:{},src:S.payments};for(const p of S.payments){if(p.void)continue;if(!p.kind||p.kind==='ecolage'){const kk=p.studentId+'|'+p.month;ix.e[kk]=(ix.e[kk]||0)+p.amount}else{const kk=p.studentId+'|'+p.kind;ix.i[kk]=(ix.i[kk]||0)+p.amount}}_payIdx=ix;_payIdxKey=k;return ix}
const paid=(sid,m)=>payIndex().e[sid+'|'+m]||0;
const paidItem=(sid,k)=>payIndex().i[sid+'|'+k]||0;
function mstat(s,m){const f=fee(s),p=paid(s.id,m);if(f<=0)return'paid';if(p>=f)return'paid';if(p>0)return'partial';if(m<(s.start||0))return'skip';if(m>curMonthIdx())return'future';return'none'}
const isDue=st=>!['paid','skip'].includes(st);
const lateMonths=s=>{if(s.status!=='Mianatra')return 0;let n=0;for(let m=s.start||0;m<=Math.min(curMonthIdx(),9);m++)if(isDue(mstat(s,m)))n++;return n};
const dueEcolage=s=>{if(s.status!=='Mianatra')return 0;let a=0;for(let m=s.start||0;m<=Math.min(curMonthIdx(),9);m++)a+=Math.max(0,fee(s)-paid(s.id,m));return a};
const dueItems=s=>s.status!=='Mianatra'?0:FEE_ITEMS().reduce((a,[k])=>a+Math.max(0,itemFee(s,k)-paidItem(s.id,k)),0);
const dueAmount=s=>dueEcolage(s)+dueItems(s);
const sumMonth=m=>livePays().reduce((a,p)=>(!p.kind||p.kind==='ecolage')&&p.month===m?a+p.amount:a,0);
const expectedMonth=()=>active().reduce((a,s)=>a+fee(s),0);
function receipts(){const map={};for(const p of S.payments){const r=map[p.rec]||(map[p.rec]={rec:p.rec,studentId:p.studentId,items:[],amount:0,date:p.date,mode:p.mode,ref:p.ref,by:p.by,void:!!p.void,voidReason:p.voidReason,at:p.at||0});r.items.push(p);r.amount+=p.amount;if(p.date>r.date)r.date=p.date}return Object.values(map).sort((a,b)=>b.date.localeCompare(a.date)||b.rec.localeCompare(a.rec))}
const recItemsLabel=r=>r.items.sort((a,b)=>(a.month??99)-(b.month??99)).map(p=>!p.kind||p.kind==='ecolage'?MSH(p.month):kindL(p.kind)).join(', ');
const unpaidBlocked=s=>!!S.school.blockBulletin&&dueAmount(s)>0;

/* ---------- attendance ---------- */
const attCode=v=>v==null?null:typeof v==='string'?v:v.c;
const attMotif=v=>v&&typeof v==='object'?v.m||'':'';
function attKeys(){return Object.keys(S.attendance)}
function attDates(){const s=new Set();for(const k in S.attendance)s.add(k.split('|')[1]);return[...s].sort()}
function lastAttDate(){const t=today();const ds=attDates().filter(d=>d<=t);return ds[ds.length-1]}
function attRateDate(d,ids){let tot=0,ok=0;for(const k in S.attendance){const[c,dd]=k.split('|');if(dd!==d||(ids&&!ids.has(c)))continue;for(const v of Object.values(S.attendance[k])){tot++;const x=attCode(v);if(x==='P'||x==='R')ok++}}return tot?Math.round(ok/tot*100):null}
function studentAtt(s,from,to){const r={P:0,R:0,A:0,J:0,list:[]};for(const k in S.attendance){const[c,d]=k.split('|');if(c!==s.classId)continue;if(from&&d<from)continue;if(to&&d>to)continue;const v=S.attendance[k][s.id];const x=attCode(v);if(x){r[x]++;if(x!=='P')r.list.push({d,c:x,m:attMotif(v)})}}const t=r.P+r.R+r.A+r.J;r.rate=t?Math.round((r.P+r.R)/t*100):null;r.list.sort((a,b)=>b.d.localeCompare(a.d));return r}
function classAttRate(cid){let t=0,ok=0;for(const k in S.attendance){if(!k.startsWith(cid+'|'))continue;for(const v of Object.values(S.attendance[k])){t++;const x=attCode(v);if(x==='P'||x==='R')ok++}}return t?Math.round(ok/t*100):null}

/* ---------- grades ---------- */
const gk=(c,t,sb)=>`${c}|${t}|${sb}`;
function normG(v){if(!v)return{evals:[],appr:{}};if(Array.isArray(v.evals))return{evals:v.evals,appr:v.appr||{}};return{evals:[{id:'e0',type:'Compo',label:'Composition',max:20,coef:1,notes:v}],appr:{}}}
const G=(c,t,sb)=>normG(S.grades[gk(c,t,sb)]);
function subjAvg(sid,c,t,sb){const g=G(c,t,sb);let s=0,co=0;for(const e of g.evals){const v=(e.notes||{})[sid];if(nz(v)){const k=+e.coef||1;s+=(+v)/(+e.max||20)*20*k;co+=k}}return co?s/co:null}
function avgOf(sid,cid,t){const c=cls(cid);if(!c)return null;let s=0,co=0;for(const sb of classSubjects(c)){const a=subjAvg(sid,cid,t,sb.id);if(a!=null){const k=coefOf(sb,c);s+=a*k;co+=k}}return co?s/co:null}
function ranking(cid,t){return S.students.filter(s=>s.classId===cid&&s.status==='Mianatra').map(s=>({s,avg:avgOf(s.id,cid,t)})).sort((a,b)=>(b.avg??-1)-(a.avg??-1)).map((x,i,arr)=>{x.rank=x.avg==null?null:arr.findIndex(y=>y.avg===x.avg)+1;return x})}
function annualAvg(sid,cid){const v=TERMS().map(([t])=>avgOf(sid,cid,t)).filter(x=>x!=null);return v.length?sum(v)/v.length:null}
function annualRanking(cid){return S.students.filter(s=>s.classId===cid&&s.status==='Mianatra').map(s=>({s,avg:annualAvg(s.id,cid)})).sort((a,b)=>(b.avg??-1)-(a.avg??-1)).map((x,i,arr)=>{x.rank=x.avg==null?null:arr.findIndex(y=>y.avg===x.avg)+1;return x})}
function classStats(cid,t){const v=ranking(cid,t).map(x=>x.avg).filter(x=>x!=null);return{avg:v.length?sum(v)/v.length:null,max:v.length?Math.max(...v):null,min:v.length?Math.min(...v):null,n:v.length,pass:v.filter(x=>x>=10).length}}
function subjStats(cid,t,sbId){const v=S.students.filter(s=>s.classId===cid&&s.status==='Mianatra').map(s=>subjAvg(s.id,cid,t,sbId)).filter(x=>x!=null);return{avg:v.length?sum(v)/v.length:null,n:v.length,pass:v.filter(x=>x>=10).length}}
const MENTIONS={FEL:['Fiarahabana','Félicitations','b-teal'],TH:["Tabilaon'ny voninahitra","Tableau d'honneur",'b-green'],ENC:['Fampaherezana','Encouragements','b-blue'],PAS:['Ampy','Passable','b-amber'],AVT:['Fampitandremana','Avertissement','b-red']};
const mentionAuto=a=>a==null?'':a>=16?'FEL':a>=14?'TH':a>=12?'ENC':a>=10?'PAS':'AVT';
const mentionL=k=>MENTIONS[k]?L(MENTIONS[k][0],MENTIONS[k][1]):'—';
const mentionFR=k=>MENTIONS[k]?MENTIONS[k][1]:'';
const mentionCls=k=>MENTIONS[k]?MENTIONS[k][2]:'b-gray';
const apprFR=a=>a==null?'':a>=16?'Excellent':a>=14?'Très bien':a>=12?'Bien':a>=10?'Assez bien':a>=8?'Insuffisant':'Très insuffisant';
const apprMG=a=>a==null?'':a>=16?'Tena tsara indrindra':a>=14?'Tsara dia tsara':a>=12?'Tsara':a>=10?'Ampy':a>=8?'Tsy ampy':'Tsy ampy mihitsy';
const council=(c,t)=>S.councils[`${c}|${t}`]||{};
const isLocked=(c,t)=>!!council(c,t).locked;

/* ---------- timetable ---------- */
const slotsOf=cid=>(S.timetable[cid]||[]);
function allSlots(){const r=[];for(const c of S.classes)for(const sl of slotsOf(c.id))r.push({...sl,classId:c.id,room:sl.room||c.room||''});return r}
function conflicts(){const a=allSlots(),out=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const x=a[i],y=a[j];if(x.day!==y.day)continue;if(!(timeMin(x.start)<timeMin(y.end)&&timeMin(y.start)<timeMin(x.end)))continue;if(x.teacherId&&x.teacherId===y.teacherId)out.push({type:'t',x,y});if(x.room&&x.room===y.room&&x.classId!==y.classId)out.push({type:'r',x,y})}return out}
const slotConflictIds=()=>{const s=new Set();conflicts().forEach(c=>{s.add(c.x.id);s.add(c.y.id)});return s};

/* ---------- portal (parent / student summaries) ---------- */
function buildPortal(s){
 const c=cls(s.classId)||{};
 const terms={};
 for(const[t]of TERMS()){const rk=ranking(s.classId,t),me=rk.find(x=>x.s.id===s.id),st=classStats(s.classId,t),co=council(s.classId,t);
  const subjects=classSubjects(c).map(sb=>{const g=G(s.classId,t,sb.id);return{n:sb.name,k:coefOf(sb,c),a:subjAvg(s.id,s.classId,t,sb.id),e:g.evals.filter(e=>nz((e.notes||{})[s.id])).map(e=>({l:e.label,t:e.type,v:e.notes[s.id],m:e.max||20,d:e.date||''})),ap:(g.appr||{})[s.id]||''}});
  if(!me||me.avg==null)continue;
  terms[t]={avg:me.avg,rank:me.rank,size:rk.length,cavg:st.avg,max:st.max,min:st.min,subjects,locked:!!co.locked,appr:co.students?.[s.id]?.appr||'',mention:co.students?.[s.id]?.mention||'',decision:co.students?.[s.id]?.decision||''};
 }
 const at=studentAtt(s);
 const months=MONTHS_MG.map((_,i)=>[mstat(s,i),paid(s.id,i)]);
 const recs=receipts().filter(r=>r.studentId===s.id&&!r.void).slice(0,20).map(r=>({rec:r.rec,d:r.date,a:r.amount,l:r.items.map(p=>!p.kind||p.kind==='ecolage'?'m'+p.month:p.kind).join(','),mode:r.mode}));
 const tt=slotsOf(s.classId).map(x=>({day:x.day,start:x.start,end:x.end,sb:sbj(x.subjectId)?.name||'',t:tea(x.teacherId)?.name||'',room:x.room||c.room||''}));
 const hw=S.lessons.filter(l=>l.classId===s.classId).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,25).map(l=>({d:l.date,sb:sbj(l.subjectId)?.name||'',c:l.content||'',h:l.homework||'',due:l.due||''}));
 const sanc=S.sanctions.filter(x=>x.studentId===s.id).map(x=>({d:x.date,t:x.type,m:x.motif||'',days:x.days||0}));
 return{id:s.id,uids:s.parentUids||[],name:fullName(s),first:s.first,matricule:s.matricule,classId:s.classId,className:c.name||'',photo:s.photo||'',
  year:S.school.year,terms,att:{P:at.P,R:at.R,A:at.A,J:at.J,rate:at.rate,list:at.list.slice(0,30)},
  fee:fee(s),start:s.start||0,months,due:dueAmount(s),dueE:dueEcolage(s),dueI:dueItems(s),recs,tt,hw,sanc,blocked:unpaidBlocked(s),termMode:S.school.termMode||'T'};
}

/* ---------- empty / seed ---------- */
const DEF_SUBJECTS=[['Malagasy',2,{Primaire:2,Collège:2,Lycée:2}],['Frantsay',2,{Primaire:2,Collège:2,Lycée:3}],['Anglisy',1,{Primaire:1,Collège:2,Lycée:2}],['Matematika',3,{Primaire:3,Collège:3,Lycée:4}],['Fizika sy Simia',2,{Primaire:0,Collège:2,Lycée:3}],['Siansa (SVT)',2,{Primaire:1,Collège:2,Lycée:2}],['Tantara sy Jeografia',2,{Primaire:1,Collège:2,Lycée:2}],['Filozofia',2,{Primaire:0,Collège:0,Lycée:2}],['Fanatanjahantena',1,{Primaire:1,Collège:1,Lycée:1}]];
const defSubjects=()=>DEF_SUBJECTS.map(([name,coef,coefs],i)=>({id:'s'+i,name,coef,coefs,ord:i}));
function emptyState(){const y=schoolYear();return{school:{name:'',code:'',director:'',address:'',city:'',type:'Privé',phone:'',email:'',year:y,motto:'',termMode:'T',periods:defaultPeriods(y,'T'),holidays:[],blockBulletin:false,smsAbsence:true,smsSender:'',barem:20},teachers:[],classes:[],subjects:defSubjects(),students:[],payments:[],attendance:{},grades:{},councils:{},timetable:{},sanctions:[],closures:[],announcements:[],sms:[],lessons:[],staffatt:{},portal:[],seq:0}}
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function monthDate(mi,day,year){const y0=+String(year||schoolYear()).slice(0,4);const y=mi<4?y0:y0+1,m=mi<4?8+mi:mi-4;return iso(new Date(y,m,day))}
function seed(){
 const R=rng(20261114),pick=a=>a[Math.floor(R()*a.length)];
 const st=emptyState();const year=st.school.year;
 Object.assign(st.school,{name:'Sekoly Fanilo',director:'Rtoa Rasoanirina Lalao',address:'Lot II M 45 Analakely',city:'Antananarivo',type:'Privé',phone:'034 12 345 67',email:'contact@fanilo.mg',motto:'Fahaizana · Fahamarinana · Fahafahana'});
 st.school.holidays=[{label:'Fety Noely',start:`${year.slice(0,4)}-12-20`,end:`${+year.slice(0,4)+1}-01-04`},{label:'Paska',start:`${+year.slice(0,4)+1}-03-28`,end:`${+year.slice(0,4)+1}-04-12`}];
 const BOYS=['Rado','Hery','Andry','Tojo','Haja','Mamy','Hasina','Tsiry','Njaka','Toky','Fenitra','Sitraka','Ravo','Mahery','Tahina','Fanilo','Tiavina','Mendrika'];
 const GIRLS=['Fanja','Tiana','Mialy','Lova','Nirina','Voahangy','Faniry','Ony','Noro','Fitia','Kanto','Aina','Malala','Santatra','Miora','Hanta','Sarobidy','Onja'];
 const LAST=['Rakoto','Rabe','Randrianasolo','Rasoanaivo','Andrianina','Razafindrakoto','Rakotomalala','Ranaivoson','Rasolofo','Ramanantsoa','Rajaonarison','Andriamanana','Razanakoto','Ravelojaona','Rakotondrabe','Randriamampionona'];
 const PLACES=['Antananarivo','Antsirabe','Toamasina','Fianarantsoa','Mahajanga','Ambositra','Moramanga','Arivonimamo'];
 const ph=()=>'03'+pick(['2','3','4','8'])+' '+String(Math.floor(R()*90+10))+' '+String(Math.floor(R()*900+100))+' '+String(Math.floor(R()*90+10));
 const T=[['Rakotomalala Haingo','Matematika','s3'],['Rasoanirina Voahirana','Frantsay','s1'],['Andrianarivo Tsilavina','Fizika sy Simia','s4'],['Razafy Lalaina','Malagasy','s0'],['Rabearison Mamisoa','Anglisy','s2'],['Ramaroson Fidy','Tantara sy Jeografia','s6'],['Rakotobe Nomena','Siansa (SVT)','s5'],['Randria Hasimbola','Fanatanjahantena','s8'],['Raveloson Miangaly','Matematika','s3'],['Rajaona Tolotra','Filozofia','s7']];
 st.teachers=T.map(([name,subject],i)=>({id:'t'+i,name,poste:'Mpampianatra',subject,phone:ph(),email:'',since:String(2012+Math.floor(R()*12)),contract:pick(['CDI','CDI','CDD','Vacataire']),diplomas:pick(['CAPEN','Licence','Master','Baccalauréat + CAP']),birth:iso(new Date(1975+Math.floor(R()*20),Math.floor(R()*12),1+Math.floor(R()*27)))}));
 st.teachers.push({id:'t10',name:'Rasolo Fara',poste:'Sekretera',phone:ph(),since:'2019',contract:'CDI'},{id:'t11',name:'Rakotonirina Zo',poste:'Mpitahiry vola',phone:ph(),since:'2020',contract:'CDI'},{id:'t12',name:'Randrianjafy Solo',poste:'Mpanara-maso',phone:ph(),since:'2018',contract:'CDI'});
 const C=[['CP','Primaire',30000],['CE','Primaire',30000],['CM1','Primaire',35000],['CM2','Primaire',35000,'CEPE'],['6ème','Collège',45000],['5ème','Collège',45000],['4ème','Collège',50000],['3ème','Collège',55000,'BEPC'],['Seconde','Lycée',65000],['Terminale','Lycée',75000,'BAC']];
 st.classes=C.map(([name,level,fee,exam],i)=>({id:'c'+i,name,level,fee,fees:{inscription:level==='Primaire'?40000:level==='Collège'?60000:80000,assurance:5000,tenue:level==='Primaire'?20000:25000,examen:exam?(exam==='CEPE'?15000:exam==='BEPC'?25000:40000):0},teacherId:i<4?'t'+[3,1,0,8][i]:'t'+[0,1,4,6,9,2][i-4]||'',room:'Efitra '+(i+1),capacity:35,color:CCOL[i%CCOL.length],ord:i,exam:exam||'',assign:{},next:i<C.length-1?'c'+(i+1):''}));
 for(const c of st.classes){if(c.level==='Primaire')continue;const a={s0:'t3',s1:'t1',s2:'t4',s3:c.level==='Lycée'?'t0':'t8',s4:'t2',s5:'t6',s6:'t5',s7:'t9',s8:'t7'};for(const sb of st.subjects)if(coefOf(sb,c)>0)c.assign[sb.id]=a[sb.id]}
 const cm=curMonthIdx(),td=new Date().getDate(),ability={};let n=0,seq=0;
 st.classes.forEach((c,ci)=>{
  const cnt=6+Math.floor(R()*4);
  for(let k=0;k<cnt;k++){
   const sex=R()<.5?'L':'V',first=pick(sex==='L'?BOYS:GIRLS),last=pick(LAST);
   const s={id:'p'+(++n),matricule:`${year.slice(2,4)}-${String(n).padStart(4,'0')}`,first,last,sex,birth:iso(new Date(2020-ci,Math.floor(R()*12),1+Math.floor(R()*27))),birthPlace:pick(PLACES),classId:c.id,parent:pick(['Ramatoa ','Andriamatoa '])+last+' '+pick(R()<.5?BOYS:GIRLS),phone:ph(),address:pick(['Analakely','Ankorondrano','Ambohijatovo','Isotry','Ampefiloha','Andravoahangy','Ambanidia','67 Ha','Itaosy','Ivato']),status:'Mianatra',entry:R()<.8?'Taloha':'Vaovao',start:0,year,created:monthDate(0,1+Math.floor(R()*8),year),parentUids:[]};
   if(R()<.08)s.reduc={type:pick(['fratrie','personnel','bourse']),pct:pick([10,20,50])};
   st.students.push(s);ability[s.id]=7+R()*10;
   if(R()<.92){const rec='R'+String(++seq).padStart(5,'0'),dt=monthDate(0,1+Math.floor(R()*5),year),md=pick(['Vola an-tanana','MVola']);['inscription','assurance','tenue'].forEach(k=>st.payments.push({id:uid(),rec,studentId:s.id,kind:k,amount:c.fees[k],date:dt,mode:md,by:'Rakotonirina Zo',at:0}));if(c.exam&&R()<.6)st.payments.push({id:uid(),rec,studentId:s.id,kind:'examen',amount:c.fees.examen,date:dt,mode:md,by:'Rakotonirina Zo',at:0})}
   const pr=[.95,.85,.7,.6];
   for(let m=0;m<=cm&&m<10;m++){if(R()<(pr[m]??.6)){const part=R()<.1;const day=m===cm?1+Math.floor(R()*Math.max(1,td-1)):1+Math.floor(R()*14);
    st.payments.push({id:uid(),rec:'R'+String(++seq).padStart(5,'0'),studentId:s.id,kind:'ecolage',month:m,amount:Math.round(c.fee*(1-((s.reduc&&s.reduc.pct)||0)/100)*(part?.5:1)),date:monthDate(m,day,year),mode:pick(['Vola an-tanana','Vola an-tanana','MVola','MVola','Orange Money','Airtel Money']),by:'Rakotonirina Zo',at:0})}}
  }
 });
 st.seq=seq;
 // attendance: last 10 school days
 const days=[];let d=new Date();d.setDate(d.getDate()-1);
 while(days.length<10){if(d.getDay()!==0&&d.getDay()!==6)days.push(iso(d));d.setDate(d.getDate()-1)}
 const MOT=['Marary','Fianakaviana','Fitaterana'];
 days.forEach(day=>st.classes.forEach(c=>{const rec={};st.students.filter(s=>s.classId===c.id).forEach(s=>{const r=R();rec[s.id]=r<.88?'P':r<.93?'R':r<.97?'A':{c:'J',m:pick(MOT)}});st.attendance[c.id+'|'+day]=rec}));
 // grades T1: devoir + compo
 st.classes.forEach(c=>st.subjects.forEach(sb=>{if(coefOf(sb,c)<=0)return;const dv={},cp={};st.students.filter(s=>s.classId===c.id).forEach(s=>{const g=()=>Math.round(Math.max(2,Math.min(19.5,ability[s.id]+(R()-.5)*7))*2)/2;dv[s.id]=g();cp[s.id]=g()});st.grades[gk(c.id,'T1',sb.id)]={evals:[{id:'e1',type:'Devoir',label:'Devoir 1',date:monthDate(1,15,year),max:20,coef:1,notes:dv},{id:'e2',type:'Compo',label:'Composition T1',date:monthDate(2,10,year),max:20,coef:2,notes:cp}],appr:{}}}));
 // timetable
 const TIMES=[['07:30','09:30'],['09:45','11:45'],['14:00','16:00']];
 st.classes.forEach((c,ci)=>{const subs=st.subjects.filter(sb=>coefOf(sb,c)>0);const slots=[];let k=ci;for(let day=1;day<=5;day++)for(let ti=0;ti<(day===3?2:3);ti++){const sb=subs[(k++)%subs.length];slots.push({id:uid(),day,start:TIMES[ti][0],end:TIMES[ti][1],subjectId:sb.id,teacherId:c.level==='Primaire'?c.teacherId:(c.assign[sb.id]||c.teacherId),room:''})}st.timetable[c.id]=slots});
 // sanctions, announcements, lessons
 const some=st.students.filter((_,i)=>i%13===0);
 some.forEach((s,i)=>st.sanctions.push({id:uid(),studentId:s.id,type:i%2?'Retenue':'Avertissement',date:days[i%days.length],motif:i%2?'Tsy nanao ny asa an-trano':'Fikorontanana tao an-dakilasy',days:0,by:'Randrianjafy Solo'}));
 const y0=+year.slice(0,4);
 st.announcements=[{id:uid(),title:'Fivoriana ray aman-dreny',body:'Asaina manatrika ny fivoriana ankapobeny ny ray aman-dreny rehetra.',type:'reunion',date:today(),eventDate:monthDate(3,6,year),audience:'all',by:'Rtoa Rasoanirina Lalao'},{id:uid(),title:'Fanadinana Trimestra 1',body:'Hanomboka ny fanadinana ho an\'ny kilasy rehetra.',type:'examen',date:today(),eventDate:monthDate(3,1,year),audience:'all',by:'Rtoa Rasoanirina Lalao'},{id:uid(),title:'Fialan-tsasatra Krismasy',body:'Mikatona ny sekoly.',type:'vakansy',date:today(),eventDate:`${y0}-12-20`,audience:'all',by:'Rtoa Rasoanirina Lalao'}];
 st.classes.forEach((c,ci)=>{const subs=st.subjects.filter(sb=>coefOf(sb,c)>0);for(let j=0;j<3;j++){const sb=subs[(ci+j)%subs.length];st.lessons.push({id:uid(),classId:c.id,subjectId:sb.id,teacherId:c.assign[sb.id]||c.teacherId,date:days[j*2],content:`Lesona: ${sb.name} — toko ${j+3}`,homework:j===0?`Tanteraho ny fanazarana pejy ${20+j*4}`:'',due:j===0?iso(new Date(Date.now()+2*864e5)):''})}});
 days.slice(0,5).forEach(day=>{const r={};st.teachers.forEach(t=>{const x=R();r[t.id]=x<.93?'P':x<.97?'R':'A'});st.staffatt[day]=r});
 return st;
}
