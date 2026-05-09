import './shared/container/container'; // bootstrap DI
import { createApp } from './app';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

const PORT = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
  const prisma = new PrismaService();
  await prisma.connect();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
  });

  const shutdown = async (): Promise<void> => {
    await prisma.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(console.error);
