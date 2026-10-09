import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { PlatformId, InterestCategoryId } from '../types/reel';
import { PLATFORMS, CATEGORIES } from '../data/categories';
import { DynamicNotch } from './DynamicNotch';

interface CompanionHUDProps {
  currentPlatform: PlatformId;
  onSelectPlatform: (platform: PlatformId) => void;
  reelCount: number;
  onIncrementReel: (category?: InterestCategoryId) => void;
  onDecrementReel: () => void;
  watchTimeSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetSession: () => void;
  reelLimit: number;
  onOpenSuggestions: () => void;
}

export const CompanionHUD: React.FC<CompanionHUDProps> = ({
  currentPlatform,
  onSelectPlatform,
  reelCount,
  onIncrementReel,
  onDecrementReel,
  watchTimeSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetSession,
  reelLimit,
  onOpenSuggestions,
}) => {
  const [selectedTag, setSelectedTag] = useState<InterestCategoryId>('tech_coding');
  const [recentlyCounted, setRecentlyCounted] = useState(false);

  const platform = PLATFORMS[currentPlatform];
  const avgSeconds = reelCount > 0 ? Math.round(watchTimeSeconds / reelCount) : 0;

  const handleQuickAdd = () => {
    onIncrementReel(selectedTag);
    setRecentlyCounted(true);
    setTimeout(() => setRecentlyCounted(false), 800);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      {/* Top Floating Dynamic Notch Preview */}
      <div className="flex flex-col items-center">
        <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">
          Floating Dynamic Notch HUD
        </div>
        <DynamicNotch
          currentPlatform={currentPlatform}
          onSelectPlatform={onSelectPlatform}
          reelCount={reelCount}
          onIncrementReel={handleQuickAdd}
          onDecrementReel={onDecrementReel}
          watchTimeSeconds={watchTimeSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={onToggleTimer}
          onResetSession={onResetSession}
          currentCategory={selectedTag}
          onChangeCategory={(cat) => setSelectedTag(cat)}
          reelLimit={reelLimit}
          onOpenSuggestions={onOpenSuggestions}
        />
      </div>

      {/* Companion Control Dashboard */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: platform.brandColor }}
              />
              <h2 className="text-xl font-bold font-display text-white">
                Companion Counter for {platform.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Log reels in real-time as you scroll on your phone or desktop tabs.
            </p>
          </div>

          {/* Quick Platform Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            {(['instagram', 'facebook', 'snapchat'] as PlatformId[]).map((pId) => {
              const p = PLATFORMS[pId];
              const isActive = currentPlatform === pId;
              return (
                <button
                  key={pId}
                  onClick={() => onSelectPlatform(pId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Tactile Quick-Clicker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 items-center">
          {/* Main Reel Clicker Button */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80">
            <div className="text-xs font-mono text-slate-400 mb-2">Total Reels Counted</div>
            <motion.div
              animate={{ scale: recentlyCounted ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-6xl font-display font-black text-white font-mono tabular-nums mb-4"
            >
              #{reelCount}
            </motion.div>

            {/* Giant Swiped Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleQuickAdd}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+1 Reel Swiped (Space)</span>
            </motion.button>

            <div className="flex items-center justify-between w-full mt-3 px-1 text-xs text-slate-400">
              <button
                onClick={onDecrementReel}
                disabled={reelCount <= 0}
                className="hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> Undo last
              </button>
              <span className="font-mono text-[11px]">Goal: {reelLimit} max</span>
            </div>
          </div>

          {/* Watch Time & Pacing Card */}
          <div className="flex flex-col justify-between p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 h-full">
            <div>
              <div className="text-xs font-mono text-slate-400 mb-1">Session Watch Time</div>
              <div className="text-4xl font-display font-black text-white font-mono tabular-nums mb-3 flex items-center gap-3">
                <Clock className="w-7 h-7 text-emerald-400" />
                <span>{formatTime(watchTimeSeconds)}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Average Per Reel:</span>
                  <span className="font-semibold font-mono text-white">{avgSeconds}s / reel</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Current Pacing:</span>
                  <span className="font-semibold text-emerald-400">
                    {avgSeconds > 40 ? 'Intentional Deep Dwell' : 'Rapid Swiping'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Active Platform:</span>
                  <span className="font-semibold text-white">{platform.reelTerm}</span>
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={onToggleTimer}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isTimerRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Stopwatch
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume Stopwatch
                  </>
                )}
              </button>

              <button
                onClick={onResetSession}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Reset session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tagger for Active Reel */}
        <div>
          <div className="text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
            <span>Tag Reel Category (helps curate suggestions):</span>
            <span className="text-slate-400">Selected: {CATEGORIES[selectedTag]?.label}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {(Object.keys(CATEGORIES) as InterestCategoryId[]).map((catId) => {
              const cat = CATEGORIES[catId];
              const isSelected = selectedTag === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedTag(catId)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-left truncate flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-white text-slate-950 font-bold border-white shadow-sm'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
