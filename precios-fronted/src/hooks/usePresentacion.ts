import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/index'
import Swal from 'sweetalert2'

interface Presentacion {
  id_presentacion: number
  nombre: string
  estado: string
}

const usePresentacion = () => {
  const [presentacion, setPresentacion] = useState<Presentacion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null) // Estado para mensajes de éxito

  // 🔹 Obtener presentacion
  const fetchpresentacion = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/presentacion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setPresentacion(response.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor, inicia sesión.')
        } else {
          setError(err.message)
        }
      } else if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Obtener prresentaciones activas
  const getPresentacionesActivos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/presentacion/activo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPresentacion(response.data);
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

  // 🔹 Crear Presentacion
  const crearPresentacion = async (nombre: string, estado: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/presentacion`,
        { nombre, estado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      setPresentacion([...presentacion, response.data])
      
      setSuccessMessage("Presentación agregada con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      Swal.fire({
        title: "Éxito",
        text: "La presentación ha sido creada correctamente.",
        icon: "success",
        confirmButtonColor: isDarkMode ? "#4CAF50" : "#3085d6",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor, inicia sesión.')
        } else {
          setError(err.message)
        }
      } else if (err instanceof Error) {
        setError(err.message)
      }
      
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la presentación.",
        icon: "error",
        confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    }
  }

  // 🔹 Actualizar Presentacion
  const actualizarPresentacion = async (id_presentacion: number, nombre: string) => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas actualizar esta presentación?",
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
          const token = localStorage.getItem('token')
          await axios.put(
            `${API_URL}/presentacion/${id_presentacion}`,
            { nombre },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          setPresentacion(
            presentacion.map((p) => (p.id_presentacion === id_presentacion ? { ...p, nombre } : p)),
          )
          
          setSuccessMessage("Presentación actualizada con éxito");
          setTimeout(() => setSuccessMessage(null), 3000);
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Actualizado",
            text: "La presentación ha sido actualizada.",
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('No autorizado. Por favor, inicia sesión.')
            } else {
              setError(err.message)
            }
          } else if (err instanceof Error) {
            setError(err.message)
          }
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la presentación.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  }

  // 🔹 Eliminar Presentacion
  const eliminarPresentacion = async (id_presentacion: number) => {
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
          const token = localStorage.getItem('token')
          await axios.delete(`${API_URL}/presentacion/${id_presentacion}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setPresentacion(presentacion.filter((p) => p.id_presentacion !== id_presentacion))
          
          setSuccessMessage("Presentación eliminada con éxito");
          setTimeout(() => setSuccessMessage(null), 3000);
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Eliminado",
            text: "La presentación ha sido eliminada.",
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('No autorizado. Por favor, inicia sesión.')
            } else {
              setError(err.message)
            }
          } else if (err instanceof Error) {
            setError(err.message)
          }
          
          const isDarkModeNow = document.documentElement.classList.contains("dark");
          
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la presentación.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  }

  const cambiarEstadoPresentacion = async (id_presentacion: number, nuevoEstado: string) => {
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
        `${API_URL}/presentacion/estado/${id_presentacion}`,
        { estado: nuevoEstado },
        {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        }
        );
        
        setPresentacion((prevPresentacion) =>
        prevPresentacion.map((p) =>
          p.id_presentacion === id_presentacion ? { ...p, estado: nuevoEstado } : p
        )
        );
        
        setSuccessMessage(`Estado de la presentación cambiado a "${nuevoEstado === '1' ? 'activo' : 'inactivo'}" con éxito`);
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
        text: "No se pudo cambiar el estado de la presentación.",
        icon: "error",
        confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33",
        background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
        color: isDarkModeNow ? "#ffffff" : "#000000",
        });
      }
      }
    });
  };

  // Cargar presentacion al montar el hook
  useEffect(() => {
    fetchpresentacion();
  }, [])

  return {
    presentacion,
    loading,
    error,
    successMessage,
    fetchpresentacion,
    crearPresentacion,
    actualizarPresentacion,
    eliminarPresentacion,
    getPresentacionesActivos,
    cambiarEstadoPresentacion
  }
}

export default usePresentacion