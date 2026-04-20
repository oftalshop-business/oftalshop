import Link from 'next/link'
import { CheckCircle2, Eye, Package, Users, BarChart2, Globe, Shield, ChevronRight, Star } from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'Catálogo óptico completo',
    description: 'Gestiona armazones, lentes de contacto, cristales y soluciones con variantes por graduación, material y tratamiento.',
  },
  {
    icon: Users,
    title: 'Expedientes de clientes',
    description: 'Historial de compras, prescripciones y seguimiento personalizado para cada paciente de tu óptica.',
  },
  {
    icon: BarChart2,
    title: 'Informes y analytics',
    description: 'Visualiza ventas por producto, canal y período. Toma decisiones basadas en datos reales de tu negocio.',
  },
  {
    icon: Globe,
    title: 'Tienda online propia',
    description: 'Tu dominio, tu marca. Vende en línea las 24h con un carrito optimizado para productos ópticos.',
  },
  {
    icon: Eye,
    title: 'Gestión de prescripciones',
    description: 'Registra y consulta los datos ópticos de tus pacientes: esfera, cilindro, eje, adición y más.',
  },
  {
    icon: Shield,
    title: 'Seguro y conforme',
    description: 'Datos encriptados, copias de seguridad automáticas y cumplimiento con regulaciones de salud.',
  },
]

const plans = [
  {
    name: 'Básico',
    price: '$19',
    period: '/mes',
    description: 'Para ópticas pequeñas que están comenzando.',
    color: 'border-[#e1e1e1]',
    badge: '',
    features: [
      'Hasta 100 productos',
      '1 usuario',
      'Tienda online incluida',
      'Informes básicos',
      'Soporte por email',
    ],
    cta: 'Comenzar gratis',
    ctaClass: 'border border-[#1e40af] text-[#1e40af] hover:bg-blue-50',
  },
  {
    name: 'Profesional',
    price: '$49',
    period: '/mes',
    description: 'El plan más popular para ópticas en crecimiento.',
    color: 'border-[#1e40af] ring-2 ring-[#1e40af]/20',
    badge: 'Más popular',
    features: [
      'Productos ilimitados',
      'Hasta 5 usuarios',
      'Tienda online incluida',
      'Informes avanzados',
      'Gestión de prescripciones',
      'Marketing por email',
      'Soporte prioritario',
    ],
    cta: 'Comenzar gratis',
    ctaClass: 'bg-[#1e40af] text-white hover:bg-[#1d3a9e]',
  },
  {
    name: 'Empresa',
    price: '$99',
    period: '/mes',
    description: 'Para cadenas y laboratorios ópticos.',
    color: 'border-[#e1e1e1]',
    badge: '',
    features: [
      'Todo en Profesional',
      'Usuarios ilimitados',
      'Multi-sucursal',
      'API e integraciones',
      'Administrador de cuenta',
      'SLA 99.9% uptime',
      'Soporte 24/7',
    ],
    cta: 'Contactar ventas',
    ctaClass: 'border border-[#1e40af] text-[#1e40af] hover:bg-blue-50',
  },
]

const testimonials = [
  {
    name: 'Dra. Patricia Herrera',
    role: 'Directora, Óptica Visión Clara — CDMX',
    avatar: 'PH',
    text: 'OftalShop transformó nuestra óptica. El módulo de prescripciones nos ahorra horas de trabajo y nuestros clientes adoran la tienda online.',
    stars: 5,
  },
  {
    name: 'Ing. Marco Domínguez',
    role: 'CEO, Grupo Óptico Norte — Monterrey',
    avatar: 'MD',
    text: 'Migramos 3 sucursales a OftalShop en una semana. El soporte fue excelente y las ventas online crecieron un 40% en el primer mes.',
    stars: 5,
  },
  {
    name: 'Lic. Sandra Ruiz',
    role: 'Gerente, Laboratorio Óptico Sur',
    avatar: 'SR',
    text: 'Los informes y el control de inventario son increíbles. Por fin tenemos visibilidad total de nuestro negocio en un solo lugar.',
    stars: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-white text-sm font-bold">O</div>
            <span className="text-lg font-bold text-[#0f172a]">OftalShop</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['Características', 'Precios', 'Testimonios'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#0f172a] hover:text-[#1e40af] transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[#1e40af] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d3a9e] transition-colors"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] via-white to-white pt-20 pb-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%231e40af%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-1.5 text-sm text-[#1e40af] font-medium mb-8">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] animate-pulse" />
            El SaaS #1 para ópticas y clínicas oftalmológicas
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[#0f172a] sm:text-6xl leading-tight">
            Tu óptica, online y{' '}
            <span className="text-[#1e40af]">sin complicaciones</span>
          </h1>
          <p className="mt-6 text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
            La plataforma todo-en-uno diseñada para ópticas, clínicas y laboratorios ópticos. Gestiona productos, prescripciones, clientes y ventas desde un solo lugar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e40af] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-[#1d3a9e] transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Comenzar gratis 14 días
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-8 py-3.5 text-base font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
            >
              Ver demo en vivo
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#94a3b8]">Sin tarjeta de crédito · Cancela cuando quieras</p>

          {/* App preview */}
          <div className="mt-16 rounded-2xl border border-[#e2e8f0] bg-white shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[#f1f5f9] bg-[#f8fafc] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#fecaca]" />
                <div className="h-3 w-3 rounded-full bg-[#fde68a]" />
                <div className="h-3 w-3 rounded-full bg-[#a7f3d0]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-md bg-[#e2e8f0] px-24 py-1 text-xs text-[#94a3b8]">app.oftalshop.com</div>
              </div>
            </div>
            <div className="flex h-64 sm:h-80 bg-[#f1f1f1]">
              <div className="w-48 bg-[#1a1a1a] p-3 space-y-1 shrink-0">
                {['Inicio', 'Pedidos', 'Productos', 'Clientes', 'Informes'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/15' : ''}`}>
                    <div className="h-3 w-3 rounded bg-white/20" />
                    <span className="text-xs text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="h-6 w-32 rounded-md bg-white" />
                <div className="grid grid-cols-4 gap-2">
                  {['$14,830', '18', '5', '23'].map((v, i) => (
                    <div key={i} className="rounded-lg bg-white p-3">
                      <div className="h-2 w-12 rounded bg-[#e2e8f0] mb-2" />
                      <div className="text-sm font-bold text-[#0f172a]">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="h-2 w-24 rounded bg-[#e2e8f0] mb-3" />
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50, 65, 88, 72].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-[#3b82f6]/30" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-[#f1f5f9] bg-[#f8fafc] py-10">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-medium text-[#94a3b8] mb-8">
            Con la confianza de más de 500 ópticas y clínicas en Latinoamérica
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['Óptica Visión', 'Grupo Óptico Norte', 'Lab Óptico Sur', 'ClínicaOft', 'OptiMed'].map((b) => (
              <span key={b} className="text-base font-semibold text-[#cbd5e1]">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="características" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Todo lo que necesita tu óptica</h2>
            <p className="mt-4 text-lg text-[#475569] max-w-2xl mx-auto">
              Construido específicamente para el negocio óptico. Sin adaptaciones, sin compromisos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-md hover:border-[#bfdbfe] transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6ff] group-hover:bg-[#dbeafe] transition-colors mb-4">
                  <Icon className="h-5 w-5 text-[#1e40af]" />
                </div>
                <h3 className="text-base font-semibold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-24 bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Precios simples y transparentes</h2>
            <p className="mt-4 text-lg text-[#475569]">14 días gratis, sin tarjeta de crédito. Cancela cuando quieras.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-8 shadow-sm ${plan.color}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#1e40af] px-4 py-1 text-xs font-semibold text-white shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#0f172a]">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[#64748b]">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#0f172a]">{plan.price}</span>
                    <span className="text-[#64748b]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0" />
                      <span className="text-sm text-[#374151]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Lo que dicen nuestros clientes</h2>
            <p className="mt-4 text-lg text-[#475569]">Más de 500 negocios ópticos confían en OftalShop.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map(({ name, role, avatar, text, stars }) => (
              <div key={name} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                  ))}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e40af] text-white text-sm font-semibold shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{name}</p>
                    <p className="text-xs text-[#64748b]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para digitalizar tu óptica?
          </h2>
          <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
            Únete a cientos de ópticas y clínicas que ya venden más con OftalShop. Empieza hoy, sin compromiso.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#1e40af] shadow-lg hover:bg-blue-50 transition-all hover:-translate-y-0.5"
            >
              Comenzar 14 días gratis
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-300">Sin tarjeta de crédito · Setup en menos de 5 minutos</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] bg-[#f8fafc] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e40af] text-white text-xs font-bold">O</div>
              <span className="text-sm font-semibold text-[#0f172a]">OftalShop</span>
            </div>
            <div className="flex gap-6">
              {['Privacidad', 'Términos', 'Soporte', 'Contacto'].map((l) => (
                <a key={l} href="#" className="text-xs text-[#64748b] hover:text-[#0f172a] transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8]">© 2026 OftalShop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
