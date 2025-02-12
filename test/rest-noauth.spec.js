const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

const c8 = new Camunda8({
    CAMUNDA_TENANT_ID: 'green',
    CAMUNDA_AUTH_STRATEGY: 'NONE'
})

const camunda = c8.getCamundaRestClient()

describe('Unauthenticated REST client', () => {
    test('Cannot get topology', async () => {
        await expect(async () => camunda.getTopology()).rejects.toThrow()
    })

    test('Cannot deploy process', async () =>

    await expect(() => 
        camunda
            .deployResourcesFromFiles(['./resources/process.bpmn'])).rejects.toThrow())
})
