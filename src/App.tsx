import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import BotChat from './components/BotChat';
import NavBar from './components/NavBar';
import { BotPersona, CodeFile, Language, Message, DEFAULT_FILES, SNIPPETS, SUPPORTED_LANGUAGES } from './types';
import { WifiOff, X, Key, ExternalLink, Save, CodeXml, Copy, Check, Mail, FilePlus, AlertCircle } from 'lucide-react';
import { analyzeCode, simulateExecution } from './services/geminiService';
import { APP_SOURCE_CODE } from './appSource';

declare global {
  interface Window {
    JSZip: any;
    saveAs: any;
  }
}

const App: React.FC = () => {
  // --- State: Files & Environment ---
  
  const [files, setFiles] = useState<CodeFile[]>(() => {
    const saved = localStorage.getItem('nexus_files');
    return saved ? JSON.parse(saved) : DEFAULT_FILES;
  });

  const [activeFileId, setActiveFileId] = useState<string>(() => {
    return localStorage.getItem('nexus_active_file_id') || files[0].id;
  });

  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'ai'>('editor');
  const [activeBot, setActiveBot] = useState<BotPersona>(BotPersona.CODER);
  
  // Settings & API Key
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('nexus_api_key') || '';
  });
  const [noKeyMode, setNoKeyMode] = useState(false);

  // Modals
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState<Language>('JavaScript');
  const [fileNameError, setFileNameError] = useState('');
  
  // Source Viewer State
  const [showSourceViewer, setShowSourceViewer] = useState(false);
  const [sourceViewerFile, setSourceViewerFile] = useState<string>('src/App.tsx');
  const [sourceViewerCopied, setSourceViewerCopied] = useState(false);

  // Console/Output State
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [chatHistory, setChatHistory] = useState<Record<BotPersona, Message[]>>({
    [BotPersona.CODER]: [],
    [BotPersona.TEACHER]: [],
    [BotPersona.COMPANION]: []
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('nexus_files', JSON.stringify(files));
    localStorage.setItem('nexus_active_file_id', activeFileId);
  }, [files, activeFileId]);

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('nexus_api_key', newKey);
    alert("Clé API sauvegardée !");
    setShowSettings(false);
  };

  const getEffectiveApiKey = () => {
    return apiKey || process.env.API_KEY || '';
  };

  // --- File Management Actions ---

  const handleUpdateFile = (id: string, newContent: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content: newContent } : f));
  };

  const detectLanguageFromExtension = (filename: string): Language | null => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.py')) return 'Python';
    if (lower.endsWith('.c')) return 'C';
    if (lower.endsWith('.cpp') || lower.endsWith('.cc')) return 'C++';
    if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'HTML';
    if (lower.endsWith('.css')) return 'CSS';
    if (lower.endsWith('.java')) return 'Java';
    if (lower.endsWith('.jsx') || lower.endsWith('.tsx')) return 'React';
    if (lower.endsWith('.js') || lower.endsWith('.ts')) return 'JavaScript';
    return null;
  };

  const validateFileName = (name: string): boolean => {
    if (!name.trim()) {
      setFileNameError("Le nom du fichier ne doit pas être vide.");
      return false;
    }
    // Whitelist: Alphanumeric, dot, underscore, hyphen.
    const isValidChar = /^[a-zA-Z0-9._-]+$/.test(name);
    if (!isValidChar) {
      setFileNameError("Caractères autorisés : lettres, chiffres, '.', '-', '_'");
      return false;
    }
    
    // Check for uniqueness
    if (files.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      setFileNameError("Un fichier avec ce nom existe déjà.");
      return false;
    }

    return true;
  };

  const handleCreateFile = () => {
    setFileNameError('');
    if (!validateFileName(newFileName)) return;

    const newId = Date.now().toString();
    const lang = newFileLanguage;

    const newFile: CodeFile = {
      id: newId,
      name: newFileName,
      language: lang,
      content: SNIPPETS[lang] || ''
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
    setNewFileName('');
    setNewFileLanguage('JavaScript');
    setShowNewFileModal(false);
  };

  const handleDeleteFile = (id: string) => {
    if (files.length <= 1) return alert("Vous devez garder au moins un fichier.");
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) setActiveFileId(newFiles[0].id);
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const detectedLang = detectLanguageFromExtension(newName);
        return { 
          ...f, 
          name: newName,
          language: detectedLang || f.language 
        };
      }
      return f;
    }));
  };

  const handleLanguageChange = (id: string, newLang: Language) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const useSnippet = f.content.length < 50; 
        return { 
          ...f, 
          language: newLang, 
          content: useSnippet ? (SNIPPETS[newLang] || '') : f.content
        };
      }
      return f;
    }));
  };

  const handleDownloadFile = async () => {
    const choice = window.prompt(
      "Options d'exportation:\n1. Télécharger le fichier actuel\n2. Exporter tout le projet (ZIP)\n3. Télécharger le Code Source de l'App (CodeNexus)\n\nEntrez 1, 2 ou 3:"
    );

    if (choice === '1') {
      const file = getActiveFile();
      if (!file) return;
      const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
      if (window.saveAs) {
        window.saveAs(blob, file.name);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } 
    else if (choice === '2') {
      if (!window.JSZip) return alert("Erreur: Librairie JSZip non chargée.");
      const zip = new window.JSZip();
      
      files.forEach(f => {
        zip.file(f.name, f.content);
      });

      const content = await zip.generateAsync({type:"blob"});
      if (window.saveAs) {
        window.saveAs(content, "MonProjetNexus.zip");
      } else {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "MonProjetNexus.zip";
        document.body.appendChild(a);
        a.click();
      }
    }
    else if (choice === '3') {
      if (!window.JSZip) return alert("Erreur: Librairie JSZip non chargée.");
      const zip = new window.JSZip();
      
      const srcFolder = zip.folder("CodeNexus_Source");
      
      Object.entries(APP_SOURCE_CODE).forEach(([path, content]) => {
         srcFolder.file(path, content);
      });

      const content = await zip.generateAsync({type:"blob"});
      if (window.saveAs) {
        window.saveAs(content, "CodeNexus_App_Source.zip");
      } else {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "CodeNexus_App_Source.zip";
        document.body.appendChild(a);
        a.click();
      }
    }
  };

  const handleCopySource = () => {
    const content = APP_SOURCE_CODE[sourceViewerFile];
    navigator.clipboard.writeText(content);
    setSourceViewerCopied(true);
    setTimeout(() => setSourceViewerCopied(false), 2000);
  };

  // --- Execution & AI Logic ---

  const getActiveFile = () => files.find(f => f.id === activeFileId);

  const offlineLinter = (code: string, lang: Language): string => {
    const lines = code.split('\n');
    let errors: string[] = [];
    
    if (!code.trim()) return "Erreur: Le fichier est vide.";

    if (lang === 'Python') {
      lines.forEach((line, i) => {
        const l = line.trim();
        if ((l.startsWith('def ') || l.startsWith('if ') || l.startsWith('for ') || l.startsWith('while ')) && !l.endsWith(':')) {
          errors.push(`Ligne ${i+1}: Syntaxe invalide. Il manque un ':' à la fin de l'instruction.`);
        }
      });
    } 
    else if (['C', 'C++', 'Java', 'JavaScript'].includes(lang)) {
       let openBraces = 0;
       lines.forEach((line, i) => {
         openBraces += (line.match(/{/g) || []).length;
         openBraces -= (line.match(/}/g) || []).length;
         
         const l = line.trim();
         if (l.length > 0 && !l.endsWith(';') && !l.endsWith('{') && !l.endsWith('}') && !l.startsWith('//') && !l.startsWith('#')) {
             if(lang !== 'JavaScript' || (l !== 'export default function App()' && !l.startsWith('class'))) {
             }
         }
       });
       if (openBraces !== 0) errors.push(`Erreur: Accolades {} déséquilibrées (Diff: ${openBraces}).`);
    }
    else if (lang === 'HTML') {
      const openDivs = (code.match(/<div/g) || []).length;
      const closeDivs = (code.match(/<\/div>/g) || []).length;
      if(openDivs !== closeDivs) errors.push(`Attention: Nombre de <div> (${openDivs}) et </div> (${closeDivs}) ne correspond pas.`);
    }

    if (errors.length === 0) return "✅ Aucune erreur de syntaxe évidente détectée.";
    return "⚠️ Problèmes détectés :\n" + errors.join('\n');
  };

  const handleRun = async () => {
    const file = getActiveFile();
    if (!file) return;

    setConsoleOutput(""); 
    setIsRunning(true);

    try {
      if (file.language === 'HTML') {
        const cssFiles = files.filter(f => f.language === 'CSS');
        const jsFiles = files.filter(f => f.language === 'JavaScript' && f.id !== file.id);

        let htmlContent = file.content;
        const styleBlock = cssFiles.map(c => `<style>/* ${c.name} */\n${c.content}</style>`).join('\n');
        htmlContent = htmlContent.replace('</head>', `${styleBlock}\n</head>`);
        if (!htmlContent.includes('</head>')) htmlContent = `${styleBlock}\n${htmlContent}`;

        const scriptBlock = jsFiles.map(j => `<script>/* ${j.name} */\n${j.content}</script>`).join('\n');
        htmlContent = htmlContent.replace('</body>', `${scriptBlock}\n</body>`);
        if (!htmlContent.includes('</body>')) htmlContent += `\n${scriptBlock}`;

        setConsoleOutput(htmlContent);
      } 
      else if (file.language === 'JavaScript') {
        const logCapture = `
          <script>
            const oldLog = console.log;
            const logs = [];
            console.log = (...args) => {
               logs.push(args.join(' '));
               document.body.innerText = logs.join('\\n');
               oldLog.apply(console, args);
            };
            window.onerror = function(message, source, lineno, colno, error) {
               document.body.innerText += '\\n🛑 Error: ' + message;
            };
            try {
              ${file.content}
            } catch(e) {
              document.body.innerText += '\\n🛑 Exception: ' + e.message;
            }
          </script>
        `;
        setConsoleOutput(logCapture);
      }
      else {
        if (isOnlineMode) {
          const key = getEffectiveApiKey();
          if (!key) {
             setConsoleOutput("Erreur: Clé API manquante. Veuillez l'ajouter dans les Paramètres.");
             setIsRunning(false);
             setShowSettings(true);
             return;
          }
          const output = await simulateExecution(key, files, file.id);
          setConsoleOutput(output);
        } else {
          const fakeBuild = `
[NexusCompiler 1.0.0] Target: ${file.language}
> Analysing dependencies... OK
> Checking syntax for ${file.name}... OK
> Compiling objects...
> Linking...

Build Successful! (0.4s)
--------------------------------------------------
[SYSTEM] Note: Ceci est une simulation hors ligne.
Le code n'a pas été réellement exécuté sur le processeur du mobile.
Activez le mode Online pour une exécution cloud réelle.
          `;
          setConsoleOutput(fakeBuild);
        }
      }
    } catch (e) {
      setConsoleOutput(`Error: ${e}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDebug = async () => {
    const file = getActiveFile();
    if (!file) return;
    setIsRunning(true);
    setConsoleOutput("Analyse en cours...");

    if (isOnlineMode) {
      const key = getEffectiveApiKey();
      if (!key) {
         setConsoleOutput("Erreur: Clé API manquante. Allez dans Paramètres.");
         setIsRunning(false);
         setShowSettings(true);
         return;
      }
      const result = await analyzeCode(key, file.content, file.language, 'debug');
      setConsoleOutput(`[RAPPORT DE DEBUG IA]\n\n${result}`);
    } else {
      setTimeout(() => {
        const analysis = offlineLinter(file.content, file.language);
        setConsoleOutput(`[OFFLINE DEBUGGER]\nFichier: ${file.name}\nLangage: ${file.language}\n-------------------\n\n${analysis}`);
        setIsRunning(false);
      }, 800);
      return;
    }
    setIsRunning(false);
  };

  const handleImprove = async () => {
    if (!isOnlineMode) return alert("Disponible uniquement en mode Online.");
    const file = getActiveFile();
    if (!file) return;

    const key = getEffectiveApiKey();
    if (!key) {
       setShowSettings(true);
       return;
    }

    setIsRunning(true);
    setConsoleOutput("Génération des suggestions...");
    const result = await analyzeCode(key, file.content, file.language, 'improve');
    setConsoleOutput(`[SUGGESTIONS D'AMÉLIORATION]\n\n${result}`);
    setIsRunning(false);
  };

  const toggleOnlineMode = () => {
    if (isOnlineMode) {
      setIsOnlineMode(false);
    } else {
      if (navigator.onLine) {
        if (!getEffectiveApiKey()) {
          const confirm = window.confirm("Aucune clé API détectée. Le mode Online nécessite une clé API Gemini. Voulez-vous la configurer maintenant ?");
          if (confirm) setShowSettings(true);
          setIsOnlineMode(true); 
        } else {
          setIsOnlineMode(true);
        }
      } else {
        alert("Pas de connexion Internet. Impossible d'activer le mode Online.");
        setIsOnlineMode(false);
      }
    }
  };

  useEffect(() => {
    const handleOffline = () => setIsOnlineMode(false);
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  useEffect(() => {
    if (!isOnlineMode && activeTab === 'ai') setActiveTab('editor');
  }, [isOnlineMode, activeTab]);

  const activeFile = getActiveFile();

  return (
    <div className="flex flex-col h-screen w-screen bg-nexus-darker overflow-hidden font-sans">
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'editor' ? (
          <CodeEditor 
            files={files}
            activeFileId={activeFileId}
            onUpdateFile={handleUpdateFile}
            onAddFile={() => {
              setFileNameError('');
              setNewFileName('');
              setNewFileLanguage('JavaScript');
              setShowNewFileModal(true);
            }}
            onDeleteFile={handleDeleteFile}
            onSwitchFile={setActiveFileId}
            onRenameFile={handleRenameFile}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onDebug={handleDebug}
            onImprove={handleImprove}
            onDownload={handleDownloadFile}
            onViewSource={() => setShowSourceViewer(true)}
            isOnline={isOnlineMode}
            consoleOutput={consoleOutput}
            setConsoleOutput={setConsoleOutput}
            isRunning={isRunning}
          />
        ) : (
          <BotChat 
            activeBot={activeBot}
            setActiveBot={setActiveBot}
            code={activeFile ? activeFile.content : ''}
            language={activeFile ? activeFile.language : 'Python'}
            chatHistory={chatHistory}
            updateHistory={(bot, msgs) => setChatHistory(prev => ({ ...prev, [bot]: msgs }))}
            apiKey={getEffectiveApiKey()}
          />
        )}

        {!isOnlineMode && activeTab === 'ai' && (
          <div className="absolute inset-0 bg-nexus-darker/90 backdrop-blur-sm flex flex-col items-center justify-center z-40 text-center p-6">
            <WifiOff size={64} className="text-nexus-muted mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Mode Hors Ligne</h2>
            <button onClick={() => setActiveTab('editor')} className="mt-6 px-6 py-2 bg-nexus-accent text-white rounded-full">
              Retour à l'éditeur
            </button>
          </div>
        )}

        {/* New File Modal */}
        {showNewFileModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-nexus-dark border border-gray-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
              <button 
                onClick={() => setShowNewFileModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-2 mb-4 text-nexus-accent">
                <FilePlus size={24} />
                <h3 className="text-lg font-bold">Nouveau Fichier</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-mono text-gray-500 mb-1">NOM DU FICHIER</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Ex: jeu.html"
                  value={newFileName}
                  onChange={(e) => {
                    setNewFileName(e.target.value);
                    setFileNameError('');
                    const detected = detectLanguageFromExtension(e.target.value);
                    if (detected) setNewFileLanguage(detected);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                  className={`w-full bg-gray-900 border ${fileNameError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-nexus-accent'} text-white rounded px-4 py-3 outline-none transition-colors`}
                />
              </div>

              <div className="mb-6">
                 <label className="block text-xs font-mono text-gray-500 mb-1">LANGAGE</label>
                 <select 
                    value={newFileLanguage}
                    onChange={(e) => setNewFileLanguage(e.target.value as Language)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 outline-none focus:border-nexus-accent"
                 >
                   {SUPPORTED_LANGUAGES.map(lang => (
                     <option key={lang} value={lang}>{lang}</option>
                   ))}
                 </select>
              </div>

              {fileNameError && (
                <div className="flex items-center gap-2 text-red-400 text-xs mb-4 animate-in slide-in-from-left-2">
                  <AlertCircle size={12} />
                  <span>{fileNameError}</span>
                </div>
              )}

              <button 
                onClick={handleCreateFile}
                disabled={!newFileName.trim()}
                className="w-full bg-nexus-accent text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Créer le fichier
              </button>
            </div>
          </div>
        )}

        {/* Source Code Viewer Modal */}
        {showSourceViewer && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-nexus-dark border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <CodeXml className="text-nexus-accent" size={20} />
                  <h3 className="font-bold text-white">Code Source de l'App (Quine)</h3>
                </div>
                <button onClick={() => setShowSourceViewer(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* File Sidebar */}
                <div className="w-1/3 bg-nexus-darker border-r border-gray-800 overflow-y-auto">
                   {Object.keys(APP_SOURCE_CODE).sort().map(fileName => (
                     <button
                       key={fileName}
                       onClick={() => setSourceViewerFile(fileName)}
                       className={`w-full text-left px-4 py-3 text-xs font-mono border-b border-gray-800/50 hover:bg-gray-800 transition-colors ${sourceViewerFile === fileName ? 'bg-nexus-accent/20 text-nexus-accent border-l-2 border-l-nexus-accent' : 'text-gray-400'}`}
                     >
                       {fileName}
                     </button>
                   ))}
                </div>

                {/* Code View */}
                <div className="flex-1 flex flex-col bg-nexus-dark relative">
                   <div className="absolute top-2 right-2 z-10">
                     <button 
                       onClick={handleCopySource} 
                       className="bg-gray-800 p-2 rounded text-white hover:bg-gray-700 border border-gray-600 shadow-lg"
                       title="Copier le code"
                     >
                       {sourceViewerCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                     </button>
                   </div>
                   <div className="flex-1 overflow-auto p-4">
                     <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-all">
                       {APP_SOURCE_CODE[sourceViewerFile]}
                     </pre>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-nexus-dark border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-2 mb-6 text-nexus-accent">
                <Key size={24} />
                <h2 className="text-xl font-bold">Clé API Gemini</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Pour utiliser les fonctionnalités IA (Chat, Debug Intelligent), vous devez fournir une clé API Google Gemini.
                La clé est stockée localement sur votre appareil.
              </p>

              <label className="block text-xs font-mono text-gray-500 mb-2">VOTRE CLÉ API</label>
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 mb-2 focus:border-nexus-accent outline-none"
              />

              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="noKeyCheckbox"
                  checked={noKeyMode}
                  onChange={(e) => setNoKeyMode(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-nexus-accent focus:ring-nexus-accent"
                />
                <label htmlFor="noKeyCheckbox" className="text-sm text-gray-400 select-none cursor-pointer">
                  Je n'ai pas de clé API Gemini
                </label>
              </div>

              {noKeyMode && (
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-white mb-3 text-center">
                    Vous n'avez pas de clé API Gemini, créez en une ou obtenez en une gratuitement
                  </p>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/50 py-2 rounded-lg hover:bg-nexus-accent/30 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={14} /> Créer une clé API Gemini
                    </a>
                    <a 
                      href="mailto:dominiquevalerywilfried@gmail.com?subject=Requête%20Clé%20API%20CodeNexus&body=Envoyé%20votre%20requête"
                      className="flex items-center justify-center gap-2 bg-gray-700 text-white border border-gray-600 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <Mail size={14} /> Obtenir une clé API
                    </a>
                  </div>
                </div>
              )}

              <button 
                onClick={() => handleSaveApiKey(apiKey)}
                className="w-full bg-nexus-success text-nexus-darker font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors mt-2"
              >
                <Save size={18} />
                Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>

      <NavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOnlineMode={isOnlineMode} 
        toggleOnlineMode={toggleOnlineMode}
        activeBot={activeBot}
        onOpenSettings={() => setShowSettings(true)}
      />
    </div>
  );
};

export default App;