export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  role: 'ROLE_USER' | 'ROLE_COSER' | 'ROLE_ADMIN';
  email: string;
  isCoser?: boolean;
  coserCN?: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  japaneseName: string;
  romaji: string;
  cv: string;
  birthday: string;
  school: string;
  grade: string;
  club: string;
  avatar: string;
  image: string;
  summary: string;
  description: string;
  tags: string[];
  relationWithYukino: string;
  color: string;
}

export interface CharacterRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  description: string;
}

export interface Season {
  id: number;
  title: string;
  japaneseTitle: string;
  year: string;
  episodeCount: number;
  description: string;
}

export interface Episode {
  id: string;
  seasonId: number;
  episodeNumber: number;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  imageUrl: string;
  videoUrl?: string;
  charactersInvolved: string[];
  keyEvents: string[];
}

export interface Outfit {
  id: string;
  name: string;
  japaneseName?: string;
  type: 'uniform' | 'yukata' | 'winter' | 'casual' | 'special';
  imageUrl: string;
  color: string;
  description: string;
  firstAppearance: string;
  seasonId: number;
  episodeId: string;
  sceneDescription: string;
  linkedQuoteId?: string;
  tags: string[];
}

export interface Quote {
  id: string;
  japanese: string;
  chinese: string;
  speaker: string;
  listener?: string;
  seasonId: number;
  episodeId: string;
  episodeTitle: string;
  scene: string;
  background: string;
  tags: string[];
}

export interface VoiceLine {
  id: string;
  title: string;
  japaneseText: string;
  chineseText: string;
  category: 'daily' | 'service_club' | 'monologue' | 'emotional';
  audioUrl: string;
  duration: string;
  scene: string;
  playCount: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'screenshot' | 'official' | 'novel' | 'coser' | 'wallpaper';
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  author: string;
  authorAvatar?: string;
  source: string;
  likes: number;
  favorites: number;
  tags: string[];
  isCoserWork?: boolean;
}

export interface MerchItem {
  id: string;
  name: string;
  category: 'figure' | 'acrylic' | 'book' | 'apparel' | 'badge';
  manufacturer: string;
  releaseDate: string;
  price: string;
  imageUrl: string;
  description: string;
  scale?: string;
  status: 'released' | 'upcoming';
}

export interface Diary {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  date: string;
  weather: string;
  tags: string[];
  isPublic: boolean;
  views: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'ROLE_USER' | 'ROLE_COSER' | 'ROLE_ADMIN';
  isCoser?: boolean;
  coserCN?: string;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  commentsCount: number;
  favorites: number;
  tags: string[];
  liked?: boolean;
  bookmarked?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isSelf?: boolean;
  type?: 'text' | 'system';
}

export interface ToSignRequest {
  id: string;
  galleryId: string;
  galleryTitle: string;
  imageUrl: string;
  requesterCN: string;
  dedicationText: string;
  remarks?: string;
  positionX: number; // 0-100 percentage
  positionY: number; // 0-100 percentage
  inkColor: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
  signedImageUrl?: string;
}

export interface CoserCertification {
  id: string;
  userId: string;
  userName: string;
  coserCN: string;
  bio: string;
  portfolioLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
