import React, { useState, useMemo } from "react";
import useProductos from "../hooks/useProductos";
import { Edit2, Trash2, Plus, Search, X, Check, XCircle } from "lucide-react";

const Productos: React.FC = () => {
  const {
    productos,
    loading,
    error,
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto,
  } = useProductos();

  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("1"); // Estado por defecto para nuevos productos
  const [editando, setEditando] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("1");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) return productos;

    const termino = terminoBusqueda.toLowerCase();
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(termino)
    );
  }, [productos, terminoBusqueda]);

  // Manejar la creación de un nuevo producto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoProducto.trim()) {
      crearProducto(nuevoProducto, nuevoEstado);
      setNuevoProducto("");
      setNuevoEstado("1"); // Restablecer el estado a "1" después de crear el producto
    }
  };

  // Iniciar la edición de un producto
  const iniciarEdicion = (id: number, nombre: string, estado: string) => {
    setEditando(id);
    setNombreEditado(nombre);
    setEstadoEditado(estado);
  };

  // Guardar los cambios de un producto editado
  const guardarEdicion = (id: number) => {
    if (nombreEditado.trim()) {
      // Verificar si solo cambió el estado
      const productoOriginal = productos.find(p => p.id === id);
      
      if (productoOriginal && productoOriginal.nombre === nombreEditado && productoOriginal.estado !== estadoEditado) {
        // Si solo cambió el estado, usar la función específica
        cambiarEstadoProducto(id, estadoEditado);
      } else {
        // Si cambió el nombre (y posiblemente el estado), usar la función general
        actualizarProducto(id, nombreEditado, estadoEditado);
      }
      
      setEditando(null);
      setNombreEditado("");
      setEstadoEditado("1");
    }
  };

  // Cambiar directamente el estado de un producto (sin entrar en modo edición)
  const handleCambiarEstado = (id: number, estadoActual: string) => {
    // Cambiar entre "1" (activo) y "0" (inactivo)
    const nuevoEstado = estadoActual === "1" ? "0" : "1";
    cambiarEstadoProducto(id, nuevoEstado);
  };

  // Cancelar la edición
  const cancelarEdicion = () => {
    setEditando(null);
    setNombreEditado("");
    setEstadoEditado("1");
  };

  // Confirmar la eliminación de un producto
  const handleEliminar = (id: number) => {
    eliminarProducto(id);
  };

  // Limpiar el término de búsqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
  };

  // Componente IconButton similar al de Usuarios
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

  if (loading && productos.length === 0) {
    return (
      <div className="text-center py-10 dark:bg-gray-900 dark:text-white">
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
        </div>
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }

  if (error && productos.length === 0) {
    return (
      <div className="text-center py-10 text-red-600 dark:bg-gray-900 dark:text-red-400">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="text-lg font-medium mb-4">Error al cargar productos: {error}</p>
        <button
          onClick={fetchProductos}
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Productos</h1>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Añadir Producto</span>
            </button>
          </div>
  
          {/* Formulario para añadir nuevo producto */}
          <div className="mb-6 p-6 rounded-lg shadow-md bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Añadir Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                  bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 border rounded-md focus:outline-none focus:ring-2 
                  bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Añadir
                </button>
              </div>
            </form>
          </div>
  
          {/* Buscador de productos */}
          <div className="mb-6 p-6 rounded-lg shadow-md bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Buscar Productos</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                  bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                />
              </div>
              <div>
                {terminoBusqueda && (
                  <button
                    onClick={limpiarBusqueda}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-md 
                    hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 
                    focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* Lista de productos */}
          <div className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold p-4 border-b bg-gray-50 dark:bg-gray-700 
            text-gray-900 dark:text-white border-gray-200 dark:border-gray-600">
              Lista de Productos ({productosFiltrados.length} de {productos.length})
            </h2>
  
            {productosFiltrados.length === 0 ? (
              <div className="p-8 text-center">
                {productos.length === 0 ? (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p className="text-lg text-gray-500 dark:text-gray-400">No hay productos disponibles.</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      No se encontraron productos con "{terminoBusqueda}".
                    </p>
                    <button
                      onClick={limpiarBusqueda}
                      className="mt-4 px-4 py-2 rounded-md bg-blue-100 dark:bg-blue-600 
                      text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                    >
                      Ver todos los productos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-1 p-4">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                    {editando === producto.id ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={nombreEditado}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                        />
                        <select
                          value={estadoEditado}
                          onChange={(e) => setEstadoEditado(e.target.value)}
                          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                          bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white focus:ring-blue-400 dark:focus:ring-blue-500"
                        >
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </select>
                        <IconButton
                          onClick={() => guardarEdicion(producto.id)}
                          color="edit"
                          ariaLabel="Guardar"
                        >
                          <Check size={18} />
                        </IconButton>
                        <IconButton
                          onClick={cancelarEdicion}
                          color="delete"
                          ariaLabel="Cancelar"
                        >
                          <X size={18} />
                        </IconButton>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <span className="font-semibold text-gray-600 dark:text-gray-300">Nombre:</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">{producto.nombre}</span>
                        </div>
                        <div>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Estado:</span>
                        <span 
                          className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            producto.estado === "1"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                          } transition-colors`}
                          onClick={() => handleCambiarEstado(producto.id, producto.estado)}
                          title="Clic para cambiar estado"
                        >
                          {producto.estado === "1" ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                        <div className="flex justify-end">
                          <div className="flex gap-2">
                            <IconButton
                              onClick={() => iniciarEdicion(producto.id, producto.nombre, producto.estado)}
                              color="edit"
                              ariaLabel="Editar"
                            >
                              <Edit2 size={18} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleEliminar(producto.id)}
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
                ))}
              </div>
            )}
          </div>
  
          {/* Mostrar error si ocurre durante alguna operación */}
          {error && (
            <div className="mt-6 p-4 rounded-md border bg-red-50 dark:bg-red-900 
            border-red-200 dark:border-red-800 text-red-700 dark:text-red-200">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                <span>Error: {error}</span>
              </div>
            </div>
          )}
  
          {/* Indicador de carga para operaciones en segundo plano */}
          {loading && productos.length > 0 && (
            <div className="mt-6 p-4 rounded-md border bg-blue-50 dark:bg-blue-900 
            border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200">
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

export default Productos;