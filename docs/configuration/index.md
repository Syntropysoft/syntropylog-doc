---
id: configuration
title: Configuration Guide
sidebar_label: Configuration
description: Configure SyntropyLog — logger, context, masking, logging matrix. Structured logging and correlation ID. Minimal and full config.
---

# Configuration Guide

SyntropyLog is configured in a single call to `syntropyLog.init(config)`. Only the **logger**, **context**, and optional blocks (**loggingMatrix**, **masking**, **shutdownTimeout**, callbacks) exist. There are no `http`, `redis`, or `brokers` blocks in the core.

## Minimal config (copy-paste)

The smallest setup: logger + context. Subscribe to `ready`/`error` before calling `init()` (see [Boilerplate](/docs/api-reference/boilerplate)).

```typescript
await syntropyLog.init({
  logger: { serviceName: 'my-app', level: 'info', transports: [new ClassicConsoleTransport()] },
  context: { correlationIdHeader: 'x-correlation-id' },
});
```

## Quick configuration

```typescript
import { syntropyLog, ClassicConsoleTransport } from 'syntropylog';

syntropyLog.on('ready', () => {});
syntropyLog.on('error', (err) => console.error(err));

await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transports: [new ClassicConsoleTransport()],
  },
  context: {
    correlationIdHeader: 'x-correlation-id',
    transactionIdHeader: 'x-transaction-id',
  },
  loggingMatrix: {
    default: ['correlationId'],
    error: ['*'],
  },
});
```

## Configuration options

### Logger

| Option | Description |
|--------|-------------|
| `serviceName` | Service name included in logs. |
| `level` | Minimum level: `'trace'`, `'debug'`, `'info'`, `'warn'`, `'error'`, `'fatal'`, `'silent'`. |
| `transports` | Array of transport instances (e.g. `new ClassicConsoleTransport()`). |
| `serializerTimeoutMs` | Serialization timeout (avoids blocking the event loop). |

Use console transports for stdout (e.g. `ClassicConsoleTransport`, `PrettyConsoleTransport`). To send logs to external backends, use the **Universal Adapter** with a custom `executor`. See the package exports for available transports.

### Context

| Option | Description |
|--------|-------------|
| `correlationIdHeader` | Header name for the correlation ID (e.g. `'x-correlation-id'`). |
| `transactionIdHeader` | Header name for the transaction ID (optional). |

HTTP propagation is done with your own client (e.g. Axios interceptors) using `getContextManager().getCorrelationId()` and `getCorrelationIdHeaderName()`. See [HTTP instrumentation](/docs/core-concepts/http-instrumentation).

### Logging Matrix

Controls which context fields are included per level (without affecting masking or security):

```typescript
loggingMatrix: {
  default: ['correlationId'],
  trace: ['*'],
  debug: ['correlationId', 'userId', 'operation'],
  info: ['correlationId', 'serviceName'],
  warn: ['correlationId', 'userId', 'errorCode'],
  error: ['*'],
  fatal: ['*'],
}
```

You can change it at runtime with `syntropyLog.reconfigureLoggingMatrix(matrix)`.

### Masking

To mask sensitive data in logs:

```typescript
masking: {
  enableDefaultRules: true,
  rules: [
    { pattern: /password|token|secret/i, strategy: 'password' },
    { pattern: /creditCard|cardNumber/i, strategy: 'card' },
  ],
  maskChar: '*',
  preserveLength: false,
  regexTimeoutMs: 10,
  onMaskingError: (err) => { /* optional */ },
}
```

### Shutdown and callbacks

- `shutdownTimeout`: maximum time to wait during `shutdown()`.
- `onLogFailure`, `onTransportError`, `onStepError`, `onSerializationFallback`: observability callbacks.

## By environment

### Development

- Use level `debug` or `trace`, and a transport like `PrettyConsoleTransport` or `ColorfulConsoleTransport` for readable console output.

### Production

- Use level `info` or `warn`, and a structured transport (e.g. `ClassicConsoleTransport`) or the Universal Adapter to your backend (PostgreSQL, Elasticsearch, S3, etc.).

## Next steps

- [Getting Started](/docs/getting-started)
- [API Reference](/docs/api-reference)
- [Core concepts](/docs/core-concepts/logger)
- [Production](/docs/production/)
