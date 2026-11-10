import { useEffect, useMemo, useState } from 'react'
import RecyclingMap from './RecyclingMap'
import { Badge, Modal } from './ui'
import { acceptableMaterials, materialName, MUNICIPALITIES, STATUSES, STATUS_LABEL, formatDate } from '../data/demoData'

// Mapa / lista de puntos con filtros y detalle. Lo usan ciudadanía y municipalidad.
export default function PointsExplorer({ points, lockMunicipality, emphasize, canEdit, onEdit, onView, focus }) {
  const [view, setView] = useState('map')
  const [muni, setMuni] = useState(lockMunicipality || 'all')
  const [mat, setMat] = useState(focus?.materialId || 'all')
  const [status, setStatus] = useState('all')
  const [selId, setSelId] = useState(focus?.pointId || null)
  const [tilesFailed, setTilesFailed] = useState(false)

  const filtered = useMemo(
    () => points.filter((p) =>
      (muni === 'all' || p.municipality === muni) &&
      (mat === 'all' || p.acceptedMaterialIds.includes(mat)) &&
      (status === 'all' || p.status === status)),
    [points, muni, mat, status])
  const filterActive = (!lockMunicipality && muni !== 'all') || mat !== 'all' || status !== 'all'
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (emphasize ? (b.municipality === emphasize) - (a.municipality === emphasize) : 0) || a.name.localeCompare(b.name)),
    [filtered, emphasize])
  const selected = points.find((p) => p.id === selId)

  const open = (id) => { setSelId(id); onView?.(id) }
  // Si se llega desde el resultado de un escaneo con un punto elegido, cuenta como visto
  useEffect(() => { if (focus?.pointId) onView?.(focus.pointId) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="stack">
      <div className="filters">
        {!lockMunicipality && (
          <label>Municipalidad
            <select value={muni} onChange={(e) => setMuni(e.target.value)}>
              <option value="all">Todas</option>
              {MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
        )}
        <label>Material aceptado
          <select value={mat} onChange={(e) => setMat(e.target.value)}>
            <option value="all">Todos</option>
            {acceptableMaterials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label>Estado
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Todos</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <div className="seg" role="group" aria-label="Tipo de vista">
          <button className={view === 'map' ? 'on' : ''} aria-pressed={view === 'map'} onClick={() => setView('map')}>Mapa</button>
          <button className={view === 'list' ? 'on' : ''} aria-pressed={view === 'list'} onClick={() => setView('list')}>Lista</button>
        </div>
      </div>

      <p className="demo-note">Ubicaciones de demostración — no son instalaciones operativas verificadas.</p>

      {view === 'map' && (
        <div className="mapwrap">
          <RecyclingMap points={filtered} selectedId={selId} emphasize={emphasize} fit={filterActive} onSelect={open} onTilesFail={() => setTilesFailed(true)} />
          {tilesFailed && (
            <div className="mapfail" role="alert">
              No se pudieron cargar los mosaicos del mapa (puede que no haya conexión).
              <button className="btn btn--outline btn--sm" onClick={() => setView('list')}>Ver lista de puntos</button>
            </div>
          )}
          <p className="legendline">
            <span><i className="dot dot--ok" /> Activo</span>
            <span><i className="dot dot--warn" /> Requiere revisión</span>
            <span><i className="dot dot--muted" /> Inactivo</span>
          </p>
        </div>
      )}

      {view === 'list' && (
        <div className="pointlist">
          <h2 className="sr">Lista de puntos</h2>
          {sorted.length === 0 && <p className="empty">Ningún punto coincide con los filtros seleccionados.</p>}
          {sorted.map((p) => (
            <button key={p.id} className={'pointcard' + (p.id === selId ? ' is-sel' : '')} onClick={() => open(p.id)}>
              <span className="pointcard__top">
                <strong>{p.name}</strong>
                <Badge>{p.status}</Badge>
              </span>
              <span className="muted">{p.municipality}{emphasize && p.municipality === emphasize ? ' · Cercano' : ''}</span>
              <span className="chips">{p.acceptedMaterialIds.map((id) => <span key={id} className="chip">{materialName(id)}</span>)}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelId(null)}>
          <div className="detail">
            <p><Badge>{selected.status}</Badge> <span className="muted">{selected.municipality} · ID {selected.id}</span></p>
            <p>{selected.description}</p>
            <dl>
              <dt>Dirección</dt><dd>{selected.address}</dd>
              <dt>Horario</dt><dd>{selected.openingHours}</dd>
              <dt>Materiales aceptados</dt>
              <dd className="chips">{selected.acceptedMaterialIds.map((id) => <span key={id} className="chip">{materialName(id)}</span>)}</dd>
              <dt>Última actualización</dt><dd>{formatDate(selected.lastUpdated)}</dd>
            </dl>
            <p className="demo-note">Ubicación de demostración — no es una instalación operativa verificada.</p>
            <div className="row">
              {canEdit && <button className="btn btn--primary" onClick={() => { onEdit(selected); setSelId(null) }}>Editar punto</button>}
              <button className="btn btn--outline" onClick={() => setSelId(null)}>Cerrar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
