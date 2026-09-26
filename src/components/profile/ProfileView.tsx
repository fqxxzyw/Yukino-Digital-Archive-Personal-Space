import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ToSignRequest, GalleryItem, Post, CoserCertification, ArchiveContribution } from '../../types';
import { 
  Bookmark, PenTool, Sparkles, Shield, Camera, Check, Clock, AlertCircle,
  Award, Database, ThumbsUp, Plus, Heart, HelpCircle, Layers, X, FileText, ChevronRight
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { ActivityDotMatrix, ActivityMatrixItem } from '../common/ActivityDotMatrix';
import { ContributionDashboard } from './ContributionDashboard';
import { 
  getStoredContributions, calculateContributionSummary, addArchiveContribution, 
  likeContribution, WEIGHT_ARCHIVE, WEIGHT_LIKE, FORMULA_ARCHIVE_WEIGHT, FORMULA_LIKE_WEIGHT
} from '../../services/contributionService';

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
  const [activeTab, setActiveTab] = useState<'contributions' | 'tosign' | 'favorites' | 'coser_cert' | 'settings'>('contributions');
  const [coserCN, setCoserCN] = useState(user.coserCN || '');
  const [coserBio, setCoserBio] = useState('长期专注于雪之下雪乃角色出片，曾参展千叶动漫嘉年华。');
  const [portfolioLink, setPortfolioLink] = useState('https://weibo.com/p/my_portfolio');
  const [applySuccess, setApplySuccess] = useState(false);

  // Contributions State & Computation
  const [contributions, setContributions] = useState<ArchiveContribution[]>(() => getStoredContributions());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newType, setNewType] = useState<ArchiveContribution['targetType']>('character');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const contributionSummary = useMemo(() => {
    return calculateContributionSummary(contributions);
  }, [contributions]);

  const contributionActivityItems = useMemo<ActivityMatrixItem[]>(() => {
    return contributions.map(c => ({
      id: c.id,
      date: c.date,
      value: c.totalPoints,
      color: '#2563eb', // Token-blue matching the user screenshot
      label: `+${Number((c.likes * 0.6 + 5).toFixed(1))} 贡献加权 (获赞:${c.likes}次 · 权重0.6)`,
      title: c.targetTitle,
      secondaryValue: c.likes,
      meta: c
    }));
  }, [contributions]);

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    addArchiveContribution(newTitle, newSummary, newType);
    setContributions(getStoredContributions());
    setNewTitle('');
    setNewSummary('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
    }, 1200);
  };

  const handleLikeContribution = (id: string) => {
    const updated = likeContribution(id);
    setContributions(updated);
  };

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

      {/* 1.5. Community Contribution Token Dashboard & Heatmap Dot Matrix (社区贡献度仪表盘与Token使用量UI) */}
      <div className="space-y-5">
        {/* Main Contribution Token Dashboard with Dual Visual Progress Bars & Formula */}
        <ContributionDashboard
          summary={contributionSummary}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />

        {/* Token-style Activity Dot Matrix (时序点阵活动图) */}
        <ActivityDotMatrix
          title="贡献热力活动"
          subtitle="时序点阵映射历史考据补全与点赞认同轨迹 · 累计阶梯式爬升"
          items={contributionActivityItems}
          defaultMode="cumulative"
          defaultFilledColor="#2563eb"
          summarySlot={
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-mono">
                当前活跃统计周期: <strong className="text-blue-600 font-bold">近12个月</strong>
              </span>
              <span>·</span>
              <span className="text-slate-500 font-mono">
                当前生效公式: <strong className="text-slate-800 font-bold">(档案补全度 × 0.4) + (获赞总数 × 0.6) = {contributionSummary.formulaScore} 分</strong>
              </span>
            </div>
          }
        />
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex justify-center sm:justify-start">
        <div className="p-1 rounded-2xl liquid-glass border border-white/90 flex flex-wrap gap-1 shadow-sm">
          {[
            { id: 'contributions', label: '档案共建明细', icon: Award },
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
        
        {/* Contributions Tab */}
        {activeTab === 'contributions' && (
          <motion.div
            key="contributions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-editorial-mincho">
                  我的档案补全与考据记录
                </h3>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  你对雪野原档案馆的每一次修撰与考据补全，都将被永久铭刻并计入社区热力贡献图谱。
                </p>
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建补全词条</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {contributions.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3, scale: 1.008 }}
                  className="rounded-2xl p-4 bg-white/95 border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/50">
                          {item.targetType === 'character' ? '人物设定' : item.targetType === 'lore' ? '世界观圣地' : item.targetType === 'episode' ? '剧情细节' : '画集图谱'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-editorial-mincho truncate">
                          {item.targetTitle}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        贡献日期: {item.date} · 状态: 已入库生效
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200/50">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-mono font-bold text-blue-700">
                        +{item.totalPoints}
                      </span>
                      <span className="text-[10px] text-blue-500">贡献分</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-light bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span>补全考据权重: <strong className="text-sky-700">40% (×0.4)</strong></span>
                      <span>·</span>
                      <span>获赞加权加成: <strong className="text-blue-700">+{Number((item.likes * FORMULA_LIKE_WEIGHT).toFixed(1))}</strong> (0.6 × {item.likes}赞)</span>
                    </div>

                    {/* Like Simulator Button */}
                    <button
                      type="button"
                      onClick={() => handleLikeContribution(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-200/60 text-xs font-mono flex items-center gap-1 active:scale-95 transition-all"
                      title="模拟社区读者为此词条点赞 (依公式贡献度增加 0.6 分)"
                    >
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{item.likes} 点赞</span>
                      <span className="text-[10px] text-rose-400">(+0.6分)</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* To Sign Requests Tab */}
        {activeTab === 'tosign' && (
          <motion.div
            key="tosign"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 focus-dim-group"
          >
            {toSignRequests.length === 0 ? (
              <EmptyState
                type="favorites"
                customTitle="暂无 To 签申请记录"
                customSubtitle="在图库或社区中找到心仪的 Coser 作品，点击「申请 To 签」即可开启定制。"
              />
            ) : (
              toSignRequests.map((req, rIdx) => (
                <motion.div
                  key={req.id}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.015, 
                    rotateZ: rIdx % 2 === 0 ? [-0.2, 0.3, -0.15, 0] : [0.2, -0.3, 0.15, 0],
                    transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 20 }
                  }}
                  className="focus-card-item rounded-3xl p-5 sm:p-6 liquid-glass border border-white/95 shadow-sm hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.25)] hover:border-sky-300 transition-all flex flex-col sm:flex-row gap-5 items-start relative z-10"
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
                </motion.div>
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
            className="space-y-4 focus-dim-group"
          >
            {bookmarkedPosts.length === 0 ? (
              <EmptyState type="favorites" />
            ) : (
              bookmarkedPosts.map((post, pIdx) => (
                <motion.div
                  key={post.id}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.015, 
                    rotateZ: pIdx % 2 === 0 ? [-0.2, 0.3, -0.15, 0] : [0.2, -0.3, 0.15, 0],
                    transition: { rotateZ: { duration: 0.6 }, type: 'spring', stiffness: 350, damping: 20 }
                  }}
                  className="focus-card-item rounded-3xl p-5 liquid-glass border border-white/95 hover:border-sky-300 hover:shadow-[0_24px_50px_-15px_rgba(2,132,199,0.25)] transition-all space-y-2 relative z-10"
                >
                  <div className="flex items-center gap-2">
                    <img src={post.userAvatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-slate-800">{post.userName}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                </motion.div>
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

      {/* Submit Archive Contribution Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[24px]"
            onClick={() => setIsSubmitModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg apple-spring-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/95 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-editorial-mincho">
                      补全档案词条 · 增益社区贡献度
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans">
                      提交一条新考据/档案细节即可提升档案补全度 (权重 ×0.4)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    档案补全成功入库！
                  </h4>
                  <p className="text-xs text-slate-500">
                    档案补全度与贡献度仪表盘已实时更新，累计获赞将享 <strong className="text-blue-600">60% 加权加成</strong>。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddContribution} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      词条归属类别
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'character', label: '人物设定' },
                        { id: 'lore', label: '世界观圣地' },
                        { id: 'episode', label: '剧情名场面' },
                        { id: 'gallery', label: '画集图谱' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setNewType(t.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                            newType === t.id
                              ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      补全词条名称
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="例如：雪乃在猫咪咖啡厅的隐藏台词考析"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      补全内容概述与考据来源
                    </label>
                    <textarea
                      rows={4}
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      placeholder="详细写下补充的设定背景、剧情帧数、原著小说卷数或圣地经纬度..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* Weight explanation */}
                  <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>计算公式：贡献度 = (档案补全度 × 0.4) + (被点赞总数 × 0.6)</span>
                    </div>
                    <p className="text-[11px] text-blue-700/90 leading-relaxed font-light">
                      提交后直接提升档案库完备度（占 40% 权重）。词条日后收获读者点赞时，每次点赞可产生 0.6 贡献分加成（占 60% 权重），仪表盘与进度条实时响应。
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                    >
                      确认入库并获取 +50 分
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
