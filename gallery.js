(() => {
  const sourceItems = Array.isArray(window.RASSVET_GALLERY) ? window.RASSVET_GALLERY : [];
  const categoryPositions = new Map();
  const items = sourceItems.map((item) => {
    const position = (categoryPositions.get(item.category) || 0) + 1;
    const caption = `${item.category} ${position}`;
    categoryPositions.set(item.category, position);
    return { ...item, caption, alt: `Rassvet — ${caption}` };
  });

  const grid = document.querySelector('.gallery-grid');
  const summary = document.querySelector('.gallery-heading > p');
  const heroVisual = document.querySelector('.hero-visual');
  const heroCopy = document.querySelector('.hero-copy');
  const contactCopy = document.querySelector('.contact-copy');
  const intro = document.querySelector('.intro');
  const askingPrice = '€7,000';

  ['hero-photo.css', 'sale-price.css', 'sale-context.css', 'i18n.css'].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.append(stylesheet);
  });

  const createSalePrice = () => {
    const price = document.createElement('div');
    const label = document.createElement('span');
    const value = document.createElement('strong');
    const note = document.createElement('small');

    price.className = 'sale-price';
    price.setAttribute('aria-label', `Asking price ${askingPrice}. Reasonable offers considered after viewing.`);
    label.textContent = 'Asking price';
    value.textContent = askingPrice;
    note.textContent = 'Reasonable offers considered after viewing.';
    price.append(label, value, note);
    return price;
  };

  const renderSalePrice = () => {
    if (heroCopy && !heroCopy.querySelector('.sale-price')) {
      const actions = heroCopy.querySelector('.hero-actions');
      const price = createSalePrice();
      if (actions) actions.before(price);
      else heroCopy.append(price);
    }

    if (contactCopy && !contactCopy.querySelector('.sale-price')) {
      const heading = contactCopy.querySelector('h2');
      const price = createSalePrice();
      if (heading) heading.after(price);
      else contactCopy.prepend(price);
    }
  };

  const renderSaleContext = () => {
    if (!intro || document.querySelector('#sale-context')) return;

    const section = document.createElement('section');
    section.className = 'section sale-context';
    section.id = 'sale-context';
    section.setAttribute('aria-labelledby', 'sale-context-title');
    section.innerHTML = `
      <div class="sale-context-panel">
        <header class="sale-context-header">
          <div>
            <p class="eyebrow">Reason for sale</p>
            <h2 id="sale-context-title">Why Rassvet is for sale</h2>
          </div>
          <p class="sale-context-lead">Rassvet is for sale only because I have bought a yacht better suited to my future ocean passages. I cannot give both boats the time and attention they deserve.</p>
        </header>
        <div class="sale-context-grid">
          <article class="sale-context-card">
            <span>Work already completed</span>
            <h3>Sold as a complete cruising yacht</h3>
            <p>Since buying Rassvet in Sweden in 2023, I have carried out substantial work on the hull, deck, rig, engine installation, electrical system and cruising equipment. She is being sold with the equipment listed on this website rather than stripped back before sale.</p>
            <p>The asking price is intended to make the sale straightforward and to help the next owner start sailing without first having to complete a long refit.</p>
          </article>
          <article class="sale-context-card">
            <span>For a new skipper</span>
            <h3>A practical first cruising yacht</h3>
            <p>Rassvet is a manageable and forgiving yacht for someone moving into independent coastal cruising. Her systems are comparatively simple, the maintenance history is documented, and the major known issues discovered during the current ownership have been addressed.</p>
            <p>Like every yacht of this age, she will still require regular inspection and maintenance, but the next owner will not be starting with an unknown or neglected boat.</p>
          </article>
        </div>
      </div>
    `;

    intro.after(section);
  };

  renderSalePrice();
  renderSaleContext();

  if (!grid && !heroVisual) return;

  const createPicture = ({ webp, jpeg }, alt, loading = 'lazy') => {
    const picture = document.createElement('picture');
    const source = document.createElement('source');
    const image = document.createElement('img');

    source.type = 'image/webp';
    source.srcset = webp;
    image.src = jpeg;
    image.alt = alt;
    image.loading = loading;
    image.decoding = 'async';
    picture.append(source, image);
    return picture;
  };

  const renderHeroPhoto = () => {
    if (!heroVisual) return;
    const leadItem = items.find((item) => item.lead) ?? items[0];
    const frame = document.createElement('div');

    heroVisual.classList.add('hero-photo');
    heroVisual.removeAttribute('aria-label');
    frame.className = 'hero-photo-frame';

    if (leadItem) {
      const picture = createPicture(leadItem.full, leadItem.alt, 'eager');
      const image = picture.querySelector('img');
      frame.classList.add('has-photo');
      if (image) {
        image.fetchPriority = 'high';
        image.sizes = '(max-width: 1000px) 100vw, 52vw';
      }
      frame.append(picture);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'hero-photo-placeholder';
      placeholder.setAttribute('aria-hidden', 'true');
      frame.append(placeholder);
    }

    heroVisual.replaceChildren(frame);
  };

  renderHeroPhoto();
  if (!grid) return;

  if (items.length === 0) {
    grid.className = 'gallery-grid gallery-empty reveal is-visible';
    const title = document.createElement('h3');
    const text = document.createElement('p');
    title.textContent = 'Photographs are being prepared';
    text.textContent = 'The gallery will appear automatically after photographs are added to the repository folders.';
    grid.replaceChildren(title, text);
    if (summary) summary.textContent = 'Original photographs are loaded automatically from the organised gallery folders.';
    return;
  }

  let currentIndex = 0;
  let lastFocusedElement = null;

  const viewer = document.createElement('div');
  const viewerPanel = document.createElement('div');
  const viewerContent = document.createElement('div');
  const closeButton = document.createElement('button');
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  viewer.className = 'gallery-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Photograph viewer');
  viewerPanel.className = 'gallery-viewer-panel';
  viewerContent.className = 'gallery-viewer-content';

  closeButton.type = 'button';
  closeButton.className = 'gallery-viewer-close';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.textContent = '×';

  previousButton.type = 'button';
  previousButton.className = 'gallery-viewer-nav gallery-viewer-previous';
  previousButton.setAttribute('aria-label', 'Previous photograph');
  previousButton.textContent = '‹';

  nextButton.type = 'button';
  nextButton.className = 'gallery-viewer-nav gallery-viewer-next';
  nextButton.setAttribute('aria-label', 'Next photograph');
  nextButton.textContent = '›';

  viewerPanel.append(viewerContent, closeButton, previousButton, nextButton);
  viewer.append(viewerPanel);
  document.body.append(viewer);

  const renderViewerPhoto = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    const category = document.createElement('span');
    const title = document.createElement('strong');

    figure.className = 'dialog-photo';
    category.textContent = item.category;
    title.textContent = item.caption;
    caption.append(category, title);
    figure.append(createPicture(item.full, item.alt, 'eager'), caption);
    viewerContent.replaceChildren(figure);
  };

  const openPhoto = (index) => {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    renderViewerPhoto(index);
    viewer.hidden = false;
    document.body.classList.add('gallery-viewer-open');
    requestAnimationFrame(() => viewer.classList.add('is-open'));
    closeButton.focus({ preventScroll: true });
  };

  const closeViewer = () => {
    viewer.classList.remove('is-open');
    document.body.classList.remove('gallery-viewer-open');
    window.setTimeout(() => {
      viewer.hidden = true;
      viewerContent.replaceChildren();
    }, 160);
    lastFocusedElement?.focus?.({ preventScroll: true });
  };

  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    const button = document.createElement('button');
    const caption = document.createElement('span');
    const category = document.createElement('small');
    const title = document.createElement('strong');

    button.type = 'button';
    button.className = 'gallery-item gallery-photo';
    if (item.lead || index === 0) button.classList.add('gallery-featured');
    else if (item.portrait) button.classList.add('gallery-portrait');
    else if (index % 5 === 1) button.classList.add('gallery-wide');

    button.setAttribute('aria-label', `Open photograph: ${item.caption}`);
    button.dataset.galleryIndex = String(index);
    button.addEventListener('click', () => openPhoto(index));

    const picture = createPicture(item.thumbnail, item.alt, index < 2 ? 'eager' : 'lazy');
    const image = picture.querySelector('img');
    if (index === 0 && image) image.fetchPriority = 'high';

    caption.className = 'gallery-caption';
    category.textContent = item.category;
    title.textContent = item.caption;
    caption.append(category, title);
    button.append(picture, caption);
    fragment.append(button);
  });

  grid.className = 'gallery-grid gallery-photo-grid reveal is-visible';
  grid.replaceChildren(fragment);
  if (summary) {
    summary.textContent = `${items.length} original photograph${items.length === 1 ? '' : 's'}, automatically resized for fast loading and available in full view.`;
  }

  closeButton.addEventListener('click', closeViewer);
  previousButton.addEventListener('click', () => renderViewerPhoto(currentIndex - 1));
  nextButton.addEventListener('click', () => renderViewerPhoto(currentIndex + 1));
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') renderViewerPhoto(currentIndex - 1);
    if (event.key === 'ArrowRight') renderViewerPhoto(currentIndex + 1);
  });
})();

(() => {
  if (document.querySelector('script[src="i18n.js"]')) return;
  const script = document.createElement('script');
  script.src = 'i18n.js';
  document.head.append(script);
})();
