docker-compose -f docker/docker-compose-multitenancy-rest-no-auth.yaml down
docker volume prune -f
docker volume rm docker_zeebe
docker volume rm docker_elastic
docker volume rm docker_keycloak-theme
docker volume rm docker_postgres