import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const PostsTable = ({
  posts,
  getCategoryName,
  formatDate,
  truncateText,
  onEdit,
  onDelete,
  onEditSEO
}) => {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} encontrados
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                        ID
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                        Título
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                        Contenido
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                        Categoría
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                        Fecha
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-end"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <motion.tr 
                      key={post.id_post}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.id_post}
                          </span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {truncateText(post.titulo, 50)}
                          </span>
                        </div>
                      </td>
                      <td className="h-px">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {truncateText(post.contenido, 100)}
                          </span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {getCategoryName(post.categoria_id)}
                          </span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-3">
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="h-px w-px whitespace-nowrap">
                        <div className="px-6 py-1.5 flex justify-end gap-x-2">
                          <button
                            type="button"
                            onClick={() => onEditSEO(post)}
                            className="inline-flex items-center gap-x-1 text-sm text-gray-600 decoration-2 hover:underline font-medium dark:text-gray-400"
                          >
                            SEO
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(post)}
                            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(post.id_post)}
                            className="inline-flex items-center gap-x-1 text-sm text-red-600 decoration-2 hover:underline font-medium dark:text-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      No hay posts disponibles. Añade uno nuevo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

PostsTable.propTypes = {
  posts: PropTypes.array.isRequired,
  getCategoryName: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  truncateText: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditSEO: PropTypes.func.isRequired
};

export default PostsTable;
