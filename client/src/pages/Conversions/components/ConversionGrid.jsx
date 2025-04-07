import React from 'react';
import { motion } from 'framer-motion';

const ConversionGrid = ({ conversions, onEdit, onDelete }) => {
  if (!conversions || conversions.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay conversiones</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Comienza creando una nueva conversión para realizar seguimiento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {conversions.map((conversion) => (
        <ConversionCard 
          key={conversion.id} 
          conversion={conversion} 
          onEdit={() => onEdit(conversion)} 
          onDelete={() => onDelete(conversion.id)} 
        />
      ))}
    </div>
  );
};

const ConversionCard = ({ conversion, onEdit, onDelete }) => {
  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-x-4">
          <div className="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
            <svg className="size-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="block text-lg font-bold text-gray-800 dark:text-white">
              {conversion.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {conversion.description}
            </p>
          </div>
          
          <div className={`inline-flex items-center justify-center gap-x-1 rounded-full px-3 py-1 text-xs font-medium ${
            conversion.active 
              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {conversion.active ? 'Activa' : 'Inactiva'}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Conversiones</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{conversion.counter}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{conversion.value}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Código único</p>
          <code className="text-sm text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
            {conversion.unique_code}
          </code>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Creación: {formatDate(conversion.created_at)}</span>
          <span className="mx-2">•</span>
          <span>Última actualización: {formatDate(conversion.updated_at)}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-red-500 dark:hover:bg-gray-800"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionGrid;