import { GoogleGenAI } from '@google/genai';
import { InterestCategoryId, ReelSuggestion } from '../types/reel';
import { CATEGORIES } from '../data/categories';

export async function generateSmartReelIdeas(params: {
  interests: InterestCategoryId[];
  currentMood: string;
  watchedCount: number;
}): Promise<ReelSuggestion[]> {
  try {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__;
    if (!apiKey) {
      // Fallback gracefully without throwing
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedLabels = params.interests.map((id) => CATEGORIES[id]?.label || id).join(', ');

    const prompt = `You are an expert short-form video curator for Instagram Reels, Facebook Reels, and Snapchat Spotlight.
The user has watched ${params.watchedCount} reels today and their primary interests are: ${selectedLabels}.
Their current desired vibe: "${params.currentMood}".

Generate 3 high-value, specific reel ideas / creator recommendations that they would genuinely love to see right now instead of mindless doomscrolling.

Return ONLY a valid JSON array of 3 objects with keys:
- id: string
- title: string
- category: one of [${params.interests.join(', ')}]
- platforms: array containing some of ["instagram", "facebook", "snapchat"]
- targetCreator: string with handles
- searchQuery: concise search term for the app search bar
- hookDescription: the opening 3-second hook of the reel
- whyYouWillLoveIt: why it matches their intentional focus
- estimatedDuration: e.g. "30s"
- hashtags: array of 3 strings like ["#react", "#design"]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (!text) return [];

    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.warn('Gemini smart reel generation fallback:', error);
    return [];
  }
}
