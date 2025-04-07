import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import OAuthModal from "./OAuthModal";
import DeveloperTokenHelp from "./DeveloperTokenHelp";
import { useSelector } from "react-redux";

const WebsiteForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  userId = null
}) => {
  // Obtener el usuario actual del estado de Redux
  const { user } = useSelector((state) => state.auth);
  
  // Estado inicial
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    logo: "",
    description: "",
    status: "development",
    api_key_analytics: "",
    token1_analytics: "",
    token2_analytics: "",
    api_key_googleAds: "",
    token1_googleAds: "",
    token2_googleAds: "",
    developer_token_googleAds: "",
    user_id: userId || (user ? user.id : null) // Usar el ID del usuario del prop o del estado Redux
  });

  const [errors, setErrors] = useState({});
  
  // Estados para los modales
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [adsModalOpen, setAdsModalOpen] = useState(false);
  const [developerTokenHelpOpen, setDeveloperTokenHelpOpen] = useState(false);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        url: initialData.url || "",
        logo: initialData.logo || "",
        description: initialData.description || "",
        status: initialData.status || "development",
        api_key_analytics: initialData.api_key_analytics || "",
        token1_analytics: initialData.token1_analytics || "",
        token2_analytics: initialData.token2_analytics || "",
        api_key_googleAds: initialData.api_key_googleAds || "",
        token1_googleAds: initialData.token1_googleAds || "",
        token2_googleAds: initialData.token2_googleAds || "",
        developer_token_googleAds: initialData.developer_token_googleAds || "",
        user_id: initialData.user_id || userId || (user ? user.id : null)
      });
    } else {
      // Si no hay datos iniciales, asegurar que el user_id esté asignado correctamente
      const currentUserId = userId || (user ? user.id : null);
      setFormData(prev => ({ ...prev, user_id: currentUserId }));
    }
  }, [initialData, userId, user]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Manejadores para los tokens de OAuth
  const handleAnalyticsRefreshToken = (token) => {
    setFormData((prev) => ({
      ...prev,
      token2_analytics: token
    }));
  };

  const handleAdsRefreshToken = (token) => {
    setFormData((prev) => ({
      ...prev,
      token2_googleAds: token
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.url) newErrors.url = "La URL es obligatoria";
    else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.url)) {
      newErrors.url = "URL no válida";
    }
    
    // Asegurar que la URL comienza con http:// o https://
    if (formData.url && !formData.url.startsWith('http')) {
      formData.url = 'https://' + formData.url;
    }

    // Validar que exista un user_id
    if (!formData.user_id) {
      newErrors.user_id = "Se requiere un usuario asociado";
      console.error("Error de validación: No se ha asignado un usuario al sitio web");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Asegurar que el user_id está establecido
    if (!formData.user_id && user) {
      setFormData(prev => ({ ...prev, user_id: user.id }));
    }

    if (validateForm()) {
      // Log para debugging
      console.log("Enviando datos de web con user_id:", formData.user_id);
      
      onSubmit(formData);
    } else {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor, completa todos los campos obligatorios correctamente.",
        icon: "error",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div className="p-4 sm:p-7">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {initialData ? "Editar" : "Nuevo"} Sitio Web
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {initialData
              ? "Modifica los datos del sitio web"
              : "Completa los datos para crear un nuevo sitio web"}
          </p>
          {formData.user_id && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Este sitio web será asociado al usuario ID: {formData.user_id}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Nombre del sitio web"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* URL */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                errors.url ? "border-red-500" : ""
              }`}
              placeholder="https://ejemplo.com"
              disabled={isLoading}
            />
            {errors.url && (
              <p className="text-xs text-red-600 mt-1">{errors.url}</p>
            )}
          </div>

          {/* Logo */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              placeholder="https://ejemplo.com/logo.png"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL de la imagen del logotipo (opcional)
            </p>
          </div>

          {/* Descripción */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              placeholder="Breve descripción del sitio web"
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Estado */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              disabled={isLoading}
            >
              <option value="active">Activo</option>
              <option value="maintenance">En mantenimiento</option>
              <option value="development">En desarrollo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          {/* Campo oculto para user_id */}
          <input
            type="hidden"
            name="user_id"
            value={formData.user_id || ""}
          />
          {errors.user_id && (
            <p className="text-xs text-red-600 mb-5">{errors.user_id}</p>
          )}

          {/* Sección Analytics */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-5">
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">Integración de Google Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Introduce las credenciales de Google Analytics OAuth 2.0 para permitir la integración con tu sitio web.
            </p>
            
            {/* Client ID (API Key Analytics) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Client ID
              </label>
              <input
                type="text"
                name="api_key_analytics"
                value={formData.api_key_analytics}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Ej. 369140099696-abc123def456.apps.googleusercontent.com"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Encuentra este valor en 'client_id' en tu archivo JSON de credenciales de OAuth</p>
            </div>

            {/* Client Secret (Token 1 Analytics) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Client Secret
              </label>
              <input
                type="text"
                name="token1_analytics"
                value={formData.token1_analytics}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Ej. GOCSPX-xyz123abc456"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Encuentra este valor en 'client_secret' en tu archivo JSON de credenciales</p>
            </div>

            {/* Refresh Token (Token 2 Analytics) */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium dark:text-white">
                  Refresh Token
                </label>
                <button
                  type="button"
                  onClick={() => setAnalyticsModalOpen(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Obtener Token
                </button>
              </div>
              <textarea
                name="token2_analytics"
                value={formData.token2_analytics}
                onChange={handleChange}
                rows="2"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Introduce el refresh token para acceso permanente"
                disabled={isLoading}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Token de acceso permanente obtenido durante el proceso de autorización OAuth</p>
            </div>
          </div>

          {/* Sección Google Ads */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-5">
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">Integración de Google Ads</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Introduce las credenciales de Google Ads OAuth 2.0 para permitir la integración con tu sitio web.
            </p>
            
            {/* Client ID (API Key Google Ads) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Client ID
              </label>
              <input
                type="text"
                name="api_key_googleAds"
                value={formData.api_key_googleAds}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Ej. 369140099696-abc123def456.apps.googleusercontent.com"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Encuentra este valor en 'client_id' en tu archivo JSON de credenciales de OAuth</p>
            </div>

            {/* Client Secret (Token 1 Google Ads) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Client Secret
              </label>
              <input
                type="text"
                name="token1_googleAds"
                value={formData.token1_googleAds}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Ej. GOCSPX-xyz123abc456"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Encuentra este valor en 'client_secret' en tu archivo JSON de credenciales</p>
            </div>

            {/* Refresh Token (Token 2 Google Ads) */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium dark:text-white">
                  Refresh Token
                </label>
                <button
                  type="button"
                  onClick={() => setAdsModalOpen(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Obtener Token
                </button>
              </div>
              <textarea
                name="token2_googleAds"
                value={formData.token2_googleAds}
                onChange={handleChange}
                rows="2"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Introduce el refresh token para acceso permanente"
                disabled={isLoading}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Token de acceso permanente obtenido durante el proceso de autorización OAuth</p>
            </div>

            {/* Developer Token (Específico para Google Ads) */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium dark:text-white">
                  Developer Token
                </label>
                <button
                  type="button"
                  onClick={() => setDeveloperTokenHelpOpen(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ¿Cómo obtenerlo?
                </button>
              </div>
              <input
                type="text"
                name="developer_token_googleAds"
                value={formData.developer_token_googleAds}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Ej. zxcvbnmasdfghjkl123456"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Token de desarrollador requerido específicamente para la API de Google Ads</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex items-center justify-end gap-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                  Guardando...
                </>
              ) : initialData ? (
                "Actualizar"
              ) : (
                "Crear Sitio Web"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modales */}
      <OAuthModal
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        clientId={formData.api_key_analytics}
        clientSecret={formData.token1_analytics}
        onSuccess={handleAnalyticsRefreshToken}
        service="analytics"
      />

      <OAuthModal
        isOpen={adsModalOpen}
        onClose={() => setAdsModalOpen(false)}
        clientId={formData.api_key_googleAds}
        clientSecret={formData.token1_googleAds}
        onSuccess={handleAdsRefreshToken}
        service="ads"
      />

      <DeveloperTokenHelp
        isOpen={developerTokenHelpOpen}
        onClose={() => setDeveloperTokenHelpOpen(false)}
      />
    </motion.div>
  );
};

export default WebsiteForm;
