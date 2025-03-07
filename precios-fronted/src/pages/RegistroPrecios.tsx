import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePreciosDiarios from '../hooks/usePrecios';
import useProductos from '../hooks/useProductos';
import usePresentacion from '../hooks/usePresentacion';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  CssBaseline
} from '@mui/material';
import { 
  Add as AddIcon, 
  Save as SaveIcon, 
  Delete as DeleteIcon, 
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

interface PrecioEditable {
  id?: number;
  producto_id: number;
  id_presentacion_per: number;
  precio: number;
  peso: number;
  fecha: string;
  esNuevo?: boolean;
  productoNombre?: string;
  presentacionNombre?: string;
}

const PreciosDiariosBatchEdit = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#3f51b5',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [darkMode],
  );

  const {
    precios,
    loading,
    error,
    obtenerPrecios,
    guardarPrecio: crearPrecio,
    guardarPrecio: actualizarPrecio,
  } = usePreciosDiarios(token || '');

  const { productos, loading: getProductosActivos } = useProductos();
  const { presentacion, loading: getPresentacionesActivos } = usePresentacion();
  const productosActivos = productos.filter(producto => producto.estado === "1");
  const presentacionesActivas = presentacion.filter(pres => pres.estado === "1");
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [preciosEditables, setPreciosEditables] = useState<PrecioEditable[]>([]);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const getProductoNombre = (id: number): string => {
    const producto = productos.find((p) => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  };

  const getPresentacionNombre = (id: number): string => {
    const pres = presentacion.find((p) => p.id_presentacion === id);
    return pres ? pres.nombre : 'Desconocida';
  };

  const fechaMasReciente = () => {
    if (precios.length > 0) {
      const fechas = precios.map((p) => parseISO(p.fecha).getTime());
      const fechaMax = new Date(Math.max(...fechas));
      return fechaMax;
    }
    return new Date();
  };

  useEffect(() => {
    if (precios.length > 0 && productos.length > 0 && presentacion.length > 0) {
      const preciosRecientes = precios.filter((p) => {
        const fechaPrecio = parseISO(p.fecha);
        return fechaPrecio.getTime() === fechaMasReciente().getTime();
      });

      const editables = preciosRecientes.map((precio) => ({
        ...precio,
        fecha: format(fechaMasReciente(), 'yyyy-MM-dd'),
        esNuevo: false,
        productoNombre: getProductoNombre(precio.producto_id),
        presentacionNombre: getPresentacionNombre(precio.id_presentacion_per),
      }));

      setPreciosEditables(editables);
    }
  }, [precios, productos, presentacion]);

  const handleDateChange = (newDate: Date) => {
    setFechaSeleccionada(newDate);
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    setPreciosEditables((prev) =>
      prev.map((precio) => ({
        ...precio,
        fecha: formattedDate,
      }))
    );
    setCambiosPendientes(true);
  };

  const handleFieldChange = (
    id: number | undefined,
    field: keyof PrecioEditable,
    value: any
  ) => {
    setPreciosEditables((prevState) =>
      prevState.map((precio) => {
        if (
          (precio.id === id && id !== undefined) ||
          (precio.esNuevo &&
            id === undefined &&
            precio === prevState[prevState.findIndex((p) => p.esNuevo && p === precio)])
        ) {
          const updatedValue = value === null ? 0 : value;
          let actualizacion: Partial<PrecioEditable> = { [field]: updatedValue };
          if (field === 'producto_id') {
            actualizacion.productoNombre = getProductoNombre(updatedValue);
          } else if (field === 'id_presentacion_per') {
            actualizacion.presentacionNombre = getPresentacionNombre(updatedValue);
          }
          return { ...precio, ...actualizacion };
        }
        return precio;
      })
    );
    setCambiosPendientes(true);
  };

  const handleAddNewPrice = () => {
    const nuevoPrecio: PrecioEditable = {
      producto_id: productos.length > 0 ? productos[0].id : 0,
      id_presentacion_per: presentacion.length > 0 ? presentacion[0].id_presentacion : 0,
      precio: 0,
      peso: 0,
      fecha: format(fechaSeleccionada, 'yyyy-MM-dd'),
      esNuevo: true,
      productoNombre: productos.length > 0 ? productos[0].nombre : 'Seleccione un producto',
      presentacionNombre: presentacion.length > 0 ? presentacion[0].nombre : 'Seleccione una presentación',
    };
    setPreciosEditables([...preciosEditables, nuevoPrecio]);
    setCambiosPendientes(true);
  };

  const handleRemovePrice = (index: number) => {
    setPreciosEditables((prev) => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
    setCambiosPendientes(true);
  };

  const handleSaveAll = async () => {
    setGuardando(true);
    try {
      const nuevosPrecios = preciosEditables.filter((p) => p.esNuevo);
      const preciosExistentes = preciosEditables.filter((p) => !p.esNuevo);
  
      for (const precio of nuevosPrecios) {
        const { esNuevo, productoNombre, presentacionNombre, ...precioData } = precio;
        const precioConId = { ...precioData, id: 0 };
        await crearPrecio(precioConId);
      }
  
      for (const precio of preciosExistentes) {
        if (precio.id) {
          const { esNuevo, productoNombre, presentacionNombre, id, ...precioData } = precio;
          await actualizarPrecio({ id, ...precioData });
        }
      }
  
      setSnackbar({
        open: true,
        message: 'Todos los precios han sido guardados exitosamente',
        severity: 'success',
      });
      setCambiosPendientes(false);
      await obtenerPrecios();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al guardar los precios: ' + (err instanceof Error ? err.message : String(err)),
        severity: 'error',
      });
    } finally {
      setGuardando(false);
    }
  };

  // Render loading state
  if (loading || getPresentacionesActivos || getProductosActivos) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={darkMode ? 'dark:bg-gray-900 min-h-screen flex justify-center items-center' : ''}>
          <Container sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <CircularProgress />
          </Container>
        </div>
      </ThemeProvider>
    );
  }

  // Render error state
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={darkMode ? 'dark:bg-gray-900 min-h-screen flex justify-center items-center' : ''}>
          <Container sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        </div>
      </ThemeProvider>
    );
  }

  // Main component render
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={darkMode ? 'dark:bg-gray-900 min-h-screen' : ''}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => navigate('/precios-diarios')} sx={{ mr: 2 }} className={darkMode ? 'dark:text-gray-200' : ''}>
                <BackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold" className={darkMode ? 'dark:text-gray-200' : ''}>
                Edición por lotes de Precios Diarios
              </Typography>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }} className={darkMode ? 'dark:bg-gray-800' : ''}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <TextField
                type="date"
                label="Fecha de Precios"
                InputLabelProps={{ shrink: true }}
                value={format(fechaSeleccionada, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                sx={{ width: 200 }}
                className={darkMode ? 'dark:text-gray-200' : ''}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveAll}
                disabled={guardando || !cambiosPendientes}
              >
                {guardando ? 'Guardando...' : 'Guardar Todos'}
              </Button>
            </Box>

            <TableContainer className={darkMode ? 'dark:bg-gray-800' : ''}>
              <Table>
                <TableHead>
                  <TableRow className={darkMode ? 'dark:bg-gray-700' : ''}>
                    <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>Nº</TableCell>
                    <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>PRODUCTO</TableCell>
                    <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>PRESENTACIÓN</TableCell>
                    <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>PESO KILOS</TableCell>
                    <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>PRECIOS</TableCell>
                    <TableCell align="right" className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preciosEditables.length > 0 ? (
                    preciosEditables.map((precio, index) => (
                      <TableRow key={index} className={darkMode ? 'dark:bg-gray-800 dark:hover:bg-gray-700' : ''}>
                        <TableCell className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>{index + 1}</TableCell>
                        <TableCell className={darkMode ? 'dark:border-gray-700' : ''}>
                          <Select
                            fullWidth
                            value={precio.producto_id}
                            onChange={(e) =>
                              handleFieldChange(precio.id, 'producto_id', Number(e.target.value))
                            }
                            className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}
                          >
                            {productosActivos.map((producto) => (
                              <MenuItem key={producto.id} value={producto.id} className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}>
                                {producto.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell className={darkMode ? 'dark:border-gray-700' : ''}>
                          <Select
                            fullWidth
                            value={precio.id_presentacion_per}
                            onChange={(e) =>
                              handleFieldChange(precio.id, 'id_presentacion_per', Number(e.target.value))
                            }
                            className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}
                          >
                            {presentacionesActivas.map((pres) => (
                              <MenuItem key={pres.id_presentacion} value={pres.id_presentacion} className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}>
                                {pres.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell className={darkMode ? 'dark:border-gray-700' : ''}>
                          <TextField
                            type="number"
                            fullWidth
                            value={precio.peso ?? 0}
                            onChange={(e) =>
                              handleFieldChange(precio.id, 'peso', parseFloat(e.target.value))
                            }
                            inputProps={{ step: 0.1, min: 0 }}
                            className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}
                            InputProps={{
                              className: darkMode ? 'dark:text-gray-200' : ''
                            }}
                          />
                        </TableCell>
                        <TableCell className={darkMode ? 'dark:border-gray-700' : ''}>
                          <TextField
                            type="number"
                            fullWidth
                            value={precio.precio ?? 0}
                            onChange={(e) =>
                              handleFieldChange(precio.id, 'precio', parseFloat(e.target.value))
                            }
                            InputProps={{
                              startAdornment: <InputAdornment position="start" className={darkMode ? 'dark:text-gray-200' : ''}>$</InputAdornment>,
                              inputProps: { step: 0.01, min: 0 },
                              className: darkMode ? 'dark:text-gray-200' : ''
                            }}
                            className={darkMode ? 'dark:text-gray-200 dark:bg-gray-700' : ''}
                          />
                        </TableCell>
                        <TableCell align="right" className={darkMode ? 'dark:border-gray-700' : ''}>
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemovePrice(index)}
                            className={darkMode ? 'dark:text-red-400' : ''}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className={darkMode ? 'dark:bg-gray-800' : ''}>
                      <TableCell colSpan={6} align="center" className={darkMode ? 'dark:text-gray-200 dark:border-gray-700' : ''}>
                        No hay precios cargados. Agrega uno nuevo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddNewPrice}
                className={darkMode ? 'dark:border-blue-500 dark:text-blue-400' : ''}
              >
                Agregar Precio
              </Button>
            </Box>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              className={darkMode ? 'dark:bg-gray-700 dark:text-gray-200' : ''}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default PreciosDiariosBatchEdit;