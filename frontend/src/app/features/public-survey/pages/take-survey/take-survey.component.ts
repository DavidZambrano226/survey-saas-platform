import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../../../core/services/survey.service';
import { Survey, Question, AnswerPayload } from '../../../../core/models/survey.model';

@Component({
  selector: 'app-take-survey',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './take-survey.component.html'
})
export class TakeSurveyComponent implements OnInit {
  private readonly surveyService = inject(SurveyService);
  private readonly route         = inject(ActivatedRoute);
  private readonly router        = inject(Router);

  survey    = signal<Survey | null>(null);
  questions = signal<Question[]>([]);
  loading   = signal(true);
  submitted = signal(false);
  submitting = signal(false);
  error     = signal<string | null>(null);

  // answers map: questionId -> value
  answers = signal<Record<string, string | string[]>>({});

  respondent = signal('');

  isComplete = computed(() => {
    const qs = this.questions();
    const ans = this.answers();
    return qs.every(q => {
      const v = ans[q.id];
      return v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.surveyService.getSurvey(id).subscribe({
      next: s => {
        if (s.status !== 'PUBLISHED') {
          this.error.set('Esta encuesta no está disponible.');
          this.loading.set(false);
          return;
        }
        this.survey.set(s);
        this.surveyService.getQuestions(id).subscribe(qs => {
          this.questions.set(qs);
          this.loading.set(false);
        });
      },
      error: () => { this.error.set('Encuesta no encontrada.'); this.loading.set(false); }
    });
  }

  setAnswer(questionId: string, value: string | string[]): void {
    this.answers.update(a => ({ ...a, [questionId]: value }));
  }

  toggleMultiple(questionId: string, option: string): void {
    const current = (this.answers()[questionId] as string[]) ?? [];
    const updated = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    this.setAnswer(questionId, updated);
  }

  isChecked(questionId: string, option: string): boolean {
    const v = this.answers()[questionId];
    return Array.isArray(v) && v.includes(option);
  }

  submit(): void {
    if (!this.isComplete()) return;
    this.submitting.set(true);
    const payload: AnswerPayload[] = Object.entries(this.answers()).map(([questionId, value]) => ({ questionId, value }));

    this.surveyService.submitResponse(this.survey()!.id, {
      respondent: this.respondent() || undefined,
      answers: payload
    }).subscribe({
      next: () => { this.submitted.set(true); this.submitting.set(false); },
      error: ()  => this.submitting.set(false)
    });
  }
}
