const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')
const path = require('node:path')

// Load credentials from .env
config()

const c8 = new Camunda8({
    CAMUNDA_TENANT_ID: 'green',
})

const restClientAuthed = c8.getCamundaRestClient()

describe('Authenticated REST client', () => {
    test('can get topology', async () => {
        const res = await restClientAuthed.getTopology()
        expect(res).toHaveProperty('gatewayVersion')
    })

    test('can deploy process', async () => {
        const res = await restClientAuthed
            .deployResourcesFromFiles([path.join('.', 'resources', 'process.bpmn')])
        expect(res.deployments.length).toBe(1)
    })
})
