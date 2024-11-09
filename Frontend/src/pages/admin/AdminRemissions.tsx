import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import { Remission } from '../../types';
import api from '../../api/config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AdminRemissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [filteredRemissions, setFilteredRemissions] = useState<Remission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRemissions();
  }, []);

  useEffect(() => {
    filterAndSortRemissions();
  }, [searchTerm, remissions]);

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
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones</h1>
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