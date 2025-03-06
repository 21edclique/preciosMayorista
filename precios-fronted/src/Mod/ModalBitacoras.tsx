import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import useCamara from '../hooks/useCamara'
import useNave from '../hooks/useNave'
import { useUsuarios } from '../hooks/useUsuarios'

type ModalBitacorasProps = {
  showForm: boolean
  editMode: boolean
  formData: {
    fecha: string
    id_usuario_per: string
    hora: string
    id_camara: string
    id_nave_per: number
    camara: string
    novedad: string
    resultado: string
    referencia: string
    turno: string
    id_colega: string // Nuevo campo
  }
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, datosParaEnviar: any) => void
  setShowForm: (show: boolean) => void
}

type Nave = {
  id_nave: number
  nombre: string
  sector: number
  productos: string
}

type TimeRestriction = {
  hours: number
  minutes: number
}

type Camara = {
  id_camara: number
  nombre: string
  id_nave_per: number
}
const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
)

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {children}
  </label>
)

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  ),
)

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>((props, ref) => (
  <select
    {...props}
    ref={ref}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 
                 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
))

const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
  <textarea
    {...props}
    ref={ref}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
                 min-h-[100px]"
  />
))

const ModalBitacoras: React.FC<ModalBitacorasProps> = ({
  showForm,
  editMode,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  const { naveData, loading: naveLoading } = useNave()
  const { camaraData, loading: camaraLoading } = useCamara()
  const { usuarios } = useUsuarios() // Usa el hook de usuarios
  // Filter cameras based on selected nave
  const [filteredCamaras, setFilteredCamaras] = useState<Camara[]>([])
  const [userRole, setUserRole] = useState<number>(0)

  useEffect(() => {
    if (!showForm) {
      // Resetear el formulario cuando se cierra
      handleInputChange({
        target: {
          name: 'id_nave_per',
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [showForm])

  // Obtener el nombre del usuario original en modo de edición
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')

    setUserRole(userData.id_rol_per || 0)
    if (!editMode && !formData.id_usuario_per) {
      handleInputChange({
        target: { name: 'id_usuario_per', value: userData.id_usuario?.toString() || '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [formData.id_usuario_per, editMode])

 
  const isFieldDisabled = (fieldName: string): boolean => {
    // Si no está en modo edición, nada está deshabilitado
    if (!editMode) return false;
    
    // Siempre bloquear el campo de Usuario 2 (acompañante) en modo edición para todos
    if (fieldName === 'acompañante') return true;
    
    // Para los demás campos, solo están bloqueados para no administradores
    if (userRole === 1) return false;
    
    // Para usuarios no administradores, bloquear otros campos
    return true;
  }

  useEffect(() => {
    if (formData.id_nave_per && camaraData.length > 0) {
      const idNavePer = Number(formData.id_nave_per)
      const filtered = camaraData.filter((camara) => camara.id_nave_per === idNavePer)
      setFilteredCamaras(filtered)

      // Solo resetear la cámara si NO estamos en modo edición y no hay una cámara seleccionada
      if (!editMode && !formData.camara) {
        handleInputChange({
          target: {
            name: 'camara',
            value: filtered[0]?.nombre || '', // Usar el nombre de la cámara
          },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    } else {
      setFilteredCamaras([])
    }
  }, [formData.id_nave_per, camaraData, formData.camara, editMode])

  useEffect(() => {
    if (editMode) {
      //console.log('🟡 Datos de formData al abrir en edición:', formData)
    }
  }, [editMode, formData])

  useEffect(() => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0].substring(0)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')

    // Asignar fecha y hora solo si no están definidas
    if (!formData.fecha) {
      handleInputChange({
        target: { name: 'fecha', value: date },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    if (!formData.hora) {
      handleInputChange({
        target: { name: 'hora', value: time },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    // Asignar el usuario logeado solo si NO estamos en modo de edición
    if (!editMode && !formData.id_usuario_per) {
      handleInputChange({
        target: { name: 'id_usuario_per', value: userData.id_usuario?.toString() || '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [formData.fecha, formData.hora, formData.id_usuario_per, editMode])

  const handleColegaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange({
      target: {
        name: 'id_colega',
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prepara los datos para enviar
    const datosParaEnviar = {
      ...formData,
      camara: formData.camara, // Envía el nombre de la cámara
    }

    // Envía los datos
    handleSubmit(e, datosParaEnviar)
  }

  if (!showForm) return null

  const getUserDisplayName = () => {
    // console.log('🔵 ID en formData.id_usuario_per:', formData.id_usuario_per)

    if (editMode && formData.id_usuario_per) {
      // Buscar el usuario en la lista de usuarios
      const usuarioOriginal = usuarios.find(
        (usuario) => usuario.id_usuario === Number(formData.id_usuario_per),
      )

      // console.log("🔵 Usuario encontrado en edición:", usuarioOriginal);

      return usuarioOriginal
        ? usuarioOriginal.nombres
        : `Usuario ID: ${formData.id_usuario_per}`
    }

    // Si no está en edición, usa el usuario logueado
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    return userData.nombres || 'Usuario desconocido'
  }
  console.log(isFieldDisabled('acompañante'))
  console.log('Valor de id_colega:', formData.id_colega)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

        <div className="inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Editar Bitácora' : 'Nueva Bitácora'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={
                      formData.fecha
                        ? formData.fecha.split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="usuario">Usuario</Label>
                  <Input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={getUserDisplayName()}
                    readOnly
                  />
                  <input
                    type="hidden"
                    name="id_usuario_per"
                    value={formData.id_usuario_per}
                    onChange={handleInputChange}
                    readOnly={editMode}
                  />
                </InputWrapper>
                
        <InputWrapper>
          <Label htmlFor="acompañante">Usuario 2</Label>
          <Select
            id="acompañante"
            name="id_colega"
            value={formData.id_colega || ''}
            onChange={handleColegaChange}
            disabled={isFieldDisabled('acompañante')}
          >
            <option value="">Seleccione un segundo usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id_usuario} value={usuario.id_usuario.toString()}>
                {usuario.nombres}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Label htmlFor="nave">Nave</Label>
          <Select
            id="nave"
            name="id_nave_per"
            value={formData.id_nave_per}
            onChange={(e) => {
              handleInputChange(e)
              // Reset camera when changing nave
              handleInputChange({
                target: {
                  name: 'camara',
                  value: '',
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            required
            disabled={naveLoading || isFieldDisabled('nave')}
          >
            <option value="">Seleccione una nave</option>
            {naveData.map((nave) => (
              <option key={nave.id_nave} value={nave.id_nave}>
                {nave.nombre} - Sector {nave.sector}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Label htmlFor="camara">Cámara</Label>
          <Select
            id="camara"
            name="camara"
            value={formData.camara || ''}
            onChange={handleInputChange}
            disabled={camaraLoading || !formData.id_nave_per || isFieldDisabled('nave')}
          >
            <option value="">Seleccione una Cámara</option>
            {filteredCamaras.map((camara) => (
              <option key={camara.id_camara} value={camara.nombre}>
                {camara.nombre}
              </option>
            ))}
          </Select>
        </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="turno">Turno</Label>
                  <Select
                    id="turno"
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                    required
                    disabled={isFieldDisabled('turno')}
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="1">Turno 1</option>
                    <option value="2">Turno 2</option>
                    <option value="3">Turno 3</option>
                  </Select>
                </InputWrapper>
              </div>

              <InputWrapper>
                <Label htmlFor="novedad">Novedad</Label>
                <TextArea
                  id="novedad"
                  name="novedad"
                  placeholder="Ingrese la novedad"
                  value={formData.novedad}
                  onChange={handleInputChange}
                  required
                  maxLength={5000}
                />
              </InputWrapper>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper>
                  <Label htmlFor="resultado">Resultado</Label>
                  <Select
                    id="resultado"
                    name="resultado"
                    value={formData.resultado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un resultado</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="No Resuelto">No resuelto</option>
                    <option value="Pendiente">Pendiente</option>
                  </Select>
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="referencia">Referencia</Label>
                  <TextArea
                    id="referencia"
                    name="referencia"
                    placeholder="Ingrese la referencia"
                    value={formData.referencia}
                    onChange={handleInputChange}
                    required
                    maxLength={244}
                  />
                </InputWrapper>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 
                           dark:hover:bg-blue-700 transition-colors duration-200"
                >
                  {editMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalBitacoras
