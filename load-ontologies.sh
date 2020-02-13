#!/bin/sh

# wait for twks-server to be up
sleep 30

# load ontologies
cat /ontologies/policy.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &
cat /ontologies/healthcare.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &
cat /ontologies/healthcare-policy.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &
cat /ontologies/dsa.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &
cat /ontologies/dsa-policy.ttl | /twks-cli -Dtwks.serverBaseUrl=http://twks-server:8080 put-nanopublications --lang turtle - &