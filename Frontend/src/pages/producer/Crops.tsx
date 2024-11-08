import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Crop, Farm } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { CropForm } from '../../components/forms/CropForm';
import api from '../../api/config';

export function Crops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<Crop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCrops();
    fetchFarms();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/crops');
      if (response.data.success) {
        setCrops(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error('Error al cargar cultivos:', error);
      setError(error.response?.data?.message || 'Error al cargar los cultivos');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      if (response.data.success) {
        setFarms(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar las fincas');
    }
  };

  const handleSubmit = async (data: Omit<Crop, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = currentCrop ? `/crops/${currentCrop.id}` : '/crops';
      const method = currentCrop ? 'put' : 'post';
      
      const response = await api[method](url, data);
      
      if (response.data.success) {
        await fetchCrops();
        setIsModalOpen(false);
        setCurrentCrop(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar el cultivo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (crop: Crop) => {
    setCurrentCrop(crop);
    setIsModalOpen(true);
  };

  const handleDelete = async (crop: Crop) => {
    if (window.confirm('¿Está seguro de eliminar este cultivo?')) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.delete(`/crops/${crop.id}`);
        
        if (response.data.success) {
          await fetchCrops();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al eliminar el cultivo');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
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
      key: 'farmNombre', 
      label: 'Finca'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cultivos</h1>
        <Button
          onClick={() => {
            setCurrentCrop(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={PlusCircle}
          disabled={loading}
        >
          Nuevo Cultivo
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
        data={crops}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCrop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
      >
        <CropForm
          onSubmit={handleSubmit}
          initialData={currentCrop}
          farms={farms}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
