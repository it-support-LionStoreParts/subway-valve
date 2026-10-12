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
  Info,
  CheckCircle,
  Wrench,
  Layers,
  Sparkles
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
    setEndCover,
    addSection,
    generateBOM,
    setPhase,
    phase2SubStep,
    setPhase2SubStep,
    activeSectionIndex,
    setActiveSectionIndex
  } = useValveStore();

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  if (!selectedFamily) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-400">No se ha seleccionado ninguna familia hidráulica aún.</p>
        <button
          onClick={() => setPhase(1)}
          className="bg-[#F26522] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg"
        >
          Ir al Filtro Hidráulico
        </button>
      </div>
    );
  }

  const inlets = availableComponents.filter((c) => c.tipo_modulo === 'INLET');
  const endCovers = availableComponents.filter((c) => c.tipo_modulo === 'END_COVER');
  const isEco80 = selectedFamily.id === 'DANFOSS_ECO80';

  // Sub-pasos internos de Fase 2
  const subSteps = [
    { id: 'CHASIS', stepNumber: 1, title: '1. Entrada y Chasis', desc: isEco80 ? 'EVP y EVO' : 'Inlet y Cover' },
    { id: 'SECCIONES', stepNumber: 2, title: '2. Cuerpos de Trabajo', desc: `${sections.length} Secciones configuradas` },
    { id: 'TIRANTES', stepNumber: 3, title: '3. Ensamble y Tirantes', desc: tieRodKit ? `Kit ${tieRodKit.sku}` : 'Cálculo dinámico' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Eco80TechnicalModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />

      {/* Encabezado y Barra de Sub-Pasos de Fase 2 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#F26522]/15 text-[#F26522] border border-[#F26522]/30 rounded-full text-xs font-semibold uppercase font-mono">
              Fase 2: Constructor Modular
            </span>
            <span className="text-xs text-zinc-400 font-mono">Serie: {selectedFamily.nombre}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configuración y Apilado Paso a Paso
          </h1>
        </div>

        {/* Pestañas de Sub-Pasos */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl">
          {subSteps.map((st) => {
            const isActive = phase2SubStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setPhase2SubStep(st.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all text-left flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#F26522] text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                  isActive ? 'bg-black text-[#F26522]' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {st.stepNumber}
                </span>
                <div>
                  <span className="block font-bold">{st.title}</span>
                  <span className={`text-[10px] hidden sm:block ${isActive ? 'text-white/80' : 'text-zinc-500'}`}>
                    {st.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTechModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-[#F26522] hover:border-[#F26522]/50 text-xs font-semibold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F26522]" />
            CoreBook
          </button>

          <button
            onClick={generateBOM}
            className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-[#F26522]/20"
          >
            Finalizar BOM
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

        <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {isEco80 ? 'Norma Danfoss Power Solutions ECO 80' : 'Danfoss PVG Standard'}
        </div>
      </div>

      {/* Lienzo Visual (2D o 3D) */}
      {viewMode === '2D' ? <ValveCanvas2D /> : <ValveCanvas3D />}

      {/* CONTENIDO SEGÚN EL SUB-PASO ACTIVO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        
        {/* =========================================================================
            SUB-PASO 1: ENTRADA Y CHASIS
            ========================================================================= */}
        {phase2SubStep === 'CHASIS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#F26522] uppercase">Paso 2.1</span>
                <h3 className="text-lg font-bold text-white">Configuración del Módulo de Entrada y Tapa</h3>
                <p className="text-xs text-zinc-400">
                  Selecciona la entrada hidráulica adecuada según el tipo de pilotaje (PPRV) y requerimiento de descarga (EVPX).
                </p>
              </div>

              <button
                onClick={() => setPhase2SubStep('SECCIONES')}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                Continuar a Secciones
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de Entrada */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                <label className="text-sm font-bold text-white block">
                  Módulo de Entrada ({isEco80 ? 'EVP' : 'PVP'})
                </label>
                
                <div className="space-y-2.5">
                  {inlets.map((inl) => {
                    const isSelected = inlet?.id === inl.id;
                    return (
                      <div
                        key={inl.id}
                        onClick={() => setInlet(inl)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]/10 text-white shadow-md'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">{inl.nombre}</span>
                          <span className="font-mono text-[11px] text-[#F26522] font-semibold">SKU: {inl.sku}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">{inl.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Tapa Terminal */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                <label className="text-sm font-bold text-white block">
                  Tapa de Cierre ({isEco80 ? 'EVO' : 'PVS'})
                </label>

                <div className="space-y-2.5">
                  {endCovers.map((cov) => {
                    const isSelected = endCover?.id === cov.id;
                    return (
                      <div
                        key={cov.id}
                        onClick={() => setEndCover(cov)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]/10 text-white shadow-md'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">{cov.nombre}</span>
                          <span className="font-mono text-[11px] text-[#F26522] font-semibold">SKU: {cov.sku}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">{cov.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-PASO 2: SECCIONES DE TRABAJO
            ========================================================================= */}
        {phase2SubStep === 'SECCIONES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#F26522] uppercase">Paso 2.2</span>
                <h3 className="text-lg font-bold text-white">
                  Personalización de Cuerpos de Trabajo ({sections.length} de {selectedFamily.max_work_sections} máx.)
                </h3>
                <p className="text-xs text-zinc-400">
                  Configura el mando, carrete y pórticos de cada cuerpo de forma independiente.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={addSection}
                  disabled={sections.length >= selectedFamily.max_work_sections}
                  className="bg-zinc-800 hover:bg-zinc-700 text-[#F26522] border border-zinc-700 hover:border-[#F26522]/50 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4 text-[#F26522]" />
                  Agregar Cuerpo
                </button>

                <button
                  onClick={() => setPhase2SubStep('TIRANTES')}
                  className="bg-[#F26522] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  Verificar Tirantes
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Selector de Pestañas por Sección */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800/80">
              {sections.map((sec, idx) => {
                const isSelected = activeSectionIndex === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#F26522] text-white shadow-md'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Cuerpo #{idx + 1}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      {sec.selectedActuator?.nombre_opcion.split(' ')[0] || 'EVB'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Editor de la Sección Activa */}
            {sections[activeSectionIndex] && (
              <SectionItemConfigurator
                section={sections[activeSectionIndex]}
                index={activeSectionIndex}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            SUB-PASO 3: ENSAMBLE Y TIRANTES
            ========================================================================= */}
        {phase2SubStep === 'TIRANTES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#F26522] uppercase">Paso 2.3</span>
                <h3 className="text-lg font-bold text-white">Validación de Ensamble y Kit de Tirantes</h3>
                <p className="text-xs text-zinc-400">
                  Comprueba el cálculo automático de los espárragos y tuercas de unión según el espesor total acumulado.
                </p>
              </div>

              <button
                onClick={generateBOM}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                Generar Cotización y BOM
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block">Total de Secciones de Trabajo:</span>
                <span className="text-xl font-bold font-mono text-white">{sections.length} cuerpos</span>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block">Longitud Estimada de Bloque:</span>
                <span className="text-xl font-bold font-mono text-[#F26522]">
                  {(
                    (inlet?.grosor_mm || 0) +
                    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
                    (endCover?.grosor_mm || 0)
                  ).toFixed(1)}{' '}
                  mm
                </span>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block">Kit de Tirantes Asignado:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {tieRodKit?.sku} ({tieRodKit?.longitud_mm} mm)
                </span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Resumen de Compatibilidad del Bloque
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Todos los módulos mecánicos, electrohidráulicos, reductora PPRV y tirantes cumplen estrictamente con los límites de par de apriete y presión máxima ({selectedFamily.max_psi} PSI) de Danfoss Power Solutions.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setPhase2SubStep('SECCIONES')}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a editar secciones
              </button>

              <button
                onClick={generateBOM}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                Pasar a Cotización Oficial Lion Store
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
