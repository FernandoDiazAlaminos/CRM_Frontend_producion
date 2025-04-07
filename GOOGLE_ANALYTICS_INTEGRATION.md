# Integración con Google Analytics y Google Ads

Este documento describe la integración del dashboard DIMAP con Google Analytics y Google Ads para mostrar datos reales en el dashboard.

## Estructura de la Integración

### 1. Modelo de Datos

- Se han añadido nuevos campos al modelo `Website` para almacenar las credenciales:
  - `api_key_analytics`: API Key para Google Analytics
  - `token1_analytics`: Token primario de autenticación para Analytics
  - `token2_analytics`: Token secundario de autenticación para Analytics
  - `api_key_googleAds`: API Key para Google Ads
  - `token1_googleAds`: Token primario de autenticación para Google Ads
  - `token2_googleAds`: Token secundario de autenticación para Google Ads

### 2. Backend

- **Servicio de Integración:** `analyticsIntegration.js` maneja la comunicación con las APIs de Google
- **Controladores:** `analyticsController.js` expone endpoints para obtener datos de Google Analytics y Google Ads
- **Rutas API:** 
  - `/api/analytics` - Obtiene datos de Google Analytics
  - `/api/ads` - Obtiene datos de Google Ads

### 3. Frontend

- **Servicios:**
  - `analyticsService.js` - Realiza peticiones a los endpoints del backend
- **Utilidades:**
  - `analyticsHelper.js` - Proporciona funciones para verificar credenciales
- **Componentes:**
  - `Dashboard.jsx` - Actualizado para mostrar alertas si las credenciales no están configuradas

## Funcionamiento

1. **Flujo de datos:**
   - El usuario selecciona un sitio web en el selector de websites
   - El dashboard verifica si el sitio web tiene credenciales de Analytics y Google Ads configuradas
   - Si las credenciales están configuradas, se realizan peticiones a las APIs correspondientes
   - Si no están configuradas, se muestra una alerta al usuario indicando que debe configurarlas

2. **Obtención de datos de Analytics:**
   - Se utiliza la API de Google Analytics para obtener datos como:
     - Métricas generales (sesiones, usuarios, páginas vistas)
     - Tendencias diarias
     - Dispositivos
     - Navegadores
     - Países
     - Fuentes de tráfico
     - Redes sociales
     - Referencias de tráfico
     - Rendimiento de páginas

3. **Integración con Conversiones:**
   - Las conversiones creadas en el sistema se combinan con los datos de Analytics
   - Se calculan tasas de conversión basadas en el número de sesiones
   - Se muestran en el componente `ConversionMetrics`

4. **Obtención de datos de Google Ads:**
   - Se utiliza la API de Google Ads para obtener datos de campañas activas
   - Se muestran en el componente `AdsPerformance`

## Configuración de Credenciales

### Google Analytics

Para configurar la integración con Google Analytics, se necesitan los siguientes pasos:

1. Crear un proyecto en Google Cloud Platform
2. Habilitar la API de Google Analytics Reporting
3. Crear credenciales de OAuth2 o cuenta de servicio
4. Configurar los campos correspondientes en la página de edición de website

### Google Ads

Para configurar la integración con Google Ads, se necesitan los siguientes pasos:

1. Crear un proyecto en Google Cloud Platform (puede ser el mismo que para Analytics)
2. Habilitar la API de Google Ads
3. Crear credenciales de OAuth2 o cuenta de servicio
4. Obtener un token de desarrollador
5. Configurar los campos correspondientes en la página de edición de website

## Interfaz de Usuario

### Alertas de Configuración

Si un sitio web no tiene configuradas las credenciales necesarias, se muestran alertas en el dashboard:

- Alerta para Google Analytics: Informa al usuario que debe configurar las credenciales de Analytics
- Alerta para Google Ads: Informa al usuario que debe configurar las credenciales de Google Ads

Estas alertas incluyen un enlace directo para editar el sitio web seleccionado.

### Formulario de Configuración

El formulario de creación/edición de websites incluye campos para configurar las credenciales:

- Sección "Integración de Analytics" con los campos correspondientes
- Sección "Integración de Google Ads" con los campos correspondientes

## Gestión de Errores

- Si hay un error al obtener datos de Google Analytics, el sistema muestra datos de ejemplo
- Si hay un error al obtener datos de Google Ads, el sistema muestra datos de ejemplo
- En ambos casos, los registros de error se muestran en la consola para facilitar la depuración

## Ampliaciones Futuras

- Implementar estadísticas de conversión históricas
- Mejorar la visualización de datos con gráficos más detallados
- Añadir más métricas de Google Analytics
- Implementar informes descargables
- Añadir funcionalidad para configurar objetivos directamente en Google Analytics