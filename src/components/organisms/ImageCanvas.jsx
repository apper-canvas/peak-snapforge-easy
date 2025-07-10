import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ZoomControls from "@/components/molecules/ZoomControls";
import Empty from "@/components/ui/Empty";

const ImageCanvas = ({ 
  imageData, 
  onImageLoad,
  zoom,
  onZoomChange,
  className = ""
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData]);
  
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 5);
    onZoomChange(newZoom);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    onZoomChange(newZoom);
  };
  
  const handleZoomReset = () => {
    onZoomChange(1);
    setCanvasPosition({ x: 0, y: 0 });
  };
  
  const handleZoomFit = () => {
    if (imageData && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40;
      const containerHeight = container.clientHeight - 40;
      
      const scaleX = containerWidth / imageData.width;
      const scaleY = containerHeight / imageData.height;
      const scale = Math.min(scaleX, scaleY, 1);
      
      onZoomChange(scale);
      setCanvasPosition({ x: 0, y: 0 });
    }
  };
  
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    onZoomChange(newZoom);
  };
  
  if (!imageData) {
    return (
      <div className={`bg-surface-900 rounded-lg border border-surface-700 ${className}`}>
        <Empty
          title="No Image Loaded"
          description="Drag and drop an image here or click to upload"
          actionLabel="Upload Image"
          onAction={onImageLoad}
          icon="ImagePlus"
        />
      </div>
    );
  }
  
  return (
    <div className={`bg-surface-900 rounded-lg border border-surface-700 relative overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center relative bg-checker"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <motion.div
          animate={{
            x: canvasPosition.x,
            y: canvasPosition.y,
            scale: zoom
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="canvas-container"
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{ 
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
              imageRendering: zoom > 1 ? 'pixelated' : 'auto'
            }}
          />
        </motion.div>
      </div>
      
      <div className="absolute bottom-4 right-4">
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onZoomFit={handleZoomFit}
        />
      </div>
    </div>
  );
};

export default ImageCanvas;