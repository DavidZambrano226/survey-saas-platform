import { Request, Response, NextFunction, Router } from 'express';
import { container } from '@shared/container/container';
import { body } from 'express-validator';
import { validate } from '@shared/infrastructure/http/middlewares/validate.middleware';
import { sendSuccess } from '@shared/infrastructure/http/response.helper';
import { CreateQuestionUseCase } from '../../application/use-cases/create-question.use-case';
import { GetQuestionsUseCase } from '../../application/use-cases/get-questions.use-case';
import { UpdateQuestionUseCase } from '../../application/use-cases/update-question.use-case';
import { DeleteQuestionUseCase } from '../../application/use-cases/delete-question.use-case';

const router = Router({ mergeParams: true });

const createValidations = [
  body('text').notEmpty().withMessage('Question text is required'),
  body('type').isIn(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT', 'RATING']).withMessage('Invalid question type'),
  body('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('options').optional({ nullable: true }).isArray().withMessage('Options must be an array'),
];

// GET /surveys/:surveyId/questions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetQuestionsUseCase);
    const questions = await useCase.findBySurveyId(req.params.surveyId);
    sendSuccess(res, questions);
  } catch (err) {
    next(err);
  }
});

// POST /surveys/:surveyId/questions
router.post('/', createValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(CreateQuestionUseCase);
    const question = await useCase.execute({ ...req.body, surveyId: req.params.surveyId });
    sendSuccess(res, question, 201);
  } catch (err) {
    next(err);
  }
});

// PUT /surveys/:surveyId/questions/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(UpdateQuestionUseCase);
    const question = await useCase.execute(req.params.id, req.body);
    sendSuccess(res, question);
  } catch (err) {
    next(err);
  }
});

// DELETE /surveys/:surveyId/questions/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(DeleteQuestionUseCase);
    await useCase.execute(req.params.id);
    sendSuccess(res, { message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
