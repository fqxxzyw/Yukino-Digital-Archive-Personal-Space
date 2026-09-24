# 雪之下雪乃 · 个人生活空间与数字档案馆
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
| **冷雾蓝灰基底** | `#EEF2F6 + radial-gradient(186, 230, 253, 0.45)` | 告别纯平高光塑料白，赋予页面深邃冷色温底蕴，突显玻璃折射与磨砂厚度 |
| **背景多层渐变** | `linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.58) 100%)` | 模拟真实玻璃在倾斜自然光照下的渐变通透度，增强通透层次与折射率 |
| **超广域高斯模糊** | `backdrop-filter: blur(34px) saturate(220%) contrast(106%)` | 提高色彩饱和度与微对比，使模糊透出的底层雪花粒子呈现水晶般温润折射 |
| **双层顶边镜面反光** | `box-shadow: inset 0 1.5px 1.5px 0 #FFF, inset 0 -1.5px 1.5px 0 rgba(186,230,253,0.4)` | 模拟 Apple visionOS / macOS 玻璃顶部的物理棱镜切角受光面与底部微漫反射 |
| **极细发丝边缘** | `border: 1px solid rgba(255, 255, 255, 0.95)` 配合 160deg 微光裁切 | 形成 0.5px 感官的锋利边缘，消除毛边 |
| **弥散环境深阴影** | `0 20px 48px -12px rgba(15, 23, 42, 0.1), 0 6px 20px -2px rgba(14, 165, 233, 0.08)` | 运用微弱冰蓝色替代死黑色阴影，产生悬浮空气感 |
| **环形光谱边缘光 (Rim Light)** | `.rim-light-card::before` (1.5px 渐变边框光 + 扫光) | 卡片悬停时边缘点亮 135deg 冰蓝与纯白反射光带，视线焦点清晰 |

---

### 三、 空间网格与排版律动 (Typographic Rhythm & Bento Grid)
1. **8px 律动基准**：间距（Padding / Margin）严格遵循 8px、16px、24px、32px、48px 阶梯数列。
2. **双轨字体搭配**：
   - **大标题 / 经典台词 / 典藏铭牌**：`Shippori Mincho` (日本精选明朝体) + `Cinzel` (人文典雅)，赋予实体精装书与雪乃高岭之花的清冽气质。
   - **正文 / 数据度量 / 交互标签**：`Plus Jakarta Sans` (现代无衬线) + 等宽字体 `font-mono`，保证高可读性与现代科技感。
3. **响应式 3-Zone Top Bar 与 Floating Dock**：
   - 顶部导航栏划分为：[标志区] - [弹簧胶囊滑块区] - [操作与部员头像区]；
   - 移动端配备贴合 iOS safe-area 的悬浮 Dock 栏，单手大拇指易达性达 100%。

---

### 四、 动效物理学规范 (Apple Wobble Physics, Focus-Dimming & Micro-interactions)
1. **Q 弹晃动微悬浮物理系统 (Global Wobble Floating Animation)**：
   - **已全站全局无缝落地**：覆盖首页、视觉画廊 (Gallery)、经历编年史与服饰 (Yukino)、人物与动画分季 (Oregairu)、社区动态 (Feed) 与个人档案 (Profile)。
   - 核心交互卡片悬停时触发微晃动悬浮物理动画：
     `whileHover: { y: -8, scale: 1.025, rotateZ: [-0.35, 0.4, -0.2, 0] }`
     `transition: { type: 'spring', stiffness: 350, damping: 18 }`
   - 模拟真实物理世界的微惯性晃动，在触碰时兼具果冻般的生动回弹与克制的高级感。
2. **同屏焦点暗区引导机制 (Global Focus-Dimming Group)**：
   - 采用 CSS `.focus-dim-group:has(.focus-card-item:hover) .focus-card-item:not(:hover)` 全局统一架构：
   - 当用户视线与鼠标悬停在特定卡片时，同组非焦点卡片轻度虚化淡退（`opacity: 0.65, blur(0.6px), scale(0.985)`），当前焦点卡片瞬间凸显，大幅强化视觉层级与阅读专注度。
3. **全键盘无障碍沉浸灯箱 (Keyboard Accessible Lightbox)**：
   - `ArrowRight`：平滑切换至下一张画作 / Coser 成片；
   - `ArrowLeft`：平滑切换至上一张画作；
   - `Escape`：安全关闭灯箱，支持被动事件优化与弹层防误触。
4. **舒缓页面流体切换 (Gentle Page Transition)**：
   - 页面切换由过急的 250ms 优化为 550ms 深度流体过渡（`opacity: 0 -> 1, y: 12 -> 0, blur(4px) -> blur(0px)`），带来冬雪融化般的从容观感。

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
