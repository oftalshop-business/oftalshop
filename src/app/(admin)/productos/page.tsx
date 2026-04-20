import { Plus, Filter, Search } from 'lucide-react'
import Link from 'next/link'

const tabs = ['Todos', 'Activos', 'Borrador', 'Archivados']

const products = [
  { id: 1, name: 'Armazón Ray-Ban Clubmaster', status: 'Activo', inventory: '12 en stock', type: 'Armazón', vendor: 'Ray-Ban' },
  { id: 2, name: 'Lentes de Contacto Acuvue Oasys', status: 'Activo', inventory: '45 en stock', type: 'Lentes de contacto', vendor: 'Johnson & Johnson' },
  { id: 3, name: 'Solución Multiusos Renu', status: 'Activo', inventory: '28 en stock', type: 'Solución', vendor: 'Bausch & Lomb' },
  { id: 4, name: 'Armazón Oakley Holbrook', status: 'Borrador', inventory: '0 en stock', type: 'Armazón', vendor: 'Oakley' },
  { id: 5, name: 'Cristales Antirreflejo Essilor', status: 'Activo', inventory: '8 en stock', type: 'Cristales', vendor: 'Essilor' },
]

const statusBadge: Record<string, string> = {
  Activo: 'bg-[#e3f1df] text-[#2d6a1f]',
  Borrador: 'bg-[#f1f1f1] text-[#6a6a6a]',
  Archivado: 'bg-[#fff3cd] text-[#856404]',
}

export default function ProductosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Productos</h1>
        <Link
          href="/productos/nuevo"
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar producto
        </Link>
      </div>

      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#e1e1e1] px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 ${
                i === 0
                  ? 'border-[#1a1a1a] text-[#1a1a1a]'
                  : 'border-transparent text-[#6a6a6a] hover:text-[#1a1a1a]'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-[#8a8a8a]" />
              <input placeholder="Buscar productos" className="bg-transparent text-xs outline-none placeholder-[#8a8a8a] w-40" />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7]">
              <Filter className="h-3.5 w-3.5" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Inventario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#f1f1f1] flex items-center justify-center text-[#8a8a8a] text-xs shrink-0">
                      IMG
                    </div>
                    <span className="text-sm font-medium text-[#2a9d8f] hover:underline">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.inventory}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.type}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">{products.length} productos</p>
        </div>
      </div>
    </div>
  )
}
