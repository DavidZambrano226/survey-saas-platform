import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../../domain/entities/question.entity';
import { QuestionRepository } from '../../domain/repositories/question.repository';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class CreateQuestionUseCase {
  constructor(
    @inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute(dto: CreateQuestionDto): Promise<Question> {
    const question = Question.create({ id: uuidv4(), ...dto });

    if (question.requiresOptions() && (!dto.options || dto.options.length < 2)) {
      throw new AppError('Questions of type SINGLE_CHOICE or MULTIPLE_CHOICE require at least 2 options', 400);
    }

    return this.questionRepository.save(question);
  }
}
