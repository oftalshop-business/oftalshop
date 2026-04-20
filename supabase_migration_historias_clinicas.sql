-- Migration: historias_clinicas
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS historias_clinicas (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            uuid NOT NULL,
  cliente_id           uuid NOT NULL UNIQUE,

  -- Información general
  doctor               text,
  texto_libre          boolean DEFAULT false,
  fecha                date,
  tipo_prescripcion    text,

  -- Visión de Lejos — Ojo Derecho
  lejos_od_esferico    text,
  lejos_od_cilindro    text,
  lejos_od_eje         text,
  lejos_od_av          text,
  lejos_od_dip         text,
  lejos_od_altura      text,
  lejos_od_adicion     text,

  -- Visión de Lejos — Ojo Izquierdo
  lejos_oi_esferico    text,
  lejos_oi_cilindro    text,
  lejos_oi_eje         text,
  lejos_oi_av          text,
  lejos_oi_dip         text,
  lejos_oi_altura      text,
  lejos_oi_adicion     text,

  -- Visión de Cerca — Ojo Derecho
  cerca_od_esferico    text,
  cerca_od_cilindro    text,
  cerca_od_eje         text,
  cerca_od_av          text,
  cerca_od_dip         text,
  cerca_od_altura      text,

  -- Visión de Cerca — Ojo Izquierdo
  cerca_oi_esferico    text,
  cerca_oi_cilindro    text,
  cerca_oi_eje         text,
  cerca_oi_av          text,
  cerca_oi_dip         text,
  cerca_oi_altura      text,

  -- Visión Intermedia — Ojo Derecho
  inter_od_esferico    text,
  inter_od_cilindro    text,
  inter_od_eje         text,
  inter_od_av          text,
  inter_od_dip         text,
  inter_od_altura      text,

  -- Visión Intermedia — Ojo Izquierdo
  inter_oi_esferico    text,
  inter_oi_cilindro    text,
  inter_oi_eje         text,
  inter_oi_av          text,
  inter_oi_dip         text,
  inter_oi_altura      text,

  -- Historia clínica
  razon_consulta       text,
  sintomatologia       text,
  diagnostico          text,
  tratamiento          text,
  historia_ocular      text,
  historial_familiar   text,
  comentarios          text,

  -- Antecedentes (array de strings)
  antecedentes         text[] DEFAULT '{}',

  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_historias_tenant   ON historias_clinicas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_historias_cliente  ON historias_clinicas(cliente_id);

-- RLS
ALTER TABLE historias_clinicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant can manage own historias"
  ON historias_clinicas
  FOR ALL
  USING (
    tenant_id = (
      SELECT id FROM tenants
      WHERE id = auth.uid()
      LIMIT 1
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER historias_updated_at
  BEFORE UPDATE ON historias_clinicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
