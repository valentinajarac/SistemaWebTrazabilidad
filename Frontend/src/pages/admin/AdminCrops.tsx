import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import api from '../../api/config';

export function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/crops/admin');
      
      if (response.data.success) {
        setCrops(response.data.data);
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
    { key: 'productor', label: 'Productor' },
    { key: 'numeroPlants', label: 'Número de Plantas' },
    { key: 'hectareas', label: 'Hectáreas' },
    { key: 'producto', label: 'Producto' },
    { key: 'estado', label: 'Estado' },
    { key: 'fincaNombre', label: 'Finca' } 
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

      <DataTable
        columns={columns}
        data={crops}
        loading={loading}
      />
    </div>
  );
}
