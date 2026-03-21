# GENERALs.md — Reglas generales de colaboración (plantilla reusable)

## 1) Contexto base del proyecto

- Tipo de producto: app web modular (orientada a dominio).
- Stack base recomendado: `Next.js` (App Router), `TypeScript`, `TailwindCSS`, `Supabase`, `next-intl`.
- UI: componentes reutilizables en `src/ui` y utilidades compartidas en `src/modules/shared`.
- Base de datos: Supabase con tipos TypeScript versionados en el repo.

## 2) Estructura y arquitectura esperada

- Mantener arquitectura modular en `src/modules/<dominio>/`.
- Patrón habitual por módulo:
  - `actions/` → server actions y orquestación de flujo UI.
  - `services/` → acceso a datos y lógica de negocio.
  - `adapters/` → transformación/mapeo de datos.
  - `types/` → tipos específicos del dominio.
- Infraestructura en `src/infra/`:
  - `supabase/` para cliente server/browser/proxy.
  - `i18n/` para resolución de locale/mensajes.
- Rutas y layouts en `src/app/`.
- Mensajes i18n en `src/messages/<locale>/...`.

## 3) Convenciones de código

- Mantener imports con alias `@/` (si está definido en `tsconfig.json`).
- Preferir cambios mínimos y localizados; no refactorizar áreas no relacionadas.
- Mantener nombres y estilo existente (funciones, tipos, estructura de carpetas).
- No introducir librerías nuevas salvo petición explícita.
- Evitar comentarios innecesarios; código claro primero.

## 4) Reglas para cambios funcionales

- Validaciones de input con `zod` cuando aplique.
- En server actions:
  - usar `"use server"` si corresponde.
  - devolver errores consistentes con el patrón existente (`ServerActionResponse` u otro tipo común del repo).
  - usar `revalidatePath` y/o `redirect` siguiendo el flujo ya usado en el módulo.
- En acceso a datos:
  - usar `createClient` desde `src/infra/supabase/server` para server-side.
  - usar `createClient` desde `src/infra/supabase/client` en browser-side.
- No hardcodear secretos ni tokens.

## 5) Reglas de i18n y UX

- Cualquier texto nuevo visible al usuario debe ir a mensajes de `next-intl`.
- Evitar strings mágicos en UI cuando el módulo ya usa traducciones.
- Mantener consistencia visual con la librería de UI y patrones actuales del proyecto.

## 6) Performance y calidad

- Evitar consultas duplicadas si ya hay datos disponibles en el flujo actual.
- Priorizar joins y patrones ya usados en `services/` del dominio.
- No romper comportamiento existente en módulos críticos del negocio.
- Antes de cerrar cambios de código: correr al menos `npm run lint`.
- Si el cambio afecta lógica crítica: correr tests puntuales con `npm run test` (o filtrados por archivo).

## 7) Flujo de trabajo del agente/equipo

- Explicar primero un plan corto antes de editar múltiples archivos.
- Para tareas no triviales, proponer pasos claros y luego ejecutar.
- Antes de editar, revisar archivos reales del dominio afectado.
- Si hay ambigüedad funcional, preguntar en vez de asumir.
- No tocar código no relacionado con la petición.
- Entregar resumen final breve con:
  - qué cambió,
  - en qué archivos,
  - cómo validarlo rápido.

## 8) Estándar tecnológico de referencia

- Framework: `next`.
- UI: `react`, `tailwindcss`, `shadcn/ui` (o equivalente basado en Radix).
- Forms/validación: `react-hook-form`, `@hookform/resolvers`, `zod`.
- Backend BaaS: `@supabase/supabase-js`, `@supabase/ssr`.
- i18n: `next-intl`.
- Calidad: `eslint` + `next lint`.
- Testing: `vitest` (si está habilitado en el proyecto).

## 9) Checklist rápido por tarea

1. Identificar módulo(s) afectado(s) en `src/modules`.
2. Revisar `actions/services/types` del dominio antes de editar.
3. Mantener i18n y tipos consistentes.
4. Aplicar cambio mínimo necesario.
5. Ejecutar validación (`lint` y test si aplica).
6. Reportar cambios y siguiente paso sugerido.

## 10) Notas para reutilizar esta plantilla

- Ajustar nombres de carpetas si el proyecto no usa exactamente `src/modules` o `src/infra`.
- Mantener el contenido tecnológico alineado al `package.json` real de cada repo.
- Si un proyecto no usa i18n o Supabase, reemplazar solo esas secciones, manteniendo la metodología de trabajo.
