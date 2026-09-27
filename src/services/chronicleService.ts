import { Episode, ChronicleComment, AdminApplication, User, UserRole, RevisionLog, EpisodePin, Outfit, Quote, Character, CharacterRelation, Anime, CommentReply } from '../types';
import { episodesData, outfitsData, quotesData, oregairuCharacters, characterRelations, animeListData } from './mockData';

export const CHARACTER_SLUG_MAP: Record<string, string> = {
  'yukino-yukinoshita': 'char_yukino',
  'hachiman-hikigaya': 'char_hachiman',
  'yui-yuigahama': 'char_yui',
  'iroha-isshiki': 'char_iroha',
  'haruno-yukinoshita': 'char_haruno',
  'shizuka-hiratsuka': 'char_shizuka',
  'komachi-hikigaya': 'char_komachi',
  'saika-totsuka': 'char_saika',
  'hayato-hayama': 'char_hayato'
};

export const CHARACTER_ID_TO_SLUG: Record<string, string> = {
  'char_yukino': 'yukino-yukinoshita',
  'char_hachiman': 'hachiman-hikigaya',
  'char_yui': 'yui-yuigahama',
  'char_iroha': 'iroha-isshiki',
  'char_haruno': 'haruno-yukinoshita',
  'char_shizuka': 'shizuka-hiratsuka',
  'char_komachi': 'komachi-hikigaya',
  'char_saika': 'saika-totsuka',
  'char_hayato': 'hayato-hayama'
};

const STORAGE_KEYS = {
  EPISODES: 'yukino_chronicle_episodes_v2',
  COMMENTS: 'yukino_chronicle_comments_v2',
  REVISION_LOGS: 'yukino_revision_logs_v2',
  EPISODE_PINS: 'yukino_episode_pins_v2',
  USER_VOTES: 'yukino_chronicle_votes_v2', // Record of { [commentId]: 'up' | 'down' }
  PIN_VOTES: 'yukino_pin_votes_v2',
  USER_LIKES: 'yukino_global_likes_v2', // Set of item IDs user has liked
  ADMIN_APPLICATIONS: 'yukino_admin_applications_v2',
  CUSTOM_OUTFITS: 'yukino_custom_outfits_v2',
  CUSTOM_QUOTES: 'yukino_custom_quotes_v2',
  CUSTOM_CHARACTERS: 'yukino_custom_characters_v2',
  RELATIONS: 'yukino_character_relations_v2'
};

// Initial seed revision history logs
const initialRevisionLogs: RevisionLog[] = [
  {
    id: 'rev_01',
    targetId: 'ep_1_01',
    targetType: 'episode',
    targetTitle: '第1话 · 这样他们错误的青春就拉开了帷幕。',
    editorId: 'usr_chiba_scholar',
    editorName: '千叶真物理论家',
    editorRole: 'ROLE_USER',
    action: 'community_proposal_adopted',
    changes: [
      {
        field: '分集剧评考据',
        before: '两人的理念发生猛烈冲突。',
        after: '两人的理念发生猛烈冲突，补充了雪乃翻阅文库本《人间失格》时的部室光线与红茶香气细节。'
      }
    ],
    reason: '参考原著小说第一卷第一章侍奉部茶具拓扑与官方公式书考证。',
    timestamp: '2026-08-15 14:30'
  },
  {
    id: 'rev_02',
    targetId: 'quote_01',
    targetType: 'quote',
    targetTitle: '名言语录 · 人无论何时都无法将内心的丑陋坦然示人',
    editorId: 'usr_admin_01',
    editorName: '总武高档案管理员',
    editorRole: 'ROLE_CONTENT_ADMIN',
    action: 'admin_direct_edit',
    changes: [
      {
        field: '心境感悟解析',
        before: '初见关于孤独的辩论。',
        after: '初见关于人性伪善与孤独的辩论，彰显了雪乃早期追求不妥协真理的傲骨与防备心。'
      }
    ],
    reason: '管理员免审直编：强化雪乃初见期独特性格心路历程解读。',
    timestamp: '2026-08-20 09:15'
  },
  {
    id: 'rev_03',
    targetId: 'outfit_uniform',
    targetType: 'outfit',
    targetTitle: '代表服饰 · 总武高中正统制服',
    editorId: 'usr_me',
    editorName: '八幡的猫罐头',
    editorRole: 'ROLE_USER',
    action: 'community_proposal_adopted',
    changes: [
      {
        field: '配饰考据细节',
        before: '双侧黑发缎带。',
        after: '双侧黑发缎带质感为黑色细罗缎，系法工整对称，象征雪乃不可侵犯的严谨自律。'
      }
    ],
    reason: '补充官方画集《Ponkan⑧ ART WORKS》第42页关于服饰质感设定的官方考据。',
    timestamp: '2026-09-02 16:45'
  }
];

// Initial seed episode video pins (在视频固定时长打钉子写自己的看法)
const initialEpisodePins: EpisodePin[] = [
  {
    id: 'pin_01',
    episodeId: 'ep_1_01',
    timestampSeconds: 205, // 03:25
    timestampDisplay: '03:25',
    userId: 'usr_hachiman_cat',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    content: '03:25 雪乃看文库本时被八幡推门打扰，眉头微蹙抬头的一瞬间，早见沙织用清冽声线说出的“请不要用粘稠的眼神看我”，经典永流传！',
    type: 'insight',
    upvotes: 42,
    downvotes: 0,
    createdAt: '2026-08-10'
  },
  {
    id: 'pin_02',
    episodeId: 'ep_1_01',
    timestampSeconds: 890, // 14:50
    timestampDisplay: '14:50',
    userId: 'usr_chiba_scholar',
    userName: '千叶真物理论家',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    userRole: 'ROLE_CONTENT_ADMIN',
    content: '14:50 结衣第一次拿出烤焦的曲奇，雪乃毒舌点评“炭化物”，但下一秒却当场吃下一整块并手把手教她揉面，傲娇与极度温柔的极致反差。',
    type: 'lore',
    upvotes: 35,
    downvotes: 1,
    createdAt: '2026-08-12'
  },
  {
    id: 'pin_03',
    episodeId: 'ep_1_01',
    timestampSeconds: 1270, // 21:10
    timestampDisplay: '21:10',
    userId: 'usr_001',
    userName: '雪野原',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
    userRole: 'ROLE_USER',
    content: '21:10 夕阳照射在特别栋教室的桌椅上，第一季第一集在这里落下帷幕。三个不擅长青春的孩子，注定在此交汇。',
    type: 'insight',
    upvotes: 29,
    downvotes: 0,
    createdAt: '2026-08-14'
  },
  {
    id: 'pin_04',
    episodeId: 'ep_2_08',
    timestampSeconds: 1125, // 18:45
    timestampDisplay: '18:45',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    content: '18:45 全剧封神名场面！比企谷八幡低头哽咽说出“我想要真物”——雪乃瞳孔剧烈收缩，后退时撞倒椅子的无措感，彻底撕碎了两季以来的冷漠伪装。',
    type: 'insight',
    upvotes: 68,
    downvotes: 0,
    createdAt: '2026-08-25'
  },
  {
    id: 'pin_05',
    episodeId: 'ep_3_11',
    timestampSeconds: 1350, // 22:30
    timestampDisplay: '22:30',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    content: '22:30 天桥之约！八幡说“请允许我介入你的人生”，雪乃在暮风中噙着泪水：“请把你的生命交给我”。三季青春在此圆满，真物终成！',
    type: 'insight',
    upvotes: 88,
    downvotes: 0,
    createdAt: '2026-09-10'
  }
];

// Initial seed comments & proposals across items
const initialComments: ChronicleComment[] = [
  {
    id: 'comm_01',
    targetId: 'ep_1_01',
    targetType: 'episode',
    targetTitle: '第1话 · 这样他们错误的青春就拉开了帷幕。',
    userId: 'usr_hachiman_cat',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    type: 'normal',
    content: '第一季第一集部室的窗边光线太经典了，早见沙织老师配雪乃初见八幡那几句，冰冷又有分寸感！',
    createdAt: '2026-08-10',
    upvotes: 28,
    downvotes: 1
  },
  {
    id: 'prop_01',
    targetId: 'ep_1_01',
    targetType: 'episode',
    targetTitle: '第1话 · 这样他们错误的青春就拉开了帷幕。',
    userId: 'usr_chiba_scholar',
    userName: '千叶真物理论家',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    userRole: 'ROLE_USER',
    type: 'proposal',
    content: '申请补充由比滨结衣第一次带饼干委托时的台词细节与部室窗外总武高特别栋银杏树的季节考证。',
    proposedTitle: '第1话 · 这样他们错误的青春就拉开了帷幕。（侍奉部初相遇与红茶考据补全）',
    proposedSynopsis: '因写作违规随笔被平冢静老师强制带入侍奉部的比企谷八幡，在窗边邂逅了正在阅读文库本的雪乃。由比滨结衣带着亲手制作的焦黑饼干踏入特别栋部室。本集奠定了全剧三人微妙关系的初雪起点。',
    justification: '参考原著小说第一卷第一章与官方公式书《奉仕部活動記録》，补充了八幡随笔标题与雪乃当时所读的文库本细节。',
    createdAt: '2026-08-14',
    upvotes: 6,
    downvotes: 0,
    status: 'approved',
    approvedAt: '2026-08-15',
    approvedBy: '系统社区共识达成'
  },
  {
    id: 'prop_02',
    targetId: 'ep_3_11',
    targetType: 'episode',
    targetTitle: '第11话 · 只有那个气味，无论在哪个季节都宣告着终结。',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    type: 'proposal',
    content: '天桥告白名场面台词早见沙织声线微颤与千叶美滨大桥夕暮风速考据提议。',
    proposedTitle: '第11话 · 只有那个气味，无论在哪个季节都宣告着终结。（天桥托付终身之誓与真物终章）',
    proposedSynopsis: '在千叶海滨的寒风中，八幡与雪乃在天桥上面对彼此无法割舍的情愫。八幡抛弃了所有借口，说出“我想要参与你的人生”；雪乃在泪光与晚霞中回应“请把你的生命交给我”。三季以来的防线在真实心意前彻底消融。',
    justification: '原动画分镜第21分30秒，早见沙织换气处三次声颤与夕阳西下的富士山轮廓考据。',
    createdAt: '2026-09-12',
    upvotes: 4,
    downvotes: 0,
    status: 'pending'
  },
  {
    id: 'comm_quote_01',
    targetId: 'quote_01',
    targetType: 'quote',
    targetTitle: '经典语录 · 人无论何时，都无法将深藏在自己内心的丑陋坦然展示给别人看',
    userId: 'usr_001',
    userName: '雪野原',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
    userRole: 'ROLE_USER',
    type: 'normal',
    content: '这句话是雪乃整个人格防御机制的底层逻辑。因为看清了世人的虚伪，所以宁愿选择独自承担孤独。',
    createdAt: '2026-08-20',
    upvotes: 18,
    downvotes: 0
  },
  {
    id: 'prop_outfit_01',
    targetId: 'outfit_yukata',
    targetType: 'outfit',
    targetTitle: '代表服饰 · 夏季祭典牵牛花蓝染浴衣',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    type: 'proposal',
    content: '提议在浴衣描述中补充第9集神社石阶前雪乃拉八幡衣角时的心境独白考据。',
    proposedTitle: '夏季祭典牵牛花蓝染浴衣（附神社石阶依恋考证）',
    proposedSynopsis: '深浅交融的蓝白碎花如同夏夜落雪。在烟花声响中，雪乃拉住八幡衣角展现出难得一见的小女儿依赖姿态。',
    justification: '原著第3卷夏日祭典章节心理描写补充。',
    createdAt: '2026-09-15',
    upvotes: 3,
    downvotes: 0,
    status: 'pending'
  },
  // 用户明确指定的雪乃心理变化修改申请范例
  {
    id: 'prop_psycho_01',
    targetId: 'character_psychology_char_yukino',
    targetType: 'character',
    targetTitle: '雪之下雪乃 · 心理变化与性格分析',
    userId: 'usr_chiba_scholar',
    userName: '千叶真物理论家',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    userRole: 'ROLE_USER',
    type: 'proposal',
    content: '我觉得这里关于雪乃心理变化的描述需要修改。原描述说雪乃第一季就已经完全信任八幡，这与原著中逐步建立羁绊的渐进性相悖。',
    currentContent: '雪乃从第一季开始就已经完全信任八幡。',
    proposedContent: '雪乃对八幡的信任是在相处过程中逐渐形成的，第二季部分剧情中才表现得更加明显。',
    justification: '第一季两人仍处于尖锐试探与彼此防备的阶段，直到第二季修学旅行与第八集“真物宣言”后，雪乃才真正开始袒露脆弱并形成深层信任。',
    references: 'S1E12、S2E08、角色语录（quote_02）及原作小说第8卷心理独白',
    createdAt: '2026-09-18',
    upvotes: 86,
    downvotes: 12,
    status: 'pending',
    replies: [
      {
        id: 'rep_01',
        commentId: 'prop_psycho_01',
        userId: 'usr_hachiman_cat',
        userName: '八幡的猫罐头',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        userRole: 'ROLE_USER',
        content: '我同意，但是第二季第八集应该再补一个引用。那一集推开部室门时两人的对视神情是心理质变的关键。',
        createdAt: '2026-09-19',
        likes: 15
      },
      {
        id: 'rep_02',
        commentId: 'prop_psycho_01',
        userId: 'usr_001',
        userName: '雪野原',
        userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
        userRole: 'ROLE_DEVELOPER',
        content: '这里其实小说版和动画版处理不一样。动画更强调了留白与眼神微动作，建议在考据中注明。',
        createdAt: '2026-09-19',
        likes: 22
      },
      {
        id: 'rep_03',
        commentId: 'prop_psycho_01',
        userId: 'usr_collector',
        userName: '潘先生头号粉丝',
        userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Panda&backgroundColor=fef08a',
        userRole: 'ROLE_USER',
        content: '我不赞成直接写成‘信任’，更像是开始产生无法割舍的依赖与共依存痛感。',
        createdAt: '2026-09-20',
        likes: 18
      }
    ]
  },
  // 人物总览页面评论
  {
    id: 'comm_overview_01',
    targetId: 'characters_overview',
    targetType: 'character',
    targetTitle: '总武高登场人物档案馆 · 总讨论',
    userId: 'usr_001',
    userName: '雪野原',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
    userRole: 'ROLE_DEVELOPER',
    type: 'normal',
    content: '欢迎来到总武高人物档案总库。全员档案深度对标雪乃档案馆，每一位角色的生平、语录与服饰均开放考据修改提议。',
    createdAt: '2026-09-10',
    upvotes: 34,
    downvotes: 0,
    replies: [
      {
        id: 'rep_ov_01',
        commentId: 'comm_overview_01',
        userId: 'usr_hachiman_cat',
        userName: '八幡的猫罐头',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        userRole: 'ROLE_USER',
        content: '终于可以为八幡和小町整理语录与心理变化了！',
        createdAt: '2026-09-11',
        likes: 12
      }
    ]
  },
  // 人物关系图谱总讨论
  {
    id: 'comm_rel_overview_01',
    targetId: 'relations_overview',
    targetType: 'relation',
    targetTitle: '人物关系图谱 · 总讨论区',
    userId: 'usr_hachiman_cat',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    type: 'normal',
    content: '春物里的人物羁绊不是简单的恋爱或者友情，而是带着自尊、伪恶与逃避的真实碰撞。点击每一条关系都可以查看阶段考据！',
    createdAt: '2026-09-12',
    upvotes: 27,
    downvotes: 1
  },
  // 单条人物关系讨论：雪乃 ↔ 八幡
  {
    id: 'comm_rel_1_01',
    targetId: 'relation_rel_1',
    targetType: 'relation',
    targetTitle: '雪之下雪乃 ↔ 比企谷八幡 · 关系研讨',
    userId: 'usr_chiba_scholar',
    userName: '千叶真物理论家',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    userRole: 'ROLE_CONTENT_ADMIN',
    type: 'normal',
    content: '天桥那一幕，八幡说的“请允许我介入你的人生”，与雪乃的“请把你的生命交给我”，是二次元最纯粹的求婚式誓约。',
    createdAt: '2026-09-14',
    upvotes: 49,
    downvotes: 0,
    replies: [
      {
        id: 'rep_rel_1_01',
        commentId: 'comm_rel_1_01',
        userId: 'usr_001',
        userName: '雪野原',
        userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
        userRole: 'ROLE_DEVELOPER',
        content: '因为两人都是极其不擅长说漂亮话的人，所以这种带有责任与契约意味的表达才是唯一的真物解。',
        createdAt: '2026-09-15',
        likes: 16
      }
    ]
  },
  // 单条人物关系修改提议
  {
    id: 'prop_rel_1_02',
    targetId: 'relation_rel_1',
    targetType: 'relation',
    targetTitle: '雪之下雪乃 ↔ 比企谷八幡 · 关系研讨',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'ROLE_USER',
    type: 'proposal',
    content: '提议在关系关键剧情中补充S2E02修学旅行户部告白委托八幡自爆对雪乃心理造成的重创。',
    currentContent: '文化祭自爆冲突：雪乃对八幡自毁手段的失望与痛心 (S1E12)',
    proposedContent: '补充阶段：修学旅行伪告白引发的信任危机与部室冷战 (S2E02)',
    justification: '修学旅行事件是第二季矛盾爆发的直接导火索，八幡的伪告白让雪乃愤怒并深感无力。',
    references: 'S2E02、小说第7卷终章',
    createdAt: '2026-09-17',
    upvotes: 42,
    downvotes: 2,
    status: 'pending'
  }
];

export const chronicleService = {
  // ================= 1. Revision History Logs =================
  getRevisionLogs(targetId?: string): RevisionLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REVISION_LOGS);
      const list: RevisionLog[] = raw ? JSON.parse(raw) : initialRevisionLogs;
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.REVISION_LOGS, JSON.stringify(initialRevisionLogs));
      }
      if (targetId) {
        return list.filter(l => l.targetId === targetId);
      }
      return list;
    } catch {
      return initialRevisionLogs;
    }
  },

  recordRevisionLog(params: Omit<RevisionLog, 'id' | 'timestamp'>): RevisionLog {
    const list = this.getRevisionLogs();
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog: RevisionLog = {
      ...params,
      id: `rev_${Date.now()}`,
      timestamp: timeStr
    };
    const updated = [newLog, ...list];
    localStorage.setItem(STORAGE_KEYS.REVISION_LOGS, JSON.stringify(updated));
    return newLog;
  },

  // ================= 2. Episode Video Timestamp Pins (打钉子写看法) =================
  getEpisodePins(episodeId: string): EpisodePin[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EPISODE_PINS);
      const list: EpisodePin[] = raw ? JSON.parse(raw) : initialEpisodePins;
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.EPISODE_PINS, JSON.stringify(initialEpisodePins));
      }
      return list
        .filter(p => p.episodeId === episodeId)
        .sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    } catch {
      return initialEpisodePins.filter(p => p.episodeId === episodeId);
    }
  },

  addEpisodePin(params: {
    episodeId: string;
    timestampSeconds: number;
    timestampDisplay: string;
    content: string;
    type: 'insight' | 'lore' | 'proposal';
    user: User;
  }): EpisodePin {
    const raw = localStorage.getItem(STORAGE_KEYS.EPISODE_PINS);
    const list: EpisodePin[] = raw ? JSON.parse(raw) : initialEpisodePins;

    const newPin: EpisodePin = {
      id: `pin_${Date.now()}`,
      episodeId: params.episodeId,
      timestampSeconds: params.timestampSeconds,
      timestampDisplay: params.timestampDisplay,
      userId: params.user.id,
      userName: params.user.nickname,
      userAvatar: params.user.avatar,
      userRole: params.user.role,
      content: params.content,
      type: params.type,
      upvotes: 1, // Self upvote
      downvotes: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newPin, ...list];
    localStorage.setItem(STORAGE_KEYS.EPISODE_PINS, JSON.stringify(updated));
    return newPin;
  },

  voteEpisodePin(pinId: string, direction: 'up' | 'down'): {
    pins: EpisodePin[];
    currentVote: 'up' | 'down' | null;
  } {
    let pinVotes: Record<string, 'up' | 'down'> = {};
    try {
      const rawVotes = localStorage.getItem(STORAGE_KEYS.PIN_VOTES);
      pinVotes = rawVotes ? JSON.parse(rawVotes) : {};
    } catch {
      pinVotes = {};
    }

    const prevVote = pinVotes[pinId] || null;
    let newVote: 'up' | 'down' | null = direction;

    if (prevVote === direction) {
      newVote = null;
      delete pinVotes[pinId];
    } else {
      pinVotes[pinId] = direction;
    }
    localStorage.setItem(STORAGE_KEYS.PIN_VOTES, JSON.stringify(pinVotes));

    const raw = localStorage.getItem(STORAGE_KEYS.EPISODE_PINS);
    const all: EpisodePin[] = raw ? JSON.parse(raw) : initialEpisodePins;

    const updated = all.map(p => {
      if (p.id === pinId) {
        let up = p.upvotes;
        let down = p.downvotes;
        if (prevVote === 'up') up = Math.max(0, up - 1);
        if (prevVote === 'down') down = Math.max(0, down - 1);
        if (newVote === 'up') up += 1;
        if (newVote === 'down') down += 1;
        return { ...p, upvotes: up, downvotes: down };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEYS.EPISODE_PINS, JSON.stringify(updated));
    return { pins: updated, currentVote: newVote };
  },

  // ================= 3. Comments & Proposals for All Items =================
  getComments(targetId?: string): ChronicleComment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const list: ChronicleComment[] = raw ? JSON.parse(raw) : initialComments;
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
      }
      if (targetId) {
        return list.filter(c => c.targetId === targetId);
      }
      return list;
    } catch {
      return initialComments;
    }
  },

  addComment(params: {
    targetId: string;
    targetType?: ChronicleComment['targetType'];
    targetTitle?: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userRole: UserRole;
    content: string;
  }): ChronicleComment {
    const all = this.getComments();
    const newComm: ChronicleComment = {
      id: `comm_${Date.now()}`,
      targetId: params.targetId,
      targetType: params.targetType || 'episode',
      targetTitle: params.targetTitle,
      userId: params.userId,
      userName: params.userName,
      userAvatar: params.userAvatar,
      userRole: params.userRole,
      type: 'normal',
      content: params.content,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      downvotes: 0
    };
    const updated = [newComm, ...all];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
    return newComm;
  },

  addProposal(params: {
    targetId: string;
    targetType?: ChronicleComment['targetType'];
    targetTitle?: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userRole: UserRole;
    content: string;
    currentContent?: string;
    proposedTitle?: string;
    proposedSynopsis?: string;
    proposedContent?: string;
    justification?: string;
    references?: string;
  }): ChronicleComment {
    const all = this.getComments();
    const newProp: ChronicleComment = {
      id: `prop_${Date.now()}`,
      targetId: params.targetId,
      targetType: params.targetType || 'character',
      targetTitle: params.targetTitle,
      userId: params.userId,
      userName: params.userName,
      userAvatar: params.userAvatar,
      userRole: params.userRole,
      type: 'proposal',
      content: params.content,
      currentContent: params.currentContent,
      proposedTitle: params.proposedTitle,
      proposedSynopsis: params.proposedSynopsis,
      proposedContent: params.proposedContent || params.proposedSynopsis,
      justification: params.justification,
      references: params.references,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 1, // Self-upvote
      downvotes: 0,
      status: 'pending',
      replies: []
    };
    const updated = [newProp, ...all];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
    return newProp;
  },

  addCommentReply(commentId: string, reply: {
    userId: string;
    userName: string;
    userAvatar: string;
    userRole: UserRole;
    content: string;
  }): { comment: ChronicleComment; reply: CommentReply } {
    const all = this.getComments();
    const newReply: CommentReply = {
      id: `rep_${Date.now()}`,
      commentId,
      userId: reply.userId,
      userName: reply.userName,
      userAvatar: reply.userAvatar,
      userRole: reply.userRole,
      content: reply.content,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0
    };

    let updatedComment: ChronicleComment | null = null;
    const updatedComments = all.map(comm => {
      if (comm.id === commentId) {
        const replies = comm.replies || [];
        const mod = {
          ...comm,
          replies: [...replies, newReply]
        };
        updatedComment = mod;
        return mod;
      }
      return comm;
    });

    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updatedComments));
    return { comment: updatedComment || all.find(c => c.id === commentId)!, reply: newReply };
  },

  // Community Voting on Comments & Proposals (Toggle mode, prevents infinite voting)
  getUserVotes(): Record<string, 'up' | 'down'> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_VOTES);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  voteComment(commentId: string, direction: 'up' | 'down'): {
    comments: ChronicleComment[];
    currentVote: 'up' | 'down' | null;
  } {
    const votes = this.getUserVotes();
    const prevVote = votes[commentId] || null;
    const all = this.getComments();

    let newVote: 'up' | 'down' | null = direction;

    if (prevVote === direction) {
      newVote = null;
      delete votes[commentId];
    } else {
      votes[commentId] = direction;
    }

    localStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(votes));

    const updatedComments = all.map(comm => {
      if (comm.id === commentId) {
        let up = comm.upvotes;
        let down = comm.downvotes;
        if (prevVote === 'up') up = Math.max(0, up - 1);
        if (prevVote === 'down') down = Math.max(0, down - 1);
        if (newVote === 'up') up += 1;
        if (newVote === 'down') down += 1;
        return { ...comm, upvotes: up, downvotes: down };
      }
      return comm;
    });

    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updatedComments));
    return { comments: updatedComments, currentVote: newVote };
  },

  // Adopt Proposal when Community Consensus is Reached (or Admin merges it)
  adoptProposal(commentId: string, approver: User | string = '社区共识达成'): {
    success: boolean;
    proposal?: ChronicleComment;
    episode?: Episode;
    log?: RevisionLog;
  } {
    const all = this.getComments();
    const prop = all.find(c => c.id === commentId && c.type === 'proposal');
    if (!prop || prop.status === 'approved') return { success: false };

    const approverName = typeof approver === 'string' ? approver : approver.nickname || '社区共识达成';

    // 1. Update the proposal status
    const updatedComments = all.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          status: 'approved' as const,
          approvedAt: new Date().toISOString().split('T')[0],
          approvedBy: approverName
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updatedComments));

    // 2. If it targets an episode, update the episode storage
    let updatedEpisode: Episode | undefined;
    if (prop.targetType === 'episode' || prop.targetId.startsWith('ep_')) {
      const episodes = this.getEpisodes();
      const updatedEpisodes = episodes.map(ep => {
        if (ep.id === prop.targetId) {
          const mod: Episode = {
            ...ep,
            title: prop.proposedTitle || ep.title,
            synopsis: prop.proposedSynopsis || ep.synopsis
          };
          updatedEpisode = mod;
          return mod;
        }
        return ep;
      });
      localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(updatedEpisodes));
    }

    // 3. Write to Revision History Log
    const log = this.recordRevisionLog({
      targetId: prop.targetId,
      targetType: (prop.targetType as any) || 'episode',
      targetTitle: prop.targetTitle || prop.targetId,
      editorId: prop.userId,
      editorName: prop.userName,
      editorRole: prop.userRole,
      action: 'community_proposal_adopted',
      changes: [
        {
          field: '档案/描述修订',
          before: '原历史记录版本',
          after: prop.proposedSynopsis || prop.proposedTitle || prop.content
        }
      ],
      reason: prop.justification || '经社区高赞认可并合并入正式档案'
    });

    return {
      success: true,
      proposal: updatedComments.find(c => c.id === commentId),
      episode: updatedEpisode,
      log
    };
  },

  adminDirectEditEpisode(episodeId: string, data: { title: string; synopsis: string; charactersInvolved?: string[] }): Episode[] {
    return this.updateEpisode(episodeId, data);
  },

  // ================= 4. Episodes Storage =================
  getEpisodes(): Episode[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EPISODES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodesData));
        return episodesData;
      }
      return JSON.parse(raw);
    } catch {
      return episodesData;
    }
  },

  updateEpisode(episodeId: string, updates: Partial<Episode>): Episode[] {
    const list = this.getEpisodes();
    const updated = list.map(ep => {
      if (ep.id === episodeId) {
        return { ...ep, ...updates };
      }
      return ep;
    });
    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(updated));
    return updated;
  },

  // ================= 5. Admin Direct Edit without Proposal ("管理员修改资料感悟的时候不用申请") =================
  adminDirectEdit(params: {
    targetId: string;
    targetType: 'episode' | 'timeline' | 'quote' | 'outfit' | 'character' | 'lore';
    targetTitle: string;
    field: string;
    before: string;
    after: string;
    reason: string;
    user: User;
  }): { success: boolean; log: RevisionLog } {
    // If it's an episode, update directly
    if (params.targetType === 'episode' || params.targetId.startsWith('ep_')) {
      if (params.field === 'title') {
        this.updateEpisode(params.targetId, { title: params.after });
      } else {
        this.updateEpisode(params.targetId, { synopsis: params.after });
      }
    }

    const log = this.recordRevisionLog({
      targetId: params.targetId,
      targetType: params.targetType,
      targetTitle: params.targetTitle,
      editorId: params.user.id,
      editorName: params.user.nickname,
      editorRole: params.user.role,
      action: 'admin_direct_edit',
      changes: [
        {
          field: params.field,
          before: params.before,
          after: params.after
        }
      ],
      reason: params.reason || '内容管理员实时免审编纂入库'
    });

    return { success: true, log };
  },

  // ================= 6. Global Single-Toggle Like / Bookmark Manager (Prevents infinite clicking) =================
  getUserLikes(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  isItemLiked(itemId: string): boolean {
    const likes = this.getUserLikes();
    return likes.includes(itemId);
  },

  toggleLikeItem(itemId: string): { isLiked: boolean; change: number } {
    const likes = this.getUserLikes();
    const idx = likes.indexOf(itemId);
    let isLiked = false;
    let change = 0;

    if (idx >= 0) {
      likes.splice(idx, 1);
      isLiked = false;
      change = -1;
    } else {
      likes.push(itemId);
      isLiked = true;
      change = 1;
    }

    localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(likes));
    return { isLiked, change };
  },

  // ================= 7. Admin Applications & Three-Tier Hierarchy Logic =================
  getAdminApplications(): AdminApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_APPLICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  submitAdminApplication(params: {
    userId: string;
    userName: string;
    userAvatar: string;
    reason: string;
    qualifications: string;
    approvedEditsCount: number;
    score: number;
  }): AdminApplication {
    const apps = this.getAdminApplications();
    const newApp: AdminApplication = {
      id: `admin_app_${Date.now()}`,
      userId: params.userId,
      userName: params.userName,
      userAvatar: params.userAvatar,
      reason: params.reason,
      qualifications: params.qualifications,
      approvedEditsCount: params.approvedEditsCount,
      score: params.score,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    const updated = [newApp, ...apps];
    localStorage.setItem(STORAGE_KEYS.ADMIN_APPLICATIONS, JSON.stringify(updated));
    return newApp;
  },

  reviewAdminApplication(appId: string, status: 'approved' | 'rejected'): AdminApplication[] {
    const apps = this.getAdminApplications();
    const updated = apps.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          reviewedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEYS.ADMIN_APPLICATIONS, JSON.stringify(updated));
    return updated;
  },

  // ================= 8. Character Relations & Future Multi-Anime Support =================
  getRelations(): CharacterRelation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RELATIONS);
      const list: CharacterRelation[] = raw ? JSON.parse(raw) : characterRelations;
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.RELATIONS, JSON.stringify(characterRelations));
      }
      return list;
    } catch {
      return characterRelations;
    }
  },

  updateRelation(rel: CharacterRelation): CharacterRelation[] {
    const list = this.getRelations();
    const updated = list.map(r => r.id === rel.id ? { ...rel, updatedAt: new Date().toISOString().split('T')[0] } : r);
    localStorage.setItem(STORAGE_KEYS.RELATIONS, JSON.stringify(updated));
    return updated;
  },

  getAnimeList(): Anime[] {
    return animeListData;
  },

  getAnimeById(id: string): Anime | undefined {
    return animeListData.find(a => a.id === id || a.slug === id);
  }
};
