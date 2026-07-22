(() => {
  const copy = {
    en: {
      title: 'Ohlson 29 Rassvet for sale in Kiel, Germany',
      description: 'Private sale of the Ohlson 29 Rassvet in Kiel, with specifications, maintenance history, equipment details and photographs.',
      contactText: 'Telegram is the preferred contact for questions and viewing arrangements. Email and Instagram are also available.',
      emailLabel: 'Email',
      emailTitle: 'Email address',
      emailNote: 'Shown as an image to reduce automated collection.',
      emailAlt: 'Email address',
      engineStart: 'The engine starts reliably on the first attempt.'
    },
    de: {
      title: 'Ohlson 29 Rassvet – Segelyacht zu verkaufen in Kiel',
      description: 'Privatverkauf der Ohlson 29 Rassvet in Kiel mit technischen Daten, Wartungshistorie, Ausstattungsdetails und Fotos.',
      contactText: 'Telegram ist der bevorzugte Kontakt für Fragen und Besichtigungstermine. E-Mail und Instagram sind ebenfalls verfügbar.',
      emailLabel: 'E-Mail',
      emailTitle: 'E-Mail-Adresse',
      emailNote: 'Als Bild dargestellt, um automatisiertes Auslesen zu erschweren.',
      emailAlt: 'E-Mail-Adresse',
      engineStart: 'Der Motor startet zuverlässig beim ersten Versuch.'
    },
    ru: {
      title: 'Ohlson 29 Rassvet продаётся в Киле, Германия',
      description: 'Частная продажа Ohlson 29 Rassvet в Киле: характеристики, история обслуживания, оснащение и фотографии.',
      contactText: 'Для вопросов и согласования осмотра предпочтителен Telegram. Также доступны электронная почта и Instagram.',
      emailLabel: 'Электронная почта',
      emailTitle: 'Адрес электронной почты',
      emailNote: 'Адрес показан изображением, чтобы затруднить автоматический сбор.',
      emailAlt: 'Адрес электронной почты',
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

  const applyContactText = (text) => {
    const description = document.querySelector('.contact-copy > p:not(.eyebrow)');
    if (description) {
      description.dataset.i18nIgnore = '';
      description.textContent = text.contactText;
    }
  };

  const applyEmailCard = (text) => {
    const details = document.querySelector('.contact-details');
    if (!details) return;

    let card = details.querySelector('[data-email-contact]');
    if (!card) {
      card = document.createElement('article');
      const label = document.createElement('span');
      const heading = document.createElement('h3');
      const image = document.createElement('img');
      const note = document.createElement('p');

      card.className = 'contact-detail contact-email';
      card.dataset.emailContact = '';
      card.dataset.i18nIgnore = '';
      label.dataset.emailLabel = '';
      heading.dataset.emailTitle = '';
      image.className = 'contact-email-image';
      image.src = 'email-address.svg';
      image.decoding = 'async';
      image.dataset.emailImage = '';
      note.dataset.emailNote = '';
      card.append(label, heading, image, note);

      const telegramCard = details.firstElementChild;
      if (telegramCard) telegramCard.after(card);
      else details.append(card);
    }

    card.querySelector('[data-email-label]').textContent = text.emailLabel;
    card.querySelector('[data-email-title]').textContent = text.emailTitle;
    card.querySelector('[data-email-image]').alt = text.emailAlt;
    card.querySelector('[data-email-note]').textContent = text.emailNote;
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
    applyContactText(text);
    applyEmailCard(text);
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
