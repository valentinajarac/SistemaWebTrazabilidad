import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false
}) => {
  const getCellValue = (row: any, column: Column) => {
    const value = column.key.includes('.') 
      ? column.key.split('.').reduce((obj, key) => obj?.[key], row)
      : row[column.key];
      
    if (column.render) {
      return column.render(value, row);
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-500">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCellValue(item, column)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
