import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Shirt, 
  Quote as QuoteIcon, 
  Volume2, 
  ShoppingBag, 
  ChevronRight, 
  Play, 
  Heart,
  Calendar,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';

import { 
  Character, 
  Season, 
  Episode, 
  Outfit, 
  Quote, 
  VoiceLine, 
  MerchItem 
} from '../../types';

interface YukinoArchiveViewProps {
  yukino: Character;
  seasons: Season[];
  episodes: Episode[];
  outfits: Outfit[];
  quotes: Quote[];
  voiceLines: VoiceLine[];
  merch: MerchItem[];
  onPlayVoice: (index: number) => void;
  onNavigateToEpisode?: (epId: string) => void;
}

export const YukinoArchiveView: React.FC<YukinoArchiveViewProps> = ({
  yukino,
  seasons,
  episodes,
  outfits,
  quotes,
  voiceLines,
  merch,
  onPlayVoice
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'timeline' | 'outfits' | 'quotes' | 'voices' | 'merch'>('profile');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const subTabs = [
    { id: 'profile', label: '角色总览', icon: BookOpen },
    { id: 'timeline', label: '经历编年史', icon: Clock },
    { id: 'outfits', label: '代表服饰', icon: Shirt },
    { id: 'quotes', label: '经典语录', icon: QuoteIcon },
    { id: 'voices', label: '原声音频', icon: Volume2 },
    { id: 'merch', label: '典藏周边', icon: ShoppingBag }
  ];

  const filteredEpisodes = episodes.filter(ep => ep.seasonId === selectedSeason);

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Archive Hero: High-end Editorial Magazine Header */}
      <section className="relative rounded-3xl overflow-hidden liquid-glass border border-white/80 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Zone */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sky-600 font-semibold">
              <span>EDITORIAL ARCHIVE</span>
              <span>·</span>
              <span>CHAR-001</span>
              <span>·</span>
              <span>SOBU HIGH 2-J</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-editorial-mincho">
              雪之下 雪乃
            </h1>
            <p className="text-sm font-sans tracking-wide text-slate-400 font-medium">
              YUKINOSHITA YUKINO / CV 早见沙织
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light pt-2 max-w-xl">
              总武高中的“冰之女王”，侍奉部部长。生于名门雪之下家，拥有过人的才智与严苛的自我准则。在与同伴共同探寻“真物”的旅途中，逐渐解开冰封的内心。
            </p>

            {/* Quick Spec List - Zero Pill Rule */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">BIRTHDAY</span>
                <span className="font-medium text-slate-800">1月3日 (摩羯)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">AFFILIATION</span>
                <span className="font-medium text-slate-800">侍奉部 (部长)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">FAMILY</span>
                <span className="font-medium text-slate-800">雪之下家族次女</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">PASSION</span>
                <span className="font-medium text-slate-800">猫咪 / 潘先生</span>
              </div>
            </div>
          </div>

          {/* Right Image Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 group">
              <img
                src={yukino.avatar}
                alt={yukino.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] text-white/90 font-editorial-mincho">
                  「追求真物，难道是一件不可理喻的事吗？」
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Sub Navigation Tabs: Liquid Indicator */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl liquid-glass border border-white/90 flex flex-wrap gap-1 shadow-sm">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 ${
                  isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeYukinoSubTab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-sky-100/60 -z-10"
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Tab Content */}
      <AnimatePresence mode="wait">
        
        {/* Profile Tab */}
        {activeSubTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl liquid-glass border border-white/80 space-y-3">
                <span className="text-xs font-mono text-sky-600 font-semibold">01. 侍奉部的创立理念</span>
                <h3 className="text-base font-bold text-slate-800 font-editorial-mincho">授人以渔，而非授人以鱼</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  雪乃认为无条件给予软弱者施舍只会促长无能，唯有帮助求助者找寻凭借自身克服困难的意志，才是真正意义上的拯救。
                </p>
              </div>

              <div className="p-6 rounded-3xl liquid-glass border border-white/80 space-y-3">
                <span className="text-xs font-mono text-sky-600 font-semibold">02. 潘先生与反差萌</span>
                <h3 className="text-base font-bold text-slate-800 font-editorial-mincho">清冷坚冰下的柔软之处</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  尽管平时严谨冷峻，但面对千叶吉祥物“潘先生”（Pan-san）以及路边流浪猫时，会流露出毫无戒备的宠溺目光与少女神态。
                </p>
              </div>

              <div className="p-6 rounded-3xl liquid-glass border border-white/80 space-y-3">
                <span className="text-xs font-mono text-sky-600 font-semibold">03. 真物的终极探寻</span>
                <h3 className="text-base font-bold text-slate-800 font-editorial-mincho">拒绝虚饰的纯粹纽带</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  她厌恶敷衍的妥协与表面的温情。在天桥的黄昏中与八幡立下一生的托付，宣告了从姐姐阴影中的彻底蜕变。
                </p>
              </div>
            </div>

            {/* In-depth Character Lore Banner */}
            <div className="rounded-3xl p-8 liquid-glass border border-white/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho">
                人物成长与心路历程
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                从第一季中坚信“优秀者背负义务”的孤高清冷，到第二季中面对学生会选举和共依存困境时的迷惘无助，再到第三季中独立承办舞会企划并勇敢对八幡袒露内心：“请把你的生命交给我”。雪之下雪乃的魅力不仅在于她的聪慧与冷艳，更在于那份追求真实哪怕遍体鳞伤的极致纯粹。
              </p>
            </div>
          </motion.div>
        )}

        {/* Timeline / Chapters Tab */}
        {activeSubTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Season Filter Tabs */}
            <div className="flex items-center justify-center gap-2">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedSeason === s.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/60'
                  }`}
                >
                  {s.title} ({s.year})
                </button>
              ))}
            </div>

            {/* Episode List Cards */}
            <div className="space-y-4">
              {filteredEpisodes.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="rounded-3xl p-6 liquid-glass border border-white/80 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="w-full md:w-56 aspect-[16/9] rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white">
                    <img
                      src={ep.imageUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-sky-600">
                      <span>SEASON {ep.seasonId}</span>
                      <span>·</span>
                      <span>EPISODE {ep.episodeNumber}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-editorial-mincho">
                      {ep.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-editorial-mincho">
                      {ep.japaneseTitle}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {ep.synopsis}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">登场角色：</span>
                      {ep.charactersInvolved.join(' · ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Outfits Tab */}
        {activeSubTab === 'outfits' && (
          <motion.div
            key="outfits"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center max-w-lg mx-auto mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho">
                雪之下雪乃 · 典藏服饰档案
              </h3>
              <p className="text-xs text-slate-500 font-light mt-1">
                点击任意服饰查看出现场景、登场集数与经典剧情关联网络
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  onClick={() => setSelectedOutfit(outfit)}
                  className="rounded-3xl p-5 liquid-glass border border-white/90 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm border border-white">
                      <img
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                      {outfit.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 font-editorial-mincho mt-0.5">
                      {outfit.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 font-light">
                      {outfit.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-medium">
                    <span>首次登场: {outfit.firstAppearance.slice(0, 7)}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Outfit Detail Modal */}
            <AnimatePresence>
              {selectedOutfit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 space-y-4 relative"
                  >
                    <button
                      onClick={() => setSelectedOutfit(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={selectedOutfit.imageUrl}
                        alt={selectedOutfit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-sky-600 font-medium uppercase">
                        {selectedOutfit.japaneseName}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho">
                        {selectedOutfit.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {selectedOutfit.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] block">配色方案</span>
                        <span className="text-slate-800 font-medium">{selectedOutfit.color}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] block">剧情发生场景</span>
                        <span className="text-slate-700 font-light">{selectedOutfit.sceneDescription}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quotes Tab */}
        {activeSubTab === 'quotes' && (
          <motion.div
            key="quotes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-3xl p-6 sm:p-7 liquid-glass border border-white/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{quote.episodeTitle}</span>
                      <span>S{quote.seasonId}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 font-editorial-mincho leading-relaxed">
                      「{quote.chinese}」
                    </p>

                    <p className="text-xs text-slate-500 font-editorial-mincho italic">
                      {quote.japanese}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-[11px] text-slate-600 font-light">
                      <span className="font-semibold text-slate-800 block mb-0.5">背景释义：</span>
                      {quote.background}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>场景：{quote.scene}</span>
                    <span className="text-sky-600 font-medium">雪之下雪乃</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Voice Lines Tab */}
        {activeSubTab === 'voices' && (
          <motion.div
            key="voices"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-800 flex items-center justify-between">
              <span>早见沙织 (Hayami Saori) 录音棚原声台词档案馆</span>
              <span className="font-mono text-[11px]">4 条精选曲目</span>
            </div>

            {voiceLines.map((line, idx) => (
              <div
                key={line.id}
                onClick={() => onPlayVoice(idx)}
                className="p-5 rounded-2xl liquid-glass border border-white/90 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 group-hover:bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 font-editorial-mincho truncate">
                      {line.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-editorial-mincho truncate mt-0.5">
                      {line.japaneseText}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {line.scene}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="text-xs font-mono text-slate-400 block">{line.duration}</span>
                  <span className="text-[10px] text-sky-600 font-medium">点击试听</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Merch Tab */}
        {activeSubTab === 'merch' && (
          <motion.div
            key="merch"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {merch.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl p-5 liquid-glass border border-white/80 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-sm border border-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    {item.manufacturer}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 font-editorial-mincho mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{item.releaseDate}</span>
                  <span className="font-semibold text-slate-900 font-mono">{item.price}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
