import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../constants';
import { Theme } from '../types';
import { Check, Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: Theme;
  setTheme: (t: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, setTheme, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[80vh] overflow-y-auto bg-bg border border-sub/20 rounded-2xl shadow-2xl p-6 scrollbar-hide"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="flex items-center gap-3 mb-6 text-main border-b border-sub/10 pb-4">
              <Palette size={24} className="text-primary" />
              <h2 className="text-xl font-bold">Select Theme</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme);
                    // Optional: close on select
                    // onClose();
                  }}
                  className={`group relative flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:bg-sub/10 hover:border-sub/20'
                  }`}
                >
                  {/* Color Preview */}
                  <div className="flex gap-1 shrink-0">
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: theme.colors.bg }} />
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: theme.colors.main }} />
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: theme.colors.primary }} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span className={`font-mono font-medium ${currentTheme.id === theme.id ? 'text-primary' : 'text-main'}`}>
                      {theme.name}
                    </span>
                  </div>

                  {currentTheme.id === theme.id && (
                    <Check size={18} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
               <button 
                 onClick={onClose}
                 className="px-6 py-2 rounded-lg bg-sub/20 hover:bg-sub/30 text-sub hover:text-main transition-colors text-sm font-mono"
               >
                 Close
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};