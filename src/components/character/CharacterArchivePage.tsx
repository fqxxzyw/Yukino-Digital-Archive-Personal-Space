import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Clock, Shirt, Quote as QuoteIcon, Volume2, 
  ShoppingBag, ChevronRight, Play, Heart, Calendar, 
  Layers, ArrowLeft, ArrowRight, MessageSquare, History, 
  Sparkles, Shield, GitFork, User as UserIcon
} from 'lucide-react';
import { 
  Character, Season, Episode, Outfit, Quote, VoiceLine, 
  MerchItem, User, CharacterRelation 
} from '../../types';
import { api } from '../../services/api';
import { CHARACTER_ID_TO_SLUG, CHARACTER_SLUG_MAP } from '../../services/chronicleService';
import { InlineDiscussionThread } from '../common/InlineDiscussionThread';

interface CharacterArchivePageProps {
  characterId: string;
  characters: Character[];
  seasons: Season[];
  episodes: Episode[];
  outfits: Outfit[];
  quotes: Quote[];
  voiceLines: VoiceLine[];
  merch: MerchItem[];
  currentUser: User;
  onNavigateToCharacter: (charId: string) => void;
  onBackToCharacterList: () => void;
  onPlayVoice?: (index: number) => void;
  onUpdateEpisode?: (ep: Episode) => void;
}

export const CharacterArchivePage: React.FC<CharacterArchivePageProps> = ({
  characterId,
  characters,
  seasons,
  episodes,
  outfits: globalOutfits,
  quotes: globalQuotes,
  voiceLines: globalVoiceLines,
  merch,
  currentUser,
  onNavigateToCharacter,
  onBackToCharacterList,
  onPlayVoice,
  onUpdateEpisode
}) => {
  const character = useMemo(() => {
    return characters.find(c => c.id === characterId) || characters[0];
  }, [characters, characterId]);

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'timeline' | 'outfits' | 'quotes' | 'voices' | 'discussion'>('profile');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // Dynamic growth text & psychology state
  const [bioText, setBioText] = useState(character.description);
  const [psychologyText, setPsychologyText] = useState(() => {
    if (character.id === 'char_yukino') {
      return '雪乃对八幡的信任是在相处过程中逐渐形成的，第二季部分剧情中才表现得更加明显。最初在特别栋部室里，她以极高的智识和尖锐的言辞作为防御盾牌，本能地排斥任何虚伪的温情。直到经历了学生会选举的挫折、修学旅行伪告白的刺痛，以及第八集八幡落泪坦白“我想要真物”，雪乃心中的冰壁才真正出现裂痕。';
    }
    if (character.id === 'char_hachiman') {
      return '比企谷八幡习惯将自我厌弃作为武器，以“自爆”的方式去解决委派给侍奉部的纷争，以为只要自己成为千夫所指的罪人，就能成全周遭的表面和谐。然而这种残忍的伪恶在雪乃与平冢静面前被无情拆穿。第八集中的“真物宣言”，标志着他第一次放弃了自洽的独行遁词，渴望一段无需揣摩、经得起彻底怀疑的真实连结。';
    }
    if (character.id === 'char_yui') {
      return '由比滨结衣是侍奉部最温暖也最敏锐的雷达。她深知八幡与雪乃之间那份近乎病态的纯粹，也预见到了三人关系必将走向终结的命运。她的心理挣扎在于“既想守护三人静止的温情，又渴望真正走进八幡的内心”。水族馆与第三季长椅上的眼泪，是她从随波逐流的迎合者蜕变为敢于坦白贪婪与真心的标志。';
    }
    return `${character.name}在总武高中的故事中扮演着无可替代的角色。其心理变化的轨迹与侍奉部的每一次委托密切相连。`;
  });

  const [growthText, setGrowthText] = useState(() => {
    if (character.id === 'char_yukino') {
      return '从第一季中坚信“优秀者背负拯救无能者义务”的孤高清冷，到第二季中面对学生会选举和共依存困境时的迷惘无助，再到第三季中独立承办舞会企划并勇敢对八幡袒露内心：“请把你的生命交给我”。雪乃的成长不是向世俗妥协，而是在保留对真物执着的同时，学会了坦然接受他人的陪伴。';
    }
    if (character.id === 'char_hachiman') {
      return '从开学时宣扬“青春是谎言与邪恶”的独行侠，到文化祭天台的孤立者，再到千叶美滨天桥上追上雪乃说出“请允许我介入你的人生”。八幡的成长是学会了承认孤独并非勋章，而是逃避伤害的掩体。他终于放下了算计与冷眼，选择勇敢地背负起他人的痛苦。';
    }
    return `${character.summary}，在经历了一系列委托与日常磨砺后，逐渐找到了自己立足于世界的坐标。`;
  });

  // Character specific milestones / timeline
  const timelineMilestones = useMemo(() => {
    if (character.id === 'char_hachiman') {
      return [
        {
          id: 'time_hachiman_01',
          season: '第一季',
          title: '违规随笔与侍奉部的初次交锋',
          desc: '因写出“青春是谎言与邪恶”被平冢老师带入侍奉部，与雪之下雪乃就孤独与人性的虚伪针锋相对。',
          quote: '孤独的人才不需要同情，因为他们早就习惯了独行。'
        },
        {
          id: 'time_hachiman_02',
          season: '第一季',
          title: '文化祭闭幕天台“罪人自爆”',
          desc: '相模南失踪导致文化祭停滞，八幡以最恶毒的反派面孔逼她回到舞台，以一己恶名换取了仪式顺利进行。',
          quote: '只要大家都有一个共同憎恨的坏人，世界就能运转了。'
        },
        {
          id: 'time_hachiman_03',
          season: '第二季',
          title: '部室中泣诉：我想要真物',
          desc: '在假意维持表面温情的危机中，八幡终于抛弃了借口，在雪乃与结衣面前袒露了渴望真挚不掺假的灵魂呐喊。',
          quote: '我并不渴望被理解，我想要的……是毫无伪饰的真物。'
        },
        {
          id: 'time_hachiman_04',
          season: '第三季',
          title: '千叶美滨天桥的真挚羁绊之约',
          desc: '追上准备独自承担一切的雪乃，说出“请允许我介入你的人生，把你的麻烦分给我”。',
          quote: '哪怕麻烦透顶、毫无道理，我也想要继续参与下去。'
        }
      ];
    }
    if (character.id === 'char_yui') {
      return [
        {
          id: 'time_yui_01',
          season: '第一季',
          title: '焦黑曲奇与融入侍奉部',
          desc: '为了给喜欢的人做曲奇来到特别栋，被雪乃认真严厉的执着所折服，成为了维系部室温度的第一缕阳光。',
          quote: '雪乃酱，我也想努力成为像你一样帅气的人！'
        },
        {
          id: 'time_yui_02',
          season: '第二季',
          title: '三人关系的守护者与撕扯',
          desc: '敏锐察觉到八幡自伤做法带来的裂痕与雪乃的动摇，竭尽全力用温柔与甜点粉饰太平，却也陷入痛苦。',
          quote: '我只要维持现状就好……哪怕是谎言我也甘愿。'
        },
        {
          id: 'time_yui_03',
          season: '第三季',
          title: '我全部都想要：不愿放手的真实愿景',
          desc: '面对终局，结衣在公园的长椅上哭泣过后，依然勇敢说出“我既想要八幡，也绝不放弃雪乃酱”。',
          quote: '贪心又有什么错呢？因为我是个卑劣的孩子啊。'
        }
      ];
    }
    if (character.id === 'char_iroha') {
      return [
        {
          id: 'time_iroha_01',
          season: '第二季',
          title: '被推上风口浪尖的学生会长选举',
          desc: '因恶作剧被推举为会长候选人，慌乱中求助于侍奉部。八幡以独特的“成为会长其实很耀眼”说辞打动了她。',
          quote: '难不成学长你在打我的主意吗？对不起稍微有点接受不了……'
        },
        {
          id: 'time_iroha_02',
          season: '第二季',
          title: '圣诞跨校联合活动上的蜕变',
          desc: '面对玉绳的空谈会议陷入被动，在八幡与侍奉部的支持下逐渐找到了做会长的底气与领导力。',
          quote: '学长，你要对把原本任性的我推上会长位置负起责任来哦。'
        },
        {
          id: 'time_iroha_03',
          season: '第三季',
          title: '毕业舞会企划与幕后神助攻',
          desc: '联合八幡推动“双舞会竞争”方案，成为帮助雪乃与八幡直面彼此心意的关键催化剂。',
          quote: '就算未来充满了麻烦，也请前辈不要轻易放弃。'
        }
      ];
    }
    return [
      {
        id: `time_${character.id}_01`,
        season: '第一季',
        title: `${character.name} · 初见与日常交汇`,
        desc: `${character.summary}，在侍奉部的委托与总武高的日常中展现出鲜明的人格魅力。`,
        quote: '每一个孤独的灵魂，都在以自己的方式寻找答案。'
      },
      {
        id: `time_${character.id}_02`,
        season: '第二/三季',
        title: `${character.name} · 思想碰撞与转变`,
        desc: `${character.description}，其行为准则对八幡与雪乃的世界观形成了深刻的镜像映照。`,
        quote: '正因为心路历程不同，真实的理解才弥足珍贵。'
      }
    ];
  }, [character]);

  // Outfits matching character
  const characterOutfits = useMemo(() => {
    if (character.id === 'char_yukino') return globalOutfits;
    if (character.id === 'char_hachiman') {
      return [
        {
          id: 'outfit_hachiman_01',
          name: '总武高男子深绀色西装校服',
          japaneseName: '総武高校男子制服',
          type: 'uniform' as const,
          imageUrl: character.avatar,
          color: '#1e293b 绀青色 / 白衬衫',
          description: '永远略显松垮的制服衬衫领口，搭配绀青色外套。标志性的死鱼眼与双手插兜姿态。',
          firstAppearance: 'S1EP01 侍奉部初相遇',
          seasonId: 1,
          episodeId: 'ep_1_01',
          sceneDescription: '在特别栋教室靠窗位置，懒散地看着窗外操场与被风吹拂的树影。',
          tags: ['制服', '死鱼眼', '日常常服']
        },
        {
          id: 'outfit_hachiman_02',
          name: '冬日深灰羊毛连帽大衣与围巾',
          japaneseName: '冬期ダッフルコート',
          type: 'casual' as const,
          imageUrl: character.avatar,
          color: '#475569 深烟灰 / 墨蓝围巾',
          description: '在千叶海风呼啸的深冬，八幡常穿的保暖防风连帽大衣，围着朴素的墨灰针织围巾。',
          firstAppearance: 'S3EP11 千叶美滨天桥',
          seasonId: 3,
          episodeId: 'ep_3_11',
          sceneDescription: '奔跑在暮色苍茫的千叶站前天桥，迎着寒风追上雪乃。',
          tags: ['冬装', '天桥告白', '名场面']
        }
      ];
    }
    if (character.id === 'char_yui') {
      return [
        {
          id: 'outfit_yui_01',
          name: '单丸子头与粉色针织开衫制服',
          japaneseName: 'ピンクカーディガン制服',
          type: 'uniform' as const,
          imageUrl: character.avatar,
          color: '#fbcfe8 樱粉 / 浅米黄',
          description: '俏皮的右侧单丸子头发型，领口系带微微松开，下穿粉色针织开衫，散发犬系少女的阳光活力。',
          firstAppearance: 'S1EP01 焦黑饼干委托',
          seasonId: 1,
          episodeId: 'ep_1_01',
          sceneDescription: '在部室端坐在木椅上，有些害羞地捧着自己亲手烘烤的焦黑曲奇。',
          tags: ['制服', '团子头', '温暖阳光']
        },
        {
          id: 'outfit_yui_02',
          name: '夏日祭典茜红落樱短款浴衣',
          japaneseName: '夏祭り茜色浴衣',
          type: 'casual' as const,
          imageUrl: character.avatar,
          color: '#f43f5e 绯红 / 鹅黄腰带',
          description: '温暖的绯红色短款碎花浴衣，手持金鱼袋，在祭典灯笼下展露真挚又带有一丝落寞的笑容。',
          firstAppearance: 'S1EP09 烟火大会',
          seasonId: 1,
          episodeId: 'ep_1_05',
          sceneDescription: '烟花盛开的夜空下，静静走在八幡身侧，轻声倾诉心绪。',
          tags: ['浴衣', '夏祭', '祭典名篇']
        }
      ];
    }
    if (character.id === 'char_iroha') {
      return [
        {
          id: 'outfit_iroha_01',
          name: '暖黄色针织毛衣外套与会长缎带',
          japaneseName: 'イエローニット生徒会長制服',
          type: 'uniform' as const,
          imageUrl: character.avatar,
          color: '#fef08a 浅鹅黄 / 绀青',
          description: '略长于手腕的浅米黄针织开衫，袖口盖过半只手掌，尽显小恶魔后辈的可爱心机穿搭。',
          firstAppearance: 'S2EP04 会长选举',
          seasonId: 2,
          episodeId: 'ep_2_04',
          sceneDescription: '在学生会办公室将双手背在身后，微微歪头看着八幡打趣。',
          tags: ['学生会长', '后辈萌', '心机可爱']
        }
      ];
    }
    return [
      {
        id: `outfit_${character.id}_01`,
        name: `${character.name} · 代表常服造型`,
        japaneseName: '代表日常服',
        type: 'casual' as const,
        imageUrl: character.avatar,
        color: '#64748b 灰蓝',
        description: `极具${character.name}象征色彩的代表装束，彰显其在总武高中的个人风格。`,
        firstAppearance: '全季动画日常登场',
        seasonId: 1,
        episodeId: 'ep_1_01',
        sceneDescription: '总武高中的日常与活动场景。',
        tags: ['经典常服', '代表造型']
      }
    ];
  }, [character, globalOutfits]);

  // Quotes matching character
  const characterQuotes = useMemo(() => {
    if (character.id === 'char_yukino') return globalQuotes;
    if (character.id === 'char_hachiman') {
      return [
        {
          id: 'quote_hachiman_01',
          japanese: '本物が、欲しい。',
          chinese: '我……想要真物。',
          speaker: '比企谷八幡',
          listener: '雪之下雪乃 / 由比滨结衣',
          seasonId: 2,
          episodeId: 'ep_2_08',
          episodeTitle: '尽管如此，比企谷八幡还是说。',
          scene: '第二季第8话 · 侍奉部特别栋教室',
          background: '八幡第一次在他人面前卸下所有自我防御，流下眼泪说出心中最渴望的羁绊。',
          tags: ['真物宣言', '全剧灵魂', '至高名场面']
        },
        {
          id: 'quote_hachiman_02',
          japanese: '誰かを傷つけない優しさなんて、どこにもないんだ。',
          chinese: '不存在不伤害任何人的温柔，所谓的妥协不过是软弱的逃避。',
          speaker: '比企谷八幡',
          listener: '平冢静 / 相模南',
          seasonId: 1,
          episodeId: 'ep_1_12',
          episodeTitle: '这样他们的祭典就结束了。',
          scene: '第一季第12话 · 文化祭天台',
          background: '看透了世人借“温柔”之名的互相推诿，选择成为唯一的靶子。',
          tags: ['比企谷哲学', '自爆伪恶', '痛心']
        },
        {
          id: 'quote_hachiman_03',
          japanese: '君の人生を、俺にくれないか。責任は俺が持つから。',
          chinese: '能不能把你的麻烦、你的人生，全都交给我。',
          speaker: '比企谷八幡',
          listener: '雪之下雪乃',
          seasonId: 3,
          episodeId: 'ep_3_11',
          episodeTitle: '只有那个气味，无论在哪个季节都宣告着终结。',
          scene: '第三季第11话 · 千叶天桥夕阳下',
          background: '摒弃了所有借口，不讲道理也要与雪乃纠缠一生的真挚承诺。',
          tags: ['告白', '天桥誓约', '圆满']
        }
      ];
    }
    if (character.id === 'char_yui') {
      return [
        {
          id: 'quote_yui_01',
          japanese: '全部、欲しいの。私、狡いから。',
          chinese: '我全部都想要。因为……我是个狡猾的孩子啊。',
          speaker: '由比滨结衣',
          listener: '比企谷八幡 / 雪之下雪乃',
          seasonId: 2,
          episodeId: 'ep_2_13',
          episodeTitle: '春风吹散冰雪之前。',
          scene: '第二季第13话 · 水族馆夕暮',
          background: '在面对即将破碎的三人关系时，结衣鼓起勇气坦白了自己不愿割舍任何一方的贪心。',
          tags: ['贪心', '眼泪', '温柔的坚韧']
        },
        {
          id: 'quote_yui_02',
          japanese: 'ゆきのんの手、冷たいね。でも、すごく優しい。',
          chinese: '雪乃酱的手好冰凉呢。但是，真的好温柔。',
          speaker: '由比滨结衣',
          listener: '雪之下雪乃',
          seasonId: 1,
          episodeId: 'ep_1_05',
          episodeTitle: '夏祭烟火大会',
          scene: '第一季第9话 · 烟火大会归途',
          background: '看穿了雪乃表面坚冰下的脆弱与善良，紧紧握住她的手给予温暖。',
          tags: ['羁绊', '微温', '挚友']
        }
      ];
    }
    if (character.id === 'char_iroha') {
      return [
        {
          id: 'quote_iroha_01',
          japanese: '先輩、責任取ってくださいね。',
          chinese: '前辈，要对擅自改变我人生的这件事，好好负起责任来哦。',
          speaker: '一色彩羽',
          listener: '比企谷八幡',
          seasonId: 2,
          episodeId: 'ep_2_04',
          episodeTitle: '学生会长选举',
          scene: '第二季第4话 · 黄昏回家的电车站台',
          background: '半开玩笑半认真的口吻中，流露出对八幡无可替代的依赖与心意。',
          tags: ['小恶魔', '撒娇', '羁绊']
        }
      ];
    }
    return [
      {
        id: `quote_${character.id}_01`,
        japanese: '真実は時に残酷だが、偽りよりはマシだ。',
        chinese: `${character.name}的经典箴言：真相有时是残酷的，但总好过虚伪的粉饰。`,
        speaker: character.name,
        seasonId: 1,
        episodeId: 'ep_1_01',
        episodeTitle: '总武高青春见闻',
        scene: '日常委托与观念碰撞',
        background: '代表了角色的核心性格底色。',
        tags: ['经典名句', '角色信条']
      }
    ];
  }, [character, globalQuotes]);

  // Character specific relations
  const characterRelationsList = useMemo(() => {
    const all = api.getRelations();
    return all.filter(r => r.sourceId === character.id || r.targetId === character.id);
  }, [character]);

  const episodesInvolved = useMemo(() => {
    return episodes.filter(e => 
      e.seasonId === selectedSeason && 
      (e.charactersInvolved?.some(name => name.includes(character.name.slice(0, 2)) || character.name.includes(name)) || true)
    );
  }, [episodes, selectedSeason, character]);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* 1. Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={onBackToCharacterList}
            className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回登场人物档案馆列表</span>
          </button>
          <span>/</span>
          <span>春物世界</span>
          <span>/</span>
          <span className="font-semibold text-slate-800">{character.name} 独立档案</span>
        </div>

        {/* URL Path Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-mono text-[11px] border border-slate-200/60">
          <span>/anime/oregairu/characters/{CHARACTER_ID_TO_SLUG[character.id] || character.id}</span>
        </div>
      </div>

      {/* 2. Quick Character Switcher (Ribbon) */}
      <div className="p-2 rounded-2xl liquid-glass border border-white/80 overflow-x-auto no-scrollbar shadow-2xs">
        <div className="flex items-center gap-2 min-w-max px-1">
          <span className="text-[11px] font-medium text-slate-400 font-mono pl-1 pr-2 uppercase">
            人物切换：
          </span>
          {characters.map((c) => {
            const isCurrent = c.id === character.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  onNavigateToCharacter(c.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isCurrent 
                    ? 'bg-sky-600 text-white font-medium shadow-xs scale-102' 
                    : 'bg-white/70 hover:bg-white text-slate-700 hover:text-sky-800 border border-slate-200/60'
                }`}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/60"
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hero Header Banner (Consistent with Yukino Archive Style) */}
      <section className="relative rounded-3xl overflow-hidden liquid-glass border border-white/90 p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Portrait Image with glass border */}
          <div className="relative group shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-md relative">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono border border-white/20">
              CV: {character.cv}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="font-mono text-sky-600 font-bold uppercase tracking-wider">
                CHARACTER ARCHIVE · {character.romaji}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{character.japaneseName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-editorial-mincho">
              {character.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-light max-w-2xl">
              {character.summary}
            </p>

            {/* Badges / Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-medium border border-sky-100">
                {character.school} · {character.grade}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80">
                {character.club}
              </span>
              {character.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.8 rounded-full bg-white/80 text-slate-600 text-xs border border-slate-200/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Subtab Navigation (Zero pill, clean tab bar) */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-200/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: '档案生平与深度考据', icon: BookOpen },
            { id: 'timeline', label: '经历编年史', icon: Clock },
            { id: 'outfits', label: '代表服饰', icon: Shirt },
            { id: 'quotes', label: '经典语录', icon: QuoteIcon },
            ...(character.id === 'char_yukino' ? [{ id: 'voices', label: '角色名台词原声', icon: Volume2 }] : []),
            { id: 'discussion', label: '全档案总讨论', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Tab Content Panels */}
      <AnimatePresence mode="wait">
        
        {/* SUBTAB 1: Profile & Psychological Evolution */}
        {activeSubTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Basic Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl liquid-glass border border-white/80">
                <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">生日</span>
                <span className="text-sm font-semibold text-slate-800">{character.birthday}</span>
              </div>
              <div className="p-4 rounded-2xl liquid-glass border border-white/80">
                <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">学校 / 年级</span>
                <span className="text-sm font-semibold text-slate-800">{character.school} · {character.grade}</span>
              </div>
              <div className="p-4 rounded-2xl liquid-glass border border-white/80">
                <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">所属部活</span>
                <span className="text-sm font-semibold text-slate-800">{character.club}</span>
              </div>
              <div className="p-4 rounded-2xl liquid-glass border border-white/80">
                <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">声优 (CV)</span>
                <span className="text-sm font-semibold text-slate-800">{character.cv}</span>
              </div>
            </div>

            {/* 1. Character Biography Section with its OWN Inline Discussion */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>人物生平与档案简介</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                {bioText}
              </p>

              {/* Pure Inline Discussion for Biography */}
              <InlineDiscussionThread
                targetId={`character_bio_${character.id}`}
                targetType="character"
                targetTitle={`${character.name} · 人物简介`}
                currentContent={bioText}
                currentUser={currentUser}
                onContentUpdated={(newText) => setBioText(newText)}
                defaultExpanded={false}
              />
            </div>

            {/* 2. Psychological Evolution (心理变化与性格分析) with its OWN Inline Discussion */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>心理变化与性格分析深度考据</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                {psychologyText}
              </p>

              {/* Pure Inline Discussion for Psychology */}
              <InlineDiscussionThread
                targetId={`character_psychology_${character.id}`}
                targetType="character"
                targetTitle={`${character.name} · 心理变化与性格分析`}
                currentContent={psychologyText}
                currentUser={currentUser}
                onContentUpdated={(newText) => setPsychologyText(newText)}
                defaultExpanded={true} // Expanded by default so the user immediately sees the example!
              />
            </div>

            {/* 3. Growth Journey (成长历程) with its OWN Inline Discussion */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>成长历程与高光瞬间</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                {growthText}
              </p>

              {/* Pure Inline Discussion for Growth Journey */}
              <InlineDiscussionThread
                targetId={`character_growth_${character.id}`}
                targetType="character"
                targetTitle={`${character.name} · 成长历程`}
                currentContent={growthText}
                currentUser={currentUser}
                onContentUpdated={(newText) => setGrowthText(newText)}
                defaultExpanded={false}
              />
            </div>

            {/* 4. Relations section with other characters */}
            <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-sky-600" />
                  <span>{character.name} 核心人际羁绊网络</span>
                </h3>
                <span className="text-xs text-slate-400">点击任意羁绊展开演进阶段与专属讨论</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characterRelationsList.map((rel) => {
                  const targetCharId = rel.sourceId === character.id ? rel.targetId : rel.sourceId;
                  const targetChar = characters.find(c => c.id === targetCharId);

                  return (
                    <div
                      key={rel.id}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={targetChar?.avatar || character.avatar}
                            alt={targetChar?.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900">
                              {character.name} ↔ {targetChar?.name}
                            </span>
                            <span className="block text-[11px] text-sky-600 font-medium">
                              {rel.relationType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {rel.description}
                      </p>

                      {rel.keyEvents && (
                        <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-400 font-medium block">关键剧情节点：</span>
                          {rel.keyEvents.slice(0, 3).map((ke, idx) => (
                            <div key={idx} className="text-slate-600 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                              <span className="line-clamp-1">{ke}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Discussion Thread for this specific Relation */}
                      <InlineDiscussionThread
                        targetId={`relation_${rel.id}`}
                        targetType="relation"
                        targetTitle={`${character.name} ↔ ${targetChar?.name} · 关系研讨`}
                        currentContent={rel.description}
                        currentUser={currentUser}
                        defaultExpanded={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* SUBTAB 2: Timeline / Chronicle */}
        {activeSubTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Season Filter Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-700">经历编年史季度筛选：</span>
              <div className="flex gap-2">
                {seasons.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeason(s.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                      selectedSeason === s.id
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Specific Milestones */}
            <div className="space-y-4">
              {timelineMilestones.map((node, idx) => (
                <div
                  key={node.id}
                  className="p-5 rounded-2xl liquid-glass border border-white/90 shadow-2xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-mono border border-sky-100">
                        {node.season}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 font-editorial-mincho">
                        {node.title}
                      </h4>
                    </div>
                    <span className="font-mono text-xs text-slate-400">#0{idx + 1}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {node.desc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-sky-900 text-xs italic">
                    “{node.quote}”
                  </div>

                  {/* Inline Discussion on this Timeline Node */}
                  <InlineDiscussionThread
                    targetId={`chronicle_node_${node.id}`}
                    targetType="timeline"
                    targetTitle={`${character.name}编年史 · ${node.title}`}
                    currentContent={node.desc}
                    currentUser={currentUser}
                    defaultExpanded={false}
                  />
                </div>
              ))}
            </div>

            {/* Episodes List in This Season */}
            <div className="pt-4 space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-editorial-mincho flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>涉及本季度的动画单集与剧情节点</span>
              </h3>

              <div className="space-y-4">
                {episodesInvolved.map((ep) => (
                  <div
                    key={ep.id}
                    className="p-5 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-sky-600 font-mono font-medium">
                          <span>第 {ep.episodeNumber} 话</span>
                          <span>·</span>
                          <span>{ep.japaneseTitle}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-editorial-mincho mt-0.5">
                          {ep.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {ep.synopsis}
                    </p>

                    {ep.keyEvents && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ep.keyEvents.map((ke, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100/70 text-slate-600 text-[11px]"
                          >
                            • {ke}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Inline Discussion & Revision Proposal on this exact Episode */}
                    <InlineDiscussionThread
                      targetId={`episode_${ep.id}`}
                      targetType="episode"
                      targetTitle={`第${ep.episodeNumber}话 · ${ep.title}`}
                      currentContent={ep.synopsis}
                      currentUser={currentUser}
                      onContentUpdated={(newSynopsis) => {
                        const updated = { ...ep, synopsis: newSynopsis };
                        onUpdateEpisode?.(updated);
                      }}
                      defaultExpanded={false}
                    />
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* SUBTAB 3: Outfits */}
        {activeSubTab === 'outfits' && (
          <motion.div
            key="outfits"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characterOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="rounded-3xl p-6 liquid-glass border border-white/90 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-sky-600 uppercase font-medium">
                        {outfit.color}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                        {outfit.firstAppearance}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-editorial-mincho">
                      {outfit.name}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {outfit.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 text-xs text-slate-500">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono mb-0.5">出场场景考据：</span>
                      <p className="text-slate-700">{outfit.sceneDescription || outfit.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {outfit.tags?.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inline Discussion on this Outfit */}
                  <InlineDiscussionThread
                    targetId={`outfit_${outfit.id}`}
                    targetType="outfit"
                    targetTitle={`代表服饰 · ${outfit.name}`}
                    currentContent={outfit.description}
                    currentUser={currentUser}
                    defaultExpanded={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: Quotes */}
        {activeSubTab === 'quotes' && (
          <motion.div
            key="quotes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characterQuotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-3xl p-6 liquid-glass border border-white/90 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-sky-600 font-medium">
                      <span>{q.scene}</span>
                      {q.listener && <span className="text-slate-400 text-[11px]">对 {q.listener}</span>}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-editorial-mincho italic">
                        {q.japanese}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 font-editorial-mincho">
                        “{q.chinese}”
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light pt-1">
                      {q.background || q.scene}
                    </p>

                    {q.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {q.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inline Discussion on this Quote */}
                  <InlineDiscussionThread
                    targetId={`quote_${q.id}`}
                    targetType="quote"
                    targetTitle={`经典语录 · ${q.chinese.slice(0, 15)}...`}
                    currentContent={q.chinese}
                    currentUser={currentUser}
                    defaultExpanded={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 5: Voice Lines (for Yukino) */}
        {activeSubTab === 'voices' && character.id === 'char_yukino' && (
          <motion.div
            key="voices"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalVoiceLines.map((v, idx) => (
                <div
                  key={v.id}
                  className="p-5 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 font-editorial-mincho">
                      {v.title}
                    </span>
                    <button
                      onClick={() => onPlayVoice?.(idx)}
                      className="px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Play className="w-3 h-3" />
                      <span>播放 ({v.duration})</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 font-editorial-mincho">
                    {v.japaneseText}
                  </p>
                  <p className="text-xs text-slate-800 font-medium">
                    “{v.chineseText}”
                  </p>
                  <p className="text-[11px] text-slate-500 font-light">
                    场景：{v.scene}
                  </p>

                  <InlineDiscussionThread
                    targetId={`voice_${v.id}`}
                    targetType="lore"
                    targetTitle={`台词原声 · ${v.title}`}
                    currentContent={v.chineseText}
                    currentUser={currentUser}
                    defaultExpanded={false}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 6: Page-level Discussion for the Character */}
        {activeSubTab === 'discussion' && (
          <motion.div
            key="discussion"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/90 shadow-2xs space-y-4"
          >
            <div className="text-center max-w-lg mx-auto mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-editorial-mincho">
                {character.name} · 全角色档案总研讨区
              </h3>
              <p className="text-xs text-slate-500 font-light mt-1">
                欢迎就该角色的整体设定、小说与动画表现异同、声优演绎及未解谜题发起深度研讨与修改提议。
              </p>
            </div>

            <InlineDiscussionThread
              targetId={`character_archive_${character.id}`}
              targetType="character"
              targetTitle={`${character.name} · 全档案总研讨`}
              currentContent={character.description}
              currentUser={currentUser}
              defaultExpanded={true}
            />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
