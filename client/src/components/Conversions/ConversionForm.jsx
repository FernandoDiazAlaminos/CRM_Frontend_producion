import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ConversionForm = ({ initialData, onSubmit, onCancel, isLoading, selectedWebsite }) => {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unique_code: '',
    value: 1,
    counter: 0,
    active: true
  });

  // Si hay datos iniciales (modo edición), cargarlos en el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        unique_code: initialData.unique_code || '',
        value: initialData.value || 1,
        counter: initialData.counter || 0,
        active: initialData.active !== undefined ? initialData.active : true
      });
    }
  }, [initialData]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    // Convertir a número y validar
    const numValue = value === '' ? '' : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  // Generar código único automáticamente a partir del nombre
  const generateUniqueCode = () => {
    if (!formData.name) return;
    
    // Convertir el nombre a snake_case
    const uniqueCode = formData.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 30);
      
    setFormData(prev => ({
      ...prev,
      unique_code: uniqueCode
    }));
  };

  // Validación del formulario
  const validate = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.unique_code.trim()) {
      errors.unique_code = 'El código único es obligatorio';
    } else if (!/^[a-z0-9_]+$/.test(formData.unique_code)) {
      errors.unique_code = 'El código solo puede contener letras minúsculas, números y guiones bajos';
    }
    
    if (formData.value === '' || formData.value < 0) {
      errors.value = 'El valor debe ser un número positivo';
    }
    
    return errors;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validate();
    
    if (Object.keys(errors).length > 0) {
      // Mostrar errores
      Object.entries(errors).forEach(([field, message]) => {
        alert(`Error en ${field}: ${message}`);
      });
      return;
    }
    
    // Enviar datos
    onSubmit({
      ...formData,
      // Asegurarnos de que los campos numéricos sean números
      value: Number(formData.value),
      counter: Number(formData.counter)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-4 sm:p-7">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {initialData ? 'Editar conversión' : 'Nueva conversión'}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {initialData 
              ? 'Actualiza los detalles de la conversión' 
              : 'Crea una nueva conversión para realizar seguimiento'
            }
          </p>
          {selectedWebsite && (
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              Sitio web: <span className="font-medium">{selectedWebsite.name}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-12 gap-x-6 gap-y-6">
            {/* Nombre */}
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-white">
                Nombre *
              </label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => !formData.unique_code && generateUniqueCode()}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="Nombre de la conversión"
                required
              />
            </div>
            
            {/* Código único */}
            <div className="sm:col-span-6">
              <div className="flex justify-between items-center">
                <label htmlFor="unique_code" className="block text-sm font-medium mb-2 dark:text-white">
                  Código único *
                </label>
                <button
                  type="button"
                  onClick={generateUniqueCode}
                  className="text-xs text-blue-600 dark:text-blue-400"
                >
                  Generar desde nombre
                </button>
              </div>
              <input 
                type="text" 
                id="unique_code"
                name="unique_code"
                value={formData.unique_code}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="identificador_unico"
                pattern="[a-z0-9_]+"
                title="Solo letras minúsculas, números y guiones bajos"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Solo letras minúsculas, números y guiones bajos
              </p>
            </div>
            
            {/* Descripción */}
            <div className="sm:col-span-12">
              <label htmlFor="description" className="block text-sm font-medium mb-2 dark:text-white">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="Describe el propósito de esta conversión"
                rows={3}
              />
            </div>
            
            {/* Valor */}
            <div className="sm:col-span-4">
              <label htmlFor="value" className="block text-sm font-medium mb-2 dark:text-white">
                Valor
              </label>
              <input 
                type="number" 
                id="value"
                name="value"
                value={formData.value}
                onChange={handleNumberChange}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                min="0"
                step="1"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Valor asociado a cada conversión
              </p>
            </div>
            
            {/* Contador inicial (solo en modo edición) */}
            {initialData && (
              <div className="sm:col-span-4">
                <label htmlFor="counter" className="block text-sm font-medium mb-2 dark:text-white">
                  Contador
                </label>
                <input 
                  type="number" 
                  id="counter"
                  name="counter"
                  value={formData.counter}
                  onChange={handleNumberChange}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  min="0"
                  step="1"
                />
              </div>
            )}
            
            {/* Estado activo */}
            <div className="sm:col-span-4">
              <div className="flex items-center">
                <div className="flex">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  />
                </div>
                <div className="ms-3">
                  <label htmlFor="active" className="text-sm font-medium dark:text-white">
                    Conversión activa
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Indica si esta conversión está habilitada para registrar eventos
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instrucciones de integración */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-md font-semibold mb-2 dark:text-white">Instrucciones de integración</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Para registrar una conversión, realiza una petición POST a:
            </p>
            <code className="block p-2 mb-2 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              POST https://dev.agencia.dimap.es/api/conversions/track
            </code>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Con el siguiente cuerpo JSON:
            </p>
            <code className="block p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
              {`{ 
  "unique_code": "${formData.unique_code || 'tu_codigo_unico'}",
  "website_id": ${selectedWebsite ? selectedWebsite.id : "id_de_tu_sitio_web"},
  "value": ${formData.value || 1} // opcional, si no se envía se usa el valor predeterminado
}`}
            </code>
          </div>
          
          {/* Botones */}
          <div className="mt-6 flex justify-end gap-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent rounded-full" role="status" aria-label="loading"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    {!initialData && <path d="M12 5v14"/>}
                  </svg>
                  {initialData ? 'Actualizar' : 'Crear'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ConversionForm;