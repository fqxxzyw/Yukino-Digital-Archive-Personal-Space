import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageSquare, History, ThumbsUp, ThumbsDown, CheckCircle2, 
  AlertCircle, Shield, Sparkles, Send, Edit3, ArrowRight, Check
} from 'lucide-react';
import { ChronicleComment, RevisionLog, User } from '../../types';
import { api } from '../../services/api';

interface ItemDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'episode' | 'timeline' | 'quote' | 'outfit' | 'character' | 'lore';
  targetTitle: string;
  currentContent?: string;
  currentUser: User;
  onItemUpdated?: (updatedField: string, newValue: string) => void;
  onUserScoreUpdated?: (user: User) => void;
}

export const ItemDiscussionDrawer: React.FC<ItemDiscussionDrawerProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  currentContent = '',
  currentUser,
  onItemUpdated,
  onUserScoreUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');
  const [comments, setComments] = useState<ChronicleComment[]>([]);
  const [historyLogs, setHistoryLogs] = useState<RevisionLog[]>([]);
  const [commentType, setCommentType] = useState<'normal' | 'proposal'>('normal');

  // Input states
  const [normalText, setNormalText] = useState('');
  const [proposedTitle, setProposedTitle] = useState('');
  const [proposedContent, setProposedContent] = useState(currentContent);
  const [justification, setJustification] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Admin Direct Edit state
  const [isAdminDirectEditing, setIsAdminDirectEditing] = useState(false);
  const [adminField, setAdminField] = useState('详细描述/感悟');
  const [adminNewContent, setAdminNewContent] = useState(currentContent);
  const [adminReason, setAdminReason] = useState('管理员考据核准，直编入库更新。');

  const isAdmin = currentUser.role === 'ROLE_CONTENT_ADMIN' || currentUser.role === 'ROLE_DEVELOPER' || currentUser.role === 'ROLE_ADMIN';

  const loadData = () => {
    const list = api.getComments(targetId);
    setComments(list);
    const logs = api.getRevisionLogs(targetId);
    setHistoryLogs(logs);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setProposedContent(currentContent);
      setAdminNewContent(currentContent);
      setProposedTitle(targetTitle);
    }
  }, [isOpen, targetId, currentContent, targetTitle]);

  if (!isOpen) return null;

  const handleSubmitNormalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalText.trim()) return;
    setSubmitting(true);

    api.addComment({
      targetId,
      targetType,
      targetTitle,
      userId: currentUser.id,
      userName: currentUser.nickname,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: normalText.trim()
    });

    setNormalText('');
    setSubmitting(false);
    setSuccessFeedback('评论发表成功！');
    setTimeout(() => setSuccessFeedback(null), 1500);
    loadData();
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedContent.trim() || !justification.trim()) return;
    setSubmitting(true);

    api.addProposal({
      targetId,
      targetType,
      targetTitle,
      userId: currentUser.id,
      userName: currentUser.nickname,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: `申请修订：${justification.trim()}`,
      proposedTitle: proposedTitle.trim() || targetTitle,
      proposedSynopsis: proposedContent.trim(),
      justification: justification.trim()
    });

    setJustification('');
    setSubmitting(false);
    setSuccessFeedback('修改申请已附属提交！社区认可或管理员通过后即可正式合并。');
    setTimeout(() => setSuccessFeedback(null), 2500);
    loadData();
  };

  const handleVote = (commentId: string, direction: 'up' | 'down') => {
    const res = api.voteComment(commentId, direction);
    setComments(res.comments.filter(c => c.targetId === targetId));
  };

  const handleAdoptProposal = (comment: ChronicleComment) => {
    const result = api.adoptProposal(comment.id);
    if (result.success) {
      setSuccessFeedback(`🎉 修改申请已正式采纳并合并至档案！已记录修改历史。`);
      setTimeout(() => setSuccessFeedback(null), 2500);
      
      const newText = comment.proposedSynopsis || comment.proposedTitle || '';
      if (newText) {
        onItemUpdated?.('content', newText);
      }

      // Proposer gets +25 points and approved count +1
      const updatedUser = {
        ...currentUser,
        approvedModificationsCount: (currentUser.approvedModificationsCount || 0) + 1,
        contributionPoints: (currentUser.contributionPoints || 0) + 25
      };
      api.updateUser(updatedUser);
      onUserScoreUpdated?.(updatedUser);

      loadData();
    }
  };

  const handleSaveAdminDirectEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewContent.trim()) return;

    api.adminDirectEdit({
      targetId,
      targetType,
      targetTitle,
      field: adminField,
      before: currentContent,
      after: adminNewContent.trim(),
      reason: adminReason.trim() || '内容管理员免审实时编纂',
      user: currentUser
    });

    onItemUpdated?.(adminField, adminNewContent.trim());
    setIsAdminDirectEditing(false);
    setSuccessFeedback('⚡ 管理员免审直编已实时入库保存！');
    setTimeout(() => setSuccessFeedback(null), 2000);
    loadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold uppercase">
                {targetType}
              </span>
              <span className="text-xs text-slate-400 font-mono">条目互动研讨</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-editorial-mincho line-clamp-1">
              {targetTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'comments'
                  ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>评论与申请修改 ({comments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>修改记录 ({historyLogs.length})</span>
            </button>
          </div>

          {/* Admin Direct Edit Trigger */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminDirectEditing(true)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-200 flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>免审直编</span>
            </button>
          )}
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {successFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 text-emerald-800 text-xs px-5 py-2.5 border-b border-emerald-100 flex items-center gap-2 font-medium"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Direct Edit Modal Bar */}
        <AnimatePresence>
          {isAdminDirectEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-amber-50/80 border-b border-amber-200 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>管理员免审直编工作台 (实时保存入库)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdminDirectEditing(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={adminNewContent}
                onChange={(e) => setAdminNewContent(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="直接编辑条目正文..."
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminReason}
                  onChange={(e) => setAdminReason(e.target.value)}
                  className="flex-1 text-[11px] p-2 rounded-xl border border-amber-200 bg-white"
                  placeholder="修改考据或理由备注..."
                />
                <button
                  onClick={handleSaveAdminDirectEdit}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  实时更新
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: Comments & Proposals */}
        {activeTab === 'comments' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Input Form Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">发表想法或修改</span>
                
                {/* Switcher: Normal vs Proposal */}
                <div className="flex rounded-lg bg-slate-200/70 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCommentType('normal')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      commentType === 'normal' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    💬 普通讨论
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentType('proposal')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      commentType === 'proposal' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    📝 申请修改条目
                  </button>
                </div>
              </div>

              {commentType === 'normal' ? (
                <form onSubmit={handleSubmitNormalComment} className="space-y-2">
                  <textarea
                    value={normalText}
                    onChange={(e) => setNormalText(e.target.value)}
                    placeholder="针对此场景、服饰、语录或剧情写下您的看法与感悟..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !normalText.trim()}
                      className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>发布讨论</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitProposal} className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-[11px] text-sky-800">
                    💡 提示：因为每个人对成长心路历程看法不同，您可以提交修订提议。附属于本条目下方，经社区高赞认可或管理员审核后，将正式合并采纳！
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">
                      提议修改后的新标题 (可选)
                    </label>
                    <input
                      type="text"
                      value={proposedTitle}
                      onChange={(e) => setProposedTitle(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="修改后的标题..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">
                      提议修改后的详细内容 / 考据描述
                    </label>
                    <textarea
                      value={proposedContent}
                      onChange={(e) => setProposedContent(e.target.value)}
                      rows={3}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-400"
                      placeholder="输入您认为更加精确或有深度的心路历程、名场面细节..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">
                      修改依据与考据出处 (必填)
                    </label>
                    <input
                      type="text"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="例如：原著小说第3卷第2章、早见沙织广播剧访谈等..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !proposedContent.trim() || !justification.trim()}
                      className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>提交修改申请</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* List of Comments & Proposals */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-light">
                  暂无附属讨论与修改申请，欢迎成为第一个参与考据的修撰者！
                </div>
              ) : (
                comments.map((comment) => {
                  const isProposal = comment.type === 'proposal';
                  const netVotes = comment.upvotes - comment.downvotes;
                  const canAdopt = (netVotes >= 2 || isAdmin) && comment.status !== 'approved';

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isProposal
                          ? comment.status === 'approved'
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-amber-50/40 border-amber-200/80 shadow-sm'
                          : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      {/* User Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.userAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-white shadow-xs"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {comment.userName}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            comment.userRole === 'ROLE_DEVELOPER'
                              ? 'bg-purple-100 text-purple-700'
                              : comment.userRole === 'ROLE_CONTENT_ADMIN'
                              ? 'bg-amber-100 text-amber-800'
                              : comment.userRole === 'ROLE_COSER'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {comment.userRole === 'ROLE_DEVELOPER'
                              ? '开发者超管'
                              : comment.userRole === 'ROLE_CONTENT_ADMIN'
                              ? '内容管理员'
                              : comment.userRole === 'ROLE_COSER'
                              ? '认证COSER'
                              : '成员'}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {comment.createdAt}
                        </span>
                      </div>

                      {/* Content Section */}
                      {isProposal ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                              申请修改提议
                            </span>
                            {comment.status === 'approved' && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>已采纳合并入库</span>
                              </span>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-xs text-slate-800 space-y-1.5">
                            {comment.proposedTitle && (
                              <div className="font-bold text-slate-900 border-b border-amber-100 pb-1">
                                提议标题：{comment.proposedTitle}
                              </div>
                            )}
                            <div className="leading-relaxed">
                              {comment.proposedSynopsis || comment.content}
                            </div>
                            {comment.justification && (
                              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                依据考证：<span className="text-slate-700">{comment.justification}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {comment.content}
                        </p>
                      )}

                      {/* Action & Voting Bar */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100/80 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(comment.id, 'up')}
                            className="flex items-center gap-1 text-slate-500 hover:text-sky-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="font-mono text-[11px]">{comment.upvotes}</span>
                          </button>

                          <button
                            onClick={() => handleVote(comment.id, 'down')}
                            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="font-mono text-[11px]">{comment.downvotes}</span>
                          </button>
                        </div>

                        {/* Adopt Button for Proposals */}
                        {isProposal && comment.status !== 'approved' && (
                          <div>
                            {canAdopt ? (
                              <button
                                onClick={() => handleAdoptProposal(comment)}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition-all"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>采纳修改 (+25贡献分)</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                还需 {Math.max(0, 2 - netVotes)} 赞达成采纳共识
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Revision History Logs */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="text-xs text-slate-500 font-light mb-2">
              📜 该条目历史上被社区采纳或管理员直编的修改版本归档：
            </div>

            {historyLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-light">
                暂无历史修改版本，当前为初版典籍收录。
              </div>
            ) : (
              historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      log.action === 'admin_direct_edit'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.action === 'admin_direct_edit' ? '管理员免审直编' : '社区提议采纳合并'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="text-slate-700 font-medium">
                    修订人：<span className="font-bold text-slate-900">{log.editorName}</span> ({log.editorRole})
                  </div>

                  {log.changes.map((ch, idx) => (
                    <div key={idx} className="space-y-1 p-2.5 rounded-xl bg-white border border-slate-100">
                      <div className="text-[10px] font-mono text-sky-600 font-bold">
                        【{ch.field}】变更对比：
                      </div>
                      <div className="text-[11px] text-rose-600 line-through">
                        - {ch.before}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        + {ch.after}
                      </div>
                    </div>
                  ))}

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    考证依据：{log.reason}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};
