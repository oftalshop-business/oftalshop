import { Globe, Palette, Layout, Search, ExternalLink, ChevronRight } from 'lucide-react'

const sections = [
  { icon: Palette, title: 'Temas', description: 'Personaliza el aspecto visual de tu tienda.', cta: 'Administrar temas' },
  { icon: Layout, title: 'Páginas', description: 'Configura las páginas de tu tienda online.', cta: 'Ver páginas' },
  { icon: Search, title: 'Preferencias', description: 'SEO, redes sociales y configuración general.', cta: 'Editar preferencias' },
]

export default function TiendaPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Tienda online</h1>
        <button className="flex items-center gap-2 rounded-lg border border-[#e1e1e1] bg-white px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
          <ExternalLink className="h-4 w-4" />
          Ver tienda
        </button>
      </div>

      {/* Current theme */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-[#2a9d8f] to-[#1a6b62] flex items-center justify-center">
              <Globe className="h-8 w-8 text-white/60" />
            </div>
            <div>
              <p className="text-xs text-[#8a8a8a] mb-1">Tema activo</p>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Dawn — OftalShop</h2>
              <p className="text-sm text-[#6a6a6a] mt-1">Última edición: 19 abr 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
              Vista previa
            </button>
            <button className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
              Personalizar
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-3 gap-4">
        {sections.map(({ icon: Icon, title, description, cta }) => (
          <div key={title} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f1f1] mb-3">
              <Icon className="h-4.5 w-4.5 text-[#6a6a6a]" />
            </div>
            <h2 className="text-sm font-semibold text-[#1a1a1a]">{title}</h2>
            <p className="mt-1 text-xs text-[#6a6a6a] leading-relaxed mb-4">{description}</p>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#2a9d8f] hover:underline">
              {cta}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Domain */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Dominio</h2>
          <button className="rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
            Conectar dominio existente
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[#1a1a1a]">mitienda.oftalshop.com</p>
            <p className="text-xs text-[#6a6a6a]">Dominio gratuito de OftalShop</p>
          </div>
          <span className="text-xs text-[#2d6a1f] bg-[#e3f1df] rounded-full px-2.5 py-0.5 font-medium">Principal</span>
        </div>
      </div>
    </div>
  )
}
