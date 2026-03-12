'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Brain, 
  ArrowRight,
  RotateCcw,
  BookOpen,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { getQuestionsByUser, getQuestionsByArea, createAttempt } from '@/lib/db';
import { aiService } from '@/lib/ai-mock';
import { Question, QuestionAttempt } from '@/types';
import { generateId } from '@/lib/utils';

type PracticeState = 
  | 'loading'
  | 'ready'
  | 'answering'
  | 'feedback'
  | 'finished';

export default function PracticePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const areaId = searchParams.get('area');

  const [state, setState] = useState<PracticeState>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    timeSpent: 0,
  });
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  useEffect(() => {
    if (user) loadQuestions();
  }, [user, areaId]);

  const loadQuestions = async () => {
    let loadedQuestions: Question[];
    
    if (areaId) {
      loadedQuestions = await getQuestionsByArea(areaId);
    } else {
      loadedQuestions = await getQuestionsByUser(user!.id);
    }

    // Se não houver questões, gerar mocks
    if (loadedQuestions.length === 0) {
      const mockQuestions = await aiService.generateQuestions('Geral', 'Geral', 'medium', 5);
      loadedQuestions = mockQuestions.map(q => ({
        ...q,
        id: generateId(),
        userId: user!.id,
        areaId: areaId || 'default',
        subjectId: 'default',
        topicId: 'default',
      })) as Question[];
    }

    // Embaralhar questões
    const shuffled = loadedQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10)); // Máximo 10 por sessão
    setState('ready');
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (answer: string) => {
    if (state !== 'ready' && state !== 'answering') return;
    
    setSelectedAnswer(answer);
    setState('answering');
  };

  const handleConfirmAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor(Math.random() * 60) + 30; // Simula tempo

    // Salvar tentativa
    const attempt: QuestionAttempt = {
      id: generateId(),
      userId: user!.id,
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      answeredAt: new Date().toISOString(),
      usedAIHelp: showAIExplanation,
    };

    await createAttempt(attempt);

    setSessionStats(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong,
      timeSpent: prev.timeSpent + timeSpent,
    }));

    setState('feedback');
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAIExplanation(false);
      setAiExplanation('');
      setState('ready');
    } else {
      setState('finished');
    }
  };

  const handleAIExplain = async () => {
    if (!currentQuestion) return;
    
    const explanation = await aiService.explainQuestion(currentQuestion, selectedAnswer || undefined);
    setAiExplanation(explanation.detailedAnalysis);
    setShowAIExplanation(true);
  };

  const handleGenerateSimilar = async () => {
    if (!currentQuestion) return;
    
    const similar = await aiService.generateQuestions(
      currentQuestion.topicId,
      currentQuestion.subjectId,
      currentQuestion.difficulty,
      1
    );
    
    // Adicionar à lista (simplificado)
    alert('Questões similares geradas! (Mock)');
  };

  if (state === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-delta-green-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  if (state === 'finished') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-delta-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-delta-green-500" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Sessão Concluída!</h2>
            <p className="text-gray-400 mb-8">Veja seu desempenho abaixo</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-delta-navy-700/50 rounded-xl">
                <p className="text-3xl font-bold text-delta-green-400">{sessionStats.correct}</p>
                <p className="text-sm text-gray-400">Acertos</p>
              </div>
              <div className="p-4 bg-delta-navy-700/50 rounded-xl">
                <p className="text-3xl font-bold text-red-400">{sessionStats.wrong}</p>
                <p className="text-sm text-gray-400">Erros</p>
              </div>
              <div className="p-4 bg-delta-navy-700/50 rounded-xl">
                <p className="text-3xl font-bold text-blue-400">
                  {Math.round((sessionStats.correct / questions.length) * 100)}%
                </p>
                <p className="text-sm text-gray-400">Aproveitamento</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                <RotateCcw className="mr-2 w-4 h-4" />
                Nova Sessão
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/review'}>
                <BookOpen className="mr-2 w-4 h-4" />
                Revisar Erros
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <div className="w-32 h-2 bg-delta-navy-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-delta-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.floor(sessionStats.timeSpent / 60)}m</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="space-y-6">
              {/* Question Text */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                   currentQuestion.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </span>
                <h3 className="text-xl font-medium text-white leading-relaxed">
                  {currentQuestion.statement}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = selectedAnswer === idx.toString();
                  const isCorrect = currentQuestion.correctAnswer === idx.toString();
                  const showCorrect = state === 'feedback' && isCorrect;
                  const showWrong = state === 'feedback' && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={state === 'ready' ? { scale: 1.02 } : {}}
                      whileTap={state === 'ready' ? { scale: 0.98 } : {}}
                      onClick={() => state === 'ready' && handleAnswer(idx.toString())}
                      disabled={state !== 'ready'}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-delta-green-500 bg-delta-green-500/10'
                          : 'border-delta-navy-600 hover:border-delta-navy-500'
                      } ${showCorrect ? 'border-green-500 bg-green-500/20' : ''} ${
                        showWrong ? 'border-red-500 bg-red-500/20' : ''
                      } ${state !== 'ready' && !isSelected && !isCorrect ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${
                          isSelected
                            ? 'bg-delta-green-500 text-white'
                            : 'bg-delta-navy-700 text-gray-400'
                        } ${showCorrect ? 'bg-green-500' : ''} ${showWrong ? 'bg-red-500' : ''}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-white">{option}</span>
                        {showCorrect && <CheckCircle className="ml-auto w-5 h-5 text-green-500" />}
                        {showWrong && <XCircle className="ml-auto w-5 h-5 text-red-500" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Actions */}
              {state === 'ready' && selectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button onClick={handleConfirmAnswer} className="w-full" size="lg">
                    Confirmar Resposta
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {/* Feedback */}
              {state === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-xl ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-400">Resposta Correta!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-400">Resposta Incorreta</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
                  </div>

                  {/* AI Help */}
                  {!showAIExplanation ? (
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleAIExplain} className="flex-1">
                        <Sparkles className="mr-2 w-4 h-4" />
                        Explicação da IA
                      </Button>
                      <Button variant="outline" onClick={handleGenerateSimilar}>
                        <Brain className="mr-2 w-4 h-4" />
                        Questões Similares
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-delta-navy-700/50 rounded-xl border border-delta-navy-600"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-delta-green-400" />
                        <span className="font-medium text-delta-green-400">Explicação da IA</span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-line">{aiExplanation}</p>
                    </motion.div>
                  )}

                  <Button onClick={handleNext} className="w-full" size="lg">
                    {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}