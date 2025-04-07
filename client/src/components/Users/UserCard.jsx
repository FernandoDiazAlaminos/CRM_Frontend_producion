import { motion } from "framer-motion";

export default function UserCard({ user, onEdit, onDelete }) {
  // Función para generar iniciales desde el nombre y apellido
  const getInitials = () => {
    const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : "?";
    const surnameInitial = user.sur_name ? user.sur_name.charAt(0).toUpperCase() : 
                          user.surName ? user.surName.charAt(0).toUpperCase() : "";
    return nameInitial + (surnameInitial || "");
  };

  // Color de fondo basado en el rol
  const getBgColor = () => {
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500";
      case "editor":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div 
      className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-800 dark:border-neutral-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-x-4">
          {/* Avatar con iniciales */}
          <div className={`inline-flex items-center justify-center size-[46px] rounded-full ${getBgColor()} text-white font-semibold`}>
            {getInitials()}
          </div>
          
          <div className="grow">
            <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
              {user.name} {user.sur_name || user.surName || ""}
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-500">
              {user.email}
            </p>
          </div>
          
          {/* Badge para el rol */}
          <span className={`inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium ${
            user.role?.toLowerCase() === "admin" 
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              : user.role?.toLowerCase() === "editor"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}>
            {user.role || "Usuario"}
          </span>
        </div>
        
        <div className="mt-3 space-y-1">
          {/* DNI */}
          {user.dni && (
            <p className="text-sm text-gray-600 dark:text-neutral-400 flex items-center gap-x-1">
              <svg className="shrink-0 size-3.5 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="font-medium">DNI:</span> {user.dni}
            </p>
          )}
          
          {/* Empresa */}
          {(user.name_empresa || user.nombreEmpresa) && (
            <p className="text-sm text-gray-600 dark:text-neutral-400 flex items-center gap-x-1">
              <svg className="shrink-0 size-3.5 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M19 21V7.3c0-1.3-1.7-2.2-3-1.4L3 12v9"/>
                <path d="M13 12h.01"/>
                <path d="M17 12h.01"/>
                <path d="M13 16h.01"/>
                <path d="M17 16h.01"/>
              </svg>
              <span className="font-medium">Empresa:</span> {user.name_empresa || user.nombreEmpresa}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-x-2">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
