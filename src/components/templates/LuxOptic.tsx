'use client'

import { ShoppingBag, X, Shield, Zap, Wind, Sun } from 'lucide-react'

interface Props {
  nombreTienda?: string
}

const CATEGORIAS = [
  { nombre: 'PERFORMANCE', desc: 'Máximo rendimiento atlético', emoji: '🏃' },
  { nombre: 'LIFESTYLE', desc: 'Estilo sin compromisos', emoji: '🌆' },
  { nombre: 'POLARIZED', desc: 'Protección superior UV', emoji: '☀️' },
]

const PRODUCTOS = [
  { nombre: 'RADAR EV XS', coleccion: 'Performance', precio: '349', specs: 'Prizm™ Lens · O Matter™' },
  { nombre: 'FROGSKINS', coleccion: 'Lifestyle', precio: '189', specs: 'Unobtainium® · Icon Emblem' },
  { nombre: 'HOLBROOK TI', coleccion: 'Titanio', precio: '459', specs: 'Titanium · HDPolarized™' },
]

const SPECS = [
  { icono: Shield, titulo: 'Protección UV400', desc: 'Bloqueo total rayos UVA/UVB' },
  { icono: Zap, titulo: 'Prizm Technology', desc: 'Contraste y claridad extremos' },
  { icono: Wind, titulo: 'O Matter™ Frame', desc: 'Ultraligero e irrompible' },
  { icono: Sun, titulo: 'HDPolarized™', desc: 'Eliminación total del deslumbramiento' },
]

export default function LuxOptic({ nombreTienda = 'LUXOPTIC' }: Props) {
  return (
    <div className="bg-[#000] text-white overflow-y-auto">
      {/* Announcement bar */}
      <div className="bg-[#e63946] text-white text-center py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
        Envío gratis en pedidos mayores a S/ 200
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#000] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/40 uppercase tracking-widest hidden md:block">Performance · Style · Vision</span>
          <h1 className="text-xl font-black tracking-[0.2em] text-white uppercase">{nombreTienda}</h1>
          <div className="flex items-center gap-4">
            <button className="relative">
              <ShoppingBag className="h-5 w-5 text-white/70 hover:text-[#e63946] transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-[#e63946] rounded-full text-[8px] flex items-center justify-center font-bold">2</span>
            </button>
          </div>
        </div>
        <nav className="flex items-center justify-center gap-8 mt-3 text-[10px] text-white/50 uppercase tracking-[0.2em]">
          {['Hombre', 'Mujer', 'Sport', 'Polarizados', 'Nuevos', 'Sale'].map(n => (
            <span key={n} className="cursor-pointer hover:text-[#e63946] transition-colors">{n}</span>
          ))}
        </nav>
      </header>

      {/* Hero — full video placeholder */}
      <div className="relative bg-gradient-to-b from-[#111] to-[#000] overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
          <p className="text-[9px] text-[#e63946] uppercase tracking-[0.5em] mb-6">Nueva colección 2026</p>
          <h2 className="text-5xl font-black leading-none uppercase mb-2 text-white">
            SEE THE WORLD
          </h2>
          <h2 className="text-5xl font-black leading-none uppercase mb-8 text-[#e63946]">
            DIFFERENTLY
          </h2>
          <div className="text-8xl mb-8 opacity-70">👓</div>
          <div className="flex gap-4">
            <button className="bg-[#e63946] text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#c93040] transition-colors">
              Comprar ahora
            </button>
            <button className="border border-white/30 text-white px-8 py-3 text-xs uppercase tracking-widest hover:border-white transition-colors">
              Ver film
            </button>
          </div>
        </div>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5 text-[200px] flex items-center justify-center font-black text-white select-none">
          OAK
        </div>
      </div>

      {/* Categories full bleed */}
      <section className="grid grid-cols-3 gap-0.5">
        {CATEGORIAS.map(c => (
          <div key={c.nombre} className="relative bg-[#111] h-40 flex flex-col items-center justify-center group cursor-pointer overflow-hidden border-r border-white/5 last:border-0">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{c.nombre}</p>
            <p className="text-[9px] text-white/40 mt-0.5">{c.desc}</p>
            <div className="absolute inset-0 bg-[#e63946]/0 group-hover:bg-[#e63946]/10 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e63946] scale-x-0 group-hover:scale-x-100 transition-transform" />
          </div>
        ))}
      </section>

      {/* Productos — fondo negro */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">Featured</h2>
          <span className="text-[10px] text-[#e63946] uppercase tracking-widest cursor-pointer">All products →</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {PRODUCTOS.map(p => (
            <div key={p.nombre} className="group cursor-pointer">
              <div className="relative bg-[#111] h-36 flex items-center justify-center text-5xl overflow-hidden border border-white/5 group-hover:border-[#e63946]/50 transition-all">
                👓
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button className="absolute bottom-3 left-3 right-3 bg-[#e63946] text-white text-[9px] font-black py-1.5 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Add to bag
                </button>
              </div>
              <div className="pt-3">
                <p className="text-[9px] text-[#e63946] uppercase tracking-widest">{p.coleccion}</p>
                <p className="text-xs font-black tracking-wider mt-0.5">{p.nombre}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{p.specs}</p>
                <p className="text-sm font-black text-white mt-1">S/ {p.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tecnología */}
      <section className="bg-[#0a0a0a] border-t border-white/5 px-6 py-10">
        <p className="text-[10px] text-[#e63946] uppercase tracking-[0.3em] text-center mb-8">Tecnología exclusiva</p>
        <div className="grid grid-cols-4 gap-4">
          {SPECS.map(s => {
            const Icono = s.icono
            return (
              <div key={s.titulo} className="text-center">
                <div className="h-10 w-10 border border-[#e63946]/40 mx-auto flex items-center justify-center mb-3">
                  <Icono className="h-4.5 w-4.5 text-[#e63946]" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white mb-1">{s.titulo}</p>
                <p className="text-[9px] text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Embajadores */}
      <section className="px-6 py-10">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] text-center mb-8">Embajadores</p>
        <div className="grid grid-cols-3 gap-2">
          {['🏊', '🏄', '🚴'].map((emoji, i) => (
            <div key={i} className="relative bg-[#111] h-32 flex items-center justify-center text-5xl overflow-hidden group cursor-pointer">
              {emoji}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-[9px] font-black text-white">{['NATACIÓN', 'SURF', 'CICLISMO'][i]}</p>
              </div>
              {/* BW effect overlay */}
              <div className="absolute inset-0 bg-[#000]/40 group-hover:bg-transparent transition-colors" style={{ mixBlendMode: 'color' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000] border-t border-white/5 px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-base font-black tracking-[0.2em] text-[#e63946] mb-2">{nombreTienda}</h3>
            <p className="text-[11px] text-white/30 max-w-xs">Performance eyewear for champions.</p>
          </div>
          <div className="flex gap-6 text-[10px] text-white/40 uppercase tracking-widest">
            {['Store', 'Support', 'Warranty', 'Athletes'].map(l => (
              <span key={l} className="cursor-pointer hover:text-[#e63946] transition-colors">{l}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 text-center text-[10px] text-white/20">
          © 2026 {nombreTienda} · All Rights Reserved
        </div>
      </footer>
    </div>
  )
}
