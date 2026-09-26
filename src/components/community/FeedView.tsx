import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Bookmark, Share2, PenTool, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { Post, User } from '../../types';

interface FeedViewProps {
  posts: Post[];
  user: User;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onNewPost: (content: string, images?: string[], tags?: string[]) => void;
  onRequestToSignFromPost: (imageUrl: string, authorName: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  user,
  onLikePost,
  onBookmarkPost,
  onNewPost,
  onRequestToSignFromPost
}) => {
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const tags = newTag ? [newTag.replace('#', '')] : ['千叶随笔'];
    onNewPost(newContent, [], tags);
    setNewContent('');
    setNewTag('');
  };

  return (
    <div className="space-y-8 pb-24 max-w-3xl mx-auto px-4 sm:px-6">
      
      {/* 1. Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
          COMMUNITY FEED & COSER DISPATCH
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho mt-1">
          侍奉部同好社区动态
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          交流春物心得、分享雪乃摄影正片、支持认证 Coser 并申请手写 To 签。
        </p>
      </div>

      {/* 2. New Post Composer */}
      <div className="rounded-3xl p-5 sm:p-6 liquid-glass border border-white/90 shadow-sm">
        <div className="flex items-start gap-3">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-10 h-10 rounded-full object-cover border border-sky-100"
          />
          <div className="flex-1 space-y-3">
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="分享今天的春物重温感悟，或是留下与雪乃相关的心情..."
              className="w-full bg-slate-50/70 border border-slate-200/70 rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none font-light placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="#标签 (例如：春物感想、Coser正片)"
                className="px-3 py-1.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-600 focus:outline-none w-48 font-light"
              />

              <button
                onClick={handleCreatePost}
                disabled={!newContent.trim()}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发布动态</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Post Feed Stream */}
      <div className="space-y-6 focus-dim-group">
        {posts.map((post, idx) => (
          <motion.article
            key={post.id}
            whileHover={{ 
              y: -6, 
              scale: 1.015, 
              rotateZ: idx % 2 === 0 ? [-0.2, 0.3, -0.15, 0] : [0.2, -0.3, 0.15, 0],
              transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 20 }
            }}
            className="focus-card-item rounded-3xl p-6 liquid-glass border border-white/95 shadow-sm hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.25)] hover:border-sky-300 transition-all space-y-4 relative z-10"
          >
            {/* Author Zone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-11 h-11 rounded-full object-cover border border-sky-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{post.userName}</span>
                    {post.isCoser && (
                      <span className="text-[10px] font-mono text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        COSER 认证
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{post.createdAt}</span>
                </div>
              </div>

              {post.isCoser && post.images.length > 0 && (
                <button
                  onClick={() => onRequestToSignFromPost(post.images[0], post.userName)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100 text-xs font-medium flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>申请此套图 To 签</span>
                </button>
              )}
            </div>

            {/* Content Text */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line">
              {post.content}
            </p>

            {/* Images Grid */}
            {post.images.length > 0 && (
              <div className={`grid gap-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {post.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden aspect-[4/3] border border-white shadow-sm"
                  >
                    <img
                      src={img}
                      alt="post visual"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {post.tags.map((t, idx) => (
                <span key={idx} className="text-sky-600/80 hover:text-sky-600 font-mono">
                  #{t}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors active:scale-90 ${
                    post.liked ? 'text-rose-500 font-medium' : 'hover:text-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} 条讨论</span>
                </button>
              </div>

              <button
                onClick={() => onBookmarkPost(post.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  post.bookmarked ? 'text-amber-500' : 'hover:text-slate-800'
                }`}
                title="收藏此动态"
              >
                <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Comment Drawer Section */}
            {activeCommentsPostId === post.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 border-t border-slate-100 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="写下你的想法..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!commentInput.trim()) return;
                      post.commentsCount += 1;
                      setCommentInput('');
                    }}
                    className="px-3 py-2 rounded-xl bg-sky-500 text-white text-xs font-medium"
                  >
                    发送
                  </button>
                </div>
              </motion.div>
            )}

          </motion.article>
        ))}
      </div>

    </div>
  );
};
