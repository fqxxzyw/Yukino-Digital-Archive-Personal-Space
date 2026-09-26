import { ArchiveContribution, ContributionSummary } from '../types';

export const WEIGHT_ARCHIVE = 50; // 每补全一条档案 +50 贡献值
export const WEIGHT_LIKE = 10;    // 每获得 1 个社区点赞 +10 贡献值

// 用户定制的精准加权贡献度法则：贡献度 = (档案补全度 * 0.4) + (获得的被点赞总数 * 0.6)
export const FORMULA_ARCHIVE_WEIGHT = 0.4;
export const FORMULA_LIKE_WEIGHT = 0.6;

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
    likePoints: 120,
    totalPoints: 170
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
    likePoints: 80,
    totalPoints: 130
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
    likePoints: 240,
    totalPoints: 290
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
    likePoints: 190,
    totalPoints: 240
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
    likePoints: 310,
    totalPoints: 360
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
    likePoints: 150,
    totalPoints: 200
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
    likePoints: 450,
    totalPoints: 500
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

export function calculateContributionSummary(list: ArchiveContribution[]): ContributionSummary {
  const archiveCount = list.length;
  const totalLikesReceived = list.reduce((sum, item) => sum + item.likes, 0);
  const totalPoints = list.reduce((sum, item) => sum + item.totalPoints, 0);

  // 档案补全度 (百分比): 基于系统设定的 8 条核心维度考据基准 (人物、世界观、剧情、画集)
  // 随着用户新增补全词条，补全度稳步攀升，最高达 100%
  const archiveCompleteness = Math.min(100, Math.round((archiveCount / 8) * 100));

  // 核心计算公式：贡献度 = (档案补全度 * 0.4) + (获得的被点赞总数 * 0.6)
  const archiveWeightedScore = Number((archiveCompleteness * FORMULA_ARCHIVE_WEIGHT).toFixed(1));
  const likeWeightedScore = Number((totalLikesReceived * FORMULA_LIKE_WEIGHT).toFixed(1));
  const formulaScore = Number((archiveWeightedScore + likeWeightedScore).toFixed(1));

  // Token 阶梯目标额度 (Token Quota & Usage UI 模式)
  let targetQuota = 200;
  if (formulaScore < 50) targetQuota = 50;
  else if (formulaScore < 100) targetQuota = 100;
  else if (formulaScore < 150) targetQuota = 150;
  else if (formulaScore < 200) targetQuota = 200;
  else targetQuota = Math.ceil(formulaScore / 100) * 100 + 100;

  const quotaPercent = Math.min(100, Math.round((formulaScore / targetQuota) * 100));

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
    totalPoints,
    archiveCount,
    totalLikesReceived,
    level,
    levelTitle,
    archiveCompleteness,
    archiveFormulaWeight: FORMULA_ARCHIVE_WEIGHT,
    likeFormulaWeight: FORMULA_LIKE_WEIGHT,
    archiveWeightedScore,
    likeWeightedScore,
    formulaScore,
    targetQuota,
    quotaPercent,
    archiveWeight: WEIGHT_ARCHIVE,
    likeWeight: WEIGHT_LIKE
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
    basePoints: WEIGHT_ARCHIVE,
    likePoints: 0,
    totalPoints: WEIGHT_ARCHIVE
  };

  const updated = [newItem, ...current];
  saveContributions(updated);
  return newItem;
}

export function likeContribution(id: string): ArchiveContribution[] {
  const current = getStoredContributions();
  const updated = current.map(item => {
    if (item.id === id) {
      const newLikes = item.likes + 1;
      const likePts = newLikes * WEIGHT_LIKE;
      return {
        ...item,
        likes: newLikes,
        likePoints: likePts,
        totalPoints: item.basePoints + likePts
      };
    }
    return item;
  });

  saveContributions(updated);
  return updated;
}
