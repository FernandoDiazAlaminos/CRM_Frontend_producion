import React from "react";

const WebsiteGrid = ({ websites, selectedWebsite, onSelectWebsite, onEditWebsite, onDeleteWebsite, formatDate, renderStatusBadge }) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map(website => (
        <div key={website.id} className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div className="p-4 md:p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {website.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 underline">
                    {website.url}
                  </a>
                </p>
              </div>
              {renderStatusBadge(website.status)}
            </div>
            
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {website.description}
            </p>
            
            <p className="mt-5 text-xs text-gray-500 dark:text-gray-400">
              Última actualización: {formatDate(website.updatedAt || website.lastUpdate)}
            </p>
            
            <div className="mt-5 flex justify-end gap-x-2">
              {/* Botón Editar */}
              <button
                type="button"
                onClick={() => onEditWebsite(website)}
                className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              >
                <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
                Editar
              </button>
              
              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={() => onDeleteWebsite(website.id)}
                className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                className={`py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm font-semibold rounded-lg ${
                  selectedWebsite?.id === website.id
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:text-green-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedWebsite?.id === website.id ? (
                  <>
                    <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Seleccionada
                  </>
                ) : (
                  <>
                    <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                    Seleccionar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebsiteGrid;
