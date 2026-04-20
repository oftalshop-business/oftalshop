'use client'

import { ShoppingCart, Search, Heart, Filter, ChevronRight, MessageCircle, Trophy } from 'lucide-react'

interface Props {
  nombreTienda?: string
}

const PRODUCTOS_NUEVOS = [
  { id: 1, nombre: 'Aviator Gold', marca: 'Ray-Ban', precio: 299.9, ventas: 234 },
  { id: 2, nombre: 'Wayfarer Dark', marca: 'Ray-Ban', precio: 259.9, ventas: 189 },
  { id: 3, nombre: 'Holbrook XL', marca: 'Oakley', precio: 189.9, ventas: 312 },
  { id: 4, nombre: 'Radar EV Path', marca: 'Oakley', precio: 349.9, ventas: 156 },
  { id: 5, nombre: 'Linea Rossa', marca: 'Prada', precio: 499.9, ventas: 88 },
  { id: 6, nombre: 'Club Ronde', marca: 'Gucci', precio: 559.9, ventas: 102 },
]

const BESTSELLERS = PRODUCTOS_NUEVOS.slice(0, 3)

export default function LensShop({ nombreTienda = 'LENSSHOP' }: Props) {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[#c9a84c] font-black text-lg tracking-tighter">{nombreTienda}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs text-white/60">
            {['Nuevo', 'Hombre', 'Mujer', 'Marcas', 'Sale'].map(n => (
              <span key={n} className="hover:text-[#c9a84c] cursor-pointer transition-colors uppercase tracking-wider">{n}</span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Search className="h-4 w-4 text-white/60 cursor-pointer hover:text-[#c9a84c] transition-colors" />
            <Heart className="h-4 w-4 text-white/60 cursor-pointer hover:text-[#c9a84c] transition-colors" />
            <div className="relative cursor-pointer">
              <ShoppingCart className="h-4 w-4 text-white/60 hover:text-[#c9a84c] transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[8px] flex items-center justify-center font-bold">3</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] overflow-hidden min-h-[280px] flex items-center">
        <div className="px-8 py-16 z-10 relative">
          <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.3em] mb-4">Nueva temporada · 2026</p>
          <h1 className="text-4xl font-black text-white leading-none mb-2">
            VE EL<br />
            <span className="text-[#c9a84c]">MUNDO</span><br />
            DIFERENTE
          </h1>
          <p className="text-xs text-white/40 mt-4 mb-8 max-w-xs">Curación exclusiva de las mejores marcas de eyewear del mundo.</p>
          <div className="flex gap-3">
            <button className="rounded-none bg-[#c9a84c] text-[#0a0a0a] px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-[#d4b05e] transition-colors">
              Comprar
            </button>
            <button className="rounded-none border border-white/20 text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:border-[#c9a84c] transition-colors">
              Lookbook
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-48 flex items-center justify-center text-9xl opacity-5 font-black text-white">
          👓
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-[#c9a84c] shrink-0">
          <Filter className="h-3.5 w-3.5" />
          <span className="font-semibold">Filtrar</span>
        </div>
        {['Todos', 'Ray-Ban', 'Oakley', 'Prada', 'Gucci', 'Tom Ford', 'Saint Laurent'].map(f => (
          <button key={f} className={`shrink-0 text-[10px] border px-3 py-1 transition-colors ${f === 'Todos' ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-white/15 text-white/50 hover:border-white/40'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* New this season */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Nuevo esta temporada</h2>
          <button className="flex items-center gap-1 text-[10px] text-[#c9a84c] uppercase tracking-wider">
            Ver todo <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        {/* Horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-3">
          {PRODUCTOS_NUEVOS.map(p => (
            <div key={p.id} className="group shrink-0 w-36 cursor-pointer">
              <div className="relative bg-[#111] rounded-none h-36 flex items-center justify-center mb-2 overflow-hidden border border-white/5 group-hover:border-[#c9a84c]/40 transition-all">
                <span className="text-4xl opacity-60">👓</span>
                <button className="absolute bottom-2 left-0 right-0 mx-2 bg-[#c9a84c] text-[#0a0a0a] py-1.5 text-[9px] font-black text-center opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                  Quick Add
                </button>
                <Heart className="absolute top-2 right-2 h-3.5 w-3.5 text-white/30 hover:text-[#c9a84c] transition-colors" />
              </div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">{p.marca}</p>
              <p className="text-xs text-white font-semibold mt-0.5">{p.nombre}</p>
              <p className="text-xs text-[#c9a84c] font-bold mt-0.5">S/ {p.precio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook */}
      <section className="px-6 pb-8">
        <h2 className="text-sm font-black uppercase tracking-wider text-white mb-5">Lookbook</h2>
        <div className="grid grid-cols-3 gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`relative bg-[#111] flex items-center justify-center text-5xl opacity-60 border border-white/5 ${i === 0 ? 'col-span-2 row-span-2 h-44' : 'h-20'}`}>
              👓
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <span className="text-[9px] text-white">Ver look</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-6 pb-8 bg-[#111]">
        <div className="flex items-center gap-2 pt-8 mb-5">
          <Trophy className="h-4 w-4 text-[#c9a84c]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Más vendidos</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {BESTSELLERS.map((p, i) => (
            <div key={p.id} className="relative">
              <div className="bg-[#0a0a0a] h-24 flex items-center justify-center text-4xl rounded-none border border-white/5">
                👓
              </div>
              <div className="absolute top-2 left-2 bg-[#c9a84c] text-[#0a0a0a] text-[8px] font-black px-1.5 py-0.5">
                #{i + 1}
              </div>
              <p className="text-[10px] text-white/50 mt-2">{p.marca}</p>
              <p className="text-xs text-white font-semibold">{p.nombre}</p>
              <p className="text-[10px] text-[#c9a84c]">{p.ventas} vendidos</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loyalty */}
      <section className="px-6 py-8 border-t border-white/5">
        <div className="bg-gradient-to-r from-[#c9a84c]/20 to-transparent rounded-none border border-[#c9a84c]/30 p-6">
          <p className="text-[10px] text-[#c9a84c] uppercase tracking-widest mb-2">Programa de lealtad</p>
          <h3 className="text-base font-black text-white mb-1">Gana puntos con cada compra</h3>
          <p className="text-[11px] text-white/50 mb-4">Acumula puntos y canjéalos por descuentos exclusivos.</p>
          <button className="border border-[#c9a84c] text-[#c9a84c] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-colors">
            Unirme al programa
          </button>
        </div>
      </section>

      {/* Chat widget */}
      <div className="fixed bottom-4 right-4 z-50 bg-[#c9a84c] rounded-full p-3 shadow-lg cursor-pointer hover:bg-[#d4b05e] transition-colors">
        <MessageCircle className="h-4 w-4 text-[#0a0a0a]" />
      </div>

      {/* Footer */}
      <footer className="bg-[#050505] text-white px-6 py-10 border-t border-white/5">
        <div className="mb-8 max-w-sm">
          <h3 className="text-lg font-black text-[#c9a84c] tracking-tighter mb-2">{nombreTienda}</h3>
          <p className="text-[11px] text-white/40 mb-4">Suscríbete para acceso anticipado a nuevas colecciones.</p>
          <div className="flex gap-2">
            <input className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[11px] focus:outline-none focus:border-[#c9a84c]" placeholder="Email" />
            <button className="bg-[#c9a84c] text-[#0a0a0a] px-4 py-2 text-[11px] font-black uppercase">
              OK
            </button>
          </div>
        </div>
        <div className="text-center text-[10px] text-white/20 border-t border-white/5 pt-4">
          © 2026 {nombreTienda}
        </div>
      </footer>
    </div>
  )
}
