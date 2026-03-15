---
id: api-reference
title: API Reference
sidebar_label: API Reference
description: SyntropyLog API — init, getLogger, getContextManager, shutdown. Lifecycle, events, configuration. No getHttp/getBroker in core.
---

# API Reference

Overview of the public API of SyntropyLog. The framework exposes a **singleton** `syntropyLog` and optional helpers (transports, adapters, masking).

> **Important:** Use the [Boilerplate](./boilerplate) pattern (init with `ready`/`error` events and graceful shutdown) in all applications.

## Package entry

```typescript
import { syntropyLog, ClassicConsoleTransport } from 'syntropylog';
```

- **syntropyLog** — Singleton instance. Use `init()`, `getLogger()`, `getContextManager()`, `shutdown()`, etc.
- **Transports** — Pass instances in `logger.transports` (e.g. `ClassicConsoleTransport`, `PrettyConsoleTransport`). See the package exports for the full list.
- **Adapters / masking** — `UniversalAdapter`, `MaskingEngine`, `getDefaultMaskingRules`. See the package for types and masking exports.

## Core API (syntropyLog)

### Lifecycle

| Method | Description |
|--------|-------------|
| `syntropyLog.init(config)` | Initializes the framework. Call once; listen for `ready` / `error` before using other APIs. |
| `syntropyLog.shutdown()` | Graceful shutdown: flushes transports and releases resources. |
| `syntropyLog.getState()` | Returns current state: `NOT_INITIALIZED`, `INITIALIZING`, `READY`, `SHUTTING_DOWN`, `SHUTDOWN`, `ERROR`. |

### Events

| Event | When |
|-------|------|
| `ready` | Emitted when initialization completed successfully. |
| `error` | Emitted when initialization failed. |
| `shutting_down` | Emitted when shutdown has started. |
| `transports_drained` | Emitted when transports have been flushed. |
| `shutdown` | Emitted when shutdown completed. |

### Logger

| Method | Description |
|--------|-------------|
| `syntropyLog.getLogger(name?, bindings?)` | Returns a logger instance. `name` defaults to the configured `serviceName`. Optional `bindings` are attached to every log from this logger. |

**Logger methods:** `info`, `warn`, `error`, `debug`, `trace`, `audit`, `fatal`; `child(bindings)`, `withSource(source)`, `withRetention(rules)`, `withTransactionId(id)`; `setLevel(level)`; per-call routing: `override(...transports)`, `add(...)`, `remove(...)`.

### Context

| Method | Description |
|--------|-------------|
| `syntropyLog.getContextManager()` | Returns the context manager (available after `ready`). |

**Context manager:** `run(callback)` (runs async code with a new context/correlation ID), `get(key)`, `set(key, value)`, `getAll()`, `getCorrelationId()`, `setCorrelationId(id)`, `getCorrelationIdHeaderName()`, `getTransactionId()`, `setTransactionId(id)`, `getTraceContextHeaders()`, `getFilteredContext(level)`.

### Configuration and observability

| Method | Description |
|--------|-------------|
| `syntropyLog.getConfig()` | Returns the sanitized config object (after `ready`). |
| `syntropyLog.getFilteredContext(level)` | Returns context filtered by the logging matrix for the given level. |
| `syntropyLog.reconfigureLoggingMatrix(matrix)` | Changes which context fields are included per level (no restart). |
| `syntropyLog.reconfigureTransportsForDebug(options)` | Adds console transports temporarily (e.g. in a POD); use `resetTransports()` to restore. |
| `syntropyLog.resetTransports()` | Restores transports after a previous `reconfigureTransportsForDebug`. |
| `syntropyLog.getMasker()` | Returns the MaskingEngine instance. |
| `syntropyLog.getSerializer()` | Returns the SerializationManager instance. |
| `syntropyLog.isNativeAddonInUse()` | Returns whether the Rust native addon is in use (call after `ready`). |

## Init config shape

- **logger** — `serviceName`, `level`, `transports`, `serializerTimeoutMs`, optional `transportList` + `env` for env-based routing, optional `disableNativeAddon`.
- **context** — `correlationIdHeader`, `transactionIdHeader`.
- **loggingMatrix** — Per-level arrays of field names (e.g. `error: ['*']`, `info: ['correlationId']`).
- **masking** — `enableDefaultRules`, `rules`, `maskChar`, `preserveLength`, `regexTimeoutMs`, `onMaskingError`.
- **shutdownTimeout** — Max time to wait during shutdown.
- **Callbacks** — `onLogFailure`, `onTransportError`, `onStepError`, `onSerializationFallback`.

There is **no** `http`, `redis`, or `broker` in the core config. HTTP correlation is done with your own client (e.g. Axios) and the context manager (see [HTTP instrumentation](/docs/core-concepts/http-instrumentation)).

## What the library does not provide

- **No `getHttp()` / `getBroker()` / `getRedis()`** — Use your own clients and inject correlation (e.g. interceptors) using `getContextManager()`.
- **No `configure()`** — Configuration is done once in `init(config)`.
- **No `setContext()` / `getContext()` on the singleton** — Use `getContextManager()` and `run()` / `get()` / `set()`.

## Boilerplate

See **[Boilerplate](./boilerplate)** for the required init/shutdown and signal-handling pattern.

## See also

- [Configuration](/docs/configuration/)
- [Core concepts](/docs/core-concepts/logger) (logger, context, HTTP)
- [Examples](https://github.com/Syntropysoft/syntropylog-examples) (00–17)
