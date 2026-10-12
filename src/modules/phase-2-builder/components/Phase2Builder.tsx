'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { ValveCanvas2D } from './ValveCanvas2D';
import { ValveCanvas3D } from './ValveCanvas3D';
import { SectionItemConfigurator } from './SectionItemConfigurator';
import { Eco80TechnicalModal } from './Eco80TechnicalModal';
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Eye,
  Box,
  SlidersHorizontal,
  ShieldCheck,
  BookOpen,
  Info
} from 'lucide-react';

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
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  if (!selectedFamily) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-400">No se ha seleccionado ninguna familia hidráulica aún.</p>
        <button
          onClick={() => setPhase(1)}
          className="bg-[#F26522] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg"
        >
          Ir a Selección de Familia
        </button>
      </div>
    );
  }

  const inlets = availableComponents.filter((c) => c.tipo_modulo === 'INLET');
  const isEco80 = selectedFamily.id === 'DANFOSS_ECO80';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Eco80TechnicalModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />

      {/* Barra de Navegación Superior de Fase 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#F26522]/15 text-[#F26522] border border-[#F26522]/30 rounded-full text-xs font-semibold uppercase font-mono">
              Fase 2: Constructor Modular
            </span>
            <span className="text-xs text-zinc-400 font-mono">Serie: {selectedFamily.nombre}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configuración y Apilado Modular
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTechModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-[#F26522] hover:border-[#F26522]/50 text-xs font-semibold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F26522]" />
            Guía Técnica CoreBook
          </button>

          <button
            onClick={() => setPhase(1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cambiar Familia
          </button>

          <button
            onClick={generateBOM}
            className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#EA580C] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-[#F26522]/20"
          >
            Generar Cotización y BOM
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner Informativo Exclusivo Danfoss ECO 80 */}
      {isEco80 && (
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F26522]/10 border border-[#F26522]/20 flex items-center justify-center text-[#F26522] shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Arquitectura Danfoss ECO 80 Activa</span>
              <span className="text-zinc-400">
                Admite hasta 12 secciones de trabajo (EVB), pilotaje integrado PPRV, solenoides EVHC/EVM y válvula de descarga eléctrica opcional (EVPX).
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsTechModalOpen(true)}
            className="text-[11px] font-mono text-[#F26522] hover:underline flex items-center gap-1 shrink-0"
          >
            Explorar componentes de catálogo →
          </button>
        </div>
      )}

      {/* Selector de Modo de Visualización (2D vs 3D) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('2D')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2D'
                ? 'bg-[#F26522] text-white shadow'
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
                ? 'bg-[#F26522] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Visor 3D Interactivo
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Compatibilidad física y apilamiento validados (Danfoss CoreBook)
        </div>
      </div>

      {/* Lienzo Visual (2D o 3D según selección) */}
      {viewMode === '2D' ? <ValveCanvas2D /> : <ValveCanvas3D />}

      {/* Grid de Configuración del Chasis y Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Chasis (Inlet & End Cover & Tirantes) */}
        <div className="lg:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-[#F26522]" />
            Configuración del Chasis
          </h3>

          {/* Módulo de Entrada */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium block">
              Módulo de Entrada ({isEco80 ? 'EVP - Pump Module' : 'PVP Inlet'})
            </label>
            <select
              value={inlet?.id || ''}
              onChange={(e) => {
                const selected = inlets.find((i) => i.id === e.target.value);
                if (selected) setInlet(selected);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#F26522]"
            >
              {inlets.map((inl) => (
                <option key={inl.id} value={inl.id}>
                  {inl.nombre} ({inl.sku})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              Grosor: {inlet?.grosor_mm} mm | {inlet?.descripcion}
            </p>
          </div>

          {/* Tapa Terminal */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400 font-medium block">
              Tapa de Cierre ({isEco80 ? 'EVO - Endplate' : 'PVS End Cover'})
            </label>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-300">
              <span className="font-bold text-white block">{endCover?.nombre || 'Tapa Estándar'}</span>
              <span className="text-zinc-500 text-[11px]">SKU: {endCover?.sku} ({endCover?.grosor_mm} mm)</span>
            </div>
          </div>

          {/* Kit de Tirantes Asignado Automáticamente */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400 font-medium block">
              Kit de Tirantes ({isEco80 ? 'EVAS Assembly Kit' : 'Espárragos'})
            </label>
            {tieRodKit ? (
              <div className="bg-[#F26522]/10 border border-[#F26522]/20 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-[#F26522] block">{tieRodKit.nombre}</span>
                <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                  <span>SKU: {tieRodKit.sku}</span>
                  <span>Longitud: {tieRodKit.longitud_mm} mm</span>
                </div>
                <p className="text-[10px] text-[#F26522]/90 pt-1">
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
              className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-[#F26522] border border-zinc-700 hover:border-[#F26522]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5 text-[#F26522]" />
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
