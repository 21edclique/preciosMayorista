import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Ajusta según tu configuración

const useLogout = () => {
  const [error, setError] = useState<string>('');

  const handleLogout = async () => {
    try {
      // Llamada a la ruta de logout en tu backend
      const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Limpiar el localStorage
      localStorage.removeItem('token');
      
      if (response.status === 200) {
        return { success: true };
      } else {
        throw new Error('Error al hacer logout');
      }
    } catch (err) {
      setError('Hubo un error al intentar cerrar sesión');
      return { success: false };
    }
  };

  return { error, handleLogout };
};

export default useLogout;
