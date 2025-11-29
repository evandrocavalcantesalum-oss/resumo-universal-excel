import React from 'react';
import { ProcessedRow, FieldMapping } from '../types';
import { FileText } from 'lucide-react';

interface Props {
  rows: ProcessedRow[];
  mappings: FieldMapping[];
}

export const ResultsTable: React.FC<Props> = ({ rows, mappings }) => {
  // Sort mappings by column index to render headers correctly
  const sortedMappings = [...mappings].sort((a, b) => a.colIndex - b.colIndex);

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="text-slate-500">Nenhum dado processado ainda. Selecione uma pasta para começar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700">Resultados do Resumo ({rows.length} arquivos)</h3>
        <span className="text-xs text-slate-500">Ordenado por ID Reg</span>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap bg-slate-100">Arquivo</th>
              {sortedMappings.map(m => (
                <th key={m.id} className="px-4 py-3 whitespace-nowrap bg-slate-100 border-l border-slate-200">
                  {m.fieldName}
                </th>
              ))}
              <th className="px-4 py-3 whitespace-nowrap bg-slate-100 border-l border-slate-200">ID Reg</th>
              <th className="px-4 py-3 whitespace-nowrap bg-slate-100 border-l border-slate-200">Ordem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.fileName} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap flex items-center gap-2">
                   <FileText className="w-3 h-3 text-slate-400" />
                   {row.fileName}
                </td>
                {sortedMappings.map(m => (
                  <td key={m.id} className="px-4 py-2 border-l border-slate-100 whitespace-nowrap">
                    {row.data[m.colIndex] !== undefined && row.data[m.colIndex] !== null 
                      ? String(row.data[m.colIndex]) 
                      : <span className="text-slate-300 italic">-</span>
                    }
                  </td>
                ))}
                <td className="px-4 py-2 border-l border-slate-100 text-slate-500 font-mono">
                  {row.regId}
                </td>
                 <td className="px-4 py-2 border-l border-slate-100 text-slate-500 font-mono">
                  {row.order}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};