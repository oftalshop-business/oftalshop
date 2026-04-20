'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircle2,
  Eye,
  Package,
  Users,
  BarChart2,
  Globe,
  CreditCard,
  Palette,
  Star,
  ChevronRight,
  Building2,
  Microscope,
  ShoppingBag,
  Truck,
  Stethoscope,
} from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Tienda online profesional',
    description: 'Vende en línea las 24h con un carrito optimizado y diseño personalizable para tu marca.',
  },
  {
    icon: Package,
    title: 'Gestión de productos ópticos',
    description: 'Variantes por material, tratamiento y medidas. Catálogo completo para armazones, lentes y cristales.',
  },
  {
    icon: Users,
    title: 'Pedidos y clientes',
    description: 'Historial de compras, prescripciones y seguimiento personalizado para cada paciente.',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pasarelas de pago',
    description: 'Stripe, MercadoPago, PayPal y métodos manuales. Cobra como tus clientes prefieren.',
  },
  {
    icon: Palette,
    title: 'Editor visual de tienda',
    description: 'Personaliza colores, tipografía y secciones sin escribir código. Tu marca, tu estilo.',
  },
  {
    icon: BarChart2,
    title: 'Informes y estadísticas',
    description: 'Visualiza ventas, inventario y clientes en tiempo real. Decisiones basadas en datos.',
  },
]

const audience = [
  {
    icon: Eye,
    title: 'Ópticas',
    description: 'Gestiona tu inventario, atiende clientes y vende en línea desde una sola plataforma.',
  },
  {
    icon: Stethoscope,
    title: 'Clínicas oftalmológicas',
    description: 'Administra citas, expedientes de pacientes y vende productos post-consulta.',
  },
  {
    icon: Microscope,
    title: 'Laboratorios ópticos',
    description: 'Recibe pedidos de ópticas y gestiona tu producción con flujos personalizados.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce de lentes',
    description: 'Lanza tu tienda online especializada en lentes de contacto, armazones o gafas de sol.',
  },
  {
    icon: Truck,
    title: 'Distribuidoras',
    description: 'Conecta con ópticas clientes, gestiona catálogos y coordina envíos masivos.',
  },
]

const PLANS_MONTHLY = [
  {
    name: 'Básico',
    price: 19,
    description: 'Para ópticas pequeñas que están comenzando.',
    badge: '',
    features: [
      '50 productos',
      '1 pasarela de pago',
      '3 plantillas gratis',
      'Soporte por email',
    ],
  },
  {
    name: 'Intermedio',
    price: 49,
    description: 'El plan más popular para ópticas en crecimiento.',
    badge: 'POPULAR',
    features: [
      '300 productos',
      '3 pasarelas de pago',
      'Dominio propio incluido',
      'Editor visual de tienda',
      'Soporte prioritario',
    ],
  },
  {
    name: 'Pro',
    price: 99,
    description: 'Para cadenas y laboratorios ópticos.',
    badge: '',
    features: [
      'Productos ilimitados',
      'Multi-usuario',
      'White label',
      'API e integraciones',
      'Soporte WhatsApp',
    ],
  },
]

const testimonials = [
  {
    name: 'Dra. Patricia Herrera',
    role: 'Directora — Óptica Visión Clara, Lima',
    avatar: 'PH',
    text: 'OftalShop transformó nuestra óptica. En 2 semanas teníamos la tienda online funcionando y los pedidos llegando solos.',
    stars: 5,
  },
  {
    name: 'Dr. Marco Domínguez',
    role: 'Director — Clínica Oftalmológica Norte, Lima',
    avatar: 'MD',
    text: 'El módulo de gestión de pacientes y prescripciones nos ahorra horas diarias. Nuestras ventas online crecieron 40% en el primer mes.',
    stars: 5,
  },
  {
    name: 'Lic. Sandra Ruiz',
    role: 'Gerente — Laboratorio Óptico Sur, Arequipa',
    avatar: 'SR',
    text: 'Por fin un sistema hecho para laboratorios. Recibimos pedidos de 20 ópticas y todo queda registrado automáticamente.',
    stars: 5,
  },
]

export default function LandingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-white text-sm font-bold">O</div>
            <span className="text-lg font-bold text-white">OftalShop</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Características', href: '#caracteristicas' },
              { label: 'Precios', href: '#precios' },
              { label: 'Testimonios', href: '#testimonios' },
            ].map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803d] transition-colors"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e3a8a] to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e40af33_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 font-medium mb-8">
                <span className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
                El Shopify para negocios ópticos
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl leading-tight">
                El Shopify para ópticas y clínicas oftalmológicas
              </h1>
              <p className="mt-6 text-lg text-white/70 leading-relaxed">
                Crea tu tienda online, gestiona pedidos, inventario y clientes. Todo en un solo lugar.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-900/30 hover:bg-[#15803d] transition-all hover:-translate-y-0.5"
                >
                  Empezar gratis 14 días
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Ver demo
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/40">Sin tarjeta de crédito · Cancela cuando quieras</p>
            </div>

            {/* Dashboard mockup */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#fecaca]/60" />
                    <div className="h-3 w-3 rounded-full bg-[#fde68a]/60" />
                    <div className="h-3 w-3 rounded-full bg-[#a7f3d0]/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="rounded-md bg-white/10 px-20 py-1 text-xs text-white/40">app.oftalshop.com</div>
                  </div>
                </div>
                <div className="flex h-72 bg-[#0f172a]/50">
                  <div className="w-44 bg-white/5 p-3 space-y-1 shrink-0 border-r border-white/10">
                    {['Inicio', 'Pedidos', 'Productos', 'Clientes', 'Informes'].map((item, i) => (
                      <div key={item} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/15' : ''}`}>
                        <div className="h-3 w-3 rounded bg-white/20" />
                        <span className="text-xs text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-4 space-y-3">
                    <div className="h-5 w-28 rounded-md bg-white/20" />
                    <div className="grid grid-cols-2 gap-2">
                      {[['S/ 14,830', 'Ventas hoy'], ['18', 'Pedidos'], ['5', 'Pendientes'], ['142', 'Clientes']].map(([v, l]) => (
                        <div key={l} className="rounded-lg bg-white/10 p-3 border border-white/10">
                          <div className="text-[10px] text-white/40 mb-1">{l}</div>
                          <div className="text-sm font-bold text-white">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 border border-white/10">
                      <div className="h-2 w-20 rounded bg-white/20 mb-3" />
                      <div className="flex items-end gap-1 h-14">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50, 65, 88, 72].map((h, i) => (
                          <div key={i} className="flex-1 rounded-sm bg-[#3b82f6]/50" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
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
      <section id="caracteristicas" className="py-24">
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

      {/* Para quién es */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Diseñado para negocios ópticos</h2>
            <p className="mt-4 text-lg text-[#475569]">
              Cada tipo de negocio tiene sus necesidades. OftalShop se adapta a todas.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {audience.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm text-center hover:shadow-md hover:border-[#bfdbfe] transition-all">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] mb-4">
                  <Icon className="h-6 w-6 text-[#1e40af]" />
                </div>
                <h3 className="text-sm font-semibold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Planes simples y transparentes</h2>
            <p className="mt-4 text-lg text-[#475569]">14 días gratis, sin tarjeta de crédito. Cancela cuando quieras.</p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e2e8f0] bg-[#f8fafc] p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!annual ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b]'}`}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b]'}`}
              >
                Anual
                <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PLANS_MONTHLY.map((plan) => {
              const price = annual ? Math.round(plan.price * 0.8) : plan.price
              const isPopular = plan.badge === 'POPULAR'
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm ${isPopular ? 'border-[#1e40af] ring-4 ring-[#1e40af]/10 shadow-lg' : 'border-[#e2e8f0]'}`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#1e40af] px-5 py-1.5 text-xs font-bold text-white shadow-md">
                        POPULAR
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#0f172a]">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[#64748b]">{plan.description}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[#0f172a]">${price}</span>
                      <span className="text-[#64748b]">/mes</span>
                      {annual && (
                        <span className="ml-2 text-xs text-[#16a34a] font-semibold">Ahorras ${Math.round(plan.price * 0.2 * 12)}/año</span>
                      )}
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
                    href="/registro"
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${isPopular ? 'bg-[#1e40af] text-white hover:bg-[#1d3a9e]' : 'border border-[#1e40af] text-[#1e40af] hover:bg-[#eff6ff]'}`}
                  >
                    Empezar ahora
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24 bg-[#f8fafc]">
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
      <section className="py-24 bg-[#1e40af]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para digitalizar tu negocio óptico?
          </h2>
          <p className="mt-4 text-lg text-blue-200 max-w-xl mx-auto">
            Únete a cientos de ópticas y clínicas que ya venden más con OftalShop.
          </p>
          <div className="mt-10">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-[#1e40af] shadow-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5"
            >
              Empezar gratis 14 días
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-300">Sin tarjeta de crédito · Setup en menos de 5 minutos</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] bg-[#0f172a] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-white text-sm font-bold">O</div>
                <span className="text-base font-bold text-white">OftalShop</span>
              </div>
              <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                La plataforma todo-en-uno para ópticas, clínicas y laboratorios ópticos en Latinoamérica.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Producto</p>
              <ul className="space-y-2.5">
                {['Características', 'Precios', 'Temas', 'Integraciones'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Empresa</p>
              <ul className="space-y-2.5">
                {['Nosotros', 'Blog', 'Casos de éxito', 'Afiliados'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Soporte</p>
              <ul className="space-y-2.5">
                {['Centro de ayuda', 'Contacto', 'Privacidad', 'Términos'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">© 2025 OftalShop. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              {['Instagram', 'LinkedIn', 'YouTube', 'WhatsApp'].map((s) => (
                <a key={s} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
