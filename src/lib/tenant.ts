'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface TenantConfig {
  id: string
  slug: string
  nombre: string
  plan: string
  email: string
}

export interface TiendaConfig {
  colores?: {
    primario?: string
    secundario?: string
    acento?: string
    fondo?: string
    texto?: string
    encabezados?: string
  }
  tipografia?: {
    titulo?: string
    cuerpo?: string
  }
  espaciado?: 'compacto' | 'normal' | 'amplio'
  bordes?: 'sin-bordes' | 'redondeados' | 'muy-redondeados'
  banner?: {
    titulo?: string
    subtitulo?: string
    ctaTexto?: string
    ctaUrl?: string
    opacidad?: number
    imagenUrl?: string
    altura?: 'S' | 'M' | 'L' | 'XL'
    alineacion?: 'left' | 'center' | 'right'
    colorOverlay?: string
  }
  secciones?: SectionData[]
  plantilla?: string
}

export interface SectionData {
  id: string
  tipo: string
  label: string
  activa: boolean
  config?: Record<string, unknown>
}

export async function getCurrentTenant(): Promise<TenantConfig | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('tenants')
    .select('id, slug, nombre, plan, email')
    .eq('id', user.id)
    .single()

  return data ?? null
}

export async function getTenantConfig(tenantId: string): Promise<TiendaConfig> {
  const supabase = createClient()
  const { data } = await supabase
    .from('configuracion_tienda')
    .select('valor')
    .eq('clave', 'personalizar')
    .eq('tenant_id', tenantId)
    .maybeSingle()

  return (data?.valor as TiendaConfig) ?? {}
}

export async function saveTenantConfig(tenantId: string, config: TiendaConfig): Promise<void> {
  const supabase = createClient()
  await supabase.from('configuracion_tienda').upsert({
    tenant_id: tenantId,
    clave: 'personalizar',
    valor: config,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'tenant_id,clave' })
}

export function useTenant() {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentTenant().then((t) => {
      setTenant(t)
      setLoading(false)
    })
  }, [])

  return { tenant, loading }
}

export function useTenantConfig() {
  const { tenant, loading: tenantLoading } = useTenant()
  const [config, setConfig] = useState<TiendaConfig>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenant) return
    getTenantConfig(tenant.id).then((c) => {
      setConfig(c)
      setLoading(false)
    })
  }, [tenant])

  return { config, setConfig, tenant, loading: tenantLoading || loading }
}
