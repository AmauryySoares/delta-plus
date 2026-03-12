import { User } from '@/types';
import { getUserByEmail, getUserByPhone, updateUser } from './db';
import { generateId } from './utils';

const CURRENT_USER_KEY = 'delta_current_user';

export async function registerUser(userData: {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email exists
    const existingEmail = await getUserByEmail(userData.email);
    if (existingEmail) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Check if phone exists
    const existingPhone = await getUserByPhone(userData.phone);
    if (existingPhone) {
      return { success: false, error: 'Telefone já cadastrado' };
    }

    const newUser: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        dailyGoal: 10,
        studyAreas: [],
      },
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        streakDays: 0,
        lastStudyDate: null,
        totalStudyTime: 0,
      },
    };

    const { createUser } = await import('./db');
    await createUser(newUser);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao criar conta' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Email não encontrado' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Senha incorreta' };
    }

    // Save current user to localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Erro ao fazer login' };
  }
}

export async function recoverAccount(identifier: string, type: 'email' | 'phone'): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    let user: User | undefined;
    
    if (type === 'email') {
      user = await getUserByEmail(identifier);
    } else {
      user = await getUserByPhone(identifier);
    }

    if (!user) {
      return { success: false, error: 'Conta não encontrada' };
    }

    // In real app, send recovery code via email/SMS
    return { 
      success: true, 
      message: `Instruções de recuperação enviadas para ${type === 'email' ? 'seu email' : 'seu celular'}` 
    };
  } catch (error) {
    return { success: false, error: 'Erro ao recuperar conta' };
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}