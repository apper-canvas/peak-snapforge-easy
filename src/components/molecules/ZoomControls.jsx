import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ZoomControls = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset, 
  onZoomFit 
}) => {
  return (
    <div className="flex items-center gap-2 bg-surface-800 rounded-lg p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        disabled={zoom <= 0.1}
      >
        <ApperIcon name="ZoomOut" size={16} />
      </Button>
      
      <div className="px-2 py-1 text-sm text-surface-300 font-mono min-w-[60px] text-center">
        {Math.round(zoom * 100)}%
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        disabled={zoom >= 5}
      >
        <ApperIcon name="ZoomIn" size={16} />
      </Button>
      
      <div className="w-px h-6 bg-surface-600 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomReset}
      >
        100%
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomFit}
      >
        Fit
      </Button>
    </div>
  );
};

export default ZoomControls;