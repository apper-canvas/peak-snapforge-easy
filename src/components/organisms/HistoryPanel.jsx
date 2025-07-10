import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const HistoryPanel = ({ 
  history, 
  currentIndex, 
  onHistorySelect 
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-surface-800 rounded-lg border border-surface-700 p-4">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">History</h3>
        <div className="text-center text-surface-400">
          <ApperIcon name="History" size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No history yet</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-800 rounded-lg border border-surface-700 p-4"
    >
      <h3 className="text-lg font-semibold text-surface-100 mb-4">History</h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.map((item, index) => (
          <motion.div
            key={item.timestamp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={index === currentIndex ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistorySelect(index)}
              className="w-full justify-start text-left"
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="History" size={14} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.action}
                  </div>
                  <div className="text-xs text-surface-400">
                    {format(new Date(item.timestamp), "HH:mm:ss")}
                  </div>
                </div>
                {index === currentIndex && (
                  <div className="w-2 h-2 bg-primary-400 rounded-full" />
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HistoryPanel;