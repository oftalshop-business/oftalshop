'use client'

import { useState } from 'react'
import {
  Plus, FileText, BookOpen, Paperclip, Layout,
  MoreHorizontal, Pencil, Trash2, X, Eye, EyeOff, Upload,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Modal = 'pagina' | 'articulo' | 'archivo' | 'menu' | null

interface Pagina {
  id: string
  titulo: string
  url: string
  visible: boolean
  fecha: string
}

interface Articulo {
  id: string
  titulo: string
  contenido: string
  imagen: string
  fecha: string
}

const uid = () => Math.random().toString(36).slice(2, 9)
const today = () => new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const inputCls = 'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#6a6a6a] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#1a1a1a]">{label}</label>
      {children}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ContenidoPage() {
  const [modal, setModal]           = useState<Modal>(null)
  const [openMenu, setOpenMenu]     = useState<string | null>(null)

  // Páginas
  const [paginas, setPaginas]       = useState<Pagina[]>([
    { id: '1', titulo: 'Acerca de nosotros',    url: '/pages/about',   visible: true,  fecha: '15 abr 2026' },
    { id: '2', titulo: 'Política de privacidad', url: '/pages/privacy', visible: true,  fecha: '10 abr 2026' },
    { id: '3', titulo: 'Contacto',              url: '/pages/contact', visible: false, fecha: '8 abr 2026'  },
  ])
  const [editPagina, setEditPagina] = useState<Pagina | null>(null)
  const [pForm, setPForm]           = useState({ titulo: '', contenido: '', visible: true })

  // Artículos
  const [articulos, setArticulos]   = useState<Articulo[]>([
    { id: '1', titulo: 'Cómo elegir tus lentes perfectos', contenido: '', imagen: '', fecha: '14 abr 2026' },
    { id: '2', titulo: 'Guía de materiales de lentes',    contenido: '', imagen: '', fecha: '7 abr 2026'  },
  ])
  const [aForm, setAForm]           = useState({ titulo: '', contenido: '', imagen: '' })

  function openPagina(p?: Pagina) {
    setEditPagina(p ?? null)
    setPForm({ titulo: p?.titulo ?? '', contenido: '', visible: p?.visible ?? true })
    setModal('pagina')
    setOpenMenu(null)
  }

  function savePagina() {
    if (!pForm.titulo.trim()) return
    if (editPagina) {
      setPaginas((prev) => prev.map((p) => p.id === editPagina.id
        ? { ...p, titulo: pForm.titulo, visible: pForm.visible }
        : p
      ))
    } else {
      const slug = pForm.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setPaginas((prev) => [...prev, { id: uid(), titulo: pForm.titulo, url: `/pages/${slug}`, visible: pForm.visible, fecha: today() }])
    }
    setModal(null)
  }

  function deletePagina(id: string) {
    setOpenMenu(null)
    if (!window.confirm('¿Eliminar esta página?')) return
    setPaginas((prev) => prev.filter((p) => p.id !== id))
  }

  function saveArticulo() {
    if (!aForm.titulo.trim()) return
    setArticulos((prev) => [...prev, { id: uid(), titulo: aForm.titulo, contenido: aForm.contenido, imagen: aForm.imagen, fecha: today() }])
    setModal(null)
    setAForm({ titulo: '', contenido: '', imagen: '' })
  }

  const sections = [
    { key: 'pagina'   as Modal, title: 'Páginas',           icon: FileText,   desc: 'Administra las páginas estáticas de tu tienda.',             count: paginas.length,   action: 'Agregar página'   },
    { key: 'articulo' as Modal, title: 'Blog',              icon: BookOpen,   desc: 'Publica artículos para atraer clientes y mejorar tu SEO.',   count: articulos.length, action: 'Crear artículo'   },
    { key: 'archivo'  as Modal, title: 'Archivos',          icon: Paperclip,  desc: 'Imágenes, videos y otros archivos de tu tienda.',            count: 0,                action: 'Subir archivo'    },
    { key: 'menu'     as Modal, title: 'Menú de navegación',icon: Layout,     desc: 'Administra los menús y enlaces de la tienda online.',        count: 1,                action: 'Editar menú'      },
  ]

  return (
    <div className="space-y-5" onClick={() => setOpenMenu(null)}>

      <h1 className="text-xl font-semibold text-[#1a1a1a]">Contenido</h1>

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map(({ key, title, icon: Icon, desc, count, action }) => (
          <div key={title} className="flex items-start gap-4 rounded-xl border border-[#e1e1e1] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f1f1]">
              <Icon className="h-5 w-5 text-[#6a6a6a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1a1a1a]">{title}</h2>
                <span className="text-xs text-[#9a9a9a]">{count}</span>
              </div>
              <p className="mt-1 text-xs text-[#6a6a6a] leading-relaxed">{desc}</p>
              <button
                onClick={() => setModal(key)}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> {action}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Páginas table */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Páginas</h2>
          <button
            onClick={() => openPagina()}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar página
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e1e1e1]">
              {['Título', 'URL', 'Actualizado', 'Visibilidad', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginas.map((p) => (
              <tr key={p.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{p.titulo}</td>
                <td className="px-4 py-3 text-xs text-[#8a8a8a] font-mono">{p.url}</td>
                <td className="px-4 py-3 text-sm text-[#6a6a6a]">{p.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.visible ? 'bg-[#e3f1df] text-[#2d6a1f]' : 'bg-[#f1f1f1] text-[#6a6a6a]'}`}>
                    {p.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.visible ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#6a6a6a] hover:bg-[#f1f1f1]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === p.id && (
                      <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-[#e1e1e1] bg-white py-1 shadow-md">
                        <button onClick={() => openPagina(p)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </button>
                        <button onClick={() => deletePagina(p.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#b91c1c] hover:bg-[#f7f7f7]">
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Artículos table */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e1e1e1] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Blog</h2>
          <button
            onClick={() => { setAForm({ titulo: '', contenido: '', imagen: '' }); setModal('articulo') }}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Crear artículo
          </button>
        </div>
        {articulos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-10 w-10 text-[#c9c9c9]" />
            <p className="mt-3 text-sm text-[#6a6a6a]">Sin artículos todavía</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e1e1e1]">
                {['Título', 'Publicado', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6a6a6a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articulos.map((a) => (
                <tr key={a.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#2a9d8f]">{a.titulo}</td>
                  <td className="px-4 py-3 text-sm text-[#6a6a6a]">{a.fecha}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setArticulos((prev) => prev.filter((x) => x.id !== a.id))}
                      className="text-[#9a9a9a] hover:text-[#b91c1c] transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal: Crear/Editar Página ── */}
      {modal === 'pagina' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">{editPagina ? 'Editar página' : 'Agregar página'}</h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <Field label="Título *">
                <input value={pForm.titulo} onChange={(e) => setPForm({ ...pForm, titulo: e.target.value })} placeholder="Ej. Acerca de nosotros" className={inputCls} />
              </Field>
              <Field label="Contenido">
                <textarea
                  value={pForm.contenido}
                  onChange={(e) => setPForm({ ...pForm, contenido: e.target.value })}
                  rows={6}
                  placeholder="Escribe el contenido de la página…"
                  className={inputCls + ' resize-none'}
                />
              </Field>
              <Field label="Visibilidad">
                <div className="flex items-center gap-3">
                  {[{ v: true, label: 'Visible' }, { v: false, label: 'Oculto' }].map(({ v, label }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={pForm.visible === v}
                        onChange={() => setPForm({ ...pForm, visible: v })}
                        className="accent-[#1a1a1a]"
                      />
                      <span className="text-sm text-[#1a1a1a]">{label}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cancelar</button>
              <button onClick={savePagina} disabled={!pForm.titulo.trim()} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50">
                {editPagina ? 'Guardar' : 'Crear página'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Crear Artículo ── */}
      {modal === 'articulo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Crear artículo</h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <Field label="Título *">
                <input value={aForm.titulo} onChange={(e) => setAForm({ ...aForm, titulo: e.target.value })} placeholder="Título del artículo" className={inputCls} />
              </Field>
              <Field label="Contenido">
                <textarea
                  value={aForm.contenido}
                  onChange={(e) => setAForm({ ...aForm, contenido: e.target.value })}
                  rows={5}
                  placeholder="Escribe el contenido del artículo…"
                  className={inputCls + ' resize-none'}
                />
              </Field>
              <Field label="Imagen destacada (URL)">
                <input value={aForm.imagen} onChange={(e) => setAForm({ ...aForm, imagen: e.target.value })} placeholder="https://..." className={inputCls} />
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cancelar</button>
              <button onClick={saveArticulo} disabled={!aForm.titulo.trim()} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] disabled:opacity-50">
                Publicar artículo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Subir Archivo ── */}
      {modal === 'archivo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Subir archivo</h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="px-6 py-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e1e1e1] py-10 hover:border-[#9a9a9a] transition-colors">
                <Upload className="h-8 w-8 text-[#9a9a9a]" />
                <p className="text-sm text-[#6a6a6a]">Arrastra archivos o haz clic para seleccionar</p>
                <p className="text-xs text-[#9a9a9a]">PNG, JPG, GIF, SVG, MP4 — máx. 20MB</p>
                <input type="file" multiple className="hidden" />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Editar Menú ── */}
      {modal === 'menu' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e1e1e1] px-6 py-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Menú principal</h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-[#6a6a6a]" /></button>
            </div>
            <div className="space-y-2 px-6 py-5">
              {['Inicio', 'Productos', 'Blog', 'Contacto'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-[#e1e1e1] px-3 py-2">
                  <span className="text-sm text-[#1a1a1a]">{item}</span>
                  <button className="text-xs text-[#9a9a9a] hover:text-[#b91c1c]">Quitar</button>
                </div>
              ))}
              <button className="mt-2 flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:underline">
                <Plus className="h-4 w-4" /> Agregar enlace
              </button>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e1e1e1] px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7]">Cancelar</button>
              <button onClick={() => setModal(null)} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white hover:bg-[#2a2a2a]">Guardar menú</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
