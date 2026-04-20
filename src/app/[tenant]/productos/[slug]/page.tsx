import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ShoppingCart, Ruler } from 'lucide-react'
import PrescripcionWizard from './PrescripcionWizard'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Media { url: string; tipo: string }
interface Variante { nombre: string; valores: string[] }
interface Material { nombre: string; descripcion?: string; precio_extra?: number }
interface Tratamiento { nombre: string; descripcion?: string; precio_extra?: number }
interface MedidaProducto { tipo_medida: string; valor: string; tipo: string; url: string | null }

interface Producto {
  id: string
  nombre: string
  precio: number
  descripcion: string | null
  slug: string
  tenant_id: string
  requiere_prescripcion?: boolean
  medias: Media[]
  variantes: Variante[]
  materiales_luna: Material[]
  tratamientos: Tratamiento[]
  medidas_producto: MedidaProducto[]
}

interface ProductoRelacionado {
  id: string; nombre: string; precio: number; slug: string
  medias: { url: string }[]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>
}) {
  const { tenant, slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('productos')
    .select(`*, medias(url,tipo), variantes(nombre,valores), materiales_luna(nombre,descripcion,precio_extra), tratamientos(nombre,descripcion,precio_extra), medidas_producto(tipo_medida,valor,tipo,url)`)
    .eq('slug', slug)
    .eq('tenant_id', tenant)
    .single()

  if (!data) notFound()

  const producto = data as unknown as Producto

  const { data: relacionados } = await supabase
    .from('productos')
    .select('id, nombre, precio, slug, medias(url)')
    .eq('tenant_id', tenant)
    .eq('estado', 'activo')
    .neq('id', producto.id)
    .limit(4)

  const imagenes = producto.medias ?? []
  const variantes = producto.variantes ?? []
  const materiales = (producto.materiales_luna ?? []) as Material[]
  const tratamientos = (producto.tratamientos ?? []) as Tratamiento[]
  const medidas = producto.medidas_producto ?? []
  const relacionadosList = (relacionados as ProductoRelacionado[] | null) ?? []
  const requierePrescripcion = producto.requiere_prescripcion !== false

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href={`/${tenant}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver a la tienda
          </Link>
          <Link href={`/${tenant}`} className="text-base font-bold text-[#e9c46a] capitalize">{tenant}</Link>
          <Link href={`/${tenant}/carrito`} className="flex items-center gap-2 rounded-lg bg-[#2a9d8f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#239085] transition-colors">
            <ShoppingCart className="h-4 w-4" /> Carrito
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-[#f7f7f7] overflow-hidden border border-[#e1e1e1]">
              {imagenes[0]?.url ? (
                <Image src={imagenes[0].url} alt={producto.nombre} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl">👓</div>
              )}
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagenes.map((img, i) => (
                  <div key={i} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 border-[#e1e1e1] cursor-pointer hover:border-[#2a9d8f] transition-colors">
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">{producto.nombre}</h1>
              <p className="text-3xl font-bold text-[#2a9d8f] mt-2">S/ {Number(producto.precio).toFixed(2)}</p>
            </div>

            {producto.descripcion && (
              <p className="text-sm text-[#4a4a4a] leading-relaxed">{producto.descripcion}</p>
            )}

            {/* Variants */}
            {variantes.length > 0 && (
              <div className="space-y-4">
                {variantes.map(v => (
                  <div key={v.nombre}>
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">{v.nombre}</p>
                    <div className="flex flex-wrap gap-2">
                      {(v.valores ?? []).map(val => (
                        <button key={val} className="rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:border-[#2a9d8f] hover:bg-[#f0fdf9] transition-colors">
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prescription wizard or simple add */}
            {requierePrescripcion ? (
              <PrescripcionWizard
                precioBase={Number(producto.precio)}
                materiales={materiales}
                tratamientos={tratamientos}
                productoId={producto.id}
                nombre={producto.nombre}
              />
            ) : (
              <button className="w-full rounded-xl bg-[#2a9d8f] py-3.5 text-sm font-bold text-white hover:bg-[#239085] transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito — S/ {Number(producto.precio).toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Product description */}
        {producto.descripcion && (
          <section className="mt-14 max-w-3xl">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Descripción</h2>
            <div className="prose prose-sm text-[#4a4a4a] leading-relaxed">
              <p>{producto.descripcion}</p>
            </div>
          </section>
        )}

        {/* Medidas */}
        {medidas.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[#2a9d8f]" /> Medidas del producto
            </h2>
            <div className="rounded-xl border border-[#e1e1e1] overflow-hidden">
              {medidas.some(m => m.tipo === 'tabla') && (
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#f7f7f7] border-b border-[#e1e1e1]">
                    <th className="px-5 py-3 text-left font-semibold text-[#1a1a1a]">Medida</th>
                    <th className="px-5 py-3 text-left font-semibold text-[#1a1a1a]">Valor</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#f1f1f1]">
                    {medidas.filter(m => m.tipo === 'tabla').map((m, i) => (
                      <tr key={i} className="hover:bg-[#fafafa]">
                        <td className="px-5 py-3 font-medium text-[#1a1a1a]">{m.tipo_medida}</td>
                        <td className="px-5 py-3 text-[#4a4a4a]">{m.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {medidas.filter(m => m.tipo === 'foto' && m.url).map((m, i) => (
                <div key={i} className="p-4">
                  <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden">
                    <Image src={m.url!} alt="Tabla de medidas" fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related products */}
        {relacionadosList.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relacionadosList.map(p => (
                <Link key={p.id} href={`/${tenant}/productos/${p.slug}`} className="group rounded-xl border border-[#e1e1e1] bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-[#f7f7f7] flex items-center justify-center overflow-hidden">
                    {p.medias?.[0]?.url ? (
                      <Image src={p.medias[0].url} alt={p.nombre} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : <span className="text-4xl">👓</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-2">{p.nombre}</p>
                    <p className="text-sm font-bold text-[#2a9d8f] mt-1">S/ {Number(p.precio).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
