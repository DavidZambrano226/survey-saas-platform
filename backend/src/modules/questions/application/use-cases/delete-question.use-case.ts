import { inject, injectable } from 'tsyringe';
import { QuestionRepository } from '../../domain/repositories/question.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class DeleteQuestionUseCase {
  constructor(
    @inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.questionRepository.findById(id);
    if (!exists) throw new AppError(`Question with id ${id} not found`, 404);
    await this.questionRepository.delete(id);
  }
}
