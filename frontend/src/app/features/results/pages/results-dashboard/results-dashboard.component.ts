import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SurveyService } from '../../../../core/services/survey.service';
import { SurveyResults, QuestionResult } from '../../../../core/models/survey.model';
import { ChartComponent } from '../../components/chart/chart.component';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [RouterLink, ChartComponent],
  templateUrl: './results-dashboard.component.html'
})
export class ResultsDashboardComponent implements OnInit {
  private readonly surveyService = inject(SurveyService);
  private readonly route         = inject(ActivatedRoute);

  results = signal<SurveyResults | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.surveyService.getResults(id).subscribe({
      next: r  => { this.results.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  hasChart(q: QuestionResult): boolean {
    return q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE' || q.type === 'RATING';
  }
}
