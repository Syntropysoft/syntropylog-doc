---
sidebar_position: 1
description: SyntropyLog logger — structured logging, log levels, transports, multiple loggers. Context-aware and correlation ID in every log.
---

# Logger

The SyntropyLog logger is the core component that provides structured logging with automatic context propagation and correlation.

## 🎯 Overview

SyntropyLog's logger is designed to be:
- **Context-aware** - Automatically includes correlation IDs and context
- **Framework-agnostic** - Works with any Node.js application
- **Performance-optimized** - Minimal overhead with intelligent log scoping
- **Production-ready** - Multiple transport support and structured output

## 🚀 Basic Usage

Initialize once and wait for the `ready` event before using the logger. Use `getLogger(name)` to get a logger instance.

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
});

// Get logger instance (use only after ready)
const logger = syntropyLog.getLogger('main');

// Basic logging
logger.info('Application started');
logger.warn('Configuration not found, using defaults');
logger.error('Database connection failed', { 
  error: 'Connection timeout',
  retryCount: 3 
});
```

## Multiple loggers (N loggers, same correlation ID)

You can create **several loggers** with different names (e.g. one for the service, one for Axios, one for Kafka, one for DB). Each identifies a subsystem; they all share the **same correlation ID** when used inside the same `contextManager.run()`, so you can trace the full journey of a request across systems. You can call `getLogger(name)` from **anywhere** in your app — the logger keeps the same config; a small logger config module and an enum for names keeps things ordered and explicit. Configure different transports per logger name or use a transport pool with `.override()` / `.add()` / `.remove()` per call.

See **[Multiple loggers and transports](/docs/core-concepts/multiple-loggers-and-transports)** for patterns (centralized loggers + enum, named loggers + shared transports, transport pool + per-call routing, different transport sets per logger name) and how the correlation ID travels.

## 🏗️ Singleton pattern per name

SyntropyLog caches logger instances by name (and bindings) to avoid creating new instances on every call:

```typescript
// First call - creates and returns new instance
const logger1 = syntropyLog.getLogger('user-service');

// Second call - returns the SAME instance (cached by name)
const logger2 = syntropyLog.getLogger('user-service');

// logger1 === logger2 ✅
```

## 📊 Log Levels

SyntropyLog supports standard log levels with intelligent context inclusion:

```typescript
logger.trace('Detailed debugging information');
logger.debug('Debug information for development');
logger.info('General information about application flow');
logger.warn('Warning messages for potentially harmful situations');
logger.error('Error events that might still allow the application to continue');
logger.fatal('Severe error events that will prevent the application from running');
```

## 🎨 Transports

Configure one or more transports in `logger.transports`. Use a console transport for development (e.g. `PrettyConsoleTransport`) or production (e.g. `ClassicConsoleTransport`), or both.

```typescript
import { syntropyLog, ClassicConsoleTransport } from 'syntropylog';

await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transports: [new ClassicConsoleTransport()],
  },
});
```

See the package exports for other built-in transports and the [Configuration](/docs/configuration/) guide.

## 🧠 Smart Context Logging with LoggingMatrix

The `loggingMatrix` is an intermediary layer that acts as a filter between your context data and the logger. It determines which context fields are included in each log level, providing fine-grained control over what gets logged without affecting security or performance.

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

### Key Benefits

- **Selective Context**: Only include relevant context fields per log level
- **Wildcard Support**: Use `'*'` to include ALL context fields when needed
- **Hot Reload**: Modify the matrix at runtime without restarting
- **Security Preserved**: All masking and sanitization rules still apply
- **Performance Optimized**: Only serializes what's needed for each level

### Practical Examples

```typescript
// Set various context data
const contextManager = syntropyLog.getContextManager();
contextManager.set('userId', 123);
contextManager.set('serviceName', 'user-service');
contextManager.set('operation', 'create-user');
contextManager.set('tenantId', 'tenant-1');
contextManager.set('sessionId', 'sess-789');
contextManager.set('requestId', 'req-456');

// With loggingMatrix: { info: ['correlationId', 'serviceName'] }
logger.info('User created successfully');
// Output: { correlationId: 'abc-123', serviceName: 'user-service', message: 'User created successfully' }
// Only correlationId and serviceName are included

// With loggingMatrix: { error: ['*'] }
logger.error('Database connection failed');
// Output: { correlationId: 'abc-123', userId: 123, serviceName: 'user-service', operation: 'create-user', tenantId: 'tenant-1', sessionId: 'sess-789', requestId: 'req-456', message: 'Database connection failed' }
// ALL context fields are included for debugging
```

### Runtime Configuration

You can modify the logging matrix at runtime with `reconfigureLoggingMatrix()`:

```typescript
// Add more context to info logs during debugging
syntropyLog.reconfigureLoggingMatrix({
  info: ['correlationId', 'serviceName', 'userId', 'operation'],
});

// Reduce context in error logs for production
syntropyLog.reconfigureLoggingMatrix({
  error: ['correlationId', 'userId', 'errorCode'],
});

// Changes take effect immediately
logger.info('Operation completed'); // Now includes userId and operation
```

## 🔒 Data Masking

Configure masking in `init()` so sensitive fields are redacted before any transport:

```typescript
await syntropyLog.init({
  logger: { serviceName: 'my-app', level: 'info', transports: [new ClassicConsoleTransport()] },
  masking: {
    enableDefaultRules: true,
    rules: [
      { pattern: /password|token|secret/i, strategy: 'password' },
      { pattern: /creditCard|cardNumber/i, strategy: 'card' },
    ],
  },
});

// Sensitive data is automatically masked in log output
logger.info('User created', {
  userId: 123,
  email: 'user@example.com',
  password: 'secret123', // Masked in output
  creditCard: '1234-5678-9012-3456', // Masked in output
});
```

## 🎯 Advanced Features

### Fluent API
```typescript
logger
  .withSource('auth-controller')
  .withTransactionId('tx-12345')
  .info('User authentication completed', { 
    userId: 123, 
    method: 'oauth2',
    provider: 'google' 
  });
```

### Error Logging
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error({ err: error }, 'Operation failed', {
    operation: 'database_query',
    duration: 1500,
  });
}
```

### Structured Data
```typescript
logger.info('API Request', {
  method: 'GET',
  url: '/api/users',
  statusCode: 200,
  duration: 45,
  userAgent: 'Mozilla/5.0...',
});
```

## ⚡ Performance Considerations

- **Minimal overhead** - Less than 1ms per log operation
- **Intelligent serialization** - Only serialize what's needed
- **Async operations** - Non-blocking logging
- **Memory efficient** - Singleton pattern prevents leaks

## 🔧 Configuration Options

```typescript
await syntropyLog.init({
  logger: {
    level: 'info', // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
    serviceName: 'my-enterprise-app',
    transports: [new ClassicConsoleTransport()],
    serializerTimeoutMs: 50, // Prevent slow serializers from blocking
  },
});
```

See [Configuration](/docs/configuration/) for the full config shape.

## 🎯 Best Practices

1. **Use appropriate log levels** - Don't log everything at the same level
2. **Include relevant context** - Add useful information for debugging
3. **Structure your data** - Use objects for structured logging
4. **Mask sensitive data** - Always configure data masking
5. **Use correlation IDs** - Enable automatic correlation for distributed tracing
6. **Choose the right transports** — Different transports for different environments
7. **Use multiple loggers** — One per subsystem (service, axios, kafka, etc.) with the same correlation ID; see [Multiple loggers and transports](/docs/core-concepts/multiple-loggers-and-transports)