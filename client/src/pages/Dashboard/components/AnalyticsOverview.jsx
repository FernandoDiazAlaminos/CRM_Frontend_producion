import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsOverview = ({ data = {} }) => {
  if (!data) {
    return null;
  }
  
  // Formatear duración de sesión
  const formatSessionDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Lista de métricas a mostrar
  const metrics = [
    {
      name: 'Sesiones',
      value: data.sessions?.toLocaleString() || 0,
      change: data.sessionsGrowth,
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
          <path d="M2 8c.97 0 1.94.01 2.92.01 1.33.02 2.2 1.35 1.5 2.5-.7 1.15-1.9-.3-3.16.79-1.3 1.11-3.26-.08-3.26-1.54C0 8.28 1.97 8 2 8Z"/>
          <path d="M12 8c.97 0 1.94.01 2.92.01 1.33.02 2.2 1.35 1.5 2.5-.7 1.15-1.9-.3-3.16.79-1.3 1.11-3.26-.08-3.26-1.54C10 8.28 11.97 8 12 8Z"/>
          <path d="M19 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
          <path d="M17 8c.97 0 1.94.01 2.92.01 1.33.02 2.2 1.35 1.5 2.5-.7 1.15-1.9-.3-3.16.79-1.3 1.11-3.26-.08-3.26-1.54C15 8.28 16.97 8 17 8Z"/>
          <path d="M22 19c-.97 0-1.94-.01-2.92-.01-1.33-.02-2.2-1.35-1.5-2.5.7-1.15 1.9.3 3.16-.79 1.3-1.11 3.26.08 3.26 1.54C24 18.72 22.03 19 22 19Z"/>
          <path d="M2 19c.97 0 1.94-.01 2.92-.01 1.33-.02 2.2-1.35 1.5-2.5-.7-1.15-1.9.3-3.16-.79-1.3-1.11-3.26.08-3.26 1.54C0 18.72 1.97 19 2 19Z"/>
          <path d="M12 19c.97 0 1.94-.01 2.92-.01 1.33-.02 2.2-1.35 1.5-2.5-.7-1.15-1.9.3-3.16-.79-1.3-1.11-3.26.08-3.26 1.54C10 18.72 11.97 19 12 19Z"/>
        </svg>
      )
    },
    {
      name: 'Usuarios',
      value: data.users?.toLocaleString() || 0,
      change: data.usersGrowth,
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      name: 'Páginas vistas',
      value: data.pageviews?.toLocaleString() || 0,
      change: data.pageviewsGrowth,
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8Z" />
        </svg>
      )
    },
    {
      name: 'Tiempo de sesión',
      value: formatSessionDuration(data.avgSessionDuration) || '0m 0s',
      change: null,
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      name: 'Tasa de rebote',
      value: `${data.bounceRate?.toFixed(1) || 0}%`,
      change: null,
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-5" />
          <path d="M5 12H2a10 10 0 0 0 5.3 8.8" />
          <path d="M10 12h12" />
          <path d="M19 12v6" />
          <path d="M12 7V2" />
          <path d="M19 12V2" />
          <path d="M5 12V9" />
        </svg>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Resumen de Analytics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="mr-2 text-blue-600 dark:text-blue-400">
                  {metric.icon}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.name}
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {metric.value}
              </p>
              {metric.change !== null && (
                <div className={`flex items-center mt-1 text-sm ${
                  metric.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change >= 0 ? (
                    <svg className="size-4 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  ) : (
                    <svg className="size-4 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsOverview;