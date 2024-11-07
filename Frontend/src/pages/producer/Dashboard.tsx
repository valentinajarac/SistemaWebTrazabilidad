import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, FileSpreadsheet, FilePdf, Warehouse, Sprout, ClipboardList } from 'lucide-react';
import { remissionService, farmService, cropService } from '../../api/services';
import { MonthlyStats, UserStats } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#f59e0b', '#10b981'];

export function ProducerDashboard() {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalFincas: 0,
    totalCultivos: 0,
    totalRemisiones: 0,
    kilosTotales: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      try {
        const [monthlyStats, farms, crops, remissions] = await Promise.all([
          remissionService.getByUserId(user.userId),
          farmService.getByUserId(user.userId),
          cropService.getByUserId(user.userId),
          remissionService.getByUserId(user.userId)
        ]);

        setMonthlyData(monthlyStats);
        
        const totalKilos = remissions.reduce(
          (sum, rem) => sum + rem.totalKilos, 
          0
        );

        setStats({
          totalFincas: farms.length,
          totalCultivos: crops.length,
          totalRemisiones: remissions.length,
          kilosTotales: totalKilos
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [user]);

  const downloadExcel = () => {
    exportToExcel(monthlyData, {
      title: 'Mis Despachos Mensuales - TrazaFrutas',
      subtitle: 'Resumen Personal de Producción',
      producer: user?.username,
      fileName: `mis_despachos_${format(new Date(), 'yyyy-MM-dd')}`
    });
  };

  const downloadPDF = () => {
    exportToPDF(monthlyData, {
      title: 'Mis Despachos Mensuales',
      subtitle: 'Resumen Personal de Producción',
      producer: user?.username,
      fileName: `mis_despachos_${format(new Date(), 'yyyy-MM-dd')}`
    });
  };

  // Datos para el gráfico circular
  const pieData = [
    { name: 'Uchuva', value: monthlyData.reduce((sum, m) => sum + m.kilosUchuva, 0) },
    { name: 'Gulupa', value: monthlyData.reduce((sum, m) => sum + m.kilosGulupa, 0) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mis Fincas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalFincas}</p>
            </div>
            <Warehouse className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mis Cultivos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCultivos}</p>
            </div>
            <Sprout className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Remisiones</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRemisiones}</p>
            </div>
            <ClipboardList className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kilos</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.kilosTotales.toFixed(2)} kg
              </p>
            </div>
            <Download className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Gráfica de Barras - Producción Mensual */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Producción Mensual</h2>
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

      {/* Gráfica Circular - Distribución de Producción */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de mi Producción</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}