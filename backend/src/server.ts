import app from './app';
import { env } from './config/env';
import prisma from './lib/prisma';

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      console.log(`ReserveAí API executando na porta ${env.port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

void bootstrap();
