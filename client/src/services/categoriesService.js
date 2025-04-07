import Swal from "sweetalert2";

const modoEjemplo = true; // Cambia a `false` para conectar con API real

// Datos de ejemplo para modo de desarrollo
const fakeCategories = [
  { id: 1, nombre: "Tecnología" },
  { id: 2, nombre: "Salud" },
  { id: 3, nombre: "Negocios" },
  { id: 4, nombre: "Marketing Digital" },
  { id: 5, nombre: "Desarrollo Web" },
];

// 🔹 Obtener Categorías
export const fetchCategories = async () => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(fakeCategories), 500)
    );
  }

  try {
    const response = await fetch("https://dev.agencia.dimap.es/api/cms/categorias", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) throw new Error("Error al obtener categorías");
    
    const data = await response.json();
    return data.data || []; // Ajustar según formato de respuesta de la API

  } catch (error) {
    console.error("Error fetching categories:", error);
    Swal.fire("Error", error.message, "error");
    return [];
  }
};

// 🔹 Crear Categoría
export const addCategory = async (data) => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id: Date.now(), 
        nombre: data.nombre || data.name // Asegurarnos que tenemos el campo nombre
      }), 500)
    );
  }

  try {
    // Asegurarnos que enviamos el campo correcto al backend
    const requestData = {
      nombre: data.nombre || data.name
    };

    const response = await fetch("https://dev.agencia.dimap.es/api/cms/categorias", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh") 
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al crear categoría");
    
    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error("Error creating category:", error);
    Swal.fire("Error", error.message, "error");
    return null;
  }
};

// 🔹 Editar Categoría
export const updateCategory = async (id, data) => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id, 
        nombre: data.nombre || data.name
      }), 500)
    );
  }

  try {
    // Asegurarnos que enviamos el campo correcto al backend
    const requestData = {
      nombre: data.nombre || data.name
    };

    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/categorias/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al actualizar categoría");
    
    const result = await response.json();
    return result.data || { id, ...requestData };

  } catch (error) {
    console.error("Error updating category:", error);
    Swal.fire("Error", error.message, "error");
    return null;
  }
};

// 🔹 Eliminar Categoría
export const removeCategory = async (id) => {
  if (modoEjemplo) {
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  try {
    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/categorias/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
    });

    if (!response.ok) throw new Error("Error al eliminar categoría");
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    Swal.fire("Error", error.message, "error");
    return false;
  }
};
