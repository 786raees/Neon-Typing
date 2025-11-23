import React from 'react';
import { TestMode, Topic } from '../types';
import { Clock, AlignLeft, Cpu, Globe, Terminal, BookOpen, BrainCircuit } from 'lucide-react';

interface ConfigBarProps {
  mode: TestMode;
  setMode: (m: TestMode) => void;
  duration: number;
  setDuration: (d: number) => void;
  wordCount: number;
  setWordCount: (c: number) => void;
  topic: Topic;
  setTopic: (t: Topic) => void;
  disabled: boolean;
}

export const ConfigBar: React.FC<ConfigBarProps> = ({
  mode, setMode,
  duration, setDuration,
  wordCount, setWordCount,
  topic, setTopic,
  disabled
}) => {
  if (disabled) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 bg-sub/10 backdrop-blur-md py-3 px-6 rounded-full border border-sub/20 mb-12 text-sm transition-all">
      
      {/* Mode Selector */}
      <div className="flex items-center gap-1 bg-bg/50 rounded-lg p-1">
        <button
          onClick={() => setMode(TestMode.TIME)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${mode === TestMode.TIME ? 'bg-primary/10 text-primary' : 'text-sub hover:text-main'}`}
        >
          <Clock size={14} /> Time
        </button>
        <button
          onClick={() => setMode(TestMode.WORDS)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${mode === TestMode.WORDS ? 'bg-primary/10 text-primary' : 'text-sub hover:text-main'}`}
        >
          <AlignLeft size={14} /> Words
        </button>
      </div>

      <div className="w-px h-6 bg-sub/20"></div>

      {/* Sub Options */}
      <div className="flex items-center gap-2 text-sub">
        {mode === TestMode.TIME ? (
          [15, 30, 60].map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-2 py-1 rounded hover:text-primary transition-colors ${duration === d ? 'text-primary font-bold' : ''}`}
            >
              {d}
            </button>
          ))
        ) : (
          [10, 25, 50, 100].map(c => (
            <button
              key={c}
              onClick={() => setWordCount(c)}
              className={`px-2 py-1 rounded hover:text-primary transition-colors ${wordCount === c ? 'text-primary font-bold' : ''}`}
            >
              {c}
            </button>
          ))
        )}
      </div>

      <div className="w-px h-6 bg-sub/20"></div>

      {/* Topic Selector */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-[300px] sm:max-w-none mask-linear">
        {[
          { t: Topic.GENERAL, icon: Globe },
          { t: Topic.CODING, icon: Terminal },
          { t: Topic.SCIFI, icon: Cpu },
          { t: Topic.HISTORY, icon: BookOpen },
          { t: Topic.PHILOSOPHY, icon: BrainCircuit },
        ].map(({ t, icon: Icon }) => (
           <button
              key={t}
              onClick={() => setTopic(t)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded hover:text-primary transition-colors whitespace-nowrap ${topic === t ? 'text-primary font-bold' : 'text-sub'}`}
              title={t}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{t}</span>
            </button>
        ))}
      </div>

    </div>
  );
};