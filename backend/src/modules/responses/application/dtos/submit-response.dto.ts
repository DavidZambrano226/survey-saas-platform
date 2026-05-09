export interface AnswerDto {
  questionId: string;
  value: string | string[];
}

export interface SubmitResponseDto {
  surveyId: string;
  respondent?: string;
  answers: AnswerDto[];
}
