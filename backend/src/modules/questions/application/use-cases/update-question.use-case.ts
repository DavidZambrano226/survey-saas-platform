import { inject, injectable } from 'tsyringe';
import { Question } from '../../domain/entities/question.entity';
import { QuestionRepository } from '../../domain/repositories/question.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class UpdateQuestionUseCase {
  constructor(
    @inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute(id: string, data: Partial<{ text: string; order: number; options: string[] }>): Promise<Question> {
    const exists = await this.questionRepository.findById(id);
    if (!exists) throw new AppError(`Question with id ${id} not found`, 404);
    return this.questionRepository.update(id, data);
  }
}
