import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import usePreciosDiarios from '../hooks/usePrecios'
import useProductos from '../hooks/useProductos'
import usePresentacion from '../hooks/usePresentacion'
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import headerImage from '../images/encabezado-precios.png'
import Background from '../images/background.png'
import AmbatoLogo from '../images/AmbatoLogo.png'
import GadMunicipal from '../images/Logo-GAD-Ambato.png'
import EPEMA from '../images/epema.png'

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
  Alert,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { es } from 'date-fns/locale'
import PrintIcon from '@mui/icons-material/Print'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import html2canvas from 'html2canvas'
import { fromUnixTime } from 'date-fns'

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: 20,
    fontSize: 12,
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
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  headerImage: {
    width: '100%',
    marginBottom: 0,
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
    borderBottomWidth: 1,
    borderBottomColor: '#052935',
    backgroundColor: '#fff',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#052935',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    margin: 4,
    padding: 4,
    fontSize: 10,
    textAlign: 'left',
  },
  headerCell: {
    margin: 4,
    padding: 4,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

// Interfaces
interface Precio {
  id: number
  producto_id: number
  id_presentacion_per: number
  producto?: { nombre: string }
  presentacion?: { nombre: string }
  peso: number
  precio: number
  fecha: string
}

const pageSize = { width: 595, height: 2700 } // Ancho A4 (595pt) y altura grande

// Componente PDF
const PreciosPDF: React.FC<{ precios: Precio[]; fecha: string }> = ({ precios, fecha }) => (
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
            <Text style={{ ...styles.headerCell, width: '5%' }}>Nº</Text>
            <Text style={{ ...styles.headerCell, width: '35%' }}>PRODUCTO</Text>
            <Text style={{ ...styles.headerCell, width: '25%' }}>PRESENTACIÓN</Text>
            <Text style={{ ...styles.headerCell, width: '15%' }}>PESO KILOS</Text>
            <Text style={{ ...styles.headerCell, width: '20%' }}>PRECIOS</Text>
          </View>

          {precios.map((precio, index) => (
            <View
              key={precio.id}
              style={{
                ...styles.tableRow,
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
              }}
            >
              <Text style={{ ...styles.tableCell, width: '5%' }}>{index + 1}</Text>
              <Text style={{ ...styles.tableCell, width: '35%' }}>
                {precio.producto?.nombre || 'Sin nombre'}
              </Text>
              <Text style={{ ...styles.tableCell, width: '25%' }}>
                {precio.presentacion?.nombre || 'Sin presentación'}
              </Text>
              <Text style={{ ...styles.tableCell, width: '15%' }}>{precio.peso}</Text>
              <Text style={{ ...styles.tableCell, width: '20%' }}>{precio.precio}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>FECHA DE REGISTRO: {fecha}</Text>
        </View>
      </View>
    </Page>
  </Document>
)

const PreciosDiarios = () => {
  // Obtener el token de autenticación
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // Hooks para manejar datos
  const { precios, loading, error, obtenerPrecios } = usePreciosDiarios(token || '')

  const { productos, fetchProductos } = useProductos()
  const { presentacion, fetchpresentacion } = usePresentacion()

  // Estados
  const [fecha, setFecha] = useState(new Date())
  const [filteredPrecios, setFilteredPrecios] = useState<Precio[]>([])

  // Referencia para la tabla
  const tableRef = useRef(null)

  // Cargar datos iniciales
  useEffect(() => {
    obtenerPrecios()
    fetchProductos()
    fetchpresentacion()
  }, [])

  // Filtrar precios por fecha seleccionada - CORREGIDO PARA SOLUCIONAR EL PROBLEMA DE ZONA HORARIA
  useEffect(() => {
    if (precios && precios.length > 0) {
      // Crear fecha en formato YYYY-MM-DD sin conversión de zona horaria
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1; // getMonth() devuelve 0-11
      const day = fecha.getDate();
      
      // Crear cadena de fecha en formato YYYY-MM-DD
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      console.log('Fecha seleccionada para filtrar:', formattedDate);
      
      const filtered = precios.filter((precio) => {
        const precioDate = precio.fecha.split('T')[0];
        console.log('Comparando con fecha de precio:', precioDate);
        return precioDate === formattedDate;
      });
      
      setFilteredPrecios(filtered);
    }
  }, [precios, fecha])

  // Formatear fecha para mostrar
  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('es-ES', options).toUpperCase()
  }

  // Enriquecer los datos con nombres para mostrar y PDF
  const getProductoNombre = (id: number) => {
    const producto = productos.find((p) => p.id === id)
    return producto ? producto.nombre : 'Desconocido'
  }

  const getPresentacionNombre = (id: number) => {
    const pres = presentacion.find((p) => p.id_presentacion === id)
    return pres ? pres.nombre : 'Desconocida'
  }

  const preciosConNombres = filteredPrecios.map((precio) => ({
    ...precio,
    producto: { nombre: getProductoNombre(precio.producto_id) },
    presentacion: { nombre: getPresentacionNombre(precio.id_presentacion_per) },
  }))

  // Función para generar imágenes con el formato HTML proporcionado
  const handleGenerateImages = async () => {
    const rowsPerImage = 20
    const totalImages = Math.ceil(filteredPrecios.length / rowsPerImage)

    for (let i = 0; i < totalImages; i++) {
      const start = i * rowsPerImage
      const end = start + rowsPerImage
      const currentRows = preciosConNombres.slice(start, end)

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Precios</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #00293d;
            color: white;
            padding: 10px 20px;
            font-weight: bold;
        }
        .page-number {
            font-size: 22px;
        }
        .date {
            font-size: 18px;
        }
        .title-container {
            position: relative;
            padding: 15px;
            background-color: white;
            border-left: 10px solid #ffd700;
            font-size: 80px;
            font-weight: bold;
            color: #00293d;
            text-align: center;
            margin-bottom: 5px;
        }
        .code-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 20px;
            background-color: #f2f2f2;
            font-size: 16px;
            font-weight: bold;
        }
        .code span {
            color: #00293d;
            font-weight: bold;
        }
        .contact {
            text-align: right;
        }
        .contact a {
            color: #00293d;
            text-decoration: none;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #00293d;
            color: white;
            padding: 5px;
            text-align: left;
            font-size: 22px;
            font-weight: bold;
        }
        td {
            padding: 4px 6px;
            border: 1px solid #ddd;
            font-size: 22px;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 20px;
            margin-top: 20px;
            width: 100%;
            text-align: center;
        }
        .footer img {
            height: 70px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="page-number">PÁG. ${i + 1}</div>
        <div class="date">FECHA DE REGISTRO: ${formatDisplayDate(fecha)}</div>
    </div>
    
    <div class="title-container">REGISTRO DE PRECIOS</div>
    
    <div class="code-container">
        <div class="code">Código: <span>EP-EMA-SGC-DC/REG01</span></div>
        <div class="contact">
            INFORMACIÓN AL TELF.- FAX 032406940<br>
            <a href="http://www.ambato-ema.gob.ec" target="_blank">www.ambato-ema.gob.ec</a>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 5%;">N°</th>
                <th style="width: 30%;">PRODUCTO</th>
                <th style="width: 25%;">PRESENTACIÓN</th>
                <th style="width: 20%;">PESO KILOS</th>
                <th style="width: 20%;">PRECIOS</th>
            </tr>
        </thead>
        <tbody>
            ${currentRows
              .map(
                (row, index) => `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${row.producto.nombre}</td>
                    <td>${row.presentacion.nombre}</td>
                    <td>${row.peso}</td>
                    <td>${row.precio}</td>
                </tr>
            `,
              )
              .join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <img src=${GadMunicipal} alt="GAD Municipal" />
        <img src=${AmbatoLogo} alt="Ambato" />
        <img src=${EPEMA} alt="EP-EMA" />
    </div>
</body>
</html>
      `

      // Crear un elemento HTML temporal
      const tempElement = document.createElement('div')
      tempElement.innerHTML = htmlContent
      document.body.appendChild(tempElement)

      // Convertir el HTML en una imagen
      const canvas = await html2canvas(tempElement)
      const image = canvas.toDataURL('image/png')

      // Crear un enlace para descargar la imagen
      const link = document.createElement('a')
      link.href = image
      link.download = `precios-parte-${i + 1}.png`
      link.click()

      // Eliminar el elemento temporal
      document.body.removeChild(tempElement)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <h1 className="text-3xl font-bold mb-4 text-[#052935] dark:text-white">
        Precios Diarios
      </h1>

      <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
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
                      startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: '#052935' }} />,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PDFDownloadLink
              document={
                <PreciosPDF precios={preciosConNombres} fecha={formatDisplayDate(fecha)} />
              }
              fileName={`precios-${fecha.toISOString().split('T')[0]}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#052935',
                    '&:hover': {
                      backgroundColor: '#0a4f65',
                    },
                  }}
                  startIcon={<PrintIcon />}
                  disabled={loading || filteredPrecios.length === 0}
                >
                  {loading ? 'Generando PDF...' : 'Generar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#052935',
                '&:hover': {
                  backgroundColor: '#0a4f65',
                },
                ml: 2,
              }}
              startIcon={<PrintIcon />}
              onClick={handleGenerateImages}
              disabled={filteredPrecios.length === 0}
            >
              Generar Imágenes
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#052935',
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 1,
        }}
      >
        {`FECHA DE REGISTRO: ${formatDisplayDate(fecha)}`}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
        }}
        ref={tableRef}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#052935' }}>
              <TableCell
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white', width: '5%' }}
              >
                Nº
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white', width: '35%' }}
              >
                PRODUCTO
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white', width: '25%' }}
              >
                PRESENTACIÓN
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white', width: '15%' }}
              >
                PESO KILOS
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white', width: '20%' }}
              >
                PRECIOS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPrecios.length > 0 ? (
              preciosConNombres.map((precio, index) => (
                <TableRow
                  key={precio.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    {precio.producto.nombre}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    {precio.presentacion.nombre}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    {precio.peso}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    {precio.precio}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ fontSize: '0.9rem', py: 3 }}>
                  No hay precios registrados para esta fecha
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default PreciosDiarios