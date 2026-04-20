'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Trash2, Eye, ChevronLeft, Lock, Download } from 'lucide-react'

interface Tema {
  id: string
  nombre: string
  descripcion: string
  precio: 'gratis' | 'premium'
  activo: boolean
  instalado: boolean
  color: string
  accent: string
}

const TEMAS: Tema[] = [
  {
    id: 'optica-esencial',
    nombre: 'Óptica Esencial',
    descripcion: 'Ecommerce tradicional minimalista. Fondo blanco, acentos verdes, alta conversión.',
    precio: 'gratis',
    activo: true,
    instalado: true,
    color: '#f0fdf4',
    accent: '#00a651',
  },
  {
    id: 'clinica-confianza',
    nombre: 'Clínica Confianza',
    descripcion: 'Clínica oftalmológica profesional. Azul médico, tipografía serif, máxima confianza.',
    precio: 'gratis',
    activo: false,
    instalado: true,
    color: '#eff6ff',
    accent: '#1e40af',
  },
  {
    id: 'lensshop',
    nombre: 'LensShop',
    descripcion: 'Ecommerce premium oscuro. Negro y dorado, estilo editorial, lookbook integrado.',
    precio: 'gratis',
    activo: false,
    instalado: false,
    color: '#0a0a0a',
    accent: '#c9a84c',
  },
  {
    id: 'visionpro',
    nombre: 'VisionPro',
    descripcion: 'UX premium minimalista. Blanco/negro/azul eléctrico, tipografía impactante.',
    precio: 'premium',
    activo: false,
    instalado: false,
    color: '#f8f8f8',
    accent: '#0066ff',
  },
  {
    id: 'luxoptic',
    nombre: 'LuxOptic',
    descripcion: 'Estilo atlético agresivo. Negro absoluto y rojo, inspirado en Ray-Ban/Oakley.',
    precio: 'premium',
    activo: false,
    instalado: false,
    color: '#000000',
    accent: '#e63946',
  },
  {
    id: 'medcenter-pro',
    nombre: 'MedCenter Pro',
    descripcion: 'Corporativo institucional. Azul #003366, mega menú, para clínicas grandes.',
    precio: 'premium',
    activo: false,
    instalado: false,
    color: '#eaf0fa',
    accent: '#003366',
  },
]

function ModalPago({ nombre, onClose, onComprar }: { nombre: string; onClose: () => void; onComprar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Comprar {nombre}</h3>
        <p className="text-xs text-[#6a6a6a] mb-4">Licencia vitalicia · 1 tienda · Soporte incluido</p>
        <div className="flex items-center justify-between bg-[#fafafa] rounded-xl border border-[#e1e1e1] p-4 mb-5">
          <span className="text-sm font-semibold text-[#1a1a1a]">{nombre}</span>
          <span className="text-lg font-black text-[#1a1a1a]">S/ 65</span>
        </div>
        <button
          onClick={onComprar}
          className="w-full rounded-lg bg-[#1a1a1a] py-3 text-sm font-semibold text-white hover:bg-[#2a2a2a] mb-2"
        >
          Pagar S/ 65
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-[#e1e1e1] py-3 text-sm text-[#6a6a6a] hover:bg-[#f7f7f7]"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function TemasPage() {
  const [temas, setTemas] = useState(TEMAS)
  const [modalPago, setModalPago] = useState<Tema | null>(null)
  const [previewTema, setPreviewTema] = useState<Tema | null>(null)

  function activarTema(id: string) {
    setTemas(prev => prev.map(t => ({ ...t, activo: t.id === id })))
  }

  function eliminarTema(id: string) {
    setTemas(prev => prev.map(t => t.id === id ? { ...t, instalado: false } : t))
  }

  function instalarTema(tema: Tema) {
    if (tema.precio === 'premium') {
      setModalPago(tema)
    } else {
      setTemas(prev => prev.map(t => t.id === tema.id ? { ...t, instalado: true } : t))
    }
  }

  function comprarYInstalar() {
    if (!modalPago) return
    setTemas(prev => prev.map(t => t.id === modalPago.id ? { ...t, instalado: true } : t))
    setModalPago(null)
  }

  const instalados = temas.filter(t => t.instalado)
  const biblioteca = temas.filter(t => !t.instalado)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/tienda" className="flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#1a1a1a]">
          <ChevronLeft className="h-4 w-4" />
          Tienda online
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Administrar temas</h1>
      </div>

      {/* Temas instalados */}
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Temas instalados</h2>
        <div className="space-y-3">
          {instalados.map(t => (
            <div
              key={t.id}
              className={`rounded-xl border-2 bg-white shadow-sm overflow-hidden ${t.activo ? 'border-[#2a9d8f]' : 'border-[#e1e1e1]'}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Mini preview */}
                <div
                  className="h-16 w-24 shrink-0 rounded-lg flex flex-col overflow-hidden border border-[#f1f1f1]"
                  style={{ backgroundColor: t.color }}
                >
                  <div className="h-4" style={{ backgroundColor: t.accent }} />
                  <div className="flex-1 p-1 space-y-1">
                    <div className="h-1.5 rounded-full w-3/4 bg-[#1a1a1a]/15" />
                    <div className="h-1 rounded-full w-1/2 bg-[#1a1a1a]/10" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1a1a1a]">{t.nombre}</p>
                    {t.activo && (
                      <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">
                        Activo
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.precio === 'gratis' ? 'bg-[#f1f1f1] text-[#6a6a6a]' : 'bg-[#fef9c3] text-[#854d0e]'}`}>
                      {t.precio === 'gratis' ? 'Gratis' : 'Premium'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6a6a6a] mt-0.5 line-clamp-1">{t.descripcion}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!t.activo && (
                    <button
                      onClick={() => activarTema(t.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white font-medium"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Activar
                    </button>
                  )}
                  <Link
                    href="/tienda/personalizar"
                    className="rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7]"
                  >
                    Personalizar
                  </Link>
                  <button
                    onClick={() => setPreviewTema(t)}
                    className="rounded-lg border border-[#e1e1e1] p-1.5 text-[#6a6a6a] hover:bg-[#f7f7f7]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  {!t.activo && (
                    <button
                      onClick={() => eliminarTema(t.id)}
                      className="rounded-lg border border-[#fecaca] p-1.5 text-[#ef4444] hover:bg-[#fff5f5]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biblioteca */}
      {biblioteca.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Explorar biblioteca</h2>
          <div className="grid grid-cols-3 gap-4">
            {biblioteca.map(t => (
              <div key={t.id} className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
                {/* Preview */}
                <div className="relative h-32" style={{ backgroundColor: t.color }}>
                  <div className="h-7 w-full" style={{ backgroundColor: t.accent }} />
                  <div className="p-3 space-y-1.5">
                    <div className="h-2 rounded-full w-3/4 bg-[#1a1a1a]/10" />
                    <div className="h-1.5 rounded-full w-1/2 bg-[#1a1a1a]/8" />
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: t.accent + '22' }} />
                      ))}
                    </div>
                  </div>
                  {t.precio === 'premium' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1a1a1a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> Premium
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">{t.nombre}</h3>
                  <p className="text-xs text-[#6a6a6a] mt-0.5 mb-3 line-clamp-2">{t.descripcion}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => instalarTema(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#1a1a1a] py-1.5 text-xs font-medium text-white hover:bg-[#2a2a2a]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t.precio === 'gratis' ? 'Instalar gratis' : 'Comprar S/65'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalPago && (
        <ModalPago
          nombre={modalPago.nombre}
          onClose={() => setModalPago(null)}
          onComprar={comprarYInstalar}
        />
      )}

      {previewTema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f1f1]">
              <p className="text-sm font-semibold text-[#1a1a1a]">Vista previa — {previewTema.nombre}</p>
              <button onClick={() => setPreviewTema(null)} className="text-[#8a8a8a] hover:text-[#1a1a1a] text-lg leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[#f1f1f1]">
              <div
                className="w-full h-64 rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: previewTema.color }}
              >
                <div className="h-10 w-full flex items-center px-4 gap-3" style={{ backgroundColor: previewTema.accent }}>
                  <div className="h-4 w-16 bg-white/40 rounded" />
                  <div className="h-2 w-8 bg-white/30 rounded" />
                  <div className="h-2 w-8 bg-white/30 rounded" />
                  <div className="h-2 w-8 bg-white/30 rounded" />
                </div>
                <div className="p-6 text-center">
                  <div className="h-6 w-32 mx-auto mb-2 rounded" style={{ backgroundColor: previewTema.accent + '40' }} />
                  <div className="h-3 w-48 mx-auto rounded bg-[#1a1a1a]/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
