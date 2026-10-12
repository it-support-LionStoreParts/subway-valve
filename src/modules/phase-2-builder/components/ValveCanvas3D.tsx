'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { useValveStore } from '@/lib/store/valve-store';
import { SectionConfiguration, ValveComponent } from '@/types/component';

// Subcomponente 3D para una rebanada física individual
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
      {/* Cuerpo principal del bloque hidráulico (corte mecanizado) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Biseles y orificios de fijación superiores */}
      <mesh position={[0, height / 2 + 0.05, 0]}>
        <boxGeometry args={[width * 0.9, 0.08, depth * 0.8]} />
        <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Si es sección de trabajo: puertos A y B frontales y actuador superior */}
      {isWorkSection && (
        <>
          {/* Puerto A */}
          <mesh position={[-width * 0.22, 0.1, depth / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Puerto B */}
          <mesh position={[width * 0.22, 0.1, depth / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Actuador: Palanca manual o Solenoide Eléctrico */}
          {hasLever ? (
            // Palanca manual
            <group position={[0, height / 2 + 0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.6} />
              </mesh>
            </group>
          ) : (
            // Caja de mando eléctrico PVE
            <mesh position={[0, height / 2 + 0.35, 0]}>
              <boxGeometry args={[width * 0.85, 0.6, depth * 0.65]} />
              <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.4} />
            </mesh>
          )}
        </>
      )}

      {/* Etiqueta flotante */}
      <Html position={[0, -height / 2 - 0.25, 0]} center distanceFactor={12}>
        <div className="bg-zinc-950/90 border border-zinc-700/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-zinc-300 pointer-events-none whitespace-nowrap shadow-md">
          {label}
        </div>
      </Html>
    </group>
  );
};

export const ValveCanvas3D: React.FC = () => {
  const { inlet, sections, endCover, tieRodKit } = useValveStore();

  // Escalar los grosores en mm a unidades 3D de Three.js (factor 1 mm = 0.04 unidades)
  const SCALE = 0.035;
  const HEIGHT = 3.0;
  const DEPTH = 2.4;

  // Cálculo procedural de las posiciones X relativas de cada rebanada apilada
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

    // 1. Inlet
    if (inlet) {
      const w = inlet.grosor_mm * SCALE;
      slices.push({
        id: 'inlet',
        label: 'PVP INLET',
        width: w,
        x: currentX + w / 2,
        color: '#475569'
      });
      currentX += w;
    }

    // 2. Secciones de trabajo
    sections.forEach((sec, idx) => {
      const w = sec.component.grosor_mm * SCALE;
      const isManual = sec.selectedActuator?.sku_accesorio.includes('3171');
      slices.push({
        id: sec.id,
        label: `PVB #${idx + 1}`,
        width: w,
        x: currentX + w / 2,
        color: '#334155',
        isWorkSection: true,
        hasLever: isManual
      });
      currentX += w;
    });

    // 3. End Cover
    if (endCover) {
      const w = endCover.grosor_mm * SCALE;
      slices.push({
        id: 'cover',
        label: 'PVS END',
        width: w,
        x: currentX + w / 2,
        color: '#475569'
      });
      currentX += w;
    }

    // Centrar todo el bloque en el eje X de Three.js
    const totalWidth = currentX;
    const offsetX = totalWidth / 2;

    return {
      totalWidth,
      slices: slices.map((s) => ({ ...s, x: s.x - offsetX }))
    };
  }, [inlet, sections, endCover]);

  return (
    <div className="w-full h-[380px] bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative shadow-2xl">
      {/* Controles de Vista flotantes */}
      <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-700/60 text-xs text-zinc-300 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Render 3D en Tiempo Real (Rotar / Zoom)
      </div>

      <Canvas
        camera={{ position: [5, 4, 6], fov: 42 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />

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

            {/* Tirantes 3D que atraviesan todo el bloque */}
            {tieRodKit && (
              <group position={[0, 0, 0]}>
                {/* Tirante Superior Delantero */}
                <mesh position={[0, HEIGHT * 0.38, DEPTH * 0.38]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.5, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Tirante Superior Trasero */}
                <mesh position={[0, HEIGHT * 0.38, -DEPTH * 0.38]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.5, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Tirante Inferior */}
                <mesh position={[0, -HEIGHT * 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.04, 0.04, slicesData.totalWidth + 0.5, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
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
            cellColor="#27272a"
            sectionColor="#3f3f46"
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
