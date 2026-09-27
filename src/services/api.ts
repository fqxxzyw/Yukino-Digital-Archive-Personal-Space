import {
  User,
  Character,
  Season,
  Episode,
  Outfit,
  Quote,
  VoiceLine,
  GalleryItem,
  MerchItem,
  Diary,
  Post,
  ChatMessage,
  ToSignRequest,
  CoserCertification,
  CharacterRelation,
  Anime
} from '../types';

import {
  currentUser as defaultUser,
  seasonsData,
  oregairuCharacters,
  episodesData,
  outfitsData,
  quotesData,
  voiceLinesData,
  galleryData,
  merchData,
  diariesData,
  communityPosts,
  initialChatMessages
} from './mockData';

import { chronicleService } from './chronicleService';

const STORAGE_KEYS = {
  USER: 'yukino_user',
  POSTS: 'yukino_posts',
  DIARIES: 'yukino_diaries',
  GALLERY: 'yukino_gallery',
  CHAT: 'yukino_chat_messages',
  TO_SIGN: 'yukino_to_sign_requests',
  COSER_CERTS: 'yukino_coser_certs',
  BOOKMARKS: 'yukino_bookmarks'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silent catch
  }
}

export const api = {
  // Auth & User
  getUser(): User {
    return getStorage<User>(STORAGE_KEYS.USER, defaultUser);
  },

  updateUser(user: Partial<User>): User {
    const current = this.getUser();
    const updated = { ...current, ...user };
    setStorage(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // Seasons & Episodes
  getSeasons(): Season[] {
    return seasonsData;
  },

  getEpisodes(seasonId?: number): Episode[] {
    const list = chronicleService.getEpisodes();
    if (seasonId) {
      return list.filter(ep => ep.seasonId === seasonId);
    }
    return list;
  },

  getEpisodeById(id: string): Episode | undefined {
    const list = chronicleService.getEpisodes();
    return list.find(ep => ep.id === id);
  },

  updateEpisode(episodeId: string, updates: Partial<Episode>): Episode[] {
    return chronicleService.updateEpisode(episodeId, updates);
  },

  // Characters
  getCharacters(): Character[] {
    return oregairuCharacters;
  },

  getCharacterById(id: string): Character | undefined {
    return oregairuCharacters.find(c => c.id === id);
  },

  // Outfits
  getOutfits(filterType?: string): Outfit[] {
    if (!filterType || filterType === 'all') return outfitsData;
    return outfitsData.filter(o => o.type === filterType);
  },

  getOutfitById(id: string): Outfit | undefined {
    return outfitsData.find(o => o.id === id);
  },

  // Quotes
  getQuotes(): Quote[] {
    return quotesData;
  },

  getQuoteById(id: string): Quote | undefined {
    return quotesData.find(q => q.id === id);
  },

  // Voice Lines
  getVoiceLines(): VoiceLine[] {
    return voiceLinesData;
  },

  // Gallery
  getGallery(category?: string): GalleryItem[] {
    const items = getStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, galleryData);
    if (!category || category === 'all') return items;
    return items.filter(g => g.category === category);
  },

  // Single-toggle like for gallery (strictly prevents infinite clicking!)
  likeGalleryItem(id: string): { items: GalleryItem[]; isLiked: boolean } {
    const items = this.getGallery('all');
    const { isLiked, change } = chronicleService.toggleLikeItem(`gallery_${id}`);
    const updated = items.map(g => {
      if (g.id === id) {
        return { ...g, likes: Math.max(0, g.likes + change) };
      }
      return g;
    });
    setStorage(STORAGE_KEYS.GALLERY, updated);
    return { items: updated, isLiked };
  },

  // Admin Promotion & Demotion Methods (Three-Tier: Developer, Content Admin, Member)
  promoteUserToAdmin(tier: 'content_admin' | 'developer' = 'content_admin'): User {
    const user = this.getUser();
    const updated: User = {
      ...user,
      role: tier === 'developer' ? 'ROLE_DEVELOPER' : 'ROLE_CONTENT_ADMIN',
      adminTier: tier,
      adminRevoked: false,
      adminDownvotesReceived: 0
    };
    this.updateUser(updated);
    return updated;
  },

  setUserRole(role: User['role'], adminTier?: User['adminTier']): User {
    const user = this.getUser();
    const updated: User = {
      ...user,
      role,
      adminTier: adminTier || (role === 'ROLE_DEVELOPER' ? 'developer' : role === 'ROLE_CONTENT_ADMIN' || role === 'ROLE_ADMIN' ? 'content_admin' : 'member'),
      adminRevoked: false
    };
    this.updateUser(updated);
    return updated;
  },

  demoteAdminIfDownvoted(): { user: User; demoted: boolean } {
    const user = this.getUser();
    // Developer admin is protected
    if (user.role === 'ROLE_DEVELOPER' || user.adminTier === 'developer') {
      return { user, demoted: false };
    }

    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_CONTENT_ADMIN') {
      const downvotes = (user.adminDownvotesReceived || 0) + 1;
      if (downvotes >= 5) {
        // Demote due to excessive community downvotes (>= 5 👎)
        const updated: User = {
          ...user,
          role: 'ROLE_USER',
          adminTier: 'member',
          adminRevoked: true,
          adminDownvotesReceived: downvotes
        };
        this.updateUser(updated);
        return { user: updated, demoted: true };
      } else {
        const updated: User = {
          ...user,
          adminDownvotesReceived: downvotes
        };
        this.updateUser(updated);
        return { user: updated, demoted: false };
      }
    }
    return { user, demoted: false };
  },

  // Merch
  getMerch(category?: string): MerchItem[] {
    if (!category || category === 'all') return merchData;
    return merchData.filter(m => m.category === category);
  },

  // Diaries
  getDiaries(): Diary[] {
    const list = getStorage<Diary[]>(STORAGE_KEYS.DIARIES, diariesData);
    return list.map(item => {
      const defaultItem = diariesData.find(d => d.id === item.id);
      return {
        ...item,
        location: item.location || defaultItem?.location,
        sentiment: item.sentiment || defaultItem?.sentiment
      };
    });
  },

  addDiary(diary: Omit<Diary, 'id' | 'views'>): Diary {
    const list = this.getDiaries();
    const newEntry: Diary = {
      ...diary,
      id: `diary_${Date.now()}`,
      views: 1
    };
    const updated = [newEntry, ...list];
    setStorage(STORAGE_KEYS.DIARIES, updated);
    return newEntry;
  },

  deleteDiary(id: string): void {
    const list = this.getDiaries().filter(d => d.id !== id);
    setStorage(STORAGE_KEYS.DIARIES, list);
  },

  // Community Feed
  getPosts(): Post[] {
    return getStorage<Post[]>(STORAGE_KEYS.POSTS, communityPosts);
  },

  addPost(content: string, images: string[] = [], tags: string[] = []): Post {
    const user = this.getUser();
    const list = this.getPosts();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: user.nickname,
      userAvatar: user.avatar,
      userRole: user.role,
      isCoser: user.isCoser,
      coserCN: user.coserCN,
      content,
      images,
      createdAt: '刚刚',
      likes: 0,
      commentsCount: 0,
      favorites: 0,
      tags
    };
    const updated = [newPost, ...list];
    setStorage(STORAGE_KEYS.POSTS, updated);
    return newPost;
  },

  togglePostLike(postId: string): Post[] {
    const list = this.getPosts();
    const updated = list.map(p => {
      if (p.id === postId) {
        const isLiked = !p.liked;
        return {
          ...p,
          liked: isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    });
    setStorage(STORAGE_KEYS.POSTS, updated);
    return updated;
  },

  togglePostBookmark(postId: string): Post[] {
    const list = this.getPosts();
    const updated = list.map(p => {
      if (p.id === postId) {
        const isBookmarked = !p.bookmarked;
        return {
          ...p,
          bookmarked: isBookmarked,
          favorites: isBookmarked ? p.favorites + 1 : Math.max(0, p.favorites - 1)
        };
      }
      return p;
    });
    setStorage(STORAGE_KEYS.POSTS, updated);
    return updated;
  },

  // Chatroom
  getChatMessages(): ChatMessage[] {
    return getStorage<ChatMessage[]>(STORAGE_KEYS.CHAT, initialChatMessages);
  },

  sendChatMessage(content: string): ChatMessage[] {
    const user = this.getUser();
    const current = this.getChatMessages();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: user.nickname,
      userAvatar: user.avatar,
      content,
      timestamp: timeStr,
      isSelf: true,
      type: 'text'
    };
    
    const updated = [...current, newMsg];
    setStorage(STORAGE_KEYS.CHAT, updated);
    return updated;
  },

  // To-Sign (To签)
  getToSignRequests(): ToSignRequest[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return getStorage<ToSignRequest[]>(STORAGE_KEYS.TO_SIGN, [
      {
        id: 'tosign_demo_1',
        galleryId: 'gal_05',
        galleryTitle: 'Coser作品 · 雪中伫立的猫系少女',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
        requesterCN: '雪野原',
        dedicationText: 'TO 雪野原：愿你在千叶的风雪里，亦能拥抱属于自己的真物。 —— 浅羽由乃',
        remarks: '希望能签在右下角的雪地空白处~',
        positionX: 68,
        positionY: 82,
        inkColor: '#0284c7',
        status: 'approved',
        author: '浅羽由乃',
        createdAt: todayStr
      }
    ]);
  },

  createToSignRequest(req: Omit<ToSignRequest, 'id' | 'createdAt' | 'status'>): ToSignRequest {
    const list = this.getToSignRequests();
    const newReq: ToSignRequest = {
      ...req,
      id: `tosign_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    const updated = [newReq, ...list];
    setStorage(STORAGE_KEYS.TO_SIGN, updated);
    return newReq;
  },

  updateToSignStatus(id: string, status: ToSignRequest['status']): ToSignRequest[] {
    const list = this.getToSignRequests();
    const updated = list.map(item => item.id === id ? { ...item, status } : item);
    setStorage(STORAGE_KEYS.TO_SIGN, updated);
    return updated;
  },

  // 认证 Coser 专属审批并签署 To 签
  approveToSignByCoser(
    id: string,
    params: {
      coserCN: string;
      coserNote: string;
      inkColor: string;
      positionX?: number;
      positionY?: number;
    }
  ): { success: boolean; requests: ToSignRequest[]; error?: string } {
    const user = this.getUser();
    if (!user.isCoser && user.role !== 'ROLE_COSER') {
      return {
        success: false,
        requests: this.getToSignRequests(),
        error: '权限受限：To 签为 Coser 专属摄影授权签署，仅限已认证通过的 Coser 博主审批！普通用户或管理员无权代签。'
      };
    }

    const list = this.getToSignRequests();
    const nowStr = new Date().toISOString().split('T')[0];
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'approved' as const,
          coserNote: params.coserNote,
          approvedByCoserCN: params.coserCN || user.coserCN || user.nickname,
          inkColor: params.inkColor || item.inkColor,
          positionX: params.positionX ?? item.positionX,
          positionY: params.positionY ?? item.positionY,
          signedAt: nowStr
        };
      }
      return item;
    });

    setStorage(STORAGE_KEYS.TO_SIGN, updated);
    return { success: true, requests: updated };
  },

  // Episode Video Pins (固定时长打钉写看法)
  getEpisodePins(episodeId: string) {
    return chronicleService.getEpisodePins(episodeId);
  },

  addEpisodePin(params: {
    episodeId: string;
    timestampSeconds: number;
    timestampDisplay: string;
    content: string;
    type: 'insight' | 'lore' | 'proposal';
  }) {
    const user = this.getUser();
    return chronicleService.addEpisodePin({ ...params, user });
  },

  voteEpisodePin(pinId: string, direction: 'up' | 'down') {
    return chronicleService.voteEpisodePin(pinId, direction);
  },

  // Revision History Logs (修改记录)
  getRevisionLogs(targetId?: string) {
    return chronicleService.getRevisionLogs(targetId);
  },

  recordRevisionLog(params: Parameters<typeof chronicleService.recordRevisionLog>[0]) {
    return chronicleService.recordRevisionLog(params);
  },

  // Discussion & Proposal Comments
  getComments(targetId?: string) {
    return chronicleService.getComments(targetId);
  },

  addComment(params: Parameters<typeof chronicleService.addComment>[0]) {
    return chronicleService.addComment(params);
  },

  addProposal(params: Parameters<typeof chronicleService.addProposal>[0]) {
    return chronicleService.addProposal(params);
  },

  voteComment(commentId: string, direction: 'up' | 'down') {
    return chronicleService.voteComment(commentId, direction);
  },

  adoptProposal(commentId: string) {
    const user = this.getUser();
    return chronicleService.adoptProposal(commentId, user);
  },

  adminDirectEdit(params: Parameters<typeof chronicleService.adminDirectEdit>[0]) {
    return chronicleService.adminDirectEdit(params);
  },

  addCommentReply(commentId: string, reply: Parameters<typeof chronicleService.addCommentReply>[1]) {
    return chronicleService.addCommentReply(commentId, reply);
  },

  getRelations(): CharacterRelation[] {
    return chronicleService.getRelations();
  },

  updateRelation(rel: CharacterRelation) {
    return chronicleService.updateRelation(rel);
  },

  getAnimeList(): Anime[] {
    return chronicleService.getAnimeList();
  },

  getAnimeById(id: string) {
    return chronicleService.getAnimeById(id);
  },

  // Coser Certification
  getCoserCertifications(): CoserCertification[] {
    return getStorage<CoserCertification[]>(STORAGE_KEYS.COSER_CERTS, [
      {
        id: 'cert_01',
        userId: 'usr_coser_01',
        userName: '浅羽由乃',
        coserCN: '浅羽由乃',
        bio: '全职平面模特，专注于雪之下雪乃角色出片，连续三年千叶舞台参展。',
        portfolioLinks: ['https://weibo.com/example_coser', 'https://bilibili.com/example'],
        status: 'approved',
        submittedAt: '2025-01-10'
      }
    ]);
  },

  applyCoserCertification(coserCN: string, bio: string, portfolioLinks: string[]): CoserCertification {
    const user = this.getUser();
    const list = this.getCoserCertifications();
    const newCert: CoserCertification = {
      id: `cert_${Date.now()}`,
      userId: user.id,
      userName: user.nickname,
      coserCN,
      bio,
      portfolioLinks,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newCert, ...list];
    setStorage(STORAGE_KEYS.COSER_CERTS, updated);
    return newCert;
  },

  reviewCoserCert(id: string, status: 'approved' | 'rejected'): CoserCertification[] {
    const list = this.getCoserCertifications();
    const updated = list.map(c => {
      if (c.id === id) {
        if (status === 'approved') {
          // If approved, update user's Coser flag
          const user = this.getUser();
          if (user.id === c.userId) {
            this.updateUser({ isCoser: true, coserCN: c.coserCN, role: 'ROLE_COSER' });
          }
        }
        return { ...c, status };
      }
      return c;
    });
    setStorage(STORAGE_KEYS.COSER_CERTS, updated);
    return updated;
  },

  // Global Search
  searchAll(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const characters = oregairuCharacters.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.summary.toLowerCase().includes(q) || 
      c.tags.some(t => t.toLowerCase().includes(q))
    );

    const episodes = episodesData.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.synopsis.toLowerCase().includes(q)
    );

    const outfits = outfitsData.filter(o => 
      o.name.toLowerCase().includes(q) || 
      o.description.toLowerCase().includes(q) ||
      o.tags.some(t => t.toLowerCase().includes(q))
    );

    const quotes = quotesData.filter(qt => 
      qt.chinese.toLowerCase().includes(q) || 
      qt.japanese.toLowerCase().includes(q) || 
      qt.scene.toLowerCase().includes(q)
    );

    const gallery = this.getGallery('all').filter(g => 
      g.title.toLowerCase().includes(q) || 
      g.tags.some(t => t.toLowerCase().includes(q))
    );

    const diaries = this.getDiaries().filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.content.toLowerCase().includes(q)
    );

    return {
      characters,
      episodes,
      outfits,
      quotes,
      gallery,
      diaries
    };
  }
};
