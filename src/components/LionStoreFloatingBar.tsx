'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  Eye,
  BookOpen,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';

interface Props {
  onOpenCoreBook?: () => void;
  onToggleViewMode?: () => void;
}

export const LionStoreFloatingBar: React.FC<Props> = ({ onOpenCoreBook, onToggleViewMode }) => {
  const { currentPhase, setPhase, sections, inlet, endCover, resetAll } = useValveStore();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Cantidad de módulos físicos en el bloque
  const totalItemCount = (inlet ? 1 : 0) + sections.length + (endCover ? 1 : 0);

  return (
    <aside className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end shadow-2xl">
      {/* Barra Vertical Naranja Lion Store */}
      <div className="flex flex-col bg-[#F26522] rounded-l-2xl overflow-hidden border-y border-l border-orange-400/40 shadow-2xl">
        
        {/* 1. Menú / Navegación de Fases */}
        <div className="relative group">
          <button
            onClick={() => setPhase(currentPhase === 1 ? 2 : 1)}
            onMouseEnter={() => setHoveredButton('fases')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[#EA580C] transition-colors border-b border-orange-400/30"
            title="Cambiar de Fase"
          >
            <Menu className="w-5 h-5" />
          </button>
          {hoveredButton === 'fases' && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
              Fase Actual: {currentPhase} de 3
            </div>
          )}
        </div>

        {/* 2. Carrito / BOM (Despiece Actual) */}
        <div className="relative group">
          <button
            onClick={() => setPhase(3)}
            onMouseEnter={() => setHoveredButton('bom')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[#EA580C] transition-colors border-b border-orange-400/30 relative"
            title="Ver Cotización y Despiece"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-black text-[#F26522] font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#F26522]">
                {totalItemCount}
              </span>
            )}
          </button>
          {hoveredButton === 'bom' && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
              Ver BOM ({totalItemCount} módulos apilados)
            </div>
          )}
        </div>

        {/* 3. Guía Técnica / CoreBook */}
        <div className="relative group">
          <button
            onClick={onOpenCoreBook}
            onMouseEnter={() => setHoveredButton('corebook')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[#EA580C] transition-colors border-b border-orange-400/30"
            title="Ficha Técnica CoreBook"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          {hoveredButton === 'corebook' && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
              Guía Técnica Danfoss ECO 80
            </div>
          )}
        </div>

        {/* 4. Diagnóstico / Filtro */}
        <div className="relative group">
          <button
            onClick={() => setPhase(1)}
            onMouseEnter={() => setHoveredButton('search')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[#EA580C] transition-colors border-b border-orange-400/30"
            title="Re-evaluar Parámetros Hidráulicos"
          >
            <Search className="w-5 h-5" />
          </button>
          {hoveredButton === 'search' && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
              Filtro y Diagnóstico Hidráulico
            </div>
          )}
        </div>

        {/* 5. Alternar Vista 2D / 3D */}
        <div className="relative group">
          <button
            onClick={onToggleViewMode}
            onMouseEnter={() => setHoveredButton('eye')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-[#EA580C] transition-colors"
            title="Alternar Vista Visual 2D / 3D"
          >
            <Eye className="w-5 h-5" />
          </button>
          {hoveredButton === 'eye' && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
              Vista Visual 2D / 3D
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
