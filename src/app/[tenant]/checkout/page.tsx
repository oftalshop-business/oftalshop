'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { ChevronLeft, ChevronRight, Check, CreditCard, Smartphone, Building2, Truck, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagenUrl?: string
  lensConfig?: Record<string, unknown>
}

interface ContactForm {
  nombre: string
  email: string
  telefono: string
}

interface AddressForm {
  direccion: string
  ciudad: string
  distrito: string
  referencias: string
}

type PayMethod = 'tarjeta' | 'yape' | 'transferencia' | 'contraentrega'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CART_KEY = (t: string) => `carrito_${t}`

function loadCart(tenant: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CART_KEY(tenant)) ?? '[]') }
  catch { return [] }
}

const PAY_METHODS: { id: PayMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'tarjeta',        label: 'Tarjeta de crédito/débito', desc: 'Visa, Mastercard, Amex',        icon: <CreditCard className="h-5 w-5" /> },
  { id: 'yape',           label: 'Yape / Plin',                desc: 'Pago con QR desde tu celular', icon: <Smartphone className="h-5 w-5" /> },
  { id: 'transferencia',  label: 'Transferencia bancaria',     desc: 'BCP, Interbank, BBVA',         icon: <Building2 className="h-5 w-5" /> },
  { id: 'contraentrega',  label: 'Contra entrega',             desc: 'Paga cuando recibas tu pedido',icon: <Truck className="h-5 w-5" /> },
]

const STEP_LABELS = ['Contacto', 'Envío', 'Pago']

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(params)
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [items, setItems] = useState<CartItem[]>([])
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [contact, setContact] = useState<ContactForm>({ nombre: '', email: '', telefono: '' })
  const [address, setAddress] = useState<AddressForm>({ direccion: '', ciudad: 'Lima', distrito: '', referencias: '' })
  const [payMethod, setPayMethod] = useState<PayMethod>('tarjeta')

  useEffect(() => {
    setItems(loadCart(tenant))
    // Pre-fill email from session
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setContact(prev => ({ ...prev, email: user.email! }))
    })()
  }, [tenant])

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const envio = subtotal >= 150 ? 0 : (subtotal > 0 ? 12 : 0)
  const total = subtotal + envio

  // ── Validation ──────────────────────────────────────────────────────────────

  const step1Valid = contact.nombre.trim().length > 1 && contact.email.includes('@') && contact.telefono.trim().length >= 7
  const step2Valid = address.direccion.trim().length > 3 && address.distrito.trim().length > 1

  const canNext = step === 1 ? step1Valid : step === 2 ? step2Valid : true

  // ── Place order ──────────────────────────────────────────────────────────────

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const pedido = {
        tenant_id: tenant,
        user_id: user?.id ?? null,
        contacto: contact,
        direccion_envio: address,
        metodo_pago: payMethod,
        items: items.map(i => ({
          producto_id: i.productoId,
          nombre: i.nombre,
          precio: i.precio,
          cantidad: i.cantidad,
          imagen_url: i.imagenUrl ?? null,
          lens_config: i.lensConfig ?? null,
        })),
        subtotal,
        envio,
        total,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('pedidos').insert(pedido).select('id').single()
      if (error) throw error

      // Clear cart
      localStorage.removeItem(CART_KEY(tenant))
      if (user) {
        await supabase.from('carrito').delete().eq('tenant_id', tenant).eq('user_id', user.id)
      }

      setOrderId(data?.id ?? null)
      setDone(true)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Ocurrió un error al procesar tu pedido. Inténtalo de nuevo.')
    } finally {
      setPlacing(false)
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────────

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="h-20 w-20 rounded-full bg-[#f0fdf9] border-2 border-[#2a9d8f] flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-[#2a9d8f]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">¡Pedido confirmado!</h1>
        <p className="text-sm text-[#6a6a6a] max-w-sm mb-2">
          Tu pedido fue recibido exitosamente. Te contactaremos pronto al correo <strong>{contact.email}</strong>.
        </p>
        {orderId && (
          <p className="text-xs text-[#9a9a9a] mb-8">Orden #{orderId.slice(0, 8).toUpperCase()}</p>
        )}
        <Link
          href={`/${tenant}`}
          className="rounded-xl bg-[#2a9d8f] px-8 py-3 text-sm font-bold text-white hover:bg-[#239085] transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    )
  }

  // ── Layout ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href={`/${tenant}/carrito`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver al carrito
          </Link>
          <span className="text-base font-bold text-[#e9c46a] capitalize">{tenant}</span>
          <div className="flex items-center gap-1 text-white/50 text-sm">
            <ShoppingBag className="h-4 w-4" />
            <span>Checkout</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-[#f1f1f1]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-0">
            {STEP_LABELS.map((label, idx) => {
              const s = idx + 1
              const done = step > s
              const active = step === s
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      done ? 'bg-[#2a9d8f] text-white' : active ? 'bg-[#1a1a1a] text-white' : 'bg-[#f1f1f1] text-[#9a9a9a]'
                    }`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : s}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-[#1a1a1a]' : done ? 'text-[#2a9d8f]' : 'text-[#9a9a9a]'}`}>
                      {label}
                    </span>
                  </div>
                  {s < STEP_LABELS.length && (
                    <div className={`flex-1 h-px mx-4 ${done ? 'bg-[#2a9d8f]' : 'bg-[#e1e1e1]'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e1e1e1] p-6">

            {/* Step 1 — Contact */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Datos de contacto</h2>
                <div>
                  <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Nombre completo *</label>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                    placeholder="Juan Pérez"
                    value={contact.nombre}
                    onChange={e => setContact(p => ({ ...p, nombre: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Correo electrónico *</label>
                  <input
                    type="email"
                    className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                    placeholder="juan@ejemplo.com"
                    value={contact.email}
                    onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Teléfono *</label>
                  <input
                    type="tel"
                    className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                    placeholder="987 654 321"
                    value={contact.telefono}
                    onChange={e => setContact(p => ({ ...p, telefono: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 2 — Address */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Dirección de envío</h2>
                <div>
                  <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Dirección *</label>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                    placeholder="Av. Arequipa 1234"
                    value={address.direccion}
                    onChange={e => setAddress(p => ({ ...p, direccion: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Ciudad *</label>
                    <input
                      className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                      value={address.ciudad}
                      onChange={e => setAddress(p => ({ ...p, ciudad: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Distrito *</label>
                    <input
                      className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors"
                      placeholder="Miraflores"
                      value={address.distrito}
                      onChange={e => setAddress(p => ({ ...p, distrito: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">Referencias</label>
                  <textarea
                    rows={2}
                    className="mt-1.5 w-full rounded-xl border border-[#e1e1e1] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2a9d8f] focus:outline-none transition-colors resize-none"
                    placeholder="Cerca al parque, edificio azul, piso 3..."
                    value={address.referencias}
                    onChange={e => setAddress(p => ({ ...p, referencias: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 3 — Payment */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Método de pago</h2>
                <div className="space-y-3">
                  {PAY_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-colors ${
                        payMethod === m.id
                          ? 'border-[#2a9d8f] bg-[#f0fdf9]'
                          : 'border-[#e1e1e1] bg-white hover:border-[#c1c1c1]'
                      }`}
                    >
                      <div className={`shrink-0 ${payMethod === m.id ? 'text-[#2a9d8f]' : 'text-[#6a6a6a]'}`}>
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${payMethod === m.id ? 'text-[#1a1a1a]' : 'text-[#4a4a4a]'}`}>{m.label}</p>
                        <p className="text-xs text-[#9a9a9a]">{m.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        payMethod === m.id ? 'border-[#2a9d8f]' : 'border-[#d1d1d1]'
                      }`}>
                        {payMethod === m.id && <div className="h-2 w-2 rounded-full bg-[#2a9d8f]" />}
                      </div>
                    </button>
                  ))}
                </div>

                {payMethod === 'yape' && (
                  <div className="rounded-xl bg-[#fff7ed] border border-[#fed7aa] p-4 text-sm text-[#9a3412]">
                    Escanea el código QR con Yape o Plin. Recibirás instrucciones de pago por correo electrónico.
                  </div>
                )}
                {payMethod === 'transferencia' && (
                  <div className="rounded-xl bg-[#eff6ff] border border-[#bfdbfe] p-4 text-sm text-[#1e40af]">
                    Recibirás los datos bancarios por correo electrónico para completar la transferencia.
                  </div>
                )}
                {payMethod === 'tarjeta' && (
                  <div className="rounded-xl bg-[#f0fdf9] border border-[#c8f0ea] p-4 text-sm text-[#065f46]">
                    Serás redirigido a la pasarela de pago segura de Stripe para completar tu compra.
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 rounded-xl border border-[#e1e1e1] px-5 py-2.5 text-sm font-medium text-[#4a4a4a] hover:bg-[#f7f7f7] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext}
                  className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continuar <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing || items.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-[#2a9d8f] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#239085] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {placing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirmar pedido — S/ {total.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-[#e1e1e1] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f1f1]">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Resumen del pedido</h3>
            </div>

            <div className="divide-y divide-[#f9f9f9]">
              {items.length === 0 ? (
                <p className="px-5 py-4 text-sm text-[#9a9a9a]">El carrito está vacío</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-[#f7f7f7] border border-[#e1e1e1]">
                      {item.imagenUrl ? (
                        <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg">👓</div>
                      )}
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#1a1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                        {item.cantidad}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-1">{item.nombre}</p>
                    </div>
                    <p className="text-xs font-bold text-[#1a1a1a] shrink-0">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-4 space-y-2 border-t border-[#f1f1f1] bg-[#fafafa]">
              <div className="flex justify-between text-xs text-[#6a6a6a]">
                <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6a6a6a]">
                <span>Envío</span>
                {envio === 0 && subtotal > 0 ? (
                  <span className="text-[#2a9d8f] font-semibold">Gratis</span>
                ) : (
                  <span>S/ {envio.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1a1a1a] pt-1 border-t border-[#e1e1e1]">
                <span>Total</span><span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
