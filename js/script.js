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