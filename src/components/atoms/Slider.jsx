import React from "react";
import { cn } from "@/utils/cn";

const Slider = React.forwardRef(({ 
  className, 
  value = 0, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  ...props 
}, ref) => {
  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-900",
          className
        )}
        ref={ref}
        {...props}
      />
      <div 
        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg pointer-events-none"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;