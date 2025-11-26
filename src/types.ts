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
  groundingMetadata?: {
    groundingChunks: {
      web?: {
        uri: string;
        title: string;
      };
    }[];
  };
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
  'HTML': '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { margin: 0; overflow: hidden; background: #111; }\n    canvas { display: block; }\n  </style>\n</head>\n<body>\n  <canvas id="game"></canvas>\n  <script>\n    const canvas = document.getElementById("game");\n    const ctx = canvas.getContext("2d");\n\n    function resize() {\n      canvas.width = window.innerWidth;\n      canvas.height = window.innerHeight;\n    }\n    window.onresize = resize;\n    resize();\n\n    // Game Variables\n    let x = 100, y = 100;\n    let dx = 3, dy = 3;\n\n    function update() {\n      ctx.fillStyle = "rgba(0,0,0,0.1)"; // Trails effect\n      ctx.fillRect(0, 0, canvas.width, canvas.height);\n      \n      ctx.fillStyle = "#3b82f6";\n      ctx.beginPath();\n      ctx.arc(x, y, 20, 0, Math.PI * 2);\n      ctx.fill();\n\n      if(x < 0 || x > canvas.width) dx = -dx;\n      if(y < 0 || y > canvas.height) dy = -dy;\n      x += dx; y += dy;\n\n      requestAnimationFrame(update);\n    }\n    update();\n  </script>\n</body>\n</html>',
  'JavaScript': 'console.log("Hello")',
  'Java': 'class Main { public static void main(String[] a) { System.out.println("Hi"); } }',
  'React': 'export default function App() { return <h1>Hi</h1> }',
  'C++': '#include <iostream>\nint main() { std::cout << "Hello"; return 0; }',
  'CSS': 'body { background: #f0f0f0; }'
};