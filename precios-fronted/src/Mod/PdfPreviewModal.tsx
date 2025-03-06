import React from 'react'
import { X } from 'lucide-react'
import EpemaBalck from '../images/ep-ema-black.png'
import EpemaWhite from '../images/ep-ema-white.png'

interface PdfPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  selectedBitacora: {
    fecha: string
    nombres: string
    id_bitacora: string
    hora: string
    nombre: string
    camara: string
    turno: string
    referencia: string
    novedad: string
    resultado: string
    nombre_colega?: string // Nuevo campo opcional para el compañero
  } | null
  onDownload: () => void
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedBitacora,
  onDownload,
}) => {
  if (!isOpen || !selectedBitacora) return null

  // Formatear la fecha para mostrar solo YYYY-MM-DD
  const formattedFecha = selectedBitacora.fecha.split('T')[0]
  const year = new Date(selectedBitacora.fecha).getFullYear()
  const bitacoraId = selectedBitacora.id_bitacora // Reemplázalo con el ID dinámico de la bitácora

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 dark:bg-opacity-70">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Vista Previa del PDF
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl text-gray-900 dark:text-gray-300">
                  EP-EMA-OPERVIG-{year}-{bitacoraId}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Monitoreo y Control
                </p>
              </div>

              {/* Image */}
              <div className="flex justify-center">
                <img src={EpemaBalck} alt="Epema Logo" className="h-20 dark:hidden" />
                <img src={EpemaWhite} alt="Epema Logo" className="h-20 hidden dark:block" />
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
                <div>
                  <p>
                    <span className="font-bold">Fecha:</span> {formattedFecha}
                  </p>
                  <p>
                    <span className="font-bold">De:</span> {selectedBitacora.nombres}
                  </p>
                  {/* Mostrar el nombre del colega debajo si existe */}
                  {selectedBitacora.nombre_colega && (

                    
                    <p>{selectedBitacora.nombre_colega}</p>
                  )} 
                  <p>
                    <span className="font-bold">Para:</span> Ing. Jorge Chicaiza (Analista TIC)
                  </p>
                  <p>
                    <span className="font-bold">Asunto:</span> Informe diario de Bitácora
                  </p>
                </div>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />

              {/* Details */}
              <div className="space-y-4 text-gray-800 dark:text-gray-300">
                <h3 className="font-bold dark:text-gray-100">Detalles de la Novedad:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="font-bold">Hora:</span> {selectedBitacora.hora}
                  </p>
                  <p>
                    <span className="font-bold">Nave:</span> {selectedBitacora.nombre}
                  </p>
                  <p>
                    <span className="font-bold">Cámara:</span> {selectedBitacora.camara}
                  </p>
                  <p>
                    <span className="font-bold">Turno:</span> {selectedBitacora.turno}
                  </p>
                  <p>
                    <span className="font-bold">Referencia:</span> {selectedBitacora.referencia}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold dark:text-gray-100">Descripción:</h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {selectedBitacora.novedad}
                  </p>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <p>
                  <span className="font-bold">Resultado:</span> {selectedBitacora.resultado}
                </p>
              </div>

              {/* Signature */}
              <div className="mt-12 text-center space-y-2">
                <div className="flex justify-center gap-8">
                  {/* Firma del usuario principal */}
                  <div className="border-t border-gray-300 dark:border-gray-600 w-48 pt-4">
                    <p className="text-gray-800 dark:text-gray-200">
                      {selectedBitacora.nombres}
                    </p>
                  </div>

                  {/* Firma del compañero si existe */}
                  {selectedBitacora.nombre_colega && (
                    <div className="border-t border-gray-300 dark:border-gray-600 w-48 pt-4">
                      <p className="text-gray-800 dark:text-gray-200">
                        {selectedBitacora.nombre_colega}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 
                dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfPreviewModal
