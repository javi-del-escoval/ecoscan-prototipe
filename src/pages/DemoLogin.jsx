import { users } from "../data/demoData";
import { Notice } from "../components/ui";

export default function DemoLogin({ onSelect, onBack }) {
  return (
    <div className="centered">
      <button className="linklike" onClick={onBack}>← Volver al inicio</button>
      <h1 style={{ marginTop: "1rem" }}>Explorar demo</h1>
      <p className="muted">Elige un perfil de ejemplo para recorrer EcoScan. No se necesita contraseña.</p>
      <div style={{ margin: "1rem 0" }}>
        <Notice kind="info">Estas son identidades de demostración, solo para mostrar en pantalla. No son cuentas reales y todos los datos son ficticios.</Notice>
      </div>
      <div className="grid cols-3">
        {users.map((u) => (
          <div className="card profile-card" key={u.role}>
            <span className="badge">{u.roleLabel}</span>
            <h2 style={{ margin: ".25rem 0 0" }}>{u.name}</h2>
            <div className="email">{u.email}</div>
            <p style={{ flex: 1 }}>{u.description}</p>
            <button className="btn" onClick={() => onSelect(u.role)}>Continuar como {u.roleLabel}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
