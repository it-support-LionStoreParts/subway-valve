-- Migración 01: Creación de tablas maestras para Subway Valve
-- Modelo de 4 entidades relacionales estrictas

-- 1. Tabla Maestra: Familias de Válvula
CREATE TABLE IF NOT EXISTS familias_valvula (
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

-- 2. Tabla: Componentes Base de Cada Familia (Inlet, Work Section, End Cover)
CREATE TABLE IF NOT EXISTS componentes (
    id VARCHAR(50) PRIMARY KEY,
    family_id VARCHAR(50) NOT NULL REFERENCES familias_valvula(id) ON DELETE CASCADE,
    tipo_modulo VARCHAR(30) NOT NULL CHECK (tipo_modulo IN ('INLET', 'WORK_SECTION', 'END_COVER')),
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen_2d_url VARCHAR(500),
    llave_modelo_3d VARCHAR(100) NOT NULL,
    grosor_mm NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices de consulta rápida por familia y tipo
CREATE INDEX IF NOT EXISTS idx_componentes_family_id ON componentes(family_id);
CREATE INDEX IF NOT EXISTS idx_componentes_tipo ON componentes(tipo_modulo);

-- 3. Tabla: Opciones de Componente (Puertos, Mandos/Actuadores y Spools)
CREATE TABLE IF NOT EXISTS opciones_componente (
    id VARCHAR(50) PRIMARY KEY,
    component_id VARCHAR(50) NOT NULL REFERENCES componentes(id) ON DELETE CASCADE,
    categoria_opcion VARCHAR(30) NOT NULL CHECK (categoria_opcion IN ('ACTUADOR', 'PUERTO', 'SPOOL_TIPO')),
    sku_accesorio VARCHAR(50) NOT NULL,
    nombre_opcion VARCHAR(100) NOT NULL,
    llave_mesh_adicional VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_opciones_component_id ON opciones_componente(component_id);
CREATE INDEX IF NOT EXISTS idx_opciones_categoria ON opciones_componente(categoria_opcion);

-- 4. Tabla: Kits de Tirantes y Sellos (Asignación automática por N secciones)
CREATE TABLE IF NOT EXISTS kits_tirantes (
    id VARCHAR(50) PRIMARY KEY,
    family_id VARCHAR(50) NOT NULL REFERENCES familias_valvula(id) ON DELETE CASCADE,
    num_secciones INTEGER NOT NULL CHECK (num_secciones > 0),
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    longitud_mm NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(family_id, num_secciones)
);

CREATE INDEX IF NOT EXISTS idx_kits_family_secciones ON kits_tirantes(family_id, num_secciones);

-- Políticas RLS (Row Level Security): lectura pública habilitada para el configurador
ALTER TABLE familias_valvula ENABLE ROW LEVEL SECURITY;
ALTER TABLE componentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE opciones_componente ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits_tirantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública para familias_valvula" ON familias_valvula FOR SELECT USING (true);
CREATE POLICY "Lectura pública para componentes" ON componentes FOR SELECT USING (true);
CREATE POLICY "Lectura pública para opciones_componente" ON opciones_componente FOR SELECT USING (true);
CREATE POLICY "Lectura pública para kits_tirantes" ON kits_tirantes FOR SELECT USING (true);
