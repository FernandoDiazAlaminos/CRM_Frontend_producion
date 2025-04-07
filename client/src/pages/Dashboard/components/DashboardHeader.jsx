import React from 'react';
import { useSelector } from 'react-redux';

const DashboardHeader = () => {
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
            Dashboard Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Estadísticas de Analytics y Google Ads
          </p>
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
      </div>
    </header>
  );
};

export default DashboardHeader;