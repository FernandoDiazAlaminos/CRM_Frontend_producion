import React from "react";

const PostsLoading = () => {
  return (
    <div className="text-center p-8">
      <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span className="sr-only">Cargando...</span>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando posts...</p>
    </div>
  );
};

export default PostsLoading;
