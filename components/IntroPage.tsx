import React from 'react';
import { FileSpreadsheet, Sparkles, ShieldCheck, ArrowRight, Zap, BarChart3 } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export const IntroPage: React.FC<Props> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
        {/* Background Gradients & Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-10 flex justify-between items-center max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
                    <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ExcelAI</span>
            </div>
            <button 
                onClick={onLogin}
                className="px-5 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
                Fazer Login
            </button>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-24 md:pb-28 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
            
            {/* Left Column: Copy */}
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3 h-3" />
                    Potencializado por Gemini 2.5
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                    Transforme <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Dados em Decisões
                    </span>
                </h1>
                
                <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                    A ferramenta definitiva para processar lotes de Excel. Extraia dados de centenas de arquivos, padronize informações e receba análises de IA em segundos.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                    <button 
                        onClick={onRegister}
                        className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-900/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Criar Conta Grátis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={onLogin}
                        className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-white border border-slate-700 hover:border-slate-600 rounded-xl font-semibold text-lg transition-all hover:-translate-y-1"
                    >
                        Acessar Sistema
                    </button>
                </div>

                <div className="pt-8 flex items-center gap-8 text-slate-500 text-sm justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Seguro e Criptografado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Processamento Instantâneo</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="flex-1 w-full max-w-lg relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
                 {/* Abstract Dashboard Card */}
                 <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative z-10 transform md:rotate-3 transition-transform hover:rotate-0 duration-500">
                    {/* Fake Window Controls */}
                    <div className="flex items-center gap-2 mb-6 opacity-50">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    {/* Fake Chart/Content */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="h-2 w-20 bg-slate-600 rounded"></div>
                                <div className="text-3xl font-bold text-white">1,284</div>
                                <div className="text-xs text-slate-400">Arquivos Processados</div>
                            </div>
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-green-400" />
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Extração de Dados</span>
                                <span>100%</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-blue-500 rounded-full"></div>
                            </div>
                            
                            <div className="flex justify-between text-xs text-slate-400 pt-1">
                                <span>Análise de IA</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-purple-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* AI Insight Box */}
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mt-4 flex gap-3">
                            <div className="mt-1">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed">
                                <span className="font-semibold text-indigo-300 block mb-1">Insight Gemini:</span>
                                Detectei uma anomalia na densidade do material no lote MGR-45. Recomendada revisão.
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Decorative Elements behind card */}
                 <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            </div>
        </main>
    </div>
  );
}