import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, Shirt, Quote as QuoteIcon, Image as ImageIcon, Feather } from 'lucide-react';
import { api } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const results = query.trim() ? api.searchAll(query) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/65 backdrop-blur-[24px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl apple-glass-floating rounded-3xl p-5 shadow-2xl border border-white/95 overflow-hidden"
          >
            {/* Apple Window Header with Traffic Lights */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100/70">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1.5">
                  SPOTLIGHT SEARCH
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                ESC / / 快速键
              </span>
            </div>

            {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-sky-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="全站索引：人物、校服、台词、真物、集数、日记..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none font-light"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto mt-3 space-y-4 pr-1">
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-slate-400 font-light">
              输入关键字（如：“雪乃”、“真物”、“浴衣”、“红茶”）开启即时检索
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Quotes */}
              {results.quotes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    经典台词 ({results.quotes.length})
                  </div>
                  {results.quotes.map(q => (
                    <div
                      key={q.id}
                      onClick={() => {
                        onNavigate('yukino');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/80 cursor-pointer border border-transparent hover:border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-editorial-mincho font-medium text-slate-800 truncate pr-2">
                        「{q.chinese}」
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {q.episodeTitle}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Outfits */}
              {results.outfits.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    服饰档案 ({results.outfits.length})
                  </div>
                  {results.outfits.map(o => (
                    <div
                      key={o.id}
                      onClick={() => {
                        onNavigate('yukino');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/80 cursor-pointer border border-transparent hover:border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-editorial-mincho font-medium text-slate-800">
                        {o.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {o.firstAppearance}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Characters */}
              {results.characters.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    春物角色 ({results.characters.length})
                  </div>
                  {results.characters.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigate('oregairu');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/80 cursor-pointer border border-transparent hover:border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-editorial-mincho font-medium text-slate-800">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        CV {c.cv}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {results.gallery.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    图库作品 ({results.gallery.length})
                  </div>
                  {results.gallery.map(g => (
                    <div
                      key={g.id}
                      onClick={() => {
                        onNavigate('gallery');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/80 cursor-pointer border border-transparent hover:border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-editorial-mincho font-medium text-slate-800 truncate">
                        {g.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {g.author}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Diaries */}
              {results.diaries.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                    生活日记 ({results.diaries.length})
                  </div>
                  {results.diaries.map(d => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onNavigate('diary');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/80 cursor-pointer border border-transparent hover:border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-editorial-mincho font-medium text-slate-800 truncate">
                        {d.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
