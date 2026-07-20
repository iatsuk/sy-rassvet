(() => {
  const items = Array.isArray(window.RASSVET_GALLERY) ? window.RASSVET_GALLERY : [];
  const grid = document.querySelector('.gallery-grid');
  const summary = document.querySelector('.gallery-heading > p');
  const dialog = document.querySelector('[data-gallery-dialog]');
  const dialogContent = dialog?.querySelector('.dialog-placeholder');

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

  const openPhoto = (index) => {
    if (!dialog || !dialogContent) return;
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
    dialogContent.replaceChildren(figure);

    if (!dialog.open) dialog.showModal();
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

    const picture = createPicture(item.thumbnail, item.alt, index < 2 ? 'eager' : 'lazy');
    const image = picture.querySelector('img');
    if (index === 0 && image) image.fetchPriority = 'high';

    caption.className = 'gallery-caption';
    category.textContent = item.category;
    title.textContent = item.caption;
    caption.append(category, title);
    button.append(picture, caption);
    button.addEventListener('click', () => openPhoto(index));
    fragment.append(button);
  });

  grid.className = 'gallery-grid gallery-photo-grid reveal is-visible';
  grid.replaceChildren(fragment);
  if (summary) {
    summary.textContent = `${items.length} original photograph${items.length === 1 ? '' : 's'}, automatically resized for fast loading and available in full view.`;
  }

  if (dialog) {
    const previous = document.createElement('button');
    const next = document.createElement('button');
    previous.type = 'button';
    next.type = 'button';
    previous.className = 'dialog-nav dialog-previous';
    next.className = 'dialog-nav dialog-next';
    previous.setAttribute('aria-label', 'Previous photograph');
    next.setAttribute('aria-label', 'Next photograph');
    previous.textContent = '‹';
    next.textContent = '›';
    previous.addEventListener('click', () => openPhoto(currentIndex - 1));
    next.addEventListener('click', () => openPhoto(currentIndex + 1));
    dialog.append(previous, next);

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') openPhoto(currentIndex - 1);
      if (event.key === 'ArrowRight') openPhoto(currentIndex + 1);
    });
  }
})();
