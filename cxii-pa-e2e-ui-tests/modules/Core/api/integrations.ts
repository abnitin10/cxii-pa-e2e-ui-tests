import { expect } from '@playwright/test';
import { GraphQLClient } from '../graphql.e2e';

export class Integrations {
    private readonly client: GraphQLClient;

    constructor(client: GraphQLClient) {
        this.client = client;
    }

    async testIntegrationAPIs(): Promise<void> {
        console.log('Starting Integration API Tests...');
        await this.testIASTokenExchange();
        console.log('Completed Integration API Tests.');
    }

    async testIASTokenExchange(): Promise<void> {
        console.log('Testing IAS Token Exchange...');
        const query = `
            {
                testIASTokenExchange
            }
        `;
        const data = await this.client.sendRequest(query);
        expect(data).toHaveProperty('testIASTokenExchange');
        expect(data.testIASTokenExchange).toBe(true);
        console.log('IAS Token Exchange Test Passed.');
    }

    // Add more integration-related GraphQL queries here
}