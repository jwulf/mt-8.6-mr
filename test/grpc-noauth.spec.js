const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

// Suppress logging
process.env.ZEEBE_CLIENT_LOG_LEVEL = 'NONE'

const c8 = new Camunda8({
    CAMUNDA_AUTH_STRATEGY: 'NONE',
})
const zeebe = c8.getZeebeGrpcApiClient()

describe('Unauthenticated gRPC client', () => {
    test('cannot get topology', async () => 
        await expect(async () => zeebe.getTopology()).rejects.toThrow())

    test('Cannot deploy process', async () => {
        await expect(async () => zeebe
            .deployResource({
            processFilename: './resources/process.bpmn', 
            tenantId: 'green'
            })
        ).rejects.toThrow()
    })
})
  