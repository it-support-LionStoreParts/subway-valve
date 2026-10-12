// Modelo de dominio para el Ensamble (Stack) y BOM (Bill of Materials)
import { ValveFamily } from './valve-family';
import { ValveComponent, SectionConfiguration, TieRodKit } from './component';

export interface ValveStackState {
  family: ValveFamily | null;
  inlet: ValveComponent | null;
  sections: SectionConfiguration[];
  endCover: ValveComponent | null;
  tieRodKit: TieRodKit | null;
}

export interface BOMItem {
  id: string;
  sku: string;
  nombre: string;
  categoria: 'CHASIS' | 'SECCION_TRABAJO' | 'MANDO' | 'CARRETE' | 'PUERTOS' | 'TIRANTES';
  cantidad: number;
  descripcion?: string;
  precioUnitarioEstimado?: number;
}

export interface QuotationLead {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  notes?: string;
  bomItems: BOMItem[];
  valveSummary: {
    familyName: string;
    sectionCount: number;
    totalLengthMm: number;
  };
}
