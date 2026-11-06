// runTest.ts
export async function runTest(ModuleClass: any, methodName: string, testName: string, data: any, page: any, testInfo: unknown) {
    console.log(`Executing test: ${testName} with data:`, data);
    const moduleInstance = new ModuleClass(page);

    const functionName = methodName;

    if (typeof moduleInstance[functionName] === 'function') {
        await moduleInstance[functionName](data);
        console.log(`Test completed: ${testName}`);
    } else {
        console.error(`Method ${functionName} not found in ${moduleInstance.constructor.name}`);
    }
}
