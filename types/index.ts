export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
  createdAt: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  dailyGoal: number;
  studyAreas: string[];
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  streakDays: number;
  lastStudyDate: string | null;
  totalStudyTime: number;
}

export interface StudyArea {
  id: string;
  userId: string;
  name: string;
  description: string;
  subjects: Subject[];
  createdAt: string;
}

export interface Subject {
  id: string;
  areaId: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
}

export interface Question {
  id: string;
  userId: string;
  areaId: string;
  subjectId: string;
  topicId: string;
  type: 'multiple_choice' | 'true_false' | 'open' | 'fill_blank' | 'flashcard';
  statement: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  explanationPerOption?: Record<string, string>;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  source: 'manual' | 'ai';
  timesAnswered: number;
  timesCorrect: number;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: string;
  usedAIHelp: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  areaId: string;
  mode: 'practice' | 'challenge' | 'review';
  questions: string[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  startTime: string;
  endTime?: string;
}

export interface WeaknessMap {
  subjectId: string;
  subjectName: string;
  topics: {
    topicId: string;
    topicName: string;
    accuracy: number;
    totalAttempts: number;
  }[];
}