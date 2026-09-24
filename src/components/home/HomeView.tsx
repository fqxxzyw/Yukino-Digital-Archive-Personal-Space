import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Sparkles, Feather, Compass, Heart, MessageSquare, Play, Volume2, Cpu, Eye, Layers, ShieldCheck } from 'lucide-react';
import { Character, Diary, Post, User } from '../../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  yukino: Character;
  characters: Character[];
  recentDiaries: Diary[];
  recentPosts: Post[];
  user: User;
  onOpenVoicePlayer: () => void;
  onOpenDesignPhilosophy?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  yukino,
  characters,
  recentDiaries,
  recentPosts,
  user,
  onOpenVoicePlayer,
  onOpenDesignPhilosophy
}) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section: Spatial Minimalist Editorial */}
      <section className="relative pt-6 sm:pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden liquid-glass border border-white/80 shadow-[0_20px_60px_-15px_rgba(2,132,199,0.12)]">
            
            {/* Ambient Background Banner */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src="/src/assets/images/yukino_hero_snow_1790218140649.jpg"
                alt="Winter Snow Landscape"
                className="w-full h-full object-cover object-center filter saturate-75 opacity-85 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Hero Content Grid */}
            <div className="relative z-10 px-6 sm:px-12 py-16 sm:py-24 max-w-3xl text-white">
              
              {/* Quiet Title Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sky-200/90 mb-4">
                <span>Personal Space</span>
                <span aria-hidden="true">·</span>
                <span>Yukino Character Archive</span>
                <span aria-hidden="true">·</span>
                <span>Oregairu Archive</span>
              </div>

              {/* Poetic Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] font-editorial-mincho mb-6 text-wrap-balance">
                愿所有伪物，<br />
                终将抵达不可替代的真物。
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 max-w-xl font-light leading-relaxed mb-8">
                这里是「雪野原」的私人精神花园，也是致力于收录雪之下雪乃服饰、台词、经历与春物世界观的数字档案馆。安静、清冷，却在微光与文字深处保留体温。
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  onClick={() => onNavigate('yukino')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="relative px-6 py-3 rounded-2xl bg-white text-slate-950 text-xs sm:text-sm font-semibold shadow-[0_10px_25px_-5px_rgba(255,255,255,0.4),0_8px_16px_-4px_rgba(2,132,199,0.3)] hover:shadow-[0_16px_32px_-6px_rgba(56,189,248,0.45),0_0_20px_2px_rgba(255,255,255,0.8)] border border-white/90 flex items-center gap-2 group overflow-hidden"
                >
                  <span className="relative z-10">进入雪乃档案馆</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                  <span className="absolute inset-0 bg-gradient-to-r from-sky-100/0 via-sky-100/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </motion.button>

                <motion.button
                  onClick={onOpenVoicePlayer}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/30 hover:border-white/60 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(56,189,248,0.3)] transition-all flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-sky-300 animate-pulse" />
                  <span>聆听早见沙织独白</span>
                </motion.button>

                {onOpenDesignPhilosophy && (
                  <motion.button
                    onClick={onOpenDesignPhilosophy}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                    className="px-4 py-3 rounded-2xl bg-sky-500/30 hover:bg-sky-500/50 text-sky-100 text-xs sm:text-sm font-medium backdrop-blur-md border border-sky-300/50 hover:border-sky-200 shadow-sm transition-all flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4 text-sky-300" />
                    <span>设计解构与重构论</span>
                  </motion.button>
                )}
              </div>

              {/* Bottom Metadata */}
              <div className="mt-12 pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-slate-300/80 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">RECORD DATE</span>
                  <span>2026. WINTER</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT MOOD</span>
                  <span>初雪 · 清寒无尘</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid: About Me & Yukino Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 focus-dim-group">
          
          {/* Bento Cell 1: Yukino Spotlight (7 cols) */}
          <motion.div 
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              rotateZ: [-0.3, 0.4, -0.2, 0],
              transition: {
                rotateZ: { duration: 0.6, ease: "easeInOut" },
                type: 'spring', 
                stiffness: 320, 
                damping: 18 
              }
            }}
            whileTap={{ scale: 0.98, y: -2 }}
            className="focus-card-item lg:col-span-7 rounded-3xl p-6 sm:p-8 liquid-glass border border-white/95 shadow-[0_16px_40px_-12px_rgba(2,132,199,0.12)] hover:shadow-[0_28px_60px_-15px_rgba(2,132,199,0.28)] hover:border-sky-300/80 transition-all flex flex-col justify-between group cursor-pointer relative z-10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-mono text-sky-600 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                  <span>01. CHARACTER ARCHIVE</span>
                </div>
                <span className="text-xs text-slate-400">总武高侍奉部部长</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-2 border-white/90">
                  <img
                    src={yukino.avatar}
                    alt={yukino.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-editorial-mincho group-hover:text-sky-700 transition-colors">
                    {yukino.name}
                    <span className="text-xs font-normal text-slate-500 ml-2 font-sans">
                      {yukino.romaji}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {yukino.description}
                  </p>
                  
                  {/* Clean unboxed metadata */}
                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <div>声优：<span className="text-slate-800 font-medium">{yukino.cv}</span></div>
                    <div>生日：<span className="text-slate-800 font-medium">{yukino.birthday}</span></div>
                    <div>班级：<span className="text-slate-800 font-medium">总武高中 2年J班</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                已收录 4套服饰 · 4部原声 · 5幕经典集数
              </span>
              <button
                onClick={() => onNavigate('yukino')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform"
              >
                <span>浏览完整角色档案</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Bento Cell 2: About Me (5 cols) */}
          <motion.div 
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              rotateZ: [0.3, -0.4, 0.2, 0],
              transition: {
                rotateZ: { duration: 0.6, ease: "easeInOut" },
                type: 'spring', 
                stiffness: 320, 
                damping: 18 
              }
            }}
            whileTap={{ scale: 0.98, y: -2 }}
            className="focus-card-item lg:col-span-5 rounded-3xl p-6 sm:p-8 liquid-glass border border-white/95 shadow-[0_16px_40px_-12px_rgba(2,132,199,0.12)] hover:shadow-[0_28px_60px_-15px_rgba(2,132,199,0.28)] hover:border-sky-300/80 transition-all flex flex-col justify-between cursor-pointer relative z-10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-mono text-sky-600 font-medium">02. MASTER PROFILE</div>
                <span className="text-xs text-slate-400">关于站长</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="w-14 h-14 rounded-2xl object-cover border border-sky-100 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{user.nickname}</h4>
                  <p className="text-xs text-slate-500 font-light mt-0.5">
                    {user.bio}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 mt-4">
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">FAVORITE ANIME</span>
                  <span className="font-medium text-slate-800">《我的青春恋爱物语果然有问题。》</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">PASSION & CRAFT</span>
                  <span className="font-medium text-slate-800">全栈开发 · Apple 设计美学 · 角色档案梳理</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('diary')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>阅读生活日记</span>
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>在侍奉部留言</span>
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.5. Design Deconstruction & Dynamic Frontend Showcase (解构 - 提炼 - 重构) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-8 liquid-glass border border-white/95 shadow-[0_10px_35px_-10px_rgba(2,132,199,0.12)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-sky-600 font-semibold uppercase tracking-wider mb-1">
                <span>UI & PRODUCT METHODOLOGY</span>
                <span>·</span>
                <span className="text-slate-400">解构 - 提炼 - 重构</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-editorial-mincho">
                借鉴顶级设计与动态前端落地工程实践
              </h3>
            </div>
            {onOpenDesignPhilosophy && (
              <button
                onClick={onOpenDesignPhilosophy}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 self-start md:self-auto shrink-0"
              >
                <Cpu className="w-4 h-4" />
                <span>查看完整方法论拆解</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 focus-dim-group">
            <motion.div 
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                rotateZ: [-0.4, 0.4, -0.2, 0],
                transition: { rotateZ: { duration: 0.5 }, type: 'spring', stiffness: 380, damping: 18 }
              }}
              whileTap={{ scale: 0.97 }}
              className="focus-card-item p-4 rounded-2xl bg-white/75 border border-slate-100/90 shadow-sm hover:shadow-md hover:border-sky-200/80 space-y-2 cursor-pointer relative z-10"
            >
              <div className="flex items-center justify-between text-xs text-sky-600 font-mono font-semibold">
                <span>01. 定向灵感</span>
                <Eye className="w-4 h-4 text-sky-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs font-editorial-mincho">Awwwards 动效 & Apple 极简</h4>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                汲取 Apple 冰蓝液态玻璃质感与 Awwwards 微粒子物理，拒绝大红大紫的刻板印象，以清冷克制凸显人物内心。
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                rotateZ: [0.4, -0.4, 0.2, 0],
                transition: { rotateZ: { duration: 0.5 }, type: 'spring', stiffness: 380, damping: 18 }
              }}
              whileTap={{ scale: 0.97 }}
              className="focus-card-item p-4 rounded-2xl bg-white/75 border border-slate-100/90 shadow-sm hover:shadow-md hover:border-indigo-200/80 space-y-2 cursor-pointer relative z-10"
            >
              <div className="flex items-center justify-between text-xs text-indigo-600 font-mono font-semibold">
                <span>02. 深度解构</span>
                <Layers className="w-4 h-4 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs font-editorial-mincho">网格、微交互与空态引导</h4>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                拆解 8px 律动网格、250ms 弹簧过渡曲线（Spring），全站空态注入文学诗意，扫除冷冰冰的“暂无数据”。
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                rotateZ: [-0.4, 0.4, -0.2, 0],
                transition: { rotateZ: { duration: 0.5 }, type: 'spring', stiffness: 380, damping: 18 }
              }}
              whileTap={{ scale: 0.97 }}
              className="focus-card-item p-4 rounded-2xl bg-white/75 border border-slate-100/90 shadow-sm hover:shadow-md hover:border-emerald-200/80 space-y-2 cursor-pointer relative z-10"
            >
              <div className="flex items-center justify-between text-xs text-emerald-600 font-mono font-semibold">
                <span>03. 场景创新</span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs font-editorial-mincho">5 步 To 签工坊 & 音画协同</h4>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                不照搬代码，将灵感赋能于二次元现实痛点：手写定制 To 签流转体系与 Web Audio 台词波形跳动，沉浸感倍增。
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                rotateZ: [0.4, -0.4, 0.2, 0],
                transition: { rotateZ: { duration: 0.5 }, type: 'spring', stiffness: 380, damping: 18 }
              }}
              whileTap={{ scale: 0.97 }}
              className="focus-card-item p-4 rounded-2xl bg-white/75 border border-slate-100/90 shadow-sm hover:shadow-md hover:border-amber-200/80 space-y-2 cursor-pointer relative z-10"
            >
              <div className="flex items-center justify-between text-xs text-amber-600 font-mono font-semibold">
                <span>04. 原创壁垒</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs font-editorial-mincho">Coser 审核闭环 & 动效克制</h4>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                严格恪守“动效不为炫技而生”铁律，打通 Coser 认证与管理审批闭环，建立具有真实业务价值的产品壁垒。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Recent Diary: Editorial Timeline Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-sky-600 font-medium mb-1">03. RECENT DIARIES</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho">
              雪日手记与生活随笔
            </h2>
          </div>
          <button
            onClick={() => onNavigate('diary')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>全部日记</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 focus-dim-group">
          {recentDiaries.slice(0, 2).map((diary, idx) => (
            <motion.article
              key={diary.id}
              onClick={() => onNavigate('diary')}
              whileHover={{ 
                y: -8, 
                scale: 1.025, 
                rotateZ: idx === 0 ? [-0.3, 0.4, -0.2, 0] : [0.3, -0.4, 0.2, 0],
                transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 18 }
              }}
              whileTap={{ scale: 0.985, y: -2 }}
              className={`focus-card-item rounded-3xl p-6 sm:p-7 liquid-glass border border-white/95 shadow-sm hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.3)] hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between relative z-10 ${
                idx === 0 ? 'rim-light-card ring-1 ring-sky-200/40 hover:ring-sky-400/60' : ''
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
                  <span>{diary.date}</span>
                  <span>·</span>
                  <span>{diary.weather}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 font-editorial-mincho group-hover:text-sky-600 transition-colors mb-3">
                  {diary.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">
                  {diary.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 relative z-10">
                <div className="flex items-center gap-2">
                  {diary.tags.map((t, index) => (
                    <span key={index} className="text-slate-500">#{t}</span>
                  ))}
                </div>
                <span className="font-mono">{diary.views} 阅读</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. Oregairu World Characters Quick Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-sky-600 font-medium mb-1">04. OREGAIRU ARCHIVE</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho">
              春物世界与登场人物
            </h2>
          </div>
          <button
            onClick={() => onNavigate('oregairu')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>进入春物世界观</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 focus-dim-group">
          {characters.map((char, cIdx) => (
            <motion.div
              key={char.id}
              onClick={() => onNavigate('oregairu')}
              whileHover={{ 
                y: -8, 
                scale: 1.05, 
                rotateZ: cIdx % 2 === 0 ? [-0.5, 0.5, -0.3, 0] : [0.5, -0.5, 0.3, 0],
                transition: { rotateZ: { duration: 0.5 }, type: 'spring', stiffness: 420, damping: 18 }
              }}
              whileTap={{ scale: 0.95 }}
              className="focus-card-item p-4 rounded-2xl liquid-glass border border-white/85 hover:border-sky-300 hover:shadow-[0_16px_32px_-8px_rgba(2,132,199,0.2)] transition-all cursor-pointer group text-center select-none relative z-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm">
                <img
                  src={char.avatar}
                  alt={char.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs font-semibold text-slate-800 font-editorial-mincho truncate group-hover:text-sky-700">
                {char.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                CV {char.cv}
              </p>
              <p className="text-[10px] text-sky-600 font-light mt-1 truncate">
                {char.club}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Community Feed Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-sky-600 font-medium mb-1">05. COMMUNITY PULSE</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho">
              同好社区与 Coser 动态
            </h2>
          </div>
          <button
            onClick={() => onNavigate('feed')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>前往社区动态</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 focus-dim-group">
          {recentPosts.slice(0, 2).map((post, idx) => (
            <motion.div
              key={post.id}
              onClick={() => onNavigate('feed')}
              whileHover={{ 
                y: -8, 
                scale: 1.025, 
                rotateZ: idx === 0 ? [-0.3, 0.4, -0.2, 0] : [0.3, -0.4, 0.2, 0],
                transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 18 }
              }}
              whileTap={{ scale: 0.985, y: -2 }}
              className={`focus-card-item rounded-3xl p-6 liquid-glass border border-white/95 shadow-sm hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.3)] hover:border-sky-300 transition-all cursor-pointer group relative z-10 ${
                idx === 0 ? 'rim-light-card ring-1 ring-sky-200/40 hover:ring-sky-400/60' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-10 h-10 rounded-full object-cover border border-sky-100 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{post.userName}</span>
                    {post.isCoser && (
                      <span className="text-[10px] text-sky-600 font-medium font-mono">
                        [认证 COSER]
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{post.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-light mb-4 line-clamp-3 relative z-10">
                {post.content}
              </p>

              {post.images.length > 0 && (
                <div className="rounded-xl overflow-hidden aspect-[16/9] mb-4 relative z-10 border border-white/80 shadow-sm">
                  <img
                    src={post.images[0]}
                    alt="post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount}</span>
                  </span>
                </div>
                <span className="text-sky-600 font-medium text-[11px] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  查看详情 →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
