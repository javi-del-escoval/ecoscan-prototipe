import { useMemo, useState } from "react";
import RecyclingMap from "./RecyclingMap";
import { Badge, Notice, formatDate, pointStatusClass } from "./ui";
import { materialName, materials, MUNICIPALITIES, STATUSES } from "../data/demoData";

const RECYCLABLE_IDS = ["PET", "HDPE", "PAPER", "GLASS", "ALU", "CARTON"];

export function MaterialChips({ ids }) {
  return (
    <div>
      {ids.map((id) => (
        <span className="chip" key={id}>{materialName(id)}</span>
      ))}
    </div>
  );
}

export const DEMO_NOTE = "Ubicaciones de demostración: no son instalaciones operativas verificadas.";

// Panel lateral con el detalle de un punto
export function PointDetail({ point, onClose, onEdit }) {
  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Detalle de ${point.name}`} onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <h2>{point.name}</h2>
          <button className="btn secondary small" onClick={onClose}>Cerrar</button>
        </div>
        <div className="stack">
          <div className="row">
            <Badge kind={pointStatusClass(point.status)}>{point.status}</Badge>
            <span className="muted small">{point.municipality}</span>
          </div>
          <div><h3>Dirección</h3><p>{point.address}</p></div>
          <div><h3>Horario</h3><p>{point.openingHours}</p></div>
          <div><h3>Materiales aceptados</h3><MaterialChips ids={point.acceptedMaterialIds} /></div>
          <p>{point.description}</p>
          <p className="muted small">Última actualización: {formatDate(point.lastUpdated)}</p>
          <Notice>{DEMO_NOTE}</Notice>
          {onEdit && <button className="btn" onClick={() => onEdit(point)}>Editar punto</button>}
        </div>
      </aside>
    </div>
  );
}

// Lista + mapa con filtros (ciudadanía y municipalidad)
export function PointsExplorer({ points, citizen, initialMaterial = "", initialSelected = null, onView, onEdit }) {
  const [view, setView] = useState("map");
  const [municipality, setMunicipality] = useState("");
  const [material, setMaterial] = useState(initialMaterial);
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState(initialSelected);
  const [detailId, setDetailId] = useState(initialSelected);

  const filtered = useMemo(() => {
    const list = points.filter(
      (p) =>
        (!municipality || p.municipality === municipality) &&
        (!material || p.acceptedMaterialIds.includes(material)) &&
        (!status || p.status === status)
    );
    // Ciudadanía: los puntos de Providencia (zona de referencia) aparecen primero
    return citizen ? [...list].sort((a, b) => (b.municipality === "Providencia") - (a.municipality === "Providencia")) : list;
  }, [points, municipality, material, status, citizen]);

  const filtersActive = Boolean(municipality || material || status);
  const municipalities = [...new Set(points.map((p) => p.municipality))];
  const detail = points.find((p) => p.id === detailId);

  const open = (id) => {
    setSelectedId(id);
    setDetailId(id);
    onView && onView(id);
  };

  return (
    <div className="stack">
      <div className="card filters">
        {municipalities.length > 1 && (
          <div className="field">
            <label htmlFor="f-mun">Municipalidad</label>
            <select id="f-mun" value={municipality} onChange={(e) => setMunicipality(e.target.value)}>
              <option value="">Todas</option>
              {MUNICIPALITIES.filter((m) => municipalities.includes(m)).map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="f-mat">Material aceptado</label>
          <select id="f-mat" value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="">Todos</option>
            {RECYCLABLE_IDS.map((id) => <option key={id} value={id}>{materialName(id)}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-st">Estado operativo</label>
          <select id="f-st" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="seg" role="group" aria-label="Tipo de vista">
          <button className={view === "map" ? "on" : ""} onClick={() => setView("map")} aria-pressed={view === "map"}>Mapa</button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")} aria-pressed={view === "list"}>Lista</button>
        </div>
      </div>

      <Notice kind="info">
        {DEMO_NOTE} {citizen && "Se destacan los puntos de Providencia, la zona de referencia de la demo."}
      </Notice>

      {filtered.length === 0 ? (
        <div className="card">No hay puntos que coincidan con los filtros seleccionados.</div>
      ) : view === "map" ? (
        <>
          <RecyclingMap points={filtered} selectedId={selectedId} onSelect={open} fit={filtersActive} dimOutside={citizen ? "Providencia" : null} />
          <p className="muted small">{filtered.length} punto(s) mostrados. Toca un pin para ver un resumen y luego «Ver detalle».</p>
        </>
      ) : (
        <PointList points={filtered} selectedId={selectedId} onOpen={open} dimOutside={citizen} />
      )}

      {detail && <PointDetail point={detail} onClose={() => setDetailId(null)} onEdit={onEdit} />}
    </div>
  );
}

export function PointList({ points, selectedId, onOpen, dimOutside }) {
  return (
    <div className="grid cols-2">
      {points.map((p) => (
        <button
          key={p.id}
          className={`card point-item ${p.id === selectedId ? "selected" : ""} ${dimOutside && p.municipality !== "Providencia" ? "dim" : ""}`}
          style={{ textAlign: "left" }}
          onClick={() => onOpen(p.id)}
        >
          <div className="row between">
            <strong>{p.name}</strong>
            <Badge kind={pointStatusClass(p.status)}>{p.status}</Badge>
          </div>
          <div className="muted small">{p.municipality} · {p.openingHours}</div>
          <div style={{ marginTop: ".5rem" }}><MaterialChips ids={p.acceptedMaterialIds} /></div>
        </button>
      ))}
    </div>
  );
}

// Formulario compacto para crear/editar un punto (solo estado local)
export function PointForm({ point, restricted, onSave, onClose }) {
  const editing = Boolean(point);
  const [form, setForm] = useState({
    name: point?.name ?? "",
    municipality: point?.municipality ?? "Providencia",
    address: point?.address ?? "",
    lat: point?.lat ?? "",
    lng: point?.lng ?? "",
    openingHours: point?.openingHours ?? "",
    acceptedMaterialIds: point?.acceptedMaterialIds ?? [],
    status: point?.status ?? "Activo",
    description: point?.description ?? ""
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleMaterial = (id) =>
    set("acceptedMaterialIds", form.acceptedMaterialIds.includes(id) ? form.acceptedMaterialIds.filter((m) => m !== id) : [...form.acceptedMaterialIds, id]);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "El nombre es obligatorio.";
    if (!form.address.trim()) err.address = "La dirección es obligatoria.";
    if (!form.openingHours.trim()) err.openingHours = "El horario es obligatorio.";
    if (form.acceptedMaterialIds.length === 0) err.materials = "Selecciona al menos un material.";
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (form.lat === "" || Number.isNaN(lat) || lat < -90 || lat > 90) err.lat = "Latitud inválida.";
    if (form.lng === "" || Number.isNaN(lng) || lng < -180 || lng > 180) err.lng = "Longitud inválida.";
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ ...form, name: form.name.trim(), address: form.address.trim(), openingHours: form.openingHours.trim(), description: form.description.trim(), lat, lng });
  };

  const lock = restricted; // la municipalidad solo edita horario, materiales y estado

  return (
    <div className="overlay" onClick={onClose}>
      <form className="drawer" role="dialog" aria-modal="true" aria-label={editing ? "Editar punto" : "Nuevo punto"} onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <div className="row between">
          <h2>{editing ? "Editar punto de ejemplo" : "Nuevo punto de ejemplo"}</h2>
          <button type="button" className="btn secondary small" onClick={onClose}>Cerrar</button>
        </div>
        <p className="muted small">Los cambios solo afectan al estado local de la demo.</p>

        <div className="field">
          <label htmlFor="pf-name">Nombre</label>
          <input id="pf-name" type="text" value={form.name} disabled={lock} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <div className="err">{errors.name}</div>}
        </div>
        <div className="field">
          <label htmlFor="pf-mun">Municipalidad</label>
          <select id="pf-mun" value={form.municipality} disabled={lock || editing} onChange={(e) => set("municipality", e.target.value)}>
            {MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-addr">Dirección</label>
          <input id="pf-addr" type="text" value={form.address} disabled={lock} onChange={(e) => set("address", e.target.value)} />
          {errors.address && <div className="err">{errors.address}</div>}
        </div>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="pf-lat">Latitud</label>
            <input id="pf-lat" type="text" inputMode="decimal" value={form.lat} disabled={lock} onChange={(e) => set("lat", e.target.value)} placeholder="-33.4289" />
            {errors.lat && <div className="err">{errors.lat}</div>}
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="pf-lng">Longitud</label>
            <input id="pf-lng" type="text" inputMode="decimal" value={form.lng} disabled={lock} onChange={(e) => set("lng", e.target.value)} placeholder="-70.6168" />
            {errors.lng && <div className="err">{errors.lng}</div>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="pf-hours">Horario</label>
          <input id="pf-hours" type="text" value={form.openingHours} onChange={(e) => set("openingHours", e.target.value)} placeholder="Lun–Vie 09:00–17:00" />
          {errors.openingHours && <div className="err">{errors.openingHours}</div>}
        </div>
        <fieldset className="field" style={{ border: 0, padding: 0 }}>
          <legend style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".25rem" }}>Materiales aceptados</legend>
          <div className="checks">
            {RECYCLABLE_IDS.map((id) => (
              <label key={id}>
                <input type="checkbox" checked={form.acceptedMaterialIds.includes(id)} onChange={() => toggleMaterial(id)} />
                {materialName(id)}
              </label>
            ))}
          </div>
          {errors.materials && <div className="err">{errors.materials}</div>}
        </fieldset>
        <div className="field">
          <label htmlFor="pf-status">Estado operativo</label>
          <select id="pf-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-desc">Descripción</label>
          <textarea id="pf-desc" rows={3} value={form.description} disabled={lock} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="row">
          <button className="btn" type="submit">Guardar cambios</button>
          <button className="btn secondary" type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export { materials };
