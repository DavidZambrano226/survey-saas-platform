import { inject, injectable } from 'tsyringe';
import { Survey } from '../../domain/entities/survey.entity';
import { SurveyRepository } from '../../domain/repositories/survey.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class GetSurveyUseCase {
  constructor(
    @inject('SurveyRepository')
    private readonly surveyRepository: SurveyRepository
  ) {}

  async findAll(): Promise<Survey[]> {
    return this.surveyRepository.findAll();
  }

  async findById(id: string): Promise<Survey> {
    const survey = await this.surveyRepository.findById(id);
    if (!survey) throw new AppError(`Survey with id ${id} not found`, 404);
    return survey;
  }
}
