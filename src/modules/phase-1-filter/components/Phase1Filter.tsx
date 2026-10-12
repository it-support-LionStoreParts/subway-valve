'use client';

import React, { useEffect, useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { CatalogService } from '@/lib/services/catalog-service';
import { FamilyCompatibilityResult } from '@/types/valve-family';
import { Gauge, Activity, Cpu, CheckCircle2, AlertTriangle, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const Phase1Filter: React.FC = () => {
  const { filterCriteria, setFilterCriteria, selectFamily, setPhase } = useValveStore();
  const [results, setResults] = useState<FamilyCompatibilityResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Recalcular compatibilidad cada vez que cambien los 4 parámetros
  useEffect(() => {
    let isMounted = true;
    async function evaluate() {
      setLoading(true);
      const res = await CatalogService.filterCompatibleFamilies(filterCriteria);
      if (isMounted) {
        setResults(res);
        setLoading(false);
      }
    }
    evaluate();
    return () => {
      isMounted = false;
    };
  }, [filterCriteria]);

  const handleSelectFamily = async (famResult: FamilyCompatibilityResult) => {
    await selectFamily(famResult.family);
    setPhase(2);
  };

  const effectiveGpm = (filterCriteria.requiredGpm * filterCriteria.simultaneityFactor).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Encabezado de la Fase */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F26522]/15 text-[#F26522] border border-[#F26522]/30 rounded-full text-xs font-semibold uppercase tracking-wider">
          Fase 1: Diagnóstico Hidráulico • Lion Store
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Dimensionamiento y Selección de Familia
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
          Ingresa los parámetros operativos de tu circuito hidráulico. El sistema evaluará en tiempo real qué familias cumplen con los límites de caudal, presión y tecnología de control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Panel Izquierdo: Formulario de las 4 Variables Clave */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Gauge className="w-5 h-5 text-[#F26522]" />
            Parámetros del Circuito
          </h2>

          {/* 1. Caudal (GPM) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-zinc-300 font-medium">Caudal Máximo de la Bomba</label>
              <span className="text-[#F26522] font-mono font-bold bg-[#F26522]/10 px-2.5 py-0.5 rounded border border-[#F26522]/30">
                {filterCriteria.requiredGpm} GPM
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              step="1"
              value={filterCriteria.requiredGpm}
              onChange={(e) => setFilterCriteria({ requiredGpm: parseFloat(e.target.value) })}
              className="w-full accent-[#F26522] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>2 GPM</span>
              <span>30 GPM</span>
              <span>60 GPM</span>
            </div>
          </div>

          {/* 2. Factor de Simultaneidad */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-zinc-300 font-medium">Factor de Simultaneidad</label>
              <span className="text-[#F26522] font-mono font-bold bg-[#F26522]/10 px-2.5 py-0.5 rounded border border-[#F26522]/30">
                {(filterCriteria.simultaneityFactor * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={filterCriteria.simultaneityFactor}
              onChange={(e) => setFilterCriteria({ simultaneityFactor: parseFloat(e.target.value) })}
              className="w-full accent-[#F26522] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-zinc-400">
              Flujo de diseño efectivo calculado:{' '}
              <strong className="text-white font-mono">{effectiveGpm} GPM</strong>
            </p>
          </div>

          {/* 3. Presión de Trabajo (PSI) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-zinc-300 font-medium">Presión Máxima Requerida</label>
              <span className="text-[#F26522] font-mono font-bold bg-[#F26522]/10 px-2.5 py-0.5 rounded border border-[#F26522]/30">
                {filterCriteria.requiredPsi} PSI
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="250"
              value={filterCriteria.requiredPsi}
              onChange={(e) => setFilterCriteria({ requiredPsi: parseInt(e.target.value, 10) })}
              className="w-full accent-[#F26522] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>1000 PSI</span>
              <span>3500 PSI</span>
              <span>6000 PSI</span>
            </div>
          </div>

          {/* 4. Tecnología de Control (Load Sensing vs Open Center) */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-sm text-zinc-300 font-medium block">Tipo de Circuito / Bomba</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFilterCriteria({ isLoadSensing: true })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  filterCriteria.isLoadSensing
                    ? 'border-[#F26522] bg-[#F26522]/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#F26522]" />
                  Load Sensing
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Bomba de pistones variables (Centro Cerrado)</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterCriteria({ isLoadSensing: false })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !filterCriteria.isLoadSensing
                    ? 'border-[#F26522] bg-[#F26522]/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#F26522]" />
                  Centro Abierto
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Bomba de engranaje fijo con bypass</div>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Resultados de Familias Compatibles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F26522]" />
              Familias Evaluadas ({results.filter((r) => r.isCompatible).length} Compatibles)
            </h2>
            {loading && <span className="text-xs text-zinc-400 animate-pulse">Consultando Supabase...</span>}
          </div>

          <div className="space-y-4">
            {results.map(({ family, isCompatible, warnings }) => {
              const isEco80 = family.id === 'DANFOSS_ECO80';
              return (
                <div
                  key={family.id}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    isCompatible
                      ? isEco80
                        ? 'bg-zinc-900 border-[#F26522]/50 hover:border-[#F26522] shadow-xl'
                        : 'bg-zinc-900 border-zinc-700/80 hover:border-[#F26522]/50 shadow-lg'
                      : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {family.proveedor}
                        </span>
                        {isEco80 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F26522]/20 text-[#F26522] border border-[#F26522]/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> CoreBook rev 01
                          </span>
                        )}
                        <h3 className="text-base font-bold text-white">{family.nombre}</h3>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{family.descripcion}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isCompatible ? (
                        <button
                          onClick={() => handleSelectFamily({ family, isCompatible, warnings })}
                          className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#EA580C] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-[#F26522]/20"
                        >
                          Configurar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          No Compatible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Métricas Técnicas */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-xs">
                    <div>
                      <span className="text-zinc-500 block">Rango GPM:</span>
                      <span className="text-zinc-200 font-mono font-medium">
                        {family.min_gpm} - {family.max_gpm} GPM
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Presión Máx:</span>
                      <span className="text-zinc-200 font-mono font-medium">{family.max_psi} PSI</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Límite Secciones:</span>
                      <span className="text-zinc-200 font-mono font-medium">{family.max_work_sections} Cuerpos</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Control:</span>
                      <span className="text-zinc-200 font-medium">
                        {family.supports_load_sensing ? 'Proporcional / LS' : 'Directa'}
                      </span>
                    </div>
                  </div>

                  {/* Advertencias o Validaciones */}
                  {warnings.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
                      {warnings.map((w, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 ${isCompatible ? 'text-amber-400' : 'text-rose-400'}`}
                        >
                          {isCompatible ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
