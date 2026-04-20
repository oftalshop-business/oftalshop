import { Plus, Filter, Search, Users } from 'lucide-react'

const clients = [
  { id: 1, name: 'Carlos Mendez', email: 'carlos@example.com', orders: 4, spent: '$4,890.00', location: 'Ciudad de México', since: '12 ene 2026' },
  { id: 2, name: 'Ana García', email: 'ana@example.com', orders: 2, spent: '$1,780.00', location: 'Guadalajara', since: '5 feb 2026' },
  { id: 3, name: 'Luis Torres', email: 'luis@example.com', orders: 7, spent: '$9,200.00', location: 'Monterrey', since: '20 dic 2025' },
  { id: 4, name: 'María López', email: 'maria@example.com', orders: 1, spent: '$650.00', location: 'Puebla', since: '1 mar 2026' },
  { id: 5, name: 'Roberto Silva', email: 'roberto@example.com', orders: 3, spent: '$5,100.00', location: 'Tijuana', since: '8 ene 2026' },
]

export default function ClientesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Clientes</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
          <Plus className="h-4 w-4" />
          Agregar cliente
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Clientes totales', value: '5' },
          { label: 'Nuevos este mes', value: '2' },
          { label: 'Clientes recurrentes', value: '3' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6a6a6a]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#e1e1e1] px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-1.5 flex-1 max-w-sm">
            <Search className="h-3.5 w-3.5 text-[#8a8a8a]" />
            <input placeholder="Buscar clientes" className="bg-transparent text-xs outline-none placeholder-[#8a8a8a] w-full" />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7]">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Ubicación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Pedidos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Total gastado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Cliente desde</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#2a9d8f] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2a9d8f]">{c.name}</p>
                      <p className="text-xs text-[#8a8a8a]">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.location}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.orders} pedidos</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">{c.spent}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.since}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">{clients.length} clientes</p>
        </div>
      </div>
    </div>
  )
}
