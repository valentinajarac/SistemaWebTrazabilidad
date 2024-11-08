import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/DataTable';
import { Alert } from '../../components/ui/Alert';
import { Remission } from '../../types';
import api from '../../api/config';

export function AdminRemissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRemissions();
  }, []);

  const fetchRemissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/remissions/admin'); // Correct endpoint for admin access to remissions

      if (response.data.success) {
        setRemissions(response.data.data);
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
    { key: 'fechaDespacho', label: 'Fecha' },
    { key: 'nombreProductor', label: 'Productor' },
    { key: 'farmNombre', label: 'Finca' },
    { key: 'producto', label: 'Producto' },
    { key: 'canastillasEnviadas', label: 'Canastillas' },
    { key: 'kilosPromedio', label: 'Kilos Promedio' },
    { key: 'totalKilos', label: 'Total Kilos' },
    { key: 'clientNombre', label: 'Cliente' }
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

      <DataTable
        columns={columns}
        data={remissions}
        loading={loading}
      />
    </div>
  );
}

export default AdminRemissions;
