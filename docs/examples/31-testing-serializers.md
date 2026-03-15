---
id: testing-serializers
title: Testing Serializers
sidebar_label: Testing Serializers
description: Testing custom serialization logic with SyntropyLog
---

# Testing Serializers

Test custom serialization logic in isolation or via the mock provided by `syntropylog/testing`. The package does **not** export `MockSerializerRegistry`.

## Testing serializer functions in isolation

Serializers are functions that transform objects into strings. Unit test them directly:

```typescript
// src/serializers.ts
export function serializeUser(user: any): string {
  return JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt?.toISOString?.(),
  });
}
```

```typescript
// tests/serializers.test.ts
import { describe, it, expect } from 'vitest';
import { serializeUser } from '../src/serializers';

describe('Serializers', () => {
  it('should serialize user correctly', () => {
    const user = {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2023-01-01'),
    };
    const result = serializeUser(user);
    expect(result).toContain('"name":"John Doe"');
    expect(result).toContain('"email":"john@example.com"');
  });

  it('should handle null and undefined', () => {
    expect(serializeUser(null)).toBe('null');
  });
});
```

## Using the mock’s serialization manager

When testing code that uses `syntropyLog.getSerializer()` (or the serialization pipeline), use `createSyntropyLogMock()` so no real init is required. The mock exposes `getSerializationManager()` for stubbing if needed.

```typescript
import { createTestHelper } from 'syntropylog/testing';

const testHelper = createTestHelper(vi.fn);

it('should log with serialized payload', async () => {
  const mock = testHelper.mockSyntropyLog;
  const logger = mock.getLogger('test');
  logger.info('User action', { userId: 1 });
  // Assert on behavior; serialization is internal to the mock
});
```

## Related

- [Testing overview](./testing-overview)
- [Testing transport concepts](./testing-transports-concepts)
- **Runnable**: [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) `15-testing-serializers`
