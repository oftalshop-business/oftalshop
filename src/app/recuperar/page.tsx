'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSent(true)
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e40af] text-white text-xl font-bold mb-4">O</div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">OftalShop</h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e1e1e1] bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] mb-4">
                <CheckCircle2 className="h-7 w-7 text-[#16a34a]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Revisa tu correo</h2>
              <p className="text-sm text-[#6a6a6a] leading-relaxed mb-6">
                Enviamos un enlace para restablecer tu contraseña a{' '}
                <span className="font-medium text-[#1a1a1a]">{email}</span>.
                Revisa también tu carpeta de spam.
              </p>
              <Link
                href="/login"
                className="block w-full rounded-lg bg-[#1e40af] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1d3a9e] transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Recuperar contraseña</h2>
              <p className="text-sm text-[#6a6a6a] mb-6">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-[#e1e1e1] px-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/10 transition-all"
                  />
                </div>

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
                  {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6a6a6a]">
                <Link href="/login" className="text-[#1e40af] font-medium hover:underline">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
