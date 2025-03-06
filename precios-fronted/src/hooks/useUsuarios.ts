import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de configurar esta constante
import useRol from './useRol'; // Importa tu hook de roles
import { Alert, AlertTitle } from '@mui/material'; // Importamos Alert de MUI
import Swal from "sweetalert2"


const initialFormState = {
  id:'',
  nombres:'',
  usuario:'',
  password: '',
  id_rol: '',  
};


export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para mensajes de éxito
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentUsuario, setCurrentUsuario] = useState<any>(null);
  const [formData, setFormData] = useState(initialFormState);

  // Campos a mostrar en la tabla
  const [fieldsToDisplay] = useState<string[]>([
    'usuario', 'nombres'
  ]);

  // Usamos el hook de roles aquí
  const { rolData, loading: loadingRoles, error: errorRoles } = useRol(); 

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "usuario") {
      if (value.length > 15) return; // Máximo 15 caracteres
    }

    if (name === "nombres") {
      if (value.length > 244) return; // Máximo 15 caracteres
    }
  
    setFormData({ ...formData, [name]: value });
  };


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    if (editMode && currentUsuario) {
      const isDarkMode = document.documentElement.classList.contains("dark");

      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas actualizar este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33", // Rojo oscuro en modo oscuro
        cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6", // Azul en modo oscuro
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.post(
              `${API_URL}/editar/usuarios/${currentUsuario.id}`,
              { ...formData, id: currentUsuario.id},
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage("Usuario actualizado con éxito");
            console.log("Usuario actualizado:", formData);
            setTimeout(() => setSuccessMessage(null), 3000);

            setFormData(initialFormState);
            setShowModal(false);
            setEditMode(false);
            fetchUsuarios();

            const isDarkModeNow = document.documentElement.classList.contains("dark");



            
            Swal.fire({
              title: "Actualizado",
              text: "El usuario ha sido actualizado.",
              icon: "success",
              confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6", // Verde éxito en modo oscuro
              background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
              color: isDarkModeNow ? "#ffffff" : "#000000",
            });
          } catch (err) {
            setError("Error al actualizar el usuario");

            const isDarkModeNow = document.documentElement.classList.contains("dark");

            Swal.fire({
              title: "Error",
              text: "No se pudo actualizar el usuario.",
              icon: "error",
              confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33", // Rojo en modo oscuro
              background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
              color: isDarkModeNow ? "#ffffff" : "#000000",
            });
          }
        }
      });
    } else {
      await axios.post(`${API_URL}/usuarios/registrar`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Usuario agregado con éxito");
      setTimeout(() => setSuccessMessage(null), 3000);

      setFormData(initialFormState);
      setShowModal(false);
      setEditMode(false);
      fetchUsuarios();
    }
  } catch (err) {
    setError("Error al guardar el usuario");
  }
};


const handleDelete = async (id: number) => {
  const token = localStorage.getItem("token");

  const isDarkMode = document.documentElement.classList.contains("dark");

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33", // Rojo oscuro en modo oscuro
    cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6", // Azul en modo oscuro
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    background: isDarkMode ? "#1e1e1e" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/usuarios/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSuccessMessage("Usuario eliminado con éxito");
        console.log("Usuario eliminado:", id);

        setTimeout(() => setSuccessMessage(null), 3000);
        fetchUsuarios();

        const isDarkModeNow = document.documentElement.classList.contains("dark");

        Swal.fire({
          title: "Eliminado",
          text: "El usuario ha sido eliminado.",
          icon: "success",
          confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6", // Verde éxito en modo oscuro
          background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
          color: isDarkModeNow ? "#ffffff" : "#000000",
        });
      } catch (err) {
        setError("Error al eliminar el usuario");

        const isDarkModeNow = document.documentElement.classList.contains("dark");

        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error",
          confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33", // Rojo en modo oscuro
          background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
          color: isDarkModeNow ? "#ffffff" : "#000000",
        });
      }
    }
  });
};


  const handleEdit = (usuario: any) => {
    setFormData({
      ...initialFormState, // Mantiene los valores iniciales
      ...usuario, // Sobrescribe solo los valores existentes
    });
    setEditMode(true);
    setShowModal(true);
    setCurrentUsuario(usuario);
  };
  
  const handleAddUsuario = () => {
    setFormData(initialFormState); // Limpia los datos al agregar una nueva
  };

  const openModal = () => {
    setFormData(initialFormState);
    setEditMode(false);
    setShowModal(true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    usuarios,
    rolData, // Roles para el combo box
    loading,
    loadingRoles, // Indicador de carga de roles
    error,
    errorRoles, // Error de roles
    successMessage, // Pasamos el mensaje de éxito al componente
    currentPage,
    itemsPerPage,
    formData,
    showModal,
    editMode,
    fieldsToDisplay, 
    handleInputChange,
    handleAddUsuario,
    handleSubmit,
    handleDelete,
    handleEdit,
    openModal,
    paginate,
    setShowModal,
    currentItems: usuarios.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
  };
};
