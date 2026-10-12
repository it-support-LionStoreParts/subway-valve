'use client';

import React, { useState } from 'react';
import { BookOpen, X, Cpu, Zap, Shield, Layers, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Eco80TechnicalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ENTRADA' | 'CUERPOS' | 'ACTUADORES' | 'SPOOLS'>('ENTRADA');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F26522]/15 border border-[#F26522]/30 flex items-center justify-center text-[#F26522]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Danfoss ECO 80 | Guía de Ingeniería</h3>
                <span className="text-[10px] bg-red-600/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded border border-red-500/30">
                  CoreBook rev 01
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Comprensión técnica de los módulos mecánicos y electrohidráulicos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Navegación Técnica */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-5 gap-2 pt-2">
          {[
            { id: 'ENTRADA', label: '1. Entrada EVP & PPRV', icon: Cpu },
            { id: 'CUERPOS', label: '2. Cuerpos EVB & PVLP', icon: Layers },
            { id: 'ACTUADORES', label: '3. Mandos EVOS / EVM', icon: Zap },
            { id: 'SPOOLS', label: '4. Vástagos (EVBS)', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-[#F26522] text-[#F26522] bg-[#F26522]/5 rounded-t-lg'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[#F26522] font-bold font-mono text-[11px] block uppercase">
                  Módulo de Entrada (EVP - Pump Module)
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  El cuerpo de entrada conecta la bomba hidráulica (fija o variable) con el bloque seccional y administra la presión de pilotaje interno.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F26522]"></span>
                    PPRV (Pilot Pressure Reducer Valve)
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Válvula reductora de presión piloto. Es <strong>obligatoria</strong> cuando se usan actuadores solenoides electrohidráulicos (EVM, EVHC) para garantizar un pilotaje estable sin picos de presión.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    EVPX (Electric Unload Valve)
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Válvula solenoide de descarga eléctrica (12V/24Vcc). Permite descargar el caudal de la bomba libremente al tanque durante el reposo o como parada de emergencia.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Kit de conversión Centro Abierto ↔ Centro Cerrado:</span>
                <span className="font-mono text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">SKU: 11177668</span>
              </div>
            </div>
          )}

          {/* TAB 2: CUERPOS EVB */}
          {activeTab === 'CUERPOS' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[#F26522] font-bold font-mono text-[11px] block uppercase">
                  Cuerpos de Trabajo (EVB) y Válvulas Auxiliares
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  Cada sección de trabajo EVB alberga un carrete (spool) y dispone de cavidades superiores para alojar válvulas auxiliares de protección individual por pórtico.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="font-bold text-white block">Válvulas de Alivio y Choque PVLP</span>
                  <p className="text-zinc-400">
                    Cartuchos ajustados desde 32 bar (460 PSI) hasta 320 bar (4641 PSI) para amortiguar sobrepresiones en los puertos A y B de cilindros o motores.
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="font-bold text-white block">Válvula Anticavitación (157B2001)</span>
                  <p className="text-zinc-400">
                    Evita el vacío interno y daño en cilindros por arrastre mecánico de cargas suspendidas o paradas bruscas de motores.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Roscas estándar de los pórticos de trabajo:</span>
                <span className="font-mono text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">7/8"-14 UNF (SAE #10) / G 1/2 BSPP</span>
              </div>
            </div>
          )}

          {/* TAB 3: ACTUADORES */}
          {activeTab === 'ACTUADORES' && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-[#F26522] block mb-1">Módulos de Accionamiento Disponibles:</span>
                <p className="text-zinc-400 text-[11px]">
                  Danfoss ECO 80 ofrece máxima flexibilidad de control, permitiendo combinar secciones manuales y eléctricas en un mismo bloque de válvulas:
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                  <div>
                    <strong className="text-white block">EVM (11167002): Proporcional con Palanca Manual</strong>
                    <span className="text-zinc-500">Combina control eléctrico suave con palanca física de emergencia (over-ride).</span>
                  </div>
                  <span className="font-mono text-[#F26522] font-bold">Híbrido</span>
                </div>

                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                  <div>
                    <strong className="text-white block">EVHC (11162298): Electrohidráulico Proporcional 24Vcc</strong>
                    <span className="text-zinc-500">Doble solenoide proporcional de alta precisión para joysticks y radiocontroles.</span>
                  </div>
                  <span className="font-mono text-blue-400 font-bold">24V Proporcional</span>
                </div>

                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                  <div>
                    <strong className="text-white block">EVOS (11175314): Palanca Manual Ergonómica</strong>
                    <span className="text-zinc-500">Mecanismo robusto para accionamiento directo con operador en cabina.</span>
                  </div>
                  <span className="font-mono text-zinc-300 font-bold">Mecánico</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPOOLS */}
          {activeTab === 'SPOOLS' && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-[#F26522] block mb-1">Vástagos y Carretes (EVBS)</span>
                <p className="text-zinc-400 text-[11px]">
                  El carrete determina la cinemática del actuador conectado (cilindro o motor hidráulico) y el caudal nominal suministrado:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-white font-bold block">Centro Cerrado</span>
                  <span className="text-zinc-400 block">4 vías para cilindros de doble efecto. Bloquea la carga al soltar la palanca.</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-white font-bold block">Centro Abierto / Motor</span>
                  <span className="text-zinc-400 block">Permite flotación y giro libre del motor sin cavitación al frenar.</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-white font-bold block">Centro Estrangulado</span>
                  <span className="text-zinc-400 block">Para movimientos micrométricos o control sensible de inclinación/giro.</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between">
                <span>Escala de Caudales ECO 80:</span>
                <span className="font-mono text-[#F26522] font-bold">8, 25, 40, 60, 80 y 100 L/min</span>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <span className="text-[11px] text-zinc-500 font-mono">
            Fuente: Danfoss Power Solutions CoreBook ECO 80
          </span>
          <button
            onClick={onClose}
            className="bg-[#F26522] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Entendido, volver al configurador
          </button>
        </div>
      </div>
    </div>
  );
};
