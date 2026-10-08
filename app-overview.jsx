// Slim projekte overview — no detail views, no tweaks panel, no DETAILS payload.

function ProjekteOverview() {
  return (
    <>
      <Header active="projekte" />
      <section className="page-head">
        <div>
          <div className="eyebrow">— Projekte · 2026</div>
          <h1 className="page-title">projekte</h1>
        </div>
        <div className="page-meta">
          <div><b>06</b> · laufende programme</div>
          <div>solo · duo · trio · orchester</div>
          <div>booking · 2026 / 2027</div>
        </div>
      </section>

      <section className="projects">
        {PROJECTS.map((p, i) => {
          const base = p.image.replace(/\.webp$/i, "");
          const w = p.variant === "tall" ? 600 : 900;
          const h = p.variant === "tall" ? 900 : 600;
          return (
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
                <img
                  src={p.image}
                  srcSet={`${base}-640.webp 640w, ${p.image} ${w}w`}
                  sizes="(max-width: 720px) 92vw, (max-width: 1100px) 45vw, 420px"
                  width={w}
                  height={h}
                  alt={p.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                />
              </div>
              <div className="meta">
                <h2 style={{ viewTransitionName: `title-${p.id}` }}>{p.title}</h2>
              </div>
              <p className="subtitle">{p.subtitle}</p>
              <span className="arrow">
                mehr infos <Arrow />
              </span>
            </a>
          );
        })}
      </section>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProjekteOverview />);
