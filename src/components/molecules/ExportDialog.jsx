import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Slider from "@/components/atoms/Slider";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";

const ExportDialog = ({ 
  isOpen, 
  onClose, 
  onExport, 
  formats, 
  qualitySettings 
}) => {
  const [selectedFormat, setSelectedFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat, quality);
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const selectedFormatData = formats.find(f => f.mimeType === selectedFormat);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-surface-100">Export Image</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Format</Label>
                <Select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  {formats.map(format => (
                    <option key={format.mimeType} value={format.mimeType}>
                      {format.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              {selectedFormatData?.quality && (
                <div>
                  <Label className="mb-2 block">Quality</Label>
                  <Slider
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    min={0.1}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-surface-400 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Download" size={16} className="mr-2" />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportDialog;