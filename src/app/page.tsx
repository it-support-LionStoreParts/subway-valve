'use client';

import React from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';
import { translations } from '@/lib/i18n/translations';
import { Phase1Filter } from '@/modules/phase-1-filter/components/Phase1Filter';
import { Phase2Builder } from '@/modules/phase-2-builder/components/Phase2Builder';
import { Phase3Quotation } from '@/modules/phase-3-quotation/components/Phase3Quotation';
import { SplashScreen } from '@/components/SplashScreen';
import { Globe } from 'lucide-react';

export default function Home() {
  const { currentPhase, setPhase, selectedFamily, setPhase1Step, language, setLanguage } = useValveStore();
  const t = translations[language];

  const phases = [
    { number: 1, label: t.phase1 },
    { number: 2, label: t.phase2 },
    { number: 3, label: t.phase3 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 font-sans selection:bg-[#F26522] selection:text-white">
      {/* Pantalla de Carga Inicial con Animación */}
      <SplashScreen />
      
      {/* Header Minimalista y Elegante */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Marca / Logotipo Proporcional y Nítido */}
          <div
            onClick={() => {
              setPhase(1);
              setPhase1Step(0);
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
            title="Ir al inicio / Go to home"
          >
            <Image
              src="/images/lion-store-logo.png"
              alt="Lion Store Parts"
              width={1024}
              height={791}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-102"
              style={{ width: 'auto', height: '36px' }}
              priority
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="font-semibold text-xs text-slate-900 tracking-tight leading-tight">
                Subway Valve
              </span>
              <span className="text-[10px] text-slate-500 font-normal leading-tight">
                {t.brandSubtitle}
              </span>
            </div>
          </div>

          {/* Stepper de Fases y Selector de Idioma */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-5 text-xs">
              {phases.map((p) => {
                const isActive = currentPhase === p.number;
                const isPast = currentPhase > p.number;
                const canClick = p.number === 1 || (p.number === 2 && selectedFamily !== null);

                return (
                  <button
                    key={p.number}
                    onClick={() => canClick && setPhase(p.number as 1 | 2 | 3)}
                    disabled={!canClick}
                    className={`flex items-center gap-2 py-1 transition-all ${
                      isActive
                        ? 'text-slate-900 font-semibold'
                        : isPast
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-[#F26522] scale-125'
                          : isPast
                          ? 'bg-slate-400'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Selector de Idioma (ES / EN) */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200/80 text-[11px] font-medium text-slate-600">
              <button
                onClick={() => setLanguage('es')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  language === 'es'
                    ? 'bg-white text-slate-950 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-950 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 sm:py-12">
        {currentPhase === 1 && <Phase1Filter />}
        {currentPhase === 2 && <Phase2Builder />}
        {currentPhase === 3 && <Phase3Quotation />}
      </main>

      {/* Pie de Página Minimalista */}
      <footer className="border-t border-slate-200/70 bg-white py-6 text-center text-xs text-slate-400 tracking-normal">
        <p>Lion Store Parts • Subway Valve Engineering Suite</p>
      </footer>
    </div>
  );
}
