import React, { useState } from 'react';
import { GlobalConfig, FieldMapping, ConfigProfile } from '../types';
import { Plus, Trash2, Settings, ChevronDown, ChevronUp, Save, FolderPlus, Disc } from 'lucide-react';

interface Props {
  config: GlobalConfig;
  setConfig: (c: GlobalConfig) => void;
  mappings: FieldMapping[];
  setMappings: (m: FieldMapping[]) => void;
  
  // Profile Management Props
  profiles: ConfigProfile[];
  currentProfileId: string;
  onProfileChange: (id: string) => void;
  onSaveProfile: () => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
}

export const ConfigPanel: React.FC<Props> = ({ 
  config, setConfig, mappings, setMappings,
  profiles, currentProfileId, onProfileChange, onSaveProfile, onCreateProfile, onDeleteProfile
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const updateMapping = (index: number, field: keyof FieldMapping, value: any) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  const removeMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const addMapping = () => {
    const maxCol = Math.max(...mappings.map(m => m.colIndex), 1);
    setMappings([
      ...mappings,
      {
        id: Date.now().toString(),
        fieldName: "NOVO CAMPO",
        sourceCell: "A1",
        minReg: 1,
        maxReg: 9999,
        format: "@",
        colIndex: maxCol + 1
      }
    ]);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName);
      setNewProfileName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden mb-6">
      <div 
        className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div 
          className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Settings className="w-5 h-5" />
          <h2>Configuração (CONFIG)</h2>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 ml-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />}
        </div>

        {/* Profile Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="flex items-center gap-2 animate-fadeIn">
              <input 
                type="text" 
                autoFocus
                placeholder="Nome do perfil..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-bold"
              >
                OK
              </button>
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-2 py-1 rounded text-xs"
              >
                X
              </button>
            </form>
          ) : (
            <>
              <select 
                value={currentProfileId} 
                onChange={(e) => onProfileChange(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5 min-w-[150px]"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button 
                onClick={onSaveProfile}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Salvar alterações no perfil atual"
              >
                <Save className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setIsCreating(true)}
                className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Criar novo perfil"
              >
                <FolderPlus className="w-5 h-5" />
              </button>

              <button 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
                    onDeleteProfile(currentProfileId);
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Excluir perfil atual"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-6">
          {/* Global Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Padrão de Arquivo (Ref)</label>
              <input 
                type="text" 
                name="filePattern" 
                value={config.filePattern} 
                onChange={handleConfigChange}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nome da Aba</label>
              <input 
                type="text" 
                name="sheetName" 
                value={config.sheetName} 
                onChange={handleConfigChange}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Célula ID (Reg)</label>
              <input 
                type="text" 
                name="idCell" 
                value={config.idCell} 
                onChange={handleConfigChange}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Prefixo ID</label>
              <input 
                type="text" 
                name="prefix" 
                value={config.prefix} 
                onChange={handleConfigChange}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Mapping Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-3 py-2">Nome do Campo</th>
                  <th className="px-3 py-2">Célula Origem</th>
                  <th className="px-3 py-2">Reg Min</th>
                  <th className="px-3 py-2">Reg Max</th>
                  <th className="px-3 py-2">Formato</th>
                  <th className="px-3 py-2">Índice Col</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mappings.map((map, idx) => (
                  <tr key={map.id} className="hover:bg-slate-50">
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={map.fieldName} 
                        onChange={(e) => updateMapping(idx, 'fieldName', e.target.value)}
                        className="w-full bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={map.sourceCell} 
                        onChange={(e) => updateMapping(idx, 'sourceCell', e.target.value)}
                        className="w-20 bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        value={map.minReg} 
                        onChange={(e) => updateMapping(idx, 'minReg', parseInt(e.target.value))}
                        className="w-20 bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        value={map.maxReg} 
                        onChange={(e) => updateMapping(idx, 'maxReg', parseInt(e.target.value))}
                        className="w-20 bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={map.format} 
                        onChange={(e) => updateMapping(idx, 'format', e.target.value)}
                        className="w-24 bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        value={map.colIndex} 
                        onChange={(e) => updateMapping(idx, 'colIndex', parseInt(e.target.value))}
                        className="w-16 bg-white text-slate-900 border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 border"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => removeMapping(idx)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button 
              onClick={addMapping}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Adicionar Campo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};