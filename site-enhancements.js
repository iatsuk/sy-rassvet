(() => {
  const copy = {
    en: {
      title: 'Ohlson 29 Rassvet — history, refit and voyages',
      description: "The documented story of Ohlson 29 Rassvet: her design, maintenance, voyages and 2023–2026 chapter under Andrei's ownership.",
      engineStart: 'The engine starts reliably on the first attempt.'
    },
    de: {
      title: 'Ohlson 29 Rassvet — Geschichte, Refit und Reisen',
      description: 'Die dokumentierte Geschichte der Ohlson 29 Rassvet: Konstruktion, Wartung, Reisen und das Kapitel 2023–2026 unter Andrei.',
      engineStart: 'Der Motor startet zuverlässig beim ersten Versuch.'
    },
    ru: {
      title: 'Ohlson 29 Rassvet — история, работы и путешествия',
      description: 'Документальная история Ohlson 29 Rassvet: проект, обслуживание, путешествия и период владения Андрея с 2023 по 2026 год.',
      engineStart: 'Двигатель стабильно запускается с первой попытки.'
    }
  };

  const currentLanguage = () => {
    const language = document.documentElement.lang.toLowerCase().split('-')[0];
    return Object.prototype.hasOwnProperty.call(copy, language) ? language : 'en';
  };

  const applyMetadata = (text, language) => {
    document.title = text.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = text.description;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://sy-rassvet.com/?lang=${language}`;
  };

  const applyEngineStart = (text) => {
    const engineHeading = Array.from(document.querySelectorAll('.included-card h3'))
      .find((heading) => heading.textContent.trim() === 'Nanni Diesel N2.14');
    const paragraph = engineHeading?.parentElement?.querySelector('p');
    if (!paragraph) return;

    let note = paragraph.querySelector('[data-engine-start-note]');
    if (!note) {
      paragraph.append(document.createTextNode(' '));
      note = document.createElement('span');
      note.dataset.engineStartNote = '';
      note.dataset.i18nIgnore = '';
      paragraph.append(note);
    }
    note.textContent = text.engineStart;
  };

  const apply = () => {
    const language = currentLanguage();
    const text = copy[language];
    applyMetadata(text, language);
    applyEngineStart(text);
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

(() => {
  if (document.querySelector('script[src="design-history.js"]')) return;
  const script = document.createElement('script');
  script.src = 'design-history.js';
  document.body.append(script);
})();

(() => {
  if (document.querySelector('script[src="video-tour.js"]')) return;
  const script = document.createElement('script');
  script.src = 'video-tour.js';
  document.body.append(script);
})();

(() => {
  const hideSectionAndNav = (id) => {
    const section = document.getElementById(id);
    const navigationLink = document.querySelector(`.site-nav a[href="#${id}"]`);
    if (section) section.hidden = true;
    if (navigationLink) navigationLink.hidden = true;
  };

  // The generated manifest is the source of truth for whether the gallery has
  // publishable media. Do not leave a large placeholder section in the archive.
  if (!Array.isArray(window.RASSVET_GALLERY) || window.RASSVET_GALLERY.length === 0) {
    hideSectionAndNav('gallery');
  }

  // The static illustrated route board used to act as a fallback when no GPX
  // archive was present. The archive now stays out of the page entirely unless
  // at least one real line feature is available.
  fetch('data/tracks.geojson', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`tracks.geojson: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const features = (data.features || []).filter((feature) =>
        ['LineString', 'MultiLineString'].includes(feature.geometry?.type));
      if (!features.length) hideSectionAndNav('voyages');
    })
    .catch((error) => {
      console.warn('Voyage archive is unavailable; hiding the empty section.', error);
      hideSectionAndNav('voyages');
    });
})();
