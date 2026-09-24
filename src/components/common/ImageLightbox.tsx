import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Share2, PenTool, Download } from 'lucide-react';
import { GalleryItem } from '../../types';

interface ImageLightboxProps {
  isOpen: boolean;
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onLike: (id: string) => void;
  onRequestToSign: (item: GalleryItem) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  item,
  items,
  onClose,
  onNext,
  onPrev,
  onLike,
  onRequestToSign
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-[24px]"
          onClick={onClose}
        >
          {/* Top Control Bar */}
          <div 
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/80 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-sky-300/80 font-mono">
                {item.category}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md">
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {item.isCoserWork && (
                <button
                  onClick={() => onRequestToSign(item)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/80 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 shadow-sm"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>定制 To 签</span>
                </button>
              )}

              <button
                onClick={() => onLike(item.id)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-sky-400 text-sky-400" />
                <span>{item.likes}</span>
              </button>

              <button
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center gap-1 text-xs"
                aria-label="Close lightbox (Esc)"
                title="关闭 (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline-block px-1 py-0.2 rounded text-[10px] font-mono bg-white/15 text-white/70">
                  Esc
                </span>
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="group absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-90 backdrop-blur-md z-20 flex items-center gap-1.5"
            aria-label="Previous image (Left Arrow)"
            title="上一张 (←)"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/15 text-white/70 group-hover:text-white">
              ←
            </span>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="group absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-90 backdrop-blur-md z-20 flex items-center gap-1.5"
            aria-label="Next image (Right Arrow)"
            title="下一张 (→)"
          >
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/15 text-white/70 group-hover:text-white">
              →
            </span>
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Central Displayed Image with Jelly Spring entrance */}
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative max-w-5xl max-h-[82vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
            />

            {/* Bottom subtle attribution overlay */}
            <div className="absolute bottom-3 left-4 right-4 px-4 py-2.5 rounded-xl bg-black/50 backdrop-blur-lg border border-white/10 text-white/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{item.author}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/60">{item.source}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-sky-300/90 font-mono text-[11px]">#{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
