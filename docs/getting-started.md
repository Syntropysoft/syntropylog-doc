---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
description: Get started with SyntropyLog — structured logging, correlation ID, context, multiple loggers. Install, init, and first log.
---

# Getting Started with SyntropyLog

SyntropyLog is a **structured observability framework** for Node.js. You declare what your logs should carry (context, level-based fields, retention, masking), and SyntropyLog applies it everywhere—automatically. No manual plumbing, no hidden behavior.

It is built for **high demand** and **regulated environments** (banking, healthcare, financial services): HIPAA-style field control via the Logging Matrix, SOX-style audit trails via `withRetention`, and a pipeline that never lets logging crash your app.

> **Philosophy:** *"Simplicity over Complexity"* — configure once, use anywhere.

## What's in the box

- **Lifecycle** — `init()` / `shutdown()`; graceful flush on SIGTERM/SIGINT.
- **Context** — Correlation ID and transaction ID; single source of truth, propagate via `contextManager.run()`.
- **Logging Matrix** — Control which context fields appear per level (lean on `info`, full on `error`).
- **Masking** — Redact sensitive fields before any transport; built-in + custom rules.
- **Universal Adapter** — Send logs to any backend (PostgreSQL, Elasticsearch, S3, etc.) via one `executor`.
- **Fluent API** — `withRetention`, `withSource`, `withTransactionId`; per-call transport control (`.override()`, `.add()`, `.remove()`).
- **Resilience** — Serialization timeout, sanitization, optional Rust native addon; logging never throws.

For the full list and details, see the library [README](https://github.com/Syntropysoft/SyntropyLog#readme).

---

## Quick Start

### Install

```bash
npm install syntropylog
```

A prebuilt native addon (Rust) for Linux, Windows, and macOS installs automatically on Node ≥20. If unavailable, the JS pipeline is used transparently.

### Init and first log

**Initialization must complete (the `ready` event) before you log.** Until then, `getLogger()` returns a no-op logger that drops all messages. Listen for `ready` and `error` *before* calling `init()`.

```typescript
import { syntropyLog } from 'syntropylog';

async function initializeSyntropyLog() {
  return new Promise<void>((resolve, reject) => {
    syntropyLog.on('ready', () => resolve());
    syntropyLog.on('error', (err) => reject(err));
    syntropyLog.init({
      logger: { level: 'info', serviceName: 'my-app' },
    });
  });
}

async function main() {
  await initializeSyntropyLog();   // must resolve before any log
  const log = syntropyLog.getLogger();
  log.info('Hello, SyntropyLog.');
}
main();
```

With a console transport (recommended):

```typescript
import { syntropyLog, ClassicConsoleTransport } from 'syntropylog';

syntropyLog.on('ready', () => {});
syntropyLog.on('error', (err) => console.error(err));
syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transports: [new ClassicConsoleTransport()],
  },
});
const logger = syntropyLog.getLogger('main');
logger.info('Application started', { version: '1.0.0' });
```

### Graceful shutdown

Call `shutdown()` on SIGTERM/SIGINT so pending logs are flushed before exit.

```typescript
process.on('SIGTERM', async () => {
  await syntropyLog.shutdown();
  process.exit(0);
});
process.on('SIGINT', async () => {
  await syntropyLog.shutdown();
  process.exit(0);
});
```

See [Boilerplate](/docs/api-reference/boilerplate) for a reusable init/shutdown pattern.

### Framework entry points

| Framework | Where to call `await init` |
|-----------|----------------------------|
| Express / Fastify | Before `app.listen()` in server entry |
| NestJS | `AppModule.onModuleInit()` or before `app.listen()` in `bootstrap()` |
| Lambda / Serverless | Module-level lazy singleton (outside the handler) |

---

## Context and correlation

Set `context` in `init()` (e.g. `correlationIdHeader`, `transactionIdHeader`). Use the context manager so each request (or job) runs in its own scope with a correlation ID. A common **context middleware** pattern is to capture the correlation ID from the incoming request header when present, or let the framework generate one:

```typescript
const contextManager = syntropyLog.getContextManager();

function withContext(
  contextManager: ReturnType<typeof syntropyLog.getContextManager>,
  handler: () => Promise<void>,
  options?: { correlationId?: string }
) {
  return contextManager.run(async () => {
    const headerName = contextManager.getCorrelationIdHeaderName();
    if (options?.correlationId != null && options.correlationId !== '') {
      contextManager.setCorrelationId(options.correlationId);
    }
    contextManager.getCorrelationId(); // ensure ID exists (generate if not set)
    await handler();
  });
}

// Express/Fastify: read from incoming header, then run the request in context
app.use((req, res, next) => {
  const fromHeader = req.get(contextManager.getCorrelationIdHeaderName()) ?? undefined;
  withContext(contextManager, () => next(), { correlationId: fromHeader });
});
```

All logs inside that request will share the same correlation ID. You can create **several loggers** with different names (e.g. `getLogger('service')`, `getLogger('axios')`, `getLogger('kafka')`) or, for a cleaner setup, use a central `LoggerName` enum and call `getLogger(LoggerName.service)`, `getLogger(LoggerName.axios)`, etc. from anywhere. See [Context](/docs/core-concepts/context) and [Multiple loggers and transports](/docs/core-concepts/multiple-loggers-and-transports). Use `getCorrelationId()` and `getCorrelationIdHeaderName()` to add the header on outgoing HTTP requests.

## HTTP correlation (no built-in HTTP client)

The library does **not** provide `getHttp()` or a built-in HTTP client. Use your own client (e.g. Axios) and add a **request interceptor** that injects the correlation ID from the context manager:

```typescript
const contextManager = syntropyLog.getContextManager();

axiosInstance.interceptors.request.use((config) => {
  config.headers[contextManager.getCorrelationIdHeaderName()] =
    contextManager.getCorrelationId();
  return config;
});
```

See [HTTP instrumentation](/docs/core-concepts/http-instrumentation) and the examples **10-basic-http-correlation** and **11-axios-interceptors** in [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples).

## Masking and configuration

Configure **masking** in `init()` so sensitive fields are redacted before any transport. Use **loggingMatrix** to control which context fields appear per level. The only required block is **logger** (`serviceName`, `level`, `transports`); **context** is optional.

See [Configuration](/docs/configuration/) and the library README (MaskingEngine, Logging Matrix, Universal Adapter).

---

## Next steps

1. **Examples** — [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) (00–17): setup, context, transports, HTTP correlation, testing, benchmark.
2. **Core concepts** — [Logger](/docs/core-concepts/logger), [Context](/docs/core-concepts/context), [HTTP instrumentation](/docs/core-concepts/http-instrumentation).
3. **Production** — [Configuration patterns](/docs/production/configuration-patterns), [Graceful shutdown](/docs/production/graceful-shutdown).
4. **API Reference** — [API Reference](/docs/api-reference/) and [Boilerplate](/docs/api-reference/boilerplate).

## Need help?

- **Docs** — This site and the library [README](https://github.com/Syntropysoft/SyntropyLog#readme).
- **Examples** — [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) (00–17).
- **GitHub** — [SyntropyLog](https://github.com/Syntropysoft/SyntropyLog) · [Issues](https://github.com/Syntropysoft/SyntropyLog/issues).
