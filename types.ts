export type Language = 'Python' | 'C' | 'HTML' | 'JavaScript' | 'Java' | 'React' | 'C++' | 'CSS';

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
    content: 'def hello_world():\n    print("Bonjour le monde!")\n\nif __name__ == "__main__":\n    hello_world()'
  }
];

export const SNIPPETS: Record<Language, string> = {
  'Python': 'print("Hello World")',
  'C': '#include <stdio.h>\nint main() { printf("Hello"); return 0; }',
  'HTML': '<h1>Hello</h1>',
  'JavaScript': 'console.log("Hello")',
  'Java': 'class Main { public static void main(String[] a) { System.out.println("Hi"); } }',
  'React': 'export default function App() { return <h1>Hi</h1> }',
  'C++': '#include <iostream>\nint main() { std::cout << "Hello"; return 0; }',
  'CSS': 'body { background: #f0f0f0; }'
};
