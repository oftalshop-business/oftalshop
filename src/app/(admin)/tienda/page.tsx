'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye, Palette, Globe, FileText, Settings, Link2,
  Check, Lock, X, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import OpticaEsencial from '@/components/templates/OpticaEsencial'
import ClinicaConfianza from '@/components/templates/ClinicaConfianza'
import LensShop from '@/components/templates/LensShop'
import VisionPro from '@/components/templates/VisionPro'
import LuxOptic from '@/components/templates/LuxOptic'
import MedCenterPro from '@/components/templates/MedCenterPro'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plantilla {
  id: string
  nombre: string
  descripcion: string
  precio: 'gratis' | 'premium'
  gradient: string
  accentColor: string
  textColor: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANTILLAS: Plantilla[] = [
  {
    id: 'esencial',
    nombre: 'Óptica Esencial',
    descripcion: 'Ecommerce minimalista, fondo blanco, acentos verdes, alta conversión.',
    precio: 'gratis',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #86efac 100%)',
    accentColor: '#00a651',
    textColor: '#14532d',
  },
  {
    id: 'clinica',
    nombre: 'Clínica Confianza',
    descripcion: 'Clínica oftalmológica profesional, azul médico, tipografía serif.',
    precio: 'gratis',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #93c5fd 100%)',
    accentColor: '#1e40af',
    textColor: '#1e3a8a',
  },
  {
    id: 'lensshop',
    nombre: 'LensShop',
    descripcion: 'Premium oscuro, negro y dorado editorial, lookbook integrado.',
    precio: 'gratis',
    gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 40%, #374151 100%)',
    accentColor: '#c9a84c',
    textColor: '#c9a84c',
  },
  {
    id: 'visionpro',
    nombre: 'VisionPro',
    descripcion: 'UX premium minimalista, blanco puro con azul eléctrico impactante.',
    precio: 'premium',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #0066ff22 100%)',
    accentColor: '#0066ff',
    textColor: '#0066ff',
  },
  {
    id: 'luxoptic',
    nombre: 'LuxOptic',
    descripcion: 'Estilo Ray-Ban/Oakley, negro absoluto con rojo, bold industrial.',
    precio: 'premium',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #2d0a0a 100%)',
    accentColor: '#e63946',
    textColor: '#e63946',
  },
  {
    id: 'medcenter',
    nombre: 'MedCenter Pro',
    descripcion: 'Corporativo institucional, azul profundo, para clínicas grandes.',
    precio: 'premium',
    gradient: 'linear-gradient(135deg, #eaf0fa 0%, #c7d7f0 40%, #7ba7d9 100%)',
    accentColor: '#003366',
    textColor: '#003366',
  },
]

// ─── Template renderer ────────────────────────────────────────────────────────

function renderTemplate(id: string) {
  const props = { nombreTienda: 'OftalShop Demo' }
  switch (id) {
    case 'esencial':     return <OpticaEsencial {...props} />
    case 'clinica':      return <ClinicaConfianza {...props} />
    case 'lensshop':     return <LensShop {...props} />
    case 'visionpro':    return <VisionPro {...props} />
    case 'luxoptic':     return <LuxOptic {...props} />
    case 'medcenter':    return <MedCenterPro {...props} />
    default:             return <OpticaEsencial {...props} />
  }
}

// ─── Modal preview ────────────────────────────────────────────────────────────

function ModalPreview({ plantilla, onClose }: { plantilla: Plantilla; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f1f1] shrink-0">
          <p className="text-sm font-semibold text-[#1a1a1a]">Vista previa — {plantilla.nombre}</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#6a6a6a] hover:bg-[#f1f1f1]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderTemplate(plantilla.id)}
        </div>
      </div>
    </div>
  )
}

// ─── Modal payment ────────────────────────────────────────────────────────────

function ModalPago({ plantilla, onClose, onBuy }: { plantilla: Plantilla; onClose: () => void; onBuy: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fef9c3]">
          <Lock className="h-7 w-7 text-[#854d0e]" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Plantilla Premium</h3>
        <p className="text-sm text-[#6a6a6a] mb-5">
          <strong>{plantilla.nombre}</strong> es una plantilla premium.<br />
          Licencia vitalicia · 1 tienda
        </p>
        <div className="flex items-center justify-between bg-[#fafafa] rounded-xl border border-[#e1e1e1] px-4 py-3 mb-5">
          <span className="text-sm font-semibold">{plantilla.nombre}</span>
          <span className="text-xl font-black">S/ 65</span>
        </div>
        <button onClick={onBuy} className="w-full rounded-lg bg-[#1a1a1a] py-2.5 text-sm font-semibold text-white mb-2">
          Pagar S/ 65
        </button>
        <button onClick={onClose} className="w-full rounded-lg border border-[#e1e1e1] py-2.5 text-sm text-[#6a6a6a]">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TiendaPage() {
  const router = useRouter()
  const [plantillaActiva, setPlantillaActiva] = useState('esencial')
  const [preview, setPreview] = useState<Plantilla | null>(null)
  const [pago, setPago] = useState<Plantilla | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Load active template
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
      if (data?.valor?.plantilla) setPlantillaActiva(data.valor.plantilla as string)
    }
    load()
  }, [])

  async function activarPlantilla(id: string) {
    setSaving(true)
    setSavedId(id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('configuracion_tienda').upsert({
        tenant_id: user.id,
        clave: 'personalizar',
        valor: { plantilla: id },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'tenant_id,clave' })
      setPlantillaActiva(id)
    }
    setSaving(false)
    setTimeout(() => setSavedId(null), 2000)
  }

  function handleComprar() {
    if (!pago) return
    activarPlantilla(pago.id)
    setPago(null)
  }

  const acciones = [
    { icon: Palette, label: 'Personalizar tienda', sub: 'Editor visual', action: () => router.push('/tienda/personalizar') },
    { icon: Eye, label: 'Ver mi tienda', sub: 'Abrir en nueva pestaña', action: () => window.open('/tienda-preview', '_blank') },
    { icon: Settings, label: 'Temas', sub: 'Administrar plantillas', action: () => router.push('/tienda/temas') },
    { icon: FileText, label: 'Páginas', sub: 'Nosotros, Contacto...', action: () => router.push('/tienda/paginas') },
    { icon: Globe, label: 'Preferencias', sub: 'SEO, redes sociales', action: () => router.push('/tienda/preferencias') },
    { icon: Link2, label: 'Dominio', sub: 'Conectar dominio propio', action: () => router.push('/tienda/dominios') },
  ]

  const activaInfo = PLANTILLAS.find(p => p.id === plantillaActiva)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Tienda online</h1>
          {activaInfo && (
            <p className="text-sm text-[#6a6a6a] mt-0.5">Plantilla activa: <span className="font-medium" style={{ color: activaInfo.accentColor }}>{activaInfo.nombre}</span></p>
          )}
        </div>
        <button
          onClick={() => router.push('/tienda/personalizar')}
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Palette className="h-4 w-4" />
          Personalizar tienda
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {acciones.map(({ icon: Icon, label, sub, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex flex-col items-center gap-2 rounded-xl border border-[#e1e1e1] bg-white p-4 text-center hover:border-[#c9c9c9] hover:shadow-sm transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f7f7]">
              <Icon className="h-4 w-4 text-[#4a4a4a]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1a1a1a] leading-tight">{label}</p>
              <p className="text-[10px] text-[#8a8a8a] mt-0.5">{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">Plantillas disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLANTILLAS.map((p) => {
            const isActive = plantillaActiva === p.id
            const isSaving = saving && savedId === p.id

            return (
              <div
                key={p.id}
                className={`rounded-2xl border-2 bg-white overflow-hidden transition-all ${isActive ? 'border-[#2a9d8f] shadow-md' : 'border-[#e1e1e1] hover:border-[#c9c9c9] hover:shadow-sm'}`}
              >
                {/* Preview thumbnail */}
                <div className="relative h-44 overflow-hidden" style={{ background: p.gradient }}>
                  {/* Mock browser chrome */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black/10 backdrop-blur-sm flex items-center px-3 gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-white/40" />
                    <div className="h-2 w-2 rounded-full bg-white/40" />
                    <div className="h-2 w-2 rounded-full bg-white/40" />
                  </div>
                  {/* Mock navbar */}
                  <div className="absolute top-6 left-0 right-0 h-8 flex items-center px-4 justify-between" style={{ backgroundColor: p.accentColor + 'cc' }}>
                    <div className="h-3 w-12 rounded bg-white/30" />
                    <div className="flex gap-1.5">
                      <div className="h-2 w-8 rounded bg-white/20" />
                      <div className="h-2 w-8 rounded bg-white/20" />
                      <div className="h-2 w-8 rounded bg-white/20" />
                    </div>
                    <div className="h-4 w-14 rounded bg-white/30" />
                  </div>
                  {/* Mock hero */}
                  <div className="absolute top-14 left-0 right-0 bottom-0 flex flex-col items-center justify-center gap-2 px-4">
                    <div className="h-4 w-32 rounded-full" style={{ backgroundColor: p.accentColor + '60' }} />
                    <div className="h-2.5 w-24 rounded-full" style={{ backgroundColor: p.accentColor + '40' }} />
                    <div className="h-6 w-20 rounded-lg mt-1" style={{ backgroundColor: p.accentColor + '80' }} />
                  </div>
                  {/* Active badge */}
                  {isActive && (
                    <div className="absolute top-8 right-2 flex items-center gap-1 bg-[#2a9d8f] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <Check className="h-2.5 w-2.5" /> Activa
                    </div>
                  )}
                  {p.precio === 'premium' && !isActive && (
                    <div className="absolute top-8 right-2 flex items-center gap-1 bg-[#1a1a1a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> S/65
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-[#1a1a1a]">{p.nombre}</h3>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.precio === 'gratis' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef9c3] text-[#854d0e]'}`}>
                      {p.precio === 'gratis' ? 'Gratis' : 'S/ 65'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6a6a6a] mb-4 line-clamp-2">{p.descripcion}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreview(p)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#4a4a4a] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <Eye className="h-3 w-3" /> Previsualizar
                    </button>
                    {isActive ? (
                      <button
                        onClick={() => router.push('/tienda/personalizar')}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2a9d8f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#239085] transition-colors"
                      >
                        <Palette className="h-3 w-3" /> Personalizar
                      </button>
                    ) : p.precio === 'gratis' ? (
                      <button
                        onClick={() => activarPlantilla(p.id)}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2a2a2a] disabled:opacity-60 transition-colors"
                      >
                        {isSaving ? '✓ Activado' : <><Check className="h-3 w-3" /> Activar</>}
                      </button>
                    ) : (
                      <button
                        onClick={() => setPago(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#854d0e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#713f12] transition-colors"
                      >
                        <Lock className="h-3 w-3" /> Comprar S/65
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      {preview && <ModalPreview plantilla={preview} onClose={() => setPreview(null)} />}
      {pago && <ModalPago plantilla={pago} onClose={() => setPago(null)} onBuy={handleComprar} />}
    </div>
  )
}
