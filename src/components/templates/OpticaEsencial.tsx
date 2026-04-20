'use client'

import { ShoppingCart, Search, Menu, Star, ChevronRight, Mail } from 'lucide-react'

interface Props {
  nombreTienda?: string
  scale?: number
}

const PRODUCTOS = [
  { id: 1, nombre: 'Montura Clásica', precio: 89.9, badge: null },
  { id: 2, nombre: 'Lentes UV400', precio: 120.0, badge: 'Nuevo' },
  { id: 3, nombre: 'Armazón Titanio', precio: 199.9, badge: null },
  { id: 4, nombre: 'Clip-on Solar', precio: 65.0, badge: 'Oferta' },
]

const CATEGORIAS = ['Monturas', 'Lentes de sol', 'Contacto', 'Accesorios']
const MARCAS = ['Ray-Ban', 'Oakley', 'Prada', 'Gucci', 'Cartier']

export default function OpticaEsencial({ nombreTienda = 'ÓpticaShop' }: Props) {
  return (
    <div className="bg-white text-[#1a1a1a] text-sm font-sans overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#00a651] flex items-center justify-center">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            <span className="font-bold text-base text-[#1a1a1a]">{nombreTienda}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs text-gray-600">
            {['Inicio', 'Productos', 'Marcas', 'Ofertas', 'Nosotros'].map(n => (
              <span key={n} className="hover:text-[#00a651] cursor-pointer transition-colors">{n}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-gray-500 cursor-pointer" />
            <div className="relative cursor-pointer">
              <ShoppingCart className="h-4 w-4 text-gray-500" />
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-[#00a651] text-white text-[8px] flex items-center justify-center">2</span>
            </div>
            <Menu className="h-4 w-4 text-gray-500 md:hidden" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] overflow-hidden">
        <div className="px-8 py-14">
          <p className="text-xs font-semibold text-[#00a651] uppercase tracking-widest mb-2">Colección 2026</p>
          <h1 className="text-3xl font-bold text-[#1a1a1a] leading-tight mb-3">
            Ve el mundo<br />con claridad
          </h1>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Más de 500 monturas y lentes de las mejores marcas mundiales.
          </p>
          <div className="flex gap-3">
            <button className="rounded-full bg-[#00a651] text-white px-5 py-2 text-xs font-bold hover:bg-[#009244] transition-colors">
              Comprar ahora
            </button>
            <button className="rounded-full border border-gray-300 text-gray-700 px-5 py-2 text-xs font-medium hover:border-[#00a651] transition-colors">
              Ver colección
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-40 flex items-center justify-center text-8xl opacity-20">
          👓
        </div>
      </div>

      {/* Categories */}
      <div className="bg-[#00a651] px-6 py-3">
        <div className="flex gap-1 overflow-x-auto">
          {CATEGORIAS.map(c => (
            <button key={c} className="shrink-0 rounded-full bg-white/20 text-white px-4 py-1 text-xs font-medium hover:bg-white/30 transition-colors">
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-base text-[#1a1a1a]">Productos destacados</h2>
          <button className="flex items-center gap-1 text-xs text-[#00a651] font-medium">
            Ver todos <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {PRODUCTOS.map(p => (
            <div key={p.id} className="group rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative bg-gray-50 h-28 flex items-center justify-center text-4xl">
                👓
                {p.badge && (
                  <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.badge === 'Oferta' ? 'bg-red-100 text-red-600' : 'bg-[#00a651] text-white'}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-1">{p.nombre}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold text-[#00a651]">S/ {p.precio}</span>
                  <button className="rounded-lg bg-[#00a651] text-white p-1">
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offers banner */}
      <section className="mx-6 mb-6 rounded-2xl bg-gradient-to-r from-[#1a1a1a] to-[#333] p-6 text-white">
        <p className="text-xs font-semibold text-[#00a651] uppercase tracking-wider mb-1">Oferta especial</p>
        <h3 className="text-lg font-bold mb-1">30% OFF en lentes de sol</h3>
        <p className="text-xs text-white/70 mb-4">Oferta válida hasta agotar stock</p>
        <div className="flex gap-2">
          {['02', '14', '38'].map((n, i) => (
            <div key={i} className="text-center">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-lg font-bold">{n}</div>
              <p className="text-[9px] text-white/50 mt-0.5">{['Días', 'Hrs', 'Min'][i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="px-6 py-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center uppercase tracking-wider mb-4">Marcas disponibles</p>
        <div className="flex items-center justify-around">
          {MARCAS.map(m => (
            <span key={m} className="text-xs font-bold text-gray-300">{m}</span>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 px-6 py-8 text-center">
        <Mail className="h-6 w-6 text-[#00a651] mx-auto mb-2" />
        <h3 className="font-bold text-sm mb-1">Suscríbete y obtén 10% OFF</h3>
        <p className="text-xs text-gray-500 mb-4">Recibe las últimas colecciones y ofertas exclusivas.</p>
        <div className="flex max-w-xs mx-auto gap-2">
          <input
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-xs focus:outline-none focus:border-[#00a651]"
            placeholder="tu@email.com"
          />
          <button className="rounded-full bg-[#00a651] text-white px-4 py-2 text-xs font-bold">
            Unirse
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white px-6 py-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { title: nombreTienda, items: ['Inicio', 'Sobre nosotros', 'Blog', 'Contacto'] },
            { title: 'Productos', items: ['Monturas', 'Lentes de sol', 'Contacto', 'Accesorios'] },
            { title: 'Ayuda', items: ['Envíos', 'Devoluciones', 'Garantía', 'FAQ'] },
            { title: 'Síguenos', items: ['Instagram', 'Facebook', 'TikTok', 'YouTube'] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-bold text-white mb-3">{col.title}</p>
              {col.items.map(item => (
                <p key={item} className="text-[11px] text-gray-400 mb-1.5 hover:text-white cursor-pointer">{item}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 text-center text-[11px] text-gray-500">
          © 2026 {nombreTienda} · Todos los derechos reservados
        </div>
      </footer>
    </div>
  )
}
