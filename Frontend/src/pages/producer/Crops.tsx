import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Crop } from '../../types';

export function Crops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<Crop | null>(null);

  const handleSubmit = (crop: Crop) => {
    if (currentCrop) {
      setCrops(crops.map(c => c.id === currentCrop.id ? crop : c));
    } else {
      setCrops([...crops, { ...crop, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setCurrentCrop(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cultivos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nuevo Cultivo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Plantas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hectáreas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td className="px-6 py-4 whitespace-nowrap">{crop.numeroPlants}</td>
                <td className="px-6 py-4 whitespace-nowrap">{crop.hectareas}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{crop.producto}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{crop.estado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setCurrentCrop(crop);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCrops(crops.filter(c => c.id !== crop.id))}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}