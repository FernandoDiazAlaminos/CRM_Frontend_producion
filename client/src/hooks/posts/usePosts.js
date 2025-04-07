import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';
import { 
  loadPosts, 
  createPost, 
  updatePost, 
  deletePost 
} from '../../redux/slices/postsSlice';

/**
 * Hook personalizado para gestionar operaciones con posts/artículos
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con posts
 */
export default function usePosts() {
  const dispatch = useDispatch();
  // Asumimos que existe un slice de posts similar al de categorías
  const { posts, loading, error } = useSelector((state) => state.posts || { posts: [], loading: false, error: null });
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda, ordenamiento, filtrado y paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'titulo', direction: 'asc' });
  const [filters, setFilters] = useState({
    category: null,
    state: null,
    date: null
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  /**
   * Cargar posts asociados a la web seleccionada
   */
  const fetchPosts = useCallback(() => {
    if (selectedWebsite) {
      // Usar la acción loadPosts importada del slice
      dispatch(loadPosts({
        websiteId: selectedWebsite.id,
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      }));
    }
  }, [dispatch, selectedWebsite, pagination.page, pagination.limit, filters]);
  
  /**
   * Cargar posts automáticamente cuando cambia la web seleccionada o la paginación
   */
  useEffect(() => {
    if (selectedWebsite) {
      fetchPosts();
    }
  }, [fetchPosts, selectedWebsite]);
  
  /**
   * Filtrar posts según la web seleccionada y términos de búsqueda
   * 
   * @returns {Array} - Posts filtrados
   */
  const getFilteredPosts = useCallback(() => {
    let filtered = posts;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(post => 
        post.website_id === selectedWebsite.id
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.titulo?.toLowerCase().includes(lowerQuery) ||
        post.contenido?.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(post => 
        post.id_categoria === filters.category
      );
    }
    
    // Filtrar por estado
    if (filters.state) {
      filtered = filtered.filter(post => 
        post.estado === filters.state
      );
    }
    
    // Filtrar por fecha
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at);
        return postDate >= filterDate;
      });
    }
    
    return filtered;
  }, [posts, selectedWebsite, searchQuery, filters]);
  
  /**
   * Ordenar posts según la configuración actual
   * 
   * @returns {Array} - Posts ordenados
   */
  const getSortedPosts = useCallback(() => {
    const filtered = getFilteredPosts();
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      // Permitir valores nulos o undefined
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
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
  }, [getFilteredPosts, sortConfig]);
  
  /**
   * Cambiar la configuración de ordenamiento
   * 
   * @param {string} key - Clave por la que ordenar
   */
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);
  
  /**
   * Cambiar de página en la paginación
   * 
   * @param {number} page - Número de página
   */
  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  }, []);
  
  /**
   * Cambiar límite de elementos por página
   * 
   * @param {number} limit - Límite de elementos
   */
  const handleLimitChange = useCallback((limit) => {
    setPagination(prev => ({
      ...prev,
      limit,
      page: 1 // Resetear a primera página al cambiar el límite
    }));
  }, []);
  
  /**
   * Aplicar filtros
   * 
   * @param {Object} newFilters - Nuevos filtros a aplicar
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Resetear paginación al aplicar filtros
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);
  
  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      category: null,
      state: null,
      date: null
    });
    setSearchQuery('');
    // Resetear paginación
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);
  
  /**
   * Crear un nuevo post asociado a la web seleccionada
   * 
   * @param {Object} data - Datos del post a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar el post'));
    }
    
    // Asociar el post a la web seleccionada
    const postData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    // Usar la acción createPost importada del slice
    return dispatch(createPost(postData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar un post existente
   * 
   * @param {number} id - ID del post a actualizar
   * @param {Object} data - Nuevos datos del post
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar el post'));
    }
    
    // Asegurar que el post sigue asociado a la web correcta
    const postData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    // Usar la acción updatePost importada del slice
    return dispatch(updatePost({ id, data: postData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar un post
   * 
   * @param {number} id - ID del post a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleDelete = useCallback(async (id) => {
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    
    if (result.isConfirmed) {
      // Usar la acción deletePost importada del slice
      return dispatch(deletePost(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Normalizar un post para garantizar consistencia
   * 
   * @param {Object} post - Post a normalizar
   * @returns {Object} - Post normalizado
   */
  const normalizePost = useCallback((post) => {
    if (!post) return null;
    
    return {
      ...post,
      id: post.id_post || post.id || null,
      id_post: post.id_post || post.id || null,
      website_id: post.website_id || (selectedWebsite ? selectedWebsite.id : null),
      titulo: post.titulo || "",
      contenido: post.contenido || "",
      estado: post.estado || "draft",
      id_categoria: post.id_categoria || post.categoria_id || null,
      imagen_destacada: post.imagen_destacada || "",
      autor: post.autor || "",
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || new Date().toISOString()
    };
  }, [selectedWebsite]);
  
  /**
   * Normalizar una lista de posts
   * 
   * @param {Array} postList - Lista de posts a normalizar
   * @returns {Array} - Lista de posts normalizada
   */
  const normalizePosts = useCallback((postList = []) => {
    if (!Array.isArray(postList)) return [];
    return postList.map(normalizePost);
  }, [normalizePost]);
  
  return {
    // Datos
    posts, 
    loading, 
    error,
    searchQuery,
    sortConfig,
    filters,
    pagination,
    selectedWebsite,
    
    // Getters con filtros y ordenación
    getFilteredPosts,
    getSortedPosts,
    
    // Setters para filtros, ordenación y paginación
    setSearchQuery,
    requestSort,
    applyFilters,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    
    // Operaciones CRUD
    fetchPosts,
    createPost: handleCreate,
    updatePost: handleUpdate,
    deletePost: handleDelete,
    
    // Utilidades
    normalizePost,
    normalizePosts
  };
}