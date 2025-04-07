import { get, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeAnalyticsData = {
  overview: {
    sessions: 8427,
    users: 5102,
    pageviews: 21547,
    avgSessionDuration: 185, // en segundos
    bounceRate: 42.3, // porcentaje
    sessionsGrowth: 12.7, // porcentaje de crecimiento respecto al periodo anterior
    usersGrowth: 8.4,
    pageviewsGrowth: 15.2
  },
  visitors: {
    trends: [
      { date: "01/03", sessions: 280, users: 190 },
      { date: "02/03", sessions: 250, users: 180 },
      { date: "03/03", sessions: 310, users: 230 },
      { date: "04/03", sessions: 340, users: 250 },
      { date: "05/03", sessions: 390, users: 270 },
      { date: "06/03", sessions: 320, users: 240 },
      { date: "07/03", sessions: 290, users: 210 },
      { date: "08/03", sessions: 360, users: 280 },
      { date: "09/03", sessions: 380, users: 290 },
      { date: "10/03", sessions: 410, users: 310 },
      { date: "11/03", sessions: 370, users: 290 },
      { date: "12/03", sessions: 350, users: 270 },
      { date: "13/03", sessions: 320, users: 240 },
      { date: "14/03", sessions: 290, users: 210 }
    ],
    devices: [
      { name: "Desktop", value: 58 },
      { name: "Mobile", value: 36 },
      { name: "Tablet", value: 6 }
    ],
    browsers: [
      { name: "Chrome", value: 64 },
      { name: "Safari", value: 18 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 7 },
      { name: "Others", value: 3 }
    ],
    countries: [
      { name: "España", value: 72 },
      { name: "México", value: 8 },
      { name: "Colombia", value: 5 },
      { name: "Argentina", value: 4 },
      { name: "Chile", value: 3 },
      { name: "Otros", value: 8 }
    ]
  },
  trafficSources: {
    channels: [
      { name: "Orgánico", value: 42 },
      { name: "Directo", value: 28 },
      { name: "Social", value: 15 },
      { name: "Referral", value: 8 },
      { name: "Paid Search", value: 7 }
    ],
    socialNetworks: [
      { name: "Facebook", value: 52 },
      { name: "Instagram", value: 26 },
      { name: "LinkedIn", value: 12 },
      { name: "Twitter", value: 8 },
      { name: "Pinterest", value: 2 }
    ],
    referrals: [
      { name: "example.com", visits: 342, bounceRate: 38.2 },
      { name: "partner-site.com", visits: 218, bounceRate: 42.7 },
      { name: "forum.com", visits: 187, bounceRate: 45.1 },
      { name: "blog.example.org", visits: 154, bounceRate: 35.8 },
      { name: "news-site.com", visits: 126, bounceRate: 40.2 }
    ]
  },
  pagePerformance: [
    { path: "/", pageviews: 4821, avgTimeOnPage: 72, bounceRate: 38.6, exitRate: 22.3 },
    { path: "/productos", pageviews: 2634, avgTimeOnPage: 94, bounceRate: 32.7, exitRate: 18.5 },
    { path: "/contacto", pageviews: 1872, avgTimeOnPage: 65, bounceRate: 45.2, exitRate: 62.7 },
    { path: "/blog", pageviews: 1685, avgTimeOnPage: 105, bounceRate: 28.9, exitRate: 15.2 },
    { path: "/sobre-nosotros", pageviews: 1247, avgTimeOnPage: 88, bounceRate: 34.3, exitRate: 24.8 },
    { path: "/servicios", pageviews: 1108, avgTimeOnPage: 76, bounceRate: 36.8, exitRate: 21.5 },
    { path: "/blog/post-1", pageviews: 876, avgTimeOnPage: 132, bounceRate: 22.6, exitRate: 18.9 },
    { path: "/tienda", pageviews: 845, avgTimeOnPage: 112, bounceRate: 26.4, exitRate: 14.7 }
  ],
  conversions: {
    conversionRate: 3.8,
    conversionGrowth: 0.7,
    goals: [
      { name: "Formulario de contacto", completions: 287, conversionRate: 4.2, value: 8610 },
      { name: "Newsletter", completions: 542, conversionRate: 6.8, value: 2710 },
      { name: "Compra", completions: 126, conversionRate: 1.9, value: 12600 },
      { name: "Demo", completions: 93, conversionRate: 1.2, value: 4650 }
    ],
    trends: [
      { date: "01/03", conversions: 24 },
      { date: "02/03", conversions: 22 },
      { date: "03/03", conversions: 27 },
      { date: "04/03", conversions: 30 },
      { date: "05/03", conversions: 34 },
      { date: "06/03", conversions: 28 },
      { date: "07/03", conversions: 25 },
      { date: "08/03", conversions: 32 },
      { date: "09/03", conversions: 33 },
      { date: "10/03", conversions: 36 },
      { date: "11/03", conversions: 31 },
      { date: "12/03", conversions: 29 },
      { date: "13/03", conversions: 27 },
      { date: "14/03", conversions: 24 }
    ]
  }
};

// Datos simulados para Google Ads
const fakeAdsData = [
  {
    id: "1234567890",
    campaign: "Productos Destacados",
    status: "Activa",
    budget: 50,
    spent: 42.35,
    impressions: 12845,
    clicks: 427,
    ctr: 3.32,
    cpc: 0.98,
    conversions: 18,
    conversionRate: 4.21,
    costPerConversion: 23.52,
    roi: 342
  },
  {
    id: "2345678901",
    campaign: "Servicios Premium",
    status: "Activa",
    budget: 75,
    spent: 68.92,
    impressions: 18426,
    clicks: 734,
    ctr: 3.98,
    cpc: 0.94,
    conversions: 29,
    conversionRate: 3.95,
    costPerConversion: 23.76,
    roi: 287
  },
  {
    id: "3456789012",
    campaign: "Marca",
    status: "Activa",
    budget: 40,
    spent: 36.45,
    impressions: 25872,
    clicks: 621,
    ctr: 2.40,
    cpc: 0.59,
    conversions: 15,
    conversionRate: 2.42,
    costPerConversion: 24.30,
    roi: 195
  },
  {
    id: "4567890123",
    campaign: "Remarketing",
    status: "Activa",
    budget: 30,
    spent: 28.76,
    impressions: 8426,
    clicks: 538,
    ctr: 6.38,
    cpc: 0.53,
    conversions: 27,
    conversionRate: 5.02,
    costPerConversion: 10.65,
    roi: 486
  },
  {
    id: "5678901234",
    campaign: "Promoción Especial",
    status: "Pausada",
    budget: 60,
    spent: 45.23,
    impressions: 15487,
    clicks: 498,
    ctr: 3.21,
    cpc: 0.91,
    conversions: 21,
    conversionRate: 4.22,
    costPerConversion: 21.54,
    roi: 312
  }
];

/**
 * Obtener datos de analytics
 * @param {number} websiteId - ID del sitio web
 * @param {string|Date} startDate - Fecha inicial
 * @param {string|Date} endDate - Fecha final
 * @returns {Promise} - Promise con los datos de analytics
 */
export const getAnalyticsData = async (websiteId, startDate, endDate) => {
  if (getDevelopmentMode()) {
    // En desarrollo, devolvemos datos simulados
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            status: 'success',
            data: { ...fakeAnalyticsData }
          }
        });
      }, 800);
    });
  }
  
  // Formatear las fechas si son objetos Date
  const formattedStartDate = startDate instanceof Date 
    ? startDate.toISOString().split('T')[0] 
    : startDate;
  
  const formattedEndDate = endDate instanceof Date 
    ? endDate.toISOString().split('T')[0] 
    : endDate;
  
  // Construir la URL de la API
  let endpoint = '/analytics';
  let params = [];
  
  if (websiteId) params.push(`website_id=${websiteId}`);
  if (formattedStartDate) params.push(`start_date=${formattedStartDate}`);
  if (formattedEndDate) params.push(`end_date=${formattedEndDate}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener datos de Google Ads
 * @param {number} websiteId - ID del sitio web
 * @param {string|Date} startDate - Fecha inicial
 * @param {string|Date} endDate - Fecha final
 * @returns {Promise} - Promise con los datos de ads
 */
export const getAdsData = async (websiteId, startDate, endDate) => {
  if (getDevelopmentMode()) {
    // En desarrollo, devolvemos datos simulados
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            status: 'success',
            data: [...fakeAdsData]
          }
        });
      }, 1000);
    });
  }
  
  // Formatear las fechas si son objetos Date
  const formattedStartDate = startDate instanceof Date 
    ? startDate.toISOString().split('T')[0] 
    : startDate;
  
  const formattedEndDate = endDate instanceof Date 
    ? endDate.toISOString().split('T')[0] 
    : endDate;
  
  // Construir la URL de la API
  let endpoint = '/ads';
  let params = [];
  
  if (websiteId) params.push(`website_id=${websiteId}`);
  if (formattedStartDate) params.push(`start_date=${formattedStartDate}`);
  if (formattedEndDate) params.push(`end_date=${formattedEndDate}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return get(endpoint);
};

// Exportar servicio completo
export default {
  getAnalyticsData,
  getAdsData
};
