import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Check, 
  ChevronDown, ChevronUp, Send, FileEdit, AlertCircle, Shield, 
  HelpCircle, CheckCircle2, CornerDownRight, BookOpen, Clock
} from 'lucide-react';
import { Episode, ChronicleComment, User } from '../../types';
import { chronicleService } from '../../services/chronicleService';

interface ChronicleCommentThreadProps {
  episode: Episode;
  currentUser: User;
  onEpisodeUpdated: (updatedEpisode: Episode) => void;
  onUserScoreChanged?: () => void;
}

export const ChronicleCommentThread: React.FC<ChronicleCommentThreadProps> = ({
  episode,
  currentUser,
  onEpisodeUpdated,
  onUserScoreChanged
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<ChronicleComment[]>(() => 
    chronicleService.getComments(episode.id)
  );
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>(() => 
    chronicleService.getUserVotes()
  );

  // New Comment / Proposal Form State
  const [tabType, setTabType] = useState<'normal' | 'proposal'>('normal');
  const [content, setContent] = useState('');
  const [proposedTitle, setProposedTitle] = useState('');
  const [proposedSynopsis, setProposedSynopsis] = useState('');
  const [justification, setJustification] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'proposal' | 'normal'>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Reload comments for this episode
  const refreshComments = () => {
    setComments(chronicleService.getComments(episode.id));
    setUserVotes(chronicleService.getUserVotes());
  };

  const filteredList = useMemo(() => {
    if (filterMode === 'all') return comments;
    return comments.filter(c => c.type === filterMode);
  }, [comments, filterMode]);

  const proposalCount = comments.filter(c => c.type === 'proposal').length;
  const normalCount = comments.filter(c => c.type === 'normal').length;

  const handleVote = (commentId: string, direction: 'up' | 'down') => {
    const res = chronicleService.voteComment(commentId, direction);
    setComments(chronicleService.getComments(episode.id));
    setUserVotes(chronicleService.getUserVotes());

    // If downvoting an admin proposal/comment, handle demotion tracking
    if (direction === 'down') {
      const target = comments.find(c => c.id === commentId);
      if (target?.userRole === 'ROLE_ADMIN') {
        setFeedbackMsg('已提交反对票。注意：若管理员收到过多👎，其管理权限将被系统撤回。');
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    }
  };

  const handleAdoptProposal = (commentId: string) => {
    const approverName = currentUser.role === 'ROLE_ADMIN' 
      ? `管理员 · ${currentUser.nickname}` 
      : '社区高赞共识';
      
    const result = chronicleService.adoptProposal(commentId, approverName);
    if (result.success && result.episode) {
      onEpisodeUpdated(result.episode);
      refreshComments();
      onUserScoreChanged?.();
      setFeedbackMsg('✓ 该修改申请认可度达标，已正式采纳并合并至经历编年史档案！');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tabType === 'normal') {
      if (!content.trim()) return;
      chronicleService.addComment({
        targetId: episode.id,
        targetTitle: episode.title,
        userId: currentUser.id,
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: content.trim()
      });
      setContent('');
      refreshComments();
      setFeedbackMsg('普通评论已发表');
      setTimeout(() => setFeedbackMsg(null), 2500);
    } else {
      if (!proposedTitle.trim() || !proposedSynopsis.trim() || !justification.trim()) {
        alert('请完整填写修改标题、剧情梗概及考据依据');
        return;
      }
      chronicleService.addProposal({
        targetId: episode.id,
        targetTitle: episode.title,
        userId: currentUser.id,
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: content.trim() || '提交编年史细节修订提议',
        proposedTitle: proposedTitle.trim(),
        proposedSynopsis: proposedSynopsis.trim(),
        justification: justification.trim()
      });
      setContent('');
      setProposedTitle('');
      setProposedSynopsis('');
      setJustification('');
      refreshComments();
      onUserScoreChanged?.();
      setFeedbackMsg('✓ 修改申请已成功附属为评论！获得社区高认可后即可自动合并入库。');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="w-full pt-3 border-t border-slate-100/90 text-xs">
      
      {/* 1. Expand / Collapse Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600 font-medium py-1 px-2 rounded-lg hover:bg-sky-50/60 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
          <span>讨论与修改申请 ({comments.length})</span>
          {proposalCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold">
              {proposalCount} 篇修订提议
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>

        {isOpen && (
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                filterMode === 'all' ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              全部 ({comments.length})
            </button>
            <button
              onClick={() => setFilterMode('proposal')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                filterMode === 'proposal' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              修订申请 ({proposalCount})
            </button>
            <button
              onClick={() => setFilterMode('normal')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                filterMode === 'normal' ? 'bg-sky-100 text-sky-800 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              普通讨论 ({normalCount})
            </button>
          </div>
        )}
      </div>

      {/* Global Feedback Banner */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Expanded Comment & Proposal Thread */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 pt-3 mt-1"
          >
            {/* List of comments */}
            <div className="space-y-3">
              {filteredList.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 text-center text-slate-400 text-xs">
                  暂无对应评论。欢迎发表剧情见解或提出档案修改建议！
                </div>
              ) : (
                filteredList.map((comm) => {
                  const netScore = comm.upvotes - comm.downvotes;
                  const canBeAdopted = comm.type === 'proposal' && comm.status !== 'approved' && (netScore >= 3 || currentUser.role === 'ROLE_ADMIN');
                  const userVote = userVotes[comm.id];

                  return (
                    <div
                      key={comm.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        comm.type === 'proposal'
                          ? comm.status === 'approved'
                            ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                            : 'bg-gradient-to-br from-amber-50/60 via-white to-sky-50/30 border-amber-200/80 shadow-xs'
                          : 'bg-white/80 border-slate-200/70 shadow-2xs'
                      }`}
                    >
                      {/* Comment Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={comm.userAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 font-sans">
                                {comm.userName}
                              </span>
                              {comm.userRole === 'ROLE_ADMIN' && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-0.5">
                                  <Shield className="w-2.5 h-2.5" />
                                  管理员
                                </span>
                              )}
                              {comm.userRole === 'ROLE_COSER' && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                                  认证Coser
                                </span>
                              )}
                              {comm.type === 'proposal' && (
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                                  comm.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                  {comm.status === 'approved' ? '✓ 已采纳生效' : '📝 申请修改评论'}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {comm.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Voting & Approval Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleVote(comm.id, 'up')}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-mono transition-all ${
                              userVote === 'up'
                                ? 'bg-sky-500 text-white border-sky-500 font-bold shadow-2xs'
                                : 'bg-white hover:bg-sky-50 text-slate-600 border-slate-200'
                            }`}
                            title="赞同 / 认可此评论"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comm.upvotes}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVote(comm.id, 'down')}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-mono transition-all ${
                              userVote === 'down'
                                ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-2xs'
                                : 'bg-white hover:bg-rose-50 text-slate-600 border-slate-200'
                            }`}
                            title="质疑 / 反对此评论"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span>{comm.downvotes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Comment Body */}
                      <div className="mt-2.5 space-y-2">
                        {comm.content && (
                          <p className="text-xs text-slate-700 leading-relaxed font-light">
                            {comm.content}
                          </p>
                        )}

                        {/* Detailed Proposal Block */}
                        {comm.type === 'proposal' && (
                          <div className="rounded-xl p-3 bg-white/90 border border-amber-200/70 space-y-2 text-xs">
                            {comm.proposedTitle && (
                              <div>
                                <span className="font-mono text-[10px] text-amber-700 font-bold block">
                                  【建议修订标题】
                                </span>
                                <span className="font-bold text-slate-900 font-editorial-mincho">
                                  {comm.proposedTitle}
                                </span>
                              </div>
                            )}

                            {comm.proposedSynopsis && (
                              <div>
                                <span className="font-mono text-[10px] text-amber-700 font-bold block">
                                  【建议修订剧情梗概】
                                </span>
                                <p className="text-xs text-slate-600 leading-relaxed font-light mt-0.5">
                                  {comm.proposedSynopsis}
                                </p>
                              </div>
                            )}

                            {comm.justification && (
                              <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-500 italic">
                                <span className="font-mono text-[10px] text-slate-400 font-bold mr-1">
                                  考据依据：
                                </span>
                                {comm.justification}
                              </div>
                            )}

                            {/* Consensus & Merge Bar */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                                <span>净认可度:</span>
                                <strong className={`font-bold ${netScore >= 3 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                  +{netScore}
                                </strong>
                                <span className="text-[10px] text-slate-400">
                                  (达标门槛: 净赞同≥3 或 管理员直签)
                                </span>
                              </div>

                              {comm.status === 'approved' ? (
                                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium font-mono">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>已于 {comm.approvedAt} 由【{comm.approvedBy}】合并生效</span>
                                </div>
                              ) : canBeAdopted ? (
                                <button
                                  type="button"
                                  onClick={() => handleAdoptProposal(comm.id)}
                                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                >
                                  <Sparkles className="w-3 h-3 text-emerald-100" />
                                  <span>
                                    {currentUser.role === 'ROLE_ADMIN' 
                                      ? '⚡ 管理员免审采纳并合并' 
                                      : '社区共识达成 · 采纳并生效'}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-amber-600 font-mono">
                                  尚需 {Math.max(0, 3 - netScore)} 个净赞同可触发共识合并
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 3. New Comment / Proposal Submission Box */}
            <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                    发表评论或提请修改
                  </span>
                  {currentUser.role === 'ROLE_ADMIN' && (
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold">
                      管理员直接审阅特权开启
                    </span>
                  )}
                </div>

                {/* Sub-tab: Normal comment vs Proposal */}
                <div className="flex rounded-xl bg-slate-100 p-0.5 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setTabType('normal')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      tabType === 'normal' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500'
                    }`}
                  >
                    💬 普通讨论
                  </button>
                  <button
                    type="button"
                    onClick={() => setTabType('proposal')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      tabType === 'proposal' ? 'bg-amber-500 text-white shadow-2xs font-bold' : 'text-slate-500'
                    }`}
                  >
                    📝 申请修改此剧集
                  </button>
                </div>
              </div>

              {tabType === 'normal' ? (
                <div>
                  <textarea
                    rows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="分享对本集剧情名场面、雪乃微表情或名台词的感悟..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 resize-none leading-relaxed"
                    required
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>发布评论</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed font-light">
                    <strong>编年史修撰共识倡议：</strong>
                    提交的修改将作为「申请修改评论」附加在下方。当该提议获得社区其他读者的高认可度（净赞同 ≥ 3）或管理员批准时，将直接更新本剧集的正式展示档案！
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      建议修订的标题 (Title)
                    </label>
                    <input
                      type="text"
                      value={proposedTitle}
                      onChange={(e) => setProposedTitle(e.target.value)}
                      placeholder={`如：${episode.title}（含特别栋初相遇考据）`}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 font-editorial-mincho"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      建议修订的剧情梗概与关键事件 (Synopsis)
                    </label>
                    <textarea
                      rows={3}
                      value={proposedSynopsis}
                      onChange={(e) => setProposedSynopsis(e.target.value)}
                      placeholder="修改或补全本集重要情节、雪乃内心动态变化与核心冲突..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      考据来源与修改理由 (Justification)
                    </label>
                    <input
                      type="text"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="如：原著小说第1卷第二章、动画第13分20秒分镜、公式书考证..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>提请修改并附属评论</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
