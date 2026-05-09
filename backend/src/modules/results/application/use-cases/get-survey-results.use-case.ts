import { inject, injectable } from 'tsyringe';
import { ResultsRepository, SurveyResults } from '../../domain/repositories/results.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class GetSurveyResultsUseCase {
  constructor(
    @inject('ResultsRepository')
    private readonly resultsRepository: ResultsRepository
  ) {}

  async execute(surveyId: string): Promise<SurveyResults> {
    if (!surveyId) throw new AppError('Survey ID is required', 400);
    return this.resultsRepository.getSurveyResults(surveyId);
  }
}
