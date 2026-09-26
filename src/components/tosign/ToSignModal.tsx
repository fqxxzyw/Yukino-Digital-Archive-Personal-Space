import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ArrowLeft, PenTool, Sparkles, Image as ImageIcon, Share2, AtSign, Hash } from 'lucide-react';
import { GalleryItem, ToSignRequest } from '../../types';

interface ToSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: GalleryItem[];
  preselectedItem?: GalleryItem | null;
  onSubmit: (req: Omit<ToSignRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const ToSignModal: React.FC<ToSignModalProps> = ({
  isOpen,
  onClose,
  galleryItems,
  preselectedItem,
  onSubmit
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(preselectedItem || galleryItems[0] || null);
  const [requesterCN, setRequesterCN] = useState<string>('雪野原');
  const [dedicationText, setDedicationText] = useState<string>(
    'TO 雪野原：愿你在千叶的风雪里，亦能拥抱属于自己的真物。 —— 浅羽由乃'
  );
  const [remarks, setRemarks] = useState<string>('希望能手写在右下方雪景处，字迹清秀一些~');
  const [positionX, setPositionX] = useState<number>(65);
  const [positionY, setPositionY] = useState<number>(80);
  const [inkColor, setInkColor] = useState<string>('#0284c7');
  const [syncToFeed, setSyncToFeed] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync if preselectedItem changes
  React.useEffect(() => {
    if (preselectedItem) {
      setSelectedImage(preselectedItem);
      // Auto move to step 2 if item was preselected
      setStep(2);
    }
  }, [preselectedItem]);

  const presetQuotes = [
    'TO {NAME}：愿你在千叶的风雪里，亦能拥抱属于自己的真物。',
    'TO {NAME}：即使那是被否定的过去，也不要把真实的心情隐藏起来。',
    'TO {NAME}：侍奉部永远有一杯温热的红茶等待着你。',
    'TO {NAME}：请把你的未来与期待，郑重地交由时间证明。'
  ];

  const handleApplyPreset = (preset: string) => {
    const formatted = preset.replace('{NAME}', requesterCN || '你');
    setDedicationText(`${formatted} —— ${selectedImage?.author || '雪之下雪乃'}`);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPositionX(Math.round(x));
    setPositionY(Math.round(y));
  };

  const handleSubmit = () => {
    if (!selectedImage) return;
    onSubmit({
      galleryId: selectedImage.id,
      galleryTitle: selectedImage.title,
      imageUrl: selectedImage.imageUrl,
      requesterCN,
      dedicationText,
      remarks,
      positionX,
      positionY,
      inkColor,
      author: selectedImage.author || '浅羽由乃',
      syncToFeed
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[24px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl apple-glass-floating rounded-3xl p-6 shadow-2xl border border-white/95 overflow-hidden relative"
          >
            {/* Apple-style macOS Window Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block shadow-inner" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1.5">
              TO-SIGN STUDIO · 创作工房
            </span>
          </div>
          <span className="text-[10px] font-mono text-sky-600 font-medium">
            STEP {step} OF 5
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Coser 专属 To 签创作工房
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                STEP {step} / 5 · 5步交互式手写签名定制
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-100 h-1 my-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sky-500"
            initial={false}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>

        {/* Content Body with Sliding Transitions */}
        <div className="min-h-[360px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Picture */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="text-xs text-slate-600 mb-2">
                  选择你希望进行亲笔 To 签的摄影作或官方插图：
                </div>
                <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-1">
                  {galleryItems.map((item) => {
                    const isSelected = selectedImage?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-[4/3] group ${
                          isSelected ? 'border-sky-500 shadow-md ring-2 ring-sky-200' : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-medium truncate">
                            {item.title}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: CN & Recipient */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-2"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    你的称呼 / CN (Cosplay Name)
                  </label>
                  <input
                    type="text"
                    value={requesterCN}
                    onChange={(e) => setRequesterCN(e.target.value)}
                    placeholder="例如：雪野原、千叶旅客"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Coser 在落款时将写上「TO {requesterCN || '某某'}」
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    给 Coser 的留言或特殊嘱托
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="例如：希望能手写在右下方，字迹清秀一些~"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Preset Quotes & Dedication */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 py-1"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">
                    To 签专属赠言
                  </label>
                  <span className="text-[11px] text-sky-600 font-medium">点击预设快速填入</span>
                </div>

                <div className="space-y-1.5">
                  {presetQuotes.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(q)}
                      className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-50/80 hover:bg-sky-50/80 border border-slate-200/60 hover:border-sky-200 text-slate-700 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate pr-2 font-editorial-mincho">
                        {q.replace('{NAME}', requesterCN || '你')}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 shrink-0" />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={dedicationText}
                  onChange={(e) => setDedicationText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-editorial-mincho focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none mt-2"
                />
              </motion.div>
            )}

            {/* Step 4: Interactive Live Signature Positioning Preview */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>在图片上点击以设定手写落款坐标：</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">墨水质感：</span>
                    {['#0284c7', '#0f172a', '#e11d48', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setInkColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-4 h-4 rounded-full border border-slate-300 shadow-sm transition-transform ${
                          inkColor === color ? 'scale-125 ring-2 ring-sky-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview Canvas Box */}
                <div
                  onClick={handleImageClick}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 cursor-crosshair max-h-[240px] flex items-center justify-center select-none"
                >
                  <img
                    src={selectedImage?.imageUrl}
                    alt="preview"
                    className="w-full h-56 object-cover pointer-events-none opacity-90"
                  />

                  {/* Stamp positioning overlay */}
                  <motion.div
                    style={{
                      left: `${positionX}%`,
                      top: `${positionY}%`,
                      color: inkColor
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/20 shadow-lg text-center"
                  >
                    <div className="text-[10px] font-bold font-editorial-mincho tracking-wider">
                      {dedicationText.slice(0, 24)}...
                    </div>
                    <div className="text-[8px] opacity-80 font-mono mt-0.5">
                      坐标: ({positionX}%, {positionY}%)
                    </div>
                  </motion.div>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  落款位置将由 Coser 在高清原片上以此标记为参考完成专属数码压感签署。
                </p>
              </motion.div>
            )}

            {/* Step 5: Final Review & Submit */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3.5 py-1"
              >
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 shadow-sm border border-emerald-200">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      To 签申请已成功递交！
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      {syncToFeed 
                        ? '已同步一键发布至侍奉会社区动态（已自动 @Coser 与添加专属话题标签），Coser 审核后将在「个人中心」为您生成专属成片。' 
                        : 'Coser 审核后将在「个人中心 · 我的 To 签」为您生成专属成片。'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">签名图片</span>
                        <span className="font-medium text-slate-900 truncate max-w-[200px]">{selectedImage?.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">受签 CN</span>
                        <span className="font-medium text-slate-900">{requesterCN}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">专属 Coser</span>
                        <span className="text-sky-600 font-medium">@{selectedImage?.author || '浅羽由乃'}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 shrink-0">落款题辞</span>
                        <span className="font-editorial-mincho text-slate-900 max-w-xs truncate text-right">
                          {dedicationText}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">特殊要求</span>
                        <span className="text-slate-600 truncate max-w-[200px]">{remarks || '无'}</span>
                      </div>
                    </div>

                    {/* Sync to Feed Option */}
                    <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50/80 to-blue-50/60 p-3.5 space-y-2.5 transition-all">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={syncToFeed}
                            onChange={(e) => setSyncToFeed(e.target.checked)}
                            className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 border-slate-300"
                          />
                          <div className="flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-sky-600" />
                            <span className="text-xs font-semibold text-slate-800">
                              一键同步发布至侍奉会社区动态
                            </span>
                          </div>
                        </label>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                          自动 @ & 话题标签
                        </span>
                      </div>

                      {syncToFeed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 pt-2 border-t border-sky-100 text-xs text-slate-600"
                        >
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-sky-700">
                            <span className="flex items-center gap-0.5 bg-white/90 px-2 py-0.5 rounded-md border border-sky-200/70 shadow-xs">
                              <AtSign className="w-3 h-3 text-sky-500" />
                              <span>{selectedImage?.author || '浅羽由乃'}</span>
                            </span>
                            <span className="flex items-center gap-0.5 bg-white/90 px-2 py-0.5 rounded-md border border-sky-200/70 shadow-xs">
                              <Hash className="w-3 h-3 text-sky-500" />
                              <span>To签定制</span>
                            </span>
                            <span className="flex items-center gap-0.5 bg-white/90 px-2 py-0.5 rounded-md border border-sky-200/70 shadow-xs">
                              <Hash className="w-3 h-3 text-sky-500" />
                              <span>雪之下雪乃</span>
                            </span>
                            <span className="flex items-center gap-0.5 bg-white/90 px-2 py-0.5 rounded-md border border-sky-200/70 shadow-xs">
                              <Hash className="w-3 h-3 text-sky-500" />
                              <span>侍奉部专属</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-sky-100/80 leading-relaxed font-sans line-clamp-2">
                            “刚刚向 @{selectedImage?.author || '浅羽由乃'} 递交了《{selectedImage?.title}》专属 To 签申请！受签：TO {requesterCN}，题辞：「{dedicationText.slice(0, 36)}...」✨”
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1 || isSuccess}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>上一步</span>
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep((prev) => Math.min(5, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSuccess}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-200 active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认并提交申请</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
