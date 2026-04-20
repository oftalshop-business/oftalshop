'use client'

import { useState, useEffect } from 'react'
import { Save, Check, Eye, EyeOff, Globe, BarChart2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]'

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-4 py-4 border-b border-[#f1f1f1] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
        {hint && <p className="text-xs text-[#8a8a8a] mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#f1f1f1] px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f1f1]">
          <Icon className="h-4 w-4 text-[#6a6a6a]" />
        </div>
        <h2 className="text-sm font-semibold text-[#1a1a1a]">{title}</h2>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  )
}

export default function PreferenciasPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    titulo_tienda: 'OftalShop Demo — Óptica Online',
    meta_descripcion: 'Encuentra los mejores lentes, monturas y accesorios ópticos al mejor precio.',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    twitter_url: '',
    youtube_url: '',
    ga_id: '',
    fb_pixel_id: '',
    password_tienda: '',
    password_activa: false,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('configuracion_tienda')
        .select('valor')
        .eq('clave', 'preferencias')
        .single()
      if (data?.valor) setForm((p) => ({ ...p, ...data.valor }))
    }
    load()
  }, [])

  const f =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'preferencias', valor: form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Preferencias de la tienda</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">SEO, redes sociales, analítica y seguridad.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
              <Check className="h-4 w-4" /> Guardado
            </span>
          )}
          <button
            onClick={guardar}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* SEO */}
      <Card title="Título y meta descripción" icon={Globe}>
        <FieldRow label="Título de la tienda" hint="Aparece en los resultados de búsqueda (máx. 70 caracteres)">
          <input
            className={inputCls}
            value={form.titulo_tienda}
            onChange={f('titulo_tienda')}
            maxLength={70}
          />
          <p className="text-xs text-[#8a8a8a] mt-1">{form.titulo_tienda.length}/70 caracteres</p>
        </FieldRow>
        <FieldRow label="Meta descripción" hint="Descripción breve para motores de búsqueda (máx. 160 caracteres)">
          <textarea
            className={inputCls + ' resize-none h-20'}
            value={form.meta_descripcion}
            onChange={f('meta_descripcion')}
            maxLength={160}
          />
          <p className="text-xs text-[#8a8a8a] mt-1">{form.meta_descripcion.length}/160 caracteres</p>
        </FieldRow>
      </Card>

      {/* Social */}
      <Card title="Redes sociales" icon={Globe}>
        {(
          [
            ['facebook_url', 'Facebook', 'https://facebook.com/tu-pagina'],
            ['instagram_url', 'Instagram', 'https://instagram.com/tu-usuario'],
            ['tiktok_url', 'TikTok', 'https://tiktok.com/@tu-usuario'],
            ['twitter_url', 'X / Twitter', 'https://x.com/tu-usuario'],
            ['youtube_url', 'YouTube', 'https://youtube.com/c/tu-canal'],
          ] as [keyof typeof form, string, string][]
        ).map(([k, label, placeholder]) => (
          <FieldRow key={k} label={label}>
            <input
              className={inputCls}
              type="url"
              value={String(form[k])}
              onChange={f(k)}
              placeholder={placeholder}
            />
          </FieldRow>
        ))}
      </Card>

      {/* Analytics */}
      <Card title="Analítica y seguimiento" icon={BarChart2}>
        <FieldRow label="Google Analytics ID" hint="Formato: G-XXXXXXXXXX o UA-XXXXXXXX-X">
          <input
            className={inputCls}
            value={form.ga_id}
            onChange={f('ga_id')}
            placeholder="G-XXXXXXXXXX"
          />
        </FieldRow>
        <FieldRow label="Facebook Pixel ID" hint="ID numérico de 15-16 dígitos">
          <input
            className={inputCls}
            value={form.fb_pixel_id}
            onChange={f('fb_pixel_id')}
            placeholder="123456789012345"
          />
        </FieldRow>
      </Card>

      {/* Password */}
      <Card title="Contraseña de la tienda" icon={Lock}>
        <FieldRow
          label="Proteger tienda"
          hint="Activa para poner la tienda en mantenimiento. Solo los visitantes con contraseña podrán acceder."
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((p) => ({ ...p, password_activa: !p.password_activa }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                form.password_activa ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.password_activa ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-sm text-[#1a1a1a]">
              {form.password_activa ? 'Tienda protegida con contraseña' : 'Tienda pública'}
            </span>
          </label>
        </FieldRow>
        {form.password_activa && (
          <FieldRow label="Contraseña de acceso">
            <div className="relative">
              <input
                className={inputCls + ' pr-10'}
                type={showPassword ? 'text' : 'password'}
                value={form.password_tienda}
                onChange={f('password_tienda')}
                placeholder="Contraseña para visitantes"
              />
              <button
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldRow>
        )}
      </Card>
    </div>
  )
}
