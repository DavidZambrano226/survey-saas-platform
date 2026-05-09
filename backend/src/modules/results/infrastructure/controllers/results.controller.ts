import { Request, Response, NextFunction, Router } from 'express';
import { container } from '@shared/container/container';
import { sendSuccess } from '@shared/infrastructure/http/response.helper';
import { GetSurveyResultsUseCase } from '../../application/use-cases/get-survey-results.use-case';

const router = Router({ mergeParams: true });

// GET /surveys/:surveyId/results
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetSurveyResultsUseCase);
    const results = await useCase.execute(req.params.surveyId);
    sendSuccess(res, results);
  } catch (err) {
    next(err);
  }
});

export default router;
