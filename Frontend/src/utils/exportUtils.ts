import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MonthlyData } from '../types';

interface ExportOptions {
  title: string;
  subtitle?: string;
  fileName: string;
  producer?: string;
}

export const exportToExcel = (data: MonthlyData[], options: ExportOptions) => {
  // Preparar los datos para Excel
  const excelData = data.map(item => ({
    'Mes': format(new Date(item.mes), 'MMMM yyyy', { locale: es }),
    'Kilos Uchuva': item.kilosUchuva.toFixed(2),
    'Kilos Gulupa': item.kilosGulupa.toFixed(2),
    'Total Kilos': (item.kilosUchuva + item.kilosGulupa).toFixed(2)
  }));

  // Crear libro y hoja
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([], { header: [] });

  // Agregar título
  XLSX.utils.sheet_add_aoa(ws, [[options.title]], { origin: 'A1' });
  if (options.subtitle) {
    XLSX.utils.sheet_add_aoa(ws, [[options.subtitle]], { origin: 'A2' });
  }
  if (options.producer) {
    XLSX.utils.sheet_add_aoa(ws, [[`Productor: ${options.producer}`]], { origin: 'A3' });
  }

  // Agregar datos
  XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A5' });

  // Ajustar anchos de columna
  const columnWidths = [
    { wch: 20 }, // Mes
    { wch: 15 }, // Kilos Uchuva
    { wch: 15 }, // Kilos Gulupa
    { wch: 15 }  // Total Kilos
  ];
  ws['!cols'] = columnWidths;

  // Agregar totales
  const totalRow = excelData.length + 5;
  const totalUchuva = data.reduce((sum, item) => sum + item.kilosUchuva, 0);
  const totalGulupa = data.reduce((sum, item) => sum + item.kilosGulupa, 0);
  
  XLSX.utils.sheet_add_aoa(ws, [
    ['Total:', totalUchuva.toFixed(2), totalGulupa.toFixed(2), (totalUchuva + totalGulupa).toFixed(2)]
  ], { origin: `A${totalRow}` });

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  
  // Guardar archivo
  XLSX.writeFile(wb, `${options.fileName}.xlsx`);
};

export const exportToPDF = (data: MonthlyData[], options: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Configurar fuente y tamaños
  doc.setFont('helvetica');
  
  // Título
  doc.setFontSize(16);
  doc.text(options.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Subtítulo
  if (options.subtitle) {
    doc.setFontSize(12);
    doc.text(options.subtitle, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  }

  // Productor
  if (options.producer) {
    doc.setFontSize(12);
    doc.text(`Productor: ${options.producer}`, 20, yPos);
    yPos += 10;
  }

  // Fecha de generación
  doc.setFontSize(10);
  doc.text(
    `Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
    20,
    yPos
  );
  yPos += 15;

  // Encabezados de tabla
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('Mes', 20, yPos);
  doc.text('Kilos Uchuva', 80, yPos);
  doc.text('Kilos Gulupa', 120, yPos);
  doc.text('Total', 160, yPos);
  yPos += 5;

  // Línea separadora
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Datos
  doc.setFontSize(10);
  let totalUchuva = 0;
  let totalGulupa = 0;

  data.forEach(item => {
    const mes = format(new Date(item.mes), 'MMMM yyyy', { locale: es });
    doc.text(mes, 20, yPos);
    doc.text(item.kilosUchuva.toFixed(2), 80, yPos);
    doc.text(item.kilosGulupa.toFixed(2), 120, yPos);
    doc.text((item.kilosUchuva + item.kilosGulupa).toFixed(2), 160, yPos);
    yPos += 8;

    totalUchuva += item.kilosUchuva;
    totalGulupa += item.kilosGulupa;

    // Nueva página si es necesario
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Línea separadora para totales
  yPos += 2;
  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  // Totales
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 20, yPos);
  doc.text(totalUchuva.toFixed(2), 80, yPos);
  doc.text(totalGulupa.toFixed(2), 120, yPos);
  doc.text((totalUchuva + totalGulupa).toFixed(2), 160, yPos);

  // Guardar archivo
  doc.save(`${options.fileName}.pdf`);
};