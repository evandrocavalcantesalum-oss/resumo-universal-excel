import { GlobalConfig, FieldMapping, ProcessedRow, ExcelError } from '../types';

// Declare XLSX global since we are loading it via CDN in index.html
declare var XLSX: any;

const extractLastNumber = (s: string): number => {
  const matches = s.match(/\d+/g);
  if (matches && matches.length > 0) {
    return parseInt(matches[matches.length - 1], 10);
  }
  return 0;
};

export const processFiles = async (
  files: FileList,
  config: GlobalConfig,
  mappings: FieldMapping[]
): Promise<{ rows: ProcessedRow[]; errors: ExcelError[] }> => {
  const rows: ProcessedRow[] = [];
  const errors: ExcelError[] = [];

  // Parallel processing helper
  const processFile = async (file: File) => {
    try {
      // Basic filter based on name pattern (simple string includes check for now)
      // The VBA used "Dir" with wildcards. Here we just check if it's an excel file.
      if (!file.name.match(/\.(xls|xlsx|xlsm)$/i)) {
        return;
      }

      // Read file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      // Check sheet existence
      const sheet = workbook.Sheets[config.sheetName];
      if (!sheet) {
        // Only log error if strictly required, otherwise skip silently like VBA (optional)
        // VBA: Debug.Print "Arquivo sem a planilha..."
        errors.push({ fileName: file.name, error: `Sheet '${config.sheetName}' not found.` });
        return;
      }

      // Get ID
      const cellAddress = config.idCell.replace(/[^A-Za-z0-9]/g, ''); // Safety trim
      const idCell = sheet[cellAddress];
      let regStr = idCell ? String(idCell.v) : file.name;
      
      const regId = extractLastNumber(regStr);

      // Extract Data based on mappings
      const rowData: Record<string, string | number | null> = {};

      mappings.forEach((map) => {
        // Check ID range (VBA: modIni/modFim)
        if (regId >= map.minReg && regId <= map.maxReg) {
           const sourceRef = map.sourceCell;
           const valCell = sheet[sourceRef];
           let val: string | number | null = valCell ? valCell.v : null;

           // Formatting Logic
           if (val !== null && typeof val === 'number') {
              const fmtLower = map.format.toLowerCase();
              
              // 1. Date Formatting
              if (fmtLower.includes('dd') || fmtLower.includes('mm') || fmtLower.includes('yyyy') || fmtLower.includes('aa')) {
                 try {
                     const date = XLSX.SSF.parse_date_code(val);
                     // Format as dd/mm/yyyy
                     val = `${String(date.d).padStart(2, '0')}/${String(date.m).padStart(2, '0')}/${date.y}`;
                 } catch (e) {
                     // keep number if date parse fails
                 }
              } 
              // 2. Numeric Formatting (e.g., 0.000)
              else if (map.format.match(/[0#][.,][0#]+/)) {
                 const match = map.format.match(/[.,]([0#]+)/);
                 if (match) {
                    const precision = match[1].length;
                    // Format using PT-BR locale (comma separator) to fix "innumerable decimals" visual issue
                    val = val.toLocaleString('pt-BR', {
                        minimumFractionDigits: precision,
                        maximumFractionDigits: precision
                    });
                 }
              }
           }
           
           rowData[map.colIndex] = val; // Store by column index for sorting/display
           rowData[`__name_${map.colIndex}`] = map.fieldName; // Store name for reference
        }
      });

      rows.push({
        fileName: file.name,
        regId: regId,
        order: 0, // Will assign later
        data: rowData,
        originalFile: file
      });

    } catch (err: any) {
      errors.push({ fileName: file.name, error: err.message || "Unknown error" });
    }
  };

  // Convert FileList to array and process
  const fileArray = Array.from(files);
  // Process in chunks to avoid UI freezing, though for typical batch size Promise.all is okay
  await Promise.all(fileArray.map(processFile));

  // Sort by regId (VBA Step 6.1)
  rows.sort((a, b) => a.regId - b.regId);

  // Assign Order (VBA Step 6.2)
  rows.forEach((row, index) => {
    row.order = index + 1;
  });

  return { rows, errors };
};