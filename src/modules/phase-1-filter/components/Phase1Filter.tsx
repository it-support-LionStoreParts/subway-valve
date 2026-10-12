'use client';

import React, { useEffect, useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { CatalogService } from '@/lib/services/catalog-service';
import { FamilyCompatibilityResult } from '@/types/valve-family';
import {
  Gauge,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  Flame,
  Check
} from 'lucide-react';

export const Phase1Filter: React.FC = () => {
  const {
    filterCriteria,
    setFilterCriteria,
    selectFamily,
    setPhase,
    phase1Step,
    setPhase1Step
  } = useValveStore();

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

  const questions = [
    { step: 1, title: 'Caudal de Bomba', desc: 'GPM de diseño' },
    { step: 2, title: 'Simultaneidad', desc: 'Uso de funciones' },
    { step: 3, title: 'Presión de Trabajo', desc: 'Límite en PSI' },
    { step: 4, title: 'Tipo de Bomba', desc: 'LS vs Centro Abierto' },
    { step: 5, title: 'Recomendación', desc: 'Familias viables' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Barra de Progreso del Cuestionario */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#F26522] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnóstico Hidráulico Interactivo • Paso {phase1Step} de 5
          </span>
          <span className="text-zinc-500 font-semibold">
            {phase1Step === 5 ? 'Resultados Listos' : `${Math.round(((phase1Step - 1) / 4) * 100)}% Completado`}
          </span>
        </div>

        {/* Línea de progreso interactiva */}
        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-[#F26522] to-amber-500 transition-all duration-300"
            style={{ width: `${(phase1Step / 5) * 100}%` }}
          />
        </div>

        {/* Pasos / Preguntas Pildoras */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {questions.map((q) => {
            const isCurrent = phase1Step === q.step;
            const isCompleted = phase1Step > q.step;
            return (
              <button
                key={q.step}
                onClick={() => setPhase1Step(q.step)}
                className={`text-left p-2 rounded-xl border transition-all text-xs ${
                  isCurrent
                    ? 'border-[#F26522] bg-[#F26522]/10 text-white font-bold shadow-md'
                    : isCompleted
                    ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    : 'border-transparent text-zinc-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-[#F26522]" />
                  ) : (
                    <span className="w-3 h-3 text-[10px] flex items-center justify-center font-bold">
                      {q.step}
                    </span>
                  )}
                  <span className="truncate hidden sm:inline">{q.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DE PREGUNTA INTERACTIVA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* =========================================================================
            PREGUNTA 1: CAUDAL (GPM)
            ========================================================================= */}
        {phase1Step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#F26522] uppercase tracking-wider block">
                Pregunta 1 de 4 • Caudal del Sistema
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¿Cuál es el caudal máximo de tu bomba hidráulica?
              </h2>
              <p className="text-sm text-zinc-400">
                Selecciona el flujo aproximado en Galones por Minuto (GPM). Esto determina el tamaño de los puertos y cuerpos de la válvula para evitar sobrecalentamiento.
              </p>
            </div>

            {/* Presets Rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { gpm: 10, label: '10 GPM', desc: 'Equipos compactos (hasta ~40 L/min)' },
                { gpm: 20, label: '20 GPM', desc: 'Grúas medianas (~75 L/min)' },
                { gpm: 26, label: '26.4 GPM', desc: 'Danfoss ECO 80 (100 L/min)' },
                { gpm: 34, label: '34 GPM', desc: 'Danfoss PVG 32 (130 L/min)' }
              ].map((item) => (
                <button
                  key={item.gpm}
                  type="button"
                  onClick={() => setFilterCriteria({ requiredGpm: item.gpm })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    Math.abs(filterCriteria.requiredGpm - item.gpm) < 1
                      ? 'border-[#F26522] bg-[#F26522]/15 text-white shadow-lg'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-base font-extrabold text-[#F26522] font-mono">{item.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            {/* Slider de Ajuste Preciso */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-300 font-medium">Ajuste fino del caudal:</span>
                <span className="text-2xl font-extrabold font-mono text-[#F26522]">
                  {filterCriteria.requiredGpm.toFixed(1)} <span className="text-xs text-zinc-500">GPM</span>
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="0.5"
                value={filterCriteria.requiredGpm}
                onChange={(e) => setFilterCriteria({ requiredGpm: parseFloat(e.target.value) })}
                className="w-full accent-[#F26522] h-2.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>2 GPM</span>
                <span>26.4 GPM (ECO 80)</span>
                <span>34.3 GPM (PVG 32)</span>
                <span>60 GPM</span>
              </div>
            </div>

            {/* Botón Siguiente */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setPhase1Step(2)}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
              >
                Siguiente Pregunta
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PREGUNTA 2: SIMULTANEIDAD
            ========================================================================= */}
        {phase1Step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#F26522] uppercase tracking-wider block">
                Pregunta 2 de 4 • Operación Simultánea
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¿Cuántos actuadores o funciones operarán al mismo tiempo?
              </h2>
              <p className="text-sm text-zinc-400">
                El factor de simultaneidad ajusta el caudal real que demandará la válvula cuando varios cilindros o motores se muevan en paralelo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  factor: 0.3,
                  title: '30% • Movimiento Secuencial',
                  desc: 'El operador mueve una sola función a la vez (ej. levantar brazo, detenerse, luego girar).'
                },
                {
                  factor: 0.6,
                  title: '60% • Trabajo Moderado',
                  desc: 'Dos funciones trabajan simultáneamente con demanda de velocidad parcial.'
                },
                {
                  factor: 0.8,
                  title: '80% • Estándar Móvil (Recomendado)',
                  desc: 'Grúa o retroexcavadora operando pluma, telescopio y giro en maniobra fluida continua.'
                },
                {
                  factor: 1.0,
                  title: '100% • Demanda Plena Continua',
                  desc: 'Todos los actuadores exigen flujo total simultáneo a régimen máximo.'
                }
              ].map((opt) => (
                <button
                  key={opt.factor}
                  type="button"
                  onClick={() => setFilterCriteria({ simultaneityFactor: opt.factor })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    filterCriteria.simultaneityFactor === opt.factor
                      ? 'border-[#F26522] bg-[#F26522]/15 text-white shadow-lg'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{opt.title}</div>
                  <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Caudal efectivo de diseño calculado:</span>
              <span className="text-lg font-bold font-mono text-[#F26522]">
                {effectiveGpm} GPM
              </span>
            </div>

            {/* Navegación */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setPhase1Step(1)}
                className="px-5 py-3 rounded-2xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setPhase1Step(3)}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
              >
                Siguiente Pregunta
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PREGUNTA 3: PRESIÓN (PSI)
            ========================================================================= */}
        {phase1Step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#F26522] uppercase tracking-wider block">
                Pregunta 3 de 4 • Presión Máxima de Servicio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¿A qué presión máxima trabajará el circuito?
              </h2>
              <p className="text-sm text-zinc-400">
                La presión de alivio principal protege el circuito y debe estar dentro de la tolerancia de la serie seleccionada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { psi: 2500, label: '2,500 PSI', desc: 'Circuitos agrícolas y plataformas ligeras.' },
                { psi: 3500, label: '3,500 PSI', desc: 'Maquinaria de construcción y grúas móviles.' },
                { psi: 5075, label: '5,075 PSI (350 bar)', desc: 'Alta presión Danfoss ECO 80 y PVG 32.' }
              ].map((p) => (
                <button
                  key={p.psi}
                  type="button"
                  onClick={() => setFilterCriteria({ requiredPsi: p.psi })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    filterCriteria.requiredPsi === p.psi
                      ? 'border-[#F26522] bg-[#F26522]/15 text-white shadow-lg'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-lg font-bold font-mono text-[#F26522]">{p.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Slider de Presión */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-300 font-medium">Presión requerida ajustada:</span>
                <span className="text-2xl font-extrabold font-mono text-[#F26522]">
                  {filterCriteria.requiredPsi} <span className="text-xs text-zinc-500">PSI</span>
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="250"
                value={filterCriteria.requiredPsi}
                onChange={(e) => setFilterCriteria({ requiredPsi: parseInt(e.target.value, 10) })}
                className="w-full accent-[#F26522] h-2.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>1000 PSI</span>
                <span>3500 PSI</span>
                <span>5075 PSI (Límite Danfoss)</span>
                <span>6000 PSI</span>
              </div>
            </div>

            {/* Navegación */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setPhase1Step(2)}
                className="px-5 py-3 rounded-2xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setPhase1Step(4)}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
              >
                Siguiente Pregunta
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PREGUNTA 4: TIPO DE CIRCUITO (LOAD SENSING VS CENTRO ABIERTO)
            ========================================================================= */}
        {phase1Step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#F26522] uppercase tracking-wider block">
                Pregunta 4 de 4 • Tecnología de Bomba
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¿Qué tipo de circuito hidráulico tiene la máquina?
              </h2>
              <p className="text-sm text-zinc-400">
                Define si el módulo de entrada debe conectarse a una bomba de pistones con señal Load Sensing o a una bomba fija con bypass.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFilterCriteria({ isLoadSensing: true })}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  filterCriteria.isLoadSensing
                    ? 'border-[#F26522] bg-[#F26522]/15 text-white shadow-xl'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Activity className="w-5 h-5 text-[#F26522]" />
                  Load Sensing (Centro Cerrado)
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para bombas de caudal variable con línea piloto de señal LS. Ahorro de combustible, precisión milimétrica y respuesta proporcional independiente de la carga.
                </p>
                <div className="mt-3 text-[11px] font-mono text-[#F26522]">
                  ✓ Compatible con Danfoss ECO 80 y PVG 32
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterCriteria({ isLoadSensing: false })}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  !filterCriteria.isLoadSensing
                    ? 'border-[#F26522] bg-[#F26522]/15 text-white shadow-xl'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Cpu className="w-5 h-5 text-[#F26522]" />
                  Centro Abierto (Bomba Fija)
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para bombas de engranajes estándar. El flujo circula directamente hacia el tanque cuando las palancas están en reposo mediante la válvula bypass interna.
                </p>
                <div className="mt-3 text-[11px] font-mono text-[#F26522]">
                  ✓ Convertibles con kit de tapón 11177668
                </div>
              </button>
            </div>

            {/* Navegación */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setPhase1Step(3)}
                className="px-5 py-3 rounded-2xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                type="button"
                onClick={() => setPhase1Step(5)}
                className="bg-[#F26522] hover:bg-[#EA580C] text-white font-bold px-7 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
              >
                Ver Diagnóstico de Familias
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 5: RESULTADOS Y SELECCIÓN DE FAMILIA
            ========================================================================= */}
        {phase1Step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#F26522] uppercase tracking-wider block">
                  Diagnóstico Completado • Familias Compatibles
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Selecciona la Familia para Comenzar a Construir
                </h2>
              </div>

              <button
                onClick={() => setPhase1Step(1)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline"
              >
                Reiniciar preguntas
              </button>
            </div>

            <div className="space-y-4">
              {results.map(({ family, isCompatible, warnings }) => {
                const isEco80 = family.id === 'DANFOSS_ECO80';
                return (
                  <div
                    key={family.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isCompatible
                        ? isEco80
                          ? 'bg-zinc-950 border-[#F26522] shadow-2xl relative overflow-hidden ring-1 ring-[#F26522]/30'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-950/40 border-zinc-900 opacity-50'
                    }`}
                  >
                    {isEco80 && isCompatible && (
                      <div className="absolute top-0 right-0 bg-[#F26522] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl font-mono">
                        Opción Recomendada Lion Store
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {family.proveedor}
                          </span>
                          <h3 className="text-lg font-bold text-white">{family.nombre}</h3>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{family.descripcion}</p>
                      </div>

                      <div className="shrink-0">
                        {isCompatible ? (
                          <button
                            onClick={() => handleSelectFamily({ family, isCompatible, warnings })}
                            className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#EA580C] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-[#F26522]/30"
                          >
                            Seleccionar y Armar
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            No Compatible
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Especificaciones */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-xs">
                      <div>
                        <span className="text-zinc-500 block">Capacidad de Flujo:</span>
                        <span className="text-zinc-200 font-mono font-medium">{family.max_gpm} GPM</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Presión Máxima:</span>
                        <span className="text-zinc-200 font-mono font-medium">{family.max_psi} PSI</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Límite Cuerpos:</span>
                        <span className="text-zinc-200 font-mono font-medium">Hasta {family.max_work_sections}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Tecnología:</span>
                        <span className="text-[#F26522] font-medium">
                          {family.supports_load_sensing ? 'Proporcional LS' : 'Directa'}
                        </span>
                      </div>
                    </div>

                    {warnings.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] space-y-1">
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

            {/* Navegación para volver atrás */}
            <div className="flex justify-start pt-2">
              <button
                type="button"
                onClick={() => setPhase1Step(4)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Modificar parámetros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
