FROM tetherlessworld/twks-cli:latest as twks-cli
FROM openjdk:11-jre-slim-buster
COPY docker/image/docker-entrypoint.sh /
COPY ontologies/*.ttl /ontologies/
COPY ontologies/*.trig /ontologies/

COPY --from=twks-cli /twks-cli /