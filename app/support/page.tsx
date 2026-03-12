'use client';

import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText,
  Shield
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';

const supportItems = [
  {
    icon: HelpCircle,
    title: 'Dúvidas Frequentes',
    description: 'Encontre respostas para as perguntas mais comuns',
    href: '#',
  },
  {
    icon: MessageCircle,
    title: 'Chat de Suporte',
    description: 'Converse com nossa equipe em tempo real',
    href: '#',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'suporte@deltaplus.com',
    href: 'mailto:suporte@deltaplus.com',
  },
  {
    icon: FileText,
    title: 'Termos de Uso',
    description: 'Leia nossos termos e condições',
    href: '#',
  },
  {
    icon: Shield,
    title: 'Privacidade',
    description: 'Como protegemos seus dados',
    href: '#',
  },
];

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Central de Suporte</h1>
          <p className="text-gray-400">Como podemos ajudar você?</p>
        </div>

        <div className="grid gap-4">
          {supportItems.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex items-center gap-4 hover:border-delta-green-500/50">
                <div className="p-3 bg-delta-green-500/10 rounded-xl">
                  <item.icon className="w-6 h-6 text-delta-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>

        <Card className="text-center py-8 mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">Sobre o Delta+</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            O Delta+ é uma plataforma de estudos inteligente que utiliza IA para 
            personalizar sua experiência de aprendizado e maximizar seus resultados.
          </p>
          <p className="text-gray-500 text-xs mt-4">Versão 1.0.0 (MVP)</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}