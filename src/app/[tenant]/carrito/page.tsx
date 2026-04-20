'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { ChevronLeft, ShoppingCart, Trash2, Plus, Minus, PackageOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LensConfig {
  tipoUso?: string
  tipoVision?: string
  material?: string
  tratamiento?: string
  od?: { esferico?: string; cilindro?: string; eje?: string; add?: string; dip?: string }
  oi?: { esferico?: string; cilindro?: string; eje?: string; add?: string; dip?: string }
}

interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagenUrl?: string
  lensConfig?: LensConfig
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CART_KEY = (tenant: string) => `carrito_${tenant}`

function loadCart(tenant: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY(tenant)) ?? '[]')
  } catch {
    return []
  }
}

function saveCart(tenant: string, items: CartItem[]) {
  localStorage.setItem(CART_KEY(tenant), JSON.stringify(items))
}

function formatLensConfig(c: LensConfig): string {
  const parts: string[] = []
  if (c.tipoUso) parts.push(c.tipoUso === 'con-medida' ? 'Con prescripción' : 'Sin prescripción')
  if (c.material) parts.push(c.material)
  if (c.tratamiento) parts.push(c.tratamiento)
  return parts.join(' · ')
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CarritoPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(params)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const local = loadCart(tenant)
    if (local.length > 0) {
      setItems(local)
      setLoading(false)
      return
    }
    // Try loading from Supabase as fallback
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('carrito')
            .select('*')
            .eq('tenant_id', tenant)
            .eq('user_id', user.id)
          if (data && data.length > 0) {
            const mapped: CartItem[] = data.map((r: Record<string, unknown>) => ({
              id: r.id as string,
              productoId: r.producto_id as string,
              nombre: r.nombre as string,
              precio: r.precio as number,
              cantidad: r.cantidad as number,
              imagenUrl: r.imagen_url as string | undefined,
              lensConfig: r.lens_config as LensConfig | undefined,
            }))
            setItems(mapped)
            saveCart(tenant, mapped)
          }
        }
      } catch { /* ignore */ }
      setLoading(false)
    })()
  }, [tenant])

  const syncToSupabase = async (updated: CartItem[]) => {
    setSyncing(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('carrito').delete().eq('tenant_id', tenant).eq('user_id', user.id)
      if (updated.length > 0) {
        await supabase.from('carrito').insert(
          updated.map(item => ({
            tenant_id: tenant,
            user_id: user.id,
            producto_id: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            imagen_url: item.imagenUrl ?? null,
            lens_config: item.lensConfig ?? null,
          }))
        )
      }
    } catch { /* ignore */ } finally {
      setSyncing(false)
    }
  }

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
      .filter(i => i.cantidad > 0)
    setItems(updated)
    saveCart(tenant, updated)
    syncToSupabase(updated)
  }

  const remove = (id: string) => {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    saveCart(tenant, updated)
    syncToSupabase(updated)
  }

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const envio = subtotal > 0 ? (subtotal >= 150 ? 0 : 12) : 0
  const total = subtotal + envio

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[#2a9d8f] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href={`/${tenant}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver a la tienda
          </Link>
          <span className="text-base font-bold text-[#e9c46a] capitalize">{tenant}</span>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <ShoppingCart className="h-4 w-4 text-[#2a9d8f]" />
            <span>{items.reduce((s, i) => s + i.cantidad, 0)} artículo{items.reduce((s, i) => s + i.cantidad, 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen className="h-16 w-16 text-[#d1d1d1] mb-4" />
            <p className="text-lg font-semibold text-[#1a1a1a] mb-2">Tu carrito está vacío</p>
            <p className="text-sm text-[#6a6a6a] mb-6">Agrega productos para continuar</p>
            <Link href={`/${tenant}`} className="rounded-xl bg-[#2a9d8f] px-6 py-3 text-sm font-bold text-white hover:bg-[#239085] transition-colors">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 rounded-2xl border border-[#e1e1e1] p-4 bg-white">
                  <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-[#f7f7f7] border border-[#e1e1e1]">
                    {item.imagenUrl ? (
                      <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">👓</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#1a1a1a] text-sm leading-tight">{item.nombre}</p>
                        {item.lensConfig && (
                          <p className="text-xs text-[#6a6a6a] mt-0.5">{formatLensConfig(item.lensConfig)}</p>
                        )}
                      </div>
                      <button onClick={() => remove(item.id)} className="shrink-0 rounded-lg p-1.5 text-[#c0392b] hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.lensConfig?.od && (
                      <div className="mt-2 rounded-lg bg-[#f0fdf9] border border-[#c8f0ea] px-3 py-2 text-xs text-[#2a9d8f]">
                        OD: esf {item.lensConfig.od.esferico ?? '—'} · cil {item.lensConfig.od.cilindro ?? '—'} · eje {item.lensConfig.od.eje ?? '—'}
                        {item.lensConfig?.oi && (
                          <span className="ml-2 text-[#6a6a6a]">
                            OI: esf {item.lensConfig.oi.esferico ?? '—'} · cil {item.lensConfig.oi.cilindro ?? '—'} · eje {item.lensConfig.oi.eje ?? '—'}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="px-2.5 py-1.5 text-[#4a4a4a] hover:bg-[#f7f7f7] transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-[#1a1a1a]">{item.cantidad}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="px-2.5 py-1.5 text-[#4a4a4a] hover:bg-[#f7f7f7] transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-[#1a1a1a]">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[#e1e1e1] p-6 bg-white space-y-4">
                <h2 className="font-bold text-[#1a1a1a]">Resumen del pedido</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#4a4a4a]">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#4a4a4a]">
                    <span>Envío</span>
                    {envio === 0 && subtotal > 0 ? (
                      <span className="text-[#2a9d8f] font-semibold">Gratis</span>
                    ) : (
                      <span>S/ {envio.toFixed(2)}</span>
                    )}
                  </div>
                  {subtotal > 0 && subtotal < 150 && (
                    <p className="text-xs text-[#6a6a6a]">Compras mayores a S/ 150 tienen envío gratis</p>
                  )}
                  <div className="border-t border-[#f1f1f1] pt-2 flex justify-between font-bold text-[#1a1a1a] text-base">
                    <span>Total</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href={`/${tenant}/checkout`}
                  className="block w-full rounded-xl bg-[#2a9d8f] py-3.5 text-center text-sm font-bold text-white hover:bg-[#239085] transition-colors"
                >
                  Proceder al pago
                </Link>

                <Link
                  href={`/${tenant}`}
                  className="block w-full rounded-xl border border-[#e1e1e1] py-3 text-center text-sm font-medium text-[#4a4a4a] hover:bg-[#f7f7f7] transition-colors"
                >
                  Continuar comprando
                </Link>

                {syncing && (
                  <p className="text-xs text-center text-[#6a6a6a]">Sincronizando...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
