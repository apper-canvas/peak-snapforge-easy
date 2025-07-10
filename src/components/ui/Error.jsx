import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Error"
}) => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-surface-100 mb-2"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-surface-400 mb-6"
        >
          {message}
        </motion.p>
        
        {onRetry && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onRetry}
              className="hover-glow"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Error;