'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { translations } from '@/lib/i18n/translations';
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
  ShieldCheck,
  BookOpen,
  CheckCircle2
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
    setActiveSectionIndex,
    language
  } = useValveStore();

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  const t = translations[language];
  const p2 = t.phase2Content;

  if (!selectedFamily) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500 font-normal">
          {language === 'en'
            ? 'No hydraulic family selected yet.'
            : 'No se ha seleccionado ninguna familia hidráulica aún.'}
        </p>
        <button
          onClick={() => setPhase(1)}
          className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2.5 rounded-full font-medium text-xs shadow-sm transition-all"
        >
          {t.welcome.startButton}
        </button>
      </div>
    );
  }

  const inlets = availableComponents.filter((c) => c.tipo_modulo === 'INLET');
  const endCovers = availableComponents.filter((c) => c.tipo_modulo === 'END_COVER');
  const isEco80 = selectedFamily.id === 'DANFOSS_ECO80';

  const subSteps = [
    { id: 'CHASIS', title: p2.substepChassis },
    { id: 'SECCIONES', title: p2.substepSections.replace('{count}', String(sections.length)) },
    { id: 'TIRANTES', title: p2.substepTieRods }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Eco80TechnicalModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />

      {/* Encabezado Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
            Serie: {selectedFamily.nombre}
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mt-0.5">
            {language === 'en' ? 'Modular Configurator' : 'Constructor Modular'}
          </h1>
        </div>

        {/* Barra de Sub-Pasos Tipo Apple/Linear */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/80 self-start md:self-auto">
          {subSteps.map((st) => {
            const isActive = phase2SubStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setPhase2SubStep(st.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.title}
              </button>
            );
          })}
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsTechModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:text-[#F26522] text-xs font-medium transition-all shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F26522]" />
            <span>CoreBook</span>
          </button>

          <button
            onClick={generateBOM}
            className="inline-flex items-center gap-1.5 bg-[#F26522] hover:bg-[#E05312] text-white px-5 py-2 rounded-full text-xs font-medium transition-all shadow-sm"
          >
            <span>{p2.proceedToQuote}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selector de Modo de Visualización y Certificación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => setViewMode('2D')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode === '2D'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{p2.view2D}</span>
          </button>

          <button
            onClick={() => setViewMode('3D')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode === '3D'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{p2.view3D}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isEco80 ? 'Danfoss ECO 80 Standard' : 'Danfoss PVG 32 Standard'}</span>
        </div>
      </div>

      {/* Lienzo Visual (2D o 3D) */}
      {viewMode === '2D' ? <ValveCanvas2D /> : <ValveCanvas3D />}

      {/* Contenedor Principal de la Configuración Activa */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.03)] space-y-8">
        
        {/* =========================================================================
            SUB-PASO 1: ENTRADA Y CHASIS
            ========================================================================= */}
        {phase2SubStep === 'CHASIS' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  01
                </span>
                <h3 className="text-xl font-light text-slate-900 tracking-tight mt-0.5">
                  {p2.inletModule} & {p2.endCoverModule}
                </h3>
              </div>

              <button
                onClick={() => setPhase2SubStep('SECCIONES')}
                className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
              >
                <span>{language === 'en' ? 'Continue to Sections' : 'Continuar a Secciones'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Selector de Entrada */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
                    {p2.inletModule}
                  </label>
                  <p className="text-xs text-slate-500">
                    {language === 'en'
                      ? 'Includes pilot pressure reducing valve (PPRV) for electrohydraulic solenoids.'
                      : 'Incluye reductora de presión de pilotaje PPRV para solenoides.'}
                  </p>
                </div>
                
                <div className="space-y-2.5">
                  {inlets.map((inl) => {
                    const isSelected = inlet?.id === inl.id;
                    return (
                      <div
                        key={inl.id}
                        onClick={() => setInlet(inl)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                            : 'border-slate-200/80 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">{inl.nombre}</span>
                            <span className="text-xs text-[#F26522] font-semibold">SKU {inl.sku}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{inl.descripcion}</p>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected
                              ? 'border-[#F26522] bg-[#F26522]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Tapa Terminal */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
                    {p2.endCoverModule}
                  </label>
                  <p className="text-xs text-slate-500">
                    {language === 'en'
                      ? 'Seals internal pressure, tank, and load sensing channels.'
                      : 'Sella los canales internos de presión, tanque y señal LS.'}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {endCovers.map((cov) => {
                    const isSelected = endCover?.id === cov.id;
                    return (
                      <div
                        key={cov.id}
                        onClick={() => setEndCover(cov)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                            : 'border-slate-200/80 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">{cov.nombre}</span>
                            <span className="text-xs text-[#F26522] font-semibold">SKU {cov.sku}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{cov.descripcion}</p>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected
                              ? 'border-[#F26522] bg-[#F26522]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
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
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  02
                </span>
                <h3 className="text-xl font-light text-slate-900 tracking-tight mt-0.5">
                  {language === 'en'
                    ? `Work Sections (${sections.length} of ${selectedFamily.max_work_sections} max)`
                    : `Cuerpos de Trabajo (${sections.length} de ${selectedFamily.max_work_sections} máx.)`}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={addSection}
                  disabled={sections.length >= selectedFamily.max_work_sections}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>{p2.addSectionBtn}</span>
                </button>

                <button
                  onClick={() => setPhase2SubStep('TIRANTES')}
                  className="bg-[#F26522] hover:bg-[#E05312] text-white px-5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{language === 'en' ? 'Verify Tie Rods' : 'Verificar Tirantes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pestañas de Secciones */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {sections.map((sec, idx) => {
                const isSelected = activeSectionIndex === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`px-4 py-2 rounded-full text-xs transition-all shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white font-medium shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{p2.sectionNumber.replace('{num}', String(idx + 1))}</span>
                    <span className="text-[10px] opacity-70">
                      {sec.selectedActuator?.nombre_opcion.split(' ')[0] || 'EVB'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Configuración de la Sección Seleccionada */}
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
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  03
                </span>
                <h3 className="text-xl font-light text-slate-900 tracking-tight mt-0.5">
                  {language === 'en'
                    ? 'Assembly Validation & Tie Rod Kit'
                    : 'Validación de Ensamble y Kit de Tirantes'}
                </h3>
              </div>

              <button
                onClick={generateBOM}
                className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
              >
                <span>{p2.proceedToQuote}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
                  {language === 'en' ? 'Sectional Bodies' : 'Cuerpos Seccionales'}
                </span>
                <span className="text-2xl font-light text-slate-900 block">
                  {sections.length}{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    {language === 'en' ? 'sections' : 'secciones'}
                  </span>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
                  {p2.totalLength}
                </span>
                <span className="text-2xl font-light text-[#F26522] block">
                  {(
                    (inlet?.grosor_mm || 0) +
                    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
                    (endCover?.grosor_mm || 0)
                  ).toFixed(1)}{' '}
                  <span className="text-xs text-slate-500 font-normal">mm</span>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
                  {p2.tieRodKit}
                </span>
                <span className="text-lg font-semibold text-emerald-700 block">
                  SKU {tieRodKit?.sku}
                </span>
                <span className="text-xs text-slate-500">
                  {tieRodKit?.longitud_mm} mm {p2.nominalLength}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'en'
                    ? 'Verified Assembly Preload & Torque Compatibility'
                    : 'Compatibilidad y Par de Apriete Verificado'}
                </span>
              </div>
              <p className="text-emerald-900/80 leading-relaxed text-xs">
                {language === 'en'
                  ? `The assigned high-tensile studs and nuts provide sufficient clamp force to withstand up to ${selectedFamily.max_psi} continuous PSI without O-ring seal extrusion.`
                  : `El conjunto de espárragos y tuercas asignado soporta la precarga requerida para resistir hasta ${selectedFamily.max_psi} PSI continuos sin deformación de los sellos tóricos intermedios.`}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setPhase2SubStep('SECCIONES')}
                className="text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Back to sections' : 'Volver a secciones'}</span>
              </button>

              <button
                onClick={generateBOM}
                className="bg-[#F26522] hover:bg-[#E05312] text-white px-8 py-3 rounded-full text-xs font-medium tracking-wide transition-all shadow-sm flex items-center gap-2"
              >
                <span>{p2.proceedToQuote}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
