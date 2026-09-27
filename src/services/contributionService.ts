import { ArchiveContribution, ContributionSummary, User } from '../types';
import { chronicleService } from './chronicleService';

// 用户定制的精准低比率权重体系：
// 浏览千分之一 (0.001) · 点赞百分之一 (0.01) · 收藏百分之二 (0.02)
export const WEIGHT_VIEW = 0.001;
export const WEIGHT_LIKE = 0.01;
export const WEIGHT_FAVORITE = 0.02;
export const WEIGHT_ARCHIVE_BASE = 50;
export const WEIGHT_ARCHIVE = 50;
export const FORMULA_ARCHIVE_WEIGHT = 50;
export const FORMULA_LIKE_WEIGHT = 0.01;
export const WEIGHT_APPROVED_EDIT = 25; // 每篇被社区采纳的编年史/档案修改加 25 贡献声望

// 晋升与撤职临界指标
export const PROMOTION_REQUIRED_EDITS = 3;  // 成功被采纳的修改数量达到 3 篇
export const PROMOTION_REQUIRED_SCORE = 80; // 综合贡献评分达到 80 分
export const DEMOTION_DOWNVOTE_THRESHOLD = 5; // 如果作为管理员被👎超过 5 次，撤销管理员权限

// Initial contributions spread across the past months
export const initialContributions: ArchiveContribution[] = [
  {
    id: 'contrib_01',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'character',
    targetTitle: '雪之下雪乃 · 猫咪狂热与潘先生周边考据',
    summary: '深度补充了原著小说第3卷与广播剧中，雪乃对猫咪毫无抵抗力却害怕被八幡发现的细节考据。',
    date: '2026-03-12',
    likes: 12,
    status: 'approved',
    basePoints: 50,
    likePoints: 1.2,
    totalPoints: 51.2
  },
  {
    id: 'contrib_02',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'lore',
    targetTitle: '千叶市立总武高校 · 特别栋二楼部室布局拓扑',
    summary: '根据动画三季镜头与原画集，详细还原了部室窗边单人桌、书架红茶罐分类与夕阳照射角。',
    date: '2026-04-05',
    likes: 8,
    status: 'approved',
    basePoints: 50,
    likePoints: 0.8,
    totalPoints: 50.8
  },
  {
    id: 'contrib_03',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'episode',
    targetTitle: '第三季第11话 · 天桥告白台词早见沙织声线微颤考析',
    summary: '逐帧记录早见沙织在配音“请把你的生命交给我”时的三次换气与情感转变，补全台词注释。',
    date: '2026-05-18',
    likes: 24,
    status: 'approved',
    basePoints: 50,
    likePoints: 2.4,
    totalPoints: 52.4
  },
  {
    id: 'contrib_04',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'lore',
    targetTitle: '稻毛海滨公园 · 夕阳防波堤现实圣地巡礼坐标核定',
    summary: '纠正了旧版地图中美滨大桥与防波堤的距离误差，补全精确经纬度与夕阳最佳观测时刻。',
    date: '2026-06-22',
    likes: 19,
    status: 'approved',
    basePoints: 50,
    likePoints: 1.9,
    totalPoints: 51.9
  },
  {
    id: 'contrib_05',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'character',
    targetTitle: '雪之下雪乃 · 三季制服配饰与发带质感细节补全',
    summary: '梳理了雪乃在私服、侍奉部校服、京都修学旅行与夏日浴衣四套关键装束的配色与寓意。',
    date: '2026-07-15',
    likes: 31,
    status: 'approved',
    basePoints: 50,
    likePoints: 3.1,
    totalPoints: 53.1
  },
  {
    id: 'contrib_06',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'gallery',
    targetTitle: '官方画师 Ponkan⑧ 展会限定色纸原画鉴赏注释',
    summary: '补全了2015至2023年间历届Comic Market限定色纸的编号与雪乃签名款辨伪要点。',
    date: '2026-08-08',
    likes: 15,
    status: 'approved',
    basePoints: 50,
    likePoints: 1.5,
    totalPoints: 51.5
  },
  {
    id: 'contrib_07',
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType: 'lore',
    targetTitle: '葛西临海公园 · 钻石与花摩天轮黄昏动线考据',
    summary: '补全了二期结局三人在摩天轮前等待长椅、夜景灯光变化与游园动线图谱。',
    date: '2026-09-10',
    likes: 45,
    status: 'approved',
    basePoints: 50,
    likePoints: 4.5,
    totalPoints: 54.5
  }
];

const STORAGE_KEY = 'snow_archive_contributions_v1';

export function getStoredContributions(): ArchiveContribution[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContributions));
      return initialContributions;
    }
    return JSON.parse(raw);
  } catch {
    return initialContributions;
  }
}

export function saveContributions(list: ArchiveContribution[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save contributions', e);
  }
}

export function calculateContributionSummary(
  list: ArchiveContribution[],
  user?: User
): ContributionSummary {
  const archiveCount = list.length;
  const totalLikesReceived = list.reduce((sum, item) => sum + item.likes, 0);

  // 基础互动量基准 (模拟全站用户文章、日记与档案累计量)
  const totalViewsReceived = 14850; // 累计浏览约 1.48 万次
  const totalFavoritesReceived = 280; // 累计收藏约 280 次

  // 计算精细加权分数 (千分之一 0.001, 百分之一 0.01, 百分之二 0.02)
  const viewWeightedScore = Number((totalViewsReceived * WEIGHT_VIEW).toFixed(2)); // ~14.85 分
  const likeWeightedScore = Number((totalLikesReceived * WEIGHT_LIKE).toFixed(2)); // ~1.54 分
  const favoriteWeightedScore = Number((totalFavoritesReceived * WEIGHT_FAVORITE).toFixed(2)); // ~5.60 分

  // 档案补全度 (百分比): 基于 8 条基准维度
  const archiveCompleteness = Math.min(100, Math.round((archiveCount / 8) * 100)); // 88%
  const archiveBaseScore = Number((archiveCompleteness * 0.4).toFixed(1)); // ~35.2 分

  // 用户成功被采纳的编年史/档案修改数量 (从 ChronicleService 动态统计)
  const comments = chronicleService.getComments();
  const userApprovedProposals = comments.filter(
    c => c.type === 'proposal' && c.userId === (user?.id || 'usr_me') && c.status === 'approved'
  );
  const approvedEditsCount = (user?.approvedModificationsCount ?? userApprovedProposals.length) + 2; // 已有底蕴2篇 + 动态采纳
  const approvedEditsBonus = approvedEditsCount * WEIGHT_APPROVED_EDIT; // 每次被采纳奖励 25 分

  // 综合贡献评分
  const formulaScore = Number(
    (archiveBaseScore + viewWeightedScore + likeWeightedScore + favoriteWeightedScore + approvedEditsBonus).toFixed(1)
  );

  // Token 阶梯目标额度
  let targetQuota = 200;
  if (formulaScore < 50) targetQuota = 50;
  else if (formulaScore < 100) targetQuota = 100;
  else if (formulaScore < 150) targetQuota = 150;
  else if (formulaScore < 200) targetQuota = 200;
  else targetQuota = Math.ceil(formulaScore / 100) * 100 + 100;

  const quotaPercent = Math.min(100, Math.round((formulaScore / targetQuota) * 100));

  // 是否满足免审直通管理员标准 (修改篇数 >= 3 且综合分 >= 80)
  const canAutoPromoteToAdmin = approvedEditsCount >= PROMOTION_REQUIRED_EDITS && formulaScore >= PROMOTION_REQUIRED_SCORE;
  const adminDownvotes = user?.adminDownvotesReceived || 0;

  // Level thresholds based on formulaScore
  let level = 1;
  let levelTitle = '侍奉部见习修撰生';

  if (formulaScore >= 160) {
    level = 6;
    levelTitle = '侍奉部首席典籍档案馆长';
  } else if (formulaScore >= 120) {
    level = 5;
    levelTitle = '真物本质考据学者';
  } else if (formulaScore >= 80) {
    level = 4;
    levelTitle = '资深档案馆藏修撰官';
  } else if (formulaScore >= 45) {
    level = 3;
    levelTitle = '千叶文献拾遗员';
  } else if (formulaScore >= 20) {
    level = 2;
    levelTitle = '档案共建探索者';
  }

  return {
    totalPoints: Math.round(formulaScore * 10),
    archiveCount,
    totalLikesReceived,
    totalViewsReceived,
    totalFavoritesReceived,
    level,
    levelTitle,
    archiveCompleteness,
    viewWeight: WEIGHT_VIEW,
    likeWeight: WEIGHT_LIKE,
    favoriteWeight: WEIGHT_FAVORITE,
    viewWeightedScore,
    likeWeightedScore,
    favoriteWeightedScore,
    approvedEditsBonus,
    formulaScore,
    targetQuota,
    quotaPercent,
    approvedEditsCount,
    canAutoPromoteToAdmin,
    adminDownvotes
  };
}

export function addArchiveContribution(
  targetTitle: string,
  summary: string,
  targetType: ArchiveContribution['targetType'] = 'character'
): ArchiveContribution {
  const current = getStoredContributions();
  const newItem: ArchiveContribution = {
    id: `contrib_${Date.now()}`,
    userId: 'usr_me',
    userName: '八幡的猫罐头',
    targetType,
    targetTitle,
    summary,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    status: 'approved',
    basePoints: WEIGHT_ARCHIVE_BASE,
    likePoints: 0,
    totalPoints: WEIGHT_ARCHIVE_BASE
  };

  const updated = [newItem, ...current];
  saveContributions(updated);
  return newItem;
}

// Single-toggle like (prevents infinite liking!)
export function toggleLikeContribution(id: string): {
  updated: ArchiveContribution[];
  isLiked: boolean;
  item?: ArchiveContribution;
} {
  const { isLiked, change } = chronicleService.toggleLikeItem(`contrib_like_${id}`);
  const current = getStoredContributions();

  let targetItem: ArchiveContribution | undefined;
  const updated = current.map(item => {
    if (item.id === id) {
      const newLikes = Math.max(0, item.likes + change);
      const likePts = Number((newLikes * WEIGHT_LIKE).toFixed(2));
      const mod = {
        ...item,
        likes: newLikes,
        likePoints: likePts,
        totalPoints: item.basePoints + likePts
      };
      targetItem = mod;
      return mod;
    }
    return item;
  });

  saveContributions(updated);
  return { updated, isLiked, item: targetItem };
}

export function likeContribution(id: string): ArchiveContribution[] {
  const { updated } = toggleLikeContribution(id);
  return updated;
}
