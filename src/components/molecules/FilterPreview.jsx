import React from "react";
import { cn } from "@/utils/cn";

const FilterPreview = ({ 
  filter, 
  thumbnail, 
  isActive, 
  onClick 
}) => {
  return (
    <div
      className={cn(
        "filter-preview relative cursor-pointer border-2 rounded-lg overflow-hidden",
        "transition-all duration-150 ease-out",
        "hover:transform hover:scale-105",
        isActive 
          ? "border-primary-500 shadow-lg shadow-primary-500/25" 
          : "border-surface-600 hover:border-surface-500"
      )}
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-surface-800 flex items-center justify-center">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={filter.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-600 to-surface-700 flex items-center justify-center">
            <span className="text-xs text-surface-400">No Preview</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
        <span className="text-xs text-white font-medium truncate block">
          {filter.name}
        </span>
      </div>
    </div>
  );
};

export default FilterPreview;