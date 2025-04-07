import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CategoryForm({ initialData, onSubmit, onCancel, isLoading, selectedWebsite }) {
  const [formData, setFormData] = useState({
    nombre: ""
  });
  
  // Inicializar con datos si se está editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || ""
      });
    }
  }, [initialData]);
  
  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 dark:bg-slate-900 dark:border-gray-700"
    >
      <div className="border-b border-gray-200 pb-4 mb-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {initialData ? "Editar Categoría" : "Crear Nueva Categoría"}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {initialData ? "Actualiza la información de la categoría" : "Completa la información para crear una nueva categoría"}
        </p>
        
        {/* Mostrar la web seleccionada si existe */}
        {selectedWebsite && (
          <div className="mt-2 inline-flex items-center rounded-full py-1 px-3 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
            <span className="size-2 rounded-full bg-current me-1.5"></span>
            Web: {selectedWebsite.name}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Campo: Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium mb-2 dark:text-white">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              placeholder="Nombre de la categoría"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-x-3">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>
                Guardando...
              </>
            ) : initialData ? (
              "Guardar Cambios"
            ) : (
              "Crear Categoría"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}