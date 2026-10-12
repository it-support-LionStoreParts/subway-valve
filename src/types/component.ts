// Modelo de dominio para Componentes Físicos y Sub-opciones
import { DbComponent, DbComponentOption, DbTieRodKit, ModuleType, OptionCategory } from './database';

export type ValveComponent = DbComponent;
export type ComponentOption = DbComponentOption;
export type TieRodKit = DbTieRodKit;

export interface ComponentWithOptions extends ValveComponent {
  actuators: ComponentOption[];
  spools: ComponentOption[];
  ports: ComponentOption[];
}

export interface SectionConfiguration {
  id: string; // ID único de la instancia en el stack (ej. "section-1", "section-2")
  componentId: string;
  component: ValveComponent;
  selectedActuator?: ComponentOption;
  selectedSpool?: ComponentOption;
  selectedPort?: ComponentOption;
}
