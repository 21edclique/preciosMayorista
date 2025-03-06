import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface Precio {
  id: number;
  producto_id: number;
  precio: number;
  peso: number;
  fecha: string;
  id_presentacion_per: number;
}

interface UsePreciosDiariosResult {
  precios: Precio[];
  loading: boolean;
  error: string | null;
  obtenerPrecios: () => Promise<void>;
  guardarPrecio: (precio: Precio) => Promise<void>; // Usamos POST para crear y actualizar
  eliminarPrecio: (id: number) => Promise<void>;
}

const usePreciosDiarios = (token: string): UsePreciosDiariosResult => {
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar la función obtenerPrecios
  const obtenerPrecios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/precios/getprecio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrecios(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error al obtener los precios');
    } finally {
      setLoading(false);
    }
  }, [token]); // Dependencia: token

  // Llamar a obtenerPrecios cuando el componente se monta o cuando token cambia
  useEffect(() => {
    obtenerPrecios();
  }, [obtenerPrecios]); // Dependencia memoizada

  // Función para guardar un precio (usando POST para crear o actualizar)
  const guardarPrecio = async (precio: Precio) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/precios/addprecio`, precio, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setPrecios((prevPrecios) => {
        const existe = prevPrecios.some((p) => p.id === precio.id);
        if (existe) {
          return prevPrecios.map((p) => (p.id === precio.id ? { ...p, ...precio } : p));
        } else {
          return [...prevPrecios, response.data];
        }
      });
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error al guardar el precio');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un precio
  const eliminarPrecio = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/precios/deleteprecio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrecios((prevPrecios) => prevPrecios.filter((p) => p.id !== id));
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error al eliminar el precio');
    } finally {
      setLoading(false);
    }
  };

  return { precios, loading, error, obtenerPrecios, guardarPrecio, eliminarPrecio };
};

export default usePreciosDiarios;