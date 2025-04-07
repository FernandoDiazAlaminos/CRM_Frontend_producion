import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useWebsiteContext } from "../../contexts/WebsiteContext";

/**
 * Componente que muestra una alerta cuando se requiere seleccionar una web
 * para acceder a ciertas funcionalidades
 */
export default function WebsiteRequired() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedWebsite } = useWebsiteContext();
  
  // Si hay una web seleccionada, no mostrar este componente
  if (selectedWebsite) {
    return null;
  }

  // Función para navegar a la selección de webs
  const handleSelectWebsite = () => {
    // Guardar la ruta actual antes de navegar a mis webs
    localStorage.setItem('previousPageBeforeWebsites', location.pathname);
    navigate('/my-websites');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <div className="mb-6">
        <svg 
          className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        Selecciona un sitio web
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Para ver y gestionar el contenido, primero necesitas seleccionar un sitio web. Esto ayuda a organizar la información y mejorar el rendimiento.
      </p>
      
      <button
        type="button"
        onClick={handleSelectWebsite}
        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Ir a Mis Sitios Web
      </button>
    </motion.div>
  );
}