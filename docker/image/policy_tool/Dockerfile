FROM ubuntu:bionic
COPY docker/image/docker-entrypoint.sh /
COPY ontologies/*.ttl /ontologies/

RUN apt update
RUN apt install -y curl wget