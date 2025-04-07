/**
 * Función de emergencia para forzar la carga de la web de Cejusticia
 * Esta función debe ejecutarse desde la consola del navegador
 */
export const fixWebsites = () => {
  // Datos de la web de Cejusticia (basados en la respuesta de la API)
  const cejusticiaWeb = {
    id: 1,
    id_website: 1,
    name: "Cejusticia",
    url: "https://cejusticia.es",
    logo: "",
    description: "Cejustica",
    status: "active",
    api_key_analytics: "",
    token1_analytics: "",
    token2_analytics: "",
    api_key_googleAds: "",
    token1_googleAds: "",
    token2_googleAds: "",
    developer_token_googleAds: "",
    user_id: null,
    createdAt: "2025-04-03T22:39:47.000Z",
    updatedAt: "2025-04-03T22:39:47.000Z",
    owner: null
  };

  // Obtener el store de Redux
  const store = window.store;
  
  if (!store) {
    console.error('Redux store no disponible. Asegúrate de estar en modo desarrollo.');
    return false;
  }
  
  try {
    // Dispatch para cargar la web en el estado
    store.dispatch({
      type: 'websites/load/fulfilled',
      payload: [cejusticiaWeb]
    });
    
    console.log('🎉 Web de Cejusticia cargada manualmente en el estado de Redux');
    console.log('Estado actual de webs:', store.getState().websites.websites);
    
    // Opcionalmente, también seleccionar la web
    const seleccionar = confirm('¿Quieres seleccionar la web de Cejusticia como web activa?');
    
    if (seleccionar) {
      store.dispatch({
        type: 'websites/selectWebsite',
        payload: cejusticiaWeb
      });
      
      console.log('🎉 Web de Cejusticia seleccionada como web activa');
    }
    
    return true;
  } catch (error) {
    console.error('Error al intentar cargar manualmente la web:', error);
    return false;
  }
};

// Exportar la función para que pueda ser importada
export default fixWebsites;

// Exponer la función en window para poder ejecutarla desde la consola
if (process.env.NODE_ENV !== 'production') {
  window.fixWebsites = fixWebsites;
  console.log('Función de emergencia lista. Ejecuta window.fixWebsites() en la consola para arreglar las webs.');
}
