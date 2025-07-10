import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ToolbarButton = ({ 
  icon, 
  label, 
  onClick, 
  isActive = false, 
  disabled = false,
  variant = "ghost",
  size = "default"
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 relative group",
        isActive && "bg-primary-500 text-white hover:bg-primary-600"
      )}
    >
      <ApperIcon name={icon} size={16} />
      <span className="text-sm">{label}</span>
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />
      )}
    </Button>
  );
};

export default ToolbarButton;