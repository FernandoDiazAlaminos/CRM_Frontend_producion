import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { loadDashboardData } from "../../redux/slices/dashboardSlice";
import { loadAnalyticsData, loadAdsData } from "../../redux/slices/analyticsSlice";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";
import { hasAnalyticsCredentials, hasGoogleAdsCredentials } from "../../utils/analyticsHelper";

// Componentes modularizados
import {
  DashboardHeader,
  AnalyticsOverview,
  AdsPerformance,
  TrafficSources,
  VisitorMetrics,
  PagePerformance,
  ConversionMetrics,
  DateRangePicker
} from "./components";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, posts, users, loading } = useSelector((state) => state.dashboard);
  const { analyticsData, adsData, analyticsLoading, adsLoading } = useSelector((state) => state.analytics);
  const { selectedWebsite } = useSelector((state) => state.websites);
  const { isDevelopmentMode, lastChanged } = useSelector((state) => state.apiMode);
  
  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
    endDate: new Date()
  });

  // Estado para mostrar alertas sobre integraciones no configuradas
  const [integrationWarnings, setIntegrationWarnings] = useState({
    analytics: false,
    googleAds: false
  });

  useEffect(() => {
    if (selectedWebsite) {
      // Cargar datos básicos del dashboard
      dispatch(loadDashboardData(selectedWebsite.id));
      
      // Verificar integraciones
      const hasAnalytics = hasAnalyticsCredentials(selectedWebsite);
      const hasGoogleAds = hasGoogleAdsCredentials(selectedWebsite);
      
      setIntegrationWarnings({
        analytics: !hasAnalytics,
        googleAds: !hasGoogleAds
      });
      
      // Cargar datos de analytics y ads (en modo desarrollo siempre se cargarán)
      dispatch(loadAnalyticsData({
        websiteId: selectedWebsite.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }));
      
      dispatch(loadAdsData({
        websiteId: selectedWebsite.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }));
    }
  }, [dispatch, selectedWebsite, dateRange]);

  // Efecto para recargar datos cuando cambia el modo API
  useEffect(() => {
    if (lastChanged && selectedWebsite) {
      // Recargar datos cuando cambia el modo API
      dispatch(loadDashboardData(selectedWebsite.id));
      dispatch(loadAnalyticsData({
        websiteId: selectedWebsite.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }));
      dispatch(loadAdsData({
        websiteId: selectedWebsite.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }));
      
      // Actualizar el estado de advertencias
      const hasAnalytics = hasAnalyticsCredentials(selectedWebsite);
      const hasGoogleAds = hasGoogleAdsCredentials(selectedWebsite);
      
      setIntegrationWarnings({
        analytics: !hasAnalytics,
        googleAds: !hasGoogleAds
      });
    }
  }, [lastChanged, dispatch, selectedWebsite, dateRange]);
  
  // Manejar cambio de rango de fechas
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Estado de carga combinado
  const isLoading = loading || analyticsLoading || adsLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Cabecera del Dashboard */}
      <DashboardHeader />
      
      <WebsiteAlert />

      {!selectedWebsite ? (
        <WebsiteRequired />
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin size-7 border-2 border-blue-600 rounded-full border-t-transparent"></div>
          <p className="ms-2 text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      ) : (
        <div>
          {/* Indicador de modo de desarrollo */}
          {isDevelopmentMode && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="size-4 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-sm font-medium text-blue-800">Modo de prueba activo</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>Estás viendo datos de ejemplo. Para ver datos reales, cambia al modo real desde el selector de modo en la barra lateral.</p>
                  </div>
                </div>
              </div>
            </div>
          )}          
          {/* Alertas de integración - solo mostrar en modo real */}
          {!isDevelopmentMode && integrationWarnings.analytics && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="size-4 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-sm font-medium text-amber-800">Integración con Google Analytics no configurada</h3>
                  <div className="mt-1 text-sm text-amber-700">
                    <p>Para ver datos reales de analytics, configura las credenciales de Google Analytics en la configuración del sitio web.</p>
                  </div>
                  <div className="mt-2">
                    <a href={`/my-websites?edit=${selectedWebsite.id}`} className="text-sm font-medium text-amber-800 hover:text-amber-600">Configurar ahora</a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isDevelopmentMode && integrationWarnings.googleAds && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="size-4 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-sm font-medium text-amber-800">Integración con Google Ads no configurada</h3>
                  <div className="mt-1 text-sm text-amber-700">
                    <p>Para ver datos reales de Google Ads, configura las credenciales en la configuración del sitio web.</p>
                  </div>
                  <div className="mt-2">
                    <a href={`/my-websites?edit=${selectedWebsite.id}`} className="text-sm font-medium text-amber-800 hover:text-amber-600">Configurar ahora</a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
          {/* Selector de rango de fechas */}
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange} 
          />

          {/* Resumen de Analytics */}
          <AnalyticsOverview data={analyticsData.overview} />
          
          {/* Métricas de visitantes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorMetrics data={analyticsData.visitors} />
            <TrafficSources data={analyticsData.trafficSources} />
          </div>
          
          {/* Rendimiento de páginas */}
          <PagePerformance data={analyticsData.pagePerformance} />
          
          {/* Métricas de conversión */}
          <ConversionMetrics data={analyticsData.conversions} />
          
          {/* Rendimiento de anuncios */}
          <AdsPerformance data={adsData} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
