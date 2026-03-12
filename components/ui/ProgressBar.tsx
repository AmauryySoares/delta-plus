'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ 
  progress, 
  className, 
  color = 'bg-delta-green-500',
  height = 8,
  showLabel = true 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn('w-full', className)}>
      <div 
        className="w-full bg-delta-navy-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Progresso</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
}