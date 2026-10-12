// Modelo de dominio para Familias de Válvula
import { DbValveFamily } from './database';

export type ValveFamily = DbValveFamily;

export interface FilterCriteria {
  simultaneityFactor: number; // Factor de simultaneidad (ej. 0.1 a 1.0)
  requiredGpm: number;        // Flujo requerido en Galones por Minuto
  requiredPsi: number;        // Presión requerida en PSI
  isLoadSensing: boolean;     // Circuito Load Sensing (Cerrado) o Centro Abierto
}

export interface FamilyCompatibilityResult {
  family: ValveFamily;
  isCompatible: boolean;
  warnings: string[];
}
