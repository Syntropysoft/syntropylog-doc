---
id: testing-patterns-vitest
title: Testing Patterns with Vitest
sidebar_label: Vitest Testing Patterns
description: Learn how to write declarative, behavior-focused tests for SyntropyLog applications using Vitest
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This example demonstrates how to write **declarative, behavior-focused tests** for SyntropyLog applications using Vitest. The key insight is to avoid testing the framework itself and instead focus on testing your business logic.

## 🎯 What You'll Learn

- How to use `SyntropyLogMock` to avoid framework initialization issues
- How to write tests that focus on **behavior**, not implementation
- How to use Vitest-specific features with SyntropyLog
- How to avoid testing external dependencies (Redis, brokers, etc.)
- How to create maintainable and readable tests
- How the mock simulates all framework functionality in memory

## 🚀 Quick Start

<Tabs>
<TabItem value="install" label="Install Dependencies" default>

```bash
npm install
```

</TabItem>
<TabItem value="test" label="Run Tests">

```bash
npm test
```

</TabItem>
<TabItem value="watch" label="Watch Mode">

```bash
npm run test:watch
```

</TabItem>
<TabItem value="coverage" label="Coverage">

```bash
npm run test:coverage
```

</TabItem>
</Tabs>

## 📋 Prerequisites

- Node.js 18+ (using nvm: `source ~/.nvm/nvm.sh`)
- npm or yarn
- Basic knowledge of Vitest and TypeScript

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install syntropylog vitest typescript
```

### 2. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
});
```

### 3. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🧪 Testing Patterns

### 1. Basic Test Setup with SyntropyLogMock

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../src/index';
const { createTestHelper } = require('syntropylog/testing');

// Create test helper - this creates a SyntropyLogMock that simulates the entire framework
// No real initialization/shutdown needed - everything is in memory
const testHelper = createTestHelper();

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    testHelper.beforeEach(); // Reset mocks and create fresh instances
    userService = new UserService(testHelper.mockSyntropyLog); // Inject the mock
  });

  it('should create user successfully', async () => {
    // Arrange
    const userData = { name: 'John Doe', email: 'john@example.com' };
    
    // Act
    const result = await userService.createUser(userData);
    
    // Assert - Test behavior, not implementation
    expect(result).toHaveProperty('userId');
    expect(result.name).toBe('John Doe');
  });
});
```

### 2. Alternative: Service Helper

For even simpler setup, use the service helper:

```typescript
it('should create user with service helper', async () => {
  // Arrange
  const userData = { name: 'John Doe', email: 'john@example.com' };
  
  // Act - Create service with mock in one line
  const { createServiceWithMock, createSyntropyLogMock } = require('syntropylog/testing');
  const userService = createServiceWithMock(UserService, createSyntropyLogMock());
  
  const result = await userService.createUser(userData);
  
  // Assert
  expect(result).toHaveProperty('userId');
});
```

## 🔍 Understanding the SyntropyLogMock

The `SyntropyLogMock` is a complete simulation of the SyntropyLog framework that runs entirely in memory. Here's what it provides:

### What the Mock Simulates

- **Logger**: Mock logger with all standard methods (info, warn, error, etc.)
- **Context Manager**: Mock context manager with correlation IDs
- **HTTP Manager**: Mock HTTP manager for testing HTTP operations
- **Broker Manager**: Mock broker manager for testing message brokers
- **Serialization Manager**: Mock serialization manager

### Why Use the Mock?

- ✅ **No Initialization**: No need to call `syntropyLog.init()` or `syntropyLog.shutdown()`
- ✅ **No External Dependencies**: No Redis, brokers, or HTTP servers needed
- ✅ **Fast Tests**: Everything runs in memory
- ✅ **Reliable**: No network issues or state conflicts between tests
- ✅ **Isolated**: Each test gets a fresh mock instance

## ⚡ Vitest-Specific Features

### 1. Powerful Matchers

```typescript
it('should use Vitest matchers', async () => {
  const result = await userService.createUser(userData);
  
  expect(result).toHaveProperty('name', 'John Doe');
  expect(result.email).toMatch(/@/); // Regex matcher
  expect(typeof result.name).toBe('string'); // Type checking
});
```

### 2. Async Testing

```typescript
it('should handle async operations', async () => {
  // Vitest handles async/await naturally
  await expect(userService.getUserById('user-123'))
    .resolves.not.toThrow();
});
```

### 3. Structure Validation

```typescript
it('should validate object structure', async () => {
  const result = await userService.createUser(userData);
  
  // Test structure without depending on random values
  expect(result).toHaveProperty('userId');
  expect(result).toHaveProperty('name');
  expect(result).toHaveProperty('email');
  expect(typeof result.userId).toBe('string');
  expect(result.userId.length).toBeGreaterThan(0);
  expect(result.name).toBe('John Doe');
});
```

## ✅ What's Being Tested

### What We Test

- **Business Logic**: User creation, validation, retrieval
- **Error Handling**: Invalid inputs, edge cases
- **Data Structures**: Return values, object properties
- **Async Operations**: Promise resolution, error rejection

### What We Don't Test

- **Framework Features**: Logging, context management, Redis operations
- **External Dependencies**: Database connections, HTTP calls
- **Implementation Details**: Internal method calls, private properties

## 🚫 Common Pitfalls

### 1. Testing Framework Instead of Business Logic

❌ **Don't do this:**
```typescript
it('should log user creation', async () => {
  // Testing if logging happened - framework responsibility
});
```

✅ **Do this instead:**
```typescript
it('should create user successfully', async () => {
  const result = await userService.createUser(userData);
  expect(result).toHaveProperty('userId');
});
```

### 2. Testing External Dependencies

❌ **Don't do this:**
```typescript
it('should connect to Redis', async () => {
  // Testing Redis connection - external dependency
});
```

✅ **Do this instead:**
```typescript
it('should handle user data correctly', async () => {
  const result = await userService.createUser(userData);
  expect(result).toHaveProperty('userId');
});
```

### 3. Over-Complicated Setup

❌ **Don't do this:**
```typescript
beforeEach(async () => {
  // Complex setup with real framework initialization
  await syntropyLog.initialize();
  // ... more setup
});
```

✅ **Do this instead:**
```typescript
beforeEach(() => {
  testHelper.beforeEach(); // Simple, clean setup
  userService = new UserService(testHelper.mockSyntropyLog);
});
```

## 🎯 Next Steps

1. **Run the tests**: `npm test`
2. **Explore the code**: Look at `src/index.ts` to understand the service
3. **Modify tests**: Try adding your own test cases
4. **Check coverage**: `npm run test:coverage`
5. **Try other examples**: Check examples 29 (Jest) and 30 (Redis context)

## 🤝 Contributing

When adding new tests:

1. Follow the **Arrange-Act-Assert** pattern
2. Use descriptive test names
3. Focus on **behavior**, not implementation
4. Keep tests simple and readable
5. Use the provided helpers for consistent setup

## 🔗 Related Examples

- **[Testing patterns with Jest](./testing-patterns-jest)**
- **[Redis context testing](./testing-redis-context)**
- **[Advanced testing scenarios](./advanced-testing)** (Coming Soon)

---

:::tip Remember
The goal is to write tests that are **readable**, **maintainable**, and **focused on business value**. Let the framework handle the complexity, and focus your tests on what matters most: your business logic.
:::

:::info Framework Integration
This example works seamlessly with the published `syntropylog` package. When you install it via npm, the `syntropylog/testing` module will be available automatically.
:::

## 🚨 For AI Assistants (and other helpful bots)

If you're an AI assistant or helpful bot working on this codebase, here's what you need to know:

### What This Example Does
- Shows how to test SyntropyLog applications with Vitest
- Uses a complete mock that simulates the entire framework
- Focuses on testing business logic, not framework internals

### Key Files to Understand
- `src/index.ts` - The UserService being tested
- `tests/UserService.test.ts` - The actual tests
- `tests/test-helper.ts` - Helper functions for test setup

### Common AI Mistakes to Avoid
1. **Don't try to initialize real SyntropyLog** - Use the mock instead
2. **Don't test framework features** - Test business logic only
3. **Don't create complex test setups** - Use the provided helpers
4. **Don't test external dependencies** - They're mocked for a reason

### When Modifying This Example
- Keep tests simple and focused
- Use the existing patterns as templates
- Don't add unnecessary complexity
- Follow the Arrange-Act-Assert pattern

### If Tests Fail
- Check that you're using the mock correctly
- Ensure you're not trying to access real framework features
- Verify that the service is properly injected with the mock
- Look at the existing working tests as reference

Remember: This is about testing business logic, not the framework. Keep it simple! 