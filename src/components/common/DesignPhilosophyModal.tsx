import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Layers, Compass, Eye, Sparkles, CheckCircle, Code2, 
  Palette, ShieldAlert, Cpu, Download, Copy, Printer, Check,
  FileText, Sparkle, ExternalLink
} from 'lucide-react';

interface DesignPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignPhilosophyModal: React.FC<DesignPhilosophyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'inspire' | 'deconstruct' | 'rebuild' | 'defend' | 'export'>('inspire');
  const [copied, setCopied] = useState<boolean>(false);

  const tabs = [
    { id: 'inspire', label: '1. 精准定向灵感', icon: Eye, source: 'Awwwards / Mobbin / Product Hunt' },
    { id: 'deconstruct', label: '2. 深度解构分析', icon: Layers, source: 'Figma 网格 / 字体级 / 微交互目的' },
    { id: 'rebuild', label: '3. 场景创新重构', icon: Sparkles, source: 'Apple Liquid Glass / 音画联觉 / 5步To签' },
    { id: 'defend', label: '4. 原创壁垒与验证', icon: ShieldAlert, source: '防同质化 / 动效曲线 / 解决真实痛点' },
    { id: 'export', label: '5. 导出设计方案与规范', icon: Download, source: 'Markdown / 文档规范 / 一键下载与复制' }
  ];

  const fullDesignSpecMarkdown = `# 雪之下雪乃 · 个人生活空间与数字档案馆
## 顶级 UI 与产品架构设计方案及规范文档 (Design System & Specification)
**版本**: v3.0 Apple Liquid Glass, Wobble Physics & Focus-Dimming Edition  
**设计理念核心**: 「解构 - 提炼 - 重构」 · 拒绝盲目照搬，以场景创新铸造业务壁垒  
**设计基调**: 清冷 (Cold Frost) · 纯粹 (Pure Truth) · 治愈 (Elegance & Warmth) · 物理 Q 弹 (Micro-Spring & Focus)

---

### 一、 核心设计愿景 (Design Philosophy & Mindshare)
1. **去二次元低幼化**：打破传统动漫站点高饱和粉蓝与花哨贴纸的杂乱感，汲取《春物》中雪乃「清冷、内敛、渴求真物」的文学特质。
2. **Apple 级超透液态玻璃 (Liquid Glass & Rim Light)**：将光线折射、双层高光镜面边缘（Specular Insets）、34px 超广域高斯模糊与微弱雪晶动力学（Micro-particle Physics）融入界面，营造宛如千叶寒冬初雪消融时的冰晶剔透质感。
3. **真实业务闭环**：不仅停留在静态展示，而是结合角色扮演圈真实痛点，建立 5 步手写 To 签工坊、早见沙织 Web Audio 台词波形跳动、全键盘轻量灯箱交互（Arrow Keys & Esc）、Coser 申请与后台审核闭环。

---

### 二、 苹果级超透液态玻璃系统规范 (Apple-Grade Liquid Glass Tokens)

| 规范属性 | 参数值 | 设计原理解构 |
| :--- | :--- | :--- |
| **冷雾蓝灰基底** | \`#EEF2F6 + radial-gradient(186, 230, 253, 0.45)\` | 告别纯平高光塑料白，赋予页面深邃冷色温底蕴，突显玻璃折射与磨砂厚度 |
| **背景多层渐变** | \`linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.58) 100%)\` | 模拟真实玻璃在倾斜自然光照下的渐变通透度，增强通透层次与折射率 |
| **超广域高斯模糊** | \`backdrop-filter: blur(34px) saturate(220%) contrast(106%)\` | 提高色彩饱和度与微对比，使模糊透出的底层雪花粒子呈现水晶般温润折射 |
| **双层顶边镜面反光** | \`box-shadow: inset 0 1.5px 1.5px 0 #FFF, inset 0 -1.5px 1.5px 0 rgba(186,230,253,0.4)\` | 模拟 Apple visionOS / macOS 玻璃顶部的物理棱镜切角受光面与底部微漫反射 |
| **极细发丝边缘** | \`border: 1px solid rgba(255, 255, 255, 0.95)\` 配合 160deg 微光裁切 | 形成 0.5px 感官的锋利边缘，消除毛边 |
| **弥散环境深阴影** | \`0 20px 48px -12px rgba(15, 23, 42, 0.1), 0 6px 20px -2px rgba(14, 165, 233, 0.08)\` | 运用微弱冰蓝色替代死黑色阴影，产生悬浮空气感 |
| **环形光谱边缘光 (Rim Light)** | \`.rim-light-card::before\` (1.5px 渐变边框光 + 扫光) | 卡片悬停时边缘点亮 135deg 冰蓝与纯白反射光带，视线焦点清晰 |

---

### 三、 空间网格与排版律动 (Typographic Rhythm & Bento Grid)
1. **8px 律动基准**：间距（Padding / Margin）严格遵循 8px、16px、24px、32px、48px 阶梯数列。
2. **双轨字体搭配**：
   - **大标题 / 经典台词 / 典藏铭牌**：\`Shippori Mincho\` (日本精选明朝体) + \`Cinzel\` (人文典雅)，赋予实体精装书与雪乃高岭之花的清冽气质。
   - **正文 / 数据度量 / 交互标签**：\`Plus Jakarta Sans\` (现代无衬线) + 等宽字体 \`font-mono\`，保证高可读性与现代科技感。
3. **响应式 3-Zone Top Bar 与 Floating Dock**：
   - 顶部导航栏划分为：[标志区] - [弹簧胶囊滑块区] - [操作与部员头像区]；
   - 移动端配备贴合 iOS safe-area 的悬浮 Dock 栏，单手大拇指易达性达 100%。

---

### 四、 动效物理学规范 (Apple Wobble Physics, Focus-Dimming & Micro-interactions)
1. **Q 弹晃动微悬浮物理系统 (Wobble Floating Animation)**：
   - 全站核心卡片悬停时触发微晃动悬浮物理动画：
     \`whileHover: { y: -8, scale: 1.025, rotateZ: [-0.3, 0.4, -0.2, 0] }\`
     \`transition: { type: 'spring', stiffness: 320~380, damping: 18 }\`
   - 模拟真实物理世界的微惯性晃动，在触碰时兼具果冻般的生动回弹与克制的高级感。
2. **同屏焦点暗区引导机制 (Focus-Dimming Group)**：
   - 采用 CSS \`.focus-dim-group:has(.focus-card-item:hover) .focus-card-item:not(:hover)\`：
   - 当用户视线与鼠标悬停在特定卡片时，同组非焦点卡片轻度虚化淡退（\`opacity: 0.65, blur(0.6px), scale(0.985)\`），当前焦点卡片瞬间凸显，大幅强化视觉层级与阅读专注度。
3. **全键盘无障碍沉浸灯箱 (Keyboard Accessible Lightbox)**：
   - \`ArrowRight\`：平滑切换至下一张画作 / Coser 成片；
   - \`ArrowLeft\`：平滑切换至上一张画作；
   - \`Escape\`：安全关闭灯箱，支持被动事件优化与弹层防误触。
4. **舒缓页面流体切换 (Gentle Page Transition)**：
   - 页面切换由过急的 250ms 优化为 550ms 深度流体过渡（\`opacity: 0 -> 1, y: 12 -> 0, blur(4px) -> blur(0px)\`），带来冬雪融化般的从容观感。

---

### 五、 核心业务重构与场景落地
1. **Coser 5 步专属 To 签创作工坊**：
   - 拒绝单调表单，打造成片选定、受签 CN 录入、名言自选、图片真实坐标交互落款与墨色调配的沉浸闭环。
2. **早见沙织台词原声 & Web Audio 528Hz 和弦合成**：
   - 整合高保真原声音轨，并在无网络音频时自动降级启动 Web Audio 528Hz 治愈和弦，辅以三段式动态波形。
3. **经历编年史与服饰档案库**：
   - 结构化收录全三季剧集脉络、总武高校服、祭典浴衣、日常围裙等高光场景与详细释义。

---
*本文档由雪之下雪乃数字档案馆系统自动生成 · 遵循 MIT 开放设计协议*
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(fullDesignSpecMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([fullDesignSpecMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'yukino-archive-design-specification.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-[24px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col apple-spring-glass rounded-3xl shadow-2xl border border-white/95 overflow-hidden"
          >
            {/* Apple-style macOS Traffic Light Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 apple-window-bar">
          <div className="flex items-center gap-3">
            {/* Window Traffic Lights */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30 inline-block shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30 inline-block shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30 inline-block shadow-inner" />
            </div>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-sky-600 font-semibold tracking-wider">
                  DESIGN DECONSTRUCTION & RECONSTRUCTION
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-50 text-sky-700 font-medium border border-sky-100">
                  Apple Liquid Glass v2.4
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-editorial-mincho">
                顶级 UI 与产品思维：「解构 - 提炼 - 重构」完整方案与系统规范
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              title="复制设计方案为 Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copied ? '已复制' : '复制规范'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 py-2.5 border-b border-slate-100/80 bg-slate-50/50 flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                  isActive ? 'text-slate-900 shadow-sm bg-white border border-slate-200/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'inspire' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                <Eye className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 font-editorial-mincho">
                    精准找灵感：定向分析优质来源，绝非盲目堆砌
                  </h4>
                  <p className="text-xs text-slate-600 font-light leading-normal">
                    借鉴顶级界面的首要步骤是明确「它解决了什么具体问题」。我们对 Awwwards、Apple Human Interface、Figma 社区与文学出版物进行了针对性汲取。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                  <div className="text-[10px] font-mono text-sky-600 font-semibold uppercase">DESIGN / 视觉层级</div>
                  <h5 className="font-bold text-slate-800 text-xs">Apple & Linear 极简排版</h5>
                  <p className="text-xs text-slate-500 font-light">
                    参考 Apple 官网的「微透光液态玻璃」与 Linear 的「3-Zone Top Bar」结构，取消廉价渐变与花哨边框，建立主副视觉锚点。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                  <div className="text-[10px] font-mono text-sky-600 font-semibold uppercase">INTERACTION / 动效服务体验</div>
                  <h5 className="font-bold text-slate-800 text-xs">Awwwards 物理微粒子与浮动反馈</h5>
                  <p className="text-xs text-slate-500 font-light">
                    融入雪花粒子动力学系统与弹簧滑块（Spring Capsule），交互时长严格控制在 250ms 以内，服务于氛围沉浸而非炫技。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                  <div className="text-[10px] font-mono text-sky-600 font-semibold uppercase">PRODUCT / 情感化流程</div>
                  <h5 className="font-bold text-slate-800 text-xs">Airbnb 情感连接 & 实体出版物</h5>
                  <p className="text-xs text-slate-500 font-light">
                    引入日式精装书（Editorial Mincho）排版节奏，将传统枯燥的动漫百科升维为典雅的个人生活空间与档案馆。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deconstruct' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 font-editorial-mincho">
                    深度解构：从“好看”到“为什么好”的工程与设计度量
                  </h4>
                  <p className="text-xs text-slate-600 font-light leading-normal">
                    剥离表象，探寻网格、色彩、动效曲线与用户心理模型。
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    01
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-0.5">网格与对齐 (Grid & Alignment)</h5>
                    <p className="text-xs text-slate-500 font-light">
                      采用 Tailwind 8px 基准间距与响应式 12 栏 Bento 网格，各板块保持呼吸留白，视觉重心聚焦于核心人物档案与高光瞬间。
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    02
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-0.5">色彩分层与对比 (Chromatic Hierarchy)</h5>
                    <p className="text-xs text-slate-500 font-light">
                      以极寒雪白（#F8FAFC）为画布底色，冰蓝（Sky-500 / #0EA5E9）为交互传达色，石墨色（#0F172A）作为正文，避免高饱和色彩引起的视觉疲劳。
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    03
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-0.5">减少决策阻力与空态引导 (Frictionless UX)</h5>
                    <p className="text-xs text-slate-500 font-light">
                      在搜索弹窗预设快捷键（`/`）、在聊天室提供「真物 / 红茶 / 潘先生」一键交互灵感词，消除面对空白输入框时的无措感。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rebuild' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 font-editorial-mincho">
                    重构应用：苹果级超透液态玻璃架构演进 (Apple Liquid Glass Architecture)
                  </h4>
                  <p className="text-xs text-slate-600 font-light leading-normal">
                    拒绝直接照搬代码，将灵感抽象为契合「雪之下雪乃」性格特质的功能形态与视觉物理学。
                  </p>
                </div>
              </div>

              {/* Glass Layer Inspector Card */}
              <div className="p-5 rounded-2xl apple-glass-floating border border-white/95 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-600 font-semibold uppercase">
                    GLASS SPECULAR DECONSTRUCTION · 实时物理光效
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    BLUR: 34PX · SATURATE: 220% · CONTRAST: 106%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/60 border border-white/90 text-center">
                    <div className="text-[10px] font-mono text-slate-500">顶层双向折射切角</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">inset 0 1.5px 1.5px #FFF</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 border border-white/90 text-center">
                    <div className="text-[10px] font-mono text-slate-500">冷雾基底漫反射</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">#EEF2F6 (Blue Frost)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 border border-white/90 text-center">
                    <div className="text-[10px] font-mono text-slate-500">光谱边缘微光</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">135deg Rim Light</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 border border-white/90 text-center">
                    <div className="text-[10px] font-mono text-slate-500">Q弹微晃动物理</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">Spring + Wobble 380</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>5 步 To 签创作工坊 (Coser Studio)</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light">
                    将传统生硬的表单提交重构为具备「图片选定 → 受签者名 → 专属名言题辞 → 坐标落款定位 → 墨水调色」的沉浸工坊，提供真实手写代入感。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Web Audio 原声合声展台</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light">
                    融合早见沙织台词原声与基于 Web Audio API 动态合成的温暖和弦与动态波形（528Hz），形成视听合一的空灵体验。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>日系出版物式日记与经历编年史</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light">
                    放弃传统后台博客格式，采用明朝体诗意排版，空态文案定制为「今天的雪似乎格外安静」，处处呼应人物内心独白。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>移动端安全区悬浮坞 (Floating Dock)</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light">
                    针对单手大拇指热区与 iOS Safe-area 进行触感微动效适配，在小屏幕上也能保持通透无压的游览质感。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'defend' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 font-editorial-mincho">
                    避坑关键：建立原创壁垒与防「过度动效」
                  </h4>
                  <p className="text-xs text-slate-600 font-light leading-normal">
                    不抄袭视觉表皮，而是形成「观察 - 分析 - 结合自身业务重塑」的稳定工程习惯。
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-100">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">
                    动效克制准则（No Motion for Motion's Sake）
                  </h5>
                  <p className="text-xs text-slate-500 font-light">
                    动效只用于三处：1. 空间位移（Spring 指示器）；2. 物理自然属性（雪花飘落）；3. 状态转化确认（To 签完成与点赞心跳）。禁止无意义的旋转与遮挡视线的过渡。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-100">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">
                    原创业务闭环：Coser 认证与审批流
                  </h5>
                  <p className="text-xs text-slate-500 font-light">
                    不仅停留在静态展示，而是结合角色扮演圈真实痛点，建立从用户申请 Coser、工单状态流转、到后台管理员审核颁发徽章的完整业务壁垒。
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-100">
                  <h5 className="font-bold text-slate-900 text-xs mb-1">
                    日常工具与反思闭环
                  </h5>
                  <p className="text-xs text-slate-500 font-light">
                    把 Eagle、Figma 组件库化与 React 状态机结合，每一次灵感借鉴都先问「为什么原作者这样排布」，再问「它能否为春物与雪乃的沉浸叙事带来不可替代的价值」。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-editorial-mincho">
                      导出全套设计方案与系统规范 (Specification Export)
                    </h4>
                    <p className="text-xs text-slate-500 font-light">
                      包含完整的 Apple Liquid Glass 设计令牌、网格规范、动效曲线、色彩矩阵及业务重构方案。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200/90 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? '已复制成功' : '复制全文 Markdown'}</span>
                  </button>

                  <button
                    onClick={handleDownloadMarkdown}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载 .md 文档</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-sm transition-all active:scale-95"
                    title="打印或保存为 PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specification Interactive Document Reader */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-5 font-mono text-xs overflow-x-auto max-h-[50vh] shadow-inner space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>yukino-archive-design-specification.md</span>
                  <span>FORMAT: GITHUB FLAVORED MARKDOWN</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed font-mono text-[11px] text-slate-300">
                  {fullDesignSpecMarkdown}
                </pre>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100/90 bg-white/70 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-400">
              APPLE JELLY SPRING · STIFFNESS: 200, DAMPING: 25 · BLUR: 24PX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('export')}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出规范文档</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium active:scale-95 transition-all text-xs"
            >
              完成
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
