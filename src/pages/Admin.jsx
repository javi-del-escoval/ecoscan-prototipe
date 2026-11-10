import { useMemo, useState } from 'react'
import { Badge, BarList, Card, DemoNote, LineChart, StackedBar, StatCard } from '../components/ui'
import { acceptableMaterials, adminStats, formatDate, formatDateTime, materialName } from '../data/demoData'

export function AdminDashboard({ points, extra }) {
  const s = adminStats
  const trend = s.trend.map(([m, v], i, a) => (i === a.length - 1 ? [m, v + extra] : [m, v]))
  const cat = (st) => points.filter((p) => p.status === st).length
  return (
    <div className="stack">
      <h1>Panel global</h1>
      <DemoNote />
      <div className="stats stats--4">
        <StatCard label="Escaneos totales" value={s.totalScans + extra} sub="Registros de ejemplo" />
        <StatCard label="Escaneos este mes" value={s.scansMonth + extra} sub="Noviembre 2026" />
        <StatCard label="Puntos activos" value={s.activePoints} sub="En 3 municipalidades de ejemplo" />
        <StatCard label="Ciudadanía registrada" value={s.citizens} sub="Usuarios de ejemplo" />
        <StatCard label="Resultados reciclables" value={s.recyclable + '%'} sub="Resultados de escaneo simulados" />
        <StatCard label="Resultados a revisar" value={s.review + '%'} sub="Resultados de escaneo simulados" />
        <StatCard label="Resultados inciertos" value={s.uncertain + '%'} sub="Resultados de escaneo simulados" />
      </div>
      <div className="grid-cards">
        <Card title="Escaneos en el tiempo" note="Tendencia mensual de ejemplo"><LineChart data={trend} /></Card>
        <Card title="Distribución por material" note="Datos de ejemplo"><BarList items={s.materials} /></Card>
        <Card title="Observaciones de contaminación visible" note="Los resultados «a revisar» incluyen observaciones visuales de manchas o restos; no detectan contaminantes ocultos.">
          <StackedBar parts={[
            { label: 'Reciclable', value: s.recyclable, color: '#176B4D' },
            { label: 'A revisar (incl. contaminación visible)', value: s.review, color: '#D99A32' },
            { label: 'Incierto', value: s.uncertain, color: '#C94B45' },
          ]} />
        </Card>
        <Card title="Puntos de reciclaje" note="Total de ejemplo y catálogo editable de esta demo">
          <div className="stats stats--3">
            <StatCard label="Activos (cifra demo)" value={s.activePoints} />
            <StatCard label="Catálogo de muestra" value={points.length} />
            <StatCard label="Requieren revisión" value={cat('Needs review')} />
          </div>
          <p className="small muted">Catálogo de muestra: {cat('Active')} activos · {cat('Inactive')} inactivos · {cat('Needs review')} requieren revisión.</p>
          <a className="btn btn--outline btn--sm" href="#/a/points">Gestionar puntos</a>
        </Card>
      </div>
    </div>
  )
}

export function AdminScans({ history }) {
  const [mat, setMat] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const rows = useMemo(
    () => history
      .filter((h) => (mat === 'all' || h.materialId === mat) && (!from || h.date.slice(0, 10) >= from) && (!to || h.date.slice(0, 10) <= to))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [history, mat, from, to])
  return (
    <div className="stack">
      <h1>Escaneos</h1>
      <DemoNote>Eventos de escaneo de ejemplo y simulados.</DemoNote>
      <div className="filters">
        <label>Material
          <select value={mat} onChange={(e) => setMat(e.target.value)}>
            <option value="all">Todos</option>
            {[...acceptableMaterials, { id: 'UNKNOWN', name: 'Material incierto / mixto' }].map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label>Desde<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>Hasta<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        {(mat !== 'all' || from || to) && <button className="btn btn--ghost btn--sm" onClick={() => { setMat('all'); setFrom(''); setTo('') }}>Limpiar filtros</button>}
      </div>
      <Card>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Fecha</th><th>Material</th><th>Confianza simulada</th><th>Estado</th><th>Municipalidad</th><th>Usuario</th></tr></thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id}>
                  <td>{formatDateTime(h.date)}</td><td>{h.material}</td><td>{h.confidence}%</td><td><Badge>{h.status}</Badge></td><td>{h.municipality}</td><td>{h.user}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="6" className="empty">Ningún escaneo coincide con los filtros.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="small muted">{rows.length} de {history.length} registros</p>
      </Card>
    </div>
  )
}

export function AdminPoints({ points, onEdit, onNew, onToggle }) {
  const [q, setQ] = useState('')
  const rows = points.filter((p) => (p.name + p.municipality + p.address).toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="stack">
      <div className="titlebar">
        <h1>Puntos de reciclaje</h1>
        <button className="btn btn--primary" onClick={onNew}>+ Nuevo punto</button>
      </div>
      <DemoNote>Catálogo de ejemplo: los cambios solo afectan el estado local de esta demo.</DemoNote>
      <div className="filters">
        <label className="grow">Buscar punto<input type="search" placeholder="Nombre, municipalidad o sector" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>
      <Card>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Punto</th><th>Municipalidad</th><th>Estado</th><th>Materiales aceptados</th><th>Última actualización</th><th>Acciones</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong><div className="muted small">{p.id}</div></td>
                  <td>{p.municipality}</td>
                  <td><Badge>{p.status}</Badge></td>
                  <td><span className="chips">{p.acceptedMaterialIds.map((id) => <span key={id} className="chip">{materialName(id)}</span>)}</span></td>
                  <td>{formatDate(p.lastUpdated)}</td>
                  <td>
                    <div className="row row--tight">
                      <button className="btn btn--outline btn--sm" onClick={() => onEdit(p)}>Editar</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => onToggle(p)}>{p.status === 'Active' || p.status === 'Needs review' ? 'Desactivar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="6" className="empty">Ningún punto coincide con la búsqueda.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function AdminMunicipalities({ points, extraByMuni }) {
  return (
    <div className="stack">
      <h1>Municipalidades</h1>
      <DemoNote />
      <div className="grid-cards">
        {adminStats.municipalities.map((m) => {
          const pts = points.filter((p) => p.municipality === m.name)
          return (
            <Card key={m.name} title={m.name}>
              <div className="stats stats--3">
                <StatCard label="Escaneos" value={m.scans + (extraByMuni[m.name] || 0)} />
                <StatCard label="Puntos activos" value={m.activePoints} sub="Cifra de ejemplo" />
                <StatCard label="En catálogo" value={pts.length} />
              </div>
              <a className="btn btn--primary btn--sm" href={'#/a/municipalities/' + m.name}>Ver detalle</a>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
