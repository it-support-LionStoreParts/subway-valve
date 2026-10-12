'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { ValveComponent, SectionConfiguration } from '@/types/component';
import { Info, ZoomIn } from 'lucide-react';

export const ValveCanvas2D: React.FC = () => {
  const { inlet, sections, endCover, tieRodKit, selectedFamily } = useValveStore();
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    sku: string;
    desc: string;
    grosor: number;
    subdetails?: string[];
  } | null>(null);

  // Calcular longitud total acumulada en mm
  const totalLengthMm =
    (inlet?.grosor_mm || 0) +
    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
    (endCover?.grosor_mm || 0);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-inner relative flex flex-col justify-between overflow-hidden">
      {/* Barra superior con metadatos técnicos */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
        <div>
          <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider block">Vista Esquemática 2D</span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            {selectedFamily?.nombre || 'Bloque Modular'}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-zinc-300">
            Longitud Total:{' '}
            <strong className="text-amber-400 font-bold">{totalLengthMm.toFixed(1)} mm</strong>
          </div>
          {tieRodKit && (
            <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg text-amber-400">
              Tirante: <strong className="font-bold">{tieRodKit.sku}</strong> ({tieRodKit.longitud_mm} mm)
            </div>
          )}
        </div>
      </div>

      {/* Área del Canvas SVG Esquemático */}
      <div className="overflow-x-auto py-6 flex justify-center items-center min-h-[220px]">
        <div className="flex items-end gap-1.5 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80 shadow-2xl">
          
          {/* 1. Módulo de Entrada (Inlet) */}
          {inlet && (
            <div
              onMouseEnter={() =>
                setActiveTooltip({
                  title: inlet.nombre,
                  sku: inlet.sku,
                  desc: inlet.descripcion || 'Entrada principal con válvula de alivio.',
                  grosor: inlet.grosor_mm
                })
              }
              onMouseLeave={() => setActiveTooltip(null)}
              className="group relative cursor-pointer flex flex-col items-center"
            >
              {/* Representación de puertos P y T superiores */}
              <div className="w-5 h-4 bg-amber-500/80 rounded-t border-t border-x border-amber-400 mb-0.5 text-[8px] font-mono text-black font-bold flex items-center justify-center">
                P/T
              </div>
              <div
                style={{ width: `${Math.max(45, inlet.grosor_mm * 1.2)}px`, height: '110px' }}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 border-2 border-zinc-600 rounded-l-md flex flex-col justify-between p-1.5 shadow-lg group-hover:border-amber-400 group-hover:shadow-amber-500/20 transition-all"
              >
                <div className="text-[9px] font-mono text-zinc-400 font-bold">PVP</div>
                <div className="text-[10px] font-mono font-bold text-center text-zinc-200">INLET</div>
                <div className="text-[9px] font-mono text-zinc-400 text-right">{inlet.grosor_mm}mm</div>
              </div>
            </div>
          )}

          {/* 2. Secciones de Trabajo (Work Sections) */}
          {sections.map((sec, index) => {
            const isManual = sec.selectedActuator?.categoria_opcion === 'ACTUADOR' && sec.selectedActuator.sku_accesorio.includes('3171');
            return (
              <div
                key={sec.id}
                onMouseEnter={() =>
                  setActiveTooltip({
                    title: `Sección #${index + 1}: ${sec.component.nombre}`,
                    sku: sec.component.sku,
                    desc: sec.component.descripcion || 'Sección con control direccional y compensador.',
                    grosor: sec.component.grosor_mm,
                    subdetails: [
                      `Mando: ${sec.selectedActuator?.nombre_opcion || 'Sin especificar'}`,
                      `Carrete: ${sec.selectedSpool?.nombre_opcion || 'Estándar'}`,
                      `Puerto: ${sec.selectedPort?.nombre_opcion || 'Estándar'}`
                    ]
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                {/* Visualizador del actuador (Palanca o Solenoide Eléctrico) */}
                <div className="flex flex-col items-center mb-0.5">
                  {isManual ? (
                    // Palanca Manual
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 bg-zinc-400 rounded-full border border-zinc-300"></div>
                      <div className="w-1 h-5 bg-zinc-500"></div>
                    </div>
                  ) : (
                    // Solenoide PVE
                    <div className="w-7 h-5 bg-blue-600/90 rounded border border-blue-400 flex items-center justify-center text-[7px] font-mono text-white font-bold">
                      12V/24V
                    </div>
                  )}
                  {/* Puertos A y B de trabajo */}
                  <div className="flex gap-1 mt-0.5">
                    <div className="w-3 h-2 bg-emerald-500 rounded-t text-[6px] font-mono font-bold text-black flex items-center justify-center">
                      A
                    </div>
                    <div className="w-3 h-2 bg-emerald-500 rounded-t text-[6px] font-mono font-bold text-black flex items-center justify-center">
                      B
                    </div>
                  </div>
                </div>

                {/* Cuerpo de la Sección */}
                <div
                  style={{ width: `${Math.max(45, sec.component.grosor_mm * 1.2)}px`, height: '110px' }}
                  className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-zinc-700 flex flex-col justify-between p-1.5 shadow-md group-hover:border-amber-400 group-hover:scale-[1.02] transition-all"
                >
                  <div className="text-[9px] font-mono text-amber-500 font-bold">#{index + 1}</div>
                  <div className="text-[10px] font-mono font-bold text-center text-zinc-100">PVB</div>
                  <div className="text-[9px] font-mono text-zinc-400 text-right">{sec.component.grosor_mm}mm</div>
                </div>
              </div>
            );
          })}

          {/* 3. Tapa de Cierre (End Cover) */}
          {endCover && (
            <div
              onMouseEnter={() =>
                setActiveTooltip({
                  title: endCover.nombre,
                  sku: endCover.sku,
                  desc: endCover.descripcion || 'Cierre de terminal de ensamble con puerto LX.',
                  grosor: endCover.grosor_mm
                })
              }
              onMouseLeave={() => setActiveTooltip(null)}
              className="group relative cursor-pointer flex flex-col items-center"
            >
              <div className="h-4"></div>
              <div
                style={{ width: `${Math.max(30, endCover.grosor_mm * 1.2)}px`, height: '110px' }}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 border-2 border-zinc-600 rounded-r-md flex flex-col justify-between p-1.5 shadow-lg group-hover:border-amber-400 transition-all"
              >
                <div className="text-[9px] font-mono text-zinc-400 font-bold">PVS</div>
                <div className="text-[10px] font-mono font-bold text-center text-zinc-200">END</div>
                <div className="text-[9px] font-mono text-zinc-400 text-right">{endCover.grosor_mm}mm</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Tirantes Inferior (Esquemática) */}
      {tieRodKit && (
        <div className="w-full flex items-center justify-center my-2">
          <div className="w-4/5 h-1.5 bg-amber-500/60 rounded-full relative flex items-center justify-between px-1">
            <div className="w-2 h-2.5 bg-amber-400 rounded-sm -ml-2 border border-black shadow"></div>
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-950 px-2 rounded">
              Tirantes: {tieRodKit.longitud_mm} mm ({tieRodKit.num_secciones} Secc)
            </span>
            <div className="w-2 h-2.5 bg-amber-400 rounded-sm -mr-2 border border-black shadow"></div>
          </div>
        </div>
      )}

      {/* Tooltip Dinámico / Ficha Técnica Flotante */}
      {activeTooltip ? (
        <div className="mt-3 p-3 bg-zinc-900 border border-amber-500/40 rounded-xl shadow-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {activeTooltip.title}
            </span>
            <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-white font-semibold">
              SKU: {activeTooltip.sku}
            </span>
          </div>
          <p className="text-zinc-400">{activeTooltip.desc}</p>
          {activeTooltip.subdetails && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1 text-[11px] text-zinc-300 font-mono">
              {activeTooltip.subdetails.map((detail, idx) => (
                <div key={idx} className="bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
                  {detail}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-xs text-zinc-500 py-1 flex items-center justify-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5" />
          Pasa el cursor sobre cualquier componente para ver su número de parte (SKU) y especificaciones técnicas.
        </div>
      )}
    </div>
  );
};
