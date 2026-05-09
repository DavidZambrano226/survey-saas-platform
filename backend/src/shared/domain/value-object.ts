export abstract class ValueObject<T> {
  constructor(protected readonly value: T) {
    this.validate(value);
  }

  protected abstract validate(value: T): void;

  getValue(): T {
    return this.value;
  }

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value;
  }
}
