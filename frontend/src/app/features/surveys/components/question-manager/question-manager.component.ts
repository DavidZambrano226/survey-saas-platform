import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurveyService } from '../../../../core/services/survey.service';
import { Question, QuestionType } from '../../../../core/models/survey.model';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'SINGLE_CHOICE',   label: 'Opción única'     },
  { value: 'MULTIPLE_CHOICE', label: 'Opción múltiple'  },
  { value: 'TEXT',            label: 'Texto libre'      },
  { value: 'RATING',          label: 'Calificación'     },
];

@Component({
  selector: 'app-question-manager',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './question-manager.component.html'
})
export class QuestionManagerComponent implements OnInit {
  private readonly surveyService = inject(SurveyService);
  private readonly fb = inject(FormBuilder);

  surveyId   = input.required<string>();
  questions  = signal<Question[]>([]);
  showForm   = signal(false);
  saving     = signal(false);
  deleteId   = signal<string | null>(null);
  editingId  = signal<string | null>(null);
  optionInput = signal('');

  readonly questionTypes = QUESTION_TYPES;

  form = this.fb.group({
    text:    ['', Validators.required],
    type:    ['SINGLE_CHOICE' as QuestionType, Validators.required],
    options: [[] as string[]],
  });

  get typeCtrl()    { return this.form.controls.type;    }
  get optionsCtrl() { return this.form.controls.options; }
  get needsOptions(){ return ['SINGLE_CHOICE','MULTIPLE_CHOICE'].includes(this.typeCtrl.value!); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.surveyService.getQuestions(this.surveyId()).subscribe(q => this.questions.set(q));
  }

  openNew(): void {
    this.editingId.set(null);
    this.form.reset({ text: '', type: 'SINGLE_CHOICE', options: [] });
    this.optionInput.set('');
    this.showForm.set(true);
  }

  openEdit(q: Question): void {
    this.editingId.set(q.id);
    this.form.patchValue({ text: q.text, type: q.type, options: q.options ?? [] });
    this.optionInput.set('');
    this.showForm.set(true);
  }

  addOption(): void {
    const val = this.optionInput().trim();
    if (!val) return;
    const current = this.optionsCtrl.value ?? [];
    this.optionsCtrl.setValue([...current, val]);
    this.optionInput.set('');
  }

  removeOption(i: number): void {
    const current = [...(this.optionsCtrl.value ?? [])];
    current.splice(i, 1);
    this.optionsCtrl.setValue(current);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const { text, type, options } = this.form.value;
    const editId = this.editingId();

    const req$ = editId
      ? this.surveyService.updateQuestion(this.surveyId(), editId, { text: text!, options: options ?? [] })
      : this.surveyService.createQuestion(this.surveyId(), {
          text: text!, type: type!, order: this.questions().length + 1,
          options: this.needsOptions ? (options ?? []) : null
        });

    req$.subscribe({
      next: () => { this.load(); this.showForm.set(false); this.saving.set(false); },
      error: ()  => this.saving.set(false)
    });
  }

  doDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.surveyService.deleteQuestion(this.surveyId(), id).subscribe(() => {
      this.questions.update(list => list.filter(q => q.id !== id));
      this.deleteId.set(null);
    });
  }
}
