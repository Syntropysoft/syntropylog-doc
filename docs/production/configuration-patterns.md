# Configuration Patterns - Production Ready

Production-ready configuration patterns for SyntropyLog using the current API (no `getHttp`/`getBroker`/`getRedis`).

## Project structure

```
src/
├── config.ts       # SyntropyLog init config
├── boilerplate.ts  # Init (ready/error) and graceful shutdown
├── main.ts         # Application entry point
└── ...
```

## config.ts

```typescript
import { ClassicConsoleTransport } from 'syntropylog';

export const syntropyConfig = {
  logger: {
    level: 'info',
    serviceName: 'my-production-app',
    serializerTimeoutMs: 100,
    transports: [new ClassicConsoleTransport()],
  },
  context: {
    correlationIdHeader: 'X-Correlation-ID',
    transactionIdHeader: 'X-Transaction-ID',
  },
  loggingMatrix: {
    default: ['correlationId', 'serviceName'],
    error: ['*'],
  },
  masking: {
    enableDefaultRules: true,
    rules: [{ pattern: /password|token|secret/i, strategy: 'password' }],
  },
  shutdownTimeout: 10_000,
};
```

There is no `http`, `redis`, or `brokers` block in the core. For HTTP, use your own client (e.g. Axios) and add a request interceptor that sets the correlation ID header from `getContextManager()`. See [HTTP instrumentation](/docs/core-concepts/http-instrumentation).

## boilerplate.ts

```typescript
import { syntropyLog } from 'syntropylog';
import { syntropyConfig } from './config';

export async function initializeSyntropyLog(): Promise<void> {
  return new Promise((resolve, reject) => {
    syntropyLog.on('ready', () => resolve());
    syntropyLog.on('error', (err) => reject(err));
    syntropyLog.init(syntropyConfig);
  });
}

export async function gracefulShutdown(): Promise<void> {
  try {
    await syntropyLog.shutdown();
  } catch (err) {
    console.error('Shutdown error:', err);
  }
}

process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exit(0);
});
```

## main.ts

```typescript
import { syntropyLog } from 'syntropylog';
import { initializeSyntropyLog } from './boilerplate';

async function main() {
  await initializeSyntropyLog();

  const logger = syntropyLog.getLogger('main');
  logger.info('Application started');

  const contextManager = syntropyLog.getContextManager();
  await contextManager.run(async () => {
    logger.info('Request handled');
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Use your own HTTP client and attach the context manager’s correlation ID in a request interceptor; do not use `syntropyLog.getHttp()` (it does not exist in the core).

## Checklist

- Use `ready`/`error` before relying on `getLogger()` or `getContextManager()`.
- Call `syntropyLog.shutdown()` on SIGTERM/SIGINT.
- Configure only `logger` and `context` (and optional `loggingMatrix`, `masking`, `shutdownTimeout`).
- For HTTP correlation, use [Axios interceptors](/docs/core-concepts/http-instrumentation) and [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) (10–11).
