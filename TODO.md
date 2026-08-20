# TODO — Savv

> Last audit: 2026-08-19

---

## P0 — Security

[] Version RLS policies in supabase migrations (not auditable from repo today)
[] Add `auth.uid()` filter to `get_balance_timeline` (currently selects all accounts)
[] Add `auth.uid()` filter to `get_accounts_balance_at` (same issue)
[] Add `auth.uid()` filter to `get_category_budget_progress` (no user filter on budgets/spending)
[] Add explicit `user_id` filters in services as defense in depth (accounts, movements, budgets)

---

## P1 — Safeguards & validation

[] Validate account delete: block if movements exist or if it's the only/default account
[] Validate category delete: block if movements or budgets reference it
[] Enforce unique default account (unset others when marking one as default)
[] UNIQUE constraint on `category_budget(user_id, category_id)` (UI filters dupes, API does not)
[] Guard `deleteCategoryForm` on server for global categories (UI hides button, action does not)

---

## P2 — Quality & tech debt

[] Tests for balance RPCs and transfer flows (vitest configured, 0 test files)
[] i18n: NetWorth hardcoded strings ("Comparado hace 30 días", "NET WORTH")
[] Replace `INCOME_PARENT_ID = 60` magic number with category type/slug (3 files depend on it)
[] Expand `revalidatePath` to `/movements`, `/analytics`, `/expenses` after movement changes
[] Decide fate of `movement.applied` field — use it or remove from schema (upcoming uses `done_at` instead)
[] Sanitize error messages in actions (no raw DB errors exposed to user)
[] Pagination on `getMovementsByFilters` (no limit, performance risk with many movements)
[] Review `account.user_id` nullable in schema vs multi-tenant model

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

[] Complete Balance After Logic (backdating)
[] Templates for movements
[] Dark theme (`next-themes` installed, no ThemeProvider/toggle yet)
[] Multiple money types on expense
[] Credit cards or quotas widget
[] Upcoming payments — partial (future `done_at` works; `applied` field unused; widget exists)
[] Loans widget
[] Expenses/incomes 6-month bar chart (monthly chart exists on `/expenses`)
[] Add types, icons and colors to accounts (cash, bank, card, savings, investments, crypto)
[] Obtain message stats from RPC queries
[] Allow multiple accounts on home

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
