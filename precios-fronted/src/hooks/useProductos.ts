import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import Swal from "sweetalert2";

interface Producto {
  id: number;
  nombre: string;
  estado: string;
}

const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para mensajes de éxito

  // 🔹 Obtener productos
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Obtén el token de autenticación
      const response = await axios.get(`${API_URL}/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor, inicia sesión.');
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener productos activos
  const getProductosActivos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/productos/activo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor, inicia sesión.');
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear producto 
  const crearProducto = async (nombre: string, estado: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/productos`,
        { nombre, estado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setProductos([...productos, response.data]);
      
      setSuccessMessage("Producto agregado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      Swal.fire({
        title: "Éxito",
        text: "El producto ha sido creado correctamente.",
        icon: "success",
        confirmButtonColor: isDarkMode ? "#4CAF50" : "#3085d6",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor, inicia sesión.');
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
      
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el producto.",
        icon: "error",
        confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    }
  };

  // 🔹 Actualizar producto
  const actualizarProducto = async (id: number, nombre: string, estado: string) => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas actualizar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
      cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(
            `${API_URL}/productos/${id}`,
            { nombre, estado },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProductos(productos.map((p) => (p.id === id ? { ...p, nombre, estado } : p)));
          
          setSuccessMessage("Producto actualizado con éxito");
          setTimeout(() => setSuccessMessage(null), 3000);
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Actualizado",
            text: "El producto ha sido actualizado.",
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('No autorizado. Por favor, inicia sesión.');
            } else {
              setError(err.message);
            }
          } else if (err instanceof Error) {
            setError(err.message);
          }
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el producto.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  };

  // 🔹 Cambiar estado de producto
  const cambiarEstadoProducto = async (id: number, nuevoEstado: string) => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado de esta presentación a "${nuevoEstado === '1' ? 'Activo' : 'Inactivo'}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
      cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(
            `${API_URL}/productos/estado/${id}`,
            { estado: nuevoEstado },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          setProductos((prevProductos) =>
            prevProductos.map((p) =>
              p.id === id ? { ...p, estado: nuevoEstado } : p
            )
          );
          
          setSuccessMessage(`Estado del producto cambiado a "${nuevoEstado}" con éxito`);
          setTimeout(() => setSuccessMessage(null), 3000);
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Estado Cambiado",
            text: `El estado de la presentación ha sido cambiado a "${nuevoEstado === '1' ? 'Activo' : 'Inactivo'}".`,
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('No autorizado. Por favor, inicia sesión.');
            } else {
              setError(err.message);
            }
          } else if (err instanceof Error) {
            setError(err.message);
          }
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Error",
            text: "No se pudo cambiar el estado del producto.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id: number) => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
      cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/productos/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setProductos(productos.filter((p) => p.id !== id));
          setSuccessMessage("Producto eliminado con éxito");
          setTimeout(() => setSuccessMessage(null), 3000);
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Eliminado",
            text: "El producto ha sido eliminado.",
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('No autorizado. Por favor, inicia sesión.');
            } else {
              setError(err.message);
            }
          } else if (err instanceof Error) {
            setError(err.message);
          }
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el producto.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  };

  // Cargar productos al montar el hook
  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    successMessage,
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto,
    getProductosActivos
  };
};

export default useProductos;