import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { Survey } from '../../domain/entities/survey.entity';
import { SurveyRepository } from '../../domain/repositories/survey.repository';
import { CreateSurveyDto } from '../dtos/create-survey.dto';

@injectable()
export class CreateSurveyUseCase {
  constructor(
    @inject('SurveyRepository')
    private readonly surveyRepository: SurveyRepository
  ) {}

  async execute(dto: CreateSurveyDto): Promise<Survey> {
    const survey = Survey.create({ id: uuidv4(), ...dto });
    return this.surveyRepository.save(survey);
  }
}
