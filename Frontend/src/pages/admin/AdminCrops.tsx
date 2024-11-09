import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { SearchBar } from '../../components/SearchBar';
import api from '../../api/config';

export function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [searchTerm, crops]);

  const filterCrops = () => {
    if (!searchTerm.trim()) {
      setFilteredCrops(crops);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = crops.filter((crop: any) => 
      crop.productor?.toLowerCase().includes(searchTermLower) ||
      crop.numeroPlants?.toString().includes(searchTermLower) ||
      crop.hectareas?.toString().includes(searchTermLower) ||
      crop.producto?.toLowerCase().includes(searchTermLower) ||
      crop.estado?.toLowerCase().includes(searchTermLower) ||
      crop.fincaNombre?.toLowerCase().includes(searchTermLower)
    );
    setFilteredCrops(filtered);
  };

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/crops/admin');
      
      if (response.data.success) {
        setCrops(response.data.data);
        setFilteredCrops(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar los cultivos');
      }
    } catch (error: any) {
      console.error('Error al cargar cultivos:', error);
      setError(error.response?.data?.message || 'Error al cargar los cultivos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'productor', 
      label: 'Productor'
    },
    { 
      key: 'numeroPlants', 
      label: 'Número de Plantas',
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'hectareas', 
      label: 'Hectáreas',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value.charAt(0) + value.slice(1).toLowerCase()
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: string) => value.charAt(0) + value.slice(1).toLowerCase()
    },
    { 
      key: 'fincaNombre', 
      label: 'Finca'
    } 
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cultivos Registrados</h1>
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
        placeholder="Buscar cultivos..."
      />

      <DataTable
        columns={columns}
        data={filteredCrops}
        loading={loading}
      />
    </div>
  );
}