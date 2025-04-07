import React from "react";

const WebsiteTable = ({ websites, selectedWebsite, onSelectWebsite, onEditWebsite, onDeleteWebsite, formatDate, renderStatusBadge, sortConfig, requestSort }) => {
  if (websites.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay webs disponibles</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          No se encontraron resultados para tu búsqueda.
        </p>
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
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Nombre
                      {sortConfig.key === 'name' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('url')}
                  >
                    <div className="flex items-center">
                      URL
                      {sortConfig.key === 'url' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Estado
                      {sortConfig.key === 'status' && (
                        <span className="ms-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => requestSort('updatedAt')}
                  >
                    <div className="flex items-center">
                      Última Actualización
                      {sortConfig.key === 'updatedAt' && (
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
                {websites.map(website => (
                  <tr key={website.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      {website.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {website.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {website.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {renderStatusBadge(website.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(website.updatedAt || website.lastUpdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <div className="flex justify-end gap-x-1">
                        {/* Botón Editar */}
                        <button
                          type="button"
                          onClick={() => onEditWebsite(website)}
                          className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        >
                          <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                          Editar
                        </button>
                        
                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() => onDeleteWebsite(website.id)}
                          className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-red-600 text-white hover:bg-red-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
                        
                        {/* Botón Seleccionar */}
                        <button
                          type="button"
                          onClick={() => onSelectWebsite(website)}
                          className={`py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent ${
                            selectedWebsite?.id === website.id 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:text-green-400'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {selectedWebsite?.id === website.id ? (
                            <>
                              <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                              Seleccionada
                            </>
                          ) : (
                            <>
                              <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                              </svg>
                              Seleccionar
                            </>
                          )}
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

export default WebsiteTable;