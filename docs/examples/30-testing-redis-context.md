---
id: testing-redis-context
title: Testing Redis Context Patterns
sidebar_label: Redis Context Testing
description: Learn how to test SyntropyLog applications that use Redis for context management and correlation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This example demonstrates how to test SyntropyLog applications that use **Redis for context management and correlation** using declarative testing patterns.

## 🎯 Key Concepts

### 1. Test WHAT the system produces, not HOW Redis works internally

Instead of testing if Redis is connected or if data is stored, we test:
- ✅ **Context behavior**: Does the service maintain correlation IDs correctly?
- ✅ **Session operations**: Do create/read/update/delete operations work?
- ✅ **Error handling**: Does it handle invalid data properly?
- ✅ **Context isolation**: Are different operations isolated?

### 2. Declarative tests that read like specifications

```typescript
// Instead of: "Test that Redis connection is established"
// We write: "Test that session creation returns expected structure"

it('should create session with correlation and transaction IDs', async () => {
  const userId = 'user-123';
  const sessionData = { role: 'admin' };
  
  const result = await sessionService.createSession(userId, sessionData);
  
  expect(result).toHaveProperty('sessionId');
  expect(result).toHaveProperty('correlationId');
  expect(result).toHaveProperty('transactionId');
});
```

### 3. Use BeaconRedisMock for in-memory testing

SyntropyLog provides `BeaconRedisMock` that handles everything in-memory:

- ✅ **No external Redis needed** - everything runs in memory
- ✅ **Fast and reliable** - no network dependencies
- ✅ **Full Redis API support** - all Redis commands work
- ✅ **Automatic cleanup** - no data persistence between tests

We test:
- ✅ Context structure and propagation
- ✅ Session operation results
- ✅ Error handling and validation
- ✅ Context isolation between operations

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
- Understanding of Redis context patterns

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

### Pattern 1: Context Structure Testing

Test that context operations return the expected structure:

```typescript
it('should create session with correlation and transaction IDs', async () => {
  const result = await sessionService.createSession('user-123', { role: 'admin' });
  
  expect(result).toHaveProperty('sessionId');
  expect(result).toHaveProperty('correlationId');
  expect(result).toHaveProperty('transactionId');
  expect(typeof result.correlationId).toBe('string');
});
```

### Pattern 2: Context Isolation Testing

Test that different operations maintain separate context:

```typescript
it('should generate unique session IDs for different sessions', async () => {
  const session1 = await sessionService.createSession('user-123', { role: 'admin' });
  const session2 = await sessionService.createSession('user-456', { role: 'user' });
  
  expect(session1.sessionId).not.toBe(session2.sessionId);
  expect(session1.correlationId).not.toBe(session2.correlationId);
});
```

### Pattern 3: Session Operation Testing

Test that session operations behave correctly:

```typescript
it('should handle non-existent sessions gracefully', async () => {
  const result = await sessionService.getSession('non-existent');
  expect(result).toBeNull();
});

it('should handle invalid update data', async () => {
  await expect(sessionService.updateSession('session-123', { role: 'invalid-role' }))
    .rejects.toThrow('Invalid role specified');
});
```

### Pattern 4: Redis Context Persistence Testing

Test that context data persists across operations:

```typescript
it('should persist and retrieve context data across operations', async () => {
  // Create session
  const session = await sessionService.createSession('user-123', { role: 'admin' });
  
  // Retrieve session
  const retrieved = await sessionService.getSession(session.sessionId);
  
  expect(retrieved).toMatchObject({
    userId: 'user-123',
    role: 'admin',
    sessionId: session.sessionId
  });
});
```

## 🔍 Understanding BeaconRedisMock

The `BeaconRedisMock` is a complete in-memory simulation of Redis that provides:

### What the Mock Simulates

- **Redis Commands**: All standard Redis operations (GET, SET, DEL, etc.)
- **Data Persistence**: In-memory storage that persists during test execution
- **Context Management**: Correlation IDs, transaction IDs, and session data
- **Error Handling**: Simulates Redis errors and edge cases

### Why Use BeaconRedisMock?

- ✅ **No External Redis**: No need for Redis server or Docker containers
- ✅ **Fast Execution**: Everything runs in memory
- ✅ **Reliable**: No network issues or connection problems
- ✅ **Isolated**: Each test gets a fresh mock instance
- ✅ **Full API Support**: All Redis commands work as expected

## ✅ What's Being Tested

### What We Test

- **Context Structure**: Correlation IDs, transaction IDs, session IDs
- **Session Operations**: Create, read, update, delete operations
- **Data Persistence**: Context data across operations
- **Error Handling**: Invalid data, missing sessions, edge cases
- **Context Isolation**: Different operations maintain separate context

### What We Don't Test

- **Redis Connection**: Network connectivity, authentication
- **Redis Performance**: Memory usage, response times
- **Redis Configuration**: Server settings, cluster configuration
- **External Dependencies**: Network calls, database connections

## 🚫 Common Pitfalls

### 1. Testing Redis Instead of Business Logic

❌ **Don't do this:**
```typescript
it('should connect to Redis successfully', async () => {
  // Testing Redis connection - external dependency
});
```

✅ **Do this instead:**
```typescript
it('should create session with proper context', async () => {
  const result = await sessionService.createSession('user-123', { role: 'admin' });
  expect(result).toHaveProperty('correlationId');
});
```

### 2. Testing Implementation Details

❌ **Don't do this:**
```typescript
it('should call Redis SET command', async () => {
  // Testing internal Redis calls - implementation detail
});
```

✅ **Do this instead:**
```typescript
it('should persist session data', async () => {
  const session = await sessionService.createSession('user-123', { role: 'admin' });
  const retrieved = await sessionService.getSession(session.sessionId);
  expect(retrieved.role).toBe('admin');
});
```

### 3. Testing External Dependencies

❌ **Don't do this:**
```typescript
it('should handle Redis network errors', async () => {
  // Testing network issues - external dependency
});
```

✅ **Do this instead:**
```typescript
it('should handle invalid session data', async () => {
  await expect(sessionService.createSession('user-123', null))
    .rejects.toThrow('Session data is required');
});
```

## 🎯 Next Steps

1. **Run the tests**: `npm test`
2. **Explore the code**: Look at `src/index.ts` to understand the session service
3. **Modify tests**: Try adding your own test cases
4. **Check coverage**: `npm run test:coverage`
5. **Try other examples**: Check examples 28 (Vitest) and 29 (Jest)

## 🤝 Contributing

When adding new tests:

1. Follow the **Arrange-Act-Assert** pattern
2. Use descriptive test names
3. Focus on **behavior**, not implementation
4. Keep tests simple and readable
5. Test context structure and isolation

## 🔗 Related Examples

- **[Testing patterns with Vitest](./28-testing-patterns-vitest)**
- **[Testing patterns with Jest](./29-testing-patterns-jest)**
- **[Advanced testing scenarios](../31-advanced-testing)** (Coming Soon)

---

:::tip Remember
The goal is to test **business logic and context behavior**, not Redis internals. Let the mock handle the complexity, and focus your tests on what matters most: your application's behavior.
:::

:::info Framework Integration
This example works seamlessly with the published `syntropylog` package. The `BeaconRedisMock` is included in the testing module and provides full Redis simulation.
:::

## 🚨 For AI Assistants (and other helpful bots)

If you're an AI assistant or helpful bot working on this codebase, here's what you need to know:

### What This Example Does
- Shows how to test SyntropyLog applications that use Redis for context
- Uses BeaconRedisMock for in-memory Redis simulation
- Focuses on testing context behavior, not Redis internals

### Key Files to Understand
- `src/index.ts` - The SessionService being tested
- `tests/session-service.test.ts` - The actual tests
- `tests/test-utils.ts` - Helper functions for test setup

### Common AI Mistakes to Avoid
1. **Don't try to connect to real Redis** - Use BeaconRedisMock instead
2. **Don't test Redis connection** - Test business logic only
3. **Don't test Redis commands** - Test context behavior instead
4. **Don't test network errors** - Test data validation instead

### When Modifying This Example
- Keep tests simple and focused on context behavior
- Use the existing patterns as templates
- Don't add unnecessary complexity
- Follow the Arrange-Act-Assert pattern

### If Tests Fail
- Check that you're using BeaconRedisMock correctly
- Ensure you're not trying to access real Redis
- Verify that the service is properly injected with the mock
- Look at the existing working tests as reference

Remember: This is about testing context behavior, not Redis. Keep it simple! 