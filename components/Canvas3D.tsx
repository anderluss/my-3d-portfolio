
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutMode, ProjectWork } from '../types';

const _v = new THREE.Vector3();

interface WorkCardProps {
  work: ProjectWork;
  position: [number, number, number];
  onClick: () => void;
  index: number;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, position, onClick, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, mouse } = useThree();

  // 获取封面图（第一张）
  const coverItem = work.items[0];

  const scale = useMemo(() => {
    const base = 6;
    const aspect = coverItem?.aspect || 1;
    if (aspect > 1) {
      return [base, base / aspect] as [number, number];
    } else {
      return [base * aspect, base] as [number, number];
    }
  }, [coverItem?.aspect]);

  useFrame(() => {
    if (!meshRef.current) return;
    if (hovered) {
      const targetRotationX = (mouse.y * viewport.height) / 150;
      const targetRotationY = (mouse.x * viewport.width) / 150;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.03);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.03);
    }
  });

  if (!coverItem) return null;

  return (
    <group position={position}>
      <Image 
        ref={meshRef as any}
        url={coverItem.url} 
        transparent 
        opacity={1} 
        toneMapped={false}
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        renderOrder={index}
      />
      
      {hovered && (
        <Html position={[0, (scale[1] || 0) / 2 + 0.6, 0.5]} center distanceFactor={12} className="pointer-events-none">
          <div className="glass px-5 py-2 rounded-full whitespace-nowrap border border-emerald-500/30 shadow-2xl">
            <span className="text-xs font-black text-emerald-900 tracking-[0.2em]">{work.name}</span>
            {work.items.length > 1 && (
              <span className="ml-2 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] rounded-md">+{work.items.length - 1}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const LayoutContainer: React.FC<{ 
  mode: LayoutMode; 
  works: ProjectWork[]; 
  onItemClick: (work: ProjectWork) => void 
}> = ({ mode, works, onItemClick }) => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (mode === 'WAVE') {
        const x = (i - works.length / 2) * 8.5;
        const y = Math.sin(time * 0.4 + i * 0.5) * 2.5;
        const z = Math.cos(time * 0.4 + i * 0.5) * 1.5;
        _v.set(x, y, z);
        child.position.lerp(_v, 0.05);
        child.rotation.set(0, 0, 0);
      } else if (mode === 'CIRCULAR') {
        const angle = (i / works.length) * Math.PI * 2 + offset * Math.PI * 2;
        const radius = 18;
        const targetX = Math.cos(angle) * radius;
        const targetZ = Math.sin(angle) * radius;
        const targetY = Math.sin(angle * 0.5 + time * 0.2) * 4;
        _v.set(targetX, targetY, targetZ);
        child.position.lerp(_v, 0.05);
        child.lookAt(0, 0, 0);
      } else if (mode === 'RANDOM') {
        const seed = i * 42.123;
        const x = Math.sin(seed) * 28;
        const y = Math.cos(seed * 0.8) * 16;
        const z = Math.sin(seed * 1.5) * 12;
        _v.set(x, y, z);
        child.position.lerp(_v, 0.02);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {works.map((work, i) => (
        <WorkCard 
          key={work.id} 
          work={work}
          index={i}
          position={[0, 0, 0]} 
          onClick={() => onItemClick(work)}
        />
      ))}
    </group>
  );
};

const Canvas3D: React.FC<{ 
  mode: LayoutMode; 
  works: ProjectWork[];
  onItemClick: (work: ProjectWork) => void;
}> = ({ mode, works, onItemClick }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-white">
      <Canvas camera={{ position: [0, 0, 35], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={1.2} />
        <pointLight position={[40, 40, 40]} intensity={1.5} color="#10b981" />
        <pointLight position={[-40, -20, 20]} intensity={0.8} color="#059669" />
        <ScrollControls pages={4} damping={0.1}>
          <LayoutContainer mode={mode} works={works} onItemClick={onItemClick} />
        </ScrollControls>
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          maxDistance={75} 
          minDistance={10} 
          makeDefault 
        />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
