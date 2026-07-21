(() => {
  const supportedLanguages = ['en', 'de', 'ru'];
  const storageKey = 'rassvet-language';
  const languageNames = { en: 'English', de: 'Deutsch', ru: 'Русский' };
  const translationFiles = {
    de: ['i18n-de-1.js', 'i18n-de-2.js', 'i18n-de-3.js'],
    ru: ['i18n-ru-1.js', 'i18n-ru-2.js', 'i18n-ru-3.js']
  };

  const normalizeLanguage = (value) => {
    const primary = String(value || '').trim().toLowerCase().split(/[-_]/)[0];
    return supportedLanguages.includes(primary) ? primary : null;
  };

  const readStoredLanguage = () => {
    try {
      return normalizeLanguage(window.localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  };

  const storeLanguage = (language) => {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // The language selector still works when browser storage is unavailable.
    }
  };

  const detectLanguage = () => {
    const requested = normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
    if (requested) {
      storeLanguage(requested);
      return requested;
    }

    const stored = readStoredLanguage();
    if (stored) return stored;

    const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    for (const candidate of browserLanguages) {
      const language = normalizeLanguage(candidate);
      if (language) return language;
    }

    return 'en';
  };

  const language = detectLanguage();
  let dictionary = {};
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let translating = false;

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.append(script);
  });

  const loadDictionary = async () => {
    if (language === 'en') return {};
    await Promise.all((translationFiles[language] || []).map(loadScript));
    return language === 'de'
      ? window.RASSVET_TRANSLATIONS_DE || {}
      : window.RASSVET_TRANSLATIONS_RU || {};
  };

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const translateGalleryPhrase = (source) => {
    const categoryPatterns = [
      ['Under sail', dictionary['Under sail']],
      ['Exterior', dictionary.Exterior],
      ['Deck and cockpit', dictionary['Deck and cockpit']],
      ['Interior', dictionary.Interior],
      ['Engine and systems', dictionary['Engine and systems']],
      ['Rig and sails', dictionary['Rig and sails']],
      ['Underwater hull', dictionary['Underwater hull']]
    ];

    for (const [english, translated] of categoryPatterns) {
      if (!translated) continue;
      const match = source.match(new RegExp(`^${escapeRegExp(english)}(?: (\\d+))?$`));
      if (match) return `${translated}${match[1] ? ` ${match[1]}` : ''}`;
    }

    return null;
  };

  const translateValue = (source) => {
    if (language === 'en' || !source) return source;
    if (Object.prototype.hasOwnProperty.call(dictionary, source)) return dictionary[source];

    const galleryPhrase = translateGalleryPhrase(source);
    if (galleryPhrase) return galleryPhrase;

    const altMatch = source.match(/^Rassvet — (.+)$/);
    if (altMatch) return `Rassvet — ${translateValue(altMatch[1])}`;

    const yearAreaMatch = source.match(/^(\d{4}) · (.+)$/);
    if (yearAreaMatch) return `${yearAreaMatch[1]} · ${translateValue(yearAreaMatch[2])}`;

    const copyMatch = source.match(/^Copy (.+)$/);
    if (copyMatch) return language === 'de' ? `${copyMatch[1]} kopieren` : `Копировать ${copyMatch[1]}`;

    const copiedMatch = source.match(/^Contact (.+) copied$/);
    if (copiedMatch) return language === 'de' ? `Kontakt ${copiedMatch[1]} kopiert` : `Контакт ${copiedMatch[1]} скопирован`;

    const contactMatch = source.match(/^Contact: (.+)$/);
    if (contactMatch) return language === 'de' ? `Kontakt: ${contactMatch[1]}` : `Контакт: ${contactMatch[1]}`;

    const openPhotoMatch = source.match(/^Open photograph: (.+)$/);
    if (openPhotoMatch) return language === 'de'
      ? `Foto öffnen: ${translateValue(openPhotoMatch[1])}`
      : `Открыть фотографию: ${translateValue(openPhotoMatch[1])}`;

    const askingPriceMatch = source.match(/^Asking price (.+)\. Reasonable offers considered after viewing\.$/);
    if (askingPriceMatch) return language === 'de'
      ? `Angebotspreis ${askingPriceMatch[1]}. Angemessene Angebote werden nach der Besichtigung berücksichtigt.`
      : `Цена ${askingPriceMatch[1]}. Разумный торг возможен после осмотра.`;

    const galleryCountMatch = source.match(/^(\d+) original photographs?, automatically resized for fast loading and available in full view\.$/);
    if (galleryCountMatch) return language === 'de'
      ? `${galleryCountMatch[1]} Originalfotos, automatisch für schnelles Laden verkleinert und in voller Ansicht verfügbar.`
      : `${galleryCountMatch[1]} оригинальных фотографий, автоматически оптимизированных для быстрой загрузки и доступных в полном размере.`;

    if (source === 'Message copied. Opening Telegram…') {
      return language === 'de' ? 'Nachricht kopiert. Telegram wird geöffnet …' : 'Сообщение скопировано. Открываю Telegram…';
    }

    return source;
  };

  const translateTextNode = (node) => {
    if (!node.parentElement || node.parentElement.closest('script, style, noscript, [data-i18n-ignore]')) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue || '');

    const source = originalText.get(node);
    const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const translated = `${match[1]}${translateValue(match[2])}${match[3]}`;
    if (node.nodeValue !== translated) node.nodeValue = translated;
  };

  const translatableAttributes = ['placeholder', 'aria-label', 'title', 'alt'];

  const translateAttributes = (element) => {
    if (element.closest('[data-i18n-ignore]')) return;

    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map();
      originalAttributes.set(element, originals);
    }

    translatableAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
      const translated = translateValue(originals.get(attribute));
      if (element.getAttribute(attribute) !== translated) element.setAttribute(attribute, translated);
    });
  };

  const translateTree = (root) => {
    if (!root || translating) return;
    translating = true;

    try {
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root);
        return;
      }

      if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

      if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
      (root.querySelectorAll?.('*') || []).forEach(translateAttributes);

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        translateTextNode(node);
        node = walker.nextNode();
      }
    } finally {
      translating = false;
    }
  };

  const updateDocumentMetadata = () => {
    document.title = translateValue('Ohlson 29 Rassvet — sailing yacht for sale');
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = translateValue('Ohlson 29 Rassvet — a well-maintained classic sailing yacht in Kiel with a documented maintenance history, Nanni diesel engine and proven 3,000-nautical-mile cruising record.');
    }
  };

  const createLanguageSelector = () => {
    const header = document.querySelector('[data-header]');
    const menuButton = document.querySelector('[data-menu-button]');
    if (!header || document.querySelector('[data-language-switcher]')) return;

    const wrapper = document.createElement('label');
    const visibleLabel = document.createElement('span');
    const select = document.createElement('select');

    wrapper.className = 'language-switcher';
    wrapper.dataset.languageSwitcher = '';
    wrapper.dataset.i18nIgnore = '';
    visibleLabel.className = 'visually-hidden';
    visibleLabel.textContent = language === 'de' ? 'Sprache' : language === 'ru' ? 'Язык' : 'Language';
    select.setAttribute('aria-label', visibleLabel.textContent);

    supportedLanguages.forEach((code) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = `${code.toUpperCase()} · ${languageNames[code]}`;
      option.selected = code === language;
      select.append(option);
    });

    select.addEventListener('change', () => {
      const selected = normalizeLanguage(select.value) || 'en';
      storeLanguage(selected);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', selected);
      window.location.assign(url.toString());
    });

    wrapper.append(visibleLabel, select);
    header.insertBefore(wrapper, menuButton || header.querySelector('[data-nav]'));
  };

  const ready = loadDictionary()
    .then((loadedDictionary) => {
      dictionary = loadedDictionary;
      updateDocumentMetadata();
      createLanguageSelector();
      translateTree(document.documentElement);

      const observer = new MutationObserver((records) => {
        if (translating) return;
        records.forEach((record) => {
          if (record.type === 'characterData') translateTree(record.target);
          record.addedNodes?.forEach(translateTree);
          if (record.type === 'attributes') translateTree(record.target);
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: translatableAttributes
      });
    })
    .catch((error) => {
      console.error('Rassvet translations could not be loaded.', error);
      createLanguageSelector();
    });

  window.RASSVET_I18N = { language, ready, translate: translateValue };
})();
