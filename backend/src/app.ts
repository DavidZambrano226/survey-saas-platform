import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import surveyRouter from '@modules/surveys/infrastructure/controllers/survey.controller';
import questionRouter from '@modules/questions/infrastructure/controllers/question.controller';
import responseRouter from '@modules/responses/infrastructure/controllers/response.controller';
import resultsRouter from '@modules/results/infrastructure/controllers/results.controller';
import { errorMiddleware } from '@shared/infrastructure/http/middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Routes
  app.use('/api/surveys', surveyRouter);
  app.use('/api/surveys/:surveyId/questions', questionRouter);
  app.use('/api/surveys/:surveyId/responses', responseRouter);
  app.use('/api/surveys/:surveyId/results', resultsRouter);

  app.use(errorMiddleware);

  return app;
};
