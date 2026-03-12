'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  ArrowLeft, 
  MoreVertical,
  Brain,
  Target
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { getStudyAreasByUser, updateStudyArea } from '@/lib/db';
import { getQuestionsByArea } from '@/lib/db';
import { StudyArea, Subject, Question } from '@/types';
import { generateId } from '@/lib/utils';
import Link from 'next/link';

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [area, setArea] = useState<StudyArea | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user, params.id]);

  const loadData = async () => {
    const areas = await getStudyAreasByUser(user!.id);
    const currentArea = areas.find(a => a.id === params.id);
    if (currentArea) {
      setArea(currentArea);
      const areaQuestions = await getQuestionsByArea(currentArea.id);
      setQuestions(areaQuestions);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !area) return;

    const newSubject: Subject = {
      id: generateId(),
      areaId: area.id,
      name: newSubjectName,
      topics: [],
    };

    const updatedArea = {
      ...area,
      subjects: [...area.subjects, newSubject],
    };

    await updateStudyArea(updatedArea);
    setArea(updatedArea);
    setNewSubjectName('');
    setIsAddingSubject(false);
  };

  if (!area) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-delta-green-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/study/areas')}
            className="p-2 hover:bg-delta-navy-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{area.name}</h1>
            <p className="text-gray-400">{area.subjects.length} matérias • {questions.length} questões</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{questions.length}</p>
              <p className="text-sm text-gray-400">Questões</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{area.subjects.length}</p>
              <p className="text-sm text-gray-400">Matérias</p>
            </div>
          </Card>
          <Link href={`/study/practice?area=${area.id}`}>
            <Card className="flex items-center gap-4 h-full cursor-pointer hover:border-delta-green-500/50">
              <div className="p-3 bg-delta-green-500/10 rounded-xl">
                <Brain className="w-6 h-6 text-delta-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Praticar</p>
                <p className="text-sm text-gray-400">Iniciar sessão</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Add Subject */}
        {isAddingSubject ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-delta-navy-800/50 border border-delta-navy-600 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nome da matéria"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 px-4 py-2 bg-delta-navy-700 border border-delta-navy-600 rounded-lg text-white focus:border-delta-green-500 focus:outline-none"
                autoFocus
              />
              <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()}>
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setIsAddingSubject(false)}>
                Cancelar
              </Button>
            </div>
          </motion.div>
        ) : (
          <Button variant="outline" onClick={() => setIsAddingSubject(true)}>
            <Plus className="mr-2 w-4 h-4" />
            Adicionar Matéria
          </Button>
        )}

        {/* Subjects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {area.subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
                    <p className="text-sm text-gray-400">{subject.topics.length} tópicos</p>
                  </div>
                  <button className="p-2 hover:bg-delta-navy-700 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {area.subjects.length === 0 && (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-delta-navy-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma matéria</h3>
            <p className="text-gray-400">Adicione matérias para organizar seus estudos</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}