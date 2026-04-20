'use client'

import { useState } from 'react'
import {
  Save, Monitor, Tablet, Smartphone, GripVertical, ChevronDown, ChevronUp,
  Plus, Image, Type, Video, Users, Mail, Navigation, Layers,
  AlignLeft, AlignCenter, AlignRight, Lock, X, Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import OpticaEsencial from '@/components/templates/OpticaEsencial'
import ClinicaConfianza from '@/components/templates/ClinicaConfianza'
import LensShop from '@/components/templates/LensShop'
import VisionPro from '@/components/templates/VisionPro'
import LuxOptic from '@/components/templates/LuxOptic'
import MedCenterPro from '@/components/templates/MedCenterPro'

// ─── Types ────────────────────────────────────────────────────────────────────

type Device = 'desktop' | 'tablet' | 'mobile'
type TemplateId = 'optica-esencial' | 'clinica-confianza' | 'lensshop' | 'visionpro' | 'luxoptic' | 'medcenter-pro'

interface BannerConfig { titulo: string; subtitulo: string; ctaTexto: string; ctaUrl: string; opacidad: number; imagenUrl: string }
interface ProductosConfig { coleccion: string; cantidad: number }
interface TextoConfig { texto: string; alineacion: 'left' | 'center' | 'right'; colorTexto: string; colorFondo: string }
interface VideoConfig { url: string }
interface SectionConfig { banner: BannerConfig; productos: ProductosConfig; texto: TextoConfig; video: VideoConfig }
interface Section {
  id: string
  tipo: keyof SectionConfig | 'header' | 'coleccion' | 'testimonios' | 'newsletter' | 'footer'
  label: string
  icono: React.ElementType
  activa: boolean
}
interface ColoresConfig { primario: string; secundario: string; acento: string; fondo: string; texto: string }
interface TipografiaConfig { titulo: string; cuerpo: string }

interface TemplateInfo {
  id: TemplateId
  nombre: string
  precio: 'gratis' | 'premium'
  color: string
  accent: string
}

// ─── Template registry ────────────────────────────────────────────────────────

const TEMPLATES: TemplateInfo[] = [
  { id: 'optica-esencial', nombre: 'Óptica Esencial', precio: 'gratis', color: '#f0fdf4', accent: '#00a651' },
  { id: 'clinica-confianza', nombre: 'Clínica Confianza', precio: 'gratis', color: '#eff6ff', accent: '#1e40af' },
  { id: 'lensshop', nombre: 'LensShop', precio: 'gratis', color: '#0a0a0a', accent: '#c9a84c' },
  { id: 'visionpro', nombre: 'VisionPro', precio: 'premium', color: '#f8f8f8', accent: '#0066ff' },
  { id: 'luxoptic', nombre: 'LuxOptic', precio: 'premium', color: '#000', accent: '#e63946' },
  { id: 'medcenter-pro', nombre: 'MedCenter Pro', precio: 'premium', color: '#eaf0fa', accent: '#003366' },
]

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

const BANNER_INIT: BannerConfig = { titulo: 'Tu visión, nuestra pasión', subtitulo: 'Encuentra los mejores lentes y monturas al mejor precio.', ctaTexto: 'Ver catálogo', ctaUrl: '/productos', opacidad: 40, imagenUrl: '' }
const PRODUCTOS_INIT: ProductosConfig = { coleccion: 'Todos', cantidad: 4 }
const TEXTO_INIT: TextoConfig = { texto: 'Somos una óptica comprometida con tu salud visual.', alineacion: 'left', colorTexto: '#1a1a1a', colorFondo: '#ffffff' }
const VIDEO_INIT: VideoConfig = { url: '' }
const COLORES_INIT: ColoresConfig = { primario: '#2a9d8f', secundario: '#1a1a1a', acento: '#e9c46a', fondo: '#ffffff', texto: '#1a1a1a' }
const TIPOGRAFIA_INIT: TipografiaConfig = { titulo: 'Inter', cuerpo: 'Inter' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]'
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium text-[#6a6a6a] mb-1">{children}</label>
}

// ─── Section editors ──────────────────────────────────────────────────────────

function BannerEditor({ config, onChange }: { config: BannerConfig; onChange: (c: BannerConfig) => void }) {
  const f = (k: keyof BannerConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...config, [k]: k === 'opacidad' ? Number(e.target.value) : e.target.value })
  return (
    <div className="space-y-3 px-4 pb-4">
      <div><Label>Título</Label><input className={inputCls} value={config.titulo} onChange={f('titulo')} /></div>
      <div><Label>Subtítulo</Label><input className={inputCls} value={config.subtitulo} onChange={f('subtitulo')} /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Texto del botón</Label><input className={inputCls} value={config.ctaTexto} onChange={f('ctaTexto')} /></div>
        <div><Label>URL del botón</Label><input className={inputCls} value={config.ctaUrl} onChange={f('ctaUrl')} /></div>
      </div>
      <div>
        <Label>Opacidad overlay ({config.opacidad}%)</Label>
        <input type="range" min={0} max={80} value={config.opacidad} onChange={f('opacidad')} className="w-full accent-[#2a9d8f]" />
      </div>
    </div>
  )
}

function ProductosEditor({ config, onChange }: { config: ProductosConfig; onChange: (c: ProductosConfig) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Colección</Label>
        <select className={inputCls} value={config.coleccion} onChange={(e) => onChange({ ...config, coleccion: e.target.value })}>
          {['Todos', 'Monturas', 'Lentes de contacto', 'Lentes de sol', 'Accesorios'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label>Número de productos ({config.cantidad})</Label>
        <input type="range" min={2} max={12} value={config.cantidad} onChange={(e) => onChange({ ...config, cantidad: Number(e.target.value) })} className="w-full accent-[#2a9d8f]" />
      </div>
    </div>
  )
}

function TextoEditor({ config, onChange }: { config: TextoConfig; onChange: (c: TextoConfig) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Texto</Label>
        <textarea className={inputCls + ' resize-none h-20'} value={config.texto} onChange={(e) => onChange({ ...config, texto: e.target.value })} />
      </div>
      <div>
        <Label>Alineación</Label>
        <div className="flex gap-1">
          {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([val, Icon]) => (
            <button key={val} onClick={() => onChange({ ...config, alineacion: val })} className={`rounded-lg border p-2 transition-colors ${config.alineacion === val ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Config tab ───────────────────────────────────────────────────────────────

function ConfiguracionTab({ colores, onColores, tipografia, onTipografia }: { colores: ColoresConfig; onColores: (c: ColoresConfig) => void; tipografia: TipografiaConfig; onTipografia: (t: TipografiaConfig) => void }) {
  const FUENTES = ['Inter', 'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Playfair Display', 'Poppins']
  return (
    <div className="space-y-6 px-4 py-4">
      <div>
        <p className="text-xs font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Colores</p>
        <div className="space-y-2.5">
          {(['primario', 'secundario', 'acento', 'fondo', 'texto'] as const).map((k) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-xs text-[#4a4a4a] capitalize">{k}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8a8a8a]">{colores[k]}</span>
                <input type="color" value={colores[k]} onChange={(e) => onColores({ ...colores, [k]: e.target.value })} className="h-7 w-7 rounded-md cursor-pointer border border-[#e1e1e1]" />
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
            <select className={inputCls} value={tipografia.titulo} onChange={(e) => onTipografia({ ...tipografia, titulo: e.target.value })}>
              {FUENTES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <Label>Fuente para cuerpo</Label>
            <select className={inputCls} value={tipografia.cuerpo} onChange={(e) => onTipografia({ ...tipografia, cuerpo: e.target.value })}>
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
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-12 px-3 cursor-pointer hover:bg-[#f0f0f0]">
              <Image className="h-4 w-4 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir logo (PNG/SVG)</span>
            </div>
          </div>
          <div>
            <Label>Favicon</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-12 px-3 cursor-pointer hover:bg-[#f0f0f0]">
              <Image className="h-4 w-4 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir favicon (32×32)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal premium lock ───────────────────────────────────────────────────────

function ModalPremium({ nombre, onClose, onComprar }: { nombre: string; onClose: () => void; onComprar: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-center">
        <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#fef9c3] flex items-center justify-center">
          <Lock className="h-7 w-7 text-[#854d0e]" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Plantilla Premium</h3>
        <p className="text-sm text-[#6a6a6a] mb-5"><strong>{nombre}</strong> es una plantilla premium.<br />Cómprala por S/ 65 para usarla.</p>
        <button onClick={onComprar} className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-semibold text-white mb-2">
          Comprar S/ 65
        </button>
        <button onClick={onClose} className="w-full rounded-lg border border-[#e1e1e1] py-2.5 text-sm text-[#6a6a6a]">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Template preview selector ────────────────────────────────────────────────

function TemplateSelector({ current, onSelect, onPremiumLock }: { current: TemplateId; onSelect: (id: TemplateId) => void; onPremiumLock: (t: TemplateInfo) => void }) {
  const [open, setOpen] = useState(false)
  const currentInfo = TEMPLATES.find(t => t.id === current)!

  return (
    <div className="px-4 py-3 border-b border-[#e1e1e1]">
      <p className="text-[11px] text-[#8a8a8a] mb-1.5 uppercase tracking-wider">Plantilla activa</p>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full rounded-lg border border-[#e1e1e1] px-3 py-2 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-8 rounded shrink-0" style={{ backgroundColor: currentInfo.color, border: `2px solid ${currentInfo.accent}` }} />
          <span className="text-xs font-medium text-[#1a1a1a]">{currentInfo.nombre}</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-[#8a8a8a] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-1 rounded-xl border border-[#e1e1e1] bg-white shadow-lg overflow-hidden">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => {
                if (t.precio === 'premium' && t.id !== current) {
                  onPremiumLock(t)
                } else {
                  onSelect(t.id)
                  setOpen(false)
                }
              }}
              className={`flex items-center justify-between w-full px-3 py-2.5 text-xs hover:bg-[#fafafa] transition-colors ${t.id === current ? 'bg-[#f0fdf9]' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-7 rounded shrink-0" style={{ backgroundColor: t.color, border: `1.5px solid ${t.accent}` }} />
                <span className={`font-medium ${t.id === current ? 'text-[#2a9d8f]' : 'text-[#1a1a1a]'}`}>{t.nombre}</span>
              </div>
              <div className="flex items-center gap-1">
                {t.id === current && <Check className="h-3 w-3 text-[#2a9d8f]" />}
                {t.precio === 'premium' && (
                  <span className="flex items-center gap-0.5 text-[9px] bg-[#fef9c3] text-[#854d0e] px-1.5 py-0.5 rounded-full">
                    <Lock className="h-2 w-2" /> S/65
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
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
  const [plantilla, setPlantilla] = useState<TemplateId>('optica-esencial')
  const [premiumLock, setPremiumLock] = useState<TemplateInfo | null>(null)

  const [secciones, setSecciones] = useState(SECCIONES_INIT)
  const [banner, setBanner] = useState(BANNER_INIT)
  const [productosCfg, setProductosCfg] = useState(PRODUCTOS_INIT)
  const [textoCfg, setTextoCfg] = useState(TEXTO_INIT)
  const [videoCfg, setVideoCfg] = useState(VIDEO_INIT)
  const [colores, setColores] = useState(COLORES_INIT)
  const [tipografia, setTipografia] = useState(TIPOGRAFIA_INIT)

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
      valor: { plantilla, secciones, banner, productos: productosCfg, texto: textoCfg, video: videoCfg, colores, tipografia },
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const deviceWidths: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '375px' }

  const nombreTienda = 'OftalShop Demo'

  function renderTemplate() {
    switch (plantilla) {
      case 'optica-esencial': return <OpticaEsencial nombreTienda={nombreTienda} />
      case 'clinica-confianza': return <ClinicaConfianza nombreTienda={nombreTienda} />
      case 'lensshop': return <LensShop nombreTienda={nombreTienda} />
      case 'visionpro': return <VisionPro nombreTienda={nombreTienda} />
      case 'luxoptic': return <LuxOptic nombreTienda={nombreTienda} />
      case 'medcenter-pro': return <MedCenterPro nombreTienda={nombreTienda} />
      default: return <OpticaEsencial nombreTienda={nombreTienda} />
    }
  }

  return (
    <div className="fixed inset-0 flex bg-[#f1f1f1]" style={{ top: 0, left: 0, zIndex: 40 }}>
      {/* Left panel */}
      <aside className="w-[300px] shrink-0 flex flex-col bg-white border-r border-[#e1e1e1] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e1e1]">
          <div>
            <p className="text-xs text-[#8a8a8a]">Personalizando</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">{TEMPLATES.find(t => t.id === plantilla)?.nombre}</p>
          </div>
          <button onClick={guardar} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
          </button>
        </div>

        {/* Template selector */}
        <TemplateSelector
          current={plantilla}
          onSelect={setPlantilla}
          onPremiumLock={(t) => setPremiumLock(t)}
        />

        {/* Tabs */}
        <div className="flex border-b border-[#e1e1e1]">
          {(['secciones', 'configuracion'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]' : 'text-[#6a6a6a] hover:text-[#1a1a1a]'}`}>
              {t === 'secciones' ? 'Secciones' : 'Configuración'}
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
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button onClick={() => moverSeccion(sec.id, -1)} disabled={idx === 0} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30">
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <GripVertical className="h-3.5 w-3.5 text-[#c9c9c9]" />
                        <button onClick={() => moverSeccion(sec.id, 1)} disabled={idx === secciones.length - 1} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30">
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                      <Icono className="h-3.5 w-3.5 text-[#6a6a6a] shrink-0" />
                      <button onClick={() => setExpandedId(isExpanded ? null : sec.id)} className="flex-1 text-left text-xs font-medium text-[#1a1a1a]">
                        {sec.label}
                      </button>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" />}
                    </div>
                    {isExpanded && (
                      <div className="bg-[#fafafa] border-t border-[#f1f1f1]">
                        {sec.tipo === 'banner' && <BannerEditor config={banner} onChange={setBanner} />}
                        {sec.tipo === 'productos' && <ProductosEditor config={productosCfg} onChange={setProductosCfg} />}
                        {sec.tipo === 'texto' && <TextoEditor config={textoCfg} onChange={setTextoCfg} />}
                        {sec.tipo === 'video' && (
                          <div className="px-4 pb-4 pt-2">
                            <Label>URL del video</Label>
                            <input className={inputCls} value={videoCfg.url} onChange={(e) => setVideoCfg({ url: e.target.value })} placeholder="https://youtube.com/..." />
                          </div>
                        )}
                        {!['banner', 'productos', 'texto', 'video'].includes(sec.tipo) && (
                          <div className="px-4 py-3 text-xs text-[#8a8a8a]">Esta sección no tiene opciones de edición.</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <button className="flex w-full items-center gap-2 px-4 py-3 text-xs font-medium text-[#2a9d8f] hover:bg-[#f0fdf9] transition-colors">
                <Plus className="h-4 w-4" /> Agregar sección
              </button>
            </div>
          ) : (
            <ConfiguracionTab colores={colores} onColores={setColores} tipografia={tipografia} onTipografia={setTipografia} />
          )}
        </div>
      </aside>

      {/* Right: preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e1e1e1]">
          <div className="flex items-center gap-1 rounded-lg border border-[#e1e1e1] p-0.5">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [Device, React.ElementType][]).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${device === d ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a] hover:text-[#1a1a1a]'}`}>
                <Icon className="h-3.5 w-3.5" />
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <a href="/tienda" className="text-xs text-[#6a6a6a] hover:text-[#1a1a1a] underline">← Salir del editor</a>
        </div>

        <div className="flex-1 overflow-auto flex items-start justify-center p-6 bg-[#f1f1f1]">
          <div
            className="rounded-xl border border-[#e1e1e1] shadow-lg overflow-hidden transition-all duration-300 bg-white"
            style={{ width: deviceWidths[device], minHeight: '600px', maxWidth: '100%', height: 'calc(100vh - 120px)' }}
          >
            <div className="h-full overflow-y-auto">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      {premiumLock && (
        <ModalPremium
          nombre={premiumLock.nombre}
          onClose={() => setPremiumLock(null)}
          onComprar={() => {
            setPlantilla(premiumLock.id)
            setPremiumLock(null)
          }}
        />
      )}
    </div>
  )
}
