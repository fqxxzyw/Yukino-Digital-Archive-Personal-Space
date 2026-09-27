import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Pause, MapPin, ThumbsUp, ThumbsDown, MessageSquare, 
  Send, Sparkles, Clock, Check, Film, Edit3, ArrowRight, History
} from 'lucide-react';
import { Episode, EpisodePin, User } from '../../types';
import { api } from '../../services/api';
import { ItemDiscussionDrawer } from '../common/ItemDiscussionDrawer';

interface EpisodeDetailModalProps {
  episode: Episode | null;
  onClose: () => void;
  currentUser: User;
  onUpdateEpisode?: (updatedEp: Episode) => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  currentUser,
  onUpdateEpisode
}) => {
  if (!episode) return null;

  // Video Simulator states
  const totalDurationSeconds = 24 * 60; // 24 minutes (1440 seconds)
  const [currentSeconds, setCurrentSeconds] = useState(120); // 02:00 initial
  const [isPlaying, setIsPlaying] = useState(false);
  const [pins, setPins] = useState<EpisodePin[]>([]);

  // Pin submission state
  const [isPinningOpen, setIsPinningOpen] = useState(false);
  const [pinContent, setPinContent] = useState('');
  const [pinType, setPinType] = useState<EpisodePin['type']>('insight');
  const [customTimestampText, setCustomTimestampText] = useState('02:00');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  // Discussion drawer state for episode revision proposals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Parse mm:ss to seconds
  const parseTimestamp = (str: string) => {
    const parts = str.split(':');
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10) || 0;
      const s = parseInt(parts[1], 10) || 0;
      return Math.min(totalDurationSeconds, Math.max(0, m * 60 + s));
    }
    return currentSeconds;
  };

  const loadPins = () => {
    const list = api.getEpisodePins(episode.id);
    setPins(list);
  };

  useEffect(() => {
    loadPins();
  }, [episode.id]);

  // Video progress ticker when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = parseInt(e.target.value, 10);
    setCurrentSeconds(sec);
    setCustomTimestampText(formatSeconds(sec));
  };

  const handleJumpToTimestamp = (sec: number) => {
    setCurrentSeconds(sec);
    setCustomTimestampText(formatSeconds(sec));
    setIsPlaying(false);
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinContent.trim()) return;

    const sec = parseTimestamp(customTimestampText);
    const newPin = api.addEpisodePin({
      episodeId: episode.id,
      timestampSeconds: sec,
      timestampDisplay: formatSeconds(sec),
      content: pinContent.trim(),
      type: pinType
    });

    setPinContent('');
    setIsPinningOpen(false);
    setPinFeedback(`📌 已在 ${newPin.timestampDisplay} 处成功打钉！`);
    setTimeout(() => setPinFeedback(null), 2000);
    loadPins();
  };

  const handleVotePin = (pinId: string, direction: 'up' | 'down') => {
    const res = api.voteEpisodePin(pinId, direction);
    setPins(res.pins.filter(p => p.episodeId === episode.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              SEASON {episode.seasonId} · EPISODE {episode.episodeNumber}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-editorial-mincho line-clamp-1">
              {episode.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-300" />
              <span>本集修订与讨论</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Video Player Simulation Frame with Interactive Pin Timeline */}
          <div className="rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl border border-slate-800 relative group">
            {/* Visual Screen with Poster */}
            <div className="aspect-[16/9] sm:aspect-[21/9] relative overflow-hidden flex items-center justify-center">
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-full h-full object-cover opacity-60 filter brightness-90 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Center Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-10 w-16 h-16 rounded-full bg-sky-500/90 text-white flex items-center justify-center hover:bg-sky-400 hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>

              {/* Current Time Stamp Floating Tag */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-mono font-bold text-sky-400 border border-white/10 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatSeconds(currentSeconds)} / 24:00</span>
              </div>
            </div>

            {/* Video Timeline & Pins Controls */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-3">
              {/* Interactive Timeline Bar */}
              <div className="relative pt-2">
                {/* Visual Pins on Timeline */}
                <div className="relative w-full h-3 flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={totalDurationSeconds}
                    value={currentSeconds}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400 relative z-20"
                  />

                  {/* Pin Markers */}
                  {pins.map((pin) => {
                    const percent = (pin.timestampSeconds / totalDurationSeconds) * 100;
                    return (
                      <button
                        key={pin.id}
                        onClick={() => handleJumpToTimestamp(pin.timestampSeconds)}
                        style={{ left: `${percent}%` }}
                        title={`${pin.timestampDisplay} · ${pin.userName}的钉子`}
                        className="absolute -top-1.5 -translate-x-1/2 z-30 p-0.5 rounded-full bg-amber-400 hover:bg-amber-300 hover:scale-125 transition-all shadow-md group/pin"
                      >
                        <MapPin className="w-3 h-3 text-slate-950 fill-amber-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Playback & Pin Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? '暂停' : '播放'}</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400">
                    当前打钉节点: <span className="text-sky-400 font-bold">{formatSeconds(currentSeconds)}</span>
                  </span>
                </div>

                {/* Primary Button: 在固定时长打钉子写看法 */}
                <button
                  onClick={() => {
                    setCustomTimestampText(formatSeconds(currentSeconds));
                    setIsPinningOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>在 {formatSeconds(currentSeconds)} 打钉写看法</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Toast */}
          <AnimatePresence>
            {pinFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pinFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pin Creator Form Drawer/Collapse */}
          <AnimatePresence>
            {isPinningOpen && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreatePin}
                className="p-5 rounded-3xl bg-sky-50/70 border border-sky-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-sky-500 text-white">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      在视频固定时长打钉写看法
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPinningOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">
                      打钉时间点 (分:秒)
                    </label>
                    <input
                      type="text"
                      value={customTimestampText}
                      onChange={(e) => setCustomTimestampText(e.target.value)}
                      placeholder="如 03:25"
                      className="w-full p-2 rounded-xl bg-white border border-sky-200 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">
                      钉子类型
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'insight', label: '💭 个人看法感悟' },
                        { id: 'lore', label: '🔍 剧情细节考据' },
                        { id: 'proposal', label: '📝 剧情理解提议' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPinType(t.id as typeof pinType)}
                          className={`p-2 rounded-xl border text-[11px] font-medium transition-all ${
                            pinType === t.id
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  value={pinContent}
                  onChange={(e) => setPinContent(e.target.value)}
                  placeholder={`写下在 ${customTimestampText} 处关于此画面、台词语气、心境变化的独到看法...`}
                  rows={2}
                  className="w-full p-3 rounded-2xl bg-white border border-sky-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPinningOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!pinContent.trim()}
                    className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>固定钉子并发布</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 2. Grid: Left Episode Lore Synopsis + Right Video Timeline Pins */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Synopsis & Scene Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-editorial-mincho">
                    分集故事与真物轨迹
                  </span>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>申请修改剧情描述</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light font-editorial-mincho">
                  {episode.synopsis}
                </p>

                <div className="pt-2 border-t border-slate-200/60 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono uppercase block">
                      CHARACTERS INVOLVED
                    </span>
                    <span className="font-medium text-slate-800">
                      {episode.charactersInvolved.join(' · ')}
                    </span>
                  </div>

                  {episode.keyEvents && episode.keyEvents.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-[10px] font-mono uppercase block">
                        KEY HIGHLIGHTS
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {episode.keyEvents.map((evt, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[10px] font-medium"
                          >
                            {evt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Timestamp Pins List (大家打钉子的看法) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold text-slate-900 font-editorial-mincho">
                    全片时间钉看法与考据 ({pins.length})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  点击时间戳直达该秒数
                </span>
              </div>

              {pins.length === 0 ? (
                <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-400 text-xs">
                  暂无钉子，快点击上方「在固定时长打钉写看法」成为第一个！
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {pins.map((pin) => (
                    <div
                      key={pin.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleJumpToTimestamp(pin.timestampSeconds)}
                            className="px-2 py-0.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                          >
                            <Clock className="w-3 h-3 text-sky-600" />
                            <span>{pin.timestampDisplay}</span>
                          </button>

                          <img
                            src={pin.userAvatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            {pin.userName}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {pin.userRole === 'ROLE_DEVELOPER' ? '超管' : pin.userRole === 'ROLE_CONTENT_ADMIN' ? '管理员' : '成员'}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {pin.createdAt}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-light pl-1">
                        {pin.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          pin.type === 'lore'
                            ? 'bg-amber-100 text-amber-800'
                            : pin.type === 'proposal'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-sky-50 text-sky-700'
                        }`}>
                          {pin.type === 'lore' ? '考据细节' : pin.type === 'proposal' ? '理解提议' : '心得看法'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVotePin(pin.id, 'up')}
                            className="flex items-center gap-1 text-slate-500 hover:text-sky-600 px-1.5 py-0.5 rounded hover:bg-slate-100"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span className="font-mono text-[10px]">{pin.upvotes}</span>
                          </button>
                          <button
                            onClick={() => handleVotePin(pin.id, 'down')}
                            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 px-1.5 py-0.5 rounded hover:bg-slate-100"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span className="font-mono text-[10px]">{pin.downvotes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </motion.div>

      {/* Episode Item Discussion & Revision Proposal Drawer */}
      <ItemDiscussionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        targetId={episode.id}
        targetType="episode"
        targetTitle={`第${episode.episodeNumber}话 · ${episode.title}`}
        currentContent={episode.synopsis}
        currentUser={currentUser}
        onItemUpdated={(field, newValue) => {
          if (field === 'title') {
            onUpdateEpisode?.({ ...episode, title: newValue });
          } else {
            onUpdateEpisode?.({ ...episode, synopsis: newValue });
          }
        }}
      />
    </div>
  );
};
