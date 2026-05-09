import { ValueObject } from '@shared/domain/value-object';

export type QuestionTypeValue = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'RATING';

const VALID_TYPES: QuestionTypeValue[] = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT', 'RATING'];

export class QuestionType extends ValueObject<QuestionTypeValue> {
  protected validate(value: QuestionTypeValue): void {
    if (!VALID_TYPES.includes(value)) {
      throw new Error(`Invalid question type: ${value}`);
    }
  }

  static from(value: string): QuestionType {
    return new QuestionType(value as QuestionTypeValue);
  }

  requiresOptions(): boolean {
    return this.value === 'SINGLE_CHOICE' || this.value === 'MULTIPLE_CHOICE';
  }
}
