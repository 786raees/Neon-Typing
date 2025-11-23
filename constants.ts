import { Topic, Theme } from './types';

export const FALLBACK_TEXTS: Record<Topic, string> = {
  [Topic.GENERAL]: "The quick brown fox jumps over the lazy dog. Consistency is the key to mastery. Keep typing and you will improve over time.",
  [Topic.CODING]: "function binarySearch(arr, target) { let left = 0; let right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; } return -1; }",
  [Topic.SCIFI]: "The stars drifted past the viewscreen like silent ghosts of a bygone era. The warp drive hummed with a latent energy, promising worlds unseen.",
  [Topic.HISTORY]: "The Industrial Revolution marked a major turning point in history. almost every aspect of daily life was influenced in some way.",
  [Topic.PHILOSOPHY]: "I think, therefore I am. The unexamined life is not worth living. To be is to be perceived.",
};

export const DURATION_OPTIONS = [15, 30, 60];
export const WORD_COUNT_OPTIONS = [10, 25, 50, 100];

export const THEMES: Theme[] = [
  {
    id: 'neon',
    name: 'Neon',
    colors: { bg: '#0f172a', main: '#e2e8f0', sub: '#64748b', primary: '#22d3ee', error: '#f87171' }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    colors: { bg: '#000000', main: '#00ff41', sub: '#1a401a', primary: '#008f11', error: '#da3333' }
  },
  {
    id: 'light',
    name: 'Light',
    colors: { bg: '#ffffff', main: '#374151', sub: '#9ca3af', primary: '#2563eb', error: '#ef4444' }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: { bg: '#282a36', main: '#f8f8f2', sub: '#6272a4', primary: '#bd93f9', error: '#ff5555' }
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    colors: { bg: '#2a0c4a', main: '#fcee0a', sub: '#b829a6', primary: '#00f0ff', error: '#ff2a2a' }
  },
  {
    id: 'stealth',
    name: 'Stealth',
    colors: { bg: '#111111', main: '#777777', sub: '#333333', primary: '#e0e0e0', error: '#ff3333' }
  },
  {
    id: 'sakura',
    name: 'Sakura',
    colors: { bg: '#fff5f7', main: '#5c2c38', sub: '#d68a9c', primary: '#ff69b4', error: '#ff0000' }
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: { bg: '#1b2b1b', main: '#e8f5e9', sub: '#587a58', primary: '#66bb6a', error: '#ef5350' }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: { bg: '#2d1b2e', main: '#fff0f5', sub: '#6b4c5e', primary: '#ff9e64', error: '#ff4d4d' }
  },
  {
    id: 'coffee',
    name: 'Coffee',
    colors: { bg: '#2c2520', main: '#e6dcca', sub: '#635245', primary: '#d4a373', error: '#ff6b6b' }
  }
];