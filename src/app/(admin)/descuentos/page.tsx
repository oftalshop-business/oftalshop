'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Tag, Filter, MoreHorizontal, Pencil, Trash2,
  X, RefreshCw, ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoDesc = 'Porcentaje' | 'Monto fijo' | 'Envío gratis'
type EstadoDesc = 'Activo' | 'Programado' | 'Expirado'

interface Descuento {
  id: string
  codigo: string
  tipo: TipoDesc
  valor: number | null
  usos: number
  limite_usos: number | null
  fecha_inicio: string
  fecha_fin: string | null
  estado: EstadoDesc
}

const uid = () => Math.random().toString(36).slice(2, 9)

const genCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase()

const ESTADO_BADGE: Record<EstadoDesc, string> = {
  Activo:     'bg-[#e3f1df] text-[#2d6a1f]',
  Programado: 'bg-[#dbeafe] text-[#1e40af]',
  Expirado:   'bg-[#f1f1f1] text-[#6a6a6a]',
}

const SAMPLE: Descuento[] = [
  { id: '1', codigo: 'VERANO2026',  tipo: 'Porcentaje',   valor: 20,   usos: 14, limite_usos: 100, fecha_inicio: '2026-04-01', fecha_fin: '2026-04-30', estado: 'Activo'     },
  { id: '2', codigo: 'PRIMERAVEZ',  tipo: 'Monto fijo',   valor: 150,  usos:  8, limite_usos: null, fecha_inicio: '2026-01-01', fecha_fin: null,         estado: 'Activo'     },
  { id: '3', codigo: 'ENVIOGRATIS', tipo: 'Envío gratis', valor: null, usos:  3, limite_usos: 50,  fecha_inicio: '2026-04-15', fecha_fin: '2026-05-15', estado: 'Activo'     },
  { id: '4', codigo: 'NAVIDAD25',   tipo: 'Porcentaje',   valor: 15,   usos: 56, limite_usos: 56,  fecha_inicio: '2025-12-01', fecha_fin: '2025-12-31', estado: 'Expirado'   },
  { id: '5', codigo: 'MAYO2026',    tipo: 'Porcentaje',   valor: 10,   usos:  0, limite_usos: 200, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-31', estado: 'Programado' },
]

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#6a6a6a] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#1a1a1a]">{label}</label>
      {children}
    </div>
  )
}

const emptyForm = () => ({
  codigo: genCode(), tipo: 'Porcentaje' as TipoDesc, valor: '',
  fecha_inicio: new Date().toISOString().slice(0, 10),
  fecha_fin: '', limite_usos: '',
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function DescuentosPage() {
  const supabase = createClient()

  const [descuentos, setDescuentos] = useState<Descuento[]>(SAMPLE)
  const [loading, setLoading]       = useState(true)
  const [openMenu, setOpenMenu]     = useState<string | null>(null)
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<Descuento | null>(null)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState(emptyForm())

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase.from('descuentos').select('*').order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setDescuentos(
            data.map((r: Record<string, unknown>) => ({
              id:           String(r.id),
              codigo:       String(r.codigo ?? ''),
              tipo:         (r.tipo as TipoDesc) ?? 'Porcentaje',
              valor:        r.valor != null ? Number(r.valor) : null,
              usos:         Number(r.usos ?? 0),
              limite_usos:  r.limite_usos != null ? Number(r.limite_usos) : null,
              fecha_inicio: String(r.fecha_inicio ?? ''),
              fecha_fin:    r.fecha_fin ? String(r.fecha_fin) : null,
              estado:       (r.estado as EstadoDesc) ?? 'Activo',
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

  function computeEstado(ini: string, fin: string | null): EstadoDesc {
    const now = new Date()
    const start = new Date(ini)
    if (start > now) return 'Programado'
    if (fin && new Date(fin) < now) return 'Expirado'
    return 'Activo'
  }

  function openCreate() {
    setEditTarget(null)
    setForm(emptyForm())
    setShowModal(true)
  }
  function openEdit(d: Descuento) {
    setEditTarget(d)
    setForm({
      codigo:       d.codigo,
      tipo:         d.tipo,
      valor:        d.valor != null ? String(d.valor) : '',
      fecha_inicio: d.fecha_inicio,
      fecha_fin:    d.fecha_fin ?? '',
      limite_usos:  d.limite_usos != null ? String(d.limite_usos) : '',
    })
    setOpenMenu(null)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.codigo.trim()) return
    setSaving(true)
    const estado = computeEstado(form.fecha_inicio, form.fecha_fin || null)
    const payload = {
      codigo:       form.codigo.toUpperCase(),
      tipo:         form.tipo,
      valor:        form.valor ? parseFloat(form.valor) : null,
      fecha_inicio: form.fecha_inicio,
      fecha_fin:    form.fecha_fin || null,
      limite_usos:  form.limite_usos ? parseInt(form.limite_usos) : null,
      estado,
    }
    try {
      if (editTarget) {
        await supabase.from('descuentos').update(payload).eq('id', editTarget.id)
        setDescuentos((prev) => prev.map((d) => d.id === editTarget.id ? { ...d, ...payload } : d))
      } else {
        const { data } = await supabase.from('descuentos').insert({ ...payload, usos: 0 }).select().single()
        const nuevo: Descuento = {
          id:           data?.id ?? uid(),
          usos:         0,
          ...payload,
        }
        setDescuentos((prev) => [nuevo, ...prev])
      }
    } finally {
      setSaving(false)
      setShowModal(false)
    }
  }

  async function handleDelete(id: string) {
    setOpenMenu(null)
    if (!window.confirm('¿Eliminar este descuento?')) return
    await supabase.from('descuentos').delete().eq('id', id)
    setDescuentos((prev) => prev.filter((d) => d.id !== id))
  }

  const activos   = descuentos.filter((d) => d.estado === 'Activo').length
  const usosTotal = descuentos.reduce((s, d) => s + d.usos, 0)
  const expirados = descuentos.filter((d) => d.estado === 'Expirado').length

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Descuentos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" /> Crear descuento
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Códigos activos', value: activos },
          { label: 'Usos totales',    value: usosTotal },
          { label: 'Expirados',       value: expirados },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6a6a6a]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#e1e1e1] px-4 py-3">
          <Tag className="h-4 w-4 text-[#6a6a6a]" />
          <span className="text-sm font-semibold text-[#1a1a1a] flex-1">Códigos de descuento</span>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filtrar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                {['Código', 'Tipo', 'Valor', 'Usos', 'Inicio', 'Fin', 'Estado', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-[#9a9a9a]">Cargando…</td></tr>
              ) : descuentos.map((d) => (
                <tr key={d.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-[#2a9d8f]">{d.codigo}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{d.tipo}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">
                    {d.tipo === 'Porcentaje' ? `${d.valor}%` : d.tipo === 'Monto fijo' ? `$${d.valor}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">
                    {d.usos}{d.limite_usos ? `/${d.limite_usos}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{fmtDate(d.fecha_inicio)}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{fmtDate(d.fecha_fin)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[d.estado]}`}>
                      {d.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#6a6a6a] hover:bg-[#f1f1f1]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === d.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-[#e1e1e1] bg-white py-1 shadow-md">
                          <button onClick={() => openEdit(d)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button onClick={() => handleDelete(d.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#b91c1c] hover:bg-[#f7f7f7]">
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
        <div className="px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">{descuentos.length} descuentos</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                {editTarget ? 'Editar descuento' : 'Crear descuento'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6a6a6a] hover:text-[#1a1a1a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Field label="Código de descuento">
                <div className="flex gap-2">
                  <input
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                    placeholder="PROMO2026"
                    className={inputCls + ' flex-1'}
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, codigo: genCode() })}
                    title="Generar código"
                    className="flex items-center justify-center rounded-lg border border-[#e1e1e1] px-3 text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo">
                  <div className="relative">
                    <select
                      value={form.tipo}
                      onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoDesc })}
                      className={inputCls + ' appearance-none pr-8'}
                    >
                      <option>Porcentaje</option>
                      <option>Monto fijo</option>
                      <option>Envío gratis</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                  </div>
                </Field>
                <Field label={form.tipo === 'Porcentaje' ? 'Valor (%)' : form.tipo === 'Monto fijo' ? 'Valor ($)' : 'Valor'}>
                  <input
                    type="number"
                    min={0}
                    value={form.valor}
                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    placeholder="0"
                    disabled={form.tipo === 'Envío gratis'}
                    className={inputCls + (form.tipo === 'Envío gratis' ? ' bg-[#f7f7f7] text-[#9a9a9a]' : '')}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de inicio">
                  <input
                    type="date"
                    value={form.fecha_inicio}
                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Fecha de fin">
                  <input
                    type="date"
                    value={form.fecha_fin}
                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Límite de usos (dejar vacío = ilimitado)">
                <input
                  type="number"
                  min={1}
                  value={form.limite_usos}
                  onChange={(e) => setForm({ ...form, limite_usos: e.target.value })}
                  placeholder="Ilimitado"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.codigo.trim()}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50"
              >
                {saving ? 'Guardando…' : editTarget ? 'Guardar' : 'Crear descuento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
