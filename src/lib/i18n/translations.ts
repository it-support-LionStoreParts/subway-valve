export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Header & Navigation
    brand: 'Lion Store Parts',
    brandSubtitle: 'Configurador Hidráulico Modular',
    phase1: '01 Diagnóstico',
    phase2: '02 Configuración',
    phase3: '03 Cotización',
    reset: 'Reiniciar',
    language: 'Idioma',
    
    // Welcome Hero
    welcome: {
      badge: 'Ingeniería de Sistemas Hidráulicos',
      title: 'Configurador de Válvulas Modulares',
      description:
        'Diseña, dimensiona y cotiza bancos de válvulas de alta precisión con validación técnica inmediata en 2D y 3D.',
      startButton: 'Comenzar Configuración',
      feat1Title: 'Diagnóstico Rápido',
      feat1Desc: 'Cálculo de compatibilidad en 4 pasos según caudal, presión y simultaneidad.',
      feat2Title: 'Planos Técnicos Acotados',
      feat2Desc: 'Cotas milimétricas de ingeniería y cálculo de tirantes en tiempo real.',
      feat3Title: 'Cotización Inmediata',
      feat3Desc: 'BOM detallado con SKUs Danfoss oficiales y exportación a WhatsApp.'
    },

    // Phase 1: Filter & Diagnosis
    phase1Content: {
      stepOf: 'Paso {current} de {total}',
      step1Title: 'Caudal Requerido del Sistema',
      step1Question: '¿Cuál es el caudal nominal que entrega tu bomba hidráulica?',
      step1Help: 'El caudal define el tamaño mínimo del cuerpo y puertos para evitar caídas de presión.',
      flowLabel: 'Caudal Requerido (GPM)',
      equivalentLpm: 'Equivalente a {lpm} L/min',
      
      step2Title: 'Factor de Simultaneidad',
      step2Question: '¿Qué porcentaje de actuadores operarán simultáneamente?',
      step2Help: 'Optimiza la selección de la válvula evitando sobredimensionar la bomba o el bloque.',
      simultaneityLabel: 'Factor de Simultaneidad',
      effectiveFlowLabel: 'Caudal Efectivo Simultáneo',
      formulaNotice: 'Fórmula de cálculo: {gpm} GPM × {factor}% = {effective} GPM necesarios en el bloque.',
      
      step3Title: 'Presión Máxima de Operación',
      step3Question: '¿Cuál es la presión máxima de operación de tu sistema?',
      step3Help: 'Garantiza que el material del cuerpo y los sellos soporten el régimen de trabajo.',
      pressureLabel: 'Presión de Trabajo (PSI)',
      equivalentBar: 'Equivalente a {bar} bar',
      pressurePresetStandard: 'Presión Estándar (3,000 PSI)',
      pressurePresetHigh: 'Alta Presión (4,500 PSI)',

      step4Title: 'Tipo de Bomba y Circuito',
      step4Question: '¿Qué tecnología de bomba alimenta tu circuito hidráulico?',
      step4Help: 'Determina si el módulo de entrada requiere descargador EVPX (centro abierto) o bypass.',
      pumpLS: 'Bomba de Desplazamiento Variable',
      pumpLSDesc: 'Load Sensing (Centro Cerrado) • Máxima eficiencia energética y control fino.',
      pumpFixed: 'Bomba de Desplazamiento Fijo',
      pumpFixedDesc: 'Engranes / Paletas (Centro Abierto) • Requiere módulo de descarga EVPX.',

      prevStep: 'Anterior',
      nextStep: 'Siguiente Paso',
      completeToContinue: 'Completa los pasos para activar la recomendación.',
      
      // Live Catalog
      catalogTitle: 'Familias de Válvulas',
      catalogSubtitle: 'Filtrado en tiempo real',
      recommendedBadge: '★ #1 Recomendada',
      compatibleBadge: 'Compatible',
      incompatibleBadge: 'No Compatible',
      flowLimit: 'Flujo Máx',
      pressureLimit: 'Presión Máx',
      maxSections: 'Cuerpos Máx',
      configureButton: 'Configurar Esta Familia',
      warnFlow: 'Supera el caudal máximo de {max} GPM.',
      warnPressure: 'Supera la presión máxima de {max} PSI.'
    },

    // Phase 2: Builder
    phase2Content: {
      substepChassis: 'Chasis (Entrada & Tapa)',
      substepSections: 'Cuerpos de Trabajo ({count})',
      substepTieRods: 'Tirantes y Cotas',
      
      view2D: 'Plano 2D Acotado',
      view3D: 'Estudio 3D',
      dimShow: 'Cotas Visibles',
      dimHide: 'Ocultar Cotas',
      
      assemblyDimensions: 'Corte Esquemático Acotado (Plano 2D)',
      totalLength: 'Longitud Total Ensamble',
      tieRodKit: 'Kit de Tirantes',
      tieRodUseful: 'Longitud Útil',
      nominalLength: 'Longitud Nominal',
      height: 'Altura',
      
      addSectionBtn: '+ Agregar Sección',
      addSectionVisual: 'Agregar Cuerpo',
      addSectionSubtext: '+40 mm al ensamble',
      deleteSection: 'Eliminar',
      duplicateSection: 'Duplicar',
      sectionNumber: 'Cuerpo #{num}',
      inletModule: 'Módulo Entrada (EVP)',
      endCoverModule: 'Tapa Final (EVO)',
      
      summaryInlet: 'Entrada (EVP)',
      summarySections: 'Cuerpos ({count} secc.)',
      summaryCover: 'Tapa (EVO)',
      summaryTotal: 'Total Ensamble',
      
      hoverInspection: 'Haz clic o pasa el cursor sobre cada módulo para configurar actuador, carrete y puertos.',
      officialGuide: 'Guía Técnica Oficial ECO 80',
      backToDiagnosis: 'Volver a Diagnóstico',
      proceedToQuote: 'Ver Cotización & BOM',
      
      // Configurator Form
      configureSectionTitle: 'Configuración del Cuerpo #{num}',
      actuatorLabel: 'Tipo de Actuador / Mando',
      spoolLabel: 'Carrete / Centro Hidráulico',
      portLabel: 'Roscas de Puertos A & B',
      maxSectionsWarning: 'Esta familia permite un máximo de {max} secciones.',
      minSectionsWarning: 'El bloque debe tener al menos 1 sección de trabajo.'
    },

    // Phase 3: Quotation
    phase3Content: {
      title: 'Resumen de Cotización & Lista de Materiales (BOM)',
      subtitle: 'Componentes oficiales Danfoss con códigos de parte exactos para tu ensamble configurado.',
      colSku: 'Código SKU',
      colDesc: 'Descripción Técnica',
      colType: 'Módulo',
      colQty: 'Cant.',
      colPrice: 'Precio Unit.',
      colTotal: 'Total',
      estimatedSubtotal: 'Subtotal Estimado:',
      tax: 'IVA Estimado (16%):',
      grandTotal: 'Total Estimado (USD):',
      whatsappBtn: 'Cotizar por WhatsApp',
      pdfBtn: 'Exportar Resumen PDF',
      modifyBtn: 'Modificar Configuración',
      newConfigBtn: 'Nueva Configuración',
      whatsappGreeting: 'Hola Lion Store Parts, quiero cotizar la siguiente configuración de válvulas:'
    }
  },

  en: {
    // Header & Navigation
    brand: 'Lion Store Parts',
    brandSubtitle: 'Modular Hydraulic Configurator',
    phase1: '01 Diagnosis',
    phase2: '02 Configuration',
    phase3: '03 Quotation',
    reset: 'Reset',
    language: 'Language',

    // Welcome Hero
    welcome: {
      badge: 'Hydraulic Systems Engineering',
      title: 'Modular Valve Configurator',
      description:
        'Design, size, and quote high-precision proportional valve banks with real-time 2D and 3D technical validation.',
      startButton: 'Start Configuration',
      feat1Title: 'Fast Diagnosis',
      feat1Desc: '4-step compatibility sizing based on flow rate, pressure, and simultaneity.',
      feat2Title: 'Dimensioned Drawings',
      feat2Desc: 'Precision millimeter CAD dimensions and real-time tie rod calculation.',
      feat3Title: 'Instant Quotation',
      feat3Desc: 'Detailed Bill of Materials with official Danfoss SKUs and WhatsApp export.'
    },

    // Phase 1: Filter & Diagnosis
    phase1Content: {
      stepOf: 'Step {current} of {total}',
      step1Title: 'Required System Flow Rate',
      step1Question: 'What is the nominal flow rate delivered by your hydraulic pump?',
      step1Help: 'Flow rate determines minimum valve body and port sizes to prevent pressure drops.',
      flowLabel: 'Required Flow (GPM)',
      equivalentLpm: 'Equivalent to {lpm} L/min',

      step2Title: 'Simultaneity Factor',
      step2Question: 'What percentage of actuators will operate at the same time?',
      step2Help: 'Optimizes valve bank sizing without unnecessarily increasing pump or manifold cost.',
      simultaneityLabel: 'Simultaneity Factor',
      effectiveFlowLabel: 'Effective Simultaneous Flow',
      formulaNotice: 'Calculation formula: {gpm} GPM × {factor}% = {effective} GPM required at the valve bank.',

      step3Title: 'Maximum Working Pressure',
      step3Question: 'What is the maximum operating pressure of your system?',
      step3Help: 'Ensures the valve manifold bodies and seal kits withstand the duty cycle.',
      pressureLabel: 'Working Pressure (PSI)',
      equivalentBar: 'Equivalent to {bar} bar',
      pressurePresetStandard: 'Standard Pressure (3,000 PSI)',
      pressurePresetHigh: 'High Pressure (4,500 PSI)',

      step4Title: 'Pump & Circuit Architecture',
      step4Question: 'What pump technology powers your hydraulic circuit?',
      step4Help: 'Determines whether the inlet requires an EVPX bypass unloader (open center) or standard load sense.',
      pumpLS: 'Variable Displacement Pump',
      pumpLSDesc: 'Load Sensing (Closed Center) • Maximum efficiency and fine metering.',
      pumpFixed: 'Fixed Displacement Pump',
      pumpFixedDesc: 'Gear / Vane (Open Center) • Requires EVPX unloader bypass dump valve.',

      prevStep: 'Previous',
      nextStep: 'Next Step',
      completeToContinue: 'Complete the steps to activate the recommendation.',

      // Live Catalog
      catalogTitle: 'Valve Families',
      catalogSubtitle: 'Real-time filtering',
      recommendedBadge: '★ #1 Recommended',
      compatibleBadge: 'Compatible',
      incompatibleBadge: 'Incompatible',
      flowLimit: 'Max Flow',
      pressureLimit: 'Max Pressure',
      maxSections: 'Max Bodies',
      configureButton: 'Configure This Family',
      warnFlow: 'Exceeds maximum flow rate of {max} GPM.',
      warnPressure: 'Exceeds maximum pressure of {max} PSI.'
    },

    // Phase 2: Builder
    phase2Content: {
      substepChassis: 'Chassis (Inlet & Cover)',
      substepSections: 'Work Sections ({count})',
      substepTieRods: 'Tie Rods & Dimensions',

      view2D: 'Dimensioned 2D Drawing',
      view3D: '3D Studio',
      dimShow: 'Dimensions On',
      dimHide: 'Hide Dimensions',

      assemblyDimensions: 'Schematic Assembly Drawing (2D CAD)',
      totalLength: 'Total Assembly Length',
      tieRodKit: 'Tie Rod Kit',
      tieRodUseful: 'Usable Length',
      nominalLength: 'Nominal Length',
      height: 'Height',

      addSectionBtn: '+ Add Section',
      addSectionVisual: 'Add Work Body',
      addSectionSubtext: '+40 mm to assembly',
      deleteSection: 'Delete',
      duplicateSection: 'Duplicate',
      sectionNumber: 'Section #{num}',
      inletModule: 'Inlet Module (EVP)',
      endCoverModule: 'End Cover (EVO)',

      summaryInlet: 'Inlet (EVP)',
      summarySections: 'Bodies ({count} sects.)',
      summaryCover: 'Cover (EVO)',
      summaryTotal: 'Total Assembly',

      hoverInspection: 'Click or hover over any module to configure actuator, spool, and port threads.',
      officialGuide: 'ECO 80 Official Technical Guide',
      backToDiagnosis: 'Back to Diagnosis',
      proceedToQuote: 'View Quotation & BOM',

      // Configurator Form
      configureSectionTitle: 'Configuring Work Section #{num}',
      actuatorLabel: 'Actuator / Control Type',
      spoolLabel: 'Spool / Center Type',
      portLabel: 'A & B Working Port Threads',
      maxSectionsWarning: 'This family supports a maximum of {max} sections.',
      minSectionsWarning: 'The valve block must have at least 1 work section.'
    },

    // Phase 3: Quotation
    phase3Content: {
      title: 'Quotation Summary & Bill of Materials (BOM)',
      subtitle: 'Official Danfoss components and exact part numbers for your configured assembly.',
      colSku: 'SKU Code',
      colDesc: 'Technical Description',
      colType: 'Module',
      colQty: 'Qty',
      colPrice: 'Unit Price',
      colTotal: 'Total',
      estimatedSubtotal: 'Estimated Subtotal:',
      tax: 'Estimated Tax (16%):',
      grandTotal: 'Estimated Total (USD):',
      whatsappBtn: 'Quote via WhatsApp',
      pdfBtn: 'Export PDF Summary',
      modifyBtn: 'Modify Assembly',
      newConfigBtn: 'New Configuration',
      whatsappGreeting: 'Hello Lion Store Parts, I would like to request a quote for this valve assembly:'
    }
  }
};
