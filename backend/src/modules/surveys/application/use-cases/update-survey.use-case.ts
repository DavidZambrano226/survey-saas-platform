import { inject, injectable } from 'tsyringe';
import { Survey } from '../../domain/entities/survey.entity';
import { SurveyRepository } from '../../domain/repositories/survey.repository';
import { UpdateSurveyDto } from '../dtos/update-survey.dto';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class UpdateSurveyUseCase {
  constructor(
    @inject('SurveyRepository')
    private readonly surveyRepository: SurveyRepository
  ) {}

  async execute(id: string, dto: UpdateSurveyDto): Promise<Survey> {
    const exists = await this.surveyRepository.findById(id);
    if (!exists) throw new AppError(`Survey with id ${id} not found`, 404);
    return this.surveyRepository.update(id, dto);
  }
}
