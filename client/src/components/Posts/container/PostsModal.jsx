import React from "react";
import PropTypes from "prop-types";

const PostsModal = ({
  isOpen,
  formMode,
  formData,
  categorias,
  onSubmit,
  onChange,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {formMode === 'create' ? 'Añadir nuevo post' : 'Editar post'}
          </h3>
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={onChange}
                required
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Título del post"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contenido
              </label>
              <textarea
                id="contenido"
                name="contenido"
                value={formData.contenido}
                onChange={onChange}
                required
                rows="8"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Contenido del post (admite HTML)"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id || ''}
                onChange={onChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              >
                <option value="">Sin categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-gray-200 font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              {formMode === 'create' ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PostsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  formMode: PropTypes.oneOf(['create', 'edit']).isRequired,
  formData: PropTypes.object.isRequired,
  categorias: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PostsModal;
