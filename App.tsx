
import React, { useState, useCallback, useRef, useMemo } from 'react';
import Canvas3D from './components/Canvas3D';
import CustomCursor from './components/CustomCursor';
import MarketingLab from './components/MarketingLab';
import { LayoutMode, MarketingAsset, ProjectWork, ImageItem } from './types';
import { INITIAL_WORKS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<LayoutMode>('WAVE');
  const [portfolioWorks, setPortfolioWorks] = useState<ProjectWork[]>(INITIAL_WORKS);
  const [showLab, setShowLab] = useState(false);
  const [editingWork, setEditingWork] = useState<ProjectWork | null>(null);
  const [innerImageIndex, setInnerImageIndex] = useState(0);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // 计算当前编辑作品在列表中的位置
  const currentWorkIndex = useMemo(() => {
    if (!editingWork) return -1;
    return portfolioWorks.findIndex(w => w.id === editingWork.id);
  }, [editingWork, portfolioWorks]);

  const handleAssetGenerated = useCallback((asset: MarketingAsset) => {
    setPortfolioWorks(prev => [
      { 
        id: Date.now().toString(), 
        name: asset.title, 
        items: [{ id: Date.now().toString() + '-0', url: asset.url, aspect: 1 }] 
      },
      ...prev
    ].slice(0, 15));
  }, []);

  const handleUpdateWork = (updates: Partial<ProjectWork>) => {
    if (!editingWork) return;
    setPortfolioWorks(prev => prev.map(w => 
      w.id === editingWork.id ? { ...w, ...updates } : w
    ));
    setEditingWork(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && editingWork) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new window.Image();
          img.onload = () => {
            const newItem: ImageItem = {
              id: Math.random().toString(36).substr(2, 9),
              url: reader.result as string,
              aspect: img.width / img.height
            };
            const updatedItems = [...editingWork.items, newItem];
            handleUpdateWork({ items: updatedItems });
            // 自动跳转到新添加的图片
            setInnerImageIndex(updatedItems.length - 1);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 跨作品导航
  const navigateWorks = (direction: 'next' | 'prev') => {
    if (currentWorkIndex === -1) return;
    let nextIdx;
    if (direction === 'next') {
      nextIdx = (currentWorkIndex + 1) % portfolioWorks.length;
    } else {
      nextIdx = (currentWorkIndex - 1 + portfolioWorks.length) % portfolioWorks.length;
    }
    setEditingWork(portfolioWorks[nextIdx]);
    setInnerImageIndex(0); // 重置到该作品的第一张
  };

  // 作品内导航
  const navigateInnerImages = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editingWork) return;
    const count = editingWork.items.length;
    if (count <= 1) return;
    
    if (direction === 'next') {
      setInnerImageIndex((innerImageIndex + 1) % count);
    } else {
      setInnerImageIndex((innerImageIndex - 1 + count) % count);
    }
  };

  const deleteCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingWork || editingWork.items.length <= 1) return;
    const newItems = editingWork.items.filter((_, i) => i !== innerImageIndex);
    handleUpdateWork({ items: newItems });
    setInnerImageIndex(Math.max(0, innerImageIndex - 1));
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden select-none text-emerald-950">
      <CustomCursor />
      
      <Canvas3D mode={mode} works={portfolioWorks} onItemClick={(work) => {
        setEditingWork(work);
        setInnerImageIndex(0);
      }} />

      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-start justify-center px-16">
        <div className={`mb-10 relative transition-all duration-500 ${editingWork ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="absolute -left-8 top-0 bottom-0 w-1 bg-emerald-500/40 rounded-full" />
          <h1 className="text-8xl font-black text-emerald-900/10 uppercase tracking-tighter leading-none italic">
            Forest<br />Vision
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <span className="text-emerald-600 font-bold text-sm tracking-[0.4em] uppercase">
              踏入巨木之森
            </span>
            <div className="h-[1px] w-12 bg-emerald-500/30" />
            <span className="text-emerald-800/40 text-[10px] font-mono tracking-tighter">GALLERY PRO V2.0</span>
          </div>
        </div>

        {showLab && !editingWork && (
          <div className="animate-in fade-in slide-in-from-left duration-1000 ease-out">
            <MarketingLab onGenerated={handleAssetGenerated} />
          </div>
        )}
      </div>

      {/* 增强型多层查看/编辑弹窗 */}
      {editingWork && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-2xl pointer-events-auto transition-all duration-500"
          onClick={() => setEditingWork(null)}
        >
          {/* 作品间导航 - 左 */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigateWorks('prev'); }}
            className="absolute left-8 w-14 h-14 rounded-full glass border-none flex items-center justify-center text-emerald-900 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 shadow-2xl z-[110]"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* 作品间导航 - 右 */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigateWorks('next'); }}
            className="absolute right-8 w-14 h-14 rounded-full glass border-none flex items-center justify-center text-emerald-900 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 shadow-2xl z-[110]"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div 
            className="glass p-8 rounded-[4rem] w-[500px] border-emerald-500/30 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300 pointer-events-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-emerald-900 font-black uppercase tracking-[0.2em] text-sm">{editingWork.name}</h3>
                  <span className="bg-emerald-600/10 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black border border-emerald-500/10">
                    作品 {currentWorkIndex + 1}/{portfolioWorks.length}
                  </span>
                </div>
                <div className="h-1 w-12 bg-emerald-500 rounded-full" />
              </div>
              <button 
                onClick={() => setEditingWork(null)} 
                className="w-10 h-10 rounded-full hover:bg-emerald-500/10 flex items-center justify-center text-emerald-800 transition-all hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <div className="w-full aspect-[4/5] bg-emerald-50/30 rounded-[3rem] border-2 border-dashed border-emerald-500/20 overflow-hidden relative flex items-center justify-center">
                  <img 
                    key={editingWork.items[innerImageIndex]?.url}
                    src={editingWork.items[innerImageIndex]?.url} 
                    className="max-w-full max-h-full object-contain transition-all duration-700 animate-in fade-in slide-in-from-right-4" 
                    alt="work preview"
                  />

                  {/* 作品内图片导航 */}
                  {editingWork.items.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => navigateInnerImages('prev', e)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-emerald-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button 
                        onClick={(e) => navigateInnerImages('next', e)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-emerald-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </>
                  )}

                  {/* 悬浮管理按钮 */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={deleteCurrentImage}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title="删除当前图片"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>

                {/* 页码指示器 */}
                {editingWork.items.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {editingWork.items.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === innerImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase font-black text-emerald-600/60 tracking-widest ml-1">作品名称</label>
                  <input 
                    type="text" 
                    value={editingWork.name}
                    onChange={(e) => handleUpdateWork({ name: e.target.value })}
                    className="w-full bg-white/50 border-2 border-emerald-500/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500/40 text-emerald-950 shadow-sm transition-all"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button 
                    onClick={() => addFileInputRef.current?.click()}
                    className="h-[54px] px-6 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-200 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    追加
                  </button>
                </div>
              </div>
              
              <input type="file" ref={addFileInputRef} onChange={handleAddImage} className="hidden" accept="image/*" multiple />

              <button 
                onClick={() => setEditingWork(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
              >
                保存修改并退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部导航胶囊 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="glass px-8 py-4 rounded-full flex items-center gap-10 border-emerald-500/10 shadow-xl">
          <div className="flex items-center gap-4 border-r border-emerald-500/10 pr-10">
            <button 
              onClick={() => setShowLab(!showLab)}
              className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${showLab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-emerald-700 hover:text-emerald-900'}`}
            >
              {showLab ? '收起' : '新增作者'}
            </button>
          </div>
          
          <div className="flex items-center gap-8">
            {[
              { id: 'WAVE', label: '涟漪' },
              { id: 'RANDOM', label: '灵动' },
              { id: 'CIRCULAR', label: '环抱' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as LayoutMode)}
                className={`group relative text-[11px] font-black uppercase tracking-[0.2em] transition-all ${mode === m.id ? 'text-emerald-600' : 'text-emerald-300 hover:text-emerald-500'}`}
              >
                {m.label}
                {mode === m.id && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
