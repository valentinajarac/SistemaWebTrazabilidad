import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import { Remission } from '../../types';
import api from '../../api/config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export function AdminRemissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [filteredRemissions, setFilteredRemissions] = useState<Remission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    fetchRemissions();
  }, []);

  useEffect(() => {
    filterAndSortRemissions();
  }, [searchTerm, remissions, selectedMonth]);

  const sortRemissionsByDate = (remissionsToSort: Remission[]) => {
    return [...remissionsToSort].sort((a, b) => {
      const dateA = new Date(a.fechaDespacho).getTime();
      const dateB = new Date(b.fechaDespacho).getTime();
      return dateB - dateA; // Orden descendente (más reciente primero)
    });
  };

  const filterAndSortRemissions = () => {
    let filtered = remissions;

    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = remissions.filter(remission => 
        format(new Date(remission.fechaDespacho), 'dd/MM/yyyy', { locale: es }).toLowerCase().includes(searchTermLower) ||
        remission.nombreProductor?.toLowerCase().includes(searchTermLower) ||
        remission.farmNombre?.toLowerCase().includes(searchTermLower) ||
        remission.producto.toLowerCase().includes(searchTermLower) ||
        remission.clientNombre?.toLowerCase().includes(searchTermLower) ||
        remission.canastillasEnviadas.toString().includes(searchTermLower) ||
        remission.kilosPromedio.toString().includes(searchTermLower) ||
        remission.totalKilos.toString().includes(searchTermLower)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(remission => {
        const remissionDate = new Date(remission.fechaDespacho);
        const month = remissionDate.getMonth() + 1; // obtener el mes (0-11)
        const year = remissionDate.getFullYear().toString();
        return `${year}-${month.toString().padStart(2, '0')}` === selectedMonth;
      });
    }

    setFilteredRemissions(sortRemissionsByDate(filtered));
  };

  const fetchRemissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/remissions/admin');

      if (response.data.success) {
        const sortedRemissions = sortRemissionsByDate(response.data.data);
        setRemissions(sortedRemissions);
        setFilteredRemissions(sortedRemissions);
      } else {
        setError(response.data.message || 'Error al cargar las remisiones');
      }
    } catch (error: any) {
      console.error('Error al cargar remisiones:', error);
      setError(error.response?.data?.message || 'Error al cargar las remisiones');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (data: Remission[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Remisiones');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportAllRemissions = () => {
    exportToExcel(remissions, 'Todas_Las_Remisiones');
  };

  const exportRemissionsByMonth = () => {
    exportToExcel(filteredRemissions, `Remisiones_${selectedMonth}`);
  };

  const exportSingleRemission = (remission: Remission) => {
    exportToExcel([remission], `Remision_${remission.id}`);
  };

  const columns = [
    { 
      key: 'fechaDespacho', 
      label: 'Fecha',
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { 
      key: 'nombreProductor', 
      label: 'Productor'
    },
    { 
      key: 'farmNombre', 
      label: 'Finca'
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value.charAt(0) + value.slice(1).toLowerCase()
    },
    { 
      key: 'canastillasEnviadas', 
      label: 'Canastillas',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'kilosPromedio', 
      label: 'Kilos Promedio',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'totalKilos', 
      label: 'Total Kilos',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'clientNombre', 
      label: 'Cliente'
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (remission: Remission) => (
        <button
          onClick={() => exportSingleRemission(remission)}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Exportar
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones</h1>
        <div className="flex space-x-2">
          <button 
            onClick={exportAllRemissions} 
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Exportar todas
          </button>
          <button 
            onClick={exportRemissionsByMonth} 
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Exportar mes
          </button>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            placeholder="Seleccione mes"
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar remisiones..."
      />

      <DataTable
        columns={columns}
        data={filteredRemissions}
        loading={loading}
      />
    </div>
  );
}
