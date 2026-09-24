import React from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Compass, Image, MessageSquare, Feather, User } from 'lucide-react';

interface FloatingTabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'yukino', label: '雪乃', icon: BookOpen },
    { id: 'oregairu', label: '春物', icon: Compass },
    { id: 'gallery', label: '图库', icon: Image },
    { id: 'feed', label: '动态', icon: MessageSquare },
    { id: 'diary', label: '日记', icon: Feather },
    { id: 'profile', label: '我的', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto pointer-events-auto apple-glass-floating border border-white/95 rounded-2xl shadow-[0_12px_36px_rgba(3,105,161,0.14)] p-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive ? 'text-sky-600 font-medium' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="absolute inset-0 bg-sky-50/90 rounded-xl border border-sky-100/90 -z-10 shadow-sm"
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
