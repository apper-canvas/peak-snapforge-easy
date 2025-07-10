import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Components
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Toolbar from "@/components/organisms/Toolbar";
import ImageCanvas from "@/components/organisms/ImageCanvas";
import AdjustmentPanel from "@/components/organisms/AdjustmentPanel";
import FilterPanel from "@/components/organisms/FilterPanel";
import HistoryPanel from "@/components/organisms/HistoryPanel";
import UploadZone from "@/components/organisms/UploadZone";
import ExportDialog from "@/components/molecules/ExportDialog";

// Services and utilities
import editorService from "@/services/api/editorService";
import { ImageProcessor, defaultAdjustments } from "@/utils/imageProcessing";

const Editor = () => {
  // Core state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageState, setImageState] = useState(null);
  
  // Editor state
  const [adjustments, setAdjustments] = useState(defaultAdjustments);
  const [activeFilter, setActiveFilter] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState(null);
  
  // UI state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormats, setExportFormats] = useState([]);
  const [qualitySettings, setQualitySettings] = useState([]);
  
  // Initialize editor
  useEffect(() => {
    initializeEditor();
  }, []);
  
  // Process image when adjustments or filters change
  useEffect(() => {
    if (imageState) {
      processImage();
    }
  }, [adjustments, activeFilter]);
  
  const initializeEditor = async () => {
    try {
      setLoading(true);
      const formats = editorService.getExportFormats();
      const qualities = editorService.getQualitySettings();
      
      setExportFormats(formats);
      setQualitySettings(qualities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const processImage = async () => {
    if (!imageState?.originalData) return;
    
    try {
      // Start with original image data
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = imageState.originalData.width;
      canvas.height = imageState.originalData.height;
      ctx.putImageData(imageState.originalData, 0, 0);
      
      let processedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Apply adjustments
      if (adjustments !== defaultAdjustments) {
        processedData = ImageProcessor.applyAdjustments(processedData, adjustments);
      }
      
      // Apply filter
      if (activeFilter && activeFilter.name !== "Original") {
        processedData = ImageProcessor.applyFilter(processedData, activeFilter);
      }
      
      setImageState(prev => ({
        ...prev,
        currentData: processedData
      }));
      
    } catch (err) {
      console.error("Processing error:", err);
      toast.error("Failed to process image");
    }
  };
  
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate file
      await editorService.validateFile(file);
      
      // Load image
      const imageData = await editorService.loadImage(file);
      
      setImageState(imageData);
      resetEditor();
      addToHistory("Image loaded");
      
      toast.success("Image loaded successfully");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const resetEditor = () => {
    setAdjustments(defaultAdjustments);
    setActiveFilter(null);
    setZoom(1);
    setActiveTool(null);
    setHistory([]);
    setCurrentHistoryIndex(-1);
  };
  
  const addToHistory = (action) => {
    const historyItem = {
      action,
      timestamp: Date.now(),
      previousState: imageState?.currentData ? 
        new ImageData(
          new Uint8ClampedArray(imageState.currentData.data),
          imageState.currentData.width,
          imageState.currentData.height
        ) : null
    };
    
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), historyItem];
    const limitedHistory = newHistory.slice(-editorService.getHistoryLimit());
    
    setHistory(limitedHistory);
    setCurrentHistoryIndex(limitedHistory.length - 1);
  };
  
  const handleAdjustmentChange = (type, value) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Debounce history addition
    clearTimeout(window.adjustmentTimeout);
    window.adjustmentTimeout = setTimeout(() => {
      addToHistory(`Adjusted ${type}`);
    }, 1000);
  };
  
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    addToHistory(`Applied ${filter.name} filter`);
  };
  
  const handleFilterReset = () => {
    setActiveFilter(null);
    addToHistory("Cleared filters");
  };
  
  const handleAdjustmentReset = () => {
    setAdjustments(defaultAdjustments);
    addToHistory("Reset adjustments");
  };
  
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevState = history[prevIndex].previousState;
      
      if (prevState) {
        setImageState(prev => ({
          ...prev,
          currentData: prevState
        }));
      }
      
      setCurrentHistoryIndex(prevIndex);
    }
  };
  
  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(nextIndex);
      // Reprocess image with current settings
      processImage();
    }
  };
  
  const handleHistorySelect = (index) => {
    setCurrentHistoryIndex(index);
    if (history[index].previousState) {
      setImageState(prev => ({
        ...prev,
        currentData: history[index].previousState
      }));
    }
  };
  
  const handleRotate = () => {
    if (imageState?.currentData) {
      const rotatedData = ImageProcessor.rotateImage(imageState.currentData, 90);
      setImageState(prev => ({
        ...prev,
        currentData: rotatedData,
        width: rotatedData.width,
        height: rotatedData.height
      }));
      addToHistory("Rotated image");
    }
  };
  
  const handleFlip = () => {
    if (imageState?.currentData) {
      const flippedData = ImageProcessor.flipImage(imageState.currentData, true);
      setImageState(prev => ({
        ...prev,
        currentData: flippedData
      }));
      addToHistory("Flipped image");
    }
  };
  
  const handleExport = async (format, quality) => {
    try {
      if (!imageState?.currentData) return;
      
      const result = await editorService.exportImage(
        imageState.currentData,
        format,
        quality
      );
      
      // Download file
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(result.url);
      
      toast.success("Image exported successfully");
    } catch (err) {
      toast.error("Export failed: " + err.message);
    }
  };
  
  if (loading) {
    return <Loading message="Loading editor..." />;
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={initializeEditor}
        title="Editor Error"
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-surface-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            SnapForge
          </h1>
          <p className="text-surface-400">
            Professional photo editing in your browser
          </p>
        </motion.div>
        
        {/* Toolbar */}
        <div className="mb-6">
          <Toolbar
            onUpload={handleFileUpload}
            onCrop={() => setActiveTool('crop')}
            onRotate={handleRotate}
            onFlip={handleFlip}
            onExport={() => setShowExportDialog(true)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={currentHistoryIndex > 0}
            canRedo={currentHistoryIndex < history.length - 1}
            hasImage={!!imageState}
            activeTool={activeTool}
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            {imageState ? (
              <ImageCanvas
                imageData={imageState.currentData}
                onImageLoad={handleFileUpload}
                zoom={zoom}
                onZoomChange={setZoom}
                className="h-[600px]"
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center">
                <UploadZone 
                  onFileUpload={handleFileUpload}
                  className="max-w-md"
                />
              </div>
            )}
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            {imageState && (
              <>
                <AdjustmentPanel
                  adjustments={adjustments}
                  onAdjustmentChange={handleAdjustmentChange}
                  onReset={handleAdjustmentReset}
                />
                
                <FilterPanel
                  imageData={imageState.currentData}
                  activeFilter={activeFilter}
                  onFilterSelect={handleFilterSelect}
                  onFilterReset={handleFilterReset}
                />
                
                <HistoryPanel
                  history={history}
                  currentIndex={currentHistoryIndex}
                  onHistorySelect={handleHistorySelect}
                />
              </>
            )}
          </div>
        </div>
        
        {/* Export Dialog */}
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExport}
          formats={exportFormats}
          qualitySettings={qualitySettings}
        />
      </div>
    </div>
  );
};

export default Editor;