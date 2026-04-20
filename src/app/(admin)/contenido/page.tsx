import { Plus, FileText, BookOpen, Image, Layout } from 'lucide-react'

const sections = [
  {
    title: 'Páginas',
    icon: FileText,
    description: 'Administra las páginas de tu tienda como Acerca de, Contacto, etc.',
    count: 2,
    action: 'Agregar página',
  },
  {
    title: 'Blog',
    icon: BookOpen,
    description: 'Publica artículos para atraer clientes y mejorar tu SEO.',
    count: 0,
    action: 'Crear artículo',
  },
  {
    title: 'Archivos',
    icon: Image,
    description: 'Imágenes, videos y otros archivos de tu tienda.',
    count: 5,
    action: 'Subir archivo',
  },
  {
    title: 'Navegación',
    icon: Layout,
    description: 'Administra los menús y enlaces de navegación.',
    count: 1,
    action: 'Editar menú',
  },
]

const pages = [
  { title: 'Acerca de nosotros', handle: '/pages/about', updated: '15 abr 2026', visible: true },
  { title: 'Política de privacidad', handle: '/pages/privacy', updated: '10 abr 2026', visible: true },
]

export default function ContenidoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-[#1a1a1a]">Contenido</h1>

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map(({ title, icon: Icon, description, count, action }) => (
          <div key={title} className="rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f1f1] shrink-0">
              <Icon className="h-5 w-5 text-[#6a6a6a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1a1a1a]">{title}</h2>
                <span className="text-xs text-[#8a8a8a]">{count}</span>
              </div>
              <p className="mt-1 text-xs text-[#6a6a6a] leading-relaxed">{description}</p>
              <button className="mt-3 flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors">
                <Plus className="h-3.5 w-3.5" />
                {action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pages table */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Páginas</h2>
          <button className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white hover:bg-[#2a2a2a] transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Agregar página
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">URL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Actualizado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.title} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{page.title}</td>
                <td className="px-4 py-3 text-xs text-[#8a8a8a] font-mono">{page.handle}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{page.updated}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${page.visible ? 'bg-[#e3f1df] text-[#2d6a1f]' : 'bg-[#f1f1f1] text-[#6a6a6a]'}`}>
                    {page.visible ? 'Visible' : 'Oculto'}
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
