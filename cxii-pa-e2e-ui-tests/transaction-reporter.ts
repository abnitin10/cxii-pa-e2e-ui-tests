import { randomUUID } from "crypto";
import type { Reporter, TestCase } from "@playwright/test/reporter";

export default class TransactionReporter implements Reporter {
  onTestBegin(test: TestCase) {
    // Only take the last part (actual test title)
    const titleParts = test.titlePath();
    const testCaseId = titleParts[titleParts.length - 1];
    const txId = randomUUID();

    // Store prefix in test object
    (test as any)._txPrefix = `${testCaseId} : ${txId} ==>`;

    console.log(`${(test as any)._txPrefix} 🚀 Test started`);
  }

  onStdOut(chunk: string | Buffer, test?: TestCase) {
    if (test && (test as any)._txPrefix) {
      process.stdout.write(`${(test as any)._txPrefix}`);
    } else {
      process.stdout.write(chunk);
    }
  }

  onTestEnd(test: TestCase, result: any) {
    console.log(
      `${(test as any)._txPrefix} ✅ Test finished with status: ${result.status}`
    );
  }
}
