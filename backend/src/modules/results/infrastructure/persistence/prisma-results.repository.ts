import { inject, injectable } from 'tsyringe';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { ResultsRepository, SurveyResults, QuestionResult } from '../../domain/repositories/results.repository';
import { AppError } from '@shared/infrastructure/http/middlewares/error.middleware';

@injectable()
export class PrismaResultsRepository implements ResultsRepository {
  constructor(
    @inject('PrismaService')
    private readonly prisma: PrismaService
  ) {}

  async getSurveyResults(surveyId: string): Promise<SurveyResults> {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { answers: true },
        },
      },
    });

    if (!survey) throw new AppError(`Survey with id ${surveyId} not found`, 404);

    const totalResponses = await this.prisma.surveyResponse.count({ where: { surveyId } });

    const questions: QuestionResult[] = survey.questions.map((q) => {
      const base = { questionId: q.id, questionText: q.text, type: q.type, totalAnswers: q.answers.length };

      if (q.type === 'TEXT') {
        return { ...base, textAnswers: q.answers.map((a) => a.value).slice(0, 20) };
      }

      if (q.type === 'RATING') {
        const nums = q.answers.map((a) => parseFloat(a.value)).filter((n) => !isNaN(n));
        const average = nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
        return { ...base, average: Math.round(average * 100) / 100 };
      }

      // SINGLE_CHOICE | MULTIPLE_CHOICE
      const optionCounts: Record<string, number> = {};
      for (const answer of q.answers) {
        let values: string[];
        try {
          const parsed = JSON.parse(answer.value);
          values = Array.isArray(parsed) ? parsed : [answer.value];
        } catch {
          values = [answer.value];
        }
        for (const v of values) {
          optionCounts[v] = (optionCounts[v] ?? 0) + 1;
        }
      }
      return { ...base, optionCounts };
    });

    return { surveyId, surveyTitle: survey.title, totalResponses, questions };
  }
}
