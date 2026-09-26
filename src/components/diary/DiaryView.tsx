import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Feather, Plus, Trash2, Calendar, Lock, Globe, X, Eye, 
  Sparkles, PenTool, Image as ImageIcon, Quote, Check, ArrowRight, CornerDownLeft,
  Heart, MessageSquareHeart, Activity, ChevronLeft, ChevronRight, Clock, Filter, RefreshCw,
  MapPin, Compass, Navigation, Globe2, Radio
} from 'lucide-react';
import { Diary, User, ToSignRequest, DiaryLocation } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { analyzeYukinoSentiment, EMOTION_CATEGORIES } from '../../services/sentimentService';
import { HeartLocationMap } from './HeartLocationMap';
import { ICONIC_LOCATIONS } from '../../services/locationPresets';
import { ActivityDotMatrix, ActivityMatrixItem } from '../common/ActivityDotMatrix';

interface DiaryViewProps {
  diaries: Diary[];
  user: User;
  toSignRequests?: ToSignRequest[];
  onAddDiary: (diary: Omit<Diary, 'id' | 'views'>) => void;
  onDeleteDiary: (id: string) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  diaries,
  user,
  toSignRequests = [],
  onAddDiary,
  onDeleteDiary
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('晴朗 · 5°C');
  const [tagInput, setTagInput] = useState('千叶生活');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<string>('');
  const [linkedToSignId, setLinkedToSignId] = useState<string>('');
  const [linkedToSignTitle, setLinkedToSignTitle] = useState<string>('');
  const [linkedToSignDedication, setLinkedToSignDedication] = useState<string>('');

  // Location / Coordinate Feature (可选地理坐标标签与心之所属地)
  const [selectedLocation, setSelectedLocation] = useState<DiaryLocation | null>(null);
  const [isCustomLocMode, setIsCustomLocMode] = useState<boolean>(false);
  const [customLocName, setCustomLocName] = useState<string>('');
  const [customLocCity, setCustomLocCity] = useState<string>('千叶市');
  const [customLocLat, setCustomLocLat] = useState<string>('35.6375');
  const [customLocLng, setCustomLocLng] = useState<string>('140.0982');
  const [customLocAtmosphere, setCustomLocAtmosphere] = useState<string>('');

  // Horizontal Timeline Scroll Handler
  const handleScrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Chronologically sorted diaries
  const sortedDiaries = useMemo(() => {
    return [...diaries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [diaries]);

  // Filtered by selected mood
  const filteredDiaries = useMemo(() => {
    if (selectedMood === 'all') return sortedDiaries;
    return sortedDiaries.filter((d) => {
      const sentiment = d.sentiment || analyzeYukinoSentiment(d.title, d.content, d.tags);
      return sentiment.mood === selectedMood;
    });
  }, [sortedDiaries, selectedMood]);

  // Counts for each mood category
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = { all: diaries.length };
    diaries.forEach((d) => {
      const sentiment = d.sentiment || analyzeYukinoSentiment(d.title, d.content, d.tags);
      counts[sentiment.mood] = (counts[sentiment.mood] || 0) + 1;
    });
    return counts;
  }, [diaries]);

  // Convert diaries into dot matrix activity items with mood-based colors
  const diaryActivityItems = useMemo<ActivityMatrixItem[]>(() => {
    const targetDiaries = selectedMood === 'all' 
      ? diaries 
      : diaries.filter(d => {
          const sentiment = d.sentiment || analyzeYukinoSentiment(d.title, d.content, d.tags);
          return sentiment.mood === selectedMood;
        });

    return targetDiaries.map(d => {
      const sentiment = d.sentiment || analyzeYukinoSentiment(d.title, d.content, d.tags);
      return {
        id: d.id,
        date: d.date,
        value: 1,
        color: sentiment.color,
        label: sentiment.moodLabel.split(' · ')[0],
        title: d.title,
        meta: d
      };
    });
  }, [diaries, selectedMood]);

  const moodLegendItems = useMemo(() => {
    return EMOTION_CATEGORIES.map(c => ({
      label: c.moodLabel.split(' · ')[0],
      color: c.color
    }));
  }, []);

  // Real-time sentiment analysis by Yukino personality model
  const liveSentiment = useMemo(() => {
    return analyzeYukinoSentiment(title, content, tagInput.split(' ').filter(Boolean));
  }, [title, content, tagInput]);

  // Identify today's To-sign requests (fallback to recent if none today)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayToSigns = toSignRequests.filter(r => r.createdAt === todayStr);
  const recommendedToSigns = todayToSigns.length > 0 ? todayToSigns : toSignRequests.slice(0, 3);
  const [activeRecIndex, setActiveRecIndex] = useState<number>(0);
  const currentRec = recommendedToSigns[activeRecIndex] || null;

  const handleApplyToSignQuote = (req: ToSignRequest) => {
    const quoteBlock = `【今日To签灵感 ·《${req.galleryTitle}》】\n“${req.dedicationText}”\n\n`;
    setContent((prev) => (prev ? `${quoteBlock}${prev}` : `${quoteBlock}今天在侍奉部完成了向 Coser 的 To 签定制申请，落款受签【${req.requesterCN}】。在千叶的静谧冬日里，期待手写墨迹凝结成专属于彼此的真物记忆。`));
    
    if (!title.trim() || title === '日记标题...') {
      setTitle(`千叶随想 · 关于《${req.galleryTitle}》的To签回响`);
    }

    if (!tagInput.includes('To签手记')) {
      setTagInput((prev) => `${prev} To签手记 雪之下雪乃`.trim());
    }

    setLinkedToSignId(req.id);
    setLinkedToSignTitle(req.galleryTitle);
    setLinkedToSignDedication(req.dedicationText);
  };

  const handleSetCover = (imgUrl: string) => {
    setCoverImage((prev) => (prev === imgUrl ? '' : imgUrl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const finalLocation: DiaryLocation | undefined = isCustomLocMode && customLocName.trim()
      ? {
          name: customLocName.trim(),
          city: customLocCity.trim() || undefined,
          lat: parseFloat(customLocLat) || 35.6375,
          lng: parseFloat(customLocLng) || 140.0982,
          atmosphere: customLocAtmosphere.trim() || undefined
        }
      : selectedLocation || undefined;

    onAddDiary({
      title,
      content,
      coverImage: coverImage || undefined,
      date: new Date().toISOString().split('T')[0],
      weather,
      tags: tagInput.split(' ').filter(Boolean),
      isPublic,
      linkedToSignId: linkedToSignId || undefined,
      linkedToSignTitle: linkedToSignTitle || undefined,
      linkedToSignDedication: linkedToSignDedication || undefined,
      sentiment: liveSentiment,
      location: finalLocation
    });

    setTitle('');
    setContent('');
    setCoverImage('');
    setLinkedToSignId('');
    setLinkedToSignTitle('');
    setLinkedToSignDedication('');
    setSelectedLocation(null);
    setIsCustomLocMode(false);
    setCustomLocName('');
    setCustomLocAtmosphere('');
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
            PERSONAL CHRONICLES & REFLECTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho mt-1">
            雪野原 · 个人生活日记与手记
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            记录生活琐碎、代码灵感与《春物》重温随想。时间轴式安静阅读。
          </p>
        </div>

        <button
          onClick={() => setIsEditorOpen(true)}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>写一篇新日记</span>
        </button>
      </div>

      {/* 2. Mood Filter Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100/70 border border-slate-200/60 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedMood('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 select-none ${
              selectedMood === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>全部心境</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500">
              {moodCounts['all'] || 0}
            </span>
          </button>

          {EMOTION_CATEGORIES.map((cat) => {
            const isSelected = selectedMood === cat.mood;
            const count = moodCounts[cat.mood] || 0;
            return (
              <button
                key={cat.mood}
                onClick={() => setSelectedMood(cat.mood)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 select-none ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm font-semibold ring-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                style={{
                  borderColor: isSelected ? cat.color : 'transparent',
                  boxShadow: isSelected ? `0 2px 10px -2px ${cat.color}35` : undefined
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.moodLabel.split(' · ')[0]}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium"
                  style={{
                    backgroundColor: isSelected ? `${cat.color}18` : 'rgba(241,245,249,0.9)',
                    color: isSelected ? cat.color : '#64748b'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMood !== 'all' && (
          <button
            onClick={() => setSelectedMood('all')}
            className="text-[11px] text-sky-600 hover:text-sky-700 font-medium px-2 py-1 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>清除筛选</span>
          </button>
        )}
      </div>

      {/* 2.5. Mood Activity Dot Matrix (心境活动点阵图 · 颜色根据心情改变) */}
      <ActivityDotMatrix
        title="心境活动"
        subtitle="以时序点阵映射随想心流与心情韵律 · 颜色根据当日心境实时变换"
        items={diaryActivityItems}
        defaultMode="cumulative"
        showLegend={true}
        legendItems={moodLegendItems}
        summarySlot={
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>当前展示: <strong className="text-slate-800">{diaryActivityItems.length}</strong> 篇手记</span>
            <span>·</span>
            <span>当前筛选: <strong className="text-sky-600">{selectedMood === 'all' ? '全部心境' : EMOTION_CATEGORIES.find(c => c.mood === selectedMood)?.moodLabel}</strong></span>
          </div>
        }
      />

      {/* 3. Horizontal Chronological Time Scroller (基于时间的横向滚动轴) */}
      <div className="apple-glass-floating rounded-3xl p-5 border border-white/95 shadow-sm space-y-4 relative overflow-hidden">
        {/* Scroller Header & Direction Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 font-editorial-mincho">
                  漫步时光轴 · 历史动态横向滚动轴
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-sky-50 text-sky-700 border border-sky-200/50">
                  {filteredDiaries.length} 篇归档
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                时间刻度推移漫游 · 支持左右滑移或点击时间节点直达对应手记
              </p>
            </div>
          </div>

          {/* Left/Right Scroll Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScrollTimeline('left')}
              className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-sky-600 border border-slate-200/80 shadow-xs flex items-center justify-center active:scale-95 transition-all"
              title="向左滚动查看更早手记"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScrollTimeline('right')}
              className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-sky-600 border border-slate-200/80 shadow-xs flex items-center justify-center active:scale-95 transition-all"
              title="向右滚动查看近期手记"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative pt-4">
          {/* Background Gradient Axis Line */}
          <div className="absolute top-7 inset-x-3 h-0.5 bg-gradient-to-r from-sky-400/90 via-blue-400/50 to-slate-200/50" />

          {/* Horizontal Scroll Area */}
          <div
            ref={timelineScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 pt-2 px-2 no-scrollbar scroll-smooth relative z-10"
          >
            {filteredDiaries.map((diary) => {
              const sentiment = diary.sentiment || analyzeYukinoSentiment(diary.title, diary.content, diary.tags);
              return (
                <motion.div
                  key={diary.id}
                  onClick={() => setSelectedDiary(diary)}
                  whileHover={{ y: -6, scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="w-64 sm:w-72 shrink-0 rounded-2xl liquid-glass p-3.5 border border-white/95 hover:border-sky-300 hover:shadow-lg cursor-pointer space-y-2.5 transition-all group relative"
                >
                  {/* Pin on horizontal axis */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: sentiment.color }}
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {diary.date}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.2 rounded-full font-medium"
                      style={{ backgroundColor: `${sentiment.color}18`, color: sentiment.color }}
                    >
                      {sentiment.moodLabel.split(' · ')[0]} · {sentiment.score}分
                    </span>
                  </div>

                  {/* Location Pin Badge on Timeline if present */}
                  {diary.location && (
                    <div className="flex items-center gap-1 text-[10px] text-sky-700 bg-sky-50/80 border border-sky-200/50 px-2 py-0.5 rounded-lg truncate">
                      <MapPin className="w-2.5 h-2.5 text-sky-500 shrink-0" />
                      <span className="truncate">{diary.location.name}</span>
                    </div>
                  )}

                  {/* Mini Cover if present */}
                  {diary.coverImage && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-100 shadow-xs">
                      <img
                        src={diary.coverImage}
                        alt={diary.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}

                  <h4 className="text-xs font-bold text-slate-900 font-editorial-mincho group-hover:text-sky-600 transition-colors truncate">
                    {diary.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 font-light line-clamp-2 leading-relaxed font-sans">
                    {diary.content}
                  </p>

                  {/* Yukino brief reflection snippet */}
                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate max-w-[150px]">
                      {diary.weather}
                    </span>
                    <span className="text-sky-600 font-medium group-hover:translate-x-0.5 transition-transform">
                      展开阅读 →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Timeline Diary Stream */}
      {filteredDiaries.length === 0 ? (
        <div className="text-center py-12 rounded-3xl liquid-glass border border-slate-200/60 p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            暂无符合当前心境的日记手记
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            当前筛选的心境暂无匹配记录，你可以清除筛选查看全部，或以此心境为灵感写下新篇章。
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setSelectedMood('all')}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>显示全部心境</span>
            </button>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-sky-500" />
              <span>撰写新篇章</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-slate-200/60 pl-8 sm:pl-12 focus-dim-group">
          {filteredDiaries.map((diary, idx) => (
            <motion.article
              key={diary.id}
              onClick={() => setSelectedDiary(diary)}
              whileHover={{ 
                y: -8, 
                scale: 1.025, 
                rotateZ: idx % 2 === 0 ? [-0.3, 0.4, -0.2, 0] : [0.3, -0.4, 0.2, 0],
                transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 18 }
              }}
              whileTap={{ scale: 0.985, y: -2 }}
              className="focus-card-item relative rounded-3xl p-6 sm:p-7 liquid-glass border border-white/95 hover:border-sky-300 hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.28)] transition-all cursor-pointer group space-y-3 z-10"
            >
              {/* Timeline Marker Dot */}
              <div className="absolute -left-8 sm:-left-12 top-7 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-400 shadow-sm" />

              {/* Cover Image if attached */}
              {diary.coverImage && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-100 shadow-xs mb-1 group-hover:shadow-md transition-shadow">
                  <img
                    src={diary.coverImage}
                    alt={diary.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] text-white/90 font-mono flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <ImageIcon className="w-3 h-3 text-sky-300" />
                      To签专属影像
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{diary.date}</span>
                    <span>·</span>
                    <span>{diary.weather}</span>
                  </div>
                  {diary.location && (
                    <div className="flex items-center gap-1 text-[11px] text-sky-700 bg-sky-50/90 border border-sky-200/50 px-2 py-0.5 rounded-lg font-sans">
                      <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{diary.location.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Eye className="w-3 h-3" />
                    <span>{diary.views}</span>
                  </span>
                  {diary.isPublic ? (
                    <span title="公开日记"><Globe className="w-3.5 h-3.5 text-sky-500" /></span>
                  ) : (
                    <span title="私密日记"><Lock className="w-3.5 h-3.5 text-amber-500" /></span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho group-hover:text-sky-600 transition-colors">
                {diary.title}
              </h3>

              {/* Linked To-Sign Banner if present */}
              {diary.linkedToSignTitle && (
                <div className="rounded-xl bg-sky-50/80 border border-sky-200/60 p-2.5 flex items-start gap-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-medium text-sky-900">
                      <span>联动 To 签定制 ·</span>
                      <span className="truncate">《{diary.linkedToSignTitle}》</span>
                    </div>
                    {diary.linkedToSignDedication && (
                      <p className="text-[11px] text-sky-700/85 font-editorial-mincho italic mt-0.5 line-clamp-1">
                        “{diary.linkedToSignDedication}”
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3 whitespace-pre-line">
                {diary.content}
              </p>

              {/* Heart Location Mini-Map (心之所属地 · 小地图标记与场景测绘) */}
              {diary.location && (
                <div className="pt-1 pb-1">
                  <HeartLocationMap location={diary.location} variant="card" />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-2 text-slate-500 font-mono text-[11px]">
                  {diary.tags.map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>
                <span className="text-sky-600 text-xs font-medium">展开完整阅读 →</span>
              </div>

              {/* Yukino Sentiment Analysis & Advice Box */}
              {(() => {
                const sentiment = diary.sentiment || analyzeYukinoSentiment(diary.title, diary.content, diary.tags);
                return (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl bg-gradient-to-r from-slate-50/90 to-sky-50/40 p-3 border border-slate-200/60 shadow-xs">
                    <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0 w-8 h-8 rounded-full overflow-hidden border border-sky-300 shadow-xs mt-0.5 sm:mt-0">
                        <img
                          src="/src/assets/images/yukino_portrait_editorial_1790218150964.jpg"
                          alt="雪之下雪乃"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white"
                          style={{ backgroundColor: sentiment.color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-800 font-editorial-mincho">
                            雪乃的性格模型评析与建议
                          </span>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: `${sentiment.color}18`, color: sentiment.color }}
                          >
                            {sentiment.moodLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-editorial-mincho italic mt-0.5 line-clamp-2">
                          “{sentiment.advice}”
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-white/95 px-2.5 py-1 rounded-xl border border-slate-200/60 shadow-xs">
                      <span className="text-[10px] text-slate-400 font-mono">情绪指数</span>
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: sentiment.color }}
                      >
                        {sentiment.score}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/100</span>
                    </div>
                  </div>
                );
              })()}
            </motion.article>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[24px]"
            onClick={() => setIsEditorOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl apple-spring-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/95 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
                  </div>
                  <Feather className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    撰写新日记 · 随想手记
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* To-Sign Recommendation Card */}
                {currentRec && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-sky-200/90 bg-gradient-to-r from-sky-50/90 via-sky-50/50 to-blue-50/80 p-3.5 space-y-2.5 shadow-xs relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                        <span className="text-xs font-bold text-sky-900">
                          今日灵感联动 · 推荐你今日申请的 To 签
                        </span>
                      </div>
                      {recommendedToSigns.length > 1 && (
                        <div className="flex items-center gap-1">
                          {recommendedToSigns.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveRecIndex(i)}
                              className={`h-1.5 rounded-full transition-all ${
                                activeRecIndex === i ? 'bg-sky-600 w-4' : 'bg-sky-200 hover:bg-sky-300 w-2'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-sky-200/80 shadow-xs">
                        <img
                          src={currentRec.imageUrl}
                          alt={currentRec.galleryTitle}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-mono py-0.5 truncate">
                          TO {currentRec.requesterCN}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 truncate">
                            《{currentRec.galleryTitle}》
                          </span>
                          <span className="text-[10px] font-mono text-sky-600 shrink-0">
                            {currentRec.createdAt === todayStr ? '今日递交' : currentRec.createdAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-editorial-mincho line-clamp-2 leading-relaxed">
                          “{currentRec.dedicationText}”
                        </p>
                      </div>
                    </div>

                    {/* Fast Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-sky-200/50">
                      <button
                        type="button"
                        onClick={() => handleApplyToSignQuote(currentRec)}
                        className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-medium flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                      >
                        <Quote className="w-3 h-3" />
                        <span>一键引用至日记正文</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetCover(currentRec.imageUrl)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition-all active:scale-95 ${
                          coverImage === currentRec.imageUrl
                            ? 'bg-sky-100 border-sky-300 text-sky-800'
                            : 'bg-white/80 border-sky-200/80 text-sky-700 hover:bg-sky-50'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{coverImage === currentRec.imageUrl ? '已设为封面 ✓' : '设为日记封面'}</span>
                      </button>

                      {linkedToSignId === currentRec.id && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          已建立联动标记
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Cover Image Preview if attached */}
                {coverImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 flex items-center justify-between group">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-3 text-white">
                      <span className="text-xs font-mono flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-sky-300" />
                        已附加日记封面
                      </span>
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="px-2 py-1 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white text-[10px]"
                      >
                        移除封面
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="日记标题..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm font-bold font-editorial-mincho focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    placeholder="天气与温度"
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="标签 (空格分隔)"
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none"
                  />
                </div>

                <textarea
                  rows={7}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="静下心来，写下一段文字..."
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white/70 text-xs sm:text-sm font-light leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                  required
                />

                {/* Real-time Yukino Sentiment Engine Panel */}
                <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-sky-300 shrink-0">
                        <img
                          src="/src/assets/images/yukino_portrait_editorial_1790218150964.jpg"
                          alt="雪乃"
                          className="w-full h-full object-cover"
                        />
                        <span 
                          className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: liveSentiment.color }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                          雪之下雪乃 · 情绪性格分析模型
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full animate-ping bg-sky-500" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${liveSentiment.color}18`, color: liveSentiment.color }}
                      >
                        {liveSentiment.moodLabel}
                      </span>
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[11px] shadow-xs">
                        <span className="text-slate-400 text-[10px]">心境共鸣</span>
                        <span className="font-bold font-mono" style={{ color: liveSentiment.color }}>{liveSentiment.score}</span>
                        <span className="text-slate-400 text-[9px]">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Advice */}
                  <div className="bg-white/85 p-2.5 rounded-xl border border-sky-100 text-xs text-slate-700 font-editorial-mincho leading-relaxed">
                    <span className="font-sans text-[10px] font-bold text-sky-700 mr-1">【雪乃实时评析与建议】</span>
                    “{liveSentiment.advice}”
                  </div>
                </div>

                {/* Optional Geographical Coordinate & Heart Location Section (可选地理坐标标签与心之所属地) */}
                <div className="rounded-2xl border border-sky-100 bg-white/70 p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                        地理坐标标签 · 心之所属地 (可选)
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 border border-sky-200/50">
                        场景测绘
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomLocMode(prev => !prev);
                          if (!isCustomLocMode) {
                            setSelectedLocation(null);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border ${
                          isCustomLocMode
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isCustomLocMode ? '自定义坐标开启中' : '+ 自定义坐标'}
                      </button>

                      {(selectedLocation || (isCustomLocMode && customLocName.trim())) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocation(null);
                            setIsCustomLocMode(false);
                            setCustomLocName('');
                          }}
                          className="text-[10px] text-rose-500 hover:text-rose-600 px-1.5 py-0.5 font-medium"
                        >
                          清除坐标
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Preset Iconic Location Chips */}
                  {!isCustomLocMode && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-500">
                        点击快速绑定《春物》与千叶代表性场景坐标：
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {ICONIC_LOCATIONS.map((loc, idx) => {
                          const isSelected = selectedLocation?.name === loc.name;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedLocation(isSelected ? null : loc);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-sans transition-all flex items-center gap-1 active:scale-95 ${
                                isSelected
                                  ? 'bg-sky-600 text-white shadow-xs font-medium ring-2 ring-sky-300'
                                  : 'bg-white hover:bg-sky-50/70 text-slate-700 border border-slate-200/80 hover:border-sky-300'
                              }`}
                            >
                              <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-sky-500'}`} />
                              <span>{loc.name.split(' · ')[1] || loc.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Location Inputs */}
                  {isCustomLocMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2.5 pt-1 border-t border-slate-100"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={customLocName}
                          onChange={(e) => setCustomLocName(e.target.value)}
                          placeholder="地标名称 (如：千叶港防波堤)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                        <input
                          type="text"
                          value={customLocCity}
                          onChange={(e) => setCustomLocCity(e.target.value)}
                          placeholder="城市/地区 (如：千叶市美滨区)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="0.0001"
                          value={customLocLat}
                          onChange={(e) => setCustomLocLat(e.target.value)}
                          placeholder="纬度 Lat (如：35.6375)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                        <input
                          type="number"
                          step="0.0001"
                          value={customLocLng}
                          onChange={(e) => setCustomLocLng(e.target.value)}
                          placeholder="经度 Lng (如：140.0982)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                      </div>

                      <input
                        type="text"
                        value={customLocAtmosphere}
                        onChange={(e) => setCustomLocAtmosphere(e.target.value)}
                        placeholder="场景氛围感标签 (如：潮声回荡 · 冬阳微光)"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </motion.div>
                  )}

                  {/* Live Mini-Map Scene Preview in Editor */}
                  {(() => {
                    const activeLoc: DiaryLocation | null = isCustomLocMode && customLocName.trim()
                      ? {
                          name: customLocName.trim(),
                          city: customLocCity.trim() || undefined,
                          lat: parseFloat(customLocLat) || 35.6375,
                          lng: parseFloat(customLocLng) || 140.0982,
                          atmosphere: customLocAtmosphere.trim() || undefined
                        }
                      : selectedLocation;

                    if (!activeLoc) return null;

                    return (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono text-sky-600 flex items-center gap-1 font-bold">
                          <Radio className="w-3 h-3 text-sky-500 animate-pulse" />
                          <span>已就绪 · 日记场景心之所属地实时测绘：</span>
                        </div>
                        <HeartLocationMap location={activeLoc} variant="card" />
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded text-sky-500"
                    />
                    <span>公开分享至日记主页</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm"
                    >
                      发布日记
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Detail Modal */}
      <AnimatePresence>
        {selectedDiary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[24px]"
            onClick={() => setSelectedDiary(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl apple-spring-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/95 space-y-4 relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100/70">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1.5">
                    DIARY VIEWER
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDiary(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                <span>{selectedDiary.date}</span>
                <span>·</span>
                <span>{selectedDiary.weather}</span>
                {selectedDiary.location && (
                  <span className="flex items-center gap-1 text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 font-sans">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    <span>{selectedDiary.location.name}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-editorial-mincho">
                {selectedDiary.title}
              </h2>

              {/* Cover Image in Detail Modal */}
              {selectedDiary.coverImage && (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={selectedDiary.coverImage}
                    alt={selectedDiary.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs text-white/90 font-mono flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      <ImageIcon className="w-3.5 h-3.5 text-sky-300" />
                      To签影像专属封面
                    </span>
                  </div>
                </div>
              )}

              {/* Linked To-Sign banner in detail modal */}
              {selectedDiary.linkedToSignTitle && (
                <div className="rounded-2xl bg-sky-50/90 border border-sky-200/80 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-800 font-semibold text-xs">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span>联动定制 To 签 · 《{selectedDiary.linkedToSignTitle}》</span>
                  </div>
                  {selectedDiary.linkedToSignDedication && (
                    <blockquote className="text-xs text-sky-900 font-editorial-mincho pl-3 border-l-2 border-sky-400 italic leading-relaxed">
                      “{selectedDiary.linkedToSignDedication}”
                    </blockquote>
                  )}
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line py-3 border-y border-slate-100 font-sans">
                {selectedDiary.content}
              </div>

              {/* Heart Location Mini-Map in Detail Modal (心之所属地 · 小地图组件与场景测绘) */}
              {selectedDiary.location && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 font-editorial-mincho">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>当日场景 · 心之所属地测绘图</span>
                  </div>
                  <HeartLocationMap location={selectedDiary.location} variant="card" />
                </div>
              )}

              {/* Yukino Sentiment & Advice Detail Card */}
              {(() => {
                const sentiment = selectedDiary.sentiment || analyzeYukinoSentiment(selectedDiary.title, selectedDiary.content, selectedDiary.tags);
                return (
                  <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-50 via-sky-50/40 to-blue-50/60 border border-sky-200/70 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-sky-300 shadow-xs">
                          <img
                            src="/src/assets/images/yukino_portrait_editorial_1790218150964.jpg"
                            alt="雪乃"
                            className="w-full h-full object-cover"
                          />
                          <span
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white"
                            style={{ backgroundColor: sentiment.color }}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 font-editorial-mincho">
                            雪之下雪乃 · 情绪性格模型建议与评析
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            YUKINO SENTIMENT REFLECTION
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${sentiment.color}18`, color: sentiment.color }}
                        >
                          {sentiment.moodLabel}
                        </span>
                        <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-1 font-mono text-xs">
                          <span className="text-[10px] text-slate-400">心境共鸣</span>
                          <span className="font-bold font-mono" style={{ color: sentiment.color }}>{sentiment.score}</span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      </div>
                    </div>

                    <blockquote className="bg-white/80 p-3 rounded-xl border border-sky-100 text-xs sm:text-sm text-slate-700 font-editorial-mincho italic leading-relaxed pl-3.5 border-l-4 border-l-sky-500">
                      “{sentiment.advice}”
                    </blockquote>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex gap-2">
                  {selectedDiary.tags.map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onDeleteDiary(selectedDiary.id);
                    setSelectedDiary(null);
                  }}
                  className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除此篇</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
