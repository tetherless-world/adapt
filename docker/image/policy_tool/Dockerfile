# get twks-cli image
FROM tetherlessworld/twks-cli:latest as twks-cli

# base image
FROM python:3-slim

# install openjdk jre
RUN mkdir -p /usr/share/man/man1
RUN apt update
RUN apt install -y --no-install-recommends openjdk-11-jre-headless
RUN apt autoremove -y --purge && apt clean -y

# copy scripts & ontologies
COPY load-ontologies.sh /
COPY docker/image/docker-entrypoint.sh /policy-docker-entrypoint.sh
COPY ontologies/*.ttl /ontologies/

# copy python app
COPY policy-tool_web /policy-tool_web

# install requirements
WORKDIR /policy-tool_web
RUN pip install -r requirements.txt

# copy twks-cli binary & compiled react
COPY --from=twks-cli /twks-cli /
COPY --from=build-js /js/build /policy-tool_web/static

EXPOSE 5000
ENTRYPOINT [ "/policy-docker-entrypoint.sh" ]