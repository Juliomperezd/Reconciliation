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
| `/` | `PathSelectorPage` (landing con 3 botones) |
| `/path1` | `DailyReportsPage` — Variante A |
| `/path2` | `DailyReportsPage` — Variante B |
| `/path3` | `DailyReportsPage` — Variante C |
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
    panels/
      CommentsPanel.jsx            — Drawer derecho, hideBackdrop, sin overlay oscuro
      HelpPanel.jsx                — Drawer derecho, fondo rosa #FFF0F8, hideBackdrop
    gallery/
      GalleryPage.jsx              — catálogo visual de todos los componentes (ruta /gallery)
    paths/
      PathSelectorPage.jsx         — landing /. Tres cards para elegir Path1/2/3. Sin AppLayout.
      PathNavigator.jsx            — widget negro fijo bottom-left. Botones P1/P2/P3 con tooltip.
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
