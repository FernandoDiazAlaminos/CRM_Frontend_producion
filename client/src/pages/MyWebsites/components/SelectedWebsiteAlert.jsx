import React from "react";

const SelectedWebsiteAlert = ({ selectedWebsite, onDeselect }) => {
  if (!selectedWebsite) return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 mb-6 dark:bg-blue-800/10 dark:border-blue-700 dark:text-blue-400" role="alert">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="ms-3 flex-grow">
          <h3 className="text-sm font-medium">Web seleccionada actualmente: <strong>{selectedWebsite.name}</strong></h3>
        </div>
        <div>
          <button
            type="button"
            onClick={onDeselect}
            className="py-1 px-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400 dark:hover:bg-blue-800/30"
          >
            Deseleccionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedWebsiteAlert;