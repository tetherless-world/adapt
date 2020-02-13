FROM tetherlessworld/twks-cli:latest as twks-cli

FROM node:12-alpine as build-js
WORKDIR /js
ENV PATH /js/node_modules/.bin:$PATH
COPY js/package.json /js/package.json
RUN npm install
COPY js /js
RUN npm run build

FROM python:3-slim
COPY hello.py /
COPY load-ontologies.sh /
COPY docker/image/docker-entrypoint.sh /policy-docker-entrypoint.sh
COPY ontologies/*.ttl /ontologies/
COPY jetty-app.xml /var/lib/jetty/webapps

RUN mkdir -p /usr/share/man/man1
RUN apt update
RUN apt install -y --no-install-recommends openjdk-11-jre-headless
RUN apt autoremove -y --purge && apt clean -y

COPY --from=twks-cli /twks-cli /
COPY --from=build-js /js/build /policy-tool

EXPOSE 8080
ENTRYPOINT [ "/policy-docker-entrypoint.sh" ]