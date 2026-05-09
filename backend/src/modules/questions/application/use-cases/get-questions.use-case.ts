import { inject, injectable } from 'tsyringe';
import { Question } from '../../domain/entities/question.entity';
import { QuestionRepository } from '../../domain/repositories/question.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class GetQuestionsUseCase {
  constructor(
    @inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository
  ) {}

  async findBySurveyId(surveyId: string): Promise<Question[]> {
    return this.questionRepository.findBySurveyId(surveyId);
  }

  async findById(id: string): Promise<Question> {
    const question = await this.questionRepository.findById(id);
    if (!question) throw new AppError(`Question with id ${id} not found`, 404);
    return question;
  }
}
