
export const APP_SOURCE_CODE: Record<string, string> = {
  'package.json': `{
  "name": "codenexus-mobile",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0",
    "@google/genai": "^1.30.0",
    "prismjs": "^1.29.0",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@types/prismjs": "^1.26.3",
    "@types/file-saver": "^2.0.7",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "unusedLocals": false,
    "unusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: '#0f172a',
          darker: '#020617',
          accent: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          text: '#e2e8f0',
          muted: '#64748b'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      }
    },
  },
  plugins: [],
}`,

  'public/manifest.json': `{
  "name": "CodeNexus Mobile",
  "short_name": "CodeNexus",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#020617",
  "icons": [
    {
      "src": "https://cdn.lucide.dev/icon/terminal-square.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`,

  'index.html': `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>CodeNexus Mobile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              nexus: {
                dark: '#0f172a',
                darker: '#020617',
                accent: '#3b82f6',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#e2e8f0',
                muted: '#64748b'
              }
            },
            fontFamily: {
              mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
            }
          }
        }
      }
    </script>
    
    <!-- PWA Manifest Link -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#020617" />

    <!-- PrismJS Theme (Tomorrow Night for Dark Mode) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />

    <!-- JSZip for Exporting Projects -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <!-- FileSaver for easier mobile downloads -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

    <style>
      /* Hide scrollbar for Chrome, Safari and Opera */
      .no-scrollbar::-webkit-scrollbar {
          display: none;
      }
      /* Hide scrollbar for IE, Edge and Firefox */
      .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
      }
      
      /* Editor specific overrides to ensure perfect alignment */
      code[class*="language-"],
      pre[class*="language-"] {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        font-size: 0.875rem !important; /* text-sm */
        line-height: 1.5rem !important; /* leading-6 */
        background: transparent !important;
        text-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      /* Ensure text wrapping is consistent */
      .editor-font {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.875rem; /* text-sm */
        line-height: 1.5rem; /* leading-6 */
        letter-spacing: normal;
        tab-size: 2;
      }
    </style>
  </head>
  <body class="bg-nexus-darker text-nexus-text overflow-hidden h-screen w-screen selection:bg-nexus-accent selection:text-white">
    <div id="root"></div>

    <!-- PrismJS Core and Languages -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-cpp.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js"></script> <!-- HTML -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js"></script>
  </body>
</html>`,

  'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

  'src/types.ts': `export type Language = 'Python' | 'C' | 'HTML' | 'JavaScript' | 'Java' | 'React' | 'C++' | 'CSS';

export enum BotPersona {
  CODER = 'coder',
  TEACHER = 'teacher',
  COMPANION = 'companion'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  persona: BotPersona;
  messages: Message[];
}

export interface CodeFile {
  id: string;
  name: string;
  language: Language;
  content: string;
}

export interface AppState {
  files: CodeFile[];
  activeFileId: string;
  isOnlineMode: boolean;
  activeTab: 'editor' | 'ai';
  activeBot: BotPersona;
}

export const SUPPORTED_LANGUAGES: Language[] = ['Python', 'C', 'HTML', 'JavaScript', 'Java', 'React', 'C++', 'CSS'];

export const DEFAULT_FILES: CodeFile[] = [
  {
    id: '1',
    name: 'main.py',
    language: 'Python',
    content: 'def hello_world():\\n    print("Bonjour le monde!")\\n\\nif __name__ == "__main__":\\n    hello_world()'
  }
];

export const SNIPPETS: Record<Language, string> = {
  'Python': 'print("Hello World")',
  'C': '#include <stdio.h>\\nint main() { printf("Hello"); return 0; }',
  'HTML': '<h1>Hello</h1>',
  'JavaScript': 'console.log("Hello")',
  'Java': 'class Main { public static void main(String[] a) { System.out.println("Hi"); } }',
  'React': 'export default function App() { return <h1>Hi</h1> }',
  'C++': '#include <iostream>\\nint main() { std::cout << "Hello"; return 0; }',
  'CSS': 'body { background: #f0f0f0; }'
};`,

  'src/services/geminiService.ts': `import { GoogleGenAI, Content, Part } from "@google/genai";
import { BotPersona, Message, Language, CodeFile } from "../types";

// --- Chat Helpers ---

const getSystemInstruction = (persona: BotPersona, language: Language): string => {
  const baseInstruction = \`Tu es un assistant IA intégré dans une application mobile d'édition de code. L'utilisateur programme actuellement en \${language}. Réponds toujours en Français.\`;

  switch (persona) {
    case BotPersona.CODER:
      return \`\${baseInstruction} Tu es 'Nexus Architect'. Tu es un expert en ingénierie logicielle senior. 
      Ton but est d'aider à écrire, déboguer, refactoriser et optimiser le code. 
      Sois précis, technique et fournis des solutions de code complètes. 
      Utilise le modèle gemini-3-pro-preview pour des raisonnements complexes.\`;
    
    case BotPersona.TEACHER:
      return \`\${baseInstruction} Tu es 'Nexus Mentor'. Tu es un professeur de programmation patient et pédagogue. 
      N'écris pas juste la solution, explique le "pourquoi" et le "comment". 
      Guide l'utilisateur vers la solution. Pose des questions pour vérifier la compréhension.\`;

    case BotPersona.COMPANION:
      return \`\${baseInstruction} Tu es 'Nexus Spark'. Tu es un passionné de science, de technologie, de robotique et de futurisme. 
      Tu aimes discuter des dernières avancées tech, de théories scientifiques, et de l'éthique de l'IA. 
      Adopte un ton curieux, amical et inspirant.\`;
    
    default:
      return baseInstruction;
  }
};

const getModelName = (persona: BotPersona): string => {
  if (persona === BotPersona.CODER) {
    return 'gemini-3-pro-preview'; 
  }
  return 'gemini-2.5-flash';
};

export const generateBotResponse = async (
  apiKey: string,
  persona: BotPersona,
  currentCode: string,
  currentLanguage: Language,
  chatHistory: Message[],
  userMessage: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key manquante");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = getModelName(persona);
  
  const historyContents: Content[] = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }] as Part[]
  }));

  const systemInstruction = getSystemInstruction(persona, currentLanguage);

  const contextPrompt = \`
  [CONTEXTE DU FICHIER ACTUEL (\${currentLanguage})]:
  \`\`\`\${currentLanguage}
  \${currentCode}
  \`\`\`
  
  [MESSAGE UTILISATEUR]:
  \${userMessage}
  \`;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: { systemInstruction },
      history: historyContents
    });

    const response = await chat.sendMessage({ message: contextPrompt });
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur de connexion à l'IA.";
  }
};

// --- Tool Helpers (Debug, Improve, Run) ---

export const analyzeCode = async (
  apiKey: string,
  code: string,
  language: Language,
  action: 'debug' | 'improve'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  let prompt = "";
  if (action === 'debug') {
    prompt = \`Analyse ce code \${language} et trouve les erreurs potentielles (syntaxe, logique, sécurité). 
    Si tout semble correct, dis-le. Sinon, liste les problèmes et propose la version corrigée. 
    Sois concis.\`;
  } else {
    prompt = \`Agis comme un expert senior. Refactorise ce code \${language} pour le rendre :
    1. Plus lisible (Clean Code)
    2. Plus performant
    3. Plus "joli" (idiomatique)
    Explique brièvement tes changements.\`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Code:\\n\`\`\`\${language}\\n\${code}\\n\`\`\`\\n\\nInstruction: \${prompt}\`
  });

  return response.text || "Aucune suggestion disponible.";
};

export const simulateExecution = async (
  apiKey: string,
  files: CodeFile[],
  mainFileId: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const mainFile = files.find(f => f.id === mainFileId);
  if (!mainFile) return "Fichier introuvable.";

  // Context of all files for compilation
  const projectContext = files.map(f => \`Filename: \${f.name}\\nContent:\\n\${f.content}\`).join('\\n---\\n');

  const prompt = \`
  Agis comme un compilateur et un environnement d'exécution pour \${mainFile.language}.
  Voici les fichiers du projet :
  \${projectContext}

  Tâche: 
  1. Compile (simulé) le fichier principal: \${mainFile.name}.
  2. S'il y a des erreurs de compilation, affiche-les comme un log de terminal.
  3. Sinon, exécute le code et donne-moi UNIQUEMENT la sortie console (stdout/stderr).
  
  N'explique pas le code, donne juste le résultat de l'exécution comme si c'était un terminal.
  \`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Pas de sortie.";
};`,

  'src/components/NavBar.tsx': `import React from 'react';
import { Terminal, Bot, Settings, Wifi, WifiOff } from 'lucide-react';
import { BotPersona } from '../types';

interface NavBarProps {
  activeTab: 'editor' | 'ai';
  setActiveTab: (tab: 'editor' | 'ai') => void;
  isOnlineMode: boolean;
  toggleOnlineMode: () => void;
  activeBot: BotPersona;
  onOpenSettings: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOnlineMode, 
  toggleOnlineMode,
  onOpenSettings
}) => {
  return (
    <nav className="h-16 bg-nexus-darker border-t border-gray-800 flex items-center justify-around px-2 z-50">
      <button 
        onClick={() => setActiveTab('editor')}
        className={\`flex flex-col items-center justify-center w-1/4 h-full transition-colors \${activeTab === 'editor' ? 'text-nexus-accent' : 'text-nexus-muted'}\`}
      >
        <Terminal size={24} />
        <span className="text-xs mt-1">Éditeur</span>
      </button>

      <button 
        onClick={toggleOnlineMode}
        className={\`flex flex-col items-center justify-center w-1/4 h-full transition-colors relative\`}
      >
        <div className={\`p-3 rounded-full -mt-8 border-4 border-nexus-darker \${isOnlineMode ? 'bg-nexus-success text-nexus-darker shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gray-700 text-gray-400'}\`}>
           {isOnlineMode ? <Wifi size={24} /> : <WifiOff size={24} />}
        </div>
        <span className={\`text-xs mt-1 \${isOnlineMode ? 'text-nexus-success' : 'text-nexus-muted'}\`}>
          {isOnlineMode ? 'Online' : 'Offline'}
        </span>
      </button>

      <button 
        onClick={() => isOnlineMode ? setActiveTab('ai') : alert("Activez le mode Online pour accéder aux Bots IA.")}
        className={\`flex flex-col items-center justify-center w-1/4 h-full transition-colors \${activeTab === 'ai' ? 'text-nexus-accent' : 'text-nexus-muted'} \${!isOnlineMode && 'opacity-50'}\`}
      >
        <Bot size={24} />
        <span className="text-xs mt-1">IA Nexus</span>
      </button>

      <button 
        onClick={onOpenSettings}
        className={\`flex flex-col items-center justify-center w-1/4 h-full transition-colors text-nexus-muted hover:text-white\`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Réglages</span>
      </button>
    </nav>
  );
};

export default NavBar;`,

  'src/components/CodeEditor.tsx': `import React, { useRef, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, CodeFile } from '../types';
import { Save, Check, Play, Bug, Sparkles, Plus, X, FileCode, Edit2, Download, Copy, CodeXml } from 'lucide-react';

declare global {
  interface Window {
    Prism: any;
  }
}

interface CodeEditorProps {
  files: CodeFile[];
  activeFileId: string;
  onUpdateFile: (id: string, newContent: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
  onSwitchFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onLanguageChange: (id: string, newLang: Language) => void;
  onRun: () => void;
  onDebug: () => void;
  onImprove: () => void;
  onDownload: () => void;
  onViewSource: () => void;
  isOnline: boolean;
  consoleOutput: string | null; // null means hidden
  setConsoleOutput: (output: string | null) => void;
  isRunning: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  files, 
  activeFileId, 
  onUpdateFile,
  onAddFile,
  onDeleteFile,
  onSwitchFile,
  onRenameFile,
  onLanguageChange,
  onRun,
  onDebug,
  onImprove,
  onDownload,
  onViewSource,
  isOnline,
  consoleOutput,
  setConsoleOutput,
  isRunning
}) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab Indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onUpdateFile(activeFileId, newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    // Handle Auto-Indentation on Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      
      const lines = value.substring(0, start).split('\\n');
      const currentLine = lines[lines.length - 1];
      
      const match = currentLine.match(/^\\s*/);
      const currentIndent = match ? match[0] : '';
      
      let nextIndent = currentIndent;
      const trimmedLine = currentLine.trim();
      const indentUnit = "  ";

      let shouldIncreaseIndent = false;

      if (['{', '(', '[', ':'].some(char => trimmedLine.endsWith(char))) {
        shouldIncreaseIndent = true;
      }
      
      if ((activeFile.language === 'HTML' || activeFile.language === 'React') && 
          trimmedLine.endsWith('>') && 
          !trimmedLine.endsWith('/>') && 
          !trimmedLine.startsWith('</')) {
          shouldIncreaseIndent = true;
      }

      if (shouldIncreaseIndent) {
        nextIndent += indentUnit;
      }

      const newValue = value.substring(0, start) + '\\n' + nextIndent + value.substring(end);
      
      onUpdateFile(activeFileId, newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = start + 1 + nextIndent.length;
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.blur();
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const getPrismLang = (lang: Language): string => {
    switch(lang) {
      case 'Python': return 'python';
      case 'C': return 'c';
      case 'C++': return 'cpp';
      case 'Java': return 'java';
      case 'JavaScript': return 'javascript';
      case 'HTML': return 'html';
      case 'React': return 'jsx';
      case 'CSS': return 'css';
      default: return 'plaintext';
    }
  };

  const getHighlightedCode = () => {
    if (!window.Prism || !activeFile) return "";
    const prismLang = getPrismLang(activeFile.language);
    const grammar = window.Prism.languages[prismLang] || window.Prism.languages.plaintext;
    let highlighted = window.Prism.highlight(activeFile.content, grammar, prismLang);
    if (activeFile.content.endsWith('\\n')) {
      highlighted += '<br />';
    }
    return highlighted;
  };

  const startRenaming = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNameId(file.id);
    setTempName(file.name);
  };

  const finishRenaming = () => {
    if (editingNameId && tempName.trim()) {
      onRenameFile(editingNameId, tempName);
    }
    setEditingNameId(null);
  };

  if (!activeFile) return <div className="text-white p-4">No file selected</div>;

  return (
    <div className="flex flex-col h-full bg-nexus-dark relative">
      <div className="flex items-center bg-nexus-darker border-b border-gray-800 overflow-x-auto no-scrollbar">
        {files.map(file => (
          <div 
            key={file.id}
            onClick={() => onSwitchFile(file.id)}
            className={\`
              flex items-center gap-2 px-4 py-3 min-w-[120px] max-w-[200px] cursor-pointer border-r border-gray-800 select-none
              \${file.id === activeFileId ? 'bg-nexus-dark text-white border-b-2 border-b-nexus-accent' : 'text-gray-500 hover:text-gray-300'}
            \`}
          >
            <FileCode size={14} />
            
            {editingNameId === file.id ? (
              <input 
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={finishRenaming}
                onKeyDown={(e) => e.key === 'Enter' && finishRenaming()}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 text-white text-xs px-1 rounded w-20 outline-none"
              />
            ) : (
              <span className="text-xs truncate">{file.name}</span>
            )}

            {file.id === activeFileId && editingNameId !== file.id && (
               <button onClick={(e) => startRenaming(file, e)} className="p-1 hover:text-nexus-accent">
                 <Edit2 size={10} />
               </button>
            )}

            {files.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                className="ml-auto hover:text-red-500"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        <button onClick={onAddFile} className="px-4 text-nexus-accent hover:text-white">
          <Plus size={18} />
        </button>
      </div>

      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-800 bg-nexus-dark z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onRun}
            disabled={isRunning}
            className={\`flex items-center gap-1 px-3 py-1 rounded bg-nexus-success/10 text-nexus-success border border-nexus-success/20 hover:bg-nexus-success/20 transition-all \${isRunning ? 'opacity-50' : ''}\`}
          >
            <Play size={14} fill="currentColor" />
            <span className="text-xs font-bold">{isRunning ? '...' : 'Run'}</span>
          </button>
          
          <button 
            onClick={onDebug}
            className="p-2 rounded text-yellow-500 hover:bg-yellow-500/10 transition-all"
            title="Debug"
          >
            <Bug size={18} />
          </button>

          {isOnline && (
            <button 
              onClick={onImprove}
              className="p-2 rounded text-purple-400 hover:bg-purple-500/10 transition-all"
              title="Améliorer le code (IA)"
            >
              <Sparkles size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
           <button
             onClick={onViewSource}
             className="text-gray-400 hover:text-nexus-accent p-2"
             title="Voir le code source de l'application"
           >
             <CodeXml size={18} />
           </button>

           <button
             onClick={handleCopy}
             className={\`p-2 transition-colors \${isCopied ? 'text-nexus-success' : 'text-nexus-accent hover:text-white'}\`}
             title="Copier tout"
           >
             {isCopied ? <Check size={18} /> : <Copy size={18} />}
           </button>

           <button 
             onClick={onDownload} 
             className="text-nexus-accent hover:text-white p-2"
             title="Télécharger/Exporter"
           >
             <Download size={18} />
           </button>

           <button 
             onClick={handleSave} 
             className={\`p-2 transition-colors \${isSaved ? 'text-nexus-success' : 'text-gray-400 hover:text-white'}\`}
             title="Sauvegarde automatique active"
           >
              {isSaved ? <Check size={18} /> : <Save size={18} />}
           </button>
           <select 
              value={activeFile.language} 
              onChange={(e) => onLanguageChange(activeFileId, e.target.value as Language)}
              className="bg-gray-800 text-xs text-white px-2 py-1 rounded border border-gray-700 outline-none max-w-[80px]"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex bg-nexus-dark">
        <div className="w-10 bg-nexus-darker text-gray-600 font-mono pt-4 text-right pr-2 select-none border-r border-gray-800 hidden sm:block z-10 editor-font">
           {activeFile.content.split('\\n').map((_, i) => (
             <div key={i}>{i + 1}</div>
           ))}
        </div>

        <div className="flex-1 relative h-full">
          <pre
            ref={preRef}
            aria-hidden="true"
            className={\`absolute inset-0 m-0 p-4 pointer-events-none overflow-auto no-scrollbar editor-font language-\${getPrismLang(activeFile.language)}\`}
          >
            <code 
              dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
              className={\`language-\${getPrismLang(activeFile.language)}\`}
            />
          </pre>

          <textarea
            ref={textareaRef}
            value={activeFile.content}
            onChange={(e) => onUpdateFile(activeFileId, e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none focus:outline-none overflow-auto no-scrollbar whitespace-pre editor-font z-10"
            placeholder="// Code..."
          />
        </div>
      </div>

      {consoleOutput !== null && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-nexus-darker border-t border-gray-700 flex flex-col z-30 shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase">
              {activeFile.language === 'HTML' ? 'Aperçu Web' : 'Console / Terminal'}
            </span>
            <button onClick={() => setConsoleOutput(null)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-0 relative bg-black">
             {activeFile.language === 'HTML' ? (
               <iframe 
                 title="Preview"
                 className="w-full h-full bg-white"
                 srcDoc={consoleOutput}
                 sandbox="allow-scripts"
               />
             ) : (
               <pre className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap">
                 {consoleOutput}
               </pre>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;`,

  'src/components/BotChat.tsx': `import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, GraduationCap, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { BotPersona, Message, Language } from '../types';
import { generateBotResponse } from '../services/geminiService';

interface BotChatProps {
  activeBot: BotPersona;
  setActiveBot: (bot: BotPersona) => void;
  code: string;
  language: Language;
  chatHistory: Record<BotPersona, Message[]>;
  updateHistory: (bot: BotPersona, messages: Message[]) => void;
  apiKey: string;
}

const BotChat: React.FC<BotChatProps> = ({ 
  activeBot, 
  setActiveBot, 
  code, 
  language,
  chatHistory,
  updateHistory,
  apiKey
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = chatHistory[activeBot];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeBot]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    const newHistory = [...currentMessages, userMsg];
    updateHistory(activeBot, newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateBotResponse(
        apiKey,
        activeBot,
        code,
        language,
        newHistory,
        userMsg.text
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      updateHistory(activeBot, [...newHistory, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Erreur critique: Impossible de contacter Gemini. Vérifiez votre clé API.",
        timestamp: Date.now()
      };
       updateHistory(activeBot, [...newHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    updateHistory(activeBot, []);
  };

  return (
    <div className="flex flex-col h-full bg-nexus-dark">
      <div className="h-16 flex items-center justify-between px-2 bg-nexus-darker border-b border-gray-800">
        <div className="flex bg-gray-800 rounded-lg p-1 w-full mr-2">
          <button
            onClick={() => setActiveBot(BotPersona.CODER)}
            className={\`flex-1 flex items-center justify-center py-2 rounded-md transition-all \${activeBot === BotPersona.CODER ? 'bg-nexus-accent text-white shadow-md' : 'text-gray-400'}\`}
          >
            <Cpu size={18} />
          </button>
          <button
            onClick={() => setActiveBot(BotPersona.TEACHER)}
            className={\`flex-1 flex items-center justify-center py-2 rounded-md transition-all \${activeBot === BotPersona.TEACHER ? 'bg-nexus-success text-white shadow-md' : 'text-gray-400'}\`}
          >
            <GraduationCap size={18} />
          </button>
          <button
            onClick={() => setActiveBot(BotPersona.COMPANION)}
            className={\`flex-1 flex items-center justify-center py-2 rounded-md transition-all \${activeBot === BotPersona.COMPANION ? 'bg-purple-500 text-white shadow-md' : 'text-gray-400'}\`}
          >
            <Sparkles size={18} />
          </button>
        </div>
        <button onClick={clearChat} className="p-2 text-gray-500 hover:text-red-400">
            <Trash2 size={20} />
        </button>
      </div>

      <div className="bg-gray-900/50 p-2 text-center text-xs text-nexus-muted border-b border-gray-800">
        {activeBot === BotPersona.CODER && "Assisté par Gemini 3.0 Pro - Expert Code"}
        {activeBot === BotPersona.TEACHER && "Assisté par Gemini 2.5 Flash - Pédagogue"}
        {activeBot === BotPersona.COMPANION && "Assisté par Gemini 2.5 Flash - Tech Talk"}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {currentMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
             <BotPersonaIcon persona={activeBot} size={48} />
             <p className="mt-4 text-sm text-center max-w-[200px]">
               {activeBot === BotPersona.CODER && "Prêt à coder ? Demandez-moi de l'aide sur votre fichier."}
               {activeBot === BotPersona.TEACHER && "Une question sur le code ? Je suis là pour expliquer."}
               {activeBot === BotPersona.COMPANION && "Parlons du futur, de robots ou de sciences !"}
             </p>
          </div>
        )}
        {currentMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}
          >
            <div 
              className={\`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap \${
                msg.role === 'user' 
                  ? 'bg-nexus-accent text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }\`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-gray-800 rounded-2xl rounded-bl-none p-3 border border-gray-700 flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-nexus-accent" />
               <span className="text-xs text-gray-400">Gemini réfléchit...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-nexus-darker border-t border-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={\`Parler à \${activeBot}...\`}
          className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-nexus-accent border border-gray-700"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-nexus-accent text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

const BotPersonaIcon = ({ persona, size }: { persona: BotPersona, size: number }) => {
  switch (persona) {
    case BotPersona.CODER: return <Cpu size={size} />;
    case BotPersona.TEACHER: return <GraduationCap size={size} />;
    case BotPersona.COMPANION: return <Sparkles size={size} />;
  }
};

export default BotChat;`,

  'src/App.tsx': `import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import BotChat from './components/BotChat';
import NavBar from './components/NavBar';
import { BotPersona, CodeFile, Language, Message, DEFAULT_FILES, SNIPPETS } from './types';
import { WifiOff, X, Key, ExternalLink, Save, CodeXml, Copy, Check } from 'lucide-react';
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

  const handleAddFile = () => {
    const fileName = window.prompt("Nom du nouveau fichier (ex: script.js, page.html) :", \`fichier_\${files.length + 1}.js\`);
    if (!fileName) return;

    const newId = Date.now().toString();
    const detectedLang = detectLanguageFromExtension(fileName);
    const lang = detectedLang || 'JavaScript';

    const newFile: CodeFile = {
      id: newId,
      name: fileName,
      language: lang,
      content: SNIPPETS[lang] || ''
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
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
      "Options d'exportation:\\n1. Télécharger le fichier actuel\\n2. Exporter tout le projet (ZIP)\\n3. Télécharger le Code Source de l'App (CodeNexus)\\n\\nEntrez 1, 2 ou 3:"
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
    const lines = code.split('\\n');
    let errors: string[] = [];
    
    if (!code.trim()) return "Erreur: Le fichier est vide.";

    if (lang === 'Python') {
      lines.forEach((line, i) => {
        const l = line.trim();
        if ((l.startsWith('def ') || l.startsWith('if ') || l.startsWith('for ') || l.startsWith('while ')) && !l.endsWith(':')) {
          errors.push(\`Ligne \${i+1}: Syntaxe invalide. Il manque un ':' à la fin de l'instruction.\`);
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
       if (openBraces !== 0) errors.push(\`Erreur: Accolades {} déséquilibrées (Diff: \${openBraces}).\`);
    }
    else if (lang === 'HTML') {
      const openDivs = (code.match(/<div/g) || []).length;
      const closeDivs = (code.match(/<\\/div>/g) || []).length;
      if(openDivs !== closeDivs) errors.push(\`Attention: Nombre de <div> (\${openDivs}) et </div> (\${closeDivs}) ne correspond pas.\`);
    }

    if (errors.length === 0) return "✅ Aucune erreur de syntaxe évidente détectée.";
    return "⚠️ Problèmes détectés :\\n" + errors.join('\\n');
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
        const styleBlock = cssFiles.map(c => \`<style>/* \${c.name} */\\n\${c.content}</style>\`).join('\\n');
        htmlContent = htmlContent.replace('</head>', \`\${styleBlock}\\n</head>\`);
        if (!htmlContent.includes('</head>')) htmlContent = \`\${styleBlock}\\n\${htmlContent}\`;

        const scriptBlock = jsFiles.map(j => \`<script>/* \${j.name} */\\n\${j.content}</script>\`).join('\\n');
        htmlContent = htmlContent.replace('</body>', \`\${scriptBlock}\\n</body>\`);
        if (!htmlContent.includes('</body>')) htmlContent += \`\\n\${scriptBlock}\`;

        setConsoleOutput(htmlContent);
      } 
      else if (file.language === 'JavaScript') {
        const logCapture = \`
          <script>
            const oldLog = console.log;
            const logs = [];
            console.log = (...args) => {
               logs.push(args.join(' '));
               document.body.innerText = logs.join('\\\\n');
               oldLog.apply(console, args);
            };
            window.onerror = function(message, source, lineno, colno, error) {
               document.body.innerText += '\\\\n🛑 Error: ' + message;
            };
            try {
              \${file.content}
            } catch(e) {
              document.body.innerText += '\\\\n🛑 Exception: ' + e.message;
            }
          </script>
        \`;
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
          const fakeBuild = \`
[NexusCompiler 1.0.0] Target: \${file.language}
> Analysing dependencies... OK
> Checking syntax for \${file.name}... OK
> Compiling objects...
> Linking...

Build Successful! (0.4s)
--------------------------------------------------
[SYSTEM] Note: Ceci est une simulation hors ligne.
Le code n'a pas été réellement exécuté sur le processeur du mobile.
Activez le mode Online pour une exécution cloud réelle.
          \`;
          setConsoleOutput(fakeBuild);
        }
      }
    } catch (e) {
      setConsoleOutput(\`Error: \${e}\`);
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
      setConsoleOutput(\`[RAPPORT DE DEBUG IA]\\n\\n\${result}\`);
    } else {
      setTimeout(() => {
        const analysis = offlineLinter(file.content, file.language);
        setConsoleOutput(\`[OFFLINE DEBUGGER]\\nFichier: \${file.name}\\nLangage: \${file.language}\\n-------------------\\n\\n\${analysis}\`);
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
    setConsoleOutput(\`[SUGGESTIONS D'AMÉLIORATION]\\n\\n\${result}\`);
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
            onAddFile={handleAddFile}
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
                       className={\`w-full text-left px-4 py-3 text-xs font-mono border-b border-gray-800/50 hover:bg-gray-800 transition-colors \${sourceViewerFile === fileName ? 'bg-nexus-accent/20 text-nexus-accent border-l-2 border-l-nexus-accent' : 'text-gray-400'}\`}
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
            <div className="bg-nexus-dark border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
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
                className="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-3 mb-4 focus:border-nexus-accent outline-none"
              />

              <div className="flex justify-between items-center mb-6">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nexus-accent text-xs flex items-center gap-1 hover:underline"
                >
                  Obtenir une clé <ExternalLink size={12} />
                </a>
              </div>

              <button 
                onClick={() => handleSaveApiKey(apiKey)}
                className="w-full bg-nexus-success text-nexus-darker font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
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

export default App;`,

  'src/appSource.ts': `
// Ceci est une version simplifiée du fichier source. 
// Pour permettre à l'application de se re-télécharger elle-même à l'infini (Quine),
// il faudrait injecter dynamiquement le contenu de ce fichier ici.
// Dans la version ZIP téléchargée, ce fichier est présent pour permettre la compilation.
export const APP_SOURCE_CODE: Record<string, string> = {}; 
`
};
