import { inject, injectable } from 'tsyringe';
import { SurveyRepository } from '../../domain/repositories/survey.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class DeleteSurveyUseCase {
  constructor(
    @inject('SurveyRepository')
    private readonly surveyRepository: SurveyRepository
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.surveyRepository.findById(id);
    if (!exists) throw new AppError(`Survey with id ${id} not found`, 404);
    await this.surveyRepository.delete(id);
  }
}
