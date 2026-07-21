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

const cruisingGrounds = [
  'Baltic Sea',
  'Danish South Sea',
  'Bornholm & Christiansø',
  'North Sea',
  'Wadden Sea',
  'Dutch inland waterways',
  'Kattegat',
  'Skagerrak'
];

const includedItems = [
  {
    category: 'Propulsion',
    title: 'Nanni Diesel N2.14',
    description: 'Installed in 2005 with approximately 700 engine hours. Professionally serviced by Davids Werft in 2024, 2025 and 2026.'
  },
  {
    category: 'Sail wardrobe',
    title: 'Mainsail, furling genoa and spinnaker',
    description: 'Mainsail with two reefing points, 140% genoa on a roller-furling system, and a spinnaker used only a few times and remaining in as-new condition.'
  },
  {
    category: 'Navigation & radio',
    title: 'VHF radio and chartplotter',
    description: 'Nexus NX2500 VHF radio and Garmin GPSMAP 525 chartplotter with chart coverage from Germany to Svalbard, together with NASA Marine Clipper Wind, Depth and Log instruments and a Silva 100 compass.'
  },
  {
    category: 'Anchoring',
    title: 'Two anchors',
    description: 'A 7.5 kg Bruce anchor and a 16 kg CQR anchor are included with the yacht.'
  },
  {
    category: 'Galley & comfort',
    title: 'Equipment for life aboard',
    description: 'Gimballed Origo alcohol stove, portable 12 V fridge, stereo, Wallas diesel heater and LED lighting.'
  },
  {
    category: 'Power & utilities',
    title: 'Charging and onboard systems',
    description: 'Two 100 W solar panels, Victron Energy 15 A MPPT controller, Victron 230 V / 30 A charger, two 105 Ah AGM batteries, electric bilge pump and black-water holding tank.'
  }
];

const loadStylesheet = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  document.head.append(stylesheet);
};

const createVoyageOverview = () => {
  const formerMap = document.querySelector('.route-map');
  if (!formerMap) return;

  const overview = document.createElement('div');
  overview.className = 'route-overview';
  overview.setAttribute('aria-label', 'Summary of Rassvet’s cruising record');

  const top = document.createElement('div');
  const kicker = document.createElement('p');
  const distance = document.createElement('p');
  const distanceLabel = document.createElement('span');

  kicker.className = 'overview-kicker';
  kicker.textContent = 'Cruising record';
  distance.className = 'overview-distance';
  distance.textContent = '3,000 nm';
  distanceLabel.textContent = 'sailed under the present ownership';
  distance.append(distanceLabel);
  top.append(kicker, distance);

  const stats = document.createElement('div');
  stats.className = 'overview-stats';

  [
    ['6', 'documented voyages'],
    ['4', 'cruising seasons']
  ].forEach(([value, label]) => {
    const stat = document.createElement('div');
    const strong = document.createElement('strong');
    const span = document.createElement('span');

    stat.className = 'overview-stat';
    strong.textContent = value;
    span.textContent = label;
    stat.append(strong, span);
    stats.append(stat);
  });

  const grounds = document.createElement('div');
  const groundsTitle = document.createElement('h3');
  const groundsList = document.createElement('ul');

  grounds.className = 'cruising-grounds';
  groundsTitle.textContent = 'Cruising grounds';

  cruisingGrounds.forEach((ground) => {
    const item = document.createElement('li');
    item.textContent = ground;
    groundsList.append(item);
  });

  grounds.append(groundsTitle, groundsList);

  const note = document.createElement('p');
  note.className = 'overview-note';
  note.textContent = 'Sailed and recorded by the current owner between 2023 and 2026.';

  overview.append(top, stats, grounds, note);
  formerMap.replaceWith(overview);
};

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

  createVoyageOverview();
};

const renderIncludedInventory = () => {
  const grid = document.querySelector('.included-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  includedItems.forEach(({ category, title, description }) => {
    const article = document.createElement('article');
    const categoryLabel = document.createElement('span');
    const heading = document.createElement('h3');
    const descriptionText = document.createElement('p');

    article.className = 'included-card';
    categoryLabel.textContent = category;
    heading.textContent = title;
    descriptionText.textContent = description;
    article.append(categoryLabel, heading, descriptionText);
    fragment.append(article);
  });

  grid.replaceChildren(fragment);

  const heading = document.querySelector('#included-title');
  if (heading) heading.textContent = 'What is included with Rassvet';

  const summary = document.querySelector('.included-header > p');
  if (summary) {
    summary.textContent = 'The principal equipment transferred with the yacht, grouped by system. The detailed handover inventory will be confirmed in the purchase agreement.';
  }
};

const createContactDetail = ({ label, title, text, link, linkText, copyValue }) => {
  const article = document.createElement('article');
  const category = document.createElement('span');
  const heading = document.createElement('h3');
  const description = document.createElement('p');

  article.className = 'contact-detail';
  category.textContent = label;
  heading.textContent = title;
  description.textContent = text;
  article.append(category, heading, description);

  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = linkText;
    article.append(anchor);
  } else if (copyValue) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.copyContact = '';
    button.dataset.contact = copyValue;
    button.textContent = `Copy ${copyValue}`;
    article.append(button);
  }

  return article;
};

const renderBlogAndContact = () => {
  const gallery = document.querySelector('#gallery');
  const contact = document.querySelector('#contact');
  if (!contact) return;

  if (nav && !nav.querySelector('a[href="#blog"]')) {
    const blogLink = document.createElement('a');
    blogLink.href = '#blog';
    blogLink.textContent = 'Logbook';
    const galleryLink = nav.querySelector('a[href="#gallery"]');
    nav.insertBefore(blogLink, galleryLink ?? nav.querySelector('.nav-cta'));
  }

  if (gallery && !document.querySelector('#blog')) {
    const blog = document.createElement('section');
    const card = document.createElement('div');
    const copy = document.createElement('div');
    const eyebrow = document.createElement('p');
    const heading = document.createElement('h2');
    const description = document.createElement('p');
    const actions = document.createElement('div');
    const link = document.createElement('a');
    const note = document.createElement('small');

    blog.className = 'section blog';
    blog.id = 'blog';
    blog.setAttribute('aria-labelledby', 'blog-title');
    card.className = 'blog-card reveal';
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Owner’s logbook';
    heading.id = 'blog-title';
    heading.textContent = 'The yacht’s story has been documented in public';
    description.textContent = 'The Telegram channel contains detailed Russian-language posts about Rassvet’s voyages, maintenance, repairs, failures and improvements throughout the present ownership.';
    actions.className = 'blog-actions';
    link.className = 'button button-primary';
    link.href = 'https://t.me/deelstuff';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = 'Read the sailing blog';
    note.textContent = 'Written in Russian · Telegram translation can be used where available';

    copy.append(eyebrow, heading, description);
    actions.append(link, note);
    card.append(copy, actions);
    blog.append(card);
    gallery.before(blog);
  }

  contact.className = 'section contact contact-direct';

  const contactCopy = document.createElement('div');
  const eyebrow = document.createElement('p');
  const heading = document.createElement('h2');
  const description = document.createElement('p');
  const actions = document.createElement('div');
  const telegram = document.createElement('a');
  const instagram = document.createElement('a');

  contactCopy.className = 'contact-copy reveal';
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Viewing in Kiel';
  heading.textContent = 'Would you like to see Rassvet?';
  description.textContent = 'Telegram is the preferred way to ask questions or arrange a viewing. Instagram is available as an alternative. Messages in English or Russian are welcome.';
  actions.className = 'contact-links';

  telegram.className = 'button button-primary';
  telegram.href = 'https://t.me/aiatsuk';
  telegram.target = '_blank';
  telegram.rel = 'noreferrer';
  telegram.textContent = 'Message on Telegram';

  instagram.className = 'button button-ghost';
  instagram.href = 'https://instagram.com/yatsukav';
  instagram.target = '_blank';
  instagram.rel = 'noreferrer';
  instagram.textContent = 'Open Instagram';

  actions.append(telegram, instagram);
  contactCopy.append(eyebrow, heading, description, actions);

  const details = document.createElement('div');
  details.className = 'contact-details reveal';
  details.append(
    createContactDetail({
      label: 'Preferred contact',
      title: 'Telegram',
      text: '@aiatsuk',
      copyValue: '@aiatsuk'
    }),
    createContactDetail({
      label: 'Alternative',
      title: 'Instagram',
      text: '@yatsukav',
      link: 'https://instagram.com/yatsukav',
      linkText: 'Open profile'
    }),
    createContactDetail({
      label: 'Viewing',
      title: 'Kiel, Germany',
      text: 'Available by appointment. Additional photographs and the detailed handover inventory can be shared directly.'
    })
  );

  contact.replaceChildren(contactCopy, details);
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

loadStylesheet('voyage-overview.css');
loadStylesheet('contact-blog.css');
renderVoyages();
renderIncludedInventory();
renderBlogAndContact();

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
    window.open('https://t.me/aiatsuk', '_blank', 'noopener,noreferrer');
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

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
