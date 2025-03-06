import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type ModalUsuarioProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editMode: boolean;
  formData: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldsToDisplay: { [key: string]: string };
  usuariosRegistrados: any[]; // Lista de usuarios registrados
};

const ModalUsuario: React.FC<ModalUsuarioProps> = ({
  showModal,
  setShowModal,
  editMode,
  formData,
  handleInputChange,
  handleSubmit,
  fieldsToDisplay,
  usuariosRegistrados,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si el usuario ya esta registrado 
    const usuario= formData['usuario'];
    const usuarioExistente = usuariosRegistrados.some(usuario => usuario.usuario === usuario);

    if (usuarioExistente && !editMode) {
      setError('El usuario ya esta registrado .');
      return;
    }

    // Limpiar el mensaje de error si no hay problemas
    setError('');

    // Ejecutar la función handleSubmit si la cédula no está registrada
    handleSubmit(e);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex min-h-full items-center justify-center p-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

        <div className="inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(fieldsToDisplay).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {label}
                    </label>

                    {key === 'id_rol' ? (
                      <select
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Seleccione un rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Usuario</option>
                       
                      </select>
                    )  : key === 'password' ? (
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id={key}
                          name={key}
                          value={formData[key] || ''}
                          onChange={handleInputChange}
                          placeholder="Ingrese contraseña"
                          required={!editMode} // Solo es obligatorio al crear un usuario
                          maxLength={20}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        id={key}
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        placeholder={`Ingrese ${label.toLowerCase()}`}
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                      />
                    )}
                  </div>
                ))}

                {error && (
                  <div className="col-span-2 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {editMode ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuario;