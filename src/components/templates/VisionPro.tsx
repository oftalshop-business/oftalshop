'use client'

import { ArrowRight, Play, Minus } from 'lucide-react'

interface Props {
  nombreTienda?: string
}

const COLECCIONES = [
  { nombre: 'Titanio · 2026', desc: 'Ligereza redefinida' },
  { nombre: 'Acetato Premium', desc: 'Artesanía italiana' },
  { nombre: 'Sport Performance', desc: 'Para la acción' },
]

const PRODUCTOS = [
  { nombre: 'Alto Adige', precio: '420.00', cat: 'Titanio' },
  { nombre: 'Venezia', precio: '385.00', cat: 'Acetato' },
  { nombre: 'Milano', precio: '450.00', cat: 'Titanio' },
  { nombre: 'Firenze', precio: '390.00', cat: 'Acetato' },
]

const PASOS = [
  { num: '01', titulo: 'Elige tu montura', desc: 'Más de 200 modelos exclusivos.' },
  { num: '02', titulo: 'Graduación personalizada', desc: 'Envía tu receta o agenda tu examen.' },
  { num: '03', titulo: 'Recibe en casa', desc: 'Entrega express en 24–48 horas.' },
]

export default function VisionPro({ nombreTienda = 'VISION PRO' }: Props) {
  return (
    <div className="bg-white text-[#0a0a0a] overflow-y-auto">
      {/* Minimal header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="px-8 py-5 flex items-center justify-center relative">
          <h1 className="text-sm font-black tracking-[0.3em] text-[#0a0a0a] uppercase">{nombreTienda}</h1>
          <button className="absolute right-8 flex items-center gap-2 text-xs text-gray-400">
            <span className="uppercase tracking-widest">Menú</span>
            <div className="flex flex-col gap-1">
              <Minus className="h-2.5 w-10 text-gray-400" />
              <Minus className="h-2.5 w-7 text-gray-400" />
            </div>
          </button>
        </div>
      </header>

      {/* Hero — big product + minimal text */}
      <section className="relative bg-[#f8f8f8] overflow-hidden">
        <div className="flex items-center px-12 py-16 gap-12">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.4em] text-[#0066ff] uppercase mb-6">Colección 2026</p>
            <h2 className="text-5xl font-black leading-none text-[#0a0a0a] mb-6">
              DISEÑADO<br />
              PARA<br />
              <span className="text-[#0066ff]">DURAR</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-8">
              Cada montura nace de la fusión entre tecnología aeroespacial y diseño italiano. Hecho para quienes no aceptan compromisos.
            </p>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 bg-[#0066ff] text-white px-6 py-3 text-xs font-bold tracking-wider uppercase hover:bg-[#0055dd] transition-colors">
                Explorar
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0a0a0a] transition-colors">
                <Play className="h-3.5 w-3.5 fill-current" />
                Ver film
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative h-52 w-52">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0066ff]/10 to-[#0066ff]/5 flex items-center justify-center text-8xl">
                👓
              </div>
              <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[#0066ff] flex items-center justify-center">
                <span className="text-white text-[8px] font-black">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colecciones */}
      <section className="px-8 py-12">
        <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-8">Colecciones</p>
        <div className="grid grid-cols-3 gap-3">
          {COLECCIONES.map((c, i) => (
            <div key={c.nombre} className={`group relative overflow-hidden cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}>
              <div className={`relative ${i === 0 ? 'h-64' : 'h-28'} bg-gradient-to-br ${
                i === 0 ? 'from-[#0a0a0a] to-[#1a1a2e]' :
                i === 1 ? 'from-[#0066ff]/10 to-[#0066ff]/20' :
                'from-gray-100 to-gray-200'
              } flex items-center justify-center text-5xl transition-transform group-hover:scale-105`}>
                👓
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="text-xs font-bold">{c.nombre}</p>
                <p className="text-[10px] text-white/70 flex items-center gap-1 mt-0.5">
                  {c.desc} <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos premium */}
      <section className="px-8 pb-12">
        <div className="flex items-end justify-between mb-8">
          <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase">Selección premium</p>
          <button className="text-xs text-[#0066ff] flex items-center gap-1">Ver todo <ArrowRight className="h-3 w-3" /></button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PRODUCTOS.map(p => (
            <div key={p.nombre} className="group cursor-pointer">
              <div className="relative bg-[#f8f8f8] aspect-square flex items-center justify-center text-5xl overflow-hidden mb-3 group-hover:bg-[#f0f0f0] transition-colors">
                👓
                <div className="absolute bottom-0 left-0 right-0 bg-[#0066ff] text-white text-[9px] font-bold text-center py-1.5 translate-y-full group-hover:translate-y-0 transition-transform uppercase tracking-wider">
                  Agregar
                </div>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{p.cat}</p>
              <p className="text-xs font-bold text-[#0a0a0a] mt-0.5">{p.nombre}</p>
              <p className="text-xs text-[#0066ff] mt-0.5">S/ {p.precio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="grid grid-cols-2 items-center">
        <div className="bg-[#0a0a0a] h-64 flex items-center justify-center text-7xl">👓</div>
        <div className="px-10 py-10">
          <p className="text-[10px] tracking-[0.4em] text-[#0066ff] uppercase mb-4">Nuestra historia</p>
          <h3 className="text-xl font-black text-[#0a0a0a] leading-tight mb-4">
            Treinta años de obsesión por la perfección
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Fundados en 1994 en Milán, hemos trabajado con los mejores maestros ópticos del mundo para crear piezas que trascienden el tiempo.
          </p>
          <button className="text-xs text-[#0066ff] flex items-center gap-1 font-bold uppercase tracking-wider">
            Leer más <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-8 py-14 bg-[#f8f8f8]">
        <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase text-center mb-10">Cómo funciona</p>
        <div className="grid grid-cols-3 gap-8">
          {PASOS.map(p => (
            <div key={p.num} className="text-center">
              <p className="text-4xl font-black text-[#0066ff]/20 mb-3">{p.num}</p>
              <p className="text-xs font-black text-[#0a0a0a] uppercase tracking-wider mb-2">{p.titulo}</p>
              <p className="text-[11px] text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios (sin estrellas — más premium) */}
      <section className="px-12 py-14">
        <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase text-center mb-10">Voces de nuestros clientes</p>
        <div className="grid grid-cols-2 gap-8">
          {[
            { quote: '"Las mejores gafas que he tenido en mis 40 años. La diferencia se siente desde el primer segundo."', autor: '— Alejandro V., Arquitecto' },
            { quote: '"Un producto que refleja perfectamente mi forma de entender el diseño: sin concesiones."', autor: '— Isabella M., Diseñadora' },
          ].map(t => (
            <div key={t.autor} className="border-l-2 border-[#0066ff] pl-6">
              <p className="text-sm text-[#0a0a0a] italic leading-relaxed mb-4">{t.quote}</p>
              <p className="text-[11px] text-gray-400">{t.autor}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-[#0a0a0a] text-white px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-black tracking-[0.3em] text-[#0066ff] mb-3">{nombreTienda}</p>
            <p className="text-[11px] text-white/30 max-w-xs">Gafas de diseño para personas extraordinarias.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Newsletter</p>
            <div className="flex gap-2">
              <input className="bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none" placeholder="Tu email" />
              <button className="bg-[#0066ff] px-4 py-2 text-xs font-bold">→</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 text-center text-[10px] text-white/20">
          © 2026 {nombreTienda}
        </div>
      </footer>
    </div>
  )
}
