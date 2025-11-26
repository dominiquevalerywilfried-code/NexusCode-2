import { GoogleGenAI, Content, Part } from "@google/genai";
import { BotPersona, Message, Language, CodeFile } from "../types";

// --- Chat Helpers ---

const getSystemInstruction = (persona: BotPersona, language: Language): string => {
  const baseInstruction = `Tu es un assistant IA intégré dans une application mobile d'édition de code. L'utilisateur programme actuellement en ${language}. Réponds toujours en Français.`;

  switch (persona) {
    case BotPersona.CODER:
      return `${baseInstruction} Tu es 'Nexus Architect'. Tu es un expert en ingénierie logicielle senior. 
      Ton but est d'aider à écrire, déboguer, refactoriser et optimiser le code. 
      Sois précis, technique et fournis des solutions de code complètes. 
      Utilise tes capacités de réflexion (Thinking) pour analyser les problèmes complexes avant de répondre.`;
    
    case BotPersona.TEACHER:
      return `${baseInstruction} Tu es 'Nexus Mentor'. Tu es un professeur de programmation patient et pédagogue. 
      Utilise Google Search pour trouver des exemples récents ou de la documentation à jour si nécessaire.
      N'écris pas juste la solution, explique le "pourquoi" et le "comment". 
      Guide l'utilisateur vers la solution.`;

    case BotPersona.COMPANION:
      return `${baseInstruction} Tu es 'Nexus Spark'. Tu es un passionné de science, de technologie, de robotique et de futurisme. 
      Utilise Google Search pour discuter des toutes dernières actualités tech.
      Adopte un ton curieux, amical et inspirant.`;
    
    default:
      return baseInstruction;
  }
};

interface BotResponse {
  text: string;
  groundingMetadata?: any;
}

export const generateBotResponse = async (
  apiKey: string,
  persona: BotPersona,
  currentCode: string,
  currentLanguage: Language,
  chatHistory: Message[],
  userMessage: string
): Promise<BotResponse> => {
  if (!apiKey) throw new Error("API Key manquante");

  const ai = new GoogleGenAI({ apiKey });
  
  let modelName = 'gemini-2.5-flash';
  let tools: any[] = [];
  let thinkingConfig: any = undefined;

  // Configuration spécifique par Persona
  if (persona === BotPersona.CODER) {
    // Mode Thinking pour le Coder
    modelName = 'gemini-3-pro-preview';
    thinkingConfig = { thinkingBudget: 32768 }; // Max budget for deep reasoning
  } else {
    // Mode Search pour Teacher et Companion
    modelName = 'gemini-2.5-flash'; // Utilisation de Flash pour la rapidité avec outils
    tools = [{ googleSearch: {} }];
  }
  
  const historyContents: Content[] = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }] as Part[]
  }));

  const systemInstruction = getSystemInstruction(persona, currentLanguage);

  const contextPrompt = `
  [CONTEXTE DU FICHIER ACTUEL (${currentLanguage})]:
  \`\`\`${currentLanguage}
  ${currentCode}
  \`\`\`
  
  [MESSAGE UTILISATEUR]:
  ${userMessage}
  `;

  try {
    const chatConfig: any = {
      systemInstruction,
      tools: tools.length > 0 ? tools : undefined,
    };
    
    // Thinking config is part of generation config, usually passed at generation time or chat creation
    // For @google/genai, it's often in the generateContent config, but for chat we set it on the chat or message.
    // We will pass it in sendMessage config if supported, or chat creation.
    // Note: thinkingConfig is a property of 'config' in generateContent.
    
    const chat = ai.chats.create({
      model: modelName,
      config: chatConfig,
      history: historyContents
    });

    const response = await chat.sendMessage({ 
      message: contextPrompt,
      config: thinkingConfig ? { thinkingConfig } : undefined
    });

    return {
      text: response.text || "Désolé, je n'ai pas pu générer de réponse.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Erreur de connexion à l'IA ou quota dépassé." };
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
    prompt = `Analyse ce code ${language} et trouve les erreurs potentielles (syntaxe, logique, sécurité). 
    Si tout semble correct, dis-le. Sinon, liste les problèmes et propose la version corrigée. 
    Sois concis.`;
  } else {
    prompt = `Agis comme un expert senior. Refactorise ce code ${language} pour le rendre :
    1. Plus lisible (Clean Code)
    2. Plus performant
    3. Plus "joli" (idiomatique)
    Explique brièvement tes changements.`;
  }

  // Use Thinking model for deep code analysis
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nInstruction: ${prompt}`,
    config: {
      thinkingConfig: { thinkingBudget: 16384 }
    }
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

  const projectContext = files.map(f => `Filename: ${f.name}\nContent:\n${f.content}`).join('\n---\n');

  const prompt = `
  Agis comme un compilateur et un environnement d'exécution pour ${mainFile.language}.
  Voici les fichiers du projet :
  ${projectContext}

  Tâche: 
  1. Compile (simulé) le fichier principal: ${mainFile.name}.
  2. S'il y a des erreurs de compilation, affiche-les comme un log de terminal.
  3. Sinon, exécute le code et donne-moi UNIQUEMENT la sortie console (stdout/stderr).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Pas de sortie.";
};