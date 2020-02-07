# Policy tool

Requirements
1. docker (https://docs.docker.com/install/)
2. docker-compose (https://docs.docker.com/compose/install/)

Clone the repo
```
git clone https://github.com/hansidm/policy_tool.git
```

Build and start the containers
```
cd policy_tool/docker/compose/split/
docker-compose up --build
```

You can then access the triple store endpoint interface at http://localhost:9999/blazegraph

The SPARQL endpoint is available at http://localhost:9999/blazegraph/sparql

OBS: Make sure to replace localhost with the appropriate docker-machine IP, if you system needs that (Windows, MacOS).
