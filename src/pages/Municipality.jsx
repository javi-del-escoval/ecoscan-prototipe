import { Badge, BarList, Card, DemoNote, LineChart, StackedBar, StatCard } from '../components/ui'
import PointsExplorer from '../components/PointsExplorer'
import { STATUS_LABEL, formatDateTime, providenciaStats, adminStats } from '../data/demoData'

const STATUS_PARTS = (s) => [
  { label: 'Reciclable', value: s.recyclable, color: '#176B4D' },
  { label: 'A revisar', value: s.review, color: '#D99A32' },
  { label: 'Incierto', value: s.uncertain, color: '#C94B45' },
]

export function ActivityList({ items, limit }) {
  const rows = limit ? items.slice(0, limit) : items
  if (!rows.length) return <p className="empty">Sin actividad de ejemplo para mostrar.</p>
  return (
    <ul className="list">
      {rows.map((h) => (
        <li key={h.id} className="row-item">
          <div>
            <strong>{h.material}</strong>
            <div className="muted">{formatDateTime(h.date)} · {h.user} · Confianza simulada {h.confidence}%</div>
          </div>
          <Badge>{h.status}</Badge>
        </li>
      ))}
    </ul>
  )
}

// Detalle de una municipalidad. Providencia tiene estadísticas completas; las demás solo cifras básicas.
export function MunicipalityDashboard({ name, points, history, extra, admin }) {
  const full = name === 'Providencia'
  const base = full ? providenciaStats : null
  const basic = adminStats.municipalities.find((m) => m.name === name)
  const mine = points.filter((p) => p.municipality === name)
  const feed = history.filter((h) => h.municipality === name)
  const total = (base ? base.totalScans : basic.scans) + extra
  const month = base ? base.scansMonth + extra : null
  const trend = base ? base.trend.map(([m, v], i, a) => (i === a.length - 1 ? [m, v + extra] : [m, v])) : null

  return (
    <div className="stack">
      {admin && <a className="back" href="#/a/municipalities">← Volver a municipalidades</a>}
      <div className="banner">
        <div>
          <p className="banner__kicker">{admin ? 'Detalle de municipalidad' : 'Vista municipal'}</p>
          <h1>Municipalidad de {name}</h1>
          <p>{admin ? 'Datos de ejemplo de esta municipalidad.' : 'Solo ves información de tu municipalidad (datos de ejemplo).'}</p>
        </div>
      </div>
      <DemoNote />
      <div className="stats">
        <StatCard label="Escaneos en la municipalidad" value={total} sub="Registros de ejemplo" />
        {full && <StatCard label="Escaneos este mes" value={month} sub="Noviembre 2026" />}
        <StatCard label="Puntos activos" value={base ? base.activePoints : basic.activePoints} sub="Cifra de ejemplo" />
        <StatCard label="Puntos en el catálogo" value={mine.length} sub={`${mine.filter((p) => p.status === 'Active').length} activos en el catálogo de muestra`} />
        {full && <StatCard label="Ciudadanía participante" value={base.citizens} sub="Usuarios de ejemplo" />}
      </div>
      {full ? (
        <div className="grid-cards">
          <Card title="Tendencia mensual de escaneos" note="Datos de ejemplo"><LineChart data={trend} /></Card>
          <Card title="Distribución por material" note="Datos de ejemplo"><BarList items={base.materials} /></Card>
          <Card title="Resultados de escaneo" note="Resultados simulados"><StackedBar parts={STATUS_PARTS(base)} /></Card>
          <Card title="Actividad reciente"><ActivityList items={feed} limit={5} /></Card>
        </div>
      ) : (
        <div className="grid-cards">
          <Card title="Estadísticas detalladas" note="En esta demo solo Providencia cuenta con estadísticas detalladas de ejemplo." />
          <Card title="Actividad reciente"><ActivityList items={feed} limit={5} /></Card>
        </div>
      )}
      <Card title="Puntos de la municipalidad">
        {mine.length === 0 ? <p className="empty">Sin puntos en el catálogo.</p> : (
          <ul className="list">
            {mine.map((p) => (
              <li key={p.id} className="row-item"><div><strong>{p.name}</strong><div className="muted">{p.openingHours}</div></div><Badge>{p.status}</Badge></li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export function MunicipalityPoints({ points, onEdit, onView }) {
  const statusCount = Object.keys(STATUS_LABEL).map((s) => `${STATUS_LABEL[s]}: ${points.filter((p) => p.status === s).length}`).join(' · ')
  return (
    <div className="stack">
      <h1>Puntos de reciclaje · Providencia</h1>
      <p className="lead">{statusCount}. Selecciona un punto para ver su detalle y editar horario, materiales y estado.</p>
      <PointsExplorer points={points} lockMunicipality="Providencia" canEdit onEdit={onEdit} onView={onView} />
    </div>
  )
}

export function MunicipalityActivity({ history }) {
  const feed = history.filter((h) => h.municipality === 'Providencia')
  return (
    <div className="stack">
      <h1>Actividad reciente · Providencia</h1>
      <DemoNote>Escaneos de ejemplo; los nuevos escaneos de esta sesión aparecen aquí.</DemoNote>
      <Card><ActivityList items={feed} /></Card>
    </div>
  )
}
