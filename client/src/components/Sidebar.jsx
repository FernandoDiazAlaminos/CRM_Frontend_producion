import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const user = useSelector((state) => state.auth.user);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // Menú principal - solo 4 elementos principales como solicitado
  const mainMenuItems = [
    { label: "Dashboard", path: "/dashboard", roles: ["admin", "user"] },
    { label: "Usuarios", path: "/users", roles: ["admin", "user"] },
    { label: "Configuración", path: "/settings", roles: ["admin"] }
  ];

  // Submenú para "Mis Webs"
  const webMenuItems = [
    { label: "Categorías", path: "/categories", roles: ["admin", "user"] },
    { label: "Sub-Categorías", path: "/subcategories", roles: ["admin", "user"] },
    { label: "Sub-Sub-Categorías", path: "/subsubcategories", roles: ["admin", "user"] },
    { label: "Posts", path: "/posts", roles: ["admin", "user"] },
    { label: "SEO", path: "/seo", roles: ["admin", "user"] }
  ];

  // Verificar si alguna ruta del submenú está activa
  const isWebMenuActive = () => {
    const currentPath = window.location.pathname;
    return webMenuItems.some(item => currentPath.startsWith(item.path));
  };

  // Toggle del submenú
  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <aside
      className={`sticky top-0 left-0 bg-gray-800 text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out 
        lg:sticky lg:flex lg:w-64 h-screen`}
    >
      {/* 🔥 Menú completo sticky */}
      <div className="p-4 w-full bg-gray-800 z-10 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          {/* Elementos del menú principal - Dashboard, Usuarios */}
          {mainMenuItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <li key={item.path} className="mb-3">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-2 rounded flex items-center ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}

          {/* Menú desplegable "Mis Webs" */}
          <li className="mb-3">
            <button
              onClick={toggleSubmenu}
              className={`w-full text-left p-2 rounded flex items-center justify-between ${
                isWebMenuActive() ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              <span>Mis Webs</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${submenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú */}
            <ul className={`mt-2 ml-4 transition-all overflow-hidden ${submenuOpen ? "max-h-96" : "max-h-0"}`}>
              {webMenuItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => (
                  <li key={item.path} className="mb-2">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </li>
          
          {/* Elemento Configuración siempre al final */}
          {user?.role === "admin" && (
            <li className="mb-3">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `block p-2 rounded flex items-center ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
                }
              >
                <span>Configuración</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Botón para cerrar el menú en móviles */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 bg-gray-600 text-white p-2 rounded lg:hidden"
      >
        ✕
      </button>
    </aside>
  );
}
