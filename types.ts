export interface FieldMapping {
  id: string;
  fieldName: string; // Column A in Excel Config
  sourceCell: string; // Column B in Excel Config
  minReg: number; // Column C
  maxReg: number; // Column D
  format: string; // Column E
  colIndex: number; // Column F
}

export interface GlobalConfig {
  filePattern: string; // Not strictly used in browser filter, but kept for parity
  sheetName: string; // Sheet to read from
  idCell: string; // Cell containing the ID (e.g., J7)
  prefix: string; // Prefix to strip/add
}

export interface ConfigProfile {
  id: string;
  name: string;
  config: GlobalConfig;
  mappings: FieldMapping[];
}

export interface ProcessedRow {
  fileName: string;
  regId: number;
  order: number;
  data: Record<string, string | number | null>; // Keyed by colIndex or FieldName
  originalFile: File; // Reference for opening (if we could)
}

export interface ExcelError {
  fileName: string;
  error: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ANALYZING = 'ANALYZING',
}

export type UserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface PlanLimits {
  maxFilesPerBatch: number;
  allowAI: boolean;
  maxProfiles: number;
}