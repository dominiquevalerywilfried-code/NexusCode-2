import React, { useRef, useState, useEffect } from 'react';
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
      
      const lines = value.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      
      const match = currentLine.match(/^\s*/);
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

      const newValue = value.substring(0, start) + '\n' + nextIndent + value.substring(end);
      
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
    if (activeFile.content.endsWith('\n')) {
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
            className={`
              flex items-center gap-2 px-4 py-3 min-w-[120px] max-w-[200px] cursor-pointer border-r border-gray-800 select-none
              ${file.id === activeFileId ? 'bg-nexus-dark text-white border-b-2 border-b-nexus-accent' : 'text-gray-500 hover:text-gray-300'}
            `}
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
            className={`flex items-center gap-1 px-3 py-1 rounded bg-nexus-success/10 text-nexus-success border border-nexus-success/20 hover:bg-nexus-success/20 transition-all ${isRunning ? 'opacity-50' : ''}`}
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
             className={`p-2 transition-colors ${isCopied ? 'text-nexus-success' : 'text-nexus-accent hover:text-white'}`}
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
             className={`p-2 transition-colors ${isSaved ? 'text-nexus-success' : 'text-gray-400 hover:text-white'}`}
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
           {activeFile.content.split('\n').map((_, i) => (
             <div key={i}>{i + 1}</div>
           ))}
        </div>

        <div className="flex-1 relative h-full">
          <pre
            ref={preRef}
            aria-hidden="true"
            className={`absolute inset-0 m-0 p-4 pointer-events-none overflow-auto no-scrollbar editor-font language-${getPrismLang(activeFile.language)}`}
          >
            <code 
              dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
              className={`language-${getPrismLang(activeFile.language)}`}
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

export default CodeEditor;