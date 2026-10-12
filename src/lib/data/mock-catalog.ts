import { ValveFamily } from '@/types/valve-family';
import { ValveComponent, ComponentOption, TieRodKit } from '@/types/component';

export const MOCK_FAMILIES: ValveFamily[] = [
  {
    id: 'DANFOSS_PVG32',
    nombre: 'Danfoss PVG 32 Proportional Valve',
    proveedor: 'Danfoss',
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
    proveedor: 'Danfoss',
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
