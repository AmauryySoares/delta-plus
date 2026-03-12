'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  Brain,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { calculateAge, calculateAccuracy, formatTime } from '@/lib/utils';
import { getAttemptsByUser, getStudyAreasByUser, getQuestionsByUser } from '@/lib/db';
import { QuestionAttempt, StudyArea, Question } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    studyTime: 0,
    streak: 0,
    areasCount: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState<QuestionAttempt[]>([]);
  const [areas, setAreas] = useState<StudyArea[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, isLoading, router]);

  const loadDashboardData = async () => {
    try {
      const [attempts, userAreas, questions] = await Promise.all([
        getAttemptsByUser(user!.id),
        getStudyAreasByUser(user!.id),
        getQuestionsByUser(user!.id),
      ]);

      const correct = attempts.filter(a => a.isCorrect).length;
      const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0);

      setStats({
        totalQuestions: attempts.length,
        correctAnswers: correct,
        accuracy: calculateAccuracy(correct, attempts.length),
        studyTime: totalTime,
        streak: user!.stats.streakDays,
        areasCount: userAreas.length,
      });

      setRecentAttempts(attempts.slice(-5).reverse());
      setAreas(userAreas.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-delta-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const age = calculateAge(user.birthDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Olá, {user.fullName.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              {age} anos • {stats.streak > 0 && (
                <span className="inline-flex items-center text-orange-400">
                  <Flame className="w-4 h-4 mr-1" />
                  {stats.streak} dias seguidos
                </span>
              )}
            </p>
          </div>
          <Link href="/study/areas">
            <Button>
              <Brain className="mr-2 w-5 h-5" />
              Novo Estudo
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Target}
            label="Taxa de Acerto"
            value={`${stats.accuracy}%`}
            color="text-delta-green-400"
            bgColor="bg-delta-green-500/10"
          />
          <StatCard
            icon={BookOpen}
            label="Questões Resolvidas"
            value={stats.totalQuestions.toString()}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            icon={Clock}
            label="Tempo de Estudo"
            value={formatTime(stats.studyTime)}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
          />
          <StatCard
            icon={Award}
            label="Áreas de Estudo"
            value={stats.areasCount.toString()}
            color="text-yellow-400"
            bgColor="bg-yellow-500/10"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Goal */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Target className="mr-2 w-5 h-5 text-delta-green-400" />
                Meta Diária
              </h3>
              <span className="text-sm text-gray-400">
                {Math.min(stats.totalQuestions, user.preferences.dailyGoal)} / {user.preferences.dailyGoal} questões
              </span>
            </div>
            <ProgressBar 
              progress={(stats.totalQuestions / user.preferences.dailyGoal) * 100} 
              height={12}
            />
            <p className="mt-3 text-sm text-gray-400">
              {stats.totalQuestions >= user.preferences.dailyGoal 
                ? '🎉 Parabéns! Meta diária atingida!'
                : `Faltam ${user.preferences.dailyGoal - stats.totalQuestions} questões para atingir sua meta`
              }
            </p>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <QuickAction 
                href="/study/practice"
                icon={Brain}
                label="Modo Prática"
                description="Questões aleatórias"
              />
              <QuickAction 
                href="/review"
                icon={TrendingUp}
                label="Revisar Erros"
                description={`${attempts.filter(a => !a.isCorrect).length} questões para revisar`}
              />
              <QuickAction 
                href="/study/areas/new"
                icon={BookOpen}
                label="Nova Área"
                description="Criar área de estudo"
              />
            </div>
          </Card>
        </div>

        {/* Study Areas */}
        {areas.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Suas Áreas de Estudo</h3>
              <Link href="/study/areas" className="text-delta-green-400 text-sm hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {areas.map((area) => (
                <motion.div
                  key={area.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-delta-navy-700/50 rounded-lg border border-delta-navy-600 cursor-pointer"
                  onClick={() => router.push(`/study/areas/${area.id}`)}
                >
                  <h4 className="font-medium text-white">{area.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {area.subjects.length} matérias
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        {recentAttempts.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {recentAttempts.map((attempt, index) => (
                <div 
                  key={attempt.id}
                  className="flex items-center justify-between p-3 bg-delta-navy-700/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${attempt.isCorrect ? 'bg-delta-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm text-white">Questão resolvida</p>
                      <p className="text-xs text-gray-500">
                        {new Date(attempt.answeredAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${attempt.isCorrect ? 'text-delta-green-400' : 'text-red-400'}`}>
                    {attempt.isCorrect ? 'Acertou' : 'Errou'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  bgColor 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </Card>
  );
}

function QuickAction({ 
  href, 
  icon: Icon, 
  label, 
  description 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  description: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center justify-between p-3 bg-delta-navy-700/30 rounded-lg hover:bg-delta-navy-700/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-delta-navy-600 rounded-lg">
            <Icon className="w-4 h-4 text-delta-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </motion.div>
    </Link>
  );
}