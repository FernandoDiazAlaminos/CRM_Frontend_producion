import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Hooks personalizados
import { useConversions } from "../../hooks";

// Componentes
import ConversionForm from "../../components/Conversions/ConversionForm";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

// Componentes modularizados
import {
  ConversionHeader,
  ConversionSearchBar,
  ConversionGrid,
  ConversionTable,
  LoadingState
} from "./components";

export default function Conversions() {
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode, lastChanged } = useSelector((state) => state.apiMode);
  
  // Usar el hook personalizado de conversiones
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    selectedWebsite,
    getSortedConversions,
    fetchConversions,
    createConversion,
    updateConversion,
    deleteConversion,
    normalizeConversion
  } = useConversions();
  
  // Estado local
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedConversion, setSelectedConversion] = useState(null);
  const [view, setView] = useState("grid"); // grid o table

  // Recargar datos cuando cambia el modo API
  useEffect(() => {
    if (lastChanged && selectedWebsite) {
      // Recargar los datos sin mostrar notificación
      fetchConversions();
    }
  }, [lastChanged, isDevelopmentMode, fetchConversions, selectedWebsite]);

  // Abrir formulario para crear conversión
  const handleOpenCreateForm = () => {
    setSelectedConversion(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar conversión
  const handleOpenEditForm = (conversion) => {
    const normalizedConversion = normalizeConversion(conversion);
    setSelectedConversion(normalizedConversion);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedConversion(null);
  };

  // Submit del formulario de conversión
  const handleSubmitForm = (data) => {
    if (isEditing && selectedConversion) {
      updateConversion(selectedConversion.id, data)
        .then(() => {
          setIsFormVisible(false);
          setSelectedConversion(null);
        })
        .catch(error => {
          console.error('Error al actualizar conversión:', error);
        });
    } else {
      createConversion(data)
        .then(() => {
          setIsFormVisible(false);
        })
        .catch(error => {
          console.error('Error al crear conversión:', error);
        });
    }
  };

  // Manejar eliminación de conversión (la confirmación ya está incluida en el hook)
  const handleDeleteConversion = (id) => {
    deleteConversion(id).catch(error => {
      console.error('Error al eliminar conversión:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    if (selectedWebsite) {
      fetchConversions();
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

  // Renderizar contenido principal
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario si está visible
    if (isFormVisible) {
      return (
        <ConversionForm 
          initialData={isEditing ? selectedConversion : null}
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
    
    // Obtener la lista de conversiones filtradas y ordenadas usando el hook
    const items = getSortedConversions();
    
    // Mostrar la vista según la selección del usuario (grid o table)
    return view === 'grid' ? (
      <ConversionGrid 
        conversions={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteConversion}
      />
    ) : (
      <ConversionTable 
        conversions={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteConversion}
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
      <ConversionHeader 
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
        <ConversionSearchBar 
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