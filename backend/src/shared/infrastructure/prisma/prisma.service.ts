import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    });
  }

  async connect(): Promise<void> {
    await this.$connect();
  }

  async disconnect(): Promise<void> {
    await this.$disconnect();
  }
}
