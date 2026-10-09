import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Heart,
  Plus,
  Minus,
  AlertCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { PlatformId, InterestCategoryId } from '../types/reel';
import { PLATFORMS, CATEGORIES } from '../data/categories';

interface DynamicNotchProps {
  currentPlatform: PlatformId;
  onSelectPlatform: (platform: PlatformId) => void;
  reelCount: number;
  onIncrementReel: () => void;
  onDecrementReel: () => void;
  watchTimeSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetSession: () => void;
  currentCategory: InterestCategoryId;
  onChangeCategory: (cat: InterestCategoryId) => void;
  onLikeCurrentReel?: () => void;
  isCurrentLiked?: boolean;
  reelLimit?: number;
  onOpenSuggestions?: () => void;
  compactOnly?: boolean;
}

export const DynamicNotch: React.FC<DynamicNotchProps> = ({
  currentPlatform,
  onSelectPlatform,
  reelCount,
  onIncrementReel,
  onDecrementReel,
  watchTimeSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetSession,
  currentCategory,
  onChangeCategory,
  onLikeCurrentReel,
  isCurrentLiked = false,
  reelLimit = 25,
  onOpenSuggestions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const platform = PLATFORMS[currentPlatform];
  const categoryMeta = CATEGORIES[currentCategory];

  // Formatting time MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const avgSecondsPerReel = reelCount > 0 ? Math.round(watchTimeSeconds / reelCount) : 0;
  const isOverLimit = reelCount >= reelLimit;

  // Pace status calculation
  const getPaceStatus = () => {
    if (reelCount === 0) return { label: 'Idle', color: 'text-slate-400' };
    if (avgSecondsPerReel < 12) return { label: 'Speed Swiping', color: 'text-amber-400' };
    if (avgSecondsPerReel > 45) return { label: 'Deep Watching', color: 'text-cyan-400' };
    return { label: 'Balanced Pace', color: 'text-emerald-400' };
  };

  const pace = getPaceStatus();

  return (
    <div className="relative z-50 flex justify-center w-full px-2">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`relative bg-black text-white shadow-2xl border transition-colors ${
          isOverLimit
            ? 'border-amber-500/50 shadow-amber-500/10'
            : 'border-white/10 shadow-black/80'
        } ${
          isExpanded
            ? 'w-full max-w-xl rounded-3xl p-5'
            : 'w-auto min-w-[280px] max-w-sm rounded-full py-2 px-4 cursor-pointer hover:border-white/20'
        }`}
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        {/* Subtle camera lens & sensor reflection */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
        </div>

        {/* COMPACT PILL STATE */}
        {!isExpanded && (
          <div className="flex items-center justify-between gap-3">
            {/* Left: Platform Indicator & Camera Sensor */}
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-black shrink-0"
                style={{ backgroundColor: platform.brandColor }}
                title={platform.name}
              />
              <span className="text-xs font-semibold tracking-tight text-white whitespace-nowrap">
                {platform.name}
              </span>
            </div>

            {/* Center: Reel Count & Timer */}
            <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
              <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                #{reelCount} <span className="font-sans text-[10px] text-slate-300 font-normal">reels</span>
              </span>
              <span className="text-slate-400">·</span>
              <span className={`font-semibold ${isTimerRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                {formatTime(watchTimeSeconds)}
              </span>
            </div>

            {/* Right: Audio Wavelet & Expand affordance */}
            <div className="flex items-center gap-1.5 text-slate-400">
              {isTimerRunning && (
                <div className="flex items-center gap-0.5 h-3 px-1">
                  <motion.div
                    animate={{ height: ['4px', '12px', '4px'] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                    className="w-0.5 bg-rose-400 rounded-full"
                  />
                  <motion.div
                    animate={{ height: ['8px', '4px', '10px'] }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                    className="w-0.5 bg-amber-400 rounded-full"
                  />
                  <motion.div
                    animate={{ height: ['4px', '11px', '5px'] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                    className="w-0.5 bg-cyan-400 rounded-full"
                  />
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        )}

        {/* EXPANDED ISLAND STATE */}
        {isExpanded && (
          <div className="flex flex-col gap-4 pt-1" onClick={(e) => e.stopPropagation()}>
            {/* Header: Platform Switcher & Minimize */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl">
                {(['instagram', 'facebook', 'snapchat'] as PlatformId[]).map((pId) => {
                  const p = PLATFORMS[pId];
                  const isActive = currentPlatform === pId;
                  return (
                    <button
                      key={pId}
                      onClick={() => onSelectPlatform(pId)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.brandColor }}
                      />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  aria-label="Collapse Notch"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Over Limit Conscious Alert */}
            {isOverLimit && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Conscious Goal hit: <strong>{reelCount} reels</strong> ({formatTime(watchTimeSeconds)}) watched!
                  </span>
                </div>
                {onOpenSuggestions && (
                  <button
                    onClick={onOpenSuggestions}
                    className="text-amber-300 font-semibold hover:underline shrink-0 flex items-center gap-1"
                  >
                    Swap Feed <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Metric 1: Reels Counter */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="text-[11px] font-medium text-slate-400 mb-1">Reels Counted</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={onDecrementReel}
                    disabled={reelCount <= 0}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white transition-colors"
                    title="Decrease Reel"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-display font-extrabold text-2xl text-white font-mono tabular-nums">
                    {reelCount}
                  </span>
                  <button
                    onClick={onIncrementReel}
                    className="w-7 h-7 rounded-lg bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-colors shadow-sm"
                    title="Next Reel (+1)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Goal: {reelLimit} max</div>
              </div>

              {/* Metric 2: Live Watch Timer */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="text-[11px] font-medium text-slate-400 mb-1">Watch Duration</div>
                <div className="font-display font-extrabold text-2xl font-mono tabular-nums text-white">
                  {formatTime(watchTimeSeconds)}
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <button
                    onClick={onToggleTimer}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 transition-colors ${
                      isTimerRunning
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-2.5 h-2.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5" /> Resume
                      </>
                    )}
                  </button>
                  <button
                    onClick={onResetSession}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                    title="Reset watch timer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Metric 3: Pacing & Rhythm */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <div className="text-[11px] font-medium text-slate-400 mb-1">Avg Dwell / Pace</div>
                <div className="font-display font-extrabold text-2xl font-mono tabular-nums text-white">
                  {avgSecondsPerReel}s
                </div>
                <div className={`text-[10px] font-medium mt-1 ${pace.color}`}>
                  {pace.label}
                </div>
              </div>
            </div>

            {/* Current Reel Category Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Reel Topic / Tag:</span>
                <span className="font-medium text-white">{categoryMeta.label}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(
                  [
                    'tech_coding',
                    'fitness_health',
                    'culinary_food',
                    'travel_adventure',
                    'comedy_humor',
                    'business_growth',
                    'mindless_doomscroll',
                  ] as InterestCategoryId[]
                ).map((catId) => {
                  const c = CATEGORIES[catId];
                  const isCatActive = currentCategory === catId;
                  return (
                    <button
                      key={catId}
                      onClick={() => onChangeCategory(catId)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                        isCatActive
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              <button
                onClick={onIncrementReel}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Next Reel (+1 Count)</span>
              </button>

              {onLikeCurrentReel && (
                <button
                  onClick={onLikeCurrentReel}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs ${
                    isCurrentLiked
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Mark reel as loved"
                >
                  <Heart
                    className={`w-4 h-4 ${isCurrentLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                  />
                </button>
              )}

              {onOpenSuggestions && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenSuggestions();
                  }}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Suggestions</span>
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
