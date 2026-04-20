'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'

export default function AddToCartSection({
  productoId,
  nombre,
  precio,
}: {
  productoId: string
  nombre: string
  precio: number
}) {
  const [cantidad, setCantidad] = useState(1)
  const [added, setAdded] = useState(false)

  function agregar() {
    // In a real app, this would update a cart context or cookie
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-[#1a1a1a]">Cantidad</p>
        <div className="flex items-center gap-0 rounded-lg border border-[#e1e1e1] overflow-hidden">
          <button
            onClick={() => setCantidad((p) => Math.max(1, p - 1))}
            className="w-9 h-9 flex items-center justify-center text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors text-lg font-semibold"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold text-[#1a1a1a]">{cantidad}</span>
          <button
            onClick={() => setCantidad((p) => p + 1)}
            className="w-9 h-9 flex items-center justify-center text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors text-lg font-semibold"
          >
            +
          </button>
        </div>
        <span className="text-sm text-[#6a6a6a]">
          Total: <strong className="text-[#1a1a1a]">S/ {(precio * cantidad).toFixed(2)}</strong>
        </span>
      </div>

      <button
        onClick={agregar}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white transition-all ${
          added ? 'bg-[#166534]' : 'bg-[#2a9d8f] hover:bg-[#238a7e]'
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            ¡Agregado al carrito!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Agregar al carrito
          </>
        )}
      </button>

      <button className="w-full rounded-xl border border-[#1a1a1a] py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
        Comprar ahora
      </button>
    </div>
  )
}
