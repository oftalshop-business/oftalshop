'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Quote,
  Heading2, Underline as UnderlineIcon, Link2, ImagePlus,
  Plus, Trash2, X, Upload, ChevronDown, GripVertical,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Estado = 'Activo' | 'Borrador' | 'Archivado'

interface MediaItem {
  url: string
  tipo: 'imagen' | 'video'
  path?: string
}

interface Variante {
  id: string
  nombre: string
  valores: string
}

interface Material {
  id: string
  nombre: string
}

interface Tratamiento {
  id: string
  nombre: string
}

interface MedidaRow {
  id: string
  tipo: string
  valor: string
}

export interface ProductInitialData {
  id?: string
  titulo?: string
  descripcion?: string
  precio?: number | null
  precio_comparado?: number | null
  costo?: number | null
  sku?: string
  codigo_barras?: string
  track_quantity?: boolean
  stock?: number | null
  requiere_envio?: boolean
  peso?: number | null
  estado?: Estado
  tienda_online?: boolean
  tipo_producto?: string
  proveedor?: string
  colecciones?: string
  tags?: string
  plantilla?: string
  medias?: { url: string; tipo: string }[]
  variantes?: { nombre: string; valores: string }[]
  materiales_luna?: { nombre: string }[]
  tratamientos?: { nombre: string }[]
  medidas_producto?: { tipo_medida?: string; valor?: string; tipo?: string }[]
}

interface Props {
  initialData?: ProductInitialData | null
  productId?: string
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${
        active ? 'bg-[#1a1a1a] text-white' : 'text-[#6a6a6a] hover:bg-[#f1f1f1]'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
      {title && (
        <div className="border-b border-[#e1e1e1] px-5 py-4">
          <h3 className="text-sm font-semibold text-[#1a1a1a]">{title}</h3>
        </div>
      )}
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#1a1a1a]">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#9a9a9a]">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#6a6a6a] transition-colors'
const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(productId)

  // ── Form state ─────────────────────────────────────────────────────────────

  const [titulo, setTitulo]             = useState(initialData?.titulo ?? '')
  const [precio, setPrecio]             = useState(String(initialData?.precio ?? ''))
  const [precioComp, setPrecioComp]     = useState(String(initialData?.precio_comparado ?? ''))
  const [costo, setCosto]               = useState(String(initialData?.costo ?? ''))
  const [sku, setSku]                   = useState(initialData?.sku ?? '')
  const [barcode, setBarcode]           = useState(initialData?.codigo_barras ?? '')
  const [trackQty, setTrackQty]         = useState(initialData?.track_quantity ?? false)
  const [stock, setStock]               = useState(String(initialData?.stock ?? ''))
  const [envio, setEnvio]               = useState(initialData?.requiere_envio ?? false)
  const [peso, setPeso]                 = useState(String(initialData?.peso ?? ''))
  const [estado, setEstado]             = useState<Estado>(initialData?.estado ?? 'Borrador')
  const [tiendaOnline, setTiendaOnline] = useState(initialData?.tienda_online ?? true)
  const [tipo, setTipo]                 = useState(initialData?.tipo_producto ?? '')
  const [proveedor, setProveedor]       = useState(initialData?.proveedor ?? '')
  const [colecciones, setColecciones]   = useState(initialData?.colecciones ?? '')
  const [tags, setTags]                 = useState(initialData?.tags ?? '')
  const [plantilla, setPlantilla]       = useState(initialData?.plantilla ?? 'default')

  const [medias, setMedias]             = useState<MediaItem[]>(
    (initialData?.medias ?? []).map((m) => ({ url: m.url, tipo: m.tipo as 'imagen' | 'video' }))
  )
  const [variantes, setVariantes]       = useState<Variante[]>(
    (initialData?.variantes ?? []).map((v) => ({ id: uid(), nombre: v.nombre, valores: v.valores }))
  )
  const [materiales, setMateriales]     = useState<Material[]>(
    (initialData?.materiales_luna ?? []).map((m) => ({ id: uid(), nombre: m.nombre }))
  )
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>(
    (initialData?.tratamientos ?? []).map((t) => ({ id: uid(), nombre: t.nombre }))
  )
  const [medidasTipo, setMedidasTipo]   = useState<'manual' | 'foto'>('manual')
  const [medidas, setMedidas]           = useState<MedidaRow[]>(
    (initialData?.medidas_producto ?? []).map((m) => ({
      id: uid(), tipo: String(m.tipo_medida ?? m.tipo ?? ''), valor: String(m.valor ?? ''),
    }))
  )
  const [medidasFoto, setMedidasFoto]   = useState<string | null>(null)

  const [uploading, setUploading]       = useState(false)
  const [saving, setSaving]             = useState(false)
  const [isDragging, setIsDragging]     = useState(false)

  // ── Margin ────────────────────────────────────────────────────────────────

  const margen = (() => {
    const p = parseFloat(precio)
    const c = parseFloat(costo)
    if (!p || !c || p === 0) return '—'
    return `${(((p - c) / p) * 100).toFixed(1)}%`
  })()

  // ── TipTap editor ─────────────────────────────────────────────────────────

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: initialData?.descripcion ?? '',
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none min-h-[160px] px-4 py-3 text-sm text-[#1a1a1a] outline-none',
        },
      },
    },
    []
  )

  // ── Media upload ──────────────────────────────────────────────────────────

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true)
      const arr = Array.from(files)
      for (const file of arr) {
        const ext = file.name.split('.').pop()
        const path = `productos/${Date.now()}-${uid()}.${ext}`
        const { data, error } = await supabase.storage.from('medias').upload(path, file, { upsert: true })
        if (!error && data) {
          const { data: pub } = supabase.storage.from('medias').getPublicUrl(data.path)
          const tipo: 'imagen' | 'video' = file.type.startsWith('video') ? 'video' : 'imagen'
          setMedias((prev) => [...prev, { url: pub.publicUrl, tipo, path: data.path }])
        }
      }
      setUploading(false)
    },
    [supabase]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
    },
    [uploadFiles]
  )

  // ── Medidas foto ──────────────────────────────────────────────────────────

  async function uploadMedidasFoto(file: File) {
    const path = `medidas/${Date.now()}-${uid()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('medias').upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: pub } = supabase.storage.from('medias').getPublicUrl(data.path)
      setMedidasFoto(pub.publicUrl)
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!titulo.trim()) return
    setSaving(true)
    try {
      const payload = {
        titulo,
        descripcion:       editor?.getHTML() ?? '',
        precio:            parseFloat(precio) || 0,
        precio_comparado:  parseFloat(precioComp) || null,
        costo:             parseFloat(costo) || null,
        sku:               sku || null,
        codigo_barras:     barcode || null,
        track_quantity:    trackQty,
        stock:             trackQty ? (parseInt(stock) || 0) : null,
        requiere_envio:    envio,
        peso:              envio ? (parseFloat(peso) || null) : null,
        estado,
        tienda_online:     tiendaOnline,
        tipo_producto:     tipo || null,
        proveedor:         proveedor || null,
        colecciones:       colecciones || null,
        tags:              tags || null,
        plantilla,
      }

      let pid = productId
      if (isEdit && pid) {
        await supabase.from('productos').update(payload).eq('id', pid)
        // Remove old related records
        await Promise.all([
          supabase.from('medias').delete().eq('producto_id', pid),
          supabase.from('variantes').delete().eq('producto_id', pid),
          supabase.from('materiales_luna').delete().eq('producto_id', pid),
          supabase.from('tratamientos').delete().eq('producto_id', pid),
          supabase.from('medidas_producto').delete().eq('producto_id', pid),
        ])
      } else {
        const { data } = await supabase.from('productos').insert(payload).select('id').single()
        pid = data?.id
      }

      if (!pid) throw new Error('No product id')

      // Related inserts (sequential — Supabase builder is thenable but not a Promise)
      if (medias.length)
        await supabase.from('medias').insert(
          medias.map((m, i) => ({ producto_id: pid, url: m.url, tipo: m.tipo, orden: i }))
        )
      if (variantes.length)
        await supabase.from('variantes').insert(
          variantes.map((v) => ({ producto_id: pid, nombre: v.nombre, valores: v.valores }))
        )
      if (materiales.length)
        await supabase.from('materiales_luna').insert(
          materiales.map((m) => ({ producto_id: pid, nombre: m.nombre }))
        )
      if (tratamientos.length)
        await supabase.from('tratamientos').insert(
          tratamientos.map((t) => ({ producto_id: pid, nombre: t.nombre }))
        )
      if (medidas.length || medidasFoto)
        await supabase.from('medidas_producto').insert(
          medidasTipo === 'foto'
            ? [{ producto_id: pid, tipo: 'foto', url: medidasFoto }]
            : medidas.map((m) => ({ producto_id: pid, tipo: 'manual', tipo_medida: m.tipo, valor: m.valor }))
        )
      router.push('/productos')
    } catch {
      // keep form open on error
    } finally {
      setSaving(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-0 -m-6">

      {/* Internal topbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e1e1e1] bg-[#f1f1f1] px-6 py-3">
        <p className="text-sm font-medium text-[#6a6a6a]">
          {titulo.trim() ? titulo : 'Producto no guardado'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push('/productos')}
            className="rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !titulo.trim()}
            className="rounded-lg bg-[#1a1a1a] px-4 py-1.5 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-5 p-6 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Título + Descripción */}
          <Card>
            <Field label="Título">
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Nombre del producto"
                className={inputCls}
              />
            </Field>
            <Field label="Descripción">
              <div className="rounded-lg border border-[#e1e1e1] overflow-hidden">
                {/* Toolbar */}
                {editor && (
                  <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e1e1e1] bg-[#f7f7f7] px-2 py-1.5">
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
                      <Bold className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
                      <Italic className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline?.().run()} active={editor.isActive('underline')} title="Subrayado">
                      <UnderlineIcon className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
                      <Strikethrough className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <div className="mx-1 h-4 w-px bg-[#e1e1e1]" />
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Encabezado">
                      <Heading2 className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
                      <List className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
                      <Quote className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn
                      onClick={() => {
                        const url = window.prompt('URL del enlace:')
                        if (url) editor.chain().focus().setLink({ href: url }).run()
                      }}
                      active={editor.isActive('link')}
                      title="Enlace"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                  </div>
                )}
                <EditorContent editor={editor} />
              </div>
            </Field>
          </Card>

          {/* Multimedia */}
          <Card title="Multimedia">
            <div
              ref={dropRef}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer py-8 transition-colors ${
                isDragging ? 'border-[#2a9d8f] bg-[#f0faf9]' : 'border-[#e1e1e1] hover:border-[#9a9a9a]'
              }`}
            >
              <ImagePlus className="h-8 w-8 text-[#9a9a9a]" />
              <p className="text-sm text-[#6a6a6a]">
                {uploading ? 'Subiendo…' : 'Arrastra archivos o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-[#9a9a9a]">Imágenes y videos</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              />
            </div>
            {medias.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {medias.map((m, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#e1e1e1] bg-[#f7f7f7]">
                    {m.tipo === 'imagen'
                      ? <img src={m.url} alt="" className="h-full w-full object-cover" />
                      : <video src={m.url} className="h-full w-full object-cover" />
                    }
                    <button
                      onClick={(e) => { e.stopPropagation(); setMedias((prev) => prev.filter((_, j) => j !== i)) }}
                      className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Precio */}
          <Card title="Precio">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio ($)">
                <input type="number" min={0} step={0.01} value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" className={inputCls} />
              </Field>
              <Field label="Precio comparado ($)">
                <input type="number" min={0} step={0.01} value={precioComp} onChange={(e) => setPrecioComp(e.target.value)} placeholder="0.00" className={inputCls} />
              </Field>
              <Field label="Costo por artículo ($)">
                <input type="number" min={0} step={0.01} value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="0.00" className={inputCls} />
              </Field>
              <Field label="Margen" hint="Calculado automáticamente">
                <div className="flex h-[38px] items-center rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 text-sm text-[#6a6a6a]">
                  {margen}
                </div>
              </Field>
            </div>
          </Card>

          {/* Inventario */}
          <Card title="Inventario">
            <div className="grid grid-cols-2 gap-4">
              <Field label="SKU (código interno)">
                <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="ARMAZON-001" className={inputCls} />
              </Field>
              <Field label="Código de barras">
                <input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="ISBN / UPC / EAN" className={inputCls} />
              </Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trackQty}
                onChange={(e) => setTrackQty(e.target.checked)}
                className="rounded border-[#c9c9c9] accent-[#1a1a1a]"
              />
              <span className="text-sm text-[#1a1a1a]">Rastrear cantidad</span>
            </label>
            {trackQty && (
              <Field label="Cantidad disponible">
                <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className={inputCls} />
              </Field>
            )}
          </Card>

          {/* Envío */}
          <Card title="Envío">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={envio}
                onChange={(e) => setEnvio(e.target.checked)}
                className="rounded border-[#c9c9c9] accent-[#1a1a1a]"
              />
              <span className="text-sm text-[#1a1a1a]">Este producto requiere envío</span>
            </label>
            {envio && (
              <Field label="Peso (kg)">
                <input type="number" min={0} step={0.01} value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="0.00" className={inputCls} />
              </Field>
            )}
          </Card>

          {/* Variantes */}
          <Card title="Variantes">
            {variantes.length === 0 && (
              <p className="text-sm text-[#9a9a9a]">Agrega opciones como talla o color.</p>
            )}
            <div className="space-y-3">
              {variantes.map((v) => (
                <div key={v.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-[#c9c9c9] shrink-0" />
                  <input
                    value={v.nombre}
                    onChange={(e) => setVariantes((prev) => prev.map((x) => x.id === v.id ? { ...x, nombre: e.target.value } : x))}
                    placeholder="Opción (ej. Talla)"
                    className={inputCls + ' w-32'}
                  />
                  <input
                    value={v.valores}
                    onChange={(e) => setVariantes((prev) => prev.map((x) => x.id === v.id ? { ...x, valores: e.target.value } : x))}
                    placeholder="Valores separados por coma (ej. S, M, L)"
                    className={inputCls + ' flex-1'}
                  />
                  <button onClick={() => setVariantes((prev) => prev.filter((x) => x.id !== v.id))} className="text-[#9a9a9a] hover:text-[#b91c1c]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setVariantes((prev) => [...prev, { id: uid(), nombre: '', valores: '' }])}
              className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:underline"
            >
              <Plus className="h-4 w-4" /> Agregar opción
            </button>
          </Card>

          {/* Sección óptica */}
          <Card title="Sección óptica">

            {/* Materiales de luna */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-wide">Materiales de luna</p>
              {materiales.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <input
                    value={m.nombre}
                    onChange={(e) => setMateriales((prev) => prev.map((x) => x.id === m.id ? { ...x, nombre: e.target.value } : x))}
                    placeholder="Ej. Policarbonato"
                    className={inputCls}
                  />
                  <button onClick={() => setMateriales((prev) => prev.filter((x) => x.id !== m.id))} className="text-[#9a9a9a] hover:text-[#b91c1c]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMateriales((prev) => [...prev, { id: uid(), nombre: '' }])}
                className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:underline"
              >
                <Plus className="h-4 w-4" /> Agregar material
              </button>
            </div>

            <div className="border-t border-[#f1f1f1] pt-4 space-y-2">
              <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-wide">Tratamientos</p>
              {tratamientos.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <input
                    value={t.nombre}
                    onChange={(e) => setTratamientos((prev) => prev.map((x) => x.id === t.id ? { ...x, nombre: e.target.value } : x))}
                    placeholder="Ej. Antirreflejo"
                    className={inputCls}
                  />
                  <button onClick={() => setTratamientos((prev) => prev.filter((x) => x.id !== t.id))} className="text-[#9a9a9a] hover:text-[#b91c1c]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTratamientos((prev) => [...prev, { id: uid(), nombre: '' }])}
                className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:underline"
              >
                <Plus className="h-4 w-4" /> Agregar tratamiento
              </button>
            </div>

            {/* Medidas */}
            <div className="border-t border-[#f1f1f1] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-wide">Medidas</p>
                <div className="flex rounded-lg border border-[#e1e1e1] overflow-hidden text-xs">
                  {(['manual', 'foto'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMedidasTipo(t)}
                      className={`px-3 py-1 capitalize transition-colors ${
                        medidasTipo === t ? 'bg-[#1a1a1a] text-white' : 'bg-white text-[#6a6a6a] hover:bg-[#f7f7f7]'
                      }`}
                    >
                      {t === 'manual' ? 'Manual' : 'Foto'}
                    </button>
                  ))}
                </div>
              </div>

              {medidasTipo === 'manual' ? (
                <div className="space-y-2">
                  {medidas.map((m) => (
                    <div key={m.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <input
                        value={m.tipo}
                        onChange={(e) => setMedidas((prev) => prev.map((x) => x.id === m.id ? { ...x, tipo: e.target.value } : x))}
                        placeholder="Tipo (ej. Diámetro)"
                        className={inputCls}
                      />
                      <input
                        value={m.valor}
                        onChange={(e) => setMedidas((prev) => prev.map((x) => x.id === m.id ? { ...x, valor: e.target.value } : x))}
                        placeholder="Valor (ej. 52mm)"
                        className={inputCls}
                      />
                      <button onClick={() => setMedidas((prev) => prev.filter((x) => x.id !== m.id))} className="text-[#9a9a9a] hover:text-[#b91c1c]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMedidas((prev) => [...prev, { id: uid(), tipo: '', valor: '' }])}
                    className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Agregar medida
                  </button>
                </div>
              ) : (
                <div>
                  {medidasFoto ? (
                    <div className="relative inline-block">
                      <img src={medidasFoto} alt="Medidas" className="max-h-48 rounded-lg border border-[#e1e1e1]" />
                      <button onClick={() => setMedidasFoto(null)} className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#e1e1e1] py-6 hover:border-[#9a9a9a] transition-colors">
                      <Upload className="h-5 w-5 text-[#9a9a9a]" />
                      <span className="text-sm text-[#6a6a6a]">Subir imagen de medidas</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedidasFoto(e.target.files[0])} />
                    </label>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-[260px] shrink-0 space-y-4">

          {/* Estado */}
          <Card title="Estado">
            <div className="relative">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as Estado)}
                className={inputCls + ' appearance-none pr-8'}
              >
                <option>Activo</option>
                <option>Borrador</option>
                <option>Archivado</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
            </div>
          </Card>

          {/* Canales de venta */}
          <Card title="Canales de venta">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tiendaOnline}
                onChange={(e) => setTiendaOnline(e.target.checked)}
                className="rounded border-[#c9c9c9] accent-[#1a1a1a]"
              />
              <span className="text-sm text-[#1a1a1a]">Tienda online</span>
            </label>
          </Card>

          {/* Organización */}
          <Card title="Organización">
            <Field label="Tipo de producto">
              <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Armazón, Lentes…" className={inputCls} />
            </Field>
            <Field label="Proveedor">
              <input value={proveedor} onChange={(e) => setProveedor(e.target.value)} placeholder="Ej. Essilor" className={inputCls} />
            </Field>
            <Field label="Colecciones">
              <input value={colecciones} onChange={(e) => setColecciones(e.target.value)} placeholder="Nombre de colección" className={inputCls} />
            </Field>
            <Field label="Tags">
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Separados por coma" className={inputCls} />
            </Field>
          </Card>

          {/* Plantilla */}
          <Card title="Plantilla de tema">
            <div className="relative">
              <select
                value={plantilla}
                onChange={(e) => setPlantilla(e.target.value)}
                className={inputCls + ' appearance-none pr-8'}
              >
                <option value="default">Predeterminada</option>
                <option value="optica">Óptica</option>
                <option value="contacto">Lentes de contacto</option>
                <option value="solucion">Soluciones</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
