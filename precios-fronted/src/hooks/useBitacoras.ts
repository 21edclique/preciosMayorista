import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import Swal from "sweetalert2"

export const useBitacoras = () => {
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  const [currentBitacora, setCurrentBitacora] = useState<any>(null);

  const initialFormState = {
    fecha: '',
    id_usuario_per: '',
    hora: '',
    id_nave_per: 0,
    id_camara: '', 
    camara: '',
    novedad: '',
    resultado: '',
    referencia: '',
    turno: '',
    id_colega:'',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBitacoras();
  }, []);

  const fetchBitacoras = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/log/bitacora`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBitacoras(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las bitácoras');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isDarkMode = document.documentElement.classList.contains("dark");
  
    if (editMode && currentBitacora) {
      // Confirmación antes de guardar
      Swal.fire({
        title: "¿Guardar cambios?",
        text: "Se actualizará la información de la bitácora.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: isDarkMode ? "#4a90e2" : "#3085d6", // Azul claro en modo oscuro
        cancelButtonColor: isDarkMode ? "#ff4c4c" : "#d33", // Rojo más visible en modo oscuro
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        background: isDarkMode ? "#1e1e1e" : "#ffffff", // Fondo oscuro para modo oscuro
        color: isDarkMode ? "#ffffff" : "#000000", // Texto blanco en modo oscuro
      }).then(async (result) => {
        if (result.isConfirmed) {
          await saveBitacora();
          // Mensaje de éxito adaptado al modo oscuro
          Swal.fire({
            title: "Actualizado",
            text: "La bitácora se ha actualizado correctamente.",
            icon: "success",
            confirmButtonColor: isDarkMode ? "#4CAF50" : "#3085d6", // Verde claro en modo oscuro
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
          });
        }
      });
    } else {
      await saveBitacora();
      // Mensaje de éxito para nueva bitácora
      Swal.fire({
        title: "Guardado",
        text: "La bitácora se ha guardado correctamente.",
        icon: "success",
        confirmButtonColor: isDarkMode ? "#4CAF50" : "#3085d6",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    }
  };
  
  
  const saveBitacora = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editMode && currentBitacora) {
        await axios.post(
          `${API_URL}/log/bitacora_modificar`,
          { ...formData, id_bitacora: currentBitacora.id_bitacora },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${API_URL}/log/bitacora_add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      setFormData(initialFormState);
      setShowForm(false);
      setEditMode(false);
      fetchBitacoras();
  
      const isDarkModeNow = document.documentElement.classList.contains("dark");
  
      Swal.fire({
        title: "Éxito",
        text: "La bitácora se ha guardado correctamente.",
        icon: "success",
        background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
        color: isDarkModeNow ? "#ffffff" : "#000000",
      });
    } catch (err) {
      const isDarkModeNow = document.documentElement.classList.contains("dark");
  
      setError("Error al guardar la bitácora");
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la bitácora.",
        icon: "error",
        background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
        color: isDarkModeNow ? "#ffffff" : "#000000",
      });
    }
  };
  
  



  const handleDelete = async (id_bitacora: number) => {
    const token = localStorage.getItem("token");
    const isDarkMode = document.documentElement.classList.contains("dark");
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33", // Rojo intenso en modo oscuro
      cancelButtonColor: isDarkMode ? "#4a90e2" : "#3085d6", // Azul en modo oscuro
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: isDarkMode ? "#1e1e1e" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/log/bitacora_eliminar/${id_bitacora}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchBitacoras(); // Refresca la lista tras eliminar
  
          const isDarkModeNow = document.documentElement.classList.contains("dark");
  
          Swal.fire({
            title: "Eliminado",
            text: "La bitácora ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: isDarkModeNow ? "#4CAF50" : "#3085d6", // Verde en modo oscuro
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        } catch (err) {
          setError("Error al eliminar la bitácora");
  
          const isDarkModeNow = document.documentElement.classList.contains("dark");
  
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la bitácora.",
            icon: "error",
            confirmButtonColor: isDarkModeNow ? "#ff4c4c" : "#d33", // Rojo para error
            background: isDarkModeNow ? "#1e1e1e" : "#ffffff",
            color: isDarkModeNow ? "#ffffff" : "#000000",
          });
        }
      }
    });
  };
  

  
  const handleResolveBitacora = async (id_bitacora: number) => {
    const token = localStorage.getItem("token");
    const isDarkMode = document.documentElement.classList.contains("dark");

    try {
      await axios.post(
        `${API_URL}/log/bitacora_mod_resultado`,
        { 
          id_bitacora,
          resultado: 'Resuelto'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el estado local
      setBitacoras(prevBitacoras => 
        prevBitacoras.map(bitacora => 
          bitacora.id_bitacora === id_bitacora
            ? { ...bitacora, resultado: 'Resuelto' }
            : bitacora
        )
      );

      Swal.fire({
        title: "Actualizado",
        text: "La bitácora ha sido marcada como resuelta.",
        icon: "success",
        confirmButtonColor: isDarkMode ? "#4CAF50" : "#3085d6",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });

    } catch (err) {
      setError("Error al actualizar el estado de la bitácora");
      
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado de la bitácora.",
        icon: "error",
        confirmButtonColor: isDarkMode ? "#ff4c4c" : "#d33",
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    }
  };

  const handleEdit = (bitacora: any) => {
    setFormData(bitacora);
    setEditMode(true);
    setShowForm(true);
    setCurrentBitacora(bitacora);
  };

  const handleAddBitacora = () => {
    const savedUserData = localStorage.getItem('userData');
    const parsedUser = savedUserData ? JSON.parse(savedUserData) : null;
  
    setEditMode(false); // Asegurarse de que editMode está en false
    setFormData({
      // Resetear el formData
      fecha: '',
      id_usuario_per: parsedUser.id_usuario, // Asegúrate de que parsedUser.id_usuario esté definido
      hora: '',
      id_camara: '',
      id_nave_per: 0,
      camara: '',
      novedad: '',
      resultado: '',
      referencia: '',
      turno: '',
      id_colega: '',
    });
    setShowForm(true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const currentItems = bitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    bitacoras,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showForm,
    editMode,
    currentBitacora,
    formData,
    fetchBitacoras,
    handleInputChange,
    handleAddBitacora,
    handleResolveBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    currentItems,
    setShowForm,
  };
};
