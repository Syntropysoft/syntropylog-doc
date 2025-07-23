# SyntropyLog Examples

Explore practical examples and real-world use cases of SyntropyLog.

## 📚 Available Examples

### **🚀 Basics (00-09)**

| Example | Description | Complexity |
|---------|-------------|------------|
| [00 - Setup and Initialization](../examples/00-setup-initialization) | Basic framework configuration | ⭐ |
| [01 - Hello World](../examples/01-hello-world) | First steps with logging | ⭐ |
| [02 - Basic Context](../examples/02-basic-context) | Context handling and correlation IDs | ⭐⭐ |
| [03 - Context with TypeScript](../examples/03-context-ts) | Strong typing for context | ⭐⭐ |
| [04 - Levels and Transports](../examples/04-logging-levels-transports) | Level configuration and outputs | ⭐⭐ |
| [05 - Configuration Patterns](../examples/05-universal-context-patterns) | Advanced configuration patterns | ⭐⭐⭐ |
| [06 - Error Handling](../examples/06-error-handling) | Error handling strategies | ⭐⭐⭐ |
| [07 - Performance Monitoring](../examples/07-performance-monitoring) | Metrics and performance | ⭐⭐⭐ |
| [08 - Logging Matrix](../examples/08-logging-matrix) | Dynamic logging configuration | ⭐⭐⭐ |
| [09 - HTTP Configuration](../examples/09-http-configuration) | Basic HTTP instrumentation | ⭐⭐⭐ |

### **🌐 HTTP and Redis (10-19)**

| Example | Description | Complexity |
|---------|-------------|------------|
| [10 - Basic HTTP Correlation](../examples/10-basic-http-correlation) | Correlation IDs in HTTP | ⭐⭐ |
| [11 - Custom Adapter](../examples/11-custom-adapter) | Create custom adapters | ⭐⭐⭐ |
| [12 - HTTP + Redis + Axios](../examples/12-http-redis-axios) | Complete stack with Axios | ⭐⭐⭐ |
| [13 - HTTP + Redis + Fastify](../examples/13-http-redis-fastify) | Complete stack with Fastify | ⭐⭐⭐ |
| [14 - HTTP + Redis + NestJS](../examples/14-http-redis-nestjs) | NestJS integration | ⭐⭐⭐⭐ |
| [15 - HTTP + Redis + Koa](../examples/15-http-redis-koa) | Koa integration | ⭐⭐⭐ |
| [16 - HTTP + Redis + Hapi](../examples/16-http-redis-hapi) | Hapi integration | ⭐⭐⭐ |

### **📨 Message Brokers (20-24)**

| Example | Description | Complexity |
|---------|-------------|------------|
| [20 - Basic Kafka Correlation](../examples/20-basic-kafka-correlation) | Correlation IDs in Kafka | ⭐⭐⭐ |
| [21 - RabbitMQ Broker](../examples/21-basic-rabbitmq-broker) | RabbitMQ integration | ⭐⭐⭐ |
| [22 - NATS Broker](../examples/22-basic-nats-broker) | NATS integration | ⭐⭐⭐ |
| [23 - Kafka Full Stack](../examples/23-kafka-full-stack) | Complete application with Kafka | ⭐⭐⭐⭐ |
| [24 - NATS Full Stack](../examples/24-full-stack-nats) | Complete application with NATS | ⭐⭐⭐⭐ |

## 🎯 Featured Examples

### **🚀 Quick Start**
```bash
# Clone examples
git clone https://github.com/Syntropysoft/SyntropyLog.git
cd SyntropyLog/sub-modules/examples

# Run basic example
cd 01-hello-world
npm install
npm start
```

### **🌐 HTTP Instrumentation**
```bash
# Example with Fastify and Redis
cd 13-http-redis-fastify
docker-compose up -d
npm install
npm start
```

### **📨 Message Brokers**
```bash
# Example with Kafka
cd 23-kafka-full-stack
docker-compose up -d
npm install
npm start
```

## 🏗️ Example Architecture

All examples follow SyntropyLog's **hexagonal architecture**:

```
examples/
├── boilerplate.ts          # Common configuration
├── config.ts              # Specific configuration
├── index.ts               # Main logic
└── adapters/              # Custom adapters (if applicable)
```

## 🎯 Common Patterns

### **1. Boilerplate Configuration**
```typescript
// boilerplate.ts
export async function setupSyntropyLog() {
  const syntropyLog = SyntropyLog.init({
    serviceName: 'example-service',
    logLevel: 'info',
    transports: [new ClassicConsoleTransport()]
  });
  
  return syntropyLog;
}
```

### **2. Graceful Shutdown**
```typescript
// index.ts
process.on('SIGINT', async () => {
  await syntropyLog.shutdown();
  process.exit(0);
});
```

### **3. Context Propagation**
```typescript
const context = syntropyLog.createContext({
  requestId: 'req-123',
  userId: 456
});

context.info('Operation started');
```

## 🚀 Run All Examples

```bash
# Script to run all examples
./test-all-examples.sh

# Run from a specific example
./test-all-examples.sh 10
```

## 📚 Additional Resources

- **[API Reference](../api)** - Complete API documentation
- **[Configuration](../configuration)** - Configuration guides
- **[Architecture](../architecture)** - Design principles
- **[GitHub Repository](https://github.com/Syntropysoft/SyntropyLog)** - Source code

Explore the examples and find the pattern that best fits your use case! 🚀 