import React from "react";
import PropTypes from "prop-types";

const SEOTabs = ({ activeSEOType, onSEOTypeChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          onClick={() => onSEOTypeChange('pages')}
          className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap ${
            activeSEOType === 'pages'
              ? 'font-semibold border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <path d="M9 8h6"/>
            <path d="M9 12h6"/>
            <path d="M9 16h6"/>
          </svg>
          Páginas
        </button>
        
        <button
          onClick={() => onSEOTypeChange('entities')}
          className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap ${
            activeSEOType === 'entities'
              ? 'font-semibold border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500'
          }`}
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 16 4 4 4-4"/>
            <path d="M7 20V4"/>
            <path d="M11 4h4"/>
            <path d="M11 8h7"/>
            <path d="M11 12h10"/>
          </svg>
          Categorías/Posts
        </button>
      </nav>
    </div>
  );
};

SEOTabs.propTypes = {
  activeSEOType: PropTypes.string.isRequired,
  onSEOTypeChange: PropTypes.func.isRequired
};

export default SEOTabs;
