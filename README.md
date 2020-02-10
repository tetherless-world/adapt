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

From the host machine, the TWKS store is available at http://localhost:8080.

From inside the container, the TWKS store is available at http://twks-server:8080.

Please follow the TWKS documentation at  on how to access its API https://twks.readthedocs.io/en/latest/server-api.html

The TWKS command-line interface is also available from inside the `policy_tool` container. Please refer to the `docker-entrypoint.sh` file and also the `twks-cli` documentation at https://twks.readthedocs.io/

OBS: Make sure to replace localhost with the appropriate docker-machine IP, if you system needs that (Windows, MacOS).
