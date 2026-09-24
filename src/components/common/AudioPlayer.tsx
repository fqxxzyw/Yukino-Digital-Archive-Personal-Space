import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Music } from 'lucide-react';
import { VoiceLine } from '../../types';

interface AudioPlayerProps {
  tracks: VoiceLine[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onClose
}) => {
  const currentTrack = tracks[currentTrackIndex] || tracks[0];
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synthesize soft ambient bell/chime tones on play state
  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Warm harmonic frequency around 528Hz or 432Hz
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
      } catch {
        // audio context fallback
      }
    }
  }, [isPlaying, currentTrackIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 25, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 apple-spring-glass rounded-2xl p-4 shadow-[0_20px_50px_-10px_rgba(2,132,199,0.22)] border border-white/95"
    >
      {/* Top Window Bar Indicator */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1.5">
            VOICE PLAYER
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          aria-label="Close player"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-300 p-0.5 shadow-sm shrink-0 flex items-center justify-center text-white">
            {isPlaying ? (
              <div className="flex items-center gap-0.5 h-5">
                <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-5" />
                <span className="w-1 bg-white rounded-full animate-bounce h-4" />
              </div>
            ) : (
              <Music className="w-5 h-5 text-white/90" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-sky-600 block">
              早见沙织 · 原声独白
            </span>
            <h4 className="text-xs font-semibold text-slate-800 truncate">
              {currentTrack?.title}
            </h4>
            <p className="text-[11px] text-slate-500 truncate font-editorial-mincho">
              {currentTrack?.japaneseText}
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono">
          {isPlaying ? '0:04' : '0:00'} / {currentTrack?.duration || '0:14'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors active:scale-95"
            aria-label="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-sm shadow-sky-200 transition-all active:scale-90"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors active:scale-95"
            aria-label="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
