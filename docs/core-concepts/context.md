---
sidebar_position: 2
---

# Context Management

SyntropyLog's context management system provides automatic correlation and context propagation across your entire application.

## 🎯 Overview

The context system enables:
- **Automatic correlation** - Single ID connects all operations
- **Context propagation** - Data flows through HTTP calls, message brokers, and Redis
- **Framework agnostic** - Works with any Node.js application
- **Zero boilerplate** - No manual context passing required

## 🚀 Basic Usage

```typescript
import { syntropyLog } from 'syntropylog';

// Initialize with context configuration
await syntropyLog.init({
  context: {
    correlationIdHeader: 'X-Correlation-ID',
  },
});

// Get context manager
const contextManager = syntropyLog.getContextManager();

// Set context data
contextManager.set('userId', 123);
contextManager.set('requestId', 'req-456');
contextManager.set('sessionId', 'sess-789');

// Context is automatically included in all logs
const logger = syntropyLog.getLogger();
logger.info('User authenticated successfully');
```

## 🔗 Automatic Correlation

SyntropyLog automatically generates and propagates correlation IDs:

```typescript
// Correlation ID is automatically generated for each request
const correlationId = contextManager.getCorrelationId();

// All subsequent operations use the same correlation ID
logger.info('Processing user request');
await httpClient.get('/api/users');
await redis.set('user:123', userData);
await broker.publish('user.updated', event);

// All logs and operations share the same correlation ID
```

## 🌐 HTTP Context Propagation

Context automatically propagates through HTTP calls:

```typescript
// Configure HTTP client with context propagation
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        propagate: ['correlationId', 'userId', 'tenantId'],
      },
    ],
  },
});

// Context is automatically added to HTTP headers
const httpClient = syntropyLog.getHttp('api');
await httpClient.request({
  method: 'GET',
  url: '/api/users',
  // Headers automatically include:
  // X-Correlation-ID: abc-123-def-456
  // X-User-ID: 123
  // X-Tenant-ID: tenant-1
});
```

## 📡 Message Broker Context Propagation

Context flows through message brokers:

```typescript
// Configure broker with context propagation
await syntropyLog.init({
  brokers: {
    instances: [
      {
        instanceName: 'events',
        adapter: new KafkaAdapter(kafkaConfig),
        propagate: ['correlationId', 'userId', 'eventType'],
      },
    ],
  },
});

// Context is automatically included in messages
const broker = syntropyLog.getBroker('events');
await broker.publish('user.created', {
  userId: 123,
  email: 'user@example.com',
  // Message automatically includes correlation ID and context
});
```

## 🗄️ Redis Context Propagation

Context is included in Redis operations:

```typescript
// Configure Redis with context logging
await syntropyLog.init({
  redis: {
    instances: [
      {
        instanceName: 'cache',
        url: 'redis://localhost:6379',
        logging: {
          onSuccess: 'debug',
          onError: 'error',
          logCommandValues: true,
        },
      },
    ],
  },
});

// Context is automatically logged with Redis operations
const redis = syntropyLog.getRedis('cache');
await redis.set('user:123', userData);
// Log includes correlation ID and context
```

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

## 🔄 Context Lifecycle

### Request Context
```typescript
// Context is automatically created for each request
app.use((req, res, next) => {
  // SyntropyLog automatically generates correlation ID
  // and sets up context for this request
  
  // Add request-specific data
  contextManager.set('userId', req.user?.id);
  contextManager.set('ip', req.ip);
  contextManager.set('userAgent', req.get('User-Agent'));
  
  next();
});
```

### Background Operations
```typescript
// Context persists across async operations
setTimeout(() => {
  // Same correlation ID and context
  logger.info('Background operation completed');
}, 1000);

// Context works with promises
Promise.resolve().then(() => {
  // Context is still available
  logger.info('Promise resolved');
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

You can modify the loggingMatrix at runtime:

```typescript
// Change logging matrix dynamically
syntropyLog.updateLoggingMatrix({
  info: ['correlationId', 'serviceName', 'userId'], // Add userId to info logs
  error: ['correlationId', 'userId', 'errorCode'], // Reduce error context
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
    enableCorrelation: true,
    correlationIdGenerator: () => `req-${Date.now()}-${Math.random()}`,
    defaultContext: {
      serviceName: 'my-app',
      environment: 'production',
    },
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

## 🔍 Debugging Context

```typescript
// Get all current context
const allContext = contextManager.getAll();
console.log('Current context:', allContext);

// Get specific context value
const userId = contextManager.get('userId');

// Check if context exists
const hasUserId = contextManager.has('userId');

// Remove specific context
contextManager.remove('userId');

// Clear all context
contextManager.clear();
```

## ⚡ Performance Considerations

- **Minimal overhead** - Context operations are optimized
- **Memory efficient** - Context is cleaned up automatically
- **Fast propagation** - Context flows through all operations
- **Singleton pattern** - Prevents memory leaks 