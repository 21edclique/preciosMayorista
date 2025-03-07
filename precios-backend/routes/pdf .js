// routes/pdf.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');



// Ruta para generar PDF
router.post('/',  async (req, res) => {
  try {
    const { precios, fecha, fechaRaw } = req.body;
  
    // console.log('Datos recibidos:', { precios, fecha, fechaRaw });

    if (!precios || !fecha) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

     // Verifica que precios sea un array
     if (!Array.isArray(precios)) {
      return res.status(400).json({ message: 'El campo "precios" debe ser un array' });
    }

    // Crear HTML para el PDF
    const htmlContent = createPDFTemplate(precios, fecha);
    
    // Guardar HTML para depuración (opcional, puedes quitar esto en producción)
    // fs.writeFileSync('debug-template.html', htmlContent);
    
    // Lanzar navegador puppeteer con opciones más seguras
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Configurar la página con timeout más largo
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Configurar tamaño de página A4
    await page.setViewport({ width: 595, height: 842 });
    
    // Generar el PDF con configuración simplificada
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      preferCSSPageSize: false
    });
    
    // Cerrar el navegador
    await browser.close();
    
    // Verificar que el buffer no esté vacío
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('PDF generado está vacío');
    }
    
    // Establecer encabezados para la descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=precios-${fechaRaw}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Enviar el PDF como respuesta
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Error al generar el PDF: ' + error.message });
  }
});

// Función para crear la plantilla HTML del PDF - versión simplificada

function createPDFTemplate(precios, fecha) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Registro de Precios</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          position: relative;
          background-color: white;
        }
        
        h1 {
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
          color: #052935;
        }
        
        .fecha {
          margin-bottom: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th {
          background-color: #052935;
          color: white;
          padding: 8px;
          text-align: left;
          font-size: 10px;
        }
        
        td {
          padding: 6px 8px;
          border-bottom: 1px solid #ddd;
          font-size: 9px;
        }
        
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .footer {
          margin-top: 30px;
          font-size: 8px;
          text-align: center;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>REGISTRO DE PRECIOS</h1>
      
      <p class="fecha">FECHA DE REGISTRO: ${fecha}</p>
      
      <table>
        <thead>
          <tr>
            <th style="width: 5%">Nº</th>
            <th style="width: 23%">PRODUCTO</th>
            <th style="width: 23%">PRESENTACIÓN</th>
            <th style="width: 23%">PESO KILOS</th>
            <th style="width: 23%">PRECIOS</th>
          </tr>
        </thead>
        <tbody>
          ${precios.map((precio, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${precio.producto_nombre}</td> <!-- Usar producto_nombre -->
              <td>${precio.presentacion_nombre}</td> <!-- Usar presentacion_nombre -->
              <td>${precio.peso || 'N/A'}</td> <!-- Manejar valores nulos -->
              <td>${precio.precio || 'N/A' }</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        INFORMACIÓN AL TELF.- FAX 032406940
      </div>
    </body>
    </html>
  `;
}


module.exports = router;