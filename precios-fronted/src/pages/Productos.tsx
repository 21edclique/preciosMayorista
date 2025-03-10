import React, { useState, useMemo } from "react";
import useProductos from "../hooks/useProductos";

interface ProductosProps {
  isDarkMode?: boolean;
}

const Productos: React.FC<ProductosProps> = ({ isDarkMode = false }) => {
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
  const confirmarEliminar = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      eliminarProducto(id);
    }
  };

  // Limpiar el término de búsqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
  };

  if (loading && productos.length === 0) {
    return (
      <div className={`text-center py-10 ${isDarkMode ? "bg-gray-900 text-white" : ""}`}>
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
        </div>
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }

  if (error && productos.length === 0) {
    return (
      <div className={`text-center py-10 ${isDarkMode ? "bg-gray-900 text-red-400" : "text-red-600"}`}>
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : ""}`}>Gestión de Productos</h1>

      {/* Formulario para añadir nuevo producto */}
      <div className={`mb-6 p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : ""}`}>Añadir Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={nuevoProducto}
              onChange={(e) => setNuevoProducto(e.target.value)}
              placeholder="Nombre del producto"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>
          <div>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className={`w-full sm:w-auto px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
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

      {/* Buscador de productos */}
      <div className={`mb-6 p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : ""}`}>Buscar Productos</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>
          <div>
            {terminoBusqueda && (
              <button
                onClick={limpiarBusqueda}
                className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-xl font-semibold p-4 border-b ${
          isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 border-gray-200"
        }`}>
          Lista de Productos ({productosFiltrados.length} de {productos.length})
        </h2>

        {productosFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            {productos.length === 0 ? (
              <div>
                <svg className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No hay productos disponibles.</p>
              </div>
            ) : (
              <div>
                <svg className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No se encontraron productos con "{terminoBusqueda}".
                </p>
                <button
                  onClick={limpiarBusqueda}
                  className={`mt-4 px-4 py-2 rounded-md ${
                    isDarkMode 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  } transition-colors`}
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <th className={`px-6 py-3 text-left font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Nombre
                  </th>
                  <th className={`px-6 py-3 text-center font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-3 text-right font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className={`${
                    isDarkMode 
                      ? "hover:bg-gray-700" 
                      : "hover:bg-gray-50"
                  } transition-colors`}>
                    {editando === producto.id ? (
                      <td colSpan={3} className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            type="text"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                            className={`flex-1 min-w-0 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                : "bg-white border-gray-300 focus:ring-blue-400"
                            }`}
                          />
                          <select
                            value={estadoEditado}
                            onChange={(e) => setEstadoEditado(e.target.value)}
                            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                : "bg-white border-gray-300 focus:ring-blue-400"
                            }`}
                          >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                          </select>
                          <button
                            onClick={() => guardarEdicion(producto.id)}
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
                      </td>
                    ) : (
                      <>
                        <td className={`px-6 py-4 ${isDarkMode ? "text-white" : ""}`}>
                          {producto.nombre}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                              producto.estado === "1"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            } transition-colors`}
                            onClick={() => handleCambiarEstado(producto.id, producto.estado)}
                            title="Clic para cambiar estado"
                          >
                            {producto.estado === "1" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => iniciarEdicion(producto.id, producto.nombre, producto.estado)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => confirmarEliminar(producto.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mostrar error si ocurre durante alguna operación */}
      {error && (
        <div className={`mt-6 p-4 rounded-md border ${
          isDarkMode 
            ? "bg-red-900 border-red-800 text-red-200" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* Indicador de carga para operaciones en segundo plano */}
      {loading && productos.length > 0 && (
        <div className={`mt-6 p-4 rounded-md border ${
          isDarkMode 
            ? "bg-blue-900 border-blue-800 text-blue-200" 
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Actualizando datos...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;