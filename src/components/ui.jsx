import { useEffect, useState } from 'react'
import { users, STATUS_LABEL, fmt } from '../data/demoData'

export const go = (path) => { window.location.hash = '#' + path }

export function Wordmark({ light }) {
  return (
    <a className={'wordmark' + (light ? ' wordmark--light' : '')} href="#/" aria-label="EcoScan, ir al inicio">
      <img src="/icons/icon.svg" alt="" width="28" height="28" />
      <span>EcoScan</span>
    </a>
  )
}

const TONE = {
  Reciclable: 'ok', Active: 'ok',
  'Revisar condición': 'warn', 'Revisar aceptación local': 'warn', 'Needs review': 'warn',
  Incierto: 'err', Inactive: 'muted',
}
export function Badge({ children, tone }) {
  return <span className={'badge badge--' + (tone || TONE[children] || 'muted')}>{STATUS_LABEL[children] ?? children}</span>
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{typeof value === 'number' ? fmt(value) : value}</div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>
  )
}

export function Card({ title, note, children, className = '' }) {
  return (
    <section className={'card ' + className}>
      {title && <h2 className="card__title">{title}</h2>}
      {note && <p className="card__note">{note}</p>}
      {children}
    </section>
  )
}

export function BarList({ items, suffix = '%' }) {
  const max = Math.max(...items.map((i) => i[1]))
  return (
    <ul className="bars">
      {items.map(([label, v]) => (
        <li key={label}>
          <span className="bars__label">{label}</span>
          <span className="bars__track"><span className="bars__fill" style={{ width: `${(v / max) * 100}%` }} /></span>
          <span className="bars__val">{v}{suffix}</span>
        </li>
      ))}
    </ul>
  )
}

export function StackedBar({ parts }) {
  return (
    <div>
      <div className="stacked" role="img" aria-label={parts.map((p) => `${p.label} ${p.value}%`).join(', ')}>
        {parts.map((p) => <span key={p.label} style={{ width: p.value + '%', background: p.color }} />)}
      </div>
      <ul className="legend">
        {parts.map((p) => (
          <li key={p.label}><i style={{ background: p.color }} />{p.label} <b>{p.value}%</b></li>
        ))}
      </ul>
    </div>
  )
}

export function LineChart({ data }) {
  const W = 320, H = 190, P = { l: 30, r: 14, t: 20, b: 26 }
  const max = Math.ceil(Math.max(...data.map((d) => d[1])) / 50) * 50
  const x = (i) => P.l + (i * (W - P.l - P.r)) / (data.length - 1)
  const y = (v) => H - P.b - (v / max) * (H - P.t - P.b)
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[1])}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="line" role="img" aria-label={'Tendencia mensual de escaneos: ' + data.map((d) => `${d[0]} ${d[1]}`).join(', ')}>
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} stroke="#E1E8E2" />
          <text x={P.l - 6} y={y(max * t) + 4} textAnchor="end" fontSize="11" fill="#66736B">{Math.round(max * t)}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#176B4D" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d[0]}>
          <circle cx={x(i)} cy={y(d[1])} r="4" fill="#176B4D" />
          <text x={x(i)} y={y(d[1]) - 9} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E2A24">{d[1]}</text>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#66736B">{d[0]}</text>
        </g>
      ))}
    </svg>
  )
}

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  if (online) return null
  return (
    <div className="offline" role="status">
      Sin conexión. Puedes seguir usando la demo, pero los mosaicos del mapa pueden no estar disponibles; usa la vista de lista.
    </div>
  )
}

export function Toast({ message }) {
  return <div className="toast" role="status" aria-live="polite">{message && <span>{message}</span>}</div>
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__head">
          <h2>{title}</h2>
          <button className="btn btn--ghost" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function RoleSwitcher({ role, onSwitch }) {
  return (
    <label className="roleswitch">
      <span className="sr">Cambiar perfil</span>
      <select value={role} onChange={(e) => onSwitch(e.target.value)} aria-label="Cambiar perfil">
        {Object.values(users).map((u) => <option key={u.id} value={u.id}>{u.roleLabel} · {u.name}</option>)}
      </select>
    </label>
  )
}

export function ProfilePage({ user, onSwitch, canInstall, onInstall }) {
  return (
    <div className="stack">
      <h1>Perfil</h1>
      <Card>
        <div className="profile">
          <div className="avatar" aria-hidden="true">{user.name[0]}</div>
          <div>
            <h2 className="profile__name">{user.name}</h2>
            <p className="muted">{user.email}</p>
            <Badge tone="ok">{user.roleLabel}</Badge>
          </div>
        </div>
        <p className="card__note">Identidad de demostración: no hay contraseña ni cuenta real.</p>
      </Card>
      <Card title="Cambiar de perfil" note="Explora las tres experiencias sin cerrar sesión.">
        <div className="row">
          {Object.values(users).map((u) => (
            <button key={u.id} className={'btn ' + (u.id === user.id ? 'btn--primary' : 'btn--outline')} onClick={() => onSwitch(u.id)} aria-pressed={u.id === user.id}>
              {u.roleLabel} · {u.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </Card>
      {canInstall && (
        <Card title="Instalar EcoScan" note="Tu navegador permite instalar esta demo como aplicación.">
          <button className="btn btn--outline" onClick={onInstall}>Instalar aplicación</button>
        </Card>
      )}
    </div>
  )
}

export function DemoNote({ children = 'Datos de ejemplo — cifras ficticias para demostración.' }) {
  return <p className="demo-note">{children}</p>
}
