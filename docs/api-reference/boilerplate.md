---
id: boilerplate
title: Boilerplate (init & shutdown)
sidebar_label: Boilerplate
---

# Boilerplate — init, shutdown, and context middleware

Use these patterns in **every** application (development and production): init with `ready`/`error`, graceful shutdown, and (for HTTP servers) a **context middleware** so each request has a correlation ID.

**Minimal setup** = configuration + events (`ready`/`error`) + wait for initialization + context middleware. With that in place, you're ready to use `getLogger()` and context everywhere — observability spreads across your app without repeating setup in every file.

## Why it matters

Without proper shutdown handling:

- **Lost logs** — Entries still in the pipeline may never reach transports.
- **Unclean exit** — Transports (files, HTTP, etc.) may not flush or close.
- **SIGTERM/SIGINT** — The process may be killed before cleanup if you don't handle signals.

## Required pattern

1. Subscribe to `ready` and `error` **before** calling `init()`.
2. Call `init(config)` and wait for the `ready` event (or handle `error`).
3. Use `getLogger()` and the rest of the API only after initialization has succeeded.
4. On shutdown (SIGTERM/SIGINT or application exit), call `syntropyLog.shutdown()` and then exit.

## Boilerplate code

```typescript
// boilerplate.ts
import { syntropyLog } from 'syntropylog';

export async function initializeSyntropyLog(config: import('syntropylog').SyntropyLogConfig): Promise<void> {
  console.log('Initializing SyntropyLog...');
  return new Promise<void>((resolve, reject) => {
    syntropyLog.on('ready', () => {
      console.log('SyntropyLog initialized successfully.');
      resolve();
    });
    syntropyLog.on('error', (err) => {
      console.error('SyntropyLog initialization failed:', err);
      reject(err);
    });
    syntropyLog.init(config);
  });
}

export async function gracefulShutdown(): Promise<void> {
  console.log('Shutting down SyntropyLog...');
  try {
    await syntropyLog.shutdown();
    console.log('SyntropyLog shutdown completed.');
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
}

// Signal handlers (recommended in your main entry point)
process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exit(0);
});
```

## Using it in your app

```typescript
import { syntropyLog } from 'syntropylog';
import { initializeSyntropyLog, gracefulShutdown } from './boilerplate';

async function main() {
  await initializeSyntropyLog({
    logger: { serviceName: 'my-app', level: 'info', transports: [new ClassicConsoleTransport()] },
  });

  const logger = syntropyLog.getLogger('main');
  logger.info('Application started');

  // ... your application logic ...

  await gracefulShutdown();
}

main().catch(console.error);
```

If you register the signal handlers in your main file, pressing Ctrl+C or receiving SIGTERM will trigger `gracefulShutdown()` automatically.

## Context middleware (HTTP servers)

For Express, Fastify, or any HTTP server, run each request inside the context manager and pass the correlation ID from the incoming header when present. See [Getting Started — Context and correlation](/docs/getting-started#context-and-correlation) and [Context — Context lifecycle with run()](/docs/core-concepts/context#-context-lifecycle-with-run) for the full `withContext` helper and Express/Fastify example. In short: read the header with `contextManager.getCorrelationIdHeaderName()`, call `contextManager.run()` (or `withContext()`), and optionally `setCorrelationId(fromHeader)` so downstream logs share the same ID.

## Checklist

- Subscribe to `ready` and `error` before `init()`.
- Use `getLogger()` / `getContextManager()` only after `ready` has fired.
- Call `syntropyLog.shutdown()` on process exit (or in signal handlers).
- Handle shutdown errors (log them; avoid leaving the process hanging).

## Related

- [Getting Started](/docs/getting-started) — Minimal init and first log.
- [Production — Graceful shutdown](/docs/production/graceful-shutdown) — More detail on shutdown and signals.
- [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) — Examples 00–17 use this boilerplate pattern.
