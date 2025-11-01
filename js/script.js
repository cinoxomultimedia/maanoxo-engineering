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
