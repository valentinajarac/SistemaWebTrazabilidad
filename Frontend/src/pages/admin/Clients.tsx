import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Client } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Plus, X } from 'lucide-react';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Client>();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const onSubmit = async (data: Client) => {
    try {
      const url = editingClient 
        ? `http://localhost:8080/api/clients/${editingClient.id}`
        : 'http://localhost:8080/api/clients';
        
      const method = editingClient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchClients();
        setShowModal(false);
        reset();
        setEditingClient(null);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    reset(client);
    setShowModal(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await fetch(`http://localhost:8080/api/clients/${client.id}`, {
          method: 'DELETE',
        });
        fetchClients();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const columns = [
    { key: 'nit', label: 'NIT' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'floid', label: 'FLO ID' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            reset({});
            setShowModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIT</label>
                <input
                  type="number"
                  {...register('nit', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.nit && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  {...register('nombre', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.nombre && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">FLO ID</label>
                <input
                  type="number"
                  {...register('floid', { 
                    required: true,
                    minLength: 4,
                    maxLength: 4
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.floid && <span className="text-red-500 text-sm">Debe ser un número de 4 dígitos</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  {...register('direccion', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.direccion && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  {...register('telefono', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.telefono && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.email && <span className="text-red-500 text-sm">Email inválido</span>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                {editingClient ? 'Actualizar' : 'Crear'} Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};