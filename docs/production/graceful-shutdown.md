# Graceful Shutdown - Critical for Production

> ⚠️ **CRITICAL**: This boilerplate is **MANDATORY** for production applications. Without it, your application may lose logs and crash unexpectedly during Kubernetes pod termination.

## 🚨 Why Graceful Shutdown is Essential

When Kubernetes sends a termination signal (SIGTERM) to your pod, your application has a limited time to shut down gracefully. Without proper shutdown handling:

- **Lost logs**: Logs in the queue may never be flushed
- **Corrupted data**: Incomplete operations may leave data in an inconsistent state
- **Resource leaks**: Connections to Redis, brokers, and databases may not be closed properly
- **Pod crashes**: Application may be forcefully killed, causing data loss

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
- **SIGTERM**: Kubernetes termination signal
- **SIGINT**: Manual interruption (Ctrl+C)
- **Graceful response**: Application responds properly to termination signals

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

## ⚠️ Production Checklist

Before deploying to production, ensure:

- ✅ **Boilerplate included**: Graceful shutdown handlers are in place
- ✅ **Signal handling**: SIGTERM and SIGINT are handled
- ✅ **Log flushing**: `syntropyLog.shutdown()` is called
- ✅ **Error handling**: Shutdown errors are logged
- ✅ **Timeout consideration**: Shutdown completes within Kubernetes grace period

## 🔍 Testing Graceful Shutdown

Test your shutdown handling:

```bash
# Test SIGTERM handling
kill -TERM <your-process-pid>

# Test SIGINT handling
kill -INT <your-process-pid>

# Verify logs are flushed before exit
```

## 📚 Examples

See complete examples with boilerplate:
- [Kafka Correlation Example](../../examples/20-basic-kafka-correlation)
- [RabbitMQ Broker Example](../../examples/21-basic-rabbitmq-broker)
- [HTTP Configuration Example](../../examples/09-http-configuration)

---

**Remember**: This boilerplate is not optional - it's a **production requirement** for reliable, observable applications. 