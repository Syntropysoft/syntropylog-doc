# Graceful Shutdown

Graceful shutdown is **mandatory** for all applications (development and production) so that pending logs are flushed and resources released when the process stops.

## Why it matters

Without handling SIGTERM/SIGINT and calling `syntropyLog.shutdown()`:

- **Lost logs** — Entries still in the pipeline may never be written.
- **Unclean exit** — Transports may not flush or close.
- **Kubernetes/containers** — The process can be killed before cleanup if shutdown is not handled.

## Required pattern

1. Subscribe to `ready` and `error` **before** calling `init()`.
2. Call `init(config)` and wait for `ready` (or handle `error`).
3. On process exit (SIGTERM, SIGINT, or application shutdown), call `await syntropyLog.shutdown()` and then exit.

## Boilerplate

```typescript
import { syntropyLog } from 'syntropylog';

export async function initializeSyntropyLog(config) {
  return new Promise((resolve, reject) => {
    syntropyLog.on('ready', () => resolve());
    syntropyLog.on('error', (err) => reject(err));
    syntropyLog.init(config);
  });
}

export async function gracefulShutdown() {
  try {
    await syntropyLog.shutdown();
  } catch (err) {
    console.error('Shutdown error:', err);
  }
}

process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exit(0);
});
```

## What shutdown does

- **Flushes transports** — Pending log entries are written before the process exits.
- **Releases resources** — Transports and internal state are cleaned up.
- **Ordered exit** — Avoids losing logs or leaving connections open.

## Usage

Initialize at startup and let the signal handlers call `gracefulShutdown()` when the process receives SIGTERM or SIGINT (e.g. Ctrl+C or Kubernetes termination). No need to call `gracefulShutdown()` manually unless you have a custom exit path.

## Testing

```bash
# Development: press Ctrl+C and confirm you see shutdown messages and logs flushed
# Production: send SIGTERM
kill -TERM <pid>
```

## See also

- [Boilerplate (API Reference)](/docs/api-reference/boilerplate)
- [syntropylog-examples](https://github.com/Syntropysoft/syntropylog-examples) (00-setup-initialization, etc.)
