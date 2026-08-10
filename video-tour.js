(() => {
  const stylesheet = document.createElement('link');
  if (!document.querySelector('link[href="video-tour.css"]')) {
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'video-tour.css';
    document.head.append(stylesheet);
  }

  const copy = {
    en: {
      eyebrow: 'Video tour',
      title: '102 seconds aboard Rassvet',
      description: 'A short vertical walk-through of the yacht, followed by a start of the Nanni diesel engine.',
      link: 'Open on YouTube',
      frameTitle: 'Rassvet yacht walk-through and engine start'
    },
    de: {
      eyebrow: 'Video-Rundgang',
      title: '102 Sekunden an Bord von Rassvet',
      description: 'Ein kurzer vertikaler Rundgang durch die Yacht, anschließend wird der Nanni-Dieselmotor gestartet.',
      link: 'Auf YouTube öffnen',
      frameTitle: 'Rundgang durch die Yacht Rassvet und Motorstart'
    },
    ru: {
      eyebrow: 'Видеообзор',
      title: '102 секунды на борту Rassvet',
      description: 'Короткий вертикальный обзор яхты, после которого показан запуск дизельного двигателя Nanni.',
      link: 'Открыть на YouTube',
      frameTitle: 'Обзор яхты Rassvet и запуск двигателя'
    }
  };

  const currentLanguage = () => {
    const language = document.documentElement.lang.toLowerCase().split('-')[0];
    return Object.prototype.hasOwnProperty.call(copy, language) ? language : 'en';
  };

  const createSection = () => {
    if (document.querySelector('#video-tour')) return;

    const gallery = document.querySelector('#gallery');
    const contact = document.querySelector('#contact');
    if (!gallery || !contact) return;

    const section = document.createElement('section');
    const inner = document.createElement('div');
    const text = document.createElement('div');
    const eyebrow = document.createElement('p');
    const heading = document.createElement('h2');
    const description = document.createElement('p');
    const link = document.createElement('a');
    const frame = document.createElement('div');
    const iframe = document.createElement('iframe');

    section.id = 'video-tour';
    section.className = 'section video-tour';
    section.dataset.i18nIgnore = '';
    inner.className = 'video-tour-inner reveal';
    text.className = 'video-tour-copy';
    eyebrow.className = 'eyebrow';
    eyebrow.dataset.videoEyebrow = '';
    heading.dataset.videoTitle = '';
    description.dataset.videoDescription = '';
    link.dataset.videoLink = '';
    link.href = 'https://youtube.com/shorts/2GxUnS_-k8s';
    link.target = '_blank';
    link.rel = 'noreferrer';
    frame.className = 'video-tour-frame';
    iframe.dataset.videoFrame = '';
    iframe.src = 'https://www.youtube-nocookie.com/embed/2GxUnS_-k8s?rel=0';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    text.append(eyebrow, heading, description, link);
    frame.append(iframe);
    inner.append(text, frame);
    section.append(inner);
    contact.before(section);

    if (window.IntersectionObserver) {
      requestAnimationFrame(() => inner.classList.add('is-visible'));
    }
  };

  const apply = () => {
    createSection();
    const section = document.querySelector('#video-tour');
    if (!section) return;

    const text = copy[currentLanguage()];
    section.querySelector('[data-video-eyebrow]').textContent = text.eyebrow;
    section.querySelector('[data-video-title]').textContent = text.title;
    section.querySelector('[data-video-description]').textContent = text.description;
    section.querySelector('[data-video-link]').textContent = text.link;
    section.querySelector('[data-video-frame]').title = text.frameTitle;
  };

  apply();

  const languageObserver = new MutationObserver(apply);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  let attempts = 0;
  const waitForTranslations = () => {
    attempts += 1;
    if (window.RASSVET_I18N?.ready) {
      window.RASSVET_I18N.ready.finally(apply);
      return;
    }
    if (attempts < 100) window.setTimeout(waitForTranslations, 25);
  };
  waitForTranslations();
})();
