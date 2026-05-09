import { Question } from '../entities/question.entity';

export interface QuestionRepository {
  findBySurveyId(surveyId: string): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
  save(question: Question): Promise<Question>;
  update(id: string, data: Partial<{ text: string; order: number; options: string[] }>): Promise<Question>;
  delete(id: string): Promise<void>;
  deleteBySurveyId(surveyId: string): Promise<void>;
}
