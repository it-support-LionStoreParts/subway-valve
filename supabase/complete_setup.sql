-- ==============================================================================
-- SUBWAY VALVE - SCRIPT UNIFICADO DE INSTALACIÓN (SCHEMA + SEED DATA)
-- Copia y pega todo este contenido en el "SQL Editor" de tu panel de Supabase
-- y presiona el botón "RUN".
-- ==============================================================================

-- 1. TABLA MAESTRA: Familias de Válvula
CREATE TABLE IF NOT EXISTS public.familias_valvula (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    proveedor VARCHAR(50) NOT NULL,
    min_gpm NUMERIC(6, 2) NOT NULL DEFAULT 0,
    max_gpm NUMERIC(6, 2) NOT NULL,
    max_psi INTEGER NOT NULL,
    supports_load_sensing BOOLEAN NOT NULL DEFAULT true,
    supports_open_center BOOLEAN NOT NULL DEFAULT true,
    max_work_sections INTEGER NOT NULL DEFAULT 10,
    descripcion TEXT,
    imagen_portada_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA: Componentes Base (Inlet, Work Section, End Cover)
CREATE TABLE IF NOT EXISTS public.componentes (
    id VARCHAR(50) PRIMARY KEY,
    family_id VARCHAR(50) NOT NULL REFERENCES public.familias_valvula(id) ON DELETE CASCADE,
    tipo_modulo VARCHAR(30) NOT NULL CHECK (tipo_modulo IN ('INLET', 'WORK_SECTION', 'END_COVER')),
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen_2d_url VARCHAR(500),
    llave_modelo_3d VARCHAR(100) NOT NULL,
    grosor_mm NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_componentes_family_id ON public.componentes(family_id);
CREATE INDEX IF NOT EXISTS idx_componentes_tipo ON public.componentes(tipo_modulo);

-- 3. TABLA: Opciones de Componente (Puertos, Mandos/Actuadores y Carretes/Spools)
CREATE TABLE IF NOT EXISTS public.opciones_componente (
    id VARCHAR(50) PRIMARY KEY,
    component_id VARCHAR(50) NOT NULL REFERENCES public.componentes(id) ON DELETE CASCADE,
    categoria_opcion VARCHAR(30) NOT NULL CHECK (categoria_opcion IN ('ACTUADOR', 'PUERTO', 'SPOOL_TIPO')),
    sku_accesorio VARCHAR(50) NOT NULL,
    nombre_opcion VARCHAR(100) NOT NULL,
    llave_mesh_adicional VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_opciones_component_id ON public.opciones_componente(component_id);
CREATE INDEX IF NOT EXISTS idx_opciones_categoria ON public.opciones_componente(categoria_opcion);

-- 4. TABLA: Kits de Tirantes de Ensamble
CREATE TABLE IF NOT EXISTS public.kits_tirantes (
    id VARCHAR(50) PRIMARY KEY,
    family_id VARCHAR(50) NOT NULL REFERENCES public.familias_valvula(id) ON DELETE CASCADE,
    num_secciones INTEGER NOT NULL CHECK (num_secciones > 0),
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    longitud_mm NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(family_id, num_secciones)
);

CREATE INDEX IF NOT EXISTS idx_kits_family_secciones ON public.kits_tirantes(family_id, num_secciones);

-- POLÍTICAS DE LECTURA PÚBLICA (Row Level Security)
ALTER TABLE public.familias_valvula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.componentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opciones_componente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits_tirantes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública para familias_valvula" ON public.familias_valvula;
CREATE POLICY "Lectura pública para familias_valvula" ON public.familias_valvula FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública para componentes" ON public.componentes;
CREATE POLICY "Lectura pública para componentes" ON public.componentes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública para opciones_componente" ON public.opciones_componente;
CREATE POLICY "Lectura pública para opciones_componente" ON public.opciones_componente FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública para kits_tirantes" ON public.kits_tirantes;
CREATE POLICY "Lectura pública para kits_tirantes" ON public.kits_tirantes FOR SELECT USING (true);

-- ==============================================================================
-- INSERCIÓN DE DATOS SEMILLA (CATÁLOGO DANFOSS Y SUN HYDRAULICS)
-- ==============================================================================

-- 1. Familias
INSERT INTO public.familias_valvula (id, nombre, proveedor, min_gpm, max_gpm, max_psi, supports_load_sensing, supports_open_center, max_work_sections, descripcion, imagen_portada_url)
VALUES 
(
    'DANFOSS_PVG32',
    'Danfoss PVG 32 Proportional Valve',
    'Danfoss',
    1.0,
    34.3,
    5075,
    true,
    true,
    10,
    'Válvula hidráulica seccional de control proporcional de alto rendimiento. Ideal para grúas móviles, maquinaria agrícola, perforadoras y vehículos de construcción pesada.',
    '/images/families/danfoss_pvg32.png'
),
(
    'DANFOSS_PVG16',
    'Danfoss PVG 16 Compact Proportional',
    'Danfoss',
    0.5,
    17.2,
    5075,
    true,
    true,
    8,
    'Solución compacta para equipos de tamaño reducido y menor caudal, manteniendo máxima precisión y compatibilidad con actuadores PVE.',
    '/images/families/danfoss_pvg16.png'
),
(
    'SUN_SERIE_2',
    'Sun Hydraulics Serie 2 Modular Manifold',
    'Sun Hydraulics',
    5.0,
    40.0,
    5000,
    true,
    false,
    6,
    'Bloque de distribución de alta presión en acero dúctil con cavidades estándar T-11A / T-2A para cartuchos enroscables.',
    '/images/families/sun_serie2.png'
)
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    max_gpm = EXCLUDED.max_gpm,
    max_psi = EXCLUDED.max_psi,
    descripcion = EXCLUDED.descripcion;

-- 2. Componentes PVG 32
INSERT INTO public.componentes (id, family_id, tipo_modulo, sku, nombre, descripcion, imagen_2d_url, llave_modelo_3d, grosor_mm)
VALUES
(
    'PVG32_INLET_LS',
    'DANFOSS_PVG32',
    'INLET',
    '157B5110',
    'Módulo de Entrada PVP Load Sensing',
    'Módulo de entrada para bombas de desplazamiento variable con señal Load Sensing integrada y válvula de alivio principal ajustable.',
    '/images/components/pvg32_inlet.png',
    'mesh_pvg32_inlet_ls',
    48.0
),
(
    'PVG32_INLET_OC',
    'DANFOSS_PVG32',
    'INLET',
    '157B5111',
    'Módulo de Entrada PVP Centro Abierto (Bomba Fija)',
    'Módulo de entrada con válvula bypass integrada para bombas de engranajes o cilindrada fija.',
    '/images/components/pvg32_inlet_oc.png',
    'mesh_pvg32_inlet_oc',
    48.0
),
(
    'PVG32_WORK_STD',
    'DANFOSS_PVG32',
    'WORK_SECTION',
    '157B6220',
    'Sección de Trabajo PVB Estándar con Compensador',
    'Cuerpo de trabajo con compensador de presión individual que garantiza flujo constante independiente de la carga en los puertos de trabajo A y B.',
    '/images/components/pvg32_work.png',
    'mesh_pvg32_work_section',
    46.0
),
(
    'PVG32_END_COVER',
    'DANFOSS_PVG32',
    'END_COVER',
    '157B2000',
    'Tapa de Cierre PVS Estándar',
    'Tapa terminal con puerto LX integrado para conexión de línea piloto o desahogo de señal externa.',
    '/images/components/pvg32_end_cover.png',
    'mesh_pvg32_end_cover',
    31.0
)
ON CONFLICT (id) DO NOTHING;

-- 3. Opciones de Componente para PVG32_WORK_STD
INSERT INTO public.opciones_componente (id, component_id, categoria_opcion, sku_accesorio, nombre_opcion, llave_mesh_adicional)
VALUES
(
    'OPT_ACT_MANUAL',
    'PVG32_WORK_STD',
    'ACTUADOR',
    '157B3171',
    'Palanca de Mando Manual Estándar',
    'mesh_lever_manual'
),
(
    'OPT_ACT_ELEC_12V',
    'PVG32_WORK_STD',
    'ACTUADOR',
    '157B4216',
    'Actuador Eléctrico Proporcional PVEA 12VDC',
    'mesh_pve_actuator_12v'
),
(
    'OPT_ACT_ELEC_24V',
    'PVG32_WORK_STD',
    'ACTUADOR',
    '157B4228',
    'Actuador Eléctrico Proporcional PVEA 24VDC',
    'mesh_pve_actuator_24v'
),
(
    'OPT_SPOOL_CYL_40',
    'PVG32_WORK_STD',
    'SPOOL_TIPO',
    '157B7001',
    'Carrete 4/3 Cilindro de Doble Efecto (40 L/min - 10.5 GPM)',
    NULL
),
(
    'OPT_SPOOL_CYL_100',
    'PVG32_WORK_STD',
    'SPOOL_TIPO',
    '157B7003',
    'Carrete 4/3 Cilindro de Doble Efecto (100 L/min - 26.4 GPM)',
    NULL
),
(
    'OPT_SPOOL_MOT_65',
    'PVG32_WORK_STD',
    'SPOOL_TIPO',
    '157B7102',
    'Carrete 4/3 Motor Hidráulico con Flotación (65 L/min - 17.2 GPM)',
    NULL
),
(
    'OPT_PORT_SAE8',
    'PVG32_WORK_STD',
    'PUERTO',
    'ADAPT-SAE8',
    'Puertos Rosca 3/4-16 UNF (SAE-8)',
    NULL
),
(
    'OPT_PORT_BSPP12',
    'PVG32_WORK_STD',
    'PUERTO',
    'ADAPT-G12',
    'Puertos Rosca G 1/2 BSPP',
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- 4. Kits de Tirantes PVG 32
INSERT INTO public.kits_tirantes (id, family_id, num_secciones, sku, nombre, longitud_mm)
VALUES
('TIE_PVG32_1S', 'DANFOSS_PVG32', 1, '157B8001', 'Kit de Tirantes PVG32 - 1 Sección', 140.0),
('TIE_PVG32_2S', 'DANFOSS_PVG32', 2, '157B8002', 'Kit de Tirantes PVG32 - 2 Secciones', 186.0),
('TIE_PVG32_3S', 'DANFOSS_PVG32', 3, '157B8003', 'Kit de Tirantes PVG32 - 3 Secciones', 232.0),
('TIE_PVG32_4S', 'DANFOSS_PVG32', 4, '157B8004', 'Kit de Tirantes PVG32 - 4 Secciones', 278.0),
('TIE_PVG32_5S', 'DANFOSS_PVG32', 5, '157B8005', 'Kit de Tirantes PVG32 - 5 Secciones', 324.0),
('TIE_PVG32_6S', 'DANFOSS_PVG32', 6, '157B8006', 'Kit de Tirantes PVG32 - 6 Secciones', 370.0),
('TIE_PVG32_7S', 'DANFOSS_PVG32', 7, '157B8007', 'Kit de Tirantes PVG32 - 7 Secciones', 416.0),
('TIE_PVG32_8S', 'DANFOSS_PVG32', 8, '157B8008', 'Kit de Tirantes PVG32 - 8 Secciones', 462.0),
('TIE_PVG32_9S', 'DANFOSS_PVG32', 9, '157B8009', 'Kit de Tirantes PVG32 - 9 Secciones', 508.0),
('TIE_PVG32_10S', 'DANFOSS_PVG32', 10, '157B8010', 'Kit de Tirantes PVG32 - 10 Secciones', 554.0)
ON CONFLICT (id) DO NOTHING;
