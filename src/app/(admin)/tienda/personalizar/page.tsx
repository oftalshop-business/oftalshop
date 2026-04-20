'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Save, Monitor, Tablet, Smartphone, GripVertical,
  Plus, Image, Type, Video, Users, Mail, Navigation,
  Layers, AlignLeft, AlignCenter, AlignRight, Lock,
  X, Check, ChevronDown, ChevronUp, ChevronLeft,
  Megaphone, Map, Grid2X2, Globe, Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import StorePreview from '@/components/store/StorePreview'

// ─── Types ────────────────────────────────────────────────────────────────────

type Device = 'desktop' | 'tablet' | 'mobile'

interface SectionData {
  id: string
  tipo: string
  label: string
  activa: boolean
  config: Record<string, unknown>
}

interface Colores { primario: string; secundario: string; acento: string; fondo: string; texto: string; encabezados: string }
interface Tipografia { titulo: string; cuerpo: string }
interface TestimonioItem { nombre: string; cargo: string; texto: string; rating: number }

// ─── Available sections catalog ───────────────────────────────────────────────

const SECCIONES_DISPONIBLES = [
  { tipo: 'anuncio',    label: 'Anuncio superior',          icono: Megaphone },
  { tipo: 'header',     label: 'Header / Navegación',        icono: Navigation },
  { tipo: 'banner',     label: 'Banner hero',                icono: Image },
  { tipo: 'coleccion',  label: 'Colecciones destacadas',     icono: Layers },
  { tipo: 'productos',  label: 'Productos destacados',       icono: Grid2X2 },
  { tipo: 'texto',      label: 'Texto con imagen',           icono: Type },
  { tipo: 'video',      label: 'Video',                      icono: Video },
  { tipo: 'testimonios',label: 'Testimonios',                icono: Users },
  { tipo: 'galeria',    label: 'Galería de imágenes',        icono: Image },
  { tipo: 'newsletter', label: 'Newsletter / Suscripción',   icono: Mail },
  { tipo: 'mapa',       label: 'Mapa / Ubicación',           icono: Map },
  { tipo: 'footer',     label: 'Footer',                     icono: Globe },
]

const SECCIONES_INIT: SectionData[] = [
  { id: 'anuncio-1',    tipo: 'anuncio',    label: 'Anuncio superior',      activa: true, config: { texto: '🎉 Envío gratis en pedidos mayores a S/ 200' } },
  { id: 'header-1',     tipo: 'header',     label: 'Header / Navegación',   activa: true, config: {} },
  { id: 'banner-1',     tipo: 'banner',     label: 'Banner hero',           activa: true, config: { titulo: 'Tu visión, nuestra pasión', subtitulo: 'Los mejores lentes al mejor precio.', ctaTexto: 'Ver catálogo', ctaUrl: '/productos', opacidad: 40, altura: 'L', alineacion: 'center', colorOverlay: 'rgba(0,0,0,0.4)' } },
  { id: 'coleccion-1',  tipo: 'coleccion',  label: 'Colecciones destacadas',activa: true, config: {} },
  { id: 'productos-1',  tipo: 'productos',  label: 'Productos destacados',  activa: true, config: { coleccion: 'Todos', cantidad: 4, mostrarPrecio: true, mostrarBoton: true } },
  { id: 'texto-1',      tipo: 'texto',      label: 'Texto con imagen',      activa: true, config: { texto: 'Somos una óptica comprometida con tu salud visual.', posicion: 'izquierda' } },
  { id: 'testimonios-1',tipo: 'testimonios',label: 'Testimonios',           activa: true, config: {} },
  { id: 'newsletter-1', tipo: 'newsletter', label: 'Newsletter',            activa: true, config: {} },
  { id: 'footer-1',     tipo: 'footer',     label: 'Footer',                activa: true, config: {} },
]

const COLORES_INIT: Colores = { primario: '#2a9d8f', secundario: '#1a1a1a', acento: '#e9c46a', fondo: '#ffffff', texto: '#1a1a1a', encabezados: '#0f172a' }
const TIPOGRAFIA_INIT: Tipografia = { titulo: 'Inter', cuerpo: 'Inter' }
const FUENTES = ['Inter', 'Playfair Display', 'Montserrat', 'Raleway', 'Lato', 'Oswald', 'Merriweather']

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#2a9d8f]'

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium text-[#6a6a6a] mb-1">{children}</label>
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#4a4a4a]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

// ─── Section editors ──────────────────────────────────────────────────────────

function AnuncioEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Texto del anuncio</Label>
        <input className={inputCls} value={(config.texto as string) ?? ''} onChange={(e) => onChange({ ...config, texto: e.target.value })} placeholder="🎉 Envío gratis en pedidos > S/ 200" />
      </div>
    </div>
  )
}

function BannerEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...config, [k]: k === 'opacidad' ? Number(e.target.value) : e.target.value })
  return (
    <div className="space-y-3 px-4 pb-4">
      <div><Label>Título</Label><input className={inputCls} value={(config.titulo as string) ?? ''} onChange={f('titulo')} /></div>
      <div><Label>Subtítulo</Label><input className={inputCls} value={(config.subtitulo as string) ?? ''} onChange={f('subtitulo')} /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Texto del botón</Label><input className={inputCls} value={(config.ctaTexto as string) ?? ''} onChange={f('ctaTexto')} /></div>
        <div><Label>URL del botón</Label><input className={inputCls} value={(config.ctaUrl as string) ?? ''} onChange={f('ctaUrl')} /></div>
      </div>
      <div>
        <Label>Altura</Label>
        <select className={inputCls} value={(config.altura as string) ?? 'L'} onChange={f('altura')}>
          <option value="S">Pequeño (S)</option>
          <option value="M">Mediano (M)</option>
          <option value="L">Grande (L)</option>
          <option value="XL">Extra grande (XL)</option>
        </select>
      </div>
      <div>
        <Label>Alineación del contenido</Label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((val) => {
            const Icon = val === 'left' ? AlignLeft : val === 'center' ? AlignCenter : AlignRight
            return (
              <button key={val} onClick={() => onChange({ ...config, alineacion: val })} className={`rounded-lg border p-2 transition-colors ${config.alineacion === val ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>
                <Icon className="h-3.5 w-3.5" />
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <Label>Opacidad overlay ({(config.opacidad as number) ?? 40}%)</Label>
        <input type="range" min={0} max={80} value={(config.opacidad as number) ?? 40} onChange={f('opacidad')} className="w-full accent-[#2a9d8f]" />
      </div>
      <div className="flex items-center justify-between">
        <Label>Color overlay</Label>
        <input type="color" value={(config.colorOverlay as string) ?? '#000000'} onChange={(e) => onChange({ ...config, colorOverlay: e.target.value })} className="h-7 w-7 rounded cursor-pointer border border-[#e1e1e1]" />
      </div>
    </div>
  )
}

function HeaderEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <Toggle value={(config.mostrarBusqueda as boolean) ?? true} onChange={(v) => onChange({ ...config, mostrarBusqueda: v })} label="Mostrar búsqueda" />
      <Toggle value={(config.mostrarCarrito as boolean) ?? true} onChange={(v) => onChange({ ...config, mostrarCarrito: v })} label="Mostrar carrito" />
      <div>
        <Label>Logo (URL)</Label>
        <input className={inputCls} value={(config.logoUrl as string) ?? ''} onChange={(e) => onChange({ ...config, logoUrl: e.target.value })} placeholder="https://... (PNG o SVG)" />
      </div>
    </div>
  )
}

function ProductosEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Colección</Label>
        <select className={inputCls} value={(config.coleccion as string) ?? 'Todos'} onChange={(e) => onChange({ ...config, coleccion: e.target.value })}>
          {['Todos', 'Monturas', 'Lentes de contacto', 'Lentes de sol', 'Accesorios'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label>Cantidad de productos ({(config.cantidad as number) ?? 4})</Label>
        <input type="range" min={2} max={12} step={2} value={(config.cantidad as number) ?? 4} onChange={(e) => onChange({ ...config, cantidad: Number(e.target.value) })} className="w-full accent-[#2a9d8f]" />
      </div>
      <Toggle value={(config.mostrarPrecio as boolean) ?? true} onChange={(v) => onChange({ ...config, mostrarPrecio: v })} label="Mostrar precio" />
      <Toggle value={(config.mostrarBoton as boolean) ?? true} onChange={(v) => onChange({ ...config, mostrarBoton: v })} label="Mostrar botón agregar" />
    </div>
  )
}

function TextoEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Texto</Label>
        <textarea className={inputCls + ' resize-none h-20'} value={(config.texto as string) ?? ''} onChange={(e) => onChange({ ...config, texto: e.target.value })} />
      </div>
      <div>
        <Label>Posición de imagen</Label>
        <div className="flex gap-1.5">
          {(['izquierda', 'derecha'] as const).map((v) => (
            <button key={v} onClick={() => onChange({ ...config, posicion: v })} className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${config.posicion === v ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Texto del botón</Label><input className={inputCls} value={(config.ctaTexto as string) ?? ''} onChange={(e) => onChange({ ...config, ctaTexto: e.target.value })} placeholder="Saber más" /></div>
        <div><Label>URL del botón</Label><input className={inputCls} value={(config.ctaUrl as string) ?? ''} onChange={(e) => onChange({ ...config, ctaUrl: e.target.value })} placeholder="/nosotros" /></div>
      </div>
    </div>
  )
}

function TestimoniosEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items: TestimonioItem[] = (config.items as TestimonioItem[]) ?? []

  function addItem() {
    onChange({ ...config, items: [...items, { nombre: '', cargo: '', texto: '', rating: 5 }] })
  }
  function updateItem(idx: number, field: keyof TestimonioItem, val: string | number) {
    const updated = items.map((it, i) => i === idx ? { ...it, [field]: val } : it)
    onChange({ ...config, items: updated })
  }
  function removeItem(idx: number) {
    onChange({ ...config, items: items.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-3 px-4 pb-4">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-[#e1e1e1] p-3 space-y-2 bg-[#fafafa]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold text-[#6a6a6a]">Testimonio {idx + 1}</span>
            <button onClick={() => removeItem(idx)} className="text-[#ef4444] hover:bg-[#fff5f5] p-0.5 rounded"><Trash2 className="h-3 w-3" /></button>
          </div>
          <input className={inputCls} placeholder="Nombre" value={item.nombre} onChange={(e) => updateItem(idx, 'nombre', e.target.value)} />
          <input className={inputCls} placeholder="Cargo / Empresa" value={item.cargo} onChange={(e) => updateItem(idx, 'cargo', e.target.value)} />
          <textarea className={inputCls + ' resize-none h-14'} placeholder="Comentario" value={item.texto} onChange={(e) => updateItem(idx, 'texto', e.target.value)} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8a8a8a]">Rating:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} onClick={() => updateItem(idx, 'rating', r)} className={`text-sm ${r <= item.rating ? 'text-[#fbbf24]' : 'text-[#d1d1d1]'}`}>★</button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-1.5 text-xs text-[#2a9d8f] hover:bg-[#f0fdf9] w-full px-2 py-1.5 rounded-lg transition-colors">
        <Plus className="h-3.5 w-3.5" /> Agregar testimonio
      </button>
    </div>
  )
}

function FooterEditor({ config, onChange }: { config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      <div>
        <Label>Descripción de la empresa</Label>
        <textarea className={inputCls + ' resize-none h-16'} value={(config.textoEmpresa as string) ?? ''} onChange={(e) => onChange({ ...config, textoEmpresa: e.target.value })} placeholder="Tu óptica de confianza..." />
      </div>
      <div><Label>Instagram URL</Label><input className={inputCls} value={(config.instagram as string) ?? ''} onChange={(e) => onChange({ ...config, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
      <div><Label>Facebook URL</Label><input className={inputCls} value={(config.facebook as string) ?? ''} onChange={(e) => onChange({ ...config, facebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
      <div><Label>WhatsApp (número)</Label><input className={inputCls} value={(config.whatsapp as string) ?? ''} onChange={(e) => onChange({ ...config, whatsapp: e.target.value })} placeholder="51999123456" /></div>
    </div>
  )
}

// ─── Config tab ───────────────────────────────────────────────────────────────

function ConfiguracionTab({
  colores, onColores, tipografia, onTipografia,
  espaciado, onEspaciado, bordes, onBordes,
}: {
  colores: Colores; onColores: (c: Colores) => void
  tipografia: Tipografia; onTipografia: (t: Tipografia) => void
  espaciado: string; onEspaciado: (v: string) => void
  bordes: string; onBordes: (v: string) => void
}) {
  return (
    <div className="space-y-5 px-4 py-4">
      {/* Colors */}
      <div>
        <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Colores</p>
        <div className="space-y-2.5">
          {([
            ['primario', 'Primario'],
            ['secundario', 'Secundario'],
            ['acento', 'Acento'],
            ['fondo', 'Fondo'],
            ['texto', 'Texto'],
            ['encabezados', 'Encabezados'],
          ] as [keyof Colores, string][]).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-xs text-[#4a4a4a]">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8a8a8a] font-mono">{colores[k]}</span>
                <input type="color" value={colores[k]} onChange={(e) => onColores({ ...colores, [k]: e.target.value })} className="h-7 w-7 rounded-md cursor-pointer border border-[#e1e1e1]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Tipografía</p>
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

      {/* Spacing */}
      <div>
        <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Espaciado</p>
        <div className="flex gap-1.5">
          {([['compacto', 'Compacto'], ['normal', 'Normal'], ['amplio', 'Amplio']] as [string, string][]).map(([v, label]) => (
            <button key={v} onClick={() => onEspaciado(v)} className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${espaciado === v ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Borders */}
      <div>
        <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Bordes</p>
        <div className="flex flex-col gap-1.5">
          {([['sin-bordes', 'Sin bordes'], ['redondeados', 'Redondeados'], ['muy-redondeados', 'Muy redondeados']] as [string, string][]).map(([v, label]) => (
            <button key={v} onClick={() => onBordes(v)} className={`py-1.5 text-xs rounded-lg border transition-colors ${bordes === v ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Identity */}
      <div>
        <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Identidad</p>
        <div className="space-y-2.5">
          <div>
            <Label>Logo</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-10 px-3 cursor-pointer hover:bg-[#f0f0f0]">
              <Image className="h-3.5 w-3.5 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir logo (PNG/SVG)</span>
            </div>
          </div>
          <div>
            <Label>Favicon</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#e1e1e1] bg-[#fafafa] h-10 px-3 cursor-pointer hover:bg-[#f0f0f0]">
              <Image className="h-3.5 w-3.5 text-[#8a8a8a]" />
              <span className="text-xs text-[#8a8a8a]">Subir favicon (32×32)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page selector ────────────────────────────────────────────────────────────

const PAGES = ['Inicio', 'Producto', 'Colección', 'Carrito'] as const
type PageKey = typeof PAGES[number]

// ─── Main component ───────────────────────────────────────────────────────────

export default function PersonalizarPage() {
  const [tab, setTab] = useState<'secciones' | 'configuracion'>('secciones')
  const [device, setDevice] = useState<Device>('desktop')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [selectedPage, setSelectedPage] = useState<PageKey>('Inicio')
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [nombreTema, setNombreTema] = useState('Mi Tienda')
  const [editingNombre, setEditingNombre] = useState(false)
  const nombreRef = useRef<HTMLInputElement>(null)

  const [secciones, setSecciones] = useState<SectionData[]>(SECCIONES_INIT)
  const [colores, setColores] = useState<Colores>(COLORES_INIT)
  const [tipografia, setTipografia] = useState<Tipografia>(TIPOGRAFIA_INIT)
  const [espaciado, setEspaciado] = useState('normal')
  const [bordes, setBordes] = useState('redondeados')

  useEffect(() => {
    if (editingNombre && nombreRef.current) nombreRef.current.focus()
  }, [editingNombre])

  // ── Load from Supabase ─────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('configuracion_tienda')
        .select('valor')
        .eq('clave', 'personalizar')
        .eq('tenant_id', user.id)
        .maybeSingle()

      if (data?.valor) {
        const v = data.valor as Record<string, unknown>
        if (v.secciones) setSecciones(v.secciones as SectionData[])
        if (v.colores) setColores(v.colores as Colores)
        if (v.tipografia) setTipografia(v.tipografia as Tipografia)
        if (v.espaciado) setEspaciado(v.espaciado as string)
        if (v.bordes) setBordes(v.bordes as string)
        if (v.nombreTema) setNombreTema(v.nombreTema as string)
      }
    }
    load()
  }, [])

  // ── Save ───────────────────────────────────────────────────────────────────

  async function guardar() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('configuracion_tienda').upsert({
        tenant_id: user.id,
        clave: 'personalizar',
        valor: { secciones, colores, tipografia, espaciado, bordes, nombreTema },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'tenant_id,clave' })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  async function publicar() {
    setPublishing(true)
    await guardar()
    setPublishing(false)
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  // ── Sections CRUD ──────────────────────────────────────────────────────────

  function moveSection(id: string, dir: -1 | 1) {
    setSecciones((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  function deleteSection(id: string) {
    setSecciones((prev) => prev.filter((s) => s.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function addSection(tipo: string, label: string) {
    const newSec: SectionData = {
      id: `${tipo}-${Date.now()}`,
      tipo,
      label,
      activa: true,
      config: {},
    }
    setSecciones((prev) => [...prev, newSec])
    setShowAddPanel(false)
    setExpandedId(newSec.id)
    setTab('secciones')
  }

  function updateSectionConfig(id: string, newConfig: Record<string, unknown>) {
    setSecciones((prev) => prev.map((s) => s.id === id ? { ...s, config: newConfig } : s))
  }

  // ── Device widths ──────────────────────────────────────────────────────────

  const deviceWidths: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '375px' }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f1f1f1]" style={{ zIndex: 40 }}>

      {/* Top bar */}
      <div className="flex items-center justify-between bg-white border-b border-[#e1e1e1] px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/tienda" className="flex items-center gap-1.5 text-xs text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="h-4 w-4" /> Salir
          </Link>
          <div className="w-px h-4 bg-[#e1e1e1]" />
          {editingNombre ? (
            <input
              ref={nombreRef}
              className="text-sm font-semibold text-[#1a1a1a] border-b border-[#2a9d8f] outline-none bg-transparent w-40"
              value={nombreTema}
              onChange={(e) => setNombreTema(e.target.value)}
              onBlur={() => setEditingNombre(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingNombre(false)}
            />
          ) : (
            <button onClick={() => setEditingNombre(true)} className="text-sm font-semibold text-[#1a1a1a] hover:text-[#2a9d8f] transition-colors">
              {nombreTema}
            </button>
          )}
        </div>

        {/* Device selector */}
        <div className="flex items-center gap-1 rounded-lg border border-[#e1e1e1] p-0.5">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [Device, React.ElementType][]).map(([d, Icon]) => (
            <button key={d} onClick={() => setDevice(d)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${device === d ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a] hover:text-[#1a1a1a]'}`}>
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline capitalize">{d}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={guardar}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] disabled:opacity-50 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
          </button>
          <button
            onClick={publicar}
            disabled={publishing}
            className="flex items-center gap-1.5 rounded-lg bg-[#16a34a] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#15803d] disabled:opacity-50 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {published ? '✓ Publicado' : publishing ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <aside className="w-[320px] shrink-0 flex flex-col bg-white border-r border-[#e1e1e1] overflow-hidden">

          {/* Page selector */}
          <div className="px-4 py-2.5 border-b border-[#e1e1e1]">
            <p className="text-[10px] text-[#8a8a8a] mb-1.5 uppercase tracking-wider">Página</p>
            <select
              className={inputCls}
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value as PageKey)}
            >
              {PAGES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e1e1e1] shrink-0">
            {(['secciones', 'configuracion'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]' : 'text-[#6a6a6a] hover:text-[#1a1a1a]'}`}>
                {t === 'secciones' ? 'Secciones' : 'Configuración'}
              </button>
            ))}
          </div>

          {/* Scroll content */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'secciones' ? (
              <div>
                {secciones.map((sec, idx) => {
                  const catalog = SECCIONES_DISPONIBLES.find(s => s.tipo === sec.tipo)
                  const Icono = catalog?.icono ?? Layers
                  const isExpanded = expandedId === sec.id

                  return (
                    <div key={sec.id} className="border-b border-[#f1f1f1]">
                      <div className="flex items-center gap-1.5 px-3 py-2 hover:bg-[#fafafa]">
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30">
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <GripVertical className="h-3.5 w-3.5 text-[#c9c9c9]" />
                          <button onClick={() => moveSection(sec.id, 1)} disabled={idx === secciones.length - 1} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-30">
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                        <Icono className="h-3.5 w-3.5 text-[#6a6a6a] shrink-0" />
                        <button onClick={() => setExpandedId(isExpanded ? null : sec.id)} className="flex-1 text-left text-xs font-medium text-[#1a1a1a] truncate">
                          {sec.label}
                        </button>
                        <button onClick={() => deleteSection(sec.id)} className="text-[#c9c9c9] hover:text-[#ef4444] shrink-0 p-0.5 rounded">
                          <X className="h-3 w-3" />
                        </button>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-[#8a8a8a] shrink-0" />}
                      </div>

                      {isExpanded && (
                        <div className="bg-[#fafafa] border-t border-[#f1f1f1]">
                          {sec.tipo === 'anuncio' && <AnuncioEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'banner' && <BannerEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'header' && <HeaderEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'productos' && <ProductosEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'texto' && <TextoEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'testimonios' && <TestimoniosEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'footer' && <FooterEditor config={sec.config} onChange={(c) => updateSectionConfig(sec.id, c)} />}
                          {sec.tipo === 'video' && (
                            <div className="px-4 pb-4 pt-2">
                              <Label>URL del video (YouTube / Vimeo)</Label>
                              <input className={inputCls} value={(sec.config.url as string) ?? ''} onChange={(e) => updateSectionConfig(sec.id, { ...sec.config, url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                            </div>
                          )}
                          {!['anuncio', 'banner', 'header', 'productos', 'texto', 'testimonios', 'footer', 'video'].includes(sec.tipo) && (
                            <div className="px-4 py-3 text-xs text-[#8a8a8a]">Esta sección no tiene opciones de edición.</div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Add section button */}
                <button
                  onClick={() => setShowAddPanel(true)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-xs font-medium text-[#2a9d8f] hover:bg-[#f0fdf9] transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar sección
                </button>
              </div>
            ) : (
              <ConfiguracionTab
                colores={colores} onColores={setColores}
                tipografia={tipografia} onTipografia={setTipografia}
                espaciado={espaciado} onEspaciado={setEspaciado}
                bordes={bordes} onBordes={setBordes}
              />
            )}
          </div>
        </aside>

        {/* Right: live preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto flex items-start justify-center p-5 bg-[#f1f1f1]">
            <div
              className="rounded-xl border border-[#e1e1e1] shadow-lg overflow-hidden transition-all duration-300 bg-white"
              style={{
                width: deviceWidths[device],
                minHeight: '600px',
                maxWidth: '100%',
                height: 'calc(100vh - 120px)',
              }}
            >
              <div className="h-full overflow-y-auto">
                <StorePreview
                  secciones={secciones}
                  colores={colores}
                  tipografia={tipografia}
                  espaciado={espaciado as 'compacto' | 'normal' | 'amplio'}
                  bordes={bordes as 'sin-bordes' | 'redondeados' | 'muy-redondeados'}
                  productos={[]}
                  tenant="demo"
                  nombreTienda={nombreTema}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add section panel */}
      {showAddPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddPanel(false)} />
          <div className="absolute left-[320px] top-[52px] bottom-0 w-72 bg-white border-r border-[#e1e1e1] shadow-xl overflow-y-auto z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e1e1]">
              <p className="text-sm font-semibold text-[#1a1a1a]">Agregar sección</p>
              <button onClick={() => setShowAddPanel(false)} className="text-[#6a6a6a] hover:text-[#1a1a1a]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {SECCIONES_DISPONIBLES.map(({ tipo, label, icono: Icono }) => {
                const alreadyAdded = secciones.some((s) => s.tipo === tipo)
                return (
                  <button
                    key={tipo}
                    onClick={() => addSection(tipo, label)}
                    disabled={alreadyAdded && ['header', 'footer', 'anuncio'].includes(tipo)}
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-[#f7f7f7] transition-colors disabled:opacity-40"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f1f1] shrink-0">
                      <Icono className="h-4 w-4 text-[#6a6a6a]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1a1a1a]">{label}</p>
                      {alreadyAdded && ['header', 'footer', 'anuncio'].includes(tipo) && (
                        <p className="text-[10px] text-[#8a8a8a]">Ya agregada</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
