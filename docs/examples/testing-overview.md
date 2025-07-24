---
id: testing-overview
title: Testing Overview
sidebar_label: Testing Overview
description: Comprehensive guide to testing with SyntropyLog
---

# Testing with SyntropyLog

SyntropyLog provides a comprehensive testing framework that makes testing observability code simple, fast, and reliable.

> **📦 Version**: This documentation corresponds to **SyntropyLog v0.6.16**

## Philosophy

### **Silent Observer Principle**

SyntropyLog follows the "Silent Observer" principle - **we report what happened and nothing more**.

```typescript
// ✅ Your application continues running, even if logging fails
try {
  const result = await database.query('SELECT * FROM users');
  logger.info('Query successful', { count: result.length });
} catch (error) {
  // Your error handling continues normally
  logger.error('Database error', { error: error.message });
  // Application logic continues...
}
```

### **Zero Boilerplate Testing**

Testing should be simple and focused on behavior, not framework setup:

```typescript
import { createTestHelper } from 'syntropylog/testing';

// No initialization, no shutdown, no external dependencies
const testHelper = createTestHelper(vi.fn);

describe('UserService', () => {
  beforeEach(() => {
    testHelper.beforeEach(); // Reset mocks
  });

  it('should create user successfully', async () => {
    const result = await userService.createUser({ name: 'John' });
    expect(result).toHaveProperty('userId');
  });
});
```

## Framework Agnostic Mocks

All mocks work with any testing framework through **spy function injection**:

### **Available Mocks**

- **`SyntropyLogMock`** - Complete framework simulation
- **`BeaconRedisMock`** - Full Redis simulation
- **`MockHttpClient`** - HTTP client simulation
- **`MockBrokerAdapter`** - Message broker simulation
- **`MockSerializerRegistry`** - Serialization simulation
- **`SpyTransport`** - Log capture for testing

### **Spy Function Injection**

```typescript
// Vitest
const mockRedis = new BeaconRedisMock(vi.fn);

// Jest
const mockRedis = new BeaconRedisMock(jest.fn);

// Jasmine
const mockRedis = new BeaconRedisMock(jasmine.createSpy);
```

### **Epic Error Messages**

If you forget to inject a spy function:

```typescript
// ❌ This will throw: "SPY FUNCTION NOT INJECTED!"
const mockRedis = new BeaconRedisMock();

// ✅ This works perfectly
const mockRedis = new BeaconRedisMock(vi.fn);
```

## Testing Patterns

### **1. Framework Agnostic Testing**

All mocks work with any testing framework:

```typescript
// Works with Vitest, Jest, Jasmine, or any framework
const testHelper = createTestHelper(vi.fn);
const mockRedis = new BeaconRedisMock(vi.fn);
const mockHttp = new MockHttpClient(vi.fn);
```

### **2. Declarative Testing**

Focus on behavior and outcomes:

```typescript
it('should create user and log success', async () => {
  const user = { name: 'John', email: 'john@example.com' };
  
  const result = await userService.createUser(user);
  
  // Assert the outcome
  expect(result).toHaveProperty('userId');
  expect(mockTransport.getEntries()).toContainEqual(
    expect.objectContaining({
      level: 'info',
      message: 'User created successfully',
      userId: result.userId
    })
  );
});
```

### **3. Boilerplate Testing**

Test framework initialization and shutdown:

```typescript
it('should initialize framework correctly', async () => {
  const result = await initializeSyntropyLog();
  expect(result).toBeDefined();
  expect(result.getLogger).toBeDefined();
});

it('should handle graceful shutdown', async () => {
  const result = await gracefulShutdown();
  expect(result).toEqual({ success: true });
});
```

### **4. Zero External Dependencies**

No Redis, HTTP servers, or external services needed:

```typescript
// Everything runs in memory
const mockRedis = new BeaconRedisMock(vi.fn);
const mockHttp = new MockHttpClient(vi.fn);
const mockBroker = new MockBrokerAdapter(vi.fn);

// Configure mock behavior
mockRedis.set('user:123', userData);
mockHttp.setResponse('/api/users', { data: users });
mockBroker.setError('user.created', new Error('Broker error'));
```

## Test Coverage

All examples achieve **90%+ test coverage**:

```
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        3.2s

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |    92.5 |     86.2 |    90.2 |    92.5 |                   
----------|---------|----------|---------|---------|-------------------
```

## Bundle Size Optimization

Testing mocks are **separated from the main bundle**:

- **Main bundle**: 161K (production code only)
- **Testing bundle**: 40K (mocks only when imported)

```typescript
// Production code - no testing overhead
import { syntropyLog } from 'syntropylog';

// Testing code - only when needed
import { createTestHelper } from 'syntropylog/testing';
```

## Examples

### **Complete Testing Examples**

1. **[Example 28: Vitest Testing](./testing-patterns-vitest)** - Basic testing patterns
2. **[Example 29: Jest Testing](./testing-patterns-jest)** - Jest-specific patterns
3. **[Example 30: Redis Context](./testing-redis-context)** - Redis testing patterns
4. **[Example 31: Serializers Testing](./testing-serializers)** - Serializer testing patterns
5. **[Example 32: Transport Concepts](./testing-transports-concepts)** - Transport testing concepts

### **Key Benefits**

- **🚫 No Connection Boilerplate** - No init/shutdown in tests
- **⚡ Lightning Fast** - Everything runs in memory
- **🔒 Reliable** - No network issues or state conflicts
- **🎯 Focused** - Test business logic, not framework internals
- **🔄 Framework Agnostic** - Works with any test runner

## Best Practices

### **1. Use Framework Agnostic Mocks**

```typescript
// ✅ Good - Works with any framework
const mockRedis = new BeaconRedisMock(vi.fn);

// ❌ Bad - Framework specific
const mockRedis = vi.fn();
```

### **2. Test Behavior, Not Implementation**

```typescript
// ✅ Good - Test the outcome
expect(result).toHaveProperty('userId');
expect(mockTransport.getEntries()).toContainEqual(
  expect.objectContaining({ message: 'User created' })
);

// ❌ Bad - Test implementation details
expect(mockRedis.set).toHaveBeenCalledWith('user:123', userData);
```

### **3. Use Declarative Patterns**

```typescript
// ✅ Good - Clear and readable
it('should send welcome email when user is created', async () => {
  const user = { name: 'John', email: 'john@example.com' };
  await userService.createUser(user);
  
  expect(mockTransport.getEntries()).toContainEqual(
    expect.objectContaining({
      level: 'info',
      message: 'Welcome email sent',
      email: 'john@example.com'
    })
  );
});
```

### **4. Test Framework Boilerplate**

```typescript
// ✅ Good - Test initialization and shutdown
it('should initialize framework correctly', async () => {
  const result = await initializeSyntropyLog();
  expect(result).toBeDefined();
});

it('should handle graceful shutdown', async () => {
  const result = await gracefulShutdown();
  expect(result).toEqual({ success: true });
});
```

## Related Documentation

- **[Getting Started](../getting-started)** - Complete setup guide
- **[Configuration Guide](../configuration)** - Configuration options
- **[API Reference](../api-reference)** - Full API documentation
- **[Production Guide](../production)** - Production deployment 