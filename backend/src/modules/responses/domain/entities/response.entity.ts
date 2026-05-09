import { BaseEntity } from '@shared/domain/base.entity';

export interface AnswerData {
  questionId: string;
  value: string | string[];
}

export class SurveyResponse extends BaseEntity {
  constructor(
    id: string,
    public readonly surveyId: string,
    public readonly respondent: string | null,
    public readonly answers: AnswerData[],
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(params: { id: string; surveyId: string; respondent?: string; answers: AnswerData[] }): SurveyResponse {
    const now = new Date();
    return new SurveyResponse(params.id, params.surveyId, params.respondent ?? null, params.answers, now, now);
  }
}
