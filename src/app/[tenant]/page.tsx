import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StorePreview from '@/components/store/StorePreview'
import type { SectionData, TiendaConfig } from '@/lib/tenant'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Producto {
  id: string
  nombre: string
  precio: number
  slug: string
  imagenUrl?: string
}

interface TenantRow {
  id: string
  nombre: string
  slug: string
  activo?: boolean
  contrasena_mantenimiento?: string | null
}

// ─── 404 ─────────────────────────────────────────────────────────────────────

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4">👓</div>
      <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Tienda no encontrada</h1>
      <p className="text-[#64748b] mb-8">
        La tienda <strong className="text-[#1e40af]">{slug}</strong> no existe o ha sido desactivada.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[#1e40af] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1d3a9e] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

function MaintenancePage({ nombre }: { nombre: string }) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-6">🔧</div>
      <h1 className="text-3xl font-bold text-white mb-3">{nombre}</h1>
      <p className="text-white/60 mb-8 max-w-sm">
        Esta tienda está temporalmente en mantenimiento. Vuelve pronto.
      </p>
      <form method="POST" className="flex flex-col items-center gap-3 w-full max-w-xs">
        <input
          type="password"
          name="password"
          placeholder="Contraseña de acceso"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-[#1e40af] py-2.5 text-sm font-semibold text-white hover:bg-[#1d3a9e] transition-colors"
        >
          Acceder
        </button>
      </form>
    </div>
  )
}

// ─── Default sections (fallback) ─────────────────────────────────────────────

function buildDefaultSections(): SectionData[] {
  return [
    { id: 'header-1',     tipo: 'header',     label: 'Header',           activa: true, config: {} },
    { id: 'banner-1',     tipo: 'banner',     label: 'Banner',           activa: true, config: { titulo: 'Bienvenido a nuestra tienda', subtitulo: 'Los mejores productos ópticos', ctaTexto: 'Ver productos', altura: 'L', alineacion: 'center', opacidad: 40 } },
    { id: 'productos-1',  tipo: 'productos',  label: 'Productos',        activa: true, config: { cantidad: 4, mostrarPrecio: true, mostrarBoton: true } },
    { id: 'newsletter-1', tipo: 'newsletter', label: 'Newsletter',       activa: true, config: {} },
    { id: 'footer-1',     tipo: 'footer',     label: 'Footer',           activa: true, config: {} },
  ]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TiendaPublicaPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  // 1. Find tenant by slug
  const { data: tenantRow } = await supabase
    .from('tenants')
    .select('id, nombre, slug, activo, contrasena_mantenimiento')
    .eq('slug', slug)
    .maybeSingle()

  const tenant = tenantRow as TenantRow | null

  if (!tenant) {
    return <NotFound slug={slug} />
  }

  // 2. Check maintenance mode
  const enMantenimiento = tenant.activo === false

  // 3. Load store config and products in parallel
  const [configResult, productosResult] = await Promise.all([
    supabase
      .from('configuracion_tienda')
      .select('valor')
      .eq('clave', 'personalizar')
      .eq('tenant_id', tenant.id)
      .maybeSingle(),
    supabase
      .from('productos')
      .select('id, nombre, precio, slug, medias(url, tipo)')
      .eq('tenant_id', tenant.id)
      .eq('estado', 'activo')
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const tiendaConfig: TiendaConfig = (configResult.data?.valor as TiendaConfig) ?? {}

  const productos: Producto[] = ((productosResult.data ?? []) as Array<{
    id: string; nombre: string; precio: number; slug: string
    medias?: { url: string; tipo: string }[]
  }>).map((p) => ({
    id: String(p.id),
    nombre: String(p.nombre),
    precio: Number(p.precio),
    slug: String(p.slug),
    imagenUrl: p.medias?.[0]?.url,
  }))

  // 4. Maintenance page
  if (enMantenimiento) {
    return <MaintenancePage nombre={tenant.nombre} />
  }

  // 5. Build sections
  const secciones: SectionData[] = (tiendaConfig.secciones && tiendaConfig.secciones.length > 0)
    ? tiendaConfig.secciones
    : buildDefaultSections()

  const colores = {
    primario:   tiendaConfig.colores?.primario   ?? '#2a9d8f',
    secundario: tiendaConfig.colores?.secundario ?? '#1a1a1a',
    acento:     tiendaConfig.colores?.acento     ?? '#e9c46a',
    fondo:      tiendaConfig.colores?.fondo      ?? '#ffffff',
    texto:      tiendaConfig.colores?.texto      ?? '#1a1a1a',
    encabezados:tiendaConfig.colores?.encabezados ?? '#0f172a',
  }

  const tipografia = {
    titulo: tiendaConfig.tipografia?.titulo ?? 'Inter',
    cuerpo: tiendaConfig.tipografia?.cuerpo ?? 'Inter',
  }

  return (
    <StorePreview
      secciones={secciones}
      colores={colores}
      tipografia={tipografia}
      espaciado={(tiendaConfig.espaciado ?? 'normal') as 'compacto' | 'normal' | 'amplio'}
      bordes={(tiendaConfig.bordes ?? 'redondeados') as 'sin-bordes' | 'redondeados' | 'muy-redondeados'}
      productos={productos}
      tenant={slug}
      nombreTienda={tenant.nombre}
    />
  )
}
