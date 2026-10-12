'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { ValveCanvas2D } from './ValveCanvas2D';
import { ValveCanvas3D } from './ValveCanvas3D';
import { SectionItemConfigurator } from './SectionItemConfigurator';
import { Plus, ArrowLeft, ArrowRight, Eye, Box, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const Phase2Builder: React.FC = () => {
  const {
    selectedFamily,
    sections,
    inlet,
    endCover,
    tieRodKit,
    availableComponents,
    setInlet,
    addSection,
    generateBOM,
    setPhase
  } = useValveStore();

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

  if (!selectedFamily) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-400">No se ha seleccionado ninguna familia hidráulica aún.</p>
        <button
          onClick={() => setPhase(1)}
          className="bg-amber-500 text-black px-4 py-2 rounded-xl font-bold text-xs"
        >
          Ir a Selección de Familia
        </button>
      </div>
    );
  }

  const inlets = availableComponents.filter((c) => c.tipo_modulo === 'INLET');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Barra de Navegación Superior de Fase 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold uppercase font-mono">
              Fase 2: Constructor
            </span>
            <span className="text-xs text-zinc-400 font-mono">Familia: {selectedFamily.nombre}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configuración y Apilado Modular
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhase(1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cambiar Familia
          </button>

          <button
            onClick={generateBOM}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-amber-500/20"
          >
            Generar Cotización y BOM
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selector de Modo de Visualización (2D vs 3D) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('2D')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2D'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Corte Esquemático 2D
          </button>

          <button
            onClick={() => setViewMode('3D')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3D'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Visor 3D Interactivo
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Compatibilidad física y apilamiento validados
        </div>
      </div>

      {/* Lienzo Visual (2D o 3D según selección) */}
      {viewMode === '2D' ? <ValveCanvas2D /> : <ValveCanvas3D />}

      {/* Grid de Configuración del Chasis y Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Chasis (Inlet & End Cover & Tirantes) */}
        <div className="lg:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            Configuración del Chasis
          </h3>

          {/* Módulo de Entrada */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium block">
              Módulo de Entrada (PVP Inlet)
            </label>
            <select
              value={inlet?.id || ''}
              onChange={(e) => {
                const selected = inlets.find((i) => i.id === e.target.value);
                if (selected) setInlet(selected);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              {inlets.map((inl) => (
                <option key={inl.id} value={inl.id}>
                  {inl.nombre} ({inl.sku})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              Grosor: {inlet?.grosor_mm} mm | Válvula de alivio integrada
            </p>
          </div>

          {/* Tapa Terminal */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400 font-medium block">
              Tapa de Cierre (PVS End Cover)
            </label>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-300">
              <span className="font-bold text-white block">{endCover?.nombre || 'Tapa Estándar'}</span>
              <span className="text-zinc-500 text-[11px]">SKU: {endCover?.sku} ({endCover?.grosor_mm} mm)</span>
            </div>
          </div>

          {/* Kit de Tirantes Asignado Automáticamente */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400 font-medium block">
              Kit de Tirantes y Espárragos
            </label>
            {tieRodKit ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-amber-400 block">{tieRodKit.nombre}</span>
                <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                  <span>SKU: {tieRodKit.sku}</span>
                  <span>Longitud: {tieRodKit.longitud_mm} mm</span>
                </div>
                <p className="text-[10px] text-amber-500/80 pt-1">
                  ✓ Calculado dinámicamente para {sections.length} cuerpos de trabajo.
                </p>
              </div>
            ) : (
              <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg">
                No hay kit de tirantes para esta combinación.
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Lista de Secciones de Trabajo y Botón Agregar */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-white">
              Cuerpos de Trabajo Activos ({sections.length} de {selectedFamily.max_work_sections} máx.)
            </h3>

            <button
              onClick={addSection}
              disabled={sections.length >= selectedFamily.max_work_sections}
              className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-amber-400 border border-zinc-700 hover:border-amber-500/50 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              Agregar Sección
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <SectionItemConfigurator key={section.id} section={section} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
