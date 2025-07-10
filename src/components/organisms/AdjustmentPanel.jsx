import React from "react";
import { motion } from "framer-motion";
import AdjustmentSlider from "@/components/molecules/AdjustmentSlider";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AdjustmentPanel = ({ 
  adjustments, 
  onAdjustmentChange, 
  onReset 
}) => {
  const hasChanges = Object.values(adjustments).some(value => 
    typeof value === 'number' ? value !== 0 : value !== 1
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface-800 rounded-lg border border-surface-700 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-100">Adjustments</h3>
        {hasChanges && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-surface-400 hover:text-surface-200"
          >
            <ApperIcon name="RotateCcw" size={14} className="mr-1" />
            Reset
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <AdjustmentSlider
          label="Brightness"
          value={adjustments.brightness}
          onChange={(e) => onAdjustmentChange('brightness', parseInt(e.target.value))}
          min={-100}
          max={100}
          step={1}
        />
        
        <AdjustmentSlider
          label="Contrast"
          value={adjustments.contrast}
          onChange={(e) => onAdjustmentChange('contrast', parseInt(e.target.value))}
          min={-100}
          max={100}
          step={1}
        />
        
        <AdjustmentSlider
          label="Saturation"
          value={Math.round((adjustments.saturation - 1) * 100)}
          onChange={(e) => onAdjustmentChange('saturation', 1 + parseInt(e.target.value) / 100)}
          min={-100}
          max={100}
          step={1}
          unit="%"
        />
        
        <AdjustmentSlider
          label="Hue"
          value={adjustments.hue}
          onChange={(e) => onAdjustmentChange('hue', parseInt(e.target.value))}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />
      </div>
    </motion.div>
  );
};

export default AdjustmentPanel;