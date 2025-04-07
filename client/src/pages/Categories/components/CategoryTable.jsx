import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete, sortConfig, requestSort }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 0-2.04-3.44H3"/>
          <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 1 2.04-3.44H21"/>
          <path d="M12 12h4"/>
          <path d="M12 16h2"/>
          <path d="M12 8h5"/>
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay categorías</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          No se encontraron resultados para tu búsqueda.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {}} // Se manejará desde el componente padre
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            Nueva Categoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('id_categoria')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id_categoria' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('nombre')}
                  >
                    <div className="flex items-center">
                      Nombre
                      {sortConfig.key === 'nombre' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map(category => (
                  <tr key={category.id_categoria} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {category.id_categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {category.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <div className="flex justify-end gap-x-1">
                        <button
                          type="button"
                          onClick={() => onEdit(category)}
                          className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(category.id_categoria)}
                          className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            <line x1="10" x2="10" y1="11" y2="17"/>
                            <line x1="14" x2="14" y1="11" y2="17"/>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;