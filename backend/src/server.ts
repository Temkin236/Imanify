import 'dotenv/config';
import app from './app';
import { Server } from 'node:http';

const DEFAULT_PORT = Number(process.env.PORT ?? 3000);
const MAX_PORT_ATTEMPTS = 20;

function listenWithFallback(startPort: number, attempt: number = 0): Promise<void> {
  const port = startPort + attempt;

  return new Promise((resolve, reject) => {
    const server: Server = app.listen(port);

    server.once('listening', () => {
      if (port !== DEFAULT_PORT) {
        console.warn(
          `Port ${DEFAULT_PORT} is in use. Imanify Backend started on port ${port} instead.`
        );
      }

      console.log(`Imanify Backend running on port ${port}`);
       console.log(`Local API:    http://localhost:${port}`);
       console.log(`Health check: http://localhost:${port}/api/health`);
      resolve();
    });

    server.once('error', (error) => {
      if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
        console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
        resolve(listenWithFallback(startPort, attempt + 1));
        return;
      }

      reject(error);
    });
  });
}

listenWithFallback(DEFAULT_PORT).catch((error) => {
  console.error('Failed to start Imanify Backend:', error);
  process.exit(1);
});
