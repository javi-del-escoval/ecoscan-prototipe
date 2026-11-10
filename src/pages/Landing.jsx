import { Wordmark, go } from '../components/ui'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const steps = [
  ['Escanea', 'Toma una fotografía del residuo o selecciona una imagen desde tu dispositivo.'],
  ['Aprende', 'Conoce su clasificación probable, las condiciones de preparación y posibles indicios visibles de contaminación.'],
  ['Encuentra dónde reciclar', 'Consulta puntos de reciclaje y revisa qué materiales reciben.'],
]
const features = [
  ['Identificación visual', 'Obtén una clasificación probable del material a partir de una imagen.'],
  ['Orientación práctica', 'Revisa cómo vaciar, limpiar o preparar un residuo antes de entregarlo.'],
  ['Alertas visibles', 'Identifica posibles restos o manchas visibles. Una imagen no permite detectar contaminantes ocultos.'],
  ['Puntos de reciclaje', 'Consulta ubicaciones, horarios y materiales aceptados según la información disponible.'],
]

export default function Landing({ canInstall, onInstall }) {
  return (
    <div className="landing">
      <header className="lp-head">
        <Wordmark />
        <nav aria-label="Secciones">
          <button className="linkbtn" onClick={() => scrollTo('como')}>Cómo funciona</button>
          <button className="linkbtn" onClick={() => scrollTo('puntos')}>Puntos de reciclaje</button>
          <button className="linkbtn" onClick={() => scrollTo('sobre')}>Sobre EcoScan</button>
        </nav>
        <div className="row">
          {canInstall && <button className="btn btn--ghost btn--sm" onClick={onInstall}>Instalar app</button>}
          <button className="btn btn--primary btn--sm" onClick={() => go('/demo')}>Explorar demo</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero__text">
          <h1>Reciclar mejor empieza por identificar correctamente.</h1>
          <p className="lead">EcoScan te ayuda a reconocer residuos, conocer cómo prepararlos para su reciclaje y encontrar puntos de recepción cercanos.</p>
          <div className="row">
            <button className="btn btn--primary btn--lg" onClick={() => go('/demo')}>Explorar demo</button>
            <button className="btn btn--outline btn--lg" onClick={() => scrollTo('como')}>Cómo funciona</button>
          </div>
          <p className="small">Prototipo demostrativo. Las identificaciones y ubicaciones mostradas son datos de ejemplo.</p>
        </div>
        <div className="hero__card" aria-hidden="true">
          <div className="mock">
            <div className="mock__img">♺</div>
            <strong>Plástico PET</strong>
            <div className="mock__meter"><span style={{ width: '96%' }} /></div>
            <small>Confianza simulada 96%</small>
            <span className="badge badge--ok">Reciclable</span>
            <small className="muted">Ejemplo ilustrativo</small>
          </div>
        </div>
      </section>

      <section id="como" className="section">
        <h2>Una decisión más simple en tres pasos</h2>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t}><span className="steps__n">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
      </section>

      <section id="puntos" className="section section--alt">
        <h2>Información útil antes de desechar</h2>
        <div className="features">
          {features.map(([t, d]) => (
            <div key={t} className="feature"><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section id="sobre" className="section">
        <div className="impact">
          <h2>Pequeñas decisiones que pueden mejorar la separación</h2>
          <p>Una separación adecuada desde el origen puede facilitar la recuperación de materiales y reducir errores en las etapas posteriores de gestión. EcoScan busca apoyar esa primera decisión con información clara y accesible.</p>
          <button className="btn btn--primary" onClick={() => go('/demo')}>Explorar demo</button>
        </div>
      </section>

      <footer className="lp-foot">
        <strong>EcoScan — Prototipo académico de demostración.</strong>
        <p>Las funciones, resultados de escaneo, estadísticas y ubicaciones de esta versión son simulados. No representan un servicio operativo ni información municipal validada.</p>
      </footer>
    </div>
  )
}
