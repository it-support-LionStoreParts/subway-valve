// Tipos generados y mapeo del modelo relacional de Supabase

export type ModuleType = 'INLET' | 'WORK_SECTION' | 'END_COVER';
export type OptionCategory = 'ACTUADOR' | 'PUERTO' | 'SPOOL_TIPO';

export interface DbValveFamily {
  id: string;
  nombre: string;
  proveedor: string;
  min_gpm: number;
  max_gpm: number;
  max_psi: number;
  supports_load_sensing: boolean;
  supports_open_center: boolean;
  max_work_sections: number;
  descripcion: string | null;
  imagen_portada_url: string | null;
  created_at?: string;
}

export interface DbComponent {
  id: string;
  family_id: string;
  tipo_modulo: ModuleType;
  sku: string;
  nombre: string;
  descripcion: string | null;
  imagen_2d_url: string | null;
  llave_modelo_3d: string;
  grosor_mm: number;
  created_at?: string;
}

export interface DbComponentOption {
  id: string;
  component_id: string;
  categoria_opcion: OptionCategory;
  sku_accesorio: string;
  nombre_opcion: string;
  llave_mesh_adicional: string | null;
  created_at?: string;
}

export interface DbTieRodKit {
  id: string;
  family_id: string;
  num_secciones: number;
  sku: string;
  nombre: string;
  longitud_mm: number;
  created_at?: string;
}
