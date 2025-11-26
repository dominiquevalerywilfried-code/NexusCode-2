import React, { useState, useRef, useEffect } from 'react';
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
      {/* Bot Selector Header */}
      <div className="h-16 flex items-center justify-between px-2 bg-nexus-darker border-b border-gray-800">
        <div className="flex bg-gray-800 rounded-lg p-1 w-full mr-2">
          <button
            onClick={() => setActiveBot(BotPersona.CODER)}
            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${activeBot === BotPersona.CODER ? 'bg-nexus-accent text-white shadow-md' : 'text-gray-400'}`}
          >
            <Cpu size={18} />
          </button>
          <button
            onClick={() => setActiveBot(BotPersona.TEACHER)}
            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${activeBot === BotPersona.TEACHER ? 'bg-nexus-success text-white shadow-md' : 'text-gray-400'}`}
          >
            <GraduationCap size={18} />
          </button>
          <button
            onClick={() => setActiveBot(BotPersona.COMPANION)}
            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${activeBot === BotPersona.COMPANION ? 'bg-purple-500 text-white shadow-md' : 'text-gray-400'}`}
          >
            <Sparkles size={18} />
          </button>
        </div>
        <button onClick={clearChat} className="p-2 text-gray-500 hover:text-red-400">
            <Trash2 size={20} />
        </button>
      </div>

      {/* Bot Info Banner */}
      <div className="bg-gray-900/50 p-2 text-center text-xs text-nexus-muted border-b border-gray-800">
        {activeBot === BotPersona.CODER && "Assisté par Gemini 3.0 Pro - Expert Code"}
        {activeBot === BotPersona.TEACHER && "Assisté par Gemini 2.5 Flash - Pédagogue"}
        {activeBot === BotPersona.COMPANION && "Assisté par Gemini 2.5 Flash - Tech Talk"}
      </div>

      {/* Chat Area */}
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
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-nexus-accent text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}
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

      {/* Input Area */}
      <div className="p-3 bg-nexus-darker border-t border-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Parler à ${activeBot}...`}
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

export default BotChat;