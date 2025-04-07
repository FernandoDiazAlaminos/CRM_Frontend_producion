import Swal from "sweetalert2";
import api, { getDevelopmentMode } from "./api";

// Datos de ejemplo para modo de desarrollo
const fakePosts = [
  { 
    id_post: 1, 
    titulo: "Introducción a JavaScript", 
    contenido: "JavaScript es un lenguaje de programación...",
    categoria_id: 1,
    createdAt: "2023-10-15T14:30:00Z",
    updatedAt: "2023-10-16T09:15:00Z"
  },
  { 
    id_post: 2, 
    titulo: "Nutrición y Salud", 
    contenido: "Una buena nutrición es esencial para...",
    categoria_id: 2,
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2023-10-10T10:00:00Z"
  },
  { 
    id_post: 3, 
    titulo: "Marketing Digital en 2023", 
    contenido: "Las tendencias de marketing digital...",
    categoria_id: 3,
    createdAt: "2023-09-28T16:45:00Z",
    updatedAt: "2023-10-05T11:20:00Z"
  },
  { 
    id_post: 4, 
    titulo: "Mejores Prácticas SEO", 
    contenido: "Para mejorar el posicionamiento de tu sitio web...",
    categoria_id: 4,
    createdAt: "2023-09-15T08:30:00Z",
    updatedAt: "2023-09-20T14:10:00Z"
  },
  { 
    id_post: 5, 
    titulo: "Desarrollo Web Moderno", 
    contenido: "Las herramientas y frameworks más utilizados...",
    categoria_id: 5,
    createdAt: "2023-08-22T13:15:00Z",
    updatedAt: "2023-09-01T09:45:00Z"
  }
];

// 🔹 Obtener Posts
export const fetchPosts = async (token) => {
  // Usamos el estado global para determinar el modo
  if (getDevelopmentMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...fakePosts]), 500) // Devolvemos una copia para evitar problemas de referencia
    );
  }

  try {
    const response = await api.get("/cms/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Devolvemos un array vacío si no hay datos
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Devolvemos array vacío en caso de error para evitar errores en UI
  }
};

// 🔹 Obtener Post por ID
export const fetchPostById = async (id, token) => {
  // Usamos el estado global para determinar el modo
  if (getDevelopmentMode()) {
    const post = fakePosts.find(p => p.id_post === parseInt(id));
    return new Promise((resolve) =>
      setTimeout(() => resolve(post ? {...post} : null), 500) // Devolvemos una copia para evitar problemas de referencia
    );
  }

  try {
    const response = await api.get(`/cms/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data || !response.data.data) {
      return null;
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

// 🔹 Crear Post
export const addPost = async (data, token) => {
  // Usamos el estado global para determinar el modo
  if (getDevelopmentMode()) {
    const now = new Date().toISOString();
    const newPost = { 
      id_post: Date.now(), 
      titulo: data.titulo || data.title,
      contenido: data.contenido || data.content,
      categoria_id: data.categoria_id || data.category_id,
      createdAt: now,
      updatedAt: now
    };
    fakePosts.push(newPost);
    return new Promise((resolve) =>
      setTimeout(() => resolve({...newPost}), 500) // Devolvemos una copia para evitar problemas de referencia
    );
  }

  try {
    const response = await api.post("/cms/posts", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data || !response.data.data) {
      throw new Error("Error al crear post");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error(error.response?.data?.message || "Error al crear post");
  }
};

// 🔹 Editar Post
export const updatePost = async (id, data, token) => {
  // Usamos el estado global para determinar el modo
  if (getDevelopmentMode()) {
    const index = fakePosts.findIndex(p => p.id_post === parseInt(id));
    if (index !== -1) {
      const now = new Date().toISOString();
      const updatedPost = { 
        ...fakePosts[index],
        ...data,
        updatedAt: now
      };
      fakePosts[index] = updatedPost;
      return new Promise((resolve) =>
        setTimeout(() => resolve({...updatedPost}), 500) // Devolvemos una copia para evitar problemas de referencia
      );
    }
    throw new Error("Post no encontrado");
  }

  try {
    const response = await api.patch(`/cms/posts/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data || !response.data.data) {
      throw new Error("Error al actualizar post");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar post");
  }
};

// 🔹 Eliminar Post
export const removePost = async (id, token) => {
  // Usamos el estado global para determinar el modo
  if (getDevelopmentMode()) {
    const index = fakePosts.findIndex(p => p.id_post === parseInt(id));
    if (index !== -1) {
      fakePosts.splice(index, 1);
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    }
    throw new Error("Post no encontrado");
  }

  try {
    await api.delete(`/cms/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar post");
  }
};
