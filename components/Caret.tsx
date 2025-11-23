import React from 'react';
import { motion } from 'framer-motion';

interface CaretProps {
  top: number;
  left: number;
}

export const Caret: React.FC<CaretProps> = ({ top, left }) => {
  return (
    <motion.div
      layoutId="caret"
      className="absolute w-[3px] h-[2.5rem] bg-primary rounded-full z-20 pointer-events-none"
      style={{ boxShadow: '0 0 12px 1px rgba(var(--color-primary), 0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ 
        top: top - 2, // Slight adjustment for visual alignment 
        left: left - 1,
        opacity: 1 
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.1
      }}
    />
  );
};