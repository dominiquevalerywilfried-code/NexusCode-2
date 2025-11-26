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
      Utilise le modèle gemini-3-pro-preview pour des raisonnements complexes.`;
    
    case BotPersona.TEACHER:
      return `${baseInstruction} Tu es 'Nexus Mentor'. Tu es un professeur de programmation patient et pédagogue. 
      N'écris pas juste la solution, explique le "pourquoi" et le "comment". 
      Guide l'utilisateur vers la solution. Pose des questions pour vérifier la compréhension.`;

    case BotPersona.COMPANION:
      return `${baseInstruction} Tu es 'Nexus Spark'. Tu es un passionné de science, de technologie, de robotique et de futurisme. 
      Tu aimes discuter des dernières avancées tech, de théories scientifiques, et de l'éthique de l'IA. 
      Adopte un ton curieux, amical et inspirant.`;
    
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

  const contextPrompt = `
  [CONTEXTE DU FICHIER ACTUEL (${currentLanguage})]:
  \`\`\`${currentLanguage}
  ${currentCode}
  \`\`\`
  
  [MESSAGE UTILISATEUR]:
  ${userMessage}
  `;

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nInstruction: ${prompt}`
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
  const projectContext = files.map(f => `Filename: ${f.name}\nContent:\n${f.content}`).join('\n---\n');

  const prompt = `
  Agis comme un compilateur et un environnement d'exécution pour ${mainFile.language}.
  Voici les fichiers du projet :
  ${projectContext}

  Tâche: 
  1. Compile (simulé) le fichier principal: ${mainFile.name}.
  2. S'il y a des erreurs de compilation, affiche-les comme un log de terminal.
  3. Sinon, exécute le code et donne-moi UNIQUEMENT la sortie console (stdout/stderr).
  
  N'explique pas le code, donne juste le résultat de l'exécution comme si c'était un terminal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Pas de sortie.";
};
