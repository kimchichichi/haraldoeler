// Shared detail view for projekte subpages (bundled per project id).
function ProjektDetail({ id, onBack }) {
  const proj = PROJECTS.find((p) => p.id === id);
  const detail = DETAILS[id] || {
    title: proj.title,
    eyebrow: `Projekt ${proj.num} · ${proj.role}`,
    image: proj.image,
    runtime: ["Programmlänge · 60–90 min", "Besetzung · auf Anfrage", "Verfügbar · 2026 / 2027"],
    lede: [proj.subtitle.split("—")[0] || proj.subtitle],
    body: [
      proj.subtitle +
        " Ausführliche Programminformationen, Besetzungen und technische Anforderungen werden auf Anfrage bereitgestellt.",
      "Konzerte in Konzertsälen, Kirchen und Festivals — Programmgestaltung individuell mit dem Veranstalter.",
    ],
    repertoire: [{ num: "I.", work: "Programm", note: "auf Anfrage", dur: "—" }],
    quotes: [
      {
        text: "Ein Klangkosmos, in dem Stille und Atem ebenso wichtig werden wie die Töne selbst.",
        cite: "Süddeutsche Zeitung",
      },
    ],
  };

  return (
    <div className="detail">
      <Header active="projekte" />
      <a
        className="back-link"
        href="/projekte"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
      >
        <Arrow dir="left" /> zurück zu projekte
      </a>
      <section className="hero" style={{ viewTransitionName: `image-${id}` }}>
        <img src={detail.image} alt={detail.title} />
        <div className="hero-meta">
          <div>
            <div className="eyebrow">{detail.eyebrow}</div>
            <h1 style={{ viewTransitionName: `title-${id}` }}>{detail.title}</h1>
          </div>
          <div className="runtime">
            {detail.runtime.map((r, i) => (
              <div key={i}>{r}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="detail-body">
        <aside>
          <dl>
            <dt>Format</dt>
            <dd>{proj.role}</dd>
            <dt>Dauer</dt>
            <dd>60–90 min</dd>
            <dt>Sprache</dt>
            <dd>instrumental</dd>
            <dt>Erste Aufführung</dt>
            <dd>München · 2024</dd>
            <dt>Tour</dt>
            <dd></dd>
          </dl>
        </aside>

        <div>
          <p className="lede">
            {detail.lede.map((part, i) =>
              typeof part === "string" ? (
                <React.Fragment key={i}>{part}</React.Fragment>
              ) : (
                <em key={i}>{part.em}</em>
              )
            )}
          </p>
          <div className="body-copy">
            {detail.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="repertoire">
            <h3>— Auswahl Repertoire</h3>
            <ul>
              {detail.repertoire.map((r, i) => (
                <li key={i}>
                  <span className="num">{r.num}</span>
                  <span className="work">
                    {r.work}
                    <em>{r.note}</em>
                  </span>
                  <span className="dur">{r.dur}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="quotes">
            {detail.quotes.map((q, i) => (
              <blockquote key={i} className="quote">
                {q.text}
                <cite>— {q.cite}</cite>
              </blockquote>
            ))}
          </div>

          {detail.media && detail.media.length > 0 && (
            <div className="media">
              <h3>— Hören & sehen</h3>
              <div className="media-grid">
                {detail.media.map((m, i) => (
                  <figure key={i} className={`media-item ${m.kind}`}>
                    <div className="frame">
                      {m.kind === "youtube" ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${m.id}`}
                          title={m.caption}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <iframe
                          src={m.url}
                          title={m.caption}
                          loading="lazy"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                    <figcaption>{m.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
