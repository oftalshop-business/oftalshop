'use client'

import { ShoppingCart, Phone, Mail, MapPin, Star } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Colores {
  primario?: string
  secundario?: string
  acento?: string
  fondo?: string
  texto?: string
  encabezados?: string
}

interface Tipografia {
  titulo?: string
  cuerpo?: string
}

interface BannerConfig {
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

interface HeaderConfig {
  logoUrl?: string
  links?: { label: string; url: string }[]
  mostrarBusqueda?: boolean
  mostrarCarrito?: boolean
}

interface FooterConfig {
  textoEmpresa?: string
  col1Links?: { label: string; url: string }[]
  col2Links?: { label: string; url: string }[]
  col3Links?: { label: string; url: string }[]
  instagram?: string
  facebook?: string
  whatsapp?: string
}

interface TestimonioItem {
  nombre: string
  cargo: string
  texto: string
  rating: number
}

interface ProductosConfig {
  coleccion?: string
  cantidad?: number
  mostrarPrecio?: boolean
  mostrarBoton?: boolean
}

interface TextoConImagenConfig {
  texto?: string
  imagenUrl?: string
  posicion?: 'izquierda' | 'derecha'
  ctaTexto?: string
  ctaUrl?: string
}

interface VideoConfig {
  url?: string
}

interface SectionData {
  id: string
  tipo: string
  label: string
  activa: boolean
  config?: Record<string, unknown>
}

interface Producto {
  id: string
  nombre: string
  precio: number
  slug: string
  imagenUrl?: string
}

interface StorePreviewProps {
  secciones: SectionData[]
  colores: Colores
  tipografia: Tipografia
  espaciado?: 'compacto' | 'normal' | 'amplio'
  bordes?: 'sin-bordes' | 'redondeados' | 'muy-redondeados'
  productos?: Producto[]
  tenant?: string
  nombreTienda?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const alturaHero: Record<string, string> = {
  S: 'py-12',
  M: 'py-20',
  L: 'py-32',
  XL: 'py-44',
}

const borderRadius: Record<string, string> = {
  'sin-bordes': 'rounded-none',
  'redondeados': 'rounded-xl',
  'muy-redondeados': 'rounded-3xl',
}

const padding: Record<string, string> = {
  compacto: 'py-8',
  normal: 'py-14',
  amplio: 'py-20',
}

const SAMPLE_PRODUCTS: Producto[] = [
  { id: '1', nombre: 'Armazón Ray-Ban Clubmaster', precio: 420, slug: 'rayban-clubmaster' },
  { id: '2', nombre: 'Lentes Oakley Fuel Cell', precio: 580, slug: 'oakley-fuel-cell' },
  { id: '3', nombre: 'Lentes de Contacto Acuvue', precio: 89, slug: 'acuvue-contact' },
  { id: '4', nombre: 'Armazón Tom Ford Oscar', precio: 750, slug: 'tomford-oscar' },
]

// ─── Section renderers ────────────────────────────────────────────────────────

function AnuncioSection({ config, colores }: { config?: Record<string, unknown>; colores: Colores }) {
  const texto = (config?.texto as string) ?? '🎉 Envío gratis en pedidos mayores a S/ 200'
  return (
    <div
      className="w-full py-2 px-4 text-center text-xs font-medium"
      style={{ backgroundColor: colores.primario ?? '#2a9d8f', color: '#fff' }}
    >
      {texto}
    </div>
  )
}

function HeaderSection({ config, colores, tipografia, nombreTienda }: { config?: Record<string, unknown>; colores: Colores; tipografia: Tipografia; nombreTienda: string }) {
  const cfg = (config as HeaderConfig | undefined) ?? {}
  const links = cfg.links ?? [
    { label: 'Inicio', url: '#' },
    { label: 'Productos', url: '#' },
    { label: 'Nosotros', url: '#' },
    { label: 'Contacto', url: '#' },
  ]
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: colores.secundario ?? '#1a1a1a', borderColor: '#ffffff15' }}
    >
      <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
        {cfg.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cfg.logoUrl} alt={nombreTienda} className="h-8 object-contain" />
        ) : (
          <span
            className="text-base font-bold"
            style={{ fontFamily: tipografia.titulo ?? 'Inter', color: colores.acento ?? '#e9c46a' }}
          >
            {nombreTienda}
          </span>
        )}
        <nav className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <a key={l.label} href={l.url} className="text-xs text-white/70 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {cfg.mostrarBusqueda !== false && (
            <div className="hidden md:flex items-center rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5">
              <span className="text-xs text-white/50">Buscar...</span>
            </div>
          )}
          {cfg.mostrarCarrito !== false && (
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: colores.primario ?? '#2a9d8f' }}
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Carrito
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function BannerSection({ config, colores, tipografia, bordes }: { config?: Record<string, unknown>; colores: Colores; tipografia: Tipografia; bordes?: string }) {
  const cfg = (config as BannerConfig | undefined) ?? {}
  const altura = alturaHero[cfg.altura ?? 'L']
  const align = cfg.alineacion ?? 'center'
  const textAlign = align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center'

  return (
    <section
      className={`relative flex flex-col justify-center ${altura} px-8`}
      style={{
        backgroundColor: colores.primario ?? '#2a9d8f',
        backgroundImage: cfg.imagenUrl ? `url(${cfg.imagenUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {(cfg.opacidad ?? 0) > 0 && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: cfg.colorOverlay ?? `rgba(0,0,0,${(cfg.opacidad ?? 40) / 100})` }}
        />
      )}
      <div className={`relative z-10 max-w-xl w-full mx-auto flex flex-col ${textAlign}`}>
        <h1
          className="text-3xl font-bold text-white mb-3 leading-tight"
          style={{ fontFamily: tipografia.titulo ?? 'Inter' }}
        >
          {cfg.titulo ?? 'Tu visión, nuestra pasión'}
        </h1>
        <p className="text-sm text-white/80 mb-6">
          {cfg.subtitulo ?? 'Encuentra los mejores lentes y monturas al mejor precio.'}
        </p>
        <a
          href={cfg.ctaUrl ?? '#'}
          className={`inline-block px-6 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 w-fit ${borderRadius[bordes ?? 'redondeados']}`}
          style={{ backgroundColor: colores.acento ?? '#e9c46a', color: colores.secundario ?? '#1a1a1a' }}
        >
          {cfg.ctaTexto ?? 'Ver catálogo'}
        </a>
      </div>
    </section>
  )
}

function ProductosSection({ config, colores, tipografia, productos, tenant, bordes, espaciado }: {
  config?: Record<string, unknown>
  colores: Colores
  tipografia: Tipografia
  productos: Producto[]
  tenant: string
  bordes?: string
  espaciado?: string
}) {
  const cfg = (config as ProductosConfig | undefined) ?? {}
  const cantidad = cfg.cantidad ?? 4
  const lista = productos.slice(0, cantidad).length > 0 ? productos.slice(0, cantidad) : SAMPLE_PRODUCTS.slice(0, cantidad)
  const py = padding[espaciado ?? 'normal']
  const rounded = borderRadius[bordes ?? 'redondeados']

  return (
    <section className={`max-w-5xl mx-auto px-6 ${py}`}>
      <h2
        className="text-xl font-bold text-center mb-8"
        style={{ fontFamily: tipografia.titulo ?? 'Inter', color: colores.texto ?? '#1a1a1a' }}
      >
        Productos destacados
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {lista.map((p) => (
          <a key={p.id} href={`/${tenant}/productos/${p.slug}`} className={`block border overflow-hidden hover:shadow-md transition-shadow bg-white ${rounded}`} style={{ borderColor: '#e1e1e1' }}>
            <div className="h-36 bg-[#f7f7f7] flex items-center justify-center text-3xl">
              {p.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagenUrl} alt={p.nombre} className="h-full w-full object-cover" />
              ) : '👓'}
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-2 mb-1">{p.nombre}</p>
              {cfg.mostrarPrecio !== false && (
                <p className="text-sm font-bold" style={{ color: colores.primario ?? '#2a9d8f' }}>
                  S/ {Number(p.precio).toFixed(2)}
                </p>
              )}
              {cfg.mostrarBoton !== false && (
                <button
                  className={`mt-2 w-full py-1.5 text-[10px] font-semibold text-white ${rounded}`}
                  style={{ backgroundColor: colores.primario ?? '#2a9d8f' }}
                >
                  Agregar
                </button>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function TextoConImagenSection({ config, colores, tipografia, bordes, espaciado }: {
  config?: Record<string, unknown>
  colores: Colores
  tipografia: Tipografia
  bordes?: string
  espaciado?: string
}) {
  const cfg = (config as TextoConImagenConfig | undefined) ?? {}
  const py = padding[espaciado ?? 'normal']
  const isRight = cfg.posicion === 'derecha'

  return (
    <section className={`max-w-5xl mx-auto px-6 ${py}`}>
      <div className={`flex flex-col md:flex-row gap-10 items-center ${isRight ? 'md:flex-row-reverse' : ''}`}>
        <div className={`flex-1 h-56 bg-[#f7f7f7] ${borderRadius[bordes ?? 'redondeados']} overflow-hidden flex items-center justify-center`}>
          {cfg.imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.imagenUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🏥</span>
          )}
        </div>
        <div className="flex-1">
          <p
            className="text-base leading-relaxed mb-5"
            style={{ color: colores.texto ?? '#1a1a1a', fontFamily: tipografia.cuerpo ?? 'Inter' }}
          >
            {cfg.texto ?? 'Somos una óptica comprometida con tu salud visual, con los mejores profesionales y tecnología de punta.'}
          </p>
          {cfg.ctaTexto && (
            <a
              href={cfg.ctaUrl ?? '#'}
              className={`inline-block px-5 py-2 text-sm font-semibold text-white ${borderRadius[bordes ?? 'redondeados']}`}
              style={{ backgroundColor: colores.primario ?? '#2a9d8f' }}
            >
              {cfg.ctaTexto}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function VideoSection({ config }: { config?: Record<string, unknown> }) {
  const cfg = (config as VideoConfig | undefined) ?? {}
  if (!cfg.url) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-48 rounded-xl bg-[#f1f1f1] flex items-center justify-center">
          <p className="text-sm text-[#8a8a8a]">Video no configurado</p>
        </div>
      </section>
    )
  }
  const embedUrl = cfg.url
    .replace('watch?v=', 'embed/')
    .replace('youtu.be/', 'www.youtube.com/embed/')
    .replace('vimeo.com/', 'player.vimeo.com/video/')

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="video" />
      </div>
    </section>
  )
}

function TestimoniosSection({ config, colores, tipografia, espaciado }: { config?: Record<string, unknown>; colores: Colores; tipografia: Tipografia; espaciado?: string }) {
  const items = ((config?.items as TestimonioItem[]) ?? [
    { nombre: 'María García', cargo: 'Óptica Lima', texto: 'Excelente servicio y atención personalizada. ¡100% recomendado!', rating: 5 },
    { nombre: 'Carlos Torres', cargo: 'Paciente', texto: 'Quedé muy satisfecho con los lentes. La calidad es increíble.', rating: 5 },
    { nombre: 'Ana López', cargo: 'Cliente frecuente', texto: 'La mejor óptica de la ciudad sin duda alguna.', rating: 5 },
  ])
  const py = padding[espaciado ?? 'normal']

  return (
    <section className={`max-w-5xl mx-auto px-6 ${py}`} style={{ backgroundColor: `${colores.primario ?? '#2a9d8f'}0d` }}>
      <h2 className="text-xl font-bold text-center mb-8" style={{ fontFamily: tipografia.titulo ?? 'Inter', color: colores.texto ?? '#1a1a1a' }}>
        Lo que dicen nuestros clientes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div key={i} className="rounded-xl border border-[#e1e1e1] bg-white p-5">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
            <p className="text-xs text-[#4a4a4a] mb-4 leading-relaxed">&ldquo;{t.texto}&rdquo;</p>
            <div>
              <p className="text-xs font-semibold text-[#1a1a1a]">{t.nombre}</p>
              <p className="text-[10px] text-[#8a8a8a]">{t.cargo}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function NewsletterSection({ colores, tipografia, bordes }: { colores: Colores; tipografia: Tipografia; bordes?: string }) {
  return (
    <section className="py-12 px-6 text-center" style={{ backgroundColor: colores.primario ?? '#2a9d8f' }}>
      <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: tipografia.titulo ?? 'Inter' }}>
        Suscríbete y recibe ofertas exclusivas
      </h2>
      <p className="text-white/70 text-sm mb-6">Entérate primero de nuestras promociones y nuevos productos.</p>
      <div className="flex max-w-sm mx-auto gap-2">
        <input
          type="email"
          placeholder="tu@email.com"
          className={`flex-1 px-4 py-2.5 text-sm outline-none ${borderRadius[bordes ?? 'redondeados']}`}
        />
        <button
          className={`px-5 py-2.5 text-sm font-semibold text-white ${borderRadius[bordes ?? 'redondeados']}`}
          style={{ backgroundColor: colores.secundario ?? '#1a1a1a' }}
        >
          Suscribirse
        </button>
      </div>
    </section>
  )
}

function FooterSection({ config, colores, tipografia, nombreTienda }: { config?: Record<string, unknown>; colores: Colores; tipografia: Tipografia; nombreTienda: string }) {
  const cfg = (config as FooterConfig | undefined) ?? {}
  return (
    <footer className="py-10 px-6" style={{ backgroundColor: colores.secundario ?? '#1a1a1a' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-white/60 text-xs">
        <div className="md:col-span-2">
          <p className="text-sm font-bold mb-2" style={{ fontFamily: tipografia.titulo ?? 'Inter', color: colores.acento ?? '#e9c46a' }}>
            {nombreTienda}
          </p>
          <p className="leading-relaxed">{cfg.textoEmpresa ?? 'Tu óptica de confianza. Cuidamos tu visión con los mejores profesionales.'}</p>
          <div className="flex gap-3 mt-4">
            {[cfg.instagram && 'Instagram', cfg.facebook && 'Facebook', cfg.whatsapp && 'WhatsApp'].filter(Boolean).map((s) => (
              <a key={s as string} href="#" className="text-[10px] text-white/40 hover:text-white transition-colors">{s}</a>
            ))}
            {!cfg.instagram && !cfg.facebook && !cfg.whatsapp && (
              ['Instagram', 'Facebook', 'WhatsApp'].map((s) => (
                <a key={s} href="#" className="text-[10px] text-white/40 hover:text-white transition-colors">{s}</a>
              ))
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white mb-3">Contacto</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><span>+51 999 123 456</span></div>
            <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /><span>contacto@tienda.com</span></div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /><span>Lima, Perú</span></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-white mb-3">Navegación</p>
          <div className="space-y-1.5">
            {(cfg.col1Links ?? [{ label: 'Inicio', url: '#' }, { label: 'Productos', url: '#' }, { label: 'Contacto', url: '#' }]).map((l) => (
              <a key={l.label} href={l.url} className="block hover:text-white transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-5 border-t border-white/10 text-center text-[10px] text-white/30">
        © {new Date().getFullYear()} {nombreTienda} · Powered by OftalShop
      </div>
    </footer>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StorePreview({
  secciones,
  colores,
  tipografia,
  espaciado = 'normal',
  bordes = 'redondeados',
  productos = [],
  tenant = 'demo',
  nombreTienda = 'Mi Óptica',
}: StorePreviewProps) {
  const activeSections = secciones.filter((s) => s.activa)

  return (
    <div
      style={{
        backgroundColor: colores.fondo ?? '#ffffff',
        color: colores.texto ?? '#1a1a1a',
        fontFamily: tipografia.cuerpo ?? 'Inter',
        minHeight: '100%',
      }}
    >
      {activeSections.map((sec) => {
        switch (sec.tipo) {
          case 'anuncio':
            return <AnuncioSection key={sec.id} config={sec.config} colores={colores} />
          case 'header':
            return <HeaderSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} nombreTienda={nombreTienda} />
          case 'banner':
            return <BannerSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} bordes={bordes} />
          case 'coleccion':
            return (
              <section key={sec.id} className={`max-w-5xl mx-auto px-6 ${padding[espaciado]}`}>
                <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: tipografia.titulo ?? 'Inter', color: colores.texto ?? '#1a1a1a' }}>Colecciones</h2>
                <div className="grid grid-cols-3 gap-4">
                  {['Monturas', 'Lentes de contacto', 'Accesorios'].map((c) => (
                    <div key={c} className={`h-28 flex items-center justify-center font-semibold text-white text-sm ${borderRadius[bordes]}`} style={{ backgroundColor: colores.primario ?? '#2a9d8f' }}>
                      {c}
                    </div>
                  ))}
                </div>
              </section>
            )
          case 'productos':
            return <ProductosSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} productos={productos} tenant={tenant} bordes={bordes} espaciado={espaciado} />
          case 'texto':
            return <TextoConImagenSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} bordes={bordes} espaciado={espaciado} />
          case 'video':
            return <VideoSection key={sec.id} config={sec.config} />
          case 'testimonios':
            return <TestimoniosSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} espaciado={espaciado} />
          case 'newsletter':
            return <NewsletterSection key={sec.id} colores={colores} tipografia={tipografia} bordes={bordes} />
          case 'mapa':
            return (
              <section key={sec.id} className={`max-w-5xl mx-auto px-6 ${padding[espaciado]}`}>
                <div className={`h-40 bg-[#e2e8f0] flex items-center justify-center ${borderRadius[bordes]}`}>
                  <div className="text-center text-[#64748b]">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Mapa de ubicación</p>
                  </div>
                </div>
              </section>
            )
          case 'galeria':
            return (
              <section key={sec.id} className={`max-w-5xl mx-auto px-6 ${padding[espaciado]}`}>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`h-24 bg-[#f1f1f1] flex items-center justify-center text-2xl ${borderRadius[bordes]}`}>🖼️</div>
                  ))}
                </div>
              </section>
            )
          case 'footer':
            return <FooterSection key={sec.id} config={sec.config} colores={colores} tipografia={tipografia} nombreTienda={nombreTienda} />
          default:
            return null
        }
      })}
    </div>
  )
}
