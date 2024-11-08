import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { Farm } from '../../types';
import api from '../../api/config';

export function AdminFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/farms/admin');  // Correct endpoint usage for admin access

      if (response.data.success) {
        setFarms(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar las fincas');
      }
    } catch (error: any) {
      console.error('Error al cargar fincas:', error);
      setError(error.response?.data?.message || 'Error al cargar las fincas');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'productor', label: 'Productor' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'hectareas', label: 'Hectáreas' },
    { key: 'municipio', label: 'Municipio' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fincas</h1>
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
        data={farms}
        loading={loading}
      />
    </div>
  );
}

export default AdminFarms;
