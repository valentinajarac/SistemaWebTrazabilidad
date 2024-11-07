import React from 'react';
import { useForm } from 'react-hook-form';
import { Crop, ProductType, CropStatus, Farm } from '../../types';
import { X } from 'lucide-react';

interface CropFormProps {
  onSubmit: (data: Omit<Crop, 'id' | 'userId'>) => Promise<void>;
  initialData?: Crop;
  farms: Farm[];
  onClose: () => void;
}

export function CropForm({ onSubmit, initialData, farms, onClose }: CropFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Crop, 'id' | 'userId'>>({
    defaultValues: initialData,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Editar Cultivo' : 'Nuevo Cultivo'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Finca
            </label>
            <select
              {...register('farmId', {
                required: 'Debe seleccionar una finca',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Seleccione una finca</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.nombre}
                </option>
              ))}
            </select>
            {errors.farmId && (
              <span className="text-red-500 text-sm">{errors.farmId.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Plantas
            </label>
            <input
              type="number"
              {...register('numeroPlants', {
                required: 'El número de plantas es requerido',
                min: {
                  value: 1,
                  message: 'Debe tener al menos 1 planta',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.numeroPlants && (
              <span className="text-red-500 text-sm">{errors.numeroPlants.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hectáreas
            </label>
            <input
              type="number"
              step="0.01"
              {...register('hectareas', {
                required: 'Las hectáreas son requeridas',
                min: {
                  value: 0.1,
                  message: 'El valor debe ser mayor a 0',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.hectareas && (
              <span className="text-red-500 text-sm">{errors.hectareas.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producto
            </label>
            <select
              {...register('producto', {
                required: 'Debe seleccionar un producto',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Seleccione un producto</option>
              {Object.values(ProductType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.producto && (
              <span className="text-red-500 text-sm">{errors.producto.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              {...register('estado', {
                required: 'Debe seleccionar un estado',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Seleccione un estado</option>
              {Object.values(CropStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.estado && (
              <span className="text-red-500 text-sm">{errors.estado.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
          >
            {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
}