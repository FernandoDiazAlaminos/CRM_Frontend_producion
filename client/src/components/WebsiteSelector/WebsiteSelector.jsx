import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

/**
 * Componente selector de websites
 * Permite al usuario seleccionar una web de la lista
 */
export default function WebsiteSelector() {
  const { 
    websites,
    selectedWebsite, 
    loading, 
    loadWebsites,
    selectWebsite,
    clearSelectedWebsite,
    getFilteredWebsites,
    canAccessWebsite
  } = useWebsiteContext();
  
  const { user } = useSelector((state) => state.auth);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Cargar las webs al montar el componente
  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const handleWebsiteChange = (e) => {
    const websiteId = parseInt(e.target.value);
    
    if (websiteId === 0) {
      // Si se selecciona "Todas las webs", limpiar la selección
      clearSelectedWebsite();
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: "Mostrando todas las webs",
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      // Encontrar la web seleccionada
      const website = websites.find(web => web.id === websiteId);
      
      if (website) {
        // Intentar seleccionar la web (ya se validan permisos en el contexto)
        selectWebsite(website);
      } else {
        // Mostrar mensaje de error si no se encuentra la web
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: "Web no encontrada",
          showConfirmButton: false,
          timer: 3000
        });
      }
    }
  };

  // Obtener el ID de usuario (manejando ambos formatos posibles)
  const userId = user?.id || user?.id_user;
  
  // Filtrar las webs según los permisos del usuario
  const availableWebsites = getFilteredWebsites();

  const isAdmin = user?.role === 'admin';

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="website-selector" className="block text-sm font-medium dark:text-white">
          Seleccionar Web
        </label>
        
        {/* Indicador de modo admin */}
        {isAdmin && (
          <motion.div 
            className="relative"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
              Modo Admin
            </span>
            
            {tooltipVisible && (
              <motion.div 
                className="absolute z-10 right-0 top-full mt-1 py-1 px-2 bg-neutral-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                Acceso a todas las webs del sistema
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="relative">
        <select
          id="website-selector"
          className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
          onChange={handleWebsiteChange}
          value={selectedWebsite?.id || 0}
          disabled={loading}
        >
          <option value={0}>Todas las webs</option>
          {availableWebsites.map((website) => (
            <option key={website.id} value={website.id}>
              {website.name}
              {website.user_id === null && isAdmin && " (Sin propietario)"}
              {website.user_id !== null && website.user_id !== userId && isAdmin && " (Otro usuario)"}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          ) : (
            <svg className="size-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          )}
        </div>
      </div>
      
      {/* Contador de webs disponibles */}
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {isAdmin ? (
          <span>Mostrando {availableWebsites.length} webs (acceso de administrador)</span>
        ) : (
          <span>Mostrando {availableWebsites.length} webs asignadas a tu usuario</span>
        )}
      </div>
    </div>
  );
}