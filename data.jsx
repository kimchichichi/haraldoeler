// Project data + small components
const PROJECT_IMAGE_BASE = "/projekte/image";
const PROJECT_HERO_IMAGE_BASE = "/projekte/image/page";

const PROJECTS = [
  {
    id: "solo",
    num: "01",
    title: "Solo",
    role: "Akkordeon — solo",
    subtitle: "Einzigartige Akkordeonmusik der Klassik, Neuen Musik und des Jazz.",
    image: `${PROJECT_IMAGE_BASE}/solo.webp`,
    variant: "tall",
  },
  {
    id: "orchester",
    num: "02",
    title: "Orchester",
    role: "Akkordeon + Orchester",
    subtitle: "Solistisches Repertoire mit Sinfonie- und Kammerorchester.",
    image: `${PROJECT_IMAGE_BASE}/orchester.webp`,
    variant: "wide",
  },
  {
    id: "fussissimo",
    num: "03",
    title: "Fussissimo",
    role: "Trio — gypsy · ethno · jazz",
    subtitle: "Gypsy-Ethno-Jazz Ensemble — drei Stimmen, ein gemeinsamer Atem.",
    image: `${PROJECT_IMAGE_BASE}/fussissimo.webp`,
    variant: "default",
  },
  {
    id: "duovia",
    num: "04",
    title: "Duo ViA!",
    role: "Akkordeon & Violine",
    subtitle: "Transkriptionen aus vier Jahrhunderten — Bach bis heute.",
    image: `${PROJECT_IMAGE_BASE}/duovia.webp`,
    variant: "default",
  },
  {
    id: "duoklakk",
    num: "05",
    title: "Duo KlAkk!",
    role: "neue musik × alte musik",
    subtitle: "Resonanzen zwischen Neuer und Alter Musik.",
    image: `${PROJECT_IMAGE_BASE}/duoklakk.webp`,
    variant: "tall",
  },
  {
    id: "hof",
    num: "06",
    title: "Hofer Musikscene",
    role: "Lokales · regional",
    subtitle: "Projekte und Begegnungen im Hofer Land.",
    image: `${PROJECT_IMAGE_BASE}/hof.webp`,
    variant: "wide",
  },
];

const DETAILS = {
  solo: {
    title: "Solo",
    eyebrow: "Projekt 01 · Akkordeon solo",
    image: `${PROJECT_HERO_IMAGE_BASE}/solo.webp`,
    runtime: ["Programm · »Remembering«", "Besetzung · Akkordeon solo", "Album · Pictures at an Exhibition"],
    lede: ["Die Präzision des Klaviers. Die Sogkraft des Orchesters. ", { em: "Eine Stimme." }],
    body: [
      "Auf dem Instrument des Jahres 2026 präsentiert Harald Oeler sein neues Konzertprogramm „Remembering“. Reisen nach Paris und Tokio dienten ihm als Hauptquellen der kompositorischen Inspiration. Die Musik Johann Sebastian Bachs und Astor Piazzollas fließen in das Programm ein, welches das Publikum auf eine multi-stilistische Weltreise entführt. Mit freier Improvisation, jazzigen Sounds und südamerikanischem Tango zieht er das Publikum in seinen Bann.",
      "Künstlerisch bewegt sich Harald Oeler in einem weiten Feld, welches von der (Ur-)Aufführung zeitgenössischer Werke, über die Transkription klassischer Werke für das Akkordeon, bis hin zum Jazz reicht.",
      "Auftritte beim Heidelberger Frühling, Literaturfest Niedersachsen, Sommerliche Musiktage Hitzacker, Frankfurter MuseumsSalon, Django Memorial Augsburg und Frankfurter Jazzfestival. Konzertreisen führten Harald Oeler nach China, Korea, Rumänien, Finnland, Schweden, Italien, Österreich, Schweiz und Polen.",
      "Zahlreiche CD Produktionen bei OehmsClassics, Genuin und Thorofon / Bella Musica repräsentieren sein breitgefächertes Konzertleben.",
    ],
    repertoire: [
      { num: "I.", work: "Modest Mussorgsky", note: "Pictures at an Exhibition", dur: "—" },
      { num: "II.", work: "Sofia Gubaidulina", note: "Et expecto", dur: "—" },
      { num: "III.", work: "Harald Oeler", note: "»Remembering« — eigene Werke", dur: "—" },
    ],
    quotes: [
      { text: "Oeler's transcription unites the advantages of the original piano version and Ravel's orchestral adaptation — an astounding range of colours and dynamics.", cite: "Nordwest-Radio" },
    ],
    media: [
      { kind: "youtube", id: "AH1Bj1WaY8o", caption: "Solo · »Remembering«" },
      { kind: "spotify", url: "https://open.spotify.com/embed/album/02LouxvRMRz0bj5etTqFpL?utm_source=generator&theme=0", caption: "Pictures at an Exhibition · Et expecto" },
    ],
  },
  orchester: {
    title: "Orchester",
    eyebrow: "Projekt 02 · Akkordeon + Orchester",
    image: `${PROJECT_HERO_IMAGE_BASE}/orchester.webp`,
    runtime: ["Solistisches Repertoire", "Besetzung · Sinfonie- / Streichorchester", "Tour · auf Anfrage"],
    lede: ["Das Akkordeon als ", { em: "Solostimme" }, " im großen Apparat — von Bach bis Galliano."],
    body: [
      "Solistisches Repertoire mit Sinfonie- und Streichorchester. Programme werden gemeinsam mit Veranstalter:innen und Dirigent:innen kuratiert — von Barockkonzerten bis zu modernen Konzertwerken speziell für das Akkordeon.",
    ],
    repertoire: [
      { num: "I.", work: "J. S. Bach", note: "Cembalokonzert d-Moll, BWV 1052", dur: "" },
      { num: "II.", work: "J. S. Bach", note: "Konzert für zwei Cembali, BWV 1061", dur: "" },
      { num: "III.", work: "Václav Trojan", note: "»Pohádky« — Märchen für Akkordeon und Orchester", dur: "" },
      { num: "IV.", work: "Richard Galliano", note: "»Opale Concerto«", dur: "" },
      { num: "V.", work: "Astor Piazzolla", note: "»Ballet-Tango«", dur: "" },
      { num: "VI.", work: "Erhard Cotta (arr.)", note: "»Philharmonic Gypsy-Swing«", dur: "" },
      { num: "VII.", work: "Ole Schmidt", note: "»Symphonic Fantasy and Allegro«", dur: "" },
    ],
    quotes: [],
    media: [
      { kind: "youtube", id: "WPMtnt0PfY0", caption: "Galliano · Opale Concerto" },
      { kind: "youtube", id: "WFCRiyENZxk", caption: "Bach · Cembalokonzert d-Moll, BWV 1052" },
      { kind: "youtube", id: "2OJ2BstBZCw", caption: "Piazzolla · Ballet-Tango" },
      { kind: "youtube", id: "GATut_MZPHY", caption: "Erhard Cotta · Philharmonic Gypsy-Swing" },
    ],
  },
  fussissimo: {
    title: "Fussissimo",
    eyebrow: "Projekt 03 · Gypsy · Ethno · Jazz",
    image: `${PROJECT_HERO_IMAGE_BASE}/fussissimo.webp`,
    runtime: ["Trio · seit fast 20 Jahren", "Rehan Syed · Gitarre", "Simon Ort · Bass · Harald Oeler · Akkordeon"],
    lede: ["Tango, Bossa, Musette, Orient — ", { em: "alles in einem Atemzug." }],
    body: [
      "Virtuose Spieltechnik und jede Menge Inspirationen aus Jazz und Weltmusik. Diese Kombination macht das Trio zu einem besonders interessanten Gypsy-Ethno-Jazz Ensemble.",
      "Seit fast 20 Jahren hat sich der Gitarrist und Komponist Rehan Syed mit seinen Projekten einen wohlklingenden Namen in der Gypsy-Jazz-Szene erspielt — und ist nun mit dem erstklassigen Bassisten Simon Ort am Kontrabass und dem preisgekrönten Akkordeonisten Harald Oeler in einer Trio-Besetzung zu hören, die es in sich hat.",
      "Zum Programm gehören originelle Eigenkompositionen von Rehan Syed mit Einflüssen von Tango, Bossa, französischer Musette und orientalischer Musik, sowie Perlen aus dem Gypsy-Jazz- und Weltmusik-Repertoire.",
    ],
    repertoire: [
      { num: "I.", work: "Rehan Syed", note: "Eigenkompositionen", dur: "" },
      { num: "II.", work: "Made in France", note: "live in der musik-butik", dur: "" },
      { num: "III.", work: "Ani Suni", note: "live in der musik-butik", dur: "" },
    ],
    quotes: [],
    media: [
      { kind: "youtube", id: "TsTN3AgrpbU", caption: "Made in France · live in der musik-butik" },
      { kind: "youtube", id: "05HxYd95Phw", caption: "Ani Suni · live in der musik-butik" },
    ],
    termine: [
      { date: "21. Juni 2026", time: "17:40 Uhr", title: "Umsonst & Draussen Festival", venue: "Draussen-Bühne", city: "Würzburg", note: "Freies Open-Air-Konzert" },
      { date: "27. September 2026", time: "Uhrzeit folgt", title: "Fussissimo – Gypsy-Ethno-Jazz", venue: "Huttenschloss", city: "Gemünden am Main", note: "" },
      { date: "17. April 2027", time: "Uhrzeit folgt", title: "Fussissimo", venue: "Ort folgt", city: "", note: "" },
    ],
  },
  duovia: {
    title: "Duo ViA!",
    eyebrow: "Projekt 04 · Akkordeon & Violine",
    image: `${PROJECT_HERO_IMAGE_BASE}/duovia.webp`,
    runtime: ["Sinn Yang · Violine", "Harald Oeler · Akkordeon", "Album · 8 Jahreszeiten · OehmsClassics"],
    lede: ["Vivaldi & Piazzolla — ", { em: "ein kühnes Wagnis" }, " der Harmonie und der Erfindung."],
    body: [
      "Neue Klangwelten entdecken — ein Ziel, das sich mit der außergewöhnlichen Besetzung aus Violine und Akkordeon spielerisch erreichen lässt.",
      "Duo ViA!s CD der »8 Jahreszeiten« von Vivaldi und Piazzolla erschien 2014 bei OehmsClassics und erhielt begeisterte Kritiken. Mit Neugierde und Experimentierlust erkunden beide Künstler in ihrer exotischen Besetzung Meisterwerke der zeitgenössischen Musik, Bach, Chick Corea u.a. und traten erfolgreich auf — beim Heidelberger Frühling, in Berlin, München, Bracciano / Italien und Helsinki.",
      "The Duo made their debut in 2009 with the programme »Seasons« at the Heidelberg Spring Festival — a sold-out hall, Vivaldi's Quattro Stagioni in combination with Piazzolla's Cuatro Estaciones Porteñas.",
    ],
    repertoire: [
      { composer: "Piazzolla", work: "Primavera Porteña", season: "Frühling", tracks: [
        { num: "01", dur: "05:24", spotifyId: "6jTPSqBO9hAmaJ053onuB0" },
      ]},
      { composer: "Vivaldi", work: "L'Estate", season: "Sommer", tracks: [
        { num: "02", movement: "I. Allegro non molto", dur: "05:13", spotifyId: "1CKi98LJ9KFKykgLMD906o" },
        { num: "03", movement: "II. Adagio", dur: "02:07", spotifyId: "7oSwDTIG3PtoGaN9U78DWB" },
        { num: "04", movement: "III. Presto", dur: "02:54", spotifyId: "5pgzCPu8dlf6nVoU3mCdMn" },
      ]},
      { composer: "Piazzolla", work: "Otoño Porteño", season: "Herbst", tracks: [
        { num: "05", dur: "05:54", spotifyId: "22sgmG0ZeED3A1UfzdxwFA" },
      ]},
      { composer: "Vivaldi", work: "L'Inverno", season: "Winter", tracks: [
        { num: "06", movement: "I. Allegro non molto", dur: "03:18", spotifyId: "3upjT6qnIdWeDF1wjeYr3N" },
        { num: "07", movement: "II. Largo", dur: "02:08", spotifyId: "2p3uK5ViWX8kBZT85NYlCj" },
        { num: "08", movement: "III. Allegro", dur: "03:33", spotifyId: "5Sz9PbC57aigcfBwusTpES" },
      ]},
      { composer: "Vivaldi", work: "La Primavera", season: "Frühling", tracks: [
        { num: "09", movement: "I. Allegro", dur: "03:21", spotifyId: "4mHOTaiMkbnISsGYEgPrYy" },
        { num: "10", movement: "II. Largo", dur: "02:19", spotifyId: "0evX8OMy9qVKoaPCWyUZ12" },
        { num: "11", movement: "III. Allegro", dur: "04:07", spotifyId: "7xKysomAax3mJFrMltzXLL" },
      ]},
      { composer: "Piazzolla", work: "Verano Porteño", season: "Sommer", tracks: [
        { num: "12", dur: "06:35", spotifyId: "57mFS3ba9C4nITdRWzusXP" },
      ]},
      { composer: "Vivaldi", work: "L'Autunno", season: "Herbst", tracks: [
        { num: "13", movement: "I. Allegro", dur: "05:34", spotifyId: "4P7S6wGMqo4jhCq2BhjKnU" },
        { num: "14", movement: "II. Adagio molto", dur: "02:30", spotifyId: "26dlNnK1c1Dg70zC0UyMFP" },
        { num: "15", movement: "III. Allegro", dur: "03:07", spotifyId: "1aDX0JP66bs6e8loJjDwHP" },
      ]},
      { composer: "Piazzolla", work: "Invierno Porteño", season: "Winter", tracks: [
        { num: "16", dur: "07:11", spotifyId: "1DgQ33m7W556x2xZzhXYO5" },
      ]},
    ],
    quotes: [
      { text: "Yang und Oeler spielen wie aufeinander eingeschworen — sie bilden nicht nur rhythmisch eine Einheit. Der Dauerbrenner von Vivaldi erscheint hier stellenweise wie unter dem Mikroskop.", cite: "NDR" },
      { text: "Akkordeon und Solo-Geige verschmelzen auf eine neue, man könnte fast sagen: ideale Weise.", cite: "NDR Kultur" },
    ],
    media: [
      { kind: "youtube", id: "AJ6uhwH7-gI", caption: "Duo ViA! · Trailer" },
      { kind: "youtube", id: "kw7_NO-klxM", caption: "Duo ViA! · concert highlight" },
      { kind: "spotify", url: "https://open.spotify.com/embed/album/0MfH41bgOifWl6W9fXDcW1?utm_source=generator&theme=0", caption: "8 Jahreszeiten · OehmsClassics" },
    ],
  },
  duoklakk: {
    title: "Duo KlAkk!",
    eyebrow: "Projekt 05 · neue musik × alte musik",
    image: `${PROJECT_HERO_IMAGE_BASE}/duoklakk.webp`,
    runtime: ["Ji Eun Kim · Klarinette", "Harald Oeler · Akkordeon", "Programm · »Duo KlAkk! goes BACH!«"],
    lede: ["Wenn die zeitlose Genialität Bachs auf die ", { em: "spielerische Energie" }, " des Duos trifft."],
    body: [
      "Das 2023 neu gegründete Duo KlAkk! (Harald Oeler, Akkordeon und Ji Eun Kim, Klarinette) machte sich von Anfang an zur Aufgabe, einerseits Neue Musik zeitgemäß und modern zu vermitteln und andererseits Transkriptionen Alter Musik kontrapunktisch gegenüberzustellen.",
      "Was passiert, wenn die zeitlose Genialität Johann Sebastian Bachs auf die spielerische Energie von Duo KlAkk! trifft? Ein Konzert voller Überraschungen, Kontraste und einer Prise Augenzwinkern. Das Duo nimmt das Publikum mit auf eine Reise durch Bachs zwei Sonaten für Viola da Gamba — Meisterwerke voller Eleganz, Tiefe und musikalischem Dialog.",
    ],
    repertoire: [
      { num: "I.", work: "J. S. Bach", note: "Sonate D-Dur, BWV 1028", dur: "" },
      { num: "II.", work: "J. S. Bach", note: "Sonate g-Moll, BWV 1029", dur: "" },
      { num: "III.", work: "Joseph Haydn", note: "Divertimento G-Dur, op. 100 Nr. 2 (Arr. Oeler)", dur: "" },
      { num: "IV.", work: "Harald Oeler", note: "Remembering Paris · Remembering Tokyo", dur: "" },
      { num: "V.", work: "Johan Svensson", note: "Double Dubbing (firefly song), 2020", dur: "" },
    ],
    quotes: [
      { text: "Ein Fest der Bach-Interpretation. Ein Höhepunkt im Straubinger Kulturleben 2025.", cite: "Kristian Kuhnle · Straubinger Tagblatt" },
    ],
    termine: [
      { date: "12. Mai 2026", time: "18:00 Uhr", title: "Duo KlAkk! goes Encore!", venue: "Mauritiuskirche", city: "Kirchheim am Neckar", note: "Kirchgasse 6 · 74366 Kirchheim am Neckar" },
      { date: "5. Dezember 2026", time: "18:00 Uhr", title: "Duo KlAkk! goes Encore!", venue: "Mauritiuskirche", city: "Kirchheim am Neckar", note: "Kirchgasse 6 · 74366 Kirchheim am Neckar" },
    ],
    media: [
      { kind: "youtube", id: "4NPvdif9o6M", caption: "Duo KlAkk! goes BACH!" },
      { kind: "youtube", id: "xwVu6_XbiV0", caption: "Bach · Sonate g-Moll, BWV 1029" },
      { kind: "youtube", id: "lYlqyNsLyYk", caption: "Bach · Sonate g-Moll, BWV 1028, iii. Andante" },
      { kind: "youtube", id: "9WGPikQQlyw", caption: "Haydn · Divertimento in G Dur, Hob. IV Nr.7" },
    ],
  },
  hof: {
    title: "Hofer Musikscene",
    eyebrow: "Projekt 06 · Hofer Land",
    image: `${PROJECT_HERO_IMAGE_BASE}/hof.webp`,
    runtime: ["Jam · jeden ersten Dienstag", "KunstKaufHaus Hof · 20 Uhr", "VHS Hofer Land · Konzertreihe"],
    lede: ["Begegnungen, Reibungen, Reisen — ", { em: "Musik im Hofer Land." }],
    body: [
      "Drei laufende Formate, die das musikalische Leben in Hof und Umgebung mitprägen — vom offenen Jam bis zum kuratierten Konzert mit Streichquartett.",
    ],
    repertoire: [
      { num: "I.", work: "Jazz Jam Session", note: "KunstKaufHaus Hof · jeden ersten Dienstag, 20 Uhr · Schricker / von Mammen / Oeler / Motschmann / Auer / Tröger", dur: "" },
      { num: "II.", work: "»NEU | START | JAZZ«", note: "VHS Hofer Land · in Kooperation mit dem Tonkünstlerverband Bayern · von Mammen / Jung / Oeler / Jersak / Nitsch / Fau", dur: "" },
      { num: "III.", work: "Streichquartett & Harald Oeler", note: "Werke von Barock über Jazz und Tango bis zur Moderne", dur: "" },
    ],
    quotes: [],
  },
};

function Header({ active = "projekte" }) {
  const navItems = [
    { id: "bio", label: "bio", href: "/bio.html" },
    { id: "projekte", label: "projekte", href: "/projekte" },
    { id: "termine", label: "termine", href: "/termine.html" },
    { id: "news", label: "news", href: "/news.html" },
    { id: "unterricht", label: "unterricht", href: "/unterricht.html" },
    { id: "medien", label: "medien", href: "/medien.html" },
    { id: "kontakt", label: "kontakt", href: "/kontakt.html" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="/index.html">
          HARALD<span className="dot"></span>OELER
          {" "}<small>· accordionist &amp; composer</small>
        </a>
        <nav className="primary">
          {navItems.map(item => (
            <a key={item.id} href={item.href} className={active === item.id ? "active" : ""}>{item.label}</a>
          ))}
        </nav>
        <button className="theme-toggle" id="theme-toggle" type="button" aria-label="Farbschema wechseln" title="Dark / Light">
          <svg className="icon-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="icon-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <button className="nav-toggle" id="navToggle" type="button" aria-label="Menü öffnen" aria-expanded="false">
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <line x1="0" y1="1" x2="22" y2="1" />
            <line x1="0" y1="7" x2="22" y2="7" />
            <line x1="0" y1="13" x2="22" y2="13" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="left">© Harald Oeler · 2026</div>
      <div className="center"></div>
      <div className="right"><a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></div>
    </footer>
  );
}

function Arrow({dir = "right"}) {
  const path = dir === "right"
    ? "M0 8 L18 8 M12 2 L18 8 L12 14"
    : "M18 8 L0 8 M6 2 L0 8 L6 14";
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d={path}/>
    </svg>
  );
}

window.PROJECTS = PROJECTS;
window.DETAILS = DETAILS;
window.Header = Header;
window.Footer = Footer;
window.Arrow = Arrow;
