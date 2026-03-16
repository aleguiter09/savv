# AGENTS.md — Reglas de colaboración para este repo (`savv`)

## 1) Contexto del proyecto

- Tipo de producto: app web para gestión de finanzas personales.
- Stack base: `Next.js` (App Router), `TypeScript`, `TailwindCSS`, `Supabase`, `next-intl`.
- UI: componentes `shadcn/ui` en `src/ui` y utilidades compartidas en `src/modules/shared`.
- Base de datos: Supabase con tipos en `src/modules/shared/types/database.types.ts`.

## 2) Estructura y arquitectura esperada

- Respetar arquitectura modular en `src/modules/<dominio>/`.
- Patrón habitual por módulo:
  - `actions/` → server actions y orquestación de flujo UI.
  - `services/` → acceso a datos y lógica de negocio.
  - `adapters/` → transformación/mapeo de datos.
  - `types/` → tipos específicos del dominio.
- Infraestructura en `src/infra/`:
  - `supabase/` para cliente server/browser/proxy.
  - `i18n/` para resolución de locale/mensajes.
- Rutas y layouts en `src/app/`.

## 3) Convenciones de código

- Mantener imports con alias `@/` (definido en `tsconfig.json`).
- Preferir cambios mínimos y localizados; no refactorizar áreas no relacionadas.
- Mantener nombres y estilo existente (funciones, tipos, estructura de carpetas).
- No introducir librerías nuevas salvo petición explícita.
- Evitar comentarios innecesarios; código claro primero.

## 4) Reglas para cambios funcionales

- Validaciones de input con `zod` cuando aplique.
- En server actions:
  - usar `"use server"` si corresponde.
  - devolver errores consistentes con el patrón existente (`ServerActionResponse` cuando aplique).
  - usar `revalidatePath` y/o `redirect` siguiendo el flujo ya usado en el módulo.
- En acceso a datos:
  - usar `createClient` desde `src/infra/supabase/server` para server-side.
  - usar `createClient` desde `src/infra/supabase/client` en browser-side.
- No hardcodear secretos ni tokens.

## 5) Reglas de i18n y UX

- Cualquier texto nuevo visible al usuario debe ir a mensajes de `next-intl` (`src/messages/<locale>/...`).
- Evitar strings mágicos en UI cuando el módulo ya usa traducciones.
- Mantener consistencia visual con los componentes actuales (`shadcn/ui` + Tailwind existente).

## 6) Performance y calidad

- Evitar consultas duplicadas si ya hay datos disponibles en el flujo actual.
- Priorizar joins y patrones ya usados en `services/` del dominio.
- No romper comportamiento existente de cuentas, categorías, movimientos y settings.
- Antes de cerrar cambios de código: correr al menos `npm run lint`.
- Si el cambio afecta lógica crítica, correr tests puntuales con `npm run test` (o filtrar por archivo si aplica).

## 7) Cómo debe trabajar el agente (muy importante)

- Siempre explicar primero el plan corto antes de editar múltiples archivos.
- Para tareas no triviales, proponer pasos claros y luego ejecutar.
- Antes de editar, revisar archivos reales del dominio afectado.
- Si hay ambigüedad funcional, preguntar en vez de asumir.
- No tocar código no relacionado con la petición.
- Entregar resumen final breve con:
  - qué cambió,
  - en qué archivos,
  - cómo validarlo rápido.

## 8) Preferencias de respuesta para ahorrar contexto

- Responder en español por defecto.
- Ser directo y concreto; evitar explicaciones largas si no se piden.
- Si hay varias opciones de implementación, listar opciones numeradas con trade-off corto.
- Cuando falte contexto, pedirlo en formato checklist corto.

## 9) Checklist rápido por cada tarea

1. Identificar módulo(s) afectado(s) en `src/modules`.
2. Revisar `actions/services/types` del dominio antes de editar.
3. Mantener i18n y tipos consistentes.
4. Aplicar cambio mínimo necesario.
5. Ejecutar validación (`lint` y test si aplica).
6. Reportar cambios y siguiente paso sugerido.
