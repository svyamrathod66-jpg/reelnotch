export type PlatformId = 'instagram' | 'facebook' | 'snapchat';

export type InterestCategoryId =
  | 'tech_coding'
  | 'fitness_health'
  | 'culinary_food'
  | 'travel_adventure'
  | 'comedy_humor'
  | 'business_growth'
  | 'design_creative'
  | 'productivity_habits'
  | 'science_nature'
  | 'mindless_doomscroll';

export interface InterestCategoryMeta {
  id: InterestCategoryId;
  label: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  recommendedKeywords: string[];
}

export interface ReelItem {
  id: string;
  platform: PlatformId;
  creatorName: string;
  creatorHandle: string;
  caption: string;
  category: InterestCategoryId;
  durationSeconds: number;
  likesCount: string;
  commentsCount: string;
  sharesCount: string;
  audioTitle: string;
  tags: string[];
  gradientTheme: string;
  previewNote: string;
}

export interface WatchedReelRecord {
  id: string;
  reelNumber: number;
  platform: PlatformId;
  category: InterestCategoryId;
  creatorHandle?: string;
  caption?: string;
  durationSeconds: number;
  timestamp: number;
  rating?: 'loved' | 'neutral' | 'skipped';
}

export interface UserInterestPreference {
  categoryId: InterestCategoryId;
  level: 'loved' | 'like' | 'neutral' | 'avoid';
}

export interface ReelSuggestion {
  id: string;
  title: string;
  category: InterestCategoryId;
  platforms: PlatformId[];
  targetCreator: string;
  searchQuery: string;
  hookDescription: string;
  whyYouWillLoveIt: string;
  estimatedDuration: string;
  hashtags: string[];
}
