import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ToSignRequest, GalleryItem, Post, CoserCertification } from '../../types';
import { Bookmark, PenTool, Sparkles, Shield, Camera, Check, Clock, AlertCircle } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
  toSignRequests: ToSignRequest[];
  bookmarkedPosts: Post[];
  onApplyCoser: (cn: string, bio: string, links: string[]) => void;
  coserCert?: CoserCertification;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  toSignRequests,
  bookmarkedPosts,
  onApplyCoser,
  coserCert
}) => {
  const [activeTab, setActiveTab] = useState<'tosign' | 'favorites' | 'coser_cert' | 'settings'>('tosign');
  const [coserCN, setCoserCN] = useState(user.coserCN || '');
  const [coserBio, setCoserBio] = useState('长期专注于雪之下雪乃角色出片，曾参展千叶动漫嘉年华。');
  const [portfolioLink, setPortfolioLink] = useState('https://weibo.com/p/my_portfolio');
  const [applySuccess, setApplySuccess] = useState(false);

  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ nickname, bio });
  };

  const handleCoserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coserCN.trim()) return;
    onApplyCoser(coserCN, coserBio, [portfolioLink]);
    setApplySuccess(true);
    setTimeout(() => setApplySuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* 1. Profile Top Card */}
      <div className="rounded-3xl p-6 sm:p-8 liquid-glass border border-white/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.avatar}
          alt={user.nickname}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-editorial-mincho">
              {user.nickname}
            </h2>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              {user.isCoser ? (
                <span className="text-[10px] font-mono font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  认证 COSER ({user.coserCN})
                </span>
              ) : (
                <span className="text-[10px] font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  侍奉部部员
                </span>
              )}
              {user.role === 'ROLE_ADMIN' && (
                <span className="text-[10px] font-mono font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  系统管理员
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 font-light max-w-md">
            {user.bio}
          </p>

          <div className="text-xs text-slate-400 font-mono pt-1">
            <span>注册邮箱: {user.email}</span>
            <span className="mx-2">·</span>
            <span>入站时间: {user.createdAt}</span>
          </div>
        </div>

        {/* Quick Role Tester Toggle */}
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-center sm:text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-mono block mb-1">测试权限切换</span>
          <button
            onClick={() => onUpdateUser({ 
              role: user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN' 
            })}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white border border-slate-200 hover:bg-slate-100"
          >
            {user.role === 'ROLE_ADMIN' ? '切换为普通用户' : '切换为管理员 (Admin)'}
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex justify-center sm:justify-start">
        <div className="p-1 rounded-2xl liquid-glass border border-white/90 flex gap-1 shadow-sm">
          {[
            { id: 'tosign', label: '我的 To 签', icon: PenTool },
            { id: 'favorites', label: '我的收藏', icon: Bookmark },
            { id: 'coser_cert', label: 'Coser 认证申请', icon: Camera },
            { id: 'settings', label: '资料设置', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* To Sign Requests Tab */}
        {activeTab === 'tosign' && (
          <motion.div
            key="tosign"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {toSignRequests.length === 0 ? (
              <EmptyState
                type="favorites"
                customTitle="暂无 To 签申请记录"
                customSubtitle="在图库或社区中找到心仪的 Coser 作品，点击「申请 To 签」即可开启定制。"
              />
            ) : (
              toSignRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl p-5 sm:p-6 liquid-glass border border-white/90 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="w-full sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white relative">
                    <img
                      src={req.imageUrl}
                      alt={req.galleryTitle}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      style={{ 
                        left: `${req.positionX}%`, 
                        top: `${req.positionY}%`,
                        color: req.inkColor 
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold"
                    >
                      手写印记
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-editorial-mincho">
                        {req.galleryTitle}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'approved' ? '已完成签署' : '待 Coser 签署'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs font-editorial-mincho text-slate-800">
                      {req.dedicationText}
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div>受签 CN：<span className="text-slate-700">{req.requesterCN}</span></div>
                      <div>附言备注：<span className="text-slate-700">{req.remarks || '无'}</span></div>
                      <div>递交日期：<span className="font-mono">{req.createdAt}</span></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {bookmarkedPosts.length === 0 ? (
              <EmptyState type="favorites" />
            ) : (
              bookmarkedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl p-5 liquid-glass border border-white/90 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <img src={post.userAvatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-slate-800">{post.userName}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Coser Certification Tab */}
        {activeTab === 'coser_cert' && (
          <motion.div
            key="coser_cert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl p-6 sm:p-8 liquid-glass border border-white/90 shadow-sm space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 font-editorial-mincho">
                认证 Coser 申请通道
              </h3>
              <p className="text-xs text-slate-500 font-light mt-1">
                认证通过后，您将获得专属 [COSER] 标识，并开启粉丝 To 签申请与专属接单管理后台。
              </p>
            </div>

            {user.isCoser ? (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>恭喜！您已是认证 Coser (CN: {user.coserCN})，可在社区动态中自由发布正片并接收 To 签委托。</span>
              </div>
            ) : (
              <form onSubmit={handleCoserSubmit} className="space-y-4">
                {applySuccess && (
                  <div className="p-3 rounded-xl bg-sky-50 text-sky-700 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>申请已提交！管理员审核通过后将即刻生效。</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Coser 常用艺名 / CN
                  </label>
                  <input
                    type="text"
                    value={coserCN}
                    onChange={(e) => setCoserCN(e.target.value)}
                    placeholder="例如：浅羽由乃、雪原千寻"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cosplay 个人履历与自我介绍
                  </label>
                  <textarea
                    rows={3}
                    value={coserBio}
                    onChange={(e) => setCoserBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none font-light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    作品集链接 (微博 / Bilibili / 半次元)
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                >
                  递交认证申请
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl p-6 sm:p-8 liquid-glass border border-white/90 shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900 font-editorial-mincho">
              个人资料修改
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">昵称</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">个性签名</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm"
              >
                保存修改
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
