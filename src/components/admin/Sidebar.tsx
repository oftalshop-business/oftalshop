'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  BarChart2,
  Megaphone,
  Tag,
  Globe,
  Settings,
  ChevronRight,
} from 'lucide-react'

const nav = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { label: 'Productos', href: '/productos', icon: Package },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Contenido', href: '/contenido', icon: FileText },
  { label: 'Informes', href: '/informes', icon: BarChart2 },
  { label: 'Marketing', href: '/marketing', icon: Megaphone },
  { label: 'Descuentos', href: '/descuentos', icon: Tag },
  { label: 'Tienda online', href: '/tienda', icon: Globe },
  { label: 'Configuración', href: '/configuracion', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col bg-[#1a1a1a] text-white">
      {/* Store header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a9d8f] text-sm font-bold">
          O
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">OftalShop</p>
          <p className="text-xs text-white/50 truncate">Mi tienda</p>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-2 py-3">
        <Link
          href="/configuracion"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/8 hover:text-white transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Configuración
        </Link>
      </div>
    </aside>
  )
}
