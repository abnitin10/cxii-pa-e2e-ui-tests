// global-setup.ts
import type { FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  // Simulate a unique worker ID if needed
  const originalLog = console.log;

  console.log = (...args: unknown[]) => {
    // Use env var or fallback
    const workerId = process.env.TEST_WORKER_INDEX || 'main';
    originalLog(`[Worker ${workerId}]`, ...args);
  };
}
