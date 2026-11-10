import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STATUS_LABEL } from '../data/demoData'

const CENTER = [-33.426, -70.615]
const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// Mapa Leaflet + OpenStreetMap. Marcadores con divIcon (sin imágenes externas).
export default function RecyclingMap({ points, selectedId, emphasize, fit, onSelect, onTilesFail }) {
  const el = useRef(null)
  const map = useRef(null)
  const layer = useRef(null)
  const cb = useRef({ onSelect, onTilesFail })
  cb.current = { onSelect, onTilesFail }

  useEffect(() => {
    const m = L.map(el.current, { center: CENTER, zoom: 13 })
    const tiles = L.tileLayer(TILES, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m)
    let errors = 0
    tiles.on('tileerror', () => { if (++errors === 3) cb.current.onTilesFail?.() })
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    return () => m.remove()
  }, [])

  useEffect(() => {
    const m = map.current
    layer.current.clearLayers()
    points.forEach((p) => {
      const cls = ['pin', 'pin--' + p.status.replace(' ', '-').toLowerCase()]
      if (emphasize && p.municipality !== emphasize) cls.push('pin--far')
      if (p.id === selectedId) cls.push('pin--sel')
      const marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({ className: '', html: `<span class="${cls.join(' ')}"></span>`, iconSize: [26, 26], iconAnchor: [13, 13] }),
        title: p.name,
        alt: p.name,
      })
      const box = document.createElement('div')
      box.className = 'popup'
      const t = document.createElement('strong'); t.textContent = p.name
      const s = document.createElement('div'); s.textContent = `${p.municipality} · ${STATUS_LABEL[p.status]}`
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn--primary btn--sm'; b.textContent = 'Ver detalle'
      b.addEventListener('click', () => cb.current.onSelect(p.id))
      box.append(t, s, b)
      marker.bindPopup(box)
      marker.addTo(layer.current)
    })
  }, [points, selectedId, emphasize])

  // Ajusta la vista solo cuando cambia el conjunto visible (filtros), no al seleccionar
  const key = points.map((p) => p.id).join(',') + fit
  useEffect(() => {
    const m = map.current
    if (fit && points.length) m.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])).pad(0.3), { maxZoom: 15 })
    else if (!fit) m.setView(CENTER, 13)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return <div ref={el} className="map" role="region" aria-label="Mapa de puntos de reciclaje (demostración)" />
}
