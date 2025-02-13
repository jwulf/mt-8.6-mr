/**
 * In this scenario, we pass invalid credentials to the token endpoint. 
 * 
 * We expect this case to fail, and it will fail at the point of attempting to get a token, so the actual method endpoint is never addressed.
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
    ZEEBE_CLIENT_ID: 'invalid',
    ZEEBE_CLIENT_SECRET: 'invalid',
    CAMUNDA_TENANT_ID: 'green',
})
const zeebe = c8.getZeebeGrpcApiClient()

describe('Invalid credentials gRPC client (green tenant)', () => {
    test('cannot get topology', async () =>
        await expect(async () => zeebe.getTopology()).rejects.toThrow())
})