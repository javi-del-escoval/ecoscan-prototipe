# EcoScan --- Prototype Specification

> **Purpose:** Build a presentable, interactive PWA prototype that
> demonstrates the EcoScan user experience. This is a UI/UX
> demonstration only. It is not a production application and must not be
> designed as the foundation of a future production system.

## 1. Product overview

**EcoScan** helps citizens make better decisions when separating
household recyclable waste. A user photographs or selects an image of a
waste item, receives a *probable* material classification and practical
disposal guidance, and can find nearby recycling points.

The prototype must demonstrate three perspectives:

1.  **Citizen:** scan waste, understand the result, find a recycling
    point, and review personal activity.
2.  **Administrator:** view overall platform activity and manage the
    sample recycling-point catalogue.
3.  **Municipality:** view municipality-specific activity,
    recycling-point coverage, and operational indicators.

The project is based on the EcoScan concept described in the group's
Informe 2. Its core value proposition is the combination of visual waste
identification, guidance about preparation/disposal,
visible-contamination warnings, and a map of recycling points.

### Important prototype disclaimer

All users, scans, statistics, locations, operational information, and
results in this prototype are fictional sample data. The scan result is
a simulation and must never be presented as output from a real AI model.
Contamination warnings refer only to visible indications; a photograph
cannot establish whether hidden contaminants are present.

## 2. Non-negotiable implementation principles

-   **KISS.** Prefer the simplest implementation that demonstrates the
    requested flows.
-   Build a **frontend-only** application. No backend, database,
    authentication provider, external AI service, or server-side
    business logic.
-   Do not implement a real account system. Use a sample-user selector /
    demo login to enter each role.
-   Do not add API keys, paid services, subscriptions, analytics SDKs,
    or external services that require credentials.
-   Use local mock data stored in ordinary JavaScript/JSON files.
    In-memory state is sufficient. `localStorage` may be used only for
    simple demo persistence, such as the selected user or a point edit.
-   Do not create an elaborate architecture, generic component
    framework, repository layer, service layer, or unnecessary
    abstractions.
-   Use a small, understandable project structure and a limited number
    of dependencies.
-   Use realistic interactions: navigation, buttons, filters, forms,
    modals/drawers, tabs, and feedback should work. Avoid decorative
    controls that do nothing.
-   Do not implement features outside the scope of this document.
-   Do not claim that prototype data is live, verified, or connected to
    a municipality.

## 3. Recommended technical implementation

Use the following unless the existing project already has a working
equivalent:

-   **Framework:** React + Vite.
-   **Language:** JavaScript (no TypeScript required).
-   **Styling:** plain CSS or the styling solution already present.
    Avoid adding a large UI framework solely for this prototype.
-   **Routing:** a lightweight client-side approach; React Router is
    acceptable if already installed. A small state-based view switcher
    is also acceptable.
-   **PWA:** `vite-plugin-pwa` (or an equally small Vite-compatible
    solution) with a web app manifest and service worker.
-   **Map:** **Leaflet + OpenStreetMap tiles**. No API key is required.
    Use the sample pin objects in Section 11. If map tiles cannot load,
    show a clear fallback with the same recycling points as a list.
-   **Deployment target:** Cloudflare Pages, as a static Vite build.

Do not add a backend or database to make the PWA work. The PWA
requirement is about installability and a basic app shell, not
server-side functionality.

## 4. Roles and demo access

Provide a landing page with a clear **"Explore demo"** action. The user
can then select one of the three sample profiles below. A role switcher
should remain available in the prototype (for example, in the profile
menu) so a reviewer can inspect all three experiences without logging
out or entering credentials.

  --------------------------------------------------------------------------------------
  Role              Sample user       Email shown in demo              Main destination
  ----------------- ----------------- -------------------------------- -----------------
  Citizen           Camila Rojas      camila.rojas@demo.ecoscan.cl     Citizen home

  Administrator     Diego Fuentes     diego.fuentes@demo.ecoscan.cl    Admin dashboard

  Municipality      Valentina Soto    valentina.soto@demo.ecoscan.cl   Municipality
                                                                       dashboard
  --------------------------------------------------------------------------------------

These are display-only demo identities. No password is required. Do not
imply that these credentials are real accounts.

### Role permissions in the UI

-   **Citizen:** scan, view scan history, browse the map and point
    details, submit mock feedback, view profile.
-   **Administrator:** view global dashboard, view all sample scans,
    create/edit/deactivate recycling points, inspect municipality
    overview.
-   **Municipality:** view only the sample municipality assigned to the
    selected profile, inspect its statistics and points, edit the
    municipality's sample point information.
-   Hide actions that do not belong to the active role. This is a UI
    demonstration, not a security boundary.

## 5. Information architecture and required screens

### 5.1 Public landing page (`/`)

Create a polished but restrained landing page that explains the product
and directs visitors into the demo.

Required sections: 1. Header with EcoScan wordmark and links to "How it
works", "Recycling points", and "About". 2. Hero section with headline,
supporting copy, primary CTA **"Explore the demo"**, and secondary CTA
**"How it works"**. 3. Three-step "How it works" section: Scan, Learn,
Recycle. 4. Feature section: visual identification, practical disposal
guidance, visible-contamination alerts, and nearby recycling points. 5.
Impact/context section that references the project's purpose without
claiming measured results. 6. Footer with a prototype disclaimer.

Use the exact copy in Section 12 as the baseline. Minor layout
adjustments are allowed; do not invent claims such as guaranteed
recognition accuracy or quantified environmental impact.

### 5.2 Demo user selection

Show the three sample profiles as clear cards. Each card must identify
its role and have an **"Continue as..."** button. Selecting a card
enters the corresponding experience immediately.

### 5.3 Citizen experience

Required screens/views:

-   **Home:** greeting, prominent scan CTA, recent scans, quick link to
    recycling map, and a small activity summary.
-   **Scan:** allow image selection and camera capture where supported.
    Display a preview. On "Analyze waste", show a short simulated
    loading state and then select a random result from the scan-result
    dataset in Section 10. The selected result must be internally
    consistent: material, confidence, contamination observation,
    preparation instructions, and accepted-point suggestions must come
    from the same result object.
-   **Scan result:** show the uploaded image preview, probable category,
    confidence indicator, visible-contamination observation,
    preparation/disposal instructions, and suitable nearby points.
    Include a clear note: "Simulation for prototype purposes --- not an
    actual AI analysis." Provide actions for "Find a recycling point",
    "Scan another item", and simple feedback ("Helpful" / "Report an
    issue").
-   **Scan history:** list sample previous scans with category, date,
    and result status. New simulated scans can be added to the current
    in-memory history.
-   **Recycling map:** Leaflet map with sample pins, list/map toggle,
    basic material filter, and point detail view. A point detail should
    show address, opening hours, accepted materials, and status.
-   **Profile:** sample identity, role, and role-switch action.

The scan should not require a real AI model. If no image is selected,
allow the user to use a clearly labelled sample image or a built-in
placeholder so the demonstration can continue.

### 5.4 Administrator experience

Required screens/views:

-   **Global dashboard:** KPI cards, scans over time, material
    distribution, visible-contamination observations, and
    recycling-point totals.
-   **Scans:** table/list of sample scan events with date, material,
    confidence, and status. Include simple filters for material and date
    range if practical.
-   **Recycling points:** searchable table/list with point name,
    municipality, status, accepted materials, and last-updated label.
-   **Point editor:** create or edit a sample point using a compact
    form. Changes only affect local demo state. Allow
    activating/deactivating a point.
-   **Municipalities:** overview of the sample municipalities and their
    point counts/activity. Selecting one opens its municipality detail.
-   **Profile / role switcher.**

Do not build advanced permissions, audit logs, exports, notifications,
or complex CRUD workflows.

### 5.5 Municipality experience

The municipality role is scoped to **Municipalidad de Providencia** for
the demo.

Required screens/views:

-   **Municipality dashboard:** scans in the municipality, material
    distribution, point count, active points, and a simple trend chart.
-   **Recycling points:** list/map of points assigned to Providencia.
-   **Point detail/editor:** edit hours, accepted materials, and
    operational status for that municipality's sample points.
-   **Recent activity:** a compact list of recent sample scans in the
    municipality.
-   **Profile / role switcher.**

The municipality dashboard must look distinct enough from the global
administrator dashboard to communicate its narrower scope, but should
reuse the same visual language.

## 6. Interaction and behaviour requirements

### Demo navigation

-   Provide a consistent sidebar or navigation pattern for dashboard
    roles and a mobile-friendly bottom navigation or compact menu for
    the citizen experience.
-   Show the active role clearly.
-   Provide a persistent way to return to profile selection / switch
    roles.
-   Avoid dead ends; every major screen should have a clear route back.

### Simulated scan behaviour

1.  User selects/captures an image.
2.  Show image preview and an enabled analyze button.
3.  On analyze, show a short loading animation (approximately 1--2
    seconds).
4.  Choose one result randomly from Section 10.
5.  Render that result's complete data consistently.
6.  Add the event to the current session's scan history and update
    visible demo counters where appropriate.
7.  Do not upload or store the selected image remotely.

The random result is for demonstrating UI states only. Do not describe
it as machine-learning inference. If a confidence value is shown, label
it as a simulated confidence score.

### Feedback

"Helpful" and "Report an issue" should produce visible confirmation
feedback. No network request is made and no real report is submitted.

### Point management

Forms should validate required fields and update local state. Include a
simple success message after saving. A page refresh may restore the
original seed data unless `localStorage` persistence is already
implemented simply.

## 7. Visual direction and UX

-   Modern, clean environmental-tech product.
-   Prioritize clarity and usability over visual effects.
-   Use a light theme as the default. A dark theme is optional and
    should not delay core functionality.
-   Suggested palette:
    -   Primary forest green: `#176B4D`
    -   Deep green: `#104C38`
    -   Accent lime: `#B8D96B`
    -   Background: `#F6F8F5`
    -   Surface: `#FFFFFF`
    -   Main text: `#1E2A24`
    -   Secondary text: `#66736B`
    -   Border: `#E1E8E2`
    -   Warning: `#D99A32`
    -   Error: `#C94B45`
-   Use readable typography, generous spacing, restrained rounded
    corners, and clear visual hierarchy.
-   Use consistent status labels: Active, Inactive, Needs review.
-   Use accessible contrast, visible focus states, semantic controls,
    and labels for form fields.
-   Make the experience responsive: mobile-first for citizens;
    desktop-friendly for dashboards.
-   Use charts only where they help explain sample data. Simple bar/line
    charts are sufficient; do not add a complex analytics library if CSS
    or a small chart library already covers the need.
-   Do not overuse gradients, glassmorphism, animations, or oversized
    decorative illustrations.

## 8. PWA requirements

The app must be installable as a basic PWA:

-   Include `manifest.webmanifest` with name "EcoScan", short name
    "EcoScan", start URL `/`, standalone display, theme/background
    colors, and appropriate icons.
-   Register a service worker and cache the app shell/static assets so
    the interface can open after it has been loaded once.
-   Provide a minimal offline fallback if the browser is offline.
    Clearly indicate that the map tiles may not be available offline.
-   Do not promise that live OpenStreetMap tiles are cached or available
    offline.
-   Include an install prompt/help affordance only where the browser
    supports it. Do not make installation a blocker.
-   Verify that the production build works when served from Cloudflare
    Pages.

## 9. Search-engine indexing restriction

This is a private demonstration prototype and should not appear in
Google search results.

Implement all of the following:

1.  Add this tag to the HTML document `<head>`:

    ``` html
    <meta name="robots" content="noindex, nofollow, noarchive">
    ```

2.  Add a `public/robots.txt` file containing:

    ``` txt
    User-agent: *
    Allow: /
    ```

    **Important:** do not disallow crawling in `robots.txt`, because
    crawlers need to access the page to read the `noindex` directive.

3.  If Cloudflare Pages configuration permits it without unnecessary
    complexity, add an `_headers` file with:

    ``` txt
    /*
      X-Robots-Tag: noindex, nofollow, noarchive
    ```

4.  Confirm the built HTML contains the meta tag and the deployed
    response includes the header if configured.

`noindex` is a request to compliant search engines, not access control.
It does not make the site private or password-protected. Anyone with the
URL may still access the prototype. Do not add authentication just to
prevent indexing.

## 10. Mock data --- scan results and scan history

All data in this section is fictional and exists only for the prototype.
Store it in a simple local data file.

### 10.1 Material catalogue

  -------------------------------------------------------------------------
  ID                Material          Category          Preparation
                                                        guidance
  ----------------- ----------------- ----------------- -------------------
  PET               PET plastic       Plastic           Empty, rinse if
                                                        needed, and flatten
                                                        if local point
                                                        instructions allow.

  HDPE              HDPE plastic      Plastic           Empty and rinse;
                                                        check the point's
                                                        accepted plastics.

  PAPER             Paper and         Paper             Keep dry and remove
                    cardboard                           food-contaminated
                                                        sections.

  GLASS             Glass             Glass             Empty and rinse;
                                                        handle broken glass
                                                        according to local
                                                        guidance.

  ALU               Aluminium can     Metal             Empty and rinse;
                                                        flatten only if
                                                        accepted by the
                                                        receiving point.

  CARTON            Beverage carton   Composite         Empty, rinse, and
                                      packaging         flatten. Acceptance
                                                        varies by point.

  ORGANIC           Organic waste     Organic           Use a suitable
                                                        organic-waste
                                                        collection or
                                                        composting option;
                                                        do not place in a
                                                        standard recycling
                                                        container.

  UNKNOWN           Uncertain / mixed Other             The image is not
                    material                            sufficient for a
                                                        confident
                                                        classification.
                                                        Check local
                                                        guidance.
  -------------------------------------------------------------------------

### 10.2 Random scan result pool

When the user scans, randomly select one of these complete result
objects. Keep all fields in the selected object together.

``` js
export const scanResults = [
  {
    id: "scan-pet",
    materialId: "PET",
    material: "PET plastic",
    category: "Plastic",
    confidence: 96,
    condition: "Looks clean",
    visibleContamination: false,
    contaminationNote: "No visible food or liquid residue detected in this simulated example.",
    recommendation: "Recyclable at participating collection points.",
    instructions: [
      "Empty the bottle completely.",
      "Rinse if residue remains.",
      "Flatten the bottle if the receiving point allows it.",
      "Keep the cap separate if required by the local point."
    ],
    acceptedMaterialIds: ["PET"],
    resultStatus: "Recyclable"
  },
  {
    id: "scan-aluminium",
    materialId: "ALU",
    material: "Aluminium can",
    category: "Metal",
    confidence: 93,
    condition: "Looks clean",
    visibleContamination: false,
    contaminationNote: "No visible residue detected in this simulated example.",
    recommendation: "Suitable for metal collection at participating points.",
    instructions: [
      "Empty the can.",
      "Rinse if necessary.",
      "Check whether the receiving point asks you to flatten cans."
    ],
    acceptedMaterialIds: ["ALU"],
    resultStatus: "Recyclable"
  },
  {
    id: "scan-paper",
    materialId: "PAPER",
    material: "Paper and cardboard",
    category: "Paper",
    confidence: 89,
    condition: "Possible contamination",
    visibleContamination: true,
    contaminationNote: "A visible stain is present. This is only a visual observation; the image cannot determine the full extent of contamination.",
    recommendation: "Separate clean sections from stained or food-contaminated sections.",
    instructions: [
      "Keep clean paper and cardboard dry.",
      "Remove sections with visible food or grease.",
      "Check the point's accepted paper types."
    ],
    acceptedMaterialIds: ["PAPER"],
    resultStatus: "Check condition"
  },
  {
    id: "scan-glass",
    materialId: "GLASS",
    material: "Glass bottle",
    category: "Glass",
    confidence: 94,
    condition: "Looks clean",
    visibleContamination: false,
    contaminationNote: "No visible residue detected in this simulated example.",
    recommendation: "Suitable for glass collection at participating points.",
    instructions: [
      "Empty and rinse the bottle.",
      "Do not include ceramics, mirrors, or window glass unless explicitly accepted.",
      "Handle broken glass carefully and follow local instructions."
    ],
    acceptedMaterialIds: ["GLASS"],
    resultStatus: "Recyclable"
  },
  {
    id: "scan-carton",
    materialId: "CARTON",
    material: "Beverage carton",
    category: "Composite packaging",
    confidence: 84,
    condition: "Needs preparation",
    visibleContamination: false,
    contaminationNote: "No visible contamination detected in this simulated example.",
    recommendation: "Acceptance depends on the receiving point.",
    instructions: [
      "Empty the carton completely.",
      "Rinse it and allow excess water to drain.",
      "Flatten it.",
      "Confirm that the selected point accepts beverage cartons."
    ],
    acceptedMaterialIds: ["CARTON"],
    resultStatus: "Check local acceptance"
  },
  {
    id: "scan-unknown",
    materialId: "UNKNOWN",
    material: "Uncertain / mixed material",
    category: "Other",
    confidence: 42,
    condition: "Uncertain",
    visibleContamination: false,
    contaminationNote: "The image does not provide enough visual information to assess contamination.",
    recommendation: "EcoScan cannot classify this item confidently in this simulated example.",
    instructions: [
      "Try another photo with better lighting and a plain background.",
      "If the item combines different materials, check local disposal guidance.",
      "Do not assume that the item is recyclable based on this result."
    ],
    acceptedMaterialIds: [],
    resultStatus: "Uncertain"
  }
];
```

### 10.3 Sample scan history

Use these as initial citizen history and as a source for dashboard
aggregates:

  -------------------------------------------------------------------------------------
  ID        User      Material    Date/time      Confidence Status       Municipality
  --------- --------- ----------- ------------ ------------ ------------ --------------
  H001      Camila    PET plastic 2026-11-10            96% Recyclable   Providencia
            Rojas                 09:42                                  

  H002      Camila    Paper and   2026-11-09            89% Check        Providencia
            Rojas     cardboard   18:15                     condition    

  H003      Camila    Aluminium   2026-11-08            93% Recyclable   Providencia
            Rojas     can         13:07                                  

  H004      Martín    Glass       2026-11-10            94% Recyclable   Ñuñoa
            Pérez     bottle      10:21                                  

  H005      Martín    Uncertain / 2026-11-09            42% Uncertain    Ñuñoa
            Pérez     mixed       16:32                                  
                      material                                           

  H006      Sofía     Beverage    2026-11-10            84% Check local  Santiago
            Morales   carton      08:54                     acceptance   

  H007      Sofía     PET plastic 2026-11-08            97% Recyclable   Santiago
            Morales               11:40                                  

  H008      Camila    Glass       2026-11-07            91% Recyclable   Providencia
            Rojas     bottle      17:22                                  

  H009      Martín    Paper and   2026-11-07            76% Check        Ñuñoa
            Pérez     cardboard   12:18                     condition    

  H010      Sofía     Aluminium   2026-11-06            95% Recyclable   Santiago
            Morales   can         15:03                                  

  H011      Camila    Beverage    2026-11-05            82% Check local  Providencia
            Rojas     carton      19:10                     acceptance   

  H012      Martín    PET plastic 2026-11-05            92% Recyclable   Ñuñoa
            Pérez                 09:26                                  
  -------------------------------------------------------------------------------------

Dates are sample dates, not live events. Display dates in a readable
Chilean format (e.g. `10 nov 2026`).

## 11. Mock data --- recycling points and map pins

### 11.1 Map provider

Use **Leaflet** with **OpenStreetMap** standard tiles. This avoids API
keys for the prototype. Use OpenStreetMap attribution in the map UI. Do
not use a proprietary map SDK or require a token.

Tile URL:

``` txt
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 11.2 Sample point objects

These are fictional demonstration records. Coordinates are approximate
map-placement coordinates in Santiago and must not be represented as
verified real recycling facilities. Use the `lat` and `lng` values
directly to create Leaflet markers.

``` js
export const recyclingPoints = [
  {
    id: "PVD-001",
    name: "Punto Verde Plaza Central",
    municipality: "Providencia",
    address: "Sector Plaza de la Aviación, Providencia, Santiago",
    lat: -33.4289,
    lng: -70.6168,
    openingHours: "Mon–Fri 09:00–18:00; Sat 10:00–14:00",
    acceptedMaterialIds: ["PET", "HDPE", "PAPER", "ALU", "GLASS"],
    status: "Active",
    lastUpdated: "2026-11-08",
    description: "Sample neighbourhood recycling point for the EcoScan demonstration."
  },
  {
    id: "PVD-002",
    name: "Estación de Reciclaje Los Leones",
    municipality: "Providencia",
    address: "Sector Metro Los Leones, Providencia, Santiago",
    lat: -33.4215,
    lng: -70.6097,
    openingHours: "Mon–Fri 08:30–17:30",
    acceptedMaterialIds: ["PET", "HDPE", "ALU", "CARTON"],
    status: "Active",
    lastUpdated: "2026-11-07",
    description: "Sample collection point with a limited packaging catalogue."
  },
  {
    id: "PVD-003",
    name: "Punto Limpio Parque Inés de Suárez",
    municipality: "Providencia",
    address: "Sector Parque Inés de Suárez, Providencia, Santiago",
    lat: -33.4372,
    lng: -70.6112,
    openingHours: "Tue–Sun 10:00–18:00",
    acceptedMaterialIds: ["PET", "PAPER", "GLASS", "ALU"],
    status: "Active",
    lastUpdated: "2026-11-06",
    description: "Sample point near a public park."
  },
  {
    id: "NUN-001",
    name: "Punto Verde Plaza Ñuñoa",
    municipality: "Ñuñoa",
    address: "Sector Plaza Ñuñoa, Ñuñoa, Santiago",
    lat: -33.4548,
    lng: -70.5977,
    openingHours: "Mon–Sat 09:00–17:00",
    acceptedMaterialIds: ["PET", "HDPE", "PAPER", "ALU", "GLASS"],
    status: "Active",
    lastUpdated: "2026-11-09",
    description: "Sample point for the administrator's multi-municipality view."
  },
  {
    id: "STG-001",
    name: "Estación Verde Parque O'Higgins",
    municipality: "Santiago",
    address: "Sector Parque O'Higgins, Santiago",
    lat: -33.4635,
    lng: -70.6622,
    openingHours: "Mon–Fri 09:00–17:00",
    acceptedMaterialIds: ["PET", "PAPER", "ALU", "CARTON"],
    status: "Active",
    lastUpdated: "2026-11-05",
    description: "Sample point for the administrator's multi-municipality view."
  },
  {
    id: "PVD-004",
    name: "Punto de Reciclaje Barrio Italia",
    municipality: "Providencia",
    address: "Sector Barrio Italia, Providencia, Santiago",
    lat: -33.4470,
    lng: -70.6250,
    openingHours: "Mon–Fri 10:00–17:00",
    acceptedMaterialIds: ["PAPER", "GLASS"],
    status: "Needs review",
    lastUpdated: "2026-10-28",
    description: "Sample point included to demonstrate the Needs review status."
  }
];
```

**Implementation note:** All coordinates are approximate demo placements
and are not verified facility locations.

### 11.3 Map behaviour

-   Initial map view should centre on Providencia, Santiago
    (approximately `[-33.426, -70.615]`).
-   Fit bounds to visible markers when a filter is applied.
-   Marker click opens a small popup; selecting the point opens a detail
    panel/card.
-   Filters: municipality, accepted material, and operational status.
-   Provide a list view for accessibility and for map-load failure.
-   The municipality role sees only Providencia points.
-   The citizen can see all sample points, with nearby Providencia
    points emphasized by default.
-   Display a persistent note: "Demo locations --- not verified
    operational facilities."

## 12. Landing page copy

Use this copy as the initial Spanish-language landing page content. Keep
the UI language Spanish throughout the prototype for consistency.

### Header

-   Product: **EcoScan**
-   Navigation: **Cómo funciona** · **Puntos de reciclaje** · **Sobre
    EcoScan**
-   CTA: **Explorar demo**

### Hero

**Headline:**\
"Reciclar mejor empieza por identificar correctamente."

**Supporting text:**\
"EcoScan te ayuda a reconocer residuos, conocer cómo prepararlos para su
reciclaje y encontrar puntos de recepción cercanos."

**Primary CTA:**\
"Explorar demo"

**Secondary CTA:**\
"Cómo funciona"

**Small disclaimer:**\
"Prototipo demostrativo. Las identificaciones y ubicaciones mostradas
son datos de ejemplo."

### How it works

**Section title:** "Una decisión más simple en tres pasos"

1.  **Escanea**\
    "Toma una fotografía del residuo o selecciona una imagen desde tu
    dispositivo."
2.  **Aprende**\
    "Conoce su clasificación probable, las condiciones de preparación y
    posibles indicios visibles de contaminación."
3.  **Encuentra dónde reciclar**\
    "Consulta puntos de reciclaje y revisa qué materiales reciben."

### Features

**Section title:** "Información útil antes de desechar"

-   **Identificación visual** --- "Obtén una clasificación probable del
    material a partir de una imagen."
-   **Orientación práctica** --- "Revisa cómo vaciar, limpiar o preparar
    un residuo antes de entregarlo."
-   **Alertas visibles** --- "Identifica posibles restos o manchas
    visibles. Una imagen no permite detectar contaminantes ocultos."
-   **Puntos de reciclaje** --- "Consulta ubicaciones, horarios y
    materiales aceptados según la información disponible."

### Impact/context section

**Title:** "Pequeñas decisiones que pueden mejorar la separación"

**Text:**\
"Una separación adecuada desde el origen puede facilitar la recuperación
de materiales y reducir errores en las etapas posteriores de gestión.
EcoScan busca apoyar esa primera decisión con información clara y
accesible."

### Footer

"EcoScan --- Prototipo académico de demostración."

"Las funciones, resultados de escaneo, estadísticas y ubicaciones de
esta versión son simulados. No representan un servicio operativo ni
información municipal validada."

## 13. Sample dashboard statistics

These are fictional figures for visual demonstration only. Label them as
sample/demo data where appropriate.

### 13.1 Global administrator dashboard

Use these initial KPI values:

  Metric                      Value Supporting label
  ------------------------- ------- --------------------------------
  Total scans                 1,284 Demo records
  Scans this month              246 November 2026
  Active recycling points        18 Across 3 sample municipalities
  Registered citizens           436 Sample users
  Recyclable results            78% Simulated scan outcomes
  Results needing review        14% Simulated scan outcomes
  Uncertain results              8% Simulated scan outcomes

Material distribution: - Plastic: 38% - Paper: 24% - Glass: 16% - Metal:
12% - Composite packaging: 7% - Other / uncertain: 3%

Sample monthly scan trend: \| Month \| Scans \| \|---\|---:\| \| Jun
2026 \| 112 \| \| Jul 2026 \| 146 \| \| Aug 2026 \| 173 \| \| Sep 2026
\| 198 \| \| Oct 2026 \| 209 \| \| Nov 2026 \| 246 \|

Municipality comparison: \| Municipality \| Scans \| Active points \|
\|---\|---:\|---:\| \| Providencia \| 482 \| 7 \| \| Ñuñoa \| 391 \| 6
\| \| Santiago \| 411 \| 5 \|

### 13.2 Municipality dashboard --- Providencia

  Metric                      Value
  ------------------------- -------
  Total scans                   482
  Scans this month               96
  Active recycling points         7
  Citizens participating        164
  Recyclable results            81%
  Results needing review        12%
  Uncertain results              7%

Material distribution: - Plastic: 41% - Paper: 22% - Glass: 17% - Metal:
11% - Composite packaging: 6% - Other / uncertain: 3%

Sample monthly trend: \| Month \| Scans \| \|---\|---:\| \| Jun 2026 \|
39 \| \| Jul 2026 \| 52 \| \| Aug 2026 \| 61 \| \| Sep 2026 \| 73 \| \|
Oct 2026 \| 80 \| \| Nov 2026 \| 96 \|

### 13.3 Citizen dashboard --- Camila Rojas

  Metric                       Value
  -------------------------- -------
  Total scans                     18
  This month                       6
  Recyclable results              14
  Needs review / uncertain         4
  Points viewed                    5

Use small, encouraging activity summaries without claiming environmental
impact (for example, do not convert scans into kilograms or CO₂ saved).

## 14. Suggested minimal project structure

Keep the structure compact. One possible arrangement:

``` txt
src/
  App.jsx
  main.jsx
  styles.css
  data/
    demoData.js
  components/
    Header.jsx
    Sidebar.jsx
    StatCard.jsx
    RecyclingMap.jsx
  pages/
    LandingPage.jsx
    DemoLogin.jsx
    CitizenHome.jsx
    ScanPage.jsx
    ScanResult.jsx
    ScanHistory.jsx
    RecyclingPoints.jsx
    AdminDashboard.jsx
    AdminPoints.jsx
    MunicipalityDashboard.jsx
public/
  manifest.webmanifest
  robots.txt
  _headers
  icons/
```

This is a suggestion, not a requirement. Combine files if that makes the
implementation simpler. Do not create folders for every component or
introduce architectural layers.

## 15. Acceptance criteria

The prototype is complete when all of the following are true:

### Core flow

-   [ ] Landing page displays the specified copy and both hero actions
    work.
-   [ ] Demo selection allows entry as Citizen, Administrator, and
    Municipality without credentials.
-   [ ] Each role lands on the correct home/dashboard.
-   [ ] A user can switch roles without refreshing the application.
-   [ ] Citizen can select/capture an image and see a simulated scan
    result.
-   [ ] Scan results are randomly selected from the provided dataset and
    remain internally consistent.
-   [ ] A new scan appears in the citizen's current-session history.
-   [ ] Citizen can browse points in a Leaflet map and list view.
-   [ ] Material filters and point detail views work.
-   [ ] Administrator can view global KPIs, charts, scan records,
    municipalities, and points.
-   [ ] Administrator can create/edit/deactivate a sample recycling
    point in local state.
-   [ ] Municipality user sees only Providencia data and can edit its
    sample points.
-   [ ] Feedback actions show a confirmation state.

### PWA and deployment

-   [ ] The app has a valid manifest and icons.
-   [ ] The service worker is registered and the app shell can reopen
    offline after an initial successful load.
-   [ ] Offline UI communicates that map tiles may be unavailable.
-   [ ] `npm run build` completes without errors.
-   [ ] The built site can be deployed as a static site to Cloudflare
    Pages.
-   [ ] `noindex` meta tag is present in the built HTML.
-   [ ] `robots.txt` allows crawling so search engines can read
    `noindex`.
-   [ ] `_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive` on
    the deployed site, if supported by the selected deployment setup.

### Quality

-   [ ] No real backend, database, AI model, API key, or paid service is
    required.
-   [ ] No controls are visibly broken or inert.
-   [ ] The UI is responsive on mobile and desktop.
-   [ ] Fictional data and simulated scan results are clearly disclosed.
-   [ ] No production-readiness or real-world accuracy claims are made.

## 16. Explicitly out of scope

Do not implement:

-   Real authentication, registration, password recovery, or user
    management.
-   Backend, database, API server, or cloud functions.
-   Real computer vision, machine learning, or image classification.
-   Real scan uploads or remote image storage.
-   Real municipal integrations or verified recycling-point feeds.
-   Real geolocation tracking or routing/navigation.
-   Notifications, email, chat, social features, or payment flows.
-   Advanced reporting, exports, audit logs, or permission-management
    systems.
-   Production-grade security architecture.
-   A scalable foundation intended for later production development.

## 17. Final instruction to Claude

Build the working prototype described in this document. Prioritize a
complete, coherent demonstration of the three roles and their main user
journeys over technical sophistication. Use the supplied mock data and
landing-page copy. Where a detail is not specified, choose the simplest
reasonable implementation and keep it consistent with the prototype-only
scope.

Do not ask for clarification unless a missing detail prevents
implementation. Do not expand the scope. Do not replace the mock scan
flow with a real AI integration. Do not introduce a backend or database.
The final result should be runnable locally with a short README
containing only the required install, development, build, and Cloudflare
Pages deployment commands.
