'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';
import { Phase1Filter } from '@/modules/phase-1-filter/components/Phase1Filter';
import { Phase2Builder } from '@/modules/phase-2-builder/components/Phase2Builder';
import { Phase3Quotation } from '@/modules/phase-3-quotation/components/Phase3Quotation';
import { Eco80TechnicalModal } from '@/modules/phase-2-builder/components/Eco80TechnicalModal';
import { LionStoreFloatingBar } from '@/components/LionStoreFloatingBar';
import {
  CheckCircle2,
  ChevronRight,
  User,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function Home() {
  const { currentPhase, setPhase, selectedFamily } = useValveStore();
  const [isCoreBookOpen, setIsCoreBookOpen] = useState(false);

  const steps = [
    { number: 1, title: 'Fase 1: Diagnóstico', desc: 'Filtro por Preguntas' },
    { number: 2, title: 'Fase 2: Constructor', desc: 'Apilado 2D / 3D' },
    { number: 3, title: 'Fase 3: Cotización', desc: 'BOM y WhatsApp' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-[#F26522] selection:text-white relative">
      <Eco80TechnicalModal isOpen={isCoreBookOpen} onClose={() => setIsCoreBookOpen(false)} />
      
      {/* Barra Flotante Lateral Naranja (Inspirada en Lion Store e-commerce) */}
      <LionStoreFloatingBar
        onOpenCoreBook={() => setIsCoreBookOpen(true)}
        onToggleViewMode={() => {
          if (currentPhase === 1) setPhase(2);
        }}
      />

      {/* Barra Superior de Utilidad (Estilo Lion Store Parts) */}
      <div className="bg-black border-b border-zinc-900 text-[11px] text-zinc-400 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#F26522] font-semibold font-mono">LION STORE PARTS</span>
            <span className="text-zinc-600">|</span>
            <span className="hidden sm:inline">Distribuidor Especializado en Oleohidráulica Móvil e Industrial</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Heart className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">My Wishlist</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <ShoppingCart className="w-3.5 h-3.5 text-zinc-400" />
              <span>Checkout</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5 text-zinc-200">
              <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] text-[#F26522]">
                <User className="w-3 h-3" />
              </div>
              <span className="font-semibold text-white">Welcome Guest</span>
              <span className="text-zinc-500 hidden md:inline font-mono text-[10px]">(Sign in / Join Free)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Navegación Principal */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Marca / Logotipo Oficial Lion Store Parts */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 relative flex items-center">
              <Image
                src="/images/lion-store-logo.png"
                alt="Lion Store Parts"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block border-l border-zinc-800 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-sm">SUBWAY VALVE</span>
                <span className="text-[10px] bg-[#F26522]/15 text-[#F26522] font-mono font-bold px-1.5 py-0.5 rounded border border-[#F26522]/30">
                  Configurador
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 block">Danfoss Power Solutions Hub</span>
            </div>
          </div>

          {/* Stepper de Fases Interactivas */}
          <nav className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
            {steps.map((step, idx) => {
              const isActive = currentPhase === step.number;
              const isPast = currentPhase > step.number;
              const canNavigate = step.number === 1 || (step.number === 2 && selectedFamily !== null);

              return (
                <React.Fragment key={step.number}>
                  <button
                    onClick={() => canNavigate && setPhase(step.number as 1 | 2 | 3)}
                    disabled={!canNavigate}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F26522] text-white shadow-md'
                        : isPast
                        ? 'text-zinc-300 hover:text-white'
                        : 'text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-black text-[#F26522]'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : step.number}
                    </span>
                    <span className="hidden md:inline">{step.title}</span>
                  </button>

                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-zinc-700 hidden md:inline" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Indicador de Estado */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse"></span>
            <span className="hidden lg:inline">Supabase Live</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal según la Fase Activa */}
      <main className="flex-1 pb-20">
        {currentPhase === 1 && <Phase1Filter />}
        {currentPhase === 2 && <Phase2Builder />}
        {currentPhase === 3 && <Phase3Quotation />}
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-zinc-800/80 bg-black py-8 text-center text-xs text-zinc-500 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/images/lion-store-logo.png"
            alt="Lion Store Parts"
            width={85}
            height={30}
            className="object-contain opacity-80"
          />
          <span className="text-zinc-400 font-semibold">• Subway Valve Platform</span>
        </div>
        <p className="text-[11px] text-zinc-600 max-w-xl mx-auto">
          Plataforma de ingeniería de dimensionamiento y ensamblado modular para válvulas Danfoss ECO 80, Danfoss PVG 32 y Sun Hydraulics.
        </p>
      </footer>
    </div>
  );
}
