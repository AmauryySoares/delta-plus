'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save,
  Target,
  Moon,
  Sun
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/components/providers/AuthProvider';
import { calculateAge } from '@/lib/utils';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dailyGoal: user?.preferences.dailyGoal || 10,
  });

  const handleSave = async () => {
    // Em MVP, salvar no localStorage
    const updatedUser = {
      ...user!,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      preferences: {
        ...user!.preferences,
        dailyGoal: formData.dailyGoal,
      },
    };
    
    localStorage.setItem('delta_current_user', JSON.stringify(updatedUser));
    refreshUser();
    setIsEditing(false);
  };

  if (!user) return null;

  const age = calculateAge(user.birthDate);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <Button 
            variant={isEditing ? 'primary' : 'outline'}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 w-4 h-4" />
                Salvar
              </>
            ) : (
              'Editar Perfil'
            )}
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="text-center py-8">
          <div className="w-24 h-24 bg-gradient-to-br from-delta-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
          <p className="text-gray-400">{age} anos • Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
        </Card>

        {/* Info */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Informações Pessoais</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="text-white">{user.fullName}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-gray-500" />
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Celular</p>
                  <p className="text-white">{user.phone}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="text-white">{new Date(user.birthDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Preferências</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-delta-green-400" />
                <div>
                  <p className="text-white">Meta Diária</p>
                  <p className="text-sm text-gray-500">Questões por dia</p>
                </div>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.dailyGoal}
                  onChange={(e) => setFormData({ ...formData, dailyGoal: parseInt(e.target.value) || 10 })}
                  className="w-20 px-3 py-2 bg-delta-navy-700 border border-delta-navy-600 rounded-lg text-white text-center"
                  min="1"
                  max="100"
                />
              ) : (
                <span className="text-2xl font-bold text-delta-green-400">{user.preferences.dailyGoal}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white">Tema</p>
                  <p className="text-sm text-gray-500">Aparência do app</p>
                </div>
              </div>
              <span className="text-white capitalize">{user.preferences.theme}</span>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-delta-navy-700/50 rounded-xl text-center">
              <p className="text-3xl font-bold text-delta-green-400">{user.stats.totalQuestions}</p>
              <p className="text-sm text-gray-400">Questões Resolvidas</p>
            </div>
            <div className="p-4 bg-delta-navy-700/50 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-400">{user.stats.streakDays}</p>
              <p className="text-sm text-gray-400">Dias Seguidos</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}