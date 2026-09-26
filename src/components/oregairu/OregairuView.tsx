import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Users, GitFork, BookOpen, ArrowRight, Heart, X } from 'lucide-react';
import { Character, Season, Episode, CharacterRelation } from '../../types';
import { characterRelations } from '../../services/mockData';

interface OregairuViewProps {
  characters: Character[];
  seasons: Season[];
  episodes: Episode[];
  onSelectCharacter?: (char: Character) => void;
}

export const OregairuView: React.FC<OregairuViewProps> = ({
  characters,
  seasons,
  episodes
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'relations' | 'seasons'>('characters');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden liquid-glass border border-white/80 p-8 sm:p-10 shadow-sm text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-sky-600 uppercase font-semibold mb-2">
          <span>MY YOUTH ROMANTIC COMEDY IS WRONG AS I EXPECTED</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 font-editorial-mincho mb-3">
          春物世界观 · 人物与故事纪要
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
          收录总武高中的青春群像。从彼此防备的孤独灵魂，到探寻毫无虚伪的真物羁绊，在此一览所有角色的档案与命运轨迹。
        </p>

        {/* Tab switch */}
        <div className="flex justify-center mt-6">
          <div className="p-1 rounded-2xl bg-slate-100/70 border border-slate-200/60 flex gap-1">
            {[
              { id: 'characters', label: '登场人物', icon: Users },
              { id: 'relations', label: '人物关系图谱', icon: GitFork },
              { id: 'seasons', label: '动画全三季', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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

      {/* 2. Main Content */}
      <AnimatePresence mode="wait">
        
        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <motion.div
            key="characters"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 focus-dim-group"
          >
            {characters.map((char, idx) => (
              <motion.div
                key={char.id}
                onClick={() => setSelectedChar(char)}
                whileHover={{ 
                  y: -8, 
                  scale: 1.025, 
                  rotateZ: idx % 2 === 0 ? [-0.35, 0.4, -0.2, 0] : [0.35, -0.4, 0.2, 0],
                  transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 18 }
                }}
                whileTap={{ scale: 0.98, y: -2 }}
                className="focus-card-item rounded-3xl p-6 liquid-glass border border-white/95 hover:border-sky-300 hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.28)] transition-all cursor-pointer group flex flex-col justify-between relative z-10"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-108 transition-transform duration-500 ease-out"
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
                    <div>与雪乃：<span className="text-slate-800 font-light">{char.relationWithYukino}</span></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-sky-600 font-medium">
                  <span>查看角色档案</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Relations Network Graph Tab */}
        {activeTab === 'relations' && (
          <motion.div
            key="relations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Visual Node Network Representation */}
            <div className="rounded-3xl p-8 liquid-glass border border-white/90 shadow-sm relative overflow-hidden">
              <div className="text-center mb-8">
                <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
                  INTERACTIVE RELATIONSHIP GRAPH
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho mt-1">
                  雪之下雪乃 核心人物交互网络
                </h3>
              </div>

              {/* Network Diagram Nodes */}
              <div className="max-w-2xl mx-auto space-y-6">
                {characterRelations.map((rel) => {
                  const target = characters.find(c => c.id === rel.targetId);
                  return (
                    <div
                      key={rel.id}
                      className="p-5 rounded-2xl bg-white/70 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-slate-900 font-editorial-mincho">
                          雪之下雪乃
                        </span>
                        <div className="flex items-center px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-medium border border-sky-100">
                          ↔ {rel.relationType} ↔
                        </div>
                        <span className="font-bold text-sm text-slate-900 font-editorial-mincho">
                          {target?.name}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-light max-w-sm sm:text-right">
                        {rel.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Seasons Tab */}
        {activeTab === 'seasons' && (
          <motion.div
            key="seasons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 focus-dim-group"
          >
            {seasons.map((season, sIdx) => (
              <motion.div
                key={season.id}
                whileHover={{ 
                  y: -6, 
                  scale: 1.015, 
                  rotateZ: sIdx % 2 === 0 ? [-0.2, 0.3, -0.15, 0] : [0.2, -0.3, 0.15, 0],
                  transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 20 }
                }}
                className="focus-card-item p-8 rounded-3xl liquid-glass border border-white/95 shadow-sm hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.25)] hover:border-sky-300 transition-all space-y-4 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-600 font-semibold uppercase">
                    TV ANIMATION · {season.year}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    全 {season.episodeCount} 话
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-editorial-mincho">
                  {season.title}
                </h3>
                <p className="text-xs text-slate-400 font-editorial-mincho">
                  {season.japaneseTitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {season.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Character Profile Modal */}
      <AnimatePresence>
        {selectedChar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 space-y-4 relative"
            >
              <button
                onClick={() => setSelectedChar(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedChar.avatar}
                  alt={selectedChar.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho">
                    {selectedChar.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {selectedChar.japaneseName} · CV {selectedChar.cv}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {selectedChar.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
                <div>生日：<span className="font-medium text-slate-800">{selectedChar.birthday}</span></div>
                <div>班级/社团：<span className="font-medium text-slate-800">{selectedChar.grade} / {selectedChar.club}</span></div>
                <div>与雪乃关系：<span className="font-medium text-slate-800">{selectedChar.relationWithYukino}</span></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
