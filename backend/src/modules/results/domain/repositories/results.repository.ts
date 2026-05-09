export interface QuestionResult {
  questionId: string;
  questionText: string;
  type: string;
  totalAnswers: number;
  // For choice questions: option counts
  optionCounts?: Record<string, number>;
  // For text questions: sample answers
  textAnswers?: string[];
  // For rating questions: average
  average?: number;
}

export interface SurveyResults {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  questions: QuestionResult[];
}

export interface ResultsRepository {
  getSurveyResults(surveyId: string): Promise<SurveyResults>;
}
