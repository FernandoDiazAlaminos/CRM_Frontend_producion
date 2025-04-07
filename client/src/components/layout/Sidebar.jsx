import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectedWebsiteIndicator from "../WebsiteSelector/SelectedWebsiteIndicator";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { selectedWebsite } = useSelector((state) => state.websites);
  
  // Estado para controlar la apertura del submenú "Webs"
  const [isWebsOpen, setIsWebsOpen] = useState(false);
  
  // Determinar si alguna ruta del submenú está activa
  const webRoutes = ['/categories', '/subcategories', '/subsubcategories', '/posts', '/seo'];
  const isWebRouteActive = webRoutes.some(route => location.pathname.startsWith(route));
  
  // Abrir automáticamente el submenú si una de sus rutas está activa
  useEffect(() => {
    if (isWebRouteActive || location.pathname === '/my-websites') {
      setIsWebsOpen(true);
    }
  }, [isWebRouteActive, location.pathname]);

  // Datos del menú
  const menuData = {
    mainItems: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: (
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/>
            <rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/>
            <rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        ),
        roles: ["admin", "user"]
      },
      {
        path: "/users",
        label: "Usuarios",
        icon: (
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
        roles: ["admin", "user"]
      },
      {
        path: "/settings",
        label: "Configuración",
        icon: (
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        ),
        roles: ["admin"]
      }
    ],
    webSubItems: [
      {
        path: "/my-websites",
        label: "Mis Webs",
        isMain: true, // Indicador de elemento principal
        roles: ["admin", "user"]
      },
      {
        path: "/categories",
        label: "Categorías",
        roles: ["admin", "user"]
      },
      {
        path: "/subcategories",
        label: "Sub-Categorías",
        roles: ["admin", "user"]
      },
      {
        path: "/subsubcategories",
        label: "Sub-Sub-Categorías",
        roles: ["admin", "user"]
      },
      {
        path: "/posts",
        label: "Posts",
        roles: ["admin", "user"]
      },
      {
        path: "/seo",
        label: "SEO",
        roles: ["admin", "user"]
      },
      {
        path: "/conversions",
        label: "Conversiones",
        roles: ["admin", "user"]
      }
    ]
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-neutral-800 dark:border-neutral-700 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 lg:translate-x-0`}
    >
      {/* Sidebar Logo */}
      <div className="px-6 flex items-center">
        <Link to="/dashboard" className="flex-none text-xl font-semibold dark:text-white" aria-label="DIMAP">
          DIMAP CRM
        </Link>
      </div>
      {/* End Sidebar Logo */}

      {/* Web seleccionada (si existe) */}
      <SelectedWebsiteIndicator />

      {/* Botón para cerrar el sidebar (solo en móvil) */}
      <div className="lg:hidden absolute top-5 right-5">
        <button 
          type="button"
          className="size-8 flex items-center justify-center text-gray-500 hover:text-gray-600 dark:text-neutral-400"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      {/* Navegación del Sidebar */}
      <nav className="p-6 w-full flex flex-col flex-wrap">
        <ul className="space-y-1.5">
          {/* Dashboard */}
          <li>
            <Link 
              to="/dashboard"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500' 
                  : 'text-gray-700 dark:text-neutral-400'
              }`}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              Dashboard
            </Link>
          </li>

          {/* Usuarios */}
          <li>
            <Link 
              to="/users"
              className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                location.pathname === '/users' 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500' 
                  : 'text-gray-700 dark:text-neutral-400'
              }`}
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Usuarios
            </Link>
          </li>

          {/* Webs (desplegable) */}
          <li>
            <button 
              type="button" 
              onClick={() => setIsWebsOpen(!isWebsOpen)}
              className={`w-full text-start flex items-center justify-between gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                isWebRouteActive || location.pathname === '/my-websites'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500' 
                  : 'text-gray-700 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center">
                <svg className="size-4 me-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Webs
              </div>
              
              <svg className={`size-4 transition-transform ${isWebsOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Submenú de Webs */}
            <div className={`overflow-hidden transition-all duration-300 ${isWebsOpen ? 'max-h-72 mt-2' : 'max-h-0'}`}>
              <ul className="ps-6 space-y-1">
                {menuData.webSubItems
                  .filter(item => item.roles.includes(user?.role || 'user'))
                  .map(item => (
                    <li key={item.path}>
                      <Link 
                        to={item.path}
                        className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                          location.pathname.startsWith(item.path) 
                            ? 'bg-blue-50/40 text-blue-600 dark:bg-blue-900/10 dark:text-blue-500' 
                            : 'text-gray-700 dark:text-neutral-400'
                        } ${
                          item.isMain ? 'font-medium border-l-2 border-blue-500 pl-2 -ml-0.5 dark:border-blue-400' : ''
                        }`}
                        onClick={() => {
                          // Si va a la página de Mis Webs, guardar la página actual
                          if (item.path === '/my-websites') {
                            localStorage.setItem('previousPageBeforeWebsites', location.pathname);
                          }
                        }}
                      >
                        {item.isMain && (
                          <svg className="size-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                            <path d="M12 3v6"/>
                          </svg>
                        )}
                        {item.label}
                        
                        {/* Mostrar un indicador si es un elemento de contenido y no hay web seleccionada */}
                        {!selectedWebsite && !item.isMain && (
                          <span className="ml-1 inline-flex items-center justify-center size-2 bg-yellow-400 dark:bg-yellow-600 rounded-full text-xs"></span>
                        )}
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          </li>

          {/* Configuración (solo para admin) */}
          {user?.role === 'admin' && (
            <li>
              <Link 
                to="/settings"
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  location.pathname === '/settings' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500' 
                    : 'text-gray-700 dark:text-neutral-400'
                }`}
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Configuración
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;