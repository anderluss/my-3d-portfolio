
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                         (target.parentElement && window.getComputedStyle(target.parentElement).cursor === 'pointer');
      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={`fixed pointer-events-none z-[9999] transition-transform duration-150 ease-out`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${isPointer ? 'scale(2.5)' : 'scale(1)'}`
      }}
    >
      <div className={`rounded-full transition-all duration-300 ${isPointer ? 'w-4 h-4 bg-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.4)]' : 'w-3 h-3 bg-emerald-800 opacity-40'} animate-breathe`} />
    </div>
  );
};

export default CustomCursor;
