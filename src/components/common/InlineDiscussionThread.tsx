import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, 
  Send, CornerDownRight, CheckCircle2, History, Shield, Sparkles, 
  AlertCircle, Edit3, Check, BookOpen
} from 'lucide-react';
import { ChronicleComment, CommentReply, RevisionLog, User, UserRole } from '../../types';
import { chronicleService } from '../../services/chronicleService';

interface InlineDiscussionThreadProps {
  targetId: string;
  targetType: ChronicleComment['targetType'];
  targetTitle: string;
  currentContent?: string;
  currentUser: User;
  onContentUpdated?: (newContent: string) => void;
  defaultExpanded?: boolean;
}

export const InlineDiscussionThread: React.FC<InlineDiscussionThreadProps> = ({
  targetId,
  targetType = 'character',
  targetTitle,
  currentContent = '',
  currentUser,
  onContentUpdated,
  defaultExpanded = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [comments, setComments] = useState<ChronicleComment[]>([]);
  const [historyLogs, setHistoryLogs] = useState<RevisionLog[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  
  // Expanded proposal IDs
  const [expandedProposalIds, setExpandedProposalIds] = useState<Record<string, boolean>>({});

  // Active reply box for specific comment ID
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState('');

  // New comment/proposal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'normal' | 'proposal'>('normal');
  const [commentText, setCommentText] = useState('');
  const [proposedText, setProposedText] = useState(currentContent);
  const [justification, setJustification] = useState('');
  const [references, setReferences] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Revision history accordion toggle
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Admin Direct Edit state
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminEditText, setAdminEditText] = useState(currentContent);
  const [adminReason, setAdminReason] = useState('管理员深度考据核准，直接更新入库。');

  const isAdmin = currentUser.role === 'ROLE_DEVELOPER' || 
                  currentUser.role === 'ROLE_CONTENT_ADMIN' || 
                  currentUser.role === 'ROLE_ADMIN';

  const loadData = () => {
    const list = chronicleService.getComments(targetId);
    setComments(list);
    const logs = chronicleService.getRevisionLogs(targetId);
    setHistoryLogs(logs);
    setUserVotes(chronicleService.getUserVotes());
  };

  useEffect(() => {
    loadData();
    setProposedText(currentContent);
    setAdminEditText(currentContent);
  }, [targetId, currentContent]);

  const proposalCount = comments.filter(c => c.type === 'proposal').length;
  const normalCount = comments.filter(c => c.type === 'normal').length;

  const toggleProposalExpand = (commentId: string) => {
    setExpandedProposalIds(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleVote = (commentId: string, direction: 'up' | 'down') => {
    chronicleService.voteComment(commentId, direction);
    loadData();

    if (direction === 'down') {
      const target = comments.find(c => c.id === commentId);
      if (target?.userRole === 'ROLE_CONTENT_ADMIN' || target?.userRole === 'ROLE_ADMIN') {
        setFeedbackMsg('已提交反对票。提示：管理员若收到较多反对票，其直编权限将被自动撤回。');
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    }
  };

  const handleAdoptProposal = (comment: ChronicleComment) => {
    const approverText = isAdmin ? `管理员 · ${currentUser.nickname}` : '社区高赞共识达成';
    const res = chronicleService.adoptProposal(comment.id, approverText);
    if (res.success) {
      loadData();
      const updatedText = comment.proposedContent || comment.proposedSynopsis || comment.content;
      if (updatedText && onContentUpdated) {
        onContentUpdated(updatedText);
      }
      setFeedbackMsg('✓ 该修改申请已采纳生效并合并至正式档案！');
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'normal') {
      if (!commentText.trim()) return;
      chronicleService.addComment({
        targetId,
        targetType,
        targetTitle,
        userId: currentUser.id,
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: commentText.trim()
      });
      setCommentText('');
      setFeedbackMsg('✓ 讨论发表成功');
    } else {
      if (!proposedText.trim() || !justification.trim()) {
        alert('请填写建议修改内容及修改理由');
        return;
      }
      const newProp = chronicleService.addProposal({
        targetId,
        targetType,
        targetTitle,
        userId: currentUser.id,
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: commentText.trim() || `提议修改：${targetTitle}`,
        currentContent: currentContent,
        proposedContent: proposedText.trim(),
        proposedTitle: targetTitle,
        proposedSynopsis: proposedText.trim(),
        justification: justification.trim(),
        references: references.trim() || '剧情关键镜头与角色台词依据'
      });
      // Automatically expand own proposal
      setExpandedProposalIds(prev => ({ ...prev, [newProp.id]: true }));
      setCommentText('');
      setJustification('');
      setReferences('');
      setFeedbackMsg('✓ 修改提议已提交，等待社区共识认可');
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedbackMsg(null), 3000);
    loadData();
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyInputText.trim()) return;
    chronicleService.addCommentReply(commentId, {
      userId: currentUser.id,
      userName: currentUser.nickname,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: replyInputText.trim()
    });
    setReplyInputText('');
    setActiveReplyCommentId(null);
    loadData();
  };

  const handleAdminDirectSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEditText.trim()) return;

    chronicleService.adminDirectEdit({
      targetId,
      targetType: (targetType as any) || 'character',
      targetTitle,
      field: '核心描述/考据感悟',
      before: currentContent,
      after: adminEditText.trim(),
      reason: adminReason.trim(),
      user: currentUser
    });

    if (onContentUpdated) {
      onContentUpdated(adminEditText.trim());
    }
    setIsAdminEditing(false);
    loadData();
    setFeedbackMsg('⚡ 管理员免审直编已入库生效，并写入修订日志');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === 'ROLE_DEVELOPER') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono">开发者</span>;
    }
    if (role === 'ROLE_CONTENT_ADMIN' || role === 'ROLE_ADMIN') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-mono">内容管理</span>;
    }
    if (role === 'ROLE_COSER') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 font-mono">认证Coser</span>;
    }
    return <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 font-mono">社区成员</span>;
  };

  return (
    <div className="w-full mt-3 pt-3 border-t border-slate-100 text-slate-800">
      
      {/* 1. Bar Toggle Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-sky-700 font-medium transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
            <span>讨论与修改建议</span>
            <span className="font-mono text-[11px] text-slate-400">({comments.length})</span>
            {proposalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-600 text-[10px] font-mono border border-sky-100">
                {proposalCount} 提议
              </span>
            )}
            {isOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          {historyLogs.length > 0 && (
            <button
              onClick={() => {
                setIsOpen(true);
                setIsHistoryOpen(!isHistoryOpen);
              }}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors ml-1"
            >
              <History className="w-3 h-3" />
              <span>修订记录 ({historyLogs.length})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => {
                setIsOpen(true);
                setIsAdminEditing(!isAdminEditing);
              }}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
              title="管理员免审直接修改"
            >
              <Shield className="w-3 h-3 text-sky-600" />
              <span>直编</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setIsFormOpen(!isFormOpen);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium flex items-center gap-1 transition-colors border border-sky-100/60"
          >
            <Edit3 className="w-3 h-3" />
            <span>发表看法 / 提议修改</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-2 p-2 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-800 text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Collapsible Main Container (Smooth Accordion, pushes down naturally) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden space-y-3 pt-2"
          >
            
            {/* Admin Direct Edit Section */}
            {isAdminEditing && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>管理员免审直接修改模式</span>
                  </div>
                  <span className="text-[10px] text-amber-700">修改后将直接同步并自动记入修订历史</span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">修改后的内容：</label>
                  <textarea
                    value={adminEditText}
                    onChange={(e) => setAdminEditText(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded-xl bg-white border border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">修改考据理由：</label>
                  <input
                    type="text"
                    value={adminReason}
                    onChange={(e) => setAdminReason(e.target.value)}
                    className="w-full p-1.5 px-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsAdminEditing(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-xs"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAdminDirectSave}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-xs"
                  >
                    保存并立即生效
                  </button>
                </div>
              </div>
            )}

            {/* Revision Logs Collapsible Accordion */}
            {isHistoryOpen && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>修订历史记录</span>
                  </span>
                  <button onClick={() => setIsHistoryOpen(false)} className="text-[11px] text-slate-400 hover:text-slate-600">
                    收起
                  </button>
                </div>

                {historyLogs.length === 0 ? (
                  <p className="text-[11px] text-slate-400 py-1">暂无修订记录</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {historyLogs.map(log => (
                      <div key={log.id} className="p-2 rounded-xl bg-white border border-slate-200/60 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-medium text-slate-700">{log.editorName} ({log.editorRole === 'ROLE_DEVELOPER' ? '开发者' : '内容管理'})</span>
                          <span className="font-mono text-[10px]">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600"><span className="text-slate-400">理由：</span>{log.reason}</p>
                        {log.changes.map((c, i) => (
                          <div key={i} className="text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <div className="line-through text-slate-400 line-clamp-1">{c.before}</div>
                            <div className="text-sky-700 font-medium mt-0.5 line-clamp-2">→ {c.after}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submission Form (Tabs: Normal Comment vs Revision Proposal) */}
            {isFormOpen && (
              <form onSubmit={handleSubmitComment} className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setFormMode('normal')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      formMode === 'normal' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    💬 普通讨论 / 感悟
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode('proposal')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      formMode === 'proposal' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ✎ 提交修改申请
                  </button>
                </div>

                {formMode === 'normal' ? (
                  <div>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="写下你对这一处情节、人物心理或台词的独到见解..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-0.5">提议概述 / 简述：</span>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="例如：我觉得这里关于雪乃心理变化的描述需要修改"
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {currentContent && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px]">
                        <span className="text-slate-400 block mb-0.5">当前内容：</span>
                        <p className="text-slate-600 line-clamp-2 italic">“{currentContent}”</p>
                      </div>
                    )}

                    <div>
                      <span className="block text-[11px] text-slate-500 mb-0.5">建议修改为：</span>
                      <textarea
                        value={proposedText}
                        onChange={(e) => setProposedText(e.target.value)}
                        rows={2}
                        placeholder="输入建议替换为的准确文字..."
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[11px] text-slate-500 mb-0.5">修改理由：</span>
                        <input
                          type="text"
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                          placeholder="例如：原描述过于绝对，缺乏第二季转变依据"
                          className="w-full p-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-500 mb-0.5">引用依据 (集数/轻小说卷数/台词)：</span>
                        <input
                          type="text"
                          value={references}
                          onChange={(e) => setReferences(e.target.value)}
                          placeholder="例如：S1E12、S2E08、小说第8卷"
                          className="w-full p-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-xs"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>{formMode === 'normal' ? '发表讨论' : '提交修改提议'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. Comments List (Pure inline layout, identical visual structure) */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 font-light">
                  暂无讨论或提议，点击右上方按钮即可在此条内容下发起交流。
                </div>
              ) : (
                comments.map((comment) => {
                  const isProposal = comment.type === 'proposal';
                  const isExpanded = !!expandedProposalIds[comment.id];
                  const currentVote = userVotes[comment.id];
                  const replies = comment.replies || [];
                  const isReplying = activeReplyCommentId === comment.id;

                  // Can adopt if admin or approval consensus is high
                  const canAdopt = isProposal && comment.status !== 'approved' && (
                    isAdmin || (comment.upvotes >= 3 && comment.upvotes > comment.downvotes * 2)
                  );

                  return (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-2.5 transition-all text-xs"
                    >
                      {/* Comment Header: Avatar, Name, Role Badge, Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comment.userAvatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=User'}
                            alt={comment.userName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">{comment.userName}</span>
                              {getRoleBadge(comment.userRole)}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{comment.createdAt}</span>
                          </div>
                        </div>

                        {/* Proposal Badge (Lightweight tag) */}
                        {isProposal && (
                          <div className="flex items-center gap-1.5">
                            {comment.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>已采纳生效</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 font-medium">
                                <span>✎ 修改提议</span>
                              </span>
                            )}

                            <button
                              onClick={() => toggleProposalExpand(comment.id)}
                              className="text-[11px] text-sky-600 hover:text-sky-800 font-medium flex items-center gap-0.5 px-1 py-0.5 rounded-md hover:bg-sky-50/80 transition-colors"
                            >
                              <span>{isExpanded ? '收起修改内容' : '展开修改内容'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Content (Text) */}
                      <p className="text-slate-700 leading-relaxed font-light text-xs pl-9">
                        {comment.content}
                      </p>

                      {/* Proposal Expand Accordion (Inline height expansion, natural push-down) */}
                      {isProposal && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden pl-9"
                            >
                              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100/90 space-y-2.5 text-xs text-slate-800">
                                
                                {comment.currentContent && (
                                  <div>
                                    <span className="text-[11px] font-medium text-slate-400 block mb-0.5">当前内容：</span>
                                    <div className="p-2 rounded-xl bg-white/90 border border-slate-200/70 text-slate-600 text-[11px] leading-relaxed">
                                      “{comment.currentContent}”
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <span className="text-[11px] font-semibold text-sky-900 block mb-0.5">建议修改为：</span>
                                  <div className="p-2.5 rounded-xl bg-white border border-sky-200 text-slate-900 text-xs font-medium leading-relaxed">
                                    “{comment.proposedContent || comment.proposedSynopsis}”
                                  </div>
                                </div>

                                {comment.justification && (
                                  <div>
                                    <span className="text-[11px] font-medium text-slate-500 block mb-0.5">修改理由：</span>
                                    <p className="text-slate-700 text-[11px] leading-relaxed pl-1">
                                      {comment.justification}
                                    </p>
                                  </div>
                                )}

                                {comment.references && (
                                  <div>
                                    <span className="text-[11px] font-medium text-slate-500 block mb-0.5">引用依据：</span>
                                    <div className="flex items-center gap-1.5 text-[11px] text-sky-700 font-mono bg-sky-100/60 px-2 py-1 rounded-lg w-fit">
                                      <BookOpen className="w-3 h-3 text-sky-600" />
                                      <span>{comment.references}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Voting & Adoption Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sky-200/50 text-xs">
                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-600 text-[11px]">
                                      认可修改 <strong className="text-slate-900 font-mono">{comment.upvotes}</strong>
                                    </span>
                                    <span className="text-slate-400 text-[11px]">·</span>
                                    <span className="text-slate-600 text-[11px]">
                                      不认可 <strong className="text-slate-900 font-mono">{comment.downvotes}</strong>
                                    </span>
                                    <span className="text-slate-400 text-[11px]">·</span>
                                    <span className="text-slate-600 text-[11px]">
                                      讨论回复 <strong className="text-slate-900 font-mono">{replies.length}</strong>
                                    </span>
                                  </div>

                                  {canAdopt && (
                                    <button
                                      onClick={() => handleAdoptProposal(comment)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>采纳并更新档案</span>
                                    </button>
                                  )}
                                </div>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* Comment Footer: Likes, Downvotes, Reply count / toggle */}
                      <div className="flex items-center justify-between pt-1 text-slate-500 text-[11px] pl-9">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleVote(comment.id, 'up')}
                            className={`flex items-center gap-1 transition-colors ${
                              currentVote === 'up' ? 'text-sky-600 font-medium' : 'hover:text-slate-800'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${currentVote === 'up' ? 'fill-sky-500 text-sky-500' : ''}`} />
                            <span className="font-mono">{comment.upvotes}</span>
                          </button>

                          <button
                            onClick={() => handleVote(comment.id, 'down')}
                            className={`flex items-center gap-1 transition-colors ${
                              currentVote === 'down' ? 'text-rose-600 font-medium' : 'hover:text-slate-800'
                            }`}
                          >
                            <ThumbsDown className={`w-3 h-3 ${currentVote === 'down' ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="font-mono">{comment.downvotes}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveReplyCommentId(isReplying ? null : comment.id);
                              setReplyInputText('');
                            }}
                            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <CornerDownRight className="w-3 h-3 text-slate-400" />
                            <span>回复</span>
                            {replies.length > 0 && <span className="font-mono">({replies.length})</span>}
                          </button>
                        </div>
                      </div>

                      {/* Thread Replies (Underneath proposal or comment, thread continues) */}
                      {replies.length > 0 && (
                        <div className="pl-9 pt-1.5 space-y-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-[11px]">
                            {replies.map(reply => (
                              <div key={reply.id} className="space-y-0.5 border-b border-slate-200/50 last:border-b-0 pb-1.5 last:pb-0">
                                <div className="flex items-center justify-between text-slate-500">
                                  <div className="flex items-center gap-1.5">
                                    <img
                                      src={reply.userAvatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=User'}
                                      alt={reply.userName}
                                      className="w-4 h-4 rounded-full"
                                    />
                                    <span className="font-medium text-slate-800">{reply.userName}</span>
                                    {getRoleBadge(reply.userRole)}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{reply.createdAt}</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed font-light pl-5.5">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reply Input Box */}
                      {isReplying && (
                        <div className="pl-9 pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={replyInputText}
                              onChange={(e) => setReplyInputText(e.target.value)}
                              placeholder={`回复 @${comment.userName}...`}
                              className="flex-1 p-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs text-slate-800"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSubmitReply(comment.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleSubmitReply(comment.id)}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-xs"
                            >
                              回复
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
