---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with SyntropyLog

Get started with SyntropyLog in **30 seconds** with this quick start guide.

## 🚀 Installation

```bash
npm install @syntropylog/core
```

## 📝 Basic Example

```typescript
import { SyntropyLog, ClassicConsoleTransport } from '@syntropylog/core';

// Initialize SyntropyLog
const syntropyLog = SyntropyLog.init({
  serviceName: 'my-service',
  logLevel: 'info',
  transports: [new ClassicConsoleTransport()]
});

// Basic logging
syntropyLog.info('Application started');
syntropyLog.warn('Configuration not found, using defaults');
syntropyLog.error('Database connection failed', { 
  error: 'Connection timeout',
  retryCount: 3 
});
```

## 🔗 Context and Correlation

```typescript
// Create context for an operation
const context = syntropyLog.createContext({
  userId: 123,
  requestId: 'req-456',
  sessionId: 'sess-789'
});

// Use context in logs
context.info('User authenticated successfully');
context.debug('Validating permissions', { permissions: ['read', 'write'] });

// Context propagates automatically
setTimeout(() => {
  context.info('Background operation completed');
}, 1000);
```

## 🌐 HTTP Instrumentation

```typescript
import { HttpManager, AxiosAdapter } from '@syntropylog/core';

// Configure HTTP manager
const httpManager = new HttpManager({
  adapters: [new AxiosAdapter()]
});

// HTTP calls are automatically instrumented
const response = await httpManager.request({
  method: 'GET',
  url: 'https://api.example.com/users',
  headers: { 'Authorization': 'Bearer token' }
});

// Logs include correlation ID automatically
```

## 📨 Message Brokers

```typescript
import { BrokerManager, KafkaAdapter } from '@syntropylog/core';

// Configure broker manager
const brokerManager = new BrokerManager({
  adapters: [new KafkaAdapter()]
});

// Publish message with automatic correlation
await brokerManager.publish('user-events', {
  type: 'user.created',
  data: { userId: 123, email: 'user@example.com' }
});

// Subscribe to messages
await brokerManager.subscribe('user-events', (message) => {
  console.log('Message received:', message);
});
```

## 🛡️ Data Masking

```typescript
// Configure sensitive fields for masking
syntropyLog.configureMasking({
  fields: ['password', 'token', 'creditCard', 'ssn']
});

// Sensitive data is automatically masked
syntropyLog.info('User created', {
  userId: 123,
  email: 'user@example.com',
  password: 'secret123', // Will show as "***"
  creditCard: '1234-5678-9012-3456' // Will show as "***"
});
```

## 🎯 Advanced Configuration

```typescript
const syntropyLog = SyntropyLog.init({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
  environment: 'production',
  logLevel: 'info',
  
  // Context configuration
  context: {
    enableCorrelation: true,
    correlationHeader: 'x-correlation-id'
  },
  
  // Masking configuration
  masking: {
    fields: ['password', 'token', 'secret'],
    replacement: '***'
  },
  
  // Transports
  transports: [
    new ClassicConsoleTransport(),
    new CompactConsoleTransport(),
    // new FileTransport({ path: './logs/app.log' })
  ]
});
```

## 📚 Next Steps

1. **Explore examples**: Check out the [complete examples](/examples) for advanced use cases
2. **Production configuration**: Learn about [advanced configuration](/docs/core-concepts/logger)
3. **API Reference**: Consult the [API documentation](/docs/api-reference/)
4. **Core Concepts**: Understand the [design principles](/docs/core-concepts/logger)

## 🆘 Need Help?

- **Documentation**: Explore detailed guides
- **Examples**: Review examples 00-24
- **GitHub**: [SyntropyLog Repository](https://github.com/Syntropysoft/SyntropyLog)
- **Issues**: Report bugs or request features

You're ready to use SyntropyLog! 🚀 