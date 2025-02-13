/**
 * In this scenario, we pass invalid credentials to the token endpoint. 
 * 
 * We expect this case to fail, and it will fail at the point of attempting to get a token, so the actual method endpoint is never addressed.
 */
const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')
const path = require('node:path')

// Load credentials from .env
config()

jest.setTimeout(15000)

const c8 = new Camunda8({
    CAMUNDA_TENANT_ID: '<default>',
    ZEEBE_CLIENT_ID: 'invalid',
    ZEEBE_CLIENT_SECRET: 'invalid',
    CAMUNDA_TOKEN_DISK_CACHE_DISABLE: true
})

const restClientInvalidCreds = c8.getCamundaRestClient()

describe('Invalid credentials REST client (default tenant)', () => {
    test('cannot get topology', async () => {
        await expect(() => restClientInvalidCreds.getTopology()).rejects.toThrow()
    })
})