import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User as UserIcon, Sparkles, Volume2, Shield, Compass, Lightbulb, Code2 } from 'lucide-react';
import { User } from '../../types';

interface LiquidNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  isPlayingAudio: boolean;
  onToggleAudioWidget: () => void;
  onOpenDesignPhilosophy?: () => void;
  onOpenDevDocs?: () => void;
}

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenSearch,
  isPlayingAudio,
  onToggleAudioWidget,
  onOpenDesignPhilosophy,
  onOpenDevDocs
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navLinks = [
    { id: 'home', label: '首页' },
    { id: 'yukino', label: '雪乃档案馆' },
    { id: 'oregairu', label: '春物世界' },
    { id: 'gallery', label: '图库' },
    { id: 'feed', label: '社区动态' },
    { id: 'diary', label: '日记' },
    { id: 'chat', label: '侍奉部聊天' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-3 sm:px-5 rounded-2xl liquid-navbar-glass gap-2">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onSelectTab('home')}
          className="cursor-pointer flex items-center gap-1.5 sm:gap-2 select-none group shrink min-w-0"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 group-hover:scale-125 transition-transform shrink-0" />
          <span className="font-semibold tracking-tight text-slate-800 text-xs sm:text-base font-editorial-mincho whitespace-nowrap overflow-hidden text-ellipsis">
            雪之下雪乃 · 档案馆
          </span>
          <span className="text-[10px] sm:text-[11px] font-sans text-sky-500/80 font-medium tracking-wider hidden lg:inline whitespace-nowrap shrink-0">
            ARCHIVE
          </span>
        </div>

        {/* Zone 2: 4-7 clean single-line nav links with shared sliding liquid indicator */}
        <nav className="hidden md:flex items-center gap-1 relative p-1 rounded-xl bg-slate-100/50 border border-slate-200/40">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <motion.button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                onMouseEnter={() => setHoveredTab(link.id)}
                onMouseLeave={() => setHoveredTab(null)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94, y: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 z-10 whitespace-nowrap select-none ${
                  isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {/* Active Liquid Capsule */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavCapsule"
                    transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.8 }}
                    className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_12px_rgba(3,105,161,0.12)] border border-sky-100 -z-10"
                  />
                )}
                {/* Hover subtle glow */}
                {!isActive && hoveredTab === link.id && (
                  <motion.div
                    layoutId="hoverNavCapsule"
                    transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                    className="absolute inset-0 rounded-lg bg-white/70 -z-10"
                  />
                )}
                {link.label}
              </motion.button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Design Philosophy & Breakdown Trigger */}
          {onOpenDesignPhilosophy && (
            <button
              onClick={onOpenDesignPhilosophy}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              title="UI / 产品深度解构与重构说明"
              aria-label="Design Philosophy"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-medium text-slate-700 hidden xl:inline">
                设计重构论
              </span>
            </button>
          )}

          {/* Development & Deployment Docs Trigger */}
          {onOpenDevDocs && (
            <button
              onClick={onOpenDevDocs}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50/80 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
              title="全栈工程开发文档与商业生产部署规范"
              aria-label="Developer Docs"
            >
              <Code2 className="w-4 h-4 text-sky-500" />
              <span className="text-[11px] font-medium text-slate-700 hidden lg:inline">
                开发文档
              </span>
            </button>
          )}

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all active:scale-95"
            title="全局搜索 (快捷键 /)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Audio Floating trigger */}
          <button
            onClick={onToggleAudioWidget}
            className={`p-2 rounded-xl transition-all active:scale-95 relative ${
              isPlayingAudio ? 'text-sky-600 bg-sky-50 border border-sky-200/60' : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
            }`}
            title="早见沙织 · 台词声音展台"
            aria-label="Audio player"
          >
            <Volume2 className="w-4 h-4" />
            {isPlayingAudio && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            )}
          </button>

          {/* Admin shortcut if role is admin */}
          {user.role === 'ROLE_ADMIN' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1 font-medium ${
                currentTab === 'admin' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="后台管理"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">管理台</span>
            </button>
          )}

          {/* User profile / Auth trigger */}
          <button
            onClick={() => {
              if (user.id) {
                onSelectTab('profile');
              } else {
                onOpenAuth();
              }
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/80 border border-transparent hover:border-slate-200/60 transition-all active:scale-95 group"
          >
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-6 h-6 rounded-full object-cover border border-sky-200/60"
            />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 hidden sm:inline max-w-[80px] truncate">
              {user.nickname}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
