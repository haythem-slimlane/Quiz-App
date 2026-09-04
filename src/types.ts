export interface Question {
  id: number;
  testNumber: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export type QuizScreenState = 'home' | 'quiz' | 'result';
