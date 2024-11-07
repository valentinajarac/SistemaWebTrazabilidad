import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Remission } from '../../types';

export function Remissions() {
  const [remissions, setRemissions] = useState<Remission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRemission, setCurrentRemission] = useState<Remission | null>(null);

  const handleSubmit = (remission: Remission) => {
    const totalKilos = remission.canastillasEnviadas * remission.kilosPromedio;
    const newRemission = { ...remission, totalKilos };

    if (currentRemission) {
      setRemissions(remissions.map(r => r.id === currentRemission.id ? newRemission : r));
    } else {
      setRemissions([...remissions, { ...newRemission, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setCurrentRemission(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Remisiones de Campo</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nueva Remisión
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canastillas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kilos Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Kilos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {remissions.map((remission) => (
              <tr key={remission.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(remission.fechaDespacho).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{remission.producto}</td>
                <td className="px-6 py-4 whitespace-nowrap">{remission.canastillasEnviadas}</td>
                <td className="px-6 py-4 whitespace-nowrap">{remission.kilosPromedio}</td>
                <td className="px-6 py-4 whitespace-nowrap">{remission.totalKilos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setCurrentRemission(remission);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setRemissions(remissions.filter(r => r.id !== remission.id))}
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