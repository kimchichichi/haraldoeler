// Main app — projekte overview + detail with View Transitions
const { useState, useEffect, useCallback } = React;

function ProjekteOverview({ tweaks }) {
  return (
    <>
      <Header active="projekte" />
      <section className="page-head">
        <div>
          <div className="eyebrow">— Projekte · 2026</div>
          <h1 className="page-title">{tweaks.italicTitle ? <em>projekte</em> : "projekte"}</h1>
        </div>
        <div className="page-meta">
          <div><b>06</b> · laufende programme</div>
          <div>solo · duo · trio · orchester</div>
          <div>booking · 2026 / 2027</div>
        </div>
      </section>

      <section className="projects">
        {PROJECTS.map((p) => (
          <a
            key={p.id}
            className={`card ${p.variant}`}
            style={{ "--vt-name": `card-${p.id}` }}
            href={`/projekte/${p.id}`}
          >
            <div className="index">
              <span>{p.num}</span>
              <span className="role">{p.role}</span>
            </div>
            <div className="image-wrap" style={{ viewTransitionName: `image-${p.id}` }}>
              <img src={p.image} alt={p.title} loading="lazy" />
            </div>
            <div className="meta">
              <h2 style={{ viewTransitionName: `title-${p.id}` }}>{p.title}</h2>
            </div>
            <p className="subtitle">{p.subtitle}</p>
            <span className="arrow">
              mehr infos <Arrow />
            </span>
          </a>
        ))}
      </section>

      <Footer />
    </>
  );
}

function ProjektDetail({ id, onBack }) {
  const proj = PROJECTS.find(p => p.id === id);
  const detail = DETAILS[id] || {
    title: proj.title,
    eyebrow: `Projekt ${proj.num} · ${proj.role}`,
    image: proj.image,
    runtime: ["Programmlänge · 60–90 min", "Besetzung · auf Anfrage", "Verfügbar · 2026 / 2027"],
    lede: [proj.subtitle.split("—")[0] || proj.subtitle],
    body: [
      proj.subtitle + " Ausführliche Programminformationen, Besetzungen und technische Anforderungen werden auf Anfrage bereitgestellt.",
      "Konzerte in Konzertsälen, Kirchen und Festivals — Programmgestaltung individuell mit dem Veranstalter.",
    ],
    repertoire: [
      { num: "I.", work: "Programm", note: "auf Anfrage", dur: "—" },
    ],
    quotes: [
      { text: "Ein Klangkosmos, in dem Stille und Atem ebenso wichtig werden wie die Töne selbst.", cite: "Süddeutsche Zeitung" },
    ],
  };

  return (
    <div className="detail">
      <Header active="projekte" />
      <a className="back-link" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
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
            {detail.runtime.map((r, i) => <div key={i}>{r}</div>)}
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
              typeof part === "string"
                ? <React.Fragment key={i}>{part}</React.Fragment>
                : <em key={i}>{part.em}</em>
            )}
          </p>
          <div className="body-copy">
            {detail.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="repertoire">
            <h3>— Auswahl Repertoire</h3>
            <ul>
              {detail.repertoire.map((r, i) => (
                <li key={i}>
                  <span className="num">{r.num}</span>
                  <span className="work">{r.work}<em>{r.note}</em></span>
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

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "darkMode": false,
  "italicTitle": false,
  "accent": "#6b1d1a"
}/*EDITMODE-END*/;

function App() {
  const [view, setView] = useState({ page: "overview", id: null });
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to the document
  useEffect(() => {
    document.body.classList.toggle("dark", tweaks.darkMode);
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks.darkMode, tweaks.accent]);

  const navigate = useCallback((next) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        return new Promise((resolve) => {
          setView(next);
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
      });
    } else {
      setView(next);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const open = (id) => navigate({ page: "detail", id });
  const back = () => navigate({ page: "overview", id: null });

  return (
    <>
      {view.page === "overview"
        ? <ProjekteOverview tweaks={tweaks} />
        : <ProjektDetail id={view.id} onBack={back} />}

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={tweaks.darkMode} onChange={(v) => setTweak("darkMode", v)} />
        <TweakToggle label="Italic title" value={tweaks.italicTitle} onChange={(v) => setTweak("italicTitle", v)} />
        <TweakSection label="Accent color" />
        <TweakColor label="Accent" value={tweaks.accent} onChange={(v) => setTweak("accent", v)} />
        <TweakSelect
          label="Preset"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
          options={[
            { label: "Oxblood", value: "#6b1d1a" },
            { label: "Ink", value: "#0e0d0c" },
            { label: "Sage", value: "#3a4a3c" },
            { label: "Mustard", value: "#a07a16" },
          ]}
        />
        <TweakSection label="Navigation" />
        <TweakSelect
          label="Open"
          value={view.page === "detail" ? view.id : ""}
          onChange={(v) => v ? open(v) : back()}
          options={[
            { label: "— Overview —", value: "" },
            ...PROJECTS.map(p => ({ label: p.title, value: p.id })),
          ]}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
