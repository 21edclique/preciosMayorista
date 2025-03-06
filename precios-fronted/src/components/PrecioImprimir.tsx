import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrecioImprimir {
  id: number;
  producto_id: number;
  precio: number;
  peso: number;
  fecha: string;
  id_presentacion_per: number;
  producto_nombre: string;
  presentacion_nombre: string;
}

interface PreciosImprimiblesProps {
  precios: PrecioImprimir[];
  fecha: string;
}

const PreciosImprimibles: React.FC<PreciosImprimiblesProps> = ({ precios, fecha }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    // content: () => componentRef.current as HTMLDivElement,
  });

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return format(fecha, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }).toUpperCase();
  };

  return (
    <div className="mb-8">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
          />
        </svg>
        Imprimir Lista de Precios
      </button>

      <div className="hidden">
        <div ref={componentRef} className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase">REGISTRO DE PRECIOS</h1>
            <p className="text-sm">INFORMACIÓN AL TELF.- FAX 032406940</p>
            <p className="text-sm">Código: EP-EMA-SGC-DC/REG01</p>
            <p className="text-lg font-semibold mt-4">
              FECHA DE REGISTRO: {formatearFecha(fecha)}
            </p>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Nº</th>
                <th className="px-4 py-2 border">PRODUCTO</th>
                <th className="px-4 py-2 border">PRESENTACIÓN</th>
                <th className="px-4 py-2 border">PESO KILOS</th>
                <th className="px-4 py-2 border">PRECIOS</th>
              </tr>
            </thead>
            <tbody>
              {precios.map((precio, index) => (
                <tr key={precio.id}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{precio.producto_nombre}</td>
                  <td className="px-4 py-2 border">{precio.presentacion_nombre}</td>
                  <td className="px-4 py-2 border text-right">{Number(precio.peso).toFixed(1)}</td>
                  <td className="px-4 py-2 border text-right">{Number(precio.precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-8 text-center text-xs">
            <p>Documento generado el {new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreciosImprimibles;