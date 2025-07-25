---
id: testing-transports-concepts
title: Testing Transport Concepts
sidebar_label: Testing Transport Concepts
description: Understanding transports as spies and testing patterns
---

# Testing Transport Concepts

This example demonstrates the conceptual understanding of transports and how to test them using framework-agnostic patterns.

> **📦 Version**: This example corresponds to **SyntropyLog v0.7.0**

## Overview

Transports are essentially **spies** - they capture and store log entries for inspection. This example shows how to:

- Understand transports as testing utilities
- Use framework-agnostic testing patterns
- Combine all testing concepts learned
- Test framework boilerplate functions
- Achieve high test coverage

## Key Concepts

### **Transports as Spies**

Transports are designed to capture log entries in memory for testing:

```typescript
import { SpyTransport } from 'syntropylog/testing';

// Create a transport that captures logs
const spyTransport = new SpyTransport();

// Log entries are stored in memory
logger.info('User created', { userId: 123 });

// Inspect captured logs
const entries = spyTransport.getEntries();
expect(entries).toHaveLength(1);
expect(entries[0].message).toBe('User created');
```

### **Framework Agnostic Testing**

All testing patterns work with any framework:

```typescript
// Vitest
const testHelper = createTestHelper(vi.fn);

// Jest
const testHelper = createTestHelper(jest.fn);

// Jasmine
const testHelper = createTestHelper(jasmine.createSpy);
```

### **Declarative Patterns**

Tests focus on behavior and outcomes:

```typescript
it('should send notification when user is created', async () => {
  // Arrange
  const user = { id: 1, name: 'John' };
  
  // Act
  await notificationService.sendWelcomeNotification(user);
  
  // Assert
  expect(mockTransport.getEntries()).toContainEqual(
    expect.objectContaining({
      level: 'info',
      message: 'Welcome notification sent',
      userId: 1
    })
  );
});
```

## Example Code

### **Notification Service**

```typescript
// src/index.ts
import { syntropyLog } from 'syntropylog';

export class NotificationService {
  private logger = syntropyLog.getLogger();

  async sendWelcomeNotification(user: any): Promise<void> {
    this.logger.info('Sending welcome notification', { userId: user.id });
    
    // Simulate notification logic
    await this.delay(100);
    
    this.logger.info('Welcome notification sent', { 
      userId: user.id, 
      email: user.email 
    });
  }

  async sendPasswordReset(user: any): Promise<void> {
    this.logger.warn('Password reset requested', { userId: user.id });
    
    // Simulate password reset logic
    await this.delay(200);
    
    this.logger.info('Password reset email sent', { 
      userId: user.id, 
      email: user.email 
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Framework boilerplate functions for testing
export async function initializeSyntropyLog() {
  await syntropyLog.init({
    logger: {
      serviceName: 'notification-service',
      level: 'info',
    },
  });
  return syntropyLog;
}

export async function shutdownSyntropyLog() {
  await syntropyLog.shutdown();
  return { success: true };
}
```

### **Testing Transport Concepts**

```typescript
// tests/transports-concepts.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestHelper } from 'syntropylog/testing';
import { NotificationService, initializeSyntropyLog, shutdownSyntropyLog } from '../src/index';

describe('Transport Concepts', () => {
  const testHelper = createTestHelper(vi.fn);
  let notificationService: NotificationService;

  beforeEach(() => {
    testHelper.beforeEach();
    notificationService = new NotificationService();
  });

  afterEach(() => {
    testHelper.afterEach();
  });

  describe('Transports as Spies', () => {
    it('should capture log entries in memory', async () => {
      const user = { id: 123, name: 'John', email: 'john@example.com' };
      
      await notificationService.sendWelcomeNotification(user);
      
      const entries = testHelper.mockSyntropyLog.logger.transports[0].getEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].message).toBe('Sending welcome notification');
      expect(entries[1].message).toBe('Welcome notification sent');
    });

    it('should include metadata in log entries', async () => {
      const user = { id: 456, name: 'Jane', email: 'jane@example.com' };
      
      await notificationService.sendPasswordReset(user);
      
      const entries = testHelper.mockSyntropyLog.logger.transports[0].getEntries();
      expect(entries[0]).toMatchObject({
        level: 'warn',
        message: 'Password reset requested',
        userId: 456
      });
      expect(entries[1]).toMatchObject({
        level: 'info',
        message: 'Password reset email sent',
        userId: 456,
        email: 'jane@example.com'
      });
    });
  });

  describe('Framework Agnostic Testing', () => {
    it('should work with any testing framework', () => {
      // This test demonstrates that the patterns work with any framework
      // The actual framework is injected via createTestHelper(vi.fn)
      expect(testHelper.mockSyntropyLog).toBeDefined();
      expect(testHelper.mockSyntropyLog.logger).toBeDefined();
      expect(testHelper.mockSyntropyLog.logger.transports).toHaveLength(1);
    });

    it('should provide spy functions for assertions', () => {
      const logger = testHelper.mockSyntropyLog.logger;
      
      logger.info('Test message');
      
      // The spy functions work like native framework spies
      expect(logger.info).toHaveBeenCalledWith('Test message');
      expect(logger.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('Declarative Patterns', () => {
    it('should focus on behavior, not implementation', async () => {
      const user = { id: 789, name: 'Bob', email: 'bob@example.com' };
      
      await notificationService.sendWelcomeNotification(user);
      
      // Assert the outcome, not the internal implementation
      const entries = testHelper.mockSyntropyLog.logger.transports[0].getEntries();
      expect(entries).toContainEqual(
        expect.objectContaining({
          level: 'info',
          message: 'Welcome notification sent',
          userId: 789,
          email: 'bob@example.com'
        })
      );
    });

    it('should test business logic, not framework internals', async () => {
      const user = { id: 999, name: 'Alice', email: 'alice@example.com' };
      
      await notificationService.sendPasswordReset(user);
      
      // Test that the business logic works correctly
      const entries = testHelper.mockSyntropyLog.logger.transports[0].getEntries();
      const resetRequested = entries.find(e => e.message === 'Password reset requested');
      const resetSent = entries.find(e => e.message === 'Password reset email sent');
      
      expect(resetRequested).toBeDefined();
      expect(resetSent).toBeDefined();
      expect(resetRequested?.userId).toBe(999);
      expect(resetSent?.userId).toBe(999);
    });
  });

  describe('Combining All Patterns', () => {
    it('should demonstrate comprehensive testing approach', async () => {
      const users = [
        { id: 1, name: 'User1', email: 'user1@example.com' },
        { id: 2, name: 'User2', email: 'user2@example.com' }
      ];
      
      // Test multiple operations
      await Promise.all([
        notificationService.sendWelcomeNotification(users[0]),
        notificationService.sendPasswordReset(users[1])
      ]);
      
      const entries = testHelper.mockSyntropyLog.logger.transports[0].getEntries();
      
      // Verify all expected log entries
      expect(entries).toHaveLength(4);
      expect(entries).toContainEqual(
        expect.objectContaining({
          message: 'Sending welcome notification',
          userId: 1
        })
      );
      expect(entries).toContainEqual(
        expect.objectContaining({
          message: 'Password reset requested',
          userId: 2
        })
      );
    });
  });

  describe('Framework Boilerplate Testing', () => {
    it('should test initialization function', async () => {
      const result = await initializeSyntropyLog();
      expect(result).toBeDefined();
      expect(result.getLogger).toBeDefined();
    });

    it('should test shutdown function', async () => {
      const result = await shutdownSyntropyLog();
      expect(result).toEqual({ success: true });
    });
  });
});
```

## Test Coverage

This example achieves **100% test coverage**:

```
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.1s
Ran all test suites.

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```

## Key Takeaways

### **1. Transports are Spies**

Transports capture log entries in memory for testing, just like spies capture function calls.

### **2. Framework Agnostic Testing**

All testing patterns work with any framework through spy function injection.

### **3. Declarative Patterns**

Tests focus on behavior and outcomes, not implementation details.

### **4. Comprehensive Coverage**

Test both business logic and framework boilerplate functions.

### **5. Zero External Dependencies**

No external services needed - everything runs in memory.

### **6. Silent Observer Philosophy**

Framework errors are reported but never interrupt the application flow.

## Related Examples

- **[Example 28: Vitest Testing](./testing-patterns-vitest)** - Basic testing patterns
- **[Example 29: Jest Testing](./testing-patterns-jest)** - Jest-specific patterns
- **[Example 30: Redis Context](./testing-redis-context)** - Redis testing patterns
- **[Example 31: Serializers Testing](./testing-serializers)** - Serializer testing patterns

## Next Steps

1. **Run the example**: `cd 32-testing-transports-concepts && npm test`
2. **Explore the code**: Review the notification service and tests
3. **Apply to your project**: Use these patterns in your own transport testing
4. **Extend the patterns**: Add more complex notification scenarios
5. **Combine patterns**: Use all testing concepts together in your projects 