import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} ExcelAI Solutions Ltda. Todos os direitos reservados.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Suporte</a>
        </div>
      </div>
    </footer>
  );
};