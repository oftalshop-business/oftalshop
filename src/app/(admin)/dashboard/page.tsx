import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Ventas totales', value: '$0.00', icon: TrendingUp, change: '0%' },
  { label: 'Pedidos', value: '0', icon: ShoppingBag, change: '0' },
  { label: 'Clientes', value: '0', icon: Users, change: '0' },
  { label: 'Productos', value: '0', icon: Package, change: '0' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#1a1a1a]">Resumen</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change }) => (
          <div
            key={label}
            className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6a6a6a]">{label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f1f1]">
                <Icon className="h-4 w-4 text-[#6a6a6a]" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
            <p className="mt-1 text-xs text-[#8a8a8a]">{change} vs mes anterior</p>
          </div>
        ))}
      </div>

      {/* Recent orders placeholder */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="border-b border-[#e1e1e1] px-6 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Pedidos recientes</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-[#c9c9c9]" />
          <p className="mt-3 text-sm font-medium text-[#6a6a6a]">Sin pedidos todavía</p>
          <p className="mt-1 text-xs text-[#9a9a9a]">
            Los pedidos de tu tienda aparecerán aquí.
          </p>
        </div>
      </div>
    </div>
  )
}
