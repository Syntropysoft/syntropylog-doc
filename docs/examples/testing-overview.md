---
id: testing-overview
title: Testing Overview
sidebar_label: Testing Overview
description: Guide to testing with SyntropyLog
---

# Testing with SyntropyLog

Use the `syntropylog/testing` entry point for mocks and helpers. No framework initialization or shutdown in tests; no Redis, HTTP, or broker in the core package.

## What the package provides

From `syntropylog/testing`:

- **`createTestHelper(spyFn?)`** — Returns `{ mockSyntropyLog, beforeEach, afterEach }`. Use `mockSyntropyLog` in place of the real `syntropyLog` in tests.
- **`createSyntropyLogMock(spyFn?)`** — Creates a mock framework instance (getLogger, getContextManager, etc.).
- **`createServiceWithMock(ServiceClass, mockSyntropyLog)`** — Instantiates a service with the mock injected.
- **`SpyTransport`** — Transport that captures log entries in memory for assertions.
- **`MockContextManager`** — In-memory context manager for tests.

The core package does **not** include Redis, HTTP, or broker mocks. Use your own mocks or stubs for those.

## Zero boilerplate

No init/shutdown in tests:

```typescript
import { createTestHelper } from 'syntropylog/testing';

const testHelper = createTestHelper(vi.fn); // or jest.fn

describe('UserService', () => {
  beforeEach(() => testHelper.beforeEach());

  it('should create user', async () => {
    const service = createServiceWithMock(UserService, testHelper.mockSyntropyLog);
    const result = await service.createUser({ name: 'John' });
    expect(result).toHaveProperty('userId');
  });
});
```

## Spy function injection

Pass your test framework’s spy so mocks behave consistently:

```typescript
// Vitest
const testHelper = createTestHelper(vi.fn);

// Jest
const testHelper = createTestHelper(jest.fn);
```

## Capturing logs with SpyTransport

Use `SpyTransport` to assert on log output:

```typescript
import { SpyTransport, createSyntropyLogMock } from 'syntropylog/testing';

const spyTransport = new SpyTransport();
const mock = createSyntropyLogMock();
// Attach spyTransport to the mock logger as needed for your test setup
// Then assert:
// expect(spyTransport.getEntries()).toContainEqual(expect.objectContaining({ level: 'info', message: '...' }));
```

## Runnable examples (syntropylog-examples)

Testing examples **13–16** in the repo:

- `13-testing-patterns` — Vitest
- `14-testing-patterns-jest` — Jest
- `15-testing-serializers` — Serializers
- `16-testing-transports-concepts` — Transport concepts

See the [Examples](/docs/examples/) page for the full list (00–17).

## Testing guides in this site

- [Testing with Vitest](./testing-patterns-vitest)
- [Testing with Jest](./testing-patterns-jest)
- [Testing Redis / cache context](./testing-redis-context)
- [Testing serializers](./testing-serializers)
- [Testing transport concepts](./testing-transports-concepts)

## Best practices

- Use `createTestHelper()` or `createSyntropyLogMock()` so tests don’t depend on real init/shutdown.
- Test behavior and outcomes, not framework internals.
- Use `SpyTransport` when you need to assert on log entries.
- Keep production and testing imports separate: `syntropylog` for app code, `syntropylog/testing` for tests.

## Related

- [Getting Started](/docs/getting-started)
- [API Reference](/docs/api-reference)
- [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) (00–17; see README for the list)
