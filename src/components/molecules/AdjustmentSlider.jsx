import React from "react";
import Label from "@/components/atoms/Label";
import Slider from "@/components/atoms/Slider";

const AdjustmentSlider = ({ 
  label, 
  value, 
  onChange, 
  min = -100, 
  max = 100, 
  step = 1,
  showValue = true,
  unit = ""
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-surface-200">{label}</Label>
        {showValue && (
          <span className="text-sm text-surface-400 font-mono">
            {value}{unit}
          </span>
        )}
      </div>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default AdjustmentSlider;