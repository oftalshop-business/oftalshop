'use client'

import { useEffect, useState } from 'react'
import {
  Save, Monitor, Tablet, Smartphone, ChevronLeft,
  Pencil, Plus, ChevronDown, ChevronUp, GripVertical,
  Image, Navigation, Layers, Type, Globe, Video, Users, Mail,
  Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import StorePreview from '@/components/store/StorePreview'

// ─── Types ────────────────────────────────────────────────────────────────────

type Device = 'desktop' | 'tablet' | 'mobile'
type TabKey = 'secciones' | 'configuracion'
type PageKey = 'Inicio' | 'Producto' | 'Colección' | 'Carrito'

interface SectionConf {
  // banner
  titulo?: string; subtitulo?: string; imagenUrl?: string
  altura?: 'S' | 'M' | 'L' | 'XL'; alineacion?: string
  textoBoton?: string; opacidad?: number
  // productos
  cantidadProds?: number; mostrarPrecio?: boolean; mostrarBoton?: boolean
  tituloProd?: string
  // header
  mostrarBusqueda?: boolean; mostrarCarrito?: boolean; fondoTransparente?: boolean
  // footer
  textoEmpresa?: string; instagram?: string; facebook?: string; whatsapp?: string
  // testimonios
  items?: { nombre: string; cargo: string; texto: string; rating: number }[]
  // video
  url?: string
  // anuncio
  texto?: string
}

interface Seccion {
  id: string
  tipo: string
  activa: boolean
  config: SectionConf
}

interface Colores { primario: string; secundario: string; acento: string; fondo: string; texto: string }
interface Tipografia { titulo: string; cuerpo: string }

interface StoreConfig {
  plantilla: string
  colores: Colores
  tipografia: Tipografia
  logoUrl: string
  secciones: Seccion[]
}

// ─── Default config ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG: StoreConfig = {
  plantilla: 'esencial',
  colores: { primario: '#000', secundario: '#fff', acento: '#00a651', fondo: '#fff', texto: '#000' },
  tipografia: { titulo: 'Inter', cuerpo: 'Inter' },
  logoUrl: '',
  secciones: [
    { id: '1', tipo: 'header',   activa: true, config: { mostrarBusqueda: true, mostrarCarrito: true } },
    { id: '2', tipo: 'banner',   activa: true, config: { titulo: 'Bienvenido', subtitulo: '', imagenUrl: '', altura: 'M', alineacion: 'centro', textoBoton: 'Ver productos', opacidad: 20 } },
    { id: '3', tipo: 'productos',activa: true, config: { tituloProd: 'Productos destacados', cantidadProds: 8, mostrarPrecio: true, mostrarBoton: true } },
    { id: '4', tipo: 'footer',   activa: true, config: { textoEmpresa: 'Tu óptica de confianza' } },
  ],
}

// ─── Section catalog ──────────────────────────────────────────────────────────

const CATALOGO = [
  { tipo: 'anuncio',    label: 'Anuncio superior',      icono: Layers },
  { tipo: 'header',     label: 'Header / Navegación',   icono: Navigation },
  { tipo: 'banner',     label: 'Banner hero',           icono: Image },
  { tipo: 'coleccion',  label: 'Colecciones',           icono: Layers },
  { tipo: 'productos',  label: 'Productos destacados',  icono: Layers },
  { tipo: 'texto',      label: 'Texto con imagen',      icono: Type },
  { tipo: 'video',      label: 'Video',                 icono: Video },
  { tipo: 'testimonios',label: 'Testimonios',           icono: Users },
  { tipo: 'newsletter', label: 'Newsletter',            icono: Mail },
  { tipo: 'footer',     label: 'Footer',                icono: Globe },
]

const LABEL_MAP: Record<string, string> = {
  anuncio: 'Anuncio superior', header: 'Header / Navegación', banner: 'Banner hero',
  coleccion: 'Colecciones', productos: 'Productos destacados', texto: 'Texto con imagen',
  video: 'Video', testimonios: 'Testimonios', newsletter: 'Newsletter', footer: 'Footer',
}

const FUENTES_TITULO = ['Inter', 'Playfair Display', 'Montserrat', 'Raleway', 'Oswald']
const FUENTES_CUERPO = ['Inter', 'Lato', 'Open Sans', 'Merriweather']

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#2a9d8f]'

function Lbl({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-medium text-[#6a6a6a] mb-1">{children}</p>
}

function ToggleSwitch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-[#4a4a4a]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

// ─── Section editors ──────────────────────────────────────────────────────────

function SectionEditor({ seccion, onChange }: { seccion: Seccion; onChange: (c: SectionConf) => void }) {
  const c = seccion.config

  if (seccion.tipo === 'banner') return (
    <div className="space-y-2.5">
      <div><Lbl>Título</Lbl><input className={inputCls} value={c.titulo ?? ''} onChange={e => onChange({ ...c, titulo: e.target.value })} /></div>
      <div><Lbl>Subtítulo</Lbl><input className={inputCls} value={c.subtitulo ?? ''} onChange={e => onChange({ ...c, subtitulo: e.target.value })} /></div>
      <div><Lbl>Texto del botón</Lbl><input className={inputCls} value={c.textoBoton ?? ''} onChange={e => onChange({ ...c, textoBoton: e.target.value })} /></div>
      <div>
        <Lbl>Altura</Lbl>
        <select className={inputCls} value={c.altura ?? 'M'} onChange={e => onChange({ ...c, altura: e.target.value as 'S' | 'M' | 'L' | 'XL' })}>
          <option value="S">Pequeño (S)</option><option value="M">Mediano (M)</option>
          <option value="L">Grande (L)</option><option value="XL">Extra grande (XL)</option>
        </select>
      </div>
      <div>
        <Lbl>Alineación</Lbl>
        <select className={inputCls} value={c.alineacion ?? 'centro'} onChange={e => onChange({ ...c, alineacion: e.target.value })}>
          <option value="izquierda">Izquierda</option><option value="centro">Centro</option><option value="derecha">Derecha</option>
        </select>
      </div>
      <div>
        <Lbl>Opacidad overlay ({c.opacidad ?? 20}%)</Lbl>
        <input type="range" min={0} max={80} value={c.opacidad ?? 20} onChange={e => onChange({ ...c, opacidad: Number(e.target.value) })} className="w-full accent-[#2a9d8f]" />
      </div>
    </div>
  )

  if (seccion.tipo === 'productos') return (
    <div className="space-y-2.5">
      <div><Lbl>Título de la sección</Lbl><input className={inputCls} value={c.tituloProd ?? ''} onChange={e => onChange({ ...c, tituloProd: e.target.value })} /></div>
      <div>
        <Lbl>Cantidad de productos</Lbl>
        <select className={inputCls} value={c.cantidadProds ?? 8} onChange={e => onChange({ ...c, cantidadProds: Number(e.target.value) })}>
          <option value={4}>4 productos</option><option value={8}>8 productos</option><option value={12}>12 productos</option>
        </select>
      </div>
      <ToggleSwitch value={c.mostrarPrecio ?? true} onChange={v => onChange({ ...c, mostrarPrecio: v })} label="Mostrar precio" />
      <ToggleSwitch value={c.mostrarBoton ?? true} onChange={v => onChange({ ...c, mostrarBoton: v })} label="Mostrar botón agregar" />
    </div>
  )

  if (seccion.tipo === 'header') return (
    <div className="space-y-2.5">
      <ToggleSwitch value={c.mostrarBusqueda ?? true} onChange={v => onChange({ ...c, mostrarBusqueda: v })} label="Mostrar búsqueda" />
      <ToggleSwitch value={c.mostrarCarrito ?? true} onChange={v => onChange({ ...c, mostrarCarrito: v })} label="Mostrar carrito" />
      <ToggleSwitch value={c.fondoTransparente ?? false} onChange={v => onChange({ ...c, fondoTransparente: v })} label="Fondo transparente" />
    </div>
  )

  if (seccion.tipo === 'footer') return (
    <div className="space-y-2.5">
      <div><Lbl>Descripción de la empresa</Lbl><textarea className={inputCls + ' resize-none h-14'} value={c.textoEmpresa ?? ''} onChange={e => onChange({ ...c, textoEmpresa: e.target.value })} /></div>
      <div><Lbl>Instagram URL</Lbl><input className={inputCls} value={c.instagram ?? ''} onChange={e => onChange({ ...c, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
      <div><Lbl>Facebook URL</Lbl><input className={inputCls} value={c.facebook ?? ''} onChange={e => onChange({ ...c, facebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
      <div><Lbl>WhatsApp</Lbl><input className={inputCls} value={c.whatsapp ?? ''} onChange={e => onChange({ ...c, whatsapp: e.target.value })} placeholder="51999123456" /></div>
    </div>
  )

  if (seccion.tipo === 'anuncio') return (
    <div><Lbl>Texto del anuncio</Lbl><input className={inputCls} value={c.texto ?? ''} onChange={e => onChange({ ...c, texto: e.target.value })} placeholder="🎉 Envío gratis en pedidos > S/ 200" /></div>
  )

  if (seccion.tipo === 'video') return (
    <div><Lbl>URL del video (YouTube/Vimeo)</Lbl><input className={inputCls} value={c.url ?? ''} onChange={e => onChange({ ...c, url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
  )

  if (seccion.tipo === 'testimonios') {
    const items = c.items ?? []
    function addItem() { onChange({ ...c, items: [...items, { nombre: '', cargo: '', texto: '', rating: 5 }] }) }
    function updateItem(i: number, k: string, v: string | number) {
      onChange({ ...c, items: items.map((x, j) => j === i ? { ...x, [k]: v } : x) })
    }
    function removeItem(i: number) { onChange({ ...c, items: items.filter((_, j) => j !== i) }) }
    return (
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-[#e1e1e1] p-2.5 space-y-1.5 bg-[#fafafa]">
            <div className="flex justify-between"><span className="text-[10px] text-[#8a8a8a]">#{i+1}</span><button onClick={() => removeItem(i)}><Trash2 className="h-3 w-3 text-[#ef4444]" /></button></div>
            <input className={inputCls} placeholder="Nombre" value={item.nombre} onChange={e => updateItem(i, 'nombre', e.target.value)} />
            <input className={inputCls} placeholder="Cargo" value={item.cargo} onChange={e => updateItem(i, 'cargo', e.target.value)} />
            <textarea className={inputCls + ' resize-none h-12'} placeholder="Comentario" value={item.texto} onChange={e => updateItem(i, 'texto', e.target.value)} />
            <div className="flex gap-1">{[1,2,3,4,5].map(r => <button key={r} onClick={() => updateItem(i, 'rating', r)} className={r <= item.rating ? 'text-[#fbbf24]' : 'text-[#d1d1d1]'}>★</button>)}</div>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1.5 text-xs text-[#2a9d8f] hover:bg-[#f0fdf9] w-full px-2 py-1.5 rounded"><Plus className="h-3 w-3" /> Agregar</button>
      </div>
    )
  }

  return <p className="text-xs text-[#8a8a8a]">Sin opciones de edición.</p>
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PersonalizarPage() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG)
  const [tab, setTab] = useState<TabKey>('secciones')
  const [device, setDevice] = useState<Device>('desktop')
  const [page, setPage] = useState<PageKey>('Inicio')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('configuracion_tienda')
        .select('valor')
        .eq('tenant_id', user.id)
        .eq('clave', 'personalizar')
        .maybeSingle()
      if (data?.valor) {
        const v = data.valor as Partial<StoreConfig>
        setConfig({
          plantilla:   v.plantilla   ?? DEFAULT_CONFIG.plantilla,
          colores:     v.colores     ?? DEFAULT_CONFIG.colores,
          tipografia:  v.tipografia  ?? DEFAULT_CONFIG.tipografia,
          logoUrl:     v.logoUrl     ?? '',
          secciones:   v.secciones   ?? DEFAULT_CONFIG.secciones,
        })
      }
    }
    load()
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────────
  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('configuracion_tienda').upsert({
        tenant_id: user.id,
        clave: 'personalizar',
        valor: config,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'tenant_id,clave' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Section ops ───────────────────────────────────────────────────────────
  function moveSection(id: string, dir: -1 | 1) {
    setConfig(prev => {
      const arr = [...prev.secciones]
      const i = arr.findIndex(s => s.id === id)
      const j = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, secciones: arr }
    })
  }

  function toggleSection(id: string) {
    setConfig(prev => ({ ...prev, secciones: prev.secciones.map(s => s.id === id ? { ...s, activa: !s.activa } : s) }))
  }

  function deleteSection(id: string) {
    setConfig(prev => ({ ...prev, secciones: prev.secciones.filter(s => s.id !== id) }))
    if (expandedId === id) setExpandedId(null)
  }

  function updateSectionConfig(id: string, c: SectionConf) {
    setConfig(prev => ({ ...prev, secciones: prev.secciones.map(s => s.id === id ? { ...s, config: c } : s) }))
  }

  function addSection(tipo: string) {
    const id = `${tipo}-${Date.now()}`
    const label = LABEL_MAP[tipo] ?? tipo
    const newSec: Seccion = { id, tipo, activa: true, config: {} }
    setConfig(prev => ({ ...prev, secciones: [...prev.secciones, newSec] }))
    setExpandedId(id)
    setShowAdd(false)
    void label
  }

  // ── Update helpers ────────────────────────────────────────────────────────
  const setColor = (k: keyof Colores) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfig(prev => ({ ...prev, colores: { ...prev.colores, [k]: e.target.value } }))

  const setFont = (k: keyof Tipografia) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setConfig(prev => ({ ...prev, tipografia: { ...prev.tipografia, [k]: e.target.value } }))

  const deviceWidths: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '375px' }

  // ── Adapt config for StorePreview ─────────────────────────────────────────
  const previewSecciones = config.secciones.map(s => ({
    id: s.id,
    tipo: s.tipo,
    label: LABEL_MAP[s.tipo] ?? s.tipo,
    activa: s.activa,
    config: s.config as Record<string, unknown>,
  }))

  const previewColores = {
    primario:    config.colores.primario,
    secundario:  config.colores.secundario,
    acento:      config.colores.acento,
    fondo:       config.colores.fondo,
    texto:       config.colores.texto,
    encabezados: config.colores.texto,
  }

  const previewTipografia = {
    titulo: config.tipografia.titulo,
    cuerpo: config.tipografia.cuerpo,
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f1f1f1]" style={{ zIndex: 40 }}>
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-[#e1e1e1] px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <a href="/tienda" className="flex items-center gap-1.5 text-xs text-[#6a6a6a] hover:text-[#1a1a1a]">
            <ChevronLeft className="h-4 w-4" /> Volver
          </a>
          <span className="text-sm font-semibold text-[#1a1a1a] capitalize">{config.plantilla}</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[#e1e1e1] p-0.5">
          {([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Mobile']] as [Device, React.ElementType, string][]).map(([d, Icon, label]) => (
            <button key={d} onClick={() => setDevice(d)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${device === d ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a]'}`}>
              <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={guardar}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-[#16a34a] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#15803d] disabled:opacity-60 transition-colors"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <aside className="w-80 shrink-0 flex flex-col bg-white border-r border-[#e1e1e1] overflow-hidden">
          {/* Page tabs */}
          <div className="flex gap-0.5 px-3 pt-3 pb-2 border-b border-[#f1f1f1] overflow-x-auto">
            {(['Inicio', 'Producto', 'Colección', 'Carrito'] as PageKey[]).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${page === p ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a] hover:bg-[#f7f7f7]'}`}>{p}</button>
            ))}
          </div>

          {/* Section/Config tabs */}
          <div className="flex border-b border-[#e1e1e1] shrink-0">
            {(['secciones', 'configuracion'] as TabKey[]).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-medium transition-colors ${tab === t ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]' : 'text-[#6a6a6a]'}`}>
                {t === 'secciones' ? 'Secciones' : 'Configuración'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === 'secciones' ? (
              <div>
                {config.secciones.map((sec, idx) => {
                  const isExpanded = expandedId === sec.id
                  const iconEntry = CATALOGO.find(c => c.tipo === sec.tipo)
                  const Icon = iconEntry?.icono ?? Layers
                  const label = LABEL_MAP[sec.tipo] ?? sec.tipo

                  return (
                    <div key={sec.id} className="border-b border-[#f1f1f1]">
                      <div className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-[#fafafa]">
                        {/* Drag handles */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-20"><ChevronUp className="h-3 w-3" /></button>
                          <GripVertical className="h-3.5 w-3.5 text-[#c9c9c9]" />
                          <button onClick={() => moveSection(sec.id, 1)} disabled={idx === config.secciones.length - 1} className="text-[#c9c9c9] hover:text-[#8a8a8a] disabled:opacity-20"><ChevronDown className="h-3 w-3" /></button>
                        </div>
                        <Icon className="h-3.5 w-3.5 text-[#6a6a6a] shrink-0" />
                        <span className="flex-1 text-xs font-medium text-[#1a1a1a] truncate">{label}</span>
                        {/* Toggle */}
                        <button
                          onClick={() => toggleSection(sec.id)}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors shrink-0 ${sec.activa ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'}`}
                        >
                          <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${sec.activa ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                        {/* Edit */}
                        <button onClick={() => setExpandedId(isExpanded ? null : sec.id)} className="p-1 rounded text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#f1f1f1]">
                          <Pencil className="h-3 w-3" />
                        </button>
                        {/* Delete */}
                        <button onClick={() => deleteSection(sec.id)} className="p-1 rounded text-[#c9c9c9] hover:text-[#ef4444] hover:bg-[#fff5f5]">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 bg-[#fafafa] border-t border-[#f1f1f1]">
                          <SectionEditor seccion={sec} onChange={c => updateSectionConfig(sec.id, c)} />
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Add section */}
                {showAdd ? (
                  <div className="border-t border-[#f1f1f1] bg-[#fafafa]">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#f1f1f1]">
                      <p className="text-xs font-semibold text-[#1a1a1a]">Agregar sección</p>
                      <button onClick={() => setShowAdd(false)} className="text-[#8a8a8a] hover:text-[#1a1a1a]"><ChevronUp className="h-4 w-4" /></button>
                    </div>
                    {CATALOGO.map(({ tipo, label, icono: Icon }) => (
                      <button key={tipo} onClick={() => addSection(tipo)} className="flex items-center gap-2.5 w-full px-4 py-2 text-xs hover:bg-[#f0fdf9] transition-colors">
                        <Icon className="h-3.5 w-3.5 text-[#6a6a6a] shrink-0" />
                        <span className="text-[#1a1a1a]">{label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 w-full px-4 py-3 text-xs font-medium text-[#2a9d8f] hover:bg-[#f0fdf9] transition-colors">
                    <Plus className="h-4 w-4" /> Agregar sección
                  </button>
                )}
              </div>
            ) : (
              /* Config tab */
              <div className="space-y-5 px-4 py-4">
                <div>
                  <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Colores</p>
                  <div className="space-y-2">
                    {([['primario', 'Primario'], ['secundario', 'Secundario'], ['acento', 'Acento'], ['fondo', 'Fondo'], ['texto', 'Texto']] as [keyof Colores, string][]).map(([k, label]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-xs text-[#4a4a4a]">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#8a8a8a] font-mono">{config.colores[k]}</span>
                          <input type="color" value={config.colores[k]} onChange={setColor(k)} className="h-7 w-7 rounded cursor-pointer border border-[#e1e1e1]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Tipografía</p>
                  <div className="space-y-2">
                    <div>
                      <Lbl>Fuente para títulos</Lbl>
                      <select className={inputCls} value={config.tipografia.titulo} onChange={setFont('titulo')}>
                        {FUENTES_TITULO.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <Lbl>Fuente para cuerpo</Lbl>
                      <select className={inputCls} value={config.tipografia.cuerpo} onChange={setFont('cuerpo')}>
                        {FUENTES_CUERPO.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wider">Logo</p>
                  <input
                    className={inputCls}
                    value={config.logoUrl}
                    onChange={e => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="URL del logo (PNG/SVG)"
                  />
                  <p className="text-[10px] text-[#8a8a8a] mt-1">Pega la URL de tu logo alojado en internet</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right: live preview */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-5 bg-[#f1f1f1]">
          <div
            className="rounded-xl border border-[#e1e1e1] shadow-lg overflow-hidden transition-all duration-300 bg-white"
            style={{ width: deviceWidths[device], minHeight: '600px', maxWidth: '100%', height: 'calc(100vh - 108px)' }}
          >
            <div className="h-full overflow-y-auto">
              <StorePreview
                secciones={previewSecciones}
                colores={previewColores}
                tipografia={previewTipografia}
                productos={[]}
                tenant="demo"
                nombreTienda="Mi Óptica"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
