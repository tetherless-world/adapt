#!/bin/sh

# wait for blazegraph to be up
sleep 10

# load ontologies
cd /ontologies/
curl -X POST -H 'Content-Type:application/x-turtle' --data-binary '@healthcare.ttl' http://blazegraph:8080/blazegraph/sparql

# keeps the container running temporarily
while true; do sleep 1000; done