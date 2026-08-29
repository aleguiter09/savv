---
target: la landing
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-29T11-10-35Z
slug: src-modules-landing-pages-landingpage-tsx
---
Method: dual-agent (A: 9d5f08a0 · B: 8c5fcce8)

# Critique — Savv Landing

**Target:** `src/modules/landing/pages/LandingPage.tsx`  
**Mode:** Persuade  
**Browser:** overlay no disponible (tabs MCP fallaron; localhost:3001 responde 200). Revisión visual A/B desde fuente + HTTP.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Nav anclas sin estado activo al scrollear |
| 2 | Match System / Real World | 3 | Voz LATAM fuerte; fugas: Cashflow, Patrimonio/Net Worth, Badge "Roadmap" en ES |
| 3 | User Control and Freedom | 3 | Salidas claras; "Ver cómo funciona" es desvío suave |
| 4 | Consistency and Standards | 3 | FeatureGrid consistente; Planning/FinalCta cambian de sistema; CTA "Empezar gratis" vs "Crear cuenta" |
| 5 | Error Prevention | 2 | Roadmap honesto ayuda; mocks con affordances falsas (Ver todos, chevron) |
| 6 | Recognition Rather Than Recall | 2 | `previewLabel` no se renderiza — el mock no se anuncia como Home |
| 7 | Flexibility and Efficiency | n/a | Persuade |
| 8 | Aesthetic and Minimalist Design | 2 | Tokens limpios; contenido enciclopedia (5 nav + 4 secciones densas + roadmap) |
| 9 | Error Recovery | 2 | Sin errores in-page; clic en mock decorativo sin feedback |
| 10 | Help and Documentation | n/a | Persuade |
| **Total** | | **19/32** | **Acceptable (~59%)** |

## Design Specificity Verdict

**LLM:** Canon fintech deliberado (gris/blanco, blue-600, shadcn, hero split + features + steps + CTA azul). Cumple el brief, pero es intercambiable: quitá "Savv" y el logo y podría vender cualquier tracker multi-cuenta. El momento más propio es `HeroDashboardMock` (saldo total, mes, cuentas, últimos movimientos) — fiel a Home. Lo diluye: `previewLabel` sin usar, `AccountsPreviewMock` casi duplica el hero, Analytics con 5 bullets, Planning/Roadmap a mitad de funnel, brand solo en header (no hero-level). Craft bar Nubank/MP/Wise no se alcanza: mock inset, no escenario de producto dominante.

**Detector:** 0 findings (exit 0) en `src/modules/landing` + `src/app/(marketing)`. Limpio mecánicamente; los problemas son de historia/IA/jerarquía, no de anti-patterns CSS detectables.

**Overlays:** No hay overlay confiable en el browser. Fallback: CLI limpio + revisión de fuente.

## Overall Impression

Landing disciplinado y honesto (sin testimonios inventados, mock de Home real, roadmap declarado). Persuade como ficha de producto: sistema ordenado, historia sobrecargada, marca débil. Mayor oportunidad: destilar el primer viewport y el desfile de features para que el mock de Home + un CTA de registro carguen el viaje emocional.

## What's Working

1. **HeroDashboardMock producto-verdadero** — saldo, ingresos/gastos del mes, cuentas, movimientos con transferencia en gris; alinea con "demostrar el producto".
2. **Honestidad de constraints** — nota de transferencias + available vs roadmap dashed; no inventa prueba social.
3. **Disciplina de sistema** — blue-600, semántica verde/rojo, header sticky + Sheet mobile, path claro a `/register`.

## Priority Issues

### [P1] Hero como inventario, no como tesis de marca
- **Why:** Subtítulo lista saldo, mes, movimientos, categorías, presupuestos y pagos; mock inset `max-w-md`; Savv solo en nav.
- **Fix:** Una promesa + una línea; mostrar `previewLabel`; mock Home a escala craft-bar.
- **Suggested:** `/impeccable distill`

### [P1] Carga cognitiva alta (enciclopedia)
- **Why:** 5 anclas + Accounts/Movements/Analytics (4–5 bullets) + roadmap + how-it-works → 6/8 fallos en checklist de cognitive load.
- **Fix:** ≤3 anclas; Analytics ≤3 proofs; roadmap fuera del camino principal o post-CTA.
- **Suggested:** `/impeccable quieter` (o `/impeccable distill`)

### [P1] Mundo visual intercambiable vs craft bar
- **Why:** Card stack shadcn + Lucide rows + wash azul = SaaS fintech genérico, no teatro de producto.
- **Fix:** Dentro de la paleta canon, subir el escenario del producto, jerarquía tipográfica, menos sameness de icon-grids.
- **Suggested:** `/impeccable bolder`

### [P2] Mocks con affordances de UI viva
- **Why:** "Ver todos", ChevronDown, dots de categoría parecen clicables; contenedor `aria-hidden`.
- **Fix:** Frame de preview con `previewLabel`; silenciar controles falsos.
- **Suggested:** `/impeccable polish`

### [P2] Roadmap crea valle emocional mid-funnel
- **Why:** Tras vender claridad "hoy", tres cards dashed + Badge "Roadmap" (EN en ES) sugieren "aún no listo".
- **Fix:** Dejar "Disponible hoy" en el relato; roadmap a footer o post-CTA.
- **Suggested:** `/impeccable shape` o `/impeccable distill`

## Persona Red Flags

**Jordan (first-timer):** Subtítulo/Cashflow/Patrimonio asumen literacidad financiera; CTA primario compite con secondary + 5 nav; mock sin etiqueta "Home".

**Riley (stress tester):** Clics muertos en Ver todos/chevron; copy promete presupuestos/pagos próximos que el hero mock no muestra; labels CTA inconsistentes.

**Casey (mobile):** Auth detrás del hamburger (fuera de thumb zone); scroll largo antes del CTA final; Sheet denso.

**Usuario Savv LATAM (proyecto):** Voz rioplatense choca con "Roadmap"/Cashflow; no responde "¿manual o banco?"; duplicación hero↔AccountsPreviewMock.

## Minor Observations

- `landing.hero.previewLabel` existe y no se renderiza.
- Sin switcher de locale visible en marketing.
- Logo `alt=""` (decorativo; nombre en texto adyacente).
- Analytics es el único FeatureGrid de 5 ítems.
- How-it-works: cuatro cards de igual peso; ningún "empezá por acá".

## Questions to Consider

- Si el primer viewport fuera solo Savv + una promesa + un CTA + Home a full stage, ¿qué borrás del subtítulo actual?
- ¿Planificación/Roadmap pertenece al path de persuasión o entrena a esperar?
- ¿Confiaría más un refugiado de planilla con una línea "carga manual, claridad primero" que con cinco bullets de analytics?
- ¿Qué hace a esta página inconfundiblemente Savv sin el wordmark del header?
- ¿"Ver cómo funciona" canibaliza "Empezar gratis"?
