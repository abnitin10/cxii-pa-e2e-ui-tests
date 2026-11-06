// tests/api/integrations.spec.ts
import { test, expect } from '@playwright/test';
import { GraphQLClient } from '../../modules/Core/graphql.e2e';
import { Integrations } from '../../modules/Core/api/integrations';

test.describe('Integration API Tests', () => {

  test('should test IAS Token Exchange', async ({page}) => {
    let graphqlClient = new GraphQLClient(page);
    let integrations = new Integrations(graphqlClient);
    await integrations.testIASTokenExchange();
  });

  // Add more API test cases here
});