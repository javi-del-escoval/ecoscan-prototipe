// Todos los datos de este archivo son ficticios y existen solo para el prototipo.

export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// "2026-11-10T09:42" -> "10 nov 2026"
export function formatDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
export function formatDateTime(iso) {
  return iso.length > 10 ? `${formatDate(iso)}, ${iso.slice(11, 16)}` : formatDate(iso)
}
export const fmt = (n) => n.toLocaleString('es-CL')

export const materials = [
  { id: 'PET', name: 'Plástico PET', category: 'Plástico', guidance: 'Vacía, enjuaga si es necesario y aplasta si las instrucciones del punto lo permiten.' },
  { id: 'HDPE', name: 'Plástico HDPE', category: 'Plástico', guidance: 'Vacía y enjuaga; revisa los plásticos que acepta el punto.' },
  { id: 'PAPER', name: 'Papel y cartón', category: 'Papel', guidance: 'Mantenlo seco y retira las secciones contaminadas con alimentos.' },
  { id: 'GLASS', name: 'Vidrio', category: 'Vidrio', guidance: 'Vacía y enjuaga; el vidrio roto se maneja según la guía local.' },
  { id: 'ALU', name: 'Lata de aluminio', category: 'Metal', guidance: 'Vacía y enjuaga; aplasta solo si el punto receptor lo acepta.' },
  { id: 'CARTON', name: 'Envase de bebida', category: 'Envase compuesto', guidance: 'Vacía, enjuaga y aplasta. La aceptación varía según el punto.' },
  { id: 'ORGANIC', name: 'Residuo orgánico', category: 'Orgánico', guidance: 'Usa una opción de recolección o compostaje de orgánicos; no lo pongas en un contenedor de reciclaje estándar.' },
  { id: 'UNKNOWN', name: 'Material incierto / mixto', category: 'Otro', guidance: 'La imagen no es suficiente para una clasificación confiable. Consulta la guía local.' },
]
export const materialName = (id) => materials.find((m) => m.id === id)?.name ?? id

// Materiales que pueden aceptar los puntos (excluye orgánico e incierto)
export const acceptableMaterials = materials.filter((m) => !['ORGANIC', 'UNKNOWN'].includes(m.id))

export const scanResults = [
  {
    id: 'scan-pet', materialId: 'PET', material: 'Plástico PET', category: 'Plástico', confidence: 96,
    condition: 'Se ve limpio', visibleContamination: false,
    contaminationNote: 'No se detectan restos visibles de alimentos o líquidos en este ejemplo simulado.',
    recommendation: 'Reciclable en puntos de recepción participantes.',
    instructions: ['Vacía la botella por completo.', 'Enjuágala si quedan restos.', 'Aplasta la botella si el punto receptor lo permite.', 'Guarda la tapa por separado si el punto lo requiere.'],
    acceptedMaterialIds: ['PET'], resultStatus: 'Reciclable',
  },
  {
    id: 'scan-aluminium', materialId: 'ALU', material: 'Lata de aluminio', category: 'Metal', confidence: 93,
    condition: 'Se ve limpia', visibleContamination: false,
    contaminationNote: 'No se detectan restos visibles en este ejemplo simulado.',
    recommendation: 'Apta para recolección de metales en puntos participantes.',
    instructions: ['Vacía la lata.', 'Enjuágala si es necesario.', 'Revisa si el punto receptor pide aplastar las latas.'],
    acceptedMaterialIds: ['ALU'], resultStatus: 'Reciclable',
  },
  {
    id: 'scan-paper', materialId: 'PAPER', material: 'Papel y cartón', category: 'Papel', confidence: 89,
    condition: 'Posible contaminación', visibleContamination: true,
    contaminationNote: 'Hay una mancha visible. Es solo una observación visual; la imagen no permite determinar el alcance total de la contaminación.',
    recommendation: 'Separa las secciones limpias de las manchadas o contaminadas con alimentos.',
    instructions: ['Mantén seco el papel y cartón limpio.', 'Retira las secciones con restos visibles de comida o grasa.', 'Revisa los tipos de papel que acepta el punto.'],
    acceptedMaterialIds: ['PAPER'], resultStatus: 'Revisar condición',
  },
  {
    id: 'scan-glass', materialId: 'GLASS', material: 'Botella de vidrio', category: 'Vidrio', confidence: 94,
    condition: 'Se ve limpia', visibleContamination: false,
    contaminationNote: 'No se detectan restos visibles en este ejemplo simulado.',
    recommendation: 'Apta para recolección de vidrio en puntos participantes.',
    instructions: ['Vacía y enjuaga la botella.', 'No incluyas cerámica, espejos ni vidrio de ventana, salvo que se acepten expresamente.', 'Manipula con cuidado el vidrio roto y sigue las indicaciones locales.'],
    acceptedMaterialIds: ['GLASS'], resultStatus: 'Reciclable',
  },
  {
    id: 'scan-carton', materialId: 'CARTON', material: 'Envase de bebida', category: 'Envase compuesto', confidence: 84,
    condition: 'Requiere preparación', visibleContamination: false,
    contaminationNote: 'No se detecta contaminación visible en este ejemplo simulado.',
    recommendation: 'La aceptación depende del punto receptor.',
    instructions: ['Vacía el envase por completo.', 'Enjuágalo y deja escurrir el exceso de agua.', 'Aplástalo.', 'Confirma que el punto elegido acepta envases de bebida.'],
    acceptedMaterialIds: ['CARTON'], resultStatus: 'Revisar aceptación local',
  },
  {
    id: 'scan-unknown', materialId: 'UNKNOWN', material: 'Material incierto / mixto', category: 'Otro', confidence: 42,
    condition: 'Incierto', visibleContamination: false,
    contaminationNote: 'La imagen no entrega información visual suficiente para evaluar contaminación.',
    recommendation: 'EcoScan no puede clasificar este objeto con confianza en este ejemplo simulado.',
    instructions: ['Prueba con otra foto, con mejor luz y fondo liso.', 'Si el objeto combina materiales distintos, consulta la guía local de disposición.', 'No asumas que el objeto es reciclable a partir de este resultado.'],
    acceptedMaterialIds: [], resultStatus: 'Incierto',
  },
]

export const initialHistory = [
  { id: 'H001', user: 'Camila Rojas', material: 'Plástico PET', materialId: 'PET', date: '2026-11-10T09:42', confidence: 96, status: 'Reciclable', municipality: 'Providencia' },
  { id: 'H002', user: 'Camila Rojas', material: 'Papel y cartón', materialId: 'PAPER', date: '2026-11-09T18:15', confidence: 89, status: 'Revisar condición', municipality: 'Providencia' },
  { id: 'H003', user: 'Camila Rojas', material: 'Lata de aluminio', materialId: 'ALU', date: '2026-11-08T13:07', confidence: 93, status: 'Reciclable', municipality: 'Providencia' },
  { id: 'H004', user: 'Martín Pérez', material: 'Botella de vidrio', materialId: 'GLASS', date: '2026-11-10T10:21', confidence: 94, status: 'Reciclable', municipality: 'Ñuñoa' },
  { id: 'H005', user: 'Martín Pérez', material: 'Material incierto / mixto', materialId: 'UNKNOWN', date: '2026-11-09T16:32', confidence: 42, status: 'Incierto', municipality: 'Ñuñoa' },
  { id: 'H006', user: 'Sofía Morales', material: 'Envase de bebida', materialId: 'CARTON', date: '2026-11-10T08:54', confidence: 84, status: 'Revisar aceptación local', municipality: 'Santiago' },
  { id: 'H007', user: 'Sofía Morales', material: 'Plástico PET', materialId: 'PET', date: '2026-11-08T11:40', confidence: 97, status: 'Reciclable', municipality: 'Santiago' },
  { id: 'H008', user: 'Camila Rojas', material: 'Botella de vidrio', materialId: 'GLASS', date: '2026-11-07T17:22', confidence: 91, status: 'Reciclable', municipality: 'Providencia' },
  { id: 'H009', user: 'Martín Pérez', material: 'Papel y cartón', materialId: 'PAPER', date: '2026-11-07T12:18', confidence: 76, status: 'Revisar condición', municipality: 'Ñuñoa' },
  { id: 'H010', user: 'Sofía Morales', material: 'Lata de aluminio', materialId: 'ALU', date: '2026-11-06T15:03', confidence: 95, status: 'Reciclable', municipality: 'Santiago' },
  { id: 'H011', user: 'Camila Rojas', material: 'Envase de bebida', materialId: 'CARTON', date: '2026-11-05T19:10', confidence: 82, status: 'Revisar aceptación local', municipality: 'Providencia' },
  { id: 'H012', user: 'Martín Pérez', material: 'Plástico PET', materialId: 'PET', date: '2026-11-05T09:26', confidence: 92, status: 'Reciclable', municipality: 'Ñuñoa' },
]

export const recyclingPoints = [
  {
    id: 'PVD-001', name: 'Punto Verde Plaza Central', municipality: 'Providencia',
    address: 'Sector Plaza de la Aviación, Providencia, Santiago', lat: -33.4289, lng: -70.6168,
    openingHours: 'Lun–Vie 09:00–18:00; Sáb 10:00–14:00', acceptedMaterialIds: ['PET', 'HDPE', 'PAPER', 'ALU', 'GLASS'],
    status: 'Active', lastUpdated: '2026-11-08', description: 'Punto de reciclaje vecinal de ejemplo para la demostración de EcoScan.',
  },
  {
    id: 'PVD-002', name: 'Estación de Reciclaje Los Leones', municipality: 'Providencia',
    address: 'Sector Metro Los Leones, Providencia, Santiago', lat: -33.4215, lng: -70.6097,
    openingHours: 'Lun–Vie 08:30–17:30', acceptedMaterialIds: ['PET', 'HDPE', 'ALU', 'CARTON'],
    status: 'Active', lastUpdated: '2026-11-07', description: 'Punto de recepción de ejemplo con un catálogo limitado de envases.',
  },
  {
    id: 'PVD-003', name: 'Punto Limpio Parque Inés de Suárez', municipality: 'Providencia',
    address: 'Sector Parque Inés de Suárez, Providencia, Santiago', lat: -33.4372, lng: -70.6112,
    openingHours: 'Mar–Dom 10:00–18:00', acceptedMaterialIds: ['PET', 'PAPER', 'GLASS', 'ALU'],
    status: 'Active', lastUpdated: '2026-11-06', description: 'Punto de ejemplo cercano a un parque público.',
  },
  {
    id: 'NUN-001', name: 'Punto Verde Plaza Ñuñoa', municipality: 'Ñuñoa',
    address: 'Sector Plaza Ñuñoa, Ñuñoa, Santiago', lat: -33.4548, lng: -70.5977,
    openingHours: 'Lun–Sáb 09:00–17:00', acceptedMaterialIds: ['PET', 'HDPE', 'PAPER', 'ALU', 'GLASS'],
    status: 'Active', lastUpdated: '2026-11-09', description: 'Punto de ejemplo para la vista multimunicipal de administración.',
  },
  {
    id: 'STG-001', name: "Estación Verde Parque O'Higgins", municipality: 'Santiago',
    address: "Sector Parque O'Higgins, Santiago", lat: -33.4635, lng: -70.6622,
    openingHours: 'Lun–Vie 09:00–17:00', acceptedMaterialIds: ['PET', 'PAPER', 'ALU', 'CARTON'],
    status: 'Active', lastUpdated: '2026-11-05', description: 'Punto de ejemplo para la vista multimunicipal de administración.',
  },
  {
    id: 'PVD-004', name: 'Punto de Reciclaje Barrio Italia', municipality: 'Providencia',
    address: 'Sector Barrio Italia, Providencia, Santiago', lat: -33.4470, lng: -70.6250,
    openingHours: 'Lun–Vie 10:00–17:00', acceptedMaterialIds: ['PAPER', 'GLASS'],
    status: 'Needs review', lastUpdated: '2026-10-28', description: 'Punto de ejemplo incluido para demostrar el estado «Requiere revisión».',
  },
]

export const STATUS_LABEL = { Active: 'Activo', Inactive: 'Inactivo', 'Needs review': 'Requiere revisión' }
export const STATUSES = Object.keys(STATUS_LABEL)
export const MUNICIPALITIES = ['Providencia', 'Ñuñoa', 'Santiago']
export const MUNICIPALITY_PREFIX = { Providencia: 'PVD', Ñuñoa: 'NUN', Santiago: 'STG' }

export const users = {
  citizen: { id: 'citizen', name: 'Camila Rojas', email: 'camila.rojas@demo.ecoscan.cl', roleLabel: 'Ciudadanía', blurb: 'Escanea residuos, revisa tu historial y encuentra puntos de reciclaje.', home: '/c/home' },
  admin: { id: 'admin', name: 'Diego Fuentes', email: 'diego.fuentes@demo.ecoscan.cl', roleLabel: 'Administración', blurb: 'Revisa la actividad global y gestiona el catálogo de puntos de ejemplo.', home: '/a/dashboard' },
  municipality: { id: 'municipality', name: 'Valentina Soto', email: 'valentina.soto@demo.ecoscan.cl', roleLabel: 'Municipalidad', blurb: 'Consulta indicadores de la Municipalidad de Providencia y edita sus puntos.', home: '/m/dashboard' },
}

// --- Estadísticas de ejemplo (sección 13) ---
export const adminStats = {
  totalScans: 1284, scansMonth: 246, activePoints: 18, citizens: 436,
  recyclable: 78, review: 14, uncertain: 8,
  materials: [['Plástico', 38], ['Papel', 24], ['Vidrio', 16], ['Metal', 12], ['Envases compuestos', 7], ['Otro / incierto', 3]],
  trend: [['jun', 112], ['jul', 146], ['ago', 173], ['sep', 198], ['oct', 209], ['nov', 246]],
  municipalities: [
    { name: 'Providencia', scans: 482, activePoints: 7 },
    { name: 'Ñuñoa', scans: 391, activePoints: 6 },
    { name: 'Santiago', scans: 411, activePoints: 5 },
  ],
}
export const providenciaStats = {
  totalScans: 482, scansMonth: 96, activePoints: 7, citizens: 164,
  recyclable: 81, review: 12, uncertain: 7,
  materials: [['Plástico', 41], ['Papel', 22], ['Vidrio', 17], ['Metal', 11], ['Envases compuestos', 6], ['Otro / incierto', 3]],
  trend: [['jun', 39], ['jul', 52], ['ago', 61], ['sep', 73], ['oct', 80], ['nov', 96]],
}
export const citizenStats = { total: 18, month: 6, recyclable: 14, review: 4, pointsViewed: 5 }
