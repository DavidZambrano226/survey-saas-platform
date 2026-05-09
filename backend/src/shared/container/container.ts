import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

// Prisma singleton
container.registerSingleton<PrismaService>('PrismaService', PrismaService);

// Surveys
import { SurveyRepository } from '@modules/surveys/domain/repositories/survey.repository';
import { PrismaSurveyRepository } from '@modules/surveys/infrastructure/persistence/prisma-survey.repository';
container.register<SurveyRepository>('SurveyRepository', { useClass: PrismaSurveyRepository });

// Questions
import { QuestionRepository } from '@modules/questions/domain/repositories/question.repository';
import { PrismaQuestionRepository } from '@modules/questions/infrastructure/persistence/prisma-question.repository';
container.register<QuestionRepository>('QuestionRepository', { useClass: PrismaQuestionRepository });

// Responses
import { ResponseRepository } from '@modules/responses/domain/repositories/response.repository';
import { PrismaResponseRepository } from '@modules/responses/infrastructure/persistence/prisma-response.repository';
container.register<ResponseRepository>('ResponseRepository', { useClass: PrismaResponseRepository });

// Results
import { ResultsRepository } from '@modules/results/domain/repositories/results.repository';
import { PrismaResultsRepository } from '@modules/results/infrastructure/persistence/prisma-results.repository';
container.register<ResultsRepository>('ResultsRepository', { useClass: PrismaResultsRepository });

export { container };
