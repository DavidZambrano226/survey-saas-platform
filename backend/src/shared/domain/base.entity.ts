export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  toJSON(): object {
    const proto = Object.getPrototypeOf(this);
    const getters = Object.getOwnPropertyNames(proto)
      .filter(key => {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        return desc && typeof desc.get === 'function' && key !== '__proto__';
      })
      .reduce((acc, key) => {
        acc[key] = (this as any)[key];
        return acc;
      }, {} as Record<string, unknown>);

    return { ...this, ...getters };
  }
}
