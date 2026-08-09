(() => {
  const stylesheet = document.createElement('link');
  if (!document.querySelector('link[href="design-history.css"]')) {
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'design-history.css';
    document.head.append(stylesheet);
  }

  const sources = {
    ohlsonPeople: 'https://ohlsonyachts.com/einar_n_carl-erik/',
    ohlsonDrawings: 'https://ohlsonyachts.com/drawing-o-29/',
    sailguide: 'https://www.sailguide.com/batfakta/ohlson-29-1975',
    hanse315: 'https://www.hanseyachts.co.uk/range/hanse-315',
    arcona345: 'https://arconayachts.se/boat/arcona345/',
    linjett34: 'https://www.linjett.se/en/linjett-34/'
  };

  const copy = {
    en: {
      nav: 'Design history',
      eyebrow: 'Design history',
      title: 'What kind of boat is the Ohlson 29?',
      lead: 'The Ohlson 29 belongs to a very specific Scandinavian moment: the early 1970s, when a family cruising yacht was still expected to sail well enough to race. It was designed by Einar Ohlson as a compact GRP cruiser-racer, rather than as either a pure racing boat or a floating holiday home.',
      origins: [
        {
          label: 'The designers',
          title: 'From Orust to Olympic sailing',
          body: [
            'Einar Ohlson (1918–2004) and his brother Carl-Eric (1920–2015) came from Hälleviksstrand on Orust, an island with a deep boatbuilding tradition. They founded Ingenjörsfirman Bröderna Ohlson in Gothenburg in 1951.',
            'Their international reputation was built in the 5.5 Metre class. Hojwa won Olympic bronze in Helsinki in 1952, and an Ohlson-designed 5.5 Metre won a medal at every Olympic Games from 1952 through 1968. Carl-Eric left the company in 1957; the Ohlson 29 was therefore Einar’s design.'
          ]
        },
        {
          label: 'The method',
          title: 'Racing knowledge, used for ordinary sailors',
          body: [
            'Einar was trained as a naval architect and worked at Götaverken and the Swedish State Ship Trial Institute. The design office moved freely between race boats, one-offs and serial-production family yachts.',
            'The surviving Ohlson archive shows O-29 drawings beginning in 1969 and continuing through the 1970s, including alternative keel and rudder arrangements and a racing version. The boat was not a single frozen sketch: it was an engineered design that continued to evolve.'
          ]
        },
        {
          label: 'Production',
          title: 'From Ohlson 29 to Winga 29',
          body: [
            'The Ohlson 29 was initially produced by Artekno in Finland. Swedish production followed at Winga Marin, and the design later evolved into the Winga 29 with changes to the rig, propulsion arrangement, appearance and interior.',
            'Swedish reference material reports that more than 400 boats of the Ohlson/Winga family had been built by the end of production in the early 1980s. Rassvet, hull 170 from 1975, belongs to the earlier Ohlson 29 generation.'
          ]
        }
      ],
      peersTitle: 'Where it sits among Swedish boats of its era',
      peersIntro: 'The Ohlson 29 is not really a Folkboat enlarged to 29 feet, and it is not an extreme Half Ton racer either. In design terms it sits between those two Swedish traditions.',
      tableHead: ['Boat', 'Approx. size', 'Design character'],
      peers: [
        ['International Folkboat', '7.85 × 2.25 m · 1967', 'Long keel, fractional rig and very narrow hull. The more traditional branch of Scandinavian small-yacht design.'],
        ['Albin Vega', '8.25 × 2.46 m · 1965', 'Lighter and smaller, conceived as an affordable mass-production family cruiser. A close cultural contemporary, but more conservative in size and accommodation.'],
        ['Ohlson 29', '8.85 × 2.70 m · c. 1970', 'Narrow masthead cruiser-racer with a fin keel, separate rudder and a practical five-berth cruising interior.'],
        ['Ballad 30', '9.14 × 2.96 m · 1971', 'A very close contemporary in mission and size, but with stronger Half Ton racing ancestry and more sail-carrying power.'],
        ['Scampi 30', '9.07 × 3.00 m · 1970', 'Peter Norlin’s overtly race-led Half Ton design. Faster and more competition-focused, but part of the same new generation of GRP Swedish cruiser-racers.'],
        ['Comfort 30', '9.09 × 3.03 m · 1972', 'Similar displacement and mission, but noticeably beamier: a step toward the greater interior volume that became normal later in the decade.']
      ],
      peersConclusion: 'The closest peers are therefore Ballad 30, Scampi 30 and Comfort 30. Vega and the International Folkboat belong to the same Scandinavian culture, but represent an earlier and more conservative solution.',
      modernEyebrow: 'Then and now',
      modernTitle: 'The same question, answered differently today',
      modernBody: [
        'A modern production cruiser of roughly the same role is much wider and carries its waterline and interior volume farther into the bow and stern. The Ohlson 29 is 8.85 m long and only 2.70 m wide; a current Hanse 315 is 9.62 × 3.35 m. Modern Swedish performance cruisers with a similar sailing-first philosophy have effectively moved into the 34-foot class.',
        'Arcona and Linjett still describe their boats in terms familiar to the Ohlson idea: responsive sailing, balance, family cruising and the ability to sail shorthanded. The engineering is completely different — vacuum-infused sandwich hulls, bulb keels, fractional rigs, self-tacking jibs and controls led aft — but the underlying compromise is recognisable.',
        'This does not make the Ohlson 29 better or worse than a modern yacht. It explains why it feels different: less interior volume for its length, a narrower hull, longer overhangs, a masthead rig and a tiller, with more of the boat’s identity concentrated on sailing rather than accommodation.'
      ],
      modern: [
        ['Hanse 315', '9.62 × 3.35 m', 'Modern 31-foot production cruiser; far more beam and interior volume.'],
        ['Arcona 345', '10.40 × 3.45 m', 'Current Swedish performance cruiser, explicitly intended for both cruising and racing.'],
        ['Linjett 34', '10.66 × 3.45 m', 'Swedish archipelago cruiser combining slender lines, performance and shorthanded handling.']
      ],
      sourcesLabel: 'Research note:',
      sourcesText: 'This summary is based on The Ohlson Project’s family archive and O-29 drawing register, Swedish Sailguide material, period-comparison data and current manufacturer specifications. Published sources disagree on some production dates and dimensions, so uncertain figures are deliberately described as approximate. The technical specifications for Rassvet elsewhere on this site use the period data supplied with this particular yacht.',
      sourceNames: ['The Ohlson Project: Einar & Carl-Eric', 'O-29 drawing archive', 'Sailguide: Ohlson 29', 'Hanse 315', 'Arcona 345', 'Linjett 34']
    },
    de: {
      nav: 'Konstruktion',
      eyebrow: 'Konstruktionsgeschichte',
      title: 'Was für ein Boot ist die Ohlson 29?',
      lead: 'Die Ohlson 29 gehört in eine sehr bestimmte skandinavische Epoche: die frühen 1970er Jahre, als von einer Familien-Fahrtenyacht noch selbstverständlich erwartet wurde, dass sie auch gut genug für Regatten segelt. Einar Ohlson entwarf sie als kompakten GFK-Cruiser-Racer, nicht als reines Regattaboot und ebenso wenig als schwimmendes Ferienhaus.',
      origins: [
        {
          label: 'Die Konstrukteure',
          title: 'Von Orust zum olympischen Segeln',
          body: [
            'Einar Ohlson (1918–2004) und sein Bruder Carl-Eric (1920–2015) stammten aus Hälleviksstrand auf Orust, einer Insel mit langer Bootsbautradition. 1951 gründeten sie in Göteborg das Konstruktionsbüro Ingenjörsfirman Bröderna Ohlson.',
            'International bekannt wurden sie vor allem durch die 5.5-Meter-Klasse. Hojwa gewann 1952 in Helsinki olympisches Bronze, und bei allen Olympischen Spielen von 1952 bis 1968 gewann eine von Ohlson entworfene 5.5-Meter-Yacht eine Medaille. Carl-Eric verließ die Firma 1957; die Ohlson 29 ist daher ein Entwurf von Einar.'
          ]
        },
        {
          label: 'Die Methode',
          title: 'Regattaerfahrung für normale Segler',
          body: [
            'Einar war als Schiffbauingenieur ausgebildet und arbeitete bei Götaverken sowie am schwedischen staatlichen Schiffbau-Versuchsinstitut. Das Büro entwarf Regattayachten, Einzelbauten und Serien-Familienboote nebeneinander.',
            'Im erhaltenen Ohlson-Archiv beginnen die O-29-Zeichnungen 1969 und reichen durch die 1970er Jahre. Darunter finden sich unterschiedliche Kiel- und Ruderanordnungen sowie eine Regattaversion. Die Konstruktion war also kein unveränderter Einzelentwurf, sondern wurde technisch weiterentwickelt.'
          ]
        },
        {
          label: 'Produktion',
          title: 'Von der Ohlson 29 zur Winga 29',
          body: [
            'Die Ohlson 29 wurde zunächst bei Artekno in Finnland gebaut. Später folgte die schwedische Produktion bei Winga Marin; daraus entwickelte sich die Winga 29 mit Änderungen an Rigg, Antrieb, Erscheinungsbild und Innenausbau.',
            'Schwedische Quellen berichten von mehr als 400 gebauten Booten der Ohlson/Winga-Familie bis zum Produktionsende Anfang der 1980er Jahre. Rassvet, Baunummer 170 von 1975, gehört zur früheren Ohlson-29-Generation.'
          ]
        }
      ],
      peersTitle: 'Ihr Platz unter schwedischen Booten dieser Zeit',
      peersIntro: 'Die Ohlson 29 ist weder einfach ein auf 29 Fuß vergrößertes Folkeboot noch ein extremer Half-Tonner. Konstruktiv liegt sie zwischen diesen beiden schwedischen Traditionen.',
      tableHead: ['Boot', 'Ungefähre Größe', 'Konstruktiver Charakter'],
      peers: [
        ['International Folkboat', '7,85 × 2,25 m · 1967', 'Langkiel, fraktionelles Rigg und sehr schmaler Rumpf. Der traditionellere Zweig des skandinavischen Kleinbootbaus.'],
        ['Albin Vega', '8,25 × 2,46 m · 1965', 'Leichter und kleiner, als erschwingliche Familienyacht für Großserie gedacht. Kulturell sehr nah, aber bei Größe und Raumangebot konservativer.'],
        ['Ohlson 29', '8,85 × 2,70 m · ca. 1970', 'Schmaler, toppgetakelter Cruiser-Racer mit Finnenkiel, getrenntem Ruder und praktischem Fahrteninnenraum mit fünf Kojen.'],
        ['Ballad 30', '9,14 × 2,96 m · 1971', 'In Aufgabe und Größe sehr ähnlich, jedoch stärker vom Half-Ton-Regattasegeln geprägt und mit mehr Segeltragevermögen.'],
        ['Scampi 30', '9,07 × 3,00 m · 1970', 'Peter Norlins deutlich regattaorientierter Half-Tonner. Schneller und wettbewerbsbetonter, aber Teil derselben neuen Generation schwedischer GFK-Cruiser-Racer.'],
        ['Comfort 30', '9,09 × 3,03 m · 1972', 'Ähnliche Verdrängung und Aufgabe, aber deutlich breiter: ein Schritt hin zu dem größeren Innenraumvolumen, das später normal wurde.']
      ],
      peersConclusion: 'Die nächsten Vergleichsboote sind daher Ballad 30, Scampi 30 und Comfort 30. Vega und International Folkboat gehören zur gleichen skandinavischen Kultur, stehen aber für eine ältere und konservativere Lösung.',
      modernEyebrow: 'Damals und heute',
      modernTitle: 'Dieselbe Frage wird heute anders beantwortet',
      modernBody: [
        'Eine moderne Serien-Fahrtenyacht mit ähnlicher Aufgabe ist deutlich breiter und nutzt Wasserlinie und Innenraum viel weiter bis in Bug und Heck. Die Ohlson 29 ist 8,85 m lang und nur 2,70 m breit; eine heutige Hanse 315 misst 9,62 × 3,35 m. Moderne schwedische Performance-Cruiser mit ähnlicher Segelphilosophie liegen inzwischen eher in der 34-Fuß-Klasse.',
        'Arcona und Linjett beschreiben ihre heutigen Boote noch mit Begriffen, die zur Ohlson-Idee passen: direktes Segelgefühl, Balance, Familienfahrten und gute Bedienbarkeit mit kleiner Crew. Die Technik ist völlig anders — vakuuminfundierte Sandwichrümpfe, Bulbkiele, fraktionelle Riggs, Selbstwendefocks und nach achtern geführte Leinen — aber der Grundkompromiss ist wiederzuerkennen.',
        'Das macht die Ohlson 29 weder besser noch schlechter als eine moderne Yacht. Es erklärt, warum sie sich anders anfühlt: weniger Innenraum pro Meter Länge, ein schmalerer Rumpf, längere Überhänge, Topp-Rigg und Pinne, mit stärkerem Schwerpunkt auf dem Segeln selbst als auf maximalem Wohnraum.'
      ],
      modern: [
        ['Hanse 315', '9,62 × 3,35 m', 'Moderner 31-Fuß-Seriencruiser mit deutlich mehr Breite und Innenraum.'],
        ['Arcona 345', '10,40 × 3,45 m', 'Aktueller schwedischer Performance-Cruiser, ausdrücklich für Fahrten und Regatten gedacht.'],
        ['Linjett 34', '10,66 × 3,45 m', 'Schwedischer Schärenkreuzer, der schlanke Linien, Leistung und kleine Crew verbindet.']
      ],
      sourcesLabel: 'Hinweis zu den Quellen:',
      sourcesText: 'Diese Zusammenfassung stützt sich auf das Familienarchiv und das O-29-Zeichnungsregister des Ohlson Project, schwedisches Sailguide-Material, Vergleichsdaten zeitgenössischer Boote und aktuelle Herstellerangaben. Veröffentlichte Quellen unterscheiden sich bei einzelnen Produktionsjahren und Abmessungen; unsichere Angaben werden deshalb bewusst nur ungefähr genannt. Die technischen Daten von Rassvet an anderer Stelle dieser Website stammen aus den historischen Unterlagen, die mit genau dieser Yacht übergeben wurden.',
      sourceNames: ['The Ohlson Project: Einar & Carl-Eric', 'O-29-Zeichnungsarchiv', 'Sailguide: Ohlson 29', 'Hanse 315', 'Arcona 345', 'Linjett 34']
    },
    ru: {
      nav: 'Конструкция',
      eyebrow: 'История конструкции',
      title: 'Что такое Ohlson 29?',
      lead: 'Ohlson 29 появилась в очень характерный для Скандинавии момент: в начале 1970-х от семейной крейсерской яхты всё ещё ожидали, что она будет достаточно хорошо ходить, чтобы участвовать в гонках. Эйнар Олсон проектировал её как компактный стеклопластиковый cruiser-racer, а не как чистую гоночную машину и не как плавучую дачу.',
      origins: [
        {
          label: 'Конструкторы',
          title: 'От Оруста до олимпийского паруса',
          body: [
            'Эйнар Олсон (1918–2004) и его брат Карл-Эрик (1920–2015) выросли в Хэллевикстранде на острове Оруст, в среде с многолетней традицией лодкостроения. В 1951 году они основали в Гётеборге конструкторское бюро Ingenjörsfirman Bröderna Ohlson.',
            'Международную репутацию братьям принес прежде всего класс 5.5 Metre. Hojwa получила олимпийскую бронзу в Хельсинки в 1952 году, а на каждой Олимпиаде с 1952 по 1968 год яхта конструкции Ohlson брала медаль в этом классе. Карл-Эрик покинул фирму в 1957 году, поэтому Ohlson 29 является уже самостоятельной работой Эйнара.'
          ]
        },
        {
          label: 'Метод',
          title: 'Гоночный опыт для обычных яхтсменов',
          body: [
            'Эйнар получил образование корабельного инженера, работал на Götaverken и в шведском государственном институте испытаний судов. Его бюро одновременно занималось гоночными яхтами, единичными проектами и серийными семейными лодками.',
            'Сохранившийся архив Ohlson содержит чертежи O-29 начиная с 1969 года и последующие изменения на протяжении 1970-х, включая разные варианты киля и руля и отдельную гоночную версию. То есть это был не однажды нарисованный и навсегда замороженный проект, а конструкция, которую продолжали инженерно развивать.'
          ]
        },
        {
          label: 'Производство',
          title: 'От Ohlson 29 к Winga 29',
          body: [
            'Первоначально Ohlson 29 строилась компанией Artekno в Финляндии. Затем производство появилось у шведской Winga Marin, а проект постепенно превратился в Winga 29 с изменениями в вооружении, силовой установке, внешнем виде и интерьере.',
            'Шведские источники указывают, что к завершению производства в начале 1980-х семейство Ohlson/Winga превысило 400 построенных лодок. Rassvet, корпус №170 1975 года, относится к более раннему поколению Ohlson 29.'
          ]
        }
      ],
      peersTitle: 'Место среди шведских лодок своего времени',
      peersIntro: 'Ohlson 29 нельзя точно назвать ни увеличенным Folkboat, ни экстремальным Half Ton racer. По конструкции она находится между двумя этими шведскими традициями.',
      tableHead: ['Лодка', 'Примерный размер', 'Характер конструкции'],
      peers: [
        ['International Folkboat', '7,85 × 2,25 м · 1967', 'Длинный киль, дробное вооружение и очень узкий корпус. Более традиционная ветвь скандинавских малых яхт.'],
        ['Albin Vega', '8,25 × 2,46 м · 1965', 'Меньше и легче, создавалась как доступная массовая семейная яхта. Очень близка культурно, но консервативнее по размеру и внутреннему объёму.'],
        ['Ohlson 29', '8,85 × 2,70 м · ок. 1970', 'Узкий топовый cruiser-racer с плавниковым килем, отдельным рулём и практичным крейсерским интерьером на пять спальных мест.'],
        ['Ballad 30', '9,14 × 2,96 м · 1971', 'Очень близка по времени, размеру и назначению, но сильнее происходит от Half Ton гонок и несёт более мощное парусное вооружение.'],
        ['Scampi 30', '9,07 × 3,00 м · 1970', 'Явно гоночный Half Ton проект Петера Норлина. Быстрее и спортивнее, но принадлежит тому же новому поколению шведских стеклопластиковых cruiser-racer.'],
        ['Comfort 30', '9,09 × 3,03 м · 1972', 'Схожие водоизмещение и назначение, но заметно больше ширина: шаг к тому внутреннему объёму, который стал нормой позднее.']
      ],
      peersConclusion: 'Поэтому самые близкие современники по идее — Ballad 30, Scampi 30 и Comfort 30. Vega и International Folkboat принадлежат той же скандинавской культуре, но представляют более ранний и консервативный ответ на ту же задачу.',
      modernEyebrow: 'Тогда и сейчас',
      modernTitle: 'Сегодня на тот же вопрос отвечают иначе',
      modernBody: [
        'Современная серийная крейсерская яхта сходного назначения намного шире и использует почти всю длину корпуса для ватерлинии и жилого объёма. Ohlson 29 имеет длину 8,85 м и ширину всего 2,70 м; современная Hanse 315 — 9,62 × 3,35 м. Шведские performance cruiser с похожей философией сейчас фактически переместились уже в класс около 34 футов.',
        'Arcona и Linjett и сегодня описывают свои лодки словами, хорошо знакомыми по идее Ohlson: отзывчивость, баланс, семейные путешествия и возможность уверенно ходить малым экипажем. Инженерно это уже совершенно другие яхты — вакуумный сэндвич, бульбовые кили, дробное вооружение, автоматические стаксели и проводка снастей к рулевому — но сам компромисс между ходкостью и крейсерской жизнью узнаваем.',
        'Это не делает Ohlson 29 лучше или хуже современной яхты. Это объясняет, почему она ощущается иначе: меньше жилого объёма на метр длины, более узкий корпус, длинные свесы, топовое вооружение и румпель, а большая часть характера лодки сосредоточена именно в том, как она идёт под парусом.'
      ],
      modern: [
        ['Hanse 315', '9,62 × 3,35 м', 'Современный серийный 31-футовый cruiser с существенно большей шириной и внутренним объёмом.'],
        ['Arcona 345', '10,40 × 3,45 м', 'Современный шведский performance cruiser, прямо рассчитанный и на путешествия, и на гонки.'],
        ['Linjett 34', '10,66 × 3,45 м', 'Шведская яхта для шхер, сочетающая сравнительно стройные линии, ходкость и управление малым экипажем.']
      ],
      sourcesLabel: 'О источниках:',
      sourcesText: 'Справка составлена по семейному архиву The Ohlson Project и реестру чертежей O-29, шведскому Sailguide, данным о лодках-современниках и актуальным данным производителей. В опубликованных источниках встречаются расхождения в отдельных датах производства и размерах, поэтому спорные цифры здесь намеренно указаны приблизительно. Технические характеристики Rassvet в другом разделе сайта взяты из исторического технического листа, переданного именно с этой яхтой.',
      sourceNames: ['The Ohlson Project: Эйнар и Карл-Эрик', 'Архив чертежей O-29', 'Sailguide: Ohlson 29', 'Hanse 315', 'Arcona 345', 'Linjett 34']
    }
  };

  const sourceUrls = [sources.ohlsonPeople, sources.ohlsonDrawings, sources.sailguide, sources.hanse315, sources.arcona345, sources.linjett34];

  const currentLanguage = () => {
    const language = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return Object.prototype.hasOwnProperty.call(copy, language) ? language : 'en';
  };

  const paragraphs = (items) => items.map((text) => `<p>${text}</p>`).join('');

  const render = () => {
    const text = copy[currentLanguage()];
    const specs = document.querySelector('.technical-specs');
    if (!specs) return;

    let section = document.querySelector('#design-history');
    if (!section) {
      section = document.createElement('section');
      section.id = 'design-history';
      section.className = 'section design-history';
      section.dataset.i18nIgnore = '';
      specs.after(section);
    }

    const originCards = text.origins.map((card) => `
      <article class="design-history-card">
        <span>${card.label}</span>
        <h3>${card.title}</h3>
        ${paragraphs(card.body)}
      </article>`).join('');

    const peerRows = text.peers.map(([name, size, character]) => `
      <div class="design-family-row">
        <div><strong>${name}</strong></div>
        <div><strong>${size}</strong></div>
        <div><p>${character}</p></div>
      </div>`).join('');

    const modernCards = text.modern.map(([name, size, character]) => `
      <article>
        <span>${name}</span>
        <strong>${size}</strong>
        <small>${character}</small>
      </article>`).join('');

    const sourceLinks = text.sourceNames.map((name, index) => `<a href="${sourceUrls[index]}" target="_blank" rel="noreferrer">${name}</a>`).join(' · ');

    section.innerHTML = `
      <div class="design-history-inner">
        <header class="design-history-header reveal is-visible">
          <div>
            <p class="eyebrow">${text.eyebrow}</p>
            <h2>${text.title}</h2>
          </div>
          <p>${text.lead}</p>
        </header>

        <div class="design-history-origin reveal is-visible">${originCards}</div>

        <div class="design-history-position reveal is-visible">
          <div class="design-history-position-copy">
            <h3>${text.peersTitle}</h3>
            <p>${text.peersIntro}</p>
            <p>${text.peersConclusion}</p>
          </div>
          <div class="design-family-table" role="table">
            <div class="design-family-row design-family-head" role="row">
              ${text.tableHead.map((heading) => `<div role="columnheader">${heading}</div>`).join('')}
            </div>
            ${peerRows}
          </div>
        </div>

        <div class="design-history-modern reveal is-visible">
          <div class="design-history-modern-copy">
            <p class="eyebrow">${text.modernEyebrow}</p>
            <h3>${text.modernTitle}</h3>
            ${paragraphs(text.modernBody)}
          </div>
          <div class="modern-comparison">${modernCards}</div>
        </div>

        <p class="design-history-sources"><strong>${text.sourcesLabel}</strong> ${text.sourcesText}<br>${sourceLinks}</p>
      </div>`;

    const nav = document.querySelector('[data-nav]');
    if (nav) {
      let link = nav.querySelector('a[href="#design-history"]');
      if (!link) {
        link = document.createElement('a');
        link.href = '#design-history';
        link.dataset.i18nIgnore = '';
        const maintenance = nav.querySelector('a[href="#timeline"]');
        nav.insertBefore(link, maintenance || nav.firstChild);
      }
      link.textContent = text.nav;
    }
  };

  render();
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
