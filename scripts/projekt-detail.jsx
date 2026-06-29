// Shared detail view for projekte subpages (bundled per project id).
function ProjektDetail({ id, onBack }) {
  const [activeTrack, setActiveTrack] = React.useState(null);
  const playTrack = (id) => { try { flushSync(() => setActiveTrack(id)); } catch(e) { setActiveTrack(id); } };
  const proj = PROJECTS.find((p) => p.id === id);

  const modalKey = activeTrack && String(activeTrack).startsWith("rep-") ? activeTrack : null;
  React.useEffect(() => {
    if (!modalKey) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveTrack(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalKey]);
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
            {detail.repertoire[0] && detail.repertoire[0].tracks ? (
              /* Grouped layout (duovia) */
              <div className="rep-groups">
                {detail.repertoire.map((group, gi) => {
                  const isSingle = group.tracks.length === 1;
                  const singleTrack = isSingle ? group.tracks[0] : null;
                  const singleActive = singleTrack && activeTrack === singleTrack.spotifyId;
                  return (
                    <div key={gi} className={"rep-group" + (group.composer === "Piazzolla" ? " piazzolla" : " vivaldi")}>
                      {isSingle ? (
                        <div
                          className={"rep-group-header single" + (singleActive ? " active" : "")}
                          onClick={() => setActiveTrack(singleActive ? null : singleTrack.spotifyId)}
                          role="button"
                        >
                          <span className="play-btn">
                            {singleActive
                              ? <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="4" height="10"/><rect x="6" y="0" width="4" height="10"/></svg>
                              : <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor"><polygon points="0,0 9,5 0,10"/></svg>
                            }
                          </span>
                          <span className="rep-meta">
                            <span className="rep-composer">{group.composer}</span>
                            <span className="rep-work">{group.work}</span>
                          </span>
                          <span className="rep-season">{group.season}</span>
                          <span className="dur">{singleTrack.dur}</span>
                        </div>
                      ) : (
                        <div className="rep-group-header multi">
                          <span className="rep-meta">
                            <span className="rep-composer">{group.composer}</span>
                            <span className="rep-work">{group.work}</span>
                          </span>
                          <span className="rep-season">{group.season}</span>
                        </div>
                      )}
                      {singleActive && (
                        <div className="spotify-preview" onClick={e => e.stopPropagation()}>
                          <iframe src={`https://open.spotify.com/embed/track/${singleTrack.spotifyId}?utm_source=generator&theme=0&autoplay=1`}
                            width="100%" height="80" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy" title={`${group.composer} – ${group.work}`} />
                        </div>
                      )}
                      {!isSingle && (
                        <ul className="rep-movements">
                          {group.tracks.map((t, ti) => {
                            const isActive = activeTrack === t.spotifyId;
                            return (
                              <li key={ti} className={isActive ? "active" : ""} onClick={() => setActiveTrack(isActive ? null : t.spotifyId)}>
                                <span className="play-btn">
                                  {isActive
                                    ? <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="4" height="10"/><rect x="6" y="0" width="4" height="10"/></svg>
                                    : <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor"><polygon points="0,0 9,5 0,10"/></svg>
                                  }
                                </span>
                                <span className="track-num">{t.num}</span>
                                <span className="movement">{t.movement}</span>
                                <span className="dur">{t.dur}</span>
                                {isActive && (
                                  <div className="spotify-preview" onClick={e => e.stopPropagation()}>
                                    <iframe src={`https://open.spotify.com/embed/track/${t.spotifyId}?utm_source=generator&theme=0&autoplay=1`}
                                      width="100%" height="80" frameBorder="0"
                                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                      loading="lazy" title={`${group.work} – ${t.movement}`} />
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Flat layout (all other projects) */
              <ul>
                {detail.repertoire.map((r, i) => {
                  if (r.embed) {
                    const key = `rep-${i}`;
                    const isOpen = activeTrack === key;
                    return (
                      <li key={i} className={r.className || undefined}>
                        <button
                          type="button"
                          className="repertoire-row-link"
                          aria-expanded={isOpen}
                          onClick={() => setActiveTrack(isOpen ? null : key)}
                        >
                          <span className="num">{r.num}</span>
                          <span className="work">
                            {r.work}
                            {r.note ? <em>{r.note}</em> : null}
                            <span className="rep-play">▶ Hörbeispiel</span>
                          </span>
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className={r.className || undefined}>
                      <span className="num">{r.num}</span>
                      <span className="work">{r.work}{r.note ? <em>{r.note}</em> : null}</span>
                      <span className="dur">{r.dur}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="quotes">
            {detail.quotes.map((q, i) => (
              <blockquote key={i} className="quote">
                {q.text}
                <cite>— {q.cite}</cite>
              </blockquote>
            ))}
          </div>

          {detail.termine && detail.termine.length > 0 && (
            <div className="termine">
              <h3>— Nächste Konzerte</h3>
              <ul className="termine-list">
                {detail.termine.map((t, i) => (
                  <li key={i} className="termin-item">
                    <div className="termin-date">{t.date}{t.time ? <span className="termin-time"> · {t.time}</span> : null}</div>
                    <div className="termin-info">
                      <span className="termin-title">{t.title}</span>
                      {(t.venue || t.city) && (
                        <span className="termin-venue">{[t.venue, t.city].filter(Boolean).join(" · ")}</span>
                      )}
                      {t.note && <span className="termin-note">{t.note}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

      {(() => {
        if (!modalKey) return null;
        const idx = parseInt(String(modalKey).slice(4), 10);
        const r = detail.repertoire[idx];
        if (!r || !r.embed) return null;
        return (
          <div className="rep-modal" onClick={() => setActiveTrack(null)} role="dialog" aria-modal="true">
            <button
              type="button"
              className="rep-modal-close"
              aria-label="Hörbeispiel schließen"
              onClick={() => setActiveTrack(null)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><line x1="1" y1="1" x2="15" y2="15"/><line x1="15" y1="1" x2="1" y2="15"/></svg>
            </button>
            <div className={"rep-modal-inner " + r.embed.type} onClick={(e) => e.stopPropagation()}>
              {r.embed.type === "instagram" && (
                <iframe
                  src={`https://www.instagram.com/reel/${r.embed.id}/embed`}
                  title={`${r.work} — Hörbeispiel`}
                  loading="lazy"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
              {r.embed.type === "spotify" && (
                <iframe
                  src={`https://open.spotify.com/embed/${r.embed.media || "track"}/${r.embed.id}?utm_source=generator&theme=0`}
                  title={`${r.work} — Hörbeispiel`}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        );
      })()}

      <Footer />
    </div>
  );
}
