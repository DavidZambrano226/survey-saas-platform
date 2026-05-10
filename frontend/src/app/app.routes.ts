import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },

  // Admin — gestión de encuestas
  {
    path: 'surveys',
    loadComponent: () => import('./features/surveys/pages/survey-list/survey-list.component')
      .then(m => m.SurveyListComponent)
  },
  {
    path: 'surveys/new',
    loadComponent: () => import('./features/surveys/pages/survey-form/survey-form.component')
      .then(m => m.SurveyFormComponent)
  },
  {
    path: 'surveys/:id/edit',
    loadComponent: () => import('./features/surveys/pages/survey-form/survey-form.component')
      .then(m => m.SurveyFormComponent)
  },
  {
    path: 'surveys/:id/results',
    loadComponent: () => import('./features/results/pages/results-dashboard/results-dashboard.component')
      .then(m => m.ResultsDashboardComponent)
  },

  // Vista pública — responder encuesta
  {
    path: 'survey/:id',
    loadComponent: () => import('./features/public-survey/pages/take-survey/take-survey.component')
      .then(m => m.TakeSurveyComponent)
  },

  { path: '**', redirectTo: 'surveys' }
];
