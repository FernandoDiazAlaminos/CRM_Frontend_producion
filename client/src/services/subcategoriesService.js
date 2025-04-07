import Swal from "sweetalert2";

const modoEjemplo = true; // Cambia a `false` para conectar con API real

// Datos de ejemplo para modo de desarrollo
const fakeSubcategories = [
  { id: 1, nombre: "Programación", id_categoria: 1 },
  { id: 2, nombre: "Hardware", id_categoria: 1 },
  { id: 3, nombre: "Nutrición", id_categoria: 2 },
  { id: 4, nombre: "Marketing Digital", id_categoria: 3 },
  { id: 5, nombre: "SEO", id_categoria: 4 },
  { id: 6, nombre: "Redes Sociales", id_categoria: 4 },
];

// 🔹 Obtener Subcategorías
export const fetchSubcategories = async () => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(fakeSubcategories), 500)
    );
  }

  try {
    const response = await fetch("https://dev.agencia.dimap.es/api/cms/subcategorias", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) throw new Error("Error al obtener subcategorías");
    
    const data = await response.json();
    return data.data || []; // Ajustar según formato de respuesta de la API

  } catch (error) {
    console.error("Error fetching subcategories:", error);
    Swal.fire("Error", error.message, "error");
    return [];
  }
};

// 🔹 Crear Subcategoría
export const addSubcategory = async (data) => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id: Date.now(), 
        nombre: data.nombre || data.name,
        id_categoria: data.id_categoria || data.categoria_id
      }), 500)
    );
  }

  try {
    // Asegurarnos que enviamos los campos correctos al backend
    const requestData = {
      nombre: data.nombre || data.name,
      id_categoria: data.id_categoria || data.categoria_id
    };

    const response = await fetch("https://dev.agencia.dimap.es/api/cms/subcategorias", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh") 
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al crear subcategoría");
    
    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error("Error creating subcategory:", error);
    Swal.fire("Error", error.message, "error");
    return null;
  }
};

// 🔹 Editar Subcategoría
export const updateSubcategory = async (id, data) => {
  if (modoEjemplo) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        id, 
        nombre: data.nombre || data.name,
        id_categoria: data.id_categoria || data.categoria_id
      }), 500)
    );
  }

  try {
    // Solo actualizamos el nombre, no la categoría padre
    const requestData = {
      nombre: data.nombre || data.name
    };

    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/subcategorias/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Error al actualizar subcategoría");
    
    const result = await response.json();
    return result.data || { 
      id, 
      ...requestData,
      id_categoria: data.id_categoria || data.categoria_id 
    };

  } catch (error) {
    console.error("Error updating subcategory:", error);
    Swal.fire("Error", error.message, "error");
    return null;
  }
};

// 🔹 Eliminar Subcategoría
export const removeSubcategory = async (id) => {
  if (modoEjemplo) {
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  try {
    const response = await fetch(`https://dev.agencia.dimap.es/api/cms/subcategorias/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
        "token-refresh": localStorage.getItem("tokenRefresh")
      },
    });

    if (!response.ok) throw new Error("Error al eliminar subcategoría");
    return true;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    Swal.fire("Error", error.message, "error");
    return false;
  }
};
