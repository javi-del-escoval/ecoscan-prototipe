import { Wordmark, Badge } from '../components/ui'
import { users } from '../data/demoData'

export default function Demo({ onSelect }) {
  return (
    <div className="demo">
      <header className="lp-head"><Wordmark /><a className="btn btn--ghost btn--sm" href="#/">Volver al inicio</a></header>
      <div className="demo__body">
        <h1>Elige un perfil de demostración</h1>
        <p className="lead">No se requiere contraseña. Son identidades ficticias para explorar cada experiencia; puedes cambiar de perfil en cualquier momento.</p>
        <div className="demo__cards">
          {Object.values(users).map((u) => (
            <article key={u.id} className="card usercard">
              <Badge tone="ok">{u.roleLabel}</Badge>
              <h2>{u.name}</h2>
              <p className="muted">{u.email}</p>
              <p>{u.blurb}</p>
              <button className="btn btn--primary" onClick={() => onSelect(u.id)}>Continuar como {u.name}</button>
            </article>
          ))}
        </div>
        <p className="demo-note">Prototipo con datos de ejemplo. Estos correos no corresponden a cuentas reales.</p>
      </div>
    </div>
  )
}
