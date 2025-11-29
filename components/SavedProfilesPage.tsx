import React from 'react';
import { ArrowLeft, FileSpreadsheet, Trash2, CheckCircle } from 'lucide-react';
import { ConfigProfile } from '../types';

interface Props {
  profiles: ConfigProfile[];
  onSelectProfile: (profile: ConfigProfile) => void;
  onBack: () => void;
  onDeleteProfile: (id: string) => void;
}

export const SavedProfilesPage: React.FC<Props> = ({ profiles, onSelectProfile, onBack, onDeleteProfile }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 shadow-sm hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Meus Perfis Salvos</h1>
            <p className="text-slate-500 mt-1">Gerencie suas configurações de extração</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <div 
                key={profile.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group relative flex flex-col"
              >
                <div 
                    className="p-6 cursor-pointer flex-1"
                    onClick={() => onSelectProfile(profile)}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${profile.id === 'default' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                            <FileSpreadsheet className="w-8 h-8" />
                        </div>
                        {profile.id === 'default' && (
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">
                                PADRÃO
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {profile.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-2">
                        <div className="flex justify-between">
                            <span>Nome da Aba:</span>
                            <span className="font-medium text-slate-900">{profile.config.sheetName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Campos:</span>
                            <span className="font-medium text-slate-900">{profile.mappings.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Célula ID:</span>
                            <span className="font-medium text-slate-900">{profile.config.idCell}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                    <button
                        onClick={() => onSelectProfile(profile)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <CheckCircle className="w-4 h-4" /> Selecionar
                    </button>

                    {profile.id !== 'default' && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProfile(profile.id);
                            }}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Excluir Perfil"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};