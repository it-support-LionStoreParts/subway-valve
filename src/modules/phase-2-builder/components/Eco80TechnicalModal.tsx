'use client';

import React, { useState } from 'react';
import { useValveStore } from '@/lib/store/valve-store';
import { BookOpen, X, Cpu, Zap, Shield, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Eco80TechnicalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useValveStore();
  const [activeTab, setActiveTab] = useState<'ENTRADA' | 'CUERPOS' | 'ACTUADORES' | 'SPOOLS'>('ENTRADA');

  if (!isOpen) return null;

  const isEn = language === 'en';

  const tabs = [
    { id: 'ENTRADA', label: isEn ? '1. EVP Inlet & PPRV' : '1. Entrada EVP & PPRV', icon: Cpu },
    { id: 'CUERPOS', label: isEn ? '2. EVB Bodies & PVLP' : '2. Cuerpos EVB & PVLP', icon: Layers },
    { id: 'ACTUADORES', label: isEn ? '3. Actuators EVOS/EVM' : '3. Mandos EVOS / EVM', icon: Zap },
    { id: 'SPOOLS', label: isEn ? '4. Spools (EVBS)' : '4. Vástagos (EVBS)', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Cabecera del Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F26522]/10 border border-[#F26522]/20 flex items-center justify-center text-[#F26522]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">Danfoss ECO 80 • CoreBook rev 01</h3>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                  {isEn ? 'Engineering' : 'Ingeniería'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn
                  ? 'Modular architecture specifications for assembly and pressure drop estimation.'
                  : 'Especificaciones de arquitectura modular para ensamble y cálculo de pérdidas.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Navegación Técnica */}
        <div className="flex border-b border-slate-100 bg-white px-6 gap-2 pt-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-[#F26522] text-slate-900 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F26522]' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: ENTRADA EVP */}
          {activeTab === 'ENTRADA' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  {isEn ? 'Inlet Module (EVP - Pump Module)' : 'Módulo de Entrada (EVP - Pump Module)'}
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {isEn
                    ? 'Connects the hydraulic pump (fixed or variable) to the sectional block and manages internal pilot pressure.'
                    : 'El cuerpo de entrada conecta la bomba hidráulica (fija o variable) con el bloque seccional y administra la presión de pilotaje interno.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#F26522]"></span>
                    PPRV (Pilot Pressure Reducer)
                  </span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isEn
                      ? 'Mandatory pilot pressure reducing valve when using proportional electrohydraulic coils (EVM, EVHC).'
                      : 'Válvula reductora de presión piloto obligatoria cuando se usan bobinas electrohidráulicas proporcionales (EVM, EVHC).'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                  <span className="font-semibold text-slate-900 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    EVPX (Electric Unload Valve)
                  </span>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isEn
                      ? 'Electric solenoid unloader valve (12V/24Vdc). Dumps pump flow to tank during idle or emergency stop.'
                      : 'Válvula solenoide de descarga eléctrica (12V/24Vcc). Descarga el flujo de bomba a tanque en reposo o emergencia.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                <span>{isEn ? 'Open Center ↔ Closed Center conversion kit:' : 'Kit de conversión Centro Abierto ↔ Centro Cerrado:'}</span>
                <span className="font-semibold text-slate-900 bg-white px-3 py-0.5 rounded-full border border-slate-200">SKU 11177668</span>
              </div>
            </div>
          )}

          {/* TAB 2: CUERPOS EVB */}
          {activeTab === 'CUERPOS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
                  {isEn ? 'Work Sections (EVB) & Auxiliary Valves' : 'Cuerpos de Trabajo (EVB) y Válvulas Auxiliares'}
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {isEn
                    ? 'Each EVB work section houses a spool and top cavities for auxiliary port protection cartridges.'
                    : 'Cada sección de trabajo EVB alberga un carrete (spool) y dispone de cavidades superiores para alojar válvulas auxiliares de protección individual por pórtico.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="font-semibold text-slate-900 block text-xs">
                    {isEn ? 'Shock & Relief Valves PVLP' : 'Válvulas de Alivio y Choque PVLP'}
                  </span>
                  <p className="text-slate-500">
                    {isEn
                      ? 'Cartridges set from 32 bar (460 PSI) to 320 bar (4641 PSI) to absorb pressure spikes at ports A and B.'
                      : 'Cartuchos ajustados desde 32 bar (460 PSI) hasta 320 bar (4641 PSI) para amortiguar sobrepresiones en los puertos A y B.'}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="font-semibold text-slate-900 block text-xs">
                    {isEn ? 'Anti-Cavitation Valve (157B2001)' : 'Válvula Anticavitación (157B2001)'}
                  </span>
                  <p className="text-slate-500">
                    {isEn
                      ? 'Prevents internal vacuum and cavitation damage in cylinders from suspended loads or sudden motor stops.'
                      : 'Evita el vacío interno y daño en cilindros por arrastre mecánico de cargas suspendidas o paradas bruscas de motores.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                <span>{isEn ? 'Standard work port threads:' : 'Roscas estándar de los pórticos de trabajo:'}</span>
                <span className="font-semibold text-slate-900 bg-white px-3 py-0.5 rounded-full border border-slate-200">7/8"-14 UNF (SAE #10) / G 1/2 BSPP</span>
              </div>
            </div>
          )}

          {/* TAB 3: ACTUADORES */}
          {activeTab === 'ACTUADORES' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="font-semibold text-slate-900 block mb-1 text-xs">
                  {isEn ? 'Available Control Modules' : 'Módulos de Accionamiento Disponibles'}
                </span>
                <p className="text-slate-500 text-xs">
                  {isEn
                    ? 'Danfoss ECO 80 allows combining manual and electric proportional sections on the same manifold bank:'
                    : 'Danfoss ECO 80 permite combinar secciones manuales y eléctricas en un mismo bloque seccional:'}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex justify-between items-center shadow-2xs">
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      EVM (11167002): {isEn ? 'Proportional with Manual Lever' : 'Proporcional con Palanca Manual'}
                    </strong>
                    <span className="text-slate-500">
                      {isEn ? 'Combines smooth electric control with emergency mechanical manual over-ride.' : 'Combina control eléctrico suave con palanca física de emergencia (over-ride).'}
                    </span>
                  </div>
                  <span className="text-[#F26522] font-semibold">{isEn ? 'Hybrid' : 'Híbrido'}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex justify-between items-center shadow-2xs">
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      EVHC (11162298): {isEn ? 'Electrohydraulic Proportional 24Vdc' : 'Electrohidráulico Proporcional 24Vcc'}
                    </strong>
                    <span className="text-slate-500">
                      {isEn ? 'Dual proportional solenoid for high-precision joystick and radio-remote operation.' : 'Doble solenoide proporcional de alta precisión para joysticks y radiocontroles.'}
                    </span>
                  </div>
                  <span className="text-blue-600 font-semibold">{isEn ? '24V Proportional' : '24V Proporcional'}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex justify-between items-center shadow-2xs">
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      EVOS (11175314): {isEn ? 'Ergonomic Manual Lever' : 'Palanca Manual Ergonómica'}
                    </strong>
                    <span className="text-slate-500">
                      {isEn ? 'Robust mechanism for direct manual operation by cab operators.' : 'Mecanismo robusto para accionamiento directo con operador en cabina.'}
                    </span>
                  </div>
                  <span className="text-slate-500 font-semibold">{isEn ? 'Mechanical' : 'Mecánico'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPOOLS */}
          {activeTab === 'SPOOLS' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="font-semibold text-slate-900 block mb-1 text-xs">
                  {isEn ? 'Spool Types & Characteristics (EVBS)' : 'Vástagos y Carretes (EVBS)'}
                </span>
                <p className="text-slate-500 text-xs">
                  {isEn
                    ? 'The spool defines connected actuator motion (cylinder or hydraulic motor) and nominal flow:'
                    : 'El carrete determina la cinemática del actuador conectado (cilindro o motor hidráulico) y el caudal nominal:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-slate-900 font-semibold block">{isEn ? 'Closed Center' : 'Centro Cerrado'}</span>
                  <span className="text-slate-500 block">
                    {isEn ? '4-way for double acting cylinders. Locks load in neutral.' : '4 vías para cilindros de doble efecto. Bloquea carga en neutro.'}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-slate-900 font-semibold block">{isEn ? 'Open Center / Motor' : 'Centro Abierto / Motor'}</span>
                  <span className="text-slate-500 block">
                    {isEn ? 'Allows float and motor coasting without braking cavitation.' : 'Permite flotación y giro libre del motor sin cavitación al frenar.'}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-slate-900 font-semibold block">{isEn ? 'Throttled Center' : 'Centro Estrangulado'}</span>
                  <span className="text-slate-500 block">
                    {isEn ? 'For micro-metering and sensitive slewing control.' : 'Para movimientos micrométricos o control sensible de giro.'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                <span>{isEn ? 'ECO 80 Flow Rating Scale:' : 'Escala de Caudales ECO 80:'}</span>
                <span className="text-[#F26522] font-semibold">8, 25, 40, 60, 80 & 100 L/min</span>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Danfoss Power Solutions • {isEn ? 'Official Technical Guide' : 'Guía Oficial'}
          </span>
          <button
            onClick={onClose}
            className="bg-[#F26522] hover:bg-[#E05312] text-white px-6 py-2.5 rounded-full text-xs font-medium transition-all shadow-sm"
          >
            {isEn ? 'Close Guide' : 'Cerrar Guía'}
          </button>
        </div>
      </div>
    </div>
  );
};
