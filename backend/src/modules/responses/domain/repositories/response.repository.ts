import { SurveyResponse } from '../entities/response.entity';

export interface ResponseRepository {
  save(response: SurveyResponse): Promise<SurveyResponse>;
  findBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  countBySurveyId(surveyId: string): Promise<number>;
}
