import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './services/api';
import { 
  User, 
  GalleryItem, 
  ToSignRequest, 
  Diary, 
  Post, 
  ChatMessage, 
  CoserCertification 
} from './types';

// Common Components
import { LiquidNavbar } from './components/common/LiquidNavbar';
import { FloatingTabBar } from './components/common/FloatingTabBar';
import { AudioPlayer } from './components/common/AudioPlayer';
import { ImageLightbox } from './components/common/ImageLightbox';

// View Modules
import { HomeView } from './components/home/HomeView';
import { YukinoArchiveView } from './components/yukino/YukinoArchiveView';
import { OregairuView } from './components/oregairu/OregairuView';
import { GalleryView } from './components/gallery/GalleryView';
import { FeedView } from './components/community/FeedView';
import { DiaryView } from './components/diary/DiaryView';
import { ChatRoomView } from './components/chat/ChatRoomView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminView } from './components/admin/AdminView';

// Modals
import { ToSignModal } from './components/tosign/ToSignModal';
import { SearchModal } from './components/search/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { DesignPhilosophyModal } from './components/common/DesignPhilosophyModal';
import { SnowfallCanvas } from './components/common/SnowfallCanvas';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Core Data State
  const [user, setUser] = useState<User>(api.getUser());
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(api.getGallery('all'));
  const [diaries, setDiaries] = useState<Diary[]>(api.getDiaries());
  const [posts, setPosts] = useState<Post[]>(api.getPosts());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(api.getChatMessages());
  const [toSignRequests, setToSignRequests] = useState<ToSignRequest[]>(api.getToSignRequests());
  const [coserCerts, setCoserCerts] = useState<CoserCertification[]>(api.getCoserCertifications());

  // Static/Lore Data
  const yukino = api.getCharacterById('char_yukino')!;
  const characters = api.getCharacters();
  const seasons = api.getSeasons();
  const episodes = api.getEpisodes();
  const outfits = api.getOutfits();
  const quotes = api.getQuotes();
  const voiceLines = api.getVoiceLines();
  const merch = api.getMerch();

  // Audio Player State
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState<number>(0);

  // Lightbox State
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // To-Sign Modal State
  const [isToSignOpen, setIsToSignOpen] = useState<boolean>(false);
  const [toSignPreselectedItem, setToSignPreselectedItem] = useState<GalleryItem | null>(null);

  // Search & Auth Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState<boolean>(false);

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Handlers
  const handleUpdateUser = (updatedFields: Partial<User>) => {
    const updated = api.updateUser(updatedFields);
    setUser(updated);
  };

  const handleLikeGalleryItem = (id: string) => {
    const updated = api.likeGalleryItem(id);
    setGalleryItems(updated);
    if (lightboxItem?.id === id) {
      setLightboxItem(updated.find(i => i.id === id) || null);
    }
  };

  const handlePlayVoiceTrack = (index: number) => {
    setCurrentVoiceIndex(index);
    setIsPlayingAudio(true);
    setIsAudioPlayerOpen(true);
  };

  const handleOpenLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
    setIsLightboxOpen(true);
  };

  const handleNextLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = galleryItems.findIndex(i => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setLightboxItem(galleryItems[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = galleryItems.findIndex(i => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setLightboxItem(galleryItems[prevIndex]);
  };

  const handleOpenToSignFromItem = (item: GalleryItem) => {
    setToSignPreselectedItem(item);
    setIsLightboxOpen(false);
    setIsToSignOpen(true);
  };

  const handleSubmitToSign = (req: Omit<ToSignRequest, 'id' | 'createdAt' | 'status'>) => {
    api.createToSignRequest(req);
    setToSignRequests(api.getToSignRequests());
  };

  const handleUpdateToSignStatus = (id: string, status: ToSignRequest['status']) => {
    const updated = api.updateToSignStatus(id, status);
    setToSignRequests(updated);
  };

  const handleApplyCoser = (coserCN: string, bio: string, portfolioLinks: string[]) => {
    api.applyCoserCertification(coserCN, bio, portfolioLinks);
    setCoserCerts(api.getCoserCertifications());
  };

  const handleReviewCoserCert = (id: string, status: 'approved' | 'rejected') => {
    const updated = api.reviewCoserCert(id, status);
    setCoserCerts(updated);
    setUser(api.getUser());
  };

  const handleAddDiary = (d: Omit<Diary, 'id' | 'views'>) => {
    api.addDiary(d);
    setDiaries(api.getDiaries());
  };

  const handleDeleteDiary = (id: string) => {
    api.deleteDiary(id);
    setDiaries(api.getDiaries());
  };

  const handleNewPost = (content: string, images: string[] = [], tags: string[] = []) => {
    api.addPost(content, images, tags);
    setPosts(api.getPosts());
  };

  const handleLikePost = (postId: string) => {
    const updated = api.togglePostLike(postId);
    setPosts(updated);
  };

  const handleBookmarkPost = (postId: string) => {
    const updated = api.togglePostBookmark(postId);
    setPosts(updated);
  };

  const handleSendMessage = (content: string) => {
    const updated = api.sendChatMessage(content);
    setChatMessages(updated);

    // Smart interactive simulated response from Yukino / Hachiman
    const lower = content.toLowerCase();
    setTimeout(() => {
      let reply = '';
      let replyAuthor = '雪之下雪乃';
      let replyAvatar = '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg';

      if (lower.includes('真物') || lower.includes('代价')) {
        reply = '追求不掺杂虚假的真实关系，势必伴随着打破现状的刺痛。但如果不去探寻，便只能永远栖身于谎言构筑的温室之中。';
      } else if (lower.includes('红茶')) {
        reply = '今天煮的是大吉岭红茶。侍奉部向来只招待能认真直面自我问题的客人。';
      } else if (lower.includes('猫') || lower.includes('潘先生')) {
        reply = '……咳，潘先生的呆萌神态是有其哲学意义的！而且路边的猫咪只要毛发柔顺，谁都会驻足多看两眼吧……才没有特别狂热呢。';
      } else if (lower.includes('雪乃')) {
        reply = '我在。如果你有什么需要协助的委托，请理清思绪后再开口。';
      } else {
        reply = '侍奉部已经收悉你的发言。只要是不违背原则的事，我们会在合理范围内予以关注。';
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        userId: 'bot_yukino',
        userName: replyAuthor,
        userAvatar: replyAvatar,
        content: reply,
        timestamp: timeStr,
        isSelf: false,
        type: 'text'
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-800 bg-transparent relative">
      
      {/* 0. Ambient Particle Microphysics (Awwwards / React-bits dynamic frontend) */}
      <SnowfallCanvas density={32} speed={0.5} interactive={true} />

      {/* 1. Liquid Glass Top Navbar (3-zone Top Bar Contract) */}
      <LiquidNavbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isPlayingAudio={isPlayingAudio}
        onToggleAudioWidget={() => setIsAudioPlayerOpen(!isAudioPlayerOpen)}
        onOpenDesignPhilosophy={() => setIsPhilosophyOpen(true)}
      />

      {/* 2. Main Page Content with Animated Transitions */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{ 
              duration: 0.55, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {currentTab === 'home' && (
              <HomeView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                yukino={yukino}
                characters={characters}
                recentDiaries={diaries}
                recentPosts={posts}
                user={user}
                onOpenVoicePlayer={() => {
                  setIsAudioPlayerOpen(true);
                  setIsPlayingAudio(true);
                }}
                onOpenDesignPhilosophy={() => setIsPhilosophyOpen(true)}
              />
            )}

            {currentTab === 'yukino' && (
              <YukinoArchiveView
                yukino={yukino}
                seasons={seasons}
                episodes={episodes}
                outfits={outfits}
                quotes={quotes}
                voiceLines={voiceLines}
                merch={merch}
                onPlayVoice={handlePlayVoiceTrack}
              />
            )}

            {currentTab === 'oregairu' && (
              <OregairuView
                characters={characters}
                seasons={seasons}
                episodes={episodes}
              />
            )}

            {currentTab === 'gallery' && (
              <GalleryView
                items={galleryItems}
                onOpenLightbox={handleOpenLightbox}
                onLikeItem={handleLikeGalleryItem}
                onRequestToSign={handleOpenToSignFromItem}
              />
            )}

            {currentTab === 'feed' && (
              <FeedView
                posts={posts}
                user={user}
                onLikePost={handleLikePost}
                onBookmarkPost={handleBookmarkPost}
                onNewPost={handleNewPost}
                onRequestToSignFromPost={(img, author) => {
                  const matched = galleryItems.find(g => g.imageUrl === img) || galleryItems[0];
                  handleOpenToSignFromItem(matched);
                }}
              />
            )}

            {currentTab === 'diary' && (
              <DiaryView
                diaries={diaries}
                user={user}
                onAddDiary={handleAddDiary}
                onDeleteDiary={handleDeleteDiary}
              />
            )}

            {currentTab === 'chat' && (
              <ChatRoomView
                messages={chatMessages}
                user={user}
                onSendMessage={handleSendMessage}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                toSignRequests={toSignRequests}
                bookmarkedPosts={posts.filter(p => p.bookmarked)}
                onApplyCoser={handleApplyCoser}
                coserCert={coserCerts.find(c => c.userId === user.id)}
              />
            )}

            {currentTab === 'admin' && (
              <AdminView
                toSignRequests={toSignRequests}
                onUpdateToSignStatus={handleUpdateToSignStatus}
                coserCerts={coserCerts}
                onReviewCoserCert={handleReviewCoserCert}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating Minimal Audio Player Widget */}
      <AnimatePresence>
        {isAudioPlayerOpen && (
          <AudioPlayer
            tracks={voiceLines}
            currentTrackIndex={currentVoiceIndex}
            isPlaying={isPlayingAudio}
            onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
            onNext={() => setCurrentVoiceIndex((prev) => (prev + 1) % voiceLines.length)}
            onPrev={() => setCurrentVoiceIndex((prev) => (prev - 1 + voiceLines.length) % voiceLines.length)}
            onClose={() => {
              setIsPlayingAudio(false);
              setIsAudioPlayerOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* 4. Fullscreen Frosted Glass Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        item={lightboxItem}
        items={galleryItems}
        onClose={() => setIsLightboxOpen(false)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
        onLike={handleLikeGalleryItem}
        onRequestToSign={handleOpenToSignFromItem}
      />

      {/* 5. 5-Step Signature To-Sign Creative Studio Modal */}
      <ToSignModal
        isOpen={isToSignOpen}
        onClose={() => setIsToSignOpen(false)}
        galleryItems={galleryItems}
        preselectedItem={toSignPreselectedItem}
        onSubmit={handleSubmitToSign}
      />

      {/* 6. Global Omnibox Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 7. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          api.updateUser(loggedUser);
        }}
      />

      {/* 7.5. Design Philosophy Modal (解构 - 提炼 - 重构) */}
      <DesignPhilosophyModal
        isOpen={isPhilosophyOpen}
        onClose={() => setIsPhilosophyOpen(false)}
      />

      {/* 8. Mobile Safe-Area Floating Bottom Dock Bar */}
      <FloatingTabBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 9. Minimalist Apple-style Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200/50 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-mono space-y-2">
        <p>
          雪之下雪乃 · 数字档案馆与个人生活空间 · YUKINO ARCHIVE
        </p>
        <p className="font-sans text-[11px] text-slate-400/80 font-light">
          基于 Liquid Glass 设计系统构建 · 愿不被伪物所蒙蔽的真心，终能穿越风雪与寒冬
        </p>
      </footer>

    </div>
  );
}
