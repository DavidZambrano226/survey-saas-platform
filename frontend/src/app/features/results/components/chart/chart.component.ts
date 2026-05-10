import {
  Component, input, OnDestroy, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { QuestionResult } from '../../../../core/models/survey.model';

Chart.register(...registerables);

// Open/Closed: cada tipo de gráfica es una función pura, fácil de extender
const COLORS = ['#ED1C24','#B5151B','#f59e0b','#10b981','#06b6d4','#8b5cf6','#ec4899'];

function buildBarConfig(q: QuestionResult): ChartConfiguration {
  const labels = Object.keys(q.optionCounts ?? {});
  const data   = Object.values(q.optionCounts ?? {});
  return {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Respuestas', data, backgroundColor: COLORS }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  };
}

function buildPieConfig(q: QuestionResult): ChartConfiguration {
  const labels = Object.keys(q.optionCounts ?? {});
  const data   = Object.values(q.optionCounts ?? {});
  return {
    type: 'pie',
    data: { labels, datasets: [{ data, backgroundColor: COLORS }] },
    options: { responsive: true }
  };
}

function buildRatingConfig(q: QuestionResult): ChartConfiguration {
  return {
    type: 'doughnut',
    data: {
      labels: ['Promedio', 'Restante'],
      datasets: [{ data: [q.average ?? 0, 5 - (q.average ?? 0)], backgroundColor: ['#4f46e5','#e5e7eb'] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  };
}

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <canvas #canvas></canvas>
    @if (question().type === 'RATING') {
      <p class="text-center mt-2 fw-semibold">Promedio: {{ question().average }}/5</p>
    }
  `
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  question = input.required<QuestionResult>();
  private chart?: Chart;

  ngAfterViewInit(): void {
    const q = this.question();
    let config: ChartConfiguration;

    if (q.type === 'RATING')          config = buildRatingConfig(q);
    else if (q.type === 'SINGLE_CHOICE') config = buildPieConfig(q);
    else                               config = buildBarConfig(q);

    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
