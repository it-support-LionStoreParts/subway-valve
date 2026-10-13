import { create } from 'zustand';
import { ValveFamily, FilterCriteria } from '@/types/valve-family';
import { ValveComponent, ComponentOption, SectionConfiguration, TieRodKit } from '@/types/component';
import { BOMItem } from '@/types/assembly';
import { CatalogService } from '@/lib/services/catalog-service';
import { Language } from '@/lib/i18n/translations';

export interface ValveStoreState {
  // Idioma
  language: Language;
  setLanguage: (lang: Language) => void;

  // Navegación por Fases (1: Filtro, 2: Constructor, 3: Cotizador)
  currentPhase: 1 | 2 | 3;
  setPhase: (phase: 1 | 2 | 3) => void;

  // ESTADO FASE 1: Filtro y Diagnóstico con Wizard por Pasos
  phase1Step: number; // 1 a 5
  setPhase1Step: (step: number) => void;
  filterCriteria: FilterCriteria;
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void;
  selectedFamily: ValveFamily | null;
  selectFamily: (family: ValveFamily) => void;

  // ESTADO FASE 2: Constructor Modular con Sub-pasos
  phase2SubStep: 'CHASIS' | 'SECCIONES' | 'TIRANTES';
  setPhase2SubStep: (step: 'CHASIS' | 'SECCIONES' | 'TIRANTES') => void;
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
  inlet: ValveComponent | null;
  sections: SectionConfiguration[];
  endCover: ValveComponent | null;
  tieRodKit: TieRodKit | null;
  availableComponents: ValveComponent[];
  availableOptions: Record<string, ComponentOption[]>; // componentId -> options
  isLoadingFamilyData: boolean;

  // Acciones FASE 2
  loadFamilyComponents: (familyId: string) => Promise<void>;
  setInlet: (inlet: ValveComponent) => void;
  setEndCover: (endCover: ValveComponent) => void;
  addSection: () => void;
  duplicateSection: (sectionId: string) => Promise<void>;
  removeSection: (sectionId: string) => void;
  updateSectionOption: (
    sectionId: string,
    category: 'ACTUADOR' | 'PUERTO' | 'SPOOL_TIPO',
    option: ComponentOption
  ) => void;
  recalculateTieRods: () => Promise<void>;

  // ESTADO FASE 3: Cotizador y Salida Comercial
  bomItems: BOMItem[];
  generateBOM: () => void;
  resetAll: () => void;
}

export const useValveStore = create<ValveStoreState>((set, get) => ({
  language: 'es',
  setLanguage: (lang) => set({ language: lang }),

  currentPhase: 1,
  setPhase: (phase) => set({ currentPhase: phase }),

  // Wizard Fase 1 (0: Bienvenida, 1-4: Preguntas, 5: Recomendación)
  phase1Step: 0,
  setPhase1Step: (step) => set({ phase1Step: step }),

  // Sub-pasos Fase 2
  phase2SubStep: 'CHASIS',
  setPhase2SubStep: (step) => set({ phase2SubStep: step }),
  activeSectionIndex: 0,
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),

  // Valores iniciales de diagnóstico hidráulico
  filterCriteria: {
    simultaneityFactor: 0.8,
    requiredGpm: 20.0,
    requiredPsi: 3500,
    isLoadSensing: true
  },
  setFilterCriteria: (partial) =>
    set((state) => ({ filterCriteria: { ...state.filterCriteria, ...partial } })),

  selectedFamily: null,
  selectFamily: async (family) => {
    set({ selectedFamily: family });
    // Carga automática de los componentes de la familia seleccionada
    await get().loadFamilyComponents(family.id);
  },

  inlet: null,
  sections: [],
  endCover: null,
  tieRodKit: null,
  availableComponents: [],
  availableOptions: {},
  isLoadingFamilyData: false,
  bomItems: [],

  loadFamilyComponents: async (familyId: string) => {
    set({ isLoadingFamilyData: true });
    try {
      const components = await CatalogService.getComponentsByFamily(familyId);
      const defaultInlet = components.find((c) => c.tipo_modulo === 'INLET') || null;
      const defaultWork = components.find((c) => c.tipo_modulo === 'WORK_SECTION') || null;
      const defaultCover = components.find((c) => c.tipo_modulo === 'END_COVER') || null;

      // Cargar opciones para las secciones de trabajo
      const optionsMap: Record<string, ComponentOption[]> = {};
      if (defaultWork) {
        optionsMap[defaultWork.id] = await CatalogService.getOptionsByComponent(defaultWork.id);
      }

      // Inicializar con 2 secciones de trabajo por defecto
      const initialSections: SectionConfiguration[] = [];
      if (defaultWork) {
        const opts = optionsMap[defaultWork.id] || [];
        const defaultActuator = opts.find((o) => o.categoria_opcion === 'ACTUADOR');
        const defaultSpool = opts.find((o) => o.categoria_opcion === 'SPOOL_TIPO');
        const defaultPort = opts.find((o) => o.categoria_opcion === 'PUERTO');

        for (let i = 1; i <= 2; i++) {
          initialSections.push({
            id: `sec-${Date.now()}-${i}`,
            componentId: defaultWork.id,
            component: defaultWork,
            selectedActuator: defaultActuator,
            selectedSpool: defaultSpool,
            selectedPort: defaultPort
          });
        }
      }

      // Obtener kit de tirantes inicial
      const tieRod = await CatalogService.getTieRodKit(familyId, initialSections.length);

      set({
        availableComponents: components,
        availableOptions: optionsMap,
        inlet: defaultInlet,
        endCover: defaultCover,
        sections: initialSections,
        tieRodKit: tieRod,
        isLoadingFamilyData: false
      });
    } catch (error) {
      console.error('Error al inicializar componentes de la familia:', error);
      set({ isLoadingFamilyData: false });
    }
  },

  setInlet: (inlet) => set({ inlet }),
  setEndCover: (endCover) => set({ endCover }),

  addSection: async () => {
    const { selectedFamily, availableComponents, availableOptions, sections } = get();
    if (!selectedFamily) return;

    if (sections.length >= selectedFamily.max_work_sections) {
      alert(`La familia ${selectedFamily.nombre} admite un máximo de ${selectedFamily.max_work_sections} secciones.`);
      return;
    }

    const defaultWork = availableComponents.find((c) => c.tipo_modulo === 'WORK_SECTION');
    if (!defaultWork) return;

    const opts = availableOptions[defaultWork.id] || [];
    const newSection: SectionConfiguration = {
      id: `sec-${Date.now()}-${sections.length + 1}`,
      componentId: defaultWork.id,
      component: defaultWork,
      selectedActuator: opts.find((o) => o.categoria_opcion === 'ACTUADOR'),
      selectedSpool: opts.find((o) => o.categoria_opcion === 'SPOOL_TIPO'),
      selectedPort: opts.find((o) => o.categoria_opcion === 'PUERTO')
    };

    const newSections = [...sections, newSection];
    const newTieRod = await CatalogService.getTieRodKit(selectedFamily.id, newSections.length);

    set({
      sections: newSections,
      tieRodKit: newTieRod,
      activeSectionIndex: newSections.length - 1
    });
  },

  duplicateSection: async (sectionId: string) => {
    const { selectedFamily, sections, language } = get();
    if (!selectedFamily) return;

    if (sections.length >= selectedFamily.max_work_sections) {
      alert(
        language === 'en'
          ? `Family ${selectedFamily.nombre} supports a maximum of ${selectedFamily.max_work_sections} sections.`
          : `La familia ${selectedFamily.nombre} admite un máximo de ${selectedFamily.max_work_sections} secciones.`
      );
      return;
    }

    const targetIndex = sections.findIndex((s) => s.id === sectionId);
    if (targetIndex === -1) return;
    const target = sections[targetIndex];

    const duplicated: SectionConfiguration = {
      ...target,
      id: `sec-${Date.now()}-${sections.length + 1}`
    };

    const newSections = [...sections];
    newSections.splice(targetIndex + 1, 0, duplicated);

    const newTieRod = await CatalogService.getTieRodKit(selectedFamily.id, newSections.length);

    set({
      sections: newSections,
      tieRodKit: newTieRod,
      activeSectionIndex: targetIndex + 1
    });
  },

  removeSection: async (sectionId) => {
    const { selectedFamily, sections } = get();
    if (sections.length <= 1) {
      alert('El bloque de válvulas debe tener al menos 1 sección de trabajo.');
      return;
    }
    const newSections = sections.filter((s) => s.id !== sectionId);
    const newTieRod = selectedFamily
      ? await CatalogService.getTieRodKit(selectedFamily.id, newSections.length)
      : null;

    set({
      sections: newSections,
      tieRodKit: newTieRod
    });
  },

  updateSectionOption: (sectionId, category, option) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (category === 'ACTUADOR') return { ...sec, selectedActuator: option };
        if (category === 'SPOOL_TIPO') return { ...sec, selectedSpool: option };
        if (category === 'PUERTO') return { ...sec, selectedPort: option };
        return sec;
      })
    }));
  },

  recalculateTieRods: async () => {
    const { selectedFamily, sections } = get();
    if (!selectedFamily) return;
    const tieRod = await CatalogService.getTieRodKit(selectedFamily.id, sections.length);
    set({ tieRodKit: tieRod });
  },

  generateBOM: () => {
    const { inlet, sections, endCover, tieRodKit } = get();
    const items: BOMItem[] = [];

    // 1. Módulo de Entrada
    if (inlet) {
      items.push({
        id: `bom-inlet-${inlet.id}`,
        sku: inlet.sku,
        nombre: inlet.nombre,
        categoria: 'CHASIS',
        cantidad: 1,
        descripcion: inlet.descripcion || undefined
      });
    }

    // 2. Secciones de Trabajo y sus Sub-opciones
    sections.forEach((sec, idx) => {
      // Cuerpo físico
      items.push({
        id: `bom-sec-${sec.id}`,
        sku: sec.component.sku,
        nombre: `Sección de Trabajo #${idx + 1} - ${sec.component.nombre}`,
        categoria: 'SECCION_TRABAJO',
        cantidad: 1
      });

      // Mando / Actuador
      if (sec.selectedActuator) {
        items.push({
          id: `bom-act-${sec.id}`,
          sku: sec.selectedActuator.sku_accesorio,
          nombre: `Actuador Sec #${idx + 1}: ${sec.selectedActuator.nombre_opcion}`,
          categoria: 'MANDO',
          cantidad: 1
        });
      }

      // Spool
      if (sec.selectedSpool) {
        items.push({
          id: `bom-spool-${sec.id}`,
          sku: sec.selectedSpool.sku_accesorio,
          nombre: `Carrete Sec #${idx + 1}: ${sec.selectedSpool.nombre_opcion}`,
          categoria: 'CARRETE',
          cantidad: 1
        });
      }

      // Puerto
      if (sec.selectedPort) {
        items.push({
          id: `bom-port-${sec.id}`,
          sku: sec.selectedPort.sku_accesorio,
          nombre: `Puertos Sec #${idx + 1}: ${sec.selectedPort.nombre_opcion}`,
          categoria: 'PUERTOS',
          cantidad: 1
        });
      }
    });

    // 3. Tapa de Cierre
    if (endCover) {
      items.push({
        id: `bom-cover-${endCover.id}`,
        sku: endCover.sku,
        nombre: endCover.nombre,
        categoria: 'CHASIS',
        cantidad: 1
      });
    }

    // 4. Kit de Tirantes
    if (tieRodKit) {
      items.push({
        id: `bom-tierod-${tieRodKit.id}`,
        sku: tieRodKit.sku,
        nombre: tieRodKit.nombre,
        categoria: 'TIRANTES',
        cantidad: 1,
        descripcion: `Espárragos y tuercas de ensamble (${tieRodKit.longitud_mm} mm)`
      });
    }

    set({ bomItems: items, currentPhase: 3 });
  },

  resetAll: () =>
    set({
      currentPhase: 1,
      phase1Step: 0,
      phase2SubStep: 'CHASIS',
      activeSectionIndex: 0,
      selectedFamily: null,
      inlet: null,
      sections: [],
      endCover: null,
      tieRodKit: null,
      bomItems: []
    })
}));
