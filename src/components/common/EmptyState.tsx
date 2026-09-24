import React from 'react';
import { Snowflake, BookOpen, Feather } from 'lucide-react';

interface EmptyStateProps {
  type?: 'favorites' | 'posts' | 'diaries' | 'search' | 'general';
  customTitle?: string;
  customSubtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  customTitle,
  customSubtitle,
  actionText,
  onAction
}) => {
  const contentMap = {
    favorites: {
      icon: Snowflake,
      title: '这里还没有留下喜欢的瞬间',
      subtitle: '遇见过的心动微光，都可以点亮星标悄悄珍藏。'
    },
    posts: {
      icon: Feather,
      title: '这里暂时很安静',
      subtitle: '千叶的风吹过空无一人的天台，期待你写下第一个字句。'
    },
    diaries: {
      icon: BookOpen,
      title: '今天的雪似乎格外安静',
      subtitle: '白纸尚温，等待一段未曾被修饰的心迹。'
    },
    search: {
      icon: Snowflake,
      title: '未能寻见相关痕迹',
      subtitle: '换一个词试一试，或是前往专栏寻找灵感。'
    },
    general: {
      icon: Snowflake,
      title: '空落的落雪之所',
      subtitle: '暂时未发现记录。'
    }
  };

  const selected = contentMap[type] || contentMap.general;
  const Icon = selected.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center justify-center text-sky-400 mb-4 shadow-sm">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-medium text-slate-800 font-editorial-mincho mb-1.5">
        {customTitle || selected.title}
      </h4>
      <p className="text-xs text-slate-500 max-w-sm mb-5 font-light leading-relaxed">
        {customSubtitle || selected.subtitle}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-sky-500 hover:bg-sky-600 transition-all shadow-sm active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
