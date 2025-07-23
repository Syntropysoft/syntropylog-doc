---
sidebar_position: 3
---

# HTTP Instrumentation

SyntropyLog's HTTP instrumentation provides automatic request/response logging, context propagation, and correlation across HTTP calls.

## 🎯 Overview

HTTP instrumentation enables:
- **Automatic logging** - Request/response details logged automatically
- **Context propagation** - Correlation IDs and context flow through headers
- **Framework agnostic** - Works with any HTTP client via adapters
- **Performance monitoring** - Request duration and status tracking

## 🚀 Basic Usage

```typescript
import { syntropyLog } from 'syntropylog';
import { AxiosAdapter } from '@syntropylog/adapters';
import axios from 'axios';

// Initialize with HTTP configuration
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create({ 
          baseURL: 'https://api.example.com' 
        })),
      },
    ],
  },
});

// Use the instrumented client
const httpClient = syntropyLog.getHttp('api');
const response = await httpClient.request({
  method: 'GET',
  url: '/users',
});
```

## 🏗️ Singleton Pattern

HTTP clients use singleton pattern for efficient resource management:

```typescript
// First call - creates and returns new instance
const client1 = syntropyLog.getHttp('api');

// Second call - returns the SAME instance (singleton)
const client2 = syntropyLog.getHttp('api');

// client1 === client2 ✅
// Same connection pool and configuration
```

## 🔗 Context Propagation

Context automatically propagates through HTTP headers:

```typescript
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

// Set context data
const contextManager = syntropyLog.getContextManager();
contextManager.set('userId', 123);
contextManager.set('tenantId', 'tenant-1');

// Context is automatically added to headers
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

## 📊 Automatic Logging

HTTP operations are automatically logged with context:

```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          onRequest: 'info',
          onSuccess: 'debug',
          onError: 'error',
          logRequestHeaders: false,
          logRequestBody: true,
          logResponseHeaders: false,
          logResponseBody: false,
        },
      },
    ],
  },
});

// All HTTP operations are automatically logged
const httpClient = syntropyLog.getHttp('api');

// This will log: "HTTP Request: GET /api/users"
await httpClient.get('/api/users');

// This will log: "HTTP Response: 200 OK" (at debug level)
// This will log: "HTTP Error: 500 Internal Server Error" (at error level)
```

## 🎨 Multiple HTTP Clients

Configure multiple HTTP clients for different services:

```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'userApi',
        adapter: new AxiosAdapter(axios.create({ 
          baseURL: 'https://api.users.com' 
        })),
        propagate: ['correlationId', 'userId'],
        logging: {
          onSuccess: 'debug',
          onError: 'error',
        },
      },
      {
        instanceName: 'paymentApi',
        adapter: new AxiosAdapter(axios.create({ 
          baseURL: 'https://api.payments.com' 
        })),
        propagate: ['correlationId', 'paymentId'],
        logging: {
          onSuccess: 'info', // More verbose for payments
          onError: 'warn',
          logResponseBody: true, // Log payment responses
        },
      },
    ],
    default: 'userApi', // Default instance
  },
});

// Use different clients
const userClient = syntropyLog.getHttp('userApi');
const paymentClient = syntropyLog.getHttp('paymentApi');

await userClient.get('/users/123');
await paymentClient.post('/payments', paymentData);
```

## 🔧 Adapter Pattern

SyntropyLog uses adapters to support any HTTP client:

### Axios Adapter
```typescript
import { AxiosAdapter } from '@syntropylog/adapters';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

const adapter = new AxiosAdapter(axiosInstance);
```

### Fetch Adapter
```typescript
import { FetchAdapter } from '@syntropylog/adapters';

const adapter = new FetchAdapter();
```

### Custom Adapter
```typescript
import { IHttpAdapter } from 'syntropylog';

class CustomHttpAdapter implements IHttpAdapter {
  async request(config: any) {
    // Your custom HTTP client implementation
    return response;
  }
}

const adapter = new CustomHttpAdapter();
```

## 🎯 Logging Configuration

Fine-tune what gets logged for each HTTP operation:

```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          onRequest: 'info',      // Log when request starts
          onSuccess: 'debug',     // Log successful responses
          onError: 'error',       // Log errors
          logRequestHeaders: false,  // Don't log request headers
          logRequestBody: true,      // Log request body
          logResponseHeaders: false, // Don't log response headers
          logResponseBody: false,    // Don't log response body
          logDuration: true,         // Log request duration
        },
      },
    ],
  },
});
```

## 🔒 Security Features

### Header Redaction
```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          redactHeaders: ['authorization', 'cookie', 'x-api-key'],
          logRequestHeaders: true,
        },
      },
    ],
  },
});

// Sensitive headers are automatically redacted in logs
await httpClient.request({
  headers: {
    'Authorization': 'Bearer secret-token', // Will show as "***"
    'Content-Type': 'application/json',     // Will show normally
  },
});
```

### Body Masking
```typescript
await syntropyLog.init({
  masking: {
    fields: ['password', 'token', 'creditCard'],
  },
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          logRequestBody: true,
        },
      },
    ],
  },
});

// Sensitive data in request body is automatically masked
await httpClient.post('/users', {
  email: 'user@example.com',
  password: 'secret123', // Will show as "***"
});
```

## ⚡ Performance Monitoring

Track HTTP performance automatically:

```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          logDuration: true,
          logStatusCodes: true,
        },
      },
    ],
  },
});

// Performance metrics are automatically logged
const startTime = Date.now();
await httpClient.get('/api/users');
// Logs: "HTTP Response: 200 OK (45ms)"
```

## 🎯 Error Handling

HTTP errors are automatically logged with context:

```typescript
try {
  await httpClient.get('/api/users');
} catch (error) {
  // Error is automatically logged with:
  // - Request details (method, URL, headers)
  // - Response details (status, body)
  // - Duration
  // - Full context (correlation ID, etc.)
  
  // You can also log additional context
  logger.error({ err: error }, 'API call failed', {
    operation: 'fetch_users',
    retryCount: 3,
  });
}
```

## 🔧 Configuration Options

```typescript
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        isDefault: true,
        propagate: ['correlationId', 'userId', 'tenantId'],
        logging: {
          onRequest: 'info',
          onSuccess: 'debug',
          onError: 'error',
          logRequestHeaders: false,
          logRequestBody: true,
          logResponseHeaders: false,
          logResponseBody: false,
          logDuration: true,
          redactHeaders: ['authorization'],
        },
        timeout: 5000,
        retries: 3,
      },
    ],
    default: 'api',
  },
});
```

## 🎯 Best Practices

1. **Use meaningful instance names** - Choose descriptive names for different APIs
2. **Configure appropriate logging levels** - Don't log everything at the same level
3. **Redact sensitive headers** - Always redact authorization and API keys
4. **Use context propagation** - Enable correlation for distributed tracing
5. **Monitor performance** - Enable duration logging for performance tracking
6. **Handle errors gracefully** - Use try-catch blocks for error handling
7. **Use adapters** - Leverage the adapter pattern for framework agnosticism

## 🔍 Debugging HTTP Calls

```typescript
// Enable verbose logging for debugging
await syntropyLog.init({
  http: {
    instances: [
      {
        instanceName: 'api',
        adapter: new AxiosAdapter(axios.create()),
        logging: {
          onRequest: 'debug',
          onSuccess: 'debug',
          onError: 'debug',
          logRequestHeaders: true,
          logRequestBody: true,
          logResponseHeaders: true,
          logResponseBody: true,
        },
      },
    ],
  },
});

// All HTTP operations will be logged in detail
```

## ⚡ Performance Considerations

- **Minimal overhead** - HTTP instrumentation adds <1ms per request
- **Connection pooling** - Adapters reuse connections when possible
- **Async operations** - All HTTP calls are non-blocking
- **Memory efficient** - Singleton pattern prevents connection leaks 