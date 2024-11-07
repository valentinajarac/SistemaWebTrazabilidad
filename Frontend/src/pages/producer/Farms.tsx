import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Farm } from '../../types';

export function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFarm, setCurrentFarm] = useState<Farm | null>(null);

  const handleSubmit = (farm: Farm) => {
    if (currentFarm) {
      setFarms(farms.map(f => f.id === currentFarm.id ? farm : f));
    } else {
      setFarms([...farms, { ...farm, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setCurrentFarm(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Fincas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nueva Finca
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hectáreas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Municipio
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {farms.map((farm) => (
              <tr key={farm.id}>
                <td className="px-6 py-4 whitespace-nowrap">{farm.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{farm.hectareas}</td>
                <td className="px-6 py-4 whitespace-nowrap">{farm.municipio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setCurrentFarm(farm);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setFarms(farms.filter(f => f.id !== farm.id))}
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