'use client'

import { X } from 'lucide-react'
import OpticaEsencial from './OpticaEsencial'
import ClinicaConfianza from './ClinicaConfianza'
import LensShop from './LensShop'
import VisionPro from './VisionPro'
import LuxOptic from './LuxOptic'
import MedCenterPro from './MedCenterPro'

interface TemplatePreviewProps {
  plantillaNombre: string
  onClose: () => void
}

function renderTemplate(nombre: string) {
  const props = { nombreTienda: 'OftalShop Demo' }
  switch (nombre) {
    case 'esencial':  return <OpticaEsencial {...props} />
    case 'clinica':   return <ClinicaConfianza {...props} />
    case 'lensshop':  return <LensShop {...props} />
    case 'visionpro': return <VisionPro {...props} />
    case 'luxoptic':  return <LuxOptic {...props} />
    case 'medcenter': return <MedCenterPro {...props} />
    default:          return <OpticaEsencial {...props} />
  }
}

const NOMBRES: Record<string, string> = {
  esencial: 'Óptica Esencial', clinica: 'Clínica Confianza',
  lensshop: 'LensShop', visionpro: 'VisionPro',
  luxoptic: 'LuxOptic', medcenter: 'MedCenter Pro',
}

export default function TemplatePreview({ plantillaNombre, onClose }: TemplatePreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f1f1] shrink-0">
          <p className="text-sm font-semibold text-[#1a1a1a]">
            Vista previa — {NOMBRES[plantillaNombre] ?? plantillaNombre}
          </p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#6a6a6a] hover:bg-[#f1f1f1] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderTemplate(plantillaNombre)}
        </div>
      </div>
    </div>
  )
}
