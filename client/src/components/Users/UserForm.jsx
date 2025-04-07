import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function UserForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) {
  // Estado inicial basado en el modelo de usuario del backend
  const [formData, setFormData] = useState({
    name: "",
    sur_name: "", // Apellido
    email: "",
    password: "",
    dni: "",
    name_empresa: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        sur_name: initialData.sur_name || initialData.surName || "",
        email: initialData.email || "",
        password: "", // No incluimos la contraseña por seguridad
        dni: initialData.dni || "",
        name_empresa: initialData.name_empresa || initialData.nameEmpresa || "",
        role: initialData.role || "user",
      });
    }
  }, [initialData]);

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

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.sur_name) newErrors.sur_name = "El apellido es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }
    if (!initialData && !formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.dni) newErrors.dni = "El DNI es obligatorio";
    if (!formData.name_empresa) newErrors.name_empresa = "El nombre de la empresa es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Si estamos editando y no se ha cambiado la contraseña, no la enviamos
      const dataToSubmit = { ...formData };
      if (initialData && !formData.password) {
        delete dataToSubmit.password;
      }

      // Para compatibilidad con la API actual y Redux
      if (dataToSubmit.sur_name) {
        dataToSubmit.surName = dataToSubmit.sur_name;
      }
      if (dataToSubmit.name_empresa) {
        dataToSubmit.nombreEmpresa = dataToSubmit.name_empresa;
      }

      onSubmit(dataToSubmit);
    } else {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor, completa todos los campos obligatorios correctamente.",
        icon: "error",
      });
    }
  };

  // Toggle mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            {initialData ? "Editar" : "Nuevo"} Usuario
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {initialData
              ? "Modifica los datos del usuario"
              : "Completa los datos para crear un nuevo usuario"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Nombre */}
            <div>
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
                placeholder="Nombre"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Apellido *
              </label>
              <input
                type="text"
                name="sur_name"
                value={formData.sur_name}
                onChange={handleChange}
                className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                  errors.sur_name ? "border-red-500" : ""
                }`}
                placeholder="Apellido"
                disabled={isLoading}
              />
              {errors.sur_name && (
                <p className="text-xs text-red-600 mt-1">{errors.sur_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* DNI */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              DNI/NIF *
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                errors.dni ? "border-red-500" : ""
              }`}
              placeholder="12345678X"
              disabled={isLoading || (initialData && initialData.dni)}
            />
            {errors.dni && (
              <p className="text-xs text-red-600 mt-1">{errors.dni}</p>
            )}
          </div>

          {/* Nombre de la empresa */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Nombre de empresa *
            </label>
            <input
              type="text"
              name="name_empresa"
              value={formData.name_empresa}
              onChange={handleChange}
              className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                errors.name_empresa ? "border-red-500" : ""
              }`}
              placeholder="Nombre de la empresa"
              disabled={isLoading}
            />
            {errors.name_empresa && (
              <p className="text-xs text-red-600 mt-1">{errors.name_empresa}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              {initialData ? "Nueva contraseña (opcional)" : "Contraseña *"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`py-3 px-4 pe-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder={initialData ? "Dejar en blanco para no cambiar" : "********"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 end-3 -translate-y-1/2 p-1"
              >
                <svg
                  className="size-4 text-gray-400 dark:text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </>
                  )}
                </svg>
              </button>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
            {!errors.password && (
              <p className="text-xs text-gray-500 mt-1">
                {initialData
                  ? "Deja este campo en blanco si no deseas cambiar la contraseña"
                  : "Mínimo 8 caracteres recomendados"}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Rol de usuario
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              disabled={isLoading}
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
              <option value="editor">Editor</option>
            </select>
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
                "Crear Usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
