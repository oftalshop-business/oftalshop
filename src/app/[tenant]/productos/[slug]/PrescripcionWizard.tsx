'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, ShoppingCart, Upload } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Material { nombre: string; descripcion?: string; precio_extra?: number }
interface Tratamiento { nombre: string; descripcion?: string; precio_extra?: number }

interface PrescripcionRow { esferico: string; cilindro: string; eje: string; add: string; dip: string }

interface Seleccion {
  tipoUso: string
  tipoVision: string
  material: Material | null
  tratamiento: Tratamiento | null
  prescripcion: { od: PrescripcionRow; oi: PrescripcionRow }
  usaFoto: boolean
  fotoUrl: string
}

interface Props {
  precioBase: number
  materiales: Material[]
  tratamientos: Tratamiento[]
  productoId: string
  nombre: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIPOS_USO = [
  { id: 'sin-lentes', label: 'Solo armazón', desc: 'Sin lentes incluidos', emoji: '🕶️' },
  { id: 'sin-medida', label: 'Lentes sin medida', desc: 'Lentes planos / 0.00', emoji: '👓' },
  { id: 'con-medida', label: 'Lentes con medida', desc: 'Con prescripción óptica', emoji: '🔬' },
  { id: 'sol', label: 'Lentes de sol', desc: 'Polarizados UV400', emoji: '😎' },
]

const TIPOS_VISION = [
  { id: 'simple', label: 'Visión simple', desc: 'Para lejos o para cerca' },
  { id: 'bifocal', label: 'Bifocal', desc: 'Dos zonas de corrección' },
  { id: 'progresivo', label: 'Progresivo', desc: 'Sin línea visible, todas las distancias' },
  { id: 'lectura', label: 'Solo lectura', desc: 'Para actividades de cerca' },
]

const EMPTY_ROW: PrescripcionRow = { esferico: '', cilindro: '', eje: '', add: '', dip: '' }

const STEPS_CON_MEDIDA = ['Tipo de uso', 'Tipo de visión', 'Material', 'Tratamiento', 'Prescripción', 'Resumen']
const STEPS_SIN_MEDIDA = ['Tipo de uso', 'Material', 'Tratamiento', 'Resumen']

const inputCls = 'w-full rounded border border-[#e1e1e1] bg-white px-2 py-1.5 text-sm text-[#1a1a1a] text-center outline-none focus:border-[#2a9d8f] focus:ring-1 focus:ring-[#2a9d8f]'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Card({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${active ? 'border-[#2a9d8f] bg-[#f0fdf9] shadow-sm' : 'border-[#e1e1e1] hover:border-[#c9c9c9]'}`}
    >
      {children}
      {active && <Check className="h-4 w-4 text-[#2a9d8f] float-right mt-0.5" />}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PrescripcionWizard({ precioBase, materiales, tratamientos, nombre }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [added, setAdded] = useState(false)
  const [sel, setSel] = useState<Seleccion>({
    tipoUso: '',
    tipoVision: '',
    material: null,
    tratamiento: null,
    prescripcion: { od: EMPTY_ROW, oi: EMPTY_ROW },
    usaFoto: false,
    fotoUrl: '',
  })

  const needsMedida = sel.tipoUso === 'con-medida'
  const steps = needsMedida ? STEPS_CON_MEDIDA : STEPS_SIN_MEDIDA
  const totalSteps = steps.length

  // Dynamic step keys based on tipoUso
  function getStepKey(i: number): string {
    return steps[i] ?? ''
  }

  const currentKey = getStepKey(step)

  const extraMaterial = sel.material?.precio_extra ?? 0
  const extraTratamiento = sel.tratamiento?.precio_extra ?? 0
  const totalPrice = precioBase + extraMaterial + extraTratamiento

  function nextStep() {
    if (step < totalSteps - 1) setStep(s => s + 1)
  }

  function prevStep() {
    if (step > 0) setStep(s => s - 1)
  }

  function canNext(): boolean {
    switch (currentKey) {
      case 'Tipo de uso': return !!sel.tipoUso
      case 'Tipo de visión': return !!sel.tipoVision
      case 'Material': return true
      case 'Tratamiento': return true
      case 'Prescripción': return sel.usaFoto ? !!sel.fotoUrl : true
      default: return true
    }
  }

  function setRow(eye: 'od' | 'oi', field: keyof PrescripcionRow, val: string) {
    setSel(s => ({
      ...s,
      prescripcion: { ...s.prescripcion, [eye]: { ...s.prescripcion[eye], [field]: val } },
    }))
  }

  function addToCart() {
    setAdded(true)
    setOpen(false)
    setTimeout(() => setAdded(false), 3000)
  }

  // Sample fallbacks
  const mats: Material[] = materiales.length > 0 ? materiales : [
    { nombre: 'CR-39', descripcion: 'Lente estándar, ligero y económico', precio_extra: 0 },
    { nombre: 'Policarbonato', descripcion: 'Alta resistencia a impactos', precio_extra: 40 },
    { nombre: 'Trivex', descripcion: 'Ligero, resistente y clara visión', precio_extra: 80 },
    { nombre: 'Alto índice 1.67', descripcion: 'Ultra delgado para altas graduaciones', precio_extra: 120 },
  ]
  const tratos: Tratamiento[] = tratamientos.length > 0 ? tratamientos : [
    { nombre: 'Sin tratamiento', descripcion: 'Lente básico sin tratamiento adicional', precio_extra: 0 },
    { nombre: 'Antirreflejo', descripcion: 'Elimina reflejos molestos', precio_extra: 30 },
    { nombre: 'Fotocromático', descripcion: 'Se oscurece al sol automáticamente', precio_extra: 60 },
    { nombre: 'Blue Cut', descripcion: 'Bloquea la luz azul de pantallas', precio_extra: 35 },
  ]

  if (!open) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-[#2a9d8f] py-3.5 text-sm font-bold text-white hover:bg-[#239085] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Seleccionar lentes y agregar al carrito
        </button>
        {added && (
          <div className="flex items-center gap-2 rounded-xl bg-[#dcfce7] border border-[#86efac] px-4 py-3 text-sm text-[#166534]">
            <Check className="h-4 w-4 shrink-0" />
            ¡Agregado al carrito correctamente!
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-[#2a9d8f] bg-white shadow-lg overflow-hidden">
      {/* Progress bar */}
      <div className="bg-[#f0fdf9] border-b border-[#d1fae5] px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#2a9d8f]">Paso {step + 1} de {totalSteps}: {currentKey}</p>
          <button onClick={() => setOpen(false)} className="text-xs text-[#6a6a6a] hover:text-[#1a1a1a]">✕ Cerrar</button>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? 'bg-[#2a9d8f]' : i === step ? 'bg-[#2a9d8f]/60' : 'bg-[#d1d5db]'}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-5">

        {/* Paso: Tipo de uso */}
        {currentKey === 'Tipo de uso' && (
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">¿Cómo quieres tus lentes?</h3>
            {TIPOS_USO.map(t => (
              <Card key={t.id} active={sel.tipoUso === t.id} onClick={() => setSel(s => ({ ...s, tipoUso: t.id, tipoVision: '' }))}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{t.label}</p>
                    <p className="text-xs text-[#6a6a6a]">{t.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Paso: Tipo de visión */}
        {currentKey === 'Tipo de visión' && (
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">¿Qué tipo de visión necesitas corregir?</h3>
            {TIPOS_VISION.map(t => (
              <Card key={t.id} active={sel.tipoVision === t.id} onClick={() => setSel(s => ({ ...s, tipoVision: t.id }))}>
                <p className="text-sm font-semibold text-[#1a1a1a]">{t.label}</p>
                <p className="text-xs text-[#6a6a6a]">{t.desc}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Paso: Material */}
        {currentKey === 'Material' && (
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Elige el material del lente</h3>
            {mats.map(m => (
              <Card key={m.nombre} active={sel.material?.nombre === m.nombre} onClick={() => setSel(s => ({ ...s, material: m }))}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{m.nombre}</p>
                    {m.descripcion && <p className="text-xs text-[#6a6a6a]">{m.descripcion}</p>}
                  </div>
                  <span className="text-sm font-bold text-[#2a9d8f] shrink-0 ml-3">
                    {(m.precio_extra ?? 0) === 0 ? 'Incluido' : `+S/ ${m.precio_extra}`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Paso: Tratamiento */}
        {currentKey === 'Tratamiento' && (
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Elige el tratamiento</h3>
            {tratos.map(t => (
              <Card key={t.nombre} active={sel.tratamiento?.nombre === t.nombre} onClick={() => setSel(s => ({ ...s, tratamiento: t }))}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{t.nombre}</p>
                    {t.descripcion && <p className="text-xs text-[#6a6a6a]">{t.descripcion}</p>}
                  </div>
                  <span className="text-sm font-bold text-[#2a9d8f] shrink-0 ml-3">
                    {(t.precio_extra ?? 0) === 0 ? 'Incluido' : `+S/ ${t.precio_extra}`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Paso: Prescripción */}
        {currentKey === 'Prescripción' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#1a1a1a]">Ingresa tu prescripción</h3>
            <div className="flex gap-2">
              <button onClick={() => setSel(s => ({ ...s, usaFoto: false }))} className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-colors ${!sel.usaFoto ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>
                Ingresar manualmente
              </button>
              <button onClick={() => setSel(s => ({ ...s, usaFoto: true }))} className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-colors ${sel.usaFoto ? 'border-[#2a9d8f] bg-[#f0fdf9] text-[#2a9d8f]' : 'border-[#e1e1e1] text-[#6a6a6a]'}`}>
                Subir foto de receta
              </button>
            </div>

            {!sel.usaFoto ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#e1e1e1]">
                      <th className="py-2 text-left text-[#6a6a6a] font-medium w-10">Ojo</th>
                      {['Esférico', 'Cilindro', 'Eje', 'ADD', 'DIP'].map(h => (
                        <th key={h} className="py-2 text-center text-[#6a6a6a] font-medium px-1">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['od', 'oi'] as const).map(eye => (
                      <tr key={eye} className="border-b border-[#f1f1f1]">
                        <td className="py-2 font-bold text-sm">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${eye === 'od' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                            {eye === 'od' ? 'O.D.' : 'O.I.'}
                          </span>
                        </td>
                        {(['esferico', 'cilindro', 'eje', 'add', 'dip'] as (keyof PrescripcionRow)[]).map(field => (
                          <td key={field} className="py-1.5 px-1">
                            <input
                              className={inputCls}
                              value={sel.prescripcion[eye][field]}
                              onChange={e => setRow(eye, field, e.target.value)}
                              placeholder="—"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#e1e1e1] p-8 text-center">
                <Upload className="h-8 w-8 text-[#8a8a8a] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#1a1a1a] mb-1">Sube la foto de tu receta</p>
                <p className="text-xs text-[#8a8a8a] mb-4">PNG, JPG, PDF — máx 5MB</p>
                <input type="file" accept="image/*,.pdf" className="hidden" id="receta-upload" onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) setSel(s => ({ ...s, fotoUrl: URL.createObjectURL(file) }))
                }} />
                <label htmlFor="receta-upload" className="cursor-pointer rounded-lg bg-[#1a1a1a] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2a2a2a]">
                  Seleccionar archivo
                </label>
                {sel.fotoUrl && <p className="text-xs text-[#2a9d8f] mt-2">✓ Archivo seleccionado</p>}
              </div>
            )}
          </div>
        )}

        {/* Paso: Resumen */}
        {currentKey === 'Resumen' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#1a1a1a]">Resumen de tu selección</h3>
            <div className="rounded-xl border border-[#e1e1e1] divide-y divide-[#f1f1f1] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs text-[#6a6a6a]">Armazón</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{nombre}</p>
                </div>
                <p className="text-sm font-bold text-[#1a1a1a]">S/ {precioBase.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs text-[#6a6a6a]">Tipo de uso</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {TIPOS_USO.find(t => t.id === sel.tipoUso)?.label ?? sel.tipoUso}
                  </p>
                </div>
              </div>
              {sel.material && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-[#6a6a6a]">Material</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{sel.material.nombre}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    {(sel.material.precio_extra ?? 0) === 0 ? 'Incluido' : `+S/ ${sel.material.precio_extra?.toFixed(2)}`}
                  </p>
                </div>
              )}
              {sel.tratamiento && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-[#6a6a6a]">Tratamiento</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{sel.tratamiento.nombre}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    {(sel.tratamiento.precio_extra ?? 0) === 0 ? 'Incluido' : `+S/ ${sel.tratamiento.precio_extra?.toFixed(2)}`}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3 bg-[#f0fdf9]">
                <p className="text-sm font-bold text-[#1a1a1a]">TOTAL</p>
                <p className="text-xl font-black text-[#2a9d8f]">S/ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={addToCart}
              className="w-full rounded-xl bg-[#2a9d8f] py-3.5 text-sm font-bold text-white hover:bg-[#239085] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Agregar al carrito — S/ {totalPrice.toFixed(2)}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentKey !== 'Resumen' && (
        <div className="flex items-center justify-between px-5 pb-5">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            onClick={nextStep}
            disabled={!canNext()}
            className="flex items-center gap-1.5 rounded-xl bg-[#2a9d8f] px-5 py-2 text-sm font-bold text-white hover:bg-[#239085] disabled:opacity-50 transition-colors"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
