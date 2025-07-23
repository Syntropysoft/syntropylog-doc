---
id: api-reference
title: API Reference
sidebar_label: API Reference
---

# API Reference

## Overview

SyntropyLog provides a comprehensive API for observability in Node.js applications. This reference covers all public APIs and their usage.

## Core Modules

### Logger

The main logging interface for structured logging with context propagation.

```typescript
import { syntropyLog } from 'syntropylog';

// Get logger instance
const logger = syntropyLog.getLogger();

// Basic logging
logger.info('Application started', { userId: 123 });
logger.error('Database connection failed', { error: 'Connection timeout' });
```

### Context Management

Manage distributed tracing context across your application.

```typescript
import { syntropyLog } from 'syntropylog';

// Set context
syntropyLog.setContext('userId', 123);
syntropyLog.setContext('requestId', 'req-456');

// Get context
const context = syntropyLog.getContext();
```

### HTTP Instrumentation

Automatic HTTP request/response logging and correlation.

```typescript
import { syntropyLog } from 'syntropylog';

// Get instrumented HTTP client
const httpClient = syntropyLog.getHttpClient();

// Make requests with automatic logging
const response = await httpClient.get('https://api.example.com/users');
```

### Redis Integration

Distributed state management with Redis.

```typescript
import { syntropyLog } from 'syntropylog';

// Get Redis instance
const redis = syntropyLog.getRedis();

// Use Redis for state management
await redis.set('user:123:session', JSON.stringify(sessionData));
```

### Message Brokers

Integration with Kafka, RabbitMQ, and NATS.

```typescript
import { syntropyLog } from 'syntropylog';

// Get broker instance
const broker = syntropyLog.getBroker();

// Publish messages with correlation
await broker.publish('user.events', { userId: 123, action: 'login' });
```

## Configuration

### Basic Configuration

```typescript
import { syntropyLog } from 'syntropylog';

syntropyLog.configure({
  level: 'info',
  transports: ['console', 'file'],
  context: {
    service: 'user-service',
    version: '1.0.0'
  }
});
```

### Advanced Configuration

```typescript
syntropyLog.configure({
  level: 'debug',
  transports: {
    console: {
      format: 'pretty',
      level: 'info'
    },
    file: {
      path: './logs/app.log',
      level: 'debug'
    }
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  http: {
    correlation: true,
    masking: ['password', 'token']
  }
});
```

## LoggingMatrix

Control which context fields are logged at each level.

```typescript
syntropyLog.setLoggingMatrix({
  error: ['*'],           // Log all fields on error
  warn: ['userId', 'requestId', 'service'],
  info: ['userId', 'service'],
  debug: ['requestId']     // Minimal context on debug
});
```

## Error Handling

```typescript
try {
  // Your application code
} catch (error) {
  logger.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    context: syntropyLog.getContext()
  });
}
```

## Best Practices

1. **Always use structured logging** - Pass objects instead of string concatenation
2. **Set context early** - Initialize context at the start of each request
3. **Use appropriate log levels** - Don't log everything at debug level
4. **Configure LoggingMatrix** - Control what context is logged at each level
5. **Handle errors gracefully** - Always catch and log errors with context

## Migration Guide

### From console.log

```typescript
// Before
console.log('User logged in:', userId);

// After
logger.info('User logged in', { userId });
```

### From winston

```typescript
// Before
winston.info('Request processed', { userId, duration });

// After
logger.info('Request processed', { userId, duration });
```

## Troubleshooting

### Common Issues

1. **Context not propagating** - Ensure context is set before logging
2. **Redis connection errors** - Check Redis configuration and connectivity
3. **HTTP correlation not working** - Verify HTTP adapter is properly configured
4. **Performance issues** - Review LoggingMatrix configuration

### Debug Mode

Enable debug mode for detailed logging:

```typescript
syntropyLog.configure({
  level: 'debug',
  debug: true
});
```

---

*For more detailed examples, see the [Examples](/examples) section.* 