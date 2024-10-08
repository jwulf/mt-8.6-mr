# Get an access token from Keycloak and use it to deploy a process in Zeebe

# Get the access token
ACCESS_TOKEN=$(curl --request POST "http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token" \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'grant_type=client_credentials' \
    --data-urlencode "audience=zeebe.camunda.io" \
    --data-urlencode "client_id=zeebe" \
    --data-urlencode "client_secret=zecret" | jq -r '.access_token')

# Use the access token to deploy the process
curl -L -X POST 'http://localhost:8080/v2/deployments' \
    -H 'Content-Type: multipart/form-data' \
    -H 'Accept: application/json' \
    -F 'resources=@resources/process.bpmn' \
    -F 'tenantId=green' \
    -H "Authorization: Bearer $ACCESS_TOKEN"