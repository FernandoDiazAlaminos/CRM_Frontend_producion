import { getDevelopmentMode } from '../services/api';
/**
 * Función para verificar si un sitio web tiene las credenciales necesarias para Analytics
 * @param {Object} website - Objeto del sitio web
 * @returns {boolean} - True si tiene las credenciales, false si no
 */
export const hasAnalyticsCredentials = (website) => {
  // En modo desarrollo, siempre devolver true
  try {
    // Obtener el estado directamente del localStorage para asegurar que es el más actualizado
    const isDevelopmentMode = localStorage.getItem('apiMode') === 'true';
    if (isDevelopmentMode) {
      return true;
    }
  } catch (error) {
    console.error('Error al verificar modo de desarrollo:', error);
  }
  
  if (!website) return false;
  
  return Boolean(
    website.api_key_analytics && 
    website.token1_analytics && 
    website.token2_analytics
  );
};

/**
 * Función para verificar si un sitio web tiene las credenciales necesarias para Google Ads
 * @param {Object} website - Objeto del sitio web
 * @returns {boolean} - True si tiene las credenciales, false si no
 */
export const hasGoogleAdsCredentials = (website) => {
  // En modo desarrollo, siempre devolver true
  try {
    // Obtener el estado directamente del localStorage para asegurar que es el más actualizado
    const isDevelopmentMode = localStorage.getItem('apiMode') === 'true';
    if (isDevelopmentMode) {
      return true;
    }
  } catch (error) {
    console.error('Error al verificar modo de desarrollo:', error);
  }
  
  if (!website) return false;
  
  return Boolean(
    website.api_key_googleAds && 
    website.token1_googleAds && 
    website.token2_googleAds &&
    website.developer_token_googleAds
  );
};

/**
 * Función para mostrar información sobre el estado de integración de un sitio web
 * @param {Object} website - Objeto del sitio web
 * @returns {Object} - Objeto con información sobre la integración
 */
export const getIntegrationStatus = (website) => {
  // En modo desarrollo, siempre reportar como integrado
  try {
    // Obtener el estado directamente del localStorage para asegurar que es el más actualizado
    const isDevelopmentMode = localStorage.getItem('apiMode') === 'true';
    if (isDevelopmentMode) {
      return {
        hasAnalytics: true,
        hasGoogleAds: true,
        message: 'Modo de prueba activo - mostrando datos de ejemplo'
      };
    }
  } catch (error) {
    console.error('Error al verificar modo de desarrollo:', error);
  }
  
  if (!website) {
    return {
      hasAnalytics: false,
      hasGoogleAds: false,
      message: 'No hay un sitio web seleccionado'
    };
  }
  
  const hasAnalytics = hasAnalyticsCredentials(website);
  const hasGoogleAds = hasGoogleAdsCredentials(website);
  
  let message = '';
  
  if (hasAnalytics && hasGoogleAds) {
    message = 'Sitio web completamente integrado con Analytics y Google Ads';
  } else if (hasAnalytics) {
    message = 'Sitio web integrado con Analytics, pero no con Google Ads';
  } else if (hasGoogleAds) {
    message = 'Sitio web integrado con Google Ads, pero no con Analytics';
  } else {
    message = 'Sitio web sin integraciones configuradas';
  }
  
  return {
    hasAnalytics,
    hasGoogleAds,
    message
  };
};
