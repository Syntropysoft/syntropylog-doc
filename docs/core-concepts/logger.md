---
sidebar_position: 1
---

# Logger

The SyntropyLog logger is the core component that provides structured logging with automatic context propagation and correlation.

## 🎯 Overview

SyntropyLog's logger is designed to be:
- **Context-aware** - Automatically includes correlation IDs and context
- **Framework-agnostic** - Works with any Node.js application
- **Performance-optimized** - Minimal overhead with intelligent log scoping
- **Production-ready** - Multiple transport support and structured output

## 🚀 Basic Usage

```typescript
import { syntropyLog } from 'syntropylog';

// Initialize SyntropyLog
await syntropyLog.init({
  logger: {
    serviceName: 'my-app',
    level: 'info',
  },
});

// Get logger instance
const logger = syntropyLog.getLogger();

// Basic logging
logger.info('Application started');
logger.warn('Configuration not found, using defaults');
logger.error('Database connection failed', { 
  error: 'Connection timeout',
  retryCount: 3 
});
```

## 🏗️ Singleton Pattern

SyntropyLog uses a singleton pattern for logger instances to prevent memory leaks and ensure consistency:

```typescript
// First call - creates and returns new instance
const logger1 = syntropyLog.getLogger('user-service');

// Second call - returns the SAME instance (singleton)
const logger2 = syntropyLog.getLogger('user-service');

// logger1 === logger2 ✅
```
