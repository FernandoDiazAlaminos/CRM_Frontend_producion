import React from "react";
import PropTypes from "prop-types";

const PostsError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-sm text-red-800 rounded-lg p-4 mb-6 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6"/>
            <path d="m9 9 6 6"/>
          </svg>
        </div>
        <div className="ms-3">
          <h3 className="text-sm font-medium">
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
};

PostsError.propTypes = {
  message: PropTypes.string
};

export default PostsError;
