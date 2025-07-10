import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Empty = ({ 
  title = "No Image Loaded", 
  description = "Upload an image to start editing",
  actionLabel = "Upload Image",
  onAction,
  icon = "ImagePlus"
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} size={40} className="text-primary-400" />
        </motion.div>
        
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-surface-100 mb-2"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-surface-400 mb-6"
        >
          {description}
        </motion.p>
        
        {onAction && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onAction}
              className="hover-glow"
            >
              <ApperIcon name={icon} size={16} className="mr-2" />
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;