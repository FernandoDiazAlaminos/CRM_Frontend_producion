import { useState } from "react";
import { motion } from "framer-motion";

const DeveloperTokenHelp = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("intro");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Cabecera */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              ¿Cómo obtener un Developer Token para Google Ads?
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-2 p-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("intro")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "intro"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Introducción
            </button>
            <button
              onClick={() => setActiveTab("steps")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "steps"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Paso a paso
            </button>
            <button
              onClick={() => setActiveTab("levels")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "levels"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Niveles de acceso
            </button>
          </nav>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6">
          {activeTab === "intro" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">¿Qué es un Developer Token?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Un Developer Token es una credencial especial requerida para acceder a la API de Google Ads. A diferencia de otras APIs de Google, la API de Google Ads requiere este token adicional por razones de seguridad y para controlar el acceso a datos sensibles de publicidad.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-800/20 dark:border-yellow-600">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      Los Developer Tokens son específicos para cada cuenta de Google Ads Manager y están vinculados a proyectos específicos de Google Cloud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Paso 1: Acceder al API Center de Google Ads</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Ingresa a tu cuenta de Google Ads Manager y navega al API Center:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Inicia sesión en tu cuenta de Google Ads en <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">ads.google.com</a></li>
                  <li>Haz clic en el icono de "Herramientas" (⚙️) en la parte superior derecha</li>
                  <li>En la columna "Configuración", selecciona "API Center"</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Paso 2: Solicitar un Developer Token</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  En el API Center:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Acepta los términos y condiciones si es tu primera vez</li>
                  <li>Haz clic en "Apply for a developer token" (Solicitar un token de desarrollador)</li>
                  <li>Completa el formulario con la información solicitada sobre tu proyecto</li>
                  <li>Envía la solicitud y espera la aprobación</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Paso 3: Recibir y usar el Developer Token</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Una vez aprobado:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Recibirás un token de desarrollador que aparecerá en el API Center</li>
                  <li>Copia este token e introdúcelo en el campo correspondiente de nuestro formulario</li>
                  <li>Este token, junto con las credenciales OAuth, te permitirá acceder a la API de Google Ads</li>
                </ol>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 dark:bg-blue-800/20 dark:border-blue-600">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Inicialmente, recibirás un token de prueba. Para acceder a todas las funcionalidades, incluida la gestión de cuentas de clientes, necesitarás pasar por un proceso de verificación adicional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "levels" && (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                Los Developer Tokens de Google Ads tienen diferentes niveles de acceso, cada uno con capacidades distintas:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-neutral-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Nivel
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Capacidades
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Requisitos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Básico
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Acceso a tus propias cuentas</li>
                          <li>Limitado a funciones esenciales</li>
                          <li>Ideal para pruebas iniciales</li>
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Solicitud básica</li>
                          <li>Sin verificación especial</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Estándar
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Acceso completo a tus cuentas</li>
                          <li>Más operaciones por minuto</li>
                          <li>Funcionalidades avanzadas</li>
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Verificación de la aplicación</li>
                          <li>Descripción detallada del caso de uso</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Avanzado
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Gestión de cuentas de terceros</li>
                          <li>Máxima cuota de operaciones</li>
                          <li>Acceso a todas las funcionalidades</li>
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Verificación completa</li>
                          <li>Comprobación de seguridad</li>
                          <li>Documentación extensa del producto</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 dark:bg-green-800/20 dark:border-green-600">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      Recomendación: Para la mayoría de integraciones empresariales, un token de nivel estándar es suficiente si solo gestionas tus propias cuentas. Si necesitas gestionar cuentas de varios clientes, deberás solicitar un token de nivel avanzado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              Entendido
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperTokenHelp;
