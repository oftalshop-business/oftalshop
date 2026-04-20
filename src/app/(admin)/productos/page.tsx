'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Estado = 'Activo' | 'Borrador' | 'Archivado'

interface Producto {
  id: string
  titulo: string
  estado: Estado
  stock: number | null
  track_quantity: boolean
  tipo_producto: string | null
  proveedor: string | null
  precio: number | null
  imagen: string | null
}

const ESTADO_BADGE: Record<Estado, string> = {
  Activo:    'bg-[#e3f1df] text-[#2d6a1f]',
  Borrador:  'bg-[#f1f1f1] text-[#6a6a6a]',
  Archivado: 'bg-[#fff3cd] text-[#856404]',
}

const TABS = ['Todos', 'Activos', 'Borrador', 'Archivados'] as const
type Tab = typeof TABS[number]

const SAMPLE: Producto[] = [
  { id: '1', titulo: 'Armazón Ray-Ban Clubmaster',       estado: 'Activo',    stock: 12, track_quantity: true,  tipo_producto: 'Armazón',            proveedor: 'Ray-Ban',           precio: 1800, imagen: null },
  { id: '2', titulo: 'Lentes de Contacto Acuvue Oasys', estado: 'Activo',    stock: 45, track_quantity: true,  tipo_producto: 'Lentes de contacto', proveedor: 'Johnson & Johnson', precio:  650, imagen: null },
  { id: '3', titulo: 'Solución Multiusos Renu 360ml',    estado: 'Activo',    stock: 28, track_quantity: true,  tipo_producto: 'Solución',           proveedor: 'Bausch & Lomb',     precio:  280, imagen: null },
  { id: '4', titulo: 'Armazón Oakley Holbrook',          estado: 'Borrador',  stock:  0, track_quantity: true,  tipo_producto: 'Armazón',            proveedor: 'Oakley',            precio: 2400, imagen: null },
  { id: '5', titulo: 'Cristales Antirreflejo Essilor',   estado: 'Activo',    stock:  8, track_quantity: true,  tipo_producto: 'Cristales',          proveedor: 'Essilor',           precio: 3200, imagen: null },
  { id: '6', titulo: 'Estuche Rígido Premium',           estado: 'Archivado', stock:  0, track_quantity: false, tipo_producto: 'Accesorio',          proveedor: 'Genérico',          precio:   95, imagen: null },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductosPage() {
  const supabase = createClient()

  const [productos, setProductos] = useState<Producto[]>(SAMPLE)
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('Todos')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [openMenu, setOpenMenu]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('productos')
          .select('id, titulo, estado, stock, track_quantity, tipo_producto, proveedor, precio, medias(url)')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setProductos(
            data.map((r: Record<string, unknown>) => ({
              id:             String(r.id),
              titulo:         String(r.titulo ?? 'Sin título'),
              estado:         (r.estado as Estado) ?? 'Borrador',
              stock:          r.stock != null ? Number(r.stock) : null,
              track_quantity: Boolean(r.track_quantity),
              tipo_producto:  r.tipo_producto ? String(r.tipo_producto) : null,
              proveedor:      r.proveedor ? String(r.proveedor) : null,
              precio:         r.precio != null ? Number(r.precio) : null,
              imagen:         Array.isArray(r.medias) && r.medias.length > 0
                ? String((r.medias as Array<Record<string, unknown>>)[0].url)
                : null,
            }))
          )
        }
      } catch {
        // keeps sample data
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = productos.filter((p) => {
    const matchTab =
      activeTab === 'Activos'    ? p.estado === 'Activo'   :
      activeTab === 'Borrador'   ? p.estado === 'Borrador' :
      activeTab === 'Archivados' ? p.estado === 'Archivado': true
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.titulo.toLowerCase().includes(q) ||
      (p.tipo_producto ?? '').toLowerCase().includes(q) ||
      (p.proveedor ?? '').toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const toggleAll   = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))
  const toggleOne   = (id: string) => setSelected((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
  })

  async function handleDelete(id: string) {
    setOpenMenu(null)
    if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    await supabase.from('productos').delete().eq('id', id)
    setProductos((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s })
  }

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Productos</h1>
        <Link
          href="/productos/nuevo"
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar producto
        </Link>
      </div>

      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">

        {/* Tabs */}
        <div className="flex items-center border-b border-[#e1e1e1] px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-[#6a6a6a] hover:text-[#1a1a1a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="ml-auto shrink-0 py-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filtrar
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-[#e1e1e1] px-4 py-3">
          <div className="flex max-w-sm items-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-1.5">
            <Search className="h-4 w-4 text-[#9a9a9a] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos"
              className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#9a9a9a] hover:text-[#1a1a1a] text-base leading-none">×</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-[#c9c9c9] accent-[#1a1a1a]" />
                </th>
                {['Imagen', 'Título', 'Estado', 'Inventario', 'Tipo', 'Proveedor', 'Precio'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[#9a9a9a]">Cargando…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <Package className="mx-auto h-10 w-10 text-[#c9c9c9]" />
                    <p className="mt-3 text-sm font-medium text-[#6a6a6a]">Sin productos</p>
                  </td>
                </tr>
              ) : rows.map((p) => (
                <tr key={p.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} className="rounded border-[#c9c9c9] accent-[#1a1a1a]" />
                  </td>
                  <td className="px-4 py-3">
                    {p.imagen
                      ? <img src={p.imagen} alt="" className="h-10 w-10 rounded-lg object-cover border border-[#e1e1e1]" />
                      : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f1f1] border border-[#e1e1e1]"><Package className="h-5 w-5 text-[#c9c9c9]" /></div>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/productos/${p.id}`} className="text-sm font-medium text-[#1a1a1a] hover:text-[#2a9d8f] transition-colors">
                      {p.titulo}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">
                    {!p.track_quantity ? '—' : `${p.stock ?? 0} en stock`}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.tipo_producto ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.proveedor ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">
                    {p.precio != null ? `$${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#6a6a6a] hover:bg-[#f1f1f1] transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === p.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-[#e1e1e1] bg-white shadow-md py-1">
                          <Link href={`/productos/${p.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#b91c1c] hover:bg-[#f7f7f7] transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">
            {selected.size > 0
              ? `${selected.size} seleccionado${selected.size > 1 ? 's' : ''}`
              : `${rows.length} producto${rows.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </div>
  )
}
