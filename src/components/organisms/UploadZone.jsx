import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const UploadZone = ({ onFileUpload, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileUpload(imageFile);
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
    e.target.value = '';
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200 ease-out
        ${isDragOver 
          ? 'border-primary-500 bg-primary-500/10' 
          : 'border-surface-600 hover:border-surface-500 hover:bg-surface-800/50'
        }
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <motion.div
        animate={{ scale: isDragOver ? 1.1 : 1 }}
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center"
      >
        <ApperIcon 
          name={isDragOver ? "ImagePlus" : "Upload"} 
          size={32} 
          className="text-primary-400" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-surface-100 mb-2">
        {isDragOver ? "Drop your image here" : "Upload an image"}
      </h3>
      
      <p className="text-surface-400 mb-4">
        Drag and drop an image file or click to browse
      </p>
      
      <Button
        variant="outline"
        className="hover-glow"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        <ApperIcon name="Upload" size={16} className="mr-2" />
        Choose File
      </Button>
      
      <div className="mt-4 text-sm text-surface-500">
        Supports JPEG, PNG, and WebP formats
      </div>
    </motion.div>
  );
};

export default UploadZone;