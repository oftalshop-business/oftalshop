'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useActionState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { login } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e40af] text-white text-xl font-bold mb-4">O</div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">OftalShop</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">Inicia sesión en tu tienda</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e1e1e1] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Iniciar sesión</h2>

          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                required
                className="w-full rounded-lg border border-[#e1e1e1] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a]">
                  Contraseña
                </label>
                <Link href="/recuperar" className="text-xs text-[#1e40af] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-[#e1e1e1] px-3.5 py-2.5 pr-10 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-[#fff5f5] border border-[#fecaca] px-3.5 py-2.5">
                <p className="text-sm text-[#b91c1c]">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#1e40af] py-2.5 text-sm font-semibold text-white hover:bg-[#1d3a9e] active:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e1e1e1]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#9a9a9a]">o</span>
            </div>
          </div>

          <p className="text-center text-sm text-[#6a6a6a]">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[#1e40af] font-semibold hover:underline">
              Empezar gratis
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-[#b9b9b9]">
          Al iniciar sesión, aceptas los{' '}
          <a href="#" className="hover:underline">Términos de servicio</a>
          {' '}y la{' '}
          <a href="#" className="hover:underline">Política de privacidad</a>
        </p>
      </div>
    </div>
  )
}
