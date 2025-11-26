import React from 'react';
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
        className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${activeTab === 'editor' ? 'text-nexus-accent' : 'text-nexus-muted'}`}
      >
        <Terminal size={24} />
        <span className="text-xs mt-1">Éditeur</span>
      </button>

      <button 
        onClick={toggleOnlineMode}
        className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors relative`}
      >
        <div className={`p-3 rounded-full -mt-8 border-4 border-nexus-darker ${isOnlineMode ? 'bg-nexus-success text-nexus-darker shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gray-700 text-gray-400'}`}>
           {isOnlineMode ? <Wifi size={24} /> : <WifiOff size={24} />}
        </div>
        <span className={`text-xs mt-1 ${isOnlineMode ? 'text-nexus-success' : 'text-nexus-muted'}`}>
          {isOnlineMode ? 'Online' : 'Offline'}
        </span>
      </button>

      <button 
        onClick={() => isOnlineMode ? setActiveTab('ai') : alert("Activez le mode Online pour accéder aux Bots IA.")}
        className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${activeTab === 'ai' ? 'text-nexus-accent' : 'text-nexus-muted'} ${!isOnlineMode && 'opacity-50'}`}
      >
        <Bot size={24} />
        <span className="text-xs mt-1">IA Nexus</span>
      </button>

      <button 
        onClick={onOpenSettings}
        className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors text-nexus-muted hover:text-white`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Réglages</span>
      </button>
    </nav>
  );
};

export default NavBar;