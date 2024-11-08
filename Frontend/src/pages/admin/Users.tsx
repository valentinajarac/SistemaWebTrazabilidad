import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Plus, X } from 'lucide-react';
import api from '../../api/config';
import { Alert } from '../../components/ui/Alert';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<User>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar usuarios');
      }
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      setError(error.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: User) => {
    try {
      setLoading(true);
      const url = editingUser ? `/users/${editingUser.id}` : '/users';
      const method = editingUser ? 'put' : 'post';
      
      const response = await api[method](url, data);

      if (response.data.success) {
        fetchUsers();
        setShowModal(false);
        reset();
        setEditingUser(null);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      setError(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset(user);
    setShowModal(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        setLoading(true);
        const response = await api.delete(`/users/${user.id}`);
        if (response.data.success) {
          fetchUsers();
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        console.error('Error al eliminar usuario:', error);
        setError(error.response?.data?.message || 'Error al eliminar usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'codigoTrazabilidad', label: 'Código Trazabilidad' },
    { key: 'municipio', label: 'Municipio' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'role', label: 'Rol' },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            reset({});
            setShowModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cédula</label>
                <input
                  type="text"
                  {...register('cedula', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.cedula && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  {...register('nombreCompleto', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.nombreCompleto && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Código Trazabilidad</label>
                <input
                  type="text"
                  {...register('codigoTrazabilidad', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.codigoTrazabilidad && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Municipio</label>
                <input
                  type="text"
                  {...register('municipio', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.municipio && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  {...register('telefono', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.telefono && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input
                  type="text"
                  {...register('usuario', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.usuario && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  {...register('password', { required: !editingUser })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                />
                {errors.password && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  {...register('role', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  disabled={loading}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="PRODUCER">Productor</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};