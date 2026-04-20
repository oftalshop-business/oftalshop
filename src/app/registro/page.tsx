'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const PLANES = [
  { id: 'basico', label: 'Básico', price: '$19/mes', description: '50 productos, 1 pasarela' },
  { id: 'intermedio', label: 'Intermedio', price: '$49/mes', description: '300 productos, 3 pasarelas', popular: true },
  { id: 'pro', label: 'Pro', price: '$99/mes', description: 'Ilimitado, multi-usuario' },
]

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/10 transition-all'

export default function RegistroPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
    plan: 'intermedio',
    tienda: '',
    terminos: false,
  })

  const slug = slugify(form.tienda)

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!form.terminos) {
      setError('Debes aceptar los términos y condiciones.')
      return
    }
    if (!slug) {
      setError('Ingresa un nombre de tienda válido.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { nombre: form.nombre },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        const { error: tenantError } = await supabase.from('tenants').insert({
          id: data.user.id,
          nombre: form.nombre,
          slug,
          plan: form.plan,
          email: form.email,
        })

        if (tenantError && tenantError.code !== '23505') {
          console.error('tenant insert error:', tenantError)
        }
      }

      router.push('/dashboard')
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e40af] text-white text-xl font-bold mb-4">O</div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">OftalShop</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">Crea tu cuenta gratis</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e1e1e1] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Crear cuenta gratis</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Nombre completo</label>
              <input
                type="text"
                value={form.nombre}
                onChange={field('nombre')}
                placeholder="Tu nombre"
                required
                autoFocus
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={field('email')}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                className={inputCls}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={field('password')}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className={inputCls + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmar}
                  onChange={field('confirmar')}
                  placeholder="Repite la contraseña"
                  required
                  className={inputCls + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Selecciona tu plan</label>
              <div className="space-y-2">
                {PLANES.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${form.plan === p.id ? 'border-[#1e40af] bg-[#eff6ff]' : 'border-[#e1e1e1] hover:border-[#bfdbfe]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.plan === p.id ? 'border-[#1e40af]' : 'border-[#d1d5db]'}`}>
                        {form.plan === p.id && <div className="h-2 w-2 rounded-full bg-[#1e40af]" />}
                      </div>
                      <input
                        type="radio"
                        name="plan"
                        value={p.id}
                        checked={form.plan === p.id}
                        onChange={() => setForm((f) => ({ ...f, plan: p.id }))}
                        className="sr-only"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1a1a1a]">{p.label}</span>
                          {p.popular && (
                            <span className="text-[10px] font-bold bg-[#1e40af] text-white px-2 py-0.5 rounded-full">POPULAR</span>
                          )}
                        </div>
                        <span className="text-xs text-[#6a6a6a]">{p.description}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#1a1a1a]">{p.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nombre de la tienda */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Nombre de tu tienda</label>
              <input
                type="text"
                value={form.tienda}
                onChange={field('tienda')}
                placeholder="Óptica Visión Clara"
                required
                className={inputCls}
              />
              {slug && (
                <p className="text-xs text-[#6a6a6a] mt-1">
                  URL: <span className="font-medium text-[#1e40af]">{slug}.oftalshop.com</span>
                </p>
              )}
            </div>

            {/* Términos */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, terminos: !f.terminos }))}
                className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${form.terminos ? 'bg-[#1e40af] border-[#1e40af]' : 'border-[#d1d5db]'}`}
              >
                {form.terminos && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={form.terminos}
                onChange={() => setForm((f) => ({ ...f, terminos: !f.terminos }))}
                className="sr-only"
              />
              <span className="text-xs text-[#6a6a6a] leading-relaxed">
                Acepto los{' '}
                <a href="#" className="text-[#1e40af] hover:underline">Términos y condiciones</a>
                {' '}y la{' '}
                <a href="#" className="text-[#1e40af] hover:underline">Política de privacidad</a>
              </span>
            </label>

            {error && (
              <div className="rounded-lg bg-[#fff5f5] border border-[#fecaca] px-3.5 py-2.5">
                <p className="text-sm text-[#b91c1c]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1e40af] py-2.5 text-sm font-semibold text-white hover:bg-[#1d3a9e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6a6a6a]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#1e40af] font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
