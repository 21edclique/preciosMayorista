// src/hooks/useLogin.ts
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';



const useLogin = () => {
  const [usuario, setUsername] = useState<string>(''); // Definir el estado para el nombre de usuario
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // Agregar showPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Limpiar cualquier error anterior

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        usuario,
        password,
      });

      const { token, userData } = response.data;

      // Guardar el token y los datos del usuario en localStorage
      localStorage.setItem('token', token);  // Guardar el token
      console.log('Token guardado en localStorage:', localStorage.getItem('token'));  // Verificación en consola
      localStorage.setItem('userData', JSON.stringify(userData));  // Guardar el userData como JSON

      console.log('Usuario guardado en localStorage:', localStorage.getItem('userData'));  // Verificación en consola

      return { token, userData };  // Retornar los datos para ser utilizados en el componente
    } catch (err) {
      setError('Credenciales incorrectas');
      return null;  // Retorna null si hay un error
    }
  };

  return {
    usuario,
    password,
    error,
    setUsername,
    setPassword,
    handleSubmit,
    showPassword,
    setShowPassword,
  };
};

export default useLogin;