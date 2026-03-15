---
sidebar_position: 3
description: Context management — correlation ID, transaction ID, contextManager.run(), withContext middleware. Propagate context across your app.
---

# Context Management

SyntropyLog's context management system provides automatic correlation and context propagation across your entire application.

## 🎯 Overview

The context system enables:
- **Automatic correlation** - Single ID connects all operations
- **Context propagation** - Data flows through HTTP calls, message brokers, and Redis
- **Framework agnostic** - Works with any Node.js application
- **No manual context passing** - Use `getLogger()` and `contextManager.run()` instead of passing context through every function

## 🚀 Basic Usage

Get the context manager after initialization (`ready`). Use `run(callback)` to execute code with a dedicated context (and correlation ID). Inside the callback, set context and use the logger; all logs share that context.

```typescript
import { syntropyLog } from 'syntropylog';

// After init and ready:
const contextManager = syntropyLog.getContextManager();

await contextManager.run(async () => {
  contextManager.set('userId', 123);
  contextManager.set('requestId', 'req-456');

  const logger = syntropyLog.getLogger('api');
  logger.info('User authenticated successfully');
  // All logs in this run() share the same correlation ID
});
```

## 🔗 Correlation and scoped context

Use `contextManager.run(callback)` so that each logical flow (e.g. one HTTP request) has its own correlation ID. The framework generates or propagates the correlation ID within that scope.

```typescript
const contextManager = syntropyLog.getContextManager();

await contextManager.run(async () => {
  const correlationId = contextManager.getCorrelationId();
  const headerName = contextManager.getCorrelationIdHeaderName(); // e.g. 'x-correlation-id'

  const logger = syntropyLog.getLogger('main');
  logger.info('Processing request');
  // Use correlationId or headerName to inject into HTTP headers, message metadata, etc.
});
```

**HTTP / Brokers / Redis:** The library does **not** provide `getHttp()`, `getBroker()`, or `getRedis()`. Use your own clients and inject the correlation ID (e.g. via Axios interceptors) using `getCorrelationId()` and `getCorrelationIdHeaderName()`. See [HTTP instrumentation](/docs/core-concepts/http-instrumentation).

## 🏗️ Singleton Pattern

Context manager uses singleton pattern for consistency:

```typescript
// First call - creates and returns new instance
const context1 = syntropyLog.getContextManager();

// Second call - returns the SAME instance (singleton)
const context2 = syntropyLog.getContextManager();

// context1 === context2 ✅
// All context data is shared
```

## 🎯 Context Data Types

SyntropyLog supports various context data types:

```typescript
const contextManager = syntropyLog.getContextManager();

// String values
contextManager.set('requestId', 'req-123');

// Number values
contextManager.set('userId', 123);

// Boolean values
contextManager.set('isAuthenticated', true);

// Object values
contextManager.set('user', {
  id: 123,
  email: 'user@example.com',
  role: 'admin',
});

// Array values
contextManager.set('permissions', ['read', 'write', 'delete']);
```

## 🔄 Context lifecycle with `run()`

Use `run()` so each request or job has its own context and correlation ID. A reusable **context middleware** pattern: capture the correlation ID from the incoming header when present (using the configured `getCorrelationIdHeaderName()`); if absent, `getCorrelationId()` generates one.

```typescript
function withContext(
  contextManager: ReturnType<typeof syntropyLog.getContextManager>,
  handler: () => Promise<void>,
  options?: { correlationId?: string }
) {
  return contextManager.run(async () => {
    if (options?.correlationId != null && options.correlationId !== '') {
      contextManager.setCorrelationId(options.correlationId);
    }
    contextManager.getCorrelationId(); // ensure ID exists (generate if not set)
    await handler();
  });
}

// Express/Fastify: one run() per request, correlation ID from header or generated
const contextManager = syntropyLog.getContextManager();
app.use((req, res, next) => {
  const fromHeader = req.get(contextManager.getCorrelationIdHeaderName()) ?? undefined;
  withContext(contextManager, () => next(), { correlationId: fromHeader });
});
```

For a background job, call `run()` directly and optionally set other context:

```typescript
await contextManager.run(async () => {
  contextManager.set('jobId', 'job-123');
  const logger = syntropyLog.getLogger('worker');
  logger.info('Job started');
  // ... work ...
  logger.info('Job completed');
});
```

## 🧠 Smart Context Logging with LoggingMatrix

The `loggingMatrix` is an intermediary layer that controls what context data gets passed to the logger. It acts as a filter that determines which context fields are included in each log level, without affecting the security pipeline or data masking.

### How LoggingMatrix Works

```typescript
await syntropyLog.init({
  loggingMatrix: {
    default: ['correlationId'], // Minimal context for success logs
    trace: ['*'], // Full context for debugging
    debug: ['correlationId', 'userId', 'operation'],
    info: ['correlationId', 'serviceName'],
    warn: ['correlationId', 'userId', 'errorCode'],
    error: ['*'], // Full context when things go wrong
    fatal: ['*'], // Everything for critical failures
  },
});
```

### Key Features

- **Selective Context**: Only specified context fields are included in logs
- **Wildcard Support**: Use `'*'` to include ALL context fields
- **Hot Reload**: Can be modified at runtime without restarting
- **Security Preserved**: All masking and sanitization rules still apply
- **Performance Optimized**: Only serializes what's needed

### Examples

```typescript
// Set context data
const contextManager = syntropyLog.getContextManager();
contextManager.set('userId', 123);
contextManager.set('serviceName', 'user-service');
contextManager.set('operation', 'create-user');
contextManager.set('tenantId', 'tenant-1');
contextManager.set('sessionId', 'sess-789');

// With loggingMatrix: { info: ['correlationId', 'serviceName'] }
logger.info('User created successfully');
// Log output: { correlationId: 'abc-123', serviceName: 'user-service', message: 'User created successfully' }
// Note: userId, operation, tenantId, sessionId are NOT included

// With loggingMatrix: { error: ['*'] }
logger.error('Database connection failed');
// Log output: { correlationId: 'abc-123', userId: 123, serviceName: 'user-service', operation: 'create-user', tenantId: 'tenant-1', sessionId: 'sess-789', message: 'Database connection failed' }
// Note: ALL context fields are included
```

### Runtime Configuration

You can change which context fields are included per level at runtime with `reconfigureLoggingMatrix()`:

```typescript
// Change logging matrix dynamically
syntropyLog.reconfigureLoggingMatrix({
  info: ['correlationId', 'serviceName', 'userId'],
  error: ['correlationId', 'userId', 'errorCode'],
});

// The changes take effect immediately
logger.info('Operation completed'); // Now includes userId
```

## 🔧 Configuration Options

```typescript
await syntropyLog.init({
  context: {
    correlationIdHeader: 'X-Correlation-ID',
    transactionIdHeader: 'X-Trace-ID',
  },
});
```

## 🎯 Best Practices

1. **Set context early** - Initialize context at the beginning of each request
2. **Use meaningful names** - Choose descriptive context keys
3. **Keep context minimal** - Only include relevant data
4. **Avoid sensitive data** - Don't put passwords or tokens in context
5. **Use correlation IDs** - Always enable correlation for distributed tracing
6. **Clean up context** - Context is automatically cleaned up per request

## 🔍 Reading context

```typescript
// Get all current context
const allContext = contextManager.getAll();

// Get specific context value
const userId = contextManager.get('userId');

// Correlation and headers (for outbound HTTP / messaging)
const correlationId = contextManager.getCorrelationId();
const headerName = contextManager.getCorrelationIdHeaderName();
const traceHeaders = contextManager.getTraceContextHeaders();
```

## ⚡ Performance Considerations

- **Minimal overhead** - Context operations are optimized
- **Memory efficient** - Context is cleaned up automatically
- **Fast propagation** - Context flows through all operations
- **Singleton pattern** - Prevents memory leaks 