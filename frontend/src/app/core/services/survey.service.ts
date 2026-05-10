import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, Survey, Question, SurveyResults, SubmitResponsePayload
} from '../models/survey.model';

// Single Responsibility: cada método hace una sola cosa
// DRY: url base y unwrap centralizados
@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/surveys`;

  private unwrap<T>(obs: Observable<ApiResponse<T>>): Observable<T> {
    return obs.pipe(map(r => r.data));
  }

  // ── Surveys ──────────────────────────────────────────────────────────────
  getSurveys(): Observable<Survey[]> {
    return this.unwrap(this.http.get<ApiResponse<Survey[]>>(this.base));
  }

  getSurvey(id: string): Observable<Survey> {
    return this.unwrap(this.http.get<ApiResponse<Survey>>(`${this.base}/${id}`));
  }

  createSurvey(data: Pick<Survey, 'title' | 'description'>): Observable<Survey> {
    return this.unwrap(this.http.post<ApiResponse<Survey>>(this.base, data));
  }

  updateSurvey(id: string, data: Partial<Pick<Survey, 'title' | 'description' | 'status'>>): Observable<Survey> {
    return this.unwrap(this.http.put<ApiResponse<Survey>>(`${this.base}/${id}`, data));
  }

  deleteSurvey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  getQuestions(surveyId: string): Observable<Question[]> {
    return this.unwrap(this.http.get<ApiResponse<Question[]>>(`${this.base}/${surveyId}/questions`));
  }

  createQuestion(surveyId: string, data: Omit<Question, 'id' | 'surveyId' | 'createdAt' | 'updatedAt'>): Observable<Question> {
    return this.unwrap(this.http.post<ApiResponse<Question>>(`${this.base}/${surveyId}/questions`, data));
  }

  updateQuestion(surveyId: string, questionId: string, data: Partial<Pick<Question, 'text' | 'order' | 'options'>>): Observable<Question> {
    return this.unwrap(this.http.put<ApiResponse<Question>>(`${this.base}/${surveyId}/questions/${questionId}`, data));
  }

  deleteQuestion(surveyId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${surveyId}/questions/${questionId}`);
  }

  // ── Responses ─────────────────────────────────────────────────────────────
  submitResponse(surveyId: string, payload: SubmitResponsePayload): Observable<void> {
    return this.http.post<void>(`${this.base}/${surveyId}/responses`, payload);
  }

  // ── Results ───────────────────────────────────────────────────────────────
  getResults(surveyId: string): Observable<SurveyResults> {
    return this.unwrap(this.http.get<ApiResponse<SurveyResults>>(`${this.base}/${surveyId}/results`));
  }
}
