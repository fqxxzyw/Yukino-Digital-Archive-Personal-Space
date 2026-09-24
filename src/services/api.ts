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
  CoserCertification
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
    if (seasonId) {
      return episodesData.filter(ep => ep.seasonId === seasonId);
    }
    return episodesData;
  },

  getEpisodeById(id: string): Episode | undefined {
    return episodesData.find(ep => ep.id === id);
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

  likeGalleryItem(id: string): GalleryItem[] {
    const items = this.getGallery('all');
    const updated = items.map(g => {
      if (g.id === id) {
        return { ...g, likes: g.likes + 1 };
      }
      return g;
    });
    setStorage(STORAGE_KEYS.GALLERY, updated);
    return updated;
  },

  // Merch
  getMerch(category?: string): MerchItem[] {
    if (!category || category === 'all') return merchData;
    return merchData.filter(m => m.category === category);
  },

  // Diaries
  getDiaries(): Diary[] {
    return getStorage<Diary[]>(STORAGE_KEYS.DIARIES, diariesData);
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
        createdAt: '2025-01-20'
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
