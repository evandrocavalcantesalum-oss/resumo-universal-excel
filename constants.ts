import { FieldMapping, GlobalConfig } from "./types";

export const DEFAULT_CONFIG: GlobalConfig = {
  filePattern: "*Densidade real MGR*.xlsx",
  sheetName: "DENS.REAL",
  idCell: "J7",
  prefix: "MGR-"
};

export const DEFAULT_MAPPINGS: FieldMapping[] = [
  { id: '1', fieldName: "DATA", sourceCell: "B7", minReg: 1, maxReg: 9999, format: "dd/mm/yyyy", colIndex: 2 },
  { id: '2', fieldName: "HORA", sourceCell: "L8", minReg: 1, maxReg: 9999, format: "hh:mm", colIndex: 3 },
  { id: '3', fieldName: "REGISTRO", sourceCell: "J7", minReg: 1, maxReg: 9999, format: "@", colIndex: 4 },
  { id: '4', fieldName: "MATERIAL", sourceCell: "G5", minReg: 1, maxReg: 9999, format: "@", colIndex: 5 },
  { id: '5', fieldName: "LOCAL", sourceCell: "B36", minReg: 38, maxReg: 9999, format: "@", colIndex: 6 },
  { id: '6', fieldName: "MASSA ESP.", sourceCell: "E32", minReg: 1, maxReg: 181, format: "0.000", colIndex: 7 },
];
