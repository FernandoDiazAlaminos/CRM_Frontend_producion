import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Importar acciones de Redux
import { 
  selectWebsite, 
  clearSelectedWebsite, 
  loadWebsites,
  addWebsite,
  editWebsite,
  removeWebsite,
  showCreateForm,
  showEditForm,
  hideForm
} from "../../redux/slices/websiteSlice";

// Importar componentes
import {
  WebsiteHeader,
  WebsiteSearchBar,
  WebsiteGrid,
  WebsiteTable,
  WebsiteForm,
  LoadingState,
  ErrorAlert,
  SelectedWebsiteAlert,
  GoogleApiHelpTable
} from "./components";

export default function MyWebsites() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Estados globales
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);
  const { 
    websites, 
    selectedWebsite: reduxSelectedWebsite, 
    loading: reduxLoading, 
    isFormVisible,
    editingWebsite
  } = useSelector((state) => state.websites);
  const { user } = useSelector((state) => state.auth);
  
  // Estados locales
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid"); // grid o table
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(loadWebsites(user?.id))
      .unwrap()
      .then(() => setLoading(false))
      .catch(err => {
        setError("Error al cargar las webs: " + (err.message || "Error desconocido"));
        setLoading(false);
      });
  }, [dispatch, isDevelopmentMode, user]);
  
  // Sincronizar con el estado global de Redux
  useEffect(() => {
    if (reduxSelectedWebsite) {
      setSelectedWebsite(reduxSelectedWebsite);
    }
  }, [reduxSelectedWebsite]);
  
  // Actualizar el estado de carga local cuando cambia en Redux
  useEffect(() => {
    setLoading(reduxLoading);
  }, [reduxLoading]);

  // Función para manejar la actualización manual de datos
  const handleRefresh = () => {
    dispatch(loadWebsites(user?.id));
  };
  
  // Función para abrir el formulario de creación
  const handleOpenCreateForm = () => {
    dispatch(showCreateForm());
  };
  
  // Función para abrir el formulario de edición
  const handleOpenEditForm = (website) => {
    dispatch(showEditForm(website));
  };
  
  // Función para cancelar el formulario
  const handleCancelForm = () => {
    dispatch(hideForm());
  };
  
  // Función para crear una web
  const handleCreateWebsite = (websiteData) => {
    // Asegurar que website_id esté asociado con el usuario actual
    if (user?.id) {
      websiteData.user_id = user.id;
      console.log('MyWebsites: Asignando user_id', user.id, 'al nuevo sitio web');
    } else {
      console.error('MyWebsites: ERROR - No hay user_id disponible para asignar al sitio web');
    }
    
    // Verificación final antes de enviar
    if (!websiteData.user_id) {
      Swal.fire({
        title: "Error",
        text: "No se ha podido asociar un usuario al sitio web. Por favor, inicia sesión de nuevo.",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
      return;
    }
    
    dispatch(addWebsite(websiteData));
  };
  
  // Función para actualizar una web
  const handleUpdateWebsite = (websiteData) => {
    const id = editingWebsite.id;
    dispatch(editWebsite({ id, data: websiteData }));
  };
  
  // Función para manejar el envío del formulario (crear o actualizar)
  const handleSubmitForm = (data) => {
    if (editingWebsite) {
      handleUpdateWebsite(data);
    } else {
      handleCreateWebsite(data);
    }
  };
  
  // Función para seleccionar una web y navegar a sus secciones
  const handleSelectWebsite = (website) => {
    setSelectedWebsite(website);
    
    // Despachar la acción de Redux para actualizar el estado global
    dispatch(selectWebsite(website));
    
    // Mostrar notificación
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Web seleccionada: ${website.name}`,
      text: "Ahora puedes gestionar sus contenidos desde el menú lateral",
      showConfirmButton: false,
      timer: 3000
    });

    // Obtener la página anterior de localStorage o de state
    const previousPage = localStorage.getItem('previousPageBeforeWebsites') || '/dashboard';
    
    // Limpiar el localStorage para no mantener esta información indefinidamente
    localStorage.removeItem('previousPageBeforeWebsites');
    
    // Redirigir a la página anterior o a Categorías por defecto
    navigate(previousPage);
  };

  // Función para deseleccionar la web
  const handleDeselectWebsite = () => {
    setSelectedWebsite(null);
    dispatch(clearSelectedWebsite());
  };
  
  // Función para eliminar una web
  const handleDeleteWebsite = async (id) => {
    // Confirmar con el usuario antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      dispatch(removeWebsite(id));
    }
  };
  
  // Función para mostrar el estado de la web con un badge colorido
  const renderStatusBadge = (status) => {
    const statusConfig = {
      active: {
        class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        label: "Activa"
      },
      maintenance: {
        class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        label: "En mantenimiento"
      },
      development: {
        class: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        label: "En desarrollo"
      },
      inactive: {
        class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        label: "Inactiva"
      }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center gap-1 py-1 px-2 rounded-full text-xs font-medium ${config.class}`}>
        <span className="size-2 rounded-full bg-current me-1"></span>
        {config.label}
      </span>
    );
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filtrar webs según la búsqueda
  const filteredWebsites = () => {
    if (!searchQuery.trim()) return websites;
    
    const lowerQuery = searchQuery.toLowerCase();
    return websites.filter(website => 
      website.name?.toLowerCase().includes(lowerQuery) ||
      website.url?.toLowerCase().includes(lowerQuery) ||
      website.description?.toLowerCase().includes(lowerQuery)
    );
  };

  // Ordenar webs
  const sortedWebsites = () => {
    const filtered = filteredWebsites();
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      // Permitir valores nulos o undefined
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      // Si estamos ordenando por fecha de actualización
      if (sortConfig.key === 'updatedAt' || sortConfig.key === 'lastUpdate') {
        const dateA = new Date(a[sortConfig.key] || a.updatedAt || a.lastUpdate);
        const dateB = new Date(b[sortConfig.key] || b.updatedAt || b.lastUpdate);
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      // Para otros campos de texto
      const aValue = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Cambiar ordenamiento
  const requestSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Renderizar el contenido principal
  const renderContent = () => {
    // Si el formulario está visible, mostrar el formulario
    if (isFormVisible) {
      return (
        <WebsiteForm 
          initialData={editingWebsite}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          userId={user?.id}
        />
      );
    }
    
    // Si está cargando, mostrar indicador de carga
    if (loading) {
      return <LoadingState />;
    }
    
    // Si no, mostrar la vista de grid o tabla según corresponda
    return view === 'grid' ? (
      <WebsiteGrid 
        websites={sortedWebsites()} 
        selectedWebsite={selectedWebsite} 
        onSelectWebsite={handleSelectWebsite}
        onEditWebsite={handleOpenEditForm}
        onDeleteWebsite={handleDeleteWebsite}
        formatDate={formatDate} 
        renderStatusBadge={renderStatusBadge} 
      />
    ) : (
      <WebsiteTable 
        websites={sortedWebsites()} 
        selectedWebsite={selectedWebsite} 
        onSelectWebsite={handleSelectWebsite}
        onEditWebsite={handleOpenEditForm}
        onDeleteWebsite={handleDeleteWebsite}
        formatDate={formatDate} 
        renderStatusBadge={renderStatusBadge} 
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
      {/* Encabezado */}
      <WebsiteHeader 
        onRefresh={handleRefresh}
        onCreateNew={handleOpenCreateForm}
        loading={loading} 
        isDevelopmentMode={isDevelopmentMode} 
      />
      
      {/* Mensajes de estado */}
      <ErrorAlert error={error} />
      <SelectedWebsiteAlert 
        selectedWebsite={selectedWebsite} 
        onDeselect={handleDeselectWebsite} 
      />
      
      {/* Tabla de ayuda sobre API Google (solo si estamos mostrando el formulario) */}
      {isFormVisible && (
        <GoogleApiHelpTable />
      )}
      
      {/* Barra de búsqueda y cambio de vista (solo si no se muestra el formulario) */}
      {!isFormVisible && (
        <WebsiteSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          view={view} 
          setView={setView} 
        />
      )}
      
      {/* Contenido principal */}
      {renderContent()}
    </motion.div>
  );
}
