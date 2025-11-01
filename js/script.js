document.getElementById('year').textContent = new Date().getFullYear();
function sendQuery(e){
  e.preventDefault();
  const name = encodeURIComponent(document.getElementById('name').value.trim());
  const phone = encodeURIComponent(document.getElementById('phone').value.trim());
  const msg = encodeURIComponent(document.getElementById('msg').value.trim());
  const text = `Name: ${name}%0AContact: ${phone}%0ARequest: ${msg}`;
  const wa = `https://wa.me/918956317468?text=${text}`;
  window.open(wa, '_blank', 'noopener');
  return false;
}
// Search icon show/hide
document.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('searchIcon');
  const box  = document.getElementById('searchBox');
  const input = document.getElementById('productSearch');
  const list  = document.getElementById('productList');

  if (!icon || !box || !input) return;

  // Toggle show/hide
  icon.addEventListener('click', () => {
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) input.focus();
  });

  // Build product list
  const cards = document.querySelectorAll('#products article[data-brand]');
  const items = Array.from(cards).map((card, i) => {
    const title = card.querySelector('h3')?.textContent?.trim() || `Product ${i+1}`;
    const model = card.dataset.model || '';
    if (!card.id) card.id = `product-${i+1}`;
    const option = document.createElement('option');
    option.value = model ? `${title} — ${model}` : title;
    list.appendChild(option);
    return { id: card.id, el: card, title, model, text: `${title} ${model}`.toLowerCase() };
  });

  // On submit or enter
  input.addEventListener('change', () => {
    const q = input.value.toLowerCase();
    const match = items.find(p => p.text.includes(q));
    if (match) {
      match.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      match.el.classList.add('ring-2','ring-brandBlue');
      setTimeout(() => match.el.classList.remove('ring-2','ring-brandBlue'), 1500);
      box.classList.add('hidden'); // hide search after select
    }
  });
});
// === Quote Basket with Delete / Clear / Toggle + FLASH FEEDBACK ===
(function(){
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
      btn.textContent = selected ? 'Remove' : 'Add to Quote';
      btn.classList.toggle('text-brandBlue', !selected);
      btn.classList.toggle('border-brandBlue', !selected);
      btn.classList.toggle('text-rose-700', selected);
      btn.classList.toggle('border-rose-600', selected);
      // Ensure previous success classes cleared
      btn.classList.remove('text-emerald-700','border-emerald-600','text-slate-700','border-slate-400');
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

  // Toggle add/remove on product buttons + FLASH
  document.querySelectorAll('.add-to-quote').forEach(btn=>{
    btn.addEventListener('click', ()=>{
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
    });
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
})();

