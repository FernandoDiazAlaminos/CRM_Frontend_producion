import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Redux actions
import { loadUsers, createUser, editUser, deleteUser, clearUsers } from "../../redux/slices/usersSlice";

// Componentes
import UserForm from "../../components/Users/UserForm";
import UserCard from "../../components/Users/UserCard";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  
  // Obtener el estado de ApiMode para detectar cambios
  const { isDevelopmentMode, lastChanged } = useSelector((state) => state.apiMode);
  
  // Estado local
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid"); // grid o table
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  // Recargar usuarios cuando cambia el modo API
  useEffect(() => {
    if (lastChanged) {
      // Primero limpiamos los usuarios existentes
      dispatch(clearUsers());
      // Luego recargamos los datos sin mostrar notificación
      dispatch(loadUsers());
    }
  }, [lastChanged, isDevelopmentMode, dispatch]);

  // Filtrar usuarios según la búsqueda
  const filteredUsers = () => {
    if (!searchQuery.trim()) return users;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return users.filter(user => 
      user.name?.toLowerCase().includes(lowerQuery) ||
      user.sur_name?.toLowerCase().includes(lowerQuery) ||
      user.surName?.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery) ||
      user.dni?.toLowerCase().includes(lowerQuery) ||
      user.name_empresa?.toLowerCase().includes(lowerQuery) ||
      user.nombreEmpresa?.toLowerCase().includes(lowerQuery) ||
      user.role?.toLowerCase().includes(lowerQuery)
    );
  };

  // Ordenar usuarios
  const sortedUsers = () => {
    const filtered = filteredUsers();
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      // Permitir valores nulos o undefined
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      const aValue = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Cambiar ordenamiento
  const requestSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Abrir formulario para crear usuario
  const handleOpenCreateForm = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };

  // Abrir formulario para editar usuario
  const handleOpenEditForm = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedUser(null);
  };

  // Submit del formulario de usuario
  const handleSubmitForm = (data) => {
    if (isEditing && selectedUser) {
      dispatch(editUser({ id: selectedUser.id, data }))
        .unwrap()
        .then(() => {
          setIsFormVisible(false);
          setSelectedUser(null);
        });
    } else {
      dispatch(createUser(data))
        .unwrap()
        .then(() => {
          setIsFormVisible(false);
        });
    }
  };

  // Confirmación antes de eliminar
  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      dispatch(deleteUser(id));
    }
  };

  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    // Primero limpiamos los usuarios existentes
    dispatch(clearUsers());
    // Luego recargamos
    dispatch(loadUsers());
  };

  // Renderizar cabecera de página
  const renderHeader = () => (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Administra los usuarios del sistema
          </p>
        </div>
        
        {!isFormVisible && (
          <div className="inline-flex gap-x-2">
            <button
              type="button"
              onClick={handleRefreshData}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              disabled={loading}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9.95-8.93A9 9 0 0 0 6 21.39"/>
                <path d="M3 12a9 9 0 0 1 9.95-8.93A9 9 0 0 1 18 21.39"/>
                <path d="M14.83 14.83 19 19"/>
                <path d="M19 14.83v4.17h-4.17"/>
              </svg>
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Nuevo Usuario
            </button>
          </div>
        )}
      </div>
      
      {/* Indicador de modo API */}
      <div className={`mt-2 inline-flex items-center rounded-full py-1 px-3 text-xs font-medium ${
        isDevelopmentMode 
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }`}>
        <span className="size-2 rounded-full bg-current me-1.5"></span>
        Usando datos en {isDevelopmentMode ? 'modo prueba' : 'modo real (API)'}
      </div>
    </header>
  );

  // Renderizar barra de búsqueda y filtros
  const renderSearchBar = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Buscador */}
      <div className="sm:w-64 flex-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-3 ps-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            placeholder="Buscar usuarios..."
          />
          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <svg className="size-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Cambiar vista */}
      <div className="inline-flex rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => setView('grid')}
          className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-s-lg ${
            view === 'grid'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="14" rx="1"/>
            <rect width="7" height="7" x="3" y="14" rx="1"/>
          </svg>
          Tarjetas
        </button>
        <button
          type="button"
          onClick={() => setView('table')}
          className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-e-lg ${
            view === 'table'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M3 12h18"/>
            <path d="M3 18h18"/>
          </svg>
          Tabla
        </button>
      </div>
    </div>
  );

  // Renderizar contenido principal (formulario o lista)
  const renderContent = () => {
    // Mostrar formulario
    if (isFormVisible) {
      return (
        <UserForm 
          initialData={isEditing ? selectedUser : null}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
        />
      );
    }
    
    // Mostrar listado
    const items = sortedUsers();
    
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin size-7 border-2 border-blue-600 rounded-full border-t-transparent"></div>
          <p className="ms-2 text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-10">
          <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza creando un nuevo usuario.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Nuevo Usuario
            </button>
          </div>
        </div>
      );
    }
    
    if (view === 'grid') {
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onEdit={handleOpenEditForm} 
              onDelete={handleDeleteUser} 
            />
          ))}
        </div>
      );
    }
    
    // Vista de tabla
    return (
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        Nombre
                        {sortConfig.key === 'name' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortConfig.key === 'email' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400 cursor-pointer select-none"
                      onClick={() => requestSort('role')}
                    >
                      <div className="flex items-center">
                        Rol
                        {sortConfig.key === 'role' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                    >
                      Empresa
                    </th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map(user => (
                    <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {user.name} {user.sur_name || user.surName || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <span className={`inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium ${
                          user.role?.toLowerCase() === "admin" 
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : user.role?.toLowerCase() === "editor"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {user.role || "Usuario"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.name_empresa || user.nombreEmpresa || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <div className="flex justify-end gap-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(user)}
                            className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            <svg className="size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              <path d="m15 5 4 4"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderHeader()}
      {!isFormVisible && renderSearchBar()}
      {renderContent()}
    </motion.div>
  );
}
