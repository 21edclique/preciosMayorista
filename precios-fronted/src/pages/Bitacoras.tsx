import React, { useState, useRef, useEffect } from 'react'
import { useBitacoras } from '../hooks/useBitacoras'
import ModalBitacoras from '../Mod/ModalBitacoras'
import jsPDF from 'jspdf'
import PdfPreviewModal from '../Mod/PdfPreviewModal' // Ajusta la ruta según tu estructura
import EpemaBalck from '../images/ep-ema-black.png'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Square,
} from 'lucide-react'

const IconButton = ({
  children,
  onClick,
  color = 'default',
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  color?: 'default' | 'edit' | 'delete'
  ariaLabel: string
}) => {
  const colorStyles = {
    default: 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
    edit: 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900',
    delete: 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900',
  }
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
    >
      {children}
    </button>
  )
}

const Bitacoras = () => {
  const {
    bitacoras,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showForm,
    editMode,
    formData,
    handleInputChange,
    handleAddBitacora,
    handleResolveBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    setShowForm,
  } = useBitacoras()
  const [userRole, setUserRole] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null) // Nuevo estado para el ID del usuario

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData)
      setUserRole(parsedUser.id_rol_per)
      setUserId(parsedUser.id_usuario) // Guardar el ID del usuario
    }
  }, [])

  const [goToPage, setGoToPage] = useState('')
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)
  const [selectedBitacora, setSelectedBitacora] = useState<any | null>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  const generatePDF = () => {
    if (!selectedBitacora) {
      console.error('No hay bitácora seleccionada.')
      return
    }

    const pdf = new jsPDF()
    let y = 5 // Posición inicial
    const marginLeft = 15
    const maxWidth = 180 // Ancho máximo del texto sin desbordamiento
    const lineSpacing = 5 // Espaciado entre líneas
    const pageHeight = pdf.internal.pageSize.height - 20 // Altura máxima antes de nueva página
    const imageWidth = 20
    const imageHeight = 20
    const pageWidth = pdf.internal.pageSize.width
    const textX = pageWidth / 2 // Centrar texto en la página

    const year = new Date(selectedBitacora.fecha).getFullYear() // Obtiene el año actual
    const bitacoraId = selectedBitacora.id_bitacora // Reemplaza con el ID dinámico de la bitácora
    y += 10

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    pdf.text(`EP-EMA-OPERVIG-${year}-${bitacoraId}`, textX, y, { align: 'center' })
    y += 7

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Sistema de Monitoreo y Control', textX, y, { align: 'center' })
    y += 2

    // Agregar el logo debajo del texto
    pdf.addImage(EpemaBalck, 'PNG', (pageWidth - imageWidth) / 2, y, imageWidth, imageHeight)
    y += imageHeight + 10

    pdf.setFont('helvetica', 'bold')
    pdf.text('Fecha:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(String(selectedBitacora.fecha.split('T')[0]), marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('De:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${selectedBitacora.nombres}`, marginLeft + 30, y)
    y += lineSpacing // Incrementa la posición y después de escribir el primer nombre

    // Si existe un compañero, escribir su nombre debajo
    if (selectedBitacora.nombre_colega) {
      pdf.text(`${selectedBitacora.nombre_colega}`, marginLeft + 30, y)
      y += lineSpacing // Incrementa la posición y después de escribir el nombre del compañero
    }

    pdf.setFont('helvetica', 'bold')
    pdf.text('Para:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Ing. Jorge Chicaiza (Analista TIC)', marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Asunto:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Informe diario de Bitácora', marginLeft + 30, y)
    y += lineSpacing

    pdf.line(marginLeft, y, 195, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Detalles de la Novedad:', marginLeft, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Hora:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${selectedBitacora.hora}`, marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Nave:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${selectedBitacora.nombre}`, marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Cámara:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${selectedBitacora.camara}`, marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Turno:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${selectedBitacora.turno}`, marginLeft + 30, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Referencia:', marginLeft, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'normal')

    // Dividir el texto en líneas ajustadas al ancho máximo
    const referenciaLines: string[] = pdf.splitTextToSize(selectedBitacora.referencia, maxWidth)

    // Iterar sobre cada línea y agregarla al PDF
    referenciaLines.forEach((line: string) => { // Especificamos que line es de tipo string
      if (y + lineSpacing > pageHeight) {
        pdf.addPage()
        y = 20
      }
      pdf.text(line, marginLeft, y) // Aseguramos que el texto se alinee correctamente
      y += lineSpacing
    })



    pdf.line(marginLeft, y, 195, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Descripción:', marginLeft, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'normal')
    const textLines = pdf.splitTextToSize(selectedBitacora.novedad, maxWidth)

    for (let i = 0; i < textLines.length; i++) {
      if (y + lineSpacing > pageHeight) {
        pdf.addPage()
        y = 20
      }
      pdf.text(textLines[i], marginLeft, y)
      y += lineSpacing
    }

    pdf.line(marginLeft, y, 195, y)
    y += lineSpacing

    pdf.setFont('helvetica', 'bold')
    pdf.text('Resultado:', marginLeft, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(selectedBitacora.resultado, marginLeft + 30, y)
    y += lineSpacing * 5

    // Verificar si existe un colega
    if (selectedBitacora.nombre_colega) {
      if (y + 20 > pageHeight) {
        pdf.addPage()
        y = 20
      }

      // Firma del usuario principal
      pdf.text('__________________________', 50, y, { align: 'center' })
      pdf.text(selectedBitacora.nombres, 50, y + 5, { align: 'center' })

      // Firma del colega
      pdf.text('__________________________', 150, y, { align: 'center' })
      pdf.text(selectedBitacora.nombre_colega, 150, y + 5, { align: 'center' })

      y += lineSpacing * 5 // Espacio adicional después de las firmas
    } else {
      if (y + 20 > pageHeight) {
        pdf.addPage()
        y = 20
      }

      // Solo firma del usuario principal
      pdf.text('__________________________', 105, y, { align: 'center' })
      pdf.text(selectedBitacora.nombres, 105, y + 5, { align: 'center' })

      y += lineSpacing * 5 // Espacio adicional después de la firma
    }

    // Pie de página
    pdf.setFontSize(8)
    pdf.text('Documento generado automáticamente - Uso interno', 105, pageHeight - 10, {
      align: 'center',
    })

    pdf.save(`Bitacora_${selectedBitacora.id_bitacora}.pdf`)
  }

  const [showPdfPreview, setShowPdfPreview] = useState(false)

  const handlePrintPDF = (bitacora: any) => {
    setSelectedBitacora(bitacora)
    setShowPdfPreview(true)
  }

  const handleDownloadPDF = () => {
    generatePDF()
    setShowPdfPreview(false)
  }

  const closePdfPreview = () => {
    setPdfPreview(null)
    setSelectedBitacora(null)
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  // Ordenar bitácoras por fecha descendente (más recientes primero)
  const sortedBitacoras = [...bitacoras].sort((a, b) => b.id_bitacora - a.id_bitacora)
  const totalPages = Math.ceil(sortedBitacoras.length / itemsPerPage)
  const currentItems = sortedBitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="p-2 sm:p-2 md:p-2 lg:p-2 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto p-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bitácoras</h1>
              <button
                onClick={() => {
                  handleAddBitacora()
                  setShowForm(true)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar Bitácora</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="grid gap-1">
              {currentItems.map((bitacora) => {
                // Verificar si la bitácora fue creada por el usuario y es del día actual
                const isBitacoraFromUser = bitacora.id_usuario_per === userId
                // Función para verificar si la bitácora fue creada dentro de las últimas 9 horas
                const isBitacoraWithinLast9Hours = (bitacora: any) => {
                  // Combinar fecha y hora en una cadena ISO válida
                  const fechaHoraCreacion = `${bitacora.fecha.split('T')[0]}T${bitacora.hora}`

                  // Crear un objeto Date a partir de la cadena combinada
                  const fechaCreacion = new Date(fechaHoraCreacion)

                  // Obtener la fecha y hora actual
                  const ahora = new Date()

                  // Calcular la diferencia en milisegundos
                  const diferenciaEnMilisegundos = ahora.getTime() - fechaCreacion.getTime()

                  // Convertir la diferencia a horas
                  const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60)

                  // Depuración

                  // Verificar si la diferencia es menor o igual a 9 horas
                  return diferenciaEnHoras <= 9
                }

                return (
                  <div
                    key={bitacora.id_bitacora}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          ID:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.id_bitacora}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Fecha:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.fecha.split('T')[0]} {/* Formatear la fecha */}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Usuario:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.nombres}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Usuario 2:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.nombre_colega}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Hora:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.hora}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Nave:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.nombre}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Cámara:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.camara}
                        </span>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Novedad:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.novedad}
                        </span>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Resultado:
                        </span>
                        <span
                          className={`ml-2 text-gray-900 dark:text-white ${bitacora.resultado === 'Resuelto'
                              ? 'text-green-600 dark:text-green-600'
                              : bitacora.resultado === 'Pendiente'
                                ? 'text-yellow-600 dark:text-yellow-600'
                                : 'text-red-600 dark:text-red-600'
                            }`}
                        >
                          {bitacora.resultado}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Referencia:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.referencia}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Turno:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {bitacora.turno}
                        </span>
                      </div>
                      <div className="flex justify-end md:col-span-2 lg:col-span-1">
                        <div className="flex gap-2">
                          <IconButton
                            onClick={() => handlePrintPDF(bitacora)}
                            color="default"
                            ariaLabel="Imprimir PDF"
                          >
                            <Printer size={18} />
                          </IconButton>
                          {userRole === 1 ? (
                            // Controles de administrador
                            <div className="flex gap-2">
                              <IconButton
                                onClick={() => handleEdit(bitacora)}
                                color="edit"
                                ariaLabel="Editar"
                              >
                                <Edit2 size={18} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDelete(bitacora.id_bitacora)}
                                color="delete"
                                ariaLabel="Eliminar"
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </div>
                          ) : (
                            // Controles para usuarios no administradores
                            <div className="flex gap-2">
                              {isBitacoraFromUser && isBitacoraWithinLast9Hours(bitacora) && (
                                <IconButton
                                  onClick={() => handleEdit(bitacora)}
                                  color="edit"
                                  ariaLabel="Actualizar"
                                >
                                  <Edit2 size={18} />
                                </IconButton>
                              )}
                              {bitacora.resultado !== 'Resuelto' && (
                                <IconButton
                                  onClick={() => handleResolveBitacora(bitacora.id_bitacora)}
                                  color="default"
                                  ariaLabel="Marcar como resuelto"
                                >
                                  <Square
                                    size={18}
                                    className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-500"
                                  />
                                </IconButton>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Paginación */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between mt-2 gap-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center w-full md:w-auto">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, sortedBitacoras.length)}
                <br />
                de {sortedBitacoras.length} bitácoras | Página {currentPage} de {totalPages}
              </p>

              <nav className="flex flex-wrap md:flex-nowrap items-center gap-1 sm:gap-2 justify-center">
                {/* Botón ir a primera página */}
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 
          disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronsLeft size={20} />
                </button>

                {/* Botón ir a página anterior */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 
          disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Botón ir a página siguiente */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 
          disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Botón ir a última página */}
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 
          disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronsRight size={20} />
                </button>

                {/* Input para ir a página específica */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goToPage || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (
                        value === '' ||
                        (parseInt(value) >= 1 && parseInt(value) <= totalPages)
                      ) {
                        setGoToPage(value)
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const pageNumber = parseInt(goToPage)
                        if (pageNumber >= 1 && pageNumber <= totalPages) {
                          paginate(pageNumber)
                          setGoToPage('')
                        }
                      }
                    }}
                    className="w-10 sm:w-12 text-center border rounded-md bg-gray-100 dark:bg-gray-900 
            text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  {/* Mostrar el número de la página actual */}
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {currentPage} / {totalPages}
                  </span>
                </div>
              </nav>
            </div>


          </div>
        </div>

        {/* Modal */}
        <ModalBitacoras
          showForm={showForm}
          editMode={editMode}
          formData={formData}
          setShowForm={setShowForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
        {/* PDF Preview Modal */}
        <PdfPreviewModal
          isOpen={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          selectedBitacora={selectedBitacora}
          onDownload={handleDownloadPDF}
        />
      </div>
    </main>
  )
}

export default Bitacoras
