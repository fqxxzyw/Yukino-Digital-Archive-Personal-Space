import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, X, Users, PenTool, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { ToSignRequest, CoserCertification } from '../../types';

interface AdminViewProps {
  toSignRequests: ToSignRequest[];
  onUpdateToSignStatus: (id: string, status: ToSignRequest['status']) => void;
  coserCerts: CoserCertification[];
  onReviewCoserCert: (id: string, status: 'approved' | 'rejected') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  toSignRequests,
  onUpdateToSignStatus,
  coserCerts,
  onReviewCoserCert
}) => {
  const [activeTab, setActiveTab] = useState<'tosign' | 'coser' | 'stats'>('tosign');

  const pendingToSignCount = toSignRequests.filter(r => r.status === 'pending').length;
  const pendingCoserCount = coserCerts.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* 1. Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-600 font-semibold uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>ADMINISTRATIVE WORKBENCH · ROLE_ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial-mincho mt-1">
            雪乃档案馆 · 后台管理中心
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            审批 Coser 资格认证、监管粉丝手写 To 签递交状态与数据库模型健康度。
          </p>
        </div>

        {/* Tab switcher */}
        <div className="p-1 rounded-2xl liquid-glass border border-white/90 flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('tosign')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'tosign' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>To 签工单 ({pendingToSignCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('coser')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'coser' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Coser 资质审批 ({pendingCoserCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl liquid-glass border border-white/80">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">TOTAL TO-SIGN</span>
          <span className="text-xl font-bold text-slate-900 font-mono">{toSignRequests.length}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-white/80">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">PENDING TO-SIGN</span>
          <span className="text-xl font-bold text-amber-600 font-mono">{pendingToSignCount}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-white/80">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">COSER APPLICANTS</span>
          <span className="text-xl font-bold text-slate-900 font-mono">{coserCerts.length}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-white/80">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">SYSTEM HEALTH</span>
          <span className="text-xl font-bold text-emerald-600 font-mono">100% OK</span>
        </div>
      </div>

      {/* 3. To-Sign Table */}
      {activeTab === 'tosign' && (
        <div className="rounded-3xl liquid-glass border border-white/90 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-editorial-mincho">
              To 签任务工单流
            </h3>
            <span className="text-xs text-slate-400 font-mono">按递交时间排序</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {toSignRequests.map((req) => (
              <div key={req.id} className="p-5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={req.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {req.galleryTitle}
                    </div>
                    <div className="text-slate-500 font-editorial-mincho truncate">
                      TO {req.requesterCN}: {req.dedicationText}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      坐标: ({req.positionX}%, {req.positionY}%) · {req.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status}
                  </span>

                  {req.status === 'pending' && (
                    <button
                      onClick={() => onUpdateToSignStatus(req.id, 'approved')}
                      className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>完成签署</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Coser Certification Approvals */}
      {activeTab === 'coser' && (
        <div className="rounded-3xl liquid-glass border border-white/90 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-editorial-mincho">
              Coser 申请审批名单
            </h3>
            <span className="text-xs text-slate-400 font-mono">核验作品链接真实性</span>
          </div>

          <div className="divide-y divide-slate-100">
            {coserCerts.map((cert) => (
              <div key={cert.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{cert.coserCN}</span>
                    <span className="text-slate-400 font-mono">(用户: {cert.userName})</span>
                  </div>
                  <p className="text-slate-600 font-light max-w-lg">{cert.bio}</p>
                  <div className="text-[11px] text-sky-600 font-mono">
                    作品集：{cert.portfolioLinks.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    cert.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cert.status}
                  </span>

                  {cert.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onReviewCoserCert(cert.id, 'approved')}
                        className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>通过认证</span>
                      </button>
                      <button
                        onClick={() => onReviewCoserCert(cert.id, 'rejected')}
                        className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>驳回</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
