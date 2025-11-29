import React from 'react';
import { ArrowRight, Zap, BrainCircuit, Clock, Layers, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onStart: () => void;
  onOpenSavedProfiles: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart, onOpenSavedProfiles }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-bold text-xl tracking-tight text-slate-800">
            Excel Summarizer
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span className="max-w-[150px] truncate hidden sm:inline">{currentUser?.email}</span>
            </div>
            <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
                <LogOut className="w-4 h-4" />
                Sair
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 text-center flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-100">
          <Zap className="w-4 h-4" />
          <span>Automatize sua rotina de escritório</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Pare de Digitar.<br />
          <span className="text-blue-600">Comece a Automatizar.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          O <strong>Resumidor de Excel com IA</strong> lê pastas inteiras em segundos, extrai exatamente o que você precisa e gera relatórios prontos.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onStart}
            className="group inline-flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
          >
            Novo Processamento
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onOpenSavedProfiles}
            className="group inline-flex justify-center items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-lg font-semibold px-8 py-4 rounded-lg shadow-sm transition-all transform hover:-translate-y-1"
          >
            <Settings className="w-5 h-5 text-slate-500" />
            Meus Perfis Salvos
          </button>
        </div>
      </div>

      {/* Pain Points / Benefits */}
      <div className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Economize Horas</h3>
              <p className="text-slate-600">
                Fazer resumos manuais de centenas de arquivos leva dias. Nossa ferramenta processa tudo em instantes.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Padronização Total</h3>
              <p className="text-slate-600">
                Elimine erros de digitação. O sistema extrai os dados exatos das células configuradas.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inteligência Artificial</h3>
              <p className="text-slate-600">
                Use a IA para analisar tendências e encontrar anomalias nos seus dados automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};