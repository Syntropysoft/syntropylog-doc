---
id: testing-redis-context
title: Testing Redis / Cache Context
sidebar_label: Redis Context Testing
description: Testing applications that use Redis or cache with SyntropyLog context
---

# Testing Redis / Cache Context

The **core SyntropyLog package does not include Redis or a Redis mock**. There is no `BeaconRedisMock` or built-in Redis client.

## How to test

- **Context and correlation** — Use `createTestHelper()` from `syntropylog/testing`. The mock’s `getContextManager()` gives you an in-memory context manager; test your app’s context and correlation behavior without Redis.
- **Redis or cache logic** — Use your own Redis mock, in-memory store, or integration test against a real Redis. SyntropyLog only provides logging and context; it does not provide or mock Redis.

## Example: testing context behavior

```typescript
import { createTestHelper } from 'syntropylog/testing';

const testHelper = createTestHelper(vi.fn);

it('should propagate correlation ID in flow', async () => {
  const ctx = testHelper.mockSyntropyLog.getContextManager();
  await ctx.run(async () => {
    ctx.set('userId', 'user-123');
    const logger = testHelper.mockSyntropyLog.getLogger('test');
    logger.info('Step done');
    expect(ctx.getCorrelationId()).toBeDefined();
  });
});
```

For services that talk to Redis, inject a test double (e.g. an in-memory Map or a Redis mock from another library) and keep using `createTestHelper()` for the SyntropyLog side.

## See also

- [Testing overview](./testing-overview)
- [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) — full list 00–17 in the repo README; testing examples are 13–16
