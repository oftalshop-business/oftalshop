'use client'

import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, Package, ChevronDown,
} from 'lucide-react'

// ─── Sample data ──────────────────────────────────────────────────────────────

const salesByDay = [
  { dia: '1 abr', ventas: 420 }, { dia: '2 abr', ventas: 850 }, { dia: '3 abr', ventas: 630 },
  { dia: '4 abr', ventas: 1100 }, { dia: '5 abr', ventas: 780 }, { dia: '6 abr', ventas: 560 },
  { dia: '7 abr', ventas: 920 }, { dia: '8 abr', ventas: 1350 }, { dia: '9 abr', ventas: 740 },
  { dia: '10 abr', ventas: 890 }, { dia: '11 abr', ventas: 670 }, { dia: '12 abr', ventas: 1200 },
  { dia: '13 abr', ventas: 550 }, { dia: '14 abr', ventas: 980 }, { dia: '15 abr', ventas: 1450 },
  { dia: '16 abr', ventas: 830 }, { dia: '17 abr', ventas: 1080 }, { dia: '18 abr', ventas: 720 },
  { dia: '19 abr', ventas: 1250 }, { dia: '20 abr', ventas: 890 }, { dia: '21 abr', ventas: 650 },
  { dia: '22 abr', ventas: 1180 }, { dia: '23 abr', ventas: 960 }, { dia: '24 abr', ventas: 1340 },
  { dia: '25 abr', ventas: 810 }, { dia: '26 abr', ventas: 1090 }, { dia: '27 abr', ventas: 750 },
  { dia: '28 abr', ventas: 1420 }, { dia: '29 abr', ventas: 920 }, { dia: '30 abr', ventas: 680 },
]

const salesTable = [
  { id: '#1001', fecha: '19 abr 2026', cliente: 'Carlos Mendez',  canal: 'Online',        total: '$1,250.00' },
  { id: '#1002', fecha: '18 abr 2026', cliente: 'Ana García',     canal: 'Tienda física', total: '$890.00'   },
  { id: '#1003', fecha: '17 abr 2026', cliente: 'Luis Torres',    canal: 'Online',        total: '$2,100.00' },
  { id: '#1004', fecha: '16 abr 2026', cliente: 'María López',    canal: 'Online',        total: '$650.00'   },
  { id: '#1005', fecha: '15 abr 2026', cliente: 'Roberto Silva',  canal: 'Tienda física', total: '$3,400.00' },
]

const clientesByMonth = [
  { mes: 'Ene', nuevos: 3, recurrentes: 8  },
  { mes: 'Feb', nuevos: 5, recurrentes: 10 },
  { mes: 'Mar', nuevos: 4, recurrentes: 12 },
  { mes: 'Abr', nuevos: 7, recurrentes: 11 },
]

const clientesByCity = [
  { ciudad: 'Ciudad de México', clientes: 12, pct: '40%' },
  { ciudad: 'Guadalajara',      clientes:  8, pct: '27%' },
  { ciudad: 'Monterrey',        clientes:  6, pct: '20%' },
  { ciudad: 'Puebla',           clientes:  3, pct: '10%' },
  { ciudad: 'Tijuana',          clientes:  1, pct:  '3%' },
]

const inventarioByProduct = [
  { producto: 'Ray-Ban Clubmaster', stock: 12 },
  { producto: 'Acuvue Oasys',       stock: 45 },
  { producto: 'Solución Renu',      stock: 28 },
  { producto: 'Oakley Holbrook',    stock:  0 },
  { producto: 'Essilor Crist.',     stock:  8 },
]

const rotacionTable = [
  { producto: 'Ray-Ban Clubmaster', vendidos: 5,  stock: 12, estado: 'Normal' },
  { producto: 'Acuvue Oasys',       vendidos: 18, stock: 45, estado: 'Normal' },
  { producto: 'Solución Renu',      vendidos: 10, stock: 28, estado: 'Normal' },
  { producto: 'Oakley Holbrook',    vendidos:  0, stock:  0, estado: 'Sin stock' },
  { producto: 'Essilor Cristales',  vendidos:  3, stock:  8, estado: 'Stock bajo' },
]

const conversionByCanal = [
  { canal: 'Online',        sesiones: 820, conversiones: 18, tasa: '2.2%' },
  { canal: 'Tienda física', sesiones: 140, conversiones: 12, tasa: '8.6%' },
  { canal: 'Redes sociales',sesiones: 350, conversiones:  6, tasa: '1.7%' },
]

const conversionChartData = conversionByCanal.map((c) => ({
  canal: c.canal, sesiones: c.sesiones, conversiones: c.conversiones,
}))

const campaignPerf = [
  { nombre: 'Promo Día Optometrista', tipo: 'Email',  alcance: 320, clics: 38, conversion: '12%' },
  { nombre: 'Descuento Primavera',    tipo: 'Email',  alcance:   0, clics:  0, conversion: '—'   },
  { nombre: 'Story Armazones',        tipo: 'Social', alcance: 850, clics: 68, conversion: '8%'  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TABS = ['Ventas', 'Clientes', 'Inventario', 'Marketing'] as const
type Tab = typeof TABS[number]

const selectCls = 'rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-xs text-[#1a1a1a] outline-none focus:border-[#6a6a6a] transition-colors'

function MetricCard({
  label, value, change, up, icon: Icon,
}: { label: string; value: string; change: string; up: boolean; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#6a6a6a]">{label}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1f1f1]">
          <Icon className="h-3.5 w-3.5 text-[#6a6a6a]" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${up ? 'text-[#2d6a1f]' : 'text-[#b91c1c]'}`}>
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {change} vs período anterior
      </div>
    </div>
  )
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InformesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Ventas')
  const [period, setPeriod]       = useState('30d')

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Informes</h1>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={selectCls + ' appearance-none pr-7'}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
            <option value="year">Este año</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9a9a9a]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#e1e1e1] bg-white p-1 shadow-sm w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#6a6a6a] hover:text-[#1a1a1a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB: VENTAS ── */}
      {activeTab === 'Ventas' && (
        <div className="space-y-5">

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Total ventas"         value="$14,830.00" change="+12.5%" up={true}  icon={DollarSign}  />
            <MetricCard label="Promedio por pedido"  value="$823.89"    change="-3.2%"  up={false} icon={TrendingUp}  />
            <MetricCard label="Pedidos totales"      value="18"         change="+8.3%"  up={true}  icon={ShoppingBag} />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-[#6a6a6a]">Filtrar por:</span>
            {[
              { label: 'Producto',  opts: ['Todos', 'Armazones', 'Cristales', 'Soluciones'] },
              { label: 'Cliente',   opts: ['Todos', 'Carlos Mendez', 'Ana García', 'Luis Torres'] },
              { label: 'Canal',     opts: ['Todos', 'Online', 'Tienda física'] },
            ].map(({ label, opts }) => (
              <div key={label} className="relative">
                <select className={selectCls + ' appearance-none pr-6'}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#9a9a9a]" />
              </div>
            ))}
          </div>

          {/* Line chart */}
          <Card title="Ventas por día — Abril 2026">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesByDay} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2a9d8f" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2a9d8f" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e1e1e1', fontSize: 12 }}
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Ventas']}
                  />
                  <Area type="monotone" dataKey="ventas" stroke="#2a9d8f" strokeWidth={2} fill="url(#colorVentas)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Table */}
          <Card title="Resumen de ventas">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e1e1e1]">
                    {['Pedido', 'Fecha', 'Cliente', 'Canal', 'Total'].map((h) => (
                      <th key={h} className="pb-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salesTable.map((r) => (
                    <tr key={r.id} className="border-b border-[#f9f9f9]">
                      <td className="py-3 text-sm font-medium text-[#2a9d8f]">{r.id}</td>
                      <td className="py-3 text-sm text-[#6a6a6a]">{r.fecha}</td>
                      <td className="py-3 text-sm text-[#1a1a1a]">{r.cliente}</td>
                      <td className="py-3 text-sm text-[#6a6a6a]">{r.canal}</td>
                      <td className="py-3 text-sm font-medium text-[#1a1a1a]">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: CLIENTES ── */}
      {activeTab === 'Clientes' && (
        <div className="space-y-5">

          {/* LTV card */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Valor de vida (LTV)"   value="$3,194.00" change="+5.8%" up={true}  icon={TrendingUp} />
            <MetricCard label="Clientes totales"      value="30"        change="+25%"  up={true}  icon={Users}      />
            <MetricCard label="Tasa de retención"     value="63%"       change="+2.1%" up={true}  icon={ArrowUpRight} />
          </div>

          {/* Bar chart: nuevos vs recurrentes */}
          <Card title="Clientes nuevos vs Recurrentes">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientesByMonth} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e1e1e1', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="nuevos"      name="Nuevos"      fill="#2a9d8f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recurrentes" name="Recurrentes" fill="#e9c46a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Table by city */}
          <Card title="Clientes por ciudad">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e1e1e1]">
                  {['Ciudad', 'Clientes', '% del total'].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientesByCity.map((r) => (
                  <tr key={r.ciudad} className="border-b border-[#f9f9f9]">
                    <td className="py-3 text-sm text-[#1a1a1a]">{r.ciudad}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{r.clientes}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-[#f1f1f1]">
                          <div className="h-1.5 rounded-full bg-[#2a9d8f]" style={{ width: r.pct }} />
                        </div>
                        <span className="text-xs text-[#6a6a6a]">{r.pct}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TAB: INVENTARIO ── */}
      {activeTab === 'Inventario' && (
        <div className="space-y-5">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total productos',  value: '5',  icon: Package,    up: true,  change: '0' },
              { label: 'Stock bajo (≤ 10)', value: '2',  icon: TrendingUp, up: false, change: '+1' },
              { label: 'Sin stock',        value: '1',  icon: ShoppingBag,up: false, change: '+1' },
            ].map(({ label, value, icon: Icon, up, change }) => (
              <MetricCard key={label} label={label} value={value} change={change} up={up} icon={Icon} />
            ))}
          </div>

          {/* Bar chart: stock by product */}
          <Card title="Inventario por producto">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventarioByProduct} layout="vertical" margin={{ top: 4, right: 8, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="producto" tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} width={56} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e1e1e1', fontSize: 12 }} />
                  <Bar dataKey="stock" name="Stock" fill="#2a9d8f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Rotation table */}
          <Card title="Rotación de inventario">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e1e1e1]">
                  {['Producto', 'Vendidos (mes)', 'Stock actual', 'Estado'].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rotacionTable.map((r) => (
                  <tr key={r.producto} className="border-b border-[#f9f9f9]">
                    <td className="py-3 text-sm text-[#1a1a1a]">{r.producto}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{r.vendidos}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{r.stock}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.estado === 'Normal'    ? 'bg-[#e3f1df] text-[#2d6a1f]' :
                        r.estado === 'Stock bajo'? 'bg-[#fff3cd] text-[#856404]' :
                                                   'bg-[#fee2e2] text-[#991b1b]'
                      }`}>
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TAB: MARKETING ── */}
      {activeTab === 'Marketing' && (
        <div className="space-y-5">

          {/* Filters */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#6a6a6a]">Filtrar por:</span>
            {[
              { label: 'Tipo', opts: ['Todos', 'Email', 'Social', 'Anuncio'] },
              { label: 'Estado', opts: ['Todos', 'Enviado', 'Programado', 'Borrador'] },
            ].map(({ label, opts }) => (
              <div key={label} className="relative">
                <select className={selectCls + ' appearance-none pr-6'}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#9a9a9a]" />
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Alcance total',       value: '1,170', icon: Users,     up: true,  change: '+22%' },
              { label: 'Conversión promedio', value: '7.5%',  icon: TrendingUp,up: true,  change: '+1.2%'},
              { label: 'Descuentos usados',   value: '25',    icon: ShoppingBag,up: true, change: '+8'   },
            ].map(({ label, value, icon: Icon, up, change }) => (
              <MetricCard key={label} label={label} value={value} change={change} up={up} icon={Icon} />
            ))}
          </div>

          {/* Conversion by channel */}
          <Card title="Conversión por canal">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="canal" tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9a9a9a' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e1e1e1', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="sesiones"     name="Sesiones"      fill="#e9c46a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversiones" name="Conversiones"  fill="#2a9d8f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Campaign performance table */}
          <Card title="Rendimiento de campañas">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e1e1e1]">
                  {['Campaña', 'Tipo', 'Alcance', 'Clics', 'Conversión'].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaignPerf.map((c) => (
                  <tr key={c.nombre} className="border-b border-[#f9f9f9]">
                    <td className="py-3 text-sm font-medium text-[#1a1a1a]">{c.nombre}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{c.tipo}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{c.alcance > 0 ? c.alcance.toLocaleString() : '—'}</td>
                    <td className="py-3 text-sm text-[#6a6a6a]">{c.clics > 0 ? c.clics : '—'}</td>
                    <td className="py-3 text-sm font-medium text-[#1a1a1a]">{c.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}
