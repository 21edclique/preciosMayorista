import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

type Nave = {
  id_nave: number;
  nombre: string;
  sector: number;
  productos: string;
};

const useNave = () => {
  const [naveData, setNaveData] = useState<Nave[]>([]);  // Definir el tipo como Nave[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/ship/nave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNaveData(response.data);  // Suponiendo que la API devuelve un array de Naves
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching nave data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNaveData();
  }, []);

  return {
    naveData,
    loading,
    error,
    fetchNaveData,
  };
};

export default useNave;
