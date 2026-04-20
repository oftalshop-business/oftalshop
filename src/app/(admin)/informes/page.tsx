import { TrendingUp, ShoppingBag, Users, DollarSign, BarChart2, ArrowUpRight } from 'lucide-react'

const kpis = [
  { label: 'Ventas totales', value: '$14,830.00', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Pedidos', value: '18', change: '+8.3%', up: true, icon: ShoppingBag },
  { label: 'Clientes nuevos', value: '5', change: '+25%', up: true, icon: Users },
  { label: 'Ticket promedio', value: '$823.89', change: '-3.2%', up: false, icon: TrendingUp },
]

const reportCategories = [
  {
    title: 'Ventas',
    reports: ['Ventas por producto', 'Ventas por cliente', 'Ventas por canal', 'Ventas por fecha'],
  },
  {
    title: 'Clientes',
    reports: ['Clientes nuevos vs recurrentes', 'Valor de vida del cliente', 'Ubicación de clientes'],
  },
  {
    title: 'Inventario',
    reports: ['Resumen de inventario', 'Inventario por producto', 'Rotación de inventario'],
  },
  {
    title: 'Marketing',
    reports: ['Uso de descuentos', 'Rendimiento de campañas', 'Conversión por canal'],
  },
]

export default function InformesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Informes</h1>
        <select className="rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] outline-none focus:border-[#2a9d8f]">
          <option>Últimos 30 días</option>
          <option>Este mes</option>
          <option>Últimos 3 meses</option>
          <option>Este año</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6a6a6a]">{label}</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1f1f1]">
                <Icon className="h-3.5 w-3.5 text-[#6a6a6a]" />
              </div>
            </div>
            <p className="mt-2 text-xl font-semibold text-[#1a1a1a]">{value}</p>
            <p className={`mt-1 text-xs font-medium ${up ? 'text-[#2d6a1f]' : 'text-[#b91c1c]'}`}>{change} vs período anterior</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Ventas por día</h2>
          <BarChart2 className="h-4 w-4 text-[#8a8a8a]" />
        </div>
        <div className="flex items-end gap-2 h-40">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50, 65, 88, 72, 66, 54, 79, 83, 91, 48, 62, 76, 58, 84, 70, 45, 77, 89, 63].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-[#2a9d8f] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[#8a8a8a]">1 abr</span>
          <span className="text-xs text-[#8a8a8a]">30 abr</span>
        </div>
      </div>

      {/* Report categories */}
      <div className="grid grid-cols-2 gap-4">
        {reportCategories.map(({ title, reports }) => (
          <div key={title} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">{title}</h2>
            <ul className="space-y-1">
              {reports.map((r) => (
                <li key={r}>
                  <button className="flex items-center justify-between w-full rounded-lg px-2 py-1.5 text-sm text-[#2a9d8f] hover:bg-[#f7f7f7] transition-colors group">
                    {r}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
