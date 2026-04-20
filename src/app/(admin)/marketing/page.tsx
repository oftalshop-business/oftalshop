import { Plus, Megaphone, Mail, Share2, TrendingUp } from 'lucide-react'

const channels = [
  { title: 'Email marketing', icon: Mail, description: 'Envía campañas y automatizaciones a tus clientes.', status: 'No configurado' },
  { title: 'Redes sociales', icon: Share2, description: 'Conecta y publica en Instagram, Facebook y más.', status: 'No configurado' },
  { title: 'Anuncios', icon: TrendingUp, description: 'Crea anuncios en Google y Meta desde aquí.', status: 'No configurado' },
]

const campaigns = [
  { name: 'Promo Día del Optometrista', type: 'Email', sent: '320', opens: '41%', clicks: '12%', date: '10 abr 2026', status: 'Enviado' },
  { name: 'Descuento Primavera', type: 'Email', sent: '0', opens: '—', clicks: '—', date: '25 abr 2026', status: 'Programado' },
]

const statusBadge: Record<string, string> = {
  Enviado: 'bg-[#e3f1df] text-[#2d6a1f]',
  Programado: 'bg-[#dbeafe] text-[#1e40af]',
  Borrador: 'bg-[#f1f1f1] text-[#6a6a6a]',
}

export default function MarketingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Marketing</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
          <Plus className="h-4 w-4" />
          Crear campaña
        </button>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-3 gap-4">
        {channels.map(({ title, icon: Icon, description, status }) => (
          <div key={title} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f1f1]">
                <Icon className="h-4.5 w-4.5 text-[#6a6a6a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
                <span className="text-xs text-[#8a8a8a]">{status}</span>
              </div>
            </div>
            <p className="text-xs text-[#6a6a6a] mb-4">{description}</p>
            <button className="w-full rounded-lg border border-[#e1e1e1] py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              Configurar
            </button>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Campañas</h2>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Nueva campaña
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              {['Nombre', 'Tipo', 'Enviados', 'Aperturas', 'Clics', 'Fecha', 'Estado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{c.name}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.type}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.sent}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.opens}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.clicks}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{c.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[c.status]}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Megaphone className="h-10 w-10 text-[#c9c9c9]" />
            <p className="mt-3 text-sm font-medium text-[#6a6a6a]">Sin campañas todavía</p>
          </div>
        )}
      </div>
    </div>
  )
}
