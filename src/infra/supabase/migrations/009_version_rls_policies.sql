-- Version existing RLS policies so they are auditable and reproducible from the repo.
-- Idempotent: safe to re-run on environments where policies already exist.

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- account
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.account;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.account;
DROP POLICY IF EXISTS "Enable users to update their own data only" ON public.account;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.account;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.account
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.account
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable users to update their own data only"
  ON public.account
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to view their own data only"
  ON public.account
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid() AS uid) = user_id);

-- ---------------------------------------------------------------------------
-- category
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.category;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.category;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.category;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.category;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.category
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable insert for users based on user_id"
  ON public.category
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON public.category
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING ((user_id IS NOT NULL) AND (user_id = (SELECT auth.uid() AS uid)))
  WITH CHECK ((user_id IS NOT NULL) AND (user_id = (SELECT auth.uid() AS uid)));

CREATE POLICY "Enable users to view their own data only"
  ON public.category
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (((SELECT auth.uid() AS uid) = user_id) OR (user_id IS NULL));

-- ---------------------------------------------------------------------------
-- category_budget
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "category_budget_delete_own" ON public.category_budget;
DROP POLICY IF EXISTS "category_budget_insert_own" ON public.category_budget;
DROP POLICY IF EXISTS "category_budget_select_own" ON public.category_budget;
DROP POLICY IF EXISTS "category_budget_update_own" ON public.category_budget;

CREATE POLICY "category_budget_delete_own"
  ON public.category_budget
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "category_budget_insert_own"
  ON public.category_budget
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id)
    AND (
      EXISTS (
        SELECT 1
        FROM effective_categories ec
        WHERE ec.id = category_budget.category_id
          AND COALESCE(ec.is_hidden, false) = false
      )
    )
  );

CREATE POLICY "category_budget_select_own"
  ON public.category_budget
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "category_budget_update_own"
  ON public.category_budget
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    (auth.uid() = user_id)
    AND (
      EXISTS (
        SELECT 1
        FROM effective_categories ec
        WHERE ec.id = category_budget.category_id
          AND COALESCE(ec.is_hidden, false) = false
      )
    )
  );

-- ---------------------------------------------------------------------------
-- movement
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.movement;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.movement;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON public.movement;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.movement;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.movement
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.movement
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for users based on user_id"
  ON public.movement
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON public.movement
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_category
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.user_category;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_category;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_category;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.user_category;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.user_category
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.user_category
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
  ON public.user_category
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable users to view their own data only"
  ON public.user_category
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid() AS uid) = user_id);

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.user_settings;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_settings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_settings;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.user_settings;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.user_settings
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable insert for users based on user_id"
  ON public.user_settings
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON public.user_settings
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING ((SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Enable users to view their own data only"
  ON public.user_settings
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid() AS uid) = user_id);
