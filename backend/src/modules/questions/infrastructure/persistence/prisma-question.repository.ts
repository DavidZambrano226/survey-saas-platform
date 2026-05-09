import { inject, injectable } from 'tsyringe';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { QuestionRepository } from '../../domain/repositories/question.repository';
import { Question } from '../../domain/entities/question.entity';
import { Question as PrismaQuestion } from '@prisma/client';
import { QuestionTypeValue } from '../../domain/value-objects/question-type.vo';

@injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(
    @inject('PrismaService')
    private readonly prisma: PrismaService
  ) {}

  private toDomain(raw: PrismaQuestion): Question {
    const options = raw.options ? JSON.parse(raw.options) : null;
    return new Question(raw.id, raw.surveyId, raw.text, raw.type as QuestionTypeValue, raw.order, options, raw.createdAt, raw.updatedAt);
  }

  async findBySurveyId(surveyId: string): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({ where: { surveyId }, orderBy: { order: 'asc' } });
    return questions.map(this.toDomain);
  }

  async findById(id: string): Promise<Question | null> {
    const q = await this.prisma.question.findUnique({ where: { id } });
    return q ? this.toDomain(q) : null;
  }

  async save(question: Question): Promise<Question> {
    const created = await this.prisma.question.create({
      data: {
        id: question.id,
        surveyId: question.surveyId,
        text: question.text,
        type: question.type,
        order: question.order,
        options: question.options ? JSON.stringify(question.options) : null,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<{ text: string; order: number; options: string[] }>): Promise<Question> {
    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        ...data,
        options: data.options ? JSON.stringify(data.options) : undefined,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  async deleteBySurveyId(surveyId: string): Promise<void> {
    await this.prisma.question.deleteMany({ where: { surveyId } });
  }
}
