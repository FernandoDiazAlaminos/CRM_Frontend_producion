import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Hooks personalizados
import { usePosts } from "../../hooks";
import { useCategories } from "../../hooks";

// Redux actions para SEO (mantenemos estas ya que no hay hook para SEO aún)
import { 
  setActiveSEOType, 
  setSelectedSEO,
  loadSEOEntities
} from "../../redux/slices/seoSlice";

// Componentes
import {
  PostsHeader,
  PostsFilters,
  PostsTable,
  PostsGrid,
  PostsModal,
  PostsLoading,
  PostsError,
  PostsEmptyState
} from "../../components/Posts/container";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

export default function Posts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode, lastChanged } = useSelector((state) => state.apiMode);
  const { seoEntities } = useSelector((state) => state.seo);
  
  // Usar los hooks personalizados
  const {
    posts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedWebsite,
    fetchPosts,
    getSortedPosts,
    createPost,
    updatePost,
    deletePost,
    applyFilters,
    normalizePost
  } = usePosts();
  
  // También necesitamos categorías para el filtrado y formularios
  const { categories } = useCategories();
  
  // Estados para UI
  const [categoryFilter, setCategoryFilter] = useState("");
  const [view, setView] = useState("grid"); // grid o table
  
  // Estados para el formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [formData, setFormData] = useState({ 
    titulo: '', 
    contenido: '', 
    categoria_id: '' 
  });
  const [currentId, setCurrentId] = useState(null);

  // Recargar datos cuando cambia el modo API
  useEffect(() => {
    if (lastChanged && selectedWebsite) {
      // Recargar sin notificación
      fetchPosts();
      dispatch(loadSEOEntities(selectedWebsite.id));
    }
  }, [lastChanged, isDevelopmentMode, fetchPosts, selectedWebsite, dispatch]);

  // Encontrar el nombre de la categoría por ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Sin categoría';
    const categoria = categories.find(cat => cat.id_categoria === categoryId);
    return categoria ? categoria.nombre : 'No asignada';
  };

  // Formatear fecha
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

  // Truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // Manejar apertura del modal
  const handleOpenModal = (mode, post = null) => {
    setFormMode(mode);
    if (mode === 'create') {
      setFormData({ 
        titulo: '', 
        contenido: '', 
        categoria_id: categories.length > 0 ? categories[0].id_categoria : '' 
      });
      setCurrentId(null);
    } else {
      // Usar normalizePost para garantizar consistencia
      const normalizedPost = normalizePost(post);
      setFormData({ 
        titulo: normalizedPost.titulo,
        contenido: normalizedPost.contenido,
        categoria_id: normalizedPost.id_categoria || ''
      });
      setCurrentId(normalizedPost.id_post);
    }
    setIsModalOpen(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'categoria_id' ? (value ? Number(value) : '') : value 
    });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      createPost(formData)
        .then(() => {
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error al crear post:', error);
        });
    } else {
      updatePost(currentId, formData)
        .then(() => {
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error al actualizar post:', error);
        });
    }
  };

  // Manejar eliminación
  const handleDelete = (id) => {
    // El hook ya incluye confirmación, solo llamamos al método
    deletePost(id).catch(error => {
      console.error('Error al eliminar post:', error);
    });
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    if (selectedWebsite) {
      fetchPosts();
      dispatch(loadSEOEntities(selectedWebsite.id));
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

  // Aplicar filtro por categoría
  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value);
    applyFilters({ category: value ? parseInt(value) : null });
  };

  // Manejar edición de SEO para un post
  const handleEditSEO = (post) => {
    // Primero cargamos los datos SEO si no están ya cargados
    if (seoEntities.length === 0) {
      dispatch(loadSEOEntities(selectedWebsite?.id));
    }
    
    // Normalizar el post
    const normalizedPost = normalizePost(post);
    
    // Buscar si ya existe configuración SEO para este post
    const existingPostSEO = seoEntities.find(
      entity => entity.id_post === normalizedPost.id_post
    );
    
    // Preparar los datos para la página SEO
    const seoData = existingPostSEO ? 
      {...existingPostSEO} : 
      {
        id: Date.now(), // ID temporal para modo de creación
        id_post: normalizedPost.id_post,
        url_canonica: `/blog/${normalizedPost.id_post}/${normalizedPost.titulo?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`, 
        title: normalizedPost.titulo ? `${normalizedPost.titulo} - DIMAP` : '',
        description: truncateText(normalizedPost.contenido, 150) || '',
        keywords: '',
        index: true,
        follow: true,
        img: '',
        alt: normalizedPost.titulo || '',
        website_id: selectedWebsite ? selectedWebsite.id : null
      };
    
    // Almacenar datos importantes en localStorage para pasarlos a la página SEO
    localStorage.setItem('seoEditMode', existingPostSEO ? 'edit' : 'create');
    localStorage.setItem('seoEntityType', 'post');
    localStorage.setItem('seoEntityId', normalizedPost.id_post.toString());
    localStorage.setItem('seoEntityData', JSON.stringify({
      titulo: normalizedPost.titulo,
      contenido: truncateText(normalizedPost.contenido, 150),
      website_id: selectedWebsite ? selectedWebsite.id : null
    }));
    
    // Configurar el estado global para SEO
    dispatch(setActiveSEOType('entities'));
    dispatch(setSelectedSEO(seoData));
    
    // Navegar a la página SEO
    navigate('/seo');
    
    // Mostrar notificación
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: existingPostSEO ? "Editando configuración SEO del post" : "Creando nueva configuración SEO para el post",
      showConfirmButton: false,
      timer: 2000
    });
  };

  // Renderizar contenido principal
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    if (loading) {
      return <PostsLoading />;
    }
    
    // Obtener posts filtrados y ordenados con el hook
    const items = getSortedPosts();
    
    if (items.length === 0) {
      return (
        <PostsEmptyState 
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          onCreateClick={() => handleOpenModal('create')}
          selectedWebsite={selectedWebsite}
        />
      );
    }
    
    if (view === 'grid') {
      return (
        <PostsGrid 
          posts={items}
          getCategoryName={getCategoryName}
          onEdit={(post) => handleOpenModal('edit', post)}
          onDelete={handleDelete}
          onEditSEO={handleEditSEO}
        />
      );
    }
    
    // Vista de tabla
    return (
      <PostsTable 
        posts={items}
        getCategoryName={getCategoryName}
        formatDate={formatDate}
        truncateText={truncateText}
        onEdit={(post) => handleOpenModal('edit', post)}
        onDelete={handleDelete}
        onEditSEO={handleEditSEO}
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
      <PostsHeader 
        isDevelopmentMode={isDevelopmentMode}
        loading={loading}
        onCreateClick={() => handleOpenModal('create')}
        onRefreshClick={handleRefreshData}
      />

      {/* Alerta de web seleccionada */}
      <WebsiteAlert />

      <PostsError message={error} />

      {!loading && !isModalOpen && selectedWebsite && (
        <PostsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          view={view}
          setView={setView}
          categoryFilter={categoryFilter}
          setCategoryFilter={handleCategoryFilterChange}
          categories={categories}
        />
      )}

      {renderContent()}

      <PostsModal 
        isOpen={isModalOpen}
        formMode={formMode}
        formData={formData}
        categorias={categories}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onClose={handleCloseModal}
        selectedWebsite={selectedWebsite}
      />
    </motion.div>
  );
}