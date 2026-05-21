# LexFeedback · Demo Académica

Plataforma web para que el **Profesor David Quintero Fuentes** (Filosofía del Derecho, PUCV) genere retroalimentaciones individuales en PDF a partir de textos ya corregidos.

Demo creada por **Diego Ojeda**, Ayudante de Filosofía del Derecho PUCV.

---

## Características

- Ingreso manual de: nombre del estudiante, número de prueba, puntaje total
- Conversión automática de puntaje a nota según tres escalas (51%, 60%, 65%)
- Matriz de notas integrada en el código — **no requiere cargar ningún archivo Excel**
- Nota final editable manualmente (con opción de restaurar la automática)
- Exportación a PDF formal, con soporte para textos largos y paginación automática
- Botón "Limpiar para siguiente estudiante" que conserva escala y fecha
- Sin backend · Sin login · Sin envío de datos externos
- Procesamiento 100% local en el navegador

---

## Stack

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | UI y lógica |
| Vite 6 | Bundler |
| TailwindCSS 3 | Estilos |
| jsPDF | Generación de PDF |
| Lucide React | Íconos |

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

---

## Despliegue en Vercel

### Opción 1 — Interfaz web de Vercel

1. Sube el proyecto a un repositorio GitHub
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio
3. Vercel detecta Vite automáticamente:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Haz clic en **Deploy**

### Opción 2 — CLI de Vercel

```bash
npm i -g vercel
vercel
```

Responde las preguntas del asistente. El proyecto no requiere variables de entorno.

---

## Estructura del proyecto

```
lexfeedback/
├── src/
│   ├── data/
│   │   └── gradeScale.ts      # Matriz de notas (0–100 × 3 escalas)
│   ├── utils/
│   │   └── pdfExport.ts       # Generación de PDF con jsPDF
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── EvaluationForm.tsx
│   │   ├── FeedbackPanel.tsx
│   │   ├── DocumentPreview.tsx
│   │   ├── ActionButtons.tsx
│   │   └── Footer.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig*.json
└── package.json
```

---

## Notas de uso

- La escala **51%** viene seleccionada por defecto
- El puntaje debe ingresarse **manualmente** (la app no lo detecta desde el texto)
- La nota se puede editar manualmente; un badge indica si fue "auto" o "manual"
- El PDF respeta los saltos de línea del texto pegado
- Los datos no se almacenan ni se envían a ningún servidor

---

*LexFeedback — Demo académica · PUCV · Filosofía del Derecho*
