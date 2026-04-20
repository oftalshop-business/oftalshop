'use client'

import { useState } from 'react'
import { Globe, Check, X, RefreshCw, ExternalLink, Copy, AlertCircle } from 'lucide-react'

type EstadoDominio = 'idle' | 'verificando' | 'verificado' | 'error'

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="ml-2 rounded-md border border-[#e1e1e1] p-1.5 hover:bg-[#f7f7f7] transition-colors"
      title="Copiar"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#2a9d8f]" /> : <Copy className="h-3.5 w-3.5 text-[#6a6a6a]" />}
    </button>
  )
}

export default function DominiosPage() {
  const [dominio, setDominio] = useState('')
  const [estado, setEstado] = useState<EstadoDominio>('idle')
  const [intentos, setIntentos] = useState(0)

  function verificar() {
    if (!dominio) return
    setEstado('verificando')
    setIntentos((p) => p + 1)
    // Simulate DNS check
    setTimeout(() => {
      // Simulate success on 2nd attempt for demo
      setEstado(intentos >= 1 ? 'verificado' : 'error')
    }, 2000)
  }

  const TARGET_IP = '76.76.21.21'
  const TARGET_CNAME = 'cname.oftalshop.com'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Dominios</h1>
        <p className="text-sm text-[#6a6a6a] mt-1">Conecta tu propio dominio a tu tienda OftalShop.</p>
      </div>

      {/* Current domain */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Dominio actual</h2>
          <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-medium">Principal</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-[#f7f7f7] border border-[#e1e1e1] px-4 py-3">
          <Globe className="h-4 w-4 text-[#6a6a6a]" />
          <span className="text-sm text-[#1a1a1a] font-medium">mitienda.oftalshop.com</span>
          <a href="#" target="_blank" className="ml-auto text-[#2a9d8f] hover:text-[#238a7e]">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Connect domain */}
      <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#f1f1f1] px-6 py-4">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">Conectar dominio existente</h2>
          <p className="text-xs text-[#6a6a6a] mt-0.5">
            Ingresa el dominio que compraste en un proveedor (GoDaddy, Namecheap, etc.)
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2">
            <input
              className={inputCls}
              placeholder="mióptica.com"
              value={dominio}
              onChange={(e) => setDominio(e.target.value.toLowerCase().trim())}
              onKeyDown={(e) => e.key === 'Enter' && verificar()}
            />
            <button
              onClick={verificar}
              disabled={!dominio || estado === 'verificando'}
              className="shrink-0 flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-[#2a2a2a] transition-colors"
            >
              {estado === 'verificando' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Verificar
            </button>
          </div>

          {/* Status */}
          {estado === 'verificado' && (
            <div className="flex items-start gap-3 rounded-xl bg-[#f0fdf9] border border-[#bbf7d0] p-4">
              <Check className="h-5 w-5 text-[#166534] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#166534]">¡Dominio verificado!</p>
                <p className="text-xs text-[#15803d] mt-0.5">
                  <strong>{dominio}</strong> está correctamente apuntado a tu tienda. Los cambios pueden tardar hasta 24h en propagarse.
                </p>
              </div>
            </div>
          )}

          {estado === 'error' && (
            <div className="flex items-start gap-3 rounded-xl bg-[#fff5f5] border border-[#fecaca] p-4">
              <AlertCircle className="h-5 w-5 text-[#b91c1c] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#b91c1c]">DNS no configurado aún</p>
                <p className="text-xs text-[#dc2626] mt-0.5">
                  No encontramos los registros DNS correctos para <strong>{dominio}</strong>. Sigue las instrucciones y vuelve a verificar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DNS instructions */}
      {dominio && (
        <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[#f1f1f1] px-6 py-4">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">
              Instrucciones para apuntar DNS
            </h2>
            <p className="text-xs text-[#6a6a6a] mt-0.5">
              Entra al panel de tu proveedor de dominio y crea los siguientes registros:
            </p>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-white font-bold">
                  1
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  Agregar registro A (para el dominio raíz)
                </p>
              </div>
              <div className="rounded-lg border border-[#e1e1e1] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#f7f7f7] border-b border-[#e1e1e1]">
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Tipo</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Nombre</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Valor</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-[#1a1a1a]">A</td>
                      <td className="px-4 py-3 font-mono text-[#1a1a1a]">@</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="font-mono text-[#1a1a1a]">{TARGET_IP}</span>
                          <CopyButton text={TARGET_IP} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#6a6a6a]">3600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-white font-bold">
                  2
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  Agregar registro CNAME (para www)
                </p>
              </div>
              <div className="rounded-lg border border-[#e1e1e1] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#f7f7f7] border-b border-[#e1e1e1]">
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Tipo</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Nombre</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">Valor</th>
                      <th className="px-4 py-2 text-left text-[#6a6a6a] font-medium">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-[#1a1a1a]">CNAME</td>
                      <td className="px-4 py-3 font-mono text-[#1a1a1a]">www</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="font-mono text-[#1a1a1a]">{TARGET_CNAME}</span>
                          <CopyButton text={TARGET_CNAME} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#6a6a6a]">3600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a] text-xs text-white font-bold">
                  3
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Esperar propagación y verificar</p>
              </div>
              <p className="text-xs text-[#6a6a6a] pl-8">
                Los cambios DNS pueden tardar entre 5 minutos y 48 horas en propagarse. Una vez completados, haz clic en <strong>Verificar</strong>.
              </p>
            </div>

            <div className="rounded-lg bg-[#fffbeb] border border-[#fde68a] p-4 text-xs text-[#92400e]">
              <strong>Nota:</strong> Si tu proveedor ya tiene un registro A o CNAME para el mismo nombre, elimínalo antes de agregar el nuevo.
            </div>
          </div>
        </div>
      )}

      {/* Estado actual del dominio */}
      {estado !== 'idle' && (
        <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Estado de verificación</h2>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                estado === 'verificado'
                  ? 'bg-[#dcfce7]'
                  : estado === 'error'
                  ? 'bg-[#fee2e2]'
                  : 'bg-[#f1f1f1]'
              }`}
            >
              {estado === 'verificando' && <RefreshCw className="h-4 w-4 text-[#6a6a6a] animate-spin" />}
              {estado === 'verificado' && <Check className="h-4 w-4 text-[#166534]" />}
              {estado === 'error' && <X className="h-4 w-4 text-[#b91c1c]" />}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">{dominio}</p>
              <p className="text-xs text-[#6a6a6a]">
                {estado === 'verificando' && 'Verificando registros DNS…'}
                {estado === 'verificado' && 'DNS configurado correctamente · SSL activado'}
                {estado === 'error' && 'Registros DNS no encontrados · Revisa la configuración'}
              </p>
            </div>
            {estado === 'error' && (
              <button
                onClick={verificar}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#1a1a1a] hover:bg-[#f7f7f7]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reintentar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
