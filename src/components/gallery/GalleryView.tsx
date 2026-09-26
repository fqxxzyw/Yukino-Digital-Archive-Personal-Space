import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark, PenTool, Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryViewProps {
  items: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
  onLikeItem: (id: string) => void;
  onRequestToSign: (item: GalleryItem) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  onOpenLightbox,
  onLikeItem,
  onRequestToSign
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '全部作品' },
    { id: 'official', label: '官方插画' },
    { id: 'wallpaper', label: '意境壁纸' },
    { id: 'novel', label: '原作插图' },
    { id: 'coser', label: 'Coser 专区' },
    { id: 'screenshot', label: '动画截帧' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
            VISUAL ARCHIVE & COSER SHOWCASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho mt-1">
            雪之下雪乃 · 视觉图库与二创典藏
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            收录高分辨率动画原画、文库插图、壁纸及认证 Coser 正片。点击卡片进入沉浸式画廊。
          </p>
        </div>

        {/* Filter Pills with shared container */}
        <div className="p-1 rounded-2xl liquid-glass border border-white/90 flex flex-wrap gap-1 shadow-sm self-start sm:self-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry-Style Natural Image Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 focus-dim-group">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            onClick={() => onOpenLightbox(item)}
            whileHover={{ 
              y: -8, 
              scale: 1.025, 
              rotateZ: idx % 2 === 0 ? [-0.35, 0.4, -0.2, 0] : [0.35, -0.4, 0.2, 0],
              transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 18 }
            }}
            whileTap={{ scale: 0.98, y: -2 }}
            className="focus-card-item break-inside-avoid rounded-3xl overflow-hidden liquid-glass border border-white/95 hover:border-sky-300 hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.3)] transition-all cursor-pointer group relative z-10"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white" />

              {/* Hover Actions Bar */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md text-white/90 border border-white/20">
                    {item.category}
                  </span>

                  {item.isCoserWork && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestToSign(item);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-medium flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>申请 To 签</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white font-editorial-mincho truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-white/80">
                    <span>{item.author}</span>
                    <div className="flex items-center gap-3">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeItem(item.id);
                        }}
                        className="flex items-center gap-1 hover:text-rose-300 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{item.likes}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiet Bottom Footprint (Visible on static load) */}
            <div className="p-3.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span className="font-medium text-slate-700 truncate">{item.title}</span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                {item.source}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
