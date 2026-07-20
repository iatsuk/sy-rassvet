const galleryGrid = document.querySelector('[data-gallery-grid]');
const gallerySummary = document.querySelector('[data-gallery-summary]');
const galleryDialog = document.querySelector('[data-gallery-dialog]');
const galleryDialogImage = document.querySelector('[data-dialog-image]');
const galleryDialogCaption = document.querySelector('[data-dialog-caption]');
const galleryDialogMeta = document.querySelector('[data-dialog-meta]');

const openGalleryImage = (image) => {
  if (!galleryDialog || !galleryDialogImage || !galleryDialogCaption) return;

  galleryDialogImage.src = image.src;
  galleryDialogImage.alt = image.caption;
  galleryDialogCaption.textContent = image.caption;
  if (galleryDialogMeta) galleryDialogMeta.textContent = image.category;
  galleryDialog.showModal();
};

const createGalleryItem = (image, index) => {
  const button = document.createElement('button');
  const photo = document.createElement('img');
  const copy = document.createElement('span');
  const category = document.createElement('small');
  const caption = document.createElement('strong');

  button.type = 'button';
  button.className = 'gallery-item';
  button.dataset.galleryItem = '';
  button.setAttribute('aria-label', `Open photograph: ${image.caption}`);

  if (index === 0 || image.lead) button.classList.add('gallery-main');
  else if (index % 7 === 3 || index % 7 === 6) button.classList.add('gallery-wide');
  else if (image.height > image.width * 1.2) button.classList.add('gallery-portrait');

  photo.src = image.thumb;
  photo.alt = image.caption;
  photo.width = image.width;
  photo.height = image.height;
  photo.loading = index === 0 ? 'eager' : 'lazy';
  photo.decoding = 'async';

  copy.className = 'gallery-item-copy';
  category.textContent = image.category;
  caption.textContent = image.caption;
  copy.append(category, caption);
  button.append(photo, copy);
  button.addEventListener('click', () => openGalleryImage(image));

  return button;
};

const renderGallery = async () => {
  if (!galleryGrid) return;

  try {
    const response = await fetch('assets/gallery/manifest.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Gallery manifest returned ${response.status}`);

    const manifest = await response.json();
    const images = Array.isArray(manifest.images) ? manifest.images : [];

    if (!images.length) {
      galleryGrid.innerHTML = '<p class="gallery-empty">Photographs will appear automatically after files are added to the categorized folders in <code>photos/</code>.</p>';
      if (gallerySummary) gallerySummary.textContent = 'The gallery is ready for the original photographs of Rassvet.';
      return;
    }

    const fragment = document.createDocumentFragment();
    images.forEach((image, index) => fragment.append(createGalleryItem(image, index)));
    galleryGrid.replaceChildren(fragment);

    if (gallerySummary) {
      gallerySummary.textContent = `${images.length} original photographs, organized by subject. Select any image to open the larger version.`;
    }
  } catch (error) {
    console.error(error);
    galleryGrid.innerHTML = '<p class="gallery-empty">The photographic gallery could not be loaded. Please try again later.</p>';
  }
};

renderGallery();
