'use client'

import { useState, useEffect } from 'react'
import {
  Store, Globe, CreditCard, Truck, Users, Shield, Bell,
  Save, Plus, Trash2, Eye, EyeOff, Check, X, ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | 'tienda'
  | 'idiomas'
  | 'pagos'
  | 'envios'
  | 'usuarios'
  | 'seguridad'
  | 'notificaciones'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'Admin' | 'Staff' | 'Bodega'
}

interface ZonaEnvio {
  id: string
  nombre: string
  tarifa: number
  minimo_gratis: number | null
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_USUARIOS: Usuario[] = [
  { id: '1', nombre: 'Carlos Mendoza', email: 'carlos@optica.com', rol: 'Admin' },
  { id: '2', nombre: 'Ana Torres', email: 'ana@optica.com', rol: 'Staff' },
  { id: '3', nombre: 'Luis Paredes', email: 'luis@optica.com', rol: 'Bodega' },
]

const SAMPLE_ZONAS: ZonaEnvio[] = [
  { id: '1', nombre: 'Lima Metropolitana', tarifa: 8, minimo_gratis: 150 },
  { id: '2', nombre: 'Provincias', tarifa: 18, minimo_gratis: 250 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#e1e1e1] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
    >
      <Save className="h-4 w-4" />
      {saving ? 'Guardando…' : 'Guardar cambios'}
    </button>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#2a9d8f]' : 'bg-[#d1d1d1]'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] items-start gap-4 py-4 border-b border-[#f1f1f1] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
        {hint && <p className="text-xs text-[#8a8a8a] mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-[#e1e1e1] bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent'

// ─── Section components ───────────────────────────────────────────────────────

function SeccionTienda() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nombre: 'OftalShop Demo',
    email: 'contacto@optica.com',
    telefono: '+51 999 123 456',
    direccion: 'Av. Larco 123, Miraflores',
    ciudad: 'Lima',
    pais: 'Perú',
    moneda: 'PEN',
    zona_horaria: 'America/Lima',
  })

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'tienda', valor: form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Información de la tienda</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Datos generales de tu negocio.</p>
      </div>
      <Card>
        <div className="px-6 py-2">
          <FieldRow label="Nombre de la tienda">
            <input className={inputCls} value={form.nombre} onChange={f('nombre')} />
          </FieldRow>
          <FieldRow label="Email de contacto">
            <input className={inputCls} type="email" value={form.email} onChange={f('email')} />
          </FieldRow>
          <FieldRow label="Teléfono">
            <input className={inputCls} value={form.telefono} onChange={f('telefono')} />
          </FieldRow>
          <FieldRow label="Dirección">
            <input className={inputCls} value={form.direccion} onChange={f('direccion')} />
          </FieldRow>
          <FieldRow label="Ciudad">
            <input className={inputCls} value={form.ciudad} onChange={f('ciudad')} />
          </FieldRow>
          <FieldRow label="País">
            <select className={inputCls} value={form.pais} onChange={f('pais')}>
              <option>Perú</option>
              <option>México</option>
              <option>Colombia</option>
              <option>Argentina</option>
              <option>Chile</option>
            </select>
          </FieldRow>
          <FieldRow label="Moneda" hint="Moneda en la que se muestran los precios">
            <select className={inputCls} value={form.moneda} onChange={f('moneda')}>
              <option value="PEN">PEN — Sol peruano</option>
              <option value="MXN">MXN — Peso mexicano</option>
              <option value="COP">COP — Peso colombiano</option>
              <option value="ARS">ARS — Peso argentino</option>
              <option value="CLP">CLP — Peso chileno</option>
              <option value="USD">USD — Dólar</option>
            </select>
          </FieldRow>
          <FieldRow label="Zona horaria">
            <select className={inputCls} value={form.zona_horaria} onChange={f('zona_horaria')}>
              <option value="America/Lima">América/Lima (UTC-5)</option>
              <option value="America/Mexico_City">América/Ciudad de México (UTC-6)</option>
              <option value="America/Bogota">América/Bogotá (UTC-5)</option>
              <option value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</option>
              <option value="America/Santiago">América/Santiago (UTC-4)</option>
            </select>
          </FieldRow>
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}

function SeccionIdiomas() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [principal, setPrincipal] = useState('es')
  const [secundarios, setSecundarios] = useState<string[]>(['en'])

  const idiomas = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'Inglés' },
    { code: 'pt', label: 'Portugués' },
    { code: 'fr', label: 'Francés' },
  ]

  function toggleSecundario(code: string) {
    setSecundarios((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'idiomas', valor: { principal, secundarios } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Idiomas</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Configura en qué idiomas se muestra tu tienda.</p>
      </div>
      <Card>
        <div className="px-6 py-2">
          <FieldRow label="Idioma principal">
            <select className={inputCls} value={principal} onChange={(e) => setPrincipal(e.target.value)}>
              {idiomas.map((i) => (
                <option key={i.code} value={i.code}>{i.label}</option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Idiomas secundarios" hint="Activa los idiomas adicionales">
            <div className="space-y-2">
              {idiomas
                .filter((i) => i.code !== principal)
                .map((i) => (
                  <label key={i.code} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={secundarios.includes(i.code)}
                      onChange={() => toggleSecundario(i.code)}
                      className="h-4 w-4 rounded border-[#e1e1e1] text-[#2a9d8f] focus:ring-[#2a9d8f]"
                    />
                    <span className="text-sm text-[#1a1a1a]">{i.label}</span>
                  </label>
                ))}
            </div>
          </FieldRow>
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}

function SeccionPagos() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({ stripe: false, mp: false, paypal: false })
  const [form, setForm] = useState({
    stripe_key: '',
    mp_access_token: '',
    paypal_client_id: '',
    efectivo: true,
    transferencia: true,
  })

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'pagos', valor: form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Pagos</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Conecta tus procesadores de pago.</p>
      </div>

      {/* Stripe */}
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#635bff] flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm font-medium text-[#1a1a1a]">Stripe</span>
          </div>
          {form.stripe_key && <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full">Conectado</span>}
        </div>
        <div className="px-6 py-4">
          <label className="block text-xs text-[#6a6a6a] mb-1.5">API Key secreta</label>
          <div className="relative">
            <input
              className={inputCls + ' pr-10'}
              type={show.stripe ? 'text' : 'password'}
              placeholder="sk_live_…"
              value={form.stripe_key}
              onChange={f('stripe_key')}
            />
            <button
              onClick={() => setShow((p) => ({ ...p, stripe: !p.stripe }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
            >
              {show.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Card>

      {/* MercadoPago */}
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#009ee3] flex items-center justify-center">
              <span className="text-white text-xs font-bold">MP</span>
            </div>
            <span className="text-sm font-medium text-[#1a1a1a]">MercadoPago</span>
          </div>
          {form.mp_access_token && <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full">Conectado</span>}
        </div>
        <div className="px-6 py-4">
          <label className="block text-xs text-[#6a6a6a] mb-1.5">Access Token</label>
          <div className="relative">
            <input
              className={inputCls + ' pr-10'}
              type={show.mp ? 'text' : 'password'}
              placeholder="APP_USR-…"
              value={form.mp_access_token}
              onChange={f('mp_access_token')}
            />
            <button
              onClick={() => setShow((p) => ({ ...p, mp: !p.mp }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
            >
              {show.mp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Card>

      {/* PayPal */}
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#003087] flex items-center justify-center">
              <span className="text-white text-xs font-bold">PP</span>
            </div>
            <span className="text-sm font-medium text-[#1a1a1a]">PayPal</span>
          </div>
          {form.paypal_client_id && <span className="text-xs bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full">Conectado</span>}
        </div>
        <div className="px-6 py-4">
          <label className="block text-xs text-[#6a6a6a] mb-1.5">Client ID</label>
          <div className="relative">
            <input
              className={inputCls + ' pr-10'}
              type={show.paypal ? 'text' : 'password'}
              placeholder="AY…"
              value={form.paypal_client_id}
              onChange={f('paypal_client_id')}
            />
            <button
              onClick={() => setShow((p) => ({ ...p, paypal: !p.paypal }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
            >
              {show.paypal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Card>

      {/* Métodos manuales */}
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1]">
          <span className="text-sm font-medium text-[#1a1a1a]">Métodos manuales</span>
        </div>
        <div className="px-6 py-4 space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-[#1a1a1a]">Pago en efectivo (contra entrega)</span>
            <Toggle checked={form.efectivo} onChange={(v) => setForm((p) => ({ ...p, efectivo: v }))} />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-[#1a1a1a]">Transferencia bancaria</span>
            <Toggle checked={form.transferencia} onChange={(v) => setForm((p) => ({ ...p, transferencia: v }))} />
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}

function SeccionEnvios() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [zonas, setZonas] = useState<ZonaEnvio[]>(SAMPLE_ZONAS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ZonaEnvio>>({})

  function startEdit(z: ZonaEnvio) {
    setEditingId(z.id)
    setEditForm({ ...z })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  function saveEdit() {
    setZonas((prev) => prev.map((z) => (z.id === editingId ? { ...z, ...editForm } as ZonaEnvio : z)))
    cancelEdit()
  }

  function addZona() {
    const nueva: ZonaEnvio = {
      id: Date.now().toString(),
      nombre: 'Nueva zona',
      tarifa: 10,
      minimo_gratis: null,
    }
    setZonas((prev) => [...prev, nueva])
    startEdit(nueva)
  }

  function removeZona(id: string) {
    setZonas((prev) => prev.filter((z) => z.id !== id))
  }

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'envios', valor: { zonas } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Envíos y entrega</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Define las zonas y tarifas de envío de tu tienda.</p>
      </div>
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1a1a1a]">Zonas de envío</span>
          <button
            onClick={addZona}
            className="flex items-center gap-1.5 text-sm text-[#2a9d8f] hover:text-[#238a7e] font-medium"
          >
            <Plus className="h-4 w-4" /> Agregar zona
          </button>
        </div>
        <div className="divide-y divide-[#f1f1f1]">
          {zonas.map((z) =>
            editingId === z.id ? (
              <div key={z.id} className="px-6 py-4 space-y-3 bg-[#fafafa]">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#6a6a6a] mb-1">Nombre de la zona</label>
                    <input
                      className={inputCls}
                      value={editForm.nombre ?? ''}
                      onChange={(e) => setEditForm((p) => ({ ...p, nombre: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a6a6a] mb-1">Tarifa (S/)</label>
                    <input
                      className={inputCls}
                      type="number"
                      value={editForm.tarifa ?? ''}
                      onChange={(e) => setEditForm((p) => ({ ...p, tarifa: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#6a6a6a] mb-1">
                    Envío gratis desde (S/) — dejar vacío para desactivar
                  </label>
                  <input
                    className={inputCls}
                    type="number"
                    placeholder="ej: 150"
                    value={editForm.minimo_gratis ?? ''}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        minimo_gratis: e.target.value ? parseFloat(e.target.value) : null,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white"
                  >
                    <Check className="h-3.5 w-3.5" /> Aplicar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 rounded-lg border border-[#e1e1e1] px-3 py-1.5 text-xs text-[#6a6a6a]"
                  >
                    <X className="h-3.5 w-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={z.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{z.nombre}</p>
                  <p className="text-xs text-[#6a6a6a] mt-0.5">
                    Tarifa: S/ {z.tarifa}
                    {z.minimo_gratis ? ` · Gratis desde S/ ${z.minimo_gratis}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(z)}
                    className="text-xs text-[#2a9d8f] hover:text-[#238a7e] font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeZona(z.id)}
                    className="text-[#ef4444] hover:text-[#dc2626]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}

function SeccionUsuarios() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>(SAMPLE_USUARIOS)
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ nombre: '', email: '', rol: 'Staff' as Usuario['rol'] })

  function addUser() {
    if (!newUser.nombre || !newUser.email) return
    setUsuarios((prev) => [...prev, { id: Date.now().toString(), ...newUser }])
    setNewUser({ nombre: '', email: '', rol: 'Staff' })
    setShowModal(false)
  }

  function removeUser(id: string) {
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  function changeRol(id: string, rol: Usuario['rol']) {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)))
  }

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'usuarios', valor: usuarios })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const rolColor: Record<Usuario['rol'], string> = {
    Admin: 'bg-[#dbeafe] text-[#1d4ed8]',
    Staff: 'bg-[#dcfce7] text-[#166534]',
    Bodega: 'bg-[#fef9c3] text-[#854d0e]',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Usuarios y permisos</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Administra quién tiene acceso al panel de tu tienda.</p>
      </div>
      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1a1a1a]">Miembros del equipo</span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs text-white font-medium"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar usuario
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f1f1f1]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8a8a8a]">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8a8a8a]">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8a8a8a]">Rol</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f1]">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-[#fafafa]">
                <td className="px-6 py-3 font-medium text-[#1a1a1a]">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#e8f5e9] flex items-center justify-center text-xs font-semibold text-[#2a9d8f]">
                      {u.nombre.charAt(0)}
                    </div>
                    {u.nombre}
                  </div>
                </td>
                <td className="px-6 py-3 text-[#6a6a6a]">{u.email}</td>
                <td className="px-6 py-3">
                  <select
                    value={u.rol}
                    onChange={(e) => changeRol(u.id, e.target.value as Usuario['rol'])}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${rolColor[u.rol]}`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Bodega">Bodega</option>
                  </select>
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => removeUser(u.id)}
                    className="text-[#ef4444] hover:text-[#dc2626]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f1f1]">
              <h3 className="text-base font-semibold text-[#1a1a1a]">Agregar usuario</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8a8a8a] hover:text-[#1a1a1a]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs text-[#6a6a6a] mb-1.5">Nombre completo *</label>
                <input
                  className={inputCls}
                  value={newUser.nombre}
                  onChange={(e) => setNewUser((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="Ana García"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6a6a6a] mb-1.5">Email *</label>
                <input
                  className={inputCls}
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                  placeholder="ana@optica.com"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6a6a6a] mb-1.5">Rol</label>
                <select
                  className={inputCls}
                  value={newUser.rol}
                  onChange={(e) => setNewUser((p) => ({ ...p, rol: e.target.value as Usuario['rol'] }))}
                >
                  <option value="Admin">Admin — acceso completo</option>
                  <option value="Staff">Staff — gestión de pedidos y productos</option>
                  <option value="Bodega">Bodega — solo inventario</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#f1f1f1]">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[#e1e1e1] px-4 py-2 text-sm text-[#6a6a6a]"
              >
                Cancelar
              </button>
              <button
                onClick={addUser}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white font-medium"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SeccionSeguridad() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false })
  const [twoFA, setTwoFA] = useState(false)
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' })
  const [error, setError] = useState('')

  async function cambiarPassword() {
    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (passwords.nueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setError('')
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password: passwords.nueva })
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setPasswords({ actual: '', nueva: '', confirmar: '' })
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const pf = (k: keyof typeof passwords) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Seguridad</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Gestiona la seguridad de tu cuenta.</p>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-[#f1f1f1]">
          <span className="text-sm font-semibold text-[#1a1a1a]">Cambiar contraseña</span>
        </div>
        <div className="px-6 py-4 space-y-4">
          {(['actual', 'nueva', 'confirmar'] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs text-[#6a6a6a] mb-1.5 capitalize">
                {field === 'actual' ? 'Contraseña actual' : field === 'nueva' ? 'Nueva contraseña' : 'Confirmar nueva contraseña'}
              </label>
              <div className="relative">
                <input
                  className={inputCls + ' pr-10'}
                  type={show[field] ? 'text' : 'password'}
                  value={passwords[field]}
                  onChange={pf(field)}
                />
                <button
                  onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
                >
                  {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          {error && <p className="text-sm text-[#ef4444]">{error}</p>}
        </div>
      </Card>

      <Card>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Autenticación de dos factores (2FA)</p>
            <p className="text-xs text-[#6a6a6a] mt-0.5">
              Agrega una capa extra de seguridad al iniciar sesión.
            </p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>
        {twoFA && (
          <div className="mx-6 mb-4 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] p-4">
            <p className="text-sm text-[#166534]">
              2FA activado. Próximamente recibirás instrucciones para configurar la app autenticadora.
            </p>
          </div>
        )}
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton onClick={cambiarPassword} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Contraseña actualizada
          </span>
        )}
      </div>
    </div>
  )
}

function SeccionNotificaciones() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    nuevo_pedido: true,
    pedido_enviado: true,
    stock_bajo: true,
    nuevo_cliente: false,
    reembolso: true,
    pago_fallido: true,
  })

  const toggles: Array<{ key: keyof typeof config; label: string; hint: string }> = [
    { key: 'nuevo_pedido', label: 'Nuevo pedido recibido', hint: 'Recibe un email cada vez que llega un pedido nuevo.' },
    { key: 'pedido_enviado', label: 'Pedido enviado', hint: 'Notificación cuando un pedido es marcado como enviado.' },
    { key: 'stock_bajo', label: 'Stock bajo', hint: 'Alerta cuando el inventario de un producto es menor a 5 unidades.' },
    { key: 'nuevo_cliente', label: 'Nuevo cliente registrado', hint: 'Notificación cuando un cliente crea una cuenta.' },
    { key: 'reembolso', label: 'Reembolso solicitado', hint: 'Alerta cuando un cliente solicita un reembolso.' },
    { key: 'pago_fallido', label: 'Pago fallido', hint: 'Aviso cuando un intento de cobro falla.' },
  ]

  async function guardar() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('configuracion_tienda').upsert({ clave: 'notificaciones', valor: config })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Notificaciones</h2>
        <p className="text-sm text-[#6a6a6a] mt-1">Configura qué alertas y emails automáticos deseas recibir.</p>
      </div>
      <Card>
        <div className="divide-y divide-[#f1f1f1]">
          {toggles.map(({ key, label, hint }) => (
            <div key={key} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
                <p className="text-xs text-[#6a6a6a] mt-0.5">{hint}</p>
              </div>
              <Toggle
                checked={config[key]}
                onChange={(v) => setConfig((p) => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <SaveButton onClick={guardar} saving={saving} />
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-[#2a9d8f]">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV: Array<{ id: Section; label: string; icon: React.ElementType; group: string }> = [
  { id: 'tienda', label: 'Información de la tienda', icon: Store, group: 'Tienda' },
  { id: 'idiomas', label: 'Idiomas', icon: Globe, group: 'Tienda' },
  { id: 'pagos', label: 'Pagos', icon: CreditCard, group: 'Ventas y pagos' },
  { id: 'envios', label: 'Envíos y entrega', icon: Truck, group: 'Ventas y pagos' },
  { id: 'usuarios', label: 'Usuarios y permisos', icon: Users, group: 'Cuenta' },
  { id: 'seguridad', label: 'Seguridad', icon: Shield, group: 'Cuenta' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, group: 'Cuenta' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfiguracionPage() {
  const [active, setActive] = useState<Section>('tienda')

  const groups = [...new Set(NAV.map((n) => n.group))]

  const sectionMap: Record<Section, React.ReactNode> = {
    tienda: <SeccionTienda />,
    idiomas: <SeccionIdiomas />,
    pagos: <SeccionPagos />,
    envios: <SeccionEnvios />,
    usuarios: <SeccionUsuarios />,
    seguridad: <SeccionSeguridad />,
    notificaciones: <SeccionNotificaciones />,
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 sticky top-4">
        <div className="rounded-xl border border-[#e1e1e1] bg-white shadow-sm overflow-hidden">
          {groups.map((group) => (
            <div key={group}>
              <div className="border-b border-[#f1f1f1] px-4 py-2.5 bg-[#fafafa]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a8a8a]">{group}</span>
              </div>
              <ul>
                {NAV.filter((n) => n.group === group).map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => setActive(id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-[#f1f1f1] last:border-0 ${
                        active === id
                          ? 'bg-[#f0fdf9] text-[#2a9d8f] font-medium'
                          : 'text-[#4a4a4a] hover:bg-[#fafafa]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{label}</span>
                      {active === id && <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Right content */}
      <main className="flex-1 min-w-0">
        {sectionMap[active]}
      </main>
    </div>
  )
}
