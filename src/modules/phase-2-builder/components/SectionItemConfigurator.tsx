'use client';

import React from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { translations } from '@/lib/i18n/translations';
import { SectionConfiguration } from '@/types/component';
import { Trash2, Copy, Zap, Compass, CircleDot } from 'lucide-react';

interface Props {
  section: SectionConfiguration;
  index: number;
}

export const SectionItemConfigurator: React.FC<Props> = ({ section, index }) => {
  const {
    availableOptions,
    updateSectionOption,
    removeSection,
    duplicateSection,
    sections,
    selectedFamily,
    language
  } = useValveStore();

  const t = translations[language];
  const p2 = t.phase2Content;
  const maxSections = selectedFamily?.max_work_sections || 8;
  const canAddMore = sections.length < maxSections;

  const options = availableOptions[section.componentId] || [];
  const actuators = options.filter((o) => o.categoria_opcion === 'ACTUADOR');
  const spools = options.filter((o) => o.categoria_opcion === 'SPOOL_TIPO');
  const ports = options.filter((o) => o.categoria_opcion === 'PUERTO');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
      
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
              {p2.sectionNumber.replace('{num}', String(index + 1))}: {section.component.nombre}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              SKU {section.component.sku} • {section.component.grosor_mm} mm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botón Duplicar Sección */}
          <button
            onClick={() => duplicateSection(section.id)}
            disabled={!canAddMore}
            className="p-2 text-slate-400 hover:text-[#F26522] hover:bg-[#F26522]/10 rounded-xl transition-all disabled:opacity-30"
            title={p2.duplicateSection}
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Botón Eliminar Sección */}
          {sections.length > 1 && (
            <button
              onClick={() => removeSection(section.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title={p2.deleteSection}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Controles de Selección */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Mando / Actuador */}
        <div className="space-y-1.5">
          <label className="text-slate-600 font-medium flex items-center gap-1.5 text-xs">
            <Zap className="w-3.5 h-3.5 text-[#F26522]" />
            <span>{p2.actuatorLabel}</span>
          </label>
          <select
            value={section.selectedActuator?.id || ''}
            onChange={(e) => {
              const opt = actuators.find((a) => a.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'ACTUADOR', opt);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] text-xs font-normal transition-all"
          >
            {actuators.map((act) => (
              <option key={act.id} value={act.id}>
                {act.nombre_opcion} ({act.sku_accesorio})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Carrete / Spool */}
        <div className="space-y-1.5">
          <label className="text-slate-600 font-medium flex items-center gap-1.5 text-xs">
            <Compass className="w-3.5 h-3.5 text-slate-600" />
            <span>{p2.spoolLabel}</span>
          </label>
          <select
            value={section.selectedSpool?.id || ''}
            onChange={(e) => {
              const opt = spools.find((s) => s.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'SPOOL_TIPO', opt);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] text-xs font-normal transition-all"
          >
            {spools.map((spool) => (
              <option key={spool.id} value={spool.id}>
                {spool.nombre_opcion}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Puertos */}
        <div className="space-y-1.5">
          <label className="text-slate-600 font-medium flex items-center gap-1.5 text-xs">
            <CircleDot className="w-3.5 h-3.5 text-emerald-600" />
            <span>{p2.portLabel}</span>
          </label>
          <select
            value={section.selectedPort?.id || ''}
            onChange={(e) => {
              const opt = ports.find((p) => p.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'PUERTO', opt);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] text-xs font-normal transition-all"
          >
            {ports.map((port) => (
              <option key={port.id} value={port.id}>
                {port.nombre_opcion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
