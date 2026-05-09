import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { SurveyResponse } from '../../domain/entities/response.entity';
import { ResponseRepository } from '../../domain/repositories/response.repository';
import { SubmitResponseDto } from '../dtos/submit-response.dto';
import { SurveyRepository } from '@modules/surveys/domain/repositories/survey.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class SubmitResponseUseCase {
  constructor(
    @inject('ResponseRepository')
    private readonly responseRepository: ResponseRepository,
    @inject('SurveyRepository')
    private readonly surveyRepository: SurveyRepository
  ) {}

  async execute(dto: SubmitResponseDto): Promise<SurveyResponse> {
    const survey = await this.surveyRepository.findById(dto.surveyId);
    if (!survey) throw new AppError(`Survey with id ${dto.surveyId} not found`, 404);
    if (!survey.isPublished()) throw new AppError('Survey is not published', 400);

    const response = SurveyResponse.create({ id: uuidv4(), ...dto });
    return this.responseRepository.save(response);
  }
}
