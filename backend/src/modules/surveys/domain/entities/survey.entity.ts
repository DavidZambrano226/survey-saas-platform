import { BaseEntity } from '@shared/domain/base.entity';
import { SurveyStatus, SurveyStatusType } from '../value-objects/survey-status.vo';

export class Survey extends BaseEntity {
  private _status: SurveyStatus;

  constructor(
    id: string,
    public readonly title: string,
    public readonly description: string | null,
    status: SurveyStatusType,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, createdAt, updatedAt);
    this._status = SurveyStatus.from(status);
  }

  get status(): SurveyStatusType {
    return this._status.getValue();
  }

  isPublished(): boolean {
    return this._status.equals(SurveyStatus.PUBLISHED);
  }

  static create(params: { id: string; title: string; description?: string | null }): Survey {
    const now = new Date();
    return new Survey(params.id, params.title, params.description ?? null, 'DRAFT', now, now);
  }
}
