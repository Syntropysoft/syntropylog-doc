---
id: configuration
title: Configuration Guide
sidebar_label: Configuration
description: Complete guide to configuring SyntropyLog for your application
---

# Configuration Guide

This guide covers all aspects of configuring SyntropyLog for your application.

## Quick Configuration

For most applications, you'll want HTTP instrumentation and context management:

```typescript
import { syntropyLog, PrettyConsoleTransport } from 'syntropylog';
import { AxiosAdapter } from '@syntropylog/adapters';
import axios from 'axios';

await syntropyLog.init({
  logger: {
    level: 'info',
    serviceName: 'my-app',
    transports: [new PrettyConsoleTransport()],
  },
  loggingMatrix: {
    default: ['correlationId'],
    error: ['*'], // Log everything on errors
  },
  http: {
    instances: [
      {
        instanceName: 'myApi',
        adapter: new AxiosAdapter(axios.create({ baseURL: 'https://api.example.com' })),
      },
    ],
  },
});
```

## Configuration Options

### Logger Configuration

```typescript
logger: {
  level: 'info',                    // Log level: 'debug', 'info', 'warn', 'error'
  serviceName: 'my-app',            // Service name for correlation
  transports: [new PrettyConsoleTransport()], // Logging transports
}
```

### HTTP Configuration

```typescript
http: {
  instances: [
    {
      instanceName: 'myApi',        // Unique name for this HTTP client
      adapter: new AxiosAdapter(axios.create({ baseURL: 'https://api.example.com' })),
    },
  ],
}
```

### Redis Configuration

```typescript
redis: {
  instances: [
    {
      instanceName: 'cache',        // Unique name for this Redis instance
      host: 'localhost',
      port: 6379,
    },
    {
      instanceName: 'session',      // Another Redis instance
      host: 'localhost', 
      port: 6380,
    },
  ],
}
```

### Broker Configuration

```typescript
brokers: {
  instances: [
    {
      instanceName: 'events',       // Unique name for this broker
      type: 'kafka',
      config: {
        clientId: 'my-app',
        brokers: ['localhost:9092'],
      },
    },
  ],
}
```

## Advanced Configuration

### Custom Serializers

```typescript
serializers: {
  custom: {
    mySerializer: {
      serialize: (data) => JSON.stringify(data),
      deserialize: (data) => JSON.parse(data),
    },
  },
}
```

### Custom Transports

```typescript
transports: {
  custom: {
    myTransport: {
      log: (level, message, meta) => {
        // Custom logging logic
      },
    },
  },
}
```

## Environment-Specific Configuration

### Development

```typescript
const config = {
  logger: {
    level: 'debug',
    transports: [new PrettyConsoleTransport()],
  },
  // Minimal configuration for development
};
```

### Production

```typescript
const config = {
  logger: {
    level: 'info',
    transports: [
      new JsonConsoleTransport(),
      new FileTransport({ filename: '/var/log/app.log' }),
    ],
  },
  // Full configuration for production
};
```

## Testing Configuration

For testing, use the SyntropyLogMock:

```typescript
const { createTestHelper } = require('syntropylog/testing');
const testHelper = createTestHelper();

// No configuration needed - everything is mocked
const service = new MyService(testHelper.mockSyntropyLog);
```

## Next Steps

- **[Getting Started](./getting-started)** - Complete setup guide
- **[API Reference](./api-reference)** - Full API documentation
- **[Examples](./examples)** - Production-ready examples
- **[Production Guide](./production)** - Production deployment guide 