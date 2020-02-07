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

From the host machine, you can then access the triple store interface at http://localhost:9999/blazegraph and the SPARQL endpoint at http://localhost:9999/blazegraph/sparql

From inside the containers, you can then access the triple store interface at http://blazegraph:8080/blazegraph and the SPARQL endpoint at http://blazegraph:8080/blazegraph/sparql

OBS: Make sure to replace localhost with the appropriate docker-machine IP, if you system needs that (Windows, MacOS).
