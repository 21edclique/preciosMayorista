import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePreciosDiarios from '../hooks/usePrecios';
import useProductos from '../hooks/useProductos';
import usePresentacion from '../hooks/usePresentacion';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import headerImage from '../images/encabezado-precios.png';
import Background from '../images/background.png';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import PrintIcon from '@mui/icons-material/Print';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Bold } from 'lucide-react';

// Estilos exactos del PDF
// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: 20,
    fontSize: 12, // Ajustado a un tamaño más legible para texto general
    fontFamily: 'Helvetica',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 18, // Aumentado para el título
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
  },
  table: {
    display: 'flex',
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    border: '1px solid #052935',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#052935',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#052935',
    borderBottomWidth: 0.5,
    borderBottomColor: '#052935',
  },
  tableCell: {
    margin: 1,
    padding: 1,
    fontSize: 10, // Aumentado para las celdas de la tabla
    textAlign: 'left',
  },
  headerCell: {
    margin: 2,
    padding: 2,
    fontSize: 12, // Aumentado para el encabezado de la tabla
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
  },
});

// Interfaces
interface Precio {
  id: number;
  producto_id: number;
  id_presentacion_per: number;
  producto?: { nombre: string };
  presentacion?: { nombre: string };
  peso: number;
  precio: number;
  fecha: string;
}
const pageSize = { width: 595, height: 1500 }; // Ancho A4 (595pt) y altura grande
// Componente PDF completamente personalizado
// Componente PDF
const PreciosPDF: React.FC<{ precios: Precio[], fecha: string }> = ({ precios, fecha }) => (
  <Document>
   <Page size={pageSize} style={styles.page}>
      {/* Imagen de fondo */}
      <Image src={Background} style={styles.backgroundImage} />

      {/* Contenido superpuesto */}
      <View style={styles.content}>
             {/* Imagen de encabezado */}
             <Image src={headerImage} style={styles.headerImage} />

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['Nº', 'PRODUCTO', 'PRESENTACIÓN', 'PESO KILOS', 'PRECIOS'].map((header, index) => (
              <Text key={index} style={{ ...styles.headerCell, width: index === 0 ? '5%' : '23%' }}>
                {header}
              </Text>
            ))}
          </View>

          {precios.map((precio, index) => (
            <View key={precio.id} style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, width: '5%' }}>{index + 1}</Text>
              <Text style={{ ...styles.tableCell, width: '23%' }}>
                {precio.producto?.nombre || 'Sin nombre'}
              </Text>
              <Text style={{ ...styles.tableCell, width: '23%' }}>
                {precio.presentacion?.nombre || 'Sin presentación'}
              </Text>
              <Text style={{ ...styles.tableCell, width: '23%' }}>{precio.peso}</Text>
              <Text style={{ ...styles.tableCell, width: '23%' }}>{precio.precio}</Text>
            </View>
          ))}
        </View>

      
      </View>
    </Page>
  </Document>
);


const PreciosDiarios = () => {
  // Obtener el token de autenticación
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Hooks para manejar datos
  const {
    precios,
    loading,
    error,
    obtenerPrecios,
  } = usePreciosDiarios(token || '');

  const { productos, fetchProductos } = useProductos();
  const { presentacion, fetchpresentacion } = usePresentacion();

  // Estados
  const [fecha, setFecha] = useState(new Date());
  const [filteredPrecios, setFilteredPrecios] = useState<Precio[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    obtenerPrecios();
    fetchProductos();
    fetchpresentacion();
  }, []);

  // Filtrar precios por fecha seleccionada
  useEffect(() => {
    if (precios && precios.length > 0) {
      const formattedDate = fecha.toISOString().split('T')[0];
      const filtered = precios.filter((precio) => {
        return precio.fecha.split('T')[0] === formattedDate;
      });
      setFilteredPrecios(filtered);
    }
  }, [precios, fecha]);

  // Formatear fecha para mostrar
  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options).toUpperCase();
  };

  // Enriquecer los datos con nombres para mostrar y PDF
  const getProductoNombre = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  };

  const getPresentacionNombre = (id: number) => {
    const pres = presentacion.find((p) => p.id_presentacion === id);
    return pres ? pres.nombre : 'Desconocida';
  };

  const preciosConNombres = filteredPrecios.map((precio) => ({
    ...precio,
    producto: { nombre: getProductoNombre(precio.producto_id) },
    presentacion: { nombre: getPresentacionNombre(precio.id_presentacion_per) },
  }));

  // Manejar estado de carga y error
  if (loading && !precios.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Precios Diarios
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(newDate) => newDate && setFecha(newDate)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: <CalendarTodayIcon />
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PDFDownloadLink
              document={
                <PreciosPDF
                  precios={preciosConNombres}
                  fecha={formatDisplayDate(fecha)}
                />
              }
              fileName={`precios-${fecha.toISOString().split('T')[0]}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PrintIcon />}
                  disabled={loading || filteredPrecios.length === 0}
                >
                  {loading ? 'Generando PDF...' : 'Generar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        {`FECHA DE REGISTRO: ${formatDisplayDate(fecha)}`}
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Nº', 'PRODUCTO', 'PRESENTACIÓN', 'PESO KILOS', 'PRECIOS'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPrecios.length > 0 ? (
              preciosConNombres.map((precio, index) => (
                <TableRow key={precio.id}>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{precio.producto.nombre}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{precio.presentacion.nombre}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{precio.peso}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{precio.precio}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ fontSize: '0.8rem' }}>
                  No hay precios registrados para esta fecha
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PreciosDiarios;