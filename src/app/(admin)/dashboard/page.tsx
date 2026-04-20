import { ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { label: 'Ventas totales', value: '$14,830.00', icon: TrendingUp, change: '+12.5%', up: true },
  { label: 'Pedidos', value: '18', icon: ShoppingBag, change: '+8.3%', up: true },
  { label: 'Clientes', value: '5', icon: Users, change: '+25%', up: true },
  { label: 'Productos', value: '5', icon: Package, change: '0%', up: true },
]

const recentOrders = [
  { id: '#1001', customer: 'Carlos Mendez', date: 'Hoy, 10:24', total: '$1,250.00', status: 'Sin cumplir' },
  { id: '#1002', customer: 'Ana García', date: 'Hoy, 9:15', total: '$890.00', status: 'Cumplido' },
  { id: '#1003', customer: 'Luis Torres', date: 'Ayer, 18:40', total: '$2,100.00', status: 'Sin cumplir' },
  { id: '#1004', customer: 'María López', date: 'Ayer, 14:22', total: '$650.00', status: 'Cumplido' },
  { id: '#1005', customer: 'Roberto Silva', date: '17 abr', total: '$3,400.00', status: 'En proceso' },
]

const statusBadge: Record<string, string> = {
  Cumplido: 'bg-[#e3f1df] text-[#2d6a1f]',
  'Sin cumplir': 'bg-[#f1f1f1] text-[#6a6a6a]',
  'En proceso': 'bg-[#dbeafe] text-[#1e40af]',
}

const chartBars = [30, 55, 42, 70, 48, 85, 62, 78, 50, 68, 90, 45, 60, 82, 66, 58, 74, 88, 52, 76, 92, 44, 63, 79, 57, 84, 69, 71, 86, 48]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#1a1a1a]">Resumen</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change, up }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6a6a6a]">{label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f1f1]">
                <Icon className="h-4 w-4 text-[#6a6a6a]" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${up ? 'text-[#2d6a1f]' : 'text-[#b91c1c]'}`}>
              {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {change} vs mes anterior
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Ventas del mes</h2>
            <p className="text-xs text-[#8a8a8a] mt-0.5">Abril 2026</p>
          </div>
          <span className="text-xl font-semibold text-[#1a1a1a]">$14,830.00</span>
        </div>
        <div className="flex items-end gap-1 h-32">
          {chartBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-[#2a9d8f] opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ height: `${h}%` }}
              title={`Día ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[#8a8a8a]">1 abr</span>
          <span className="text-xs text-[#8a8a8a]">30 abr</span>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Pedidos recientes</h2>
          <a href="/pedidos" className="text-xs text-[#2a9d8f] hover:underline">Ver todos</a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f1f1f1]">
              {['Pedido', 'Cliente', 'Fecha', 'Total', 'Estado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-[#f9f9f9] hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{o.id}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{o.customer}</td>
                <td className="px-4 py-3 text-xs text-[#8a8a8a]">{o.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">{o.total}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[o.status] ?? 'bg-[#f1f1f1] text-[#6a6a6a]'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
