'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { translations } from '@/lib/i18n/translations';
import { Ruler, Plus, Trash2, Copy, Info, Check, Sparkles } from 'lucide-react';

export const ValveCanvas2D: React.FC = () => {
  const {
    inlet,
    sections,
    endCover,
    tieRodKit,
    selectedFamily,
    addSection,
    removeSection,
    duplicateSection,
    activeSectionIndex,
    setActiveSectionIndex,
    setPhase2SubStep,
    language
  } = useValveStore();

  const [showDimensions, setShowDimensions] = useState(true);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    sku: string;
    desc: string;
    grosor: number;
    subdetails?: string[];
  } | null>(null);

  const t = translations[language];
  const p2 = t.phase2Content;
  const isEco80 = selectedFamily?.id === 'DANFOSS_ECO80';
  const maxSections = selectedFamily?.max_work_sections || 8;
  const canAddMore = sections.length < maxSections;

  // Calcular longitud total acumulada en mm
  const totalLengthMm =
    (inlet?.grosor_mm || 0) +
    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
    (endCover?.grosor_mm || 0);

  // Escalas visuales (ancho en píxeles proporcional a mm con mínimo legible)
  const inletPx = Math.max(54, Math.round((inlet?.grosor_mm || 48) * 1.15));
  const coverPx = Math.max(38, Math.round((endCover?.grosor_mm || 24) * 1.25));
  const sectionPx = 52; // 40-42mm estándar

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] relative flex flex-col justify-between overflow-hidden space-y-6">
      
      {/* 1. BARRA SUPERIOR DE HERRAMIENTAS Y COTAS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
              {p2.assemblyDimensions}
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {sections.length} / {maxSections} {language === 'en' ? 'Sections' : 'Secciones'}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mt-0.5 tracking-tight">
            {selectedFamily?.nombre || 'Bloque Modular Danfoss'}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          {/* Botón Alternar Cotas Técnicas */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              showDimensions
                ? 'bg-[#F26522]/10 border-[#F26522]/30 text-[#F26522]'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{showDimensions ? p2.dimShow : p2.dimHide}</span>
          </button>

          {/* Badge Medida Total */}
          <div className="bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-full text-slate-700 font-medium">
            {p2.totalLength}: <strong className="text-slate-950 font-semibold">{totalLengthMm.toFixed(1)} mm</strong>
          </div>

          {/* Botón rápido "+ Agregar Sección" */}
          <button
            onClick={addSection}
            disabled={!canAddMore}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F26522] hover:bg-[#E05312] text-white text-xs font-medium transition-all shadow-xs disabled:opacity-40"
            title={!canAddMore ? p2.maxSectionsWarning.replace('{max}', String(maxSections)) : ''}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{p2.addSectionBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE DIBUJO TÉCNICO CAD / PLANO CON COTAS VECTORIALES */}
      <div className="overflow-x-auto py-2 flex flex-col items-center justify-center min-h-[290px]">
        
        {/* Lienzo del ensamble con retícula de ingeniería sutil */}
        <div className="inline-flex flex-col items-center p-8 bg-slate-50/70 engineering-grid rounded-2xl border border-slate-200/80 relative select-none">
          
          {/* =========================================================================
              A. LÍNEA DE COTA SUPERIOR VECTORIAL (LONGITUD TOTAL)
              ========================================================================= */}
          {showDimensions && (
            <div className="w-full flex flex-col items-center mb-4 animate-in fade-in duration-200">
              <div className="w-full flex items-center justify-between text-xs text-[#F26522] font-medium relative px-1">
                {/* Flecha izquierda SVG */}
                <svg className="w-2.5 h-2.5 fill-[#F26522] shrink-0 -mr-0.5" viewBox="0 0 10 10">
                  <polygon points="0,5 10,1 10,9" />
                </svg>

                {/* Línea horizontal continua con etiqueta de cota */}
                <div className="h-[1.5px] flex-1 bg-[#F26522] relative flex items-center justify-center">
                  <div className="bg-white px-3 py-0.5 rounded-full border border-[#F26522]/30 text-xs font-semibold text-[#F26522] shadow-xs flex items-center gap-1.5 whitespace-nowrap">
                    <span>{p2.totalLength}:</span>
                    <span className="font-bold">{totalLengthMm.toFixed(1)} mm</span>
                  </div>
                </div>

                {/* Flecha derecha SVG */}
                <svg className="w-2.5 h-2.5 fill-[#F26522] shrink-0 -ml-0.5" viewBox="0 0 10 10">
                  <polygon points="10,5 0,1 0,9" />
                </svg>
              </div>
            </div>
          )}

          {/* =========================================================================
              B. FILA DEL ENSAMBLE MODULAR (INLET + SECCIONES + BOTÓN ADD + COVER)
              ========================================================================= */}
          <div className="flex items-end gap-1 relative">
            
            {/* Cota Vertical de Altura (115 mm) */}
            {showDimensions && (
              <div className="flex flex-col items-center justify-between mr-3 self-stretch pt-7 pb-2 text-[10px] text-slate-400 select-none">
                <svg className="w-2 h-2 fill-slate-400 shrink-0" viewBox="0 0 10 10">
                  <polygon points="5,0 1,10 9,10" />
                </svg>
                <div className="w-[1px] flex-1 bg-slate-300 relative flex items-center justify-center my-1">
                  <span className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[9px] font-medium text-slate-600 -rotate-90 whitespace-nowrap absolute">
                    115 mm
                  </span>
                </div>
                <svg className="w-2 h-2 fill-slate-400 shrink-0" viewBox="0 0 10 10">
                  <polygon points="5,10 1,0 9,0" />
                </svg>
              </div>
            )}

            {/* 1. MÓDULO DE ENTRADA (INLET / EVP) */}
            {inlet && (
              <div
                onMouseEnter={() =>
                  setActiveTooltip({
                    title: inlet.nombre,
                    sku: inlet.sku,
                    desc: inlet.descripcion || 'Entrada con regulador de pilotaje y bypass.',
                    grosor: inlet.grosor_mm,
                    subdetails: [
                      isEco80 ? 'Serie: ECO 80 EVP' : 'Serie: PVG 32 PVP',
                      inlet.sku === '11173000' ? 'Equipado con EVPX (Descarga)' : 'Sin EVPX',
                      `Espesor: ${inlet.grosor_mm} mm`
                    ]
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                {/* Cabezales superiores del Inlet */}
                <div className="flex items-center gap-1 mb-1.5 h-6">
                  {inlet.sku === '11173000' && (
                    <div className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[8px] font-bold tracking-tight shadow-xs">
                      EVPX
                    </div>
                  )}
                  <div className="w-6 h-4 bg-slate-800 text-white rounded flex items-center justify-center text-[8px] font-bold shadow-xs">
                    P/T
                  </div>
                </div>

                {/* Bloque Maquinado del Inlet */}
                <div
                  style={{ width: `${inletPx}px`, height: '108px' }}
                  className="bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-l-xl flex flex-col justify-between p-2 shadow-xs group-hover:border-[#F26522] group-hover:ring-1 group-hover:ring-[#F26522]/30 transition-all"
                >
                  <div className="text-[10px] font-semibold text-slate-600 tracking-tight">
                    {isEco80 ? 'EVP' : 'PVP'}
                  </div>
                  
                  {/* Orificio CNC de entrada hidráulica P */}
                  <div className="self-center flex flex-col items-center gap-1">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-400 bg-slate-300/80 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-700 tracking-tight">INLET</span>
                  </div>

                  <div className="text-[9px] text-slate-500 font-medium text-right">
                    {inlet.grosor_mm}mm
                  </div>
                </div>

                {/* Cota Inferior Individual */}
                {showDimensions && (
                  <div className="w-full mt-2.5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-[9px] text-slate-400">
                      <span className="text-slate-300 font-light">|</span>
                      <div className="h-[1px] flex-1 bg-slate-300 mx-0.5"></div>
                      <span className="text-slate-300 font-light">|</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {inlet.grosor_mm} mm
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2. CUERPOS DE TRABAJO (EVB / PVB) */}
            {sections.map((sec, index) => {
              const isSelected = activeSectionIndex === index;
              const isHovered = hoveredSectionId === sec.id;
              const isManual =
                (sec.selectedActuator?.sku_accesorio && sec.selectedActuator.sku_accesorio.includes('3171')) ||
                (sec.selectedActuator?.sku_accesorio && sec.selectedActuator.sku_accesorio.includes('11175314')) ||
                (sec.selectedActuator?.sku_accesorio && sec.selectedActuator.sku_accesorio.includes('11172533'));

              return (
                <div
                  key={sec.id}
                  onMouseEnter={() => {
                    setHoveredSectionId(sec.id);
                    setActiveTooltip({
                      title: `${p2.sectionNumber.replace('{num}', String(index + 1))}: ${sec.component.nombre}`,
                      sku: sec.component.sku,
                      desc: sec.component.descripcion || 'Sección con control direccional y compensador.',
                      grosor: sec.component.grosor_mm,
                      subdetails: [
                        `${p2.actuatorLabel}: ${sec.selectedActuator?.nombre_opcion || 'Sin especificar'}`,
                        `${p2.spoolLabel}: ${sec.selectedSpool?.nombre_opcion || 'Estándar'}`,
                        `${p2.portLabel}: ${sec.selectedPort?.nombre_opcion || 'Estándar'}`
                      ]
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredSectionId(null);
                    setActiveTooltip(null);
                  }}
                  onClick={() => {
                    setActiveSectionIndex(index);
                    setPhase2SubStep('SECCIONES');
                  }}
                  className="group relative cursor-pointer flex flex-col items-center"
                >
                  {/* Micro barra de acciones flotante (Duplicar / Eliminar) */}
                  <div
                    className={`absolute -top-9 z-20 flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-md transition-all ${
                      isHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSection(sec.id);
                      }}
                      disabled={!canAddMore}
                      className="p-1 hover:text-[#F26522] text-slate-500 rounded-full transition-colors disabled:opacity-30"
                      title={p2.duplicateSection}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {sections.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(sec.id);
                        }}
                        className="p-1 hover:text-rose-600 text-slate-500 rounded-full transition-colors"
                        title={p2.deleteSection}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Visualizador Superior del Mando / Actuador */}
                  <div className="flex flex-col items-center mb-1.5 h-6 justify-end">
                    {isManual ? (
                      <div className="flex flex-col items-center" title="Palanca Manual">
                        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full shadow-xs"></div>
                        <div className="w-1 h-3.5 bg-slate-400"></div>
                      </div>
                    ) : (
                      <div
                        className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-bold shadow-xs tracking-tight"
                        title="Actuador Solenoide Eléctrico 24V"
                      >
                        24V
                      </div>
                    )}
                  </div>

                  {/* Bloque Maquinado del Cuerpo EVB */}
                  <div
                    style={{ width: `${sectionPx}px`, height: '108px' }}
                    className={`border flex flex-col justify-between p-2 shadow-xs transition-all relative ${
                      isSelected
                        ? 'border-[#F26522] bg-white ring-2 ring-[#F26522]/30 z-10'
                        : 'border-slate-300 bg-gradient-to-b from-white to-slate-50 group-hover:border-[#F26522]'
                    }`}
                  >
                    {/* Indicador de Sección # */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#F26522]">#{index + 1}</span>
                      <span className="text-[8px] font-medium text-slate-400">
                        {isEco80 ? 'EVB' : 'PVB'}
                      </span>
                    </div>

                    {/* Puertos A y B maquinados con centros circulares */}
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      <div
                        className="flex flex-col items-center"
                        title={`Puerto A: ${sec.selectedPort?.nombre_opcion || ''}`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full border border-emerald-600 bg-emerald-100 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                        </div>
                        <span className="text-[7px] font-bold text-emerald-800 mt-0.5">A</span>
                      </div>
                      <div
                        className="flex flex-col items-center"
                        title={`Puerto B: ${sec.selectedPort?.nombre_opcion || ''}`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full border border-emerald-600 bg-emerald-100 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                        </div>
                        <span className="text-[7px] font-bold text-emerald-800 mt-0.5">B</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-500 font-medium text-right">
                      {sec.component.grosor_mm}mm
                    </div>
                  </div>

                  {/* Cota Inferior Individual */}
                  {showDimensions && (
                    <div className="w-full mt-2.5 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between text-[9px] text-slate-400">
                        <span className="text-slate-300 font-light">|</span>
                        <div className="h-[1px] flex-1 bg-slate-300 mx-0.5"></div>
                        <span className="text-slate-300 font-light">|</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 mt-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {sec.component.grosor_mm} mm
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 3. BOTÓN INTERACTIVO VISUAL PARA AGREGAR MÁS SECCIONES (+ SECCIÓN) */}
            {canAddMore && (
              <div
                onClick={addSection}
                className="group cursor-pointer flex flex-col items-center self-end mb-0 transition-all"
                title={`${p2.addSectionVisual} (${p2.addSectionSubtext})`}
              >
                <div className="h-6"></div>
                <div
                  style={{ width: '48px', height: '108px' }}
                  className="border-2 border-dashed border-slate-300 hover:border-[#F26522] bg-white/70 hover:bg-[#F26522]/[0.04] rounded-lg flex flex-col items-center justify-center p-1.5 text-center transition-all group-hover:scale-102"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#F26522] group-hover:text-white text-slate-500 flex items-center justify-center transition-all shadow-2xs">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 group-hover:text-[#F26522] mt-2 leading-tight">
                    {p2.addSectionVisual}
                  </span>
                  <span className="text-[8px] text-slate-400 group-hover:text-[#F26522]/80 mt-0.5">
                    +40mm
                  </span>
                </div>

                {/* Espaciador alineado con las cotas inferiores */}
                {showDimensions && <div className="h-9"></div>}
              </div>
            )}

            {/* 4. TAPA DE CIERRE FINAL (END COVER / EVO) */}
            {endCover && (
              <div
                onMouseEnter={() =>
                  setActiveTooltip({
                    title: endCover.nombre,
                    sku: endCover.sku,
                    desc: endCover.descripcion || 'Cierre de terminal de ensamble.',
                    grosor: endCover.grosor_mm,
                    subdetails: [
                      isEco80 ? 'Serie: ECO 80 EVO' : 'Serie: PVG 32 PVS',
                      endCover.sku === '11191582' ? 'Con Puerto LX' : 'Ciega Estándar'
                    ]
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                <div className="h-6"></div>
                <div
                  style={{ width: `${coverPx}px`, height: '108px' }}
                  className="bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-r-xl flex flex-col justify-between p-2 shadow-xs group-hover:border-[#F26522] group-hover:ring-1 group-hover:ring-[#F26522]/30 transition-all"
                >
                  <div className="text-[10px] font-semibold text-slate-600 tracking-tight">
                    {isEco80 ? 'EVO' : 'PVS'}
                  </div>
                  <div className="text-[9px] font-semibold text-center text-slate-700 tracking-tight">
                    END
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium text-right">
                    {endCover.grosor_mm}mm
                  </div>
                </div>

                {/* Cota Inferior Individual */}
                {showDimensions && (
                  <div className="w-full mt-2.5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-[9px] text-slate-400">
                      <span className="text-slate-300 font-light">|</span>
                      <div className="h-[1px] flex-1 bg-slate-300 mx-0.5"></div>
                      <span className="text-slate-300 font-light">|</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {endCover.grosor_mm} mm
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =========================================================================
              C. LÍNEA TÉCNICA DEL KIT DE TIRANTES (TIE RODS)
              ========================================================================= */}
          {tieRodKit && (
            <div className="w-full flex flex-col items-center mt-5 pt-4 border-t border-slate-200/80">
              <div className="w-full flex items-center justify-between text-xs text-slate-700 font-medium relative px-1">
                {/* Tuerca izquierda de tirante */}
                <div className="w-2.5 h-3.5 bg-slate-700 rounded-xs border border-slate-800 shadow-2xs flex items-center justify-center text-[7px] text-white">
                  ⬡
                </div>

                {/* Varilla del tirante con rosca y cota nominal */}
                <div className="h-1.5 flex-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-full mx-1 relative flex items-center justify-center shadow-inner">
                  <div className="bg-white px-3.5 py-0.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs whitespace-nowrap flex items-center gap-1.5">
                    <span className="text-[#F26522] font-bold">{p2.tieRodKit}:</span>
                    <span>SKU {tieRodKit.sku}</span>
                    <span className="text-slate-400">•</span>
                    <span>{tieRodKit.longitud_mm} mm ({p2.nominalLength})</span>
                  </div>
                </div>

                {/* Tuerca derecha de tirante */}
                <div className="w-2.5 h-3.5 bg-slate-700 rounded-xs border border-slate-800 shadow-2xs flex items-center justify-center text-[7px] text-white">
                  ⬡
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. TARJETAS DE DESGLOSE TÉCNICO (CAD METRICS) */}
      {showDimensions && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">{p2.summaryInlet}</span>
            <span className="text-slate-900 font-semibold text-sm mt-0.5 block">{inlet?.grosor_mm || 0} mm</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">
              {p2.summarySections.replace('{count}', String(sections.length))}
            </span>
            <span className="text-slate-900 font-semibold text-sm mt-0.5 block">
              {sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0)} mm
            </span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">{p2.summaryCover}</span>
            <span className="text-slate-900 font-semibold text-sm mt-0.5 block">{endCover?.grosor_mm || 0} mm</span>
          </div>
          <div className="bg-[#F26522]/[0.04] p-3 rounded-2xl border border-[#F26522]/30">
            <span className="text-[11px] text-[#F26522] font-semibold block">{p2.summaryTotal}</span>
            <span className="text-[#F26522] font-bold text-sm mt-0.5 block">{totalLengthMm.toFixed(1)} mm</span>
          </div>
        </div>
      )}

      {/* 4. TOOLTIP O GUÍA DE INTERACCIÓN */}
      {activeTooltip ? (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#F26522]" />
              {activeTooltip.title}
            </span>
            <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-900 font-semibold text-[11px]">
              SKU {activeTooltip.sku} • {activeTooltip.grosor} mm
            </span>
          </div>
          <p className="text-slate-600 text-xs">{activeTooltip.desc}</p>
          {activeTooltip.subdetails && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
              {activeTooltip.subdetails.map((sub, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200/80">
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-xs text-slate-400 py-1 font-normal">
          {p2.hoverInspection}
        </div>
      )}
    </div>
  );
};
