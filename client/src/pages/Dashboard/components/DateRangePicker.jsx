import React, { useState } from 'react';

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  // Opciones predefinidas
  const predefinedRanges = [
    { name: 'Últimos 7 días', days: 7 },
    { name: 'Últimos 14 días', days: 14 },
    { name: 'Últimos 30 días', days: 30 },
    { name: 'Últimos 60 días', days: 60 },
    { name: 'Últimos 90 días', days: 90 }
  ];

  // Manejar click en opción predefinida
  const handlePredefinedRangeClick = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const newRange = { startDate, endDate };
    setLocalDateRange(newRange);
    onDateRangeChange(newRange);
    setIsOpen(false);
  };

  // Manejar cambio de fechas
  const handleDateChange = (e, type) => {
    const date = new Date(e.target.value);
    
    setLocalDateRange(prev => ({
      ...prev,
      [type]: date
    }));
  };

  // Aplicar rango personalizado
  const handleApplyCustomRange = () => {
    onDateRangeChange(localDateRange);
    setIsOpen(false);
  };

  // Formatear fecha para mostrar
  const formatDateDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Formatear fecha para input
  const formatDateForInput = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Periodo de análisis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateDisplay(dateRange.startDate)} - {formatDateDisplay(dateRange.endDate)}
          </p>
        </div>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Cambiar periodo
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 w-72">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">Seleccionar periodo</h3>
              </div>
              
              <div className="p-3 space-y-3">
                {/* Rangos predefinidos */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rangos predefinidos</p>
                  <div className="space-y-1">
                    {predefinedRanges.map((range) => (
                      <button
                        key={range.days}
                        type="button"
                        onClick={() => handlePredefinedRangeClick(range.days)}
                        className="w-full text-start p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Rango personalizado */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rango personalizado</p>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="start-date" className="block text-sm text-gray-600 dark:text-gray-400">Fecha inicio</label>
                      <input
                        type="date"
                        id="start-date"
                        className="py-2 px-3 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                        value={formatDateForInput(localDateRange.startDate)}
                        onChange={(e) => handleDateChange(e, 'startDate')}
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-sm text-gray-600 dark:text-gray-400">Fecha fin</label>
                      <input
                        type="date"
                        id="end-date"
                        className="py-2 px-3 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                        value={formatDateForInput(localDateRange.endDate)}
                        onChange={(e) => handleDateChange(e, 'endDate')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end gap-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyCustomRange}
                    className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;