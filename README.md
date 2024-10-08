# Multi-tenant deploy over REST API

A minimal reproducer for a multi-tenancy issue in Camunda 8.6.0.

The scenario is this: 

* Deploy process to tenant 'green'

Outcome: 

Succeeds on gRPC API, fails on REST API with 401 using the same client credentials.

## Setup

Start Self-Managed Camunda 8 using docker-compose: 
```
cd docker
docker compose up -d
```

To demonstrate the gRPC API: 

* Install dependencies: `npm i`
* Run `node grpc.js`

Output: 

```
{
  deployments: [ { process: [Object], Metadata: 'process' } ],
  key: '2251799813695920',
  tenantId: 'green'
}
```

Succeeds. Credentials used are in `.env`. Client id is `zeebe`, client secret is `zecret`.

To demonstrate the REST API:

* Run `bash rest.sh`

Output: 

```
{"type":"about:blank","title":"UNAUTHORIZED","status":401,"detail":"Expected to handle request Deploy Resources with tenant identifier 'green', but tenant is not authorized to perform this request","instance":"/v2/deployments"}    
```

Fails. Credentials used are in `rest.sh`. Client id is `zeebe`, client secret is `zecret`.