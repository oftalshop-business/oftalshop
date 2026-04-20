-- Migration: RLS multitenant policies
-- Run this in Supabase SQL Editor

-- ─── Helper function ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT id FROM tenants WHERE id = auth.uid() LIMIT 1;
$$;

-- ─── Add tenant_id to historias_clinicas if missing ──────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'historias_clinicas' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE historias_clinicas ADD COLUMN tenant_id uuid;
  END IF;
END $$;

-- ─── Enable RLS on all tables ─────────────────────────────────────────────────

ALTER TABLE productos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_tienda     ENABLE ROW LEVEL SECURITY;
ALTER TABLE colecciones         ENABLE ROW LEVEL SECURITY;
ALTER TABLE descuentos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_tienda ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_clinicas  ENABLE ROW LEVEL SECURITY;

-- ─── Drop existing policies (idempotent) ─────────────────────────────────────

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'productos','variantes','pedidos','clientes_tienda',
    'colecciones','descuentos','configuracion_tienda','historias_clinicas'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "tenant isolation" ON %I', tbl);
  END LOOP;
END $$;

-- ─── Create RLS policies ─────────────────────────────────────────────────────

CREATE POLICY "tenant isolation" ON productos
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON variantes
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON pedidos
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON clientes_tienda
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON colecciones
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON descuentos
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON configuracion_tienda
  FOR ALL USING (tenant_id = get_tenant_id());

CREATE POLICY "tenant isolation" ON historias_clinicas
  FOR ALL USING (tenant_id = get_tenant_id());

-- ─── Public read for store (tenant pages) ────────────────────────────────────

-- Productos and colecciones are readable by anyone for the public store
-- (uses tenant_id from URL slug lookup, not auth)
CREATE POLICY "public store read productos" ON productos
  FOR SELECT USING (estado = 'activo');

CREATE POLICY "public store read colecciones" ON colecciones
  FOR SELECT USING (true);

CREATE POLICY "public store read configuracion" ON configuracion_tienda
  FOR SELECT USING (true);

-- ─── Tenants table ───────────────────────────────────────────────────────────

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own tenant" ON tenants;
DROP POLICY IF EXISTS "public read slug" ON tenants;

CREATE POLICY "own tenant" ON tenants
  FOR ALL USING (id = auth.uid());

CREATE POLICY "public read slug" ON tenants
  FOR SELECT USING (true);
