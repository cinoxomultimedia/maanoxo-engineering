document.getElementById('year').textContent = new Date().getFullYear();
let siteContact = null; // Store contact info globally for form submission

function sendQuery(e){
  e.preventDefault();
  const name = encodeURIComponent(document.getElementById('name').value.trim());
  const phone = encodeURIComponent(document.getElementById('phone').value.trim());
  const msg = encodeURIComponent(document.getElementById('msg').value.trim());
  const text = `Name: ${name}%0AContact: ${phone}%0ARequest: ${msg}`;
  const waNum = (siteContact && siteContact.contacts[1]) ? siteContact.contacts[1].wa : '918956317468';
  const wa = `https://wa.me/${waNum}?text=${text}`;
  window.open(wa, '_blank', 'noopener');
  return false;
}

// === MAIN INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. FETCH & RENDER ALL SITE CONTENT
  try {
    const [productsRes, brandsRes, aboutRes, contactRes] = await Promise.all([
      fetch('products.json'),
      fetch('brands.json'),
      fetch('about.json'),
      fetch('contact.json')
    ]);

    // Products
    const products = await productsRes.json();
    const grid = document.getElementById('product-grid');
    const dataList = document.getElementById('productList');

    if (grid) {
      grid.innerHTML = products.map(p => `
        <article class="card bg-white border border-slate-200 rounded-2xl overflow-hidden"
          data-brand="${p.brand}" data-model="${p.model}" data-keywords="${p.keywords}">
          <img src="${p.image}" alt="${p.title}" class="w-full aspect-[4/3] object-cover">
          <div class="p-5">
            <h3 class="font-bold">${p.title}</h3>
            <p class="text-sm text-slate-600 mt-1">${p.description}</p>
            <div class="mt-4 flex items-center justify-between gap-2">
              <span class="font-extrabold text-brandBlue" data-price="${p.price}">${p.priceDisplay}</span>
              <div class="flex items-center gap-2">
                <button class="add-to-quote text-sm font-semibold text-brandBlue border border-brandBlue px-3 py-2 rounded-lg"
                        data-title="${p.title}" data-model="${p.model}">Add to Quote</button>
                <a href="https://wa.me/918956317466?text=Quote%20request%3A%20${encodeURIComponent(p.title)}%20(${p.model})"
                   target="_blank" rel="noopener"
                   class="text-sm font-semibold text-white bg-brandBlue px-3 py-2 rounded-lg">Get Quote</a>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }

    if(dataList) {
      dataList.innerHTML = products.map(p => `<option value="${p.title} (${p.model})">`).join('');
    }
  } catch (err) {
    console.error('Error loading site content:', err);
  }

  // Brands
  try {
    const brandsRes = await fetch('brands.json');
    const brands = await brandsRes.json();
    const brandGrid = document.getElementById('brandGrid');
    if (brandGrid) {
      brandGrid.innerHTML = brands.map(brand => `
        <a href="?brand=${encodeURIComponent(brand.name)}#products" class="bg-white rounded-xl border border-slate-200 p-4 grid place-items-center hover:border-brandBlue font-semibold" data-brand="${brand.name}">${brand.name}</a>
      `).join('');
    }

    // About
    const aboutRes = await fetch('about.json');
    const about = await aboutRes.json();
    document.getElementById('about-title').textContent = about.title;
    document.getElementById('about-description').textContent = about.description;
    document.getElementById('about-features').innerHTML = about.features.map(feat => `<li>• ${feat}</li>`).join('');

    // Contact
    const contactRes = await fetch('contact.json');
    const contact = await contactRes.json();
    siteContact = contact; // Save for global usage

    const primary = contact.contacts[0];
    const secondary = contact.contacts[1];

    // 1. Header Strip
    const hCall = document.getElementById('header-call');
    const hWa = document.getElementById('header-wa');
    if(hCall) { hCall.textContent = `Call: ${primary.label}`; hCall.href = `tel:${primary.tel}`; }
    if(hWa) { hWa.textContent = `WhatsApp: ${primary.label}`; hWa.href = `https://wa.me/${primary.wa}?text=Hello`; }

    // 2. Navbar & Floating
    const navWa = document.getElementById('nav-wa');
    const floatWa = document.getElementById('float-wa');
    if(navWa) navWa.href = `https://wa.me/${primary.wa}?text=Hello%20Maanoxo%2C%20I%20want%20a%20quote`;
    if(floatWa) floatWa.href = `https://wa.me/${primary.wa}?text=Hello%20Maanoxo%2C%20I%27d%20like%20to%20discuss%20tools.`;

    // 3. About Section
    document.getElementById('contact-office').textContent = contact.office;
    document.getElementById('contact-gst').textContent = contact.gst;
    document.getElementById('contact-call').innerHTML = contact.contacts.map(c => 
      `<a class="text-brandBlue nav-link" href="tel:${c.tel}">${c.label}</a>`
    ).join(' / ');
    const aboutWa = document.getElementById('about-wa');
    if(aboutWa) aboutWa.href = `https://wa.me/${secondary.wa}?text=Hello%20Maanoxo%2C%20please%20share%20your%20latest%20price%20list.`;

    // 4. Contact Section Buttons
    const btnContainer = document.getElementById('contact-wa-buttons');
    if(btnContainer) {
      btnContainer.innerHTML = `
        <a href="https://wa.me/${secondary.wa}?text=Hello%20Maanoxo%2C%20I%20need%20a%20quote." target="_blank" rel="noopener" class="bg-brandYellow text-slate-900 font-semibold px-5 py-3 rounded-xl shadow">WhatsApp ${secondary.label}</a>
        <a href="https://wa.me/${primary.wa}?text=Hello%20Maanoxo%2C%20I%20need%20a%20quote." target="_blank" rel="noopener" class="bg-white/10 border border-white/20 px-5 py-3 rounded-xl">WhatsApp ${primary.label}</a>
      `;
    }

  } catch (err) {
    console.error('Error loading page details:', err);
  }
  
  // 2. SEARCH LOGIC (Initialized after render)
  const icon  = document.getElementById('searchIcon');
  const box   = document.getElementById('searchBox');
  const input = document.getElementById('productSearch');
  const dlist = document.getElementById('productList');

  if (icon && box && input && dlist) {
    // Toggle show/hide
    icon.addEventListener('click', () => {
      box.classList.toggle('hidden');
      if (!box.classList.contains('hidden')) input.focus();
    });

    // Build product index from cards
    const cards = Array.from(document.querySelectorAll('#products article[data-brand]')).map((card, i) => {
      const title = card.querySelector('h3')?.textContent?.trim() || `Product ${i+1}`;
      const model = card.dataset.model || '';
      if (!card.id) card.id = `product-${i+1}`;
      // Note: datalist options already populated during render
      return {
        id: card.id,
        el: card,
        title,
        model,
        text: `${title} ${model}`.toLowerCase()
      };
    });

    // Jump to best match (change/select)
    function jumpToMatch() {
      const q = input.value.toLowerCase().trim();
      if (!q) return;
      // Exact model first
      let match = cards.find(p => p.model && p.model.toLowerCase() === q)
               || cards.find(p => p.model && p.model.toLowerCase().includes(q))
               || cards.find(p => p.text.includes(q));
      if (!match) return;
      match.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      match.el.classList.add('ring-2','ring-brandBlue','ring-offset-2','ring-offset-white');
      setTimeout(() => match.el.classList.remove('ring-2','ring-brandBlue','ring-offset-2','ring-offset-white'), 1500);
      box.classList.add('hidden');
    }

    // Enter press via form submit & datalist change
    document.getElementById('productSearchForm')?.addEventListener('submit', jumpToMatch);
    input.addEventListener('change', jumpToMatch);

    // Keyboard shortcut: "/" to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault(); 
        box.classList.remove('hidden');
        input.focus();
      }
    });
  }

  // 3. QUOTE BASKET LOGIC
  const KEY='quoteItems';
  const fab = document.getElementById('quoteFab');
  const countEl = document.getElementById('quoteCount');

  const modal = document.getElementById('quoteModal');
  const mBody = document.getElementById('quoteBody');
  const mClose= document.getElementById('quoteClose');
  const mClear= document.getElementById('quoteClear');
  const mSend = document.getElementById('quoteSend');
  const mBack = document.getElementById('quoteBackdrop');

  const toast = document.getElementById('toast');

  // Helpers (storage)
  function load(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]} }
  function save(items){ localStorage.setItem(KEY, JSON.stringify(items)); updateUI(); }
  function inList(items, title, model){ return items.findIndex(i => i.title===title && i.model===model); }
  function addItem(title, model){ const items = load(); if (inList(items, title, model)===-1) { items.push({title, model}); save(items);} }
  function removeItem(title, model){ const items = load(); const i=inList(items,title,model); if(i>-1){ items.splice(i,1); save(items);} }
  function clearAll(){ save([]); }

  // Flash toast + FAB pulse
  function showToast(text, color='emerald'){
    if(!toast) return;
    toast.textContent = text;
    toast.className = `fixed bottom-5 right-5 z-50 bg-${color}-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg`;
    toast.classList.remove('hidden');
    // FAB pulse
    fab?.classList.add('animate-pulse');
    setTimeout(()=>{ toast.classList.add('hidden'); fab?.classList.remove('animate-pulse'); }, 1200);
  }

  // Button visual states
  function setBtnAdded(btn){
    btn.textContent='Added ✓';
    btn.disabled = true;
    btn.classList.remove('text-brandBlue','border-brandBlue');
    btn.classList.add('text-emerald-700','border-emerald-600');
    setTimeout(()=>{
      btn.disabled = false;
      btn.textContent='Remove';
    }, 800);
  }
  function setBtnRemoved(btn){
    btn.textContent='Removed';
    btn.disabled = true;
    btn.classList.remove('text-rose-700','border-rose-600','text-emerald-700','border-emerald-600');
    btn.classList.add('text-slate-700','border-slate-400');
    setTimeout(()=>{
      btn.disabled = false;
      btn.textContent='Add to Quote';
      btn.classList.remove('text-slate-700','border-slate-400');
      btn.classList.add('text-brandBlue','border-brandBlue');
    }, 800);
  }

  // Update FAB + buttons + (if open) modal
  function updateUI(){
    const items = load();
    if (fab && countEl){
      countEl.textContent = items.length;
      fab.classList.toggle('hidden', items.length===0);
    }
    document.querySelectorAll('.add-to-quote').forEach(btn=>{
      const t = btn.dataset.title||''; const m = btn.dataset.model||'';
      const selected = inList(items,t,m) > -1;
      // Only update if not in a transition state (disabled)
      if(!btn.disabled) {
        btn.textContent = selected ? 'Remove' : 'Add to Quote';
        btn.classList.toggle('text-brandBlue', !selected);
        btn.classList.toggle('border-brandBlue', !selected);
        btn.classList.toggle('text-rose-700', selected);
        btn.classList.toggle('border-rose-600', selected);
        btn.classList.remove('text-emerald-700','border-emerald-600','text-slate-700','border-slate-400');
      }
    });
    if (!modal?.classList.contains('hidden')) renderModal();
  }

  // Modal renderer
  function renderModal(){
    const items = load();
    if (!items.length){
      mBody.innerHTML = `<p class="text-slate-600 text-sm">No items added yet. Click “Add to Quote” on any product.</p>`;
      mSend?.classList.add('pointer-events-none','opacity-50');
      return;
    }
    mSend?.classList.remove('pointer-events-none','opacity-50');
    mBody.innerHTML = `
      <ul class="divide-y">
        ${items.map((it,i)=>`
          <li class="py-3 flex items-center justify-between gap-3">
            <div>
              <p class="font-semibold">${i+1}. ${it.title}</p>
              ${it.model ? `<p class="text-sm text-slate-600">Model: ${it.model}</p>` : ''}
            </div>
            <button class="remove-item text-sm px-3 py-1.5 border border-rose-600 text-rose-700 rounded-lg"
                    data-title="${it.title}" data-model="${it.model}">Delete</button>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Open/Close modal
  function openModal(){ modal?.classList.remove('hidden'); renderModal(); }
  function closeModal(){ modal?.classList.add('hidden'); }

  // Event Delegation for Add to Quote (since buttons are dynamic)
  document.getElementById('product-grid')?.addEventListener('click', (e) => {
    if(e.target.classList.contains('add-to-quote')) {
      const btn = e.target;
      const title = btn.dataset.title||''; const model = btn.dataset.model||'';
      const items = load();
      const idx = inList(items, title, model);
      if (idx === -1) {
        addItem(title, model);
        setBtnAdded(btn);
        showToast(`${title}${model?` (${model})`:''} added to Quote`, 'emerald');
      } else {
        removeItem(title, model);
        setBtnRemoved(btn);
        showToast(`${title}${model?` (${model})`:''} removed`, 'rose');
      }
    }
  });

  // FAB + modal controls
  fab?.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
  mBack?.addEventListener('click', closeModal);
  mClose?.addEventListener('click', closeModal);
  mClear?.addEventListener('click', ()=>{ if(confirm('Remove all items from your quote?')) { clearAll(); showToast('All items removed','rose'); } });

  // Modal: delete one
  mBody?.addEventListener('click', (e)=>{
    const btn = e.target.closest('.remove-item'); if(!btn) return;
    removeItem(btn.dataset.title||'', btn.dataset.model||'');
    showToast('Item removed','rose');
  });

  // Send on WhatsApp
  mSend?.addEventListener('click', (e)=>{
    e.preventDefault();
    const items = load(); if(!items.length) return;
    const lines = items.map((it,i)=>`${i+1}. ${it.title}${it.model?` (Model: ${it.model})`:''}`).join('%0A');
    const msg = `Hello Maanoxo,%0AI want a quotation for:%0A${lines}%0A--%0AName:%0APhone:`;
    location.href = `https://wa.me/918956317466?text=${msg}`;
  });

  // First paint
  updateUI();
});
