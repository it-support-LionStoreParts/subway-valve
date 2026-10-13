'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';
import { CatalogService } from '@/lib/services/catalog-service';
import { FamilyCompatibilityResult } from '@/types/valve-family';
import { Eco80TechnicalModal } from '@/modules/phase-2-builder/components/Eco80TechnicalModal';
import { translations } from '@/lib/i18n/translations';
import {
  ArrowRight,
  ArrowLeft,
  Activity,
  Cpu,
  Layers,
  FileText,
  RotateCcw,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const Phase1Filter: React.FC = () => {
  const {
    filterCriteria,
    setFilterCriteria,
    selectFamily,
    setPhase,
    phase1Step,
    setPhase1Step,
    language
  } = useValveStore();

  const [results, setResults] = useState<FamilyCompatibilityResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  const t = translations[language];
  const p1 = t.phase1Content;

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

  // Ordenar dinámicamente: las recomendadas y válidas suben inmediatamente a la primera posición
  const sortedResults = useMemo(() => {
    const effective = filterCriteria.requiredGpm * filterCriteria.simultaneityFactor;

    return [...results].sort((a, b) => {
      if (a.isCompatible && !b.isCompatible) return -1;
      if (!a.isCompatible && b.isCompatible) return 1;

      if (a.isCompatible && b.isCompatible) {
        const aIsEco80 = a.family.id === 'DANFOSS_ECO80';
        const bIsEco80 = b.family.id === 'DANFOSS_ECO80';

        if (effective <= 26.4 && filterCriteria.requiredPsi <= 4640) {
          if (aIsEco80) return -1;
          if (bIsEco80) return 1;
        } else {
          if (!aIsEco80 && bIsEco80) return -1;
          if (aIsEco80 && !bIsEco80) return 1;
        }
      }

      return 0;
    });
  }, [results, filterCriteria]);

  // =========================================================================
  // PANTALLA DE BIENVENIDA (PASO 0) - ELEGANTE Y COMPACTA
  // =========================================================================
  if (phase1Step === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in duration-300">
        <Eco80TechnicalModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />

        {/* Hero Central Compacto */}
        <div className="text-center space-y-4">
          <div className="w-24 h-20 mx-auto relative flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <Image
              src="/images/lion-store-logo.png"
              alt="Lion Store Parts"
              width={1024}
              height={791}
              className="w-full h-full object-contain"
              style={{ width: 'auto', height: '100%' }}
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F26522]/10 text-[#F26522] border border-[#F26522]/20 rounded-full text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
            <span>{t.welcome.badge}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight leading-tight">
              {t.welcome.title} <br className="hidden sm:inline" />
              <span className="font-semibold text-slate-950">Subway Valve</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-normal leading-relaxed">
              {t.welcome.description}
            </p>
          </div>

          {/* Botones de Entrada Principal */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setPhase1Step(1)}
              className="bg-[#F26522] hover:bg-[#E05312] text-white px-7 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all shadow-xs hover:shadow flex items-center gap-2"
            >
              <span>{t.welcome.startButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsTechModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-5 py-2.5 rounded-full text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F26522]" />
              <span>CoreBook Danfoss ECO 80</span>
            </button>
          </div>
        </div>

        {/* 3 Tarjetas de Resumen Compactas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200/70">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F26522]">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">{t.welcome.feat1Title}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.welcome.feat1Desc}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">{t.welcome.feat2Title}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.welcome.feat2Desc}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">{t.welcome.feat3Title}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.welcome.feat3Desc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PASOS DE DIAGNÓSTICO INTERACTIVO (SPLIT LAYOUT COMPACTO)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Eco80TechnicalModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />

      {/* Barra Superior de Progreso Compacta */}
      <div className="space-y-2 pb-2 border-b border-slate-200/70">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => setPhase1Step(0)}
            className="hover:text-slate-900 flex items-center gap-1 transition-colors font-medium text-xs"
          >
            <span>← {language === 'en' ? 'Home' : 'Inicio'}</span>
          </button>
          <span className="font-medium text-slate-700">
            {phase1Step <= 4 ? p1.stepOf.replace('{current}', String(phase1Step)).replace('{total}', '4') : (language === 'en' ? 'Diagnosis Completed' : 'Diagnóstico Completado')}
          </span>
          <span className="text-slate-400">
            {phase1Step === 1 && p1.step1Title}
            {phase1Step === 2 && p1.step2Title}
            {phase1Step === 3 && p1.step3Title}
            {phase1Step === 4 && p1.step4Title}
            {phase1Step === 5 && (language === 'en' ? 'Recommendation' : 'Recomendación Técnica')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                phase1Step === 5 || stepNum <= phase1Step
                  ? 'bg-[#F26522]'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid Principal Dividido: Izquierda Preguntas / Derecha Opciones Reactivas Compactas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LADO IZQUIERDO: PREGUNTAS DEL DIAGNÓSTICO (COMPACTAS)
            ========================================================================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          
          {/* PASO 1: CAUDAL (GPM) */}
          {phase1Step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  01
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                  {p1.step1Question}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p1.step1Help}
                </p>
              </div>

              {/* Opciones de Selección Rápidas */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { gpm: 10, label: '10 GPM', sub: language === 'en' ? 'Compact units' : 'Equipos compactos' },
                  { gpm: 20, label: '20 GPM', sub: language === 'en' ? 'Medium cranes' : 'Grúas medianas' },
                  { gpm: 26.4, label: '26.4 GPM', sub: 'Danfoss ECO 80' },
                  { gpm: 34, label: '34.0 GPM', sub: 'Danfoss PVG 32' }
                ].map((item) => {
                  const isSelected = Math.abs(filterCriteria.requiredGpm - item.gpm) < 0.5;
                  return (
                    <button
                      key={item.gpm}
                      type="button"
                      onClick={() => setFilterCriteria({ requiredGpm: item.gpm })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                      </div>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slider de Flujo */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">{p1.flowLabel}:</span>
                  <div>
                    <span className="text-xl font-light text-slate-900">{filterCriteria.requiredGpm.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-1">GPM</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({p1.equivalentLpm.replace('{lpm}', (filterCriteria.requiredGpm * 3.785).toFixed(0))})
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={filterCriteria.requiredGpm}
                  onChange={(e) => setFilterCriteria({ requiredGpm: parseFloat(e.target.value) })}
                  className="w-full accent-[#F26522] h-1.5 bg-slate-100 rounded-full cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setPhase1Step(2)}
                  className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>{p1.nextStep}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: SIMULTANEIDAD */}
          {phase1Step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  02
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                  {p1.step2Question}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p1.step2Help}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { factor: 0.5, label: '50%', sub: language === 'en' ? 'Low' : 'Baja' },
                  { factor: 0.8, label: '80%', sub: language === 'en' ? 'Standard' : 'Estándar' },
                  { factor: 1.0, label: '100%', sub: language === 'en' ? 'Continuous' : 'Total' }
                ].map((s) => {
                  const isSelected = filterCriteria.simultaneityFactor === s.factor;
                  return (
                    <button
                      key={s.factor}
                      type="button"
                      onClick={() => setFilterCriteria({ simultaneityFactor: s.factor })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{s.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                      </div>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between">
                <span className="text-slate-600">{p1.effectiveFlowLabel}:</span>
                <strong className="text-base font-semibold text-[#F26522]">{effectiveGpm} GPM</strong>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={() => setPhase1Step(1)}
                  className="text-slate-500 hover:text-slate-800 text-xs transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{p1.prevStep}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhase1Step(3)}
                  className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>{p1.nextStep}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: PRESIÓN (PSI) */}
          {phase1Step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  03
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                  {p1.step3Question}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p1.step3Help}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { psi: 2500, label: '2,500 PSI', sub: language === 'en' ? 'Agricultural' : 'Uso agrícola' },
                  { psi: 3625, label: '3,625 PSI', sub: 'Danfoss ECO 80' },
                  { psi: 4640, label: '4,640 PSI', sub: language === 'en' ? 'Heavy duty' : 'Alta presión' }
                ].map((p) => {
                  const isSelected = filterCriteria.requiredPsi === p.psi;
                  return (
                    <button
                      key={p.psi}
                      type="button"
                      onClick={() => setFilterCriteria({ requiredPsi: p.psi })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{p.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{p.sub}</div>
                      </div>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'border-[#F26522] bg-[#F26522]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ajuste de Presión */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">{p1.pressureLabel}:</span>
                  <div>
                    <span className="text-xl font-light text-slate-900">{filterCriteria.requiredPsi}</span>
                    <span className="text-xs text-slate-400 ml-1">PSI</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({p1.equivalentBar.replace('{bar}', (filterCriteria.requiredPsi * 0.0689476).toFixed(0))})
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5500"
                  step="250"
                  value={filterCriteria.requiredPsi}
                  onChange={(e) => setFilterCriteria({ requiredPsi: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#F26522] h-1.5 bg-slate-100 rounded-full cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={() => setPhase1Step(2)}
                  className="text-slate-500 hover:text-slate-800 text-xs transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{p1.prevStep}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhase1Step(4)}
                  className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>{p1.nextStep}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: TIPO DE BOMBA / CIRCUITO */}
          {phase1Step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  04
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                  {p1.step4Question}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p1.step4Help}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFilterCriteria({ isLoadSensing: true })}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                    filterCriteria.isLoadSensing
                      ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Activity className="w-3.5 h-3.5 text-[#F26522]" />
                      <span>{p1.pumpLS}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {p1.pumpLSDesc}
                    </p>
                  </div>
                  <div className="text-xs text-[#F26522] font-medium">Danfoss ECO 80 Ready</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterCriteria({ isLoadSensing: false })}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                    !filterCriteria.isLoadSensing
                      ? 'border-[#F26522] bg-[#F26522]/[0.03] ring-1 ring-[#F26522]'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Cpu className="w-3.5 h-3.5 text-slate-600" />
                      <span>{p1.pumpFixed}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {p1.pumpFixedDesc}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">Danfoss EVPX Plug</div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={() => setPhase1Step(3)}
                  className="text-slate-500 hover:text-slate-800 text-xs transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{p1.prevStep}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhase1Step(5)}
                  className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>{language === 'en' ? 'View Results' : 'Ver Recomendación'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: RESUMEN FINAL COMPACTO */}
          {phase1Step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  {language === 'en' ? 'Diagnosis Completed' : 'Diagnóstico Completado'}
                </span>
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {language === 'en' ? 'Confirmed System Parameters' : 'Parámetros Confirmados'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Select your preferred valve family on the right to enter the 2D/3D configurator.'
                    : 'Selecciona la familia deseada a la derecha para ingresar al constructor modular 2D/3D.'}
                </p>
              </div>

              {/* Resumen de Datos Ingresados */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">{p1.flowLabel}</span>
                  <span className="text-slate-900 font-semibold">{filterCriteria.requiredGpm} GPM</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{p1.effectiveFlowLabel}</span>
                  <span className="text-[#F26522] font-semibold">{effectiveGpm} GPM</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{p1.pressureLabel}</span>
                  <span className="text-slate-900 font-semibold">{filterCriteria.requiredPsi} PSI</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{language === 'en' ? 'Circuit' : 'Circuito'}</span>
                  <span className="text-slate-900 font-semibold">
                    {filterCriteria.isLoadSensing ? 'Load Sensing' : 'Open Center'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  onClick={() => setPhase1Step(1)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Modify parameters' : 'Modificar respuestas'}</span>
                </button>

                <span className="text-xs text-slate-500 font-medium">
                  {results.filter((r) => r.isCompatible).length} {language === 'en' ? 'compatible families' : 'familia(s) compatible(s)'}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            LADO DERECHO: FAMILIAS DISPONIBLES (COMPACTAS CON OPACIDAD REACTIVA EN TIEMPO REAL)
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-20">
          
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {p1.catalogTitle}
              </span>
              <span className="text-[10px] text-[#F26522] font-semibold bg-[#F26522]/10 px-2 py-0.5 rounded-full">
                {p1.catalogSubtitle}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{t.brand}</h3>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'Opacity and ranking react in real-time to your parameters.'
                : 'La opacidad cambia en vivo según la viabilidad de tus parámetros.'}
            </p>
          </div>

          <div className="space-y-3">
            {sortedResults.map(({ family, isCompatible, warnings }, idx) => {
              const isRecommended = isCompatible && idx === 0;

              return (
                <div
                  key={family.id}
                  className={`rounded-2xl border transition-all duration-300 p-4 space-y-3 ${
                    isCompatible
                      ? isRecommended
                        ? 'opacity-100 bg-white border-[#F26522] ring-1 ring-[#F26522]/30 shadow-xs'
                        : 'opacity-100 bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                      : 'opacity-30 hover:opacity-60 bg-slate-50/70 border-slate-200/60'
                  }`}
                >
                  {/* Cabecera Compacta */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase text-slate-400 font-medium">
                          {family.proveedor}
                        </span>
                        {isRecommended && (
                          <span className="text-[10px] bg-[#F26522] text-white font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <span>★</span>
                            <span>{p1.recommendedBadge}</span>
                          </span>
                        )}
                        {!isRecommended && isCompatible && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {p1.compatibleBadge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mt-1">{family.nombre}</h4>
                    </div>

                    {/* Estado de Compatibilidad en Píldora */}
                    <div className="shrink-0">
                      {isCompatible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{p1.compatibleBadge}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-medium">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>{p1.incompatibleBadge}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Advertencias si no es compatible */}
                  {!isCompatible && warnings.length > 0 && (
                    <div className="p-2.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                      <p className="text-xs text-rose-700 leading-tight">
                        • {warnings[0]}
                      </p>
                    </div>
                  )}

                  {/* Especificaciones Clave */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <span>{p1.flowLimit}: <strong className="text-slate-900">{family.max_gpm} GPM</strong></span>
                    <span>•</span>
                    <span><strong className="text-slate-900">{family.max_psi} PSI</strong></span>
                    <span>•</span>
                    <span>{family.max_work_sections} {language === 'en' ? 'bodies' : 'secc.'}</span>
                  </div>

                  {/* Botón de Selección */}
                  {isCompatible ? (
                    <button
                      onClick={() => handleSelectFamily({ family, isCompatible, warnings })}
                      className="w-full bg-[#F26522] hover:bg-[#E05312] text-white py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <span>{p1.configureButton}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-center py-1 text-xs text-slate-400">
                      {language === 'en' ? 'Out of specifications' : 'Fuera de rango'}
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
