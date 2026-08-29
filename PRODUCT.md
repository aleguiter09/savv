# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Persona individual que quiere ordenar gastos y cuentas del día a día: ver saldos, registrar movimientos y entender en qué se va el dinero sin saltar entre apps o planillas.

## Product Purpose

Savv es una app web de finanzas personales: concentra cuentas, movimientos, categorías, análisis y planificación básica para que el usuario tenga una visión clara y accionable de su dinero. Éxito = el usuario sabe cuánto tiene, qué pasó y hacia dónde va el gasto, con fricción baja.

## Positioning

Claridad en un solo lugar: cuentas + movimientos + análisis juntos, sin ruido. La diferenciación no es “más features”, sino una foto limpia y confiable de la situación financiera personal.

## Operating Context

Uso en navegador (desktop y mobile). Flujo típico: crear cuentas → registrar ingresos/gastos/transferencias → categorizar → revisar cashflow, patrimonio y presupuestos. Idioma de producto: español (LATAM / rioplatense) e inglés vía i18n.

## Capabilities and Constraints

- Capaz hoy: múltiples cuentas, balances, patrimonio, movimientos (ingreso/gasto/transferencia), categorías, analytics (cashflow, por categoría, evolución), presupuestos, pagos próximos.
- Roadmap declarado en producto (no inventar como shipped): recurrentes, cuotas, proyección de saldo.
- Stack fijo: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Supabase, next-intl.
- Landing marketing puede cambiar secciones, copy y logo; la app interna no es el foco de este rediseño.
- No hardcodear secretos; no fabricar métricas, clientes o testimonials.

## Brand Commitments

- Nombre del producto: **Savv**.
- Logo actual: `/finance.png` (conservado en la dirección canon).
- Dirección visual de marketing (2026-08): **canon fintech** — rediseño de la landing existente con la paleta de la app (gris + azul-600), sin mundos experimentales.
- Copy y estructura de la landing pueden ajustarse dentro de esa dirección.
- Voz: clara, concreta, cercana; sin hype de productividad genérico ni jerga bancaria innecesaria.
- Craft bar de referencia: Nubank / Mercado Pago / Wise (producto claro, mock dominante, CTA inequívoco).

## Evidence on Hand

- Landing y mocks de producto en `src/modules/landing/` (previews sintéticos de UI).
- Mensajes i18n: `src/messages/es/landing.json`, `src/messages/en/landing.json`.
- No hay testimonios, case studies ni press reales: no inventarlos.

## Product Principles

1. Claridad antes que ornamentación: cada pantalla debe responder “cuánto / qué / hacia dónde”.
2. Los movimientos son la fuente de verdad; las transferencias no se disfrazan de ingreso o gasto.
3. Demostrar el producto (UI real o mock fiel) en lugar de claims abstractos.
4. Respetar i18n y el stack existente; el diseño marketing puede ser expresivo sin romper shadcn en la app.
5. No inventar prueba social ni capacidades no shipped.
