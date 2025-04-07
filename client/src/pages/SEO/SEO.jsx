import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Hooks personalizados
import { useSEO } from "../../hooks";

// Redux actions (solo para cargar entidades relacionadas)
import { loadSEOEntities } from "../../redux/slices/seoSlice";

// Componentes
import SEOEntityForm from "../../components/SEO/SEOEntityForm";
import SEOPageForm from "../../components/SEO/SEOPageForm";
import {
  SEOHeader,
  SEOTabs,
  SEOFilters,
  SEOGrid,
  SEOTable,
  SEOEmptyState,
  SEOLoading
} from "../../components/SEO/container";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

export default function SEO() {
  const dispatch = useDispatch();
  
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode, lastChanged } = useSelector((state) => state.apiMode);
  
  // Usar el hook personalizado de SEO
  const {
    selectedSEO,
    activeSEOType,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedWebsite,
    getFilteredSEOItems,
    getSortedSEOItems,
    setActiveType,
    selectSEOItem,
    clearSelection,
    fetchSEOData,
    saveItem,
    deleteItem
  } = useSEO();
  
  // Estado local
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState("grid"); // grid o table
  
  // Datos de entidades para el formulario
  // En una implementación real, estos vendrían de Redux
  const [categories, setCategories] = useState([
    { id_categoria: 1, nombre: "Marketing Digital" },
    { id_categoria: 2, nombre: "Diseño Web" },
    { id_categoria: 3, nombre: "Desarrollo de Apps" }
  ]);
  
  const [subcategories, setSubcategories] = useState([
    { id_sub_categoria: 1, id_categoria: 1, nombre: "SEO" },
    { id_sub_categoria: 2, id_categoria: 1, nombre: "Redes Sociales" },
    { id_sub_categoria: 3, id_categoria: 2, nombre: "UI/UX" }
  ]);
  
  const [subsubcategories, setSubsubcategories] = useState([
    { id_sub_sub_categoria: 1, id_sub_categoria: 1, nombre: "SEO On-Page" },
    { id_sub_sub_categoria: 2, id_sub_categoria: 1, nombre: "SEO Off-Page" },
    { id_sub_sub_categoria: 3, id_sub_categoria: 2, nombre: "Contenido para Instagram" }
  ]);
  
  const [posts, setPosts] = useState([
    { id_post: 1, titulo: "Mejores prácticas SEO", categoria_id: 1 },
    { id_post: 2, titulo: "Estrategias de Instagram", categoria_id: 1 },
    { id_post: 3, titulo: "Diseño Responsive", categoria_id: 2 }
  ]);

  // Cargar datos al montar el componente
  useEffect(() => {
    // Solo cargar datos si hay un sitio web seleccionado
    if (selectedWebsite) {
      fetchSEOData();
      
      // Comprobar si venimos de la página de posts para editar SEO
      const seoEditMode = localStorage.getItem('seoEditMode');
      const seoEntityType = localStorage.getItem('seoEntityType');
      
      if (seoEditMode && seoEntityType === 'post') {
        setIsFormVisible(true);
        setIsEditing(seoEditMode === 'edit');
        
        // Si el post ya tiene configurado selectedSEO desde la otra página,
        // no necesitamos hacer nada más aquí
        if (selectedSEO) {
          // Simplemente establecemos los estados correspondientes
          setIsFormVisible(true);
          setIsEditing(seoEditMode === 'edit');
        }
        
        // Limpiamos localStorage
        localStorage.removeItem('seoEditMode');
        localStorage.removeItem('seoEntityType');
        localStorage.removeItem('seoEntityId');
        localStorage.removeItem('seoEntityData');
      }
    }
  }, [fetchSEOData, selectedSEO, selectedWebsite]);

  // Recargar datos cuando cambia el modo API
  useEffect(() => {
    if (lastChanged && selectedWebsite) {
      // Notificar al usuario del cambio de modo
      const toastMessage = isDevelopmentMode 
        ? "Cambiado a modo prueba. Recargando datos..."
        : "Cambiado a modo real. Conectando con la API...";
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: toastMessage,
        showConfirmButton: false,
        timer: 2000
      });
      
      // Recargar los datos
      fetchSEOData();
    }
  }, [lastChanged, isDevelopmentMode, fetchSEOData, selectedWebsite]);

  // Cambiar entre tipos de SEO (páginas o entidades)
  const handleSEOTypeChange = (type) => {
    setActiveType(type);
    setIsFormVisible(false);
    setSearchQuery("");
  };

  // Abrir formulario para crear
  const handleOpenCreateForm = () => {
    clearSelection();
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar
  const handleOpenEditForm = (item) => {
    selectSEOItem(item);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    clearSelection();
  };

  // Submit del formulario de entidad
  const handleSubmitEntityForm = (data) => {
    const id = isEditing && selectedSEO ? selectedSEO.id : null;
    
    saveItem(id, data)
      .then(() => {
        setIsFormVisible(false);
        clearSelection();
      })
      .catch(error => {
        console.error('Error al guardar entidad SEO:', error);
      });
  };

  // Submit del formulario de página
  const handleSubmitPageForm = (data) => {
    const id = isEditing && selectedSEO ? selectedSEO.id : null;
    
    saveItem(id, data)
      .then(() => {
        setIsFormVisible(false);
        clearSelection();
      })
      .catch(error => {
        console.error('Error al guardar página SEO:', error);
      });
  };

  // Eliminar un ítem SEO
  const handleDeleteSEO = (id) => {
    deleteItem(id).catch(error => {
      console.error('Error al eliminar ítem SEO:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    if (selectedWebsite) {
      fetchSEOData();
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: "Selecciona un sitio web",
        text: "Necesitas seleccionar un sitio web para cargar datos",
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Renderizar contenido principal (formulario o lista)
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario
    if (isFormVisible) {
      return activeSEOType === 'entities' ? (
        <SEOEntityForm 
          initialData={isEditing ? selectedSEO : null}
          onSubmit={handleSubmitEntityForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          categories={categories}
          subcategories={subcategories}
          subsubcategories={subsubcategories}
          posts={posts}
        />
      ) : (
        <SEOPageForm 
          initialData={isEditing ? selectedSEO : null}
          onSubmit={handleSubmitPageForm}
          onCancel={handleCancelForm}
          isLoading={loading}
        />
      );
    }
    
    // Mostrar listado
    const items = getSortedSEOItems();
    
    if (loading) {
      return <SEOLoading />;
    }
    
    if (items.length === 0) {
      return (
        <SEOEmptyState 
          searchQuery={searchQuery}
          activeSEOType={activeSEOType}
          onCreateClick={handleOpenCreateForm}
        />
      );
    }
    
    if (view === 'grid') {
      return (
        <SEOGrid 
          items={items}
          activeSEOType={activeSEOType}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteSEO}
        />
      );
    }
    
    // Vista de tabla
    return (
      <SEOTable 
        items={items}
        activeSEOType={activeSEOType}
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteSEO}
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
      <SEOHeader 
        isFormVisible={isFormVisible}
        isDevelopmentMode={isDevelopmentMode}
        activeSEOType={activeSEOType}
        onCreateClick={handleOpenCreateForm}
        onRefreshClick={handleRefreshData}
        loading={loading}
      />
      
      {/* Alerta de web seleccionada */}
      <WebsiteAlert />
      
      {!isFormVisible && selectedWebsite && (
        <SEOTabs 
          activeSEOType={activeSEOType}
          onSEOTypeChange={handleSEOTypeChange}
        />
      )}
      
      {!isFormVisible && selectedWebsite && (
        <SEOFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
        />
      )}
      
      {renderContent()}
    </motion.div>
  );
}