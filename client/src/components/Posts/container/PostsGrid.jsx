import React from "react";
import PropTypes from "prop-types";
import PostCard from "../PostCard";

const PostsGrid = ({
  posts,
  getCategoryName,
  onEdit,
  onDelete,
  onEditSEO
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <PostCard 
          key={post.id_post} 
          post={post} 
          categoryName={getCategoryName(post.categoria_id)}
          onEdit={onEdit} 
          onDelete={onDelete}
          onEditSEO={onEditSEO}
        />
      ))}
    </div>
  );
};

PostsGrid.propTypes = {
  posts: PropTypes.array.isRequired,
  getCategoryName: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditSEO: PropTypes.func.isRequired
};

export default PostsGrid;
