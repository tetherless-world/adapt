# base image
FROM python:3-slim

# copy python app
WORKDIR /policy-tool-backend
COPY policy-tool-backend /policy-tool-backend

# install requirements
RUN pip install -r requirements.txt

# copy scripts & ontologies
COPY docker/image/docker-entrypoint.sh /policy-docker-entrypoint.sh

EXPOSE 5000
ENTRYPOINT [ "/policy-docker-entrypoint.sh" ]