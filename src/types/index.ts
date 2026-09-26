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
  contributionPoints?: number; // 社区贡献度
}

export interface ArchiveContribution {
  id: string;
  userId: string;
  userName: string;
  targetType: 'character' | 'lore' | 'episode' | 'gallery';
  targetTitle: string; // e.g. "雪之下雪乃 · 喜好猫咪与潘先生设定补充"
  summary: string; // 补全内容概述
  date: string;
  likes: number; // 获得的社区点赞数
  status: 'approved' | 'pending';
  basePoints: number; // 基础补全贡献值 (50)
  likePoints: number; // 点赞加权贡献值 (likes * 10)
  totalPoints: number; // basePoints + likePoints
}

export interface ContributionSummary {
  totalPoints: number; // 总贡献值
  archiveCount: number; // 补全档案条目数
  totalLikesReceived: number; // 累计获得的被点赞总数
  level: number; // 贡献者等级 (1-10)
  levelTitle: string; // 荣誉称号, e.g. "资深档案馆典籍官"
  // 公式: 贡献度 = (档案补全度 * 0.4) + (获得的被点赞总数 * 0.6)
  archiveCompleteness: number; // 档案补全度 (0-100%)
  archiveFormulaWeight: number; // 0.4
  likeFormulaWeight: number; // 0.6
  archiveWeightedScore: number; // 档案补全度 * 0.4
  likeWeightedScore: number; // 获得的被点赞总数 * 0.6
  formulaScore: number; // 最终加权贡献度
  targetQuota: number; // 当期阶梯目标额度
  quotaPercent: number; // 额度达成百分比
  archiveWeight?: number;
  likeWeight?: number;
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

export interface YukinoSentiment {
  score: number; // 0-100 心境共鸣与真物指数
  mood: 'truth_seeking' | 'cold_resilience' | 'gentle_warmth' | 'melancholy' | 'daily_peace';
  moodLabel: string;
  color: string;
  advice: string; // 雪之下雪乃的对应建议或评价
}

export interface DiaryLocation {
  name: string; // 地理名称，如“稻毛海滨公园 · 夕阳防波堤”
  city?: string; // 城市/地区，如“千叶市美滨区”
  lat: number; // 纬度 (如 35.6190)
  lng: number; // 经度 (如 140.0580)
  landmark?: string; // 地标物/场景象征，如“寒风拂过海湾的起点”
  atmosphere?: string; // 氛围感标签，如“冬日黄昏 · 潮声 · 零星脚印”
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
  linkedToSignId?: string;
  linkedToSignTitle?: string;
  linkedToSignDedication?: string;
  sentiment?: YukinoSentiment;
  location?: DiaryLocation;
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
  author?: string;
  syncToFeed?: boolean;
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
