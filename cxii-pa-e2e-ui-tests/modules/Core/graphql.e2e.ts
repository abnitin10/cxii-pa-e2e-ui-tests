import { Page } from '@playwright/test';
import { E2E_API_BASE_URL } from '@env';


/**
 * GraphQL Client to send requests to the Backend API
 */
export class GraphQLClient {
    private readonly page: Page;
    private accessToken: string|null = null;

    /**
     * Create a new GraphQL client
     * @param page The Playwright page, where a login had been performed
     **/
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Retrieve the access token from the API
     * It requires that a login had been performed on the page.
     * 
     * @returns The access token
     * @throws Error if the access token cannot be retrieved
     * */
    private async getAccessToken(): Promise<string> {
        if (this.accessToken) {
            return this.accessToken;
        }
    
        const cookies = await this.page.context().cookies();
        const rtCookie = cookies.find(cookie => cookie.name === 'rt');
        const rtValue = rtCookie ? rtCookie.value : '';
        if (!rtValue) {
            throw new Error('rt cookie not found');
        }
    
        try {
            console.log('Requesting access token from url:', `${E2E_API_BASE_URL}/token`);
            const response = await this.page.request.post(`${E2E_API_BASE_URL}/token`, {
                headers: {
                    'Cookie': `rt=${rtValue}`,
                    'X-Csrf-Protection': '1',
                }
            });
    
            if (response.ok()) {
                const { accessToken } = await response.json();
                this.accessToken = accessToken;
                return accessToken;
            } else {
                const errorMessage = `Failed to retrieve access token. Status: ${response.status()}. Body: ${await response.text()}`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw new Error(`Error retrieving access token: ${error.message}`);
        }
    }

    /**
     * Send a GraphQL request to the Backend API
     * It will automatically add the access token to the request headers. It requires that a login had been performed on the page.
     * 
     * @param query The GraphQL query
     * @param variables Optional variables to pass to the query
     * @returns The response data
     * @throws Error if the request fails
     **/
    async sendRequest(query: string, variables?: Record<string, any>): Promise<any> {
        const accessToken = await this.getAccessToken();
        try {    
            const response = await this.page.request.post(`${E2E_API_BASE_URL}/query`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    query,
                    variables
                }
            });
    
            if (response.ok()) {
                const { data } = await response.json();
                if (!data) {
                    const traceId = response.headers()['x-trace-id'];
                    console.error('Response headers:', response.headers());
                    throw new Error(`Response data is null or undefined. Trace ID: ${traceId}`);
                }
                return data;
            } else {
                console.error('Response headers:', response.headers());
                console.error('Response body:', await response.text());
                throw new Error(`GraphQL request failed with status: ${response.status()}`);
            }
        } catch (error) {
            throw error;
        }
    }

    // Add more integration-related GraphQL queries here
}