import { Plus, Tag, Filter } from 'lucide-react'

const discounts = [
  { code: 'VERANO2026', type: 'Porcentaje', value: '20%', usage: '14/100', starts: '1 abr 2026', ends: '30 abr 2026', status: 'Activo' },
  { code: 'PRIMERAVEZ', type: 'Monto fijo', value: '$150.00', usage: '8/∞', starts: '1 ene 2026', ends: '—', status: 'Activo' },
  { code: 'ENVIOGRATIS', type: 'Envío gratis', value: '—', usage: '3/50', starts: '15 abr 2026', ends: '15 may 2026', status: 'Activo' },
  { code: 'NAVIDAD25', type: 'Porcentaje', value: '15%', usage: '56/56', starts: '1 dic 2025', ends: '31 dic 2025', status: 'Expirado' },
]

const statusBadge: Record<string, string> = {
  Activo: 'bg-[#e3f1df] text-[#2d6a1f]',
  Expirado: 'bg-[#f1f1f1] text-[#6a6a6a]',
  Programado: 'bg-[#dbeafe] text-[#1e40af]',
}

export default function DescuentosPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Descuentos</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
          <Plus className="h-4 w-4" />
          Crear descuento
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Códigos activos', value: '3' },
          { label: 'Usos este mes', value: '25' },
          { label: 'Descuentos expirados', value: '1' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6a6a6a]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#e1e1e1] px-4 py-3">
          <Tag className="h-4 w-4 text-[#6a6a6a]" />
          <span className="text-sm font-semibold text-[#1a1a1a] flex-1">Códigos de descuento</span>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a] hover:bg-[#f7f7f7]">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              {['', 'Código', 'Tipo', 'Valor', 'Usos', 'Inicio', 'Fin', 'Estado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.code} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-3 text-sm font-mono font-medium text-[#2a9d8f]">{d.code}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{d.type}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1a1a1a]">{d.value}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{d.usage}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{d.starts}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{d.ends}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[d.status]}`}>
                    {d.status}
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
