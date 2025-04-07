import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SubsubcategoryForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading, 
  categories, 
  subcategories, 
  categoryFilter 
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    id_sub_categoria: ""
  });
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  
  // Inicializar con datos si se está editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        id_sub_categoria: initialData.id_sub_categoria || ""
      });
      
      // Si estamos editando, buscamos la categoría adecuada
      const subcat = subcategories.find(sub => sub.id_sub_categoria === initialData.id_sub_categoria);
      if (subcat) {
        setSelectedCategory(subcat.id_categoria.toString());
      }
    } else if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [initialData, subcategories, categoryFilter]);
  
  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        sub => sub.id_categoria === parseInt(selectedCategory)
      );
      setFilteredSubcategories(filtered);
      
      // Si cambia la categoría y la subcategoría actual no pertenece a esta categoría,
      // resetear el valor de subcategoría
      if (formData.id_sub_categoria) {
        const subcat = subcategories.find(
          sub => sub.id_sub_categoria === parseInt(formData.id_sub_categoria)
        );
        if (!subcat || subcat.id_categoria !== parseInt(selectedCategory)) {
          setFormData(prev => ({ ...prev, id_sub_categoria: "" }));
        }
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, id_sub_categoria: "" }));
    }
  }, [selectedCategory, subcategories, formData.id_sub_categoria]);
  
  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setSelectedCategory(value);
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: name === 'id_sub_categoria' ? parseInt(value) : value
      }));
    }
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
          {initialData ? "Editar Subsubcategoría" : "Crear Nueva Subsubcategoría"}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {initialData ? "Actualiza la información de la subsubcategoría" : "Completa la información para crear una nueva subsubcategoría"}
        </p>
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
              placeholder="Nombre de la subsubcategoría"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Campo: Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2 dark:text-white">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              value={selectedCategory}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id_categoria} value={category.id_categoria}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>
          
          {/* Campo: Subcategoría */}
          <div>
            <label htmlFor="id_sub_categoria" className="block text-sm font-medium mb-2 dark:text-white">
              Subcategoría <span className="text-red-500">*</span>
            </label>
            <select
              id="id_sub_categoria"
              name="id_sub_categoria"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              value={formData.id_sub_categoria}
              onChange={handleChange}
              required
              disabled={!selectedCategory}
            >
              <option value="">Selecciona una subcategoría</option>
              {filteredSubcategories.map(subcategory => (
                <option key={subcategory.id_sub_categoria} value={subcategory.id_sub_categoria}>
                  {subcategory.nombre}
                </option>
              ))}
            </select>
            {!selectedCategory && (
              <p className="mt-1 text-xs text-amber-500">
                Selecciona primero una categoría
              </p>
            )}
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
              "Crear Subsubcategoría"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
