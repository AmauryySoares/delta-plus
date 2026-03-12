'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-delta-navy-900 via-delta-navy-800 to-delta-navy-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-delta-green-500 to-emerald-600 mb-4 shadow-lg shadow-delta-green-500/30"
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Delta+</h1>
          <p className="text-gray-400">Estudos inteligentes, resultados extraordinários</p>
        </div>
        
        <div className="bg-delta-navy-800/50 backdrop-blur-xl border border-delta-navy-600 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}