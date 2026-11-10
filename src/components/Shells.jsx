import { Wordmark, RoleSwitcher, OfflineBanner, Toast } from './ui'

export const CITIZEN_NAV = [
  ['/c/home', 'Inicio', '⌂'], ['/c/scan', 'Escanear', '◎'], ['/c/history', 'Historial', '☰'], ['/c/map', 'Mapa', '⌖'], ['/c/profile', 'Perfil', '☺'],
]
export const ADMIN_NAV = [
  ['/a/dashboard', 'Panel global'], ['/a/scans', 'Escaneos'], ['/a/points', 'Puntos de reciclaje'], ['/a/municipalities', 'Municipalidades'], ['/a/profile', 'Perfil'],
]
export const MUNI_NAV = [
  ['/m/dashboard', 'Panel municipal'], ['/m/points', 'Puntos de reciclaje'], ['/m/activity', 'Actividad reciente'], ['/m/profile', 'Perfil'],
]

const active = (path, to) => path === to || path.startsWith(to + '/')

export function CitizenShell({ user, path, onSwitch, toast, children }) {
  return (
    <div className="cz">
      <OfflineBanner />
      <header className="cz__head">
        <Wordmark />
        <RoleSwitcher role={user.id} onSwitch={onSwitch} />
      </header>
      <nav className="cz__nav" aria-label="Navegación principal">
        {CITIZEN_NAV.map(([to, label, icon]) => (
          <a key={to} href={'#' + to} aria-current={active(path, to) ? 'page' : undefined}>
            <span aria-hidden="true">{icon}</span>{label}
          </a>
        ))}
      </nav>
      <main className="cz__main">{children}</main>
      <Toast message={toast} />
    </div>
  )
}

export function DashShell({ user, path, nav, scope, onSwitch, toast, children }) {
  return (
    <div className="dash">
      <OfflineBanner />
      <aside className="dash__side">
        <Wordmark light />
        <div className="dash__role">
          <span>{user.roleLabel}</span>
          <small>{scope}</small>
        </div>
        <nav aria-label="Navegación principal">
          {nav.map(([to, label]) => (
            <a key={to} href={'#' + to} aria-current={active(path, to) ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <div className="dash__foot">
          <div className="dash__user">{user.name}<small>{user.email}</small></div>
          <a href="#/demo" className="dash__link">Cambiar perfil</a>
          <a href="#/" className="dash__link">Salir al inicio</a>
        </div>
      </aside>
      <div className="dash__body">
        <header className="dash__top">
          <span className="dash__scope">{scope}</span>
          <RoleSwitcher role={user.id} onSwitch={onSwitch} />
        </header>
        <main className="dash__main">{children}</main>
      </div>
      <Toast message={toast} />
    </div>
  )
}
