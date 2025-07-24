---
id: examples
title: Examples
sidebar_label: Examples
description: Complete examples demonstrating SyntropyLog features
---

# SyntropyLog Examples

Complete examples demonstrating SyntropyLog features and best practices.

> **📦 Version**: This documentation corresponds to **SyntropyLog v0.6.16**

## Testing Overview

**[Testing Overview](./testing-overview)** - Comprehensive guide to testing with SyntropyLog, including framework-agnostic mocks, spy function injection, and best practices.

## Testing Examples

### **✅ Complete & Tested (28-32)**

- **[Example 28: Testing patterns with Vitest](./testing-patterns-vitest)** - Declarative testing with Vitest and SyntropyLogMock
- **[Example 29: Testing patterns with Jest](./testing-patterns-jest)** - Declarative testing with Jest and SyntropyLogMock
- **[Example 30: Testing Redis context patterns](./testing-redis-context)** - Testing Redis context with BeaconRedisMock
- **[Example 31: Testing serializers](./testing-serializers)** - Testing custom serialization logic with MockSerializerRegistry
- **[Example 32: Testing transport concepts](./testing-transports-concepts)** - Understanding transports as spies and testing patterns

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

1. **[Example 28: Vitest Testing](./testing-patterns-vitest)** - Learn zero boilerplate testing
2. **[Example 29: Jest Testing](./testing-patterns-jest)** - Apply the same patterns with Jest
3. **[Example 30: Redis Context](./testing-redis-context)** - Test Redis operations without external dependencies
4. **[Example 31: Serializers Testing](./testing-serializers)** - Test custom serialization logic
5. **[Example 32: Transport Concepts](./testing-transports-concepts)** - Understand transports as spies

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