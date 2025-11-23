import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TestMode, Topic, Stats, Theme } from './types';
import { generateText } from './services/gemini';
import { Caret } from './components/Caret';
import { Results } from './components/Results';
import { ConfigBar } from './components/ConfigBar';
import { ThemeSelector } from './components/ThemeSelector';
import { RefreshCw, Loader2, Volume2, VolumeX, Palette } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { playKeySound, playFinishSound } from './utils/sounds';
import { THEMES } from './constants';
import { applyTheme } from './utils/theme';

const App: React.FC = () => {
  // Config State
  const [mode, setMode] = useState<TestMode>(TestMode.TIME);
  const [duration, setDuration] = useState(30);
  const [wordCount, setWordCount] = useState(25);
  const [topic, setTopic] = useState<Topic>(Topic.GENERAL);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [text, setText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [loading, setLoading] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState<Stats | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpmHistory, setWpmHistory] = useState<{time: number, wpm: number, raw: number}[]>([]);

  // Animation Controls
  const shakeControls = useAnimation();

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor Position
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });

  // --- Initialization ---

  // Apply Theme Effect
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const fetchNewText = useCallback(async () => {
    setLoading(true);
    const length = mode === TestMode.WORDS ? (wordCount <= 25 ? 'short' : wordCount <= 50 ? 'medium' : 'long') : (duration <= 30 ? 'medium' : 'long');
    const newText = await generateText(topic, length);
    
    let processedText = newText.replace(/\s+/g, ' ').trim();
    
    if (mode === TestMode.WORDS) {
      const words = processedText.split(' ');
      if (words.length > wordCount) {
        processedText = words.slice(0, wordCount).join(' ');
      }
    }
    
    setText(processedText);
    setUserInput("");
    setGameState(GameState.IDLE);
    setTimeLeft(duration);
    setStats(null);
    setWpmHistory([]);
    setStartTime(null);
    setLoading(false);
    
    // Focus input after load
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [mode, duration, wordCount, topic]);

  useEffect(() => {
    fetchNewText();
  }, [fetchNewText]);

  useEffect(() => {
    if (gameState === GameState.IDLE) {
      setTimeLeft(duration);
    }
  }, [duration, gameState]);

  // --- Game Logic ---

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    const timeElapsedMin = (now - startTime) / 1000 / 60;
    const currentInput = userInput;
    
    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const wpm = timeElapsedMin > 0 ? (correctChars / 5) / timeElapsedMin : 0;
    const rawWpm = timeElapsedMin > 0 ? (currentInput.length / 5) / timeElapsedMin : 0;
    const accuracy = currentInput.length > 0 ? (correctChars / currentInput.length) * 100 : 100;

    return {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      missedChars: text.length - currentInput.length,
      timeElapsed: (now - startTime) / 1000,
      history: wpmHistory
    };
  }, [startTime, userInput, text, wpmHistory]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(GameState.FINISHED);
    const finalStats = calculateStats();
    if (finalStats) setStats(finalStats);
    if (soundEnabled) playFinishSound();
  }, [calculateStats, soundEnabled]);

  // Timer Effect
  useEffect(() => {
    if (gameState === GameState.RUNNING && mode === TestMode.TIME) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          const currentStats = calculateStats();
          if (currentStats) {
            setWpmHistory(h => [...h, { 
              time: Math.floor(currentStats.timeElapsed), 
              wpm: currentStats.wpm, 
              raw: currentStats.rawWpm 
            }]);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, mode, endGame, calculateStats]);

  // Check for completion (Words mode OR running out of text in Time mode)
  useEffect(() => {
    if (gameState === GameState.RUNNING) {
      // If we've reached the end of the text, end the game immediately.
      if (userInput.length >= text.length) {
        endGame();
      }
    }
  }, [userInput, text, gameState, endGame]);


  // Input Handling
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === GameState.FINISHED || loading || isThemeModalOpen) return;

    const val = e.target.value;

    // Prevent typing beyond the available text
    if (val.length > text.length) return;

    // Feedback (Sound & Vibration)
    if (val.length > userInput.length) {
        const charIndex = val.length - 1;
        const isCorrect = val[charIndex] === text[charIndex];
        
        if (soundEnabled) {
            playKeySound(isCorrect);
        }

        if (!isCorrect) {
            // Visual Shake
            shakeControls.start({
                x: [-4, 4, -4, 4, 0],
                transition: { duration: 0.2 }
            });

            // Haptic Vibration
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try {
                    navigator.vibrate(30);
                } catch(e) {
                    // Ignore if not supported/allowed
                }
            }
        }
    }

    if (gameState === GameState.IDLE) {
      setGameState(GameState.RUNNING);
      setStartTime(Date.now());
    }

    setUserInput(val);
  };

  // Update Caret Position
  useEffect(() => {
    const currentIndex = userInput.length;
    // If at the end, we might not have a ref for the next char, so we use the last char's position + width or similar logic.
    // Simplified: stick to the current char or the last one.
    
    if (containerRef.current) {
      let targetEl = letterRefs.current[currentIndex];
      
      if (targetEl) {
        setCaretPos({
          top: targetEl.offsetTop,
          left: targetEl.offsetLeft,
        });
      } else if (currentIndex > 0 && letterRefs.current[currentIndex - 1]) {
        // Fallback for end of text caret position (approximated)
        const prevEl = letterRefs.current[currentIndex - 1];
        if (prevEl) {
          setCaretPos({
            top: prevEl.offsetTop,
            left: prevEl.offsetLeft + prevEl.offsetWidth,
          });
        }
      }
    }
  }, [userInput, text, loading]);

  // Focus Handler
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // --- Render Helpers ---

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = "font-mono text-[1.75rem] leading-[2.5rem] transition-colors duration-100 ";
      const userChar = userInput[index];
      const isSpace = char === ' ';
      
      if (userChar == null) {
        // Not typed
        className += "text-sub opacity-40"; 
      } else if (userChar === char) {
        // Correct
        className += "text-main"; 
      } else {
        // Incorrect
        className += "text-error border-b-2 border-error/50";
        if (isSpace) className += " bg-error/20";
      }

      return (
        <span
          key={index}
          ref={(el) => { letterRefs.current[index] = el; }}
          className={className}
          style={{ 
            display: 'inline-block', 
            minWidth: isSpace ? '0.6em' : undefined // Prevent space collapse
          }}
        >
          {char}
        </span>
      );
    });
  };

  const focusMode = gameState === GameState.RUNNING;

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-6 sm:px-8 transition-colors duration-500 bg-bg">
      
      <ThemeSelector 
        currentTheme={theme} 
        setTheme={setTheme} 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />

      {/* Header */}
      <div 
        className={`w-full max-w-4xl flex justify-between items-end mb-16 transition-opacity duration-500 ${focusMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}
      >
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-sub tracking-tight flex items-center gap-3 transition-all duration-500">
             NeonType <span className="text-[10px] leading-3 bg-sub/20 text-primary px-1.5 py-0.5 rounded border border-sub/20 font-mono font-medium uppercase tracking-widest" style={{ boxShadow: '0 0 10px rgba(var(--color-primary), 0.1)' }}>Gemini</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
             <button 
                onClick={() => setIsThemeModalOpen(true)}
                className="text-sub hover:text-primary transition-colors"
                title="Change Theme"
            >
                <Palette size={20} />
            </button>
            <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-sub hover:text-primary transition-colors"
                title="Toggle Sound"
            >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {gameState !== GameState.FINISHED && (
                <div className="text-4xl font-mono font-bold text-primary tabular-nums" style={{ textShadow: '0 0 15px rgba(var(--color-primary), 0.4)' }}>
                    {mode === TestMode.TIME ? timeLeft : `${userInput.length}/${text.length}`}
                </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="animate-spin text-primary" style={{ filter: 'drop-shadow(0 0 10px rgba(var(--color-primary),0.8))' }} size={48} />
            <p className="text-sub text-sm font-mono animate-pulse">Generating text...</p>
          </motion.div>
        ) : gameState === GameState.FINISHED && stats ? (
          <Results key="results" stats={stats} onRestart={fetchNewText} theme={theme} />
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <div className={`transition-all duration-500 ${focusMode ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
                <ConfigBar 
                mode={mode} setMode={setMode}
                duration={duration} setDuration={setDuration}
                wordCount={wordCount} setWordCount={setWordCount}
                topic={topic} setTopic={setTopic}
                disabled={gameState === GameState.RUNNING}
                />
            </div>

            {/* Typing Area */}
            <div 
              className={`relative w-full min-h-[180px] outline-none cursor-text mt-8 transition-all duration-500 ${focusMode ? 'scale-105' : 'scale-100'}`}
              onClick={handleContainerClick}
            >
              {/* Hidden Input */}
              <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default z-0"
                value={userInput}
                onChange={handleInput}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {/* Display Text Wrapper */}
              <motion.div 
                ref={containerRef} 
                animate={shakeControls}
                className="relative z-10 flex flex-wrap content-start gap-x-0 leading-relaxed tracking-wide text-justify break-words select-none"
              >
                {/* Caret */}
                {gameState !== GameState.FINISHED && !loading && (
                    <Caret top={caretPos.top} left={caretPos.left} />
                )}
                
                {renderText()}
              </motion.div>

               {/* Overlay hints for IDLE state */}
               {gameState === GameState.IDLE && userInput.length === 0 && (
                  <div className="absolute -top-12 left-0 flex items-center gap-2 text-primary/50 text-sm animate-pulse font-mono">
                     Type to start...
                  </div>
               )}
            </div>

            {/* Restart Button */}
            <button 
              onClick={fetchNewText}
              className={`mt-16 p-4 rounded-full bg-sub/20 text-sub hover:text-primary hover:bg-sub/40 transition-all duration-300 ${focusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              title="Restart Test"
            >
              <RefreshCw size={24} />
            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Shortcuts */}
      <div className={`fixed bottom-6 text-sub text-xs font-mono flex gap-6 transition-all duration-500 ${focusMode ? 'opacity-0' : 'opacity-60 hover:opacity-100'}`}>
        <span className="flex items-center gap-1.5"><kbd className="bg-sub/10 px-1.5 py-0.5 rounded border border-sub/20 text-main">tab</kbd> <span className="text-sub">+</span> <kbd className="bg-sub/10 px-1.5 py-0.5 rounded border border-sub/20 text-main">enter</kbd> restart</span>
        <span className="flex items-center gap-1.5"><kbd className="bg-sub/10 px-1.5 py-0.5 rounded border border-sub/20 text-main">esc</kbd> end</span>
      </div>

      {/* Key Listener for Shortcuts */}
      <KeyboardHandler onRestart={fetchNewText} onEnd={endGame} />

    </div>
  );
};

const KeyboardHandler: React.FC<{ onRestart: () => void; onEnd: () => void }> = ({ onRestart, onEnd }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.target instanceof HTMLElement) {
        e.preventDefault();
        onRestart();
      }
      if (e.key === 'Escape') {
        onEnd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart, onEnd]);
  return null;
};

export default App;