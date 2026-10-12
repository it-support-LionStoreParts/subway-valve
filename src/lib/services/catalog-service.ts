import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { ValveFamily, FilterCriteria, FamilyCompatibilityResult } from '@/types/valve-family';
import { ValveComponent, ComponentOption, TieRodKit } from '@/types/component';
import { MOCK_FAMILIES, MOCK_COMPONENTS, MOCK_OPTIONS, MOCK_TIE_RODS } from '@/lib/data/mock-catalog';

export const CatalogService = {
  // Obtener todas las familias
  async getFamilies(): Promise<ValveFamily[]> {
    if (!isSupabaseConfigured) {
      return MOCK_FAMILIES;
    }
    const { data, error } = await supabase.from('familias_valvula').select('*');
    if (error || !data || data.length === 0) {
      console.warn('Fallo al consultar Supabase o tabla vacía, usando catálogo local:', error);
      return MOCK_FAMILIES;
    }
    return data as ValveFamily[];
  },

  // Evaluar compatibilidad de familias según criterios de Fase 1
  async filterCompatibleFamilies(criteria: FilterCriteria): Promise<FamilyCompatibilityResult[]> {
    const families = await this.getFamilies();
    
    // Cálculo de flujo efectivo ajustado por factor de simultaneidad
    const effectiveGpm = criteria.requiredGpm * Math.max(0.1, Math.min(1.0, criteria.simultaneityFactor));

    return families.map((family) => {
      const warnings: string[] = [];
      let isCompatible = true;

      // 1. Validación de GPM
      if (effectiveGpm > family.max_gpm) {
        isCompatible = false;
        warnings.push(`Caudal requerido (${effectiveGpm.toFixed(1)} GPM) excede el máximo permitido (${family.max_gpm} GPM).`);
      } else if (effectiveGpm < family.min_gpm) {
        warnings.push(`Caudal (${effectiveGpm.toFixed(1)} GPM) está por debajo del rango óptimo (${family.min_gpm} GPM).`);
      }

      // 2. Validación de Presión PSI
      if (criteria.requiredPsi > family.max_psi) {
        isCompatible = false;
        warnings.push(`Presión requerida (${criteria.requiredPsi} PSI) excede la presión máxima (${family.max_psi} PSI).`);
      }

      // 3. Validación de Tipo de Circuito (Load Sensing vs Open Center)
      if (criteria.isLoadSensing && !family.supports_load_sensing) {
        isCompatible = false;
        warnings.push('La familia no soporta circuito Load Sensing (Centro Cerrado).');
      } else if (!criteria.isLoadSensing && !family.supports_open_center) {
        isCompatible = false;
        warnings.push('La familia no soporta circuito de Centro Abierto (Bomba Fija).');
      }

      return {
        family,
        isCompatible,
        warnings
      };
    });
  },

  // Obtener componentes de una familia
  async getComponentsByFamily(familyId: string): Promise<ValveComponent[]> {
    if (!isSupabaseConfigured) {
      return MOCK_COMPONENTS.filter((c) => c.family_id === familyId);
    }
    const { data, error } = await supabase.from('componentes').select('*').eq('family_id', familyId);
    if (error || !data || data.length === 0) {
      return MOCK_COMPONENTS.filter((c) => c.family_id === familyId);
    }
    return data as ValveComponent[];
  },

  // Obtener sub-opciones para un componente específico
  async getOptionsByComponent(componentId: string): Promise<ComponentOption[]> {
    if (!isSupabaseConfigured) {
      return MOCK_OPTIONS.filter((o) => o.component_id === componentId);
    }
    const { data, error } = await supabase.from('opciones_componente').select('*').eq('component_id', componentId);
    if (error || !data || data.length === 0) {
      return MOCK_OPTIONS.filter((o) => o.component_id === componentId);
    }
    return data as ComponentOption[];
  },

  // Obtener kit de tirantes según familia y cantidad de secciones
  async getTieRodKit(familyId: string, sectionCount: number): Promise<TieRodKit | null> {
    if (!isSupabaseConfigured) {
      return MOCK_TIE_RODS.find((t) => t.family_id === familyId && t.num_secciones === sectionCount) || null;
    }
    const { data, error } = await supabase
      .from('kits_tirantes')
      .select('*')
      .eq('family_id', familyId)
      .eq('num_secciones', sectionCount)
      .single();

    if (error || !data) {
      return MOCK_TIE_RODS.find((t) => t.family_id === familyId && t.num_secciones === sectionCount) || null;
    }
    return data as TieRodKit;
  }
};
