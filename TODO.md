# TODO — Savv

> Last audit: 2026-09-02

---

## P0 — Security

[X] Version RLS policies in supabase migrations (`009_version_rls_policies.sql`)

---

## Nice-to-have — Security hardening

> Covered today by `SECURITY INVOKER` RPCs + table RLS (`auth.uid() = user_id`). Optional defense in depth.

[] Add explicit `auth.uid()` filter to `get_balance_timeline` / `get_accounts_balance_at` / `get_category_budget_progress`
[] Add explicit `user_id` filters in services (accounts, movements, budgets)
[] Harden INSERT `WITH CHECK` on `account` / `movement` / `user_category` (today `true`)
[] Make `account.user_id` NOT NULL (no null rows in prod today)
[] Set fixed `search_path` on balance RPCs

---

## P1 — Safeguards & validation

[X] Validate account delete: block if movements/series exist or if it's the only account (`account-delete.utils.ts`, `deleteAccountForm`)
[X] Validate category delete: block if movements/series/subcategories; cascade budgets when clean (`category-delete.utils.ts`, `deleteCategoryForm`)
[X] UNIQUE constraint on `category_budget(user_id, category_id)` (exists in DB as `category_budget_user_category_unique`)
[X] Guard `deleteCategoryForm` on server for global categories (`globalCategoryError`)

---

## P2 — Quality & tech debt

[X] Unit tests (vitest): 20 tests in `tests/` — schemas, `applied`/installments, transfer merge, adapters, budgets, cron auth; pure utils extracted (`movement-series.utils.ts`, `transfer.utils.ts`)
[] Integration tests for balance RPCs and movement services (mocked Supabase)
[X] i18n: NetWorth hardcoded strings ("Comparado hace 30 días", "NET WORTH")
[] Replace `INCOME_PARENT_ID = 60` magic number with category type/slug (3 files depend on it)
[] Expand `revalidatePath` to `/movements`, `/analytics`, `/expenses` after movement changes
[X] Decide fate of `movement.applied` field — used for series: future rows stay `applied=false` until CRON or "Apply today"
[X] Sanitize error messages in actions (no raw DB errors exposed to user)
[X] Pagination on `getMovementsByFilters` (no limit, performance risk with many movements)

---

## P3 — Bugs & UX polish

[] Check how transfers are displayed based on received vs sent (partially addressed)
[] Date picker: add preestablished ranges (today, week, month, last30days)
[] Email template for recover password in Supabase (must route via `/auth/confirm?next=/update-password`)
[] Verify sign-up flow when email confirmation is required (`createAccount`/`createSettings` may fail without session)
[] Analytics: pass `accountId` filter to `CategoryComparisonTable` (component supports it, page does not)
[] Uncomment or implement "See all" link in `UpcomingPayments`
[] Daily movement totals sum both transfer legs (may confuse users — review display logic)

---

## New Features (roadmap)

[X] Remove `is_default` from accounts — does not add enough value; stop using it as home/filter scope and form prefill
[] Account & category ordering heuristic per user: sort by most used (movement frequency); use top account/category as form prefill instead of `is_default`
[X] Complete Balance After Logic (backdating)
[] Templates for movements
[] Dark theme (`next-themes` installed, no ThemeProvider/toggle yet)
[] Multiple money types on expense
[] Credit cards or quotas widget
[] Upcoming payments widget polish ("See all" link, clarify pending vs applied in UI)
[] Loans widget
[] Expenses/incomes 6-month bar chart (monthly chart exists on `/expenses`)
[] Add types, icons and colors to accounts (cash, bank, card, savings, investments, crypto)
[] Obtain message stats from RPC queries
[X] Home: default scope to all accounts; account filter as optional zoom (not driven by `is_default`)

---

## Completed

### Infrastructure & refactors

[X] Avoid multiple same requests, use caching or context CSR. Like getting accounts or categories.
[X] Avoid multiple get for Categories.
[X] Move types to each file
[X] Config I18n, add user config table
[X] Add ALL translations (check Skeletons)
[X] Removed unnecessary supabase client logic
[X] Translate errors from actions
[X] Update imports for components
[X] Delete MDI icons, replace for lucid
[X] Replace forms to use RHF
[X] Replace Tremor with Shadcn
[X] Toaster for OK msgs
[X] Change queries to use Joins

### Auth & accounts

[X] Recover Password page
[X] Delete account
[X] Create account process after sign up
[X] Created accounts doesn't have a locale assigned

### Movements & transfers

[X] Recurring & installment expenses: `movement_series`, pre-generated installments, hybrid recurring (template + next occurrence)
[X] Deferred balance for series: `applied=false` until due; `apply_movement` + `apply_due_movements` RPCs; analytics filter `applied=true`
[X] Vercel Cron (`0 5 * * *` → `/api/cron/apply-movements`): `CRON_SECRET` auth, proxy bypass for `/api/cron/*`, `SUPABASE_SERVICE_ROLE_KEY` admin client
[X] MovementForm schedule (unique / recurring / installment), "Apply today" button, series detail badges
[X] Transfer integrity (P0): `transfer_group_id`, atomic update/delete RPCs, edit UI shows destination
[X] Transfers related accounts and color.
[X] Review 'fullCategory' and 'fullAccount' props in movement detail
[X] Transfers are not being displayed in all movements
[X] Received transfers are not being displayed based on account
[X] Check whats happening when updating a movement
[X] On add movement, when changing between tabs the category displayed is empty
[X] When updating movement, movement is being inserted and eliminated. Not being updated.
[X] Verify translations for error messages in movements schemas
[X] Add labels to movements

### Categories & UI

[X] Admin Categories/subcategories
[X] Review 'Category' page translations (based on new categories)
[X] Translate default errors

### Bug fixes

[X] Error on create movement its not ending transition.
[X] Navbar shown on login page
[X] Account from the URL is being overwritten in select Home
[X] Accounts & Categories not always being settled.
[X] Select Category in Movement form overlapped by navbar
[X] Only default imports are allowed

### Testing

[X] Vitest setup: `tests/` mirrors `src/`, `tests/tsconfig.json` for `@/` alias, `npm run test` / `test:watch`
[X] P0 unit tests: `MovementSchema` (transfer/recurring/installment), `isMovementAppliedByDate`, `splitInstallmentAmounts`, `isCronAuthorized`
[X] P1 unit tests: `mergeTransferLegs`, `adaptMovementItem`, `getMovementsByDay`, `getAvailableBudgetCategories`, `parseMovementsForChart`
[X] Extract pure logic from services: `movement-series.utils.ts`, `transfer.utils.ts`
