import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Users, Sparkles, MessageSquare, Coffee, Cat } from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface ChatRoomViewProps {
  messages: ChatMessage[];
  user: User;
  onSendMessage: (content: string) => void;
}

export const ChatRoomView: React.FC<ChatRoomViewProps> = ({
  messages,
  user,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const quickPhrases = [
    '今天侍奉部有红茶喝吗？',
    '追求真物到底需要付出多大代价？',
    '千叶的雪好像又落下来了。',
    '路边发现了一只白猫，长得好像潘先生！'
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
          SERVICE CLUB REALTIME COMMON ROOM
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho mt-1">
          总武高 · 侍奉部特别活动室
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          在线部员交流。在这里可以随意委托或闲聊，雪乃部长偶有审阅回复。
        </p>
      </div>

      {/* Chat Window Container */}
      <div className="rounded-3xl liquid-glass border border-white/90 shadow-lg overflow-hidden flex flex-col h-[560px]">
        
        {/* Chat Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800">
              侍奉部日常交流专线
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              · 4 位部员在线
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px]">红茶待客中</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isSelf = msg.isSelf || msg.userId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.userAvatar}
                  alt={msg.userName}
                  className="w-8 h-8 rounded-full object-cover border border-white shadow-sm shrink-0"
                />

                <div className={`space-y-1 max-w-[78%] ${isSelf ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>{msg.userName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-light leading-relaxed inline-block ${
                      isSelf
                        ? 'bg-sky-500 text-white shadow-sm rounded-tr-sm'
                        : 'bg-white/90 text-slate-800 border border-slate-200/60 shadow-sm rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 font-medium shrink-0">快捷提问:</span>
          {quickPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSendMessage(phrase);
              }}
              className="text-[11px] text-slate-600 hover:text-sky-600 px-2.5 py-1 rounded-lg bg-white/70 border border-slate-200/50 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white/60 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="写下对侍奉部的留言或委托 (输入“真物”、“红茶”有惊喜)..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 font-light"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">发送</span>
          </button>
        </form>

      </div>
    </div>
  );
};
