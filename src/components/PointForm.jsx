import { useState } from 'react'
import { Modal } from './ui'
import { acceptableMaterials, MUNICIPALITIES, STATUSES, STATUS_LABEL } from '../data/demoData'

function Field({ id, label, children, error }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="field__err" id={id + '-err'}>{error}</p>}
    </div>
  )
}

// Formulario compacto de punto. `limited` = municipalidad: solo horario, materiales y estado.
export default function PointForm({ point, limited, defaultMunicipality, onSave, onCancel }) {
  const [f, setF] = useState(point ?? {
    name: '', municipality: defaultMunicipality || MUNICIPALITIES[0], address: '', lat: '', lng: '',
    openingHours: '', acceptedMaterialIds: [], status: 'Active', description: '',
  })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const toggle = (id) => set('acceptedMaterialIds', f.acceptedMaterialIds.includes(id) ? f.acceptedMaterialIds.filter((x) => x !== id) : [...f.acceptedMaterialIds, id])

  function submit(e) {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Ingresa el nombre del punto.'
    if (!f.address.trim()) er.address = 'Ingresa la dirección o sector.'
    if (!f.openingHours.trim()) er.openingHours = 'Ingresa el horario.'
    if (f.acceptedMaterialIds.length === 0) er.materials = 'Selecciona al menos un material.'
    const lat = Number(f.lat), lng = Number(f.lng)
    if (f.lat === '' || Number.isNaN(lat) || lat < -90 || lat > 90) er.lat = 'Latitud válida requerida (ej. -33.4289).'
    if (f.lng === '' || Number.isNaN(lng) || lng < -180 || lng > 180) er.lng = 'Longitud válida requerida (ej. -70.6168).'
    setErrors(er)
    if (Object.keys(er).length) return
    onSave({ ...f, name: f.name.trim(), address: f.address.trim(), openingHours: f.openingHours.trim(), description: f.description.trim(), lat, lng })
  }

  return (
    <Modal title={point ? `Editar punto · ${point.id}` : 'Nuevo punto de reciclaje'} onClose={onCancel}>
      <form onSubmit={submit} noValidate className="form">
        {limited && <p className="card__note">Como municipalidad puedes editar horario, materiales aceptados y estado operativo.</p>}
        <Field id="pf-name" label="Nombre *" error={errors.name}>
          <input id="pf-name" value={f.name} disabled={limited} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <div className="grid2">
          <Field id="pf-muni" label="Municipalidad *">
            <select id="pf-muni" value={f.municipality} disabled={limited || !!point} onChange={(e) => set('municipality', e.target.value)}>
              {MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field id="pf-status" label="Estado operativo *">
            <select id="pf-status" value={f.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
        </div>
        <Field id="pf-address" label="Dirección / sector *" error={errors.address}>
          <input id="pf-address" value={f.address} disabled={limited} onChange={(e) => set('address', e.target.value)} aria-invalid={!!errors.address} />
        </Field>
        {!limited && (
          <div className="grid2">
            <Field id="pf-lat" label="Latitud *" error={errors.lat}>
              <input id="pf-lat" inputMode="decimal" value={f.lat} onChange={(e) => set('lat', e.target.value)} aria-invalid={!!errors.lat} />
            </Field>
            <Field id="pf-lng" label="Longitud *" error={errors.lng}>
              <input id="pf-lng" inputMode="decimal" value={f.lng} onChange={(e) => set('lng', e.target.value)} aria-invalid={!!errors.lng} />
            </Field>
          </div>
        )}
        <Field id="pf-hours" label="Horario *" error={errors.openingHours}>
          <input id="pf-hours" value={f.openingHours} placeholder="Lun–Vie 09:00–18:00" onChange={(e) => set('openingHours', e.target.value)} aria-invalid={!!errors.openingHours} />
        </Field>
        <fieldset className="field">
          <legend>Materiales aceptados *</legend>
          <div className="checks">
            {acceptableMaterials.map((m) => (
              <label key={m.id} className="check">
                <input type="checkbox" checked={f.acceptedMaterialIds.includes(m.id)} onChange={() => toggle(m.id)} /> {m.name}
              </label>
            ))}
          </div>
          {errors.materials && <p className="field__err">{errors.materials}</p>}
        </fieldset>
        {!limited && (
          <Field id="pf-desc" label="Descripción">
            <textarea id="pf-desc" rows="2" value={f.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        )}
        <div className="row">
          <button type="submit" className="btn btn--primary">Guardar cambios</button>
          <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </Modal>
  )
}
