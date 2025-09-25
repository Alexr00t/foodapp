(function(){
'use strict';
const P='nutri_presets_v2',AUTOLIMIT=5;
const METRICS=[{k:'cal',n:'Calorii',u:'kcal'},{k:'pro',n:'Proteine',u:'g'},{k:'carb',n:'Carbohidrați',u:'g'},{k:'fat',n:'Grăsimi',u:'g'},{k:'sug',n:'Zaharuri',u:'g'},{k:'fib',n:'Fibre',u:'g'}];
let presets=load(P,[]);
let dash,presetBox,autoBox;
const refs={};
let autoLog=[];
let index=new Map(),buildTimer;
document.addEventListener('DOMContentLoaded',init);
function init(){/*buildDashboard();*/buildQuick();buildProduct();buildTaxonomy();buildAutosave();enhanceDropdown();patchCore();rebuildIndex();refreshAll();}
function refreshAll(){/*updateDashboard(currentDate());*/renderPresets();renderTaxonomy();renderAutosave();updateProductInfo();}
function load(key,fallback){try{const raw=localStorage.getItem(key);if(raw)return JSON.parse(raw);}catch(err){console.warn('[ux]',err);}return JSON.parse(JSON.stringify(fallback));}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(err){console.warn('[ux]',err);}}
function currentDate(){const el=document.getElementById('jr-date');return el&&el.value?el.value:todayISO();}
function buildDashboard(){
  const host = document.getElementById('tab-jurnal');
  if(!host) return;
  dash = document.createElement('div');
  dash.id = 'jr-dash';
  dash.className = 'dash-card';
  dash.innerHTML = `
    <div class="dash-head">
      <div>
        <h2>Privire rapidă</h2>
        <p id="dash-sub">Monitorizează ziua curentă.</p>
      </div>
      <button type="button" id="dash-copy" class="ghost ghost-sm">Copiază sumar</button>
    </div>
    <div class="dash-grid"></div>
  `;
  const grid = dash.querySelector('.dash-grid');
  METRICS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'dash-metric';
    card.dataset.metric = m.k;
    card.innerHTML = `
      <div class="metric-ring" data-state="normal">
        <div class="metric-ring-center"><span class="metric-percent">0%</span></div>
      </div>
      <div class="metric-info">
        <div class="metric-title">${m.n}</div>
        <div class="metric-target">Fără țintă</div>
        <div class="metric-value">0 ${m.u}</div>
        <div class="metric-diff" data-state=""></div>
      </div>
    `;
    const ring = card.querySelector('.metric-ring');
    refs[m.k] = {
      card,
      ring,
      percent: ring.querySelector('.metric-percent'),
      target: card.querySelector('.metric-target'),
      value: card.querySelector('.metric-value'),
      diff: card.querySelector('.metric-diff')
    };
    grid.appendChild(card);
  });
  host.insertBefore(dash, host.firstElementChild);
  dash.querySelector('#dash-copy').addEventListener('click', copySummary);
}
function copySummary(){const lines=[document.getElementById('jr-title')?.textContent||'Ziua curentă',''];METRICS.forEach(m=>{const r=refs[m.k];if(!r)return;lines.push(m.n+': '+r.value.textContent+' din '+r.target.textContent+' ('+r.diff.textContent+')');});navigator.clipboard?.writeText(lines.join('\n')).then(()=>toast('Sumarul a fost copiat.')).catch(()=>alert('Nu am putut copia sumarul.'));}
function toast(msg){let el=document.querySelector('.ux-toast');if(el)el.remove();el=document.createElement('div');el.className='ux-toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.classList.add('show'),10);setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),180);},2200);}
function updateDashboard(dateISO){
  if(!dash) return;
  const rows = JOURNAL.filter(e => e.date === dateISO);
  const totals = { cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0 };
  rows.forEach(entry => {
    const n = calcNutrients(entry);
    if(!n) return;
    totals.cal += n.cal || 0;
    totals.fat += n.fat || 0;
    totals.sat += n.sat || 0;
    totals.carb += n.carb || 0;
    totals.sug += n.sug || 0;
    totals.fib += n.fib || 0;
    totals.pro += n.pro || 0;
  });
  dash.querySelector('#dash-sub').textContent = rows.length
    ? `Ai ${rows.length} ${rows.length===1?'aliment':'alimente'} în ziua curentă.`
    : 'Nu există înregistrări pentru ziua curentă.';
  METRICS.forEach(m => {
    const ref = refs[m.k];
    if(!ref) return;
    const target = TARGETS?.[m.k] || 0;
    const value = m.k === 'carb' ? totals.carb : (totals[m.k] || 0);
    const ratio = target > 0 ? value / target : 0;
    const baseDeg = ratio > 1 ? 360 : (ratio * 360);
    const overDeg = ratio > 1 ? Math.min((ratio - 1) * 360, 360) : 0;
    ref.ring.style.setProperty('--base', `${baseDeg}deg`);
    ref.ring.style.setProperty('--over', `${overDeg}deg`);
    
    // Set background dynamically based on whether there's overflow
    if (ratio > 1) {
      // For overflow: red covers 0 to overDeg, green covers overDeg to 360°
      ref.ring.style.background = `conic-gradient(var(--over-color) 0deg var(--over), var(--accent) var(--over) 360deg)`;
    } else {
      // For normal: green covers 0 to baseDeg, gray track covers baseDeg to 360°
      ref.ring.style.background = `conic-gradient(var(--accent) 0deg var(--base), var(--ring-track) var(--base) 360deg)`;
    }
    const state = ratio > 1.05 ? 'over' : (ratio > 0.85 ? 'near' : 'normal');
    ref.ring.dataset.state = state;
    ref.card.dataset.state = state;
    ref.percent.textContent = target ? `${Math.round(ratio * 100)}%` : '—';
    ref.value.textContent = formatVal(value, m.u);
    if(target){
      ref.target.textContent = `Țintă: ${formatVal(target, m.u)}`;
      const diff = target - value;
      if(diff === 0){
        ref.diff.textContent = 'Țintă atinsă';
        ref.diff.dataset.state = 'hit';
      } else if(diff > 0){
        ref.diff.textContent = `-${formatVal(Math.abs(diff), m.u)}`;
        ref.diff.dataset.state = 'under';
      } else {
        ref.diff.textContent = `+${formatVal(Math.abs(diff), m.u)}`;
        ref.diff.dataset.state = 'over';
      }
    } else {
      ref.target.textContent = 'Fără țintă';
      ref.diff.textContent = '';
      ref.diff.dataset.state = '';
    }
  });
}
function formatVal(v,u){const dec=v>=100?0:(v>=10?1:2);return v.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})+' '+u;}
function buildQuick(){
  presetBox = null;
}




function saveDayAsPreset(){const date=currentDate();const rows=JOURNAL.filter(e=>e.date===date);if(!rows.length){alert('Nu există înregistrări pentru ziua curentă.');return;}const name=prompt('Nume pentru masă:','Masă rapidă');if(!name)return;presets.push({id:'pre-'+Date.now().toString(36),name:name.trim(),entries:rows.map(e=>({p:e.product,q:e.qty,u:e.unit}))});save(P,presets);renderPresets();toast('Masă salvată.');}
function copyFromPreviousDay(){const date=currentDate();const prev=new Date(date);prev.setDate(prev.getDate()-1);const prevISO=prev.toISOString().slice(0,10);const rows=JOURNAL.filter(e=>e.date===prevISO);if(!rows.length){alert('Ziua anterioară este goală.');return;}if(!confirm('Copiază toate înregistrările din ziua anterioară?'))return;const now=Date.now();rows.forEach((e,i)=>{JOURNAL.unshift({id:'copy-'+now+'-'+i,ts:now+i,date,product:e.product,qty:e.qty,unit:e.unit});});saveJournalWithFS(JOURNAL);renderJournalForDate(date);toast('Ziua anterioară a fost copiată.');}
function renderPresets(){
  if(!presetBox)return;
  presetBox.innerHTML='';
  if(!presets.length){
    presetBox.innerHTML='<span class="muted">Salveaza o masa pentru reutilizare.</span>';
    return;
  }
  presets.slice(-6).reverse().forEach(p=>{
    const card=document.createElement('div');
    card.className='preset-card';
    card.innerHTML='<div><strong>'+escapeHtml(p.name)+'</strong><div class="muted">'+p.entries.length+' produse</div></div><div class="preset-buttons"><button type="button" data-act="use">Adauga</button><button type="button" data-act="del">Sterge</button></div>';
    card.addEventListener('click',e=>{
      const act=e.target?.getAttribute('data-act');
      if(!act)return;
      if(act==='use'){
        applyPreset(p);
      }else if(act==='del'){
        if(confirm('Stergi aceasta masa?')){
          presets=presets.filter(x=>x.id!==p.id);
          save(P,presets);
          renderPresets();
        }
      }
    });
    presetBox.appendChild(card);
  });
}

function applyPreset(p){const date=currentDate();const now=Date.now();let added=0;p.entries.forEach((item,i)=>{if(!productByName(item.p))return;JOURNAL.unshift({id:'preset-'+p.id+'-'+now+'-'+i,ts:now+i,date,product:item.p,qty:item.q,unit:item.u});added++;});if(!added){alert('Produsele din preset nu mai există.');return;}saveJournalWithFS(JOURNAL);renderJournalForDate(date);toast('Masă adăugată în jurnal.');}
function escapeHtml(str){return(str||'').replace(/[&<>"']/g,function(ch){if(ch==='&')return '&amp;';if(ch==='<')return '&lt;';if(ch==='>')return '&gt;';if(ch==='"')return '&quot;';return '&#39;';});}
function buildProduct(){const anchor=document.querySelector('#tab-produse .grid:nth-of-type(2)');if(!anchor)return;const box=document.createElement('div');box.id='pi-box';box.className='product-insights';box.innerHTML='<div class="pi-head"><span>Verificare produs</span><span id="pi-status" class="muted">Completează valorile.</span></div><div class="pi-wrap"><div><div class="pi-title">Per porție</div><ul id="pi-portion"></ul></div><div><div class="pi-title">Calorii estimate</div><div id="pi-cal"></div></div><div><div class="pi-title">Sugestii</div><ul id="pi-tips"></ul></div></div>';anchor.parentElement.insertBefore(box,anchor.nextSibling);['p-base','p-gbuc','p-mlbuc','p-cal','p-fat','p-sat','p-carb','p-sug','p-fib','p-pro','p-tags'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',updateProductInfo);el.addEventListener('change',updateProductInfo);}});}
function updateProductInfo(){const base=document.getElementById('p-base')?.value||'100g';const gb=Number(document.getElementById('p-gbuc')?.value||0);const ml=Number(document.getElementById('p-mlbuc')?.value||0);const cal=Number(document.getElementById('p-cal')?.value||0);const fat=Number(document.getElementById('p-fat')?.value||0);const carb=Number(document.getElementById('p-carb')?.value||0);const fib=Number(document.getElementById('p-fib')?.value||0);const pro=Number(document.getElementById('p-pro')?.value||0);const status=document.getElementById('pi-status');const portion=document.getElementById('pi-portion');const calBox=document.getElementById('pi-cal');const tips=document.getElementById('pi-tips');if(!status||!portion||!calBox||!tips)return;const macros=fat>0||carb>0||pro>0;const calc=(fat*9)+((carb-fib)*4)+(fib*2)+(pro*4);const diff=cal?cal-calc:0;const diffPct=cal?Math.abs(diff)/cal:0;portion.innerHTML='';const items=[];if(base==='100g'&&gb){const f=gb/100;items.push('<li>'+gb.toFixed(0)+' g/buc &rarr; '+formatVal(cal*f,'kcal')+', '+formatVal(pro*f,'g')+' proteine</li>');}if(base==='100ml'&&ml){const f=ml/100;items.push('<li>'+ml.toFixed(0)+' ml/buc &rarr; '+formatVal(cal*f,'kcal')+'</li>');}if(base==='bucata'){items.push('<li>Pe bucată: '+formatVal(cal,'kcal')+', '+formatVal(pro,'g')+' proteine</li>');if(gb){items.push('<li>În 100 g (estimare): '+formatVal(cal*(100/gb),'kcal')+'</li>');}}portion.innerHTML=items.length?items.join(''):'<li class="muted">Completează greutatea/volumul pentru conversii.</li>';calBox.innerHTML=macros?'<strong>'+calc.toFixed(1)+' kcal</strong><div class="muted">diferență '+(diff>=0?'+':'−')+Math.abs(diff).toFixed(1)+' kcal</div>':'<div class="muted">Adaugă macronutrienții pentru estimare.</div>';const hints=[];if(macros&&cal&&diffPct>0.2)hints.push('<li class="warn">Caloriile diferă față de macronutrienți.</li>');if(base==='bucata'&&!gb&&!ml)hints.push('<li>Greutatea pe bucată ajută la conversii.</li>');if(!document.getElementById('p-tags')?.value)hints.push('<li>Adaugă taguri pentru căutare mai bună.</li>');tips.innerHTML=hints.length?hints.join(''):'<li>Valorile arată bine. Completează restul câmpurilor.</li>';status.textContent=macros?'Verifică diferența și salvează.':'Introdu valorile nutriționale.';status.className='pi-status '+(macros?(diffPct>0.2?'warn':'ok'):'muted');}
function buildTaxonomy(){const host=document.getElementById('tab-taxonomie');if(!host)return;const box=document.createElement('div');box.id='tax-extra';box.className='tax-extra';box.innerHTML='<div class="tax-card"><h3>Aliasuri</h3><div id="tax-alias"></div></div>';host.appendChild(box);}
function renderTaxonomy(){const alias=document.getElementById('tax-alias');if(!alias)return;if(typeof TAXONOMY==='undefined'){alias.textContent='Taxonomia nu este încărcată.';return;}const aliasEntries=Object.entries(TAXONOMY?.tag_aliases||{});const dup=new Map();aliasEntries.forEach(([base,list])=>{list.forEach(alias=>{const key=normalize(alias);if(!dup.has(key))dup.set(key,new Set());dup.get(key).add(base);});});const conflicts=Array.from(dup.values()).filter(set=>set.size>1).length;alias.textContent=aliasEntries.length+' taguri cu sinonime definite. '+(conflicts?'Atenție la '+conflicts+' conflicte.':'Nicio suprapunere detectată.');}
function buildAutosave(){const host=document.getElementById('tab-settings');if(!host)return;autoBox=document.createElement('div');autoBox.id='autosave-box';autoBox.className='autosave-box';autoBox.innerHTML='<div><strong>Status salvare automată</strong></div><div id="auto-mode"></div><div id="auto-last" class="muted"></div><ul id="auto-log"></ul>';host.appendChild(autoBox);}
function renderAutosave(){if(!autoBox)return;if(typeof AUTOSAVE==='undefined'){autoBox.querySelector('#auto-mode').textContent='Necunoscut';return;}autoBox.querySelector('#auto-mode').textContent=AUTOSAVE?'Activ':'Oprit';const last=autoLog[0];autoBox.querySelector('#auto-last').textContent=last?'Ultima salvare: '+relative(last.time)+(typeof dirHandle!=='undefined'&&dirHandle?' • folder selectat':''):'Încă nu au avut loc salvări în această sesiune.';const list=autoBox.querySelector('#auto-log');list.innerHTML='';autoLog.forEach(entry=>{const li=document.createElement('li');li.textContent=relative(entry.time)+' · '+entry.kind;list.appendChild(li);});}
function relative(ts){const diff=Math.max(0,Date.now()-ts);const min=Math.round(diff/60000);if(!min)return'chiar acum';if(min<60)return'acum '+min+' min';const h=Math.round(min/60);if(h<24)return'acum '+h+' h';return'acum '+Math.round(h/24)+' zile';}
function enhanceDropdown(){const dd=document.getElementById('jr-product-dropdown');if(!dd)return;const obs=new MutationObserver(()=>{dd.querySelectorAll('.dropdown-item').forEach(item=>{if(item.dataset.enhanced)return;const idx=Number(item.dataset.index);if(Number.isNaN(idx)||!filteredProducts[idx])return;const p=filteredProducts[idx];const info=document.createElement('div');info.className='dropdown-info';info.innerHTML='<span>'+formatVal(p.cal||0,'kcal')+'</span><span>'+formatVal(p.pro||0,'g')+' proteine</span><span>'+formatVal(p.carb||0,'g')+' carb.</span>';item.appendChild(info);item.dataset.enhanced='1';});});obs.observe(dd,{childList:true});}
function rebuildIndex(){clearTimeout(buildTimer);buildTimer=setTimeout(()=>{index=new Map();if(typeof getAllProducts==='undefined'){console.warn('getAllProducts not available yet');return;}getAllProducts().forEach(p=>{index.set(p.name,{name:normalize(p.name),tags:(p.tags||[]).map(normalize)});});},80);}
function normalize(text){try{return normalizeText(text||'');}catch(e){return(text||'').toString().toLowerCase();}}
function score(product,term){const entry=index.get(product.name);if(!entry)return normalize(product.name).includes(term)?10:0;let s=0;if(entry.name===term)s+=150;if(entry.name.startsWith(term))s+=70;if(entry.tags.includes(term))s+=40;if(entry.tags.some(t=>t.startsWith(term)))s+=20;if(entry.name.includes(term))s+=15;return s;}
function rank(term,list){const norm=normalize(term);if(!norm)return list;return list.map(p=>({p,score:score(p,norm)})).sort((a,b)=>b.score-a.score||a.p.name.localeCompare(b.p.name,undefined,{sensitivity:'base'})).map(x=>x.p);}
function patchCore(){if(typeof renderJournalForDate==='function'){const orig=renderJournalForDate;window.renderJournalForDate=function(date){const res=orig.apply(this,arguments);/*updateDashboard(date);*/renderPresets();return res;};}if(typeof selectProduct==='function'){const orig2=selectProduct;window.selectProduct=function(name){orig2.apply(this,arguments);updateProductInfo();};}if(typeof fsAutosave==='function'){const orig3=fsAutosave;window.fsAutosave=function(kind){const res=orig3.apply(this,arguments);autoLog.unshift({time:Date.now(),kind});autoLog=autoLog.slice(0,AUTOLIMIT);renderAutosave();return res;};}if(typeof saveJournalWithFS==='function'){const orig4=saveJournalWithFS;window.saveJournalWithFS=function(arr){const res=orig4.apply(this,arguments);/*updateDashboard(currentDate());*/return res;};}if(typeof saveTargetsWithFS==='function'){const orig5=saveTargetsWithFS;window.saveTargetsWithFS=function(obj){const res=orig5.apply(this,arguments);/*updateDashboard(currentDate());*/return res;};}if(typeof saveProductsWithFS==='function'){const orig6=saveProductsWithFS;window.saveProductsWithFS=function(arr){const res=orig6.apply(this,arguments);rebuildIndex();return res;};}if(typeof saveMenuItemsWithFS==='function'){const orig7=saveMenuItemsWithFS;window.saveMenuItemsWithFS=function(arr){const res=orig7.apply(this,arguments);rebuildIndex();return res;};}if(typeof searchProductsWithSynonyms==='function'){const orig8=searchProductsWithSynonyms;window.searchProductsWithSynonyms=function(term,products){const res=orig8.apply(this,arguments)||[];return rank(term,res);};}if(typeof renderTaxonomyManagement==='function'){const orig9=renderTaxonomyManagement;window.renderTaxonomyManagement=function(){const res=orig9.apply(this,arguments);renderTaxonomy();return res;};}}
})();
