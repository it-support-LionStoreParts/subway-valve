'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';
import {
  FileText,
  Send,
  MessageCircle,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Copy,
  Building2,
  Mail,
  Phone,
  User,
  ShieldCheck
} from 'lucide-react';

export const Phase3Quotation: React.FC = () => {
  const {
    selectedFamily,
    sections,
    inlet,
    endCover,
    tieRodKit,
    bomItems,
    setPhase,
    resetAll
  } = useValveStore();

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    telefono: '',
    comentarios: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Calcular longitud total
  const totalLengthMm =
    (inlet?.grosor_mm || 0) +
    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
    (endCover?.grosor_mm || 0);

  // Generador de texto para WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `*SOLICITUD DE COTIZACIÓN - SUBWAY VALVE | LION STORE PARTS*\n`;
    msg += `------------------------------------\n`;
    msg += `*Familia:* ${selectedFamily?.nombre || 'Válvula Modular'}\n`;
    msg += `*Cuerpos de Trabajo:* ${sections.length} secciones\n`;
    msg += `*Longitud de Ensamble:* ${totalLengthMm.toFixed(1)} mm\n`;
    if (tieRodKit) msg += `*Kit de Tirantes:* SKU ${tieRodKit.sku} (${tieRodKit.longitud_mm} mm)\n`;
    if (formData.nombre) msg += `*Contacto:* ${formData.nombre} (${formData.empresa || 'Particular'})\n`;
    if (formData.telefono) msg += `*Teléfono:* ${formData.telefono}\n`;
    msg += `\n*DESGLOSE DE MATERIALES (BOM):*\n`;

    bomItems.forEach((item, index) => {
      msg += `${index + 1}. [${item.sku}] ${item.nombre} (Cant: ${item.cantidad})\n`;
    });

    if (formData.comentarios) {
      msg += `\n*Notas Técnicas:* ${formData.comentarios}\n`;
    }

    return encodeURIComponent(msg);
  };

  const handleCopyBOM = () => {
    const text = bomItems
      .map((item, idx) => `${idx + 1}. SKU: ${item.sku} | ${item.nombre} | Cant: ${item.cantidad}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F26522]/15 text-[#F26522] border border-[#F26522]/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            Fase 3: Salida Comercial • Lion Store Parts
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Desglose de Materiales (BOM) y Cotización
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhase(2)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Constructor
          </button>

          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Nueva Configuración
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tabla BOM (Izquierda / Central) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F26522]" />
              Lista Oficial de Partes (Bill of Materials)
            </h2>

            <button
              onClick={handleCopyBOM}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#F26522] bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado al Portapapeles' : 'Copiar SKUs'}
            </button>
          </div>

          {/* Resumen Superior */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 text-xs">
            <div>
              <span className="text-zinc-500 block">Familia:</span>
              <span className="text-white font-medium">{selectedFamily?.nombre}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Secciones de Trabajo:</span>
              <span className="text-[#F26522] font-mono font-bold">{sections.length} cuerpos</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Longitud Total:</span>
              <span className="text-emerald-400 font-mono font-bold">{totalLengthMm.toFixed(1)} mm</span>
            </div>
          </div>

          {/* Tabla de Componentes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-medium">
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Descripción del Componente</th>
                  <th className="pb-2">Categoría</th>
                  <th className="pb-2 text-right">Cant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {bomItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 font-bold text-[#F26522] pr-2">{item.sku}</td>
                    <td className="py-2.5 text-zinc-200 pr-2 font-sans">{item.nombre}</td>
                    <td className="py-2.5 pr-2">
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-sans">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">{item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario Comercial y Envío Directo (Derecha) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 relative shrink-0">
                <Image
                  src="/images/lion-store-logo.png"
                  alt="Lion Store Parts"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h2 className="text-base font-bold text-white">Canal Comercial Lion Store</h2>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
              Venta Directa
            </span>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">¡Solicitud Registrada con Éxito!</h3>
              <p className="text-xs text-zinc-300">
                Un asesor técnico de Lion Store revisará tu ensamble {selectedFamily?.nombre} y te enviará la cotización formal a tu correo.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-400 underline pt-2 block mx-auto"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej. Carlos Mendoza"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  Empresa o Taller
                </label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder="ej. Maquinaria del Norte"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    placeholder="carlos@empresa.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F26522]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+52 ..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F26522]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium block">Notas Técnicas o Conectores</label>
                <textarea
                  rows={2}
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  placeholder="ej. Indicar si se requieren bobinas 12Vcc o 24Vcc y conectores Hirschmann..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F26522] resize-none"
                />
              </div>

              {/* Botón Principal: WhatsApp con Logo */}
              <a
                href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#F26522] hover:bg-[#EA580C] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#F26522]/20 text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar Cotización por WhatsApp a Lion Store
              </a>

              {/* Envío Interno */}
              <button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-4 rounded-xl border border-zinc-700 transition-all text-xs"
              >
                Registrar Solicitud en Sistema CRM
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
