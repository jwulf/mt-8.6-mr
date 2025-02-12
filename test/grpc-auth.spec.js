const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

const c8 = new Camunda8()
const zeebe = c8.getZeebeGrpcApiClient()

describe('Authenticated gRPC client', () => {
    test('Can deploy process', async () => {
        const res = await zeebe
            .deployResource({
            processFilename: './resources/process.bpmn', 
            tenantId: 'green'
            })
        expect(res.deployments.length).toBe(1)
    })
})
