'use client';

import React from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { SectionConfiguration, ComponentOption } from '@/types/component';
import { Trash2, Settings, Zap, Compass, CircleDot } from 'lucide-react';

interface Props {
  section: SectionConfiguration;
  index: number;
}

export const SectionItemConfigurator: React.FC<Props> = ({ section, index }) => {
  const { availableOptions, updateSectionOption, removeSection, sections } = useValveStore();

  const options = availableOptions[section.componentId] || [];
  const actuators = options.filter((o) => o.categoria_opcion === 'ACTUADOR');
  const spools = options.filter((o) => o.categoria_opcion === 'SPOOL_TIPO');
  const ports = options.filter((o) => o.categoria_opcion === 'PUERTO');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-all hover:border-zinc-700">
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-[#F26522]/15 text-[#F26522] font-mono text-xs font-bold flex items-center justify-center border border-[#F26522]/30">
            {index + 1}
          </span>
          <div>
            <h4 className="text-sm font-bold text-white">Cuerpo #{index + 1}: {section.component.nombre}</h4>
            <span className="text-[11px] font-mono text-zinc-400">SKU Base: {section.component.sku} ({section.component.grosor_mm} mm)</span>
          </div>
        </div>

        {sections.length > 1 && (
          <button
            onClick={() => removeSection(section.id)}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Eliminar Sección"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controles de Selección */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* 1. Mando / Actuador */}
        <div className="space-y-1.5">
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Tipo de Mando
          </label>
          <select
            value={section.selectedActuator?.id || ''}
            onChange={(e) => {
              const opt = actuators.find((a) => a.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'ACTUADOR', opt);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
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
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Carrete (Spool)
          </label>
          <select
            value={section.selectedSpool?.id || ''}
            onChange={(e) => {
              const opt = spools.find((s) => s.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'SPOOL_TIPO', opt);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
          >
            {spools.map((spool) => (
              <option key={spool.id} value={spool.id}>
                {spool.nombre_opcion}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Puertos A y B */}
        <div className="space-y-1.5">
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            Roscas / Puertos
          </label>
          <select
            value={section.selectedPort?.id || ''}
            onChange={(e) => {
              const opt = ports.find((p) => p.id === e.target.value);
              if (opt) updateSectionOption(section.id, 'PUERTO', opt);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
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
