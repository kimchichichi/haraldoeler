// Project data + small components
const PROJECTS = [
  {
    id: "solo",
    num: "01",
    title: "Solo",
    role: "Akkordeon — solo",
    subtitle: "Einzigartige Akkordeonmusik der Klassik, Neuen Musik und des Jazz.",
    image: "p1.jpg",
    variant: "tall",
  },
  {
    id: "orchester",
    num: "02",
    title: "Orchester",
    role: "Akkordeon + Orchester",
    subtitle: "Solistisches Repertoire mit Sinfonie- und Kammerorchester.",
    image: "p5.jpg",
    variant: "wide",
  },
  {
    id: "fussissimo",
    num: "03",
    title: "Fussissimo",
    role: "Trio — gypsy · ethno · jazz",
    subtitle: "Gypsy-Ethno-Jazz Ensemble — drei Stimmen, ein gemeinsamer Atem.",
    image: "p2.jpg",
    variant: "default",
  },
  {
    id: "duovia",
    num: "04",
    title: "Duo ViA!",
    role: "Akkordeon & Violine",
    subtitle: "Transkriptionen aus vier Jahrhunderten — Bach bis heute.",
    image: "p4.jpg",
    variant: "default",
  },
  {
    id: "duoklakk",
    num: "05",
    title: "Duo KlAkk!",
    role: "neue musik × alte musik",
    subtitle: "Resonanzen zwischen Neuer und Alter Musik.",
    image: "p6.jpg",
    variant: "tall",
  },
  {
    id: "hof",
    num: "06",
    title: "Hofer Musikscene",
    role: "Lokales · regional",
    subtitle: "Projekte und Begegnungen im Hofer Land.",
    image: "p2.jpg",
    variant: "wide",
  },
];

const DETAILS = {
  solo: {
    title: "Solo",
    eyebrow: "Projekt 01 · Akkordeon solo",
    image: "p1.jpg",
    runtime: ["Programm · »Remembering«", "Besetzung · Akkordeon solo", "Album · Pictures at an Exhibition"],
    lede: ["Die Präzision des Klaviers. Die Sogkraft des Orchesters. ", { em: "Eine Stimme." }],
    body: [
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
    image: "p5.jpg",
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
    image: "p2.jpg",
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
  },
  duovia: {
    title: "Duo ViA!",
    eyebrow: "Projekt 04 · Akkordeon & Violine",
    image: "p4.jpg",
    runtime: ["Sinn Yang · Violine", "Harald Oeler · Akkordeon", "Album · 8 Jahreszeiten · OehmsClassics"],
    lede: ["Vivaldi & Piazzolla — ", { em: "ein kühnes Wagnis" }, " der Harmonie und der Erfindung."],
    body: [
      "Neue Klangwelten entdecken — ein Ziel, das sich mit der außergewöhnlichen Besetzung aus Violine und Akkordeon spielerisch erreichen lässt.",
      "Duo ViA!s CD der »8 Jahreszeiten« von Vivaldi und Piazzolla erschien 2014 bei OehmsClassics und erhielt begeisterte Kritiken. Mit Neugierde und Experimentierlust erkunden beide Künstler in ihrer exotischen Besetzung Meisterwerke der zeitgenössischen Musik, Bach, Chick Corea u.a. und traten erfolgreich auf — beim Heidelberger Frühling, in Berlin, München, Bracciano / Italien und Helsinki.",
      "The Duo made their debut in 2009 with the programme »Seasons« at the Heidelberg Spring Festival — a sold-out hall, Vivaldi's Quattro Stagioni in combination with Piazzolla's Cuatro Estaciones Porteñas.",
    ],
    repertoire: [
      { type: "chapter", num: "01", work: "Piazzolla – Primavera Porteño", season: "FRÜHLING", dur: "05:24" },
      { type: "group",    work: "Vivaldi – L'Estate" },
      { type: "movement", num: "02", work: "I. Allegro non molto", dur: "05:13" },
      { type: "movement", num: "03", work: "II. Adagio", dur: "02:07" },
      { type: "movement", num: "04", work: "III. Presto", dur: "02:54" },
      { type: "chapter", num: "05", work: "Piazzolla – Otoño Porteño", season: "HERBST", dur: "05:54" },
      { type: "group",    work: "Vivaldi – L'Inverno" },
      { type: "movement", num: "06", work: "I. Allegro non molto", dur: "03:18" },
      { type: "movement", num: "07", work: "II. Largo", dur: "02:08" },
      { type: "movement", num: "08", work: "III. Allegro", dur: "03:33" },
      { type: "group",    work: "Vivaldi – La Primavera" },
      { type: "movement", num: "09", work: "I. Allegro", dur: "03:21" },
      { type: "movement", num: "10", work: "II. Largo", dur: "02:19" },
      { type: "movement", num: "11", work: "III. Allegro", dur: "04:07" },
      { type: "chapter", num: "12", work: "Piazzolla – Verano Porteño", season: "SOMMER", dur: "06:35" },
      { type: "group",    work: "Vivaldi – L'Autunno" },
      { type: "movement", num: "13", work: "I. Allegro", dur: "05:34" },
      { type: "movement", num: "14", work: "II. Adagio molto", dur: "02:30" },
      { type: "movement", num: "15", work: "III. Allegro", dur: "03:07" },
      { type: "chapter", num: "16", work: "Piazzolla – Invierno Porteño", season: "WINTER", dur: "07:11" },
      { type: "total", dur: "01:05:15" },
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
    image: "p6.jpg",
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
    image: "p2.jpg",
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
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#">
          HARALD<span className="dot"></span>OELER
          {" "}<small>· accordionist</small>
        </a>
        <nav className="primary">
          {["about","projekte","termine","news","unterricht","discographie","media","kontakt"].map(item => (
            <a key={item} href="#" className={active === item ? "active" : ""}>{item}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="left">© Harald Oeler · 2026</div>
      <div className="right">Impressum · Datenschutz</div>
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
