import { inject, injectable } from 'tsyringe';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { SurveyRepository } from '../../domain/repositories/survey.repository';
import { Survey } from '../../domain/entities/survey.entity';
import { Survey as PrismaSurvey } from '@prisma/client';

// Adaptador — implementa el puerto usando Prisma
@injectable()
export class PrismaSurveyRepository implements SurveyRepository {
  constructor(
    @inject('PrismaService')
    private readonly prisma: PrismaService
  ) {}

  private toDomain(raw: PrismaSurvey): Survey {
    return new Survey(raw.id, raw.title, raw.description, raw.status as any, raw.createdAt, raw.updatedAt);
  }

  async findAll(): Promise<Survey[]> {
    const surveys = await this.prisma.survey.findMany({ orderBy: { createdAt: 'desc' } });
    return surveys.map(this.toDomain);
  }

  async findById(id: string): Promise<Survey | null> {
    const survey = await this.prisma.survey.findUnique({ where: { id } });
    return survey ? this.toDomain(survey) : null;
  }

  async save(survey: Survey): Promise<Survey> {
    const created = await this.prisma.survey.create({
      data: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        status: survey.status,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<{ title: string; description: string; status: string }>): Promise<Survey> {
    const updated = await this.prisma.survey.update({ where: { id }, data });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.survey.delete({ where: { id } });
  }
}
