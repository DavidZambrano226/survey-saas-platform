import { Survey } from '../entities/survey.entity';

// Puerto (interfaz) — el dominio no sabe nada de Prisma
export interface SurveyRepository {
  findAll(): Promise<Survey[]>;
  findById(id: string): Promise<Survey | null>;
  save(survey: Survey): Promise<Survey>;
  update(id: string, data: Partial<Pick<Survey, 'title' | 'description'> & { status: string }>): Promise<Survey>;
  delete(id: string): Promise<void>;
}
