# base image
FROM python:3.9-slim

# copy & install python requirements
WORKDIR /policy-tool-backend
COPY policy-tool-backend/requirements.txt /policy-tool-backend
RUN pip install -r requirements.txt

# copy python app
COPY policy-tool-backend /policy-tool-backend

# copy scripts & ontologies
COPY docker/image/backend-entrypoint.sh /backend-entrypoint.sh
COPY ontologies/*.ttl /ontologies/

EXPOSE 5000
ENTRYPOINT [ "/backend-entrypoint.sh" ]