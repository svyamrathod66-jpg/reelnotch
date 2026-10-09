import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ReelFeedSimulator } from './components/ReelFeedSimulator';
import { CompanionHUD } from './components/CompanionHUD';
import { InterestManager } from './components/InterestManager';
import { ReelSuggestionsView } from './components/ReelSuggestionsView';
import { ReelAnalyticsView } from './components/ReelAnalyticsView';
import { DynamicNotch } from './components/DynamicNotch';
import { PlatformId, InterestCategoryId, WatchedReelRecord, ReelItem } from './types/reel';
import { MOCK_REELS } from './data/mockReels';
import { CATEGORIES, PLATFORMS } from './data/categories';
import { Sparkles, Eye, ShieldCheck, Heart, AlertCircle, ExternalLink } from 'lucide-react';

import { generateUniqueId } from './utils/id';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('simulator');
  const [currentPlatform, setCurrentPlatform] = useState<PlatformId>('instagram');
  const [reelCount, setReelCount] = useState<number>(14);
  const [watchTimeSeconds, setWatchTimeSeconds] = useState<number>(312); // ~5m 12s
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [reelLimit, setReelLimit] = useState<number>(25);

  // Interest preferences
  const [preferences, setPreferences] = useState<
    Record<InterestCategoryId, 'loved' | 'like' | 'neutral' | 'avoid'>
  >({
    tech_coding: 'loved',
    fitness_health: 'loved',
    culinary_food: 'like',
    travel_adventure: 'like',
    business_growth: 'loved',
    productivity_habits: 'like',
    science_nature: 'like',
    design_creative: 'loved',
    comedy_humor: 'neutral',
    mindless_doomscroll: 'avoid',
  });

  // Watched history
  const [watchedRecords, setWatchedRecords] = useState<WatchedReelRecord[]>([
    {
      id: 'rec_init_1',
      reelNumber: 1,
      platform: 'instagram',
      category: 'travel_adventure',
      durationSeconds: 24,
      timestamp: Date.now() - 300000,
      rating: 'loved',
    },
    {
      id: 'rec_init_2',
      reelNumber: 2,
      platform: 'instagram',
      category: 'tech_coding',
      durationSeconds: 32,
      timestamp: Date.now() - 260000,
      rating: 'loved',
    },
    {
      id: 'rec_init_3',
      reelNumber: 3,
      platform: 'snapchat',
      category: 'fitness_health',
      durationSeconds: 28,
      timestamp: Date.now() - 210000,
      rating: 'loved',
    },
    {
      id: 'rec_init_4',
      reelNumber: 4,
      platform: 'facebook',
      category: 'culinary_food',
      durationSeconds: 42,
      timestamp: Date.now() - 150000,
      rating: 'neutral',
    },
  ]);

  // Live Timer Interval
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setWatchTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Loved categories set
  const lovedCategories = new Set(
    (Object.keys(preferences) as InterestCategoryId[]).filter((k) => preferences[k] === 'loved')
  );

  const handleIncrementReel = (category?: InterestCategoryId) => {
    const nextCount = reelCount + 1;
    setReelCount(nextCount);

    const catToLog = category || 'tech_coding';
    const newRecord: WatchedReelRecord = {
      id: generateUniqueId('rec'),
      reelNumber: nextCount,
      platform: currentPlatform,
      category: catToLog,
      durationSeconds: 22,
      timestamp: Date.now(),
      rating: preferences[catToLog] === 'loved' ? 'loved' : 'neutral',
    };
    setWatchedRecords((prev) => [...prev, newRecord]);
  };

  const handleDecrementReel = () => {
    if (reelCount > 0) {
      setReelCount((prev) => prev - 1);
      setWatchedRecords((prev) => prev.slice(0, -1));
    }
  };

  const handleResetSession = () => {
    setReelCount(0);
    setWatchTimeSeconds(0);
    setWatchedRecords([]);
  };

  const handleReelSwiped = (reel: ReelItem, dwellTime: number, liked: boolean) => {
    const nextCount = reelCount + 1;
    setReelCount(nextCount);

    const newRecord: WatchedReelRecord = {
      id: generateUniqueId('rec'),
      reelNumber: nextCount,
      platform: currentPlatform,
      category: reel.category,
      creatorHandle: reel.creatorHandle,
      caption: reel.caption,
      durationSeconds: dwellTime || reel.durationSeconds,
      timestamp: Date.now(),
      rating: liked ? 'loved' : 'neutral',
    };
    setWatchedRecords((prev) => [...prev, newRecord]);
  };

  const handleSetPreference = (
    catId: InterestCategoryId,
    level: 'loved' | 'like' | 'neutral' | 'avoid'
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [catId]: level,
    }));
  };

  const handleQuickPreset = (preset: 'deep_learning' | 'health_creator' | 'creative_arts') => {
    if (preset === 'deep_learning') {
      setPreferences({
        tech_coding: 'loved',
        science_nature: 'loved',
        productivity_habits: 'loved',
        business_growth: 'like',
        design_creative: 'like',
        fitness_health: 'neutral',
        culinary_food: 'neutral',
        travel_adventure: 'neutral',
        comedy_humor: 'avoid',
        mindless_doomscroll: 'avoid',
      });
    } else if (preset === 'health_creator') {
      setPreferences({
        fitness_health: 'loved',
        culinary_food: 'loved',
        productivity_habits: 'loved',
        travel_adventure: 'like',
        science_nature: 'like',
        tech_coding: 'neutral',
        business_growth: 'neutral',
        design_creative: 'neutral',
        comedy_humor: 'like',
        mindless_doomscroll: 'avoid',
      });
    } else if (preset === 'creative_arts') {
      setPreferences({
        design_creative: 'loved',
        travel_adventure: 'loved',
        tech_coding: 'like',
        culinary_food: 'like',
        comedy_humor: 'like',
        business_growth: 'neutral',
        productivity_habits: 'neutral',
        fitness_health: 'neutral',
        science_nature: 'like',
        mindless_doomscroll: 'avoid',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} reelCount={reelCount} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Subtle Top Kicker with Platform Presence */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Reel Platforms Monitored:</span>
            <span className="inline-flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Instagram
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Facebook
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Snapchat
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Daily Budget Limit:</span>
            <input
              type="number"
              min="5"
              max="150"
              value={reelLimit}
              onChange={(e) => setReelLimit(Math.max(5, parseInt(e.target.value) || 25))}
              className="w-14 py-0.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-bold text-white focus:outline-none focus:border-rose-500"
            />
            <span className="text-slate-400">reels</span>
          </div>
        </div>

        {/* Tab Switcher Content */}
        {activeTab === 'simulator' && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mb-2">
                Dynamic Notch Reel Simulator
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Experience real-time reel counting and watch timing right inside the interactive Dynamic Notch HUD. Swipe reels or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-xs">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-xs">↓</kbd>.
              </p>
            </div>

            <ReelFeedSimulator
              reels={MOCK_REELS}
              currentPlatform={currentPlatform}
              onSelectPlatform={setCurrentPlatform}
              reelCount={reelCount}
              watchTimeSeconds={watchTimeSeconds}
              isTimerRunning={isTimerRunning}
              onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
              onIncrementReel={() => handleIncrementReel()}
              onDecrementReel={handleDecrementReel}
              onResetSession={handleResetSession}
              onReelSwiped={handleReelSwiped}
              onOpenSuggestions={() => setActiveTab('suggestions')}
              lovedCategories={lovedCategories}
            />
          </div>
        )}

        {activeTab === 'companion' && (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mb-2">
                Conscious Companion HUD
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Keep this open on your screen while watching reels on Instagram, Facebook, or Snapchat. Track watch time, swipe counts, and paces effortlessly.
              </p>
            </div>

            <CompanionHUD
              currentPlatform={currentPlatform}
              onSelectPlatform={setCurrentPlatform}
              reelCount={reelCount}
              onIncrementReel={handleIncrementReel}
              onDecrementReel={handleDecrementReel}
              watchTimeSeconds={watchTimeSeconds}
              isTimerRunning={isTimerRunning}
              onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
              onResetSession={handleResetSession}
              reelLimit={reelLimit}
              onOpenSuggestions={() => setActiveTab('suggestions')}
            />
          </div>
        )}

        {activeTab === 'interests' && (
          <InterestManager
            preferences={preferences}
            onSetPreference={handleSetPreference}
            onQuickPreset={handleQuickPreset}
            onViewSuggestions={() => setActiveTab('suggestions')}
          />
        )}

        {activeTab === 'suggestions' && (
          <ReelSuggestionsView
            lovedCategories={lovedCategories}
            currentPlatform={currentPlatform}
            watchedCount={reelCount}
            watchTimeSeconds={watchTimeSeconds}
          />
        )}

        {activeTab === 'analytics' && (
          <ReelAnalyticsView
            records={watchedRecords}
            totalWatchSeconds={watchTimeSeconds}
            totalReelCount={reelCount}
            onResetSession={handleResetSession}
            lovedCategories={lovedCategories}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>ReelNotch · Conscious attention companion for Instagram, Facebook & Snapchat Reels</div>
          <div className="text-slate-400 font-mono text-[11px]">
            Session: #{reelCount} Reels · {Math.floor(watchTimeSeconds / 60)}m {watchTimeSeconds % 60}s Active
          </div>
        </div>
      </footer>
    </div>
  );
}
