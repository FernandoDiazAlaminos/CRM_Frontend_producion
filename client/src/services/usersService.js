import api, { getDevelopmentMode } from "./api";

// Datos de ejemplo para modo de desarrollo
const fakeUsers = [
  { 
    id: 1, 
    id_user: 1,
    name: "Juan", 
    sur_name: "Pérez", 
    email: "juan@example.com", 
    role: "admin",
    dni: "12345678A",
    name_empresa: "DIMAP Solutions"
  },
  { 
    id: 2, 
    id_user: 2,
    name: "María", 
    sur_name: "López", 
    email: "maria@example.com", 
    role: "user",
    dni: "87654321B",
    name_empresa: "Marketing Digital"
  },
  { 
    id: 3, 
    id_user: 3,
    name: "Carlos", 
    sur_name: "Ramírez", 
    email: "carlos@example.com", 
    role: "editor",
    dni: "11223344C",
    name_empresa: "Diseño Gráfico"
  }
];

// 🔹 Obtener Usuarios
export const fetchUsers = async () => {
  // Usamos el estado global para determinar el modo
  const isDevMode = getDevelopmentMode();
  
  // En modo desarrollo, devolvemos datos de ejemplo
  if (isDevMode) {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...fakeUsers]), 500) // Devolvemos una copia para evitar problemas de referencia
    );
  }

  // En modo real, conectamos con la API
  try {
    const response = await api.get("/auth");
    
    // Devolvemos un array vacío si no hay datos
    if (!response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }
    
    // Normalizar los datos
    const normalizedData = response.data.data.map(user => ({
      ...user,
      id: user.id_user // Aseguramos que tenemos un id uniforme
    }));
    
    return normalizedData;
  } catch (error) {
    console.error("Error fetching users:", error);
    // En caso de error, devolvemos un array vacío
    return [];
  }
};

// 🔹 Crear Usuario
export const addUser = async (data) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    const newUser = { 
      id: fakeUsers.length + 1, 
      id_user: fakeUsers.length + 1,
      ...data,
      // Asegurar que los nombres de campos estén consistentes
      sur_name: data.sur_name || data.surName,
      name_empresa: data.name_empresa || data.nombreEmpresa
    };
    fakeUsers.push(newUser);
    return new Promise((resolve) =>
      setTimeout(() => resolve({...newUser}), 500)
    );
  }

  // En modo real
  try {
    // Ajustamos los datos al formato que espera el backend
    const requestData = {
      name: data.name,
      sur_name: data.sur_name || data.surName,
      email: data.email,
      password: data.password || "password123", // Valor por defecto para testing
      dni: data.dni,
      name_empresa: data.name_empresa || data.nombreEmpresa,
      role: data.role
    };

    const response = await api.post("/auth/signup", requestData);
    // Añadimos un id para mantener consistencia
    return {
      ...response.data.data,
      id: response.data.data.id_user
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.response?.data?.message || "Error al crear usuario");
  }
};

// 🔹 Editar Usuario
export const updateUser = async (id, data) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    const index = fakeUsers.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      const updatedUser = { 
        ...fakeUsers[index],
        ...data,
        // Asegurar que los nombres de campos estén consistentes
        sur_name: data.sur_name || data.surName || fakeUsers[index].sur_name,
        name_empresa: data.name_empresa || data.nombreEmpresa || fakeUsers[index].name_empresa
      };
      fakeUsers[index] = updatedUser;
      return new Promise((resolve) =>
        setTimeout(() => resolve({...updatedUser}), 500)
      );
    }
    throw new Error("Usuario no encontrado");
  }

  // En modo real
  try {
    // Ajustamos los datos al formato que espera el backend
    const requestData = {};
    
    if (data.name) requestData.name = data.name;
    if (data.sur_name || data.surName) requestData.sur_name = data.sur_name || data.surName;
    if (data.email) requestData.email = data.email;
    if (data.password) requestData.password = data.password;
    if (data.name_empresa || data.nombreEmpresa) requestData.name_empresa = data.name_empresa || data.nombreEmpresa;
    if (data.role) requestData.role = data.role;

    const response = await api.patch(`/auth/${id}`, requestData);
    // Añadimos un id para mantener consistencia
    return {
      ...response.data.data,
      id: response.data.data.id_user
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar usuario");
  }
};

// 🔹 Eliminar Usuario
export const removeUser = async (id) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    const index = fakeUsers.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      fakeUsers.splice(index, 1);
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    }
    throw new Error("Usuario no encontrado");
  }

  // En modo real
  try {
    await api.delete(`/auth/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar usuario");
  }
};
