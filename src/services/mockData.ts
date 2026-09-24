import {
  Character,
  CharacterRelation,
  Season,
  Episode,
  Outfit,
  Quote,
  VoiceLine,
  GalleryItem,
  MerchItem,
  Diary,
  Post,
  User
} from '../types';

export const currentUser: User = {
  id: 'usr_001',
  username: 'yukinoshita_fan',
  nickname: '雪野原',
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=YukinoLover&backgroundColor=e0f2fe',
  bio: '愿所有伪物终将抵达真物。侍奉部常驻记录者。',
  role: 'ROLE_USER',
  email: 'yukino_record@example.com',
  isCoser: false,
  createdAt: '2025-01-15'
};

export const seasonsData: Season[] = [
  {
    id: 1,
    title: '第一季：青春恋曲之始',
    japaneseTitle: 'やはり俺の青春ラブコメはまちがっている。',
    year: '2013',
    episodeCount: 13,
    description: '侍奉部的成立与初遇。冷傲如雪的雪之下雪乃与孤僻的比企谷八幡、温暖的由比滨结衣在此交汇。'
  },
  {
    id: 2,
    title: '第二季：伪物与真物之惑',
    japaneseTitle: 'やはり俺の青春ラブコメはまちがっている。続',
    year: '2015',
    episodeCount: 13,
    description: '学生会长选举、京都修学旅行与圣诞联合活动。关系的裂痕与“我想要真物”的呐喊。'
  },
  {
    id: 3,
    title: '第三季：完结与各自的选择',
    japaneseTitle: 'やはり俺の青春ラブコメはまちがっている。完',
    year: '2020',
    episodeCount: 12,
    description: '毕业舞会企划与三人彼此的心意倾诉。雪之下雪乃迈出独立第一步，冰雪消融后的真挚告白。'
  }
];

export const yukinoData: Character = {
  id: 'char_yukino',
  name: '雪之下雪乃',
  japaneseName: '雪ノ下 雪乃',
  romaji: 'Yukinoshita Yukino',
  cv: '早见沙织 (Hayami Saori)',
  birthday: '1月3日 (摩羯座)',
  school: '总武高等学校',
  grade: '2年J班 (国际教养班)',
  club: '侍奉部 (部长)',
  avatar: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
  image: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
  summary: '总武高中的“冰之女王”。容姿端丽、学力出众，却因清冷高傲的气质独行于世。',
  description: '名门雪之下家的次女。有着极强的自尊心与责任感，信奉“能者多劳，拯救无能之人是优秀者的义务”。外表清冷理性，内心却细腻敏感，极度喜爱猫咪与潘先生（Pan-san）。在侍奉部的日常与委托中，逐渐学会向他人敞开心扉，寻找不掺杂伪饰的“真物”。',
  tags: ['侍奉部部长', '冰之女王', '完美主义', '猫咪狂热', '潘先生爱好者', '早见沙织'],
  relationWithYukino: '本人',
  color: '#38bdf8'
};

export const oregairuCharacters: Character[] = [
  yukinoData,
  {
    id: 'char_hachiman',
    name: '比企谷八幡',
    japaneseName: '比企谷 八幡',
    romaji: 'Hikigaya Hachiman',
    cv: '江口拓也',
    birthday: '8月8日',
    school: '总武高等学校',
    grade: '2年F班',
    club: '侍奉部',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Hachiman&backgroundColor=cbd5e1',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    summary: '拥有死鱼眼与独特自暴自弃哲学的独行侠，侍奉部首位被强制加入的部员。',
    description: '经历了充满创伤的过去，习惯以自伤自损的方式“解决”委托，引得雪乃与平冢老师深感痛心。渴望不被谎言粉饰的纯粹关系。',
    tags: ['死鱼眼', '比企谷哲学', '侍奉部', '真物探索者'],
    relationWithYukino: '从针锋相对到理解依靠的灵魂同行者',
    color: '#64748b'
  },
  {
    id: 'char_yui',
    name: '由比滨结衣',
    japaneseName: '由比ヶ浜 結衣',
    romaji: 'Yuigahama Yui',
    cv: '东山奈央',
    birthday: '6月18日',
    school: '总武高等学校',
    grade: '2年F班',
    club: '侍奉部',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Yui&backgroundColor=fed7aa',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    summary: '阳光开朗、体贴敏锐的侍奉部第三人，维系部室温度的不可或缺之光。',
    description: '因为做饼干的委托而与雪乃和八幡结识。虽然看起来是随大流的辣妹风，但心思极度细腻，深爱着侍奉部三人共同度过的时光。',
    tags: ['犬系少女', '氛围担当', '做饼干', '温柔的体贴'],
    relationWithYukino: '雪乃第一位真正的同龄挚友',
    color: '#fb923c'
  },
  {
    id: 'char_iroha',
    name: '一色彩羽',
    japaneseName: '一色 いろは',
    romaji: 'Isshiki Iroha',
    cv: '佐仓绫音',
    birthday: '4月16日',
    school: '总武高等学校',
    grade: '1年C班',
    club: '学生会 (会长)',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Iroha&backgroundColor=fef08a',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    summary: '天然与心机无缝切换的后辈，擅长借助可爱达成目的的新任学生会长。',
    description: '在学生会长选举委托中受到八幡的启发与引导，成为总武高新任学生会长。常以“难不成你在追求我吗，对不起”作为口头禅打趣八幡。',
    tags: ['小恶魔', '学生会长', '后辈', '巧言令色'],
    relationWithYukino: '敬畏又仰仗的前辈',
    color: '#eab308'
  },
  {
    id: 'char_haruno',
    name: '雪之下阳乃',
    japaneseName: '雪ノ下 陽乃',
    romaji: 'Yukinoshita Haruno',
    cv: '中原麻衣',
    birthday: '7月7日',
    school: '某国立大学',
    grade: '大学生',
    club: '曾任总武高学生会长',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Haruno&backgroundColor=e9d5ff',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    summary: '雪乃的亲姐姐，外表光鲜完美、交际手腕超群，内里却深沉莫测。',
    description: '继承了家族正统期待的长女。洞悉妹妹雪乃对自己的追赶与依赖，不断以严苛甚至残忍的话语戳破三人的“温情谎言”，逼迫雪乃真正独立。',
    tags: ['姐姐', '完美化身', '共依存看破者', '恶趣味'],
    relationWithYukino: '既是追求的背影，亦是心底沉重的枷锁',
    color: '#a855f7'
  },
  {
    id: 'char_shizuka',
    name: '平冢静',
    japaneseName: '平塚 静',
    romaji: 'Hiratsuka Shizuka',
    cv: '柚木凉香',
    birthday: '不详 (大龄单身女青年)',
    school: '总武高等学校',
    grade: '国语教师 / 指导顾问',
    club: '侍奉部顾问',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Shizuka&backgroundColor=fecdd3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    summary: '热血、潇洒、富有正义感的国语老师，侍奉部创立的真正幕后推手。',
    description: '开着拉风跑车、爱看热血少年漫的帅气老师。深刻理解八幡与雪乃内心的孤寂，将两人引入侍奉部，多次在关键节点点醒迷茫的他们。',
    tags: ['人生导师', '热血铁拳', '拉面爱好者', '温柔的大人'],
    relationWithYukino: '值得倾诉信赖的师长与守护者',
    color: '#f43f5e'
  }
];

export const characterRelations: CharacterRelation[] = [
  {
    id: 'rel_1',
    sourceId: 'char_yukino',
    targetId: 'char_hachiman',
    relationType: '真物寻求与恋人',
    description: '从最初部室内的尖锐反驳，到看穿彼此伤痛，经历共依存的阵痛后最终坦露心意。'
  },
  {
    id: 'rel_2',
    sourceId: 'char_yukino',
    targetId: 'char_yui',
    relationType: '无可替代的挚友',
    description: '雪乃生平第一个可以毫无防备呼唤名字、一同逛街制作甜点的挚友。'
  },
  {
    id: 'rel_3',
    sourceId: 'char_yukino',
    targetId: 'char_haruno',
    relationType: '追逐与独立之茧',
    description: '阳乃是雪乃童年时仰望的标杆，直至舞会企划中雪乃终于不再盲从姐姐的脚步。'
  },
  {
    id: 'rel_4',
    sourceId: 'char_yukino',
    targetId: 'char_shizuka',
    relationType: '引路恩师',
    description: '平冢老师将八幡带至雪乃面前，亦在雪乃迷惘时给予最坚实大人的避风港。'
  }
];

export const episodesData: Episode[] = [
  {
    id: 'ep_1_01',
    seasonId: 1,
    episodeNumber: 1,
    title: '这样他们错误的青春就拉开了帷幕。',
    japaneseTitle: 'こうして彼らのまちがった青春が始まる。',
    synopsis: '比企谷八幡因满篇牢骚的作文被平冢老师带入侍奉部，初次遇见孤高看书的雪之下雪乃。两人的理念发生猛烈冲突。',
    imageUrl: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    charactersInvolved: ['雪之下雪乃', '比企谷八幡', '平冢静'],
    keyEvents: ['侍奉部初相遇', '比企谷论无用论', '由比滨结衣做饼干委托接下']
  },
  {
    id: 'ep_1_05',
    seasonId: 1,
    episodeNumber: 5,
    title: '他又一次回到了当初来的那条路。',
    japaneseTitle: 'またしても、彼は元の居場所へ引き返す。',
    synopsis: '开学初撞击八幡自行车的豪车真相逐渐浮现，雪乃内心的负担与八幡的距离感产生微妙起伏。',
    imageUrl: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    charactersInvolved: ['雪之下雪乃', '比企谷八幡', '雪之下阳乃'],
    keyEvents: ['豪车车祸真相隐现', '川崎沙希打工事件', '雪乃的歉意与沉默']
  },
  {
    id: 'ep_1_12',
    seasonId: 1,
    episodeNumber: 12,
    title: '虽然如此，他和她和她的青春依旧是错误的。',
    japaneseTitle: 'それでも彼と彼女と彼女の青春はまちがい続ける。',
    synopsis: '文化祭筹备陷入混乱，相模南临阵退缩。雪乃过度疲劳，八幡以最冷酷的反派姿态逼出相模，挽救了闭幕式。',
    imageUrl: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
    charactersInvolved: ['雪之下雪乃', '比企谷八幡', '由比滨结衣', '相模南'],
    keyEvents: ['文化祭危机', '八幡天台自爆破局', '雪乃对八幡做法的复杂神情']
  },
  {
    id: 'ep_2_08',
    seasonId: 2,
    episodeNumber: 8,
    title: '尽管如此，比企谷八幡还是说。',
    japaneseTitle: 'それでも、比企谷八幡は。',
    synopsis: '圣诞联合活动陷入空谈怪圈。八幡在平冢老师开导下回到部室，当着雪乃与结衣的面泣诉：“我想要真物”。',
    imageUrl: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    charactersInvolved: ['雪之下雪乃', '比企谷八幡', '由比滨结衣', '平冢静'],
    keyEvents: ['八幡敞开心扉流泪', '雪乃的动容与震撼', '侍奉部共同全力协助圣诞活动']
  },
  {
    id: 'ep_3_11',
    seasonId: 3,
    episodeNumber: 11,
    title: '只有那个气味，无论在哪个季节都宣告着终结。',
    japaneseTitle: 'いつでも、その香りは終わりの季節を告げている。',
    synopsis: '在即将干涸的天桥上，八幡追上雪乃，吐露了哪怕是不讲道理、麻烦至极也要纠缠一生的誓言。雪乃回应：“请把你的生命交给我”。',
    imageUrl: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    charactersInvolved: ['雪之下雪乃', '比企谷八幡'],
    keyEvents: ['天桥真物告白', '共同办好毕业舞会誓约', '坚冰终于彻底融化']
  }
];

export const outfitsData: Outfit[] = [
  {
    id: 'outfit_uniform',
    name: '总武高中秋季正统制服',
    japaneseName: '総武高校 冬期制服',
    type: 'uniform',
    imageUrl: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
    color: '#1e293b 深海绀蓝 / 纯白 / 绯红领结',
    description: '总武高等学校的标准校服，修身的绀青色西装外套搭配白色内衬衬衫与赤红领结，下身为格纹百褶短裙。配以雪乃标志性的双侧黑发缎带。',
    firstAppearance: 'S1EP01 侍奉部初次碰面',
    seasonId: 1,
    episodeId: 'ep_1_01',
    sceneDescription: '在满溢落日微光的侍奉部教室窗边，雪乃合上手中的文库本，用清亮冷冽的声音质问眼前的闯入者。',
    linkedQuoteId: 'quote_01',
    tags: ['校服', '经典装束', '总武高中', '双马尾缎带']
  },
  {
    id: 'outfit_yukata',
    name: '夏季祭典牵牛花蓝染浴衣',
    japaneseName: '夏祭り 藍染め朝顔浴衣',
    type: 'yukata',
    imageUrl: '/src/assets/images/yukino_outfit_yukata_1790218160373.jpg',
    color: '#0284c7 浅葱冰蓝 / 靛蓝花纹 / 牙白腰带',
    description: '烟火大会之夜所穿着的传统日式浴衣，深浅交融的蓝白碎花如同夏夜落雪，长发绾起露出优雅的颈线，端庄柔美。',
    firstAppearance: 'S1EP09 夏日祭典花火大会',
    seasonId: 1,
    episodeId: 'ep_1_05',
    sceneDescription: '在祭典人群散去后的神社石阶旁，雪乃悄悄拉住八幡的衣角，罕见地流露出对喧闹与人群的不安。',
    linkedQuoteId: 'quote_03',
    tags: ['浴衣', '夏夜烟火', '温婉', '盘发姿态']
  },
  {
    id: 'outfit_winter_coat',
    name: '初雪呢绒牛角扣大衣',
    japaneseName: 'ダッフルコート＆マフラー',
    type: 'winter',
    imageUrl: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    color: '#f8fafc 雪原白 / #94a3b8 雾霾蓝围巾',
    description: '寒冬腊月雪乃常穿的纯白连帽牛角扣羊毛大衣，内搭千鸟格围巾与黑色加厚裤袜。迎风站立在雪中如同一只安静的小猫。',
    firstAppearance: 'S2EP10 新年初诣参拜',
    seasonId: 2,
    episodeId: 'ep_2_08',
    sceneDescription: '新年参拜的寒风中，雪乃双手缩在口袋里，在雪花飘落的石板道上轻声说出关于未来的愿望。',
    linkedQuoteId: 'quote_04',
    tags: ['冬装', '牛角扣', '初雪', '初诣参拜']
  },
  {
    id: 'outfit_apron',
    name: '潘先生刺绣家庭围裙',
    japaneseName: 'パンさん刺繍エプロン',
    type: 'casual',
    imageUrl: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    color: '#bae6fd 浅天蓝 / 米黄绑带',
    description: '家政课与居家料理时穿着的棉质围裙，胸口精心绣着她最挚爱的“潘先生”（Pan-san）熊猫图案，动作利落娴熟。',
    firstAppearance: 'S1EP01 家政部烘焙指导',
    seasonId: 1,
    episodeId: 'ep_1_01',
    sceneDescription: '在家庭科料理教室指导结衣烘烤曲奇饼干，虽然言语严格，却一次又一次示范正确的揉面手势。',
    tags: ['便服', '料理', '潘先生周边', '贤惠反差']
  }
];

export const quotesData: Quote[] = [
  {
    id: 'quote_01',
    japanese: '人は誰しも、己の内に隠した醜さを他人に突きつけることなどできないのだから。',
    chinese: '人无论何时，都无法将深藏在自己内心的丑陋坦然展示给别人看。',
    speaker: '雪之下雪乃',
    listener: '比企谷八幡',
    seasonId: 1,
    episodeId: 'ep_1_01',
    episodeTitle: '这样他们错误的青春就拉开了帷幕。',
    scene: '侍奉部教室初见，关于人性与孤独的辩论。',
    background: '雪乃面对八幡那套自暴自弃的独行哲学，给出了针锋相对却又同样看透世俗的冷静回应。',
    tags: ['哲学', '初见', '清冷', '真实']
  },
  {
    id: 'quote_02',
    japanese: '私は嘘が嫌いよ。ごまかしたり、欺いたり、そういうものは一切必要ないわ。',
    chinese: '我讨厌谎言。敷衍也好，蒙骗也罢，那种东西我通通都不需要。',
    speaker: '雪之下雪乃',
    seasonId: 2,
    episodeId: 'ep_2_08',
    episodeTitle: '尽管如此，比企谷八幡还是说。',
    scene: '八幡企图用自嘲自欺解决问题时，雪乃带着悲伤的质问。',
    background: '她宁愿承受孤独与真相的锋芒，也绝不容忍同伴靠编造伪物来维持脆弱的表面和谐。',
    tags: ['真物', '克制', '核心信念']
  },
  {
    id: 'quote_03',
    japanese: 'あなたのこと、よく知っているつもりだったけれど……やっぱり何も分かっていないのかもしれないわね。',
    chinese: '我本以为自己很了解你……但或许，我其实什么都没能明白呢。',
    speaker: '雪之下雪乃',
    listener: '比企谷八幡',
    seasonId: 2,
    episodeId: 'ep_2_08',
    episodeTitle: '圣诞联合活动前夕',
    scene: '学生会选举与修学旅行裂痕之后的部室对话。',
    background: '意识到彼此自以为是的默契不过是一种自我满足的幻觉，两人开始真正思考关系的本质。',
    tags: ['距离感', '心理描写', '转折点']
  },
  {
    id: 'quote_04',
    japanese: 'あなたの人生を、私にちょうだい。',
    chinese: '请把你的生命，交给我吧。',
    speaker: '雪之下雪乃',
    listener: '比企谷八幡',
    seasonId: 3,
    episodeId: 'ep_3_11',
    episodeTitle: '只有那个气味，无论在哪个季节都宣告着终结。',
    scene: '天桥风口与日暮之下，两人关于一生的托付。',
    background: '对于不善巧言令色的两人而言，这不是轻飘飘的甜言蜜语，而是一份近乎沉重却无比坚定的真物誓约。',
    tags: ['告白', '第三季巅峰', '名场面', '至高承诺']
  }
];

export const voiceLinesData: VoiceLine[] = [
  {
    id: 'voice_01',
    title: '侍奉部的宗旨',
    japaneseText: '奉仕部へようこそ。ここでは他人に頼ることを学ぶ場所ではないわ。',
    chineseText: '欢迎来到侍奉部。不过，这里可不是让人学会依赖别人的场所。',
    category: 'service_club',
    audioUrl: 'https://actions.google.com/sounds/v1/water/gentle_stream.ogg',
    duration: '0:14',
    scene: '侍奉部接待委托时严肃而端正的开场白',
    playCount: 4210
  },
  {
    id: 'voice_02',
    title: '偶遇猫咪时的温柔失守',
    japaneseText: 'あ……猫……。ふふ、いい子ね、毛並みがとても綺麗。',
    chineseText: '啊……猫咪……。呵呵，真乖呢，毛发摸起来好柔顺。',
    category: 'daily',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/chimes.ogg',
    duration: '0:09',
    scene: '平日清冷威严的雪乃在路边偶遇白猫时的反差萌',
    playCount: 8930
  },
  {
    id: 'voice_03',
    title: '关于真物的自白',
    japaneseText: '嘘のないものを求めるのは、そんなに間違っていることかしら？',
    chineseText: '追求没有谎言的事物，难道是一件如此不可理喻的事吗？',
    category: 'monologue',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/snow_storm.ogg',
    duration: '0:18',
    scene: '在风雪漫天的车站长椅上的独白',
    playCount: 6540
  },
  {
    id: 'voice_04',
    title: '天桥终曲的誓言',
    japaneseText: 'あなたの人生を、私に預けてほしいの。責任は……私が持つから。',
    chineseText: '我想让你把人生托付给我。相应的责任……我会全盘背负。',
    category: 'emotional',
    audioUrl: 'https://actions.google.com/sounds/v1/water/lake_waves_at_night.ogg',
    duration: '0:22',
    scene: '完结篇天桥告白名场面早见沙织名声线',
    playCount: 15200
  }
];

export const galleryData: GalleryItem[] = [
  {
    id: 'gal_01',
    title: '雪落总武高 · 冬晨独览',
    category: 'official',
    imageUrl: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
    aspectRatio: 'portrait',
    author: '官方主视觉画师',
    source: 'TV动画第三季角色原案集',
    likes: 1240,
    favorites: 890,
    tags: ['雪之下雪乃', '冬晨', '校服', '纯白']
  },
  {
    id: 'gal_02',
    title: '冰蓝深处 · 远眺冬城之雪',
    category: 'wallpaper',
    imageUrl: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    aspectRatio: 'landscape',
    author: 'Art Direction Team',
    source: '雪之下雪乃概念壁纸库',
    likes: 2150,
    favorites: 1680,
    tags: ['雪景', '壁纸', '氛围感', '清冷']
  },
  {
    id: 'gal_03',
    title: '夏祭夜花火 · 牵牛花之恋',
    category: 'novel',
    imageUrl: '/src/assets/images/yukino_outfit_yukata_1790218160373.jpg',
    aspectRatio: 'portrait',
    author: 'Ponkan⑧ 原作插图',
    source: '小学馆GAGAGA文库插图集',
    likes: 1890,
    favorites: 1420,
    tags: ['浴衣', '夏日祭', '插画', 'Ponkan8']
  },
  {
    id: 'gal_04',
    title: '黄昏斜阳 · 侍奉部旧日光景',
    category: 'screenshot',
    imageUrl: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    aspectRatio: 'landscape',
    author: 'Feel. 动画制作组',
    source: '动画第二季第8话高保真截帧',
    likes: 980,
    favorites: 730,
    tags: ['部室', '夕阳', '空镜头', '怀旧']
  },
  {
    id: 'gal_05',
    title: 'Coser作品 · 雪中伫立的猫系少女',
    category: 'coser',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 'portrait',
    author: 'Coser 浅羽由乃',
    authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Asaba&backgroundColor=e0f2fe',
    source: 'CP30 场照精修',
    likes: 1560,
    favorites: 1100,
    tags: ['Cosplay', '雪景', '雪之下雪乃', '正片'],
    isCoserWork: true
  },
  {
    id: 'gal_06',
    title: 'Coser作品 · 茶香与文库本的午后',
    category: 'coser',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 'portrait',
    author: 'Coser 雾岛七海',
    authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Kirishima&backgroundColor=fed7aa',
    source: '个人Cosplay影集《雪之音》',
    likes: 1320,
    favorites: 940,
    tags: ['Cosplay', '教室', '文库本', '日光'],
    isCoserWork: true
  }
];

export const merchData: MerchItem[] = [
  {
    id: 'merch_01',
    name: 'SHIBUYA SCRAMBLE 纯白花嫁 1/7 手办',
    category: 'figure',
    manufacturer: 'eStream / SSF',
    releaseDate: '2023年3月',
    price: '¥ 1,980 (参考)',
    imageUrl: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
    description: '身披淡蓝水晶质感的花嫁婚纱，长发如瀑散落，手中捧着雪白花束，回眸一瞬的神态极尽温婉。',
    scale: '1/7 比例模型 (高约27cm)',
    status: 'released'
  },
  {
    id: 'merch_02',
    name: 'Kotobukiya 寿屋 制服Ver. 复刻版',
    category: 'figure',
    manufacturer: '寿屋 (Kotobukiya)',
    releaseDate: '2021年12月',
    price: '¥ 680 (参考)',
    imageUrl: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    description: '坐在木质课桌上的经典造型，手中拿着书籍，眼神清澈而坚定，还原了第一季动画中的初见震撼。',
    scale: '1/8 比例模型',
    status: 'released'
  },
  {
    id: 'merch_03',
    name: '千叶限定 Pan-san 潘先生巨型毛绒公仔',
    category: 'apparel',
    manufacturer: 'TBS Animation Store',
    releaseDate: '2022年6月',
    price: '¥ 320',
    imageUrl: '/src/assets/images/yukino_outfit_yukata_1790218160373.jpg',
    description: '雪之下雪乃最痴迷的吉祥物潘先生（Pan-san）官方原尺寸复刻，拥有标志性的慵懒呆萌表情与超柔亲肤触感。',
    status: 'released'
  },
  {
    id: 'merch_04',
    name: 'Ponkan⑧ 画集《雪乃之刻》原画收藏册',
    category: 'book',
    manufacturer: '小学馆',
    releaseDate: '2021年4月',
    price: '¥ 260',
    imageUrl: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    description: '收录轻小说全14卷加番外全部彩色插图、未公开黑白稿件及早见沙织采访纪念对谈。',
    status: 'released'
  }
];

export const diariesData: Diary[] = [
  {
    id: 'diary_01',
    title: '今天千叶下了今年的第一场细雪',
    content: `清晨拉开窗帘时，屋檐已经积了一层薄薄的粉雪。
空气干冷而澄净，呼吸间能看到白色的雾气缓慢散开。

重新看完了《春物》第三季第11话。天桥上八幡追上去的那一段，即使看了无数遍，依然会被那种近乎固执的坦诚所击中。雪乃说：“请把你的生命交给我”，那是她能想到的最郑重、也最没有退路的真物证明。

我们常常害怕把内心的软弱展现给别人，宁愿缩在坚硬的冰壳里。可是如果不去打破那层虚妄的保护，又怎么能触碰到真正温暖的双手呢？

希望在这个冬天，每个人都能找到自己不会妥协的真物。`,
    coverImage: '/src/assets/images/yukino_hero_snow_1790218140649.jpg',
    date: '2026-01-03',
    weather: '初雪 · 零下2°C',
    tags: ['春物重温', '千叶随笔', '冬雪', '真物'],
    isPublic: true,
    views: 452
  },
  {
    id: 'diary_02',
    title: '关于建立这间“雪乃数字档案馆”的初衷',
    content: `很多人问我，为什么要在满大街都是模板网站的时代，单独花费这么长时间为雪乃搭建一个具有液态玻璃与Apple设计语言的独立站点？

我的回答是：因为她值得一个体面的居所。

动漫人物不是冷冰冰的百科条目，那些随季节更迭的校服与浴衣、那些在夕阳部室里未说出口的叹息、早见沙织声线里微妙的颤动，都是值得被如艺术品般珍藏的吉光片羽。

在这个网站里，我将个人生活记录、日记、社区动态与雪乃档案融为一体。它不仅是我的避风港，也是喜欢雪乃和春物的朋友们的一处静谧茶室。`,
    coverImage: '/src/assets/images/oregairu_clubroom_window_1790218170510.jpg',
    date: '2025-12-25',
    weather: '晴朗 · 5°C',
    tags: ['建站随笔', '设计理念', '数字档案'],
    isPublic: true,
    views: 680
  }
];

export const communityPosts: Post[] = [
  {
    id: 'post_01',
    userId: 'usr_coser_01',
    userName: '浅羽由乃',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Asaba&backgroundColor=e0f2fe',
    userRole: 'ROLE_COSER',
    isCoser: true,
    coserCN: '浅羽由乃',
    content: '「即使那是个错误的选择，我们也在一同找寻属于自己的答案。」\n今天在老校舍拍了雪乃的冬制服正片！千叶的初冬风真的很大，但戴上围巾那一瞬间，仿佛真的听到了部室里推开拉门的声响。开放申请本套图的专属 To 签啦，可以在下方点击直接定制~ ✨',
    images: [
      '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
      '/src/assets/images/yukino_hero_snow_1790218140649.jpg'
    ],
    createdAt: '2小时前',
    likes: 348,
    commentsCount: 42,
    favorites: 189,
    tags: ['Cosplay正片', '雪之下雪乃', '冬日校服', 'To签开放中']
  },
  {
    id: 'post_02',
    userId: 'usr_collector',
    userName: '潘先生头号粉丝',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Panda&backgroundColor=fef08a',
    userRole: 'ROLE_USER',
    content: '终于收到了SSF这只纯白花嫁雪乃！面相还原度超越预期，尤其是眼眸处透出的水光感和早见沙织角色的清冷感拿捏得恰到好处。摆在书桌前，连打代码都变得心平气和了。',
    images: [
      '/src/assets/images/yukino_outfit_yukata_1790218160373.jpg'
    ],
    createdAt: '昨天 19:40',
    likes: 195,
    commentsCount: 16,
    favorites: 78,
    tags: ['手办开箱', '花嫁雪乃', '周边收藏']
  }
];

export const initialChatMessages = [
  {
    id: 'msg_01',
    userId: 'bot_yukino',
    userName: '雪之下雪乃',
    userAvatar: '/src/assets/images/yukino_portrait_editorial_1790218150964.jpg',
    content: '欢迎来到总武高侍奉部。如果有什么烦恼或委托，可以写在留言簿上。当然，我不保证每一件无聊的事都会插手。',
    timestamp: '19:30',
    isSelf: false,
    type: 'text' as const
  },
  {
    id: 'msg_02',
    userId: 'usr_hachiman_fan',
    userName: '千叶比企谷',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Hachiman&backgroundColor=cbd5e1',
    content: '只要不让我去跟陌生人搭话，我倒是不介意在角落里喝麦茶。',
    timestamp: '19:32',
    isSelf: false,
    type: 'text' as const
  },
  {
    id: 'msg_03',
    userId: 'usr_001',
    userName: '雪野原',
    userAvatar: currentUser.avatar,
    content: '今天网站的液态玻璃与To签功能刚刚完成了升级测试！大家觉得新的UI体验顺畅吗？',
    timestamp: '19:35',
    isSelf: true,
    type: 'text' as const
  }
];
