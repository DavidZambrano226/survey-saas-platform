import { SurveyStatusType } from '../../domain/value-objects/survey-status.vo';

export interface UpdateSurveyDto {
  title?: string;
  description?: string;
  status?: SurveyStatusType;
}
