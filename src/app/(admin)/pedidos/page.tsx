'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Download, Filter, MoreHorizontal, Pencil, Trash2,
  ShoppingBag, Package, RotateCcw, CheckCircle, Truck, X, ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

type EstadoPago = 'Pagado' | 'Pendiente' | 'Reembolsado'
type EstadoPrep = 'No preparado' | 'Preparado' | 'En proceso' | 'Archivado'

interface Pedido {
  id: string
  numero: string
  fecha: string
  cliente: string
  email: string
  canal: string
  total: number
  estado_pago: EstadoPago
  estado_preparacion: EstadoPrep
  articulos: number
  metodo_pago: string
  producto: string
  cantidad: number
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE: Pedido[] = [
  { id: '1', numero: '#1001', fecha: '19 abr 2026', cliente: 'Carlos Mendez',    email: 'carlos@example.com',  canal: 'Online',       total: 1250, estado_pago: 'Pagado',    estado_preparacion: 'No preparado', articulos: 2, metodo_pago: 'Tarjeta', producto: 'Marco acetato', cantidad: 2 },
  { id: '2', numero: '#1002', fecha: '18 abr 2026', cliente: 'Ana García',       email: 'ana@example.com',     canal: 'Tienda física', total:  890, estado_pago: 'Pagado',    estado_preparacion: 'Preparado',    articulos: 1, metodo_pago: 'Efectivo', producto: 'Lentes progresivos', cantidad: 1 },
  { id: '3', numero: '#1003', fecha: '17 abr 2026', cliente: 'Luis Torres',      email: 'luis@example.com',    canal: 'Online',       total: 2100, estado_pago: 'Pendiente', estado_preparacion: 'No preparado', articulos: 3, metodo_pago: 'Transferencia', producto: 'Armazón titanio', cantidad: 3 },
  { id: '4', numero: '#1004', fecha: '16 abr 2026', cliente: 'María López',      email: 'maria@example.com',   canal: 'Online',       total:  650, estado_pago: 'Pagado',    estado_preparacion: 'Preparado',    articulos: 1, metodo_pago: 'Tarjeta', producto: 'Estuche de lujo', cantidad: 1 },
  { id: '5', numero: '#1005', fecha: '15 abr 2026', cliente: 'Roberto Silva',    email: 'roberto@example.com', canal: 'Tienda física', total: 3400, estado_pago: 'Pagado',    estado_preparacion: 'En proceso',   articulos: 4, metodo_pago: 'Efectivo', producto: 'Kit óptico completo', cantidad: 4 },
  { id: '6', numero: '#1006', fecha: '14 abr 2026', cliente: 'Sofía Ramírez',   email: 'sofia@example.com',   canal: 'Online',       total:  420, estado_pago: 'Reembolsado', estado_preparacion: 'Archivado',  articulos: 1, metodo_pago: 'Tarjeta', producto: 'Solución limpiadora', cantidad: 2 },
]

// ─── Badge maps ───────────────────────────────────────────────────────────────

const PAGO_BADGE: Record<EstadoPago, string> = {
  Pagado:      'bg-[#e3f1df] text-[#2d6a1f]',
  Pendiente:   'bg-[#fff3cd] text-[#856404]',
  Reembolsado: 'bg-[#fee2e2] text-[#991b1b]',
}
const PREP_BADGE: Record<EstadoPrep, string> = {
  'No preparado': 'bg-[#fff3cd] text-[#856404]',
  Preparado:      'bg-[#dbeafe] text-[#1e40af]',
  'En proceso':   'bg-[#f3e8ff] text-[#6b21a8]',
  Archivado:      'bg-[#f1f1f1] text-[#6a6a6a]',
}

const TABS = ['Todos', 'No preparados', 'Sin pagar', 'Abiertos', 'Archivados'] as const
type Tab = typeof TABS[number]

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = (): Omit<Pedido, 'id' | 'numero' | 'fecha' | 'articulos'> => ({
  cliente: '', email: '', canal: 'Online', total: 0,
  estado_pago: 'Pendiente', estado_preparacion: 'No preparado',
  metodo_pago: 'Tarjeta', producto: '', cantidad: 1,
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function PedidosPage() {
  const supabase = createClient()

  const [pedidos, setPedidos]       = useState<Pedido[]>(SAMPLE)
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState<Tab>('Todos')
  const [selected, setSelected]     = useState<Set<string>>(new Set())
  const [openMenu, setOpenMenu]     = useState<string | null>(null)
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<Pedido | null>(null)
  const [form, setForm]             = useState(emptyForm())
  const [saving, setSaving]         = useState(false)

  // ── Load from Supabase ────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('pedidos')
          .select('*')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setPedidos(
            data.map((r: Record<string, unknown>) => ({
              id:                  String(r.id ?? ''),
              numero:              String(r.numero ?? '#' + String(r.id ?? '').slice(0, 4)),
              fecha:               r.created_at
                ? new Date(String(r.created_at)).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
                : '',
              cliente:             String(r.cliente_nombre ?? r.cliente ?? ''),
              email:               String(r.cliente_email ?? r.email ?? ''),
              canal:               String(r.canal ?? 'Online'),
              total:               Number(r.total ?? 0),
              estado_pago:         (r.estado_pago as EstadoPago) ?? 'Pendiente',
              estado_preparacion:  (r.estado_preparacion as EstadoPrep) ?? 'No preparado',
              articulos:           Number(r.articulos ?? r.cantidad ?? 1),
              metodo_pago:         String(r.metodo_pago ?? 'Tarjeta'),
              producto:            String(r.producto ?? ''),
              cantidad:            Number(r.cantidad ?? 1),
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

  // ── Filtered rows ─────────────────────────────────────────────────────────

  const rows = pedidos.filter((p) => {
    if (activeTab === 'No preparados') return p.estado_preparacion === 'No preparado'
    if (activeTab === 'Sin pagar')     return p.estado_pago === 'Pendiente'
    if (activeTab === 'Abiertos')      return p.estado_preparacion !== 'Archivado'
    if (activeTab === 'Archivados')    return p.estado_preparacion === 'Archivado'
    return true
  })

  // ── Metrics ───────────────────────────────────────────────────────────────

  const metrics = [
    { label: 'Pedidos totales',     value: pedidos.length,                                                     icon: ShoppingBag },
    { label: 'Artículos pedidos',   value: pedidos.reduce((s, p) => s + p.articulos, 0),                       icon: Package },
    { label: 'Devoluciones',        value: pedidos.filter((p) => p.estado_pago === 'Reembolsado').length,      icon: RotateCcw },
    { label: 'Pedidos preparados',  value: pedidos.filter((p) => p.estado_preparacion === 'Preparado').length, icon: CheckCircle },
    { label: 'Pedidos entregados',  value: pedidos.filter((p) => p.estado_preparacion === 'Preparado').length, icon: Truck },
  ]

  // ── Select all ────────────────────────────────────────────────────────────

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const toggleAll   = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))
  const toggleOne   = (id: string) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  // ── CSV export ────────────────────────────────────────────────────────────

  function handleExport() {
    const headers = ['Pedido', 'Fecha', 'Cliente', 'Email', 'Canal', 'Total', 'Pago', 'Preparación', 'Artículos']
    const body = rows.map((p) =>
      [p.numero, p.fecha, p.cliente, p.email, p.canal, p.total.toFixed(2), p.estado_pago, p.estado_preparacion, p.articulos].join(',')
    )
    const csv = [headers.join(','), ...body].join('\n')
    const a   = document.createElement('a')
    a.href    = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'pedidos.csv'
    a.click()
  }

  // ── Open modal ────────────────────────────────────────────────────────────

  function openCreate() { setEditTarget(null); setForm(emptyForm()); setShowModal(true) }
  function openEdit(p: Pedido) {
    setEditTarget(p)
    setForm({ cliente: p.cliente, email: p.email, canal: p.canal, total: p.total,
               estado_pago: p.estado_pago, estado_preparacion: p.estado_preparacion,
               metodo_pago: p.metodo_pago, producto: p.producto, cantidad: p.cantidad })
    setShowModal(true)
    setOpenMenu(null)
  }

  // ── Save (create / update) ────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true)
    try {
      if (editTarget) {
        const { error } = await supabase
          .from('pedidos')
          .update({
            cliente_nombre:      form.cliente,
            cliente_email:       form.email,
            canal:               form.canal,
            total:               form.total,
            estado_pago:         form.estado_pago,
            estado_preparacion:  form.estado_preparacion,
            metodo_pago:         form.metodo_pago,
            producto:            form.producto,
            cantidad:            form.cantidad,
            articulos:           form.cantidad,
          })
          .eq('id', editTarget.id)
        if (!error) {
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === editTarget.id
                ? { ...p, ...form, articulos: form.cantidad }
                : p
            )
          )
        }
      } else {
        const numero = '#' + String(Date.now()).slice(-4)
        const { data, error } = await supabase
          .from('pedidos')
          .insert({
            numero,
            cliente_nombre:      form.cliente,
            cliente_email:       form.email,
            canal:               form.canal,
            total:               form.total,
            estado_pago:         form.estado_pago,
            estado_preparacion:  form.estado_preparacion,
            metodo_pago:         form.metodo_pago,
            producto:            form.producto,
            cantidad:            form.cantidad,
            articulos:           form.cantidad,
          })
          .select()
          .single()
        const nuevo: Pedido = {
          id:                 data?.id ?? String(Date.now()),
          numero:             data?.numero ?? numero,
          fecha:              new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
          cliente:            form.cliente,
          email:              form.email,
          canal:              form.canal,
          total:              form.total,
          estado_pago:        form.estado_pago,
          estado_preparacion: form.estado_preparacion,
          articulos:          form.cantidad,
          metodo_pago:        form.metodo_pago,
          producto:           form.producto,
          cantidad:           form.cantidad,
        }
        if (!error) setPedidos((prev) => [nuevo, ...prev])
        else        setPedidos((prev) => [nuevo, ...prev]) // optimistic
      }
    } finally {
      setSaving(false)
      setShowModal(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    setOpenMenu(null)
    await supabase.from('pedidos').delete().eq('id', id)
    setPedidos((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s })
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Pedidos</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear pedido
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#6a6a6a] leading-snug">{label}</p>
              <Icon className="h-4 w-4 text-[#9a9a9a] shrink-0" />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">

        {/* Tabs + filter */}
        <div className="flex items-center border-b border-[#e1e1e1] px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
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
              <Filter className="h-3.5 w-3.5" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-[#c9c9c9] accent-[#1a1a1a]"
                  />
                </th>
                {['Pedido', 'Fecha', 'Cliente', 'Canal', 'Total', 'Pago', 'Preparación', 'Art.'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-[#9a9a9a]">
                    Cargando pedidos…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-[#c9c9c9]" />
                    <p className="mt-3 text-sm font-medium text-[#6a6a6a]">Sin pedidos en esta vista</p>
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleOne(p.id)}
                        className="rounded border-[#c9c9c9] accent-[#1a1a1a]"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{p.numero}</td>
                    <td className="px-4 py-3 text-sm text-[#6a6a6a] whitespace-nowrap">{p.fecha}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1a1a]">{p.cliente}</td>
                    <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.canal}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">
                      ${p.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${PAGO_BADGE[p.estado_pago]}`}>
                        {p.estado_pago}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${PREP_BADGE[p.estado_preparacion]}`}>
                        {p.estado_preparacion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-[#6a6a6a]">{p.articulos}</td>
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
                            <button
                              onClick={() => openEdit(p)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#b91c1c] hover:bg-[#f7f7f7] transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">
            {selected.size > 0
              ? `${selected.size} seleccionado${selected.size > 1 ? 's' : ''}`
              : `${rows.length} pedido${rows.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                {editTarget ? 'Editar pedido' : 'Crear pedido'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6a6a6a] hover:text-[#1a1a1a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Field label="Nombre del cliente">
                <input
                  value={form.cliente}
                  onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                  placeholder="Ej. Carlos Mendez"
                  className={inputCls}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Producto">
                  <input
                    value={form.producto}
                    onChange={(e) => setForm({ ...form, producto: e.target.value })}
                    placeholder="Ej. Marco acetato"
                    className={inputCls}
                  />
                </Field>
                <Field label="Cantidad">
                  <input
                    type="number"
                    min={1}
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio total ($)">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.total}
                    onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Método de pago">
                  <div className="relative">
                    <select
                      value={form.metodo_pago}
                      onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                      className={inputCls + ' appearance-none pr-8'}
                    >
                      {['Tarjeta', 'Efectivo', 'Transferencia', 'OXXO'].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Estado de pago">
                  <div className="relative">
                    <select
                      value={form.estado_pago}
                      onChange={(e) => setForm({ ...form, estado_pago: e.target.value as EstadoPago })}
                      className={inputCls + ' appearance-none pr-8'}
                    >
                      {(['Pagado', 'Pendiente', 'Reembolsado'] as EstadoPago[]).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                  </div>
                </Field>
                <Field label="Estado de preparación">
                  <div className="relative">
                    <select
                      value={form.estado_preparacion}
                      onChange={(e) => setForm({ ...form, estado_preparacion: e.target.value as EstadoPrep })}
                      className={inputCls + ' appearance-none pr-8'}
                    >
                      {(['No preparado', 'En proceso', 'Preparado', 'Archivado'] as EstadoPrep[]).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                  </div>
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.cliente}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#1a1a1a] focus:bg-white transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#6a6a6a]">{label}</label>
      {children}
    </div>
  )
}
