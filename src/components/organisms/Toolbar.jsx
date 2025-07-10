import React from "react";
import { motion } from "framer-motion";
import ToolbarButton from "@/components/molecules/ToolbarButton";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Toolbar = ({ 
  onUpload, 
  onCrop, 
  onRotate, 
  onFlip, 
  onExport, 
  onUndo, 
  onRedo,
  canUndo,
  canRedo,
  hasImage,
  activeTool
}) => {
  const fileInputRef = React.useRef(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
    }
    event.target.value = '';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-4 border border-surface-700/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleUploadClick}
            className="hover-glow"
          >
            <ApperIcon name="Upload" size={16} className="mr-2" />
            Upload
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="w-px h-6 bg-surface-600 mx-2" />
          
          <ToolbarButton
            icon="Undo2"
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            variant="ghost"
          />
          
          <ToolbarButton
            icon="Redo2"
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            variant="ghost"
          />
        </div>
        
        {hasImage && (
          <div className="flex items-center gap-2">
            <ToolbarButton
              icon="Crop"
              label="Crop"
              onClick={onCrop}
              isActive={activeTool === 'crop'}
            />
            
            <ToolbarButton
              icon="RotateCw"
              label="Rotate"
              onClick={onRotate}
            />
            
            <ToolbarButton
              icon="FlipHorizontal"
              label="Flip"
              onClick={onFlip}
            />
            
            <div className="w-px h-6 bg-surface-600 mx-2" />
            
            <Button
              onClick={onExport}
              className="hover-glow"
            >
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Toolbar;