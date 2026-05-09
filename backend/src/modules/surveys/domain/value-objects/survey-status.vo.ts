import { ValueObject } from '@shared/domain/value-object';

export type SurveyStatusType = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

const VALID_STATUSES: SurveyStatusType[] = ['DRAFT', 'PUBLISHED', 'CLOSED'];

export class SurveyStatus extends ValueObject<SurveyStatusType> {
  protected validate(value: SurveyStatusType): void {
    if (!VALID_STATUSES.includes(value)) {
      throw new Error(`Invalid survey status: ${value}`);
    }
  }

  equals(other: SurveyStatus): boolean {
    return this.getValue() === other.getValue();
  }

  static from(value: string): SurveyStatus {
    return new SurveyStatus(value as SurveyStatusType);
  }

  static readonly DRAFT = new SurveyStatus('DRAFT');
  static readonly PUBLISHED = new SurveyStatus('PUBLISHED');
  static readonly CLOSED = new SurveyStatus('CLOSED');
}
