export type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'RATING';

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  order: number;
  options: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerPayload {
  questionId: string;
  value: string | string[];
}

export interface SubmitResponsePayload {
  respondent?: string;
  answers: AnswerPayload[];
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  type: QuestionType;
  totalAnswers: number;
  optionCounts?: Record<string, number>;
  textAnswers?: string[];
  average?: number;
}

export interface SurveyResults {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  questions: QuestionResult[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
