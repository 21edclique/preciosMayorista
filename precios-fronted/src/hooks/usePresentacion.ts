import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/index'

interface Presentacion {
  id_presentacion: number
  nombre: string
}

const usePresentacion = () => {
  const [presentacion, setpresentacion] = useState<Presentacion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Obtener presentacion
  const fetchpresentacion = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token') // Obtén el token de autenticación
      const response = await axios.get(`${API_URL}/presentacion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setpresentacion(response.data)
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

  // 🔹 Crear Presentacion
  const crearPresentacion = async (nombre: string, estado: string) => {
    try {
      const token = localStorage.getItem('token') // Obtén el token de autenticación
      const response = await axios.post(
        `${API_URL}/presentacion`,
        { nombre, estado }, // Se envían ambos parámetros
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Asegura el formato JSON
          },
        },
      )
      setpresentacion([...presentacion, response.data])
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
    }
  }

  // 🔹 Actualizar Presentacion
  const actualizarPresentacion = async (id_presentacion: number, nombre: string) => {
    try {
      const token = localStorage.getItem('token') // Obtén el token de autenticación
      await axios.put(
        `${API_URL}/presentacion/${id_presentacion}`,
        { nombre },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setpresentacion(
        presentacion.map((p) => (p.id_presentacion === id_presentacion ? { ...p, nombre } : p)),
      )
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
    }
  }



  // 🔹 Eliminar Presentacion
  const eliminarPresentacion = async (id_presentacion: number) => {
    try {
      const token = localStorage.getItem('token') // Obtén el token de autenticación
      await axios.delete(`${API_URL}/presentacion/${id_presentacion}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setpresentacion(presentacion.filter((p) => p.id_presentacion !== id_presentacion))
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
    }
  }

  // Cargar presentacion al montar el hook
  useEffect(() => {
    fetchpresentacion()
  }, [])

  return {
    presentacion,
    loading,
    error,
    fetchpresentacion,
    crearPresentacion,
    actualizarPresentacion,
    eliminarPresentacion,
  }
}

export default usePresentacion
