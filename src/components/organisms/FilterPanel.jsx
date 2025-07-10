import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterPreview from "@/components/molecules/FilterPreview";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { presetFilters } from "@/utils/imageProcessing";

const FilterPanel = ({ 
  imageData, 
  activeFilter, 
  onFilterSelect,
  onFilterReset
}) => {
  const [thumbnails, setThumbnails] = useState({});
  
  useEffect(() => {
    if (imageData) {
      generateThumbnails();
    }
  }, [imageData]);
  
  const generateThumbnails = async () => {
    if (!imageData) return;
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Create a small thumbnail
    const scale = Math.min(64 / imageData.width, 64 / imageData.height);
    canvas.width = Math.round(imageData.width * scale);
    canvas.height = Math.round(imageData.height * scale);
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    
    const thumbnailData = {};
    
    presetFilters.forEach((filter) => {
      thumbnailData[filter.name] = canvas.toDataURL();
    });
    
    setThumbnails(thumbnailData);
  };
  
  const hasActiveFilter = activeFilter && activeFilter.name !== "Original";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface-800 rounded-lg border border-surface-700 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-100">Filters</h3>
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilterReset}
            className="text-surface-400 hover:text-surface-200"
          >
            <ApperIcon name="RotateCcw" size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {presetFilters.map((filter) => (
          <FilterPreview
            key={filter.name}
            filter={filter}
            thumbnail={thumbnails[filter.name]}
            isActive={activeFilter?.name === filter.name}
            onClick={() => onFilterSelect(filter)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FilterPanel;