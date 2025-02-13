/**
 * In this scenario, we turn off authentication in the client. Methods are called without an authorization token.
 * 
 * We expect this case to fail if the gateway is configured to require authentication.
 */
const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

jest.setTimeout(15000)

// Load credentials from .env
config()

const c8 = new Camunda8({
    CAMUNDA_TENANT_ID: '<default>',
    CAMUNDA_AUTH_STRATEGY: 'NONE',
    CAMUNDA_TOKEN_DISK_CACHE_DISABLE: true
})

const camunda = c8.getCamundaRestClient()

describe('Unauthenticated REST client (default tenant)', () => {
    test('cannot deploy process', async () =>
        await expect(() =>
            camunda
                .deployResourcesFromFiles(['./resources/process.bpmn'])).rejects.toThrow())
})
