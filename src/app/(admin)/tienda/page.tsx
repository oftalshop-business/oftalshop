'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Eye, Palette, ExternalLink, Globe, Layout, Settings,
  Check, X, Lock, FileText,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plantilla {
  id: string
  nombre: string
  descripcion: string
  precio: 'gratis' | 'premium'
  color: string
  accent: string
  headerBg: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANTILLAS: Plantilla[] = [
  {
    id: 'optica-esencial',
    nombre: 'Óptica Esencial',
    descripcion: 'Ecommerce tradicional minimalista, fondo blanco, acentos verdes #00a651, alta conversión.',
    precio: 'gratis',
    color: '#f0fdf4',
    accent: '#00a651',
    headerBg: '#00a651',
  },
  {
    id: 'clinica-confianza',
    nombre: 'Clínica Confianza',
    descripcion: 'Clínica oftalmológica profesional, azul médico #1e40af, tipografía serif, máxima confianza.',
    precio: 'gratis',
    color: '#eff6ff',
    accent: '#1e40af',
    headerBg: '#1e40af',
  },
  {
    id: 'lensshop',
    nombre: 'LensShop',
    descripcion: 'Ecommerce premium oscuro, negro y dorado #c9a84c, lookbook editorial, scroll horizontal.',
    precio: 'gratis',
    color: '#111',
    accent: '#c9a84c',
    headerBg: '#0a0a0a',
  },
  {
    id: 'visionpro',
    nombre: 'VisionPro',
    descripcion: 'UX premium minimalista, blanco puro con azul eléctrico #0066ff, tipografía display impactante.',
    precio: 'premium',
    color: '#f8f8f8',
    accent: '#0066ff',
    headerBg: '#ffffff',
  },
  {
    id: 'luxoptic',
    nombre: 'LuxOptic',
    descripcion: 'Estilo Ray-Ban/Oakley, negro absoluto con rojo #e63946, bold industrial, totalmente oscuro.',
    precio: 'premium',
    color: '#000',
    accent: '#e63946',
    headerBg: '#000000',
  },
  {
    id: 'medcenter-pro',
    nombre: 'MedCenter Pro',
    descripcion: 'Corporativo institucional, azul #003366, mega menú, estadísticas, ideal para clínicas grandes.',
    precio: 'premium',
    color: '#eaf0fa',
    accent: '#003366',
    headerBg: '#003366',
  },
]

// ─── Payment modal ────────────────────────────────────────────────────────────

function ModalPago({ plantilla, onClose, onSuccess }: { plantilla: Plantilla; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [form, setForm] = useState({ nombre: '', email: '', card: '', expiry: '', cvv: '' })

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7]">
            <Check className="h-7 w-7 text-[#166534]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">¡Pago exitoso!</h3>
          <p className="text-sm text-[#6a6a6a] mb-6">
            La plantilla <strong>{plantilla.nombre}</strong> ha sido activada.
          </p>
          <button onClick={onSuccess} className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-medium text-white">
            Continuar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f1f1]">
          <h3 className="text-base font-semibold text-[#1a1a1a]">Comprar {plantilla.nombre}</h3>
          <button onClick={onClose} className="text-[#8a8a8a] hover:text-[#1a1a1a]"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl bg-[#fafafa] border border-[#e1e1e1] p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{plantilla.nombre}</p>
              <p className="text-xs text-[#6a6a6a]">Licencia vitalicia · 1 tienda</p>
            </div>
            <p className="text-lg font-bold text-[#1a1a1a]">S/ 65</p>
          </div>
          {(['nombre', 'email'] as const).map((k) => (
            <div key={k}>
              <label className="block text-xs text-[#6a6a6a] mb-1.5">{k === 'nombre' ? 'Nombre completo' : 'Email'}</label>
              <input
                className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                type={k === 'email' ? 'email' : 'text'}
                value={form[k]}
                onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                placeholder={k === 'nombre' ? 'Ana García' : 'ana@correo.com'}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-[#6a6a6a] mb-1.5">Número de tarjeta</label>
            <input className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]" value={form.card} onChange={(e) => setForm((p) => ({ ...p, card: e.target.value }))} placeholder="4242 4242 4242 4242" maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#6a6a6a] mb-1.5">Vencimiento</label>
              <input className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none" value={form.expiry} onChange={(e) => setForm((p) => ({ ...p, expiry: e.target.value }))} placeholder="MM/AA" maxLength={5} />
            </div>
            <div>
              <label className="block text-xs text-[#6a6a6a] mb-1.5">CVV</label>
              <input className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none" value={form.cvv} onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value }))} placeholder="123" maxLength={4} />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button onClick={() => setStep('success')} className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-semibold text-white hover:bg-[#2a2a2a]">
            Pagar S/ 65
          </button>
          <p className="text-center text-xs text-[#8a8a8a] mt-3">Pago seguro · Licencia vitalicia</p>
        </div>
      </div>
    </div>
  )
}

// ─── Vista previa modal ───────────────────────────────────────────────────────

function ModalPreview({ plantilla, onClose }: { plantilla: Plantilla; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f1f1]">
          <p className="text-sm font-semibold text-[#1a1a1a]">Vista previa — {plantilla.nombre}</p>
          <button onClick={onClose} className="text-[#8a8a8a] hover:text-[#1a1a1a]"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: plantilla.color }}>
          {/* Mini-preview of the template */}
          <div className="h-full flex flex-col">
            <div className="h-10 flex items-center px-4 gap-3" style={{ backgroundColor: plantilla.headerBg }}>
              <div className="h-4 w-16 rounded" style={{ backgroundColor: plantilla.accent + 'aa' }} />
              <div className="h-2 w-8 rounded bg-white/20" />
              <div className="h-2 w-8 rounded bg-white/20" />
              <div className="h-2 w-8 rounded bg-white/20" />
              <div className="ml-auto h-5 w-16 rounded-full" style={{ backgroundColor: plantilla.accent }} />
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: plantilla.accent + '22' }}>
                <div className="p-8 text-center space-y-2">
                  <div className="h-6 w-32 rounded mx-auto" style={{ backgroundColor: plantilla.accent }} />
                  <div className="h-3 w-48 rounded mx-auto bg-[#1a1a1a]/15" />
                  <div className="h-3 w-40 rounded mx-auto bg-[#1a1a1a]/10" />
                  <div className="h-8 w-28 rounded-full mx-auto mt-3" style={{ backgroundColor: plantilla.accent }} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="rounded-lg overflow-hidden border border-[#e1e1e1] bg-white">
                    <div className="h-14" style={{ backgroundColor: plantilla.accent + '18' }} />
                    <div className="p-2 space-y-1">
                      <div className="h-2 rounded bg-[#1a1a1a]/10" />
                      <div className="h-2 rounded w-2/3" style={{ backgroundColor: plantilla.accent + '60' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Plantilla thumbnail ──────────────────────────────────────────────────────

function PlantillaThumbnail({ plantilla }: { plantilla: Plantilla }) {
  return (
    <div className="h-44 w-full overflow-hidden flex flex-col" style={{ backgroundColor: plantilla.color }}>
      {/* Header */}
      <div className="h-8 flex items-center px-3 gap-2 shrink-0" style={{ backgroundColor: plantilla.headerBg }}>
        <div className="h-3 w-10 rounded-sm" style={{ backgroundColor: plantilla.accent + 'cc' }} />
        <div className="h-1.5 w-5 rounded bg-white/20" />
        <div className="h-1.5 w-5 rounded bg-white/20" />
        <div className="h-1.5 w-5 rounded bg-white/20" />
        <div className="ml-auto h-4 w-10 rounded-full" style={{ backgroundColor: plantilla.accent }} />
      </div>
      {/* Hero */}
      <div className="px-3 py-3 flex-1" style={{ backgroundColor: plantilla.accent + '22' }}>
        <div className="h-3 w-20 rounded mb-1" style={{ backgroundColor: plantilla.accent }} />
        <div className="h-2 w-28 rounded mb-1 bg-[#1a1a1a]/15" />
        <div className="h-2 w-20 rounded mb-3 bg-[#1a1a1a]/10" />
        <div className="h-5 w-14 rounded-full" style={{ backgroundColor: plantilla.accent }} />
      </div>
      {/* Products grid */}
      <div className="flex gap-1 px-3 pb-2 mt-1 shrink-0">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 rounded overflow-hidden border border-black/5 bg-white/70">
            <div className="h-6" style={{ backgroundColor: plantilla.accent + '20' }} />
            <div className="p-1 space-y-0.5">
              <div className="h-1 rounded bg-[#1a1a1a]/10 w-full" />
              <div className="h-1 rounded w-2/3" style={{ backgroundColor: plantilla.accent + '60' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Plantilla card ───────────────────────────────────────────────────────────

function PlantillaCard({
  plantilla, activa, onUsar, onComprar, onPreview,
}: {
  plantilla: Plantilla
  activa: boolean
  onUsar: () => void
  onComprar: () => void
  onPreview: () => void
}) {
  const isPremium = plantilla.precio === 'premium'

  return (
    <div className={`rounded-xl border-2 bg-white shadow-sm overflow-hidden transition-all ${activa ? 'border-[#2a9d8f]' : 'border-[#e1e1e1] hover:border-[#c9c9c9]'}`}>
      <div className="relative">
        <PlantillaThumbnail plantilla={plantilla} />
        {activa && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#2a9d8f]">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {isPremium ? (
            <span className="flex items-center gap-1 text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5 rounded-full font-medium">
              <Lock className="h-2.5 w-2.5" /> Premium
            </span>
          ) : (
            <span className="text-[10px] bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">
              Gratis
            </span>
          )}
        </div>
        <button
          onClick={onPreview}
          className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full hover:bg-black/80 transition-colors"
        >
          <Eye className="h-3 w-3" /> Preview
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]">{plantilla.nombre}</h3>
        <p className="text-xs text-[#6a6a6a] mt-0.5 mb-3 line-clamp-2">{plantilla.descripcion}</p>
        {activa ? (
          <div className="flex gap-2">
            <span className="flex-1 rounded-lg bg-[#f0fdf9] border border-[#2a9d8f] py-1.5 text-xs font-medium text-[#2a9d8f] text-center">Activa</span>
            <Link href="/tienda/personalizar" className="flex-1 rounded-lg bg-[#1a1a1a] py-1.5 text-xs font-medium text-white text-center hover:bg-[#2a2a2a] transition-colors">
              Personalizar
            </Link>
          </div>
        ) : isPremium ? (
          <button onClick={onComprar} className="w-full rounded-lg bg-[#1a1a1a] py-1.5 text-xs font-semibold text-white hover:bg-[#2a2a2a] transition-colors">
            Comprar S/65
          </button>
        ) : (
          <button onClick={onUsar} className="w-full rounded-lg border border-[#e1e1e1] py-1.5 text-xs font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
            Usar plantilla
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TiendaPage() {
  const [nombreTema, setNombreTema] = useState('Óptica Esencial')
  const [editandoNombre, setEditandoNombre] = useState(false)
  const [tempNombre, setTempNombre] = useState(nombreTema)
  const [plantillaActiva, setPlantillaActiva] = useState('optica-esencial')
  const [modalPago, setModalPago] = useState<Plantilla | null>(null)
  const [modalPreview, setModalPreview] = useState<Plantilla | null>(null)

  function confirmarNombre() {
    setNombreTema(tempNombre || 'Sin nombre')
    setEditandoNombre(false)
  }

  function usarPlantilla(p: Plantilla) {
    setPlantillaActiva(p.id)
    setNombreTema(p.nombre)
  }

  const activaData = PLANTILLAS.find(p => p.id === plantillaActiva)!
  const gratis = PLANTILLAS.filter((p) => p.precio === 'gratis')
  const premium = PLANTILLAS.filter((p) => p.precio === 'premium')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Tienda online</h1>
        <a href="#" target="_blank" className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
          <ExternalLink className="h-4 w-4" />
          Ver tienda
        </a>
      </div>

      {/* Tema actual */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#f1f1f1] px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">Tema actual</span>
        </div>
        <div className="p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Live thumbnail */}
            <div className="h-20 w-32 rounded-lg overflow-hidden shrink-0 border border-[#f1f1f1]" style={{ backgroundColor: activaData.color }}>
              <div className="h-5 w-full" style={{ backgroundColor: activaData.headerBg }} />
              <div className="p-1.5 space-y-1">
                <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: activaData.accent + '80' }} />
                <div className="h-1 rounded-full w-1/2 bg-[#1a1a1a]/10" />
              </div>
            </div>
            <div>
              {editandoNombre ? (
                <div className="flex items-center gap-2">
                  <input
                    className="rounded-lg border border-[#2a9d8f] px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                    value={tempNombre}
                    onChange={(e) => setTempNombre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirmarNombre()}
                    autoFocus
                  />
                  <button onClick={confirmarNombre} className="text-[#2a9d8f]"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditandoNombre(false)} className="text-[#8a8a8a]"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button onClick={() => { setTempNombre(nombreTema); setEditandoNombre(true) }} className="text-base font-semibold text-[#1a1a1a] hover:text-[#2a9d8f] hover:underline underline-offset-2 transition-colors">
                  {nombreTema}
                </button>
              )}
              <p className="text-xs text-[#8a8a8a] mt-0.5">Publicado · Actualizado hoy</p>
              <span className="mt-1.5 inline-block text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">Activo</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link href="/tienda/personalizar" className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors">
              <Palette className="h-4 w-4" />
              Personalizar
            </Link>
            <button onClick={() => setModalPreview(activaData)} className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              <Eye className="h-4 w-4" />
              Vista previa
            </button>
            <a href="/preview/optica-esencial" target="_blank" className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              <ExternalLink className="h-4 w-4" />
              Ver tienda
            </a>
          </div>
        </div>
        <div className="border-t border-[#f1f1f1] px-6 py-3 flex flex-wrap gap-4">
          <Link href="/tienda/dominios" className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:text-[#238a7e] font-medium">
            <Globe className="h-4 w-4" /> Conectar dominio existente
          </Link>
          <Link href="/tienda/temas" className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]">
            <Layout className="h-4 w-4" /> Administrar temas
          </Link>
          <Link href="/tienda/paginas" className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]">
            <FileText className="h-4 w-4" /> Ver páginas
          </Link>
          <Link href="/tienda/preferencias" className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]">
            <Settings className="h-4 w-4" /> Editar preferencias
          </Link>
        </div>
      </div>

      {/* Plantillas gratis */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Plantillas gratuitas</h2>
          <span className="text-xs text-[#8a8a8a]">3 plantillas</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gratis.map((p) => (
            <PlantillaCard
              key={p.id}
              plantilla={p}
              activa={plantillaActiva === p.id}
              onUsar={() => usarPlantilla(p)}
              onComprar={() => {}}
              onPreview={() => setModalPreview(p)}
            />
          ))}
        </div>
      </div>

      {/* Plantillas premium */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Plantillas premium</h2>
          <span className="text-xs bg-[#fef9c3] text-[#854d0e] px-2 py-0.5 rounded-full font-medium">$19 USD / S/65</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {premium.map((p) => (
            <PlantillaCard
              key={p.id}
              plantilla={p}
              activa={plantillaActiva === p.id}
              onUsar={() => usarPlantilla(p)}
              onComprar={() => setModalPago(p)}
              onPreview={() => setModalPreview(p)}
            />
          ))}
        </div>
      </div>

      {modalPago && (
        <ModalPago
          plantilla={modalPago}
          onClose={() => setModalPago(null)}
          onSuccess={() => { usarPlantilla(modalPago); setModalPago(null) }}
        />
      )}
      {modalPreview && (
        <ModalPreview plantilla={modalPreview} onClose={() => setModalPreview(null)} />
      )}
    </div>
  )
}
