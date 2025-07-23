---
sidebar_position: 1
---

# SyntropyLog

**The Observability Framework for High-Performance Teams**

SyntropyLog is a complete observability framework for Node.js that provides structured logging, automatic correlation, and distributed instrumentation with **zero boilerplate**.

## 🚀 Key Features

### **🔄 Framework Agnostic**
Works seamlessly with Express, Fastify, Koa, NestJS, and any Node.js application. No vendor lock-in, no framework dependencies.

### **🔗 Automatic Correlation**
Distributed tracing with automatic correlation IDs across services, HTTP calls, and message brokers. Zero configuration required.

### **🎯 Zero Boilerplate**
Get started in 30 seconds with automatic context propagation and structured logging. Focus on your business logic, not observability setup.

### **🛡️ Security First**
Built-in data masking, secure configurations, and compliance-ready logging. Protect sensitive data automatically.

### **⚡ High Performance**
Optimized for production with minimal overhead and intelligent log scoping. 45,000+ ops/sec with less than 1ms latency.

## 📊 Test Coverage

- **94.1% test coverage**
- **Comprehensive examples**
- **Battle-tested in production environments**
- **Built for high-performance teams**

## 🏗️ Architecture

SyntropyLog follows a **hexagonal architecture** that keeps the core library broker-agnostic, while all adapters are implemented externally.

```typescript
// Basic example
import { SyntropyLog } from '@syntropylog/core';

const syntropyLog = SyntropyLog.init({
  serviceName: 'my-service',
  logLevel: 'info',
  transports: [new ClassicConsoleTransport()]
});

// Automatic logging with context
syntropyLog.info('User logged in', { userId: 123 });
```

## 🎯 Use Cases

- **Microservices**: Automatic correlation between services
- **REST/GraphQL APIs**: Automatic HTTP instrumentation
- **Message Brokers**: Kafka, RabbitMQ, NATS with observability
- **Serverless**: Context propagation in functions
- **Monoliths**: Structured logging and correlation

## 🚀 Get Started

```bash
npm install @syntropylog/core
```

Check out the [quick start guide](./getting-started) to begin in 30 seconds.
