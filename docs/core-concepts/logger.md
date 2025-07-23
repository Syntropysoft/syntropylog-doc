---
sidebar_position: 1
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

```typescript
import { syntropyLog } from 'syntropylog';

// Initialize SyntropyLog
await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
  },
});

// Get logger instance
const logger = syntropyLog.getLogger();

// Basic logging
logger.info('Application started');
logger.warn('Configuration not found, using defaults');
logger.error('Database connection failed', { 
  error: 'Connection timeout',
  retryCount: 3 
});
```

## 🏗️ Singleton Pattern

SyntropyLog uses a singleton pattern for logger instances to prevent memory leaks and ensure consistency:

```typescript
// First call - creates and returns new instance
const logger1 = syntropyLog.getLogger('user-service');

// Second call - returns the SAME instance (singleton)
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

SyntropyLog supports multiple transport types for different environments:

### Pretty Console Transport (Development)
```typescript
import { PrettyConsoleTransport } from 'syntropylog';

await syntropyLog.init({
  logger: {
    transports: [new PrettyConsoleTransport()],
  },
});
```

### Classic Console Transport (Production)
```typescript
import { ClassicConsoleTransport } from 'syntropylog';

await syntropyLog.init({
  logger: {
    transports: [new ClassicConsoleTransport()],
  },
});
```

### Multiple Transports
```typescript
await syntropyLog.init({
  logger: {
    transports: [
      new PrettyConsoleTransport(), // Development
      new ClassicConsoleTransport(), // Production JSON
      // Custom transports for external services
    ],
  },
});
```

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

You can modify the loggingMatrix dynamically:

```typescript
// Add more context to info logs during debugging
syntropyLog.updateLoggingMatrix({
  info: ['correlationId', 'serviceName', 'userId', 'operation'],
});

// Reduce context in error logs for production
syntropyLog.updateLoggingMatrix({
  error: ['correlationId', 'userId', 'errorCode'],
});

// Changes take effect immediately
logger.info('Operation completed'); // Now includes userId and operation
```

## 🔒 Data Masking

SyntropyLog automatically masks sensitive data:

```typescript
await syntropyLog.init({
  masking: {
    fields: ['password', 'token', 'creditCard', 'ssn'],
    replacement: '***',
  },
});

// Sensitive data is automatically masked
logger.info('User created', {
  userId: 123,
  email: 'user@example.com',
  password: 'secret123', // Will show as "***"
  creditCard: '1234-5678-9012-3456' // Will show as "***"
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
    name: 'my-custom-logger',
    level: 'info', // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
    serviceName: 'my-enterprise-app',
    serviceVersion: '1.0.0',
    environment: 'production',
    transports: [new ClassicConsoleTransport()],
    serializerTimeoutMs: 50, // Prevent slow serializers from blocking
    prettyPrint: {
      enabled: process.env.NODE_ENV !== 'production',
    },
  },
});
```

## 🎯 Best Practices

1. **Use appropriate log levels** - Don't log everything at the same level
2. **Include relevant context** - Add useful information for debugging
3. **Structure your data** - Use objects for structured logging
4. **Mask sensitive data** - Always configure data masking
5. **Use correlation IDs** - Enable automatic correlation for distributed tracing
6. **Choose the right transports** - Different transports for different environments 