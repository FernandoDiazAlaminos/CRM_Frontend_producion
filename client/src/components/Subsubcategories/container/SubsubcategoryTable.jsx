import React from "react";
import PropTypes from "prop-types";

const SubsubcategoryTable = ({
  items,
  sortConfig,
  requestSort,
  getSubcategoryName,
  getCategoryName,
  onEdit,
  onDelete
}) => {
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
                    onClick={() => requestSort('id_sub_sub_categoria')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id_sub_sub_categoria' && (
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('subcategoria')}
                  >
                    <div className="flex items-center">
                      Subcategoría
                      {sortConfig.key === 'subcategoria' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('categoria')}
                  >
                    <div className="flex items-center">
                      Categoría
                      {sortConfig.key === 'categoria' && (
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
                {items.map(subsubcategory => (
                  <tr key={subsubcategory.id_sub_sub_categoria} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {subsubcategory.id_sub_sub_categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {subsubcategory.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getSubcategoryName(subsubcategory.id_sub_categoria)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getCategoryName(subsubcategory.id_sub_categoria)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <div className="flex justify-end gap-x-1">
                        <button
                          type="button"
                          onClick={() => onEdit(subsubcategory)}
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
                          onClick={() => onDelete(subsubcategory.id_sub_sub_categoria)}
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

SubsubcategoryTable.propTypes = {
  items: PropTypes.array.isRequired,
  sortConfig: PropTypes.object.isRequired,
  requestSort: PropTypes.func.isRequired,
  getSubcategoryName: PropTypes.func.isRequired,
  getCategoryName: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SubsubcategoryTable;
