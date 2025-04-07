import React from "react";

const SEOLoading = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin size-7 border-2 border-blue-600 rounded-full border-t-transparent"></div>
      <p className="ms-2 text-gray-600 dark:text-gray-400">Cargando...</p>
    </div>
  );
};

export default SEOLoading;
