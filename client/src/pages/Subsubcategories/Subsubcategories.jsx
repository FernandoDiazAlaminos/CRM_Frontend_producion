import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// Hooks personalizados
import { useSubsubcategories } from "../../hooks";

// Componentes
import SubsubcategoryForm from "../../components/Subsubcategories/SubsubcategoryForm";
import {
  SubsubcategoryHeader,
  SubsubcategoryFilters,
  SubsubcategoryTable,
  SubsubcategoryGrid,
  SubsubcategoryEmptyState,
  SubsubcategoryLoading
} from "../../components/Subsubcategories/container";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

export default function Subsubcategories() {
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);
  
  // Usar el hook personalizado para subsubcategorías
  const {
    loading,
    selectedWebsite,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    categoryFilter,
    subcategoryFilter,
    filterByCategory,
    filterBySubcategory,
    getSortedSubsubcategories,
    getAvailableCategories,
    getAvailableSubcategories,
    getSubcategoryName,
    getCategoryName,
    createSubsubcategory,
    updateSubsubcategory,
    deleteSubsubcategory,
    fetchSubsubcategories
  } = useSubsubcategories();
  
  // Estado local para el formulario y vista
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState(null);
  const [view, setView] = useState("grid"); // grid o table

  // Abrir formulario para crear subsubcategoría
  const handleOpenCreateForm = () => {
    setSelectedSubsubcategory(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar subsubcategoría
  const handleOpenEditForm = (subsubcategory) => {
    setSelectedSubsubcategory(subsubcategory);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedSubsubcategory(null);
  };

  // Submit del formulario de subsubcategoría
  const handleSubmitForm = (data) => {
    if (isEditing && selectedSubsubcategory) {
      updateSubsubcategory(selectedSubsubcategory.id_sub_sub_categoria, data)
        .then(() => {
          setIsFormVisible(false);
          setSelectedSubsubcategory(null);
        })
        .catch(error => console.error('Error al actualizar subsubcategoría:', error));
    } else {
      createSubsubcategory(data)
        .then(() => {
          setIsFormVisible(false);
        })
        .catch(error => console.error('Error al crear subsubcategoría:', error));
    }
  };

  // Manejar eliminación de subsubcategoría (la confirmación ya está en el hook)
  const handleDeleteSubsubcategory = (id) => {
    deleteSubsubcategory(id).catch(error => {
      console.error('Error al eliminar subsubcategoría:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    fetchSubsubcategories();
  };

  // Renderizar contenido principal (formulario o lista)
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario
    if (isFormVisible) {
      return (
        <SubsubcategoryForm 
          initialData={isEditing ? selectedSubsubcategory : null}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          categories={getAvailableCategories()}
          subcategories={getAvailableSubcategories()}
          categoryFilter={categoryFilter}
          selectedWebsite={selectedWebsite}
        />
      );
    }
    
    // Mostrar estado de carga
    if (loading) {
      return <SubsubcategoryLoading />;
    }
    
    // Obtener la lista de subsubcategorías filtradas y ordenadas utilizando el hook
    const items = getSortedSubsubcategories();
    
    if (items.length === 0) {
      return (
        <SubsubcategoryEmptyState 
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          subcategoryFilter={subcategoryFilter}
          onCreateClick={handleOpenCreateForm}
          selectedWebsite={selectedWebsite}
        />
      );
    }
    
    if (view === 'grid') {
      return (
        <SubsubcategoryGrid 
          items={items}
          getCategoryName={getCategoryName}
          getSubcategoryName={getSubcategoryName}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteSubsubcategory}
        />
      );
    }
    
    // Vista de tabla
    return (
      <SubsubcategoryTable 
        items={items}
        sortConfig={sortConfig}
        requestSort={requestSort}
        getSubcategoryName={getSubcategoryName}
        getCategoryName={getCategoryName}
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteSubsubcategory}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SubsubcategoryHeader 
        isFormVisible={isFormVisible}
        isDevelopmentMode={isDevelopmentMode}
        loading={loading}
        onCreateClick={handleOpenCreateForm}
        onRefreshClick={handleRefreshData}
      />
      
      {/* Alerta de web seleccionada */}
      <WebsiteAlert />
      
      {!isFormVisible && selectedWebsite && (
        <SubsubcategoryFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
          categoryFilter={categoryFilter}
          setCategoryFilter={(id) => filterByCategory(id ? parseInt(id) : null)}
          subcategoryFilter={subcategoryFilter}
          setSubcategoryFilter={(id) => filterBySubcategory(id ? parseInt(id) : null)}
          categories={getAvailableCategories()}
          filteredSubcategories={getAvailableSubcategories()}
        />
      )}
      
      {renderContent()}
    </motion.div>
  );
}