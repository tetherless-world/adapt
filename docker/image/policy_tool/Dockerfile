FROM ubuntu:bionic
COPY docker/image/docker-entrypoint.sh /
COPY ontologies/*.ttl /ontologies/

FROM tetherlessworld/twks-cli:latest as twks-cli
COPY --from=twks-cli /twks-cli /

RUN apt update
RUN apt install -y curl wget