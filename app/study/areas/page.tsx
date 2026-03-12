'use client'

import { useState } from 'react'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, ChevronRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { getStudyAreasByUser, createStudyArea, updateStudyArea } from '@/lib/db';
import { StudyArea } from '@/types';
import { generateId } from '@/lib/utils';
import Link from 'next/link';

const PRESET_AREAS = [
  { name: 'Concursos', icon: '🏛️' },
  { name: 'ENEM', icon: '🎓' },
  { name: 'Vestibular', icon: '📚' },
  { name: 'Matemática', icon: '📐' },
  { name: 'Direito', icon: '⚖️' },
  { name: 'Programação', icon: '💻' },
  { name: 'Medicina', icon: '🏥' },
  { name: 'Idiomas', icon: '🌍' },
];

export default function AreasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [areas, setAreas] = useState<StudyArea[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadAreas();
  }, [user]);

  const loadAreas = async () => {
    const userAreas = await getStudyAreasByUser(user!.id);
    setAreas(userAreas);
  };

  const handleCreateArea = async () => {
    if (!newAreaName.trim() || !user) return;

    const newArea: StudyArea = {
      id: generateId(),
      userId: user.id,
      name: newAreaName,
      description: '',
      subjects: [],
      createdAt: new Date().toISOString(),
    };

    await createStudyArea(newArea);
    setAreas([...areas, newArea]);
    setNewAreaName('');
    setIsCreating(false);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (name: string) => {
    setNewAreaName(name);
    setSelectedPreset(name);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Áreas de Estudo</h1>
            <p className="text-gray-400 mt-1">Organize seus estudos por áreas e matérias</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 w-5 h-5" />
            Nova Área
          </Button>
        </div>

        {/* Create Area Modal */}
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-delta-navy-800/50 border border-delta-navy-600 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Criar Nova Área</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Escolha uma área pré-definida ou crie personalizada:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESET_AREAS.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => handlePresetSelect(area.name)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedPreset === area.name
                        ? 'border-delta-green-500 bg-delta-green-500/10'
                        : 'border-delta-navy-600 hover:border-delta-navy-500'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{area.icon}</span>
                    <span className="text-sm text-white">{area.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nome da área"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="flex-1 px-4 py-2 bg-delta-navy-700 border border-delta-navy-600 rounded-lg text-white focus:border-delta-green-500 focus:outline-none"
              />
              <Button onClick={handleCreateArea} disabled={!newAreaName.trim()}>
                Criar
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Areas Grid */}
        {areas.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 text-delta-navy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma área criada</h3>
            <p className="text-gray-400 mb-6">Comece criando sua primeira área de estudo</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 w-5 h-5" />
              Criar Área
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AreaCard area={area} onUpdate={loadAreas} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AreaCard({ area, onUpdate }: { area: StudyArea; onUpdate: () => void }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className="relative group">
      <div 
        className="cursor-pointer"
        onClick={() => router.push(`/study/areas/${area.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-delta-green-500/10 rounded-xl">
            <BookOpen className="w-6 h-6 text-delta-green-400" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!is