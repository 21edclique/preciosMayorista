import React, { useState, useMemo } from "react";
import usePresentacion from "../hooks/usePresentacion";
import { Edit2, Trash2, Plus, Search, X } from "lucide-react";

interface PresentacionProps {
  isDarkMode?: boolean;
}

const IconButton = ({
  children,
  onClick,
  color = "default",
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: "default" | "edit" | "delete";
  ariaLabel: string;
}) => {
  const colorStyles = {
    default: "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
    edit: "text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900",
    delete: "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900",
  };
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
    >
      {children}
    </button>
  );
};

const Presentacion: React.FC<PresentacionProps> = () => {
  const {
    presentacion,
    loading,
    error,
    fetchpresentacion,
    crearPresentacion,
    actualizarPresentacion,
    eliminarPresentacion,
    cambiarEstadoPresentacion,
  } = usePresentacion();

  const [nuevaPresentacion, setNuevaPresentacion] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("1");
  const [editando, setEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("1");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Filtrar presentaciones según el término de búsqueda
  const presentacionesFiltradas = useMemo(() => {
    if (!terminoBusqueda.trim()) return presentacion;

    const termino = terminoBusqueda.toLowerCase();
    return presentacion.filter((item) =>
      item.nombre.toLowerCase().includes(termino)
    );
  }, [presentacion, terminoBusqueda]);

  // Manejar la creación de una nueva presentación
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaPresentacion.trim()) {
      crearPresentacion(nuevaPresentacion, nuevoEstado);
      setNuevaPresentacion("");
      setNuevoEstado("1");
    }
  };

  // Iniciar la edición de una presentación
  const iniciarEdicion = (id: number, nombre: string, estado: string) => {
    setEditando(id);
    setNombreEditado(nombre);
    setEstadoEditado(estado);
  };

  // Guardar los cambios de una presentación editada
  const guardarEdicion = (id: number) => {
    if (nombreEditado.trim()) {
      // Verificar si solo cambió el estado
      const presentacionOriginal = presentacion.find(p => p.id_presentacion === id);
      
      if (presentacionOriginal && presentacionOriginal.nombre === nombreEditado && presentacionOriginal.estado !== estadoEditado) {
        // Si solo cambió el estado, usar la función específica
        cambiarEstadoPresentacion(id, estadoEditado);
      } else {
        // Si cambió el nombre, usar la función general
        actualizarPresentacion(id, nombreEditado);
      }
      
      setEditando(null);
      setNombreEditado("");
      setEstadoEditado("1");
    }
  };

  // Cambiar directamente el estado de una presentación
  const handleCambiarEstado = (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === "1" ? "0" : "1";
    cambiarEstadoPresentacion(id, nuevoEstado);
  };

  // Cancelar la edición
  const cancelarEdicion = () => {
    setEditando(null);
    setNombreEditado("");
    setEstadoEditado("1");
  };

  // Eliminar una presentación
  const handleEliminar = (id: number) => {
    eliminarPresentacion(id);
  };

  // Limpiar el término de búsqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
  };

  if (loading && presentacion.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] dark:bg-gray-900 dark:text-white">
        <div className="animate-spin mr-3 h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p>Cargando presentaciones...</p>
      </div>
    );
  }

  if (error && presentacion.length === 0) {
    return (
      <div className="text-center py-10 dark:bg-gray-900 dark:text-red-400 text-red-600">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="text-lg font-medium mb-4">Error al cargar presentaciones: {error}</p>
        <button
          onClick={fetchpresentacion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <main className="p-2 sm:p-2 md:p-1 lg:p-2 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto p-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Presentaciones</h1>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" size={18} />
                {terminoBusqueda && (
                  <button
                    onClick={limpiarBusqueda}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Añadir Presentación</span>
              </button>
            </div>
          </div>

          {/* Formulario para añadir nueva presentación */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={nuevaPresentacion}
                  onChange={(e) => setNuevaPresentacion(e.target.value)}
                  placeholder="Nombre de la presentación"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                  dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                  dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Añadir
                </button>
              </div>
            </form>
          </div>

          {/* Lista de presentaciones */}
          <div className="grid gap-3">
            {presentacionesFiltradas.length === 0 ? (
              <div className="p-8 text-center">
                {presentacion.length === 0 ? (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-4 dark:text-gray-600 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p className="text-lg dark:text-gray-400 text-gray-500">No hay presentaciones disponibles.</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-4 dark:text-gray-600 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p className="text-lg dark:text-gray-400 text-gray-500">
                      No se encontraron presentaciones con "{terminoBusqueda}".
                    </p>
                    <button
                      onClick={limpiarBusqueda}
                      className="mt-4 px-4 py-2 rounded-md dark:bg-blue-600 bg-blue-100 dark:text-white text-blue-700 dark:hover:bg-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      Ver todas las presentaciones
                    </button>
                  </div>
                )}
              </div>
            ) : (
              presentacionesFiltradas.map((item) => (
                <div key={item.id_presentacion} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {editando === item.id_presentacion ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                        dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                      />
                      <select
                        value={estadoEditado}
                        onChange={(e) => setEstadoEditado(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                        dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                      >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                      </select>
                      <button
                        onClick={() => guardarEdicion(item.id_presentacion)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                     
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Nombre:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{item.nombre}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Estado:</span>
                        <span 
                          className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            item.estado === "1"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                          } transition-colors`}
                          onClick={() => handleCambiarEstado(item.id_presentacion, item.estado)}
                          title="Clic para cambiar estado"
                        >
                          {item.estado === "1" ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="flex justify-end col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex gap-2">
                          <IconButton
                            onClick={() => iniciarEdicion(item.id_presentacion, item.nombre, item.estado)}
                            color="edit"
                            ariaLabel="Editar"
                          >
                            <Edit2 size={18} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEliminar(item.id_presentacion)}
                            color="delete"
                            ariaLabel="Eliminar"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Mostrar error si ocurre durante alguna operación */}
          {error && (
            <div className="mt-6 p-4 rounded-md border dark:bg-red-900 dark:border-red-800 dark:text-red-200 bg-red-50 border-red-200 text-red-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Error: {error}</span>
              </div>
            </div>
          )}

          {/* Indicador de carga para operaciones en segundo plano */}
          {loading && presentacion.length > 0 && (
            <div className="mt-6 p-4 rounded-md border dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200 bg-blue-50 border-blue-200 text-blue-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Actualizando datos...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Presentacion;