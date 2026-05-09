import { QuestionTypeValue } from '../../domain/value-objects/question-type.vo';

export interface CreateQuestionDto {
  surveyId: string;
  text: string;
  type: QuestionTypeValue;
  order: number;
  options?: string[];
}
