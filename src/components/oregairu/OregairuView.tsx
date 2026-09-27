import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, GitFork, BookOpen, ArrowRight, Play, MapPin, 
  Clock, Sparkles, MessageSquare, ChevronRight, ChevronDown, 
  Film, Layers, CheckCircle2, History, Send, ChevronUp, Tv
} from 'lucide-react';
import { Character, Season, Episode, User, EpisodePin, CharacterRelation, Anime } from '../../types';
import { api } from '../../services/api';
import { InlineDiscussionThread } from '../common/InlineDiscussionThread';

interface OregairuViewProps {
  characters: Character[];
  seasons: Season[];
  episodes: Episode[];
  currentUser: User;
  onNavigateToCharacter: (charId: string) => void;
  onUpdateEpisode?: (updatedEp: Episode) => void;
}

export const OregairuView: React.FC<OregairuViewProps> = ({
  characters,
  seasons,
  episodes,
  currentUser,
  onNavigateToCharacter,
  onUpdateEpisode
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'relations' | 'seasons'>('characters');
  
  // Multi-Anime selection state (for future multi-anime expansion)
  const animeList = api.getAnimeList();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>('oregairu');
  const currentAnime = animeList.find(a => a.id === selectedAnimeId) || animeList[0];

  // Relations list from API
  const [relationsList, setRelationsList] = useState<CharacterRelation[]>(() => api.getRelations());
  const [expandedRelationId, setExpandedRelationId] = useState<string | null>('rel_1');

  // Expanded season ID for seasons tab
  const [expandedSeasonId, setExpandedSeasonId] = useState<number | null>(1);

  // Selected episode for inline video pinning studio
  const [activeEpisodePinStudioId, setActiveEpisodePinStudioId] = useState<string | null>(null);

  // Pin Studio state
  const [currentPinSeconds, setCurrentPinSeconds] = useState(180); // 03:00
  const [pinInputText, setPinInputText] = useState('');
  const [pinType, setPinType] = useState<EpisodePin['type']>('insight');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddPin = (episodeId: string) => {
    if (!pinInputText.trim()) return;
    api.addEpisodePin({
      episodeId,
      timestampSeconds: currentPinSeconds,
      timestampDisplay: formatSeconds(currentPinSeconds),
      content: pinInputText.trim(),
      type: pinType
    });
    setPinInputText('');
    setPinFeedback('✓ 钉子已成功固定在视频时间轴上！');
    setTimeout(() => setPinFeedback(null), 2500);
  };

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header Banner & Multi-Anime Switcher */}
      <section className="relative rounded-3xl overflow-hidden liquid-glass border border-white/80 p-6 sm:p-10 shadow-xs text-center max-w-4xl mx-auto space-y-4">
        
        {/* Multi-Anime Architecture Switcher (未来多动漫扩展) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
            作品归属架构：
          </span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
            {animeList.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedAnimeId(a.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedAnimeId === a.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-sky-600 uppercase font-semibold mb-1">
            <span>{currentAnime.romaji || 'MY YOUTH ROMANTIC COMEDY IS WRONG AS I EXPECTED'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-editorial-mincho">
            {currentAnime.title} · 数字档案世界
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl mx-auto mt-2">
            收录总武高中的青春群像。点击任意人物卡片即可进入完整的独立档案页面，全站所有人物、关系、编年史、单集与时间钉均支持原生讨论与修订申请。
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex justify-center pt-2">
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/60 flex gap-1">
            {[
              { id: 'characters', label: '登场人物档案馆', icon: Users },
              { id: 'relations', label: '人物关系图谱', icon: GitFork },
              { id: 'seasons', label: '动画全三季集数', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Content Tabs */}
      <AnimatePresence mode="wait">
        
        {/* ===================== TAB 1: Characters Overview ===================== */}
        {activeTab === 'characters' && (
          <motion.div
            key="characters"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs text-sky-600 font-mono font-semibold uppercase">
                ALL CHARACTERS · CLICK CARD TO OPEN FULL ARCHIVE
              </span>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                点击任何人物卡片，正常进行页面路由跳转进入该人物完整的独立档案页面（无弹窗遮罩）
              </p>
            </div>

            {/* Character Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 focus-dim-group">
              {characters.map((char, idx) => (
                <motion.div
                  key={char.id}
                  onClick={() => {
                    onNavigateToCharacter(char.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.02, 
                    transition: { type: 'spring', stiffness: 350, damping: 18 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-3xl p-6 liquid-glass border border-white/95 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform duration-500"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-editorial-mincho group-hover:text-sky-700 transition-colors">
                          {char.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">
                          {char.romaji}
                        </p>
                        <p className="text-[11px] text-sky-600 font-medium mt-0.5">
                          CV {char.cv}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-3 mb-4">
                      {char.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                      <div>所属：<span className="text-slate-800 font-medium">{char.club}</span></div>
                      <div>班级：<span className="text-slate-800 font-medium">{char.grade}</span></div>
                      <div>与雪乃：<span className="text-sky-600 font-medium">{char.relationWithYukino}</span></div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-medium">
                    <span>进入完整人物独立档案</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Page-level Inline Discussion for Characters Overview */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    <span>登场人物总览研讨区</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-0.5">
                    欢迎就全角色阵容设定、选角考证与简介细节发起讨论与修改申请
                  </p>
                </div>
              </div>

              <InlineDiscussionThread
                targetId="characters_overview"
                targetType="character"
                targetTitle="登场人物总览研讨"
                currentUser={currentUser}
                defaultExpanded={true}
              />
            </div>
          </motion.div>
        )}

        {/* ===================== TAB 2: Relations Network ===================== */}
        {activeTab === 'relations' && (
          <motion.div
            key="relations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs text-sky-600 font-mono font-semibold uppercase">
                INTERACTIVE CHARACTER RELATIONS NETWORK
              </span>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                每一条关系均是可点击的内容对象，展开后可查看阶段演进、关键剧情与专属讨论
              </p>
            </div>

            {/* Relations List with Inline Expand Accordion */}
            <div className="space-y-4 max-w-4xl mx-auto">
              {relationsList.map((rel) => {
                const source = characters.find(c => c.id === rel.sourceId);
                const target = characters.find(c => c.id === rel.targetId);
                const isExpanded = expandedRelationId === rel.id;

                return (
                  <div
                    key={rel.id}
                    className="rounded-3xl liquid-glass border border-white/95 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Header: Click to Expand / Collapse inline */}
                    <div
                      onClick={() => setExpandedRelationId(isExpanded ? null : rel.id)}
                      className="p-5 sm:p-6 cursor-pointer hover:bg-sky-50/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-2">
                          <img
                            src={source?.avatar}
                            alt={source?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                          <img
                            src={target?.avatar}
                            alt={target?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 font-editorial-mincho">
                              {source?.name} ↔ {target?.name}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-medium border border-sky-100">
                              {rel.relationType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-light line-clamp-1 mt-0.5">
                            {rel.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-sky-600 font-medium shrink-0 self-end sm:self-auto">
                        <span>{isExpanded ? '收起详情' : '展开关系详情与讨论'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Inline Expanded Content (Stages, Events, Quotes, Discussion) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden border-t border-slate-100 p-6 sm:p-8 space-y-6 bg-white/40"
                        >
                          {/* 1. Description */}
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-400 font-mono uppercase">
                              关系总括描述：
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                              {rel.description}
                            </p>
                          </div>

                          {/* 2. Development Stages */}
                          {rel.developmentStages && rel.developmentStages.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-sky-600" />
                                <span>羁绊演进历史阶段</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {rel.developmentStages.map((stage, idx) => (
                                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1 text-xs">
                                    <span className="font-semibold text-sky-900 block">{stage.stage}</span>
                                    <p className="text-slate-600 font-light leading-relaxed text-[11px]">{stage.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Key Events */}
                          {rel.keyEvents && rel.keyEvents.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                                <span>关键交汇剧情节点</span>
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {rel.keyEvents.map((ke, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 text-xs border border-sky-100 font-medium"
                                  >
                                    • {ke}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Dedicated Inline Discussion for this Relation */}
                          <InlineDiscussionThread
                            targetId={`relation_${rel.id}`}
                            targetType="relation"
                            targetTitle={`${source?.name} ↔ ${target?.name} · 关系研讨`}
                            currentContent={rel.description}
                            currentUser={currentUser}
                            onContentUpdated={(newDesc) => {
                              const updated = { ...rel, description: newDesc };
                              api.updateRelation(updated);
                              setRelationsList(api.getRelations());
                            }}
                            defaultExpanded={true}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Page-level Inline Discussion for Relations Overview */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-4 max-w-4xl mx-auto">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-sky-600" />
                  <span>人物关系图谱 · 全站研讨区</span>
                </h3>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  就春物复杂的人物情感网络、共依存定义与三角关系本质展开交流
                </p>
              </div>

              <InlineDiscussionThread
                targetId="relations_overview"
                targetType="relation"
                targetTitle="人物关系图谱 · 全站研讨"
                currentUser={currentUser}
                defaultExpanded={false}
              />
            </div>
          </motion.div>
        )}

        {/* ===================== TAB 3: Seasons & Episodes ===================== */}
        {activeTab === 'seasons' && (
          <motion.div
            key="seasons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs text-sky-600 font-mono font-semibold uppercase">
                TV ANIMATION SEASONS & EPISODES
              </span>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                展开各季查看具体集数，点击任意一集即可在下方直接展开视频时间钉研讨与单集考据
              </p>
            </div>

            <div className="space-y-6">
              {seasons.map((season) => {
                const seasonEpisodes = episodes.filter(e => e.seasonId === season.id);
                const isExpanded = expandedSeasonId === season.id;

                return (
                  <div
                    key={season.id}
                    className="rounded-3xl liquid-glass border border-white/95 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Season Header */}
                    <div
                      onClick={() => setExpandedSeasonId(isExpanded ? null : season.id)}
                      className="p-6 sm:p-8 cursor-pointer hover:bg-sky-50/40 transition-colors flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-sky-600 font-bold uppercase">
                          <span>TV ANIMATION</span>
                          <span>·</span>
                          <span>{season.year}</span>
                          <span>·</span>
                          <span>全 {season.episodeCount} 话</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-editorial-mincho">
                          {season.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-light max-w-xl">
                          {season.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-sky-600 font-medium">
                        <span>{isExpanded ? '收起季集数' : '展开所有单集'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Season Content: Episodes & Season Discussion */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden border-t border-slate-100 p-6 sm:p-8 space-y-6 bg-slate-50/30"
                        >
                          {/* Season-level discussion */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                            <span className="font-bold text-xs text-slate-800 font-editorial-mincho">
                              本季 ({season.title}) 剧情总览讨论
                            </span>
                            <InlineDiscussionThread
                              targetId={`season_${season.id}`}
                              targetType="season"
                              targetTitle={`${season.title} · 季度总研讨`}
                              currentContent={season.description}
                              currentUser={currentUser}
                              defaultExpanded={false}
                            />
                          </div>

                          {/* Episodes Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {seasonEpisodes.map((ep) => {
                              const isPinStudioOpen = activeEpisodePinStudioId === ep.id;
                              const episodePins = api.getEpisodePins(ep.id);

                              return (
                                <div
                                  key={ep.id}
                                  className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between text-xs text-sky-600 font-mono font-medium mb-1">
                                      <span>第 {ep.episodeNumber} 话</span>
                                      <span className="text-slate-400 text-[10px]">{episodePins.length} 个视频钉子</span>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-900 font-editorial-mincho">
                                      {ep.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-editorial-mincho mt-0.5">
                                      {ep.japaneseTitle}
                                    </p>

                                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 font-light">
                                      {ep.synopsis}
                                    </p>
                                  </div>

                                  {/* Action: Toggle Video Pinning Studio */}
                                  <div className="pt-2 border-t border-slate-100">
                                    <button
                                      onClick={() => setActiveEpisodePinStudioId(isPinStudioOpen ? null : ep.id)}
                                      className="w-full py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-medium flex items-center justify-between transition-colors"
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>固定时长打钉写看法 ({episodePins.length})</span>
                                      </span>
                                      {isPinStudioOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    {/* Video Pinning Studio Inline */}
                                    <AnimatePresence>
                                      {isPinStudioOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="overflow-hidden pt-3 space-y-3"
                                        >
                                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                                            <div className="flex items-center justify-between">
                                              <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Film className="w-3.5 h-3.5 text-sky-600" />
                                                <span>视频时间钉模拟器 (全长 24:00)</span>
                                              </span>
                                              <span className="font-mono text-sky-700 font-bold bg-sky-100/70 px-2 py-0.5 rounded-md text-[11px]">
                                                {formatSeconds(currentPinSeconds)}
                                              </span>
                                            </div>

                                            {/* Range slider for video time */}
                                            <input
                                              type="range"
                                              min="0"
                                              max="1440"
                                              value={currentPinSeconds}
                                              onChange={(e) => setCurrentPinSeconds(parseInt(e.target.value, 10))}
                                              className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                                            />

                                            {/* New Pin input */}
                                            <div className="space-y-1.5 pt-1">
                                              <input
                                                type="text"
                                                value={pinInputText}
                                                onChange={(e) => setPinInputText(e.target.value)}
                                                placeholder={`在此时间戳 (${formatSeconds(currentPinSeconds)}) 钉下你的观点...`}
                                                className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddPin(ep.id);
                                                  }
                                                }}
                                              />

                                              <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                  {(['insight', 'lore', 'proposal'] as const).map(t => (
                                                    <button
                                                      key={t}
                                                      type="button"
                                                      onClick={() => setPinType(t)}
                                                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                                                        pinType === t ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                                                      }`}
                                                    >
                                                      {t === 'insight' ? '感悟' : t === 'lore' ? '细节考据' : '修改提议'}
                                                    </button>
                                                  ))}
                                                </div>

                                                <button
                                                  type="button"
                                                  onClick={() => handleAddPin(ep.id)}
                                                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium flex items-center gap-1 shadow-2xs"
                                                >
                                                  <Send className="w-3 h-3" />
                                                  <span>打钉</span>
                                                </button>
                                              </div>
                                            </div>

                                            {pinFeedback && (
                                              <p className="text-[11px] text-emerald-600 font-medium">{pinFeedback}</p>
                                            )}

                                            {/* Existing Pins on this episode */}
                                            {episodePins.length > 0 && (
                                              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 max-h-36 overflow-y-auto">
                                                <span className="text-[10px] text-slate-400 font-mono uppercase block">已固定的时间钉：</span>
                                                {episodePins.map(pin => (
                                                  <div
                                                    key={pin.id}
                                                    onClick={() => setCurrentPinSeconds(pin.timestampSeconds)}
                                                    className="p-2 rounded-lg bg-white border border-slate-100 text-[11px] space-y-0.5 cursor-pointer hover:border-sky-300 transition-colors"
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <span className="font-mono text-sky-700 font-bold">📌 {pin.timestampDisplay}</span>
                                                      <span className="text-slate-400 text-[10px]">{pin.userName}</span>
                                                    </div>
                                                    <p className="text-slate-700 font-light">{pin.content}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {/* Pure Inline Discussion for this Episode */}
                                    <InlineDiscussionThread
                                      targetId={`episode_${ep.id}`}
                                      targetType="episode"
                                      targetTitle={`第${ep.episodeNumber}话 · ${ep.title}`}
                                      currentContent={ep.synopsis}
                                      currentUser={currentUser}
                                      onContentUpdated={(newSynopsis) => {
                                        const updated = { ...ep, synopsis: newSynopsis };
                                        onUpdateEpisode?.(updated);
                                      }}
                                      defaultExpanded={false}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
