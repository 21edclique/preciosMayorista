import React from 'react';
import jsPDF from 'jspdf';

const InformeBitacora: React.FC = () => {
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Informe de Bitácora', 10, 10);
        doc.text('Esta es la pantalla de informe de bitácora.', 10, 20);
        doc.save('informe_bitacora.pdf');
    };

    return (
        <div>
            <h1>Informe de Bitácora</h1>
            <p>Esta es la pantalla de informe de bitácora.</p>
            {/* Aquí puedes agregar más componentes y lógica según sea necesario */}
            <button onClick={generatePDF}>Generar PDF</button>
        </div>
    );
};

export default InformeBitacora;