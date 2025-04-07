import api, { getDevelopmentMode } from "./api";

// Datos de ejemplo para modo de desarrollo
const fakeConversions = [
  { 
    id: 1,
    name: "Formulario de contacto",
    description: "Envío del formulario de contacto",
    counter: 145,
    value: 10,
    website_id: 1,
    unique_code: "contact_form",
    created_at: "2024-03-15T12:30:45Z",
    updated_at: "2024-04-01T09:15:22Z",
    active: true
  },
  { 
    id: 2,
    name: "Registro newsletter",
    description: "Registro en la newsletter",
    counter: 284,
    value: 5,
    website_id: 1,
    unique_code: "newsletter_signup",
    created_at: "2024-03-15T12:35:10Z",
    updated_at: "2024-04-01T09:16:30Z",
    active: true
  },
  { 
    id: 3,
    name: "Compra completada",
    description: "El usuario completa una compra",
    counter: 67,
    value: 50,
    website_id: 1,
    unique_code: "purchase_complete",
    created_at: "2024-03-16T10:20:15Z",
    updated_at: "2024-04-01T09:17:45Z",
    active: true
  },
  { 
    id: 4,
    name: "Solicitud de demo",
    description: "El usuario solicita una demostración",
    counter: 52,
    value: 30,
    website_id: 1,
    unique_code: "demo_request",
    created_at: "2024-03-17T14:45:30Z",
    updated_at: "2024-04-01T09:18:20Z",
    active: true
  },
  { 
    id: 5,
    name: "Solicitud de presupuesto",
    description: "El usuario solicita un presupuesto personalizado",
    counter: 98,
    value: 25,
    website_id: 2,
    unique_code: "quote_request",
    created_at: "2024-03-18T09:10:25Z",
    updated_at: "2024-04-01T09:19:05Z",
    active: true
  }
];

// 🔹 Obtener conversiones
export const fetchConversions = async (websiteId = null) => {
  // Usamos el estado global para determinar el modo
  const isDevMode = getDevelopmentMode();
  
  // En modo desarrollo, devolvemos datos de ejemplo
  if (isDevMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Si se proporciona un websiteId, filtramos por él
        const filteredConversions = websiteId 
          ? fakeConversions.filter(conv => conv.website_id === websiteId)
          : [...fakeConversions];
          
        resolve(filteredConversions);
      }, 500);
    });
  }

  // En modo real, conectamos con la API
  try {
    const params = {};
    if (websiteId) {
      params.website_id = websiteId;
    }

    const response = await api.get("/conversions", { params });
    
    // Devolvemos un array vacío si no hay datos
    if (!response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching conversions:", error);
    throw new Error(error.response?.data?.message || "Error al obtener conversiones");
  }
};

// 🔹 Crear conversión
export const addConversion = async (data) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversion = {
          id: fakeConversions.length + 1,
          counter: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          active: true,
          ...data
        };
        
        fakeConversions.push(newConversion);
        resolve({...newConversion});
      }, 500);
    });
  }

  // En modo real
  try {
    const response = await api.post("/conversions", data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating conversion:", error);
    throw new Error(error.response?.data?.message || "Error al crear conversión");
  }
};

// 🔹 Editar conversión
export const updateConversion = async (id, data) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = fakeConversions.findIndex(conv => conv.id === parseInt(id));
        
        if (index === -1) {
          reject(new Error("Conversión no encontrada"));
          return;
        }
        
        // Caso especial para incrementar el contador
        if (data.increment !== undefined) {
          fakeConversions[index].counter += data.increment;
          fakeConversions[index].updated_at = new Date().toISOString();
          resolve({...fakeConversions[index]});
          return;
        }
        
        // Actualización normal
        const updatedConversion = {
          ...fakeConversions[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        fakeConversions[index] = updatedConversion;
        resolve({...updatedConversion});
      }, 500);
    });
  }

  // En modo real
  try {
    // Manejo especial para incrementar
    if (data.increment !== undefined) {
      const response = await api.patch(`/conversions/${id}/increment`, { 
        value: data.increment
      });
      return response.data.data;
    }
    
    // Actualización normal
    const response = await api.patch(`/conversions/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating conversion:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar conversión");
  }
};

// 🔹 Eliminar conversión
export const removeConversion = async (id) => {
  // En modo desarrollo
  if (getDevelopmentMode()) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = fakeConversions.findIndex(conv => conv.id === parseInt(id));
        
        if (index === -1) {
          reject(new Error("Conversión no encontrada"));
          return;
        }
        
        fakeConversions.splice(index, 1);
        resolve(true);
      }, 500);
    });
  }

  // En modo real
  try {
    await api.delete(`/conversions/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting conversion:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar conversión");
  }
};