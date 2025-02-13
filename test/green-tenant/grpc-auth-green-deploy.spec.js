/**
 * In this scenario, we authenticate the REST client with a valid id and secret to get a bearer token.
 * 
 * We expect this case to succeed.
 */
const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

jest.setTimeout(15000)

// Suppress logging
process.env.ZEEBE_CLIENT_LOG_LEVEL = 'NONE'

const c8 = new Camunda8({
    CAMUNDA_TOKEN_DISK_CACHE_DISABLE: true,
    CAMUNDA_TENANT_ID: 'green',
})
const zeebe = c8.getZeebeGrpcApiClient()

describe('Authenticated gRPC client (green tenant)', () => {
    test('can deploy process', async () => {
        const res = await zeebe
            .deployResource({
            processFilename: './resources/process.bpmn', 
            tenantId: 'green'
            })
        expect(res.deployments.length).toBe(1)
    })
})
