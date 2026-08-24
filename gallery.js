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
  ['i18n.css'].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.append(stylesheet);
  });

  if (!grid) return;

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
