import React, { useState, useRef, useEffect } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsTable } from './components/ResultsTable';
import { LandingPage } from './components/LandingPage';
import { SavedProfilesPage } from './components/SavedProfilesPage';
import { AuthPage, AuthViewType } from './components/AuthPage';
import { IntroPage } from './components/IntroPage';
import { PricingModal } from './components/PricingModal';
import { Footer } from './components/Footer';
import { DEFAULT_CONFIG, DEFAULT_MAPPINGS } from './constants';
import { GlobalConfig, FieldMapping, ProcessedRow, ExcelError, AppStatus, ConfigProfile, UserPlan, PlanLimits } from './types';
import { processFiles } from './services/excelService';
import { analyzeData } from './services/geminiService';
import { FolderOpen, Play, Loader2, Sparkles, AlertTriangle, FileSpreadsheet, FileText, Download, ArrowLeft, LogOut, User as UserIcon, Crown, Lock } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

// Declare global libraries loaded via CDN
declare var XLSX: any;
declare var jspdf: any;
declare var ExcelJS: any;

const STORAGE_KEY = 'excel_summarizer_profiles_v1';

// MOCK PLAN CONFIGURATION (In a real app, this comes from the database/auth claim)
const PLANS: Record<UserPlan, PlanLimits> = {
    FREE: { maxFilesPerBatch: 5, allowAI: false, maxProfiles: 1 },
    PRO: { maxFilesPerBatch: 9999, allowAI: true, maxProfiles: 9999 },
    ENTERPRISE: { maxFilesPerBatch: 9999, allowAI: true, maxProfiles: 9999 }
};

const APP_LOGO_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFSURBVHja7Z1NaxRXFMcF84O0C4uCBRGK4CaF/gA3bSrYhS6CrgTFhZtCF6WbLgqFiCjoQjf9AIqLkk03Ld20dCHWj6C4sA+a/8yTc52Z3Dszb+a9d2buA88eJ/Pmvf/5v3PvmTszF1K2t7f/p/W0Wq1x4g1gCjgLzAJz/7wGfA38CawB68Ca8b1Wq/1v6UqY8CbwGjAHnAVmJ1A/HwM/AR8D3wFrE6i3iC2g0wfsB+aB54CngWcmUN87wEfAd8BHwG/T3o86CDkDPAnsB54B9k9Yv3vAF8B7wGfAzynqY6tCOgI8D7wEPAfsn8C+d4D3gXean09SIFsRsg94BXgVeG6Cj3sX+Ah4F/gM+G0SAllHyAngFeA14KUJPfbt5ufdFkK2hHQA+wFvAG8C0xN67C3gbeAj4NehQ7YipJufN4C3Jvy428DbwCfAr0OFbAnpAPYD3gTeAc5M8LF3gLeBj4BfhgbZipBO//x4FzgzwcfeAd5pfr4ZCmQ9Qg4AbwLvAWeHOO5t4M3m57uhQLYipAN4BXgPOAvMDHHs28BbwEfAr30F2YqQDuBV4H3gTCTI28BHwK99BdmKkCngTeAj4EwnyNvAh8AvfQXZipAO4HXgA+BsJMjbwIfAr30F2YqQDuB14APgbCTI28CHwK99BemKkCngTeAj4EwkyDvAR8BPA4V0AHuBN4EPgTNDHPc28G7z891AIV1b7VeAD4AzQxz3DvBx8/P9QCFb2y1vAR8D+yMceQf4BPhpoJCuF/cTwEfA/giQj4GfBwrpAHYCbwEfAvsjQN4B3ml+vh8oZGtN/SbwEbAvAuRj4OeBQrre270FfAjsiwD5BPhp4I97V4RMAB8C+yJAPgV+GSikA3gN+AA4EwnyNvAh8GtfQbYipAN4HfgAOBsJ8jbwIfBrX0G2IqQDeB14APgbCfI28CHwa19BtiKkA3gd+AA4GwTye+DXvoJsRUgH8AbwHnAmEuRt4M3m5/uhQLYipAN4A3gPOBsJ8jbwVvPz/VAgrVZr3Phet9+S7jU/Z4Y47l3gM+C3oUC29i7z0/6XJvzYd4GPNz//Gihka0/5KvA68NIEn/Iu8B7w2eZnd6iQrf3la8AbwIsTeuzbzc+7LYR0hMwCrwGvAc9M8LF3gQ+B94Dftz67I4Rs7TEPA68CLwBPT1C/u8BHwLvAZ8CvU96HOgjp2mv3A68AzwP7JqzfXeAT4D3gU+C3Ke9bHa9r03p+eA54GngGmJ1A/ewAnwDfAu8Ba+P+QxMvL7Yv9c8A+4A54CwwO4H62QG+A34E1ib9x0eTkP8zWq3WuHkFmALOAq8A+yZ8wD5gDfgG+AlYn/Z+pAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQkKEkBAhJEQICRFCQoSQECEkRAgJEUJChJAQISRECAkRQuK/hPwL55b8e4P/lYMAAAAASUVORK5CYII=";

type ViewState = 'LANDING' | 'PROFILES' | 'APP';

export default function App() {
  const { currentUser, logout } = useAuth();
  
  // Auth Flow State
  const [authView, setAuthView] = useState<AuthViewType | null>(null);

  // App Main State
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  
  // Commercial/Plan State
  const [userPlan, setUserPlan] = useState<UserPlan>('FREE'); // Mocking plan state
  const [showPricing, setShowPricing] = useState(false);

  // App Data State
  const [rows, setRows] = useState<ProcessedRow[]>([]);
  const [errors, setErrors] = useState<ExcelError[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");

  // Configuration State
  const [profiles, setProfiles] = useState<ConfigProfile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string>("");
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG);
  const [mappings, setMappings] = useState<FieldMapping[]>(DEFAULT_MAPPINGS);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Profiles from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProfiles = JSON.parse(saved);
        if (parsedProfiles.length > 0) {
          setProfiles(parsedProfiles);
          // Load the first one by default for the app context, but stay on landing
          loadProfileData(parsedProfiles[0]);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved profiles", e);
      }
    }
    
    // Fallback: Create default profile
    const defaultProfile: ConfigProfile = {
      id: 'default',
      name: 'Padrão (MGR)',
      config: DEFAULT_CONFIG,
      mappings: DEFAULT_MAPPINGS
    };
    setProfiles([defaultProfile]);
    loadProfileData(defaultProfile);
  }, []);

  // Helper to load a specific profile into state
  const loadProfileData = (profile: ConfigProfile) => {
    setCurrentProfileId(profile.id);
    setConfig(profile.config);
    setMappings(profile.mappings);
  };

  const handleSelectProfileFromPage = (profile: ConfigProfile) => {
    loadProfileData(profile);
    setCurrentView('APP');
  };

  // Profile Actions
  const handleProfileChange = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      loadProfileData(profile);
    }
  };

  const handleSaveProfile = () => {
    const updatedProfiles = profiles.map(p => {
      if (p.id === currentProfileId) {
        return { ...p, config, mappings };
      }
      return p;
    });
    setProfiles(updatedProfiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
    alert("Perfil salvo com sucesso!");
  };

  const handleCreateProfile = (name: string) => {
    const limits = PLANS[userPlan];
    if (profiles.length >= limits.maxProfiles) {
        setShowPricing(true);
        return;
    }

    const newProfile: ConfigProfile = {
      id: Date.now().toString(),
      name,
      config,
      mappings
    };
    const newProfiles = [...profiles, newProfile];
    setProfiles(newProfiles);
    setCurrentProfileId(newProfile.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("Você precisa ter pelo menos um perfil.");
      return;
    }
    
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
    
    // If we deleted the current one, switch to the first available
    if (id === currentProfileId) {
      loadProfileData(newProfiles[0]);
    }
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const limits = PLANS[userPlan];
      let filesToProcess: File[] = Array.from(e.target.files);

      // LIMIT CHECK
      if (filesToProcess.length > limits.maxFilesPerBatch) {
        if (userPlan === 'FREE') {
            setShowPricing(true);
            // Cap the files for free users but warn them
            alert(`Plano Grátis limitado a ${limits.maxFilesPerBatch} arquivos. Processando apenas os primeiros ${limits.maxFilesPerBatch}.`);
            filesToProcess = filesToProcess.slice(0, limits.maxFilesPerBatch);
        }
      }

      // Convert back to FileList-like object or array for service
      // The service accepts FileList but we modified it to Array. 
      // We need to adjust service or just pass array. 
      // Let's modify service call to accept array, or cast it.
      // But wait, existing service takes FileList. Let's assume we pass the slice.
      
      const files = e.target.files;
      const path = files[0].webkitRelativePath;
      const extractedFolder = path ? path.split('/')[0] : "Desconhecida";
      setFolderName(extractedFolder);

      setStatus(AppStatus.PROCESSING);
      setErrors([]);
      setAnalysis(null);
      
      try {
        // Create a DataTransfer to create a new FileList for the subset
        const dt = new DataTransfer();
        filesToProcess.forEach(file => dt.items.add(file));
        
        const result = await processFiles(dt.files, config, mappings);
        setRows(result.rows);
        setErrors(result.errors);
        setStatus(AppStatus.COMPLETED);
      } catch (err) {
        console.error(err);
        setErrors([{ fileName: "Sistema", error: "Falha crítica ao processar arquivos." }]);
        setStatus(AppStatus.IDLE);
      }
    }
  };

  const handleAnalyze = async () => {
    const limits = PLANS[userPlan];
    if (!limits.allowAI) {
        setShowPricing(true);
        return;
    }

    if (rows.length === 0) return;
    
    setStatus(AppStatus.ANALYZING);
    try {
      const result = await analyzeData(rows, mappings);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Erro ao analisar dados.");
    } finally {
      setStatus(AppStatus.COMPLETED);
    }
  };

  // Mock Upgrade
  const handleUpgrade = () => {
      setUserPlan('PRO');
      setShowPricing(false);
      alert("Upgrade realizado com sucesso! (Modo Simulação)");
  };

  const getExportData = () => {
    const sortedMappings = [...mappings].sort((a, b) => a.colIndex - b.colIndex);
    const headers = ["Arquivo", ...sortedMappings.map(m => m.fieldName), "ID Reg", "Ordem"];
    
    const dataRows = rows.map(r => {
      const dataCols = sortedMappings.map(m => r.data[m.colIndex] ?? "");
      return [r.fileName, ...dataCols, r.regId, r.order];
    });

    return { headers, dataRows };
  };

  const handleExportCSV = () => {
     const { headers, dataRows } = getExportData();
     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...dataRows.map(r => r.join(","))].join("\n");
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     const exportName = folderName ? `RESUMO_${folderName}.csv` : `resumo_${config.sheetName}.csv`;
     link.setAttribute("download", exportName);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const handleExportExcel = async () => {
    const { headers, dataRows } = getExportData();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumo');

    const logoId = workbook.addImage({
      base64: APP_LOGO_BASE64,
      extension: 'png',
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 60, height: 60 }
    });

    const titleRowIndex = 2;
    const endColIndex = headers.length; 
    
    worksheet.mergeCells(titleRowIndex, 3, titleRowIndex, endColIndex);
    const titleCell = worksheet.getCell(titleRowIndex, 3);
    
    const titleText = folderName ? `RESUMO: ${folderName.toUpperCase()}` : `RESUMO: ${config.sheetName.toUpperCase()}`;
    titleCell.value = titleText;
    
    titleCell.font = {
      name: 'Arial',
      family: 2,
      size: 20,
      bold: true,
      color: { argb: 'FF1F4E78' } 
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells(titleRowIndex + 1, 3, titleRowIndex + 1, endColIndex);
    const dateCell = worksheet.getCell(titleRowIndex + 1, 3);
    dateCell.value = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
    dateCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF666666' } };

    const headerRowIdx = 5;
    const headerRow = worksheet.getRow(headerRowIdx);
    headerRow.values = headers;

    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' } 
      };
      cell.font = {
        name: 'Arial',
        color: { argb: 'FFFFFFFF' }, 
        bold: true
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 24;

    dataRows.forEach((rowData, idx) => {
      const currentRowIdx = headerRowIdx + 1 + idx;
      const row = worksheet.getRow(currentRowIdx);
      row.values = rowData;

      row.eachCell((cell, colNumber) => {
        if (idx % 2 === 1) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F2F2' } 
            };
        }
        
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        };

        if (colNumber === 1) {
            cell.alignment = { horizontal: 'left' };
        } else {
            cell.alignment = { horizontal: 'center' };
        }
        
        cell.font = { name: 'Arial', size: 11 };
      });
    });

    worksheet.autoFilter = {
      from: { row: headerRowIdx, column: 1 },
      to: { row: headerRowIdx + dataRows.length, column: headers.length }
    };

    headers.forEach((header, i) => {
        let maxLen = header.length;
        dataRows.forEach(row => {
            const val = row[i] ? String(row[i]) : "";
            if (val.length > maxLen) {
                maxLen = val.length;
            }
        });
        worksheet.getColumn(i + 1).width = maxLen + 4;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const exportName = folderName ? `RESUMO_${folderName}.xlsx` : `resumo_${config.sheetName}.xlsx`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = exportName;
    link.click();
  };

  const handleExportPDF = () => {
    const { headers, dataRows } = getExportData();
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    const title = folderName ? `RESUMO - ${folderName.toUpperCase()}` : `Resumo: ${config.sheetName}`;
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    doc.autoTable({
      head: [headers],
      body: dataRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] } // Blue-500
    });

    if (analysis) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text("Análise da IA", 14, 15);
        doc.setFontSize(10);
        
        const splitText = doc.splitTextToSize(analysis.replace(/\*\*/g, ''), 180);
        doc.text(splitText, 14, 25);
    }
    
    const exportName = folderName ? `RESUMO_${folderName}.pdf` : `resumo_${config.sheetName}.pdf`;
    doc.save(exportName);
  };

  // --- AUTHENTICATION & INTRO LOGIC ---
  if (!currentUser) {
    if (authView) {
        return (
            <>
                <AuthPage 
                    initialView={authView} 
                    onBack={() => setAuthView(null)} 
                />
                <Footer />
            </>
        );
    }
    return (
        <>
            <IntroPage 
                onLogin={() => setAuthView('LOGIN')} 
                onRegister={() => setAuthView('REGISTER')} 
            />
            <Footer />
        </>
    );
  }

  // --- MAIN APP RENDER ---

  // Render Logic based on ViewState
  if (currentView === 'LANDING') {
    return (
      <div className="flex flex-col min-h-screen">
          <LandingPage 
            onStart={() => setCurrentView('APP')} 
            onOpenSavedProfiles={() => setCurrentView('PROFILES')}
          />
          <Footer />
      </div>
    );
  }

  if (currentView === 'PROFILES') {
    return (
      <div className="flex flex-col min-h-screen">
        <SavedProfilesPage 
            profiles={profiles}
            onSelectProfile={handleSelectProfileFromPage}
            onBack={() => setCurrentView('LANDING')}
            onDeleteProfile={handleDeleteProfile}
        />
        <Footer />
      </div>
    );
  }

  // MAIN APP DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        onUpgrade={handleUpgrade}
      />

      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
                <button 
                onClick={() => setCurrentView('LANDING')}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                title="Voltar ao Início"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-800">Excel Summarizer</h1>
                        {userPlan === 'FREE' ? (
                            <span 
                                onClick={() => setShowPricing(true)}
                                className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded cursor-pointer hover:bg-slate-300 font-bold"
                            >
                                GRÁTIS
                            </span>
                        ) : (
                            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                <Crown className="w-3 h-3" /> PRO
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm">
                        {folderName ? `Pasta: ${folderName}` : 'Painel de extração e análise'}
                    </p>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                {/* User Profile / Logout */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 max-w-[150px] truncate">{currentUser.email}</span>
                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                    <button 
                        onClick={logout}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 px-4 py-2 rounded shadow text-white font-medium transition-all ${
                        status === AppStatus.PROCESSING ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={status === AppStatus.PROCESSING}
                    >
                    {status === AppStatus.PROCESSING ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <FolderOpen className="w-5 h-5" />
                    )}
                    {status === AppStatus.PROCESSING ? 'Processando...' : 'Selecionar Pasta'}
                    </button>
                    
                    <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    {...({ webkitdirectory: "" } as any)} 
                    multiple 
                    onChange={handleFolderSelect} 
                    />

                    {rows.length > 0 && (
                        <div className="flex bg-white rounded shadow-sm border border-slate-300 ml-2">
                            <button
                                onClick={handleExportCSV}
                                className="px-3 py-2 text-slate-600 hover:bg-slate-50 border-r border-slate-200 flex items-center gap-1 text-sm font-medium"
                                title="Exportar CSV"
                            >
                                <Download className="w-4 h-4" /> CSV
                            </button>
                            <button
                                onClick={handleExportExcel}
                                className="px-3 py-2 text-green-700 hover:bg-green-50 border-r border-slate-200 flex items-center gap-1 text-sm font-medium"
                                title="Exportar Excel"
                            >
                                <FileSpreadsheet className="w-4 h-4" /> Excel
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-1 text-sm font-medium"
                                title="Exportar PDF"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </header>

            {/* Errors Banner */}
            {errors.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-sm">
                    <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        Avisos ({errors.length})
                    </div>
                    <div className="max-h-20 overflow-y-auto text-sm text-amber-800 space-y-1 pr-2 custom-scrollbar">
                        {errors.map((e, i) => (
                            <div key={i}><span className="font-semibold">{e.fileName}:</span> {e.error}</div>
                        ))}
                    </div>
                </div>
            )}

            <ConfigPanel 
            config={config} 
            setConfig={setConfig} 
            mappings={mappings} 
            setMappings={setMappings}
            profiles={profiles}
            currentProfileId={currentProfileId}
            onProfileChange={handleProfileChange}
            onSaveProfile={handleSaveProfile}
            onCreateProfile={handleCreateProfile}
            onDeleteProfile={handleDeleteProfile}
            />

            <ResultsTable rows={rows} mappings={mappings} />

            {/* AI Analysis Section */}
            {rows.length > 0 && (
            <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6 shadow-sm relative overflow-hidden ${userPlan === 'FREE' ? 'opacity-90' : ''}`}>
                
                {/* Free Plan Lock Overlay */}
                {userPlan === 'FREE' && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-6">
                        <div className="bg-white p-3 rounded-full shadow-lg mb-3">
                            <Lock className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Análise de IA Bloqueada</h3>
                        <p className="text-slate-600 max-w-md mb-4">
                            Faça o upgrade para o plano PRO para desbloquear a inteligência artificial do Gemini 2.5 e analisar seus dados automaticamente.
                        </p>
                        <button 
                            onClick={() => setShowPricing(true)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                            Liberar Acesso Agora
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-indigo-800 font-bold text-lg">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        Análise da IA
                    </div>
                    <button 
                    onClick={handleAnalyze}
                    disabled={status === AppStatus.ANALYZING || userPlan === 'FREE'}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                    {status === AppStatus.ANALYZING ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4" />}
                    Gerar Análise
                    </button>
                </div>
                
                {analysis ? (
                    <div className="prose prose-sm prose-indigo max-w-none bg-white p-4 rounded border border-indigo-100 shadow-inner">
                        <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                ) : (
                    <p className="text-indigo-400 text-sm italic">
                        Clique em "Gerar Análise" para que o Gemini processe os dados extraídos em busca de tendências, valores discrepantes e registros faltantes.
                    </p>
                )}
            </div>
            )}

        </div>
      </div>
      
      <Footer />
    </div>
  );
}