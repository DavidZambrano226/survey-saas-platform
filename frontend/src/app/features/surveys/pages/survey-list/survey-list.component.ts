import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SurveyService } from '../../../../core/services/survey.service';
import { Survey } from '../../../../core/models/survey.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, ConfirmModalComponent],
  templateUrl: './survey-list.component.html'
})
export class SurveyListComponent implements OnInit {
  private readonly surveyService = inject(SurveyService);
  private readonly router = inject(Router);

  surveys  = signal<Survey[]>([]);
  loading  = signal(true);
  deleteId = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.surveyService.getSurveys().subscribe({
      next: data => { this.surveys.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false)
    });
  }

  confirmDelete(id: string): void {
    this.deleteId.set(id);
  }

  doDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.surveyService.deleteSurvey(id).subscribe(() => {
      this.surveys.update(list => list.filter(s => s.id !== id));
      this.deleteId.set(null);
    });
  }

  goToResults(id: string): void {
    this.router.navigate(['/surveys', id, 'results']);
  }
}
