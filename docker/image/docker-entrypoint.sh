#!/bin/sh

# wait for blazegraph to be up
sleep 30

# load ontologies
cd /ontologies/

cat policy.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &
cat healthcare.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &

# keeps the container running temporarily
while true; do sleep 1000; done