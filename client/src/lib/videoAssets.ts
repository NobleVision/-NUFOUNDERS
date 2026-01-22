/**
 * Video Assets Utility Library
 * 
 * Categorizes and provides access to all b-roll video assets for use
 * throughout the NuFounders platform. Videos are organized by theme
 * to enable contextual placement on different pages.
 */

export type VideoCategory = 
  | 'hero'
  | 'entrepreneurship'
  | 'learning'
  | 'community'
  | 'mentorship'
  | 'success'
  | 'pitch'
  | 'ecommerce'
  | 'wedding'
  | 'lifestyle'
  | 'financial'
  | 'tech';

export interface VideoAsset {
  path: string;
  category: VideoCategory;
  tags: string[];
  description?: string;
}

const BASE_PATH = '/videos';

/**
 * Complete catalog of video assets organized by category
 */
export const VIDEO_CATALOG: VideoAsset[] = [
  // Hero/General
  { path: `${BASE_PATH}/hero-1.mp4`, category: 'hero', tags: ['general', 'intro'] },
  { path: `${BASE_PATH}/hero-2.mp4`, category: 'hero', tags: ['general', 'intro'] },
  { path: `${BASE_PATH}/hero-3.mp4`, category: 'hero', tags: ['general', 'intro'] },
  { path: `${BASE_PATH}/hero-4.mp4`, category: 'hero', tags: ['general', 'intro'] },
  { path: `${BASE_PATH}/hero-5.mp4`, category: 'hero', tags: ['general', 'intro'] },
  
  // Entrepreneurship
  { path: `${BASE_PATH}/entrepreneur-1.mp4`, category: 'entrepreneurship', tags: ['business', 'startup'] },
  { path: `${BASE_PATH}/entrepreneur-2.mp4`, category: 'entrepreneurship', tags: ['business', 'startup'] },
  { path: `${BASE_PATH}/Category_1_entrepreneurship_202601212150_j7b.mp4`, category: 'entrepreneurship', tags: ['business', 'ceo', 'leadership'] },
  { path: `${BASE_PATH}/Prompt_3_signing_202601212150_dmzhx.mp4`, category: 'entrepreneurship', tags: ['deal', 'contract', 'milestone'] },
  { path: `${BASE_PATH}/Prompt_4_the_202601212150_di3va.mp4`, category: 'entrepreneurship', tags: ['storefront', 'launch'] },
  { path: `${BASE_PATH}/Prompt_4_the_202601212150_ux83q.mp4`, category: 'entrepreneurship', tags: ['storefront', 'launch'] },
  { path: `${BASE_PATH}/Prompt_5_team_202601212151_pi71h.mp4`, category: 'entrepreneurship', tags: ['team', 'leadership', 'management'] },
  { path: `${BASE_PATH}/Prompt_7_the_202601212151_1wmeo.mp4`, category: 'entrepreneurship', tags: ['investor', 'meeting'] },
  { path: `${BASE_PATH}/Prompt_9_the_202601212151_ul7ae.mp4`, category: 'entrepreneurship', tags: ['employee', 'hiring', 'growth'] },
  
  // Pitch & Competition
  { path: `${BASE_PATH}/Prompt_2_pitch_202601212150_3xi8d.mp4`, category: 'pitch', tags: ['competition', 'victory', 'funding'] },
  { path: `${BASE_PATH}/Prompt_10_revenue_202601212155_1p4z1.mp4`, category: 'pitch', tags: ['milestone', 'revenue', 'celebration'] },
  
  // E-commerce
  { path: `${BASE_PATH}/Prompt_6_ecommerce_202601212151_gqhw4.mp4`, category: 'ecommerce', tags: ['online', 'store', 'orders'] },
  
  // Learning & Education
  { path: `${BASE_PATH}/Category_2_learning_202601212155_701c0.mp4`, category: 'learning', tags: ['education', 'course', 'study'] },
  { path: `${BASE_PATH}/Prompt_13_study_202601212155_k30bi.mp4`, category: 'learning', tags: ['study', 'focus', 'library'] },
  { path: `${BASE_PATH}/Prompt_14_workshop_202601212155_vclph.mp4`, category: 'learning', tags: ['workshop', 'group', 'collaborative'] },
  { path: `${BASE_PATH}/Prompt_16_tech_202601212155_fp9wn.mp4`, category: 'tech', tags: ['coding', 'technology', 'skills'] },
  { path: `${BASE_PATH}/Prompt_17_public_202601212155_8lwn8.mp4`, category: 'learning', tags: ['speaking', 'presentation', 'practice'] },
  { path: `${BASE_PATH}/Prompt_19_resume_202601212156_buhue.mp4`, category: 'learning', tags: ['resume', 'career', 'job'] },
  
  // Financial
  { path: `${BASE_PATH}/Prompt_18_financial_202601212155_9cyl2.mp4`, category: 'financial', tags: ['finance', 'literacy', 'teaching'] },
  
  // Mentorship
  { path: `${BASE_PATH}/Prompt_15_mentorship_202601212155_8re52.mp4`, category: 'mentorship', tags: ['mentor', 'guidance', 'wisdom'] },
  { path: `${BASE_PATH}/Prompt_29_mentee_202601212157_uijf5.mp4`, category: 'mentorship', tags: ['mentee', 'learning', 'growth'] },
  
  // Community & Networking
  { path: `${BASE_PATH}/community-1.mp4`, category: 'community', tags: ['networking', 'connection'] },
  { path: `${BASE_PATH}/Category_3_community_202601212156_3eunb.mp4`, category: 'community', tags: ['networking', 'sisterhood'] },
  { path: `${BASE_PATH}/Prompt_22_womens_202601212156_i7vz7.mp4`, category: 'community', tags: ['women', 'circle', 'support'] },
  { path: `${BASE_PATH}/Prompt_23_virtual_202601212156_0vc82.mp4`, category: 'community', tags: ['virtual', 'meetup', 'remote'] },
  { path: `${BASE_PATH}/Prompt_24_conference_202601212156_fpe29.mp4`, category: 'community', tags: ['conference', 'speaker', 'keynote'] },
  { path: `${BASE_PATH}/Prompt_25_podcast_202601212156_vku24.mp4`, category: 'community', tags: ['podcast', 'media', 'sharing'] },
  { path: `${BASE_PATH}/Prompt_30_community_202601212157_63b4b.mp4`, category: 'community', tags: ['service', 'giving', 'impact'] },
  
  // Success Stories
  { path: `${BASE_PATH}/success-1.mp4`, category: 'success', tags: ['achievement', 'celebration'] },
  { path: `${BASE_PATH}/success-2.mp4`, category: 'success', tags: ['achievement', 'celebration'] },
  { path: `${BASE_PATH}/Success1mp4__graduation_202601212218_9yiuy.mp4`, category: 'success', tags: ['graduation', 'ceremony', 'milestone'] },
  { path: `${BASE_PATH}/Success2mp4__certificate_202601212217_x5b9.mp4`, category: 'success', tags: ['certificate', 'achievement', 'completion'] },
  
  // Lifestyle & Inspiration
  { path: `${BASE_PATH}/Category_5_lifestyle_202601212158_nxlp3.mp4`, category: 'lifestyle', tags: ['balance', 'wellness'] },
  { path: `${BASE_PATH}/Prompt_42_worklife_202601212158_nb3zr.mp4`, category: 'lifestyle', tags: ['family', 'balance', 'work'] },
  { path: `${BASE_PATH}/Prompt_43_fitness_202601212158_k0g1u.mp4`, category: 'lifestyle', tags: ['fitness', 'health', 'energy'] },
  { path: `${BASE_PATH}/Prompt_44_vision_202601212158_5isof.mp4`, category: 'lifestyle', tags: ['vision', 'planning', 'goals'] },
  { path: `${BASE_PATH}/Prompt_45_selfcare_202601212158_vx63t.mp4`, category: 'lifestyle', tags: ['selfcare', 'wellness', 'rest'] },
  { path: `${BASE_PATH}/Prompt_46_the_202601212158_3plko.mp4`, category: 'lifestyle', tags: ['commute', 'city', 'professional'] },
  { path: `${BASE_PATH}/Prompt_47_home_202601212159_xlisn.mp4`, category: 'lifestyle', tags: ['home', 'office', 'workspace'] },
  { path: `${BASE_PATH}/Prompt_48_generational_202601212159_u98zv.mp4`, category: 'lifestyle', tags: ['generational', 'wealth', 'teaching'] },
  { path: `${BASE_PATH}/Prompt_49_the_202601212159_sbcxb.mp4`, category: 'lifestyle', tags: ['transformation', 'journey'] },
  { path: `${BASE_PATH}/Prompt_50_future_202601212159_pcu74.mp4`, category: 'lifestyle', tags: ['future', 'vision', 'rooftop'] },
  
  // Wedding Industry
  { path: `${BASE_PATH}/Category_4_wedding_202601212157_rve8j.mp4`, category: 'wedding', tags: ['bridal', 'events'] },
  { path: `${BASE_PATH}/Prompt_33_bridal_202601212157_ziyuo.mp4`, category: 'wedding', tags: ['makeup', 'artist', 'beauty'] },
  { path: `${BASE_PATH}/Prompt_33_bridal_202601212159_osm3u.mp4`, category: 'wedding', tags: ['makeup', 'artist', 'beauty'] },
  { path: `${BASE_PATH}/Prompt_34_bridal_202601212157_uqesf.mp4`, category: 'wedding', tags: ['hair', 'stylist', 'beauty'] },
  { path: `${BASE_PATH}/Prompt_35_wedding_202601212157_zrazl.mp4`, category: 'wedding', tags: ['photographer', 'creative'] },
  { path: `${BASE_PATH}/Prompt_36_florist_202601212158_1svhc.mp4`, category: 'wedding', tags: ['florist', 'flowers', 'design'] },
  { path: `${BASE_PATH}/Prompt_37_cake_202601212158_lygkq.mp4`, category: 'wedding', tags: ['cake', 'baker', 'culinary'] },
  { path: `${BASE_PATH}/Prompt_38_bridal_202601212158_hl3a7.mp4`, category: 'wedding', tags: ['consultant', 'boutique'] },
  { path: `${BASE_PATH}/Prompt_39_wedding_202601212158_jq3lc.mp4`, category: 'wedding', tags: ['dj', 'music', 'reception'] },
  { path: `${BASE_PATH}/Prompt_40_officiant_202601212158_0xxsz.mp4`, category: 'wedding', tags: ['officiant', 'ceremony'] },
  { path: `${BASE_PATH}/Prompt_40_officiant_202601212158_h66r7.mp4`, category: 'wedding', tags: ['officiant', 'ceremony'] },
];

/**
 * Get videos by category
 */
export function getVideosByCategory(category: VideoCategory): string[] {
  return VIDEO_CATALOG
    .filter(v => v.category === category)
    .map(v => v.path);
}

/**
 * Get videos by multiple categories
 */
export function getVideosByCategories(categories: VideoCategory[]): string[] {
  return VIDEO_CATALOG
    .filter(v => categories.includes(v.category))
    .map(v => v.path);
}

/**
 * Get videos by tag
 */
export function getVideosByTag(tag: string): string[] {
  return VIDEO_CATALOG
    .filter(v => v.tags.includes(tag))
    .map(v => v.path);
}

/**
 * Get random videos from a category (for variety)
 */
export function getRandomVideos(category: VideoCategory, count: number = 5): string[] {
  const categoryVideos = getVideosByCategory(category);
  const shuffled = [...categoryVideos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get curated video sets for specific pages
 */
export const PAGE_VIDEO_SETS = {
  home: getVideosByCategories(['hero', 'entrepreneurship', 'success']),
  courses: getVideosByCategories(['learning', 'tech', 'mentorship']),
  courseDetail: getVideosByCategories(['learning', 'success']),
  business: getVideosByCategories(['entrepreneurship', 'pitch', 'ecommerce']),
  community: getVideosByCategories(['community', 'mentorship']),
  dashboard: getVideosByCategories(['success', 'lifestyle']),
  onboarding: getVideosByCategories(['lifestyle', 'entrepreneurship']),
  events: getVideosByCategories(['community', 'mentorship']),
  scholarships: getVideosByCategories(['success', 'learning']),
  profile: getVideosByCategories(['lifestyle', 'success']),
} as const;

/**
 * Contextual video recommendations based on user journey stage
 */
export function getContextualVideos(context: {
  hasCompletedOnboarding?: boolean;
  coursesCompleted?: number;
  hasBusinessIdea?: boolean;
  hasPitched?: boolean;
}): string[] {
  const videos: string[] = [];
  
  if (!context.hasCompletedOnboarding) {
    videos.push(...getVideosByTag('vision'));
    videos.push(...getVideosByTag('journey'));
  }
  
  if (context.coursesCompleted && context.coursesCompleted > 0) {
    videos.push(...getVideosByTag('achievement'));
    videos.push(...getVideosByTag('certificate'));
  }
  
  if (context.hasBusinessIdea) {
    videos.push(...getVideosByTag('startup'));
    videos.push(...getVideosByTag('planning'));
  }
  
  if (context.hasPitched) {
    videos.push(...getVideosByTag('competition'));
    videos.push(...getVideosByTag('funding'));
  }
  
  // Fallback to general success videos
  if (videos.length === 0) {
    videos.push(...getVideosByCategory('success'));
  }
  
  return Array.from(new Set(videos)); // Remove duplicates
}

export default VIDEO_CATALOG;
