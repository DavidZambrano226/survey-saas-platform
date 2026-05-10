import { Component, input, computed } from '@angular/core';
import { SurveyStatus } from '../../../core/models/survey.model';

const STATUS_CONFIG: Record<string, { label: string; css: string }> = {
  DRAFT:     { label: 'Borrador',   css: 'bg-secondary' },
  PUBLISHED: { label: 'Publicada',  css: 'bg-success'   },
  CLOSED:    { label: 'Cerrada',    css: 'bg-danger'    },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span [class]="'badge ' + config().css">{{ config().label }}</span>
  `
})
export class StatusBadgeComponent {
  status = input.required<SurveyStatus>();
  config = computed(() => STATUS_CONFIG[this.status()] ?? { label: this.status(), css: 'bg-warning' });
}
