'use client'

import { Bell, Search, HelpCircle } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#e1e1e1] bg-white px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e1e1e1] bg-[#f7f7f7] px-3 py-1.5 max-w-md">
        <Search className="h-4 w-4 text-[#8a8a8a] shrink-0" />
        <input
          type="search"
          placeholder="Buscar"
          className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#8a8a8a] outline-none"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6a6a6a] hover:bg-[#f1f1f1] transition-colors">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6a6a6a] hover:bg-[#f1f1f1] transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a9d8f] text-white text-xs font-semibold hover:bg-[#21867a] transition-colors">
          A
        </button>
      </div>
    </header>
  )
}
