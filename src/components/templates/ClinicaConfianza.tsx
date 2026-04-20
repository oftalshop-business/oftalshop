'use client'

import { Phone, MapPin, Clock, Star, ChevronRight, Calendar, Heart, Eye, Microscope, Stethoscope, Activity, AlertCircle } from 'lucide-react'

interface Props {
  nombreTienda?: string
}

const SERVICIOS = [
  { icono: Eye, nombre: 'Examen Visual', desc: 'Evaluación completa de agudeza visual' },
  { icono: Activity, nombre: 'Cirugía LASIK', desc: 'Corrección láser permanente' },
  { icono: Heart, nombre: 'Lentes de contacto', desc: 'Adaptación personalizada' },
  { icono: Microscope, nombre: 'Tratamientos', desc: 'Terapia visual avanzada' },
  { icono: Stethoscope, nombre: 'Optometría', desc: 'Diagnóstico clínico especializado' },
  { icono: AlertCircle, nombre: 'Urgencias', desc: 'Atención inmediata 24h' },
]

const DOCTORES = [
  { nombre: 'Dra. Carmen Rojas', esp: 'Oftalmología', años: 15 },
  { nombre: 'Dr. Miguel Torres', esp: 'Optometría', años: 12 },
  { nombre: 'Dra. Sofía Ávila', esp: 'Cirugía Láser', años: 18 },
]

const TESTIMONIOS = [
  { autor: 'María G.', texto: 'La mejor clínica que he visitado. El Dr. Torres me atendió de manera excepcional.', estrellas: 5 },
  { autor: 'Carlos M.', texto: 'La cirugía LASIK cambió mi vida. Resultados perfectos desde el primer día.', estrellas: 5 },
  { autor: 'Ana P.', texto: 'Profesionalismo y calidez humana. Los recomiendo ampliamente.', estrellas: 5 },
]

export default function ClinicaConfianza({ nombreTienda = 'Clínica Óptica' }: Props) {
  return (
    <div className="bg-white text-[#1a1a1a] overflow-y-auto" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Top bar */}
      <div className="bg-[#1e40af] text-white px-6 py-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +51 (01) 234-5678</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Lun–Sáb 8:00–20:00</span>
          </div>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Lima, Perú</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-blue-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1e40af] flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1e40af] text-base" style={{ fontFamily: 'Georgia, serif' }}>{nombreTienda}</p>
              <p className="text-[10px] text-gray-400">Centro Oftalmológico Especializado</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-xs text-gray-600">
            {['Inicio', 'Servicios', 'Doctores', 'Blog', 'Tienda', 'Contacto'].map(n => (
              <span key={n} className="hover:text-[#1e40af] cursor-pointer">{n}</span>
            ))}
          </nav>
          <button className="rounded-full bg-[#1e40af] text-white px-4 py-2 text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Agendar cita
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white overflow-hidden">
        <div className="px-8 py-16">
          <p className="text-xs font-medium text-blue-200 uppercase tracking-widest mb-3">Centro médico especializado</p>
          <h1 className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Tu visión es<br />nuestra misión
          </h1>
          <p className="text-sm text-blue-200 mb-8 max-w-xs leading-relaxed">
            Contamos con tecnología de vanguardia y un equipo de especialistas certificados para cuidar tu salud visual.
          </p>
          <div className="flex gap-3">
            <button className="rounded-full bg-white text-[#1e40af] px-5 py-2.5 text-xs font-bold hover:bg-blue-50">
              Agendar cita
            </button>
            <button className="rounded-full border border-white/40 text-white px-5 py-2.5 text-xs">
              Nuestros servicios
            </button>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-10">🏥</div>
      </div>

      {/* Stats */}
      <div className="bg-[#f8faff] border-y border-blue-100 px-6 py-5">
        <div className="grid grid-cols-4 gap-4 text-center">
          {[['15,000+', 'Pacientes'], ['18', 'Años exp.'], ['98%', 'Satisfacción'], ['12', 'Especialistas']].map(([n, l]) => (
            <div key={l}>
              <p className="text-xl font-bold text-[#1e40af]">{n}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="px-6 py-10">
        <div className="text-center mb-7">
          <h2 className="text-xl font-bold text-[#1e40af]" style={{ fontFamily: 'Georgia, serif' }}>Nuestros servicios</h2>
          <p className="text-xs text-gray-500 mt-1.5">Atención especializada para toda la familia</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SERVICIOS.map(s => {
            const Icono = s.icono
            return (
              <div key={s.nombre} className="group rounded-xl border border-blue-100 p-4 hover:border-[#1e40af] hover:shadow-sm transition-all cursor-pointer">
                <div className="h-9 w-9 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-3 group-hover:bg-[#1e40af] transition-colors">
                  <Icono className="h-4.5 w-4.5 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs font-bold text-[#1a1a1a] mb-1">{s.nombre}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Doctors */}
      <section className="bg-[#f8faff] px-6 py-10">
        <div className="text-center mb-7">
          <h2 className="text-xl font-bold text-[#1e40af]" style={{ fontFamily: 'Georgia, serif' }}>Nuestro equipo</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {DOCTORES.map(d => (
            <div key={d.nombre} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-blue-50">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1e40af] to-[#3b82f6] mx-auto mb-3 flex items-center justify-center text-xl text-white">
                👨‍⚕️
              </div>
              <p className="text-xs font-bold text-[#1a1a1a]">{d.nombre}</p>
              <p className="text-[10px] text-[#1e40af] mt-0.5">{d.esp}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{d.años} años de experiencia</p>
              <button className="mt-3 w-full rounded-full bg-[#eff6ff] text-[#1e40af] py-1.5 text-[10px] font-medium hover:bg-[#1e40af] hover:text-white transition-colors">
                Ver perfil
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-bold text-[#1e40af] text-center mb-7" style={{ fontFamily: 'Georgia, serif' }}>
          Lo que dicen nuestros pacientes
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {TESTIMONIOS.map(t => (
            <div key={t.autor} className="rounded-2xl border border-blue-100 p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic mb-3">"{t.texto}"</p>
              <p className="text-xs font-bold text-[#1a1a1a]">{t.autor}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e40af] text-white px-6 py-8">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="font-bold text-sm mb-3">{nombreTienda}</p>
            <p className="text-[11px] text-blue-200 leading-relaxed">
              Centro médico oftalmológico con tecnología de vanguardia y más de 18 años de experiencia.
            </p>
          </div>
          <div>
            <p className="font-bold text-xs mb-3 uppercase tracking-wide">Contacto</p>
            <div className="space-y-1.5 text-[11px] text-blue-200">
              <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> +51 (01) 234-5678</p>
              <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Av. La Mar 123, Lima</p>
              <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Lun–Sáb 8:00–20:00</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-xs mb-3 uppercase tracking-wide">Certificaciones</p>
            <div className="flex flex-wrap gap-1.5">
              {['SINEACE', 'ISO 9001', 'JCI', 'COLEGIO MÉDICO'].map(c => (
                <span key={c} className="text-[9px] border border-blue-300/50 rounded px-1.5 py-0.5">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 text-center text-[10px] text-blue-300">
          © 2026 {nombreTienda} · Todos los derechos reservados
        </div>
      </footer>
    </div>
  )
}
