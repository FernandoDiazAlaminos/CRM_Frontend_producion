import React from "react";
import CategoryCard from "../../../components/Categories/CategoryCard";

const CategoryGrid = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="size-12 mx-auto text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 0-2.04-3.44H3"/>
          <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 1 2.04-3.44H21"/>
          <path d="M12 12h4"/>
          <path d="M12 16h2"/>
          <path d="M12 8h5"/>
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No hay categorías</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          No se encontraron resultados para tu búsqueda.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {}} // Se manejará desde el componente padre
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            Nueva Categoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
        <CategoryCard 
          key={category.id_categoria} 
          category={category} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default CategoryGrid;