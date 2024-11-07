import React from 'react';
import { useForm } from 'react-hook-form';
import { Farm } from '../../types';
import { X } from 'lucide-react';

interface FarmFormProps {
  onSubmit: (data: Omit<Farm, 'id' | 'userId'>) => Promise<void>;
  initialData?: Farm;
  onClose: () => void;
}

export function FarmForm({ onSubmit, initialData, onClose }: FarmFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Farm, 'id' | 'userId'>>({
    defaultValues: initialData,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Editar Finca' : 'Nueva Finca'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Finca
            </label>
            <input
              type="text"
              {...register('nombre', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.nombre && (
              <span className="text-red-500 text-sm">{errors.nombre.message}</span>
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
              Municipio
            </label>
            <input
              type="text"
              {...register('municipio', {
                required: 'El municipio es requerido',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.municipio && (
              <span className="text-red-500 text-sm">{errors.municipio.message}</span>
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