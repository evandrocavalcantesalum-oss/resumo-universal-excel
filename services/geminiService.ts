import { GoogleGenAI } from "@google/genai";
import { ProcessedRow, FieldMapping } from '../types';

export const analyzeData = async (rows: ProcessedRow[], mappings: FieldMapping[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY not found in environment variables.");
  }

  // Optimize data payload for token limits
  // We convert the processed rows into a lightweight CSV-like string for the LLM
  let dataSummary = "Arquivo, ID Reg, " + mappings.map(m => m.fieldName).join(", ") + "\n";
  
  // Take top 50 rows if dataset is huge to avoid token overflow, or sample it
  const rowsToAnalyze = rows.slice(0, 100); 

  rowsToAnalyze.forEach(row => {
    const values = mappings.map(m => {
        const val = row.data[m.colIndex];
        return val !== undefined && val !== null ? val : "N/A";
    });
    dataSummary += `${row.fileName}, ${row.regId}, ${values.join(", ")}\n`;
  });

  if (rows.length > 100) {
      dataSummary += `\n... (e mais ${rows.length - 100} linhas)`;
  }

  const prompt = `
  Você é um especialista em Análise e Engenharia de Dados. 
  Eu extraí dados de ${rows.length} arquivos Excel.
  
  Aqui está a tabela de resumo (formato CSV):
  
  ${dataSummary}
  
  Por favor, forneça uma análise concisa em Português:
  1. Identifique quaisquer outliers potenciais nos dados numéricos.
  2. Identifique sequências faltantes no 'ID Reg' (ID de Registro).
  3. Resuma a faixa geral de valores para os campos principais.
  4. Se houver erros ou valores N/A, destaque-os.
  
  Formate a saída em Markdown.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Nenhuma análise gerada.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Falha ao gerar análise: ${error.message}`;
  }
};