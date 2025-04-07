import Swal from "sweetalert2";
import api, { getDevelopmentMode } from "./api";

// Datos de ejemplo para modo de desarrollo
const fakeSubsubcategories = [
  { id_sub_sub_categoria: 1, nombre: "JavaScript", id_sub_categoria: 1 },
  { id_sub_sub_categoria: 2, nombre: "Python", id_sub_categoria: 1 },
  { id_sub_sub_categoria: 3, nombre: "Laptops", id_sub_categoria: 2 },
  { id_sub_sub_categoria: 4, nombre: "Dietas", id_sub_categoria: 3 },
  { id_sub_sub_categoria: 5, nombre: "SEO On-Page", id_sub_categoria: 5 },
  { id_sub_sub_categoria: 6, nombre: "SEO Off-Page", id_sub_categoria: 5 },
];

// 🔹 Obtener Sub-subcategorías
export const fetchSubsubcategories = async () => {
  // Usamos la función global para determinar el modo
  if (getDevelopmentMode()) {
    return new Promise((resolve) =>
      // Devolvemos una copia para evitar problemas de referencia
      setTimeout(() => resolve([...fakeSubsubcategories]), 500)
    );
  }

  try {
    const response = await fetch("https://dev.agencia.dimap.es/api/cms/subsubcategorias", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) throw new Error("Error al obtener sub-subcategorías");
    
    const data = await response.json();
    return data.data || []; // Devolvemos array vacío si no hay datos para evitar errores

  } catch (error) {
    console.error("Error fetching subsubcategories:", error);
    // No mostramos el Swal aquí para permitir un manejo más flexible en el componente
    return []; // Devolvemos array vacío en caso de error para evitar errores en UI
  }
};

// 🔹 Crear Sub-subcategoría
export const addSubsubcategory = async (data) => {
  // Usamos la función global para determinar el modo
  if (getDevelopmentMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id_sub_sub_categoria: Date.now(), 
        nombre: data.nombre || data.name,
        id_sub_categoria: data.id_sub_categoria || data.subcategoria_id
      }), 500)
    );
  }

  try {
    // Asegurarnos que enviamos los campos correctos al backend
    const requestData = {
      nombre: data.nombre || data.name,
      id_sub_categoria: data.id_sub_categoria || data.subcategoria_id
    };

    const response = await fetch("https://dev.agencia.dimap.es/api/cms/subsubcategorias", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh") 
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al crear sub-subcategoría");
    
    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error("Error creating subsubcategory:", error);
    throw new Error(error.message || "Error al crear sub-subcategoría");
  }
};

// 🔹 Editar Sub-subcategoría
export const updateSubsubcategory = async (id, data) => {
  // Usamos la función global para determinar el modo
  if (getDevelopmentMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id_sub_sub_categoria: id, 
        nombre: data.nombre || data.name,
        id_sub_categoria: data.id_sub_categoria || data.subcategoria_id
      }), 500)
    );
  }

  try {
    // Solo actualizamos el nombre, no la subcategoría padre
    const requestData = {
      nombre: data.nombre || data.name
    };

    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/subsubcategorias/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al actualizar sub-subcategoría");
    
    const result = await response.json();
    return result.data || { 
      id_sub_sub_categoria: id, 
      ...requestData,
      id_sub_categoria: data.id_sub_categoria || data.subcategoria_id 
    };

  } catch (error) {
    console.error("Error updating subsubcategory:", error);
    throw new Error(error.message || "Error al actualizar sub-subcategoría");
  }
};

// 🔹 Eliminar Sub-subcategoría
export const removeSubsubcategory = async (id) => {
  // Usamos la función global para determinar el modo
  if (getDevelopmentMode()) {
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  try {
    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/subsubcategorias/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
    });

    if (!response.ok) throw new Error("Error al eliminar sub-subcategoría");
    return true;
  } catch (error) {
    console.error("Error deleting subsubcategory:", error);
    throw new Error(error.message || "Error al eliminar sub-subcategoría");
  }
};
