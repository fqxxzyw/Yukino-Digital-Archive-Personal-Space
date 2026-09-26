import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Code2, Server, Database, Rocket, Copy, Check, Download, 
  Terminal, ShieldCheck, Cpu, Layers, ExternalLink, FileCode, Sparkles
} from 'lucide-react';

interface DevDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDocsModal: React.FC<DevDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'frontend' | 'backend' | 'database' | 'deploy' | 'full'>('overview');
  const [copied, setCopied] = useState<boolean>(false);

  const tabs = [
    { id: 'overview', label: '1. 总体架构拓扑', icon: Layers, desc: '分层设计、微服务与高可用' },
    { id: 'frontend', label: '2. 前端架构与动效', icon: Code2, desc: 'React 18 + Tailwind v4 + Motion' },
    { id: 'backend', label: '3. 后端服务与API', icon: Server, desc: 'RESTful 契约、鉴权与 WebSocket' },
    { id: 'database', label: '4. 数据库设计', icon: Database, desc: 'PostgreSQL DDL 与 Redis 缓存' },
    { id: 'deploy', label: '5. 商业化生产部署', icon: Rocket, desc: 'Docker 瘦身、Nginx与云原生' },
    { id: 'full', label: '6. 完整 Markdown 导出', icon: FileCode, desc: '一键复制与本地文件下载' }
  ];

  const fullMarkdown = `# 雪之下雪乃 · 个人生活空间与数字档案馆
# 全栈工程开发文档与商业级生产部署规范 (Full-Stack Architecture & Commercial Deployment Guide)

**版本**: v3.5 Commercial Release Edition  
**技术栈**: React 18 + TypeScript + Vite + Tailwind CSS v4 + Motion + Node.js / Go + PostgreSQL + Redis + Docker + Nginx  

---

## 一、系统总体架构与拓扑
- 客户端终端: 桌面端、移动端沉浸式 Dock 导航、PWA 离线应用。
- 边缘加速层: CDN 静态资源加速、DDoS 智能防御与全局 SSL 证书。
- 反向代理层: Nginx 动静分离、Gzip 压缩、SPA 路由转发、WebSocket 长连接代理。
- 应用服务集群: 无状态 Node.js / Go 实例，支持 Kubernetes / Cloud Run 弹性扩缩容。
- 图像与合成微服务: 基于 Sharp / Canvas 的 5 步 To 签数字压感落款印章合成。
- 持久层与缓存: PostgreSQL 16 读写分离集群 + Redis 缓存与令牌桶限流。

---

## 二、前端工程架构与特色系统
1. Apple Liquid Glass 物理设计系统: 超透冷蓝雾面玻璃底座 + 34px 超广域高斯模糊 + 双层高光镜面棱镜反光。
2. Q 弹晃动微悬浮物理系统 (Wobble Physics): whileHover 阻尼弹簧运动，消除机械感。
3. 同屏暗区视线聚焦系统 (Focus-Dimming): 基于 CSS :has() 纯原生选择器，非焦点卡片轻度退避。
4. 日记与 To 签灵感联动系统: 自动推荐今日申请的 To 签定制，一键引用为日记随想并设置专属封面。
5. 申请 To 签一键同步发布动态: 提交时可选同步至侍奉会社区动态，自动 @Coser 并打上相关话题标签。

---

## 三、后端服务与标准化 RESTful API
- /api/v1/auth/* (注册、JWT 登录、角色切换)
- /api/v1/tosign/* (5步 To 签定制申请、状态流转、成片交付)
- /api/v1/posts/* (社区动态流、发布、点赞、收藏、@ 提及与标签检索)
- /api/v1/diaries/* (个人手记、生活日记、联动 To 签外键)
- /ws/v1/chat (WebSocket 双工实时聊天室，心跳保活与智能应答)

---

## 四、PostgreSQL DDL 数据库表结构
- users (用户核心表，RBAC: ROLE_USER, ROLE_COSER, ROLE_ADMIN)
- to_sign_requests (To签申请表，记录落款坐标、受签人、题辞、墨水颜色与状态)
- diaries (日记表，支持关联 linked_to_sign_id 与 cover_image)
- posts (动态表，存储 content、images、tags 数组)
- galleries (图库摄影作品，支持 GIN 标签倒排索引)
- post_likes / post_bookmarks (点赞与收藏关联表)

---

## 五、商业级生产部署全流程
1. Dockerfile 多阶段构建: 构建期编译 TypeScript 并生成静态产物，运行时使用 alpine Nginx 镜像瘦身至 20MB。
2. Nginx 配置: Gzip 开启、静态资源 1 年强缓存、SPA try_files 兜底、API 与 WebSocket 反代。
3. 容器编排: docker-compose 一键启动 Web、API、PostgreSQL 与 Redis。
4. 云原生部署: 支持 Google Cloud Run、AWS ECS、腾讯云/阿里云容器服务一键部署与自动弹性伸缩。
5. 安全合规: 域名工信部 ICP 备案、公安网安备案、敏感词过滤安全审核与防盗链限流。`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DEVELOPMENT_FULLSTACK_DEPLOYMENT_GUIDE.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-[28px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl h-[88vh] apple-glass-floating rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/95 flex flex-col relative overflow-hidden"
          >
            {/* Window Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-inner" />
                </div>
                <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-editorial-mincho">
                    <span>雪乃空间 · 全栈工程与商业级生产部署规范</span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                      v3.5 Commercial Release
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans">
                    前端架构 · 后端服务 · PostgreSQL 数据库设计 · Docker 容器化 · 商业生产上线指南
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-sky-600 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制规范' : '复制全文'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">下载 DEVELOPMENT.md</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-slate-100 shrink-0 no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 text-slate-700 space-y-6 font-sans text-xs sm:text-sm leading-relaxed">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                    <h4 className="font-bold text-sky-950 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      系统架构设计核心理念 (High Availability & Scalability)
                    </h4>
                    <p className="text-slate-600 text-xs">
                      本站点不仅是一套高颜值的数字档案馆，更是具备<strong>无状态弹性扩缩容（Stateless Nodes）</strong>、<strong>动静分离与多级缓存（CDN + Nginx + Redis）</strong>、<strong>微服务异步合成</strong>的商业级工业应用标准体系。
                    </p>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                    <pre>{`[ 客户端终端 (Web / PWA / Mobile Dock) ]
       │ HTTPS / WSS 长连接
       ▼
[ 边缘网络 & CDN 加速层 (Cloudflare / 腾讯云 CDN) ]
       │ 智能 DNS 解析 + DDoS 高防
       ▼
[ 网关与负载均衡 (Nginx 反向代理集群) ]
  ├── / (静态 HTML/JS/CSS 强缓存)
  ├── /api/* (动态 API 转发至后端集群)
  └── /socket.io/* (实时长连接代理)
       │
  ┌────┴────────────────────────┐
  ▼                             ▼
[ 无状态 API 集群 (Node / Go) ]  [ 异步落款合成引擎 (Sharp / Skia) ]
  │                             │
  └──────────────┬──────────────┘
                 ▼
[ 持久化与缓存 (PostgreSQL 16 + Redis + 云对象存储 OSS/S3) ]`}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/70 space-y-1.5">
                      <span className="text-[11px] font-mono text-sky-600 font-semibold uppercase">LAYER 01</span>
                      <h5 className="font-bold text-slate-900 text-xs">边缘与客户端</h5>
                      <p className="text-slate-500 text-[11px]">
                        基于 Vite 现代静态构建，集成 Service Worker 离线 PWA 支持，全站静态资源配合 CDN 毫秒级分发。
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/70 space-y-1.5">
                      <span className="text-[11px] font-mono text-sky-600 font-semibold uppercase">LAYER 02</span>
                      <h5 className="font-bold text-slate-900 text-xs">无状态应用层</h5>
                      <p className="text-slate-500 text-[11px]">
                        Node.js / Express 或 Go Gin RESTful 服务，基于 JWT 实现无状态鉴权，可随时弹性横向伸缩至百台实例。
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/70 space-y-1.5">
                      <span className="text-[11px] font-mono text-sky-600 font-semibold uppercase">LAYER 03</span>
                      <h5 className="font-bold text-slate-900 text-xs">数据与存储层</h5>
                      <p className="text-slate-500 text-[11px]">
                        PostgreSQL 强一致性事务保障 To 签交易与日记数据，Redis 支撑高频访问缓存与实时聊天广播。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Frontend */}
              {activeTab === 'frontend' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">前端架构细节与核心物理子系统</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">1. Apple Liquid Glass (超透液态玻璃规范)</span>
                        <span className="text-[10px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Tailwind v4 Token</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        采用 <code>backdrop-filter: blur(34px) saturate(220%) contrast(106%)</code>，顶边搭配 <code>inset 0 1.5px 1.5px 0 #FFF</code> 模拟真实自然光照射下的物理高光棱镜折射面。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">2. Q 弹晃动微悬浮物理体系 (Wobble Physics)</span>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Motion Spring</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        卡片悬停时触发微晃动悬浮物理动画：
                        <br />
                        <code>whileHover: &#123; y: -8, scale: 1.025, rotateZ: [-0.3, 0.4, -0.2, 0] &#125;</code>，结合 <code>stiffness: 350, damping: 18</code> 物理弹簧阻尼。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">3. 同屏暗区视线聚焦引导 (Focus-Dimming)</span>
                        <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">CSS :has() 原生驱动</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        无需 JS 遍历状态，基于纯 CSS 现代选择器：<code>.focus-dim-group:has(.focus-card-item:hover) .focus-card-item:not(:hover)</code> 自动使非焦点元素降光至 <code>opacity: 0.65; filter: blur(0.6px); transform: scale(0.985);</code>。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sky-950 text-xs">4. 日记与 To 签灵感智能联动体系</span>
                        <span className="text-[10px] font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded">业务闭环创新</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        在用户打开日记撰写器时，智能识别用户今日申请的 To 签（包含受签人、题辞、摄影封面），提供「一键引用至日记正文」、「设为日记专属封面」与「自动补全标题标签」的交互体验。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sky-950 text-xs">5. To 签一键同步社区动态体系</span>
                        <span className="text-[10px] font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded">自动 @ 与标签聚合</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        在 5 步 To 签提交确认时，勾选「一键同步至动态」，系统会自动提取 Coser 信息并自动进行 <code>@浅羽由乃</code>，并打上 <code>#To签定制 #雪之下雪乃 #侍奉部专属 #真物</code> 标签推送到公共动态流。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Backend */}
              {activeTab === 'backend' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">后端服务架构与接口契约规范</h4>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                    <p className="text-slate-400">// 核心 RESTful API 端点列表</p>
                    <p className="text-emerald-400">POST   /api/v1/auth/login            <span className="text-slate-400">// 用户密码登录，下发 JWT Access/Refresh Token</span></p>
                    <p className="text-emerald-400">POST   /api/v1/tosign/apply          <span className="text-slate-400">// 提交 5 步 To 签申请 (带 syncToFeed)</span></p>
                    <p className="text-sky-400">GET    /api/v1/tosign/mine           <span className="text-slate-400">// 获取当前用户所有 To 签及签署成片</span></p>
                    <p className="text-sky-400">GET    /api/v1/diaries               <span className="text-slate-400">// 获取日记时间轴 (包含 linkedToSign 关系)</span></p>
                    <p className="text-emerald-400">POST   /api/v1/diaries               <span className="text-slate-400">// 发布日记 (支持 coverImage 与 To签关联)</span></p>
                    <p className="text-sky-400">GET    /api/v1/posts                 <span className="text-slate-400">// 社区动态广场 (支持标签倒排索引查询)</span></p>
                    <p className="text-emerald-400">POST   /api/v1/posts                 <span className="text-slate-400">// 发布动态 (支持 @提及与附件)</span></p>
                    <p className="text-amber-400">PUT    /api/v1/admin/tosign/:id      <span className="text-slate-400">// Coser/管理员完成签署或审批</span></p>
                    <p className="text-purple-400">WSS    /ws/v1/chat                   <span className="text-slate-400">// WebSocket 双工实时聊天室</span></p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/70 space-y-1.5">
                      <h5 className="font-bold text-slate-800">JWT 双 Token 鉴权机制</h5>
                      <p className="text-slate-600 text-[11px]">
                        Access Token (15分钟有效期) 用于无状态请求认证；Refresh Token (7天有效期，HTTP-only Cookie 存储) 用于静默续期，杜绝 XSS 凭证窃取。
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/70 space-y-1.5">
                      <h5 className="font-bold text-slate-800">Coser 数字手写水印落款引擎</h5>
                      <p className="text-slate-600 text-[11px]">
                        服务端利用 Sharp / Skia 库，根据坐标 (X%, Y%)、墨水色值及手写压感字体向量图层，将题辞与专属防伪印章无损合成至 4K 原图。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Database */}
              {activeTab === 'database' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">PostgreSQL 关系型数据库生产表结构设计</h4>
                    <span className="text-[10px] font-mono text-sky-600">PostgreSQL 16 / Cloud SQL</span>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-72">
                    <pre>{`-- 核心 To 签申请与落款表
CREATE TABLE to_sign_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gallery_id UUID REFERENCES galleries(id) ON DELETE SET NULL,
    gallery_title VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    requester_cn VARCHAR(64) NOT NULL,
    dedication_text TEXT NOT NULL,
    remarks TEXT,
    position_x NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    position_y NUMERIC(5,2) NOT NULL DEFAULT 80.00,
    ink_color VARCHAR(16) DEFAULT '#0284c7',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    signed_image_url VARCHAR(512),
    author_name VARCHAR(128) DEFAULT '浅羽由乃',
    synced_to_feed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 个人生活日记与手记表 (支持关联 To 签)
CREATE TABLE diaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(512),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weather VARCHAR(64) DEFAULT '晴朗 · 5°C',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 1,
    linked_to_sign_id UUID REFERENCES to_sign_requests(id) ON DELETE SET NULL,
    linked_to_sign_title VARCHAR(255),
    linked_to_sign_dedication TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`}</pre>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>高并发索引优化策略</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      对 <code>tags</code> 数组列建立 <strong>GIN 倒排索引</strong>，对 <code>user_id</code> 和 <code>created_at</code> 建立 <strong>B-Tree 复合索引</strong>，确保千万级动态与日记时间轴在 5ms 内完成分页回表。
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 5: Deploy */}
              {activeTab === 'deploy' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">商业级生产环境上线与部署全流程 (Production Deployment)</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-sky-500" />
                        第 1 步: 镜像构建 (Docker Multi-stage)
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        多阶段构建分离编译依赖与运行环境，最终运行时镜像只保留静态产物与轻量 Nginx 引擎，镜像大小压缩至 <strong>25MB</strong> 以内。
                      </p>
                      <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl font-mono text-[10px]">
                        docker build -t yukino-app:v3.5 .
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Rocket className="w-4 h-4 text-emerald-500" />
                        第 2 步: 一键云原生托管 (Cloud Run / AWS)
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        使用 Google Cloud Run 或 AWS ECS 部署，自带免维护 HTTPS 证书、0~50 实例自动伸缩与跨可用区高可用容灾。
                      </p>
                      <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl font-mono text-[10px]">
                        gcloud run deploy yukino-web --image gcr.io/prj/app:v3.5
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-indigo-500" />
                        第 3 步: 传统 ECS 服务器 Compose 编排
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        使用 <code>docker-compose.production.yml</code> 在一台 2核4G 服务器上同时拉起 Web、Node API、PostgreSQL 16 与 Redis 7。
                      </p>
                      <div className="bg-slate-900 text-slate-300 p-2.5 rounded-xl font-mono text-[10px]">
                        docker compose -f docker-compose.production.yml up -d
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white/80 space-y-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                        第 4 步: 商业合规与安全防线
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        完成域名工信部 ICP 备案与公安备案；配置网易易盾 / 阿里云敏感词过滤 API；开启 Nginx 防刷限流与对象存储防盗链。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Full Markdown */}
              {activeTab === 'full' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>完整开发文档预览（已自动同步存储至项目根目录 <code>DEVELOPMENT.md</code>）：</span>
                    <button
                      onClick={handleCopy}
                      className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? '已复制成功' : '一键复制完整 Markdown'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-y-auto max-h-[380px] border border-slate-800 leading-relaxed">
                    <pre className="whitespace-pre-wrap">{fullMarkdown}</pre>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="font-mono text-[11px]">
                PROJECT ARCHITECTURE: REACT 18 + TS + TAILWIND V4 + POSTGRESQL + DOCKER
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                关闭文档
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
