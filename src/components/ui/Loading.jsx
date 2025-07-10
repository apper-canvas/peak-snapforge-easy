import React from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-surface-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full opacity-20" />
          </motion.div>
        </div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold text-surface-100 mb-2"
        >
          {message}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-surface-400"
        >
          Setting up your photo editor...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;