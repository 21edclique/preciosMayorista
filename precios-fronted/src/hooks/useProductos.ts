import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/index";

interface Producto {
  id: number;
  nombre: string;
  estado: string;
}

const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

 
 // 🔹 Crear producto 
const crearProducto = async (nombre: string, estado: string) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token de autenticación
    const response = await axios.post(
      `${API_URL}/productos`,
      { nombre, estado }, // Se envían ambos parámetros
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Asegura el formato JSON
        },
      }
    );
    setProductos([...productos, response.data]);
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
  }
};


  // 🔹 Actualizar producto
  const actualizarProducto = async (id: number, nombre: string, estado: string) => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token de autenticación
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
    }
  };


  const cambiarEstadoProducto = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token de autenticación
      await axios.put(
        `${API_URL}/productos/${id}/estado`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualizar el estado en la lista de productos
      setProductos((prevProductos) =>
        prevProductos.map((p) =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );
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
    }
  };





  // 🔹 Eliminar producto
  const eliminarProducto = async (id: number) => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token de autenticación
      await axios.delete(`${API_URL}/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(productos.filter((p) => p.id !== id));
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
    }
  };

  // Cargar productos al montar el hook
  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto
  };
};

export default useProductos;