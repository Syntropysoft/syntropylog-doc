---
id: testing-serializers
title: Testing Serializers
sidebar_label: Testing Serializers
description: Testing custom serialization logic with MockSerializerRegistry
---

# Testing Serializers

This example demonstrates how to test custom serialization logic using `MockSerializerRegistry` and framework-agnostic testing patterns.

> **📦 Version**: This example corresponds to **SyntropyLog v0.6.16**

## Overview

Serializers are functions that transform complex objects into strings for logging. This example shows how to:

- Test custom serializer functions in isolation
- Use `MockSerializerRegistry` for testing
- Achieve high test coverage with framework-agnostic patterns
- Test framework boilerplate functions

## Key Concepts

### **MockSerializerRegistry**

A framework-agnostic mock that simulates the `SerializerRegistry` behavior:

```typescript
import { MockSerializerRegistry } from 'syntropylog/testing';

// Inject the testing framework's spy function
const mockRegistry = new MockSerializerRegistry(vi.fn);

// Configure mock behavior
mockRegistry.setSerializer('user', (user) => JSON.stringify(user));
mockRegistry.setError('user', new Error('Serialization failed'));
mockRegistry.setTimeout(100); // Simulate timeout
```

### **Framework Agnostic Testing**

The mock works with any testing framework:

```typescript
// Vitest
const mockRegistry = new MockSerializerRegistry(vi.fn);

// Jest
const mockRegistry = new MockSerializerRegistry(jest.fn);

// Jasmine
const mockRegistry = new MockSerializerRegistry(jasmine.createSpy);
```

### **Spy Function Injection**

If you don't inject a spy function, you get a memorable error:

```typescript
// ❌ This will throw: "SPY FUNCTION NOT INJECTED!"
const mockRegistry = new MockSerializerRegistry();

// ✅ This works perfectly
const mockRegistry = new MockSerializerRegistry(vi.fn);
```

## Example Code

### **Custom Serializers**

```typescript
// src/serializers.ts
export function serializeUser(user: any): string {
  return JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt?.toISOString()
  });
}

export function serializeOrder(order: any): string {
  return JSON.stringify({
    id: order.id,
    userId: order.userId,
    total: order.total,
    status: order.status,
    items: order.items?.length || 0
  });
}
```

### **Testing Serializers**

```typescript
// tests/serializer-service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { MockSerializerRegistry } from 'syntropylog/testing';
import { serializeUser, serializeOrder } from '../src/serializers';

describe('Serializer Service', () => {
  let mockRegistry: MockSerializerRegistry;

  beforeEach(() => {
    mockRegistry = new MockSerializerRegistry(vi.fn);
  });

  it('should serialize user correctly', () => {
    const user = {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2023-01-01')
    };

    mockRegistry.setSerializer('user', serializeUser);
    const result = mockRegistry.process('user', user);

    expect(result).toBe(JSON.stringify({
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2023-01-01T00:00:00.000Z'
    }));
  });

  it('should handle multiple serializers', () => {
    const user = { id: 1, name: 'John' };
    const order = { id: 100, userId: 1, total: 99.99, status: 'pending' };

    mockRegistry.setSerializer('user', serializeUser);
    mockRegistry.setSerializer('order', serializeOrder);

    const userResult = mockRegistry.process('user', user);
    const orderResult = mockRegistry.process('order', order);

    expect(userResult).toContain('"name":"John"');
    expect(orderResult).toContain('"total":99.99');
  });

  it('should handle null and undefined values', () => {
    mockRegistry.setSerializer('user', serializeUser);

    const result1 = mockRegistry.process('user', null);
    const result2 = mockRegistry.process('user', undefined);

    expect(result1).toBe('null');
    expect(result2).toBe('undefined');
  });
});
```

### **Framework Boilerplate Testing**

```typescript
// tests/example-coverage.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestHelper } from 'syntropylog/testing';
import { initializeSyntropyLog, gracefulShutdown } from '../src/index';

describe('Framework Boilerplate', () => {
  const testHelper = createTestHelper(vi.fn);

  beforeEach(() => {
    testHelper.beforeEach();
  });

  afterEach(() => {
    testHelper.afterEach();
  });

  it('should initialize SyntropyLog correctly', async () => {
    const result = await initializeSyntropyLog();
    expect(result).toBeDefined();
  });

  it('should handle graceful shutdown', async () => {
    const result = await gracefulShutdown();
    expect(result).toBeDefined();
  });
});
```

## Test Coverage

This example achieves **100% test coverage**:

```
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        1.5s
Ran all test suites.

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```

## Key Takeaways

### **1. Framework Agnostic Mocks**

All mocks work with any testing framework through spy function injection.

### **2. High Test Coverage**

Achieve 100% coverage by testing both business logic and framework boilerplate.

### **3. Declarative Testing**

Tests focus on behavior and outcomes, not implementation details.

### **4. Zero External Dependencies**

No Redis, HTTP servers, or external services needed for testing.

### **5. Silent Observer Philosophy**

Framework errors are reported but never interrupt the application flow.

## Related Examples

- **[Example 28: Vitest Testing](./testing-patterns-vitest)** - Basic testing patterns
- **[Example 29: Jest Testing](./testing-patterns-jest)** - Jest-specific patterns
- **[Example 30: Redis Context](./testing-redis-context)** - Redis testing patterns
- **[Example 32: Transport Concepts](./testing-transports-concepts)** - Transport testing concepts

## Next Steps

1. **Run the example**: `cd 31-testing-serializers && npm test`
2. **Explore the code**: Review the serializer functions and tests
3. **Apply to your project**: Use these patterns in your own serializer testing
4. **Extend the patterns**: Add more complex serialization scenarios 