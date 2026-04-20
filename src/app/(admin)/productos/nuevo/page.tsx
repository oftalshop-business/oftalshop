'use client'

import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NuevoProductoPage() {
  const [status, setStatus] = useState('Activo')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/productos" className="flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Productos
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <span className="text-sm text-[#1a1a1a] font-medium">Agregar producto</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column */}
        <div className="col-span-2 space-y-4">
          {/* Title & description */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Título</label>
              <input
                type="text"
                placeholder="Nombre del producto"
                className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#2a9d8f] focus:ring-1 focus:ring-[#2a9d8f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Descripción</label>
              <div className="rounded-lg border border-[#e1e1e1] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[#e1e1e1] px-3 py-2">
                  {['B', 'I', 'U'].map((f) => (
                    <button key={f} className="h-6 w-6 rounded text-xs font-semibold text-[#6a6a6a] hover:bg-[#f1f1f1]">{f}</button>
                  ))}
                </div>
                <textarea
                  rows={5}
                  placeholder="Describe el producto..."
                  className="w-full px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Multimedia</h2>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[#e1e1e1] py-12 cursor-pointer hover:border-[#2a9d8f] transition-colors">
              <div className="text-center">
                <Upload className="h-8 w-8 text-[#c9c9c9] mx-auto" />
                <p className="mt-2 text-sm text-[#6a6a6a]">Agrega archivos de imagen o video</p>
                <p className="mt-1 text-xs text-[#9a9a9a]">o arrastra y suelta aquí</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">Precio</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Precio</label>
                <div className="flex items-center rounded-lg border border-[#e1e1e1] overflow-hidden focus-within:border-[#2a9d8f]">
                  <span className="px-3 py-2 text-sm text-[#6a6a6a] bg-[#f7f7f7] border-r border-[#e1e1e1]">$</span>
                  <input type="number" placeholder="0.00" className="flex-1 px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Precio de comparación</label>
                <div className="flex items-center rounded-lg border border-[#e1e1e1] overflow-hidden focus-within:border-[#2a9d8f]">
                  <span className="px-3 py-2 text-sm text-[#6a6a6a] bg-[#f7f7f7] border-r border-[#e1e1e1]">$</span>
                  <input type="number" placeholder="0.00" className="flex-1 px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Costo por artículo</label>
                <div className="flex items-center rounded-lg border border-[#e1e1e1] overflow-hidden focus-within:border-[#2a9d8f]">
                  <span className="px-3 py-2 text-sm text-[#6a6a6a] bg-[#f7f7f7] border-r border-[#e1e1e1]">$</span>
                  <input type="number" placeholder="0.00" className="flex-1 px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Margen</label>
                <div className="flex items-center rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] overflow-hidden">
                  <input readOnly placeholder="--" className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-[#6a6a6a]" />
                  <span className="px-3 py-2 text-sm text-[#6a6a6a] border-l border-[#e1e1e1]">%</span>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-[#1a1a1a]">Cobrar impuestos a este producto</span>
            </label>
          </div>

          {/* Inventory */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">Inventario</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">SKU (Código de referencia)</label>
                <input type="text" placeholder="" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Código de barras (ISBN, UPC, GTIN, etc.)</label>
                <input type="text" placeholder="" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-[#1a1a1a]">Rastrear cantidad</span>
            </label>
            <div className="mt-4">
              <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Cantidad disponible</label>
              <input type="number" defaultValue={0} className="w-28 rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-1">Variantes</h2>
            <p className="text-xs text-[#6a6a6a] mb-4">Agrega variantes como color, talla o material.</p>
            <button className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              <Plus className="h-4 w-4" />
              Agregar opciones como color o talla
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Estado</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[#2a9d8f] bg-white"
            >
              <option>Activo</option>
              <option>Borrador</option>
            </select>
            <p className="mt-2 text-xs text-[#8a8a8a]">
              {status === 'Activo' ? 'El producto es visible en la tienda.' : 'No se puede ver en la tienda.'}
            </p>
          </div>

          {/* Publishing */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Canales de ventas</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-[#1a1a1a]">Tienda online</span>
            </label>
          </div>

          {/* Product type */}
          <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Organización del producto</h2>
            <div>
              <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Tipo de producto</label>
              <input type="text" placeholder="Ej. Armazón" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Proveedor</label>
              <input type="text" placeholder="Ej. Ray-Ban" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Colección</label>
              <input type="text" placeholder="Buscar colecciones" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6a6a6a] mb-1.5">Etiquetas</label>
              <input type="text" placeholder="Agregar etiqueta" className="w-full rounded-lg border border-[#e1e1e1] px-3 py-2 text-sm outline-none focus:border-[#2a9d8f]" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Link href="/productos" className="rounded-lg border border-[#e1e1e1] bg-white px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
          Descartar
        </Link>
        <button className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
          Guardar producto
        </button>
      </div>
    </div>
  )
}
