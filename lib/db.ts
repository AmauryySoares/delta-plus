import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User, StudyArea, Question, QuestionAttempt, StudySession } from '@/types';

interface DeltaDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string; 'by-phone': string };
  };
  studyAreas: {
    key: string;
    value: StudyArea;
    indexes: { 'by-user': string };
  };
  questions: {
    key: string;
    value: Question;
    indexes: { 'by-user': string; 'by-area': string; 'by-subject': string };
  };
  attempts: {
    key: string;
    value: QuestionAttempt;
    indexes: { 'by-user': string; 'by-question': string; 'by-date': string };
  };
  sessions: {
    key: string;
    value: StudySession;
    indexes: { 'by-user': string };
  };
}

const DB_NAME = 'DeltaPlusDB';
const DB_VERSION = 1;

let db: IDBPDatabase<DeltaDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<DeltaDB>> {
  if (db) return db;

  db = await openDB<DeltaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      const userStore = db.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('by-email', 'email', { unique: true });
      userStore.createIndex('by-phone', 'phone', { unique: true });

      // Study areas store
      const areaStore = db.createObjectStore('studyAreas', { keyPath: 'id' });
      areaStore.createIndex('by-user', 'userId');

      // Questions store
      const questionStore = db.createObjectStore('questions', { keyPath: 'id' });
      questionStore.createIndex('by-user', 'userId');
      questionStore.createIndex('by-area', 'areaId');
      questionStore.createIndex('by-subject', 'subjectId');

      // Attempts store
      const attemptStore = db.createObjectStore('attempts', { keyPath: 'id' });
      attemptStore.createIndex('by-user', 'userId');
      attemptStore.createIndex('by-question', 'questionId');
      attemptStore.createIndex('by-date', 'answeredAt');

      // Sessions store
      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-user', 'userId');
    },
  });

  return db;
}

// User operations
export async function createUser(user: User): Promise<void> {
  const database = await initDB();
  await database.add('users', user);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const database = await initDB();
  return database.getFromIndex('users', 'by-email', email);
}

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  const database = await initDB();
  return database.getFromIndex('users', 'by-phone', phone);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const database = await initDB();
  return database.get('users', id);
}

export async function updateUser(user: User): Promise<void> {
  const database = await initDB();
  await database.put('users', user);
}

// Study area operations
export async function createStudyArea(area: StudyArea): Promise<void> {
  const database = await initDB();
  await database.add('studyAreas', area);
}

export async function getStudyAreasByUser(userId: string): Promise<StudyArea[]> {
  const database = await initDB();
  return database.getAllFromIndex('studyAreas', 'by-user', userId);
}

export async function updateStudyArea(area: StudyArea): Promise<void> {
  const database = await initDB();
  await database.put('studyAreas', area);
}

// Question operations
export async function createQuestion(question: Question): Promise<void> {
  const database = await initDB();
  await database.add('questions', question);
}

export async function getQuestionsByUser(userId: string): Promise<Question[]> {
  const database = await initDB();
  return database.getAllFromIndex('questions', 'by-user', userId);
}

export async function getQuestionsByArea(areaId: string): Promise<Question[]> {
  const database = await initDB();
  return database.getAllFromIndex('questions', 'by-area', areaId);
}

export async function getQuestionsBySubject(subjectId: string): Promise<Question[]> {
  const database = await initDB();
  return database.getAllFromIndex('questions', 'by-subject', subjectId);
}

export async function updateQuestion(question: Question): Promise<void> {
  const database = await initDB();
  await database.put('questions', question);
}

// Attempt operations
export async function createAttempt(attempt: QuestionAttempt): Promise<void> {
  const database = await initDB();
  await database.add('attempts', attempt);
  
  // Update question stats
  const question = await database.get('questions', attempt.questionId);
  if (question) {
    question.timesAnswered += 1;
    if (attempt.isCorrect) {
      question.timesCorrect += 1;
    }
    await database.put('questions', question);
  }
}

export async function getAttemptsByUser(userId: string): Promise<QuestionAttempt[]> {
  const database = await initDB();
  return database.getAllFromIndex('attempts', 'by-user', userId);
}

export async function getAttemptsByQuestion(questionId: string): Promise<QuestionAttempt[]> {
  const database = await initDB();
  return database.getAllFromIndex('attempts', 'by-question', questionId);
}

// Session operations
export async function createSession(session: StudySession): Promise<void> {
  const database = await initDB();
  await database.add('sessions', session);
}

export async function updateSession(session: StudySession): Promise<void> {
  const database = await initDB();
  await database.put('sessions', session);
}

export async function getSessionsByUser(userId: string): Promise<StudySession[]> {
  const database = await initDB();
  return database.getAllFromIndex('sessions', 'by-user', userId);
}