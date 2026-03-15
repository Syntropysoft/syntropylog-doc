---
sidebar_position: 2
description: Multiple loggers with same correlation ID — LoggerName enum, transport pool, per-call routing. Trace requests across service, Axios, Kafka.
---

# Multiple loggers and transports

Use **multiple loggers** (one per subsystem: service, HTTP client, Kafka, DB, etc.) so you can identify where each log comes from. They all share the **same correlation ID** when you run inside the same context (`contextManager.run()`), so you can trace the full journey of a request across systems.

## One correlation ID, many loggers

The context manager is a singleton. Every logger you get with `getLogger(name)` uses that same context. So inside one `contextManager.run()` (e.g. one HTTP request):

- `getLogger('service').info(...)` — app logic
- `getLogger('axios').info(...)` — outgoing HTTP
- `getLogger('kafka').info(...)` — message publish/consume
- `getLogger('db').info(...)` — database layer

all carry the **same** `correlationId`. In your log aggregator you filter or group by `correlationId` to see the whole flow; the logger **name** (or `source` you add via `.withSource()`) tells you which part of the system wrote the log.

## Use loggers from anywhere

Once the framework is initialized, you can call `getLogger(name)` from **any part of your application** — controllers, services, HTTP client wrappers, Kafka handlers, etc. Each logger keeps the same characteristics you configured (name, transports, level); the active context (and thus the correlation ID) is the one for the current `run()` scope (e.g. the current request). So: configure once at startup, then use the loggers wherever you need them.

A clean, **optional** approach is to centralize logger creation in one place (e.g. a small **logger config module**) and use an **enum** so you have a single list of logger names and avoid typos. It’s a bit more advanced, but very declarative: one place to see which loggers exist and good autocomplete.

```typescript
// loggers.ts — central config, use from anywhere
import { syntropyLog } from 'syntropylog';

export const LoggerName = {
  service: 'service',
  axios:   'axios',
  kafka:   'kafka',
  db:      'db',
} as const;
export type LoggerName = (typeof LoggerName)[keyof typeof LoggerName];

export function getAppLogger(name: LoggerName) {
  return syntropyLog.getLogger(name);
}

// Anywhere in the app:
import { syntropyLog, LoggerName } from './loggers';

const logService = syntropyLog.getLogger(LoggerName.service);
const logHttp    = syntropyLog.getLogger(LoggerName.axios);
const logKafka   = syntropyLog.getLogger(LoggerName.kafka);

logService.info('Request received');
logHttp.info('Outgoing request', { method: 'GET', url: '/api/users' });
logKafka.info('Message published', { topic: 'orders' });
```

Or with a TypeScript enum (camelCase keys):

```typescript
enum LoggerName {
  service = 'service',
  axios   = 'axios',
  kafka   = 'kafka',
  db      = 'db',
}
const logKafka = syntropyLog.getLogger(LoggerName.kafka);
```

From then on, use `syntropyLog.getLogger(LoggerName.service)`, `LoggerName.axios`, etc. from any file; same config, same correlation ID when inside the same context. Optional, but very declarative.

## Pattern 1: Named loggers, shared transports

Configure one set of transports (e.g. console + a generic adapter). Create one logger per subsystem by name. All use the same transports; the name identifies the source.

```typescript
await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transports: [new ClassicConsoleTransport()],
  },
  context: { correlationIdHeader: 'x-correlation-id' },
});

// Inside withContext (e.g. per request). Assume LoggerName from your loggers config:
const logService = syntropyLog.getLogger(LoggerName.service);
const logHttp    = syntropyLog.getLogger(LoggerName.axios);
const logKafka   = syntropyLog.getLogger(LoggerName.kafka);

logService.info('Request received');
// … call downstream via Axios …
logHttp.info('Outgoing request', { method: 'GET', url: '/api/users' });
// … publish to Kafka …
logKafka.info('Message published', { topic: 'orders' });
logService.info('Request completed');
// All share the same correlationId
```

Each log entry will include the logger name (or service name) and the same `correlationId`, so you can trace service → axios → kafka → service under one ID.

## Pattern 2: Named transports pool and per-call routing

Define a **transport pool** with `transportList` and choose which transports receive logs per environment with `env`. Then use **per-call** `.override()`, `.add()`, or `.remove()` so a given log goes only to the transports you want (e.g. HTTP logs also to an “HTTP” transport, Kafka logs to a “Kafka” transport).

```typescript
import {
  syntropyLog,
  ClassicConsoleTransport,
  AdapterTransport,
  UniversalAdapter,
} from 'syntropylog';

const consoleT = new ClassicConsoleTransport({ name: 'console' });
const httpT    = new AdapterTransport({ name: 'http', adapter: new UniversalAdapter({ executor: writeHttpLogs }) });
const kafkaT   = new AdapterTransport({ name: 'kafka', adapter: new UniversalAdapter({ executor: writeKafkaLogs }) });

await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transportList: {
      console: consoleT,
      http:    httpT,
      kafka:   kafkaT,
    },
    env: {
      development: ['console'],
      production:  ['console', 'http', 'kafka'],
    },
  },
});

// Default: all configured env transports
const logService = syntropyLog.getLogger(LoggerName.service);
logService.info('Started');

// This call only to console + http transport
syntropyLog.getLogger(LoggerName.axios).override('console', 'http').info('HTTP request', { url });

// This call only to console + kafka transport
syntropyLog.getLogger(LoggerName.kafka).override('console', 'kafka').info('Kafka publish', { topic });
```

Same idea: one context, one correlation ID; logger name + override/add/remove let you route and identify the journey (service vs axios vs kafka).

## Pattern 3: Different transport sets per logger name

You can configure **different transport arrays per logger name** by passing `transports` as a record. Then `getLogger('service')` uses the `service` set, `getLogger('axios')` the `axios` set, and so on. You still have a single context, so the same correlation ID flows through all of them.

```typescript
await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
    transports: {
      default: [new ClassicConsoleTransport()],
      service: [new ClassicConsoleTransport(), dbTransport],
      axios:   [new ClassicConsoleTransport(), httpLogTransport],
      kafka:   [new ClassicConsoleTransport(), kafkaTransport],
    },
  },
});

// Each logger sends to its own set; all share correlationId from context
const logService = syntropyLog.getLogger(LoggerName.service);
const logHttp    = syntropyLog.getLogger(LoggerName.axios);
const logKafka   = syntropyLog.getLogger(LoggerName.kafka);
```

Use a `default` key for any `getLogger('other')` that doesn’t match a key in `transports`.

## How the correlation ID travels

1. **Incoming request** — Your middleware (e.g. [withContext](/docs/getting-started#context-and-correlation)) runs `contextManager.run()` and sets the correlation ID from the header (or generates one). Every logger used inside that `run()` shares it.
2. **Outgoing HTTP** — In your Axios (or other) interceptor, set the header: `contextManager.getCorrelationIdHeaderName()` → `contextManager.getCorrelationId()`. The next service sees the same ID.
3. **Kafka / other clients** — Put the same correlation ID in message headers or metadata so consumers can log with it and you keep one trace across systems.
4. **Log aggregation** — Filter or group by `correlationId`; use logger name or `source` to see service vs axios vs kafka for that ID.

So: **same correlationId, multiple loggers** — you create N loggers (service, axios, kafka, etc.) with the names and transport setup that fit your app, and the framework keeps the ID consistent so you can follow the whole journey.

## See also

- [Logger](/docs/core-concepts/logger) — Levels, transports, logging matrix
- [Context](/docs/core-concepts/context) — `run()`, correlation ID, headers
- [HTTP instrumentation](/docs/core-concepts/http-instrumentation) — Injecting correlation ID in HTTP clients
- [Getting Started — Context and correlation](/docs/getting-started#context-and-correlation)
