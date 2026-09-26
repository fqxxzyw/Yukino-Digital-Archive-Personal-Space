# 雪之下雪乃 · 个人生活空间与数字档案馆
# 全栈工程开发文档与商业级生产部署规范 (Full-Stack Architecture & Commercial Deployment Guide)

**版本**: v3.5 Commercial Release Edition  
**技术栈**: React 18 + TypeScript + Vite + Tailwind CSS v4 + Motion + Node.js / Go + PostgreSQL + Redis + Docker + Nginx  
**面向对象**: 全栈工程师、架构师、DevOps 运维及商业化部署团队

---

## 目录
1. [系统总体架构与拓扑 (System Architecture & Topology)](#一系统总体架构与拓扑)
2. [前端工程架构设计 (Frontend Architecture)](#二前端工程架构设计)
3. [后端服务架构与接口规范 (Backend Architecture & APIs)](#三后端服务架构与接口规范)
4. [数据库设计与持久化方案 (Database Schema & Persistence)](#四数据库设计与持久化方案)
5. [商业级生产部署全流程指南 (Commercial Production Deployment)](#五商业级生产部署全流程指南)
6. [运维监控、高可用容灾与合规安全 (Operations, HA & Security)](#六运维监控高可用容灾与合规安全)

---

## 一、系统总体架构与拓扑

### 1.1 总体分层拓扑图

```text
[ 客户端终端 ] 
  ├── Web 浏览器 (Desktop / Tablet / Mobile 响应式)
  ├── PWA 离线渐进式应用 (Service Worker 缓存)
  └── 移动端轻量沉浸式 Dock 导航
          │ HTTPS (TLS 1.3) / WSS (WebSocket Secure)
          ▼
[ 边缘网络 & CDN 加速层 ]
  ├── Cloudflare / 腾讯云 CDN / 阿里云 CDN (静态资源边缘缓存、智能路由、DDoS 高防)
  └── 泛域名 SSL / 自动 HTTP 重定向 HTTPS
          │
          ▼
[ 网关与负载均衡 (Reverse Proxy & API Gateway) ]
  └── Nginx / Caddy 反向代理
        ├── /assets/*, /images/* ── 静态资源本地/对象存储直传缓存
        ├── /api/* ────────────── 动静分离，代理至后端 API 集群 (负载均衡 Round-Robin)
        └── /socket.io/* ──────── WebSocket 双工连接代理 (保持长连接心跳)
          │
          ├───────────────────────────────┐
          ▼                               ▼
[ 后端应用服务集群 (Stateless Nodes) ]     [ 异步与微服务计算集群 ]
  ├── 节点 1 (Node.js / Go Gin)             ├── 图像合成与水印落款引擎 (Sharp / Skia)
  ├── 节点 2 (Node.js / Go Gin)             ├── 内容安全审核服务 (敏感词/图像合规)
  └── 节点 N (K8s / Cloud Run 自动伸缩)     └── 定时任务与离线报表 (Cron / BullMQ)
          │                               │
          ├──────────────┬────────────────┘
          ▼              ▼
[ 数据与缓存层 (Persistence & Cache) ]
  ├── Redis 集群: 
  │     ├── 实时在线状态与聊天消息 Pub/Sub
  │     ├── 接口防刷令牌桶 Rate Limiting
  │     └── 高频查询数据缓存 (日记、动态推荐、画廊热门列表)
  ├── 关系型数据库 (PostgreSQL 16 / Cloud SQL):
  │     ├── 主库 (Primary - 负责写操作与强一致性事务)
  │     └── 从库 (Read Replicas - 负责高并发读操作)
  └── 云对象存储 (OSS / AWS S3 / Google Cloud Storage):
        └── 存储画作、To签成片原图、日记封面、音频资源 (配合 CDN 边缘分发)
```

---

## 二、前端工程架构设计

### 2.1 技术选型与规范
- **构建工具**: Vite 6.x（基于 Rollup 与 esbuild，毫秒级热更新，Tree-shaking 优化构建产物体积）。
- **视图层框架**: React 18.3（全面拥抱 Hooks、Concurrent Mode 并发渲染、Suspense 懒加载）。
- **类型安全**: TypeScript 5.7（严格模式 `strict: true`，全局实体数据模型契约位于 `src/types/index.ts`）。
- **样式引擎**: Tailwind CSS v4（采用 `@import "tailwindcss";` 原生现代引擎架构，全站零传统 CSS 模块负担）。
- **物理动效库**: Motion (Framer Motion 12.x) 驱动弹簧物理阻尼（Spring Physics）、手势交互与同屏暗区聚焦。

### 2.2 前端工程目录结构
```text
src/
├── assets/                  # 静态静态媒体资源、本地原图与字体配置
├── components/              # 业务组件树
│   ├── admin/               # 管理员审核台（To签工坊审批、Coser身份认证）
│   ├── auth/                # 用户认证模态框（登录、注册、角色切换）
│   ├── chat/                # 侍奉部实时聊天室（WebSocket双工与雪乃智能对话）
│   ├── common/              # 全局原子组件 (LiquidNavbar, FloatingTabBar, SnowfallCanvas, AudioPlayer, ImageLightbox)
│   ├── community/           # 侍奉会社区动态广场 (FeedView, 动态发布, 点赞, 收藏)
│   ├── diary/               # 个人手记与生活日记 (DiaryView, To签灵感智能联动推荐)
│   ├── gallery/             # 视觉图库与作品展示 (瀑布流画廊, To签发起入口)
│   ├── home/                # 沉浸式首页 (Bento Grid 视线引导)
│   ├── oregairu/            # 《春物》全景世界观与角色编年史
│   ├── profile/             # 个人中心 (我的To签成片展台, 收藏夹, Coser申请)
│   ├── search/              # 全局 Omnibox 搜索器 (快捷键 '/')
│   ├── tosign/              # 5步交互式手写 To 签创作工房 (ToSignModal)
│   └── yukino/              # 雪乃深度个人数字档案 (服装、名言、台词、周边)
├── services/                # API 数据服务层与本地 LocalStorage 持久化中间件
├── types/                   # 全局 TypeScript 接口契约定义
├── App.tsx                  # 核心路由分发、全局状态管理与悬浮组件调度
└── main.tsx                 # 前端应用入口挂载点
```

### 2.3 核心特色交互子系统
1. **Apple Liquid Glass 超透液态玻璃系统**:
   - 冷蓝雾面底座：`#EEF2F6` 结合超广域高斯模糊 `backdrop-filter: blur(34px)`。
   - 双层顶边高光棱镜反射：`box-shadow: inset 0 1.5px 1.5px 0 #FFF, inset 0 -1.5px 1.5px 0 rgba(186,230,253,0.4)`。
2. **Q 弹晃动微悬浮物理系统 (Wobble Physics)**:
   - 全局规范：`whileHover: { y: -8, scale: 1.025, rotateZ: [-0.3, 0.4, -0.2, 0] }`。
   - 物理弹簧参数：`type: 'spring', stiffness: 350, damping: 18`。
3. **同屏暗区视线聚焦系统 (Focus-Dimming)**:
   - 基于纯 CSS `:has()` 现代选择器：在 `.focus-dim-group:has(.focus-card-item:hover) .focus-card-item:not(:hover)` 下，自动将非焦点卡片淡退至 `opacity: 0.65; filter: blur(0.6px); transform: scale(0.985)`。
4. **日记与 To 签灵感联动系统**:
   - 自动识别用户当天申请的 To 签定制数据。
   - 撰写日记时主动浮现灵感卡片，支持一键将 To 签题辞引用为日记正文、设为日记封面图及自动补全标签。
5. **一键同步发布社区动态**:
   - 在 5 步 To 签定制提交步骤中，一键同步推送到社区动态流，自动识别并 `@Coser`，自动添加 `#To签定制 #雪之下雪乃 #真物` 等话题标签。

---

## 三、后端服务架构与接口规范

商业级后端推荐采用 **Node.js (NestJS / Express)** 或 **Go (Gin / Fiber)**。以下为标准化 RESTful API 与 WebSocket 协议设计。

### 3.1 核心 RESTful API 路由清单

| 模块 | 请求方式 | 路径 | 权限要求 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **用户与认证** | POST | `/api/v1/auth/register` | 公开 | 用户注册 |
| | POST | `/api/v1/auth/login` | 公开 | 用户密码/邮箱登录，下发 JWT |
| | GET | `/api/v1/user/profile` | 已登录 | 获取当前登录用户画像与角色 |
| | PUT | `/api/v1/user/profile` | 已登录 | 修改个人昵称、头像、简介 |
| **To签工坊** | GET | `/api/v1/tosign/mine` | 已登录 | 查询当前用户的 To 签申请与成片 |
| | POST | `/api/v1/tosign/apply` | 已登录 | 递交 5 步 To 签定制申请 (支持带 `syncToFeed`) |
| | GET | `/api/v1/admin/tosign/pending`| Coser/管理员 | 获取待审批/签署的 To 签列表 |
| | PUT | `/api/v1/admin/tosign/:id/review`| Coser/管理员 | 审批通过/驳回，或上传最终签署成片原图 |
| **社区动态** | GET | `/api/v1/posts` | 公开 | 获取动态流 (支持分页、标签筛选) |
| | POST | `/api/v1/posts` | 已登录 | 发布新动态 (支持附带图片、@用户与标签) |
| | POST | `/api/v1/posts/:id/like` | 已登录 | 点赞/取消点赞动态 |
| | POST | `/api/v1/posts/:id/bookmark` | 已登录 | 收藏/取消收藏动态 |
| **个人日记** | GET | `/api/v1/diaries` | 公开/登录 | 获取日记时间轴列表 |
| | POST | `/api/v1/diaries` | 拥有者 | 撰写日记 (可附带关联 To 签外键) |
| | DELETE | `/api/v1/diaries/:id` | 拥有者 | 删除日记 |
| **实时聊天** | GET | `/api/v1/chat/messages` | 公开/登录 | 获取侍奉部最新 50 条聊天历史 |
| **文件上传** | POST | `/api/v1/upload/token` | 已登录 | 获取直传对象存储的预签名 URL (Presigned URL) |

### 3.2 WebSocket 实时双工通讯规范
- **连接端点**: `wss://yourdomain.com/ws/v1/chat?token={jwt}`
- **心跳保活**: 客户端每 30 秒发送 `{"type": "PING"}`，服务端应答 `{"type": "PONG"}`。
- **消息发送事件**:
  ```json
  {
    "event": "SEND_MESSAGE",
    "data": {
      "content": "追求真物的道路虽然伴随刺痛，但我们仍会前行。",
      "roomId": "service_club_main"
    }
  }
  ```
- **广播下发事件**:
  ```json
  {
    "event": "RECEIVE_MESSAGE",
    "data": {
      "id": "msg_1710001",
      "userId": "usr_998",
      "userName": "雪野原",
      "userAvatar": "https://...",
      "content": "...",
      "timestamp": "14:20",
      "isSelf": false
    }
  }
  ```

---

## 四、数据库设计与持久化方案

商业生产级数据库推荐使用 **PostgreSQL 16+**。以下提供完整的生产级 DDL 建表 SQL、外键关联与索引设计。

### 4.1 PostgreSQL DDL 建表脚本

```sql
-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户表 (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(64) NOT NULL,
    avatar VARCHAR(512) DEFAULT 'https://api.dicebear.com/7.x/notionists/svg?seed=Yukino',
    bio TEXT DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_USER', 'ROLE_COSER', 'ROLE_ADMIN')),
    is_coser BOOLEAN DEFAULT FALSE,
    coser_cn VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- 2. 图库摄影与画作表 (galleries)
CREATE TABLE galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('screenshot', 'official', 'novel', 'coser', 'wallpaper')),
    image_url VARCHAR(512) NOT NULL,
    aspect_ratio VARCHAR(16) DEFAULT 'portrait',
    author VARCHAR(128) NOT NULL,
    author_avatar VARCHAR(512),
    source VARCHAR(255),
    likes_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    is_coser_work BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_galleries_category ON galleries(category);
CREATE INDEX idx_galleries_tags ON galleries USING GIN(tags);

-- 3. 5步交互式手写 To 签申请表 (to_sign_requests)
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
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'rejected')),
    signed_image_url VARCHAR(512),
    author_name VARCHAR(128) DEFAULT '浅羽由乃',
    synced_to_feed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_to_sign_user ON to_sign_requests(user_id);
CREATE INDEX idx_to_sign_status ON to_sign_requests(status);
CREATE INDEX idx_to_sign_created_at ON to_sign_requests(created_at);

-- 4. 个人生活日记与手记表 (diaries)
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
);

CREATE INDEX idx_diaries_user ON diaries(user_id);
CREATE INDEX idx_diaries_date ON diaries(date DESC);

-- 5. 侍奉会社区动态表 (posts)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- 6. 动态点赞与收藏关联表
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_bookmarks (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

-- 7. Coser 认证申请表 (coser_certifications)
CREATE TABLE coser_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coser_cn VARCHAR(64) NOT NULL,
    bio TEXT NOT NULL,
    portfolio_links TEXT[] DEFAULT ARRAY[]::TEXT[],
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ
);
```

### 4.2 Redis 缓存分层设计
1. **日记与 To 签灵感推荐缓存**:
   - Key: `cache:user:{user_id}:today_tosigns:{YYYY-MM-DD}`
   - 存储: 序列化的 To 签推荐卡片对象，TTL 设为 24 小时。
2. **高并发限流保护 (Rate Limiting)**:
   - Key: `ratelimit:ip:{client_ip}:api`
   - 算法: 令牌桶算法，每分钟限制 120 次请求，超过返回 `429 Too Many Requests`。
3. **实时在线人数与聊天会话**:
   - Redis Pub/Sub 广播新消息至所有分布式 Node.js 进程。

---

## 五、商业级生产部署全流程指南

### 5.1 多阶段构建 Dockerfile (生产级瘦身与安全)

在项目根目录下创建 `Dockerfile`：

```dockerfile
# ==========================================
# 阶段 1: 前端静态资源构建 (Build Stage)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# 编译 TypeScript 并执行 Vite 生产打包
COPY . .
RUN npm run build

# ==========================================
# 阶段 2: 生产级 Nginx Web 容器 (Production Stage)
# ==========================================
FROM nginx:1.25-alpine AS production

# 移除默认配置
RUN rm -rf /etc/nginx/conf.d/*

# 复制自定义 Nginx 优化配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制打包产物
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# 赋予非 root 权限，增强容器安全性
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

USER nginx

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 5.2 生产级 `nginx.conf` 配置文件

```nginx
server {
    listen 80;
    server_name yukino.yourdomain.com;
    
    # 强制跳转 HTTPS (在配合外层反代或单独签发 SSL 时生效)
    # return 301 https://$host$request_uri;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip 极速压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml font/woff2 image/svg+xml;

    # 静态资源长期强缓存 (Vite 带 hash 的资源)
    location ~* \.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|webp|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # SPA 路由兜底 (避免刷新 404)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # 反向代理后端 API
    location /api/ {
        proxy_pass http://backend-api:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 实时代理
    location /socket.io/ {
        proxy_pass http://backend-api:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # 安全 HTTP 响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 5.3 `docker-compose.production.yml` 全栈容器编排

```yaml
version: '3.8'

services:
  # 1. 前端 Web 容器
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - yukino-network

  # 2. 后端 API 服务
  backend:
    image: your-registry.com/yukino-backend:latest
    restart: always
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgres://yukino_user:StrongPassword123@db:5432/yukino_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: super_jwt_secret_yukino_2026
    depends_on:
      - db
      - redis
    networks:
      - yukino-network

  # 3. 关系型数据库 (PostgreSQL 16)
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: yukino_user
      POSTGRES_PASSWORD: StrongPassword123
      POSTGRES_DB: yukino_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - yukino-network

  # 4. Redis 缓存集群
  redis:
    image: redis:7-alpine
    restart: always
    command: ["redis-server", "--appendonly", "yes", "--requirepass", "RedisSecurePass2026"]
    volumes:
      - redis_data:/data
    networks:
      - yukino-network

networks:
  yukino-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### 5.4 商业级云原生托管一键命令 (Cloud Run / AWS / 阿里云)

#### 方案 A: 部署至 Google Cloud Run (Serverless 极速扩缩容)
```bash
# 1. 登录 Google Cloud SDK
gcloud auth login
gcloud config set project your-gcp-project-id

# 2. 构建并推送容器镜像至 Google Artifact Registry
gcloud builds submit --tag gcr.io/your-gcp-project-id/yukino-app:v3.5

# 3. 一键部署至 Cloud Run (自动 HTTPS、自动弹性伸缩 0~100 实例)
gcloud run deploy yukino-web \
  --image gcr.io/your-gcp-project-id/yukino-app:v3.5 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 50
```

#### 方案 B: 部署至阿里云 / 腾讯云轻量服务器 (ECS / CVM)
```bash
# 1. 在服务器拉取代码并启动生产编排
git clone https://github.com/your-org/yukino-archive.git /opt/yukino
cd /opt/yukino

# 2. 一键启动全栈服务集群
docker compose -f docker-compose.production.yml up -d --build

# 3. 查看健康状态
docker compose -f docker-compose.production.yml ps
```

---

## 六、运维监控、高可用容灾与合规安全

### 6.1 CI/CD 自动化流水线 (.github/workflows/deploy.yml)
配置 GitHub Actions 触发主分支推送自动部署：
1. **Lint & Test**: 执行 `npm run lint` 与单元测试。
2. **Build Image**: 构建 Docker 镜像并打上 Git Commit Hash。
3. **Registry Push**: 推送至私有镜像仓库。
4. **Rolling Update**: SSH 或 Kubernetes 滚动更新无损发布，用户无感知。

### 6.2 自动化容灾备份策略
- **PostgreSQL 每日异地冷备份**:
  编写定时任务执行 `pg_dump`，并将压缩文件上传至对象存储归档桶，保留 30 天：
  ```bash
  0 3 * * * pg_dump -U yukino_user yukino_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz && aws s3 cp /backups/db_$(date +\%Y\%m\%d).sql.gz s3://your-backup-bucket/db/
  ```

### 6.3 商业合规与安全防线
1. **ICP 与公安网安备案**:
   - 商业化上线前完成域名实名认证与工信部 ICP 备案，在网站底部渲染备案号并链接至 `beian.miit.gov.cn`。
2. **文本与图像内容合规过滤**:
   - 日记、评论与社区动态发布前，接入文本内容安全 API（检测涉政、暴恐、违禁敏感词）。
   - 用户上传图片需经过 EXIF 隐私清洗（去除 GPS 拍摄地理位置与设备隐私信息）。
3. **防盗链与防 CC 限流**:
   - 对象存储开启 HTTP Referer 防盗链白名单。
   - Nginx 配置 `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=15r/s;` 抵御恶意扫描与高频发帖。

---

*文档生成日期: 2026-09-26 · 归档于项目核心开发架构树*
