/**
 * In this scenario, we authenticate the REST client with a valid id and secret to get a bearer token.
 * 
 * We expect this case to succeed.
 */
const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')
const path = require('node:path')

jest.setTimeout(15000)

// Load credentials from .env
config()

const c8 = new Camunda8({
    CAMUNDA_TENANT_ID: '<default>',
    CAMUNDA_TOKEN_DISK_CACHE_DISABLE: true
})

const restClientAuthed = c8.getCamundaRestClient()

describe('Authenticated REST client (default tenant)', () => {
    test('can activate jobs', async () => {
        const res = await restClientAuthed.activateJobs({
            maxJobsToActivate: 10,
            timeout: 30000,
            type: 'anything',
            worker: 'test',
        })
        expect(Array.isArray(res)).toBe(true)
    })
})
