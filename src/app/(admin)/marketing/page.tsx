'use client'

import { useState } from 'react'
import {
  Plus, Mail, Share2, TrendingUp, Megaphone,
  MoreHorizontal, Pencil, Trash2, X, Settings, ChevronDown,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type CampanaEstado = 'Enviado' | 'Programado' | 'Borrador' | 'Activo'
type CampanaTipo = 'Email' | 'Redes sociales' | 'Anuncio'

interface Campana {
  id: string
  nombre: string
  tipo: CampanaTipo
  estado: CampanaEstado
  alcance: number
  conversion: string
  fecha: string
  presupuesto: number | null
}

const uid = () => Math.random().toString(36).slice(2, 9)

const ESTADO_BADGE: Record<CampanaEstado, string> = {
  Enviado:    'bg-[#e3f1df] text-[#2d6a1f]',
  Programado: 'bg-[#dbeafe] text-[#1e40af]',
  Borrador:   'bg-[#f1f1f1] text-[#6a6a6a]',
  Activo:     'bg-[#fef3c7] text-[#92400e]',
}

const SAMPLE: Campana[] = [
  { id: '1', nombre: 'Promo Día del Optometrista', tipo: 'Email',           estado: 'Enviado',    alcance: 320, conversion: '12%', fecha: '10 abr 2026', presupuesto: null },
  { id: '2', nombre: 'Descuento Primavera',        tipo: 'Email',           estado: 'Programado', alcance:   0, conversion: '—',   fecha: '25 abr 2026', presupuesto: null },
  { id: '3', nombre: 'Story de nuevos armazones',  tipo: 'Redes sociales',  estado: 'Enviado',    alcance: 850, conversion: '8%',  fecha: '5 abr 2026',  presupuesto: 500  },
  { id: '4', nombre: 'Anuncio Google mayo',        tipo: 'Anuncio',         estado: 'Borrador',   alcance:   0, conversion: '—',   fecha: '1 may 2026',  presupuesto: 2000 },
]

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#6a6a6a] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#1a1a1a]">{label}</label>
      {children}
    </div>
  )
}

type ChannelKey = 'email' | 'social' | 'ads'

interface Channel {
  key: ChannelKey
  title: string
  icon: React.ElementType
  desc: string
  status: string
}

const CHANNELS: Channel[] = [
  { key: 'email',  title: 'Email Marketing', icon: Mail,        desc: 'Envía campañas y automatizaciones a tus clientes.', status: 'No configurado' },
  { key: 'social', title: 'Redes Sociales',  icon: Share2,      desc: 'Conecta y publica en Instagram, Facebook y más.',   status: 'No configurado' },
  { key: 'ads',    title: 'Anuncios',        icon: TrendingUp,  desc: 'Crea anuncios en Google y Meta desde aquí.',        status: 'No configurado' },
]

const emptyForm = () => ({
  nombre: '', tipo: 'Email' as CampanaTipo,
  fecha_inicio: new Date().toISOString().slice(0, 10),
  fecha_fin: '', presupuesto: '',
})

// ─── Component ───────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [campanas, setCampanas]     = useState<Campana[]>(SAMPLE)
  const [openMenu, setOpenMenu]     = useState<string | null>(null)
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<Campana | null>(null)
  const [form, setForm]             = useState(emptyForm())
  const [configModal, setConfigModal] = useState<ChannelKey | null>(null)

  function openCreate() {
    setEditTarget(null); setForm(emptyForm()); setShowModal(true)
  }
  function openEdit(c: Campana) {
    setEditTarget(c)
    setForm({ nombre: c.nombre, tipo: c.tipo, fecha_inicio: c.fecha, fecha_fin: '', presupuesto: c.presupuesto ? String(c.presupuesto) : '' })
    setOpenMenu(null); setShowModal(true)
  }

  function handleSave() {
    if (!form.nombre.trim()) return
    if (editTarget) {
      setCampanas((prev) => prev.map((c) => c.id === editTarget.id
        ? { ...c, nombre: form.nombre, tipo: form.tipo, fecha: form.fecha_inicio, presupuesto: form.presupuesto ? Number(form.presupuesto) : null }
        : c
      ))
    } else {
      setCampanas((prev) => [
        ...prev,
        { id: uid(), nombre: form.nombre, tipo: form.tipo, estado: 'Borrador', alcance: 0, conversion: '—', fecha: form.fecha_inicio, presupuesto: form.presupuesto ? Number(form.presupuesto) : null },
      ])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setOpenMenu(null)
    if (!window.confirm('¿Eliminar esta campaña?')) return
    setCampanas((prev) => prev.filter((c) => c.id !== id))
  }

  const totalAlcance   = campanas.reduce((s, c) => s + c.alcance, 0)
  const totalEnviadas  = campanas.filter((c) => c.estado === 'Enviado').length
  const totalProgramadas = campanas.filter((c) => c.estado === 'Programado').length

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Marketing</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" /> Crear campaña
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Alcance total',        value: totalAlcance.toLocaleString() },
          { label: 'Campañas enviadas',    value: totalEnviadas },
          { label: 'Campañas programadas', value: totalProgramadas },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6a6a6a]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-3 gap-4">
        {CHANNELS.map(({ key, title, icon: Icon, desc, status }) => (
          <div key={key} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f1f1]">
                <Icon className="h-4 w-4 text-[#6a6a6a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
                <span className="text-xs text-[#9a9a9a]">{status}</span>
              </div>
            </div>
            <p className="text-xs text-[#6a6a6a] mb-4 leading-relaxed">{desc}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setConfigModal(key) }}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e1e1e1] py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
            >
              <Settings className="h-3.5 w-3.5" /> Configurar
            </button>
          </div>
        ))}
      </div>

      {/* Campaigns table */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Campañas</h2>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Nueva campaña
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                {['Nombre', 'Tipo', 'Estado', 'Alcance', 'Conversión', 'Fecha', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campanas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Megaphone className="mx-auto h-10 w-10 text-[#c9c9c9]" />
                    <p className="mt-3 text-sm text-[#6a6a6a]">Sin campañas todavía</p>
                  </td>
                </tr>
              ) : campanas.map((c) => (
                <tr key={c.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">{c.nombre}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.tipo}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[c.estado]}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.alcance > 0 ? c.alcance.toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.conversion}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.fecha}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#6a6a6a] hover:bg-[#f1f1f1]"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Crear/Editar Campaña ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                {editTarget ? 'Editar campaña' : 'Crear campaña'}
              </h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <Field label="Nombre de la campaña *">
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Promo Día del Optometrista" className={inputCls} />
              </Field>
              <Field label="Tipo">
                <div className="relative">
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as CampanaTipo })} className={inputCls + ' appearance-none pr-8'}>
                    <option>Email</option>
                    <option>Redes sociales</option>
                    <option>Anuncio</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de inicio">
                  <input type="date" value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Fecha de fin">
                  <input type="date" value={form.fecha_fin} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <Field label="Presupuesto ($)">
                <input type="number" min={0} value={form.presupuesto} onChange={(e) => setForm({ ...form, presupuesto: e.target.value })} placeholder="Opcional" className={inputCls} />
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cancelar</button>
              <button onClick={handleSave} disabled={!form.nombre.trim()} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50">
                {editTarget ? 'Guardar' : 'Crear campaña'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Configurar canal ── */}
      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfigModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                Configurar {CHANNELS.find((c) => c.key === configModal)?.title}
              </h2>
              <button onClick={() => setConfigModal(null)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              {configModal === 'email' && (
                <>
                  <Field label="Remitente"><input placeholder="OftalShop <hola@oftalshop.com>" className={inputCls} /></Field>
                  <Field label="Proveedor de email"><input placeholder="Sendgrid, Mailchimp…" className={inputCls} /></Field>
                  <Field label="API Key"><input type="password" placeholder="••••••••••••" className={inputCls} /></Field>
                </>
              )}
              {configModal === 'social' && (
                <>
                  <Field label="Instagram"><input placeholder="@mitienda" className={inputCls} /></Field>
                  <Field label="Facebook"><input placeholder="facebook.com/mitienda" className={inputCls} /></Field>
                </>
              )}
              {configModal === 'ads' && (
                <>
                  <Field label="Google Ads ID"><input placeholder="AW-XXXXXXXXX" className={inputCls} /></Field>
                  <Field label="Meta Pixel ID"><input placeholder="XXXXXXXXXXXXXXXX" className={inputCls} /></Field>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setConfigModal(null)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cancelar</button>
              <button onClick={() => setConfigModal(null)} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a]">Guardar configuración</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
