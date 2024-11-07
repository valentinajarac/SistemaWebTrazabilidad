import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Remission, Farm, Crop, Client, ProductType } from '../../types';
import { X } from 'lucide-react';

interface RemissionFormProps {
  onSubmit: (data: Omit<Remission, 'id' | 'userId' | 'totalKilos'>) => Promise<void>;
  initialData?: Remission;
  farms: Farm[];
  crops: Crop[];
  clients: Client[];
  onClose: () => void;
}

export function RemissionForm({
  onSubmit,
  initialData,
  farms,
  crops,
  clients,
  onClose,
}: RemissionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Remission, 'id' | 'userId' | 'totalKilos'>>({
    defaultValues: initialData,
  });

  const selectedFarmId = watch('farmId');
  const selectedCropId = watch('cropId');

  // Filtrar cultivos por finca seleccionada
  const availableCrops = crops.filter(
    (crop) => crop.farmId === Number(selectedFarmId)
  );

  // Actualizar producto según el cultivo seleccionado
  useEffect(() => {
    if (selectedCropId) {
      const crop = crops.find((c) => c.id === Number(selectedCropId));
      if (crop) {
        setValue('producto', crop.producto);
      }
    }
  }, [selectedCropId, crops, setValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Editar Remisión' : 'Nueva Remisión'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Despacho
            </label>
            <input
              type="date"
              {...register('fechaDespacho', {
                required: 'La fecha es requerida',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.fechaDespacho && (
              <span className="text-red-500 text-sm">{errors.fechaDespacho.message}</span>
            )}
          </div>

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
              Cultivo
            </label>
            <select
              {...register('cropId', {
                required: 'Debe seleccionar un cultivo',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              disabled={!selectedFarmId}
            >
              <option value="">Seleccione un cultivo</option>
              {availableCrops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {`${crop.producto} - ${crop.estado}`}
                </option>
              ))}
            </select>
            {errors.cropId && (
              <span className="text-red-500 text-sm">{errors.cropId.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              {...register('clientId', {
                required: 'Debe seleccionar un cliente',
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Seleccione un cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <span className="text-red-500 text-sm">{errors.clientId.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Canastillas Enviadas
            </label>
            <input
              type="number"
              {...register('canastillasEnviadas', {
                required: 'El número de canastillas es requerido',
                min: {
                  value: 1,
                  message: 'Debe enviar al menos 1 canastilla',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.canastillasEnviadas && (
              <span className="text-red-500 text-sm">
                {errors.canastillasEnviadas.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kilos Promedio por Canastilla
            </label>
            <input
              type="number"
              step="0.01"
              {...register('kilosPromedio', {
                required: 'Los kilos promedio son requeridos',
                min: {
                  value: 0.1,
                  message: 'El valor debe ser mayor a 0',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {errors.kilosPromedio && (
              <span className="text-red-500 text-sm">{errors.kilosPromedio.message}</span>
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