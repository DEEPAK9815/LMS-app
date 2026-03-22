import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 LumosLMS Backend live on port ${PORT}`);
  console.log(`📡 Ready for incoming requests at /api/health`);
  console.log(`🛡️ Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
