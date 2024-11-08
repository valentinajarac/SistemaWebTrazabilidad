import React, { useEffect, useState } from 'react';
import { 
  Users, Warehouse, Sprout, FileText, FileSpreadsheet,
  Leaf, TrendingUp
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { DashboardStats, MonthlyStats } from '../../types';
import { dashboardService } from '../../api/services/dashboard.service';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, monthlyStats] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getMonthlyData()
        ]);

        setStats(statsData);
        setMonthlyData(monthlyStats);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportExcel = () => {
    try {
      exportToExcel(monthlyData, {
        title: 'Reporte Mensual de Despachos - TrazaFrutas',
        subtitle: 'Resumen General de Producción',
        fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
      });
    } catch (err: any) {
      setError('Error al exportar a Excel: ' + err.message);
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(monthlyData, {
        title: 'Reporte Mensual de Despachos',
        subtitle: 'Resumen General de Producción',
        fileName: `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}`
      });
    } catch (err: any) {
      setError('Error al exportar a PDF: ' + err.message);
    }
  };

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
        onClose={() => setError(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportExcel}
            icon={FileSpreadsheet}
            disabled={loading}
          >
            Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="danger"
            icon={FileText}
            disabled={loading}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Estadísticas de Productores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Productores"
          value={stats?.totalProductores || 0}
          icon={Users}
          loading={loading}
        />
        <Card
          title="Productores Uchuva"
          value={stats?.productoresUchuva || 0}
          icon={Sprout}
          loading={loading}
        />
        <Card
          title="Productores Gulupa"
          value={stats?.productoresGulupa || 0}
          icon={Leaf}
          loading={loading}
        />
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Fincas"
          value={stats?.totalFincas || 0}
          icon={Warehouse}
          loading={loading}
        />
        <Card
          title="Total Cultivos"
          value={stats?.totalCultivos || 0}
          icon={Sprout}
          loading={loading}
        />
        <Card
          title="Despachos del Mes"
          value={stats?.despachosMes || 0}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      {monthlyData.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Producción Mensual</h2>
            <div className="h-96">
              <BarChart
                data={monthlyData}
                xAxisKey="mes"
                bars={[
                  { key: 'kilosUchuva', name: 'Uchuva', color: '#f59e0b' },
                  { key: 'kilosGulupa', name: 'Gulupa', color: '#10b981' }
                ]}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tendencia de Producción</h2>
            <div className="h-96">
              <LineChart
                data={monthlyData}
                xAxisKey="mes"
                lines={[
                  { key: 'kilosUchuva', name: 'Uchuva', color: '#f59e0b' },
                  { key: 'kilosGulupa', name: 'Gulupa', color: '#10b981' }
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}