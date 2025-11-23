import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Stats, Theme } from '../types';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

interface ResultsProps {
  stats: Stats;
  onRestart: () => void;
  theme: Theme;
}

export const Results: React.FC<ResultsProps> = ({ stats, onRestart, theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Main Stats Column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-sub/10 p-6 rounded-2xl border border-sub/20 backdrop-blur-sm">
          <div className="text-sub font-medium text-sm uppercase tracking-wider mb-1">WPM</div>
          <div className="text-6xl font-black text-primary drop-shadow-lg">
            {Math.round(stats.wpm)}
          </div>
          <div className="text-sub text-sm mt-2">Raw: {Math.round(stats.rawWpm)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-sub/10 p-4 rounded-xl border border-sub/20">
            <div className="flex items-center gap-2 text-sub text-xs uppercase mb-1">
              <Target size={14} /> Accuracy
            </div>
            <div className="text-2xl font-bold text-primary">
              {Math.round(stats.accuracy)}%
            </div>
          </div>
          <div className="bg-sub/10 p-4 rounded-xl border border-sub/20">
             <div className="flex items-center gap-2 text-sub text-xs uppercase mb-1">
              <Zap size={14} /> Chars
            </div>
            <div className="text-2xl font-bold text-main">
              <span className="text-primary">{stats.correctChars}</span>/
              <span className="text-error">{stats.incorrectChars}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-4 w-full py-4 bg-primary hover:opacity-90 text-bg font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          style={{ boxShadow: '0 0 20px rgba(var(--color-primary), 0.4)' }}
        >
          <RotateCcw size={20} /> Restart Test
        </button>
      </div>

      {/* Chart Column */}
      <div className="lg:col-span-2 bg-sub/5 rounded-2xl border border-sub/20 p-6 relative overflow-hidden">
        <h3 className="text-sub text-sm uppercase tracking-wider mb-6">Performance Over Time</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.history}>
              <CartesianGrid strokeDasharray="3 3" stroke={`rgba(var(--color-sub), 0.2)`} vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke={`rgba(var(--color-sub), 0.5)`} 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={`rgba(var(--color-sub), 0.5)`} 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: theme.colors.bg, border: `1px solid rgba(var(--color-sub), 0.2)`, borderRadius: '8px' }}
                itemStyle={{ color: theme.colors.primary }}
                labelStyle={{ color: theme.colors.sub }}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke={theme.colors.primary} 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: theme.colors.primary, stroke: theme.colors.bg, strokeWidth: 2 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="raw" 
                stroke={theme.colors.sub} 
                strokeWidth={2} 
                dot={false}
                strokeDasharray="4 4"
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};