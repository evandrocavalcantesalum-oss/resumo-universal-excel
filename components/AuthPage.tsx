import React, { useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    AuthError
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Loader2, Lock, Mail, UserPlus, LogIn, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export type AuthViewType = 'LOGIN' | 'REGISTER' | 'FORGOT';

interface Props {
  initialView?: AuthViewType;
  onBack?: () => void;
}

export const AuthPage: React.FC<Props> = ({ initialView = 'LOGIN', onBack }) => {
  const [view, setView] = useState<AuthViewType>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state if prop changes (optional, but good for robustness)
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Clear errors when switching views
  const switchView = (v: AuthViewType) => {
    setView(v);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const getErrorMessage = (error: AuthError) => {
      switch (error.code) {
          case 'auth/invalid-email': return 'E-mail inválido.';
          case 'auth/user-disabled': return 'Usuário desativado.';
          case 'auth/user-not-found': return 'Usuário não encontrado.';
          case 'auth/wrong-password': return 'Senha incorreta.';
          case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
          case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
          case 'auth/invalid-credential': return 'Credenciais inválidas.';
          case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
          default: return 'Ocorreu um erro. Tente novamente.';
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        setError("Firebase não configurado. Verifique o arquivo firebaseConfig.ts");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        setError("Firebase não configurado.");
        return;
    }

    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
    }

    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Auto login happens automatically on success
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        setError("Firebase não configurado.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Link de recuperação enviado para seu e-mail.");
      setTimeout(() => switchView('LOGIN'), 3000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative">
            {onBack && (
                <button 
                    onClick={onBack}
                    className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    title="Voltar"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            )}
            
            <div className="inline-flex p-3 rounded-full bg-blue-600 text-white mb-4 shadow-lg shadow-blue-900/50">
                <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
                {view === 'LOGIN' && 'Bem-vindo de volta'}
                {view === 'REGISTER' && 'Criar nova conta'}
                {view === 'FORGOT' && 'Recuperar Senha'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
                {view === 'LOGIN' && 'Acesse o Resumidor de Excel com IA'}
                {view === 'REGISTER' && 'Comece a automatizar seus processos hoje'}
                {view === 'FORGOT' && 'Enviaremos um link para seu e-mail'}
            </p>
        </div>

        <div className="p-8">
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* LOGIN FORM */}
            {view === 'LOGIN' && (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Senha</label>
                            <button 
                                type="button"
                                onClick={() => switchView('FORGOT')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Esqueceu?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                        Entrar
                    </button>

                    <div className="text-center mt-6">
                        <span className="text-slate-500 text-sm">Não tem uma conta? </span>
                        <button 
                            type="button"
                            onClick={() => switchView('REGISTER')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                        >
                            Cadastre-se
                        </button>
                    </div>
                </form>
            )}

            {/* REGISTER FORM */}
            {view === 'REGISTER' && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Confirme a senha"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                        Criar Conta
                    </button>

                    <div className="text-center mt-6">
                        <button 
                            type="button"
                            onClick={() => switchView('LOGIN')}
                            className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center w-full gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar para Login
                        </button>
                    </div>
                </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {view === 'FORGOT' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                     <p className="text-sm text-slate-600 mb-2">
                        Digite seu e-mail cadastrado e enviaremos instruções para você redefinir sua senha.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                        Enviar E-mail de Recuperação
                    </button>

                    <div className="text-center mt-6">
                        <button 
                            type="button"
                            onClick={() => switchView('LOGIN')}
                            className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center w-full gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar para Login
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};