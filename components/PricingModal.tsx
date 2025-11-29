import React from 'react';
import { X, Check, Zap, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PricingModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Free Plan */}
        <div className="flex-1 p-8 bg-slate-50 border-r border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold text-slate-700">Plano Grátis</h3>
          <p className="text-slate-500 text-sm mt-1">Para testes e pequenos lotes</p>
          <div className="mt-6 mb-8">
            <span className="text-4xl font-bold text-slate-900">R$ 0</span>
            <span className="text-slate-500">/mês</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <Check className="w-4 h-4 text-green-500" />
              Até 5 arquivos por lote
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <Check className="w-4 h-4 text-green-500" />
              1 Perfil de Configuração
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-400">
              <X className="w-4 h-4" />
              Análise de IA Avançada
            </li>
             <li className="flex items-center gap-3 text-sm text-slate-400">
              <X className="w-4 h-4" />
              Exportação Profissional
            </li>
          </ul>
          
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            Continuar Grátis
          </button>
        </div>

        {/* Pro Plan */}
        <div className="flex-1 p-8 bg-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
            MAIS POPULAR
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900">Plano PRO</h3>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-slate-500 text-sm mt-1">Automação sem limites</p>
          
          <div className="mt-6 mb-8">
            <span className="text-4xl font-bold text-blue-600">R$ 49</span>
            <span className="text-slate-500">/mês</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <div className="bg-blue-100 p-1 rounded-full"><Check className="w-3 h-3 text-blue-600" /></div>
              Arquivos Ilimitados
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <div className="bg-blue-100 p-1 rounded-full"><Check className="w-3 h-3 text-blue-600" /></div>
              Perfis de Configuração Ilimitados
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <div className="bg-purple-100 p-1 rounded-full"><Zap className="w-3 h-3 text-purple-600" /></div>
              Análise IA Gemini (Tokens Ilimitados)
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <div className="bg-blue-100 p-1 rounded-full"><Check className="w-3 h-3 text-blue-600" /></div>
              Exportação Excel & PDF Premium
            </li>
          </ul>
          
          <button 
            onClick={onUpgrade}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Assinar Agora
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">Cancelamento a qualquer momento.</p>
        </div>

      </div>
    </div>
  );
};