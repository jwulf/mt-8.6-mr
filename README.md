# REST API Security reproducer on 8.7.0-alpha4

A minimal reproducer for an API security configuration issue in Camunda 8.7.0-alpha4.

## Background

This came up while addressing a customer support issue ([SUPPORT-25519](https://jira.camunda.com/browse/SUPPORT-25519)). Unauthenticated workers were not backing off and their polling caused denial-of-service of the gateway. 

In implementing a backoff on UNAUTHENTICATED, I needed to create a test case that creates the backpressure signal of UNAUTHENTICATED when the worker is not authorized.

There are three cases in which this can happen: 

1. When the client has authentication disabled.
2. When the client has misconfigured credentials that do not authenticate.
3. When the client passes an expired or invalid token as the authorization header.

(Note: There is a fourth case, when the credentials are for a client without access to the ActivateJobs API. I have not done this case yet, because I cannot get these ones to work yet.)

I use Docker Compose for local development and testing and testing in CI for the Node.js SDK. In developing the test cases for both the gRPC and the REST API job workers, I have not been able to configure the platform to secure the APIs in a consistent and understood manner. 


## The Issues

* The gRPC API does not reject `ActivateJobs` when passed no authorization header or an invalid token. See [this Slack thread](https://camunda.slack.com/archives/CSQ2E3BT4/p1739400483444909)
* The REST API is not secured correctly, and it is unclear how to do this.

## Setup

* Install dependencies: `npm i`

## Docker Configurations

There are two docker compose configurations. 

One is `docker/docker-compose-multitenancy-rest-no-auth.yaml`. This is the long-standing configuration file used for testing the Node.js SDK, particularly the gRPC API. The gRPC API is secured in this configuration, but it has issues with the security of the REST API - particularly that it ignores authorization headers and allows access to the REST API. This can be started with `./start-no-auth.yaml`.

The other is `docker/docker-compose-multitenancy-rest-auth.yaml`. This one contains the changes noted in [this Slack thread](https://camunda.slack.com/archives/C06UKS51QV9/p1728566872581979?thread_ts=1728049950.299819&cid=C06UKS51QV9). You can see the difference on lines 36-40 of [the file](docker/docker-compose-multitenancy-rest-auth.yaml#L33). It is an attempt to secure the REST API, but it does not function as expected. This one can be started with `./start-auth.sh`.

Either configuration can be brought down with `./stop.sh`. Note that this script will prompt you for permission to prune docker volumes that are not owned by a running container. You can say No to this if you have volumes that you need to keep, in which case you will need to clean up the volumes yourself.

## The Test Matrix

The tests are a matrix of: 

* Two APIs: REST and gRPC
* Two Tenants: `<default>` and `green`
* Three methods: `topology`, `activateJobs`, `deployResources`
* Four scenarios: 
    - Authorized (`auth`)
    - No Authorization header passed (`no-auth`)
    - Expired token passed as Authorization header (`expired-token`)
    - Invalid credentials (`invalid-credentials`)

This gives us 48 tests in total - 24 for the REST API, 24 for the gRPC API.

Note: 6 tests are disabled 

## Demonstrating the issue - "Control group"

1. Run `./stop.sh` to stop any running instance of the platform and clean up the volumes.
1. Start the platform with `./start-noauth.sh`. This starts a profile that secures the gRPC API, but not the REST API.
1. Run `npm run grpc`. This will run all the tests on the gRPC API.

**Expected behaviour:**

18 tests pass: methods are allowed if valid authorization is present, and denied otherwise.

**Actual behaviour:**

All tests pass.

**Analysis**

The gRPC API is secured as expected.

### Cannot secure REST API (`no-auth` profile)

See [this Slack thread](https://camunda.slack.com/archives/C06UKS51QV9/p1728566872581979?thread_ts=1728049950.299819&cid=C06UKS51QV9).

I cannot get the REST API to be secured in the same way as the gRPC API. 

1. Run `./stop.sh` to stop any running instance of the platform and clean up the volumes.
1. Start the platform with `./start-noauth.sh`. This starts a profile that secures the gRPC API, but not the REST API.
1. Run `npm run rest`. This will run all tests on the REST API. 

**Expected behaviour:**

All tests pass.

**Actual behaviour:**

15 tests pass
9 fail

**Analysis** 

* Activating jobs with no authorization header succeeds on both tenants (2 tests). This is similar to the behaviour of the gRPC API, but I would expect these calls to fail. 
* Deploying a process on the `green` tenant fails with authorization (1 test). This should succeed. 
* At the same time, deploying a process on the `default` tenant _without_ authorization and with an expired token succeeds (2 tests). These should fail. 
* Requesting the topology without authorization or with an expired token succeeds (4 tests). These should fail.

It looks like the `default` tenant is unsecured and the `green` tenant is inaccessible - but `ActivateJobs` does not fail on the `green` tenant, so it is unclear what the actual situation is.

### Cannot secure REST API (`auth` profile)

See [this Slack thread](https://camunda.slack.com/archives/C06UKS51QV9/p1728566872581979?thread_ts=1728049950.299819&cid=C06UKS51QV9).

1. Run `./stop.sh` to stop any running instance of the platform and clean up the volumes.
1. Start the platform with `./start-auth.sh`. This starts a profile that secures the gRPC API, and should secure the REST API.
1. Run `npm run grpc`. This will run all tests on the gRPC API. 

**Expected behaviour:**

All tests pass.

**Actual behaviour:**

All tests pass

**Analysis**

No difference from the other profile. This demonstrates that the configuration changes have no impact on the gRPC API.

Now: 

1. Run `npm run rest`. This will run all tests on the REST API.

**Expected behaviour:**

All tests pass.

**Actual behaviour:**

18 tests pass
6 fail

**Analysis**

* All tests with valid auth now fail with `401 (Unauthorized)` with further detail `invalid issuer url`.
* The calls to `ActivateJobs` with invalid credentials now fail on both tenants. However, so do the valid ones. 

**8.6 on SaaS**

If you set the credentials for an 8.6 cluster on Camunda SaaS and run `npm run rest+tenant-default`, all tests pass. 

## Conclusions

It's difficult for me to derive a theory about the internals based on these results. 

The REST API in the first profile seems to be unsecured on the `<default>` tenand and inaccessible on the `green` tenant - except that `ActivateJobs` returns something on the `green` tenant. 

In the second profile, the REST API is totally inaccessible, even with valid authorization. And it demonstrates that the `ActivateJobs` endpoint can reject. Why does it not reject in the first profile then - particularly in the case of the `green` tenant, which otherwise rejects even authed requests?
