'use client'

import { Phone, Clock, MapPin, ChevronRight, Award, Users, Calendar, FileText, Microscope, Eye, Activity, Heart, Star, Mail } from 'lucide-react'

interface Props {
  nombreTienda?: string
}

const ESPECIALIDADES = [
  { icono: Eye, nombre: 'Oftalmología General', desc: 'Diagnóstico y tratamiento integral' },
  { icono: Activity, nombre: 'Cirugía Refractiva', desc: 'LASIK, PRK, SMILE' },
  { icono: Microscope, nombre: 'Retina y Vítreo', desc: 'Subespecialización avanzada' },
  { icono: Heart, nombre: 'Glaucoma', desc: 'Diagnóstico y control' },
  { icono: Users, nombre: 'Oftalmología Pediátrica', desc: 'Para los más pequeños' },
  { icono: Award, nombre: 'Córnea y Segmento Anterior', desc: 'Trasplantes y tratamientos' },
]

const DOCTORES = [
  { nombre: 'Dr. Roberto Hidalgo', esp: 'Cirugía Refractiva', univ: 'UPCH', foto: '👨‍⚕️' },
  { nombre: 'Dra. Patricia Lozano', esp: 'Retina y Vítreo', univ: 'PUCP', foto: '👩‍⚕️' },
  { nombre: 'Dr. Andrés Vásquez', esp: 'Glaucoma', univ: 'UNFV', foto: '👨‍⚕️' },
  { nombre: 'Dra. Cecilia Quispe', esp: 'Pediátrica', univ: 'USMP', foto: '👩‍⚕️' },
]

const SLIDES = [
  { titulo: 'Cirugía LASIK sin lentes', sub: 'Tecnología de última generación' },
  { titulo: 'Cataratas con LIO Premium', sub: 'Visión nítida para siempre' },
  { titulo: 'Centro de Retina', sub: 'Diagnóstico avanzado OCT' },
]

export default function MedCenterPro({ nombreTienda = 'MedCenter Pro' }: Props) {
  return (
    <div className="bg-white text-[#1a1a1a] overflow-y-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Barra superior */}
      <div className="bg-[#003366] text-white px-6 py-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> Central: (01) 610-0000</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Emergencias 24/7</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Lima · San Isidro · Miraflores</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60">|</span>
            <span className="cursor-pointer hover:text-blue-200">Portal Paciente</span>
            <span className="cursor-pointer hover:text-blue-200">Médicos</span>
            <span className="cursor-pointer hover:text-blue-200">Corporativo</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#003366] rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-[#003366] text-sm uppercase tracking-wide">{nombreTienda}</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Centro Oftalmológico Corporativo</p>
            </div>
          </div>

          {/* Mega menú */}
          <nav className="hidden md:flex items-center gap-1 text-[11px]">
            {['Especialidades', 'Doctores', 'Tecnología', 'Pacientes', 'Investigación', 'Tienda'].map(n => (
              <div key={n} className="relative group">
                <button className="px-3 py-2 text-gray-600 hover:text-[#003366] hover:bg-blue-50 flex items-center gap-0.5 transition-colors">
                  {n}
                  <ChevronRight className="h-2.5 w-2.5 rotate-90 opacity-40" />
                </button>
              </div>
            ))}
          </nav>

          <button className="flex items-center gap-2 bg-[#003366] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#002855] transition-colors rounded-sm">
            <Calendar className="h-3.5 w-3.5" />
            Cita en línea
          </button>
        </div>
      </header>

      {/* Slider hero */}
      <div className="relative bg-gradient-to-r from-[#003366] to-[#004499] text-white overflow-hidden">
        <div className="px-8 py-14 max-w-2xl">
          <div className="flex gap-1.5 mb-5">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest mb-3">Hospital Oftalmológico</p>
          <h1 className="text-3xl font-black mb-3 leading-tight">
            {SLIDES[0].titulo}
          </h1>
          <p className="text-sm text-blue-200 mb-6">{SLIDES[0].sub}</p>
          <div className="flex gap-3">
            <button className="bg-white text-[#003366] px-5 py-2.5 text-xs font-bold hover:bg-blue-50 transition-colors">
              Más información
            </button>
            <button className="border border-white/30 text-white px-5 py-2.5 text-xs hover:bg-white/10 transition-colors">
              Ver todos los servicios
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-52 bg-[#003366]/50 flex items-center justify-center text-8xl opacity-20">🏥</div>
      </div>

      {/* Estadísticas */}
      <div className="bg-[#f8f9fa] border-y border-gray-200 px-6 py-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            ['20,000+', 'Pacientes atendidos', '👥'],
            ['15+', 'Años de excelencia', '🏆'],
            ['98%', 'Satisfacción del paciente', '⭐'],
            ['50+', 'Especialistas certificados', '👨‍⚕️'],
          ].map(([n, l, e]) => (
            <div key={l} className="py-2">
              <p className="text-2xl font-black text-[#003366]">{n}</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Especialidades */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-lg font-black text-[#003366]">Especialidades médicas</h2>
            <p className="text-xs text-gray-400 mt-0.5">Atención subespecializada de alto nivel</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-[#003366] font-semibold border border-[#003366] px-3 py-1.5 hover:bg-[#003366] hover:text-white transition-colors">
            Ver todas <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ESPECIALIDADES.map(e => {
            const Icono = e.icono
            return (
              <div key={e.nombre} className="group border border-gray-100 p-4 hover:border-[#003366] hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-[#eaf0fa] flex items-center justify-center shrink-0 group-hover:bg-[#003366] transition-colors">
                    <Icono className="h-5 w-5 text-[#003366] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">{e.nombre}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{e.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tecnología */}
      <section className="bg-[#003366] text-white px-6 py-10">
        <div className="text-center mb-7">
          <h2 className="text-lg font-black mb-1">Tecnología de vanguardia</h2>
          <p className="text-xs text-blue-200">Equipos de última generación para diagnóstico y cirugía</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { titulo: 'OCT Spectralis', desc: 'Tomografía óptica de alta resolución' },
            { titulo: 'ZEISS VISUMAX®', desc: 'Cirugía refractiva de femtosegundo' },
            { titulo: 'LIO Multifocal', desc: 'Implantes intraoculares premium' },
          ].map(t => (
            <div key={t.titulo} className="border border-blue-400/30 p-5">
              <div className="text-3xl mb-3 opacity-60">🔬</div>
              <p className="text-xs font-bold mb-1">{t.titulo}</p>
              <p className="text-[10px] text-blue-200">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo médico */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-lg font-black text-[#003366]">Equipo médico</h2>
          <button className="text-xs text-[#003366] font-semibold flex items-center gap-1">
            Ver todos <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {DOCTORES.map(d => (
            <div key={d.nombre} className="border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-[#f0f5ff] h-24 flex items-center justify-center text-4xl">{d.foto}</div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#1a1a1a]">{d.nombre}</p>
                <p className="text-[10px] text-[#003366] mt-0.5">{d.esp}</p>
                <p className="text-[10px] text-gray-400">{d.univ}</p>
                <button className="mt-2 w-full border border-[#003366] text-[#003366] py-1 text-[9px] font-semibold hover:bg-[#003366] hover:text-white transition-colors">
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Acreditaciones */}
      <section className="bg-[#f8f9fa] border-y border-gray-200 px-6 py-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-4">Acreditaciones y certificaciones</p>
        <div className="flex items-center justify-around">
          {['JCI', 'ISO 9001:2015', 'SINEACE', 'CONAREME', 'AAO Fellow'].map(c => (
            <div key={c} className="text-center">
              <div className="h-10 w-10 border-2 border-[#003366] rounded-full flex items-center justify-center mx-auto mb-1">
                <Award className="h-4.5 w-4.5 text-[#003366]" />
              </div>
              <p className="text-[9px] font-bold text-[#003366]">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-[#003366]">Noticias y blog</h2>
          <button className="text-xs text-[#003366] flex items-center gap-1 font-semibold">Ver todo <ChevronRight className="h-3 w-3" /></button>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[
            { titulo: 'Nuevos avances en cirugía LASIK 2026', cat: 'Tecnología', fecha: '15 Abr 2026' },
            { titulo: 'Cómo prevenir la miopía en niños', cat: 'Pediatría', fecha: '10 Abr 2026' },
            { titulo: 'Síntomas del glaucoma que no debes ignorar', cat: 'Salud Visual', fecha: '5 Abr 2026' },
          ].map(a => (
            <div key={a.titulo} className="group cursor-pointer">
              <div className="bg-[#eaf0fa] h-28 flex items-center justify-center text-5xl mb-3 group-hover:bg-[#dce8f8] transition-colors">📰</div>
              <p className="text-[9px] text-[#003366] font-semibold uppercase tracking-wider">{a.cat}</p>
              <p className="text-xs font-bold text-[#1a1a1a] mt-1 line-clamp-2 group-hover:text-[#003366] transition-colors">{a.titulo}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><FileText className="h-3 w-3" />{a.fecha}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer institucional */}
      <footer className="bg-[#002855] text-white px-6 py-10">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-white/10 rounded flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-black uppercase tracking-wide">{nombreTienda}</p>
            </div>
            <p className="text-[11px] text-blue-200 leading-relaxed">
              Centro oftalmológico de referencia con más de 15 años de excelencia médica.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3">Especialidades</p>
            {['Cirugía Refractiva', 'Retina', 'Glaucoma', 'Pediatría', 'Córnea'].map(e => (
              <p key={e} className="text-[11px] text-blue-200 mb-1.5 hover:text-white cursor-pointer">{e}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3">Pacientes</p>
            {['Agendar cita', 'Portal paciente', 'Resultados', 'Seguros', 'Emergencias'].map(e => (
              <p key={e} className="text-[11px] text-blue-200 mb-1.5 hover:text-white cursor-pointer">{e}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3">Contacto</p>
            <div className="space-y-2 text-[11px] text-blue-200">
              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> (01) 610-0000</p>
              <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@medcenter.pe</p>
              <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Av. Javier Prado 530</p>
              <p className="flex items-center gap-1.5 text-[#e63946] font-semibold"><Clock className="h-3 w-3" /> Emergencias 24h</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-blue-300">
          <span>© 2026 {nombreTienda} · Todos los derechos reservados</span>
          <div className="flex gap-3">
            <span className="cursor-pointer hover:text-white">Privacidad</span>
            <span className="cursor-pointer hover:text-white">Términos</span>
            <span className="cursor-pointer hover:text-white">Acreditaciones</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
