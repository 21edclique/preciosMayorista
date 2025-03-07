import React, { useState, useEffect, useRef } from 'react'
import {
  Download,
  Box,
  BarChart,
  TrendingUp,
  Truck,
  Filter,
  Search,
  ShoppingCart,
  Archive,
  Calendar,
  PieChart,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { Bar, Pie, Line } from 'react-chartjs-2'
import 'chart.js/auto'

import useProductos from '../hooks/useProductos'
import usePresentacion from '../hooks/usePresentacion'
import usePreciosDiarios from '../hooks/usePrecios'

const Home: React.FC = () => {
  const { productos, loading: productosLoading, error: productosError } = useProductos()
  const {
    presentacion,
    loading: presentacionLoading,
    error: presentacionError,
  } = usePresentacion()
  const token = localStorage.getItem('token') || ''
  const { precios, loading: preciosLoading, error: preciosError } = usePreciosDiarios(token)

  const [top5Variacion, setTop5Variacion] = useState<any[]>([])
  const [papaProductos, setPapaProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<Record<string, any[]>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showPriceHistory, setShowPriceHistory] = useState<boolean>(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const top5ChartRef = useRef<HTMLDivElement>(null)
  const papasChartRef = useRef<HTMLDivElement>(null)
  const categoriasChartRef = useRef<HTMLDivElement>(null)
  const priceHistoryRef = useRef<HTMLDivElement>(null)

  // Función para identificar categorías de productos basado en el nombre
  const identificarCategoria = (nombre: string) => {
    nombre = nombre.toLowerCase()
    if (nombre.includes('papa')) return 'Papas'
    if (nombre.includes('tomate')) return 'Tomates'
    if (nombre.includes('cebolla')) return 'Cebollas'
    if (
      nombre.includes('fruta') ||
      nombre.includes('manzana') ||
      nombre.includes('pera') ||
      nombre.includes('durazno') ||
      nombre.includes('melón') ||
      nombre.includes('uva') ||
      nombre.includes('naranjilla') ||
      nombre.includes('mandarina') ||
      nombre.includes('claudia') ||
      nombre.includes('abridor') ||
      nombre.includes('mora') ||
      nombre.includes('fresa')
    )
      return 'Frutas'
    if (nombre.includes('ajo')) return 'Ajos'
    if (nombre.includes('arveja') || nombre.includes('fréjol') || nombre.includes('haba'))
      return 'Legumbres'
    if (
      nombre.includes('zanahoria') ||
      nombre.includes('remolacha') ||
      nombre.includes('brocoli') ||
      nombre.includes('col') ||
      nombre.includes('coliflor') ||
      nombre.includes('lechuga')
    )
      return 'Verduras'
    if (nombre.includes('huevo')) return 'Huevos'
    return 'Otros'
  }
console.log
  useEffect(() => {
    if (precios.length > 1 && productos.length > 0) {
      const preciosPorProducto: Record<string, any[]> = {}
      precios.forEach((precio) => {
        if (!preciosPorProducto[precio.producto_id]) {
          preciosPorProducto[precio.producto_id] = []
        }
        preciosPorProducto[precio.producto_id].push(precio)
      })

      const comparacion = Object.keys(preciosPorProducto).map((id) => {
        const preciosOrdenados = preciosPorProducto[id].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        )
        const precioActual = parseFloat(preciosOrdenados[0]?.precio) || 0
        const precioAnterior = parseFloat(preciosOrdenados[1]?.precio) || precioActual
        const variacion = precioAnterior
          ? ((precioActual - precioAnterior) / precioAnterior) * 100
          : 0
        const producto = productos.find((p) => p.id === Number(id))
        const productoNombre = producto?.nombre || `Producto ${id}`
        const categoria = identificarCategoria(productoNombre)
        const peso = 0
        const historicoPrecio = preciosOrdenados.map((p) => ({
          fecha: p.fecha,
          precio: parseFloat(p.precio),
        }))

        return {
          id,
          productoNombre,
          precioActual,
          precioAnterior,
          variacion,
          categoria,
          peso,
          historicoPrecio,
        }
      })

      // Organizar por categorías
      const productosPorCategoria: Record<string, any[]> = {}
      comparacion.forEach((producto) => {
        if (!productosPorCategoria[producto.categoria]) {
          productosPorCategoria[producto.categoria] = []
        }
        productosPorCategoria[producto.categoria].push(producto)
      })
      setCategorias(productosPorCategoria)

      // Filtrar papas y variantes
      const papaProductos = comparacion.filter((p) =>
        p.productoNombre.toLowerCase().includes('papa'),
      )

      // Top 5 productos con mayor variación
      const sorted = comparacion.sort((a, b) => Math.abs(b.variacion) - Math.abs(a.variacion))
      setTop5Variacion(sorted.slice(0, 5))
      setPapaProductos(papaProductos)
    }
  }, [precios, productos])

  const downloadChart = (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (ref.current) {
      html2canvas(ref.current, { scale: 2, useCORS: true }).then((canvas) => {
        const link = document.createElement('a')
        link.download = `${filename}.png`
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = () => {
    let filtered = []

    // Primero filtramos por categoría
    if (selectedCategory === 'Todas') {
      filtered = Object.values(categorias).flat()
    } else {
      filtered = categorias[selectedCategory] || []
    }

    // Luego filtramos por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  if (productosLoading || presentacionLoading || preciosLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (productosError || presentacionError || preciosError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-xl text-red-600">Error al cargar los datos.</div>
      </div>
    )
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const dataTop5 = {
    labels: top5Variacion.map((p) => p.productoNombre),
    datasets: [
      {
        label: 'Precio Anterior',
        data: top5Variacion.map((p) => p.precioAnterior),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Precio Actual',
        data: top5Variacion.map((p) => p.precioActual),
        backgroundColor: 'rgba(75, 192, 120, 0.7)',
        borderColor: 'rgba(75, 192, 120, 1)',
        borderWidth: 1,
      },
    ],
  }

  const dataPapas = {
    labels: papaProductos.map((p) => p.productoNombre),
    datasets: [
      {
        label: 'Precio Anterior',
        data: papaProductos.map((p) => p.precioAnterior),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Precio Actual',
        data: papaProductos.map((p) => p.precioActual),
        backgroundColor: 'rgba(75, 192, 120, 0.7)',
        borderColor: 'rgba(75, 192, 120, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Datos para el gráfico de pastel de categorías
  const categoriesData = {
    labels: Object.keys(categorias),
    datasets: [
      {
        data: Object.values(categorias).map((items) => items.length),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(78, 178, 98, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Datos para historial de precios
  const priceHistoryData = (productId: string | null) => {
    if (!productId) return null

    // Buscar el producto seleccionado
    let producto = null
    for (const categoria in categorias) {
      const found = categorias[categoria].find((p) => p.id === productId)
      if (found) {
        producto = found
        break
      }
    }

    if (!producto) return null

    return {
      labels: producto.historicoPrecio
        .map((entry: any) => {
          const date = new Date(entry.fecha)
          const day = String(date.getDate()).padStart(2, '0')
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const year = date.getFullYear()
          return `${day}/${month}/${year}`
        })
        .reverse(),
      datasets: [
        {
          label: 'Historial de Precio',
          data: producto.historicoPrecio.map((entry: any) => entry.precio).reverse(),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard de Precios Mayoristas</h1>
          <div className="flex gap-4">
            <button
              onClick={() => downloadChart(top5ChartRef, 'top5_productos_variacion')}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <Download className="mr-2" size={18} /> Top 5
            </button>
            <button
              onClick={() => downloadChart(papasChartRef, 'precios_papas')}
              className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-md"
            >
              <Download className="mr-2" size={18} /> Papas
            </button>
            <button
              onClick={() => downloadChart(categoriasChartRef, 'distribucion_categorias')}
              className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition shadow-md"
            >
              <Download className="mr-2" size={18} /> Categorías
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg flex items-center text-white">
            <ShoppingCart className="mr-4" size={40} />
            <div>
              <h2 className="text-lg font-medium opacity-90">Total Productos</h2>
              <p className="text-3xl font-bold">{productos.length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg flex items-center text-white">
            <TrendingUp className="mr-4" size={40} />
            <div>
              <h2 className="text-lg font-medium opacity-90">Mayor Variación</h2>
              <p className="text-3xl font-bold">{top5Variacion[0]?.variacion.toFixed(2)}%</p>
              <p className="text-sm opacity-80">{top5Variacion[0]?.productoNombre}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-lg shadow-lg flex items-center text-white">
            <Truck className="mr-4" size={40} />
            <div>
              <h2 className="text-lg font-medium opacity-90">Categorías</h2>
              <p className="text-3xl font-bold">{Object.keys(categorias).length}</p>
            </div>
          </div>
        </div>

        {/* 📊 Sección: Distribución por Categorías */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Distribución por Categorías
          </h2>

          <div
            ref={categoriasChartRef}
            className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            
            <div className="flex items-center justify-center">
              <div style={{ height: '300px', width: '300px' }}>
                <Pie data={categoriesData} />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">Resumen de Categorías</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(categorias).map((categoria) => (
                  <div key={categoria} className="bg-gray-50 p-4 rounded-lg shadow">
                    <h4 className="font-semibold text-gray-700">{categoria}</h4>
                    <p className="text-2xl font-bold">{categorias[categoria].length}</p>
                    <p className="text-sm text-gray-600">productos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Módulo 1: Top 5 Productos con Mayor Variación */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        
          <div ref={top5ChartRef} className="bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Comparación de Precios (Top 5)
          </h2>
            <Bar data={dataTop5} options={chartOptions} height={80} />

            <div className="mt-6 border-t pt-4">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">
                      Producto
                    </th>
                    <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">
                      Categoría
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Precio Anterior
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Precio Actual
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Variación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top5Variacion.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 px-3 text-gray-800 font-medium">
                        {p.productoNombre}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600">{p.categoria}</td>
                      <td className="py-3 px-3 text-right text-gray-600">
                        {formatCurrency(p.precioAnterior)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {formatCurrency(p.precioActual)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold ${
                          p.variacion >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {p.variacion.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🥔 Módulo 2: Solo Papas y Variantes */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          

          <div ref={papasChartRef} className="bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Comparación de Precios (Papas y Variantes)
          </h2>

            <Bar data={dataPapas} options={chartOptions} height={80} />

            <div className="mt-6 border-t pt-4">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">
                      Producto
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Precio Anterior
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Precio Actual
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                      Variación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {papaProductos.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 px-3 text-gray-800 font-medium">
                        {p.productoNombre}
                      </td>
                      {/* <td className="py-3 px-3 text-center text-gray-600">{p.presentacionInfo || 'Quintal'}</td> */}
                      {/* <td className="py-3 px-3 text-right text-gray-600">{p.peso || '45.5'}</td> */}
                      <td className="py-3 px-3 text-right text-gray-600">
                        {formatCurrency(p.precioAnterior)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {formatCurrency(p.precioActual)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold ${
                          p.variacion >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {p.variacion.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🔎 Módulo 3: Buscador y Filtro de Productos */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Listado de Productos
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="Todas">Todas las categorías</option>
                  {Object.keys(categorias).map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProductId && (
              <button
                onClick={() => {
                  setShowPriceHistory(!showPriceHistory)
                }}
                className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition shadow-md"
              >
                <Calendar className="mr-2" size={18} />{' '}
                {showPriceHistory ? 'Ocultar Historial' : 'Ver Historial'}
              </button>
            )}

            <button
              onClick={() => {
                if (priceHistoryRef.current && showPriceHistory) {
                  downloadChart(priceHistoryRef, 'historial_precios')
                }
              }}
              className={`flex items-center ${
                showPriceHistory
                  ? 'bg-teal-500 hover:bg-teal-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded-lg transition shadow-md`}
              disabled={!showPriceHistory}
            >
              <Download className="mr-2" size={18} /> Descargar Historial
            </button>
          </div>

          {showPriceHistory && selectedProductId && (
            <div ref={priceHistoryRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Historial de Precios:{' '}
                {
                  Object.values(categorias)
                    .flat()
                    .find((p) => p.id === selectedProductId)?.productoNombre
                }
              </h3>
                <div style={{ height: '250px' }}>
                <Line
                  data={priceHistoryData(selectedProductId) || { labels: [], datasets: [] }}
                  options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                    beginAtZero: false,
                    ticks: {
                      callback: function (value) {
                      return '$' + value
                      },
                    },
                    },
                  },
                  }}
                />
                </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">
                    Producto
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">
                    Categoría
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                    Precio Actual
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">
                    Variación
                  </th>
                  <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts().map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b ${
                      selectedProductId === p.id ? 'bg-blue-50' : ''
                    } hover:bg-gray-50`}
                  >
                    <td className="py-3 px-3 text-gray-800 font-medium">{p.productoNombre}</td>
                    <td className="py-3 px-3 text-center text-gray-600">{p.categoria}</td>
                    <td className="py-3 px-3 text-right font-medium">
                      {formatCurrency(p.precioActual)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold ${
                        p.variacion >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {p.variacion.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id)
                          setShowPriceHistory(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Calendar size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
