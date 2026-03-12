'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { recoverAccount } from '@/lib/auth';

export default function RecoverPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await recoverAccount(identifier, method);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Erro ao recuperar conta');
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-delta-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-delta-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Verifique seu {method === 'email' ? 'email' : 'celular'}</h3>
        <p className="text-gray-400 mb-6">
          Enviamos instruções de recuperação para {identifier}
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao login
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <Link href="/login" className="text-gray-400 hover:text-white mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-white">Recuperar conta</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            method === 'email'
              ? 'bg-delta-green-500 text-white'
              : 'bg-delta-navy-700 text-gray-400 hover:bg-delta-navy-600'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            method === 'phone'
              ? 'bg-delta-green-500 text-white'
              : 'bg-delta-navy-700 text-gray-400 hover:bg-delta-navy-600'
          }`}
        >
          <Phone className="w-4 h-4" />
          Celular
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type={method === 'email' ? 'email' : 'tel'}
          placeholder={method === 'email' ? 'Digite seu email' : 'Digite seu celular'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          <Send className="mr-2 w-4 h-4" />
          Enviar instruções
        </Button>
      </form>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Você receberá um código de verificação para redefinir sua senha.
      </p>
    </motion.div>
  );
}