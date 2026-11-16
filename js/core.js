/* Sekoly — core.js : icons, utils, i18n, modal, print, export */
'use strict';
const ICONS={
home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
brief:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
card:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
checks:'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
eyeoff:'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
menu:'<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
alert:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
check:'<polyline points="20 6 9 17 4 12"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
cap:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
door:'<path d="M3 21h18"/><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><circle cx="15" cy="12" r="1"/>',
user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
print:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
chart:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
unlock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
clip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
userplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
cash:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
list:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
};
const ic=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`;

/* ---------- language ---------- */
let LANG=(()=>{try{return localStorage.getItem('sekoly_lang')||'mg'}catch(e){return'mg'}})();
const L=(mg,fr)=>LANG==='fr'?fr:mg;
function setLang(l){LANG=l;try{localStorage.setItem('sekoly_lang',l)}catch(e){}document.documentElement.lang=l==='fr'?'fr':'mg'}

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const nf=new Intl.NumberFormat('fr-FR');
const fmt=n=>nf.format(Math.round(n||0))+' Ar';
const num=n=>nf.format(Math.round(n||0));
const short=n=>n>=1e6?(n/1e6).toFixed(1).replace('.0','').replace('.',',')+'M':n>=1e3?Math.round(n/1e3)+'k':String(Math.round(n));
const MONTHS_MG=['Septambra','Oktobra','Novambra','Desambra','Janoary','Febroary','Martsa','Aprily','Mey','Jona'];
const MONTHS_FR=['Septembre','Octobre','Novembre','Décembre','Janvier','Février','Mars','Avril','Mai','Juin'];
const MS_MG=['Sep','Okt','Nov','Des','Jan','Feb','Mar','Apr','Mey','Jon'];
const MS_FR=['Sep','Oct','Nov','Déc','Jan','Fév','Mar','Avr','Mai','Juin'];
const MONTH=i=>(LANG==='fr'?MONTHS_FR:MONTHS_MG)[i];
const MSH=i=>(LANG==='fr'?MS_FR:MS_MG)[i];
const CALM_MG=['Janoary','Febroary','Martsa','Aprily','Mey','Jona','Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra'];
const CALM_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const DAYS_MG=['Alahady','Alatsinainy','Talata','Alarobia','Alakamisy','Zoma','Sabotsy'];
const DAYS_FR=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const DAY=i=>(LANG==='fr'?DAYS_FR:DAYS_MG)[i];
const MODES=['Vola an-tanana','MVola','Orange Money','Airtel Money','Virement / Banky','Seky'];
const modeL=m=>LANG==='fr'?({'Vola an-tanana':'Espèces','Virement / Banky':'Virement / Banque','Seky':'Chèque','Banky / Seky':'Banque / Chèque'}[m]||m):m;
const iso=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const today=()=>iso(new Date());
const fmtDate=s=>{if(!s)return'—';const[y,m,d]=String(s).slice(0,10).split('-');return`${d}/${m}/${y}`};
const fmtTime=t=>{if(!t)return'';const d=new Date(t);return fmtDate(iso(d))+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const dateLong=d=>LANG==='fr'?`${DAYS_FR[d.getDay()]} ${d.getDate()} ${CALM_FR[d.getMonth()]} ${d.getFullYear()}`:`${DAYS_MG[d.getDay()]} ${d.getDate()} ${CALM_MG[d.getMonth()]} ${d.getFullYear()}`;
const dateFR=s=>{if(!s)return'';const d=new Date(String(s).slice(0,10)+'T12:00');return`${d.getDate()} ${CALM_FR[d.getMonth()]} ${d.getFullYear()}`};
const curMonthIdx=()=>{const m=new Date().getMonth();const map={8:0,9:1,10:2,11:3,0:4,1:5,2:6,3:7,4:8,5:9};return map[m]??9};
const monthOfDate=s=>{const m=new Date(s+'T12:00').getMonth();return{8:0,9:1,10:2,11:3,0:4,1:5,2:6,3:7,4:8,5:9}[m]??9};
const ageOf=b=>{if(!b)return null;const d=new Date(b),n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;return a};
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const PAL=[['#eaf2ff','#1f68e0'],['#e4f1fd','#0868b8'],['#fff1d9','#b56a00'],['#fce7f3','#be185d'],['#ede9fe','#6d28d9'],['#e1f7e9','#118847'],['#ffedd5','#c2410c'],['#e0f2fe','#0369a1']];
const palOf=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return PAL[h%PAL.length]};
const avs=(name,key,photo)=>{if(photo)return`<img class="avs" src="${photo}" alt="">`;const[b,f]=palOf(key||name);return`<div class="avs" style="background:${b};color:${f}">${esc(initials(name))}</div>`};
const CCOL=['#2f7cf6','#0878db','#f2a531','#ec4899','#8b5cf6','#14a85b','#f97316','#0ea5e9','#e23d4c','#5f7386'];
const f2=v=>v==null||isNaN(v)?'—':(+v).toFixed(2).replace('.',',');
const nz=v=>v!==undefined&&v!==null&&v!==''&&!isNaN(v);
const sum=a=>a.reduce((x,y)=>x+(+y||0),0);
const timeMin=t=>{const[h,m]=String(t||'0:0').split(':');return(+h)*60+(+m||0)};
const phoneNorm=p=>{let d=String(p||'').replace(/\D/g,'');if(d.startsWith('261'))d='0'+d.slice(3);return d};
const phoneIntl=p=>{const d=phoneNorm(p);return d.startsWith('0')?'+261'+d.slice(1):d};
const debounce=(f,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};

/* ---------- small html helpers ---------- */
const fld=(label,name,val='',type='text',extra='')=>`<label class="fld"><span>${label}</span><input name="${name}" type="${type}" value="${esc(val??'')}" ${extra}></label>`;
const sel=(label,name,opts,val,extra='')=>`<label class="fld"><span>${label}</span><select name="${name}" ${extra}>${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(val)===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
const area=(label,name,val='',extra='')=>`<label class="fld"><span>${label}</span><textarea name="${name}" rows="3" ${extra}>${esc(val??'')}</textarea></label>`;
const emptyBox=(icon,t,s='')=>`<div class="empty"><div class="ei">${ic(icon,24)}</div><b>${t}</b><div style="margin-top:4px">${s}</div></div>`;
const tabsBar=(cur,items,act)=>`<div class="tabs">${items.filter(Boolean).map(([k,l,i,badge])=>`<button class="${cur===k?'on':''}" data-act="${act}" data-k="${k}">${i?ic(i,15):''} ${l}${badge?` <em>${badge}</em>`:''}</button>`).join('')}</div>`;
const saveBtn=()=>`<button class="btn pri" type="submit" form="fm">${ic('check',16)} ${L('Tehirizina','Enregistrer')}</button>`;
const cancelBtn=()=>`<button class="btn ghost" data-act="close">${L('Hiala','Annuler')}</button>`;
const doneBtn=()=>`<button class="btn pri" data-act="close">${L('Vita','Fermer')}</button>`;

/* ---------- modal / toast / confirm / prompt ---------- */
function openModal(title,body,foot,size=''){
 $('#modal').innerHTML=`<div class="ov" data-ov="1"><div class="mdl ${size}"><div class="mdl-h"><h3>${title}</h3><button class="icon-btn" data-act="close">${ic('x',16)}</button></div><div class="mdl-b">${body}</div>${foot?`<div class="mdl-f">${foot}</div>`:''}</div></div>`;
 const f=$('#modal input:not([type=hidden]):not([readonly]),#modal textarea');if(f&&!f.value)setTimeout(()=>f.focus(),50);
}
const closeModal=()=>{$('#modal').innerHTML=''};
let confirmCb=null,promptCb=null;
function confirmBox(msg,cb,ok,danger=true){confirmCb=cb;openModal(L('Fanamafisana','Confirmation'),`<div style="display:flex;gap:14px;align-items:flex-start"><div class="ki ${danger?'red':'teal'}" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;flex:none">${ic('alert',20)}</div><p style="margin:4px 0 0;line-height:1.6">${msg}</p></div>`,`${cancelBtn()}<button class="btn ${danger?'danger':'pri'}" data-act="confirmOk">${ok||L('Ekena','Confirmer')}</button>`,'sm')}
function promptBox(title,label,cb,{required=true,value='',type='textarea'}={}){promptCb=cb;openModal(title,`<form data-form="prompt" id="pfm">${type==='textarea'?area(label,'v',value,required?'required':''):fld(label,'v',value,type,required?'required':'')}</form>`,`${cancelBtn()}<button class="btn pri" type="submit" form="pfm">${ic('check',16)} ${L('Ekena','Valider')}</button>`,'sm')}
function toast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.innerHTML=`<div class="ti">${ic(err?'x':'check',14)}</div>${esc(msg)}`;$('#toasts').appendChild(t);setTimeout(()=>{t.style.transition='.3s';t.style.opacity='0';t.style.transform='translateY(8px)'},3000);setTimeout(()=>t.remove(),3400)}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast(L('Voadika','Copié'))}catch(e){openModal(L('Adikao','Copier'),`<textarea class="ta" readonly onclick="this.select()">${esc(t)}</textarea>`,doneBtn())}}

/* ---------- print / download / export ---------- */
function printHTML(html,title){
 const p=$('#print');p.innerHTML=html;const old=document.title;if(title)document.title=title;
 setTimeout(()=>{try{window.print()}catch(e){toast(L('Tsy afaka manonta eto','Impression impossible ici'),1)}document.title=old},150);
}
function download(name,content,type='text/plain'){const b=content instanceof Blob?content:new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
async function exportXLSX(name,sheets){
 try{
  const X=await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');
  const wb=X.utils.book_new();
  sheets.forEach(s=>{const ws=X.utils.aoa_to_sheet(s.rows);ws['!cols']=(s.rows[0]||[]).map((_,i)=>({wch:Math.min(40,Math.max(8,...s.rows.slice(0,200).map(r=>String(r[i]??'').length+2)))}));X.utils.book_append_sheet(wb,ws,String(s.name).replace(/[\\/?*[\]:]/g,' ').slice(0,31))});
  X.writeFile(wb,name.replace(/[^\w\- ]+/g,'_')+'.xlsx');toast(L('Voaondrana Excel','Export Excel prêt'));
 }catch(e){
  const s=sheets[0];const csv='﻿'+s.rows.map(r=>r.map(c=>{const v=String(c??'');return/[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(';')).join('\n');
  download(name+'.csv',csv,'text/csv;charset=utf-8');toast(L('Voaondrana CSV (Excel)','Export CSV (Excel)'));
 }
}
function readImage(file,max=320,q=.8){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
function readFileData(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
