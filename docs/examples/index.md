---
id: examples
title: Examples
sidebar_label: Examples
description: SyntropyLog examples 00–17 — setup, context, transports, HTTP correlation, testing, benchmark. Runnable code in syntropylog-examples.
---

# SyntropyLog Examples

The **source of truth** for the example list is the **[syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples)** repository (see its README). All runnable examples use the current API: `syntropyLog.init({ logger, context })`, `getLogger()`, `getContextManager()`, no `getHttp`/`getBroker`/`getRedis` in core.

## Examples 00–17 (syntropylog-examples)

| # | Folder | What it shows |
|---|--------|----------------|
| **Fundamentals** |
| 00 | `00-setup-initialization` | Init (ready/error), getLogger, shutdown |
| 01 | `01-hello-world` | First log |
| 02–09 | `02-basic-context` … `09-All-transports` | Context, levels, transports, logging matrix |
| **Integration** |
| 10–11 | `10-basic-http-correlation`, `11-axios-interceptors` | HTTP correlation via Axios interceptors |
| 12 | `12-UniversalAdapter` | UniversalAdapter / custom backends |
| **Testing** |
| 13–16 | `13-testing-patterns` … `16-testing-transports-concepts` | Vitest, Jest, serializers, transport concepts |
| **Benchmark** |
| 17 | `17-benchmark` | SyntropyLog vs Pino vs Winston |

Run any example from its folder: `npm install` then `npm run dev` (or the script in that example’s README).

## Testing guides (this site)

Supplementary guides that align with repo examples **13–16**:

- **[Testing overview](./testing-overview)** — Mocks, test helper, SpyTransport.
- **[Testing with Vitest](./testing-patterns-vitest)** — Vitest patterns (repo: `13-testing-patterns`).
- **[Testing with Jest](./testing-patterns-jest)** — Jest patterns (repo: `14-testing-patterns-jest`).
- **[Testing Redis / cache context](./testing-redis-context)** — Context without a built-in Redis mock.
- **[Testing serializers](./testing-serializers)** — Serialization tests (repo: `15-testing-serializers`).
- **[Testing transport concepts](./testing-transports-concepts)** — Transports as spies (repo: `16-testing-transports-concepts`).

## Principles

- **Configure once** — `init()` with logger and context; use `getLogger()` and `getContextManager()` after `ready`.
- **HTTP** — Use your own client (e.g. Axios) and inject correlation via interceptors; see repo examples 10–11.
- **Testing** — Use `syntropylog/testing` (createTestHelper, SpyTransport); runnable tests in repo 13–16.

## Related

- [Getting Started](/docs/getting-started)
- [Configuration](/docs/configuration/)
- [API Reference](/docs/api-reference)
- [Production](/docs/production/)
