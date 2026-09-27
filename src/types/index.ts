export type UserRole = 'ROLE_DEVELOPER' | 'ROLE_CONTENT_ADMIN' | 'ROLE_USER' | 'ROLE_COSER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  role: UserRole;
  adminTier?: 'developer' | 'content_admin' | 'member'; // 三层权限分类：开发者管理员 | 社区内容管理员 | 普通成员
  email: string;
  isCoser?: boolean;
  coserCN?: string;
  createdAt: string;
  contributionPoints?: number; // 社区贡献度
  approvedModificationsCount?: number; // 成功被采纳的编年史/档案修改篇数
  reputationScore?: number; // 综合声望分
  adminDownvotesReceived?: number; // 作为管理员收到的 👎 数量 (>=5 将被自动撤销内容管理员权限)
  adminRevoked?: boolean; // 是否曾被撤销管理员
}

export type ChronicleCommentType = 'normal' | 'proposal';

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ChronicleComment {
  id: string;
  targetId: string; // 关联的 Episode ID, Timeline node ID, Quote ID, Outfit ID, Relation ID 或 Character ID
  targetType?: 'episode' | 'timeline' | 'quote' | 'outfit' | 'character' | 'relation' | 'lore' | 'season';
  targetTitle?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  type: ChronicleCommentType; // 'normal' 普通讨论/感悟 | 'proposal' 申请修改提议
  content: string; // 讨论正文或修改提议概述
  createdAt: string;
  upvotes: number; // 👍 社区赞同 / 认可数
  downvotes: number; // 👎 社区反对 / 质疑数
  // 仅在 type === 'proposal' 时有效:
  currentContent?: string; // 当前正文内容
  proposedTitle?: string;
  proposedSynopsis?: string;
  proposedContent?: string; // 建议修改为
  justification?: string; // 修改理由
  references?: string; // 引用依据 (例如 S1E12, S2E08, 角色名台词等)
  status?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  replies?: CommentReply[]; // 评论内部嵌套回复线程
}

export interface RevisionLog {
  id: string;
  targetId: string;
  targetType: 'episode' | 'timeline' | 'quote' | 'outfit' | 'character' | 'lore';
  targetTitle: string;
  editorId: string;
  editorName: string;
  editorRole: UserRole;
  action: 'admin_direct_edit' | 'community_proposal_adopted';
  changes: {
    field: string;
    before: string;
    after: string;
  }[];
  reason: string;
  timestamp: string;
}

export interface EpisodePin {
  id: string;
  episodeId: string;
  timestampSeconds: number; // 钉子对应秒数，如 215 (03:35)
  timestampDisplay: string; // "03:35"
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string; // 钉子内容/感悟/考据
  type: 'insight' | 'lore' | 'proposal'; // 普通感悟 | 剧情细节考据 | 剧情修改提议
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface AdminApplication {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  reason: string; // 申请理由
  qualifications: string; // 资历与考据经验说明
  approvedEditsCount: number; // 当前成功修改篇数
  score: number; // 当前综合声望分
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
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
  likePoints: number; // 点赞加权贡献值
  totalPoints: number; // basePoints + likePoints
}

export interface ContributionSummary {
  totalPoints: number; // 总贡献值
  archiveCount: number; // 补全档案条目数
  totalLikesReceived: number; // 累计获得的被点赞总数
  totalViewsReceived: number; // 累计浏览量
  totalFavoritesReceived: number; // 累计收藏量
  level: number; // 贡献者等级 (1-10)
  levelTitle: string; // 荣誉称号, e.g. "资深档案馆典籍官"
  archiveCompleteness: number; // 档案补全度 (0-100%)
  // 精细化权重系统 (按用户要求: 浏览千分之一 0.001, 点赞百分之一 0.01, 收藏百分之二 0.02)
  viewWeight: number; // 0.001
  likeWeight: number; // 0.01
  favoriteWeight: number; // 0.02
  viewWeightedScore: number;
  likeWeightedScore: number;
  favoriteWeightedScore: number;
  approvedEditsBonus: number; // 成功采纳修改奖励分
  formulaScore: number; // 最终加权贡献度
  targetQuota: number; // 当期阶梯目标额度
  quotaPercent: number; // 额度达成百分比
  approvedEditsCount: number; // 成功采纳修改篇数
  canAutoPromoteToAdmin: boolean; // 是否达到免审直接成为管理员的资格
  adminDownvotes: number; // 管理员反对票
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
  keyEvents?: string[]; // 关键剧情记录
  developmentStages?: {
    stage: string;
    description: string;
  }[]; // 发展阶段
  relatedEpisodes?: string[]; // 相关剧集
  relatedQuotes?: string[]; // 相关语录
  updatedAt?: string;
}

export interface Anime {
  id: string; // 'oregairu'
  slug: string;
  title: string;
  japaneseTitle: string;
  romaji: string;
  coverImage: string;
  year: string;
  author: string;
  description: string;
  seasonsCount: number;
  episodesCount: number;
  status: 'completed' | 'ongoing';
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
  coserNote?: string; // Coser 亲手签署的附言寄语
  approvedByCoserCN?: string; // 签批此单的认证 Coser 专属 CN
  signedAt?: string;
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
