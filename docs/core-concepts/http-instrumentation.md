---
sidebar_position: 4
description: HTTP correlation without getHttp() — Axios interceptors, inject correlation ID header. Request/response logging with same correlation ID.
---

# HTTP Instrumentation

SyntropyLog does **not** ship a built-in HTTP client or `getHttp()`. You keep using your own client (e.g. Axios) and add **request interceptors** that inject the correlation ID from the context manager. That way, outbound requests carry the same correlation ID as your logs.

## Overview

- **No `getHttp()`** — Use your existing HTTP client.
- **Correlation via interceptors** — In the request interceptor, set the correlation ID header using `getContextManager().getCorrelationId()` and `getCorrelationIdHeaderName()`.
- **Logging** — Log requests/responses yourself with `syntropyLog.getLogger()` (e.g. `LoggerName.axios` if you use a [central logger config](/docs/core-concepts/multiple-loggers-and-transports#use-loggers-from-anywhere)) inside the same context so the correlation ID is included.

## Basic pattern: Axios interceptors

After initializing SyntropyLog and once `ready` has fired, get the context manager and attach an Axios request interceptor so every outbound request gets the correlation ID header.

```typescript
import axios from 'axios';
import { syntropyLog } from 'syntropylog';

// After syntropyLog is ready:
const contextManager = syntropyLog.getContextManager();
const axiosInstance = axios.create({ baseURL: 'https://api.example.com' });

axiosInstance.interceptors.request.use((config) => {
  const headerName = contextManager.getCorrelationIdHeaderName();
  const correlationId = contextManager.getCorrelationId();
  if (correlationId) {
    config.headers[headerName] = correlationId;
  }
  return config;
});
```

All requests made with `axiosInstance` will now include the correlation ID (e.g. `x-correlation-id`) in the headers. Downstream services can read it and use it in their logs.

## Optional: response and error logging

You can add response/error interceptors and log with the same logger so everything stays in the same correlation context. Use **debug** for successful responses (to avoid noise) and **info** or **error** for failures:

```typescript
const logger = syntropyLog.getLogger('http');

axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug('HTTP response', {
      method: response.config.method,
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    logger.error('HTTP request failed', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

## Running each request in its own context

For incoming HTTP (e.g. Express), run each request inside `contextManager.run()` and optionally set the correlation ID from the incoming header:

```typescript
const contextManager = syntropyLog.getContextManager();
const headerName = contextManager.getCorrelationIdHeaderName();

app.use((req, res, next) => {
  const incomingId = req.headers[headerName] as string | undefined;
  contextManager.run(async () => {
    if (incomingId) contextManager.setCorrelationId(incomingId);
    // ... set userId, requestId, etc. from req ...
    next();
  });
});
```

Then the Axios interceptor above will send that same correlation ID (or a new one if none was provided) on outbound calls.

## Full runnable example in the repo

The doc above shows the pattern; for a **complete runnable app** (server + withContext + Axios instance and interceptors), use the examples in the repo:

- **[10-basic-http-correlation](https://github.com/Syntropysoft/syntropylog-examples/tree/main/10-basic-http-correlation)** — Correlation ID in headers and context.
- **[11-axios-interceptors](https://github.com/Syntropysoft/syntropylog-examples/tree/main/11-axios-interceptors)** — Axios request/response interceptors with SyntropyLog context.

## Summary

| What you need | How |
|---------------|-----|
| Correlation on outbound HTTP | Axios (or other) request interceptor that sets `contextManager.getCorrelationIdHeaderName()` → `contextManager.getCorrelationId()`. |
| Correlation on incoming HTTP | Run each request in `contextManager.run()` and optionally set correlation ID from request headers. |
| Request/response logging | Use `syntropyLog.getLogger()` in interceptors or in your handlers; no built-in HTTP logger. |

No `getHttp()`, `http.instances`, or adapters are required in the core library; your HTTP client stays the single source of truth.
