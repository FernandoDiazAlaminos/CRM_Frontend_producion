import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// Hooks personalizados
import { useSubcategories } from "../../hooks";

// Componentes
import SubcategoryForm from "../../components/Subcategories/SubcategoryForm";
import SubcategoryCard from "../../components/Subcategories/SubcategoryCard";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

export default function Subcategories() {
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);
  
  // Usar el hook personalizado para subcategorías
  const {
    loading,
    selectedWebsite,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    categoryFilter,
    filterByCategory,
    clearCategoryFilter,
    getSortedSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getAvailableCategories,
    getCategoryName,
    fetchSubcategories
  } = useSubcategories();
  
  // Estado local
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [view, setView] = useState("grid"); // grid o table

  // Abrir formulario para crear subcategoría
  const handleOpenCreateForm = () => {
    setSelectedSubcategory(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar subcategoría
  const handleOpenEditForm = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedSubcategory(null);
  };

  // Submit del formulario de subcategoría
  const handleSubmitForm = (data) => {
    if (isEditing && selectedSubcategory) {
      updateSubcategory(selectedSubcategory.id_sub_categoria, data)
        .then(() => {
          setIsFormVisible(false);
          setSelectedSubcategory(null);
        })
        .catch(error => console.error('Error al actualizar subcategoría:', error));
    } else {
      createSubcategory(data)
        .then(() => {
          setIsFormVisible(false);
        })
        .catch(error => console.error('Error al crear subcategoría:', error));
    }
  };

  // Manejar eliminación de subcategoría (la confirmación ya está en el hook)
  const handleDeleteSubcategory = (id) => {
    deleteSubcategory(id).catch(error => {
      console.error('Error al eliminar subcategoría:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    fetchSubcategories();
  };

  // Renderizar cabecera de página
  const renderHeader = () => (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
            Gestión de Subcategorías
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Administra las subcategorías de tu sitio
          </p>
        </div>
        
        {!isFormVisible && (
          <div className="inline-flex gap-x-2">
            <button
              type="button"
              onClick={handleRefreshData}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              disabled={loading}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9.95-8.93A9 9 0 0 0 6 21.39"/>
                <path d="M3 12a9 9 0 0 1 9.95-8.93A9 9 0 0 1 18 21.39"/>
                <path d="M14.83 14.83 19 19"/>
                <path d="M19 14.83v4.17h-4.17"/>
              </svg>
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Nueva Subcategoría
            </button>
          </div>
        )}
      </div>

      {/* Indicador de modo API */}
      <div className={`mt-2 inline-flex items-center rounded-full py-1 px-3 text-xs font-medium ${
        isDevelopmentMode 
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }`}>
        <span className="size-2 rounded-full bg-current me-1.5"></span>
        Usando datos en {isDevelopmentMode ? 'modo prueba' : 'modo real (API)'}
      </div>
    </header>
  );

  // Renderizar barra de búsqueda y filtros
  const renderSearchBar = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Buscador */}
      <div className="sm:w-64 flex-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-3 ps-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            placeholder="Buscar subcategorías..."
          />
          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <svg className="size-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Filtro por categoría */}
      <div className="sm:w-48">
        <select
          value={categoryFilter || ''}
          onChange={(e) => filterByCategory(e.target.value ? parseInt(e.target.value) : null)}
          className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
        >
          <option value="">Todas las categorías</option>
          {getAvailableCategories().map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      
      {/* Cambiar vista */}
      <div className="inline-flex rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => setView('grid')}
          className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-s-lg ${
            view === 'grid'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="14" rx="1"/>
            <rect width="7" height="7" x="3" y="14" rx="1"/>
          </svg>
          Tarjetas
        </button>
        <button
          type="button"
          onClick={() => setView('table')}
          className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-e-lg ${
            view === 'table'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M3 12h18"/>
            <path d="M3 18h18"/>
          </svg>
          Tabla
        </button>
      </div>
    </div>
  );

  // Renderizar contenido principal (formulario o lista)
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario
    if (isFormVisible) {
      return (
        <SubcategoryForm 
          initialData={isEditing ? selectedSubcategory : null}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          categories={getAvailableCategories()}
          selectedWebsite={selectedWebsite}
        />
      );
    }
    
    // Mostrar estado de carga
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin size-7 border-2 border-blue-600 rounded-full border-t-transparent"></div>
          <p className="ms-2 text-gray-600 dark:text-gray-400">Cargando subcategorías...</p>
        </div>
      );
    }
    
    // Obtener la lista de subcategorías filtradas y ordenadas utilizando el hook
    const items = getSortedSubcategories();
    
    if (items.length === 0) {
      return (
        <div className="text-center py-10">
          <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 0-2.04-3.44H3"/>
            <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 1 2.04-3.44H21"/>
            <path d="M12 12h4"/>
            <path d="M12 16h2"/>
            <path d="M12 8h5"/>
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay subcategorías</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {searchQuery || categoryFilter 
              ? 'No se encontraron resultados para tu búsqueda.' 
              : selectedWebsite 
                ? `No hay subcategorías para la web "${selectedWebsite.name}".` 
                : 'Comienza creando una nueva subcategoría.'
            }
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Nueva Subcategoría
            </button>
          </div>
        </div>
      );
    }
    
    if (view === 'grid') {
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(subcategory => (
            <SubcategoryCard 
              key={subcategory.id_sub_categoria} 
              subcategory={subcategory} 
              categoryName={getCategoryName(subcategory.id_categoria)}
              onEdit={handleOpenEditForm} 
              onDelete={handleDeleteSubcategory} 
            />
          ))}
        </div>
      );
    }
    
    // Vista de tabla
    return (
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('id_sub_categoria')}
                    >
                      <div className="flex items-center">
                        ID
                        {sortConfig.key === 'id_sub_categoria' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('nombre')}
                    >
                      <div className="flex items-center">
                        Nombre
                        {sortConfig.key === 'nombre' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('id_categoria')}
                    >
                      <div className="flex items-center">
                        Categoría
                        {sortConfig.key === 'id_categoria' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map(subcategory => (
                    <tr key={subcategory.id_sub_categoria} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {subcategory.id_sub_categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {subcategory.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {getCategoryName(subcategory.id_categoria)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <div className="flex justify-end gap-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(subcategory)}
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
                            onClick={() => handleDeleteSubcategory(subcategory.id_sub_categoria)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderHeader()}
      
      {/* Alerta de web seleccionada */}
      <WebsiteAlert />
      
      {!isFormVisible && selectedWebsite && renderSearchBar()}
      {renderContent()}
    </motion.div>
  );
}