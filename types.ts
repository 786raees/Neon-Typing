export enum GameState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

export enum TestMode {
  TIME = 'TIME',
  WORDS = 'WORDS',
}

export enum Topic {
  GENERAL = 'General',
  CODING = 'Coding',
  SCIFI = 'Sci-Fi',
  HISTORY = 'History',
  PHILOSOPHY = 'Philosophy',
}

export interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  timeElapsed: number;
  history: { time: number; wpm: number; raw: number }[];
}

export interface WordObj {
  original: string;
  chars: { char: string; status: 'correct' | 'incorrect' | 'pending' | 'extra' }[];
}

export interface ThemeColors {
  bg: string;      // Background
  main: string;    // Main text
  sub: string;     // Secondary text / Surface
  primary: string; // Accent / Correct / Cursor
  error: string;   // Incorrect
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}