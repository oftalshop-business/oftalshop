'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, User, Clock, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Cliente {
  id: string
  nombre: string
  apellidos: string
  dni: string
  telefono: string
  email: string
  ciudad: string
  direccion: string
  pedidos: number
  total_gastado: number
}

interface VisionRow {
  esferico: string
  cilindro: string
  eje: string
  av: string
  dip: string
  altura: string
  adicion?: string
}

interface Historia {
  doctor: string
  texto_libre: boolean
  fecha: string
  tipo_prescripcion: string
  lejos_od: VisionRow
  lejos_oi: VisionRow
  cerca_od: VisionRow
  cerca_oi: VisionRow
  inter_od: VisionRow
  inter_oi: VisionRow
  razon_consulta: string
  sintomatologia: string
  diagnostico: string
  tratamiento: string
  historia_ocular: string
  historial_familiar: string
  comentarios: string
  antecedentes: string[]
}

interface Pedido {
  id: string
  numero: string
  fecha: string
  productos: string
  total: number
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_CLIENTE: Cliente = {
  id: '1',
  nombre: 'Carlos',
  apellidos: 'Mendez Ríos',
  dni: '12345678',
  telefono: '55 1234 5678',
  email: 'carlos@example.com',
  ciudad: 'Lima',
  direccion: 'Av. Javier Prado 1200, San Isidro',
  pedidos: 4,
  total_gastado: 4890,
}

const emptyVision = (): VisionRow => ({ esferico: '', cilindro: '', eje: '', av: '', dip: '', altura: '', adicion: '' })

const SAMPLE_HISTORIA: Historia = {
  doctor: '',
  texto_libre: false,
  fecha: '',
  tipo_prescripcion: '',
  lejos_od: emptyVision(),
  lejos_oi: emptyVision(),
  cerca_od: emptyVision(),
  cerca_oi: emptyVision(),
  inter_od: emptyVision(),
  inter_oi: emptyVision(),
  razon_consulta: '',
  sintomatologia: '',
  diagnostico: '',
  tratamiento: '',
  historia_ocular: '',
  historial_familiar: '',
  comentarios: '',
  antecedentes: [],
}

const SAMPLE_PEDIDOS: Pedido[] = [
  { id: 'p1', numero: '#1042', fecha: '2026-04-10', productos: 'Armazón Ray-Ban RB5154 × 1', total: 850, estado: 'entregado' },
  { id: 'p2', numero: '#1031', fecha: '2026-03-22', productos: 'Lentes de contacto Acuvue × 6', total: 420, estado: 'entregado' },
  { id: 'p3', numero: '#1018', fecha: '2026-02-15', productos: 'Cristales antirreflejo × 2', total: 1200, estado: 'entregado' },
  { id: 'p4', numero: '#1005', fecha: '2026-01-08', productos: 'Solución limpiadora × 3', total: 180, estado: 'entregado' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ANTECEDENTES = ['Catarata', 'Glaucoma', 'Traumatismo ocular', 'Hipertensión', 'Diabetes mellitus', 'Otro']

const ESTADO_COLORS: Record<string, string> = {
  pendiente:   'bg-[#fef3c7] text-[#92400e]',
  procesando:  'bg-[#dbeafe] text-[#1e40af]',
  enviado:     'bg-[#ede9fe] text-[#5b21b6]',
  entregado:   'bg-[#dcfce7] text-[#166534]',
  cancelado:   'bg-[#fee2e2] text-[#991b1b]',
}

const inputCls = 'w-full rounded-lg border border-[#2a3050] bg-[#1e2130] px-3 py-2 text-sm text-white placeholder-[#4a5070] outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 transition-all'
const textareaCls = inputCls + ' resize-none h-20'

// ─── Vision Table ─────────────────────────────────────────────────────────────

function VisionTable({
  title,
  od,
  oi,
  withAdicion,
  onChange,
}: {
  title: string
  od: VisionRow
  oi: VisionRow
  withAdicion?: boolean
  onChange: (eye: 'od' | 'oi', field: keyof VisionRow, val: string) => void
}) {
  const cols: (keyof VisionRow)[] = ['esferico', 'cilindro', 'eje', 'av', 'dip', 'altura']
  if (withAdicion) cols.push('adicion')

  const labels: Record<string, string> = {
    esferico: 'Esférico',
    cilindro: 'Cilindro',
    eje: 'Eje',
    av: 'A.V C/c',
    dip: 'DIP',
    altura: 'Altura',
    adicion: 'Adición',
  }

  return (
    <div className="rounded-xl border border-[#2a3050] bg-[#161b2e] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#2a3050]">
        <p className="text-xs font-semibold text-[#8a9abf] uppercase tracking-wider">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#2a3050]">
              <th className="px-3 py-2 text-left text-[#5a6a8a] font-medium w-24">Ojo</th>
              {cols.map((c) => (
                <th key={c} className="px-2 py-2 text-center text-[#5a6a8a] font-medium">{labels[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(['od', 'oi'] as const).map((eye) => {
              const row = eye === 'od' ? od : oi
              return (
                <tr key={eye} className="border-b border-[#1e2540] last:border-0">
                  <td className="px-3 py-2 font-semibold text-white">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${eye === 'od' ? 'bg-[#1e40af]/30 text-[#93c5fd]' : 'bg-[#065f46]/30 text-[#6ee7b7]'}`}>
                      {eye === 'od' ? 'O.D.' : 'O.I.'}
                    </span>
                  </td>
                  {cols.map((col) => (
                    <td key={col} className="px-1.5 py-1.5">
                      <input
                        type="text"
                        value={row[col] ?? ''}
                        onChange={(e) => onChange(eye, col, e.target.value)}
                        className="w-full min-w-[60px] rounded border border-[#2a3050] bg-[#0f1117] px-2 py-1 text-center text-xs text-white placeholder-[#3a4060] outline-none focus:border-[#3b82f6]"
                        placeholder="—"
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Section header ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#2a3050] bg-[#161b2e] p-5">
      <h3 className="text-xs font-semibold text-[#8a9abf] uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientePerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [tab, setTab] = useState<'datos' | 'historia' | 'compras'>('datos')
  const [cliente, setCliente] = useState<Cliente>(SAMPLE_CLIENTE)
  const [historia, setHistoria] = useState<Historia>(SAMPLE_HISTORIA)
  const [pedidos, setPedidos] = useState<Pedido[]>(SAMPLE_PEDIDOS)
  const [savingDatos, setSavingDatos] = useState(false)
  const [savingHistoria, setSavingHistoria] = useState(false)
  const [savedDatos, setSavedDatos] = useState(false)
  const [savedHistoria, setSavedHistoria] = useState(false)

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const { data: c } = await supabase
          .from('clientes_tienda')
          .select('*')
          .eq('id', id)
          .single()
        if (c) {
          const parts = String(c.nombre ?? '').split(' ')
          setCliente({
            id: String(c.id),
            nombre: parts[0] ?? '',
            apellidos: parts.slice(1).join(' '),
            dni: String(c.dni ?? ''),
            telefono: String(c.telefono ?? ''),
            email: String(c.email ?? ''),
            ciudad: String(c.ciudad ?? ''),
            direccion: String(c.direccion ?? ''),
            pedidos: Number(c.pedidos ?? 0),
            total_gastado: Number(c.total_gastado ?? 0),
          })
        }
      } catch { /* keep sample */ }

      try {
        const { data: h } = await supabase
          .from('historias_clinicas')
          .select('*')
          .eq('cliente_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (h) {
          setHistoria({
            doctor:            String(h.doctor ?? ''),
            texto_libre:       Boolean(h.texto_libre),
            fecha:             String(h.fecha ?? ''),
            tipo_prescripcion: String(h.tipo_prescripcion ?? ''),
            lejos_od:  { esferico: h.lejos_od_esferico ?? '', cilindro: h.lejos_od_cilindro ?? '', eje: h.lejos_od_eje ?? '', av: h.lejos_od_av ?? '', dip: h.lejos_od_dip ?? '', altura: h.lejos_od_altura ?? '', adicion: h.lejos_od_adicion ?? '' },
            lejos_oi:  { esferico: h.lejos_oi_esferico ?? '', cilindro: h.lejos_oi_cilindro ?? '', eje: h.lejos_oi_eje ?? '', av: h.lejos_oi_av ?? '', dip: h.lejos_oi_dip ?? '', altura: h.lejos_oi_altura ?? '', adicion: h.lejos_oi_adicion ?? '' },
            cerca_od:  { esferico: h.cerca_od_esferico ?? '', cilindro: h.cerca_od_cilindro ?? '', eje: h.cerca_od_eje ?? '', av: h.cerca_od_av ?? '', dip: h.cerca_od_dip ?? '', altura: h.cerca_od_altura ?? '' },
            cerca_oi:  { esferico: h.cerca_oi_esferico ?? '', cilindro: h.cerca_oi_cilindro ?? '', eje: h.cerca_oi_eje ?? '', av: h.cerca_oi_av ?? '', dip: h.cerca_oi_dip ?? '', altura: h.cerca_oi_altura ?? '' },
            inter_od:  { esferico: h.inter_od_esferico ?? '', cilindro: h.inter_od_cilindro ?? '', eje: h.inter_od_eje ?? '', av: h.inter_od_av ?? '', dip: h.inter_od_dip ?? '', altura: h.inter_od_altura ?? '' },
            inter_oi:  { esferico: h.inter_oi_esferico ?? '', cilindro: h.inter_oi_cilindro ?? '', eje: h.inter_oi_eje ?? '', av: h.inter_oi_av ?? '', dip: h.inter_oi_dip ?? '', altura: h.inter_oi_altura ?? '' },
            razon_consulta:    String(h.razon_consulta ?? ''),
            sintomatologia:    String(h.sintomatologia ?? ''),
            diagnostico:       String(h.diagnostico ?? ''),
            tratamiento:       String(h.tratamiento ?? ''),
            historia_ocular:   String(h.historia_ocular ?? ''),
            historial_familiar: String(h.historial_familiar ?? ''),
            comentarios:       String(h.comentarios ?? ''),
            antecedentes:      Array.isArray(h.antecedentes) ? h.antecedentes : [],
          })
        }
      } catch { /* keep sample */ }

      try {
        const { data: p } = await supabase
          .from('pedidos')
          .select('id, numero, created_at, total, estado')
          .eq('cliente_id', id)
          .order('created_at', { ascending: false })
        if (p && p.length > 0) {
          setPedidos(p.map((x: Record<string, unknown>) => ({
            id:        String(x.id),
            numero:    String(x.numero ?? '#—'),
            fecha:     String(x.created_at ?? '').slice(0, 10),
            productos: '—',
            total:     Number(x.total ?? 0),
            estado:    String(x.estado ?? 'pendiente') as Pedido['estado'],
          })))
        }
      } catch { /* keep sample */ }
    }
    load()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save datos ────────────────────────────────────────────────────────────

  async function saveDatos() {
    setSavingDatos(true)
    try {
      await supabase.from('clientes_tienda').update({
        nombre:    `${cliente.nombre} ${cliente.apellidos}`.trim(),
        dni:       cliente.dni || null,
        telefono:  cliente.telefono || null,
        email:     cliente.email,
        ciudad:    cliente.ciudad || null,
        direccion: cliente.direccion || null,
      }).eq('id', id)
      setSavedDatos(true)
      setTimeout(() => setSavedDatos(false), 2500)
    } finally {
      setSavingDatos(false)
    }
  }

  // ── Save historia ─────────────────────────────────────────────────────────

  async function saveHistoria() {
    setSavingHistoria(true)
    try {
      const row = {
        cliente_id:          id,
        doctor:              historia.doctor,
        texto_libre:         historia.texto_libre,
        fecha:               historia.fecha || null,
        tipo_prescripcion:   historia.tipo_prescripcion,
        lejos_od_esferico:   historia.lejos_od.esferico,
        lejos_od_cilindro:   historia.lejos_od.cilindro,
        lejos_od_eje:        historia.lejos_od.eje,
        lejos_od_av:         historia.lejos_od.av,
        lejos_od_dip:        historia.lejos_od.dip,
        lejos_od_altura:     historia.lejos_od.altura,
        lejos_od_adicion:    historia.lejos_od.adicion,
        lejos_oi_esferico:   historia.lejos_oi.esferico,
        lejos_oi_cilindro:   historia.lejos_oi.cilindro,
        lejos_oi_eje:        historia.lejos_oi.eje,
        lejos_oi_av:         historia.lejos_oi.av,
        lejos_oi_dip:        historia.lejos_oi.dip,
        lejos_oi_altura:     historia.lejos_oi.altura,
        lejos_oi_adicion:    historia.lejos_oi.adicion,
        cerca_od_esferico:   historia.cerca_od.esferico,
        cerca_od_cilindro:   historia.cerca_od.cilindro,
        cerca_od_eje:        historia.cerca_od.eje,
        cerca_od_av:         historia.cerca_od.av,
        cerca_od_dip:        historia.cerca_od.dip,
        cerca_od_altura:     historia.cerca_od.altura,
        cerca_oi_esferico:   historia.cerca_oi.esferico,
        cerca_oi_cilindro:   historia.cerca_oi.cilindro,
        cerca_oi_eje:        historia.cerca_oi.eje,
        cerca_oi_av:         historia.cerca_oi.av,
        cerca_oi_dip:        historia.cerca_oi.dip,
        cerca_oi_altura:     historia.cerca_oi.altura,
        inter_od_esferico:   historia.inter_od.esferico,
        inter_od_cilindro:   historia.inter_od.cilindro,
        inter_od_eje:        historia.inter_od.eje,
        inter_od_av:         historia.inter_od.av,
        inter_od_dip:        historia.inter_od.dip,
        inter_od_altura:     historia.inter_od.altura,
        inter_oi_esferico:   historia.inter_oi.esferico,
        inter_oi_cilindro:   historia.inter_oi.cilindro,
        inter_oi_eje:        historia.inter_oi.eje,
        inter_oi_av:         historia.inter_oi.av,
        inter_oi_dip:        historia.inter_oi.dip,
        inter_oi_altura:     historia.inter_oi.altura,
        razon_consulta:      historia.razon_consulta,
        sintomatologia:      historia.sintomatologia,
        diagnostico:         historia.diagnostico,
        tratamiento:         historia.tratamiento,
        historia_ocular:     historia.historia_ocular,
        historial_familiar:  historia.historial_familiar,
        comentarios:         historia.comentarios,
        antecedentes:        historia.antecedentes,
        updated_at:          new Date().toISOString(),
      }
      await supabase.from('historias_clinicas').upsert(row, { onConflict: 'cliente_id' })
      setSavedHistoria(true)
      setTimeout(() => setSavedHistoria(false), 2500)
    } finally {
      setSavingHistoria(false)
    }
  }

  // ── Vision helpers ────────────────────────────────────────────────────────

  function setVisionField(
    section: 'lejos' | 'cerca' | 'inter',
    eye: 'od' | 'oi',
    field: keyof VisionRow,
    val: string
  ) {
    const key = `${section}_${eye}` as keyof Historia
    setHistoria((h) => ({
      ...h,
      [key]: { ...(h[key] as VisionRow), [field]: val },
    }))
  }

  function toggleAntecedente(a: string) {
    setHistoria((h) => ({
      ...h,
      antecedentes: h.antecedentes.includes(a)
        ? h.antecedentes.filter((x) => x !== a)
        : [...h.antecedentes, a],
    }))
  }

  function setH(field: keyof Historia) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setHistoria((h) => ({ ...h, [field]: e.target.value }))
  }

  const fullName = `${cliente.nombre} ${cliente.apellidos}`.trim()

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#1e2540]">
        <Link href="/clientes" className="flex items-center gap-1.5 text-sm text-[#5a6a8a] hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Clientes
        </Link>
        <span className="text-[#2a3050]">/</span>
        <span className="text-sm text-white font-medium">{fullName || 'Cargando...'}</span>
      </div>

      {/* Header card */}
      <div className="mx-6 mt-5 rounded-2xl border border-[#1e2540] bg-[#161b2e] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-2xl font-bold text-white shadow-lg shadow-blue-900/30">
            {fullName.charAt(0).toUpperCase() || '?'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{fullName || 'Sin nombre'}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              {cliente.dni && (
                <span className="text-sm text-[#5a6a8a]">DNI: <span className="text-white">{cliente.dni}</span></span>
              )}
              {cliente.telefono && (
                <span className="text-sm text-[#5a6a8a]">Tel: <span className="text-white">{cliente.telefono}</span></span>
              )}
              {cliente.email && (
                <span className="text-sm text-[#5a6a8a]">{cliente.email}</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{cliente.pedidos}</p>
              <p className="text-xs text-[#5a6a8a] mt-0.5">Pedidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                S/ {cliente.total_gastado.toLocaleString('es-PE')}
              </p>
              <p className="text-xs text-[#5a6a8a] mt-0.5">Total compras</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-6 mt-5">
        <div className="flex gap-1 rounded-xl border border-[#1e2540] bg-[#161b2e] p-1 w-fit">
          {([
            { key: 'datos', label: 'Datos', icon: User },
            { key: 'historia', label: 'Historia clínica', icon: Clock },
            { key: 'compras', label: 'Compras', icon: ShoppingBag },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === key ? 'bg-[#1e40af] text-white shadow' : 'text-[#5a6a8a] hover:text-white'}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-6 my-5 space-y-5">

        {/* ── TAB DATOS ──────────────────────────────────────────────────── */}
        {tab === 'datos' && (
          <Section title="Información personal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Nombres</label>
                <input
                  value={cliente.nombre}
                  onChange={(e) => setCliente((c) => ({ ...c, nombre: e.target.value }))}
                  className={inputCls}
                  placeholder="Nombres"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Apellidos</label>
                <input
                  value={cliente.apellidos}
                  onChange={(e) => setCliente((c) => ({ ...c, apellidos: e.target.value }))}
                  className={inputCls}
                  placeholder="Apellidos"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">DNI / Documento</label>
                <input
                  value={cliente.dni}
                  onChange={(e) => setCliente((c) => ({ ...c, dni: e.target.value }))}
                  className={inputCls}
                  placeholder="12345678"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Teléfono</label>
                <input
                  value={cliente.telefono}
                  onChange={(e) => setCliente((c) => ({ ...c, telefono: e.target.value }))}
                  className={inputCls}
                  placeholder="999 999 999"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Email</label>
                <input
                  type="email"
                  value={cliente.email}
                  onChange={(e) => setCliente((c) => ({ ...c, email: e.target.value }))}
                  className={inputCls}
                  placeholder="cliente@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Ciudad</label>
                <input
                  value={cliente.ciudad}
                  onChange={(e) => setCliente((c) => ({ ...c, ciudad: e.target.value }))}
                  className={inputCls}
                  placeholder="Lima"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#5a6a8a] mb-1.5">Dirección</label>
                <input
                  value={cliente.direccion}
                  onChange={(e) => setCliente((c) => ({ ...c, direccion: e.target.value }))}
                  className={inputCls}
                  placeholder="Av. Principal 123, Distrito"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={saveDatos}
                disabled={savingDatos}
                className="flex items-center gap-2 rounded-xl bg-[#1e40af] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1d3a9e] disabled:opacity-60 transition-colors"
              >
                <Save className="h-4 w-4" />
                {savedDatos ? '¡Guardado!' : savingDatos ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </Section>
        )}

        {/* ── TAB HISTORIA ───────────────────────────────────────────────── */}
        {tab === 'historia' && (
          <>
            {/* Información general */}
            <Section title="Información general">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-[#5a6a8a] mb-1.5">Doctor / Optómetra</label>
                  <select
                    value={historia.doctor}
                    onChange={setH('doctor')}
                    className={inputCls}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Dr. García">Dr. García</option>
                    <option value="Dra. López">Dra. López</option>
                    <option value="Dr. Ramírez">Dr. Ramírez</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#5a6a8a] mb-1.5">Fecha</label>
                  <input
                    type="date"
                    value={historia.fecha}
                    onChange={setH('fecha')}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#5a6a8a] mb-1.5">Tipo de prescripción</label>
                  <select
                    value={historia.tipo_prescripcion}
                    onChange={setH('tipo_prescripcion')}
                    className={inputCls}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Monofocal">Monofocal</option>
                    <option value="Bifocal">Bifocal</option>
                    <option value="Progresivo">Progresivo</option>
                    <option value="Lentes de contacto">Lentes de contacto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#5a6a8a] mb-2">Texto libre</label>
                  <button
                    onClick={() => setHistoria((h) => ({ ...h, texto_libre: !h.texto_libre }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${historia.texto_libre ? 'bg-[#1e40af]' : 'bg-[#2a3050]'}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${historia.texto_libre ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </Section>

            {/* Tablas de visión */}
            <VisionTable
              title="Visión de Lejos"
              od={historia.lejos_od}
              oi={historia.lejos_oi}
              withAdicion
              onChange={(eye, field, val) => setVisionField('lejos', eye, field, val)}
            />
            <VisionTable
              title="Visión de Cerca"
              od={historia.cerca_od}
              oi={historia.cerca_oi}
              onChange={(eye, field, val) => setVisionField('cerca', eye, field, val)}
            />
            <VisionTable
              title="Visión Intermedia"
              od={historia.inter_od}
              oi={historia.inter_oi}
              onChange={(eye, field, val) => setVisionField('inter', eye, field, val)}
            />

            {/* Historia clínica */}
            <Section title="Historia clínica">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['razon_consulta', 'Razón de la consulta'],
                  ['sintomatologia', 'Sintomatología'],
                  ['diagnostico', 'Diagnóstico'],
                  ['tratamiento', 'Tratamiento'],
                  ['historia_ocular', 'Historia ocular'],
                  ['historial_familiar', 'Historial familiar ocular'],
                ] as [keyof Historia, string][]).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs text-[#5a6a8a] mb-1.5">{label}</label>
                    <textarea
                      value={historia[key] as string}
                      onChange={setH(key)}
                      className={textareaCls}
                      placeholder={label}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#5a6a8a] mb-1.5">Comentarios</label>
                  <textarea
                    value={historia.comentarios}
                    onChange={setH('comentarios')}
                    className={textareaCls}
                    placeholder="Comentarios adicionales..."
                  />
                </div>
              </div>
            </Section>

            {/* Antecedentes */}
            <Section title="Antecedentes">
              <div className="flex flex-wrap gap-2">
                {ANTECEDENTES.map((a) => {
                  const active = historia.antecedentes.includes(a)
                  return (
                    <button
                      key={a}
                      onClick={() => toggleAntecedente(a)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-[#1e40af] bg-[#1e40af]/20 text-[#93c5fd]' : 'border-[#2a3050] text-[#5a6a8a] hover:border-[#3a4a70] hover:text-white'}`}
                    >
                      {a}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* Save button */}
            <div className="flex justify-end pb-6">
              <button
                onClick={saveHistoria}
                disabled={savingHistoria}
                className="flex items-center gap-2 rounded-xl bg-[#1e40af] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1d3a9e] disabled:opacity-60 transition-colors shadow-lg shadow-blue-900/30"
              >
                <Save className="h-4 w-4" />
                {savedHistoria ? '¡Historia guardada!' : savingHistoria ? 'Guardando...' : 'Guardar historia clínica'}
              </button>
            </div>
          </>
        )}

        {/* ── TAB COMPRAS ────────────────────────────────────────────────── */}
        {tab === 'compras' && (
          <div className="rounded-xl border border-[#2a3050] bg-[#161b2e] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#2a3050]">
              <p className="text-xs font-semibold text-[#8a9abf] uppercase tracking-wider">Historial de compras</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3050]">
                    {['Pedido', 'Fecha', 'Productos', 'Total', 'Estado'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5a6a8a]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2540]">
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-[#5a6a8a]">
                        <ShoppingBag className="mx-auto h-8 w-8 mb-2 opacity-40" />
                        <p className="text-sm">Sin compras registradas</p>
                      </td>
                    </tr>
                  ) : pedidos.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1a2035] transition-colors">
                      <td className="px-5 py-3 font-mono text-sm font-medium text-white">{p.numero}</td>
                      <td className="px-5 py-3 text-[#8a9abf]">{p.fecha}</td>
                      <td className="px-5 py-3 text-[#8a9abf]">{p.productos}</td>
                      <td className="px-5 py-3 font-semibold text-white">
                        S/ {p.total.toLocaleString('es-PE')}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_COLORS[p.estado] ?? ''}`}>
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pedidos.length > 0 && (
              <div className="px-5 py-3 border-t border-[#2a3050] flex items-center justify-between">
                <p className="text-xs text-[#5a6a8a]">{pedidos.length} pedidos</p>
                <p className="text-sm font-semibold text-white">
                  Total: S/ {pedidos.reduce((s, p) => s + p.total, 0).toLocaleString('es-PE')}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
