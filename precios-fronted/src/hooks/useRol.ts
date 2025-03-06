import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const useRol = () => {
  const [rolData, setRolData] = useState(null);
  // console.log("datos del rol",rolData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rol data
  const fetchRolData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRolData(response.data);
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error fetching rol data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch data on mount
    fetchRolData();
  }, []);

  return {
    rolData,
    loading,
    error,
    fetchRolData,
  };
};

export default useRol;