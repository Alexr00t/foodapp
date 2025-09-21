// --------- Data layer (localStorage) ---------
const LS_KEYS = { 
  products: 'nutri_products_v1', 
  journal: 'nutri_journal_v1', 
  targets: 'nutri_targets_v1',
  restaurants: 'nutri_restaurants_v1',
  categories: 'nutri_categories_v1',
  menuItems: 'nutri_menu_items_v1'
};

function migrateProducts(arr){
  return (arr||[]).map(p=>{
    const hasCarb = p.carb != null;
    const hasGlu = p.glu != null;
    const carb = hasCarb ? p.carb : (hasGlu ? p.glu : 0);
    return { ...p, carb, glu: hasGlu ? p.glu : carb, fib: (p.fib==null? 0 : p.fib) };
  });
}

function loadProducts(){
  const raw = localStorage.getItem(LS_KEYS.products);
  if(raw){ try { return migrateProducts(JSON.parse(raw)); } catch(e){ console.warn(e); } }
  const samples = migrateProducts([
    {name:'Măr', base:'100g', gPerPiece:182, mlPerPiece:null, cal:52, fat:0.2, sat:0.0, carb:14.0, sug:10.4, fib:2.4, pro:0.3},
    {name:'Ou mediu', base:'bucata', gPerPiece:60, mlPerPiece:null, cal:78, fat:5.3, sat:1.6, carb:0.6, sug:0.6, fib:0.0, pro:6.3}
  ]);
  saveProductsWithFS(samples);
  return samples;
}
function saveProducts(arr){ localStorage.setItem(LS_KEYS.products, JSON.stringify(arr)); }

function loadJournal(){ const raw = localStorage.getItem(LS_KEYS.journal); if(raw){ try { return JSON.parse(raw); } catch(e){ console.warn(e); } } return []; }
function saveJournal(arr){ localStorage.setItem(LS_KEYS.journal, JSON.stringify(arr)); }

function defaultTargets(){ return { cal: 2000, fat: 70, sat: 20, carb: 260, sug: 50, fib: 30, pro: 130 }; }
function loadTargets(){
  const raw = localStorage.getItem(LS_KEYS.targets);
  if (raw) { try { return JSON.parse(raw); } catch (e) { console.warn(e); } }
  const t = defaultTargets(); saveTargets(t); return t;
}
function saveTargets(obj){ localStorage.setItem(LS_KEYS.targets, JSON.stringify(obj)); }

// Load new hierarchical data
function loadRestaurants(){
  const raw = localStorage.getItem(LS_KEYS.restaurants);
  if(raw){ try { return JSON.parse(raw); } catch(e){ console.warn(e); } }
  return [];
}
function saveRestaurants(arr){ localStorage.setItem(LS_KEYS.restaurants, JSON.stringify(arr)); }

function loadCategories(){
  const raw = localStorage.getItem(LS_KEYS.categories);
  if(raw){ try { return JSON.parse(raw); } catch(e){ console.warn(e); } }
  return [];
}
function saveCategories(arr){ localStorage.setItem(LS_KEYS.categories, JSON.stringify(arr)); }

function loadMenuItems(){
  const raw = localStorage.getItem(LS_KEYS.menuItems);
  if(raw){ try { return JSON.parse(raw); } catch(e){ console.warn(e); } }
  return [];
}
function saveMenuItems(arr){ localStorage.setItem(LS_KEYS.menuItems, JSON.stringify(arr)); }

function loadTaxonomy(){
  const raw = localStorage.getItem('nutri_taxonomy_v1');
  if(raw){ try { return JSON.parse(raw); } catch(e){ console.warn(e); } }
  
  // Load default taxonomy from file
  try {
    fetch('./taxonomy.json')
      .then(response => response.json())
      .then(data => {
        TAXONOMY = data;
        localStorage.setItem('nutri_taxonomy_v1', JSON.stringify(data));
      })
      .catch(() => {
        // Fallback to default taxonomy if file not found
        TAXONOMY = {
          tag_aliases: {
            "inghetata": ["înghețată", "inghetată", "gelato", "ice cream", "ice-cream"],
            "desert": ["desert", "deserturi", "dulce", "sweet", "dessert", "desserts"],
            "lactate": ["lactate", "lactos", "lacto", "dairy", "lapte", "iaurt", "brânză"],
            "carne": ["carne", "meat", "porc", "vita", "pui", "curcan", "șuncă"],
            "vegetale": ["vegetale", "vegetables", "legume", "salată", "roșii", "castraveți"],
            "fructe": ["fructe", "fruits", "măr", "banană", "portocală", "lămâie"],
            "cereale": ["cereale", "cereals", "ovăz", "orez", "grâu", "secară", "porumb"],
            "proteine": ["proteine", "protein", "proteic", "whey", "casein", "soia", "tofu"]
          },
          category_implies_tags: {
            "Dairy": ["lactate"],
            "Meat": ["carne"],
            "Vegetables": ["vegetale"],
            "Fruits": ["fructe"],
            "Grains": ["cereale"],
            "Protein": ["proteine"],
            "Desserts": ["desert"],
            "IceCream": ["inghetata", "desert"],
            "Dessert": ["desert"],
            "Sweets": ["desert", "dulce"]
          },
          normalization_rules: {
            "remove_diacritics": true,
            "lowercase": true,
            "remove_punctuation": true
          }
        };
        localStorage.setItem('nutri_taxonomy_v1', JSON.stringify(TAXONOMY));
      });
  } catch(e) {
    console.warn('Could not load taxonomy:', e);
  }
  
  return {
    tag_aliases: {},
    category_implies_tags: {},
    normalization_rules: { remove_diacritics: true, lowercase: true, remove_punctuation: true }
  };
}
function saveTaxonomy(obj){ localStorage.setItem('nutri_taxonomy_v1', JSON.stringify(obj)); }

let PRODUCTS = loadProducts();
let JOURNAL = loadJournal();
let TARGETS = loadTargets();
let RESTAURANTS = loadRestaurants();
let CATEGORIES = loadCategories();
let MENU_ITEMS = loadMenuItems();
let TAXONOMY = loadTaxonomy();

function fsAutosave(kind){ 
  if(dirHandle && AUTOSAVE){ 
    fsWrite(kind).catch(console.warn); 
  } 
}

// Update save functions to call fsAutosave after variables are declared
function saveProductsWithFS(arr){ 
  localStorage.setItem(LS_KEYS.products, JSON.stringify(arr)); 
  fsAutosave('products'); 
}

function saveJournalWithFS(arr){ 
  localStorage.setItem(LS_KEYS.journal, JSON.stringify(arr)); 
  fsAutosave('journal'); 
}

function saveTargetsWithFS(obj){ 
  localStorage.setItem(LS_KEYS.targets, JSON.stringify(obj)); 
  fsAutosave('targets'); 
}

function saveRestaurantsWithFS(arr){ 
  localStorage.setItem(LS_KEYS.restaurants, JSON.stringify(arr)); 
  fsAutosave('restaurants'); 
}

function saveCategoriesWithFS(arr){ 
  localStorage.setItem(LS_KEYS.categories, JSON.stringify(arr)); 
  fsAutosave('categories'); 
}

function saveMenuItemsWithFS(arr){ 
  localStorage.setItem(LS_KEYS.menuItems, JSON.stringify(arr)); 
  fsAutosave('menuItems'); 
}

// --------- File System Access API (folder mode) ---------
const HAS_FSA = 'showDirectoryPicker' in window;
let dirHandle = null;
let AUTOSAVE = true;
const FILES = { 
  products: 'products.json', 
  journal: 'journal.json', 
  targets: 'targets.json',
  restaurants: 'restaurants.json',
  categories: 'categories.json',
  menuItems: 'menu_items.json',
  taxonomy: 'taxonomy.json'
};

function setFsStatus(msg, ok=false){ 
  const el = document.getElementById('fs-status'); 
  el.textContent = ok ? '✅ ' + msg : '📂 ' + msg; 
  el.className = 'hint ' + (ok ? 'ok' : 'warnTxt'); 
}

async function fsPickFolder(){
  if(!HAS_FSA){ alert('Browserul tău nu suportă alegerea folderului direct. Folosește Export/Import.'); return; }
  try{
    dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    setFsStatus('✅ Folder selectat pentru salvare', true);
    await fsLoadFiles();
    
    // Show success message with folder info
    alert('✅ Folder selectat!\n\nAcum toate modificările tale vor fi salvate automat în acest folder.\n\nFișierele vor fi salvate ca:\n• products.json\n• journal.json\n• targets.json\n• restaurants.json\n• categories.json\n• menu_items.json');
  }catch(e){
    if(e?.name!=='AbortError') { console.warn(e); setFsStatus('📂 Niciun folder selectat', false); }
  }
}

function showCurrentFolderInfo(){
  // Show current folder information
  const currentFolderInfo = document.getElementById('current-folder-info');
  const currentFolderPath = document.getElementById('current-folder-path');
  
  if(window.location.protocol === 'file:') {
    // Running from file:// protocol
    const path = window.location.pathname;
    const folderPath = path.substring(0, path.lastIndexOf('/')) || '/';
    currentFolderPath.textContent = folderPath;
    currentFolderInfo.style.display = 'block';
  } else if(window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // Running from local server
    const path = window.location.pathname;
    const folderPath = path.substring(0, path.lastIndexOf('/')) || '/';
    currentFolderPath.textContent = `Server local: ${folderPath}`;
    currentFolderInfo.style.display = 'block';
  } else {
    currentFolderInfo.style.display = 'none';
  }
}

async function fsRead(name){
  if(!dirHandle) throw new Error('Nu este selectat niciun folder');
  const fh = await dirHandle.getFileHandle(FILES[name], { create: false });
  const file = await fh.getFile(); const text = await file.text(); return JSON.parse(text);
}

async function fsLoadFiles(){
  if(!dirHandle) return;
  try{ const data = migrateProducts(await fsRead('products')); if(Array.isArray(data)){ PRODUCTS = data; localStorage.setItem(LS_KEYS.products, JSON.stringify(PRODUCTS)); } }catch{}
  try{ const data = await fsRead('journal'); if(Array.isArray(data)){ JOURNAL = data; localStorage.setItem(LS_KEYS.journal, JSON.stringify(JOURNAL)); } }catch{}
  try{ const data = await fsRead('targets'); if(data && typeof data==='object'){ TARGETS = data; localStorage.setItem(LS_KEYS.targets, JSON.stringify(TARGETS)); } }catch{}
  try{ const data = await fsRead('restaurants'); if(Array.isArray(data)){ RESTAURANTS = data; localStorage.setItem(LS_KEYS.restaurants, JSON.stringify(RESTAURANTS)); } }catch{}
  try{ const data = await fsRead('categories'); if(Array.isArray(data)){ CATEGORIES = data; localStorage.setItem(LS_KEYS.categories, JSON.stringify(CATEGORIES)); } }catch{}
  try{ const data = await fsRead('menuItems'); if(Array.isArray(data)){ MENU_ITEMS = data; localStorage.setItem(LS_KEYS.menuItems, JSON.stringify(MENU_ITEMS)); } }catch{}
  try{ const data = await fsRead('taxonomy'); if(data && typeof data==='object'){ TAXONOMY = data; saveTaxonomy(TAXONOMY); } }catch{}
  fillProductDropdown(); fillRestaurantDropdowns(); fillCategoryDropdowns(); renderProducts(); renderJournalForDate(document.getElementById('jr-date').value); renderSummary(); fillTargetsForm(); compareRefreshAll();
}

async function fsWrite(name){
  if(!dirHandle) return;
  const fh = await dirHandle.getFileHandle(FILES[name], { create: true });
  const w = await fh.createWritable();
  const data = name==='products'?PRODUCTS: 
               name==='journal'?JOURNAL: 
               name==='targets'?TARGETS:
               name==='restaurants'?RESTAURANTS:
               name==='categories'?CATEGORIES:
               name==='menuItems'?MENU_ITEMS:
               name==='taxonomy'?TAXONOMY: null;
  if(data !== null) {
    await w.write(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
    await w.close();
  }
}

// Moved after variable declarations

// --------- Helpers ---------
const $ = sel => document.querySelector(sel);
function fmt1(n){ const num = Number(n||0); return num.toLocaleString(undefined,{minimumFractionDigits:1, maximumFractionDigits:1}); }
function fmt0(n){ return Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0}); }
function fmt(n){ return (n ?? 0).toLocaleString(undefined,{maximumFractionDigits:2}); }
function todayISO(){ const d=new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10); }
function formatDateUS(iso){ const d=new Date(iso); const mm=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); const yyyy=d.getFullYear(); return `${mm}/${dd}/${yyyy}`; }

// --------- Text Normalization and Tagging ---------
function normalizeText(text) {
  if (!text) return '';
  
  let normalized = text;
  
  // Remove diacritics
  if (TAXONOMY?.normalization_rules?.remove_diacritics) {
    normalized = normalized
      .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
      .replace(/ș/g, 's').replace(/ț/g, 't')
      .replace(/Ă/g, 'A').replace(/Â/g, 'A').replace(/Î/g, 'I')
      .replace(/Ș/g, 'S').replace(/Ț/g, 'T');
  }
  
  // Convert to lowercase
  if (TAXONOMY?.normalization_rules?.lowercase) {
    normalized = normalized.toLowerCase();
  }
  
  // Remove punctuation
  if (TAXONOMY?.normalization_rules?.remove_punctuation) {
    normalized = normalized.replace(/[^\w\s]/g, ' ');
  }
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

function findCanonicalTag(input) {
  if (!input || !TAXONOMY?.tag_aliases) return null;
  
  const normalizedInput = normalizeText(input);
  
  // Search through all tag aliases
  for (const [canonicalTag, aliases] of Object.entries(TAXONOMY.tag_aliases)) {
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedInput.includes(normalizedAlias) || normalizedAlias.includes(normalizedInput)) {
        return canonicalTag;
      }
    }
  }
  
  return null;
}

function autotagProduct(product, categoryName = null) {
  if (!product || !TAXONOMY) return product;
  
  let tags = product.tags || [];
  
  // Add tags from category
  if (categoryName && TAXONOMY.category_implies_tags) {
    const categoryTags = TAXONOMY.category_implies_tags[categoryName] || [];
    tags = [...new Set([...tags, ...categoryTags])];
  }
  
  // Add tags from product name and description
  const searchText = [product.name, product.description || ''].join(' ').toLowerCase();
  const normalizedSearchText = normalizeText(searchText);
  
  for (const [canonicalTag, aliases] of Object.entries(TAXONOMY.tag_aliases)) {
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedSearchText.includes(normalizedAlias)) {
        tags.push(canonicalTag);
        break; // Found a match for this canonical tag, move to next
      }
    }
  }
  
  // Remove duplicates
  tags = [...new Set(tags)];
  
  return { ...product, tags };
}

function searchProductsWithSynonyms(searchTerm, products) {
  if (!searchTerm || !TAXONOMY) {
    return products.filter(p => true); // Return all if no search term
  }
  
  const normalizedSearchTerm = normalizeText(searchTerm);
  const canonicalTag = findCanonicalTag(searchTerm);
  
  return products.filter(product => {
    // Direct name match
    const normalizedName = normalizeText(product.name);
    if (normalizedName.includes(normalizedSearchTerm)) {
      return true;
    }
    
    // Tag match
    if (product.tags && product.tags.length > 0) {
      for (const tag of product.tags) {
        const normalizedTag = normalizeText(tag);
        if (normalizedTag.includes(normalizedSearchTerm)) {
          return true;
        }
      }
    }
    
    // Canonical tag match
    if (canonicalTag && product.tags && product.tags.includes(canonicalTag)) {
      return true;
    }
    
    // Synonym match in tags
    if (TAXONOMY.tag_aliases) {
      for (const [canonicalTag, aliases] of Object.entries(TAXONOMY.tag_aliases)) {
        if (product.tags && product.tags.includes(canonicalTag)) {
          for (const alias of aliases) {
            const normalizedAlias = normalizeText(alias);
            if (normalizedAlias.includes(normalizedSearchTerm)) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  });
}

function getPopularTags(limit = 10) {
  const allProducts = getAllProducts();
  const tagCounts = {};
  
  allProducts.forEach(product => {
    if (product.tags && product.tags.length > 0) {
      product.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

function createTagChip(tag, count = null) {
  const chip = document.createElement('button');
  chip.className = 'tag-chip';
  chip.style.cssText = `
    display: inline-block;
    padding: 4px 8px;
    margin: 2px;
    background: var(--headerbg);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  `;
  
  chip.textContent = count ? `${tag} (${count})` : tag;
  chip.title = `Click pentru a căuta "${tag}"`;
  
  chip.addEventListener('click', () => {
    // Set the search input with this tag
    const searchInputs = [
      document.getElementById('jr-product-search'),
      document.getElementById('p-product-search'),
      document.getElementById('cmp-product-search')
    ];
    
    searchInputs.forEach(input => {
      if (input) {
        input.value = tag;
        // Trigger search
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });
  
  chip.addEventListener('mouseenter', () => {
    chip.style.backgroundColor = 'var(--accent)';
    chip.style.color = 'white';
  });
  
  chip.addEventListener('mouseleave', () => {
    chip.style.backgroundColor = 'var(--headerbg)';
    chip.style.color = '';
  });
  
  return chip;
}

function updatePopularTags() {
  const popularTags = getPopularTags(8);
  
  // Update journal tags
  const jrTagsContainer = document.getElementById('jr-tags-list');
  const jrTagsSection = document.getElementById('jr-popular-tags');
  if (jrTagsContainer && jrTagsSection) {
    jrTagsContainer.innerHTML = '';
    if (popularTags.length > 0) {
      jrTagsSection.style.display = 'block';
      popularTags.forEach(({ tag, count }) => {
        jrTagsContainer.appendChild(createTagChip(tag, count));
      });
    } else {
      jrTagsSection.style.display = 'none';
    }
  }
  
  // Update products tags
  const pTagsContainer = document.getElementById('p-tags-list');
  const pTagsSection = document.getElementById('p-popular-tags');
  if (pTagsContainer && pTagsSection) {
    pTagsContainer.innerHTML = '';
    if (popularTags.length > 0) {
      pTagsSection.style.display = 'block';
      popularTags.forEach(({ tag, count }) => {
        pTagsContainer.appendChild(createTagChip(tag, count));
      });
    } else {
      pTagsSection.style.display = 'none';
    }
  }
}

function autotagAllProducts() {
  if (!TAXONOMY || !TAXONOMY.tag_aliases) {
    alert('Taxonomia nu este încărcată. Încarcă mai întâi taxonomy.json.');
    return;
  }
  
  let updated = 0;
  
  // Autotag menu items
  MENU_ITEMS.forEach((menuItem, index) => {
    const category = getCategoryById(menuItem.categoryId);
    const categoryName = category ? category.name : null;
    const taggedItem = autotagProduct(menuItem, categoryName);
    
    if (JSON.stringify(taggedItem.tags) !== JSON.stringify(menuItem.tags)) {
      MENU_ITEMS[index] = taggedItem;
      updated++;
    }
  });
  
  // Autotag legacy products (add tags field if not present)
  PRODUCTS.forEach((product, index) => {
    if (!product.tags) {
      const taggedProduct = autotagProduct(product);
      PRODUCTS[index] = taggedProduct;
      updated++;
    }
  });
  
  if (updated > 0) {
    saveMenuItemsWithFS(MENU_ITEMS);
    saveProductsWithFS(PRODUCTS);
    renderProducts();
    updatePopularTags();
    alert(`Autotagging completat! ${updated} produse au fost actualizate cu taguri.`);
  } else {
    alert('Toate produsele au deja taguri actualizate.');
  }
}

// --------- Taxonomy Management ---------
function renderTaxonomyManagement() {
  if (!TAXONOMY) {
    TAXONOMY = loadTaxonomy();
  }
  
  renderTagAliases();
  renderCategoryMappings();
  renderTagStatistics();
  fillTaxonomyCategorySelect();
}

function renderTagAliases() {
  const container = document.getElementById('tax-aliases-list');
  if (!container || !TAXONOMY?.tag_aliases) return;
  
  container.innerHTML = '';
  
  Object.entries(TAXONOMY.tag_aliases).forEach(([canonicalTag, aliases]) => {
    const div = document.createElement('div');
    div.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      margin: 4px 0;
      background: var(--headerbg);
      border-radius: 4px;
      border: 1px solid var(--border);
    `;
    
    div.innerHTML = `
      <div>
        <strong>${canonicalTag}</strong>
        <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
          ${aliases.join(', ')}
        </div>
      </div>
      <button class="warn" data-remove-alias="${canonicalTag}" style="padding: 4px 8px; font-size: 12px;">
        Șterge
      </button>
    `;
    
    container.appendChild(div);
  });
}

function renderCategoryMappings() {
  const container = document.getElementById('tax-category-mappings-list');
  if (!container || !TAXONOMY?.category_implies_tags) return;
  
  container.innerHTML = '';
  
  Object.entries(TAXONOMY.category_implies_tags).forEach(([category, tags]) => {
    const div = document.createElement('div');
    div.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      margin: 4px 0;
      background: var(--headerbg);
      border-radius: 4px;
      border: 1px solid var(--border);
    `;
    
    div.innerHTML = `
      <div>
        <strong>${category}</strong>
        <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
          → ${tags.join(', ')}
        </div>
      </div>
      <button class="warn" data-remove-mapping="${category}" style="padding: 4px 8px; font-size: 12px;">
        Șterge
      </button>
    `;
    
    container.appendChild(div);
  });
}

function renderTagStatistics() {
  const container = document.getElementById('tax-tag-stats');
  if (!container) return;
  
  const allProducts = getAllProducts();
  const tagCounts = {};
  
  allProducts.forEach(product => {
    if (product.tags && product.tags.length > 0) {
      product.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  container.innerHTML = '';
  
  if (Object.keys(tagCounts).length === 0) {
    container.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 16px;">Niciun tag folosit încă</div>';
    return;
  }
  
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      const div = document.createElement('div');
      div.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        margin: 2px 0;
        background: var(--bg);
        border-radius: 4px;
        border: 1px solid var(--border);
      `;
      
      div.innerHTML = `
        <span>${tag}</span>
        <span style="background: var(--accent); color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">
          ${count}
        </span>
      `;
      
      container.appendChild(div);
    });
}

function fillTaxonomyCategorySelect() {
  const select = document.getElementById('tax-category-select');
  if (!select) return;
  
  const current = select.value;
  select.innerHTML = '<option value="">Selectează categorie...</option>';
  
  CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = `${category.icon} ${category.name}`;
    select.appendChild(option);
  });
  
  if (current && CATEGORIES.some(c => c.id === current)) {
    select.value = current;
  }
}

function addTagAlias() {
  const canonicalTag = document.getElementById('tax-canonical-tag').value.trim();
  const aliasesText = document.getElementById('tax-aliases').value.trim();
  
  if (!canonicalTag || !aliasesText) {
    alert('Completează ambele câmpuri!');
    return;
  }
  
  if (!TAXONOMY) {
    TAXONOMY = { tag_aliases: {}, category_implies_tags: {}, normalization_rules: {} };
  }
  
  if (!TAXONOMY.tag_aliases) {
    TAXONOMY.tag_aliases = {};
  }
  
  const aliases = aliasesText.split(',').map(a => a.trim()).filter(a => a);
  
  if (aliases.length === 0) {
    alert('Introdu cel puțin un sinonim!');
    return;
  }
  
  TAXONOMY.tag_aliases[canonicalTag] = aliases;
  
  // Clear form
  document.getElementById('tax-canonical-tag').value = '';
  document.getElementById('tax-aliases').value = '';
  
  // Refresh display
  renderTagAliases();
}

function addCategoryMapping() {
  const categoryId = document.getElementById('tax-category-select').value;
  const tagsText = document.getElementById('tax-category-tags').value.trim();
  
  if (!categoryId || !tagsText) {
    alert('Selectează o categorie și introdu tagurile!');
    return;
  }
  
  const category = getCategoryById(categoryId);
  if (!category) {
    alert('Categoria selectată nu există!');
    return;
  }
  
  if (!TAXONOMY) {
    TAXONOMY = { tag_aliases: {}, category_implies_tags: {}, normalization_rules: {} };
  }
  
  if (!TAXONOMY.category_implies_tags) {
    TAXONOMY.category_implies_tags = {};
  }
  
  const tags = tagsText.split(',').map(t => t.trim()).filter(t => t);
  
  if (tags.length === 0) {
    alert('Introdu cel puțin un tag!');
    return;
  }
  
  TAXONOMY.category_implies_tags[category.name] = tags;
  
  // Clear form
  document.getElementById('tax-category-select').value = '';
  document.getElementById('tax-category-tags').value = '';
  
  // Refresh display
  renderCategoryMappings();
}

function removeTagAlias(canonicalTag) {
  if (!TAXONOMY?.tag_aliases) return;
  
  if (confirm(`Ștergi tag-ul canonic "${canonicalTag}" și toate sinonimele sale?`)) {
    delete TAXONOMY.tag_aliases[canonicalTag];
    renderTagAliases();
  }
}

function removeCategoryMapping(category) {
  if (!TAXONOMY?.category_implies_tags) return;
  
  if (confirm(`Ștergi maparea pentru categoria "${category}"?`)) {
    delete TAXONOMY.category_implies_tags[category];
    renderCategoryMappings();
  }
}

function saveTaxonomyChanges() {
  if (!TAXONOMY) {
    alert('Nu există modificări de salvat!');
    return;
  }
  
  saveTaxonomy(TAXONOMY);
  alert('Taxonomia a fost salvată!');
}

function exportTaxonomy() {
  if (!TAXONOMY) {
    alert('Nu există taxonomie de exportat!');
    return;
  }
  
  const blob = new Blob([JSON.stringify(TAXONOMY, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'taxonomy.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importTaxonomy() {
  document.getElementById('tax-import-file').click();
}

function handleTaxonomyImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      
      // Validate structure
      if (typeof imported !== 'object') {
        throw new Error('Fișierul nu conține un obiect valid');
      }
      
      TAXONOMY = {
        tag_aliases: imported.tag_aliases || {},
        category_implies_tags: imported.category_implies_tags || {},
        normalization_rules: imported.normalization_rules || {
          remove_diacritics: true,
          lowercase: true,
          remove_punctuation: true
        }
      };
      
      saveTaxonomy(TAXONOMY);
      renderTaxonomyManagement();
      alert('Taxonomia a fost importată cu succes!');
      
    } catch (error) {
      alert('Eroare la importarea taxonomiei: ' + error.message);
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

function testTaxonomySearch() {
  const searchTerm = document.getElementById('tax-test-search').value.trim();
  const resultsContainer = document.getElementById('tax-search-results');
  
  if (!searchTerm) {
    alert('Introdu un termen de căutare!');
    return;
  }
  
  const allProducts = getAllProducts();
  const results = searchProductsWithSynonyms(searchTerm, allProducts);
  
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'block';
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div style="color: var(--muted);">Nu s-au găsit produse pentru termenul "' + searchTerm + '"</div>';
    return;
  }
  
  const canonicalTag = findCanonicalTag(searchTerm);
  let info = `<div style="margin-bottom: 8px; font-size: 12px; color: var(--muted);">`;
  info += `Termen: "${searchTerm}"`;
  if (canonicalTag) {
    info += ` → Tag canonic: "${canonicalTag}"`;
  }
  info += ` | Rezultate: ${results.length}</div>`;
  
  results.forEach(product => {
    const div = document.createElement('div');
    div.style.cssText = `
      padding: 6px 8px;
      margin: 2px 0;
      background: var(--bg);
      border-radius: 4px;
      border: 1px solid var(--border);
    `;
    
    const tagsText = product.tags && product.tags.length > 0 ? 
      ` | Taguri: ${product.tags.join(', ')}` : '';
    
    div.innerHTML = `<strong>${product.name}</strong>${tagsText}`;
    resultsContainer.appendChild(div);
  });
  
  resultsContainer.insertAdjacentHTML('afterbegin', info);
}
function productByName(name){ 
  // First check legacy products
  const legacyProduct = PRODUCTS.find(p=>p.name===name);
  if(legacyProduct) return legacyProduct;
  
  // Then check menu items
  const menuItem = MENU_ITEMS.find(m=>m.name===name);
  if(menuItem) return menuItemToProduct(menuItem);
  
  return null;
}

// New hierarchical helper functions
function getRestaurantById(id){ return RESTAURANTS.find(r=>r.id===id); }
function getCategoryById(id){ return CATEGORIES.find(c=>c.id===id); }
function getMenuItemsByRestaurant(restaurantId){ return MENU_ITEMS.filter(m=>m.restaurantId===restaurantId); }
function getMenuItemsByCategory(categoryId){ return MENU_ITEMS.filter(m=>m.categoryId===categoryId); }
function getMenuItemsByRestaurantAndCategory(restaurantId, categoryId){ 
  return MENU_ITEMS.filter(m=>m.restaurantId===restaurantId && m.categoryId===categoryId); 
}

// Convert menu item to product format for compatibility
function menuItemToProduct(menuItem){
  return {
    name: menuItem.name,
    base: menuItem.base,
    gPerPiece: menuItem.gPerPiece,
    mlPerPiece: menuItem.mlPerPiece,
    cal: menuItem.cal ?? null,
    fat: menuItem.fat ?? null,
    sat: menuItem.sat ?? null,
    carb: menuItem.carb ?? null,
    sug: menuItem.sug ?? null,
    fib: menuItem.fib ?? null,
    pro: menuItem.pro ?? null,
    glu: menuItem.glu ?? menuItem.carb ?? null,
    tags: menuItem.tags || [] // Include tags for search functionality
  };
}

// Get all products (legacy + menu items)
function getAllProducts(){
  const legacyProducts = PRODUCTS || [];
  const menuProducts = MENU_ITEMS.map(menuItemToProduct);
  return [...legacyProducts, ...menuProducts];
}

function calcFactor(entry){
  const p = productByName(entry.product); if(!p) return { factor:0 };
  const unit = entry.unit; const qty = Number(entry.qty)||0;
  if(p.base==='bucata'){
    if(unit==='buc') return { factor: qty };
    if(unit==='g' && p.gPerPiece) return { factor: qty / p.gPerPiece };
    if(unit==='ml' && p.mlPerPiece) return { factor: qty / p.mlPerPiece };
    return { factor: 0 };
  }
  if(p.base==='100g'){
    if(unit==='g') return { factor: qty/100 };
    if(unit==='buc' && p.gPerPiece) return { factor: (qty*p.gPerPiece)/100 };
    return { factor: 0 };
  }
  if(p.base==='100ml'){
    if(unit==='ml') return { factor: qty/100 };
    if(unit==='buc' && p.mlPerPiece) return { factor: (qty*p.mlPerPiece)/100 };
    return { factor: 0 };
  }
  return { factor: 0 };
}

function calcNutrients(entry){
  const p = productByName(entry.product); if(!p) return null;
  const { factor } = calcFactor(entry); const mult = factor;
  return { cal:(p.cal||0)*mult, fat:(p.fat||0)*mult, sat:(p.sat||0)*mult, carb:(p.carb||0)*mult, sug:(p.sug||0)*mult, fib:(p.fib||0)*mult, pro:(p.pro||0)*mult };
}

// --------- Tabs ---------
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.getAttribute('data-tab');
    ['jurnal','produse','sumar','tinte','compara','taxonomie','settings'].forEach(id=>{
      const sec = document.getElementById('tab-'+id);
      if(sec) sec.hidden = id!==key;
    });
    if(key==='jurnal') renderJournalForDate(document.getElementById('jr-date').value||todayISO());
    if(key==='produse') renderProducts();
    if(key==='sumar') renderSummary();
    if(key==='tinte') fillTargetsForm();
    if(key==='compara') compareRefreshAll();
    if(key==='taxonomie') renderTaxonomyManagement();
  });
});

// --------- Jurnal ---------
function fillJournalRestaurantDropdown(){
  const container = document.getElementById('jr-restaurant-dropdown');
  if(!container) return;
  
  container.innerHTML = '';
  
  // Add "Toate" master checkbox
  const masterLabel = document.createElement('label');
  masterLabel.style.display = 'flex';
  masterLabel.style.alignItems = 'center';
  masterLabel.style.gap = '8px';
  masterLabel.style.fontSize = '14px';
  masterLabel.style.cursor = 'pointer';
  masterLabel.style.padding = '4px 0';
  masterLabel.style.borderBottom = '1px solid var(--border)';
  masterLabel.style.marginBottom = '4px';
  masterLabel.style.fontWeight = '500';
  
  const masterCheckbox = document.createElement('input');
  masterCheckbox.type = 'checkbox';
  masterCheckbox.id = 'master-restaurant-checkbox';
  masterCheckbox.checked = true; // All selected by default
  masterCheckbox.addEventListener('change', () => {
    const isChecked = masterCheckbox.checked;
    // Select/deselect all restaurant checkboxes
    const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#master-restaurant-checkbox)');
    restaurantCheckboxes.forEach(cb => cb.checked = isChecked);
    
    updateRestaurantButtonText();
    fillProductDropdown();
  });
  
  const masterSpan = document.createElement('span');
  masterSpan.textContent = '✅ Toate';
  
  masterLabel.appendChild(masterCheckbox);
  masterLabel.appendChild(masterSpan);
  container.appendChild(masterLabel);
  
  // Add individual restaurant checkboxes
  RESTAURANTS.forEach(r => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontSize = '14px';
    label.style.cursor = 'pointer';
    label.style.padding = '4px 0';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = r.id;
    checkbox.checked = true; // All selected by default
    checkbox.addEventListener('change', () => {
      updateMasterCheckbox();
      updateRestaurantButtonText();
      fillProductDropdown();
    });
    
    const span = document.createElement('span');
    span.textContent = `${r.icon} ${r.name}`;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    container.appendChild(label);
  });
  
  updateRestaurantButtonText();
}

function updateMasterCheckbox(){
  const masterCheckbox = document.getElementById('master-restaurant-checkbox');
  const container = document.getElementById('jr-restaurant-dropdown');
  if(!masterCheckbox || !container) return;
  
  const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#master-restaurant-checkbox)');
  const checkedCount = Array.from(restaurantCheckboxes).filter(cb => cb.checked).length;
  
  if(checkedCount === 0) {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = false;
  } else if(checkedCount === restaurantCheckboxes.length) {
    masterCheckbox.checked = true;
    masterCheckbox.indeterminate = false;
  } else {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = true;
  }
}

function updateRestaurantButtonText(){
  const selectedRestaurants = getSelectedRestaurants();
  const btnText = document.getElementById('jr-restaurant-btn-text');
  
  if(!btnText) return;
  
  if(selectedRestaurants.length === 0) {
    btnText.textContent = '🏪 Niciun restaurant';
  } else if(selectedRestaurants.length === RESTAURANTS.length) {
    btnText.textContent = '🏪 Toate restaurantele';
  } else if(selectedRestaurants.length === 1) {
    const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurants[0]);
    btnText.textContent = restaurant ? `${restaurant.icon} ${restaurant.name}` : '🏪 1 restaurant';
  } else {
    btnText.textContent = `🏪 ${selectedRestaurants.length} restaurante`;
  }
}

function toggleRestaurantDropdown(){
  const dropdown = document.getElementById('jr-restaurant-dropdown');
  if(!dropdown) return;
  
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';
}

function hideRestaurantDropdown(){
  const dropdown = document.getElementById('jr-restaurant-dropdown');
  if(dropdown) {
    dropdown.style.display = 'none';
  }
}

function fillJournalCategoryDropdown(){
  const sel = $('#jr-filter-category');
  if(!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">Toate categoriile</option>';
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    sel.appendChild(opt);
  });
  if(current && CATEGORIES.some(c => c.id === current)) sel.value = current;
}

function clearJournalFilters(){
  // Clear category filter
  document.getElementById('jr-filter-category').value = '';
  
  // Clear search
  document.getElementById('jr-product-search').value = '';
  
  // Select all restaurants
  const checkboxes = document.querySelectorAll('#jr-restaurant-dropdown input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
  updateMasterCheckbox();
  updateRestaurantButtonText();
  
  // Clear selected product
  currentSelectedProduct = null;
  const selectedDiv = document.getElementById('jr-selected-product');
  if(selectedDiv) {
    selectedDiv.innerHTML = '<span style="color:var(--muted);">Niciun produs selectat</span>';
  }
  
  hideProductDropdown();
  hideRestaurantDropdown();
  fillProductDropdown();
}

function updateRecentProducts(){
  // Obține produsele din ultimele 7 zile
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString().slice(0, 10);
  
  const recentEntries = JOURNAL.filter(entry => entry.date >= sevenDaysAgoISO);
  
  // Grupează după produs și numără frecvența
  const productCounts = {};
  recentEntries.forEach(entry => {
    productCounts[entry.product] = (productCounts[entry.product] || 0) + 1;
  });
  
  // Sortează după frecvență și ia primele 8
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([product, count]) => ({ product, count }));
  
  const recentContainer = $('#jr-recent-products');
  const recentList = $('#jr-recent-list');
  
  if(topProducts.length > 0) {
    recentContainer.style.display = 'block';
    recentList.innerHTML = '';
    
    topProducts.forEach(({ product, count }) => {
      const btn = document.createElement('button');
      btn.className = 'ghost';
      btn.style.cssText = 'font-size:11px;padding:4px 8px;margin:0;';
      btn.textContent = `${product} (${count}×)`;
      btn.title = `Click pentru a selecta ${product}`;
      btn.addEventListener('click', () => {
        $('#jr-product').value = product;
        updateBaseHint();
        $('#jr-qty').focus();
      });
      recentList.appendChild(btn);
    });
  } else {
    recentContainer.style.display = 'none';
  }
}

function selectRecentProduct(productName){
  $('#jr-product').value = productName;
  updateBaseHint();
  $('#jr-qty').focus();
}

// Global variables for the new search functionality
let currentSelectedProduct = null;
let filteredProducts = [];
let selectedDropdownIndex = -1; // Track which item is highlighted in dropdown

function fillProductDropdown(){
  const searchInput = document.getElementById('jr-product-search');
  const dropdown = document.getElementById('jr-product-dropdown');
  const countEl = document.getElementById('jr-product-count');
  
  if(!searchInput || !dropdown) return;
  
  const searchTerm = (searchInput.value || '').trim().toLowerCase();
  const categoryFilter = document.getElementById('jr-filter-category')?.value || '';
  const selectedRestaurants = getSelectedRestaurants();
  
  // Get all products (legacy + menu items)
  const allProducts = getAllProducts();
  
  // Filter products
  filteredProducts = allProducts;
  
  // Apply enhanced search filter with synonyms
  if(searchTerm) {
    filteredProducts = searchProductsWithSynonyms(searchTerm, filteredProducts);
  }
  
  // Apply restaurant filter
  if(selectedRestaurants.length > 0) {
    filteredProducts = filteredProducts.filter(p => {
      const menuItem = MENU_ITEMS.find(m => m.name === p.name);
      if(menuItem) {
        return selectedRestaurants.includes(menuItem.restaurantId);
      } else {
        return selectedRestaurants.includes('default');
      }
    });
  }
  
  // Apply category filter
  if(categoryFilter) {
    filteredProducts = filteredProducts.filter(p => {
      const menuItem = MENU_ITEMS.find(m => m.name === p.name);
      if(menuItem) {
        return menuItem.categoryId === categoryFilter;
      } else {
        return categoryFilter === 'general';
      }
    });
  }
  
  // Update product count
  if(countEl) {
    countEl.textContent = `${filteredProducts.length} produse disponibile`;
  }
  
  // Show/hide dropdown based on search term and results
  if(filteredProducts.length > 0) {
    showProductDropdown();
    // Auto-highlight first item when dropdown appears
    if(selectedDropdownIndex === -1) {
      highlightDropdownItem(0);
    }
  } else {
    hideProductDropdown();
  }
}

function showProductDropdown(){
  const dropdown = document.getElementById('jr-product-dropdown');
  if(!dropdown) return;
  
  dropdown.innerHTML = '';
  selectedDropdownIndex = -1; // Reset selection
  
  // Show all products - no limit
  const displayProducts = filteredProducts;
  
  displayProducts.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'dropdown-item';
    div.dataset.index = index;
    div.style.padding = '8px 12px';
    div.style.cursor = 'pointer';
    div.style.borderBottom = '1px solid var(--border)';
    div.style.fontSize = '14px';
    div.style.transition = 'background-color 0.1s ease';
    
    // Find restaurant and category info
    const menuItem = MENU_ITEMS.find(m => m.name === p.name);
    let displayName = p.name;
    let restaurantName = 'Băcănie';
    let categoryName = 'General';
    
    if(menuItem) {
      const restaurant = RESTAURANTS.find(r => r.id === menuItem.restaurantId);
      const category = CATEGORIES.find(c => c.id === menuItem.categoryId);
      restaurantName = restaurant?.name || 'Unknown';
      categoryName = category?.name || 'Unknown';
    }
    
    div.innerHTML = `
      <div style="font-weight:500;">${p.name}</div>
      <div style="font-size:12px;color:var(--muted);">${restaurantName} • ${categoryName}</div>
    `;
    
    // Hover effects
    div.addEventListener('mouseenter', () => {
      // Remove highlight from other items
      document.querySelectorAll('.dropdown-item').forEach(item => {
        item.style.backgroundColor = 'transparent';
      });
      div.style.backgroundColor = 'var(--headerbg)';
      selectedDropdownIndex = index;
    });
    div.addEventListener('mouseleave', () => {
      // Don't change background on mouse leave if this item is selected
      if(selectedDropdownIndex !== index) {
        div.style.backgroundColor = 'transparent';
      }
    });
    
    // Click to select
    div.addEventListener('click', () => {
      selectProduct(p.name);
    });
    
    dropdown.appendChild(div);
  });
  
  dropdown.style.display = 'block';
}

function hideProductDropdown(){
  const dropdown = document.getElementById('jr-product-dropdown');
  if(dropdown) {
    dropdown.style.display = 'none';
  }
  selectedDropdownIndex = -1;
}

function highlightDropdownItem(index) {
  const items = document.querySelectorAll('.dropdown-item');
  if(!items.length) return;
  
  // Remove highlight from all items
  items.forEach(item => {
    item.style.backgroundColor = 'transparent';
  });
  
  // Clamp index to valid range
  const maxIndex = items.length - 1;
  selectedDropdownIndex = Math.max(0, Math.min(index, maxIndex));
  
  // Highlight the selected item
  if(items[selectedDropdownIndex]) {
    items[selectedDropdownIndex].style.backgroundColor = 'var(--headerbg)';
    // Scroll into view if needed
    items[selectedDropdownIndex].scrollIntoView({ block: 'nearest' });
  }
}

function selectHighlightedProduct() {
  if(selectedDropdownIndex >= 0 && filteredProducts[selectedDropdownIndex]) {
    const product = filteredProducts[selectedDropdownIndex];
    selectProduct(product.name);
  }
}

function selectProduct(productName){
  currentSelectedProduct = productName;
  
  // Update the selected product display
  const selectedDiv = document.getElementById('jr-selected-product');
  if(selectedDiv) {
    const product = getAllProducts().find(p => p.name === productName);
    if(product) {
      const menuItem = MENU_ITEMS.find(m => m.name === productName);
      let restaurantName = 'Băcănie';
      let categoryName = 'General';
      
      if(menuItem) {
        const restaurant = RESTAURANTS.find(r => r.id === menuItem.restaurantId);
        const category = CATEGORIES.find(c => c.id === menuItem.categoryId);
        restaurantName = restaurant?.name || 'Unknown';
        categoryName = category?.name || 'Unknown';
      }
      
      selectedDiv.innerHTML = `
        <div style="font-weight:500;">${productName}</div>
        <div style="font-size:12px;color:var(--muted);">${restaurantName} • ${categoryName}</div>
      `;
    }
  }
  
  // Auto-select the unit based on product's base unit
  const product = getAllProducts().find(p => p.name === productName);
  if(product) {
    const unitSelect = document.getElementById('jr-unit');
    if(unitSelect) {
      // Map product base to unit selection
      let selectedUnit = 'g'; // default
      
      switch(product.base) {
        case '100g':
          selectedUnit = 'g';
          break;
        case '100ml':
          selectedUnit = 'ml';
          break;
        case 'bucata':
          selectedUnit = 'buc';
          break;
        default:
          selectedUnit = 'g';
      }
      
      unitSelect.value = selectedUnit;
    }
  }
  
  // Update base hint
  updateBaseHint();
  
  // Clear search and hide dropdown
  const searchInput = document.getElementById('jr-product-search');
  if(searchInput) {
    searchInput.value = '';
  }
  hideProductDropdown();
  
  // Focus on quantity input
  document.getElementById('jr-qty')?.focus();
}

function getSelectedRestaurants(){
  const checkboxes = document.querySelectorAll('#jr-restaurant-dropdown input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function updateBaseHint(){
  const name = currentSelectedProduct; const p = productByName(name);
  if(!p){ $('#jr-base-hint').textContent=''; return; }
  const extra = p.base==='bucata'
    ? ` | ${p.gPerPiece?`~${p.gPerPiece} g/buc`:''}${p.mlPerPiece?` ~${p.mlPerPiece} ml/buc`:''}`
    : '';
  $('#jr-base-hint').innerHTML = `<span class="badgelike">UM bază: ${p.base.replace('100g','100 g').replace('100ml','100 ml')}</span>${extra}`;
}

function pieHTML(pRaw){
  const baseFrac = Math.max(0, Math.min(1, pRaw));
  const overFrac = Math.max(0, pRaw - 1);
  const baseDeg = Math.round(baseFrac * 360);
  const overDeg = Math.min(360, Math.round(overFrac * 360));
  const label = Math.round(pRaw * 100) + '%';
  const baseBG = `conic-gradient(var(--accent) 0 ${baseDeg}deg, var(--headerbg) ${baseDeg}deg 360deg)`;
  const start = (baseDeg % 360);
  const end = Math.min(360, start + overDeg);
  const overLayer = overDeg > 0
    ? `<div class="pie-over" style="background:
         conic-gradient(
           transparent 0 ${start}deg,
           var(--red) ${start}deg ${end}deg,
           transparent ${end}deg 360deg
         )"></div>`
    : '';
  return `<div class="pie-wrap">
            <div class="pie" style="background:${baseBG}">
              ${overLayer}
              <span class="pct">${label}</span>
            </div>
          </div>`;
}

function pieCell(key, val){
  const goal = TARGETS[key]||0;
  const pRaw = (!goal || goal<=0) ? 0 : (val/goal);
  return `<td class="right">${pieHTML(pRaw)}</td>`;
}

function renderJournalForDate(dateISO){
  $('#jr-date').value = dateISO;
  document.getElementById('jr-title').textContent = 'Intrari pentru ' + formatDateUS(dateISO);
  fillProductDropdown();
  updateBaseHint();
  updateRecentProducts();

  const tbody = $('#jr-tbody');
  const tbodyTot = $('#jr-totals');
  const tbodyPies = $('#jr-pies');
  tbody.innerHTML=''; tbodyTot.innerHTML=''; tbodyPies.innerHTML='';

  const rows = JOURNAL.filter(x=>x.date===dateISO);
  let t={cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0};

  rows.forEach((r)=>{
    const n = calcNutrients(r) || {cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0};
    t.cal+=n.cal; t.fat+=n.fat; t.sat+=n.sat; t.carb+=n.carb; t.sug+=n.sug; t.fib+=n.fib; t.pro+=n.pro;
  });

  const trGoal=document.createElement('tr');
  trGoal.className='goal';
  trGoal.innerHTML = `
    <td class="right sticky" colspan="3"><strong>Target zi</strong></td>
    <td class="right sticky">${fmt0(TARGETS.cal||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.fat||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.sat||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.carb||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.sug||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.fib||0)}</td>
    <td class="right sticky">${fmt0(TARGETS.pro||0)}</td>
    <td class="sticky"></td>`;
  tbodyTot.appendChild(trGoal);

  const trTot=document.createElement('tr');
  trTot.innerHTML = `<td class="right sticky" colspan="3"><strong>Total zi</strong></td>
                     <td class="right sticky">${fmt0(t.cal)}</td>
                     <td class="right sticky">${fmt0(t.fat)}</td>
                     <td class="right sticky">${fmt0(t.sat)}</td>
                     <td class="right sticky">${fmt0(t.carb)}</td>
                     <td class="right sticky">${fmt0(t.sug)}</td>
                     <td class="right sticky">${fmt0(t.fib)}</td>
                     <td class="right sticky">${fmt0(t.pro)}</td>
                     <td class="sticky"></td>`;
  tbodyTot.appendChild(trTot);

  const trPie=document.createElement('tr');
  trPie.innerHTML = `
    <td></td><td></td><td></td>
    ${pieCell('cal', t.cal)}
    ${pieCell('fat', t.fat)}
    ${pieCell('sat', t.sat)}
    ${pieCell('carb', t.carb)}
    ${pieCell('sug', t.sug)}
    ${pieCell('fib', t.fib)}
    ${pieCell('pro', t.pro)}
    <td></td>`;
  tbodyPies.appendChild(trPie);

  rows.slice()
      .sort((a,b)=> (b.ts||0) - (a.ts||0) || (b.id||'').localeCompare(a.id||''))
      .forEach((r)=>{
        const n = calcNutrients(r) || {cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0};
        const tr=document.createElement('tr');
        tr.innerHTML = `
          <td>${r.product}</td>
          <td class="right">${fmt1(r.qty)}</td>
          <td>${r.unit}</td>
          <td class="right">${fmt1(n.cal)}</td>
          <td class="right">${fmt1(n.fat)}</td>
          <td class="right">${fmt1(n.sat)}</td>
          <td class="right">${fmt1(n.carb)}</td>
          <td class="right">${fmt1(n.sug)}</td>
          <td class="right">${fmt1(n.fib)}</td>
          <td class="right">${fmt1(n.pro)}</td>
          <td class="right"><button class="warn" data-del="${r.id}">Șterge</button></td>`;
        tbody.appendChild(tr);
      });
}

document.getElementById('jr-date').addEventListener('change', e=> renderJournalForDate(e.target.value));

// Event listeners pentru filtrele din jurnal
document.getElementById('jr-filter-category')?.addEventListener('change', fillProductDropdown);
document.getElementById('jr-product-search')?.addEventListener('input', fillProductDropdown);
document.getElementById('jr-product-search')?.addEventListener('focus', fillProductDropdown);
document.getElementById('jr-clear-filters')?.addEventListener('click', clearJournalFilters);

// Restaurant dropdown event listeners
document.getElementById('jr-restaurant-dropdown-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleRestaurantDropdown();
});

// Keyboard navigation for product search
document.getElementById('jr-product-search')?.addEventListener('keydown', (e) => {
  const dropdown = document.getElementById('jr-product-dropdown');
  if(!dropdown || dropdown.style.display === 'none') return;
  
  const items = document.querySelectorAll('.dropdown-item');
  if(!items.length) return;
  
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if(selectedDropdownIndex < items.length - 1) {
        highlightDropdownItem(selectedDropdownIndex + 1);
      } else {
        highlightDropdownItem(0); // Wrap to first item
      }
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if(selectedDropdownIndex > 0) {
        highlightDropdownItem(selectedDropdownIndex - 1);
      } else {
        highlightDropdownItem(items.length - 1); // Wrap to last item
      }
      break;
      
    case 'Enter':
      e.preventDefault();
      selectHighlightedProduct();
      break;
      
    case 'Escape':
      e.preventDefault();
      hideProductDropdown();
      break;
  }
});

// Add click outside to close dropdowns
document.addEventListener('click', (e) => {
  const searchInput = document.getElementById('jr-product-search');
  const productDropdown = document.getElementById('jr-product-dropdown');
  const restaurantBtn = document.getElementById('jr-restaurant-dropdown-btn');
  const restaurantDropdown = document.getElementById('jr-restaurant-dropdown');
  
  // Close journal product dropdown
  if(searchInput && productDropdown && !searchInput.contains(e.target) && !productDropdown.contains(e.target)) {
    hideProductDropdown();
  }
  
  // Close journal restaurant dropdown
  if(restaurantBtn && restaurantDropdown && !restaurantBtn.contains(e.target) && !restaurantDropdown.contains(e.target)) {
    hideRestaurantDropdown();
  }
  
  // Close products page dropdowns
  const pSearchInput = document.getElementById('p-product-search');
  const pProductDropdown = document.getElementById('p-product-dropdown');
  const pRestaurantBtn = document.getElementById('p-restaurant-dropdown-btn');
  const pRestaurantDropdown = document.getElementById('p-restaurant-dropdown');
  
  // Close products product dropdown
  if(pSearchInput && pProductDropdown && !pSearchInput.contains(e.target) && !pProductDropdown.contains(e.target)) {
    hidePProductDropdown();
  }
  
  // Close products restaurant dropdown
  if(pRestaurantBtn && pRestaurantDropdown && !pRestaurantBtn.contains(e.target) && !pRestaurantDropdown.contains(e.target)) {
    hidePRestaurantDropdown();
  }
  
  // Close compare page dropdowns
  const cmpRestaurantBtn = document.getElementById('cmp-restaurant-dropdown-btn');
  const cmpRestaurantDropdown = document.getElementById('cmp-restaurant-dropdown');
  
  // Close compare restaurant dropdown
  if(cmpRestaurantBtn && cmpRestaurantDropdown && !cmpRestaurantBtn.contains(e.target) && !cmpRestaurantDropdown.contains(e.target)) {
    hideCmpRestaurantDropdown();
  }
});

document.getElementById('jr-add').addEventListener('click', ()=>{
  const date = document.getElementById('jr-date').value || todayISO();
  const product = currentSelectedProduct; // Use the selected product from new UI
  const qty = parseFloat(document.getElementById('jr-qty').value);
  const unit = document.getElementById('jr-unit').value;
  if(!product){ alert('Alege un produs din lista de căutare.'); return; }
  if(!(qty>0)){ alert('Introdu o cantitate > 0.'); return; }
  const id = 'e'+Date.now()+Math.random().toString(36).slice(2,6);
  JOURNAL.unshift({ id, ts: Date.now(), date, product, qty, unit });
  saveJournalWithFS(JOURNAL);
  document.getElementById('jr-qty').value='';
  renderJournalForDate(date);
  
  // Clear selection after adding
  currentSelectedProduct = null;
  const selectedDiv = document.getElementById('jr-selected-product');
  if(selectedDiv) {
    selectedDiv.innerHTML = '<span style="color:var(--muted);">Niciun produs selectat</span>';
  }
});

document.getElementById('jr-tbody').addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-del]');
  if(!btn) return;
  const id = btn.getAttribute('data-del');
  JOURNAL = JOURNAL.filter(x=>x.id!==id);
  saveJournalWithFS(JOURNAL);
  renderJournalForDate(document.getElementById('jr-date').value||todayISO());
});

// --------- Produse ---------
function clearProductForm(){
  document.getElementById('p-name').value='';
  document.getElementById('p-base').value='100g';
  document.getElementById('p-gbuc').value='';
  document.getElementById('p-mlbuc').value='';
  document.getElementById('p-cal').value='';
  document.getElementById('p-fat').value='';
  document.getElementById('p-sat').value='';
  document.getElementById('p-carb').value='';
  document.getElementById('p-sug').value='';
  document.getElementById('p-fib').value='';
  document.getElementById('p-pro').value='';
  document.getElementById('p-restaurant').value='';
  document.getElementById('p-category').value='';
  document.getElementById('p-tags').value='';
  hideQuickTags();
}

// --------- Product Tag Management ---------
function showQuickTags() {
  const container = document.getElementById('p-quick-tags-list');
  const section = document.getElementById('p-popular-tags-quick');
  if (!container || !section) return;
  
  const popularTags = getPopularTags(12);
  
  container.innerHTML = '';
  if (popularTags.length > 0) {
    section.style.display = 'block';
    popularTags.forEach(({ tag, count }) => {
      const chip = createQuickTagChip(tag, count);
      container.appendChild(chip);
    });
  } else {
    section.style.display = 'none';
  }
}

function hideQuickTags() {
  const section = document.getElementById('p-popular-tags-quick');
  if (section) {
    section.style.display = 'none';
  }
}

function createQuickTagChip(tag, count = null) {
  const chip = document.createElement('button');
  chip.className = 'quick-tag-chip';
  chip.style.cssText = `
    display: inline-block;
    padding: 3px 6px;
    margin: 1px;
    background: var(--headerbg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
  `;
  
  chip.textContent = count ? `${tag} (${count})` : tag;
  chip.title = `Click pentru a adăuga "${tag}"`;
  
  chip.addEventListener('click', () => {
    addTagToProductForm(tag);
  });
  
  chip.addEventListener('mouseenter', () => {
    chip.style.backgroundColor = 'var(--accent)';
    chip.style.color = 'white';
  });
  
  chip.addEventListener('mouseleave', () => {
    chip.style.backgroundColor = 'var(--headerbg)';
    chip.style.color = '';
  });
  
  return chip;
}

function addTagToProductForm(tag) {
  const tagsInput = document.getElementById('p-tags');
  if (!tagsInput) return;
  
  const currentTags = tagsInput.value.trim();
  const existingTags = currentTags ? currentTags.split(',').map(t => t.trim()) : [];
  
  // Don't add if already exists
  if (existingTags.includes(tag)) {
    return;
  }
  
  // Add the new tag
  const newTags = [...existingTags, tag];
  tagsInput.value = newTags.join(', ');
  
  // Trigger input event to update any listeners
  tagsInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function suggestTagsForProduct() {
  const name = document.getElementById('p-name').value.trim();
  const categoryId = document.getElementById('p-category').value;
  
  if (!name) {
    alert('Introdu mai întâi numele produsului!');
    return;
  }
  
  let suggestedTags = [];
  
  // Get tags from category
  if (categoryId) {
    const category = getCategoryById(categoryId);
    if (category && TAXONOMY?.category_implies_tags) {
      const categoryTags = TAXONOMY.category_implies_tags[category.name] || [];
      suggestedTags = [...suggestedTags, ...categoryTags];
    }
  }
  
  // Get tags from product name analysis
  if (TAXONOMY?.tag_aliases) {
    const normalizedName = normalizeText(name);
    
    for (const [canonicalTag, aliases] of Object.entries(TAXONOMY.tag_aliases)) {
      for (const alias of aliases) {
        const normalizedAlias = normalizeText(alias);
        if (normalizedName.includes(normalizedAlias)) {
          suggestedTags.push(canonicalTag);
          break; // Found a match for this canonical tag, move to next
        }
      }
    }
  }
  
  // Remove duplicates
  suggestedTags = [...new Set(suggestedTags)];
  
  if (suggestedTags.length > 0) {
    const tagsInput = document.getElementById('p-tags');
    if (tagsInput) {
      tagsInput.value = suggestedTags.join(', ');
      alert(`Taguri sugerate: ${suggestedTags.join(', ')}`);
    }
  } else {
    alert('Nu s-au găsit taguri sugerate pentru acest produs.');
  }
}

function renderProductTags(tags) {
  if (!tags || tags.length === 0) {
    return '<span style="color: var(--muted); font-size: 11px;">—</span>';
  }
  
  return tags.map(tag => 
    `<span style="display: inline-block; padding: 2px 6px; margin: 1px; background: var(--headerbg); border: 1px solid var(--border); border-radius: 8px; font-size: 10px;">${tag}</span>`
  ).join(' ');
}

// Fill restaurant dropdowns
function fillRestaurantDropdowns(){
  const dropdowns = ['p-restaurant', 'p-filter-restaurant', 'bulk-restaurant'];
  dropdowns.forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">Selectează restaurant...</option>';
    RESTAURANTS.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.icon} ${r.name}`;
      sel.appendChild(opt);
    });
    if(current && RESTAURANTS.some(r => r.id === current)) sel.value = current;
  });
}

// Fill category dropdowns
function fillCategoryDropdowns(){
  const dropdowns = ['p-category', 'p-filter-category', 'bulk-category'];
  dropdowns.forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">Selectează categorie...</option>';
    CATEGORIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      sel.appendChild(opt);
    });
    if(current && CATEGORIES.some(c => c.id === current)) sel.value = current;
  });
}

// Global variables for Products page filtering
let pFilteredProducts = [];
let pSelectedDropdownIndex = -1;

function renderProducts(){
  const tb = document.getElementById('p-tbody');
  if(!tb) return;
  tb.innerHTML = '';
  
  // Get filter values
  const searchTerm = (document.getElementById('p-product-search')?.value || '').trim().toLowerCase();
  const categoryFilter = document.getElementById('p-filter-category')?.value || '';
  const selectedRestaurants = getPSelectedRestaurants();
  
  // Get all products (legacy + menu items)
  const allProducts = getAllProducts();
  
  // Filter products
  pFilteredProducts = allProducts;
  
  // Apply enhanced search filter with synonyms
  if(searchTerm) {
    pFilteredProducts = searchProductsWithSynonyms(searchTerm, pFilteredProducts);
  }
      
      // Apply restaurant filter
  if(selectedRestaurants.length > 0) {
    pFilteredProducts = pFilteredProducts.filter(p => {
      const menuItem = MENU_ITEMS.find(m => m.name === p.name);
        if(menuItem) {
        return selectedRestaurants.includes(menuItem.restaurantId);
        } else {
        return selectedRestaurants.includes('default');
          }
    });
      }
      
      // Apply category filter
      if(categoryFilter) {
    pFilteredProducts = pFilteredProducts.filter(p => {
      const menuItem = MENU_ITEMS.find(m => m.name === p.name);
        if(menuItem) {
        return menuItem.categoryId === categoryFilter;
        } else {
        return categoryFilter === 'general';
      }
    });
  }
  
  // Update product count
  const countEl = document.getElementById('p-product-count');
  if(countEl) {
    countEl.textContent = `${pFilteredProducts.length} produse disponibile`;
  }
  
  // Show/hide dropdown based on search term and results
  if(pFilteredProducts.length > 0) {
    showPProductDropdown();
    // Auto-highlight first item when dropdown appears
    if(pSelectedDropdownIndex === -1) {
      highlightPDropdownItem(0);
    }
  } else {
    hidePProductDropdown();
  }
  
  // Render table
  pFilteredProducts.slice().sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'})).forEach(p=>{
    const tr = document.createElement('tr');
    
    // Find restaurant and category info
    const menuItem = MENU_ITEMS.find(m => m.name === p.name);
    const restaurant = menuItem ? getRestaurantById(menuItem.restaurantId) : getRestaurantById('default');
    const category = menuItem ? getCategoryById(menuItem.categoryId) : getCategoryById('general');
    
    tr.innerHTML = `
      <td>${restaurant ? `${restaurant.icon} ${restaurant.name}` : '🛒 Băcănie'}</td>
      <td>${category ? `${category.icon} ${category.name}` : '📦 General'}</td>
      <td>${p.name}</td>
      <td style="max-width: 200px; overflow: hidden;">${renderProductTags(p.tags)}</td>
      <td>${p.base.replace('100g','100 g').replace('100ml','100 ml')}</td>
      <td class="right">${fmt(p.cal)}</td>
      <td class="right">${fmt(p.fat)}</td>
      <td class="right">${fmt(p.sat)}</td>
      <td class="right">${fmt(p.carb)}</td>
      <td class="right">${fmt(p.sug)}</td>
      <td class="right">${fmt(p.fib)}</td>
      <td class="right">${fmt(p.pro)}</td>
      <td class="right">
        <button data-edit="${encodeURIComponent(p.name)}">Editează</button>
        <button class="warn" data-rm="${encodeURIComponent(p.name)}">Șterge</button>
      </td>`;
    tb.appendChild(tr);
  });
}
// Products page dropdown functions
function showPProductDropdown(){
  const dropdown = document.getElementById('p-product-dropdown');
  if(!dropdown) return;
  
  dropdown.innerHTML = '';
  pSelectedDropdownIndex = -1; // Reset selection
  
  // Show all products - no limit
  const displayProducts = pFilteredProducts;
  
  displayProducts.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'p-dropdown-item';
    div.dataset.index = index;
    div.style.padding = '8px 12px';
    div.style.cursor = 'pointer';
    div.style.borderBottom = '1px solid var(--border)';
    div.style.fontSize = '14px';
    div.style.transition = 'background-color 0.1s ease';
    
    // Find restaurant and category info
    const menuItem = MENU_ITEMS.find(m => m.name === p.name);
    let restaurantName = 'Băcănie';
    let categoryName = 'General';
    
    if(menuItem) {
      const restaurant = RESTAURANTS.find(r => r.id === menuItem.restaurantId);
      const category = CATEGORIES.find(c => c.id === menuItem.categoryId);
      restaurantName = restaurant?.name || 'Unknown';
      categoryName = category?.name || 'Unknown';
    }
    
    div.innerHTML = `
      <div style="font-weight:500;">${p.name}</div>
      <div style="font-size:12px;color:var(--muted);">${restaurantName} • ${categoryName}</div>
    `;
    
    // Hover effects
    div.addEventListener('mouseenter', () => {
      // Remove highlight from other items
      document.querySelectorAll('.p-dropdown-item').forEach(item => {
        item.style.backgroundColor = 'transparent';
      });
      div.style.backgroundColor = 'var(--headerbg)';
      pSelectedDropdownIndex = index;
    });
    div.addEventListener('mouseleave', () => {
      // Don't change background on mouse leave if this item is selected
      if(pSelectedDropdownIndex !== index) {
        div.style.backgroundColor = 'transparent';
      }
    });
    
    // Click to select
    div.addEventListener('click', () => {
      selectPProduct(p.name);
    });
    
    dropdown.appendChild(div);
  });
  
  dropdown.style.display = 'block';
}

function hidePProductDropdown(){
  const dropdown = document.getElementById('p-product-dropdown');
  if(dropdown) {
    dropdown.style.display = 'none';
  }
  pSelectedDropdownIndex = -1;
}

function highlightPDropdownItem(index) {
  const items = document.querySelectorAll('.p-dropdown-item');
  if(!items.length) return;
  
  // Remove highlight from all items
  items.forEach(item => {
    item.style.backgroundColor = 'transparent';
  });
  
  // Clamp index to valid range
  const maxIndex = items.length - 1;
  pSelectedDropdownIndex = Math.max(0, Math.min(index, maxIndex));
  
  // Highlight the selected item
  if(items[pSelectedDropdownIndex]) {
    items[pSelectedDropdownIndex].style.backgroundColor = 'var(--headerbg)';
    // Scroll into view if needed
    items[pSelectedDropdownIndex].scrollIntoView({ block: 'nearest' });
  }
}

function selectPProduct(productName){
  // Update the search input with the selected product
  const searchInput = document.getElementById('p-product-search');
  if(searchInput) {
    searchInput.value = productName;
  }
  hidePProductDropdown();
  
  // Re-render the products list
  renderProducts();
}

function getPSelectedRestaurants(){
  const checkboxes = document.querySelectorAll('#p-restaurant-dropdown input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function fillPRestaurantDropdown(){
  const container = document.getElementById('p-restaurant-dropdown');
  if(!container) return;
  
  container.innerHTML = '';
  
  // Add "Toate" master checkbox
  const masterLabel = document.createElement('label');
  masterLabel.style.display = 'flex';
  masterLabel.style.alignItems = 'center';
  masterLabel.style.gap = '8px';
  masterLabel.style.fontSize = '14px';
  masterLabel.style.cursor = 'pointer';
  masterLabel.style.padding = '4px 0';
  masterLabel.style.borderBottom = '1px solid var(--border)';
  masterLabel.style.marginBottom = '4px';
  masterLabel.style.fontWeight = '500';
  
  const masterCheckbox = document.createElement('input');
  masterCheckbox.type = 'checkbox';
  masterCheckbox.id = 'p-master-restaurant-checkbox';
  masterCheckbox.checked = true; // All selected by default
  masterCheckbox.addEventListener('change', () => {
    const isChecked = masterCheckbox.checked;
    // Select/deselect all restaurant checkboxes
    const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#p-master-restaurant-checkbox)');
    restaurantCheckboxes.forEach(cb => cb.checked = isChecked);
    
    updatePRestaurantButtonText();
    renderProducts();
  });
  
  const masterSpan = document.createElement('span');
  masterSpan.textContent = '✅ Toate';
  
  masterLabel.appendChild(masterCheckbox);
  masterLabel.appendChild(masterSpan);
  container.appendChild(masterLabel);
  
  // Add individual restaurant checkboxes
  RESTAURANTS.forEach(r => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontSize = '14px';
    label.style.cursor = 'pointer';
    label.style.padding = '4px 0';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = r.id;
    checkbox.checked = true; // All selected by default
    checkbox.addEventListener('change', () => {
      updatePMasterCheckbox();
      updatePRestaurantButtonText();
      renderProducts();
    });
    
    const span = document.createElement('span');
    span.textContent = `${r.icon} ${r.name}`;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    container.appendChild(label);
  });
  
  updatePRestaurantButtonText();
}

function updatePMasterCheckbox(){
  const masterCheckbox = document.getElementById('p-master-restaurant-checkbox');
  const container = document.getElementById('p-restaurant-dropdown');
  if(!masterCheckbox || !container) return;
  
  const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#p-master-restaurant-checkbox)');
  const checkedCount = Array.from(restaurantCheckboxes).filter(cb => cb.checked).length;
  
  if(checkedCount === 0) {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = false;
  } else if(checkedCount === restaurantCheckboxes.length) {
    masterCheckbox.checked = true;
    masterCheckbox.indeterminate = false;
  } else {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = true;
  }
}

function updatePRestaurantButtonText(){
  const selectedRestaurants = getPSelectedRestaurants();
  const btnText = document.getElementById('p-restaurant-btn-text');
  
  if(!btnText) return;
  
  if(selectedRestaurants.length === 0) {
    btnText.textContent = '🏪 Niciun restaurant';
  } else if(selectedRestaurants.length === RESTAURANTS.length) {
    btnText.textContent = '🏪 Toate restaurantele';
  } else if(selectedRestaurants.length === 1) {
    const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurants[0]);
    btnText.textContent = restaurant ? `${restaurant.icon} ${restaurant.name}` : '🏪 1 restaurant';
  } else {
    btnText.textContent = `🏪 ${selectedRestaurants.length} restaurante`;
  }
}

function togglePRestaurantDropdown(){
  const dropdown = document.getElementById('p-restaurant-dropdown');
  if(!dropdown) return;
  
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';
}

function hidePRestaurantDropdown(){
  const dropdown = document.getElementById('p-restaurant-dropdown');
  if(dropdown) {
    dropdown.style.display = 'none';
  }
}

function clearPJournalFilters(){
  // Clear category filter
  document.getElementById('p-filter-category').value = '';
  
  // Clear search
  document.getElementById('p-product-search').value = '';
  
  // Select all restaurants
  const checkboxes = document.querySelectorAll('#p-restaurant-dropdown input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
  updatePMasterCheckbox();
  updatePRestaurantButtonText();
  
  hidePProductDropdown();
  hidePRestaurantDropdown();
  renderProducts();
}

window.renderProducts = renderProducts;
window.fillProductDropdown = fillProductDropdown;

document.getElementById('p-clear')?.addEventListener('click', clearProductForm);

// Tag management event listeners
document.getElementById('p-suggest-tags')?.addEventListener('click', suggestTagsForProduct);

// Show quick tags when name or category changes
document.getElementById('p-name')?.addEventListener('input', () => {
  const name = document.getElementById('p-name').value.trim();
  if (name.length > 2) {
    showQuickTags();
  } else {
    hideQuickTags();
  }
});

document.getElementById('p-category')?.addEventListener('change', () => {
  const categoryId = document.getElementById('p-category').value;
  if (categoryId) {
    showQuickTags();
  }
});

document.getElementById('p-save')?.addEventListener('click', ()=>{
  const p = {
    name: (document.getElementById('p-name').value||'').trim(),
    base: document.getElementById('p-base').value,
    gPerPiece: parseFloat(document.getElementById('p-gbuc').value)||null,
    mlPerPiece: parseFloat(document.getElementById('p-mlbuc').value)||null,
    cal: parseFloat(document.getElementById('p-cal').value)||0,
    fat: parseFloat(document.getElementById('p-fat').value)||0,
    sat: parseFloat(document.getElementById('p-sat').value)||0,
    carb: parseFloat(document.getElementById('p-carb').value)||0,
    sug: parseFloat(document.getElementById('p-sug').value)||0,
    fib: parseFloat(document.getElementById('p-fib').value)||0,
    pro: parseFloat(document.getElementById('p-pro').value)||0
  };
  if(!p.name){ alert('Introdu o denumire de produs.'); return; }
  
  // Parse tags
  const tagsText = document.getElementById('p-tags').value.trim();
  const tags = tagsText ? tagsText.split(',').map(t => t.trim()).filter(t => t) : [];
  
  const restaurantId = document.getElementById('p-restaurant').value;
  const categoryId = document.getElementById('p-category').value;
  
  if(restaurantId && categoryId) {
    // Save as menu item
    p.glu = p.carb;
    const category = getCategoryById(categoryId);
    const categoryName = category ? category.name : null;
    
    // Create base menu item
    const baseMenuItem = {
      id: 'mi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: p.name,
      description: p.name,
      restaurantId: restaurantId,
      categoryId: categoryId,
      base: p.base,
      gPerPiece: p.gPerPiece,
      mlPerPiece: p.mlPerPiece,
      cal: p.cal,
      fat: p.fat,
      sat: p.sat,
      carb: p.carb,
      sug: p.sug,
      fib: p.fib,
      pro: p.pro,
      glu: p.glu,
      tags: tags, // Use manually entered tags
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Apply autotagging (this will merge with manual tags)
    const menuItem = autotagProduct(baseMenuItem, categoryName);
    
    const idx = MENU_ITEMS.findIndex(x=>x.name.toLowerCase()===p.name.toLowerCase());
    if(idx>=0) MENU_ITEMS[idx]=menuItem; else MENU_ITEMS.push(menuItem);
    saveMenuItemsWithFS(MENU_ITEMS);
  } else {
    // Save as legacy product
    p.glu = p.carb; // compat istoric
    p.tags = tags; // Add tags to legacy products too
    const idx = PRODUCTS.findIndex(x=>x.name.toLowerCase()===p.name.toLowerCase());
    if(idx>=0) PRODUCTS[idx]=p; else PRODUCTS.push(p);
    saveProductsWithFS(PRODUCTS);
  }
  
  renderProducts();
  updatePopularTags();
  alert('Produs salvat.');
});

document.getElementById('p-tbody').addEventListener('click', (e)=>{
  const rm = e.target.closest('button[data-rm]');
  const ed = e.target.closest('button[data-edit]');
  if(rm){
    const name = decodeURIComponent(rm.getAttribute('data-rm'));
    if(!confirm('Ștergi produsul «'+name+'»?')) return;
    PRODUCTS = PRODUCTS.filter(x=>x.name!==name);
    saveProducts(PRODUCTS);
    renderProducts();
    return;
  }
  if(ed){
    const name = decodeURIComponent(ed.getAttribute('data-edit'));
    const p = productByName(name);
    if(!p) return;
    document.getElementById('p-name').value=p.name;
    document.getElementById('p-base').value=p.base;
    document.getElementById('p-gbuc').value=p.gPerPiece??'';
    document.getElementById('p-mlbuc').value=p.mlPerPiece??'';
    document.getElementById('p-cal').value=p.cal;
    document.getElementById('p-fat').value=p.fat;
    document.getElementById('p-sat').value=p.sat;
    document.getElementById('p-carb').value=p.carb;
    document.getElementById('p-sug').value=p.sug;
    document.getElementById('p-fib').value=p.fib||0;
    document.getElementById('p-pro').value=p.pro;
    
    // Load tags
    const tags = p.tags && p.tags.length > 0 ? p.tags.join(', ') : '';
    document.getElementById('p-tags').value = tags;
    
    // Load restaurant and category if it's a menu item
    const menuItem = MENU_ITEMS.find(m => m.name === p.name);
    if(menuItem) {
      document.getElementById('p-restaurant').value = menuItem.restaurantId || '';
      document.getElementById('p-category').value = menuItem.categoryId || '';
    }
    
    window.scrollTo({top:0,behavior:'smooth'});
  }
});

// --------- Bulk Import Modal ---------
function showBulkImportModal(){
  const modal = document.getElementById('bulk-import-modal');
  if(modal) {
    modal.style.display = 'flex';
    modal.removeAttribute('hidden');
    fillRestaurantDropdowns();
    fillCategoryDropdowns();
    console.log('Modal opened');
    
    // Add event listeners immediately when modal opens
    setupModalEventListeners();
  } else {
    console.error('Modal element not found');
  }
}

function hideBulkImportModal(){
  const modal = document.getElementById('bulk-import-modal');
  if(modal) {
    modal.style.display = 'none';
    modal.setAttribute('hidden', 'true');
    const menuData = document.getElementById('bulk-menu-data');
    if(menuData) menuData.value = '';
    console.log('Modal closed');
  } else {
    console.error('Modal element not found');
  }
}

// Make functions globally accessible
window.hideBulkImportModal = hideBulkImportModal;
window.showBulkImportModal = showBulkImportModal;
window.importBulkMenu = importBulkMenu;

function setupModalEventListeners(){
  // Remove existing listeners to avoid duplicates
  const closeBtn = document.getElementById('bulk-close');
  const cancelBtn = document.getElementById('bulk-cancel');
  
  if(closeBtn) {
    closeBtn.onclick = hideBulkImportModal;
  }
  if(cancelBtn) {
    cancelBtn.onclick = hideBulkImportModal;
  }
  
  console.log('Modal event listeners set up');
}

function importBulkMenu(){
  const restaurantId = document.getElementById('bulk-restaurant').value;
  const categoryId = document.getElementById('bulk-category').value;
  const menuData = document.getElementById('bulk-menu-data').value;
  
  if(!restaurantId || !categoryId) {
    alert('Selectează restaurant și categorie.');
    return;
  }
  
  if(!menuData.trim()) {
    alert('Introdu datele meniului.');
    return;
  }
  
  try {
    const menuItems = JSON.parse(menuData);
    if(!Array.isArray(menuItems)) {
      throw new Error('Datele trebuie să fie un array de obiecte');
    }
    
    let imported = 0;
    menuItems.forEach(item => {
      if(!item.name) return;
      
      const category = getCategoryById(categoryId);
      const categoryName = category ? category.name : null;
      
      const baseMenuItem = {
        id: 'mi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: item.name,
        description: item.description || item.name,
        restaurantId: restaurantId,
        categoryId: categoryId,
        base: item.base || '100g',
        gPerPiece: item.gPerPiece || null,
        mlPerPiece: item.mlPerPiece || null,
        cal: item.cal || 0,
        fat: item.fat || 0,
        sat: item.sat || 0,
        carb: item.carb || 0,
        sug: item.sug || 0,
        fib: item.fib || 0,
        pro: item.pro || 0,
        glu: item.glu || item.carb || 0,
        tags: item.tags || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Apply autotagging
      const menuItem = autotagProduct(baseMenuItem, categoryName);
      
      // Check if item already exists
      const existingIndex = MENU_ITEMS.findIndex(m => m.name.toLowerCase() === menuItem.name.toLowerCase());
      if(existingIndex >= 0) {
        MENU_ITEMS[existingIndex] = menuItem;
      } else {
        MENU_ITEMS.push(menuItem);
      }
      imported++;
    });
    
    saveMenuItemsWithFS(MENU_ITEMS);
    renderProducts();
    updatePopularTags();
    hideBulkImportModal();
    alert(`Import reușit! ${imported} produse au fost adăugate/actualizate.`);
    
  } catch(e) {
    alert('Eroare la parsarea datelor JSON: ' + e.message);
  }
}

// Event listeners will be added in init function

// --------- Sumar ---------
let sumChart = null;
function groupByDate(rangeFrom, rangeTo){
  const map = new Map();
  JOURNAL.forEach(r=>{
    if(rangeFrom && r.date < rangeFrom) return;
    if(rangeTo && r.date > rangeTo) return;
    const n = calcNutrients(r) || {cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0};
    const cur = map.get(r.date) || {cal:0,fat:0,sat:0,carb:0,sug:0,fib:0,pro:0};
    cur.cal+=n.cal; cur.fat+=n.fat; cur.sat+=n.sat; cur.carb+=n.carb; cur.sug+=n.sug; cur.fib+=n.fib; cur.pro+=n.pro;
    map.set(r.date, cur);
  });
  return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
}

function renderSummary(){
  const from = document.getElementById('sum-from').value || null;
  const to = document.getElementById('sum-to').value || null;
  const tbody = document.getElementById('sum-tbody');
  tbody.innerHTML='';
  groupByDate(from,to).forEach(([d,t])=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${d}</td>
      <td class="right">${fmt1(t.cal)}</td>
      <td class="right">${fmt1(t.fat)}</td>
      <td class="right">${fmt1(t.sat)}</td>
      <td class="right">${fmt1(t.carb)}</td>
      <td class="right">${fmt1(t.sug)}</td>
      <td class="right">${fmt1(t.fib)}</td>
      <td class="right">${fmt1(t.pro)}</td>`;
    tbody.appendChild(tr);
  });

// Desenează graficul zilnic (seriile ca % din ținte, dacă sunt setate)
try {
  const rows = groupByDate(from,to);
  renderSummaryChart(rows);
} catch(e){ console.warn(e); }

}
document.getElementById('sum-apply').addEventListener('click', renderSummary);


function renderSummaryChart(rows){
  if(typeof Chart==='undefined'){
    const ctxEl = document.getElementById('sum-chart');
    if(ctxEl){ const ctx=ctxEl.getContext('2d'); ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); ctx.fillStyle='#666'; ctx.fillText('Chart.js not loaded yet…', 10, 18); }
    setTimeout(()=>renderSummaryChart(rows), 400);
    return;
  }
  const labels = rows.map(r=>r[0]);
  const T = TARGETS || {};
  const metrics = [
    ['cal','kcal'],
    ['carb','Carb'],
    ['sug','Zah'],
    ['fat','Grăs'],
    ['sat','Sat'],
    ['fib','Fibr'],
    ['pro','Prot']
  ];
  const datasets = metrics.map(([k, label])=>{
    const t = +T[k]||0;
    const data = rows.map(([,tot])=>{
      const v = +(tot[k]||0);
      return t>0 ? (v/t*100) : v;
    });
    return { label, data, borderWidth:2, tension:0.25, fill:false };
  });

  if(sumChart){ try{ sumChart.destroy(); }catch{} }
  const ctxEl = document.getElementById('sum-chart');
  if(!ctxEl) return;
  const ctx = ctxEl.getContext('2d');

  // Plugin: dashed line at 100% if any target set
  const usesPercent = Object.values(T).some(v=> (typeof v==='number' && v>0));
  const targetLine = {
    id:'targetLine',
    afterDraw(chart){
      if(!usesPercent) return;
      const yScale = chart.scales.y;
      if(!yScale) return;
      const y = yScale.getPixelForValue(100);
      const g = chart.ctx;
      g.save();
      g.setLineDash([6,6]);
      g.lineWidth = 1;
      g.strokeStyle = 'rgba(180,180,180,0.8)';
      g.beginPath();
      g.moveTo(chart.chartArea.left, y);
      g.lineTo(chart.chartArea.right, y);
      g.stroke();
      g.restore();
    }
  };

  sumChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    plugins: [targetLine],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'nearest', intersect:false },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: usesPercent ? '% din țintă (100 = target)' : 'Valori absolute' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx)=>{
              const raw = ctx.raw;
              return usesPercent ? `${ctx.dataset.label}: ${raw.toFixed(0)}%` : `${ctx.dataset.label}: ${raw.toFixed(1)}`;
            }
          }
        }
      }
    }
  });
}


// --------- Ținte ---------
function fillTargetsForm(){
  document.getElementById('tg-cal').value = TARGETS.cal ?? '';
  document.getElementById('tg-fat').value = TARGETS.fat ?? '';
  document.getElementById('tg-sat').value = TARGETS.sat ?? '';
  document.getElementById('tg-carb').value = TARGETS.carb ?? '';
  document.getElementById('tg-sug').value = TARGETS.sug ?? '';
  document.getElementById('tg-fib').value = TARGETS.fib ?? '';
  document.getElementById('tg-pro').value = TARGETS.pro ?? '';
}
document.getElementById('tg-save').addEventListener('click', ()=>{
  TARGETS = {
    cal:+document.getElementById('tg-cal').value||0,
    fat:+document.getElementById('tg-fat').value||0,
    sat:+document.getElementById('tg-sat').value||0,
    carb:+document.getElementById('tg-carb').value||0,
    sug:+document.getElementById('tg-sug').value||0,
    fib:+document.getElementById('tg-fib').value||0,
    pro:+document.getElementById('tg-pro').value||0
  };
  saveTargetsWithFS(TARGETS);
  alert('Țintele au fost salvate.');
  renderJournalForDate(document.getElementById('jr-date').value);
});
document.getElementById('tg-reset').addEventListener('click', ()=>{
  TARGETS = defaultTargets(); saveTargetsWithFS(TARGETS); fillTargetsForm();
  renderJournalForDate(document.getElementById('jr-date').value);
  alert('Țintele au fost resetate.');
});

// --------- Backup: fallback (downloads) ---------
function downloadJSON(filename, data){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
document.getElementById('bk-export-products').addEventListener('click', ()=> downloadJSON('products.json', PRODUCTS));
document.getElementById('bk-export-journal').addEventListener('click', ()=> downloadJSON('journal.json', JOURNAL));

async function importJSONFromFile(input, kind){
  const file = input.files?.[0]; if(!file) return;
  const text = await file.text();
  try{
    const data = JSON.parse(text);
    if(kind==='products'){
      if(!Array.isArray(data)) throw new Error('format invalid (aștept array)');
      PRODUCTS = migrateProducts(data);
      saveProducts(PRODUCTS);
      if (typeof renderProducts === 'function') renderProducts();
      if (typeof fillProductDropdown === 'function') fillProductDropdown();
      compareRefreshAll();
    } else {
      if(!Array.isArray(data)) throw new Error('format invalid (aștept array)');
      JOURNAL = data;
      saveJournal(JOURNAL);
      const d = document.getElementById('jr-date').value;
      if (typeof renderJournalForDate === 'function') renderJournalForDate(d);
      if (typeof renderSummary === 'function') renderSummary();
    }
    alert('Import reușit.');
  }catch(e){
    alert('Fișier invalid: ' + (e?.message || e));
  }
  input.value='';
}
document.getElementById('bk-import-products').addEventListener('change', (e)=> importJSONFromFile(e.target,'products'));
document.getElementById('bk-import-journal').addEventListener('change', (e)=> importJSONFromFile(e.target,'journal'));

// --------- Settings: folder mode UI ---------
document.getElementById('fs-pick').addEventListener('click', fsPickFolder);
document.getElementById('fs-autosave').addEventListener('change', (e)=>{ AUTOSAVE = !!e.target.checked; });
document.getElementById('fs-save-products').addEventListener('click', async ()=> {
  if(dirHandle) {
    try {
      await fsWrite('products');
      await fsWrite('journal');
      await fsWrite('targets');
      await fsWrite('restaurants');
      await fsWrite('categories');
      await fsWrite('menuItems');
      await fsWrite('taxonomy');
      alert('Toate datele au fost salvate în folder!');
    } catch(e) {
      alert('Eroare la salvare: ' + (e?.message||e));
    }
  } else {
    // Fallback: download all files
    downloadJSON('products.json', PRODUCTS);
    downloadJSON('journal.json', JOURNAL);
    downloadJSON('targets.json', TARGETS);
    downloadJSON('restaurants.json', RESTAURANTS);
    downloadJSON('categories.json', CATEGORIES);
    downloadJSON('menu_items.json', MENU_ITEMS);
    downloadJSON('taxonomy.json', TAXONOMY);
    alert('Toate datele au fost descărcate!');
  }
});
document.getElementById('fs-reload-products').addEventListener('click', async ()=>{
  if(!dirHandle){ alert('Selectează mai întâi folderul'); return; }
  try{
    const data = migrateProducts(await fsRead('products'));
    if(Array.isArray(data)){
      PRODUCTS = data; localStorage.setItem(LS_KEYS.products, JSON.stringify(PRODUCTS));
      renderProducts(); fillProductDropdown(); compareRefreshAll(); alert('Produsele au fost reîncărcate din folder.');
    } else { alert('products.json nu conține un array valid.'); }
  }catch(e){ alert('Nu am putut citi products.json: '+ (e?.message||e)); }
});
document.getElementById('fs-reload-targets').addEventListener('click', async ()=>{
  if(!dirHandle){ alert('Selectează mai întâi folderul'); return; }
  try{
    const data = await fsRead('targets');
    if(data && typeof data==='object'){
      TARGETS = data; localStorage.setItem(LS_KEYS.targets, JSON.stringify(TARGETS));
      fillTargetsForm(); renderJournalForDate(document.getElementById('jr-date').value);
      alert('Țintele au fost reîncărcate din folder.');
    } else { alert('targets.json invalid.'); }
  }catch(e){ alert('Nu am putut citi targets.json: '+ (e?.message||e)); }
});

document.getElementById('fs-autotag-products').addEventListener('click', autotagAllProducts);

// --- Save Journal button in Jurnal tab ---
document.getElementById('jr-save-journal').addEventListener('click', async ()=>{
  if(!dirHandle){ alert('Selectează folderul în tab-ul Backup înainte de a salva.'); return; }
  try{ await fsWrite('journal'); alert('Jurnalul a fost salvat în folder (journal.json).'); }
  catch(e){ alert('Nu am putut salva journal.json: ' + (e?.message||e)); }
});

// ======== COMPARE ========
const CMP_METRICS = [
  { key:'carb',   label:'Carbs/Glucide (g)' },
  { key:'sug',    label:'Zaharuri (g)' },
  { key:'fat',    label:'Grăsimi (g)' },
  { key:'sat',    label:'Saturate (g)' },
  { key:'fib',    label:'Fibre (g)' },
  { key:'pro',    label:'Proteine (g)' },
  { key:'cal',    label:'Calorii (kcal)' },
];

const cmpEls = {
  unit:   document.getElementById('cmp-unit'),
  search: document.getElementById('cmp-product-search'),
  restaurant: document.getElementById('cmp-restaurant-dropdown'),
  category: document.getElementById('cmp-category'),
  x:      document.getElementById('cmp-x'),
  y:      document.getElementById('cmp-y'),
  bubble: document.getElementById('cmp-bubble'),
  color:  document.getElementById('cmp-color'),
  weightsWrap: document.getElementById('cmp-weights'),
  reset:  document.getElementById('cmp-reset'),
  export: document.getElementById('cmp-export'),
  scatter: document.getElementById('cmp-scatter'),
  selectedWrap: document.getElementById('cmp-selected'),
  selName: document.getElementById('cmp-sel-name'),
  selBrand: document.getElementById('cmp-sel-brand'),
  selTags: document.getElementById('cmp-sel-tags'),
  selTable: document.getElementById('cmp-sel-table'),
  radar: document.getElementById('cmp-radar'),
  topBody: document.getElementById('cmp-top'),
};

let cmpWeights = JSON.parse(localStorage.getItem('cmp_weights_v1')||'null') || {
  carb:+1.0, sug:-1.0, fat:-0.5, sat:-0.5, fib:+0.5, pro:+0.5, cal:0.0
};
function cmpSaveWeights(){ localStorage.setItem('cmp_weights_v1', JSON.stringify(cmpWeights)); }

let CMP_VIEW = [];
let CMP_SCATTER = null, CMP_RADAR = null;

function cmpFillMetricSelect(sel, defKey){
  sel.innerHTML='';
  CMP_METRICS.forEach(m=>{
    const opt=document.createElement('option');
    opt.value=m.key; opt.textContent=m.label;
    if(m.key===defKey) opt.selected=true;
    sel.appendChild(opt);
  });
}

function cmpFillRestaurantSelect(){
  const sel = cmpEls.restaurant;
  if(!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">Toate restaurantele</option>';
  RESTAURANTS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.icon} ${r.name}`;
    sel.appendChild(opt);
  });
  if(current && RESTAURANTS.some(r => r.id === current)) sel.value = current;
}

function cmpFillCategorySelect(){
  const sel = cmpEls.category;
  if(!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">📂 Toate categoriile</option>';
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    sel.appendChild(opt);
  });
  if(current && CATEGORIES.some(c => c.id === current)) sel.value = current;
}

// Compare page dropdown functions
function getCmpSelectedRestaurants(){
  const checkboxes = document.querySelectorAll('#cmp-restaurant-dropdown input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function fillCmpRestaurantDropdown(){
  const container = document.getElementById('cmp-restaurant-dropdown');
  if(!container) return;
  
  container.innerHTML = '';
  
  // Add "Toate" master checkbox
  const masterLabel = document.createElement('label');
  masterLabel.style.display = 'flex';
  masterLabel.style.alignItems = 'center';
  masterLabel.style.gap = '8px';
  masterLabel.style.fontSize = '14px';
  masterLabel.style.cursor = 'pointer';
  masterLabel.style.padding = '4px 0';
  masterLabel.style.borderBottom = '1px solid var(--border)';
  masterLabel.style.marginBottom = '4px';
  masterLabel.style.fontWeight = '500';
  
  const masterCheckbox = document.createElement('input');
  masterCheckbox.type = 'checkbox';
  masterCheckbox.id = 'cmp-master-restaurant-checkbox';
  masterCheckbox.checked = true; // All selected by default
  masterCheckbox.addEventListener('change', () => {
    const isChecked = masterCheckbox.checked;
    // Select/deselect all restaurant checkboxes
    const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#cmp-master-restaurant-checkbox)');
    restaurantCheckboxes.forEach(cb => cb.checked = isChecked);
    
    updateCmpRestaurantButtonText();
    compareRefreshAll();
  });
  
  const masterSpan = document.createElement('span');
  masterSpan.textContent = '✅ Toate';
  
  masterLabel.appendChild(masterCheckbox);
  masterLabel.appendChild(masterSpan);
  container.appendChild(masterLabel);
  
  // Add individual restaurant checkboxes
  RESTAURANTS.forEach(r => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontSize = '14px';
    label.style.cursor = 'pointer';
    label.style.padding = '4px 0';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = r.id;
    checkbox.checked = true; // All selected by default
    checkbox.addEventListener('change', () => {
      updateCmpMasterCheckbox();
      updateCmpRestaurantButtonText();
      compareRefreshAll();
    });
    
    const span = document.createElement('span');
    span.textContent = `${r.icon} ${r.name}`;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    container.appendChild(label);
  });
  
  updateCmpRestaurantButtonText();
}

function updateCmpMasterCheckbox(){
  const masterCheckbox = document.getElementById('cmp-master-restaurant-checkbox');
  const container = document.getElementById('cmp-restaurant-dropdown');
  if(!masterCheckbox || !container) return;
  
  const restaurantCheckboxes = container.querySelectorAll('input[type="checkbox"]:not(#cmp-master-restaurant-checkbox)');
  const checkedCount = Array.from(restaurantCheckboxes).filter(cb => cb.checked).length;
  
  if(checkedCount === 0) {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = false;
  } else if(checkedCount === restaurantCheckboxes.length) {
    masterCheckbox.checked = true;
    masterCheckbox.indeterminate = false;
  } else {
    masterCheckbox.checked = false;
    masterCheckbox.indeterminate = true;
  }
}

function updateCmpRestaurantButtonText(){
  const selectedRestaurants = getCmpSelectedRestaurants();
  const btnText = document.getElementById('cmp-restaurant-btn-text');
  
  if(!btnText) return;
  
  if(selectedRestaurants.length === 0) {
    btnText.textContent = '🏪 Niciun restaurant';
  } else if(selectedRestaurants.length === RESTAURANTS.length) {
    btnText.textContent = '🏪 Toate restaurantele';
  } else if(selectedRestaurants.length === 1) {
    const restaurant = RESTAURANTS.find(r => r.id === selectedRestaurants[0]);
    btnText.textContent = restaurant ? `${restaurant.icon} ${restaurant.name}` : '🏪 1 restaurant';
  } else {
    btnText.textContent = `🏪 ${selectedRestaurants.length} restaurante`;
  }
}

function toggleCmpRestaurantDropdown(){
  const dropdown = document.getElementById('cmp-restaurant-dropdown');
  if(!dropdown) return;
  
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';
}

function hideCmpRestaurantDropdown(){
  const dropdown = document.getElementById('cmp-restaurant-dropdown');
  if(dropdown) {
    dropdown.style.display = 'none';
  }
}

function clearCmpFilters(){
  // Clear category filter
  document.getElementById('cmp-category').value = '';
  
  // Clear search
  document.getElementById('cmp-product-search').value = '';
  
  // Select all restaurants
  const checkboxes = document.querySelectorAll('#cmp-restaurant-dropdown input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
  updateCmpMasterCheckbox();
  updateCmpRestaurantButtonText();
  
  hideCmpRestaurantDropdown();
  compareRefreshAll();
}
cmpFillMetricSelect(cmpEls.x, 'carb');
cmpFillMetricSelect(cmpEls.y, 'sug');
cmpFillMetricSelect(cmpEls.bubble, 'fat');
cmpFillMetricSelect(cmpEls.color, 'pro');

function cmpRenderWeightsUI(){
  cmpEls.weightsWrap.innerHTML='';
  CMP_METRICS.forEach(m=>{
    const row=document.createElement('div');
    row.innerHTML = `
      <label>${m.label}</label>
      <div class="row" style="align-items:center">
        <input type="range" min="-2" max="2" step="0.1" value="${cmpWeights[m.key]||0}" data-key="${m.key}" style="flex:1">
        <input type="number" step="0.1" value="${cmpWeights[m.key]||0}" data-key="${m.key}" style="width:90px">
      </div>
    `;
    cmpEls.weightsWrap.appendChild(row);
  });
  cmpEls.weightsWrap.querySelectorAll('input').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const k=e.target.dataset.key; const v=Number(e.target.value)||0;
      cmpWeights[k]=v; cmpSyncRow(k,v); cmpSaveWeights(); compareRefreshAll();
    });
  });
  function cmpSyncRow(k,v){
    cmpEls.weightsWrap.querySelectorAll(`[data-key="${k}"]`).forEach(x=>{
      if(x!==document.activeElement) x.value=v;
    });
  }
}
cmpRenderWeightsUI();

cmpEls.reset.addEventListener('click', ()=>{
  cmpWeights = { carb:+1.0, sug:-1.0, fat:-0.5, sat:-0.5, fib:+0.5, pro:+0.5, cal:0.0 };
  cmpSaveWeights();
  cmpRenderWeightsUI();
  compareRefreshAll();
});
['input','change'].forEach(ev=>{
  cmpEls.unit.addEventListener(ev, compareRefreshAll);
  cmpEls.search.addEventListener(ev, compareRefreshAll);
  cmpEls.category.addEventListener(ev, compareRefreshAll);
  cmpEls.x.addEventListener(ev, cmpRefreshChart);
  cmpEls.y.addEventListener(ev, cmpRefreshChart);
  cmpEls.bubble.addEventListener(ev, cmpRefreshChart);
  cmpEls.color.addEventListener(ev, cmpRefreshChart);
});

// Compare page restaurant dropdown event listeners
document.getElementById('cmp-restaurant-dropdown-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleCmpRestaurantDropdown();
});

// Compare page clear filters
document.getElementById('cmp-clear-filters')?.addEventListener('click', clearCmpFilters);
cmpEls.export.addEventListener('click', cmpExportCSV);
document.getElementById('cmp-debug').addEventListener('click', ()=>{
  console.log('🐛 DEBUG INFO:');
  console.log('CMP_VIEW length:', CMP_VIEW.length);
  console.log('Sample products:', CMP_VIEW.slice(0,5).map(p => ({
    name: p.name,
    fat: p.fat,
    pro: p.pro,
    carb: p.carb
  })));
  
  const rK = cmpEls.bubble.value;
  const cK = cmpEls.color.value;
  console.log('Selected keys:', {rK, cK});
  
  const fatValues = CMP_VIEW.map(p => p.fat).filter(v => v !== null && v !== undefined);
  const proValues = CMP_VIEW.map(p => p.pro).filter(v => v !== null && v !== undefined);
  const fatRange = fatValues.length > 0 ? [Math.min(...fatValues), Math.max(...fatValues)] : 'No values';
  const proRange = proValues.length > 0 ? [Math.min(...proValues), Math.max(...proValues)] : 'No values';
  console.log('Fat range:', fatRange);
  console.log('Pro range:', proRange);
  
  // Test normalizare
  if(fatRange !== 'No values') {
    const testFat = [fatValues[0], fatValues[Math.floor(fatValues.length/2)], fatValues[fatValues.length-1]];
    console.log('Test fat normalization:', testFat.map(v => ({
      value: v,
      normalized: (v - fatRange[0]) / (fatRange[1] - fatRange[0]),
      radius: 6 + ((v - fatRange[0]) / (fatRange[1] - fatRange[0])) * 18
    })));
  }
});

function cmpMM(arr, key){ 
  let min=+Infinity,max=-Infinity; 
  let validCount = 0;
  const validValues = [];
  for(const a of arr){ 
    const v=a[key]; 
    if(v==null||isNaN(v)||v===undefined) continue; 
    validCount++;
    validValues.push(v);
    if(v<min) min=v; 
    if(v>max) max=v; 
  } 
  
  
  if(!isFinite(min)||!isFinite(max)||validCount===0) return [0,1]; 
  if(min===max) return [min,min+1e-9]; 
  return [min,max]; 
}
function cmpNorm(v,min,max){ return (v-min)/(max-min); }
function cmpColor(val){ 
  // Creez o gamă de culori mai vizibilă: de la albastru (0) la roșu (1)
  const r = Math.round(50 + val * 200);  // 50-250
  const g = Math.round(100 - val * 80);  // 100-20
  const b = Math.round(255 - val * 200); // 255-55
  return `rgb(${r},${g},${b})`; 
}
function cmpRad(v){ 
  // Măresc range-ul pentru o diferență mai vizibilă: de la 6px la 24px
  return 6 + v * 18; 
}
function cmpFmt(n, d=1){ return (Math.round((n??0)*10**d)/10**d).toString(); }

function cmpMapProduct(p){
  const mode = cmpEls.unit.value;
  // Keep null/undefined values instead of converting to 0
  const val = { 
    cal: p.cal ?? null, 
    fat: p.fat ?? null, 
    sat: p.sat ?? null, 
    carb: p.carb ?? null, 
    sug: p.sug ?? null, 
    fib: p.fib ?? null, 
    pro: p.pro ?? null 
  };
  const out = { name:p.name, brand:p.brand||'', base:p.base, gPerPiece:p.gPerPiece, mlPerPiece:p.mlPerPiece, tags:p.tags||[] };

  if(mode==='perServing'){
    if(p.base==='bucata'){ Object.assign(out, val); return out; }
    Object.assign(out, val); return out;
  } else {
    if(p.base==='100g'){ Object.assign(out, val); return out; }
    if(p.base==='100ml'){ Object.assign(out, val); return out; }
    if(p.base==='bucata'){
      if(p.gPerPiece && p.gPerPiece>0){
        const f = 100 / p.gPerPiece;
        Object.assign(out, {
          cal: val.cal !== null ? val.cal * f : null,
          fat: val.fat !== null ? val.fat * f : null,
          sat: val.sat !== null ? val.sat * f : null,
          carb: val.carb !== null ? val.carb * f : null,
          sug: val.sug !== null ? val.sug * f : null,
          fib: val.fib !== null ? val.fib * f : null,
          pro: val.pro !== null ? val.pro * f : null
        });
        return out;
      } else {
        return null;
      }
    }
  }
}

function compareBuildView(){
  const q = (cmpEls.search.value||'').trim().toLowerCase();
  const categoryFilter = cmpEls.category?.value || '';
  const selectedRestaurants = getCmpSelectedRestaurants();
  
  // Get all products (legacy + menu items)
  const allProducts = getAllProducts();
  const arr = allProducts.map(cmpMapProduct).filter(x=>!!x);
  
  let filtered = arr;
  
  // Apply enhanced search filter with synonyms
  if(q) {
    filtered = searchProductsWithSynonyms(q, filtered);
  }
  
  // Apply restaurant filter
  if(selectedRestaurants.length > 0) {
    filtered = filtered.filter(x=>{
      const menuItem = MENU_ITEMS.find(m => m.name === x.name);
      if(menuItem) {
        return selectedRestaurants.includes(menuItem.restaurantId);
      } else {
        return selectedRestaurants.includes('default');
      }
    });
  }
  
  // Apply category filter
  if(categoryFilter) {
    filtered = filtered.filter(x=>{
      const menuItem = MENU_ITEMS.find(m => m.name === x.name);
      if(menuItem) {
        return menuItem.categoryId === categoryFilter;
      } else {
        return categoryFilter === 'general';
      }
    });
  }
  
  CMP_VIEW = filtered;
}

function compareComputeScores(){
  const ranges = {};
  CMP_METRICS.forEach(m=> ranges[m.key]=cmpMM(CMP_VIEW, m.key));
  CMP_VIEW.forEach(it=>{
    let score=0, sumAbs=0;
    CMP_METRICS.forEach(m=>{
      const w = Number(cmpWeights[m.key]||0);
      if(w===0) return;
      const [min,max] = ranges[m.key];
      let nv = cmpNorm(it[m.key], min,max);
      if(w<0) nv = 1-nv;
      score += Math.abs(w)*nv;
      sumAbs += Math.abs(w);
    });
    it.__score = sumAbs>0 ? (score/sumAbs) : 0.5;
  });
}

function compareRefreshAll(){
  compareBuildView();
  compareComputeScores();
  cmpRefreshChart();
  cmpRefreshTop();
  cmpClearSelection();
}

function cmpRefreshChart(){
  if(typeof Chart==='undefined'){
    // Draw a minimal placeholder so UI remains responsive
    const ctx = cmpEls.scatter.getContext('2d');
    ctx.clearRect(0,0,cmpEls.scatter.width, cmpEls.scatter.height);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('Chart.js not loaded yet…', 10, 18);
    // Retry shortly without blocking
    setTimeout(cmpRefreshChart, 400);
    return;
  }
  const xK=cmpEls.x.value, yK=cmpEls.y.value, rK=cmpEls.bubble.value, cK=cmpEls.color.value;
  const [rMin,rMax]=cmpMM(CMP_VIEW,rK), [cMin,cMax]=cmpMM(CMP_VIEW,cK);
  


  const data = CMP_VIEW.map((it,idx)=>{
    const rVal = it[rK];
    const cVal = it[cK];
    
    // Calculate normalized values, handling null/undefined
    const rN = (rVal !== null && rVal !== undefined && isFinite(rVal)) ? cmpNorm(rVal, rMin, rMax) : 0;
    const cN = (cVal !== null && cVal !== undefined && isFinite(cVal)) ? cmpNorm(cVal, cMin, cMax) : 0;
    
    
    return {
      x: it[xK] || 0, y: it[yK] || 0, r: cmpRad(rN),
      backgroundColor: cmpColor(cN),
      borderColor: 'rgba(255,255,255,.15)', borderWidth:1, _idx: idx
    };
  });

  if(CMP_SCATTER) {
    CMP_SCATTER.destroy();
    CMP_SCATTER = null;
  }
  
  // Force clear canvas
  const ctx = cmpEls.scatter.getContext('2d');
  ctx.clearRect(0, 0, cmpEls.scatter.width, cmpEls.scatter.height);
  
  CMP_SCATTER = new Chart(ctx, {
    type:'bubble',
    data:{ datasets:[{label:'Produse', data, parsing:false, pointStyle:'circle'}] },
    options:{
      responsive:true,
      plugins:{
        legend:{ display:false },
        tooltip:{
          callbacks:{
            title: (ctx)=> {
              const d=ctx[0].raw; const it=CMP_VIEW[d._idx];
              return `${it.name}${it.brand?(' · '+it.brand):''}`;
            },
            label: (ctx)=> {
              const it=CMP_VIEW[ctx.raw._idx];
              return [
                `${cmpEls.x.selectedOptions[0].text}: ${cmpFmt(it[cmpEls.x.value])}`,
                `${cmpEls.y.selectedOptions[0].text}: ${cmpFmt(it[cmpEls.y.value])}`,
                `${cmpEls.bubble.selectedOptions[0].text}: ${cmpFmt(it[cmpEls.bubble.value])}`,
                `${cmpEls.color.selectedOptions[0].text}: ${cmpFmt(it[cmpEls.color.value])}`,
                `Scor: ${cmpFmt((it.__score||0)*100,0)}`
              ];
            }
          }
        }
      },
      scales:{
        x:{ title:{display:true,text:cmpEls.x.selectedOptions[0].text,color:'#cbd5e1'}, grid:{color:'#1f2937'}, ticks:{color:'#cbd5e1'} },
        y:{ title:{display:true,text:cmpEls.y.selectedOptions[0].text,color:'#cbd5e1'}, grid:{color:'#1f2937'}, ticks:{color:'#cbd5e1'} },
        r:{ display:false }
      },
      onClick:(evt, elems)=>{
        if(!elems?.length) return;
        const d = elems[0].element.$context.raw;
        cmpShowSelection(CMP_VIEW[d._idx]);
      },
      onHover: (e,els)=> {
        if(els.length>0){
          const it = CMP_VIEW[els[0].element.$context.raw._idx];
          cmpShowSelection(it);
        } else {
          cmpClearSelection();
        }
      }
    }
  });
}

function cmpShowSelection(it){
  if(typeof Chart==='undefined'){
    return; // avoid blocking; radar will render on next refresh once Chart is available
  }
  cmpEls.selectedWrap.style.display='';
  cmpEls.selName.textContent = it.name||'—';
  cmpEls.selBrand.textContent = it.brand?('Brand: '+it.brand):'Brand: —';
  cmpEls.selTags.textContent = (it.tags?.length)?('#'+it.tags.join(' #')):'#no-tags';
  
  // Store the currently selected product
  currentSelectedProduct = it.name;

  const modeText = cmpEls.unit.value==='perServing' ? 'per porție' : 'per 100';
  const rows = [
    ['Calorii (kcal)', it.cal],
    ['Grăsimi (g)', it.fat],
    ['Saturate (g)', it.sat],
    ['Carbohidrați (g)', it.carb],
    ['Zaharuri (g)', it.sug],
    ['Fibre (g)', it.fib],
    ['Proteine (g)', it.pro],
  ].map(([k,v])=>`<tr><td>${k} <span class="hint">(${modeText})</span></td><td class="right">${cmpFmt(v)}</td></tr>`).join('');
  cmpEls.selTable.innerHTML = `<tbody>${rows}</tbody>`;

  const labels = CMP_METRICS.filter(m=>m.key!=='cal').map(m=>m.label);
  const values = CMP_METRICS.filter(m=>m.key!=='cal').map(m=>it[m.key]);
  if(CMP_RADAR) CMP_RADAR.destroy();
  CMP_RADAR = new Chart(cmpEls.radar.getContext('2d'), {
    type:'radar',
    data:{ labels, datasets:[{ label: it.name, data: values, fill:true, borderColor:'#6ec7ff88', backgroundColor:'#6ec7ff22', pointBackgroundColor:'#cfe0ff' }] },
    options:{ plugins:{legend:{display:false}}, scales:{ r:{ angleLines:{color:'#1f2937'}, grid:{color:'#1f2937'}, pointLabels:{color:'#cbd5e1'}, ticks:{display:false} } } }
  });
}

function cmpClearSelection(){
  cmpEls.selectedWrap.style.display='none';
  if(CMP_RADAR){ CMP_RADAR.destroy(); CMP_RADAR=null; }
}

function cmpRefreshTop(){
  const sorted = CMP_VIEW.slice().sort((a,b)=>(b.__score||0)-(a.__score||0)).slice(0,15);
  cmpEls.topBody.innerHTML = sorted.map((it,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${it.name}</td>
      <td>${it.base.replace('100g','100 g').replace('100ml','100 ml')}</td>
      <td class=\"${(it.__score>=0.66)?'ok':(it.__score>=0.4)?'warnTxt':''}\">${cmpFmt((it.__score||0)*100,0)}</td>
      <td class=\"right\">${cmpFmt(it.carb)}</td>
      <td class=\"right\">${cmpFmt(it.sug)}</td>
      <td class=\"right\">${cmpFmt(it.fat)}</td>
      <td class=\"right\">${cmpFmt(it.sat)}</td>
      <td class=\"right\">${cmpFmt(it.fib)}</td>
      <td class=\"right\">${cmpFmt(it.pro)}</td>
      <td class=\"right\">${cmpFmt(it.cal)}</td>
      <td class=\"right\">
        <button class=\"primary\" data-cmp-add=\"${encodeURIComponent(it.name)}\">➕ Adaugă</button>
      </td>
    </tr>
  `).join('');
}

function cmpExportCSV(){
  const headers = ['name','brand','base','score','carb','sug','fat','sat','fib','pro','cal'];
  const rows = CMP_VIEW.slice().sort((a,b)=>(b.__score||0)-(a.__score||0)).map(it=>[
    it.name, it.brand||'', it.base, (it.__score||0).toFixed(4), it.carb, it.sug, it.fat, it.sat, it.fib, it.pro, it.cal
  ]);
  const csv = [headers.join(','), ...rows.map(r=>r.map(v=>{
    if(typeof v==='string' && v.includes(',')) return `\"${v.replace(/\"/g,'\"\"')}\"`;
    return v;
  }).join(','))].join('\\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='compare_scores.csv'; a.click(); URL.revokeObjectURL(url);
}

// Run callback once Chart.js is available (with timeout)
function whenChartReady(callback){
  if(typeof Chart!=='undefined'){ callback(); return; }
  const start = Date.now();
  (function wait(){
    if(typeof Chart!=='undefined'){ callback(); return; }
    if(Date.now()-start>10000){ console.warn('Chart.js not available after 10s; skip'); return; }
    setTimeout(wait, 200);
  })();
}

function initCompare(){
  fillCmpRestaurantDropdown();
  cmpFillCategorySelect();
  whenChartReady(compareRefreshAll);
}

// Function to add product to journal from compare page
function addProductToJournal(productName){
  const product = productByName(productName);
  if(!product) {
    alert('Produsul nu a fost găsit!');
    return;
  }
  
  // Set the product in the journal form
  document.getElementById('jr-product').value = productName;
  updateBaseHint();
  
  // Switch to journal tab
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-tab="jurnal"]').classList.add('active');
  ['jurnal','produse','sumar','tinte','compara','settings'].forEach(id => {
    const sec = document.getElementById('tab-'+id);
    if(sec) sec.hidden = id !== 'jurnal';
  });
  
  // Focus on quantity input
  document.getElementById('jr-qty').focus();
  
  // Show helpful message
  alert(`✅ Produsul "${productName}" a fost selectat în jurnal!\n\nIntrodu cantitatea și apasă "Adaugă înregistrare".`);
}

// Store currently selected product for the "Add to Journal" button
// (currentSelectedProduct is already declared globally above)

// --------- Init ---------
(function init(){
  document.getElementById('jr-date').value = todayISO();
  fillJournalRestaurantDropdown(); fillJournalCategoryDropdown(); fillProductDropdown(); updateBaseHint(); renderJournalForDate(document.getElementById('jr-date').value);
  fillRestaurantDropdowns(); fillCategoryDropdowns(); fillPRestaurantDropdown(); fillCmpRestaurantDropdown(); renderProducts(); renderSummary(); fillTargetsForm();
  updatePopularTags();
  const HAS = 'showDirectoryPicker' in window;
  document.getElementById('fs-status').textContent = HAS ? '📂 Niciun folder selectat' : '❌ Nesuportat în acest browser';
  document.getElementById('fs-status').className = 'hint ' + (HAS ? 'ok' : 'warnTxt');
  
  // Show current folder information
  showCurrentFolderInfo();
  whenChartReady(initCompare); autoLoadFromSameFolder();
  
  // Add event listeners after DOM is loaded
  document.getElementById('p-bulk-add')?.addEventListener('click', showBulkImportModal);
  document.getElementById('bulk-close')?.addEventListener('click', hideBulkImportModal);
  document.getElementById('bulk-cancel')?.addEventListener('click', hideBulkImportModal);
  document.getElementById('bulk-import')?.addEventListener('click', importBulkMenu);
  
  // Filter event listeners
  // Products page event listeners
  document.getElementById('p-filter-category')?.addEventListener('change', renderProducts);
  document.getElementById('p-product-search')?.addEventListener('input', renderProducts);
  document.getElementById('p-product-search')?.addEventListener('focus', renderProducts);
  document.getElementById('p-clear-filters')?.addEventListener('click', clearPJournalFilters);

  // Products page restaurant dropdown event listeners
  document.getElementById('p-restaurant-dropdown-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePRestaurantDropdown();
  });

  // Products page keyboard navigation
  document.getElementById('p-product-search')?.addEventListener('keydown', (e) => {
    const dropdown = document.getElementById('p-product-dropdown');
    if(!dropdown || dropdown.style.display === 'none') return;
    
    const items = document.querySelectorAll('.p-dropdown-item');
    if(!items.length) return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if(pSelectedDropdownIndex < items.length - 1) {
          highlightPDropdownItem(pSelectedDropdownIndex + 1);
        } else {
          highlightPDropdownItem(0); // Wrap to first item
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if(pSelectedDropdownIndex > 0) {
          highlightPDropdownItem(pSelectedDropdownIndex - 1);
        } else {
          highlightPDropdownItem(items.length - 1); // Wrap to last item
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if(pSelectedDropdownIndex >= 0 && pFilteredProducts[pSelectedDropdownIndex]) {
          const product = pFilteredProducts[pSelectedDropdownIndex];
          selectPProduct(product.name);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        hidePProductDropdown();
        break;
    }
  });
  
  // Add click outside modal to close
  document.getElementById('bulk-import-modal')?.addEventListener('click', (e) => {
    if(e.target.id === 'bulk-import-modal') {
      hideBulkImportModal();
    }
  });
  
  // Add escape key to close modal
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      const modal = document.getElementById('bulk-import-modal');
      if(modal && !modal.hidden) {
        hideBulkImportModal();
      }
    }
  });
  
  // Add event listeners for compare page "Add to Journal" buttons
  document.getElementById('cmp-top')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cmp-add]');
    if(btn) {
      const productName = decodeURIComponent(btn.getAttribute('data-cmp-add'));
      addProductToJournal(productName);
    }
  });
  
  // Add event listener for the "Add to Journal" button in selected product details
  document.getElementById('cmp-add-to-journal')?.addEventListener('click', () => {
    if(currentSelectedProduct) {
      addProductToJournal(currentSelectedProduct);
    } else {
      alert('Nu ai selectat niciun produs! Click pe un punct din grafic pentru a selecta un produs.');
    }
  });
  
  // Taxonomy management event listeners
  document.getElementById('tax-add-alias')?.addEventListener('click', addTagAlias);
  document.getElementById('tax-add-category-mapping')?.addEventListener('click', addCategoryMapping);
  document.getElementById('tax-save-changes')?.addEventListener('click', saveTaxonomyChanges);
  document.getElementById('tax-reload-taxonomy')?.addEventListener('click', () => {
    TAXONOMY = loadTaxonomy();
    renderTaxonomyManagement();
    alert('Taxonomia a fost reîncărcată!');
  });
  document.getElementById('tax-export-taxonomy')?.addEventListener('click', exportTaxonomy);
  document.getElementById('tax-import-taxonomy')?.addEventListener('click', importTaxonomy);
  document.getElementById('tax-import-file')?.addEventListener('change', handleTaxonomyImport);
  document.getElementById('tax-test-search-btn')?.addEventListener('click', testTaxonomySearch);
  
  // Allow Enter key in test search
  document.getElementById('tax-test-search')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      testTaxonomySearch();
    }
  });
  
  // Event delegation for remove buttons
  document.getElementById('tax-aliases-list')?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('button[data-remove-alias]');
    if (removeBtn) {
      const canonicalTag = removeBtn.getAttribute('data-remove-alias');
      removeTagAlias(canonicalTag);
    }
  });
  
  document.getElementById('tax-category-mappings-list')?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('button[data-remove-mapping]');
    if (removeBtn) {
      const category = removeBtn.getAttribute('data-remove-mapping');
      removeCategoryMapping(category);
    }
  });
// ===== Portable mode helpers =====
async function tryLoadJSON(name){
  try{
    const resp = await fetch('./'+name+'.json', {cache:'no-store'});
    if(!resp.ok) return false;
    const data = await resp.json();
    if(name==='products' && Array.isArray(data)){
      PRODUCTS = migrateProducts(data); saveProducts(PRODUCTS);
    } else if(name==='journal' && Array.isArray(data)){
      JOURNAL = data; saveJournal(JOURNAL);
    } else if(name==='targets' && data && typeof data==='object'){
      TARGETS = data; saveTargets(TARGETS);
    } else if(name==='restaurants' && Array.isArray(data)){
      RESTAURANTS = data; saveRestaurants(RESTAURANTS);
    } else if(name==='categories' && Array.isArray(data)){
      CATEGORIES = data; saveCategories(CATEGORIES);
    } else if(name==='menu_items' && Array.isArray(data)){
      MENU_ITEMS = data; saveMenuItems(MENU_ITEMS);
    } else if(name==='taxonomy' && data && typeof data==='object'){
      TAXONOMY = data; saveTaxonomy(TAXONOMY);
    } else { return false; }
    return true;
  }catch{ return false; }
}
async function autoLoadFromSameFolder(){
  const p = await tryLoadJSON('products');
  const j = await tryLoadJSON('journal');
  const t = await tryLoadJSON('targets');
  const r = await tryLoadJSON('restaurants');
  const c = await tryLoadJSON('categories');
  const m = await tryLoadJSON('menu_items');
  const tax = await tryLoadJSON('taxonomy');
  if(p||j||t||r||c||m||tax){
    renderProducts(); fillProductDropdown(); fillRestaurantDropdowns(); fillCategoryDropdowns();
    renderJournalForDate(document.getElementById('jr-date').value);
    renderSummary(); fillTargetsForm(); if (typeof compareRefreshAll === 'function') compareRefreshAll();
    updatePopularTags();
  }
}

})();
