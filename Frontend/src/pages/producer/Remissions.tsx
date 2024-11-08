import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Remission, Farm, Crop, Client } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { RemissionForm } from '../../components/forms/RemissionForm';
import api from '../../api/config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Remissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRemission, setCurrentRemission] = useState<Remission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRemissions();
    fetchFarms();
    fetchCrops();
    fetchClients();
  }, []);

  const fetchRemissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/remissions');
      if (response.data.success) {
        // Transformar los datos para asegurar que las relaciones estén correctamente mapeadas
        const transformedRemissions = response.data.data.map((remission: any) => ({
          ...remission,
          farm: farms.find(f => f.id === remission.farmId) || { nombre: 'N/A' },
          client: clients.find(c => c.id === remission.clientId) || { nombre: 'N/A' }
        }));
        setRemissions(transformedRemissions);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar las remisiones');
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

  const fetchCrops = async () => {
    try {
      const response = await api.get('/crops');
      if (response.data.success) {
        setCrops(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar los cultivos');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar los clientes');
    }
  };

  // Refrescar los datos cuando se carguen las fincas y clientes
  useEffect(() => {
    if (farms.length > 0 && clients.length > 0) {
      fetchRemissions();
    }
  }, [farms, clients]);

  const handleSubmit = async (data: Omit<Remission, 'id'>) => {
    try {
      setLoading(true);
      const url = currentRemission ? `/remissions/${currentRemission.id}` : '/remissions';
      const method = currentRemission ? 'put' : 'post';
      
      const response = await api[method](url, data);
      
      if (response.data.success) {
        await fetchRemissions();
        setIsModalOpen(false);
        setCurrentRemission(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar la remisión');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (remission: Remission) => {
    setCurrentRemission(remission);
    setIsModalOpen(true);
  };

  const handleDelete = async (remission: Remission) => {
    if (window.confirm('¿Está seguro de eliminar esta remisión?')) {
      try {
        setLoading(true);
        const response = await api.delete(`/remissions/${remission.id}`);
        
        if (response.data.success) {
          await fetchRemissions();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al eliminar la remisión');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { 
      key: 'fechaDespacho', 
      label: 'Fecha',
      render: (value: string) => format(new Date(value), 'dd/MM/yyyy', { locale: es })
    },
    { 
      key: 'farm.nombre', 
      label: 'Finca'
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value: string) => value?.charAt(0) + value?.slice(1).toLowerCase() || 'N/A'
    },
    { 
      key: 'canastillasEnviadas', 
      label: 'Canastillas',
      render: (value: number) => value?.toLocaleString() || '0'
    },
    { 
      key: 'kilosPromedio', 
      label: 'Kilos Promedio',
      render: (value: number) => value?.toFixed(2) || '0.00'
    },
    { 
      key: 'totalKilos', 
      label: 'Total Kilos',
      render: (value: number) => value?.toFixed(2) || '0.00'
    },
    { 
      key: 'client.nombre', 
      label: 'Cliente'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones de Campo</h1>
        <Button
          onClick={() => {
            setCurrentRemission(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          icon={PlusCircle}
          disabled={loading}
        >
          Nueva Remisión
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
        data={remissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRemission ? 'Editar Remisión' : 'Nueva Remisión'}
      >
        <RemissionForm
          onSubmit={handleSubmit}
          initialData={currentRemission}
          farms={farms}
          crops={crops}
          clients={clients}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

