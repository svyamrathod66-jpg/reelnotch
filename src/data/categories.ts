import { InterestCategoryId, InterestCategoryMeta, PlatformId } from '../types/reel';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  reelTerm: string;
  brandColor: string;
  accentBg: string;
  borderAccent: string;
  iconBg: string;
  description: string;
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    reelTerm: 'Instagram Reel',
    brandColor: '#E1306C',
    accentBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
    borderAccent: 'border-rose-500/40',
    iconBg: 'bg-rose-500/10 text-rose-400',
    description: 'Aesthetic short-form visual culture, creator reels, and trends',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    reelTerm: 'Facebook Reel',
    brandColor: '#1877F2',
    accentBg: 'bg-blue-600',
    borderAccent: 'border-blue-500/40',
    iconBg: 'bg-blue-500/10 text-blue-400',
    description: 'Community reels, viral hacks, family creators, and storytelling',
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    reelTerm: 'Snapchat Spotlight',
    brandColor: '#FFFC00',
    accentBg: 'bg-amber-400 text-slate-950',
    borderAccent: 'border-amber-400/40',
    iconBg: 'bg-amber-400/10 text-amber-300',
    description: 'Fast-paced Spotlight clips, challenges, unfiltered POV snaps',
  },
};

export const CATEGORIES: Record<InterestCategoryId, InterestCategoryMeta> = {
  tech_coding: {
    id: 'tech_coding',
    label: 'Tech & Coding',
    icon: 'Terminal',
    color: '#06B6D4',
    bgLight: 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300',
    description: 'Dev tips, AI tools, mechanical setups, software engineering tips',
    recommendedKeywords: ['#codingtips', '#webdev', '#softwareengineering', '#aiupdate'],
  },
  fitness_health: {
    id: 'fitness_health',
    label: 'Fitness & Movement',
    icon: 'Activity',
    color: '#10B981',
    bgLight: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300',
    description: 'Calisthenics, gym form, mobility drills, science-backed nutrition',
    recommendedKeywords: ['#calisthenics', '#gymtok', '#mobilityflow', '#fitnesstips'],
  },
  culinary_food: {
    id: 'culinary_food',
    label: 'Culinary & Recipes',
    icon: 'Utensils',
    color: '#F59E0B',
    bgLight: 'bg-amber-950/40 border-amber-800/40 text-amber-300',
    description: 'Quick artisanal meals, knife skills, food chemistry, street bites',
    recommendedKeywords: ['#quickrecipes', '#cheftips', '#trufflepasta', '#bakingsecrets'],
  },
  travel_adventure: {
    id: 'travel_adventure',
    label: 'Travel & Nature',
    icon: 'Compass',
    color: '#3B82F6',
    bgLight: 'bg-blue-950/40 border-blue-800/40 text-blue-300',
    description: 'Hidden mountain lakes, cinematic drone reels, solo itinerary guides',
    recommendedKeywords: ['#travelhidden', '#dronecinematography', '#icelandroadtrip', '#solotravel'],
  },
  business_growth: {
    id: 'business_growth',
    label: 'Business & Finance',
    icon: 'TrendingUp',
    color: '#8B5CF6',
    bgLight: 'bg-violet-950/40 border-violet-800/40 text-violet-300',
    description: 'Founder lessons, bootstrapped indie apps, marketing psychology, wealth habits',
    recommendedKeywords: ['#indiehacker', '#startuplife', '#marketingstrategy', '#financebasics'],
  },
  productivity_habits: {
    id: 'productivity_habits',
    label: 'Productivity & Habits',
    icon: 'Zap',
    color: '#EC4899',
    bgLight: 'bg-pink-950/40 border-pink-800/40 text-pink-300',
    description: 'Deep work protocols, dopamine resets, Notion workflows, time management',
    recommendedKeywords: ['#deepwork', '#habitformation', '#studyroutine', '#productivityhacks'],
  },
  science_nature: {
    id: 'science_nature',
    label: 'Science & Cosmos',
    icon: 'Atom',
    color: '#14B8A6',
    bgLight: 'bg-teal-950/40 border-teal-800/40 text-teal-300',
    description: 'James Webb telescope imagery, quantum mechanics visualizers, wildlife biology',
    recommendedKeywords: ['#spaceexploration', '#physicsvisualized', '#deepocean', '#sciencefacts'],
  },
  design_creative: {
    id: 'design_creative',
    label: 'Design & Visual Arts',
    icon: 'Palette',
    color: '#F43F5E',
    bgLight: 'bg-rose-950/40 border-rose-800/40 text-rose-300',
    description: 'Typography breakdowns, Blender 3D breakdowns, analog photography, brand design',
    recommendedKeywords: ['#typography', '#blender3d', '#uidesign', '#filmmakingtips'],
  },
  comedy_humor: {
    id: 'comedy_humor',
    label: 'Comedy & Relatable',
    icon: 'Smile',
    color: '#EAB308',
    bgLight: 'bg-yellow-950/40 border-yellow-800/40 text-yellow-300',
    description: 'Dry wit sketches, corporate satire, relatable everyday absurdities',
    recommendedKeywords: ['#relatablesketch', '#corporatelife', '#dryhumor', '#standupclip'],
  },
  mindless_doomscroll: {
    id: 'mindless_doomscroll',
    label: 'Mindless Doomscroll',
    icon: 'AlertTriangle',
    color: '#64748B',
    bgLight: 'bg-slate-900 border-slate-700 text-slate-400',
    description: 'Unfiltered loops, ragebait, random drama clips that steal your focus',
    recommendedKeywords: ['#randomclips', '#loopingvideo', '#subwaygameplay'],
  },
};
