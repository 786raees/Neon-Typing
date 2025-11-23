import { Theme } from "../types";

export const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse r, g, b
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Helper to set variable
  const setVar = (name: string, hex: string) => {
    root.style.setProperty(name, hexToRgb(hex));
  };

  setVar('--color-bg', theme.colors.bg);
  setVar('--color-main', theme.colors.main);
  setVar('--color-sub', theme.colors.sub);
  setVar('--color-primary', theme.colors.primary);
  setVar('--color-error', theme.colors.error);
  
  // Also set raw hex for things that might need it (though RGB var is better for tailwind)
  // We only need the RGB triplet for Tailwind's `rgba(var(--c), opacity)` syntax.
};