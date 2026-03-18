# Reconciliation Dashboard — CLAUDE.md

## Qué es este proyecto
Prototipo frontend de un dashboard de reconciliación para restaurantes ("Bouillon"). Una SPA con datos dummy, sin backend. Pantalla principal: **Daily Reports**. La página de Operations existe pero no está en la nav.

## Stack
- **Vite + React** (JSX, no TypeScript)
- **MUI v5** (`@mui/material`, `@mui/icons-material`)
- **react-router-dom** v6
- Sin backend, sin tests, sin estado global (todo local con `useState`)
- Fuente: **Helvetica Neue** (forzada globalmente via `MuiCssBaseline` con `!important`)

## Arrancar
```bash
npm run dev        # http://localhost:5173
```

## Rutas
| URL | Componente |
|---|---|
| `/` | `PathSelectorPage` (landing con 4 botones) |
| `/path1` | `DailyReportsPage` — Variante A |
| `/path2` | `DailyReportsPage` — Variante B |
| `/path3` | `DailyReportsPage` — Variante C |
| `/path4` | `DailyReportsPageTasks` — Variante con TasksPanel |
| `/path{N}/tender/:id` | `TenderDetailPage` |
| `/path{N}/operations` | `OperationsPage` |
| `/gallery` | `GalleryPage` (sin AppLayout) |

## Estructura de carpetas
```
src/
  App.jsx                          — ThemeProvider + BrowserRouter + Routes + PathProvider
  theme.js                         — colores de marca + Helvetica Neue global
  data/dummy.js                    — todos los datos (days, tenders, operations, comments…)
  contexts/PathContext.jsx         — PathProvider + useCurrentPath(). Guarda path activo en localStorage.
  hooks/useUIState.js              — hook extraído para estado de UI (sin uso activo; DailyReportsPage usa useState directo)
  components/
    layout/
      AppLayout.jsx                — wrapper flex, AppBar móvil blanco
      Sidebar.jsx                  — fondo blanco, estilo "Uptown" (item activo = rosa claro)
                                     Solo tiene Daily Reports en nav. Bottom: Guides & QA, Settings.
      FloatingActionBar.jsx        — fija en bottom center. Help/Comments/Validate en vertical.
                                     Se desplaza al centro del espacio restante cuando un panel está abierto (prop panelOpen).
    daily-reports/
      DailyReportsPage.jsx         — contiene TODO el estado: tenders, comments, días, modals, panels
      DateStrip.jsx                — últimos 7 días + "See all". Sin overflow scroll, flex sin gap fijo 8px.
      DayCard.jsx                  — flex:1, borde negro seleccionado (1.5px), sin sombra, número 24px
      DeltaCell.jsx                — Chip naranja si delta≠0, CheckCircle verde si delta=0
      DiscrepancyAlert.jsx         — fondo negro #1A1A2E, botones blancos invertidos
      TenderTable.jsx              — tabla + "Add tender line" (inline-flex, izquierda, sin borde dashed)
      TenderRow.jsx                — comportamiento dual:
                                     · sunday-qr / sunday-pdq → toda la fila navega a /tender/:id
                                     · resto → click en nombre abre AddTenderModal (edición), click en
                                       Total Declared edita inline. Pill con importe POS aparece al
                                       hover sobre la celda declared (opacity transition, minWidth 72px
                                       para alineación). Spacer invisible 72px en filas sin pill.
                                       Snackbar "Done" negro 80% opacidad al aplicar pill.
      TenderDetailPage.jsx         — página interior Sunday tenders (título + back, pendiente de contenido)
    operations/
      OperationsPage.jsx, OperationsTable.jsx, OperationRow.jsx
    modals/
      DatePickerModal.jsx          — Dialog con lista de días filtrables
      AddTenderModal.jsx           — Sirve para AÑADIR y EDITAR tenders (prop initialValues).
                                     Layout: emoji (cuadrado gris, hover=pencil, click=emoji keyboard)
                                     encima, nombre debajo. ChipInput para POS Tender IDs (add/remove).
                                     Botón negro pill (borderRadius: 100).
      SundayAIModal.jsx            — loading stepper → acordeón de gaps → Snackbar con Undo
      ReportModal.jsx              — Modal de reporte AI (path3 y path4). Dos columnas cuando se abre
                                     un issue: izquierda = report, derecha = panel detalle (420px, fondo gris).
                                     Header con mesh gradient + AI.svg + título "Discrepancies report".
                                     Issues como filas clickeables con DeltaPill + done circle.
                                     Panel detalle cierra con ChevronLeft. Close principal siempre top-right.
    panels/
      CommentsPanel.jsx            — Drawer derecho, hideBackdrop, sin overlay oscuro
      HelpPanel.jsx                — Drawer derecho, fondo rosa #FFF0F8, hideBackdrop
    tasks/
      TasksPanel.jsx               — Panel lateral derecho en path4. NavPill Tasks/Comments.
                                     Task 1: "Review non-sunday tenders" — delta de no-sunday, botón
                                       "Declare same as POS" (gris claro) → marca done + confetti.
                                     Task 2: "Analyze discrepancies" — mesh gradient + AI.svg subtitle.
                                       Botones: "Let sundayAI solve it" (#FF17E9 sólido) + "Run analysis" (negro).
                                       Delta = sunday-qr + sunday-pdq. Loading spinner en done circle.
                                     Tasks 3-5: aparecen post-análisis (sub-tasks con delta por tender).
                                     Task final: "Add a comment for your team" → va a tab Comments.
                                     Validate button con check icon, siempre negro.
                                     DeltaBadge: pill naranja €XX.XX sin +/-.
    gallery/
      GalleryPage.jsx              — catálogo visual de todos los componentes (ruta /gallery)
    paths/
      PathSelectorPage.jsx         — landing /. Cuatro cards para elegir Path1/2/3/4. Sin AppLayout.
      PathNavigator.jsx            — widget negro fijo bottom-left. Botones P1/P2/P3/P4 con tooltip.
                                     Aparece en todos los paths (renderizado en AppLayout).
                                     Path activo resaltado en rosa. Usa useCurrentPath().
```

## Tema (theme.js)
```js
primary:    #E91E8C   // rosa (marca Bouillon)
secondary:  #1A1A2E   // azul noche (Validate, DiscrepancyAlert, sidebar nav activo)
warning:    #FF9800   // naranja (chips de delta)
success:    #4CAF50   // verde (checkmarks)
background: #F5F5F7   // gris claro (fondo de página)
```

## Colores AI / sundayAI
- **#FF17E9** — rosa vivo sundayAI (botones primarios AI, base del mesh gradient)
- **Mesh gradient**: `radial-gradient(ellipse at 0% 0%, rgba(255,23,233,0.13)…)` + rosa + ámbar sobre `#fff`
- **Gradient texto**: `linear-gradient(90deg, #FF17E9, #E91E8C, #FFB800)` con WebkitBackgroundClip
- **AI.svg** en `/Images/AI.svg` — usado como subtitle en Task 2 y header del ReportModal
- **DeltaCell** (tabla): círculo verde relleno + Check blanco cuando delta=0 (no CheckCircle)
- **DeltaBadge** (tasks): pill naranja `rgba(251,146,60,0.13)` sin signo +/-

## Flujos interactivos path4 (DailyReportsPageTasks)
- **Run analysis / Let sundayAI solve it** — floating banner top-right con mesh gradient, spinner rosa → check verde → se cierra tras 2.5s. ReportModal se abre automáticamente.
- **Declare same as POS** — aplica totalInToast a todos los no-sunday tenders, marca Task 1 done + confetti.
- **ReportModal issues** — filas clickeables abren panel derecho (420px gris); done circle en cada fila; "Mark as done" en footer del panel.

## Datos (data/dummy.js)
Exports: `days`, `tenders`, `operations`, `initialComments`, `sundayAIGaps`, `helpCards`, `posTenders`

- `days[]` — 10 días (1–10 marzo 2026), el día 10 es `isToday: true`
- `tenders[]` — 7 tenders, cada uno con `posId` técnico (e.g. `CASH_TENDER`, `GIFT_COIN_INTERNAL`)
- `operations[]` — 8 operaciones, 3 con `hasIssue: true`

## Convenciones importantes
- **Ajustes visuales siempre en el componente**, nunca en la página que lo usa.
- **No TypeScript**, no propTypes, no JSDoc. El código es limpio y directo.
- **No crear helpers o abstracciones** para casos de uso únicos.
- Los modales y paneles se renderizan en `DailyReportsPage`, no en el root del app.
- `GalleryPage` es independiente del `AppLayout` (no tiene sidebar de Bouillon).
- `hideBackdrop + disableScrollLock` en todos los Drawers de paneles para no oscurecer la UI.

## Flujos interactivos clave
1. **Edición inline de tender** (no-Sunday) — hover sobre celda "Total Declared" muestra pill con importe POS; click en pill aplica directamente + Snackbar "Done"; click en importe → TextField
2. **Editar tender** (no-Sunday) — click en nombre del tender → `AddTenderModal` pre-rellenado con nombre, emoji y posId
3. **Navegar a detalle** (Sunday QR / Sunday PDQ) — click en cualquier parte de la fila → `/tender/:id`
4. **SundayAI** — `DiscrepancyAlert` → modal 3 pasos carga → acordeón gaps → "Solve" → comment IA + Snackbar Undo
5. **Validate** — `FloatingActionBar` → `validated=true` → botón verde deshabilitado
6. **Panels sin overlay** — `CommentsPanel` y `HelpPanel` abren sin backdrop; `FloatingActionBar` se desplaza al centro del espacio restante (prop `panelOpen`)
