import React from "react";

const GoogleApiHelpTable = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-neutral-800 dark:border-neutral-700 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Integración con Google APIs - Guía rápida
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Credencial
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Descripción
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Dónde obtenerla
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                Client ID
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Identificador de tu aplicación en Google Cloud
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Google Cloud Console → APIs y servicios → Credenciales
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                Client Secret
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Código secreto para autenticar la aplicación
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Google Cloud Console → APIs y servicios → Credenciales
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                Refresh Token
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Token permanente para renovar el acceso
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Se obtiene mediante el flujo OAuth (usa el botón "Obtener Token")
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                Developer Token
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Token específico para Google Ads API
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                Google Ads → Herramientas → API Center (usa el botón "¿Cómo obtenerlo?")
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Requisitos previos:</strong>
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Proyecto creado en Google Cloud Console</li>
          <li>APIs habilitadas (Google Analytics, Google Ads)</li>
          <li>Pantalla de consentimiento OAuth configurada</li>
          <li>Credenciales OAuth configuradas con la URL de redirección: <code className="bg-gray-100 dark:bg-neutral-700 px-1 py-0.5 rounded">https://dev.agencia.dimap.es/</code></li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleApiHelpTable;
