# EcoScan — prototipo demostrativo

Prototipo frontend (React + Vite + PWA) con datos ficticios. Ver `spec.md` para el alcance.

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo
npm run build      # build estático en dist/
npm run preview    # probar el build localmente
```

## Despliegue en Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

Alternativa por CLI: `npx wrangler pages deploy dist`
