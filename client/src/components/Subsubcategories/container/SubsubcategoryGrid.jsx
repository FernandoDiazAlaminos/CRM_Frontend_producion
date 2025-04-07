import React from "react";
import PropTypes from "prop-types";
import SubsubcategoryCard from "../SubsubcategoryCard";

const SubsubcategoryGrid = ({
  items,
  getCategoryName,
  getSubcategoryName,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(subsubcategory => (
        <SubsubcategoryCard 
          key={subsubcategory.id_sub_sub_categoria} 
          subsubcategory={subsubcategory} 
          categoryName={getCategoryName(subsubcategory.id_sub_categoria)}
          subcategoryName={getSubcategoryName(subsubcategory.id_sub_categoria)}
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

SubsubcategoryGrid.propTypes = {
  items: PropTypes.array.isRequired,
  getCategoryName: PropTypes.func.isRequired,
  getSubcategoryName: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SubsubcategoryGrid;
