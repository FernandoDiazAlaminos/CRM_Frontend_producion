import React from "react";
import PropTypes from "prop-types";

const SubsubcategoryFilters = ({
  searchQuery,
  setSearchQuery,
  view,
  setView,
  categoryFilter,
  setCategoryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  categories,
  filteredSubcategories
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Buscador */}
      <div className="sm:w-64 flex-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-3 ps-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            placeholder="Buscar subsubcategorías..."
          />
          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <svg className="size-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Filtro por categoría */}
      <div className="sm:w-48">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      
      {/* Filtro por subcategoría */}
      <div className="sm:w-48">
        <select
          value={subcategoryFilter}
          onChange={(e) => setSubcategoryFilter(e.target.value)}
          className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
          disabled={filteredSubcategories.length === 0}
        >
          <option value="">Todas las subcategorías</option>
          {filteredSubcategories.map(sub => (
            <option key={sub.id_sub_categoria} value={sub.id_sub_categoria}>
              {sub.nombre}
            </option>
          ))}
        </select>
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
};

SubsubcategoryFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  subcategoryFilter: PropTypes.string.isRequired,
  setSubcategoryFilter: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  filteredSubcategories: PropTypes.array.isRequired
};

export default SubsubcategoryFilters;
