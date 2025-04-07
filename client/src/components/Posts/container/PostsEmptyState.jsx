import React from "react";
import PropTypes from "prop-types";

const PostsEmptyState = ({ searchQuery, categoryFilter, onCreateClick }) => {
  return (
    <div className="text-center py-10">
      <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/>
        <line x1="16" x2="8" y1="17" y2="17"/>
        <line x1="10" x2="8" y1="9" y2="9"/>
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay posts</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {searchQuery || categoryFilter ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza creando un nuevo post.'}
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onCreateClick}
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          Nuevo Post
        </button>
      </div>
    </div>
  );
};

PostsEmptyState.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  categoryFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCreateClick: PropTypes.func.isRequired
};

export default PostsEmptyState;
