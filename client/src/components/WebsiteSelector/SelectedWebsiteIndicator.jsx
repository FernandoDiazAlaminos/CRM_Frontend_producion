import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SelectedWebsiteIndicator() {
  const { selectedWebsite } = useSelector((state) => state.websites);

  if (!selectedWebsite) {
    return (
      <div className="mx-6 mt-4 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-md">
        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">Sin web seleccionada</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm truncate text-yellow-600 dark:text-yellow-400">Selecciona una web</p>
          <Link 
            to="/my-websites"
            className="text-yellow-800 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Determinar el color según el status de la web
  const getStatusColor = () => {
    switch (selectedWebsite.status) {
      case 'active':
        return "bg-blue-50 dark:bg-blue-900/10";
      case 'maintenance':
        return "bg-yellow-50 dark:bg-yellow-900/10";
      case 'development':
        return "bg-purple-50 dark:bg-purple-900/10";
      default:
        return "bg-gray-50 dark:bg-gray-800/10";
    }
  };

  const getTextColor = () => {
    switch (selectedWebsite.status) {
      case 'active':
        return "text-blue-800 dark:text-blue-300";
      case 'maintenance':
        return "text-yellow-800 dark:text-yellow-300";
      case 'development':
        return "text-purple-800 dark:text-purple-300";
      default:
        return "text-gray-800 dark:text-gray-300";
    }
  };

  const getIconColor = () => {
    switch (selectedWebsite.status) {
      case 'active':
        return "text-blue-800 dark:text-blue-300";
      case 'maintenance':
        return "text-yellow-800 dark:text-yellow-300";
      case 'development':
        return "text-purple-800 dark:text-purple-300";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className={`mx-6 mt-4 px-3 py-2 flex items-center gap-x-2 ${getStatusColor()} rounded-md`}>
      <div className="min-w-0 flex-grow">
        <p className={`text-xs font-medium ${getTextColor()}`}>Web seleccionada</p>
        <p className={`text-sm truncate ${getTextColor()}`}>{selectedWebsite.name}</p>
      </div>
      <Link 
        to="/my-websites"
        className={`${getIconColor()} hover:opacity-80`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
      </Link>
    </div>
  );
}