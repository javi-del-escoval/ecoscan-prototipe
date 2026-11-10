import { useCallback, useEffect, useRef, useState } from 'react'
import { go, ProfilePage } from './components/ui'
import { CitizenShell, DashShell, ADMIN_NAV, MUNI_NAV } from './components/Shells'
import PointForm from './components/PointForm'
import Landing from './pages/Landing'
import Demo from './pages/Demo'
import { CitizenHome, ScanPage, ScanResult, ScanHistory, CitizenMap } from './pages/Citizen'
import { AdminDashboard, AdminScans, AdminPoints, AdminMunicipalities } from './pages/Admin'
import { MunicipalityDashboard, MunicipalityPoints, MunicipalityActivity } from './pages/Municipality'
import { users, initialHistory, recyclingPoints, citizenStats, MUNICIPALITY_PREFIX } from './data/demoData'

const TODAY = '2026-11-10'

function useHashPath() {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#/, '')) || '/'
  const [path, setPath] = useState(read)
  useEffect(() => {
    const f = () => { setPath(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return path
}

export default function App() {
  const path = useHashPath()
  const [role, setRole] = useState(null)
  const [history, setHistory] = useState(initialHistory)
  const [points, setPoints] = useState(recyclingPoints)
  const [lastScan, setLastScan] = useState(null)
  const [focus, setFocus] = useState(null)
  const [viewed, setViewed] = useState(() => new Set())
  const [editing, setEditing] = useState(null) // punto | 'new' | null
  const [toast, setToast] = useState('')
  const [installEvt, setInstallEvt] = useState(null)
  const toastTimer = useRef()

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3500)
  }, [])

  useEffect(() => {
    const f = (e) => { e.preventDefault(); setInstallEvt(e) }
    window.addEventListener('beforeinstallprompt', f)
    return () => window.removeEventListener('beforeinstallprompt', f)
  }, [])
  const install = async () => { await installEvt.prompt(); setInstallEvt(null) }

  // El foco del mapa (desde un resultado de escaneo) se limpia al salir del mapa
  useEffect(() => { if (path !== '/c/map') setFocus(null) }, [path])

  const user = role && users[role]
  const sessionScans = history.filter((h) => h.isNew)
  const extra = sessionScans.length
  const extraByMuni = { Providencia: extra } // los escaneos nuevos son de Camila (Providencia)

  const selectRole = (id) => { setRole(id); go(users[id].home) }

  // --- Acciones de datos (solo estado local) ---
  function onScan(result, preview) {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const entry = {
      id: 'N' + String(extra + 1).padStart(3, '0'), user: users.citizen.name, material: result.material, materialId: result.materialId,
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`,
      confidence: result.confidence, status: result.resultStatus, municipality: 'Providencia', isNew: true,
    }
    setHistory((h) => [entry, ...h])
    setLastScan({ result, preview })
    go('/c/result')
  }
  function savePoint(p) {
    if (editing === 'new') {
      const prefix = MUNICIPALITY_PREFIX[p.municipality]
      const n = points.filter((x) => x.id.startsWith(prefix)).length + 1
      setPoints((ps) => [...ps, { ...p, id: `${prefix}-${String(n).padStart(3, '0')}`, lastUpdated: TODAY }])
      notify('Punto creado en el estado local de la demo.')
    } else {
      setPoints((ps) => ps.map((x) => (x.id === editing.id ? { ...x, ...p, lastUpdated: TODAY } : x)))
      notify('Cambios guardados en el estado local de la demo.')
    }
    setEditing(null)
  }
  function togglePoint(p) {
    const next = p.status === 'Active' || p.status === 'Needs review' ? 'Inactive' : 'Active'
    setPoints((ps) => ps.map((x) => (x.id === p.id ? { ...x, status: next, lastUpdated: TODAY } : x)))
    notify(next === 'Active' ? `«${p.name}» activado.` : `«${p.name}» desactivado.`)
  }
  const markViewed = (id) => setViewed((s) => new Set(s).add(id))

  // --- Rutas ---
  if (path === '/') return <Landing canInstall={!!installEvt} onInstall={install} />
  if (path === '/demo') return <Demo onSelect={selectRole} />

  const seg = path.split('/').filter(Boolean) // ej. ['c','scan']
  const area = { c: 'citizen', a: 'admin', m: 'municipality' }[seg[0]]
  if (!area) { go('/'); return null }
  if (!role) { go('/demo'); return null }
  if (area !== role) { go(users[role].home); return null }
  const page = seg[1]
  const profile = <ProfilePage user={user} onSwitch={selectRole} canInstall={!!installEvt} onInstall={install} />
  const editor = editing && (
    <PointForm point={editing === 'new' ? null : editing} limited={role === 'municipality'} defaultMunicipality="Providencia" onSave={savePoint} onCancel={() => setEditing(null)} />
  )

  if (role === 'citizen') {
    const stats = {
      total: citizenStats.total + extra, month: citizenStats.month + extra,
      recyclable: citizenStats.recyclable + sessionScans.filter((h) => h.status === 'Reciclable').length,
      review: citizenStats.review + sessionScans.filter((h) => h.status !== 'Reciclable').length,
      pointsViewed: citizenStats.pointsViewed + viewed.size,
    }
    let view
    if (page === 'home') view = <CitizenHome user={user} history={history} stats={stats} />
    else if (page === 'scan') view = <ScanPage onScan={onScan} />
    else if (page === 'result') {
      if (!lastScan) { go('/c/scan'); return null }
      view = (
        <ScanResult scan={lastScan} points={points} onNotify={notify}
          onFind={(materialId) => { setFocus({ materialId }); go('/c/map') }}
          onOpenPoint={(pointId) => { setFocus({ pointId, materialId: lastScan.result.acceptedMaterialIds[0] }); go('/c/map') }} />
      )
    }
    else if (page === 'history') view = <ScanHistory user={user} history={history} />
    else if (page === 'map') view = <CitizenMap key={focus ? 'f' : 'n'} points={points} focus={focus} onView={markViewed} />
    else if (page === 'profile') view = profile
    else { go('/c/home'); return null }
    return <CitizenShell user={user} path={path} onSwitch={selectRole} toast={toast}>{view}</CitizenShell>
  }

  if (role === 'admin') {
    let view
    if (page === 'dashboard') view = <AdminDashboard points={points} extra={extra} />
    else if (page === 'scans') view = <AdminScans history={history} />
    else if (page === 'points') view = <AdminPoints points={points} onEdit={setEditing} onNew={() => setEditing('new')} onToggle={togglePoint} />
    else if (page === 'municipalities' && seg[2]) view = <MunicipalityDashboard admin name={seg[2]} points={points} history={history} extra={extraByMuni[seg[2]] || 0} />
    else if (page === 'municipalities') view = <AdminMunicipalities points={points} extraByMuni={extraByMuni} />
    else if (page === 'profile') view = profile
    else { go('/a/dashboard'); return null }
    return (
      <DashShell user={user} path={path} nav={ADMIN_NAV} scope="Vista global" onSwitch={selectRole} toast={toast}>
        {view}{editor}
      </DashShell>
    )
  }

  // municipalidad (limitada a Providencia)
  const pvd = points.filter((p) => p.municipality === 'Providencia')
  let view
  if (page === 'dashboard') view = <MunicipalityDashboard name="Providencia" points={points} history={history} extra={extra} />
  else if (page === 'points') view = <MunicipalityPoints points={pvd} onEdit={setEditing} onView={markViewed} />
  else if (page === 'activity') view = <MunicipalityActivity history={history} />
  else if (page === 'profile') view = profile
  else { go('/m/dashboard'); return null }
  return (
    <DashShell user={user} path={path} nav={MUNI_NAV} scope="Municipalidad de Providencia" onSwitch={selectRole} toast={toast}>
      {view}{editor}
    </DashShell>
  )
}
