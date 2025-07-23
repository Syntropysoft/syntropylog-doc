# Graceful Shutdown - Critical for Production

> ⚠️ **CRITICAL**: This boilerplate is **MANDATORY** for ALL applications (development and production). Without it, your application may lose logs and crash unexpectedly when stopped.

## 🚨 Why Graceful Shutdown is Essential

When your application is stopped (either by Ctrl+C in development or SIGTERM in production), it needs time to shut down gracefully. Without proper shutdown handling:

- **Lost logs**: Logs in the queue may never be flushed
- **Corrupted data**: Incomplete operations may leave data in an inconsistent state
- **Resource leaks**: Connections to Redis, brokers, and databases may not be closed properly
- **Application crashes**: May be forcefully killed, causing data loss

## 🔧 Required Boilerplate

**Every production application MUST include this boilerplate:**

```typescript
// =================================================================
//  boilerplate.ts - Standard initialization and shutdown
//  RESPONSIBILITY: Provide reusable boilerplate for SyntropyLog
// =================================================================

import { syntropyLog } from 'syntropylog';
import { syntropyConfig } from './config';

export async function initializeSyntropyLog(): Promise<void> {
  console.log('🚀 Initializing SyntropyLog...');
  
  try {
    await syntropyLog.init(syntropyConfig);
    console.log('✅ SyntropyLog initialized successfully!');
  } catch (error) {
    console.error('❌ SyntropyLog initialization failed:', error);
    throw error;
  }
}

export async function gracefulShutdown(): Promise<void> {
  console.log('🔄 Shutting down SyntropyLog gracefully...');
  
  try {
    // ⚠️ CRITICAL: This flushes all pending logs before shutdown
    await syntropyLog.shutdown();
    console.log('✅ SyntropyLog shutdown completed');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
}

// Signal handlers for graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await gracefulShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await gracefulShutdown();
  process.exit(0);
});
```

## 🎯 What This Boilerplate Does

### **1. Signal Handling**
- **SIGTERM**: Kubernetes termination signal (production)
- **SIGINT**: Manual interruption (Ctrl+C in development)
- **Graceful response**: Application responds properly to both signals

### **2. Log Flushing**
- **`syntropyLog.shutdown()`**: Flushes all pending logs in the queue
- **No data loss**: Ensures all logs are written before exit
- **Ordered shutdown**: Proper cleanup sequence

### **3. Resource Cleanup**
- **Connection closure**: Closes Redis, broker, and HTTP connections
- **Memory cleanup**: Releases allocated resources
- **State consistency**: Ensures clean application state

## 🚀 Usage in Your Application

```typescript
import { initializeSyntropyLog, gracefulShutdown } from './boilerplate';

async function main() {
  // Initialize SyntropyLog with your configuration
  await initializeSyntropyLog();
  
  // Your application logic here
  const logger = syntropyLog.getLogger();
  logger.info('Application started');
  
  // The boilerplate handles shutdown automatically
  // No need to call gracefulShutdown() manually
}

main().catch(console.error);
```

## ⚠️ Application Checklist

Before running your application (development or production), ensure:

- ✅ **Boilerplate included**: Graceful shutdown handlers are in place
- ✅ **Signal handling**: SIGTERM and SIGINT are handled
- ✅ **Log flushing**: `syntropyLog.shutdown()` is called
- ✅ **Error handling**: Shutdown errors are logged
- ✅ **Development testing**: Test with Ctrl+C to ensure graceful shutdown
- ✅ **Production readiness**: Shutdown completes within Kubernetes grace period

## 🔍 Testing Graceful Shutdown

Test your shutdown handling:

```bash
# Development testing (Ctrl+C)
# Simply press Ctrl+C while your app is running
# You should see: "🛑 Received SIGINT, shutting down gracefully..."

# Production testing (SIGTERM)
kill -TERM <your-process-pid>

# Manual SIGINT testing
kill -INT <your-process-pid>

# Verify logs are flushed before exit
```

## 📚 Examples

See complete examples with boilerplate in the main repository:
- [Kafka Correlation Example](https://github.com/Syntropysoft/SyntropyLog/tree/main/sub-modules/examples/20-basic-kafka-correlation)
- [RabbitMQ Broker Example](https://github.com/Syntropysoft/SyntropyLog/tree/main/sub-modules/examples/21-basic-rabbitmq-broker)
- [HTTP Configuration Example](https://github.com/Syntropysoft/SyntropyLog/tree/main/sub-modules/examples/09-http-configuration)

---

**Remember**: This boilerplate is not optional - it's a **requirement for ALL applications** (development and production) for reliable, observable applications. 