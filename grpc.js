const { Camunda8 } = require('@camunda8/sdk')
const { config } = require('dotenv')

// Load credentials from .env
config()

const c8 = new Camunda8({})
const zeebe = c8.getZeebeGrpcApiClient()

zeebe.deployResource({processFilename: './resources/process.bpmn', tenantId: 'green'}).then(console.log)
