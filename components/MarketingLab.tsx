
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { MARKETING_PROMPTS } from '../constants';
import { MarketingAsset } from '../types';

interface MarketingLabProps {
  onGenerated: (asset: MarketingAsset) => void;
}

const MarketingLab: React.FC<MarketingLabProps> = ({ onGenerated }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        onGenerated({
          id: Date.now().toString(),
          url: reader.result as string,
          title: '原始产品',
          category: 'original'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const processTransform = async (type: keyof typeof MARKETING_PROMPTS) => {
    if (!sourceImage) return;
    setIsProcessing(true);
    const result = await geminiService.processMarketingImage(sourceImage, MARKETING_PROMPTS[type]);
    if (result) {
      onGenerated({
        id: Date.now().toString(),
        url: result,
        title: `视觉效果 - ${type}`,
        category: type
      });
    }
    setIsProcessing(false);
  };

  const handleEdit = async () => {
    if (!sourceImage || !editPrompt) return;
    setIsProcessing(true);
    const result = await geminiService.editImage(sourceImage, editPrompt);
    if (result) {
      onGenerated({
        id: Date.now().toString(),
        url: result,
        title: '编辑结果',
        category: 'original'
      });
      setSourceImage(result);
    }
    setIsProcessing(false);
    setEditPrompt("");
  };

  return (
    <div className="flex flex-col gap-6 p-8 glass rounded-[2.5rem] w-full max-w-md pointer-events-auto border-emerald-500/20">
      <div className="space-y-2 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <svg className="w-6 h-6 leaf-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
            踏入巨木之森
          </h2>
          <p className="text-xs text-emerald-100/40 mt-1 uppercase tracking-widest">Nano Banana Visualization</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-square bg-emerald-950/20 border-2 border-dashed border-emerald-500/20 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden group relative hover:border-emerald-400/50 transition-all"
      >
        {sourceImage ? (
          <img src={sourceImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Source" />
        ) : (
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div className="text-emerald-300 font-medium">点击上传图片</div>
            <div className="text-[10px] text-emerald-500/60 uppercase tracking-tighter">Support PNG, JPG up to 10MB</div>
          </div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center backdrop-blur-md">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">GenAI Processing</span>
            </div>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*"
      />

      {sourceImage && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'mug', label: '咖啡杯' },
              { id: 'billboard', label: '广告牌' },
              { id: 'shirt', label: '文化衫' }
            ].map((btn) => (
              <button 
                key={btn.id}
                disabled={isProcessing}
                onClick={() => processTransform(btn.id as any)}
                className="glass py-2.5 rounded-2xl text-[11px] font-bold text-emerald-100 hover:bg-emerald-400 hover:text-emerald-950 transition-all uppercase tracking-wider active:scale-95"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative pt-4 border-t border-emerald-500/10">
            <div className="flex gap-2">
              <input 
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="提示：上传图片后点击收起即可"
                className="flex-1 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-400/50 text-emerald-100 placeholder:text-emerald-700/60"
              />
              <button 
                onClick={handleEdit}
                disabled={isProcessing || !editPrompt}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-5 rounded-2xl text-[11px] font-black uppercase transition-all disabled:opacity-30 active:scale-95"
              >
                生成
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-1">
               <span className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
               <span className="w-1 h-1 rounded-full bg-emerald-500/60"></span>
               <span className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingLab;
