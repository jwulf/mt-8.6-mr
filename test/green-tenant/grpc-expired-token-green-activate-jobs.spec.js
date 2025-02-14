const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

jest.setTimeout(15000)

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJWOGFfUlB2R1pWNjVQLXZ5VXhBd2tSSXlrUzNfbkZxMTRGdjJwOUdsSEtJIn0'

// Suppress logging
process.env.ZEEBE_CLIENT_LOG_LEVEL = 'NONE'

const c8 = new Camunda8({
    CAMUNDA_AUTH_STRATEGY: 'BEARER',
    CAMUNDA_OAUTH_TOKEN: token,
    CAMUNDA_TOKEN_DISK_CACHE_DISABLE: true,
    CAMUNDA_TENANT_ID: 'green',
})
const zeebe = c8.getZeebeGrpcApiClient()

xdescribe('Expired token gRPC client (green tenant)', () => {
    test('cannot activate jobs', async () => {
       await expect(() => zeebe.activateJobs({
            maxJobsToActivate: 10,
            timeout: 10000,
            type: 'anything',
            worker: 'test',      
        })).rejects.toThrow()
    })
})
  