const fs = require('fs');
const path = require('path');

const root = process.cwd(); // pasta DELTA+

// Pastas
const folders = [
  'app',
  'app/(auth)/login',
  'app/(auth)/register',
  'app/(auth)/recover',
  'app/dashboard',
  'app/study/areas',
  'app/study/practice',
  'app/study/areas/[id]',
  'app/review',
  'app/profile',
  'app/support',
  'components/ui',
  'components/layout',
  'components/providers',
  'lib',
  'types',
  'public/icons'
];

// Criar pastas
folders.forEach(f => fs.mkdirSync(path.join(root, f), { recursive: true }));

// Arquivos base com conteúdo inicial
const files = {
  // Configurações
  'package.json': `{
  "name": "delta-plus",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0"
  }
}`,
  'next.config.js': `/** @type {import('next').NextConfig} */
module.exports = {};`,
  'tailwind.config.ts': `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,

  // App
  'app/layout.tsx': `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>;
}`,
  'app/page.tsx': `export default function HomePage() { return <h1>Home DELTA+</h1>; }`,
  'app/globals.css': `/* Coloque aqui seus estilos globais */`,
  'app/(auth)/layout.tsx': `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth">{children}</div>;
}`,
  'app/(auth)/login/page.tsx': `export default function LoginPage() { return <h2>Login</h2>; }`,
  'app/(auth)/register/page.tsx': `export default function RegisterPage() { return <h2>Register</h2>; }`,
  'app/(auth)/recover/page.tsx': `export default function RecoverPage() { return <h2>Recover</h2>; }`,
  'app/dashboard/page.tsx': `export default function DashboardPage() { return <h1>Dashboard</h1>; }`,
  'app/study/areas/page.tsx': `export default function AreasPage() { return <h1>Áreas de Estudo</h1>; }`,
  'app/study/practice/page.tsx': `export default function PracticePage() { return <h1>Prática</h1>; }`,
  'app/study/areas/[id]/page.tsx': `export default function AreaDetailPage() { return <h1>Detalhe da Área</h1>; }`,
  'app/review/page.tsx': `export default function ReviewPage() { return <h1>Revisão</h1>; }`,
  'app/profile/page.tsx': `export default function ProfilePage() { return <h1>Perfil</h1>; }`,
  'app/support/page.tsx': `export default function SupportPage() { return <h1>Suporte</h1>; }`,

  // Components
  'components/ui/Button.tsx': `export default function Button({ children }: { children: React.ReactNode }) { return <button>{children}</button>; }`,
  'components/ui/Input.tsx': `export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} />; }`,
  'components/ui/Card.tsx': `export default function Card({ children }: { children: React.ReactNode }) { return <div className="card">{children}</div>; }`,
  'components/ui/ProgressBar.tsx': `export default function ProgressBar({ progress }: { progress: number }) { return <div style={{ width: progress + '%' }} className="progress-bar" />; }`,
  'components/layout/DashboardLayout.tsx': `export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <div className="dashboard-layout">{children}</div>; }`,
  'components/providers/AuthProvider.tsx': `import React from 'react';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;`,

  // Lib
  'lib/db.ts': `// Funções de banco (IndexedDB ou outro)`,
  'lib/auth.ts': `// Funções de autenticação`,
  'lib/ai-mock.ts': `// Mock IA`,
  'lib/utils.ts': `// Funções utilitárias`,

  // Types
  'types/index.ts': `// Tipagens globais`,

  // Public
  'public/manifest.json': `{
  "name": "DELTA+",
  "short_name": "DELTA+",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}`
};

// Criar arquivos
for (const file in files) {
  fs.writeFileSync(path.join(root, file), files[file]);
}

console.log('Projeto DELTA+ completo criado com todas as pastas e arquivos!');