# base image
FROM python:3.9-slim

# copy & install python requirements
WORKDIR /adapt-api
COPY adapt-api/requirements.txt .
RUN pip install -r requirements.txt

# copy python app
COPY adapt-api .

# copy scripts & ontologies
COPY ontologies/*.ttl /ontologies/

EXPOSE 5000
CMD ["python", "-m", "adapt_api"]