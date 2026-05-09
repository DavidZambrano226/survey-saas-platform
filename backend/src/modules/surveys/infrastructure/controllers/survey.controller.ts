import { Request, Response, NextFunction, Router } from 'express';
import { container } from '@shared/container/container';
import { body } from 'express-validator';
import { validate } from '@shared/infrastructure/http/middlewares/validate.middleware';
import { sendSuccess } from '@shared/infrastructure/http/response.helper';
import { CreateSurveyUseCase } from '../../application/use-cases/create-survey.use-case';
import { GetSurveyUseCase } from '../../application/use-cases/get-survey.use-case';
import { UpdateSurveyUseCase } from '../../application/use-cases/update-survey.use-case';
import { DeleteSurveyUseCase } from '../../application/use-cases/delete-survey.use-case';

const router = Router();

const createValidations = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').optional().isString(),
];

const updateValidations = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('description').optional().isString(),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'CLOSED']).withMessage('Invalid status'),
];

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetSurveyUseCase);
    const surveys = await useCase.findAll();
    sendSuccess(res, surveys);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetSurveyUseCase);
    const survey = await useCase.findById(req.params.id);
    sendSuccess(res, survey);
  } catch (err) {
    next(err);
  }
});

router.post('/', createValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(CreateSurveyUseCase);
    const survey = await useCase.execute(req.body);
    sendSuccess(res, survey, 201);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', updateValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(UpdateSurveyUseCase);
    const survey = await useCase.execute(req.params.id, req.body);
    sendSuccess(res, survey);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(DeleteSurveyUseCase);
    await useCase.execute(req.params.id);
    sendSuccess(res, { message: 'Survey deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
