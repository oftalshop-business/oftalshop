'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, Pencil, Trash2, ChevronLeft, X, Check, Globe, EyeOff } from 'lucide-react'

interface Pagina {
  id: string
  titulo: string
  slug: string
  visible: boolean
  tipo: 'sistema' | 'personalizada'
  actualizada: string
}

const PAGINAS_INIT: Pagina[] = [
  { id: '1', titulo: 'Inicio', slug: '/', visible: true, tipo: 'sistema', actualizada: '20 abr 2026' },
  { id: '2', titulo: 'Nosotros', slug: '/nosotros', visible: true, tipo: 'personalizada', actualizada: '18 abr 2026' },
  { id: '3', titulo: 'Contacto', slug: '/contacto', visible: true, tipo: 'personalizada', actualizada: '15 abr 2026' },
  { id: '4', titulo: 'Política de privacidad', slug: '/privacidad', visible: true, tipo: 'sistema', actualizada: '1 ene 2026' },
  { id: '5', titulo: 'Términos y condiciones', slug: '/terminos', visible: true, tipo: 'sistema', actualizada: '1 ene 2026' },
  { id: '6', titulo: 'Envíos y devoluciones', slug: '/envios', visible: false, tipo: 'personalizada', actualizada: '10 mar 2026' },
]

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]'

function ModalPagina({
  pagina,
  onClose,
  onSave,
}: {
  pagina: Partial<Pagina> | null
  onClose: () => void
  onSave: (p: Pagina) => void
}) {
  const [form, setForm] = useState({
    titulo: pagina?.titulo ?? '',
    slug: pagina?.slug ?? '/',
    contenido: '',
    visible: pagina?.visible ?? true,
  })

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  function slugify(str: string) {
    return '/' + str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  function handleTitulo(e: React.ChangeEvent<HTMLInputElement>) {
    const titulo = e.target.value
    setForm(p => ({ ...p, titulo, slug: slugify(titulo) }))
  }

  function guardar() {
    if (!form.titulo) return
    onSave({
      id: pagina?.id ?? Date.now().toString(),
      titulo: form.titulo,
      slug: form.slug,
      visible: form.visible,
      tipo: 'personalizada',
      actualizada: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f1f1]">
          <h3 className="text-base font-semibold text-[#1a1a1a]">
            {pagina?.id ? 'Editar página' : 'Nueva página'}
          </h3>
          <button onClick={onClose} className="text-[#8a8a8a] hover:text-[#1a1a1a]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-[#6a6a6a] mb-1.5">Título de la página *</label>
            <input className={inputCls} value={form.titulo} onChange={handleTitulo} placeholder="Ej: Nosotros" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-[#6a6a6a] mb-1.5">URL (slug)</label>
            <input className={inputCls} value={form.slug} onChange={f('slug')} placeholder="/nosotros" />
            <p className="text-[11px] text-[#8a8a8a] mt-1">La URL completa será: mitienda.oftalshop.com{form.slug}</p>
          </div>
          <div>
            <label className="block text-xs text-[#6a6a6a] mb-1.5">Contenido</label>
            <textarea
              className={inputCls + ' resize-none h-28'}
              value={form.contenido}
              onChange={f('contenido')}
              placeholder="Escribe el contenido de la página..."
            />
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-[#1a1a1a]">Página visible para visitantes</span>
            <div
              onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.visible ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.visible ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#f1f1f1]">
          <button onClick={onClose} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#6a6a6a] hover:bg-[#f7f7f7]">
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={!form.titulo}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white font-medium disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Guardar página
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaginasPage() {
  const [paginas, setPaginas] = useState<Pagina[]>(PAGINAS_INIT)
  const [modal, setModal] = useState<Partial<Pagina> | null | false>(false)
  const [search, setSearch] = useState('')

  function savePagina(p: Pagina) {
    setPaginas(prev => {
      const idx = prev.findIndex(x => x.id === p.id)
      if (idx >= 0) {
        const arr = [...prev]
        arr[idx] = p
        return arr
      }
      return [...prev, p]
    })
    setModal(false)
  }

  function toggleVisibilidad(id: string) {
    setPaginas(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p))
  }

  function eliminar(id: string) {
    setPaginas(prev => prev.filter(p => p.id !== id))
  }

  const filtradas = paginas.filter(p =>
    p.titulo.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/tienda" className="flex items-center gap-1.5 text-sm text-[#6a6a6a] hover:text-[#1a1a1a]">
          <ChevronLeft className="h-4 w-4" />
          Tienda online
        </Link>
        <span className="text-[#c9c9c9]">/</span>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Páginas</h1>
      </div>

      <div className="flex items-center justify-between">
        <input
          className="rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
          placeholder="Buscar página..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar página
        </button>
      </div>

      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f1f1f1] bg-[#fafafa]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a]">Página</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a]">URL</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a]">Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a]">Visibilidad</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6a6a6a]">Actualizada</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f1]">
            {filtradas.map(p => (
              <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-5 py-3 font-medium text-[#1a1a1a]">{p.titulo}</td>
                <td className="px-5 py-3">
                  <code className="text-xs bg-[#f1f1f1] text-[#4a4a4a] px-2 py-0.5 rounded">{p.slug}</code>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.tipo === 'sistema' ? 'bg-[#f1f1f1] text-[#6a6a6a]' : 'bg-[#e8f5e9] text-[#2a7a47]'}`}>
                    {p.tipo === 'sistema' ? 'Sistema' : 'Personalizada'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleVisibilidad(p.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 transition-colors ${p.visible ? 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]' : 'bg-[#f1f1f1] text-[#6a6a6a] hover:bg-[#e5e5e5]'}`}
                  >
                    {p.visible ? <Globe className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.visible ? 'Visible' : 'Oculta'}
                  </button>
                </td>
                <td className="px-5 py-3 text-xs text-[#8a8a8a]">{p.actualizada}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href="#"
                      target="_blank"
                      className="rounded-lg border border-[#e1e1e1] p-1.5 text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors"
                      title="Vista previa"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => setModal(p)}
                      className="rounded-lg border border-[#e1e1e1] p-1.5 text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {p.tipo !== 'sistema' && (
                      <button
                        onClick={() => eliminar(p.id)}
                        className="rounded-lg border border-[#fecaca] p-1.5 text-[#ef4444] hover:bg-[#fff5f5] transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtradas.length === 0 && (
          <div className="py-12 text-center text-[#8a8a8a]">
            <p className="text-sm">No se encontraron páginas.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[#8a8a8a]">
        {paginas.length} páginas en total · {paginas.filter(p => p.visible).length} visibles
      </p>

      {modal !== false && (
        <ModalPagina
          pagina={modal}
          onClose={() => setModal(false)}
          onSave={savePagina}
        />
      )}
    </div>
  )
}
