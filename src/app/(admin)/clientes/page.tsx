'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, MoreHorizontal, Pencil, Trash2,
  Users, ShoppingBag, TrendingUp, X, ChevronDown, ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string | null
  direccion: string | null
  pedidos: number
  total_gastado: number
  ciudad: string | null
  created_at: string
}

const uid = () => Math.random().toString(36).slice(2, 9)

const SAMPLE: Cliente[] = [
  { id: '1', nombre: 'Carlos Mendez',  email: 'carlos@example.com',  telefono: '55 1234 5678', direccion: 'Av. Insurgentes 100, CDMX', pedidos: 4, total_gastado: 4890, ciudad: 'Ciudad de México', created_at: '2026-01-12' },
  { id: '2', nombre: 'Ana García',     email: 'ana@example.com',     telefono: '33 8765 4321', direccion: 'Av. Vallarta 200, Guadalajara', pedidos: 2, total_gastado: 1780, ciudad: 'Guadalajara',      created_at: '2026-02-05' },
  { id: '3', nombre: 'Luis Torres',    email: 'luis@example.com',    telefono: '81 2345 6789', direccion: 'Av. Garza Sada 50, Monterrey', pedidos: 7, total_gastado: 9200, ciudad: 'Monterrey',         created_at: '2025-12-20' },
  { id: '4', nombre: 'María López',    email: 'maria@example.com',   telefono: null,           direccion: null,                           pedidos: 1, total_gastado:  650, ciudad: 'Puebla',            created_at: '2026-03-01' },
  { id: '5', nombre: 'Roberto Silva',  email: 'roberto@example.com', telefono: '66 9876 5432', direccion: 'Blvd. Agua Caliente 10, TJ',  pedidos: 3, total_gastado: 5100, ciudad: 'Tijuana',           created_at: '2026-01-08' },
]

const fmt = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#6a6a6a] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#1a1a1a]">{label}</label>
      {children}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ClientesPage() {
  const supabase = createClient()

  const [clientes, setClientes]   = useState<Cliente[]>(SAMPLE)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [openMenu, setOpenMenu]   = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Cliente | null>(null)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState({ nombre: '', email: '', telefono: '', direccion: '' })

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('clientes_tienda')
          .select('*')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setClientes(
            data.map((r: Record<string, unknown>) => ({
              id:            String(r.id),
              nombre:        String(r.nombre ?? r.nombre_completo ?? ''),
              email:         String(r.email ?? ''),
              telefono:      r.telefono ? String(r.telefono) : null,
              direccion:     r.direccion ? String(r.direccion) : null,
              pedidos:       Number(r.pedidos ?? r.total_pedidos ?? 0),
              total_gastado: Number(r.total_gastado ?? 0),
              ciudad:        r.ciudad ? String(r.ciudad) : null,
              created_at:    String(r.created_at ?? new Date().toISOString()),
            }))
          )
        }
      } catch {
        // keep sample
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filtered ──────────────────────────────────────────────────────────────

  const rows = clientes.filter((c) => {
    const q = search.toLowerCase()
    return !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.ciudad ?? '').toLowerCase().includes(q)
  })

  // ── Select ────────────────────────────────────────────────────────────────

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const toggleAll   = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))
  const toggleOne   = (id: string) => setSelected((prev) => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
  })

  // ── Modal ─────────────────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null)
    setForm({ nombre: '', email: '', telefono: '', direccion: '' })
    setShowModal(true)
  }
  function openEdit(c: Cliente) {
    setEditTarget(c)
    setForm({ nombre: c.nombre, email: c.email, telefono: c.telefono ?? '', direccion: c.direccion ?? '' })
    setShowModal(true)
    setOpenMenu(null)
  }

  async function handleSave() {
    if (!form.nombre.trim() || !form.email.trim()) return
    setSaving(true)
    try {
      const payload = {
        nombre:        form.nombre,
        email:         form.email,
        telefono:      form.telefono || null,
        direccion:     form.direccion || null,
      }
      if (editTarget) {
        await supabase.from('clientes_tienda').update(payload).eq('id', editTarget.id)
        setClientes((prev) => prev.map((c) => c.id === editTarget.id ? { ...c, ...payload } : c))
      } else {
        const { data } = await supabase.from('clientes_tienda').insert(payload).select().single()
        const nuevo: Cliente = {
          id:            data?.id ?? uid(),
          nombre:        form.nombre,
          email:         form.email,
          telefono:      form.telefono || null,
          direccion:     form.direccion || null,
          pedidos:       0,
          total_gastado: 0,
          ciudad:        null,
          created_at:    new Date().toISOString(),
        }
        setClientes((prev) => [nuevo, ...prev])
      }
    } finally {
      setSaving(false)
      setShowModal(false)
    }
  }

  async function handleDelete(id: string) {
    setOpenMenu(null)
    if (!window.confirm('¿Eliminar este cliente?')) return
    await supabase.from('clientes_tienda').delete().eq('id', id)
    setClientes((prev) => prev.filter((c) => c.id !== id))
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s })
  }

  // ── Metrics ───────────────────────────────────────────────────────────────

  const thisMonth = new Date().toISOString().slice(0, 7)
  const metrics = [
    { label: 'Clientes totales',    value: clientes.length,                                                               icon: Users },
    { label: 'Nuevos este mes',     value: clientes.filter((c) => c.created_at.startsWith(thisMonth)).length,             icon: TrendingUp },
    { label: 'Con pedidos',         value: clientes.filter((c) => c.pedidos > 0).length,                                  icon: ShoppingBag },
  ]

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Clientes</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" /> Agregar cliente
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#6a6a6a]">{label}</p>
              <Icon className="h-4 w-4 text-[#9a9a9a]" />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">

        {/* Search + filter */}
        <div className="flex items-center gap-3 border-b border-[#e1e1e1] px-4 py-3">
          <div className="flex flex-1 max-w-sm items-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-1.5">
            <Search className="h-4 w-4 text-[#9a9a9a] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar clientes"
              className="flex-1 bg-transparent text-sm placeholder-[#9a9a9a] outline-none"
            />
            {search && <button onClick={() => setSearch('')} className="text-[#9a9a9a] text-base leading-none">×</button>}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filtrar
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-[#c9c9c9] accent-[#1a1a1a]" />
                </th>
                {['Nombre', 'Email', 'Pedidos', 'Total gastado', 'Ubicación', 'Registro'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-[#9a9a9a]">Cargando…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <Users className="mx-auto h-10 w-10 text-[#c9c9c9]" />
                    <p className="mt-3 text-sm text-[#6a6a6a]">Sin clientes</p>
                  </td>
                </tr>
              ) : rows.map((c) => (
                <tr key={c.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} className="rounded border-[#c9c9c9] accent-[#1a1a1a]" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a9d8f] text-xs font-semibold text-white">
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#1a1a1a]">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.pedidos} pedidos</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">
                    ${c.total_gastado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.ciudad ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{fmt(c.created_at)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/clientes/${c.id}`}
                        className="flex items-center gap-1 rounded-lg border border-[#e1e1e1] px-2.5 py-1.5 text-xs font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
                      >
                        Ver más <ChevronRight className="h-3 w-3" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#6a6a6a] hover:bg-[#f1f1f1] transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenu === c.id && (
                          <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-[#e1e1e1] bg-white py-1 shadow-md">
                            <button onClick={() => openEdit(c)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#b91c1c] hover:bg-[#f7f7f7]">
                              <Trash2 className="h-3.5 w-3.5" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">
            {selected.size > 0 ? `${selected.size} seleccionados` : `${rows.length} clientes`}
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                {editTarget ? 'Editar cliente' : 'Agregar cliente'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6a6a6a] hover:text-[#1a1a1a]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <Field label="Nombre completo *">
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Carlos Mendez" className={inputCls} />
              </Field>
              <Field label="Email *">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="cliente@ejemplo.com" className={inputCls} />
              </Field>
              <Field label="Teléfono">
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="55 1234 5678" className={inputCls} />
              </Field>
              <Field label="Dirección">
                <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Calle, número, ciudad" className={inputCls} />
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.nombre.trim() || !form.email.trim()}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50"
              >
                {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Agregar cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
