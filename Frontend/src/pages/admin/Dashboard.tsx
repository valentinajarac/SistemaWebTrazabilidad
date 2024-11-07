import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Download, FileSpreadsheet, FilePdf, Users, Warehouse, Sprout } from 'lucide-react';
import { remissionService, userService, farmService, cropService } from '../../api/services';
import { MonthlyStats, DashboardStats } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProductores: 0,
    totalFincas: 0,
    totalCultivos: 0,
    despachosMes: 0,
    kilosUchuvaMes: 0,
    kilosGulupaMes: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyStats, users, farms, crops] = await Promise.all([
          remissionService.getMonthlySummary(),
          userService.getAll(),
          farmService.getAll(),
          cropService.getAll()
        ]);

        setMonthlyData(monthlyStats);
        
        const currentMonth = new Date().getMonth();
        const currentMonthData = monthlyStats.find(
          data => new Date(data.mes).getMonth() === currentMonth
        );

        setStats({
          totalProductores: users.filter(u => u.role === 'PRODUCER').length,
          totalFincas: farms.length,
          totalCultivos: crops.length,
          despachosMes: currentMonthData ? 
            (currentMonthData.kilosUchuvaMes + currentMonthData.kilosGulupaMes) : 0,
          kilosUchuvaMes: currentMonthData?.kilosUchuvaMes || 0,
          kilosGulupaMes: currentMonthData?.kilosGulupaMes || 0
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const downloadExcel = () => {
    exportToExcel(monthlyData, {
      title: 'Reporte Mensual de Despachos - TrazaFrutas',
      subtitle: 'Resumen General de Producción',
      fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
    });
  };

  const downloadPDF = () => {
    exportToPDF(monthlyData, {
      title: 'Reporte Mensual de Despachos',
      subtitle: 'Resumen General de Producción',
      fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Excel
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FilePdf className="w-5 h-5 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Productores</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProductores}</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fincas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalFincas}</p>
            </div>
            <Warehouse className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cultivos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCultivos}</p>
            </div>
            <Sprout className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Gráfica de Barras - Producción Mensual */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Producción Mensual</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(date) => format(new Date(date), 'MMM yyyy', { locale: es })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMMM yyyy', { locale: es })}
                formatter={(value: number) => [`${value.toFixed(2)} kg`, '']}
              />
              <Legend />
              <Bar dataKey="kilosUchuva" name="Uchuva" fill="#f59e0b" />
              <Bar dataKey="kilosGulupa" name="Gulupa" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de Líneas - Tendencia de Producción */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tendencia de Producción</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(date) => format(new Date(date), 'MMM yyyy', { locale: es })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMMM yyyy', { locale: es })}
                formatter={(value: number) => [`${value.toFixed(2)} kg`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="kilosUchuva" 
                name="Uchuva" 
                stroke="#f59e0b" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="kilosGulupa" 
                name="Gulupa" 
                stroke="#10b981" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}