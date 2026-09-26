import { YukinoSentiment } from '../types';

export interface EmotionCategory {
  mood: YukinoSentiment['mood'];
  moodLabel: string;
  color: string;
  keywords: string[];
  advices: string[];
}

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  {
    mood: 'truth_seeking',
    moodLabel: '真物探寻 · 叩问本质',
    color: '#0284c7', // Sky Blue
    keywords: [
      '真物', '真实', '谎言', '虚伪', '伪物', '意义', '为什么', '证明', '誓约', 
      '改变', '逃避', '执着', '追寻', '代价', '原则', '真相', '妥协', '答案'
    ],
    advices: [
      '追求不掺杂虚假的真实关系，势必伴随着打破现状的刺痛。但如果不去探寻，便只能永远栖身于谎言构筑的温室之中。既然选择直面，就请挺起胸膛走下去。',
      '想要得到真正的东西，就不能畏惧受伤。不要用随波逐流的借口来麻痹自己，你的心声比任何虚伪的体面都要珍贵。',
      '能把这种不甘与追问写下来，至少证明你没有向敷衍的现实妥协。侍奉部认可这份执着。',
      '“如果那是能够轻易被取代的关系，那从一开始就毫无意义。”——请珍视你内心那份不会妥协的清澈。'
    ]
  },
  {
    mood: 'cold_resilience',
    moodLabel: '清冷自持 · 坚毅独立',
    color: '#0d9488', // Teal
    keywords: [
      '孤单', '一个人', '独立', '坚强', '坚持', '逞强', '努力', '寒冷', '严冬', 
      '自律', '优秀', '责任', '冷静', '独自', '克制', '尊严', '骨气', '冷风'
    ],
    advices: [
      '习惯了一个人面对所有风雪，并不意味着你必须拒绝所有的善意。偶尔依靠一下身边的人，并不会折损你的坚毅。',
      '虽然克制与自律是值得称赞的品质，但也不要总是把自己逼入无路可退的死角。侍奉部的茶杯随时可以为你添满。',
      '“哪怕全世界都否定，我也要贯彻自己的正确。”——有这样的骨气很好，但别忘了在寒夜里给自己裹紧大衣。',
      '你的优秀源于对自我的苛刻，但偶尔允许自己停下深呼吸一次，才能走得更远。'
    ]
  },
  {
    mood: 'gentle_warmth',
    moodLabel: '微温红茶 · 治愈坦率',
    color: '#f59e0b', // Amber
    keywords: [
      '温暖', '感谢', '陪伴', '朋友', '喜欢', '笑容', '拥抱', '治愈', '红茶', 
      '猫', '潘先生', '珍惜', '幸福', '阳光', '释怀', '感动', '温柔', '心动'
    ],
    advices: [
      '……咳，今天文字里的温度很宜人呢。能坦率地表达珍惜，是很多人穷尽一生都未能学会的勇敢。这份温柔，请务必妥善保管好。',
      '难得看到你如此放松的心情。就像冬日午后窗边的大吉岭红茶，温度刚刚好。请保持这份从容。',
      '既然感受到了被世界接纳的微光，就不要移开视线。真实的羁绊，正是由这些微小的温暖沉淀而成的。',
      '（……稍微有点羡慕这种直率呢）。能够毫无保留地拥抱善意，本身就是一种强大的力量。'
    ]
  },
  {
    mood: 'melancholy',
    moodLabel: '千叶寒冬 · 迷惘落寞',
    color: '#64748b', // Slate
    keywords: [
      '难过', '迷茫', '痛苦', '失望', '孤独', '疲惫', '累', '遗憾', '哭', 
      '叹息', '迷失', '困惑', '绝望', '灰暗', '压抑', '无助', '碎裂'
    ],
    advices: [
      '感到迷茫和疲惫并不是什么羞耻的事。坚冰在春天消融前，也会发出痛苦的碎裂声。今天就先好好休息，不要勉强自己去寻找答案。',
      '既然心情低落，就别再强颜欢笑了。在日记里把难过倾倒干净吧，侍奉部的大门明天依旧会为你敞开。',
      '不要试图去迎合所有人，那样只会让自己支离破碎。哪怕暂时停滞不前，也比朝着错误的方向奔跑要好得多。',
      '天色越暗的时候，天桥上的灯光反而越耀眼。把今晚的叹息留在纸上，明天又是崭新的一天。'
    ]
  },
  {
    mood: 'daily_peace',
    moodLabel: '澄澈宁静 · 随想日常',
    color: '#059669', // Emerald
    keywords: [
      '天气', '初雪', '散步', '日常', '阅读', '书', '咖啡', '街角', '风景', 
      '生活', '今天', '清晨', '黄昏', '晴天', '窗边', '安静', '细雪'
    ],
    advices: [
      '平和而真切的日常，往往蕴藏着最难以被撼动的坚固力量。把平凡的观察记录下来，时间自会赋予它独特的质感。',
      '千叶的风总是带着些微的凉意，但只要脚步坚定，沿途的风景便不会辜负你的注视。',
      '没有波澜壮阔的喧嚣，只有细水长流的自省。这样安静纯粹的文字，我很喜欢。',
      '在喧嚣的都市里保持一份内心的秩序感，难能可贵。愿你今晚也能拥有一夜安眠。'
    ]
  }
];

export function analyzeYukinoSentiment(title: string, content: string, tags: string[] = []): YukinoSentiment {
  const fullText = `${title} ${content} ${tags.join(' ')}`.toLowerCase();

  if (!fullText.trim()) {
    return {
      score: 75,
      mood: 'daily_peace',
      moodLabel: '澄澈自若 · 待写提笔',
      color: '#0284c7',
      advice: '把内心的纷扰整理成文字，是审视真实自我的第一步。写下你的第一句真实心绪吧。'
    };
  }

  // 1. Calculate hit count for each category
  const scores = EMOTION_CATEGORIES.map((cat) => {
    let hits = 0;
    cat.keywords.forEach((kw) => {
      const regex = new RegExp(kw.toLowerCase(), 'g');
      const matches = fullText.match(regex);
      if (matches) {
        hits += matches.length;
      }
    });
    return { category: cat, hits };
  });

  // Sort by hit count
  scores.sort((a, b) => b.hits - a.hits);
  const bestMatch = scores[0];

  // Selected category (fallback to daily_peace if zero hits)
  const matchedCategory = bestMatch.hits > 0 ? bestMatch.category : EMOTION_CATEGORIES[4];

  // 2. Compute numeric score (0 - 100)
  // Base score 68, weighted by text length (depth of reflection) and emotional intensity
  const textLength = fullText.length;
  const depthBonus = Math.min(18, Math.floor(textLength / 40));
  const keywordIntensity = Math.min(14, bestMatch.hits * 4);
  
  let finalScore = 68 + depthBonus + keywordIntensity;
  if (matchedCategory.mood === 'truth_seeking') finalScore += 6;
  if (matchedCategory.mood === 'melancholy') finalScore = Math.max(50, finalScore - 8); // Melancholy has deeper reflective value
  finalScore = Math.min(99, Math.max(55, finalScore));

  // 3. Pick advice predictably based on text hash
  let hash = 0;
  for (let i = 0; i < fullText.length; i++) {
    hash = (hash + fullText.charCodeAt(i)) % matchedCategory.advices.length;
  }
  const advice = matchedCategory.advices[hash];

  return {
    score: finalScore,
    mood: matchedCategory.mood,
    moodLabel: matchedCategory.moodLabel,
    color: matchedCategory.color,
    advice
  };
}
