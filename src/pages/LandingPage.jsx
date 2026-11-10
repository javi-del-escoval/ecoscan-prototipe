export default function LandingPage({ onExplore, canInstall, onInstall }) {
  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <header className="landing-header">
        <a className="wordmark" href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img src="/icons/icon.svg" alt="" /> EcoScan
        </a>
        <nav className="landing-nav" aria-label="Principal">
          <a href="#como-funciona" onClick={go("como-funciona")}>Cómo funciona</a>
          <a href="#puntos" onClick={go("puntos")}>Puntos de reciclaje</a>
          <a href="#sobre" onClick={go("sobre")}>Sobre EcoScan</a>
        </nav>
        <div className="row">
          {canInstall && <button className="btn secondary small" onClick={onInstall}>Instalar app</button>}
          <button className="btn small" onClick={onExplore}>Explorar demo</button>
        </div>
      </header>

      <section className="hero">
        <div className="section">
          <h1>Reciclar mejor empieza por identificar correctamente.</h1>
          <p>EcoScan te ayuda a reconocer residuos, conocer cómo prepararlos para su reciclaje y encontrar puntos de recepción cercanos.</p>
          <div className="row">
            <button className="btn lg" onClick={onExplore}>Explorar demo</button>
            <button className="btn lg secondary" onClick={go("como-funciona")}>Cómo funciona</button>
          </div>
          <p className="disc">Prototipo demostrativo. Las identificaciones y ubicaciones mostradas son datos de ejemplo.</p>
        </div>
      </section>

      <section id="como-funciona" className="section">
        <h2>Una decisión más simple en tres pasos</h2>
        <div className="grid cols-3" style={{ marginTop: "1.25rem" }}>
          <div className="card"><div className="step-num">1</div><h3>Escanea</h3><p>Toma una fotografía del residuo o selecciona una imagen desde tu dispositivo.</p></div>
          <div className="card"><div className="step-num">2</div><h3>Aprende</h3><p>Conoce su clasificación probable, las condiciones de preparación y posibles indicios visibles de contaminación.</p></div>
          <div className="card"><div className="step-num">3</div><h3>Encuentra dónde reciclar</h3><p>Consulta puntos de reciclaje y revisa qué materiales reciben.</p></div>
        </div>
      </section>

      <div className="alt" id="puntos">
        <section className="section">
          <h2>Información útil antes de desechar</h2>
          <div className="grid cols-2" style={{ marginTop: "1.25rem" }}>
            <div className="card"><h3>Identificación visual</h3><p>Obtén una clasificación probable del material a partir de una imagen.</p></div>
            <div className="card"><h3>Orientación práctica</h3><p>Revisa cómo vaciar, limpiar o preparar un residuo antes de entregarlo.</p></div>
            <div className="card"><h3>Alertas visibles</h3><p>Identifica posibles restos o manchas visibles. Una imagen no permite detectar contaminantes ocultos.</p></div>
            <div className="card"><h3>Puntos de reciclaje</h3><p>Consulta ubicaciones, horarios y materiales aceptados según la información disponible.</p></div>
          </div>
        </section>
      </div>

      <section id="sobre" className="section">
        <h2>Pequeñas decisiones que pueden mejorar la separación</h2>
        <p style={{ maxWidth: "65ch" }}>
          Una separación adecuada desde el origen puede facilitar la recuperación de materiales y reducir errores en las etapas posteriores de gestión. EcoScan busca apoyar esa primera decisión con información clara y accesible.
        </p>
        <button className="btn" onClick={onExplore}>Explorar demo</button>
      </section>

      <footer className="landing-footer">
        <div>
          <p><strong>EcoScan — Prototipo académico de demostración.</strong></p>
          <p>Las funciones, resultados de escaneo, estadísticas y ubicaciones de esta versión son simulados. No representan un servicio operativo ni información municipal validada.</p>
        </div>
      </footer>
    </div>
  );
}
