import { ValveFamily } from '@/types/valve-family';
import { ValveComponent, ComponentOption, TieRodKit } from '@/types/component';

export const MOCK_FAMILIES: ValveFamily[] = [
  {
    id: 'DANFOSS_ECO80',
    nombre: 'Danfoss ECO 80 Directional Valve',
    proveedor: 'Danfoss Power Solutions',
    min_gpm: 1.0,
    max_gpm: 26.4, // hasta 100 L/min
    max_psi: 5075, // 350 bar
    supports_load_sensing: true,
    supports_open_center: true, // convertible con kit 11177668
    max_work_sections: 12,
    descripcion: 'Válvula de control direccional proporcional seccional ECO 80. Gran versatilidad con módulos mecánicos y electrohidráulicos, reductora de presión de pilotaje integrada (PPRV) y descarga eléctrica (EVPX).',
    imagen_portada_url: '/images/families/danfoss_eco80.png'
  },
  {
    id: 'DANFOSS_PVG32',
    nombre: 'Danfoss PVG 32 Proportional Valve',
    proveedor: 'Danfoss Power Solutions',
    min_gpm: 1.0,
    max_gpm: 34.3,
    max_psi: 5075,
    supports_load_sensing: true,
    supports_open_center: true,
    max_work_sections: 10,
    descripcion: 'Válvula hidráulica seccional de control proporcional de alto rendimiento. Ideal para grúas móviles, maquinaria agrícola, perforadoras y vehículos de construcción pesada.',
    imagen_portada_url: '/images/families/danfoss_pvg32.png'
  },
  {
    id: 'DANFOSS_PVG16',
    nombre: 'Danfoss PVG 16 Compact Proportional',
    proveedor: 'Danfoss Power Solutions',
    min_gpm: 0.5,
    max_gpm: 17.2,
    max_psi: 5075,
    supports_load_sensing: true,
    supports_open_center: true,
    max_work_sections: 8,
    descripcion: 'Solución compacta para equipos de tamaño reducido y menor caudal, manteniendo máxima precisión y compatibilidad con actuadores PVE.',
    imagen_portada_url: '/images/families/danfoss_pvg16.png'
  },
  {
    id: 'SUN_SERIE_2',
    nombre: 'Sun Hydraulics Serie 2 Modular Manifold',
    proveedor: 'Sun Hydraulics',
    min_gpm: 5.0,
    max_gpm: 40.0,
    max_psi: 5000,
    supports_load_sensing: true,
    supports_open_center: false,
    max_work_sections: 6,
    descripcion: 'Bloque de distribución de alta presión en acero dúctil con cavidades estándar T-11A / T-2A para cartuchos enroscables.',
    imagen_portada_url: '/images/families/sun_serie2.png'
  }
];

export const MOCK_COMPONENTS: ValveComponent[] = [
  // --- ECO 80 COMPONENTES ---
  {
    id: 'ECO80_EVP_LS_PPRV',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'INLET',
    sku: '11173011',
    nombre: 'Módulo de Entrada EVP Bomba Variable con PPRV',
    descripcion: 'Entrada para bomba variable Load Sensing con válvula reductora de presión de pilotaje (PPRV) integrada para alimentar actuadores electrohidráulicos.',
    imagen_2d_url: '/images/components/eco80_evp_pprv.png',
    llave_modelo_3d: 'mesh_eco80_inlet_ls_pprv',
    grosor_mm: 48.0
  },
  {
    id: 'ECO80_EVP_OC_PPRV',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'INLET',
    sku: '11173010',
    nombre: 'Módulo de Entrada EVP Bomba Fija con PPRV',
    descripcion: 'Entrada para bomba fija con bypass de centro abierto y reductora PPRV para pilotaje interno.',
    imagen_2d_url: '/images/components/eco80_evp_oc.png',
    llave_modelo_3d: 'mesh_eco80_inlet_oc_pprv',
    grosor_mm: 48.0
  },
  {
    id: 'ECO80_EVP_OC_EVPX',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'INLET',
    sku: '11173000',
    nombre: 'Módulo de Entrada EVP con PPRV y Descarga Eléctrica EVPX',
    descripcion: 'Entrada con solenoide de descarga rápida eléctrica (EVPX 12V/24V) de seguridad para despresurizar el circuito.',
    imagen_2d_url: '/images/components/eco80_evp_evpx.png',
    llave_modelo_3d: 'mesh_eco80_inlet_evpx',
    grosor_mm: 48.0
  },
  {
    id: 'ECO80_EVP_LS_NOPPRV',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'INLET',
    sku: '11173002',
    nombre: 'Módulo de Entrada EVP Bomba Variable sin PPRV',
    descripcion: 'Entrada simplificada sin pilotaje interno para configuraciones 100% mecánicas por palanca.',
    imagen_2d_url: '/images/components/eco80_evp_noprv.png',
    llave_modelo_3d: 'mesh_eco80_inlet_no_pprv',
    grosor_mm: 48.0
  },
  {
    id: 'ECO80_EVB_EH_LOW',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'WORK_SECTION',
    sku: '11168507',
    nombre: 'Cuerpo de Trabajo EVB Electrohidráulico (Bajo)',
    descripcion: 'Cuerpo de trabajo seccional optimizado para actuadores electrohidráulicos EVM/EVHC.',
    imagen_2d_url: '/images/components/eco80_evb.png',
    llave_modelo_3d: 'mesh_eco80_work_section',
    grosor_mm: 42.0
  },
  {
    id: 'ECO80_EVB_MEC_LOW',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'WORK_SECTION',
    sku: '11168504',
    nombre: 'Cuerpo de Trabajo EVB Mecánico (Bajo)',
    descripcion: 'Cuerpo de trabajo seccional optimizado para mando mecánico de palanca EVOS.',
    imagen_2d_url: '/images/components/eco80_evb_mec.png',
    llave_modelo_3d: 'mesh_eco80_work_section_mec',
    grosor_mm: 42.0
  },
  {
    id: 'ECO80_EVO_STD',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'END_COVER',
    sku: '11191585',
    nombre: 'Tapa de Cierre EVO Estándar Ciega',
    descripcion: 'Tapa terminal para cierre físico estanco del bloque seccional.',
    imagen_2d_url: '/images/components/eco80_evo_std.png',
    llave_modelo_3d: 'mesh_eco80_end_cover',
    grosor_mm: 24.0
  },
  {
    id: 'ECO80_EVO_LX',
    family_id: 'DANFOSS_ECO80',
    tipo_modulo: 'END_COVER',
    sku: '11191582',
    nombre: 'Tapa de Cierre EVO con Puerto LX (Drenaje Piloto)',
    descripcion: 'Tapa terminal con puerto LX integrado para conexión de línea de drenaje o desahogo externo.',
    imagen_2d_url: '/images/components/eco80_evo_lx.png',
    llave_modelo_3d: 'mesh_eco80_end_cover_lx',
    grosor_mm: 24.0
  },

  // --- PVG 32 COMPONENTES ---
  {
    id: 'PVG32_INLET_LS',
    family_id: 'DANFOSS_PVG32',
    tipo_modulo: 'INLET',
    sku: '157B5110',
    nombre: 'Módulo de Entrada PVP Load Sensing',
    descripcion: 'Módulo de entrada para bombas de desplazamiento variable con señal Load Sensing integrada y válvula de alivio principal ajustable.',
    imagen_2d_url: '/images/components/pvg32_inlet.png',
    llave_modelo_3d: 'mesh_pvg32_inlet_ls',
    grosor_mm: 48.0
  },
  {
    id: 'PVG32_INLET_OC',
    family_id: 'DANFOSS_PVG32',
    tipo_modulo: 'INLET',
    sku: '157B5111',
    nombre: 'Módulo de Entrada PVP Centro Abierto (Bomba Fija)',
    descripcion: 'Módulo de entrada con válvula bypass integrada para bombas de engranajes o cilindrada fija.',
    imagen_2d_url: '/images/components/pvg32_inlet_oc.png',
    llave_modelo_3d: 'mesh_pvg32_inlet_oc',
    grosor_mm: 48.0
  },
  {
    id: 'PVG32_WORK_STD',
    family_id: 'DANFOSS_PVG32',
    tipo_modulo: 'WORK_SECTION',
    sku: '157B6220',
    nombre: 'Sección de Trabajo PVB Estándar con Compensador',
    descripcion: 'Cuerpo de trabajo con compensador de presión individual que garantiza flujo constante independiente de la carga en los puertos de trabajo A y B.',
    imagen_2d_url: '/images/components/pvg32_work.png',
    llave_modelo_3d: 'mesh_pvg32_work_section',
    grosor_mm: 46.0
  },
  {
    id: 'PVG32_END_COVER',
    family_id: 'DANFOSS_PVG32',
    tipo_modulo: 'END_COVER',
    sku: '157B2000',
    nombre: 'Tapa de Cierre PVS Estándar',
    descripcion: 'Tapa terminal con puerto LX integrado para conexión de línea piloto o desahogo de señal externa.',
    imagen_2d_url: '/images/components/pvg32_end_cover.png',
    llave_modelo_3d: 'mesh_pvg32_end_cover',
    grosor_mm: 31.0
  }
];

export const MOCK_OPTIONS: ComponentOption[] = [
  // --- ECO 80 OPCIONES ---
  {
    id: 'ECO80_ACT_EVM_LEVER',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '11167002',
    nombre_opcion: 'Mando EH Proporcional EVM con Palanca Manual',
    llave_mesh_adicional: 'mesh_evm_lever'
  },
  {
    id: 'ECO80_ACT_EVHC_24V',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '11162298',
    nombre_opcion: 'Actuador Electrohidráulico EVHC 24Vcc Proporcional',
    llave_mesh_adicional: 'mesh_evhc_24v'
  },
  {
    id: 'ECO80_ACT_EVHCO_24V',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '11186911',
    nombre_opcion: 'Actuador Electrohidráulico EVHCO 24Vcc ON/OFF',
    llave_mesh_adicional: 'mesh_evhco_24v'
  },
  {
    id: 'ECO80_ACT_EVOS_LEVER',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '11175314',
    nombre_opcion: 'Mando Mecánico EVOS Palanca con Soporte',
    llave_mesh_adicional: 'mesh_lever_manual'
  },
  {
    id: 'ECO80_ACT_EVOS_STD',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '11172533',
    nombre_opcion: 'Mando Mecánico EVOS Estándar sin Palanca',
    llave_mesh_adicional: 'mesh_lever_base'
  },

  // Spools ECO80 (EVBS)
  {
    id: 'ECO80_SPOOL_C_25',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11170449',
    nombre_opcion: 'Carrete 4/3 EH Centro Cerrado (25 LPM - 6.6 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_SPOOL_C_60',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11170457',
    nombre_opcion: 'Carrete 4/3 EH Centro Cerrado (60 LPM - 15.8 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_SPOOL_C_100',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11182178',
    nombre_opcion: 'Carrete 4/3 EH Centro Cerrado (100 LPM - 26.4 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_SPOOL_M_60',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11134906',
    nombre_opcion: 'Carrete 4/3 EH Motor Centro Abierto (60 LPM - 15.8 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_SPOOL_M_100',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11182177',
    nombre_opcion: 'Carrete 4/3 EH Motor Centro Abierto (100 LPM - 26.4 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_SPOOL_EST_80',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '11170459',
    nombre_opcion: 'Carrete 4/3 EH Centro Estrangulado (80 LPM - 21.1 GPM)',
    llave_mesh_adicional: null
  },

  // Puertos ECO80
  {
    id: 'ECO80_PORT_SAE10',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'PUERTO',
    sku_accesorio: '11335679',
    nombre_opcion: 'Puertos Pórtico Rosca 7/8"-14 UNF (SAE #10)',
    llave_mesh_adicional: null
  },
  {
    id: 'ECO80_PORT_BSP12',
    component_id: 'ECO80_EVB_EH_LOW',
    categoria_opcion: 'PUERTO',
    sku_accesorio: 'ADAPT-BSP-12',
    nombre_opcion: 'Puertos Pórtico Rosca G 1/2 BSPP',
    llave_mesh_adicional: null
  },

  // --- PVG 32 OPCIONES ---
  {
    id: 'OPT_ACT_MANUAL',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '157B3171',
    nombre_opcion: 'Palanca de Mando Manual Estándar',
    llave_mesh_adicional: 'mesh_lever_manual'
  },
  {
    id: 'OPT_ACT_ELEC_12V',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '157B4216',
    nombre_opcion: 'Actuador Eléctrico Proporcional PVEA 12VDC',
    llave_mesh_adicional: 'mesh_pve_actuator_12v'
  },
  {
    id: 'OPT_ACT_ELEC_24V',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'ACTUADOR',
    sku_accesorio: '157B4228',
    nombre_opcion: 'Actuador Eléctrico Proporcional PVEA 24VDC',
    llave_mesh_adicional: 'mesh_pve_actuator_24v'
  },
  {
    id: 'OPT_SPOOL_CYL_40',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '157B7001',
    nombre_opcion: 'Carrete 4/3 Cilindro (40 L/min - 10.5 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'OPT_SPOOL_CYL_100',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '157B7003',
    nombre_opcion: 'Carrete 4/3 Cilindro (100 L/min - 26.4 GPM)',
    llave_mesh_adicional: null
  },
  {
    id: 'OPT_SPOOL_MOT_65',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'SPOOL_TIPO',
    sku_accesorio: '157B7102',
    nombre_opcion: 'Carrete 4/3 Motor con Flotación (65 L/min)',
    llave_mesh_adicional: null
  },
  {
    id: 'OPT_PORT_SAE8',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'PUERTO',
    sku_accesorio: 'ADAPT-SAE8',
    nombre_opcion: 'Puertos Rosca 3/4-16 UNF (SAE-8)',
    llave_mesh_adicional: null
  },
  {
    id: 'OPT_PORT_BSPP12',
    component_id: 'PVG32_WORK_STD',
    categoria_opcion: 'PUERTO',
    sku_accesorio: 'ADAPT-G12',
    nombre_opcion: 'Puertos Rosca G 1/2 BSPP',
    llave_mesh_adicional: null
  }
];

export const MOCK_TIE_RODS: TieRodKit[] = [
  // Tirantes EVAS ECO 80 (1 a 12)
  { id: 'TIE_ECO80_1S', family_id: 'DANFOSS_ECO80', num_secciones: 1, sku: '11173102', nombre: 'Kit Tirantes EVAS ECO80 - 1 Sección', longitud_mm: 135.0 },
  { id: 'TIE_ECO80_2S', family_id: 'DANFOSS_ECO80', num_secciones: 2, sku: '11173103', nombre: 'Kit Tirantes EVAS ECO80 - 2 Secciones', longitud_mm: 177.0 },
  { id: 'TIE_ECO80_3S', family_id: 'DANFOSS_ECO80', num_secciones: 3, sku: '11173104', nombre: 'Kit Tirantes EVAS ECO80 - 3 Secciones', longitud_mm: 219.0 },
  { id: 'TIE_ECO80_4S', family_id: 'DANFOSS_ECO80', num_secciones: 4, sku: '11173105', nombre: 'Kit Tirantes EVAS ECO80 - 4 Secciones', longitud_mm: 261.0 },
  { id: 'TIE_ECO80_5S', family_id: 'DANFOSS_ECO80', num_secciones: 5, sku: '11173106', nombre: 'Kit Tirantes EVAS ECO80 - 5 Secciones', longitud_mm: 303.0 },
  { id: 'TIE_ECO80_6S', family_id: 'DANFOSS_ECO80', num_secciones: 6, sku: '11173107', nombre: 'Kit Tirantes EVAS ECO80 - 6 Secciones', longitud_mm: 345.0 },
  { id: 'TIE_ECO80_7S', family_id: 'DANFOSS_ECO80', num_secciones: 7, sku: '11173108', nombre: 'Kit Tirantes EVAS ECO80 - 7 Secciones', longitud_mm: 387.0 },
  { id: 'TIE_ECO80_8S', family_id: 'DANFOSS_ECO80', num_secciones: 8, sku: '11173109', nombre: 'Kit Tirantes EVAS ECO80 - 8 Secciones', longitud_mm: 429.0 },
  { id: 'TIE_ECO80_9S', family_id: 'DANFOSS_ECO80', num_secciones: 9, sku: '11173110', nombre: 'Kit Tirantes EVAS ECO80 - 9 Secciones', longitud_mm: 471.0 },
  { id: 'TIE_ECO80_10S', family_id: 'DANFOSS_ECO80', num_secciones: 10, sku: '11173111', nombre: 'Kit Tirantes EVAS ECO80 - 10 Secciones', longitud_mm: 513.0 },
  { id: 'TIE_ECO80_11S', family_id: 'DANFOSS_ECO80', num_secciones: 11, sku: '11173112', nombre: 'Kit Tirantes EVAS ECO80 - 11 Secciones', longitud_mm: 555.0 },
  { id: 'TIE_ECO80_12S', family_id: 'DANFOSS_ECO80', num_secciones: 12, sku: '11173113', nombre: 'Kit Tirantes EVAS ECO80 - 12 Secciones', longitud_mm: 597.0 },

  // Tirantes PVG 32 (1 a 10)
  { id: 'TIE_PVG32_1S', family_id: 'DANFOSS_PVG32', num_secciones: 1, sku: '157B8001', nombre: 'Kit Tirantes PVG32 - 1 Sección', longitud_mm: 140.0 },
  { id: 'TIE_PVG32_2S', family_id: 'DANFOSS_PVG32', num_secciones: 2, sku: '157B8002', nombre: 'Kit Tirantes PVG32 - 2 Secciones', longitud_mm: 186.0 },
  { id: 'TIE_PVG32_3S', family_id: 'DANFOSS_PVG32', num_secciones: 3, sku: '157B8003', nombre: 'Kit Tirantes PVG32 - 3 Secciones', longitud_mm: 232.0 },
  { id: 'TIE_PVG32_4S', family_id: 'DANFOSS_PVG32', num_secciones: 4, sku: '157B8004', nombre: 'Kit Tirantes PVG32 - 4 Secciones', longitud_mm: 278.0 },
  { id: 'TIE_PVG32_5S', family_id: 'DANFOSS_PVG32', num_secciones: 5, sku: '157B8005', nombre: 'Kit Tirantes PVG32 - 5 Secciones', longitud_mm: 324.0 },
  { id: 'TIE_PVG32_6S', family_id: 'DANFOSS_PVG32', num_secciones: 6, sku: '157B8006', nombre: 'Kit Tirantes PVG32 - 6 Secciones', longitud_mm: 370.0 },
  { id: 'TIE_PVG32_7S', family_id: 'DANFOSS_PVG32', num_secciones: 7, sku: '157B8007', nombre: 'Kit Tirantes PVG32 - 7 Secciones', longitud_mm: 416.0 },
  { id: 'TIE_PVG32_8S', family_id: 'DANFOSS_PVG32', num_secciones: 8, sku: '157B8008', nombre: 'Kit Tirantes PVG32 - 8 Secciones', longitud_mm: 462.0 },
  { id: 'TIE_PVG32_9S', family_id: 'DANFOSS_PVG32', num_secciones: 9, sku: '157B8009', nombre: 'Kit Tirantes PVG32 - 9 Secciones', longitud_mm: 508.0 },
  { id: 'TIE_PVG32_10S', family_id: 'DANFOSS_PVG32', num_secciones: 10, sku: '157B8010', nombre: 'Kit Tirantes PVG32 - 10 Secciones', longitud_mm: 554.0 }
];
