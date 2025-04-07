import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { toggleApiMode } from "../../redux/slices/apiModeSlice";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isDevelopmentMode = useSelector((state) => state.apiMode.isDevelopmentMode);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleToggleApiMode = () => {
    dispatch(toggleApiMode());
    
    // Recargar la página después de cambiar el modo
    setTimeout(() => {
      window.location.reload();
    }, 100); // Pequeño retraso para asegurar que el estado se actualice primero
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-30 w-full bg-white border-b border-gray-200 text-sm py-2.5 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden">
          {/* Logo móvil */}
          <Link to="/dashboard" className="flex-none text-xl font-semibold dark:text-white" aria-label="DIMAP">
            DIMAP CRM
          </Link>

          <div className="lg:hidden ms-auto">
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700"
              onClick={toggleSidebar}
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
          {/* Buscador (visible en desktop) */}
          <div className="hidden md:block">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          </div>

          <div className="flex flex-row items-center justify-end gap-2">
            {/* 🔥 Botón para cambiar el modo API */}
            <button 
              type="button" 
              onClick={handleToggleApiMode}
              className={`md:flex hidden items-center gap-x-2 text-sm font-medium rounded-full px-4 py-2 border ${
                isDevelopmentMode 
                  ? 'border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <span className="size-2 rounded-full bg-current"></span>
              {isDevelopmentMode ? 'Modo Prueba' : 'Modo Real'}
            </button>

            {/* Botón de búsqueda móvil */}
            <button 
              type="button" 
              className="md:hidden size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
              onClick={toggleMobileSearch}
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </button>

            {/* 🔥 Botón para cambiar el modo API (versión móvil) */}
            <button 
              type="button" 
              onClick={handleToggleApiMode}
              className="md:hidden size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              style={{
                backgroundColor: isDevelopmentMode ? '#FEF9C3' : '#DCFCE7',
                borderColor: isDevelopmentMode ? '#FDE047' : '#86EFAC',
                color: isDevelopmentMode ? '#854D0E' : '#166534'
              }}
            >
              <span className="size-2 rounded-full bg-current"></span>
            </button>

            {/* Botón de notificaciones */}
            <button type="button" className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>

            {/* Dropdown de usuario */}
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      {/* Búsqueda móvil (mostrar/ocultar) */}
      {isMobileSearchOpen && (
        <div className="md:hidden w-full px-4 py-3 bg-white border-t border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
      )}
    </header>
  );
};

export default Header;