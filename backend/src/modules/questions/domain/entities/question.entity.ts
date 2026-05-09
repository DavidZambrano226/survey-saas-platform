import { BaseEntity } from '@shared/domain/base.entity';
import { QuestionType, QuestionTypeValue } from '../value-objects/question-type.vo';

export class Question extends BaseEntity {
  private _type: QuestionType;

  constructor(
    id: string,
    public readonly surveyId: string,
    public readonly text: string,
    type: QuestionTypeValue,
    public readonly order: number,
    public readonly options: string[] | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this._type = QuestionType.from(type);
  }

  get type(): QuestionTypeValue {
    return this._type.getValue();
  }

  requiresOptions(): boolean {
    return this._type.requiresOptions();
  }

  static create(params: {
    id: string;
    surveyId: string;
    text: string;
    type: QuestionTypeValue;
    order: number;
    options?: string[];
  }): Question {
    const now = new Date();
    return new Question(
      params.id,
      params.surveyId,
      params.text,
      params.type,
      params.order,
      params.options ?? null,
      now,
      now
    );
  }
}
