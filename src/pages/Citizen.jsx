import { useEffect, useRef, useState } from 'react'
import { Badge, Card, StatCard, go } from '../components/ui'
import PointsExplorer from '../components/PointsExplorer'
import { scanResults, formatDateTime } from '../data/demoData'

const SAMPLE_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
    <rect width="480" height="360" fill="#E8EFE9"/>
    <rect x="205" y="60" width="70" height="40" rx="8" fill="#9BB7A8"/>
    <path d="M215 100h50l22 50v150a14 14 0 0 1-14 14H207a14 14 0 0 1-14-14V150z" fill="#B8D1C3" stroke="#7FA390" stroke-width="4"/>
    <text x="240" y="335" font-family="sans-serif" font-size="18" text-anchor="middle" fill="#4B5D53">Imagen de ejemplo</text>
  </svg>`)

export function CitizenHome({ user, history, stats, onNotify }) {
  const mine = history.filter((h) => h.user === user.name).slice(0, 3)
  return (
    <div className="stack">
      <div>
        <h1>Hola, {user.name.split(' ')[0]} 👋</h1>
        <p className="lead">¿Qué residuo quieres revisar hoy?</p>
      </div>
      <div className="cta">
        <div>
          <strong>Escanear un residuo</strong>
          <p>Toma una foto o elige una imagen y recibe una clasificación simulada.</p>
        </div>
        <button className="btn btn--accent btn--lg" onClick={() => go('/c/scan')}>Escanear residuo</button>
      </div>
      <Card title="Tu actividad" note="Datos de ejemplo. ¡Cada escaneo cuenta para aprender a separar mejor!">
        <div className="stats stats--5">
          <StatCard label="Escaneos totales" value={stats.total} />
          <StatCard label="Este mes" value={stats.month} />
          <StatCard label="Resultados reciclables" value={stats.recyclable} />
          <StatCard label="A revisar / inciertos" value={stats.review} />
          <StatCard label="Puntos vistos" value={stats.pointsViewed} />
        </div>
      </Card>
      <Card title="Escaneos recientes">
        <ul className="list">
          {mine.map((h) => <HistoryRow key={h.id} h={h} />)}
        </ul>
        <button className="btn btn--outline btn--sm" onClick={() => go('/c/history')}>Ver historial completo</button>
      </Card>
      <Card title="Puntos de reciclaje" note="Explora el mapa de puntos de ejemplo; los de Providencia aparecen destacados.">
        <button className="btn btn--outline" onClick={() => go('/c/map')}>Abrir mapa</button>
      </Card>
    </div>
  )
}

function HistoryRow({ h }) {
  return (
    <li className="row-item">
      <div>
        <strong>{h.material}</strong>
        <div className="muted">{formatDateTime(h.date)}{h.isNew ? ' · Nuevo' : ''}</div>
      </div>
      <Badge>{h.status}</Badge>
    </li>
  )
}

export function ScanPage({ onScan }) {
  const [img, setImg] = useState(null) // { url, sample }
  const [loading, setLoading] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    // La imagen solo se previsualiza en el navegador; no se sube ni se guarda.
    setImg({ url: URL.createObjectURL(f), sample: false })
    e.target.value = ''
  }
  const analyze = () => {
    setLoading(true)
    timer.current = setTimeout(() => {
      const result = scanResults[Math.floor(Math.random() * scanResults.length)]
      onScan(result, img?.url ?? SAMPLE_IMG, !img || img.sample)
    }, 1200 + Math.random() * 600)
  }

  return (
    <div className="stack">
      <h1>Escanear residuo</h1>
      <p className="lead">Toma una foto o selecciona una imagen. El análisis es una simulación del prototipo.</p>
      <Card>
        <div className="preview">
          {img ? <img src={img.url} alt={img.sample ? 'Imagen de ejemplo' : 'Vista previa de la imagen seleccionada'} /> : <div className="preview__empty">Aún no has seleccionado una imagen</div>}
          {loading && <div className="preview__loading" role="status"><span className="spinner" />Analizando residuo…</div>}
        </div>
        <div className="row">
          <label className="btn btn--outline">
            Tomar foto
            <input type="file" accept="image/*" capture="environment" onChange={pick} hidden disabled={loading} />
          </label>
          <label className="btn btn--outline">
            Elegir imagen
            <input type="file" accept="image/*" onChange={pick} hidden disabled={loading} />
          </label>
          <button className="btn btn--ghost" onClick={() => setImg({ url: SAMPLE_IMG, sample: true })} disabled={loading}>Usar imagen de ejemplo</button>
        </div>
        <button className="btn btn--primary btn--lg btn--block" onClick={analyze} disabled={loading}>
          {loading ? 'Analizando…' : 'Analizar residuo'}
        </button>
        <p className="small muted">La imagen no se envía ni se guarda en ningún servidor. {img ? '' : 'Si no eliges una imagen, se usará una imagen de ejemplo.'}</p>
      </Card>
    </div>
  )
}

export function ScanResult({ scan, points, onFind, onOpenPoint, onNotify }) {
  const [fb, setFb] = useState(null)
  const { result: r, preview } = scan
  const near = points
    .filter((p) => p.status === 'Active' && p.acceptedMaterialIds.some((id) => r.acceptedMaterialIds.includes(id)))
    .sort((a, b) => (b.municipality === 'Providencia') - (a.municipality === 'Providencia'))
    .slice(0, 3)
  const tone = r.confidence >= 85 ? 'ok' : r.confidence >= 60 ? 'warn' : 'err'

  const feedback = (kind) => {
    setFb(kind)
    onNotify(kind === 'ok' ? 'Gracias por tu opinión (simulada: no se envió nada).' : 'Reporte registrado de forma simulada: no se envió nada.')
  }

  return (
    <div className="stack">
      <h1>Resultado del escaneo</h1>
      <p className="notice">Simulación para fines del prototipo — no es un análisis real de inteligencia artificial.</p>
      <Card>
        <div className="result">
          <img src={preview} alt="Imagen analizada" />
          <div>
            <p className="muted">Categoría probable</p>
            <h2 className="result__mat">{r.material}</h2>
            <p className="muted">{r.category}</p>
            <Badge>{r.resultStatus}</Badge>
          </div>
        </div>
        <div className="confidence">
          <div className="confidence__top"><span>Confianza simulada</span><strong>{r.confidence}%</strong></div>
          <div className={'meter meter--' + tone} role="meter" aria-label="Confianza simulada" aria-valuemin="0" aria-valuemax="100" aria-valuenow={r.confidence}><span style={{ width: r.confidence + '%' }} /></div>
        </div>
      </Card>
      <Card title="Observación de contaminación visible" className={r.visibleContamination ? 'card--warn' : ''}>
        <p><strong>{r.condition}.</strong> {r.contaminationNote}</p>
        <p className="small muted">Una imagen no permite detectar contaminantes ocultos.</p>
      </Card>
      <Card title="Cómo prepararlo" note={r.recommendation}>
        <ol className="instr">{r.instructions.map((i) => <li key={i}>{i}</li>)}</ol>
      </Card>
      <Card title="Puntos de reciclaje sugeridos">
        {near.length === 0 ? (
          <p className="empty">No hay puntos sugeridos para este resultado. Consulta la guía local de disposición.</p>
        ) : (
          <ul className="list">
            {near.map((p) => (
              <li key={p.id} className="row-item">
                <div><strong>{p.name}</strong><div className="muted">{p.municipality} · {p.openingHours}</div></div>
                <button className="btn btn--outline btn--sm" onClick={() => onOpenPoint(p.id)}>Ver punto</button>
              </li>
            ))}
          </ul>
        )}
        <p className="demo-note">Ubicaciones de demostración — no son instalaciones operativas verificadas.</p>
      </Card>
      <Card title="¿Te fue útil este resultado?">
        <div className="row">
          <button className={'btn ' + (fb === 'ok' ? 'btn--primary' : 'btn--outline')} onClick={() => feedback('ok')} aria-pressed={fb === 'ok'}>👍 Útil</button>
          <button className={'btn ' + (fb === 'issue' ? 'btn--primary' : 'btn--outline')} onClick={() => feedback('issue')} aria-pressed={fb === 'issue'}>Reportar un problema</button>
        </div>
        {fb && <p className="confirm" role="status">{fb === 'ok' ? '✓ ¡Gracias! Tu valoración quedó registrada solo en esta demo.' : '✓ Tu reporte quedó registrado solo en esta demo. No se envió a ningún servidor.'}</p>}
      </Card>
      <div className="row">
        <button className="btn btn--primary" onClick={() => onFind(r.acceptedMaterialIds[0])}>Encontrar un punto de reciclaje</button>
        <button className="btn btn--outline" onClick={() => go('/c/scan')}>Escanear otro objeto</button>
      </div>
    </div>
  )
}

export function ScanHistory({ user, history }) {
  const mine = history.filter((h) => h.user === user.name)
  return (
    <div className="stack">
      <h1>Historial de escaneos</h1>
      <DemoNoteLine />
      <Card>
        <ul className="list">
          {mine.map((h) => (
            <li key={h.id} className="row-item">
              <div>
                <strong>{h.material}</strong>
                <div className="muted">{formatDateTime(h.date)} · Confianza simulada {h.confidence}%{h.isNew ? ' · Nuevo' : ''}</div>
              </div>
              <Badge>{h.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
      <button className="btn btn--primary" onClick={() => go('/c/scan')}>Escanear residuo</button>
    </div>
  )
}
const DemoNoteLine = () => <p className="demo-note">Historial de ejemplo; los escaneos nuevos se guardan solo mientras dure esta sesión.</p>

export function CitizenMap({ points, focus, onView }) {
  return (
    <div className="stack">
      <h1>Puntos de reciclaje</h1>
      <p className="lead">Filtra por material y revisa horarios y materiales aceptados. Los puntos de Providencia aparecen destacados.</p>
      <PointsExplorer points={points} emphasize="Providencia" focus={focus} onView={onView} />
    </div>
  )
}
