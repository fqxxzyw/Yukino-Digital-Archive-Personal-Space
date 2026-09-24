import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Check, ArrowRight } from 'lucide-react';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    if (!email.includes('@')) return;
    setCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: email.split('@')[0],
      nickname: nickname || email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}&backgroundColor=e0f2fe`,
      bio: '新加入总武高侍奉部的记录者。',
      role: 'ROLE_USER',
      email,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[24px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md apple-glass-floating rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/95 space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1.5">
              ACCOUNT GATE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-sky-600 uppercase font-semibold">
            SOBU HIGH SERVICE CLUB AUTH
          </span>
          <h3 className="text-xl font-bold text-slate-900 font-editorial-mincho">
            {isRegister ? '加入侍奉部 · 注册账号' : '欢迎归来 · 部员登录'}
          </h3>
          <p className="text-xs text-slate-500 font-light">
            支持邮箱验证码免密/密码登录，数据安全同步。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">部员昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：千叶观察员"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">电子邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your_email@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">邮箱验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="6位数字验证码"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
                <button
                  type="button"
                  disabled={countdown > 0 || !email.includes('@')}
                  onClick={handleSendCode}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium disabled:opacity-50 whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s 后重新发送` : '获取验证码'}
                </button>
              </div>
              {codeSent && (
                <p className="text-[10px] text-emerald-600 mt-1">
                  验证码已模拟发送至您的邮箱，可填入任意6位数字测试。
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all mt-2"
          >
            {isRegister ? '确认注册并进入' : '立即登录'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-sky-600 hover:underline"
          >
            {isRegister ? '已有账号？点此直接登录' : '没有账号？点击注册新账号'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
