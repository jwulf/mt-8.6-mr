# REST API Security reproducer on 8.7.0-alpha4

A minimal reproducer for a REST API security configuration issue in Camunda 8.7.0-alpha4.

The scenario is this: 


## Setup

* Install dependencies: `npm i`

## Run Reproducer

There are two docker compose configurations. The only difference between the two. 

Start Self-Managed Camunda 8 using docker-compose: 

```
./start-auth.sh
```

To demonstrate the behaviour of the gRPC and REST APIs: 
]
* Run `npm test`
