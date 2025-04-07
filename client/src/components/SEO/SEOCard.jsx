import { motion } from "framer-motion";

export default function SEOCard({ 
  item, 
  type = "page", 
  onEdit, 
  onDelete 
}) {
  // Determinar el tipo de entidad para el tipo "entity"
  const getEntityType = () => {
    if (type !== "entity") return "";
    
    if (item.id_categoria) return "Categoría";
    if (item.id_sub_categoria) return "Subcategoría";
    if (item.id_sub_sub_categoria) return "Sub-subcategoría";
    if (item.id_post) return "Post";
    return "Desconocido";
  };

  return (
    <motion.div 
      className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-800 dark:border-neutral-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-x-2">
          <div className="flex-shrink-0">
            {type === "page" ? (
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <path d="M9 8h6"/>
                  <path d="M9 12h6"/>
                  <path d="M9 16h6"/>
                </svg>
              </span>
            ) : (
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-x-2 mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate dark:text-neutral-200">
                {type === "page" ? item.nombre_pagina : getEntityType()}
              </h3>
              <div className="flex items-center gap-x-1">
                {item.index ? (
                  <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                    index
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    noindex
                  </span>
                )}
                
                {item.follow ? (
                  <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                    follow
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    nofollow
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-x-1 text-xs text-gray-500 dark:text-neutral-400">
              <span className="truncate">
                <span className="font-semibold">URL:</span> {item.url_canonica}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
            {item.title}
          </h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
            {item.description}
          </p>
          
          {item.keywords && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 dark:text-neutral-500">
                <span className="font-medium">Keywords:</span> {item.keywords}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-x-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
}
