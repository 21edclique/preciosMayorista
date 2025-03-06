import React, { useState } from 'react';
import { Download, Box, DollarSign, TrendingUp } from 'lucide-react';
import html2canvas from 'html2canvas';

import useProductos from '../hooks/useProductos';
import usePresentacion from '../hooks/usePresentacion';
import usePreciosDiarios from '../hooks/usePrecios';

// Componente para las tarjetas de métricas
const MetricCard: React.FC<{ icon: JSX.Element; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-${color}-100 p-4 rounded-lg flex items-center`}>
    {React.cloneElement(icon, { className: `mr-4 text-${color}-600`, size: 40 })}
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    </div>
  </div>
);

// Componente para las listas
const ListCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
      {children}
    </div>
  </div>
);

const Home: React.FC = () => {
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { presentacion, loading: presentacionLoading, error: presentacionError } = usePresentacion();
  const token = localStorage.getItem('token') || '';
  const { precios, loading: preciosLoading, error: preciosError } = usePreciosDiarios(token);

  const downloadDashboard = () => {
    const dashboardElement = document.getElementById('dashboard-content');
    if (dashboardElement) {
      html2canvas(dashboardElement, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'dashboard.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  // Calculate dashboard metrics with safe parsing
  const totalProducts = productos.length;
  const totalPresentations = presentacion.length;

  const averagePrice = precios.length > 0
    ? precios.reduce((sum, precio) => {
        const priceValue = typeof precio.precio === 'string' ? parseFloat(precio.precio) : Number(precio.precio);
        return sum + (isNaN(priceValue) ? 0 : priceValue);
      }, 0) / precios.length
    : 0;

  const latestPrices = precios
    .filter(precio => {
      const priceValue = typeof precio.precio === 'string' ? parseFloat(precio.precio) : Number(precio.precio);
      return !isNaN(priceValue);
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  // Error handling for loading states
  if (productosLoading || presentacionLoading || preciosLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Error handling for fetch errors
  if (productosError || presentacionError || preciosError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-xl text-red-600">
          Error al cargar los datos.
          {productosError || presentacionError || preciosError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={downloadDashboard}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <Download className="mr-2" size={20} /> Descargar Dashboard
          </button>
        </div>

        <div id="dashboard-content" className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard icon={<Box />} title="Total Productos" value={totalProducts} color="blue" />
            <MetricCard icon={<Box />} title="Total Presentaciones" value={totalPresentations} color="green" />
            <MetricCard icon={<DollarSign />} title="Precio Promedio" value={averagePrice.toFixed(2)} color="purple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListCard title="Últimos Precios">
              {latestPrices.map((precio) => {
                const priceValue = typeof precio.precio === 'string' ? parseFloat(precio.precio) : Number(precio.precio);
                return (
                  <div key={precio.id} className="flex justify-between items-center border-b py-2 last:border-b-0">
                    <span>{precio.producto_id}</span>
                    <span className="font-bold">${!isNaN(priceValue) ? priceValue.toFixed(2) : 'N/A'}</span>
                    <span className="text-gray-500">{precio.fecha}</span>
                  </div>
                );
              })}
            </ListCard>

            <ListCard title="Listado de Productos">
              {productos.map((producto) => (
                <div key={producto.id} className="flex justify-between items-center border-b py-2 last:border-b-0">
                  <span>{producto.nombre}</span>
                  <span className={`px-2 py-1 rounded text-xs ${producto.estado === 'Activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {producto.estado}
                  </span>
                </div>
              ))}
            </ListCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;