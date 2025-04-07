import React from "react";

const CategoryHeader = ({ onRefresh, onCreateNew, isFormVisible, loading, isDevelopmentMode }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
            Gestión de Categorías
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Administra las categorías principales de tu sitio
          </p>
        </div>
        
        {!isFormVisible && (
          <div className="inline-flex gap-x-2">
            <button
              type="button"
              onClick={onRefresh}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              disabled={loading}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9.95-8.93A9 9 0 0 0 6 21.39"/>
                <path d="M3 12a9 9 0 0 1 9.95-8.93A9 9 0 0 1 18 21.39"/>
                <path d="M14.83 14.83 19 19"/>
                <path d="M19 14.83v4.17h-4.17"/>
              </svg>
              Actualizar
            </button>
            <button
              type="button"
              onClick={onCreateNew}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Nueva Categoría
            </button>
          </div>
        )}
      </div>
      
      {/* Indicador de modo API */}
      <div className={`mt-2 inline-flex items-center rounded-full py-1 px-3 text-xs font-medium ${
        isDevelopmentMode 
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }`}>
        <span className="size-2 rounded-full bg-current me-1.5"></span>
        Usando datos en {isDevelopmentMode ? 'modo prueba' : 'modo real (API)'}
      </div>
    </header>
  );
};

export default CategoryHeader;