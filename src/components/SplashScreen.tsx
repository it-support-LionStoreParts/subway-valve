'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';

export const SplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { language } = useValveStore();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const isEn = language === 'en';

    const steps = [
      { p: 25, text: isEn ? 'Initializing hydraulic core...' : 'Inicializando motor hidráulico...' },
      { p: 60, text: isEn ? 'Loading Danfoss ECO 80 & PVG 32 modules...' : 'Cargando catálogo Danfoss ECO 80 & PVG 32...' },
      { p: 90, text: isEn ? 'Preparing 2D CAD & 3D WebGL studio...' : 'Preparando entorno 2D CAD y 3D WebGL...' },
      { p: 100, text: isEn ? 'Ready' : 'Listo para configurar' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setStatusText(steps[current].text);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 450);
        }, 300);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [language, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Logotipo de Lion Store Parts */}
        <div className="relative w-44 h-24 flex items-center justify-center">
          <Image
            src="/images/lion-store-logo.png"
            alt="Lion Store Parts"
            width={1024}
            height={791}
            className="w-full h-full object-contain"
            style={{ width: 'auto', height: '100%' }}
            priority
          />
        </div>

        {/* Subtítulo de Marca */}
        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Subway Valve
          </h2>
          <p className="text-xs text-slate-400">
            Lion Store Parts • Engineering Suite
          </p>
        </div>

        {/* Barra de Progreso Minimalista */}
        <div className="w-48 space-y-2">
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F26522] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium h-4 transition-all">
            {statusText}
          </p>
        </div>

      </div>
    </div>
  );
};
