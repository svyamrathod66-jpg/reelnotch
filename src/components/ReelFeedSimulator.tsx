import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Music,
  UserCheck,
  TrendingUp,
  Check,
} from 'lucide-react';
import { ReelItem, PlatformId, InterestCategoryId } from '../types/reel';
import { DynamicNotch } from './DynamicNotch';
import { PLATFORMS, CATEGORIES } from '../data/categories';

interface ReelFeedSimulatorProps {
  reels: ReelItem[];
  currentPlatform: PlatformId;
  onSelectPlatform: (platform: PlatformId) => void;
  reelCount: number;
  watchTimeSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onIncrementReel: () => void;
  onDecrementReel: () => void;
  onResetSession: () => void;
  onReelSwiped: (reel: ReelItem, dwellTime: number, liked: boolean) => void;
  onOpenSuggestions: () => void;
  lovedCategories: Set<InterestCategoryId>;
}

export const ReelFeedSimulator: React.FC<ReelFeedSimulatorProps> = ({
  reels,
  currentPlatform,
  onSelectPlatform,
  reelCount,
  watchTimeSeconds,
  isTimerRunning,
  onToggleTimer,
  onIncrementReel,
  onDecrementReel,
  onResetSession,
  onReelSwiped,
  onOpenSuggestions,
  lovedCategories,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReelIds, setLikedReelIds] = useState<Set<string>>(new Set());
  const [bookmarkedReelIds, setBookmarkedReelIds] = useState<Set<string>>(new Set());
  const [currentReelDwell, setCurrentReelDwell] = useState(0);
  const dwellTimerRef = useRef<number | null>(null);

  // Filter reels by current platform or show matching
  const platformReels = reels.filter((r) => r.platform === currentPlatform);
  const currentReel = platformReels[currentIndex % (platformReels.length || 1)] || reels[0];

  // Track dwell time on current reel
  useEffect(() => {
    if (isTimerRunning) {
      dwellTimerRef.current = window.setInterval(() => {
        setCurrentReelDwell((prev) => prev + 1);
      }, 1000);
    } else {
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    }
    return () => {
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    };
  }, [isTimerRunning, currentIndex]);

  const handleNextReel = () => {
    if (currentReel) {
      onReelSwiped(currentReel, currentReelDwell, likedReelIds.has(currentReel.id));
    }
    setCurrentReelDwell(0);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      onDecrementReel();
      setCurrentReelDwell(0);
    }
  };

  const toggleLike = () => {
    if (!currentReel) return;
    const next = new Set(likedReelIds);
    if (next.has(currentReel.id)) {
      next.delete(currentReel.id);
    } else {
      next.add(currentReel.id);
    }
    setLikedReelIds(next);
  };

  const toggleBookmark = () => {
    if (!currentReel) return;
    const next = new Set(bookmarkedReelIds);
    if (next.has(currentReel.id)) {
      next.delete(currentReel.id);
    } else {
      next.add(currentReel.id);
    }
    setBookmarkedReelIds(next);
  };

  // Keyboard navigation for realistic swipe experience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowDown' || e.key === 'j' || e.code === 'Space') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === 'l') {
        toggleLike();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentReel, currentReelDwell, likedReelIds]);

  const isLiked = currentReel ? likedReelIds.has(currentReel.id) : false;
  const isBookmarked = currentReel ? bookmarkedReelIds.has(currentReel.id) : false;
  const categoryMeta = currentReel ? CATEGORIES[currentReel.category] : CATEGORIES.tech_coding;
  const isLovedCategory = currentReel ? lovedCategories.has(currentReel.category) : false;
  const platform = PLATFORMS[currentPlatform];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Platform Switcher Pills above Phone */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-4 w-full justify-between shadow-inner">
        {(['instagram', 'facebook', 'snapchat'] as PlatformId[]).map((pId) => {
          const p = PLATFORMS[pId];
          const isActive = currentPlatform === pId;
          return (
            <button
              key={pId}
              onClick={() => {
                onSelectPlatform(pId);
                setCurrentIndex(0);
                setCurrentReelDwell(0);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.brandColor }}
              />
              <span className="whitespace-nowrap">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative w-full max-w-[390px] h-[720px] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden select-none">
        {/* Dynamic Notch HUD placed on top of phone display */}
        <div className="absolute top-4 left-0 right-0 z-40 px-3">
          <DynamicNotch
            currentPlatform={currentPlatform}
            onSelectPlatform={onSelectPlatform}
            reelCount={reelCount}
            onIncrementReel={handleNextReel}
            onDecrementReel={handlePrevReel}
            watchTimeSeconds={watchTimeSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={onToggleTimer}
            onResetSession={onResetSession}
            currentCategory={currentReel?.category || 'tech_coding'}
            onChangeCategory={() => {}}
            onLikeCurrentReel={toggleLike}
            isCurrentLiked={isLiked}
            onOpenSuggestions={onOpenSuggestions}
          />
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-950 flex flex-col justify-between pt-16 pb-4">
          {/* Animated Video Simulated Backdrop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReel?.id || 'reel'}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className={`absolute inset-0 bg-gradient-to-b ${currentReel?.gradientTheme || 'from-slate-900 to-black'} z-0`}
            >
              {/* Atmospheric lighting and subtle grid */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/80 pointer-events-none" />

              {/* Dynamic simulated visual card art */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/90">
                <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white/90" />
                </div>
                <div className="text-xs uppercase tracking-widest font-mono text-white/70 mb-2">
                  {platform.reelTerm}
                </div>
                <h3 className="font-display font-bold text-lg text-white max-w-xs leading-snug drop-shadow-md">
                  {currentReel?.caption?.slice(0, 65)}...
                </h3>
                <div className="mt-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-slate-200">
                  {currentReel?.previewNote}
                </div>
              </div>

              {/* Dwell counter micro-indicator */}
              <div className="absolute top-16 right-4 z-10 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono tabular-nums text-slate-300">
                {currentReelDwell}s on reel
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Reel Header Info / Top Bar in simulator */}
          <div className="relative z-10 px-4 pt-1 flex items-center justify-between text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">Reels</span>
              <span className="text-xs text-white/50">·</span>
              <span className="text-xs text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{categoryMeta.label}</span>
              </span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Action Bar (Heart, Comments, Shares, Bookmark) */}
          <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
            {/* Like Button */}
            <div className="flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={toggleLike}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isLiked
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-black/40 text-white/90 hover:bg-black/60'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              </motion.button>
              <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-sm">
                {currentReel?.likesCount}
              </span>
            </div>

            {/* Comment Button */}
            <div className="flex flex-col items-center">
              <button className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-sm">
                {currentReel?.commentsCount}
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center">
              <button className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-sm">
                {currentReel?.sharesCount}
              </span>
            </div>

            {/* Bookmark */}
            <div className="flex flex-col items-center">
              <button
                onClick={toggleBookmark}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isBookmarked
                    ? 'bg-amber-400 text-black'
                    : 'bg-black/40 text-white/90 hover:bg-black/60'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-black' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Overlay: Creator info, caption, tags, audio */}
          <div className="relative z-10 px-4 pb-2 text-white">
            {/* Interest alignment banner */}
            {isLovedCategory && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[11px] font-medium mb-2">
                <Check className="w-3 h-3" />
                <span>Matches your loved interest: {categoryMeta.label}</span>
              </div>
            )}

            {/* Creator Row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs">
                {currentReel?.creatorName[0]}
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight text-white flex items-center gap-1">
                  <span>{currentReel?.creatorHandle}</span>
                  <UserCheck className="w-3 h-3 text-sky-400" />
                </div>
                <div className="text-[10px] text-white/70">{currentReel?.creatorName}</div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/90 line-clamp-2 leading-relaxed mb-2 drop-shadow-sm">
              {currentReel?.caption}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 text-[11px] text-sky-300/90 mb-2">
              {currentReel?.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            {/* Audio Track marquee */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit max-w-[240px]">
              <Music className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span className="text-[11px] text-white/90 truncate font-mono">
                {currentReel?.audioTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Swipe Control Bar below phone screen */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      </div>

      {/* Swipe Control Buttons & Shortcuts */}
      <div className="flex items-center justify-between w-full max-w-[390px] mt-4 px-2 text-xs">
        <button
          onClick={handlePrevReel}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-slate-400 font-mono text-[11px]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Space</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">↓</kbd> to Swipe
        </span>

        <button
          onClick={handleNextReel}
          className="flex items-center gap-1 py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold shadow-md active:scale-95 transition-all"
        >
          <span>Next Reel</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
