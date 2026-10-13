'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { useValveStore } from '@/lib/store/valve-store';

interface SliceProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  label: string;
  isWorkSection?: boolean;
  hasLever?: boolean;
}

const ValveSlice3D: React.FC<SliceProps> = ({
  position,
  width,
  height,
  depth,
  color,
  label,
  isWorkSection,
  hasLever
}) => {
  return (
    <group position={position}>
      {/* Cuerpo principal del bloque */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Bisel superior */}
      <mesh position={[0, height / 2 + 0.05, 0]}>
        <boxGeometry args={[width * 0.9, 0.08, depth * 0.8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Puertos y actuadores si es sección de trabajo */}
      {isWorkSection && (
        <>
          {/* Puerto A */}
          <mesh position={[-width * 0.22, 0.1, depth / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#059669" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Puerto B */}
          <mesh position={[width * 0.22, 0.1, depth / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#059669" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Actuador */}
          {hasLever ? (
            <group position={[0, height / 2 + 0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
            </group>
          ) : (
            <mesh position={[0, height / 2 + 0.35, 0]}>
              <boxGeometry args={[width * 0.85, 0.6, depth * 0.65]} />
              <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.5} />
            </mesh>
          )}
        </>
      )}

      {/* Etiqueta flotante */}
      <Html position={[0, -height / 2 - 0.25, 0]} center distanceFactor={12}>
        <div className="bg-white/95 border border-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-zinc-800 pointer-events-none whitespace-nowrap shadow-xs">
          {label}
        </div>
      </Html>
    </group>
  );
};

export const ValveCanvas3D: React.FC = () => {
  const { inlet, sections, endCover, tieRodKit, language } = useValveStore();

  const totalLengthMm =
    (inlet?.grosor_mm || 0) +
    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
    (endCover?.grosor_mm || 0);

  const SCALE = 0.035;
  const HEIGHT = 3.0;
  const DEPTH = 2.4;

  const slicesData = useMemo(() => {
    let currentX = 0;
    const slices: Array<{
      id: string;
      label: string;
      width: number;
      x: number;
      color: string;
      isWorkSection?: boolean;
      hasLever?: boolean;
    }> = [];

    // Inlet
    if (inlet) {
      const w = inlet.grosor_mm * SCALE;
      slices.push({
        id: 'inlet',
        label: 'INLET',
        width: w,
        x: currentX + w / 2,
        color: '#64748b'
      });
      currentX += w;
    }

    // Secciones
    sections.forEach((sec, idx) => {
      const w = sec.component.grosor_mm * SCALE;
      const isManual = Boolean(
        sec.selectedActuator?.sku_accesorio &&
          (sec.selectedActuator.sku_accesorio.includes('3171') ||
            sec.selectedActuator.sku_accesorio.includes('11175314') ||
            sec.selectedActuator.sku_accesorio.includes('11172533'))
      );

      slices.push({
        id: sec.id,
        label: `#${idx + 1}`,
        width: w,
        x: currentX + w / 2,
        color: '#475569',
        isWorkSection: true,
        hasLever: isManual
      });
      currentX += w;
    });

    // End Cover
    if (endCover) {
      const w = endCover.grosor_mm * SCALE;
      slices.push({
        id: 'cover',
        label: 'END',
        width: w,
        x: currentX + w / 2,
        color: '#64748b'
      });
      currentX += w;
    }

    const totalWidth = currentX;
    const offsetX = totalWidth / 2;

    return {
      totalWidth,
      slices: slices.map((s) => ({ ...s, x: s.x - offsetX }))
    };
  }, [inlet, sections, endCover]);

  return (
    <div className="w-full h-[380px] bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden relative shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-medium">{language === 'en' ? '3D Studio (Orbit • Zoom)' : 'Estudio 3D (Rotar • Zoom)'}</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 text-slate-700 shadow-xs">
          <span>{language === 'en' ? 'Total Length:' : 'Cota Total:'} </span>
          <strong className="text-slate-900 font-semibold">{totalLengthMm.toFixed(1)} mm</strong>
        </div>
        {tieRodKit && (
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#F26522]/30 text-[#F26522] shadow-xs">
            <span>{language === 'en' ? 'Tie Rods:' : 'Tirantes:'} </span>
            <strong className="font-semibold">{tieRodKit.longitud_mm} mm</strong>
          </div>
        )}
      </div>

      <Canvas
        camera={{ position: [5, 4, 6], fov: 42 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-10, 10, -5]} intensity={0.6} />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {slicesData.slices.map((slice) => (
              <ValveSlice3D
                key={slice.id}
                position={[slice.x, 0, 0]}
                width={slice.width}
                height={HEIGHT}
                depth={DEPTH}
                color={slice.color}
                label={slice.label}
                isWorkSection={slice.isWorkSection}
                hasLever={slice.hasLever}
              />
            ))}

            {/* Tirantes 3D en Naranja Lion Store */}
            {tieRodKit && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, HEIGHT * 0.38, DEPTH * 0.38]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.4, 16]} />
                  <meshStandardMaterial color="#F26522" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, HEIGHT * 0.38, -DEPTH * 0.38]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.4, 16]} />
                  <meshStandardMaterial color="#F26522" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, -HEIGHT * 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.4, 16]} />
                  <meshStandardMaterial color="#F26522" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            )}
          </group>

          <Grid
            renderOrder={-1}
            position={[0, -HEIGHT / 2 - 0.4, 0]}
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.5}
            sectionSize={2}
            sectionThickness={1}
            fadeDistance={25}
            cellColor="#cbd5e1"
            sectionColor="#94a3b8"
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
