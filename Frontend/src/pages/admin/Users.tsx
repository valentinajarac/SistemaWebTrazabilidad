import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Plus, X } from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<User>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const onSubmit = async (data: User) => {
    try {
      const url = editingUser 
        ? `http://localhost:8080/api/users/${editingUser.id}`
        : 'http://localhost:8080/api/users';
        
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        reset();
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
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
        await fetch(`http://localhost:8080/api/users/${user.id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            reset({});
            setShowModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
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
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                  type="number"
                  {...register('cedula', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.cedula && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  {...register('nombreCompleto', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.nombreCompleto && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Código Trazabilidad</label>
                <input
                  type="number"
                  {...register('codigoTrazabilidad', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.codigoTrazabilidad && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Municipio</label>
                <input
                  type="text"
                  {...register('municipio', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.municipio && <span className="text-red-500 text-sm">Campo requerido</span>}
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
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input
                  type="text"
                  {...register('usuario', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.usuario && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  {...register('password', { required: !editingUser })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                {errors.password && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  {...register('role', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                >
                  <option value="admin">Administrador</option>
                  <option value="producer">Productor</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">Campo requerido</span>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};