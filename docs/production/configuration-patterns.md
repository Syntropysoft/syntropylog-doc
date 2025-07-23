# Configuration Patterns - Production Ready

This page shows the complete configuration patterns used in production applications with SyntropyLog.

## 🏗️ Standard Project Structure

```
src/
├── config.ts          # SyntropyLog configuration
├── boilerplate.ts     # Initialization and shutdown handlers
├── main.ts           # Application entry point
└── ...
```

## 📝 Configuration File (config.ts)

```typescript
// =================================================================
//  config.ts - SyntropyLog Configuration
//  RESPONSIBILITY: Define configuration using official framework types
// =================================================================

import { SyntropyLogConfig, ClassicConsoleTransport } from 'syntropylog';
import { KafkaAdapter } from '@syntropylog/adapters/brokers';
import { AxiosAdapter } from '@syntropylog/adapters/http';
import { Kafka, logLevel as kafkaLogLevel } from 'kafkajs';
import axios from 'axios';

// ✅ Using official framework types
export const syntropyConfig: SyntropyLogConfig = {
  logger: {
    level: 'info',
    serviceName: 'my-production-app',
    serializerTimeoutMs: 100,
    transports: [new ClassicConsoleTransport()]
  },

  context: {
    correlationIdHeader: 'X-Correlation-ID',
  },

  loggingMatrix: {
    default: ['correlationId', 'serviceName'],
    error: ['*'], // Log everything on errors
  },

  http: {
    instances: [
      {
        instanceName: 'api-client',
        adapter: new AxiosAdapter(
          axios.create({ 
            baseURL: 'https://api.example.com',
            timeout: 5000 
          })
        ),
      },
    ],
  },

  brokers: {
    instances: [
      {
        instanceName: 'events-bus',
        adapter: new KafkaAdapter(
          new Kafka({
            clientId: 'my-app-client',
            brokers: ['localhost:9092'],
            logLevel: kafkaLogLevel.ERROR,
            retry: {
              initialRetryTime: 100,
              retries: 8
            }
          }),
          'my-app-group'
        ),
      },
    ],
  },
};
```

## 🔧 Boilerplate File (boilerplate.ts)

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
    // ✅ Using configuration from config.ts - simple async/await pattern
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

## 🚀 Application Entry Point (main.ts)

```typescript
// =================================================================
//  main.ts - Application Entry Point
//  RESPONSIBILITY: Initialize and run the application
// =================================================================

import { syntropyLog } from 'syntropylog';
import { initializeSyntropyLog } from './boilerplate';

async function main() {
  try {
    // Initialize SyntropyLog with configuration
    await initializeSyntropyLog();
    
    // Get logger instance
    const logger = syntropyLog.getLogger('main');
    logger.info('Application started successfully');
    
    // Get other resources (singleton instances)
    const apiClient = syntropyLog.getHttp('api-client');
    const eventsBroker = syntropyLog.getBroker('events-bus');
    
    // Your application logic here
    logger.info('All resources initialized, starting application...');
    
    // Example: Make an HTTP request
    const response = await apiClient.request({
      method: 'GET',
      url: '/health'
    });
    
    logger.info('Health check completed', { status: response.status });
    
  } catch (error) {
    console.error('❌ Application startup failed:', error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
```

## 🎯 Key Benefits of This Pattern

### **1. Separation of Concerns**
- **config.ts**: Pure configuration definition
- **boilerplate.ts**: Initialization and shutdown logic
- **main.ts**: Application business logic

### **2. Reusability**
- Boilerplate can be copied between projects
- Configuration is easily modifiable
- Clear responsibility boundaries

### **3. Production Ready**
- Graceful shutdown handling
- Error handling at all levels
- Proper resource cleanup
- Kubernetes compatibility

### **4. Type Safety**
- Uses official framework types
- Compile-time configuration validation
- IDE autocompletion support

## 📚 Complete Examples

See these patterns in action:
- [Kafka Correlation Example](../../examples/20-basic-kafka-correlation)
- [RabbitMQ Broker Example](../../examples/21-basic-rabbitmq-broker)
- [HTTP Configuration Example](../../examples/09-http-configuration)

## ⚠️ Production Checklist

Before deploying, ensure:
- ✅ Configuration uses official types
- ✅ Boilerplate includes graceful shutdown
- ✅ Error handling at all levels
- ✅ Resource cleanup on shutdown
- ✅ Signal handlers for SIGTERM/SIGINT 