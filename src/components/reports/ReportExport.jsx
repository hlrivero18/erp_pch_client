import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ReportExport({ reportData }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Create HTML content for the report
      const htmlContent = generateHTMLReport(reportData);
      
      // Create a temporary div to hold the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Open print dialog
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Reporte SEDRONAR - ${format(reportData.generatedAt, 'dd-MM-yyyy')}</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #1e293b;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
              }
              .summary-card {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #e2e8f0;
              }
              .summary-number {
                font-size: 32px;
                font-weight: bold;
                color: #1e40af;
              }
              .summary-label {
                color: #64748b;
                margin-top: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #e2e8f0;
                padding: 12px;
                text-align: left;
              }
              th {
                background: #f1f5f9;
                font-weight: 600;
              }
              .indicator-name {
                font-weight: 600;
                color: #1e293b;
              }
              .variance-positive {
                color: #16a34a;
              }
              .variance-negative {
                color: #dc2626;
              }
              .badge {
                background: #e2e8f0;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                color: #475569;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      // Cleanup
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Error al exportar el reporte. Intente nuevamente.");
    }
    
    setIsExporting(false);
  };

  const generateHTMLReport = (data) => {
    const { processed, filters, generatedAt } = data;
    
    return `
      <div class="header">
        <div class="logo">SEDRONAR - Sistema de Indicadores</div>
        <h1>Reporte de Indicadores</h1>
        <p>Período: ${format(new Date(filters.dateRange.start), 'dd MMM yyyy', { locale: es })} - ${format(new Date(filters.dateRange.end), 'dd MMM yyyy', { locale: es })}</p>
        <p>Generado: ${format(generatedAt, 'dd MMM yyyy HH:mm', { locale: es })}</p>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-number">${processed.totalIndicators}</div>
          <div class="summary-label">Indicadores Analizados</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${processed.totalMeasurements}</div>
          <div class="summary-label">Total Mediciones</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${Math.ceil((new Date(filters.dateRange.end) - new Date(filters.dateRange.start)) / (1000 * 60 * 60 * 24))}</div>
          <div class="summary-label">Días Analizados</div>
        </div>
      </div>

      <h2>Resumen de Indicadores</h2>
      <table>
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Área</th>
            <th>Valor Actual</th>
            <th>Promedio</th>
            <th>Meta</th>
            <th>Variación vs Meta</th>
            <th>Mediciones</th>
          </tr>
        </thead>
        <tbody>
          ${processed.summary.map(item => `
            <tr>
              <td>
                <div class="indicator-name">${item.indicator.name}</div>
                <span class="badge">${item.indicator.category || 'Sin categoría'}</span>
              </td>
              <td>${item.indicator.area || '-'}</td>
              <td>${item.latestValue.toFixed(2)}${getUnitDisplay(item.indicator.unit)}</td>
              <td>${item.averageValue.toFixed(2)}${getUnitDisplay(item.indicator.unit)}</td>
              <td>${item.goalValue ? item.goalValue + getUnitDisplay(item.indicator.unit) : 'Sin meta'}</td>
              <td class="${item.variance > 0 ? 'variance-positive' : 'variance-negative'}">
                ${item.variance ? (item.variance > 0 ? '+' : '') + item.variance.toFixed(1) + '%' : 'N/A'}
              </td>
              <td>${item.measurementCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${filters.reportType === 'detailed' ? `
        <h2>Análisis Detallado</h2>
        ${processed.summary.map(item => `
          <div style="margin-bottom: 30px; padding-left: 20px; border-left: 4px solid #3b82f6;">
            <h3>${item.indicator.name}</h3>
            <p style="color: #64748b;">${item.indicator.description}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
              <div><strong>Frecuencia:</strong> ${item.indicator.frequency}</div>
              <div><strong>Tipo:</strong> ${item.indicator.type}</div>
              <div><strong>Unidad:</strong> ${item.indicator.unit}</div>
              <div><strong>Tolerancia:</strong> ±${item.indicator.tolerance_percentage || 5}%</div>
            </div>
          </div>
        `).join('')}
      ` : ''}
    `;
  };

  const getUnitDisplay = (unit) => {
    switch (unit) {
      case "percentage": return "%";
      case "currency": return "$";
      default: return "";
    }
  };

  return (
    <Button
      onClick={exportToPDF}
      disabled={isExporting}
      variant="outline"
      className="bg-white hover:bg-gray-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </>
      )}
    </Button>
  );
}