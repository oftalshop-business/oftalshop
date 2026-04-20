import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Phone, Mail, MapPin } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Producto {
  id: string
  nombre: string
  precio: number
  slug: string
  medias: { url: string; tipo: string }[]
}

interface ConfigTienda {
  titulo_tienda?: string
  meta_descripcion?: string
  facebook_url?: string
  instagram_url?: string
}

interface PersonalizarConfig {
  colores?: {
    primario?: string
    secundario?: string
    acento?: string
    fondo?: string
    texto?: string
  }
  tipografia?: {
    titulo?: string
    cuerpo?: string
  }
  banner?: {
    titulo?: string
    subtitulo?: string
    ctaTexto?: string
    ctaUrl?: string
    opacidad?: number
    imagenUrl?: string
  }
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  producto,
  tenant,
  primario,
}: {
  producto: Producto
  tenant: string
  primario: string
}) {
  const imagen = producto.medias?.[0]?.url

  return (
    <Link
      href={`/${tenant}/productos/${producto.slug}`}
      className="group rounded-xl border border-[#e1e1e1] bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-[#f7f7f7] flex items-center justify-center overflow-hidden">
        {imagen ? (
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl">👓</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a] line-clamp-2">{producto.nombre}</h3>
        <p className="text-base font-bold mt-1" style={{ color: primario }}>
          S/ {Number(producto.precio).toFixed(2)}
        </p>
        <button
          className="mt-3 w-full rounded-lg py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: primario }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Agregar al carrito
        </button>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TiendaPublicaPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const supabase = await createClient()

  // Load store config
  const [prefResult, personalizarResult, productosResult] = await Promise.all([
    supabase
      .from('configuracion_tienda')
      .select('valor')
      .eq('clave', 'preferencias')
      .eq('tenant_id', tenant)
      .maybeSingle(),
    supabase
      .from('configuracion_tienda')
      .select('valor')
      .eq('clave', 'personalizar')
      .eq('tenant_id', tenant)
      .maybeSingle(),
    supabase
      .from('productos')
      .select('id, nombre, precio, slug, medias(url, tipo)')
      .eq('tenant_id', tenant)
      .eq('estado', 'activo')
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const config: ConfigTienda = prefResult.data?.valor ?? {}
  const personalizar: PersonalizarConfig = personalizarResult.data?.valor ?? {}
  const productos: Producto[] = (productosResult.data as Producto[] | null) ?? []

  const colores = personalizar.colores ?? {}
  const tipografia = personalizar.tipografia ?? {}
  const banner = personalizar.banner ?? {}

  const primario = colores.primario ?? '#2a9d8f'
  const secundario = colores.secundario ?? '#1a1a1a'
  const acento = colores.acento ?? '#e9c46a'
  const fondo = colores.fondo ?? '#ffffff'
  const colorTexto = colores.texto ?? '#1a1a1a'
  const fuenteTitulo = tipografia.titulo ?? 'Inter'
  const fuenteCuerpo = tipografia.cuerpo ?? 'Inter'

  const nombreTienda = config.titulo_tienda ?? `Tienda ${tenant}`

  return (
    <div style={{ backgroundColor: fondo, color: colorTexto, fontFamily: fuenteCuerpo }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: secundario, borderColor: '#ffffff22' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${tenant}`}>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: fuenteTitulo, color: acento }}
            >
              {nombreTienda.split('—')[0].trim()}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <Link href={`/${tenant}`} className="hover:text-white transition-colors">Inicio</Link>
            <Link href={`/${tenant}/productos`} className="hover:text-white transition-colors">Productos</Link>
            <Link href={`/${tenant}#contacto`} className="hover:text-white transition-colors">Contacto</Link>
          </nav>
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: primario, color: '#fff' }}
          >
            <ShoppingCart className="h-4 w-4" />
            Carrito
          </button>
        </div>
      </header>

      {/* Hero banner */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          backgroundColor: primario,
          backgroundImage: banner.imagenUrl ? `url(${banner.imagenUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {banner.opacidad && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${(banner.opacidad ?? 40) / 100})` }}
          />
        )}
        <div className="relative z-10 text-white max-w-2xl">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: fuenteTitulo }}
          >
            {banner.titulo ?? 'Tu visión, nuestra pasión'}
          </h1>
          <p className="text-lg mb-8 opacity-90">
            {banner.subtitulo ?? 'Encuentra los mejores lentes y monturas al mejor precio.'}
          </p>
          <Link
            href={banner.ctaUrl ?? `/${tenant}/productos`}
            className="inline-block rounded-full px-8 py-3 text-base font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: acento, color: secundario }}
          >
            {banner.ctaTexto ?? 'Ver catálogo'}
          </Link>
        </div>
      </section>

      {/* Productos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-bold text-center mb-10"
          style={{ fontFamily: fuenteTitulo, color: colorTexto }}
        >
          Productos destacados
        </h2>

        {productos.length === 0 ? (
          <div className="text-center py-20 text-[#8a8a8a]">
            <span className="text-5xl block mb-4">👓</span>
            <p className="text-lg font-medium">Próximamente</p>
            <p className="text-sm mt-1">Esta tienda está preparando su catálogo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} tenant={tenant} primario={primario} />
            ))}
          </div>
        )}
      </section>

      {/* About strip */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: secundario + '0d' }}
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="text-xl font-bold mb-3"
            style={{ fontFamily: fuenteTitulo, color: colorTexto }}
          >
            ¿Por qué elegirnos?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: colorTexto + 'cc' }}>
            Somos una óptica comprometida con tu salud visual, con los mejores profesionales y tecnología de punta para brindarte la mejor experiencia.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contacto"
        className="py-12 px-6"
        style={{ backgroundColor: secundario }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-white/70 text-sm">
          <div>
            <p
              className="text-lg font-bold mb-3"
              style={{ fontFamily: fuenteTitulo, color: acento }}
            >
              {nombreTienda.split('—')[0].trim()}
            </p>
            <p className="text-xs leading-relaxed">
              {config.meta_descripcion ?? 'Tu óptica de confianza.'}
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Contacto</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>+51 999 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>contacto@{tenant}.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Navegación</p>
            <div className="space-y-1.5 text-xs">
              <Link href={`/${tenant}`} className="block hover:text-white transition-colors">Inicio</Link>
              <Link href={`/${tenant}/productos`} className="block hover:text-white transition-colors">Productos</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {nombreTienda.split('—')[0].trim()} · Powered by OftalShop
        </div>
      </footer>
    </div>
  )
}
