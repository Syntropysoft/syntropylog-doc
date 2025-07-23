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
        propagate: [\correlationId', 'userId', 'tenantId'],
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
contextManager.set('permissions', [\read', 'write', 'delete']);
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

## ⚡ Performance Considerations

- **Minimal overhead** - Context operations are optimized
- **Memory efficient** - Context is cleaned up automatically
- **Fast propagation** - Context flows through all operations
- **Singleton pattern** - Prevents memory leaks
