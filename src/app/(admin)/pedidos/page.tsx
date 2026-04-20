import { ShoppingBag, Plus, Filter, Download } from 'lucide-react'
import Link from 'next/link'

const tabs = ['Todos', 'Sin pagar', 'Sin cumplir', 'Sin abrir', 'Cerrados']

const orders = [
  { id: '#1001', date: '19 abr 2026', customer: 'Carlos Mendez', total: '$1,250.00', payment: 'Pagado', fulfillment: 'Sin cumplir' },
  { id: '#1002', date: '18 abr 2026', customer: 'Ana García', total: '$890.00', payment: 'Pagado', fulfillment: 'Cumplido' },
  { id: '#1003', date: '17 abr 2026', customer: 'Luis Torres', total: '$2,100.00', payment: 'Pendiente', fulfillment: 'Sin cumplir' },
  { id: '#1004', date: '16 abr 2026', customer: 'María López', total: '$650.00', payment: 'Pagado', fulfillment: 'Cumplido' },
  { id: '#1005', date: '15 abr 2026', customer: 'Roberto Silva', total: '$3,400.00', payment: 'Pagado', fulfillment: 'En proceso' },
]

const paymentBadge: Record<string, string> = {
  Pagado: 'bg-[#e3f1df] text-[#2d6a1f]',
  Pendiente: 'bg-[#fff3cd] text-[#856404]',
}
const fulfillmentBadge: Record<string, string> = {
  Cumplido: 'bg-[#e3f1df] text-[#2d6a1f]',
  'Sin cumplir': 'bg-[#f1f1f1] text-[#6a6a6a]',
  'En proceso': 'bg-[#dbeafe] text-[#1e40af]',
}

export default function PedidosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Pedidos</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <Link
            href="/pedidos/nuevo"
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear pedido
          </Link>
        </div>
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
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Pedido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Pago</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{order.id}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{order.date}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{order.customer}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">{order.total}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentBadge[order.payment] ?? 'bg-[#f1f1f1] text-[#6a6a6a]'}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${fulfillmentBadge[order.fulfillment] ?? 'bg-[#f1f1f1] text-[#6a6a6a]'}`}>
                    {order.fulfillment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-[#6a6a6a]">{orders.length} pedidos</p>
        </div>
      </div>
    </div>
  )
}
