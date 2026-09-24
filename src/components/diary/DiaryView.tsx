import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Feather, Plus, Trash2, Calendar, Lock, Globe, X, Eye } from 'lucide-react';
import { Diary, User } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface DiaryViewProps {
  diaries: Diary[];
  user: User;
  onAddDiary: (diary: Omit<Diary, 'id' | 'views'>) => void;
  onDeleteDiary: (id: string) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  diaries,
  user,
  onAddDiary,
  onDeleteDiary
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('晴朗 · 5°C');
  const [tagInput, setTagInput] = useState('千叶生活');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddDiary({
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      weather,
      tags: tagInput.split(' ').filter(Boolean),
      isPublic
    });

    setTitle('');
    setContent('');
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

      {/* 2. Timeline Diary Stream */}
      {diaries.length === 0 ? (
        <EmptyState
          type="diaries"
          actionText="写下第一篇日记"
          onAction={() => setIsEditorOpen(true)}
        />
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-slate-200/60 pl-8 sm:pl-12">
          {diaries.map((diary) => (
            <article
              key={diary.id}
              onClick={() => setSelectedDiary(diary)}
              className="relative rounded-3xl p-6 sm:p-7 liquid-glass border border-white/90 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              {/* Timeline Marker Dot */}
              <div className="absolute -left-8 sm:-left-12 top-7 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-400 shadow-sm" />

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{diary.date}</span>
                  <span>·</span>
                  <span>{diary.weather}</span>
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

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3 whitespace-pre-line">
                {diary.content}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-2 text-slate-500 font-mono text-[11px]">
                  {diary.tags.map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>
                <span className="text-sky-600 text-xs font-medium">展开完整阅读 →</span>
              </div>
            </article>
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
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="静下心来，写下一段文字..."
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white/70 text-xs sm:text-sm font-light leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                  required
                />

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

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>{selectedDiary.date}</span>
                <span>·</span>
                <span>{selectedDiary.weather}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-editorial-mincho">
                {selectedDiary.title}
              </h2>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line py-3 border-y border-slate-100 font-sans">
                {selectedDiary.content}
              </div>

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
