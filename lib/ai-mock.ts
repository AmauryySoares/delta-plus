import { Question, StudyArea, Subject, Topic } from '@/types';

// Interface para futura integração com Gemini
export interface AIConfig {
  apiKey?: string;
  model?: string;
  enabled: boolean;
}

class AIMockService {
  private config: AIConfig = { enabled: false };

  setConfig(config: AIConfig) {
    this.config = config;
  }

  // Simula geração de questões (futuro: chamar Gemini API)
  async generateQuestions(
    topic: string,
    subject: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 1
  ): Promise<Partial<Question>[]> {
    // Mock database de questões por tema
    const mockQuestions: Record<string, Partial<Question>[]> = {
      'interpretação de texto': [
        {
          statement: 'Leia o trecho: "A educação é a arma mais poderosa que você pode usar para mudar o mundo." (Nelson Mandela). Qual é a interpretação correta sobre o valor da educação segundo o autor?',
          options: [
            'A educação é apenas uma ferramenta para obter emprego',
            'A educação tem poder transformador na sociedade',
            'A educação é importante apenas para políticos',
            'A educação não tem relação com mudanças sociais'
          ],
          correctAnswer: '1', // índice da resposta correta
          explanation: 'Nelson Mandela enfatiza o poder da educação como agente de transformação social, não apenas como meio de obtenção de emprego ou benefício pessoal.',
          explanationPerOption: {
            '0': 'Incorreta. O autor vai além do aspecto profissional.',
            '1': 'Correta. Mandela destaca o poder da educação para transformar a sociedade.',
            '2': 'Incorreta. A educação é para todos, não apenas políticos.',
            '3': 'Incorreta. Contradiz diretamente a afirmação do autor.'
          },
          type: 'multiple_choice',
          difficulty: 'medium',
        }
      ],
      'regra de três': [
        {
          statement: 'Se 8 trabalhadores constroem um muro em 6 dias, quantos dias levarão 12 trabalhadores para construir o mesmo muro, trabalhando no mesmo ritmo?',
          options: [
            '8 dias',
            '4 dias',
            '9 dias',
            '3 dias'
          ],
          correctAnswer: '1',
          explanation: 'Regra de três inversamente proporcional: 8 × 6 = 12 × x → x = 48/12 = 4 dias.',
          explanationPerOption: {
            '0': 'Incorreta. Não segue a proporção inversa.',
            '1': 'Correta. 8 × 6 = 12 × 4 = 48.',
            '2': 'Incorreta. Cálculo errado da proporção.',
            '3': 'Incorreta. Divisão incorreta.'
          },
          type: 'multiple_choice',
          difficulty: 'medium',
        }
      ],
      'default': [
        {
          statement: `Questão gerada sobre ${topic}: Qual é a importância de estudar este assunto regularmente?`,
          options: [
            'Não tem importância',
            'Ajuda na fixação do conteúdo',
            'É perda de tempo',
            'Só serve para provas'
          ],
          correctAnswer: '1',
          explanation: 'Estudar regularmente é fundamental para a consolidação do aprendizado e formação de hábitos de estudo.',
          explanationPerOption: {
            '0': 'Incorreta. O estudo sempre tem valor.',
            '1': 'Correta. A prática regular fortalece a memória.',
            '2': 'Incorreta. O estudo é investimento no futuro.',
            '3': 'Incorreta. O conhecimento vai além das avaliações.'
          },
          type: 'multiple_choice',
          difficulty: difficulty,
        }
      ]
    };

    const questions = mockQuestions[topic.toLowerCase()] || mockQuestions['default'];
    
    // Retorna cópias com IDs únicos
    return Array(count).fill(null).map((_, i) => ({
      ...questions[i % questions.length],
      source: 'ai' as const,
      createdAt: new Date().toISOString(),
      timesAnswered: 0,
      timesCorrect: 0,
    }));
  }

  // Explica uma questão (futuro: usar Gemini)
  async explainQuestion(question: Question, userAnswer?: string): Promise<{
    explanation: string;
    detailedAnalysis: string;
    similarTopics: string[];
  }> {
    return {
      explanation: question.explanation,
      detailedAnalysis: `Análise detalhada: ${question.explanation}\n\n` +
        (userAnswer ? `Sua resposta foi analisada. ${question.correctAnswer === userAnswer ? 'Você acertou!' : 'Vamos entender o erro.'}` : ''),
      similarTopics: [
        'Prática de questões similares',
        'Revisão do conteúdo teórico',
        'Exercícios complementares'
      ]
    };
  }

  // Gera resumo (futuro: usar Gemini)
  async generateSummary(content: string, topic: string): Promise<string> {
    return `Resumo sobre ${topic}:\n\n` +
      `• Ponto principal 1: Conceito fundamental do tema\n` +
      `• Ponto principal 2: Aplicação prática\n` +
      `• Ponto principal 3: Relação com outros assuntos\n\n` +
      `Este resumo foi gerado com base no conteúdo fornecido.`;
  }

  // Analisa fraquezas (futuro: usar Gemini com histórico)
  async analyzeWeaknesses(attempts: any[]): Promise<{
    weakAreas: string[];
    recommendations: string[];
  }> {
    return {
      weakAreas: ['Tema A - necessita revisão', 'Tema B - prática insuficiente'],
      recommendations: [
        'Focar em exercícios de nível médio',
        'Revisar teoria antes de praticar',
        'Criar flashcards para memorização'
      ]
    };
  }

  // Verifica se está usando IA real ou mock
  isRealAI(): boolean {
    return this.config.enabled && !!this.config.apiKey;
  }
}

export const aiService = new AIMockService();