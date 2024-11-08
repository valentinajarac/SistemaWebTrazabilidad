import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Farm } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { FarmForm } from '../../components/forms/FarmForm';
import api from '../../api/config';

export function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farms');
      if (response.data.success) {
        setFarms(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar las fincas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Farm, 'id'>) => {
    try {
      setLoading(true);
      const url = currentFarm ? `/farms/${currentFarm.id}` : '/farms';
      const method = currentFarm ? 'put' : 'post';
      
      const response = await api[method](url, data);
      
      if (response.data.success) {
        await fetchFarms();
        setIsModalOpen(false);
        setCurrentFarm(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar la finca');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (farm: Farm) => {
    setCurrentFarm(farm);
    setIsModalOpen(true);
  };

  const handleDelete = async (farm: Farm) => {
    if (window.confirm('¿Está seguro de eliminar esta finca?')) {
      try {
        setLoading(true);
        const response = await api.delete(`/farms/${farm.id}`);
        
        if (response.data.success) {
          await fetchFarms();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al eliminar la finca');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'hectareas', label: 'Hectáreas' },
    { key: 'municipio', label: 'Municipio' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Fincas</h1>
        <Button
          onClick={() => {
            setCurrentFarm(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={PlusCircle}
          disabled={loading}
        >
          Nueva Finca
        </Button>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentFarm ? 'Editar Finca' : 'Nueva Finca'}
      >
        <FarmForm
          onSubmit={handleSubmit}
          initialData={currentFarm}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}