import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function SEOPageForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false
}) {
  // Estado inicial
  const [formData, setFormData] = useState({
    nombre_pagina: "",
    url_canonica: "",
    title: "",
    description: "",
    keywords: "",
    index: true,
    follow: true,
    img: "",
    alt: ""
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre_pagina) newErrors.nombre_pagina = "El nombre de la página es obligatorio";
    if (!formData.url_canonica) newErrors.url_canonica = "La URL canónica es obligatoria";
    if (!formData.title) newErrors.title = "El título es obligatorio";
    if (!formData.description) newErrors.description = "La descripción es obligatoria";
    if (!formData.img) newErrors.img = "La imagen es obligatoria";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor, completa todos los campos obligatorios.",
        icon: "error"
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
            {initialData ? "Editar" : "Nueva"} Página SEO
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configura los aspectos SEO para páginas estáticas del sitio web.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Nombre de la página */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">Nombre de la Página *</label>
            <div className="relative">
              <input
                type="text"
                name="nombre_pagina"
                value={formData.nombre_pagina}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${errors.nombre_pagina ? 'border-red-500' : ''}`}
                placeholder="Ej: Inicio, Contacto, Servicios"
                disabled={isLoading}
              />
              {errors.nombre_pagina && <p className="text-xs text-red-600 mt-1">{errors.nombre_pagina}</p>}
            </div>
          </div>
          
          {/* URL canónica */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">URL Canónica *</label>
            <div className="relative">
              <input
                type="text"
                name="url_canonica"
                value={formData.url_canonica}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${errors.url_canonica ? 'border-red-500' : ''}`}
                placeholder="Ej: /, /contacto, /servicios"
                disabled={isLoading}
              />
              {errors.url_canonica && <p className="text-xs text-red-600 mt-1">{errors.url_canonica}</p>}
            </div>
          </div>
          
          {/* Título SEO */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">Título SEO *</label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Ej: DIMAP - Agencia de Marketing Digital"
                disabled={isLoading}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
              <p className="text-xs text-gray-500 mt-1">Recomendado: 50-60 caracteres ({formData.title.length} caracteres)</p>
            </div>
          </div>
          
          {/* Meta Descripción */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">Meta Descripción *</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${errors.description ? 'border-red-500' : ''}`}
                rows="3"
                placeholder="Breve descripción del contenido (150-160 caracteres)"
                disabled={isLoading}
              ></textarea>
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">Recomendado: 150-160 caracteres ({formData.description.length} caracteres)</p>
            </div>
          </div>
          
          {/* Keywords */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">Keywords</label>
            <div className="relative">
              <textarea
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                rows="2"
                placeholder="Palabras clave separadas por comas"
                disabled={isLoading}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Ej: dimap, marketing digital, agencia, seo</p>
            </div>
          </div>
          
          {/* Toggles Index/Follow */}
          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <div className="flex">
                <input 
                  type="checkbox" 
                  id="index"
                  name="index"
                  checked={formData.index}
                  onChange={handleChange}
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-neutral-900"
                  disabled={isLoading}
                />
                <label htmlFor="index" className="text-sm ms-3 dark:text-white">
                  <span className="block font-medium">Indexar</span>
                  <span className="block text-xs text-gray-500">Permitir que los motores de búsqueda indexen esta página</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex">
                <input 
                  type="checkbox" 
                  id="follow"
                  name="follow"
                  checked={formData.follow}
                  onChange={handleChange}
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-neutral-900"
                  disabled={isLoading}
                />
                <label htmlFor="follow" className="text-sm ms-3 dark:text-white">
                  <span className="block font-medium">Follow</span>
                  <span className="block text-xs text-gray-500">Permitir que los motores de búsqueda sigan los enlaces</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* URL de Imagen */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">URL de Imagen *</label>
            <div className="relative">
              <input
                type="text"
                name="img"
                value={formData.img}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${errors.img ? 'border-red-500' : ''}`}
                placeholder="Ej: /img/home-dimap.jpg"
                disabled={isLoading}
              />
              {errors.img && <p className="text-xs text-red-600 mt-1">{errors.img}</p>}
            </div>
          </div>
          
          {/* Alt de Imagen */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 dark:text-white">Alt de Imagen</label>
            <div className="relative">
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                placeholder="Texto alternativo para la imagen"
                disabled={isLoading}
              />
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
                <span className="inline-flex items-center gap-x-2">
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full" role="status"></span>
                  Guardando...
                </span>
              ) : initialData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
