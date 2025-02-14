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
    CAMUNDA_TENANT_ID: '<default>'
})
const zeebe = c8.getZeebeGrpcApiClient()

xdescribe('Invalid credentials gRPC client (default tenant)', () => {
    test('cannot activate jobs', async () => {
        await expect(() => zeebe.activateJobs({
            maxJobsToActivate: 10,
            timeout: 10000,
            type: 'anything',
            worker: 'test',
        })).rejects.toThrow()
    })
})