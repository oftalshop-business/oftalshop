'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Eye, Palette, ExternalLink, Globe, Layout, Settings,
  Check, X, ShoppingCart, Star, Zap, Building2, Glasses, Heart,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plantilla {
  id: string
  nombre: string
  descripcion: string
  precio: 'gratis' | 'premium'
  icono: React.ElementType
  color: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANTILLAS: Plantilla[] = [
  {
    id: 'optica-esencial',
    nombre: 'Óptica Esencial',
    descripcion: 'Diseño limpio y minimalista enfocado en conversión.',
    precio: 'gratis',
    icono: Glasses,
    color: 'bg-[#f0fdf9]',
  },
  {
    id: 'clinica-confianza',
    nombre: 'Clínica Confianza',
    descripcion: 'Diseño médico profesional con colores azul y blanco.',
    precio: 'gratis',
    icono: Heart,
    color: 'bg-[#eff6ff]',
  },
  {
    id: 'lensshop',
    nombre: 'LensShop',
    descripcion: 'Ecommerce puro, catálogo prominente, alta conversión.',
    precio: 'gratis',
    icono: ShoppingCart,
    color: 'bg-[#fdf4ff]',
  },
  {
    id: 'visionpro',
    nombre: 'VisionPro',
    descripcion: 'Inspirada en las mejores ópticas del mundo, UX premium.',
    precio: 'premium',
    icono: Star,
    color: 'bg-[#fff7ed]',
  },
  {
    id: 'luxoptic',
    nombre: 'LuxOptic',
    descripcion: 'Estilo Ray-Ban/Oakley — lujo y exclusividad.',
    precio: 'premium',
    icono: Zap,
    color: 'bg-[#1a1a1a]',
  },
  {
    id: 'medcenter-pro',
    nombre: 'MedCenter Pro',
    descripcion: 'Para clínicas grandes, corporativo, confianza máxima.',
    precio: 'premium',
    icono: Building2,
    color: 'bg-[#f0f9ff]',
  },
]

// ─── Payment modal ────────────────────────────────────────────────────────────

function ModalPago({ plantilla, onClose }: { plantilla: Plantilla; onClose: () => void }) {
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
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-medium text-white"
          >
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
          <button onClick={onClose} className="text-[#8a8a8a] hover:text-[#1a1a1a]">
            <X className="h-5 w-5" />
          </button>
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
              <label className="block text-xs text-[#6a6a6a] mb-1.5 capitalize">
                {k === 'nombre' ? 'Nombre completo' : 'Email'}
              </label>
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
            <input
              className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              value={form.card}
              onChange={(e) => setForm((p) => ({ ...p, card: e.target.value }))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#6a6a6a] mb-1.5">Vencimiento</label>
              <input
                className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                value={form.expiry}
                onChange={(e) => setForm((p) => ({ ...p, expiry: e.target.value }))}
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-xs text-[#6a6a6a] mb-1.5">CVV</label>
              <input
                className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                value={form.cvv}
                onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value }))}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={() => setStep('success')}
            className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-semibold text-white hover:bg-[#2a2a2a] transition-colors"
          >
            Pagar S/ 65
          </button>
          <p className="text-center text-xs text-[#8a8a8a] mt-3">Pago seguro · Licencia vitalicia</p>
        </div>
      </div>
    </div>
  )
}

// ─── Plantilla card ───────────────────────────────────────────────────────────

function PlantillaCard({
  plantilla, activa, onUsar, onComprar,
}: {
  plantilla: Plantilla
  activa: boolean
  onUsar: () => void
  onComprar: () => void
}) {
  const Icono = plantilla.icono
  const isPremium = plantilla.precio === 'premium'

  return (
    <div
      className={`rounded-xl border-2 bg-white shadow-sm overflow-hidden transition-all ${
        activa ? 'border-[#2a9d8f]' : 'border-[#e1e1e1] hover:border-[#c9c9c9]'
      }`}
    >
      <div className={`relative h-40 ${plantilla.color} flex items-center justify-center`}>
        <Icono
          className={`h-14 w-14 ${
            plantilla.id === 'luxoptic' ? 'text-white/50' : 'text-[#2a9d8f]/40'
          }`}
        />
        {activa && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#2a9d8f]">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          {isPremium ? (
            <span className="text-xs bg-[#1a1a1a] text-white px-2 py-0.5 rounded-full font-medium">
              Premium
            </span>
          ) : (
            <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">
              Gratis
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]">{plantilla.nombre}</h3>
        <p className="text-xs text-[#6a6a6a] mt-0.5 mb-3">{plantilla.descripcion}</p>
        {activa ? (
          <div className="flex gap-2">
            <span className="flex-1 rounded-lg bg-[#f0fdf9] border border-[#2a9d8f] py-1.5 text-xs font-medium text-[#2a9d8f] text-center">
              Activa
            </span>
            <Link
              href="/tienda/personalizar"
              className="flex-1 rounded-lg bg-[#1a1a1a] py-1.5 text-xs font-medium text-white text-center hover:bg-[#2a2a2a] transition-colors"
            >
              Personalizar
            </Link>
          </div>
        ) : isPremium ? (
          <button
            onClick={onComprar}
            className="w-full rounded-lg bg-[#1a1a1a] py-1.5 text-xs font-semibold text-white hover:bg-[#2a2a2a] transition-colors"
          >
            Comprar S/65
          </button>
        ) : (
          <button
            onClick={onUsar}
            className="w-full rounded-lg border border-[#e1e1e1] py-1.5 text-xs font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
          >
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

  function confirmarNombre() {
    setNombreTema(tempNombre || 'Sin nombre')
    setEditandoNombre(false)
  }

  function usarPlantilla(p: Plantilla) {
    setPlantillaActiva(p.id)
    setNombreTema(p.nombre)
  }

  const gratis = PLANTILLAS.filter((p) => p.precio === 'gratis')
  const premium = PLANTILLAS.filter((p) => p.precio === 'premium')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Tienda online</h1>
        <a
          href="#"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver tienda
        </a>
      </div>

      {/* Tema actual */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#f1f1f1] px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">
            Tema actual
          </span>
        </div>
        <div className="p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-[#2a9d8f] to-[#238a7e] shrink-0 flex items-center justify-center">
              <Glasses className="h-8 w-8 text-white/80" />
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
                  <button onClick={confirmarNombre} className="text-[#2a9d8f] hover:text-[#238a7e]">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditandoNombre(false)} className="text-[#8a8a8a]">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setTempNombre(nombreTema); setEditandoNombre(true) }}
                  className="text-base font-semibold text-[#1a1a1a] hover:text-[#2a9d8f] hover:underline underline-offset-2 transition-colors"
                >
                  {nombreTema}
                </button>
              )}
              <p className="text-xs text-[#8a8a8a] mt-0.5">Publicado · Actualizado hoy</p>
              <span className="mt-1.5 inline-block text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">
                Activo
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/tienda/personalizar"
              className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <Palette className="h-4 w-4" />
              Personalizar
            </Link>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              <Eye className="h-4 w-4" />
              Vista previa
            </button>
            <a
              href="#"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver tienda
            </a>
          </div>
        </div>
        <div className="border-t border-[#f1f1f1] px-6 py-3 flex flex-wrap gap-4">
          <Link
            href="/tienda/dominios"
            className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:text-[#238a7e] font-medium"
          >
            <Globe className="h-4 w-4" />
            Conectar dominio existente
          </Link>
          <button className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]">
            <Layout className="h-4 w-4" />
            Administrar temas
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]">
            <Layout className="h-4 w-4" />
            Ver páginas
          </button>
          <Link
            href="/tienda/preferencias"
            className="flex items-center gap-1.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]"
          >
            <Settings className="h-4 w-4" />
            Editar preferencias
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
            />
          ))}
        </div>
      </div>

      {/* Plantillas premium */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Plantillas premium</h2>
          <span className="text-xs bg-[#fef9c3] text-[#854d0e] px-2 py-0.5 rounded-full font-medium">
            $19 USD / S/65
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {premium.map((p) => (
            <PlantillaCard
              key={p.id}
              plantilla={p}
              activa={plantillaActiva === p.id}
              onUsar={() => usarPlantilla(p)}
              onComprar={() => setModalPago(p)}
            />
          ))}
        </div>
      </div>

      {modalPago && (
        <ModalPago plantilla={modalPago} onClose={() => setModalPago(null)} />
      )}
    </div>
  )
}
