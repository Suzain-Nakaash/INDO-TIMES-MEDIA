import app from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { connectRedis, disconnectRedis } from '@/config/redis';
import { ensureBucket } from '@/config/s3';
import { logger } from '@/config/logger';

const PORT = env.PORT;

async function bootstrap() {
  try {
    // ── Connect to Database ────────────────────────────────
    await connectDatabase();

    // ── Connect to Redis ───────────────────────────────────
    await connectRedis();

    // ── Ensure S3 Bucket Exists ────────────────────────────
    if (env.NODE_ENV !== 'test') {
      await ensureBucket();
    }

    // ── Start HTTP Server ──────────────────────────────────
    const server = app.listen(PORT, () => {
      logger.info(`🚀 IndoTimesMedia API running on port ${PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`📖 Swagger Docs: ${env.API_BASE_URL}/api/docs`);
      logger.info(`❤️  Health Check: ${env.API_BASE_URL}/api/health`);
    });

    // ── Graceful Shutdown ──────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        await disconnectDatabase();
        await disconnectRedis();

        logger.info('All connections closed. Goodbye! 👋');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ── Unhandled Errors ───────────────────────────────────
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
