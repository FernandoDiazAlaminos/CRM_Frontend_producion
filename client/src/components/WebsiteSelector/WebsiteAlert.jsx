import { motion } from "framer-motion";
import { useWebsiteContext } from "../../contexts/WebsiteContext";

/**
 * Componente que muestra una alerta con la web seleccionada actualmente
 */
export default function WebsiteAlert() {
  const { selectedWebsite, clearSelectedWebsite } = useWebsiteContext();
  
  if (!selectedWebsite) {
    return null;
  }
  
  // Estilo según el estado de la web
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "development":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };
  
  // Etiqueta de estado en español
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Activa";
      case "maintenance":
        return "En mantenimiento";
      case "development":
        return "En desarrollo";
      case "inactive":
        return "Inactiva";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-5 dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {selectedWebsite.logo ? (
              <img 
                src={selectedWebsite.logo}
                alt={`Logo de ${selectedWebsite.name}`}
                className="w-8 h-8 rounded"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold">
                {selectedWebsite.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                {selectedWebsite.name}
              </h3>
              <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-xs font-medium ${getStatusColor(selectedWebsite.status)}`}>
                <span className="size-1.5 rounded-full bg-current"></span>
                {getStatusLabel(selectedWebsite.status)}
              </span>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400">
              <a 
                href={selectedWebsite.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {selectedWebsite.url}
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={clearSelectedWebsite}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Deseleccionar web"
        >
          <svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}