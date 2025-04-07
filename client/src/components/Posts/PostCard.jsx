import React from "react";
import PropTypes from "prop-types";

const PostCard = ({ post, categoryName, onEdit, onDelete, onEditSEO }) => {
  // Truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              {post.titulo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {formatDate(post.createdAt)}
            </p>
          </div>
          
          {/* Badge de categoría */}
          <span className="inline-flex items-center gap-1 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {categoryName}
          </span>
        </div>
        
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {truncateText(post.contenido, 200)}
        </p>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEditSEO(post)}
            className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar SEO
          </button>
          <button
            type="button"
            onClick={() => onEdit(post)}
            className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(post.id_post)}
            className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  categoryName: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditSEO: PropTypes.func.isRequired
};

export default PostCard;
