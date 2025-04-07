import React from "react";
import PropTypes from "prop-types";
import SEOCard from "../SEOCard";

const SEOGrid = ({
  items,
  activeSEOType,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <SEOCard 
          key={item.id} 
          item={item} 
          type={activeSEOType === 'entities' ? 'entity' : 'page'} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

SEOGrid.propTypes = {
  items: PropTypes.array.isRequired,
  activeSEOType: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SEOGrid;
