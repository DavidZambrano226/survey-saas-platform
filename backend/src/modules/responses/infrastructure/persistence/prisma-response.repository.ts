import { inject, injectable } from 'tsyringe';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { ResponseRepository } from '../../domain/repositories/response.repository';
import { SurveyResponse, AnswerData } from '../../domain/entities/response.entity';

@injectable()
export class PrismaResponseRepository implements ResponseRepository {
  constructor(
    @inject('PrismaService')
    private readonly prisma: PrismaService
  ) {}

  async save(response: SurveyResponse): Promise<SurveyResponse> {
    await this.prisma.surveyResponse.create({
      data: {
        id: response.id,
        surveyId: response.surveyId,
        respondent: response.respondent,
        createdAt: response.createdAt,
        answers: {
          create: response.answers.map((a) => ({
            id: require('uuid').v4(),
            questionId: a.questionId,
            value: Array.isArray(a.value) ? JSON.stringify(a.value) : a.value,
          })),
        },
      },
    });
    return response;
  }

  async findBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    const records = await this.prisma.surveyResponse.findMany({
      where: { surveyId },
      include: { answers: true },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => {
      const answers: AnswerData[] = r.answers.map((a) => {
        let value: string | string[];
        try {
          const parsed = JSON.parse(a.value);
          value = Array.isArray(parsed) ? parsed : a.value;
        } catch {
          value = a.value;
        }
        return { questionId: a.questionId, value };
      });
      return new SurveyResponse(r.id, r.surveyId, r.respondent, answers, r.createdAt, r.createdAt);
    });
  }

  async countBySurveyId(surveyId: string): Promise<number> {
    return this.prisma.surveyResponse.count({ where: { surveyId } });
  }
}
