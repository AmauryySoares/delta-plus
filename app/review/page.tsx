'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  Brain,
  Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { getAttemptsByUser, getQuestionsByUser } from '@/lib/db';
import { QuestionAttempt, Question } from '@/types';

export default function ReviewPage() {
  const { user } = useAuth();
  const [wrongAttempts, setWrongAttempts] = useState<QuestionAttempt[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const attempts = await getAttemptsByUser(user!.id);
    const wrong = attempts.filter(a => !a.isCorrect).reverse();
    setWrongAttempts(wrong);

    const allQuestions = await getQuestionsByUser(user!.id);
    const questionsMap = Object.fromEntries(allQuestions.map(q => [q.id, q]));
    setQuestions(questionsMap);
  };

  const uniqueWrongQuestions = Array.from(
    new Map(wrongAttempts.map(a => [a.questionId, a])).values()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Revisão de Erros</h1>
          <p className="text-gray-400 mt-1">
            Você errou {uniqueWrongQuestions.length} questões. Hora de revisar!
          </p>
        </div>

        {uniqueWrongQuestions.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-delta-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Parabéns!</h3>
            <p className="text-gray-400">Você não tem erros para revisar. Continue assim!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-3">
              {uniqueWrongQuestions.map((attempt, index) => {
                const question = questions[attempt.questionId];
                if (!question) return null;

                return (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`cursor-pointer ${
                        selectedQuestion?.id === question.id ? 'border-delta-green-500' : ''
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white line-clamp-2">{question.statement}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(attempt.answeredAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Detail */}
            <div className="lg:sticky lg:top-8 h-fit">
              {selectedQuestion ? (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Detalhes da Questão</h3>
                  <p className="text-gray-300 mb-6">{selectedQuestion.statement}</p>
                  
                  <div className="space-y-2 mb-6">
                    {selectedQuestion.options?.map((option, idx) => {
                      const isCorrect = selectedQuestion.correctAnswer === idx.toString();
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-delta-navy-600 bg-delta-navy-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-sm ${
                              isCorrect ? 'bg-green-500 text-white' : 'bg-delta-navy-600 text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className={isCorrect ? 'text-green-400' : 'text-gray-300'}>
                              {option}
                            </span>
                            {isCorrect && <CheckCircle className="ml-auto w-4 h-4 text-green-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-delta-navy-700/50 rounded-xl mb-4">
                    <p className="text-sm font-medium text-delta-green-400 mb-1">Explicação:</p>
                    <p className="text-sm text-gray-300">{selectedQuestion.explanation}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Brain className="mr-2 w-4 h-4" />
                      Gerar Similares
                    </Button>
                    <Button variant="outline" className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-delta-navy-600 mx-auto mb-4" />
                  <p className="text-gray-400">Selecione uma questão para revisar</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}