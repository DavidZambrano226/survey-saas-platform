import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurveyService } from '../../../../core/services/survey.service';
import { Survey, SurveyStatus } from '../../../../core/models/survey.model';
import { QuestionManagerComponent } from '../../components/question-manager/question-manager.component';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, QuestionManagerComponent],
  templateUrl: './survey-form.component.html'
})
export class SurveyFormComponent implements OnInit {
  private readonly fb            = inject(FormBuilder);
  private readonly surveyService = inject(SurveyService);
  private readonly router        = inject(Router);
  private readonly route         = inject(ActivatedRoute);

  surveyId  = signal<string | null>(null);
  saving    = signal(false);
  isEdit    = signal(false);

  readonly statuses: SurveyStatus[] = ['DRAFT', 'PUBLISHED', 'CLOSED'];
  readonly statusLabels: Record<SurveyStatus, string> = {
    DRAFT: 'Borrador', PUBLISHED: 'Publicada', CLOSED: 'Cerrada'
  };

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status:      ['DRAFT' as SurveyStatus]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.surveyId.set(id);
      this.isEdit.set(true);
      this.surveyService.getSurvey(id).subscribe(s => this.form.patchValue(s));
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.form.value as Pick<Survey, 'title' | 'description' | 'status'>;
    const id = this.surveyId();

    const req$ = id
      ? this.surveyService.updateSurvey(id, value)
      : this.surveyService.createSurvey(value);

    req$.subscribe({
      next: (survey) => {
        this.saving.set(false);
        this.router.navigate(['/surveys', survey.id, 'edit']);
      },
      error: () => this.saving.set(false)
    });
  }

  get titleCtrl() { return this.form.controls.title; }
}
