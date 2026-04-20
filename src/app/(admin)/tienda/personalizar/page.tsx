'use client'

import { useState, useRef } from 'react'
import {
  Save, Monitor, Tablet, Smartphone, GripVertical, ChevronDown, ChevronUp,
  Plus, Image, Type, Video, Users, Mail, Navigation, Layers,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Device = 'desktop' | 'tablet' | 'mobile'

interface BannerConfig {
  titulo: string
  subtitulo: string
  ctaTexto: string
  ctaUrl: string
  opacidad: number
  imagenUrl: string
}

interface ProductosConfig {
  coleccion: string
  cantidad: number
}

interface TextoConfig {
  texto: string
  alineacion: 'left' | 'center' | 'right'
  colorTexto: string
  colorFondo: string
}

interface VideoConfig {
  url: string
}

interface SectionConfig {
  banner: BannerConfig
  productos: ProductosConfig
  texto: TextoConfig
  video: VideoConfig
}

interface Section {
  id: string
  tipo: keyof SectionConfig | 'header' | 'coleccion' | 'testimonios' | 'newsletter' | 'footer'
  label: string
  icono: React.ElementType
  activa: boolean
}

interface ColoresConfig {
  primario: string
  secundario: string
  acento: string
  fondo: string
  texto: string
}

interface TipografiaConfig {
  titulo: string
  cuerpo: string
}

// ─── Initial state ────────────────────────────────────────────────────────────

const SECCIONES_INIT: Section[] = [
  { id: 'header', tipo: 'header', label: 'Header / Navegación', icono: Navigation, activa: true },
  { id: 'banner', tipo: 'banner', label: 'Banner principal', icono: Image, activa: true },
  { id: 'coleccion', tipo: 'coleccion', label: 'Colección destacada', icono: Layers, activa: true },
  { id: 'productos', tipo: 'productos', label: 'Productos destacados', icono: Layers, activa: true },
  { id: 'texto', tipo: 'texto', label: 'Texto con imagen', icono: Type, activa: true },
  { id: 'video', tipo: 'video', label: 'Video', icono: Video, activa: false },
  { id: 'testimonios', tipo: 'testimonios', label: 'Testimonios', icono: Users, activa: true },
  { id: 'newsletter', tipo: 'newsletter', label: 'Newsletter', icono: Mail, activa: true },
  { id: 'footer', tipo: 'footer', label: 'Footer', icono: Navigation, activa: true },
]

const BANNER_INIT: BannerConfig = {
  titulo: 'Tu visión, nuestra pasión',
  subtitulo: 'Encuentra los mejores lentes y monturas al mejor precio.',
  ctaTexto: 'Ver catálogo',
  ctaUrl: '/productos',
  opacidad: 40,
  imagenUrl: '',
}

const PRODUCTOS_INIT: ProductosConfig = { coleccion: 'Todos', cantidad: 4 }

const TEXTO_INIT: TextoConfig = {
  texto: 'Somos una óptica comprometida con tu salud visual.',
  alineacion: 'left',
  colorTexto: '#1a1a1a',
  colorFondo: '#ffffff',
}

const VIDEO_INIT: VideoConfig = { url: '' }

const COLORES_INIT: ColoresConfig = {
  primario: '#2a9d8f',
  secundario: '#1a1a1a',
  acento: '#e9c46a',
  fondo: '#ffffff',
  texto: '#1a1a1a',
}

const TIPOGRAFIA_INIT: TipografiaConfig = { titulo: 'Inter', cuerpo: 'Inter' }

// ─── Panel helpers ────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]'

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium text-[#6a6a6a] mb-1">{children}</label>
}

// ─── Section editors ──────────────────────────────────────────────────────────

function BannerEditor({
  config,
  onChange,
}: {
  config: BannerConfig
  onChange: (c: BannerConfig) => void
}) {
  const f = (k: keyof BannerConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...config, [k]: k === 'opacidad' ? Number(e.target.value) : e.target.value })

  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Imagen de fondo</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-16 flex items-center justify-center text-[#8a8a8a] text-xs">
            {config.imagenUrl ? (
              <img src={config.imagenUrl} alt="" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <span>Arrastra una imagen</span>
            )}
          </div>
          <button className="rounded-lg border border-[#e1e1e1] px-3 py-2 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7]">
            <Image className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div>
        <Label>Título</Label>
        <input className={inputCls} value={config.titulo} onChange={f('titulo')} />
      </div>
      <div>
        <Label>Subtítulo</Label>
        <input className={inputCls} value={config.subtitulo} onChange={f('subtitulo')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Texto del botón</Label>
          <input className={inputCls} value={config.ctaTexto} onChange={f('ctaTexto')} />
        </div>
        <div>
          <Label>URL del botón</Label>
          <input className={inputCls} value={config.ctaUrl} onChange={f('ctaUrl')} />
        </div>
      </div>
      <div>
        <Label>Opacidad overlay ({config.opacidad}%)</Label>
        <input
          type="range"
          min={0}
          max={80}
          value={config.opacidad}
          onChange={f('opacidad')}
          className="w-full accent-[#2a9d8f]"
        />
      </div>
    </div>
  )
}

function ProductosEditor({
  config,
  onChange,
}: {
  config: ProductosConfig
  onChange: (c: ProductosConfig) => void
}) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Colección</Label>
        <select
          className={inputCls}
          value={config.coleccion}
          onChange={(e) => onChange({ ...config, coleccion: e.target.value })}
        >
          {['Todos', 'Monturas', 'Lentes de contacto', 'Lentes de sol', 'Accesorios'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Número de productos ({config.cantidad})</Label>
        <input
          type="range"
          min={2}
          max={12}
          value={config.cantidad}
          onChange={(e) => onChange({ ...config, cantidad: Number(e.target.value) })}
          className="w-full accent-[#2a9d8f]"
        />
      </div>
    </div>
  )
}

function TextoEditor({
  config,
  onChange,
}: {
  config: TextoConfig
  onChange: (c: TextoConfig) => void
}) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Texto</Label>
        <textarea
          className={inputCls + ' resize-none h-20'}
          value={config.texto}
          onChange={(e) => onChange({ ...config, texto: e.target.value })}
        />
      </div>
      <div>
        <Label>Alineación</Label>
        <div className="flex gap-1">
          {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(
            ([val, Icon]) => (
              <button
                key={val}
                onClick={() => onChange({ ...config, alineacion: val })}
                className={`rounded-lg border p-2 transition-colors ${
                  config.alineacion === val
                    ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]'
                    : 'border-[#e1e1e1] text-[#6a6a6a] hover:bg-[#fafafa]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            )
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Color texto</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.colorTexto}
              onChange={(e) => onChange({ ...config, colorTexto: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer border border-[#e1e1e1]"
            />
            <span className="text-xs text-[#6a6a6a]">{config.colorTexto}</span>
          </div>
        </div>
        <div>
          <Label>Color fondo</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.colorFondo}
              onChange={(e) => onChange({ ...config, colorFondo: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer border border-[#e1e1e1]"
            />
            <span className="text-xs text-[#6a6a6a]">{config.colorFondo}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoEditor({
  config,
  onChange,
}: {
  config: VideoConfig
  onChange: (c: VideoConfig) => void
}) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>URL del video (YouTube / Vimeo)</Label>
        <input
          className={inputCls}
          value={config.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  )
}

// ─── Config tab ───────────────────────────────────────────────────────────────

function ConfiguracionTab({
  colores,
  onColores,
  tipografia,
  onTipografia,
}: {
  colores: ColoresConfig
  onColores: (c: ColoresConfig) => void
  tipografia: TipografiaConfig
  onTipografia: (t: TipografiaConfig) => void
}) {
  const FUENTES = ['Inter', 'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Playfair Display', 'Poppins']

  return (
    <div className="space-y-6 px-4 py-4">
      <div>
        <p className="text-xs font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Colores</p>
        <div className="space-y-2.5">
          {(
            [
              ['primario', 'Primario'],
              ['secundario', 'Secundario'],
              ['acento', 'Acento'],
              ['fondo', 'Fondo'],
              ['texto', 'Texto'],
            ] as [keyof ColoresConfig, string][]
          ).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-xs text-[#4a4a4a]">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8a8a8a]">{colores[k]}</span>
                <input
                  type="color"
                  value={colores[k]}
                  onChange={(e) => onColores({ ...colores, [k]: e.target.value })}
                  className="h-7 w-7 rounded-md cursor-pointer border border-[#e1e1e1]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Tipografía</p>
        <div className="space-y-2.5">
          <div>
            <Label>Fuente para títulos</Label>
            <select
              className={inputCls}
              value={tipografia.titulo}
              onChange={(e) => onTipografia({ ...tipografia, titulo: e.target.value })}
            >
              {FUENTES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <Label>Fuente para cuerpo</Label>
            <select
              className={inputCls}
              value={tipografia.cuerpo}
              onChange={(e) => onTipografia({ ...tipografia, cuerpo: e.target.value })}
            >
              {FUENTES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Identidad</p>
        <div className="space-y-2.5">
          <div>
            <Label>Logo</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-12 px-3 cursor-pointer hover:bg-[#f0f0f0] transition-colors">
              <Image className="h-4 w-4 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir logo (PNG/SVG)</span>
            </div>
          </div>
          <div>
            <Label>Favicon</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-12 px-3 cursor-pointer hover:bg-[#f0f0f0] transition-colors">
              <Image className="h-4 w-4 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir favicon (32×32)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function StorePreview({
  banner,
  productos,
  texto,
  colores,
  tipografia,
  secciones,
}: {
  banner: BannerConfig
  productos: ProductosConfig
  texto: TextoConfig
  colores: ColoresConfig
  tipografia: TipografiaConfig
  secciones: Section[]
}) {
  const activas = secciones.filter((s) => s.activa)

  return (
    <div className="h-full overflow-y-auto bg-white text-sm" style={{ fontFamily: tipografia.cuerpo }}>
      {/* Header */}
      {activas.find((s) => s.tipo === 'header') && (
        <header
          className="flex items-center justify-between px-8 py-4 border-b"
          style={{ backgroundColor: colores.secundario, color: '#fff' }}
        >
          <div
            className="text-lg font-bold"
            style={{ fontFamily: tipografia.titulo, color: colores.acento }}
          >
            OftalShop
          </div>
          <nav className="flex gap-6 text-xs text-white/80">
            <span>Inicio</span>
            <span>Productos</span>
            <span>Nosotros</span>
            <span>Contacto</span>
          </nav>
        </header>
      )}

      {/* Banner */}
      {activas.find((s) => s.tipo === 'banner') && (
        <div
          className="relative flex flex-col items-center justify-center py-20 px-8 text-center"
          style={{
            backgroundColor: colores.primario,
            backgroundImage: banner.imagenUrl ? `url(${banner.imagenUrl})` : undefined,
            backgroundSize: 'cover',
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${banner.opacidad / 100})` }}
          />
          <div className="relative z-10 text-white">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: tipografia.titulo }}
            >
              {banner.titulo}
            </h1>
            <p className="text-sm mb-6 opacity-90">{banner.subtitulo}</p>
            <button
              className="rounded-full px-6 py-2 text-sm font-semibold"
              style={{ backgroundColor: colores.acento, color: colores.secundario }}
            >
              {banner.ctaTexto}
            </button>
          </div>
        </div>
      )}

      {/* Productos */}
      {activas.find((s) => s.tipo === 'productos') && (
        <section className="px-8 py-10" style={{ backgroundColor: colores.fondo }}>
          <h2
            className="text-xl font-bold mb-6 text-center"
            style={{ fontFamily: tipografia.titulo, color: colores.texto }}
          >
            Productos destacados — {productos.coleccion}
          </h2>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(productos.cantidad, 4)}, 1fr)` }}
          >
            {Array.from({ length: productos.cantidad }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#e1e1e1] overflow-hidden">
                <div
                  className="h-28 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: colores.primario + '22' }}
                >
                  👓
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold" style={{ color: colores.texto }}>
                    Producto {i + 1}
                  </p>
                  <p
                    className="text-xs font-bold mt-1"
                    style={{ color: colores.primario }}
                  >
                    S/ {(89 + i * 15).toFixed(2)}
                  </p>
                  <button
                    className="mt-2 w-full rounded-lg py-1 text-xs text-white text-center"
                    style={{ backgroundColor: colores.primario }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Texto */}
      {activas.find((s) => s.tipo === 'texto') && (
        <section
          className="px-8 py-10"
          style={{ backgroundColor: texto.colorFondo, textAlign: texto.alineacion }}
        >
          <p className="text-sm leading-relaxed" style={{ color: texto.colorTexto }}>
            {texto.texto}
          </p>
        </section>
      )}

      {/* Footer */}
      {activas.find((s) => s.tipo === 'footer') && (
        <footer className="px-8 py-6 text-xs text-white/60 text-center" style={{ backgroundColor: colores.secundario }}>
          © 2026 OftalShop · Todos los derechos reservados
        </footer>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PersonalizarPage() {
  const [tab, setTab] = useState<'secciones' | 'configuracion'>('secciones')
  const [device, setDevice] = useState<Device>('desktop')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [secciones, setSecciones] = useState(SECCIONES_INIT)
  const [banner, setBanner] = useState(BANNER_INIT)
  const [productosCfg, setProductosCfg] = useState(PRODUCTOS_INIT)
  const [textoCfg, setTextoCfg] = useState(TEXTO_INIT)
  const [videoCfg, setVideoCfg] = useState(VIDEO_INIT)
  const [colores, setColores] = useState(COLORES_INIT)
  const [tipografia, setTipografia] = useState(TIPOGRAFIA_INIT)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function moverSeccion(id: string, dir: -1 | 1) {
    setSecciones((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({
      clave: 'personalizar',
      valor: { secciones, banner, productos: productosCfg, texto: textoCfg, video: videoCfg, colores, tipografia },
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const deviceWidths: Record<Device, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="fixed inset-0 flex bg-[#f1f1f1]" style={{ top: 0, left: 0, zIndex: 40 }}>
      {/* Left panel */}
      <aside className="w-[300px] shrink-0 flex flex-col bg-white border-r border-[#e1e1e1] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e1e1]">
          <div>
            <p className="text-xs text-[#8a8a8a]">Personalizando</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">Óptica Esencial</p>
          </div>
          <button
            onClick={guardar}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Guardando…' : saved ? '¡Guardado!' : 'Guardar'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e1e1e1]">
          {(['secciones', 'configuracion'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]'
                  : 'text-[#6a6a6a] hover:text-[#1a1a1a]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'secciones' ? (
            <div>
              {secciones.map((sec, idx) => {
                const Icono = sec.icono
                const isExpanded = expandedId === sec.id

                return (
                  <div key={sec.id} className="border-b border-[#f1f1f1]">
                    <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#fafafa]">
                      {/* Drag handle + arrows */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moverSeccion(sec.id, -1)}
                          disabled={idx === 0}
                          className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-[#c9c9c9]" />
                        <button
                          onClick={() => moverSeccion(sec.id, 1)}
                          disabled={idx === secciones.length - 1}
                          className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                      <Icono className="h-3.5 w-3.5 text-[#6a6a6a] shrink-0" />
                      <button
                        onClick={() => toggleExpand(sec.id)}
                        className="flex-1 text-left text-xs font-medium text-[#1a1a1a]"
                      >
                        {sec.label}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="bg-[#fafafa] border-t border-[#f1f1f1]">
                        {sec.tipo === 'banner' && (
                          <BannerEditor config={banner} onChange={setBanner} />
                        )}
                        {sec.tipo === 'productos' && (
                          <ProductosEditor config={productosCfg} onChange={setProductosCfg} />
                        )}
                        {sec.tipo === 'texto' && (
                          <TextoEditor config={textoCfg} onChange={setTextoCfg} />
                        )}
                        {sec.tipo === 'video' && (
                          <VideoEditor config={videoCfg} onChange={setVideoCfg} />
                        )}
                        {!['banner', 'productos', 'texto', 'video'].includes(sec.tipo) && (
                          <div className="px-4 py-3 text-xs text-[#8a8a8a]">
                            Esta sección no tiene opciones de edición.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Add section */}
              <button className="flex w-full items-center gap-2 px-4 py-3 text-xs font-medium text-[#2a9d8f] hover:bg-[#f0fdf9] transition-colors">
                <Plus className="h-4 w-4" />
                Agregar sección
              </button>
            </div>
          ) : (
            <ConfiguracionTab
              colores={colores}
              onColores={setColores}
              tipografia={tipografia}
              onTipografia={setTipografia}
            />
          )}
        </div>
      </aside>

      {/* Right: preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Device topbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e1e1e1]">
          <div className="flex items-center gap-1 rounded-lg border border-[#e1e1e1] p-0.5">
            {([
              ['desktop', Monitor],
              ['tablet', Tablet],
              ['mobile', Smartphone],
            ] as [Device, React.ElementType][]).map(([d, Icon]) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === d ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a] hover:text-[#1a1a1a]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <a
            href="/tienda"
            className="text-xs text-[#6a6a6a] hover:text-[#1a1a1a] underline"
          >
            ← Salir del editor
          </a>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6 bg-[#f1f1f1]">
          <div
            className="h-full rounded-xl border border-[#e1e1e1] shadow-lg overflow-hidden transition-all duration-300 bg-white"
            style={{ width: deviceWidths[device], minHeight: '600px', maxWidth: '100%' }}
          >
            <StorePreview
              banner={banner}
              productos={productosCfg}
              texto={textoCfg}
              colores={colores}
              tipografia={tipografia}
              secciones={secciones}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
