import { Store, CreditCard, Truck, Users, Shield, Bell, Globe, ChevronRight } from 'lucide-react'

const settingGroups = [
  {
    label: 'Tienda',
    items: [
      { icon: Store, title: 'Información de la tienda', description: 'Nombre, dirección, moneda y zona horaria.' },
      { icon: Globe, title: 'Idiomas', description: 'Gestiona los idiomas de tu tienda.' },
    ],
  },
  {
    label: 'Ventas y pagos',
    items: [
      { icon: CreditCard, title: 'Pagos', description: 'Configura los métodos de pago aceptados.' },
      { icon: Truck, title: 'Envíos y entrega', description: 'Zonas de envío, tarifas y métodos de entrega.' },
    ],
  },
  {
    label: 'Usuarios y permisos',
    items: [
      { icon: Users, title: 'Usuarios y permisos', description: 'Administra el acceso del equipo.' },
      { icon: Shield, title: 'Seguridad de la cuenta', description: 'Autenticación de dos factores y sesiones.' },
    ],
  },
  {
    label: 'Notificaciones',
    items: [
      { icon: Bell, title: 'Notificaciones', description: 'Configura los emails y alertas automáticas.' },
    ],
  },
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-[#1a1a1a]">Configuración</h1>

      {/* Store info summary */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2a9d8f] text-white text-xl font-bold shrink-0">
            O
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#1a1a1a]">OftalShop Demo</h2>
            <p className="text-sm text-[#6a6a6a]">mitienda.oftalshop.com</p>
            <p className="text-xs text-[#8a8a8a] mt-0.5">Plan Profesional · Ciudad de México, MX</p>
          </div>
          <button className="ml-auto rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
            Editar
          </button>
        </div>
      </div>

      {/* Settings list */}
      {settingGroups.map(({ label, items }) => (
        <div key={label} className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[#e1e1e1] px-5 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">{label}</h2>
          </div>
          <ul className="divide-y divide-[#f1f1f1]">
            {items.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <button className="flex w-full items-center gap-4 px-5 py-4 hover:bg-[#fafafa] transition-colors text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f1f1] shrink-0">
                    <Icon className="h-4.5 w-4.5 text-[#6a6a6a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a]">{title}</p>
                    <p className="text-xs text-[#6a6a6a] mt-0.5">{description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#c9c9c9] shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Danger zone */}
      <div className="rounded-xl border border-[#fecaca] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#fecaca] px-5 py-3 bg-[#fff5f5]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#b91c1c]">Zona de peligro</h2>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#1a1a1a]">Eliminar tienda</p>
            <p className="text-xs text-[#6a6a6a] mt-0.5">Esta acción es permanente e irreversible.</p>
          </div>
          <button className="rounded-lg border border-[#fecaca] px-3 py-1.5 text-sm text-[#b91c1c] hover:bg-[#fff5f5] transition-colors">
            Eliminar tienda
          </button>
        </div>
      </div>
    </div>
  )
}
