export const previews = [
  { file: 'initial-assessment', title: 'Initial patient assessment' },
  { file: 'acute-vomiting', title: 'A dog with acute vomiting' },
  { file: 'pruritus', title: 'A dog with intense pruritus' },
  { file: 'emergency-flowchart', title: 'Emergency decision guide' },
  { file: 'warning-signs', title: 'Warning signs table' },
  { file: 'clinical-checklist', title: 'Rapid clinical assessment' },
];

// Keep checkout offer parameters intact; carry only known attribution fields.
export function checkoutLink(checkout, search = '') {
  const url = new URL(checkout);
  if (url.protocol !== 'https:') throw new Error('Checkout must use HTTPS.');
  const allowed = /^(utm_(source|medium|campaign|content|term|id)|fbclid|gclid|ttclid|sck|xcod)$/;
  for (const [key, value] of new URLSearchParams(search)) {
    if (allowed.test(key) && value) url.searchParams.set(key, value);
  }
  return url.href;
}

export function validateOffer(offer) {
  if (!offer || typeof offer !== 'object') throw new Error('Offer must be an object.');
  // This storefront describes the uploaded Spanish edition. An English product
  // requires translated assets and copy updates, not just changing this value.
  if (offer.manualLanguage !== 'Spanish') throw new Error('The current product edition is Spanish.');
  if (offer.checkoutUrl && (typeof offer.price !== 'number' || !Number.isFinite(offer.price) || offer.price <= 0)) {
    throw new Error('A live checkout requires a positive price.');
  }
  if (offer.checkoutUrl) checkoutLink(offer.checkoutUrl);
  new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency });
  return offer;
}

if (typeof document !== 'undefined') {
  const gallery = document.querySelector('.gallery');
  const motionButton = document.querySelector('#motion-toggle');
  const previewDialog = document.querySelector('#preview-dialog');
  const availabilityDialog = document.querySelector('#availability-dialog');
  let selectedIndex = 0;
  let liveOffer = null;
  let lastPreviewTrigger = null;

  function renderPreview(index) {
    selectedIndex = (index + previews.length) % previews.length;
    const item = previews[selectedIndex];
    document.querySelector('#preview-title').textContent = item.title;
    const image = document.querySelector('#preview-image');
    image.src = `assets/${item.file}.webp`;
    image.alt = `${item.title}, original Spanish page from the manual`;
    document.querySelector('#preview-position').textContent = `${selectedIndex + 1} / ${previews.length}`;
  }

  document.querySelectorAll('.marquee').forEach((row, rowIndex) => {
    const track = row.querySelector('.marquee-track');
    const indices = previews.map((_, i) => (i + rowIndex * 3) % previews.length);
    for (let copy = 0; copy < 2; copy++) {
      for (const index of indices) {
        const item = previews[index];
        const card = document.createElement('figure');
        card.className = 'sample';
        if (copy) { card.dataset.duplicate = ''; card.setAttribute('aria-hidden', 'true'); }
        card.innerHTML = `<button type="button" aria-label="Enlarge ${item.title}"><img src="assets/${item.file}-thumb.webp" width="330" height="495" loading="lazy" decoding="async" alt="${item.title}, original Spanish edition"><span class="zoom-hint" aria-hidden="true">+</span></button><figcaption><span>ORIGINAL SPANISH PAGE</span><strong>${item.title}</strong></figcaption>`;
        if (copy) card.querySelector('button').tabIndex = -1;
        card.querySelector('button').addEventListener('click', (event) => {
          lastPreviewTrigger = event.currentTarget;
          renderPreview(index);
          previewDialog.showModal();
        });
        track.append(card);
      }
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateMotionControl() {
    motionButton.hidden = reducedMotion.matches;
  }
  updateMotionControl();
  reducedMotion.addEventListener('change', updateMotionControl);
  motionButton.addEventListener('click', () => {
    const paused = gallery.classList.toggle('paused');
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Resume motion ▶' : 'Pause motion Ⅱ';
  });

  document.querySelector('#previous-preview').addEventListener('click', () => renderPreview(selectedIndex - 1));
  document.querySelector('#next-preview').addEventListener('click', () => renderPreview(selectedIndex + 1));
  previewDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); renderPreview(selectedIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); renderPreview(selectedIndex + 1); }
  });
  previewDialog.addEventListener('close', () => lastPreviewTrigger?.focus({ preventScroll: true }));
  document.querySelector('#preview-cta').addEventListener('click', () => previewDialog.close());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));

  const checkoutButton = document.querySelector('#checkout-button');
  checkoutButton.addEventListener('click', () => {
    if (liveOffer) window.location.assign(checkoutLink(liveOffer.checkoutUrl, window.location.search));
    else availabilityDialog.showModal();
  });

  // Missing or invalid configuration safely keeps the truthful prelaunch state.
  fetch('offer.json', { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error('Offer configuration unavailable.');
    return response.json();
  }).then(validateOffer).then(offer => {
    if (!offer.checkoutUrl) return;
    const price = document.querySelector('#offer-price');
    price.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency }).format(offer.price);
    const currency = document.createElement('small');
    currency.textContent = `${offer.currency} · One-time payment`;
    price.append(currency);
    price.hidden = false;
    checkoutButton.innerHTML = 'GET THE MANUAL <svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
    document.querySelector('#offer-note').textContent = 'Payment and delivery details are provided at checkout.';
    document.querySelector('#purchase-faq').textContent = 'Select “Get the manual” to continue to the secure checkout. Review the payment and delivery details there before completing your purchase.';
    liveOffer = offer;
  }).catch(error => console.warn('The storefront remains in prelaunch mode:', error.message));
}
