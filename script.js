const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const toast = document.querySelector('[data-toast]');

const voyages = [
  {
    year: '2026',
    area: 'Baltic Sea, Kattegat & Skagerrak',
    title: 'Scandinavia and Skagerrak circuit',
    route: 'Kiel → Grenaa → Læsø → Malmön → Koster → Fuglevik → Oslo → Horten → Fredrikstad → Strömstad → Marstrand → Gothenburg → Helsingør → Copenhagen → Kiel'
  },
  {
    year: '2025',
    area: 'North Sea & inland waterways',
    title: 'North Sea, Wadden Sea and Dutch canals',
    route: 'Kiel → Rendsburg → Glückstadt → Cuxhaven → Heligoland → Wangerooge → Norderney → Lauwersoog → Groningen → Borkum → Spiekeroog → Cuxhaven → Gieselau Lock → Kiel'
  },
  {
    year: '2025',
    area: 'Baltic Sea & Bornholm',
    title: 'Bornholm and Christiansø cruise',
    route: 'Lübeck → Bärhöft → Rønne (Bornholm) → Christiansø → Gedser → Heiligenhafen → Kiel'
  },
  {
    year: '2024',
    area: 'Danish South Sea',
    title: 'South Funen and Ærø circuit',
    route: 'Lübeck → Kiel → Sønderborg → Fåborg → Ærøskøbing → Bagenkop → Grömitz → Lübeck'
  },
  {
    year: '2024',
    area: 'Bay of Lübeck',
    title: 'Mecklenburg coast cruise',
    route: 'Lübeck → Grömitz → Wismar → Timmendorf → Lübeck'
  },
  {
    year: '2023',
    area: 'Sweden to Germany',
    title: 'Delivery voyage to Lübeck',
    route: 'Kalmar → Bergkvara → Sandhamn → Karlskrona → Hanö → Gislövsläge → Gedser → Lübeck'
  }
];

const renderVoyages = () => {
  const routeStories = document.querySelector('.route-stories');

  if (routeStories) {
    const fragment = document.createDocumentFragment();

    voyages.forEach(({ year, area, title, route }) => {
      const article = document.createElement('article');
      const meta = document.createElement('p');
      const heading = document.createElement('h3');
      const routeText = document.createElement('p');

      meta.className = 'route-meta';
      meta.textContent = `${year} · ${area}`;
      heading.textContent = title;
      routeText.textContent = route;

      article.append(meta, heading, routeText);
      fragment.append(article);
    });

    routeStories.replaceChildren(fragment);
  }

  const voyageSummary = document.querySelector('.voyages-header > p');
  if (voyageSummary) {
    voyageSummary.textContent = '3,000 nautical miles sailed aboard Rassvet under the present ownership, across the Baltic Sea, North Sea, Danish islands, Kattegat, Skagerrak and Dutch inland waterways.';
  }

  const heroFacts = document.querySelector('.hero-facts');
  if (heroFacts && !heroFacts.querySelector('[data-mileage]')) {
    const mileage = document.createElement('div');
    const value = document.createElement('dt');
    const label = document.createElement('dd');

    mileage.dataset.mileage = '';
    value.textContent = '3,000 nm';
    label.textContent = 'sailed since 2023';
    mileage.append(value, label);
    heroFacts.append(mileage);
  }

  const mapLabels = new Map([
    ['.map-label.kiel', 'North Sea'],
    ['.map-label.cph', 'Baltic Sea'],
    ['.map-label.got', 'Kattegat'],
    ['.map-label.oslo', 'Skagerrak']
  ]);

  mapLabels.forEach((label, selector) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = label;
  });
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    return success;
  }
};

renderVoyages();

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('[data-copy-contact]')?.addEventListener('click', async (event) => {
  const contact = event.currentTarget.dataset.contact;
  const copied = await copyText(contact);
  showToast(copied ? `Contact ${contact} copied` : `Contact: ${contact}`);
});

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = [
    'Hello! I am contacting you about the Ohlson 29 Rassvet.',
    '',
    `Name: ${formData.get('name')}`,
    `Contact: ${formData.get('contact')}`,
    '',
    formData.get('message')
  ].join('\n');

  await copyText(message);
  showToast('Message copied. Opening Telegram…');
  window.setTimeout(() => {
    window.open('https://t.me/deelstuff', '_blank', 'noopener,noreferrer');
  }, 450);
});

const dialog = document.querySelector('[data-gallery-dialog]');
const dialogCaption = document.querySelector('[data-dialog-caption]');

document.querySelectorAll('[data-gallery-item]').forEach((item) => {
  item.addEventListener('click', () => {
    dialogCaption.textContent = item.dataset.caption;
    dialog.showModal();
  });
});

document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
