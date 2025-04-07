import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// Hooks personalizados
import useCategories from "../../hooks/categories/useCategories";

// Componentes
import CategoryForm from "../../components/Categories/CategoryForm";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

// Componentes modularizados
import {
  CategoryHeader,
  CategorySearchBar,
  CategoryGrid,
  CategoryTable,
  LoadingState
} from "./components";

export default function Categories() {
  // Usar el hook personalizado de categorías
  const {
    loading,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSortedCategories,
    selectedWebsite
  } = useCategories();
  
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);
  
  // Estado local para el formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [view, setView] = useState("grid"); // grid o table

  // Abrir formulario para crear categoría
  const handleOpenCreateForm = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar categoría
  const handleOpenEditForm = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedCategory(null);
  };

  // Submit del formulario de categoría
  const handleSubmitForm = (data) => {
    if (isEditing && selectedCategory) {
      updateCategory(selectedCategory.id_categoria, data)
        .then(() => {
          setIsFormVisible(false);
          setSelectedCategory(null);
        })
        .catch(error => console.error('Error al actualizar categoría:', error));
    } else {
      createCategory(data)
        .then(() => {
          setIsFormVisible(false);
        })
        .catch(error => console.error('Error al crear categoría:', error));
    }
  };

  // Manejar eliminación de categoría (ya tiene confirmación en el hook)
  const handleDeleteCategory = (id) => {
    deleteCategory(id).catch(error => {
      console.error('Error al eliminar categoría:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    fetchCategories();
  };

  // Renderizar contenido principal
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario si está visible
    if (isFormVisible) {
      return (
        <CategoryForm 
          initialData={isEditing ? selectedCategory : null}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          selectedWebsite={selectedWebsite}
        />
      );
    }
    
    // Mostrar estado de carga
    if (loading) {
      return <LoadingState />;
    }
    
    // Obtener la lista de categorías filtradas y ordenadas
    const items = getSortedCategories();
    
    // Mostrar la vista según la selección del usuario (grid o table)
    return view === 'grid' ? (
      <CategoryGrid 
        categories={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteCategory}
      />
    ) : (
      <CategoryTable 
        categories={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteCategory}
        sortConfig={sortConfig}
        requestSort={requestSort}
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
      {/* Cabecera de la página */}
      <CategoryHeader 
        onRefresh={handleRefreshData} 
        onCreateNew={handleOpenCreateForm} 
        isFormVisible={isFormVisible}
        loading={loading}
        isDevelopmentMode={isDevelopmentMode}
      />
      
      {/* Alerta de web seleccionada */}
      <WebsiteAlert />
      
      {/* Barra de búsqueda y cambio de vista (solo si no se muestra el formulario y hay sitio web seleccionado) */}
      {!isFormVisible && selectedWebsite && (
        <CategorySearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
        />
      )}
      
      {/* Contenido principal: formulario, grid o tabla */}
      {renderContent()}
    </motion.div>
  );
}