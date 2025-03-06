import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
type Camara = {
  id_camara: number;
  nombre: string;
  id_nave_per: number;
};


const useCamara = () => {
  const [camaraData, setCamaraData] = useState<Camara[]>([]);
  const [camaraNames, setCamaraNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch all camara data
  const fetchCamaraData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/camera/camara`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCamaraData(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching camara data');
    } finally { 
      setLoading(false);
    }
  };

  // Fetch camara names
  const fetchCamaraNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/camera/camaraNames`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCamaraNames(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching camara names');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch data on mount
    fetchCamaraData();
    fetchCamaraNames();
  }, []);

  return {
    camaraData,
    camaraNames,
    loading,
    error,
    fetchCamaraData,
    fetchCamaraNames,
  };
};

export default useCamara;
