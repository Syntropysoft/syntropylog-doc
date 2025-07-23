---
id: examples
title: Examples
sidebar_label: Examples
description: Complete examples demonstrating SyntropyLog features
---

# SyntropyLog Examples

Complete examples demonstrating SyntropyLog features and best practices.

## Testing Examples

### **✅ Complete & Tested**

- **[Example 28: Testing patterns with Vitest](./28-testing-patterns-vitest)** - Declarative testing with Vitest and SyntropyLogMock
- **[Example 29: Testing patterns with Jest](./29-testing-patterns-jest)** - Declarative testing with Jest and SyntropyLogMock
- **[Example 30: Testing Redis context patterns](./30-testing-redis-context)** - Testing Redis context with BeaconRedisMock

### **🚧 Coming Soon**

- **[Example 31: Advanced testing scenarios](./31-advanced-testing)** - Complex testing patterns and scenarios

## Core Framework Examples

### **✅ Complete & Tested (00-13, 20-24)**

- **00-09**: Core Framework Features - Basic setup, context, configuration
- **10-13**: HTTP & Redis Integration - Framework agnosticism (Express, Fastify)
- **20-24**: Message Brokers - Kafka, RabbitMQ, NATS with correlation

### **🚧 In Development (14-19, 25-27)**

- **14-19**: Advanced Framework Features - NestJS, Koa, Hapi, custom serializers
- **25-27**: Enterprise Patterns - Production configuration, advanced context

## Getting Started

Start with the testing examples to understand how to write clean, declarative tests:

1. **[Example 28: Vitest Testing](./28-testing-patterns-vitest)** - Learn zero boilerplate testing
2. **[Example 29: Jest Testing](./29-testing-patterns-jest)** - Apply the same patterns with Jest
3. **[Example 30: Redis Context](./30-testing-redis-context)** - Test Redis operations without external dependencies

## Key Principles

- **Test behavior, not implementation** - Focus on what your code produces
- **Use mocks for external dependencies** - No Redis, brokers, or HTTP servers needed
- **Keep tests simple and readable** - Tests should read like specifications
- **Zero boilerplate** - No initialization or shutdown in tests

## Related Documentation

- **[Getting Started](../getting-started)** - Complete setup guide
- **[Configuration Guide](../configuration)** - Configuration options
- **[API Reference](../api-reference)** - Full API documentation
- **[Production Guide](../production)** - Production deployment 