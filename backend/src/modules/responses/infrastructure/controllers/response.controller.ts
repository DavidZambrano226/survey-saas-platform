import { Request, Response, NextFunction, Router } from 'express';
import { container } from '@shared/container/container';
import { body } from 'express-validator';
import { validate } from '@shared/infrastructure/http/middlewares/validate.middleware';
import { sendSuccess } from '@shared/infrastructure/http/response.helper';
import { SubmitResponseUseCase } from '../../application/use-cases/submit-response.use-case';

const router = Router({ mergeParams: true });

const submitValidations = [
  body('answers').isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),
  body('answers.*.questionId').notEmpty().withMessage('Each answer must have a questionId'),
  body('answers.*.value').notEmpty().withMessage('Each answer must have a value'),
];

// POST /surveys/:surveyId/responses
router.post('/', submitValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(SubmitResponseUseCase);
    const response = await useCase.execute({ ...req.body, surveyId: req.params.surveyId });
    sendSuccess(res, response, 201);
  } catch (err) {
    next(err);
  }
});

export default router;
