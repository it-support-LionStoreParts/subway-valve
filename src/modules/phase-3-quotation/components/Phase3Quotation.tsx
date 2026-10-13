'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useValveStore } from '@/lib/store/valve-store';
import { translations } from '@/lib/i18n/translations';
import {
  FileText,
  MessageCircle,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Copy,
  Building2,
  Mail,
  Phone,
  User
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
    resetAll,
    language
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

  const t = translations[language];
  const p3 = t.phase3Content;

  // Longitud total acumulada
  const totalLengthMm =
    (inlet?.grosor_mm || 0) +
    sections.reduce((acc, s) => acc + (s.component.grosor_mm || 0), 0) +
    (endCover?.grosor_mm || 0);

  // Formateador de WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `*${p3.whatsappGreeting}*\n`;
    msg += `------------------------------------\n`;
    msg += `*${language === 'en' ? 'Family:' : 'Familia:'}* ${selectedFamily?.nombre || 'Danfoss'}\n`;
    msg += `*${language === 'en' ? 'Work Bodies:' : 'Cuerpos de Trabajo:'}* ${sections.length} ${language === 'en' ? 'sections' : 'secciones'}\n`;
    msg += `*${language === 'en' ? 'Assembly Length:' : 'Longitud Ensamble:'}* ${totalLengthMm.toFixed(1)} mm\n`;
    if (tieRodKit) {
      msg += `*${language === 'en' ? 'Tie Rod Kit:' : 'Kit de Tirantes:'}* SKU ${tieRodKit.sku} (${tieRodKit.longitud_mm} mm)\n`;
    }
    if (formData.nombre) msg += `*Contacto:* ${formData.nombre} (${formData.empresa || 'Particular'})\n`;
    if (formData.telefono) msg += `*Tel:* ${formData.telefono}\n`;
    msg += `\n*${p3.title}:*\n`;

    bomItems.forEach((item, index) => {
      msg += `${index + 1}. [${item.sku}] ${item.nombre} (${p3.colQty}: ${item.cantidad})\n`;
    });

    if (formData.comentarios) {
      msg += `\n*Notas:* ${formData.comentarios}\n`;
    }

    return encodeURIComponent(msg);
  };

  const handleCopyBOM = () => {
    const text = bomItems
      .map((item, idx) => `${idx + 1}. SKU: ${item.sku} | ${item.nombre} | ${p3.colQty}: ${item.cantidad}`)
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#F26522] font-semibold block">
            {language === 'en' ? 'Phase 03 • Commercial Quote' : 'Fase 03 • Salida Comercial'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mt-0.5">
            {p3.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPhase(2)}
            className="text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{p3.modifyBtn}</span>
          </button>

          <button
            onClick={resetAll}
            className="text-slate-500 hover:text-rose-600 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{p3.newConfigBtn}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tabla BOM (Izquierda / Central) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F26522]" />
              <span>{p3.title}</span>
            </h2>

            <button
              onClick={handleCopyBOM}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#F26522] bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/80 hover:bg-slate-100 transition-colors font-medium"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'en' ? 'Copied' : 'Copiado al Portapapeles') : (language === 'en' ? 'Copy SKUs' : 'Copiar SKUs')}</span>
            </button>
          </div>

          {/* Resumen Superior */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium block">
                {language === 'en' ? 'Family' : 'Familia'}
              </span>
              <span className="text-slate-900 font-semibold">{selectedFamily?.nombre}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium block">
                {language === 'en' ? 'Bodies' : 'Cuerpos'}
              </span>
              <span className="text-[#F26522] font-semibold">{sections.length} {language === 'en' ? 'sections' : 'secciones'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium block">
                {language === 'en' ? 'Length' : 'Longitud'}
              </span>
              <span className="text-emerald-700 font-semibold">{totalLengthMm.toFixed(1)} mm</span>
            </div>
          </div>

          {/* Tabla de Componentes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  <th className="pb-3">{p3.colSku}</th>
                  <th className="pb-3">{p3.colDesc}</th>
                  <th className="pb-3">{p3.colType}</th>
                  <th className="pb-3 text-right">{p3.colQty}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bomItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-semibold text-[#F26522] pr-2">{item.sku}</td>
                    <td className="py-3 text-slate-800 pr-2 font-medium">{item.nombre}</td>
                    <td className="py-3 pr-2 text-slate-500">
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">{item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario Comercial y Envío Directo (Derecha) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/lion-store-logo.png"
                alt="Lion Store Parts"
                width={1024}
                height={791}
                className="h-6 w-auto object-contain"
                style={{ width: 'auto', height: '24px' }}
              />
              <h2 className="text-base font-semibold text-slate-900">
                {language === 'en' ? 'Lion Store Quotation' : 'Cotización Lion Store'}
              </h2>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
              {language === 'en' ? 'Technical Support' : 'Asistencia Técnica'}
            </span>
          </div>

          {submitted ? (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-semibold text-emerald-950">
                {language === 'en' ? 'Quote Request Received!' : '¡Solicitud Registrada!'}
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {language === 'en'
                  ? `A technical specialist from Lion Store Parts will review your ${selectedFamily?.nombre} assembly and send the formal quote.`
                  : `Un asesor especializado de Lion Store Parts revisará tu bloque ${selectedFamily?.nombre} y te enviará la cotización formal por correo.`}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-700 font-medium underline pt-2 block mx-auto"
              >
                {language === 'en' ? 'Send another request' : 'Enviar otra solicitud'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-600 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'en' ? 'Full Name *' : 'Nombre Completo *'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. Carlos Mendoza' : 'ej. Carlos Mendoza'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'en' ? 'Company or Workshop' : 'Empresa o Taller'}</span>
                </label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. Machinery Corp' : 'ej. Maquinaria del Norte'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'en' ? 'Email *' : 'Correo *'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    placeholder="carlos@empresa.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'en' ? 'Phone *' : 'Teléfono *'}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+52 ..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 font-medium block">
                  {language === 'en' ? 'Notes or Special Requirements' : 'Notas o Requerimientos Especiales'}
                </label>
                <textarea
                  rows={2}
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. 12V or 24V coils, AMP / Deutsch connector...' : 'ej. Voltaje de bobinas (12Vcc o 24Vcc), tipo de conector...'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] resize-none transition-all"
                />
              </div>

              {/* Botón Principal: WhatsApp */}
              <a
                href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#F26522] hover:bg-[#E05312] text-white font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{p3.whatsappBtn}</span>
              </a>

              {/* Envío Interno CRM */}
              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-full transition-all text-xs"
              >
                {language === 'en' ? 'Submit to Technical Sales Team' : 'Registrar Solicitud en Sistema CRM'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
